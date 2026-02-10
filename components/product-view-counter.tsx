"use client"

import { Eye } from "lucide-react"
import { useEffect, useState } from "react"

interface ProductViewCounterProps {
  productId: string
}

const ProductViewCounter = ({ productId }: ProductViewCounterProps) => {
  const [viewCount, setViewCount] = useState<number>(0)
  const [activeViewers, setActiveViewers] = useState<number>(0)

  useEffect(() => {
    // Generate a consistent view count based on product ID hash (500-10,000 range)
    // Multiplied by 10 from original 50-500 range
    const hash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const baseCount = 500 + (hash % 9500) // 500-10,000 range
    setViewCount(baseCount)

    // Generate consistent starting viewers based on product ID (2-8 range)
    const initialViewers = 2 + (hash % 7) // 2-8 starting range
    setActiveViewers(initialViewers)

    // Smoothly step active viewers by ±1 at a time so every number between 2-8 is hit
    const scheduleNextUpdate = () => {
      // Random interval between 1.5-3.5 seconds per step
      const interval = Math.random() * 2000 + 1500
      return setTimeout(() => {
        setActiveViewers(prev => {
          // 35% chance to stay the same (adds natural pauses)
          if (Math.random() < 0.35) return prev

          // Move by exactly 1 in a random direction
          const direction = Math.random() > 0.5 ? 1 : -1
          const newValue = prev + direction
          // Clamp between 2-8
          return Math.max(2, Math.min(8, newValue))
        })
        timeoutId = scheduleNextUpdate()
      }, interval)
    }

    let timeoutId = scheduleNextUpdate()

    return () => clearTimeout(timeoutId)
  }, [productId])

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground py-3 border-y border-border my-4">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        <span>{viewCount.toLocaleString()} views</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <span className="text-green-600 dark:text-green-400 font-medium">
          {activeViewers} {activeViewers === 1 ? "person" : "people"} viewing now
        </span>
      </div>
    </div>
  )
}

export { ProductViewCounter }
