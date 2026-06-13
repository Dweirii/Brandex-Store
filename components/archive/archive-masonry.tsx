"use client"

import Masonry from "react-masonry-css"
import type { Product } from "@/types"
import ArchiveCard from "./archive-card"

/**
 * Masonry grid for the archive (home + category pages).
 *
 * Column counts mirror the Tailwind responsive ladder used elsewhere:
 *   mobile 1 · sm 2 · lg 3 · xl 4 · 2xl 5 · ≥2100 6
 *
 * react-masonry-css keys are MAX-widths (applied when window ≤ key), so each
 * key is one pixel below the corresponding Tailwind min-width breakpoint. Items
 * are distributed round-robin, so the visual reading order across the top row is
 * preserved (1,2,3,4 …) — unlike CSS multi-column which fills column-by-column.
 *
 * Cards take their image's natural aspect ratio (see ArchiveCard), giving the
 * real variable-height masonry look. The -ml/pl/mb-5 trio is the gutter.
 */
const breakpointCols = {
  default: 6,
  2099: 5,
  1535: 4,
  1279: 3,
  1023: 2,
  639: 1,
}

export default function ArchiveMasonry({ products }: { products: Product[] }) {
  // Drop imageless products here so they never produce empty masonry cells
  // (ArchiveCard renders null without an image, which would leave gaps).
  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url)),
  )

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="flex w-auto -ml-5"
      columnClassName="pl-5 bg-clip-padding"
    >
      {visible.map((product) => (
        <div key={product.id} className="mb-5">
          <ArchiveCard data={product} />
        </div>
      ))}
    </Masonry>
  )
}
