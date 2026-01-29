"use client"

import { useEffect } from "react"
import useRecentlyViewed from "@/hooks/use-recently-viewed"
import type { Product } from "@/types"

interface ProductViewTrackerProps {
  product: Product
}

const ProductViewTracker = ({ product }: ProductViewTrackerProps) => {
  const addItem = useRecentlyViewed((state) => state.addItem)

  useEffect(() => {
    // Add product to recently viewed when component mounts
    addItem(product)
  }, [product, addItem])

  // This component doesn't render anything
  return null
}

export { ProductViewTracker }
