"use client"

import Masonry from "react-masonry-css"
import type { Product } from "@/types"
import ArchiveCard from "./archive-card"

interface ArchiveCardGridProps {
  products: Product[]
}

const breakpointCols = {
  default: 4,
  1280: 3,
  768: 2,
  480: 1,
}

/**
 * Presentational masonry grid of ArchiveCards for a fixed product list
 * (e.g. related products) — same look as the archive, no infinite scroll.
 */
export default function ArchiveCardGrid({ products }: ArchiveCardGridProps) {
  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url))
  )

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="-ml-6 flex w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {visible.map((product) => (
        <div key={product.id} className="mb-6">
          <ArchiveCard data={product} />
        </div>
      ))}
    </Masonry>
  )
}
