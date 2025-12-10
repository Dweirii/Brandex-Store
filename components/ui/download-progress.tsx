"use client"

import { motion } from "framer-motion"
import { FileDown, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DownloadProgressProps {
  fileName: string
  progress: number
  isComplete?: boolean
  onDismiss?: () => void
}

export function DownloadProgress({ fileName, progress, isComplete = false, onDismiss }: DownloadProgressProps) {
  const progressPercent = Math.min(Math.round(progress), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-sm p-4 shadow-sm transition-all hover:shadow-md"
    >
      {/* Icon Section */}
      <motion.div
        className={cn(
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          isComplete ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary",
        )}
        animate={{
          scale: isComplete ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {isComplete ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Check className="h-6 w-6 stroke-[2.5]" />
          </motion.div>
        ) : (
          <FileDown className="h-6 w-6 stroke-[2]" />
        )}
      </motion.div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-foreground/90">{fileName}</p>
          <motion.span
            key={progressPercent}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-xs font-semibold tabular-nums tracking-tight",
              isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
            )}
          >
            {isComplete ? "Complete" : `${progressPercent}%`}
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary/50">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              isComplete
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-primary to-primary/80",
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
          {/* Shimmer effect while downloading */}
          {!isComplete && progress > 0 && progress < 100 && (
            <motion.div
              className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "400%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ width: `${progressPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-secondary/80 hover:text-foreground/80"
        >
          <X className="h-4 w-4 stroke-[2]" />
        </motion.button>
      )}
    </motion.div>
  )
}
