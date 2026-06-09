"use client"

import { useCallback, useState } from "react"
import Image, { type ImageProps } from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

const PALETTE = [
  ["#f0f4ff", "#c7d7fc"],
  ["#fff0f6", "#fbbfd4"],
  ["#f0faf3", "#a7ddb5"],
  ["#fffbeb", "#fcd97a"],
  ["#f3f0ff", "#c4b5fd"],
  ["#fff5f0", "#fdc5a3"],
  ["#f0fbff", "#93d9f5"],
  ["#fdf0ff", "#e0a8fc"],
]

function colorFromSeed(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return PALETTE[h % PALETTE.length]
}

interface ImageWithFallbackProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSeed?: string
  onError?: () => void
  onLoad?: () => void
}

export function ImageWithFallback({
  fallbackSeed = "",
  alt,
  className,
  onError,
  onLoad,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(!props.src)

  const handleError = () => {
    setErrored(true)
    onError?.()
  }

  // next/image fires neither onLoad nor onLoadingComplete when the image is
  // already complete in the browser cache by the time React attaches the
  // listener — extremely common during infinite scroll. A callback ref catches
  // that case so any loading skeleton layered over the image is never left
  // stuck pulsing on top of an image that actually finished loading.
  const handleImgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete && img.naturalWidth > 0) onLoad?.()
    },
    [onLoad]
  )

  if (errored) {
    const [bg, accent] = colorFromSeed(fallbackSeed || String(alt))
    const initial = (fallbackSeed || String(alt) || "?")[0].toUpperCase()

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 select-none",
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
        }}
        aria-label={alt as string}
      >
        <ImageOff
          className="h-6 w-6 opacity-30"
          style={{ color: accent }}
          strokeWidth={1.5}
        />
        <span
          className="text-xs font-semibold tracking-wide opacity-40"
          style={{ color: accent }}
        >
          {initial}
        </span>
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      className={className}
      {...props}
      ref={handleImgRef}
      onError={handleError}
      onLoad={() => onLoad?.()}
    />
  )
}
