"use client"

import type { Product } from "@/types"
import ArchiveCard from "./archive-card"

interface ArchiveCardGridProps {
  products: Product[]
}

/**
 * Presentational responsive grid of ArchiveCards for a fixed product list
 * (e.g. related products), no infinite scroll.
 */
export default function ArchiveCardGrid({ products }: ArchiveCardGridProps) {
  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url))
  )

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((product) => (
        <ArchiveCard key={product.id} data={product} />
      ))}
    </div>
  )
}
