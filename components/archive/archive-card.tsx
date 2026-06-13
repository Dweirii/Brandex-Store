"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
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
  // Natural aspect ratio (w/h) so the card takes the image's real height in the
  // masonry. Defaults to 4/5 until the image reports its dimensions.
  const [ratio, setRatio] = useState<number | null>(null)

  // Hover-to-peek: after 3s of sustained hover, pop the image over a blurred page.
  const [showPreview, setShowPreview] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }, [])

  const isFree = Number(data.price) === 0
  const rawImageUrl = data.images?.find((img) => img?.url)?.url

  // Images already complete in the browser cache never fire onLoad (React
  // attaches the listener after they finished), which would leave the skeleton
  // stuck. A callback ref catches that case the moment the element mounts.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) {
      setRatio(img.naturalWidth / img.naturalHeight)
      setLoaded(true)
    }
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

  // Arm the 3s timer on hover (desktop/fine-pointer only). Clear on leave.
  const startHover = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return
    hoverTimer.current = setTimeout(() => setShowPreview(true), 3000)
  }
  const endHover = () => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null }
    setShowPreview(false)
  }

  return (
    <>
    <Link
      href={href}
      aria-label={data.name}
      className="archive-card group w-full select-none"
      onMouseEnter={startHover}
      onMouseLeave={endHover}
    >
      <span
        className="archive-card__media"
        data-loaded={loaded ? "true" : "false"}
        style={{ aspectRatio: ratio ? String(ratio) : "4 / 5" }}
      >
        <span className="archive-card__skeleton" />
        {/* Keep plain <img> for lightweight rendering in large lists. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          srcSet={imageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          alt={data.name}
          className="archive-card__img"
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget
            if (img.naturalWidth > 0) setRatio(img.naturalWidth / img.naturalHeight)
            setLoaded(true)
          }}
          onError={() => setLoaded(true)}
        />
      </span>

      {isFree && <span className="archive-card__badge">Free</span>}

      <h4 className="archive-card__title">
        <span>{data.name}</span>
        {categoryName && <small className="archive-card__cat">{categoryName}</small>}
      </h4>
    </Link>

    {showPreview && createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={data.name}
          className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
        />
      </div>,
      document.body,
    )}
    </>
  )
}

const ArchiveCard = memo(ArchiveCardBase)
export default ArchiveCard
