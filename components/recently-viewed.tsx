"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import useRecentlyViewed from "@/hooks/use-recently-viewed"
import RelatedProductCard from "@/components/ui/related-product-card"

const RecentlyViewed = () => {
  const [isMounted, setIsMounted] = useState(false)
  const items = useRecentlyViewed((state) => state.items)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="bg-background py-12 border-t" data-recently-viewed id="recently-viewed">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
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
