"use client"

import { useEffect, useState } from "react"
import { Clock, Trash2 } from "lucide-react"
import useRecentlyViewed from "@/hooks/use-recently-viewed"
import RelatedProductCard from "@/components/ui/related-product-card"

const RecentlyViewed = () => {
  const [isMounted, setIsMounted] = useState(false)
  const items = useRecentlyViewed((state) => state.items)
  const clearAll = useRecentlyViewed((state) => state.clearAll)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  if (items.length === 0) return null

  return (
    <div className="bg-background py-8 border-t" data-recently-viewed id="recently-viewed">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Recently Viewed</h2>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors duration-200"
            aria-label="Clear history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear History
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.slice(0, 8).map((product) => (
            <RelatedProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export { RecentlyViewed }
