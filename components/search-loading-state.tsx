"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ImageIcon, Sparkles, PackageSearch, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchLoadingStateProps {
  isImageSearch?: boolean
  className?: string
  variant?: "full" | "minimal"
}

const loadingStages = {
  text: [
    { id: 1, label: "Analyzing search query", icon: Search, duration: 300 },
    { id: 2, label: "Searching database", icon: PackageSearch, duration: 400 },
    { id: 3, label: "Ranking results", icon: Sparkles, duration: 300 },
    { id: 4, label: "Preparing display", icon: CheckCircle2, duration: 200 },
  ],
  image: [
    { id: 1, label: "Processing image", icon: ImageIcon, duration: 400 },
    { id: 2, label: "Extracting visual features", icon: Sparkles, duration: 500 },
    { id: 3, label: "Matching products", icon: PackageSearch, duration: 400 },
    { id: 4, label: "Preparing results", icon: CheckCircle2, duration: 200 },
  ],
}

export function SearchLoadingState({ isImageSearch = false, className, variant = "minimal" }: SearchLoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  const loadingMessages = isImageSearch
    ? [
        "Analyzing your image...",
        "Extracting visual features...",
        "Finding similar products...",
        "Matching designs...",
        "Almost there...",
      ]
    : [
        "Searching our catalog...",
        "Finding the best matches...",
        "Analyzing products...",
        "Gathering results...",
        "Almost done...",
      ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000) // Change message every 2 seconds

    return () => clearInterval(interval)
  }, [loadingMessages.length])

  // For minimal variant, show simple loading
  if (variant === "minimal") {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </motion.div>
            <div className="text-center min-h-[60px] flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isImageSearch ? "Searching by Image" : "Searching"}
              </h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-muted-foreground font-medium"
                >
                  {loadingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                className="absolute h-full bg-primary rounded-full"
                animate={{ 
                  x: ["-100%", "100%"],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ width: "40%" }}
              />
              <motion.div
                className="absolute h-full bg-primary/40 rounded-full"
                animate={{ 
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
                style={{ width: "30%" }}
              />
            </div>
            {/* Floating dots animation */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Full variant with stages
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const stages = isImageSearch ? loadingStages.image : loadingStages.text

  useEffect(() => {
    // Reset when search type changes
    setCurrentStage(0)
    setProgress(0)
  }, [isImageSearch])

  useEffect(() => {
    // Progress through stages
    if (currentStage < stages.length) {
      const stage = stages[currentStage]
      const timer = setTimeout(() => {
        setCurrentStage((prev) => Math.min(prev + 1, stages.length))
      }, stage.duration)

      return () => clearTimeout(timer)
    }
  }, [currentStage, stages])

  useEffect(() => {
    // Smooth progress bar animation
    const targetProgress = ((currentStage + 1) / stages.length) * 100
    const increment = (targetProgress - progress) / 20

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (
          (increment > 0 && next >= targetProgress) ||
          (increment < 0 && next <= targetProgress)
        ) {
          return targetProgress
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [currentStage, stages.length, progress])

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Main loading card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-background to-muted/20 border border-border rounded-2xl p-8 shadow-lg"
      >
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative mb-4"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            {isImageSearch ? (
              <ImageIcon className="h-16 w-16 text-primary relative z-10" />
            ) : (
              <Search className="h-16 w-16 text-primary relative z-10" />
            )}
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isImageSearch ? "Searching by Image" : "Searching Products"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we find the best matches
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-muted-foreground">
              Stage {Math.min(currentStage + 1, stages.length)} of {stages.length}
            </span>
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const isActive = index === currentStage
            const isCompleted = index < currentStage
            const Icon = stage.icon

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                  isActive && "bg-primary/10 border border-primary/20",
                  isCompleted && "opacity-60",
                  !isActive && !isCompleted && "opacity-30"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-foreground",
                    isCompleted && "text-muted-foreground",
                    !isActive && !isCompleted && "text-muted-foreground/50"
                  )}
                >
                  {stage.label}
                </span>
                {isActive && (
                  <motion.div
                    className="ml-auto flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Floating particles animation */}
      <div className="relative h-24 -mt-12 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              bottom: 0,
            }}
            animate={{
              y: [-100, -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface SearchSkeletonGridProps {
  count?: number
  className?: string
}

export function SearchSkeletonGrid({ count = 8, className }: SearchSkeletonGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="space-y-3"
        >
          <div className="aspect-3/4 bg-linear-to-br from-muted/40 to-muted/20 rounded-2xl overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1,
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/40 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted/30 rounded w-1/2 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
