"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/Button"
import type { HeroConfig } from "@/lib/heroConfig"


interface HeroSectionProps {
  config: HeroConfig
  /** Category name shown as a small badge above the headline (omit for home page) */
  categoryLabel?: string
  /** Less bottom padding for category pages */
  compact?: boolean
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function HeroSection({ config, compact }: HeroSectionProps) {
  const { headline, subhead, primaryCTA, secondaryCTA, images, tallImages, squareImages, iconRow, trustLine, tileStyle } = config

  // If tall/square pools exist, pick 2 tall + 2 square for the 4-image layout
  const resolvedImages = (tallImages?.length && squareImages?.length)
    ? [...pickRandom(tallImages, 2), ...pickRandom(squareImages, 2)]
    : images

  // Only keep tiles that have a real URL; when none, render a clean text-only hero
  const collageImages = resolvedImages.filter((url) => Boolean(url?.trim()))
  const hasImages = collageImages.length > 0

  return (
    <section className="w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-background.png')" }}>
      <div className={`mx-auto max-w-[1320px] w-full px-4 sm:px-6 lg:px-8 pt-16 ${compact ? "pb-16" : "pb-16"}`}>
        <div className={`grid gap-8 lg:gap-12 items-stretch ${hasImages ? "lg:grid-cols-[1fr_1.1fr]" : "lg:grid-cols-1"}`}>

          {/* Left: Text */}
          <motion.div
            className="flex flex-col justify-between gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >

            {/* Headline */}
            <h1 className="text-[2.6rem] sm:text-[3rem] lg:text-[3.1rem] xl:text-[3.4rem] font-black tracking-tight leading-[1.05] text-white max-w-140">
              {headline}
            </h1>

            {/* Subhead */}
            <p className="text-sm text-white/70 leading-relaxed max-w-136">
              {subhead}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-row flex-wrap gap-3">
              <Button
                size="sm"
                className="group bg-primary hover:bg-logogreen-600 text-white font-semibold px-6 h-11 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="flex items-center gap-1.5">
                  {primaryCTA.label}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="font-semibold px-6 h-11 text-sm rounded-lg bg-white text-foreground border-0 hover:bg-white/90 transition-all duration-300"
                onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                {secondaryCTA.label}
              </Button>
            </div>

            {/* Icon row — trust signals beneath the CTA buttons */}
            {iconRow && iconRow.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {iconRow.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="w-px h-3.5 bg-white/30 shrink-0" />}
                    <span className="text-xs font-medium text-white">{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust line */}
            {trustLine && (
              <p className="text-sm text-white/60 -mt-1">{trustLine}</p>
            )}
          </motion.div>

          {/* Right: Image collage — stacks below on mobile; omitted entirely when there are no images */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            >
              <ImageCollage images={collageImages} tileStyle={tileStyle} />
            </motion.div>
          )}

        </div>

      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CSS-grid collage: 3 columns × 2 rows.
// Col 1 and Col 2 each span both rows (tall).
// Col 3 top + Col 3 bottom are each one row (stacked).
// Using a grid (not flex) gives every cell a precise, equal height so images
// never overflow or shrink unpredictably.
// ---------------------------------------------------------------------------

interface ImageCollageProps {
  images: string[]
  tileStyle?: "cover" | "contain"
}

function ImageCollage({ images, tileStyle = "cover" }: ImageCollageProps) {
  // Exclude any image that fails to load so a broken URL never shows a broken tile
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const markFailed = (src: string) =>
    setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src)))

  // Only use tiles that have a real image URL and haven't failed to load
  const tiles = images.filter((url) => Boolean(url?.trim()) && !failed.has(url)).slice(0, 4)

  if (tiles.length === 0) return null

  if (tiles.length === 1) {
    return (
      <Tile src={tiles[0]} className="aspect-4/3 w-full" priority sizes="(max-width: 1024px) 100vw, 50vw" tileStyle={tileStyle} onFail={markFailed} />
    )
  }

  if (tiles.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 aspect-2/1">
        <Tile src={tiles[0]} className="h-full" priority sizes="(max-width: 1024px) 50vw, 25vw" tileStyle={tileStyle} onFail={markFailed} />
        <Tile src={tiles[1]} className="h-full" sizes="(max-width: 1024px) 50vw, 25vw" tileStyle={tileStyle} onFail={markFailed} />
      </div>
    )
  }

  if (tiles.length === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-3 aspect-video *:min-h-0">
        <Tile
          src={tiles[0]}
          className="row-span-2"
          priority
          sizes="(max-width: 1024px) 50vw, 25vw"
          tileStyle={tileStyle}
          onFail={markFailed}
        />
        <Tile
          src={tiles[1]}
          sizes="(max-width: 1024px) 50vw, 25vw"
          tileStyle={tileStyle}
          onFail={markFailed}
        />
        <Tile
          src={tiles[2]}
          sizes="(max-width: 1024px) 50vw, 25vw"
          tileStyle={tileStyle}
          onFail={markFailed}
        />
      </div>
    )
  }

  // 4 images: col1 row-span-2 | col2 row-span-2 | col3 top + col3 bottom
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 aspect-video *:min-h-0">
      <Tile
        src={tiles[0]}
        className="row-span-2"
        priority
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
        onFail={markFailed}
      />
      <Tile
        src={tiles[1]}
        className="row-span-2"
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
        onFail={markFailed}
      />
      <Tile
        src={tiles[2]}
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
        onFail={markFailed}
      />
      <Tile
        src={tiles[3]}
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
        onFail={markFailed}
      />
    </div>
  )
}

interface TileProps {
  src: string
  className?: string
  priority?: boolean
  sizes?: string
  tileStyle?: "cover" | "contain"
  /** Called with the src when the image fails to load, so the collage can drop it */
  onFail?: (src: string) => void
}

function Tile({ src, className = "", priority, sizes, tileStyle = "cover", onFail }: TileProps) {
  const hasImage = Boolean(src?.trim())

  const frameClasses = `relative h-full w-full rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-[8px_12px_24px_rgba(0,40,25,0.45),14px_20px_50px_rgba(0,40,25,0.25)] ${className}`

  return (
    <div className={frameClasses}>
      {hasImage && (
        <Image
          src={src}
          alt=""
          fill
          className={tileStyle === "contain" ? "object-contain p-2" : "object-cover"}
          sizes={sizes}
          priority={priority}
          onError={() => onFail?.(src)}
        />
      )}
    </div>
  )
}
