"use client"

import type { Product } from "@/types"
import RelatedProductCard from "@/components/ui/related-product-card"

interface RelatedProductGridProps {
  products: Product[]
}

/**
 * Fixed-grid related products section used on product detail pages.
 * Keeps consistent card sizing and avoids masonry-style layouts.
 */
export default function RelatedProductGrid({ products }: RelatedProductGridProps) {
  const visible = products.filter((p) => {
    const hasVideo = Boolean(p.videoUrl && String(p.videoUrl).trim().length > 0)
    const hasImage = Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url && String(img.url).trim().length > 0))
    return hasImage || hasVideo
  })

  if (visible.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {visible.map((product) => (
        <RelatedProductCard key={product.id} data={product} />
      ))}
    </div>
  )
}
