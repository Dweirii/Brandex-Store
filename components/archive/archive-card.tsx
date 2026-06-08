import Link from "next/link"
import type { Product } from "@/types"
import { getDisplayImageUrl } from "@/lib/image-utils"

interface ArchiveCardProps {
  data: Product
}

/**
 * Pixeden-style archive card.
 *
 * A fully-clickable <a> wrapping a full-bleed product image with a brand-green
 * gradient rising from the bottom, the title positioned bottom-left, and a
 * green hover wash (see `.archive-card` rules in globals.css). Server component
 * — hover is pure CSS, so no client JS is required.
 */
export default function ArchiveCard({ data }: ArchiveCardProps) {
  const isFree = Number(data.price) === 0
  const rawImageUrl = data.images?.find((img) => img?.url)?.url

  // No image → nothing to show; skip the card entirely.
  if (!rawImageUrl) return null

  // Paid products are served watermarked via the image proxy.
  const imageUrl = getDisplayImageUrl(rawImageUrl, isFree)
  const href = `/products/${data.slug ?? data.id}`
  const categoryName = data.category?.name

  return (
    <Link
      href={href}
      aria-label={data.name}
      className="archive-card group w-full select-none"
    >
      {/* Intentional plain <img>: the design relies on object-fit:cover full-bleed
          fill behaviour and the watermark proxy URL — not next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={data.name}
        className="archive-card__img"
        loading="lazy"
        draggable={false}
      />

      {isFree && <span className="archive-card__badge">Free</span>}

      <h4 className="archive-card__title">
        <span>{data.name}</span>
        {categoryName && <small className="archive-card__cat">{categoryName}</small>}
      </h4>
    </Link>
  )
}
