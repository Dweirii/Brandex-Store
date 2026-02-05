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
    // Multiplied by 10 from original 1-8 range, giving us starting range of 20-80, then clamped to 2-8
    const initialViewers = 2 + (hash % 7) // 2-8 starting range
    setActiveViewers(initialViewers)

    // Update active viewers every 2-5 seconds with mock real-time updates
    const updateViewers = () => {
      setActiveViewers(prev => {
        // Random change between -70 to +100
        const change = Math.floor(Math.random() * 171) - 70
        const newValue = prev + change
        // Clamp between 2-8
        return Math.max(2, Math.min(8, newValue))
      })
    }

    const scheduleNextUpdate = () => {
      // Random interval between 2-5 seconds
      const interval = Math.random() * 3000 + 2000
      return setTimeout(() => {
        updateViewers()
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
