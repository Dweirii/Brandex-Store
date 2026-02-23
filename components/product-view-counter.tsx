"use client"

import { Eye } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ProductViewCounterProps {
  productId: string
}

const hashId = (id: string) =>
  id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

const ProductViewCounter = ({ productId }: ProductViewCounterProps) => {
  // Lazy initialisers run exactly once — no state resets on re-renders or
  // effect re-runs, which was causing the visible "jump" back to the
  // hash-based value while the animation had already moved elsewhere.
  const [viewCount] = useState(() => {
    const hash = hashId(productId)
    return 500 + (hash % 9500)
  })

  const [activeViewers, setActiveViewers] = useState(() => {
    const hash = hashId(productId)
    return 2 + (hash % 7) // 2–8
  })

  // Keep a stable ref to the latest timeoutId so cleanup is always accurate
  // even when the callback fires and schedules the next tick.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const schedule = () => {
      // Random interval 1.5–3.5 s per step for natural feel
      const delay = Math.random() * 2000 + 1500
      timerRef.current = setTimeout(() => {
        setActiveViewers(prev => {
          // 35 % chance to stay put — adds realistic pauses
          if (Math.random() < 0.35) return prev
          const dir = Math.random() > 0.5 ? 1 : -1
          return Math.max(2, Math.min(8, prev + dir))
        })
        schedule()
      }, delay)
    }

    schedule()

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, []) // intentionally empty — initial value is fixed via lazy useState

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground py-3 border-y border-border my-4">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        <span>{viewCount.toLocaleString()} views</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#00c853' }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#00c853' }}></span>
          </span>
        </div>
        <span className="font-medium" style={{ color: '#00c853' }}>
          {activeViewers} {activeViewers === 1 ? "person" : "people"} viewing now
        </span>
      </div>
    </div>
  )
}

export { ProductViewCounter }
