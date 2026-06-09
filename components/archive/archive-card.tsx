"use client"

import { memo, useCallback, useState } from "react"
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
 * green hover wash (see `.archive-card` rules in globals.css).
 *
 * The grey `.archive-card__skeleton` sits BEHIND the image. Once the image has
 * actually painted we latch `loaded` and hide the skeleton for good — otherwise
 * any frame where the <img> isn't painted (cached-load race, async decode, a
 * parent re-render during infinite scroll) lets the grey show back through,
 * which reads as the image "flashing / coming and going". `memo` keeps existing
 * cards from re-rendering when a new page is appended.
 */
function ArchiveCardBase({ data }: ArchiveCardProps) {
  const [loaded, setLoaded] = useState(false)

  const isFree = Number(data.price) === 0
  const rawImageUrl = data.images?.find((img) => img?.url)?.url

  // Images already complete in the browser cache never fire onLoad (React
  // attaches the listener after they finished), which would leave the skeleton
  // stuck. A callback ref catches that case the moment the element mounts.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  // No image → nothing to show; skip the card entirely.
  if (!rawImageUrl) return null

  // Serve resized thumbnails for both free and paid products (wm=0 for free).
  // Widths reach 1440 so retina / large screens (cards render at 25vw on
  // desktop) get a crisp source instead of an upscaled 980px one, and q86 (was
  // 68) stops the proxy's mozjpeg pass from softening the image.
  const imageWidths = [480, 768, 1080, 1440]
  const IMG_QUALITY = 86
  const imageUrl = getDisplayImageUrl(rawImageUrl, isFree, {
    width: imageWidths[imageWidths.length - 1],
    quality: IMG_QUALITY,
    useProxyForFree: true,
  })
  const imageSrcSet = imageWidths
    .map((width) =>
      `${getDisplayImageUrl(rawImageUrl, isFree, { width, quality: IMG_QUALITY, useProxyForFree: true })} ${width}w`
    )
    .join(", ")
  const href = `/products/${data.slug ?? data.id}`
  const categoryName = data.category?.name

  return (
    <Link
      href={href}
      aria-label={data.name}
      className="archive-card group w-full select-none"
    >
      <span className="archive-card__media" data-loaded={loaded ? "true" : "false"}>
        <span className="archive-card__skeleton" />
        {/* Keep plain <img> for lightweight rendering in large lists. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          srcSet={imageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          alt={data.name}
          className="archive-card__img"
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      </span>

      {isFree && <span className="archive-card__badge">Free</span>}

      <h4 className="archive-card__title">
        <span>{data.name}</span>
        {categoryName && <small className="archive-card__cat">{categoryName}</small>}
      </h4>
    </Link>
  )
}

const ArchiveCard = memo(ArchiveCardBase)
export default ArchiveCard
