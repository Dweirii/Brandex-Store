"use client"

import { useState, useRef } from "react"
import { useAuth, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"
import { Download, Loader2, Lock, CheckCircle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { track as vercelTrack } from "@vercel/analytics"
// ⬇️ shadcn/ui toast hook (adjust the path if your project differs)
import { useToast } from "@/components/ui/use-toast"

type ButtonSize = "sm" | "default" | "lg"
type ButtonVariant = "default" | "outline" | "ghost" | "premium"

interface DownloadButtonProps {
  storeId: string
  productId: string
  disabled?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  fileNameOverride?: string
  timeoutMs?: number
  onSuccess?: (info: { fileName: string; bytes: number }) => void
  onError?: (message: string) => void
  gaEventName?: string
  iconOnly?: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_DOWNLOAD_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO || ""
const GA_EVENT_DEFAULT = "download_complete"

export const DownloadButton = ({
  storeId,
  productId,
  disabled = false,
  size = "sm",
  variant = "default",
  fileNameOverride,
  timeoutMs = 30_000,
  onSuccess,
  onError,
  gaEventName = GA_EVENT_DEFAULT,
  iconOnly = false,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const { getToken, isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  const { toast } = useToast()
  const objectUrlRef = useRef<string | null>(null)

  // ── analytics helpers ─────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ga = (name: string, params?: Record<string, any>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).gtag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).gtag("event", name, {
          event_category: "download",
          event_label: productId,
          store_id: storeId,
          ...params,
        })
      }
    } catch {}
  }

  const adsConversion = (value?: number) => {
    if (!ADS_SEND_TO) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).gtag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).gtag("event", "conversion", {
          send_to: ADS_SEND_TO,
          value: value ?? 1,
          currency: "USD",
          items: [{ item_id: productId, item_category: "digital_asset" }],
        })
      }
    } catch {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vTrack = (name: string, props?: Record<string, any>) => {
    try {
      vercelTrack?.(name, props)
    } catch {}
  }

  const extractFileName = (cdHeader: string | null, fallback: string) => {
    if (fileNameOverride) return fileNameOverride
    const fallbackSafe = fallback.replace(/[^\w.\-()\[\]\s]+/g, "_")
    if (!cdHeader) return fallbackSafe
    const starMatch = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cdHeader)
    const plainMatch = /filename\s*=\s*"?([^";]+)"?/i.exec(cdHeader)
    let raw = starMatch?.[1] ?? plainMatch?.[1] ?? fallbackSafe
    try {
      raw = decodeURIComponent(raw)
    } catch {}
    const base = raw.split(/[\\/]/).pop() || fallbackSafe
    return base.replace(/[^\w.\-()\[\]\s]+/g, "_")
  }

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  // ── main handler ──────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (disabled || loading) return

    if (!isSignedIn) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to download your purchase.",
        variant: "destructive",
      })
      try {
        openSignIn?.()
      } catch {}
      return
    }

    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 600)
    setLoading(true)
    revokeObjectUrl()

    const endpoint = `${API_BASE_URL}/api/${storeId}/products/${productId}/download`
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
        throw new Error(text || `Download failed (${res.status})`)
      }

      const blob = await res.blob()
      const cd = res.headers.get("Content-Disposition")
      const name = extractFileName(cd, `${productId}`)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url

      const a = document.createElement("a")
      a.href = url
      a.download = name
      a.rel = "noopener"
      document.body.appendChild(a)
      a.click()
      a.remove()

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)

      ga(gaEventName, { product_id: productId, store_id: storeId, file_name: name, bytes: blob.size })
      vTrack("download_success", { productId, storeId, fileName: name, bytes: blob.size })
      adsConversion(1)

      toast({
        title: "Download started",
        description: name,
      })

      onSuccess?.({ fileName: name, bytes: blob.size })
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? `Request timed out after ${Math.round(timeoutMs / 1000)}s`
          : e?.message || "Download failed"

      console.error("[Download Error]", e)
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

  // ── UI helpers ────────────────────────────────────────────────────────────
  const getButtonContent = () => {
    if (loading) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={cn("flex items-center", !iconOnly && "gap-2")}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
            <Loader2 className="h-4 w-4" aria-hidden="true" />
          </motion.div>
          {!iconOnly && <span className="hidden sm:inline font-medium">Downloading...</span>}
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
          {!iconOnly && <span className="hidden sm:inline font-medium">Downloaded!</span>}
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
          {!iconOnly && <span className="hidden sm:inline font-medium">Locked</span>}
        </div>
      )
    }
    return (
      <motion.div className={cn("flex items-center", !iconOnly && "gap-2")} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        <Download className="h-4 w-4" aria-hidden="true" />
        {!iconOnly && <span className="hidden sm:inline font-medium">Download</span>}
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
        onClick={handleDownload}
        disabled={disabled || loading}
        className={getButtonClassName()}
        aria-label={disabled ? "Download not available" : loading ? "Downloading..." : "Download product"}
        aria-busy={loading}
      >
        <AnimatePresence>
          {isClicked && (
            <motion.div
              className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-lg text-black dark:text-white"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
                transition={{ duration: 0.8, ease: "easeOut" }}
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
                  transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
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
    </motion.div>
  )
}
