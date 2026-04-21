"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useAuth, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Download, Loader2, Lock, CheckCircle, Sparkles, Coins, FileArchive } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatBytes } from "@/lib/utils"
import { track as vercelTrack } from "@vercel/analytics"
import { useToast } from "@/components/ui/use-toast"
import { DownloadProgress } from "@/components/ui/download-progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

type ButtonSize = "sm" | "default" | "lg"
type ButtonVariant = "default" | "outline" | "ghost" | "premium"

interface DownloadButtonProps {
  storeId: string
  productId: string
  /** Slug (or ID as fallback) used to redirect to the product page when access is denied after auto-login */
  productSlug?: string
  disabled?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  fileNameOverride?: string
  timeoutMs?: number
  onSuccess?: (info: { fileName: string; bytes: number }) => void
  onError?: (message: string) => void
  gaEventName?: string
  iconOnly?: boolean
  className?: string
  customText?: string
  customIcon?: React.ComponentType<{ className?: string }>
  /** Shown in the confirmation dialog */
  productName?: string
  /** Credits cost — 0 means free */
  creditCost?: number
  /** File size in bytes — shown in the confirmation dialog */
  fileSizeBytes?: number
}

// Get the base admin URL without any API path
const getAdminBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_DOWNLOAD_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
  // Extract just the domain, removing any /api/... path
  const match = url.match(/^(https?:\/\/[^/]+)/)
  return match ? match[1] : url
}
const ADMIN_BASE_URL = getAdminBaseUrl()
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO || ""
const GA_EVENT_DEFAULT = "download_complete"

export const DownloadButton = ({
  storeId,
  productId,
  productSlug,
  disabled = false,
  size = "sm",
  variant = "default",
  fileNameOverride,
  timeoutMs = 30_0000,
  onSuccess,
  onError,
  gaEventName = GA_EVENT_DEFAULT,
  iconOnly = false,
  className,
  customText,
  customIcon,
  productName,
  creditCost,
  fileSizeBytes,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [insufficientCredits, setInsufficientCredits] = useState<{
    required: number
    balance: number
    missing: number
  } | null>(null)
  const { getToken, isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  const router = useRouter()
  const { toast } = useToast()
  const objectUrlRef = useRef<string | null>(null)

  // Progress state
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Tracks whether this render is an auto-triggered post-login download
  const autoDownloadCheckedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // ── analytics helpers ─────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ga = (name: string, params?: Record<string, any>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).gtag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (window as any).gtag("event", name, {
          event_category: "download",
          event_label: productId,
          store_id: storeId,
          ...params,
        })
      }
    } catch { }
  }

  const adsConversion = (value?: number) => {
    if (!ADS_SEND_TO) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).gtag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ; (window as any).gtag("event", "conversion", {
          send_to: ADS_SEND_TO,
          value: value ?? 1,
          currency: "USD",
          items: [{ item_id: productId, item_category: "digital_asset" }],
        })
      }
    } catch { }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vTrack = (name: string, props?: Record<string, any>) => {
    try {
      vercelTrack?.(name, props)
    } catch { }
  }

  const extractFileName = (cdHeader: string | null, fallback: string) => {
    if (fileNameOverride) return fileNameOverride

    // Extract file extension from the server's Content-Disposition header
    let ext = ""
    if (cdHeader) {
      const starMatch = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cdHeader)
      const plainMatch = /filename\s*=\s*"?([^";]+)"?/i.exec(cdHeader)
      let raw = starMatch?.[1] ?? plainMatch?.[1] ?? ""
      try { raw = decodeURIComponent(raw) } catch { }
      const serverFile = (raw.split(/[\\/]/).pop() || "").replace(/[^\w.\-()\[\]\s]+/g, "_")
      const dotIdx = serverFile.lastIndexOf(".")
      if (dotIdx > 0) ext = serverFile.slice(dotIdx)
    }

    // Build name from slug: strip trailing ID-like segment (8+ alphanumeric chars), append -mockup
    const base = productSlug ?? fallback
    const slugWithoutId = base.replace(/-[a-z0-9]{8,}$/i, "")
    const named = slugWithoutId || base
    const withMockup = named.endsWith("-mockup") ? named : `${named}-mockup`
    const safeName = withMockup.replace(/[^\w.\-()\[\]\s]+/g, "_")

    return ext ? `${safeName}${ext}` : safeName
  }

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  // ── Auto-resume download after sign-in ───────────────────────────────────
  // When a logged-out user clicks Download we embed ?pendingDownload=<id> in
  // the forceRedirectUrl so Clerk returns the user here after login. On mount
  // we detect that param, clean the URL, then wait for isSignedIn to become
  // true before triggering the download automatically.
  useEffect(() => {
    if (!isSignedIn || autoDownloadCheckedRef.current) return
    autoDownloadCheckedRef.current = true

    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const pendingId = url.searchParams.get("pendingDownload")

    if (pendingId === productId) {
      url.searchParams.delete("pendingDownload")
      window.history.replaceState({}, "", url.toString())
      // Slight delay so Clerk's session token is fully ready
      setTimeout(() => handleDownload(undefined, { isAutoTriggered: true }), 300)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  // ── main handler ──────────────────────────────────────────────────────────
  const handleDownload = async (
    e?: React.MouseEvent,
    opts?: { isAutoTriggered?: boolean },
  ) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (disabled || loading) return

    if (!isSignedIn) {
      // No red toast — just open the Clerk modal with a pending-download marker
      // embedded in the return URL so we can auto-resume after sign-in.
      try {
        const returnUrl = new URL(window.location.href)
        returnUrl.searchParams.set("pendingDownload", productId)
        openSignIn?.({ forceRedirectUrl: returnUrl.toString() })
      } catch { }
      return
    }

    // Show confirmation dialog (skip for auto-triggered post-login downloads)
    if (!opts?.isAutoTriggered) {
      setShowConfirm(true)
      return
    }

    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 600)
    setLoading(true)
    revokeObjectUrl()

    const endpoint = `${ADMIN_BASE_URL}/api/${storeId}/products/${productId}/download`
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), timeoutMs)

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        // Edge case: Clerk says signed-in but no token yet
        toast({
          title: "Please try again",
          description: "We’re finalizing your session. Hit download once more.",
        })
        setLoading(false)
        return
      }

      ga("download_click", { product_id: productId, store_id: storeId })
      vTrack("download_click", { productId, storeId })

      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal: ac.signal,
        cache: "no-store",
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")

        // Handle specific error cases
        if (res.status === 403) {
          // Try to parse JSON error response — may include balance info
          try {
            const errorData = JSON.parse(text)
            const required = errorData.required ?? creditCost ?? 5
            const balance  = errorData.balance  ?? 0
            const missing  = Math.max(0, required - balance)

            // Credits issue — show clean modal instead of toast
            if (
              errorData.error?.toLowerCase().includes("credit") ||
              errorData.insufficientCredits ||
              missing > 0
            ) {
              setInsufficientCredits({ required, balance, missing })
              return
            }
          } catch { /* not JSON */ }

          throw new Error(text || "You don't have access to this product.")
        }

        if (res.status === 401) {
          throw new Error("Please sign in to download")
        }

        // Handle CDN errors (503) with friendly message
        if (res.status === 503 && text.startsWith("CDN_ERROR:")) {
          const cdnMessage = text.replace("CDN_ERROR: ", "")
          throw new Error(`CDN_ERROR:${cdnMessage}`)
        }

        throw new Error(text || `Download failed (${res.status})`)
      }

      // Get file info before streaming
      const cd = res.headers.get("Content-Disposition")
      const name = extractFileName(cd, `${productId}`)
      const contentLength = res.headers.get("Content-Length")
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0

      // Download with progress tracking
      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error("Response body is not readable")
      }

      const chunks: BlobPart[] = []
      let receivedBytes = 0
      let lastUpdateProgress = 0
      let lastUpdateTime = Date.now()

      // Show initial progress
      setShowProgress(true)
      setProgress(10) // Jumpstart
      setIsComplete(false)
      setCurrentFileName(name)

      // Fallback timer for simulated progress
      const fallbackTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 3
        })
      }, 200)

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          chunks.push(value)
          receivedBytes += value.length

          // Calculate progress
          const realProgress = totalBytes > 0 ? (receivedBytes / totalBytes) * 100 : 0

          if (realProgress > 0) {
            clearInterval(fallbackTimer)

            const now = Date.now()
            const progressDiff = Math.abs(realProgress - lastUpdateProgress)
            const timeDiff = now - lastUpdateTime

            if (progressDiff >= 2 || timeDiff >= 100) {
              lastUpdateProgress = realProgress
              lastUpdateTime = now
              setProgress(realProgress)
            }
          }
        }
      } catch (streamError) {
        clearInterval(fallbackTimer)
        console.error("[Download Stream Error]", streamError)
        throw new Error("Download stream interrupted")
      }


      clearInterval(fallbackTimer)

      // Complete the download
      const blob = new Blob(chunks)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url

      const a = document.createElement("a")
      a.href = url
      a.download = name
      a.rel = "noopener"
      document.body.appendChild(a)
      a.click()
      a.remove()

      // Show completion
      setProgress(100)
      setIsComplete(true)

      // Auto hide after 3 seconds
      setTimeout(() => {
        setShowProgress(false)
        setTimeout(() => {
          setIsComplete(false)
          setProgress(0)
        }, 300)
      }, 3000)

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)

      ga(gaEventName, { product_id: productId, store_id: storeId, file_name: name, bytes: blob.size })
      vTrack("download_success", { productId, storeId, fileName: name, bytes: blob.size })
      adsConversion(1)

      onSuccess?.({ fileName: name, bytes: blob.size })
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? `Request timed out after ${Math.round(timeoutMs / 1000)}s`
          : e?.message || "Download failed"

      console.error("[Download Error]", e)

      // Handle insufficient credits / no-access errors ─────────────────────
      // When the download was auto-triggered after sign-in and the user doesn't
      // have access, send them to the product page (purchase flow) instead of
      // showing a toast. They can decide to buy there; if they don't, they stay
      // in context on that product page.
      const isAccessDenied =
        msg.includes("UPGRADE_REQUIRED") ||
        msg.includes("Insufficient credits") ||
        msg.includes("credits") ||
        msg.includes("don't have access") ||
        msg.includes("do not have access")

      if (isAccessDenied && opts?.isAutoTriggered) {
        ga("download_error_access_denied_auto", { product_id: productId, store_id: storeId, message: msg })
        vTrack("download_error_access_denied_auto", { productId, storeId, message: msg })
        router.push(productSlug ? `/products/${productSlug}` : "/")
        return
      }

      if (msg.includes("Insufficient credits") || msg.includes("credit")) {
        ga("download_error_insufficient_credits", { product_id: productId, store_id: storeId, message: msg })
        vTrack("download_error_insufficient_credits", { productId, storeId, message: msg })

        // Extract numbers from message as fallback, e.g. "need 5, have 2"
        const reqMatch = msg.match(/need[^\d]*(\d+)/i)
        const balMatch = msg.match(/have[^\d]*(\d+)/i)
        const required = reqMatch ? parseInt(reqMatch[1]) : (creditCost ?? 5)
        const balance  = balMatch ? parseInt(balMatch[1]) : 0
        setInsufficientCredits({ required, balance, missing: Math.max(0, required - balance) })

        onError?.(msg)
        return
      }

      // Handle CDN errors with friendly message
      if (msg.startsWith("CDN_ERROR:")) {
        const friendlyMessage = msg.replace("CDN_ERROR:", "").trim()

        ga("download_error_cdn", { product_id: productId, store_id: storeId, message: friendlyMessage })
        vTrack("download_error_cdn", { productId, storeId, message: friendlyMessage })

        toast({
          title: "⚠️ Temporary Service Issue",
          description: friendlyMessage,
          variant: "default",
        })

        onError?.(friendlyMessage)
        return
      }

      ga("download_error", { product_id: productId, store_id: storeId, message: msg })
      vTrack("download_error", { productId, storeId, message: msg })

      toast({
        title: "Download failed",
        description: msg,
        variant: "destructive",
      })

      onError?.(msg)
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  // ── Confirm and proceed ───────────────────────────────────────────────────
  const confirmAndDownload = () => {
    setShowConfirm(false)
    handleDownload(undefined, { isAutoTriggered: true })
  }

  // ── Buy Credits URL with return-to for auto-resume ────────────────────────
  const getBuyCreditsUrl = () => {
    if (typeof window === "undefined") return "/credits"
    const returnUrl = new URL(window.location.href)
    returnUrl.searchParams.set("pendingDownload", productId)
    const params = new URLSearchParams({ returnTo: returnUrl.toString() })
    return `/credits?${params.toString()}`
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  const getButtonContent = () => {
    if (loading) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={cn("flex items-center", !iconOnly && "gap-2")}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const }}>
            <Loader2 className="h-4 w-4" aria-hidden="true" />
          </motion.div>
          {!iconOnly && <span className="font-medium">Downloading...</span>}
        </motion.div>
      )
    }
    if (downloaded) {
      return (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={cn("flex items-center", !iconOnly && "gap-2")}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}>
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
          </motion.div>
          {!iconOnly && <span className="font-medium">Downloaded!</span>}
          {!iconOnly && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            </motion.div>
          )}
        </motion.div>
      )
    }
    if (disabled) {
      return (
        <div className={cn("flex items-center", !iconOnly && "gap-2")}>
          <Lock className="h-4 w-4" aria-hidden="true" />
          {!iconOnly && <span className="font-medium">Locked</span>}
        </div>
      )
    }
    const IconComponent = customIcon || Download
    return (
      <motion.div className={cn("flex items-center", !iconOnly && "gap-2")} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        <IconComponent className="h-4 w-4" aria-hidden="true" />
        {!iconOnly && <span className="font-medium">{customText || "Download"}</span>}
      </motion.div>
    )
  }

  const getButtonClassName = () => {
    const sizeClasses: Record<ButtonSize, string> = {
      sm: iconOnly ? "h-8 w-8 p-0" : "h-8 px-3 text-xs",
      default: iconOnly ? "h-10 w-10 p-0" : "h-10 px-4 text-sm",
      lg: iconOnly ? "h-12 w-12 p-0" : "h-12 px-6 text-base",
    }
    const baseClasses = cn(
      "relative overflow-hidden transition-all duration-300 font-medium rounded-lg",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
      sizeClasses[size],
    )
    if (disabled) {
      return cn(baseClasses, "bg-muted/50 text-muted-foreground border border-muted/30", "cursor-not-allowed opacity-60", "dark:bg-muted/20 dark:border-muted/20")
    }
    if (downloaded) {
      return cn(
        baseClasses,
        "bg-primary/10 text-primary border border-primary/20",
        "hover:bg-primary/20 hover:border-primary/30",
        "dark:bg-primary/20 dark:border-primary/30 dark:hover:bg-primary/30",
        "shadow-lg shadow-primary/10",
      )
    }
    if (loading) {
      return cn(baseClasses, "bg-primary/80 text-primary-foreground border border-primary/60", "cursor-wait", "dark:bg-primary/70 dark:border-primary/50")
    }
    if (variant === "premium") {
      return cn(
        baseClasses,
        "bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground",
        "border border-primary/20 shadow-lg shadow-primary/25",
        "hover:shadow-xl hover:shadow-primary/30 hover:scale-105",
        "active:scale-95 active:shadow-md",
        "dark:from-primary dark:via-primary/80 dark:to-primary/90",
        "dark:shadow-primary/20 dark:hover:shadow-primary/25",
      )
    }
    if (variant === "outline") {
      return cn(
        baseClasses,
        "bg-transparent text-primary border-2 border-primary/30",
        "hover:bg-primary/10 hover:border-primary/50",
        "active:bg-primary/20",
        "dark:border-primary/40 dark:hover:bg-primary/20 dark:hover:border-primary/60",
      )
    }
    if (variant === "ghost") {
      return cn(baseClasses, "bg-transparent text-foreground border border-border/50", "hover:bg-accent/30")
    }
    return cn(
      baseClasses,
      "bg-primary text-primary-foreground border border-primary/20",
      "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:scale-105",
      "active:scale-95 active:bg-primary/80",
      "dark:bg-primary dark:hover:bg-primary/90",
      "shadow-md shadow-primary/10",
    )
  }

  return (
    <motion.div
      className="relative"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      data-store-id={storeId}
      data-product-id={productId}
    >
      <Button
        type="button"
        onClick={handleDownload}
        disabled={disabled || loading}
        className={cn(getButtonClassName(), className)}
        aria-label={disabled ? "Download not available" : loading ? "Downloading..." : "Download product"}
        aria-busy={loading}
      >
        <AnimatePresence>
          {isClicked && (
            <motion.div
              className="absolute inset-0 bg-white/30 dark:bg-foreground/20 rounded-lg text-foreground"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {downloaded && (
            <>
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-lg"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" as const }}
                aria-hidden="true"
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" as const }}
                  aria-hidden="true"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <div className={cn("relative z-10", iconOnly && "flex items-center justify-center")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "loading" : downloaded ? "downloaded" : disabled ? "disabled" : "default"}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className={iconOnly ? "flex items-center justify-center" : ""}
            >
              {getButtonContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 bg-primary/20 blur-md"
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />
        )}
      </Button>

      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-primary/0 pointer-events-none"
        whileFocus={{ borderColor: "hsl(var(--primary) / 0.5)", scale: 1.05 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      />

      {/* Portal for Download Progress */}
      {mounted && showProgress && createPortal(
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
          <DownloadProgress
            fileName={currentFileName}
            progress={progress}
            isComplete={isComplete}
            onDismiss={() => setShowProgress(false)}
          />
        </div>,
        document.body
      )}

      {/* Insufficient Credits modal */}
      <Dialog open={!!insufficientCredits} onOpenChange={() => setInsufficientCredits(null)}>
        <DialogContent className="sm:max-w-sm" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Coins className="h-5 w-5 text-amber-500" />
              Not Enough Credits
            </DialogTitle>
            <DialogDescription>
              {productName
                ? `Downloading "${productName}" requires more credits than you currently have.`
                : "You need more credits to download this file."}
            </DialogDescription>
          </DialogHeader>

          {insufficientCredits && (
            <div className="py-2 space-y-4">
              {/* Credit breakdown */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Required</span>
                  <span className="text-sm font-semibold text-foreground">{insufficientCredits.required} credits</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Your balance</span>
                  <span className="text-sm font-semibold text-foreground">{insufficientCredits.balance} credits</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-destructive/5">
                  <span className="text-sm font-medium text-destructive">You need</span>
                  <span className="text-sm font-bold text-destructive">{insufficientCredits.missing} more credits</span>
                </div>
              </div>

              {/* Visual balance bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current balance</span>
                  <span>{insufficientCredits.balance} / {insufficientCredits.required}</span>
                </div>
                <Progress
                  value={Math.min(100, (insufficientCredits.balance / insufficientCredits.required) * 100)}
                  className="h-2"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Each credit pack gives you instant access. After purchase you&apos;ll be returned here to download immediately.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setInsufficientCredits(null)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              asChild
              className="flex-1 sm:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setInsufficientCredits(null)}
            >
              <a href={getBuyCreditsUrl()}>
                <Coins className="h-4 w-4" />
                Buy Credits
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Download
            </DialogTitle>
            {productName && (
              <DialogDescription className="text-sm text-muted-foreground">
                {productName}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-3 py-1">
            {creditCost !== undefined && creditCost > 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10">
                  <Coins className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {creditCost} credits will be deducted
                  </p>
                  <p className="text-xs text-muted-foreground">
                    From your credit balance
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-primary">This is a free download</p>
              </div>
            )}
            {fileSizeBytes != null && fileSizeBytes > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <FileArchive className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    File size: {formatBytes(fileSizeBytes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Make sure you have enough space and a stable connection
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Your file will begin downloading immediately after confirmation.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAndDownload}
              className="flex-1 sm:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              {creditCost && creditCost > 0 ? `Download for ${creditCost} Credits` : "Download Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
