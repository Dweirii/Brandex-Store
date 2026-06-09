"use client"

import { useEffect, useRef } from "react"
import useRecentlyViewed from "@/hooks/use-recently-viewed"
import { trackViewItem } from "@/lib/analytics"
import type { Product } from "@/types"

interface ProductViewTrackerProps {
  product: Product
}

const ProductViewTracker = ({ product }: ProductViewTrackerProps) => {
  const addItem = useRecentlyViewed((state) => state.addItem)
  const trackedIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Add product to recently viewed when component mounts
    addItem(product)
  }, [product, addItem])

  // GA4 view_item — fire once per product so navigating between products retracks.
  useEffect(() => {
    if (!product?.id || trackedIdRef.current === product.id) return
    trackedIdRef.current = product.id
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category?.name,
      price: Number(product.price) || 0,
    })
  }, [product])

  // This component doesn't render anything
  return null
}

export { ProductViewTracker }
