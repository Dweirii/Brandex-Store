"use client"

import { motion } from "framer-motion"
import { Download, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DownloadProgressProps {
  fileName: string
  progress: number
  isComplete?: boolean
  onDismiss?: () => void
}

export function DownloadProgress({
  fileName,
  progress,
  isComplete = false,
  onDismiss,
}: DownloadProgressProps) {
  const progressPercent = Math.round(progress)

  return (
    <div className="relative w-full max-w-md p-4 bg-background border border-border rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
              isComplete
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-primary/10 text-primary"
            )}
          >
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.div>
            ) : (
              <Download className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {isComplete ? "Download Complete" : "Downloading..."}
            </p>
            <p className="text-xs text-muted-foreground truncate" title={fileName}>
              {fileName}
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isComplete
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-primary to-primary/80"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {progressPercent}%
          </span>
          {!isComplete && (
            <motion.span
              className="text-xs text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Please wait...
            </motion.span>
          )}
          {isComplete && (
            <motion.span
              className="text-xs text-green-600 dark:text-green-400 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Ready!
            </motion.span>
          )}
        </div>
      </div>

      {/* Completion animation effect */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-green-500/50"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  )
}

