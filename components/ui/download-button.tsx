"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"
import { Download, Loader2, Lock, CheckCircle, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"


interface DownloadButtonProps {
  storeId: string
  productId: string
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost" | "premium"
}

export const DownloadButton = ({
  storeId,
  productId,
  disabled = false,
  size = "sm",
  variant = "default",
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const { getToken } = useAuth()

  const handleDownload = async () => {
    if (disabled || loading) return

    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 600)

    setLoading(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        throw new Error("User not authenticated")
      }

      const res = await fetch(`https://admin.wibimax.com/api/${storeId}/products/${productId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Download failed")
      }

      const { url } = await res.json()
      if (!url) {
        throw new Error("Signed URL not found")
      }

      window.open(url, "_blank")

      setDownloaded(true)
      
      setTimeout(() => {
        setDownloaded(false)
      }, 3000)
    } catch (error) {
      console.error("Download Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getButtonContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
          <span className="hidden sm:inline font-medium">Downloading...</span>
        </motion.div>
      )
    }

    if (downloaded) {
      return (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="flex items-center gap-2"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}>
            <CheckCircle className="h-4 w-4" />
          </motion.div>
          <span className="hidden sm:inline font-medium">Downloaded!</span>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Sparkles className="h-3 w-3" />
          </motion.div>
        </motion.div>
      )
    }

    if (disabled) {
      return (
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Locked</span>
        </div>
      )
    }

    return (
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Download</span>
      </motion.div>
    )
  }

  const getButtonClassName = () => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      default: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    }

    const baseClasses = cn(
      "relative overflow-hidden transition-all duration-300 font-medium rounded-lg",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
      sizeClasses[size],
    )

    if (disabled) {
      return cn(
        baseClasses,
        "bg-muted/50 text-muted-foreground border border-muted/30",
        "cursor-not-allowed opacity-60",
        "dark:bg-muted/20 dark:border-muted/20",
      )
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
      return cn(
        baseClasses,
        "bg-primary/80 text-primary-foreground border border-primary/60",
        "cursor-wait",
        "dark:bg-primary/70 dark:border-primary/50",
      )
    }

    // Default active state
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

    // Default variant
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
    >
      <Button
        onClick={handleDownload}
        disabled={disabled || loading}
        className={getButtonClassName()}
        aria-label={disabled ? "Download not available" : loading ? "Downloading..." : "Download product"}
      >
        {/* Click ripple effect */}
        <AnimatePresence>
          {isClicked && (
            <motion.div
              className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-lg text-black dark:text-white"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Success celebration effect */}
        <AnimatePresence>
          {downloaded && (
            <>
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-lg"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {/* Sparkle particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Shimmer effect for premium variant */}
        {variant === "premium" && !disabled && !loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "linear",
            }}
          />
        )}

        {/* Button content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "loading" : downloaded ? "downloaded" : disabled ? "disabled" : "default"}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {getButtonContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Glow effect for active state */}
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 bg-primary/20 blur-md"
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>

      {/* External glow ring for focus */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-primary/0 pointer-events-none"
        whileFocus={{ borderColor: "hsl(var(--primary) / 0.5)", scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
