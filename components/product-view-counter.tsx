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
    // Generate a realistic view count based on product ID
    // In production, this would come from your backend/analytics
    const hash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const baseCount = 50 + (hash % 450) // 50-500 range
    setViewCount(baseCount)

    // Generate random active viewers (1-8)
    const viewers = Math.floor(Math.random() * 8) + 1
    setActiveViewers(viewers)

    // Update active viewers every 30-60 seconds
    const interval = setInterval(() => {
      const newViewers = Math.floor(Math.random() * 8) + 1
      setActiveViewers(newViewers)
    }, Math.random() * 30000 + 30000)

    return () => clearInterval(interval)
  }, [productId])

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground py-3 border-y border-border my-4">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        <span>{viewCount} views</span>
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
