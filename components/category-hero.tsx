"use client"

import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import type { HeroConfig } from "@/lib/heroConfig"


interface HeroSectionProps {
  config: HeroConfig
  /** Category name shown as a small badge above the headline (omit for home page) */
  categoryLabel?: string
}

export function HeroSection({ config, categoryLabel }: HeroSectionProps) {
  const { headline, subhead, primaryCTA, secondaryCTA, images, iconRow } = config

  return (
    <section className="w-full bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Left: Text — justify-center keeps content vertically centred against collage */}
          <motion.div
            className="flex flex-col justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Category badge — category pages only */}
            {categoryLabel && (
              <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[#00B81A]/10 border border-[#00B81A]/20 text-[#00B81A] text-[0.7rem] font-semibold uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                {categoryLabel}
              </div>
            )}

            {/* Headline */}
            <h1 className="text-[2.1rem] sm:text-[2.6rem] lg:text-[2.75rem] xl:text-5xl font-extrabold tracking-tight leading-[1.07] text-foreground">
              {headline}
            </h1>

            {/* Subhead */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[34rem]">
              {subhead}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-row flex-wrap gap-2.5 mt-1">
              <Button
                size="sm"
                className="group bg-[#00B81A] hover:bg-[#009316] text-white font-semibold px-5 h-9 text-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
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
                className="font-semibold px-5 h-9 text-sm rounded-lg border border-border hover:border-foreground/40 transition-all duration-300"
                onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                {secondaryCTA.label}
              </Button>
            </div>

            {/* Icon row — trust signals */}
            {iconRow && iconRow.length > 0 && (
              <div className="flex flex-row flex-wrap items-center gap-4 mt-0.5">
                {iconRow.map((item, i) => {
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Right: Image collage — stacks below on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          >
            <ImageCollage images={images} />
          </motion.div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border" />
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

function ImageCollage({ images }: { images: string[] }) {
  const tiles = images.slice(0, 4)

  if (tiles.length === 0) return null

  if (tiles.length === 1) {
    return (
      <Tile src={tiles[0]} className="aspect-[4/3] w-full" priority sizes="(max-width: 1024px) 100vw, 50vw" />
    )
  }

  if (tiles.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-[220px] sm:h-[260px] lg:h-[280px]">
        <Tile src={tiles[0]} className="h-full" priority sizes="(max-width: 1024px) 50vw, 25vw" />
        <Tile src={tiles[1]} className="h-full" sizes="(max-width: 1024px) 50vw, 25vw" />
      </div>
    )
  }

  // 3- or 4-image: col1 row-span-2 | col2 row-span-2 | col3 top + col3 bottom
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[220px] sm:h-[260px] lg:h-[280px]">
      {/* Col 1 — full height */}
      <Tile
        src={tiles[0]}
        className="row-span-2"
        priority
        sizes="(max-width: 1024px) 33vw, 17vw"
      />
      {/* Col 2 — full height */}
      <Tile
        src={tiles[1]}
        className="row-span-2"
        sizes="(max-width: 1024px) 33vw, 17vw"
      />
      {/* Col 3 top */}
      <Tile
        src={tiles[2] ?? ""}
        sizes="(max-width: 1024px) 33vw, 17vw"
      />
      {/* Col 3 bottom */}
      <Tile
        src={tiles[3] ?? ""}
        sizes="(max-width: 1024px) 33vw, 17vw"
      />
    </div>
  )
}

interface TileProps {
  src: string
  className?: string
  priority?: boolean
  sizes?: string
}

function Tile({ src, className = "", priority, sizes }: TileProps) {
  const hasImage = Boolean(src?.trim())

  return (
    <div className={`relative rounded-xl overflow-hidden bg-muted ${className}`}>
      {hasImage && (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      )}
    </div>
  )
}
