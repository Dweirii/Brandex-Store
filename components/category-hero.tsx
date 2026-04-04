"use client"

import Image from "next/image"
import {
  ArrowRight,
  Sparkles,
  Download,
  Zap,
  Shield,
  Star,
  Package,
  Layers,
  Check,
  type LucideIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import type { HeroConfig, HeroIconKey } from "@/lib/heroConfig"

const ICON_MAP: Record<HeroIconKey, LucideIcon> = {
  download: Download,
  zap:      Zap,
  shield:   Shield,
  star:     Star,
  package:  Package,
  layers:   Layers,
  check:    Check,
  sparkles: Sparkles,
}


interface HeroSectionProps {
  config: HeroConfig
  /** Category name shown as a small badge above the headline (omit for home page) */
  categoryLabel?: string
}

export function HeroSection({ config }: HeroSectionProps) {
  const router = useRouter()
  const { headline, subhead, primaryCTA, secondaryCTA, images, iconRow, trustLine, tileStyle } = config

  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1320px] w-full px-4 sm:px-6 lg:px-8 pt-[120px] pb-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left: Text */}
          <motion.div
            className="flex flex-col justify-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >

            {/* Headline */}
            <h1 className="text-[2.6rem] sm:text-[3rem] lg:text-[3.1rem] xl:text-[3.4rem] font-black tracking-tight leading-[1.05] text-foreground max-w-140">
              {headline}
            </h1>

            {/* Subhead */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-136">
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
                className="font-semibold px-6 h-11 text-sm rounded-lg border border-border hover:border-foreground/40 transition-all duration-300"
                onClick={() => router.push(secondaryCTA.href)}
              >
                {secondaryCTA.label}
              </Button>
            </div>

            {/* Icon row — trust signals beneath the CTA buttons */}
            {iconRow && iconRow.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {iconRow.map((item, i) => {
                  const Icon = ICON_MAP[item.icon]
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {i > 0 && <span className="w-px h-4 bg-border shrink-0" />}
                      <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Trust line */}
            {trustLine && (
              <p className="text-sm text-muted-foreground -mt-1">{trustLine}</p>
            )}
          </motion.div>

          {/* Right: Image collage — stacks below on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          >
            <ImageCollage images={images} tileStyle={tileStyle} />
          </motion.div>

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
  const tiles = images.slice(0, 4)

  if (tiles.length === 0) return null

  if (tiles.length === 1) {
    return (
      <Tile src={tiles[0]} className="aspect-4/3 w-full" priority sizes="(max-width: 1024px) 100vw, 50vw" tileStyle={tileStyle} />
    )
  }

  if (tiles.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-60 sm:h-72.5 lg:h-80">
        <Tile src={tiles[0]} className="h-full" priority sizes="(max-width: 1024px) 50vw, 25vw" tileStyle={tileStyle} />
        <Tile src={tiles[1]} className="h-full" sizes="(max-width: 1024px) 50vw, 25vw" tileStyle={tileStyle} />
      </div>
    )
  }

  // 3- or 4-image: col1 row-span-2 | col2 row-span-2 | col3 top + col3 bottom
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-60 sm:h-72.5 lg:h-80 *:min-h-0">
      {/* Col 1 — full height */}
      <Tile
        src={tiles[0]}
        className="row-span-2"
        priority
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
      />
      {/* Col 2 — full height */}
      <Tile
        src={tiles[1]}
        className="row-span-2"
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
      />
      {/* Col 3 top */}
      <Tile
        src={tiles[2] ?? ""}
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
      />
      {/* Col 3 bottom */}
      <Tile
        src={tiles[3] ?? ""}
        sizes="(max-width: 1024px) 33vw, 17vw"
        tileStyle={tileStyle}
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
}

function Tile({ src, className = "", priority, sizes, tileStyle = "cover" }: TileProps) {
  const hasImage = Boolean(src?.trim())
  const isContain = tileStyle === "contain"

  // Contain mode: clean white frame + subtle border + gentle shadow
  // so transparent vector art has clear visual separation from the page.
  const frameClasses = isContain
    ? `relative h-full w-full rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_1px_6px_rgba(0,0,0,0.07)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.3)] ${className}`
    : `relative h-full w-full rounded-xl overflow-hidden bg-muted border border-neutral-200 dark:border-neutral-700 shadow-[0_1px_6px_rgba(0,0,0,0.07)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.3)] ${className}`

  return (
    <div className={frameClasses}>
      {hasImage && (
        isContain ? (
          // Inner wrapper creates uniform padding so art never touches the frame edge
          <div className="absolute inset-[10%]">
            <Image
              src={src}
              alt=""
              fill
              className="object-contain"
              sizes={sizes}
              priority={priority}
            />
          </div>
        ) : (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes={sizes}
            priority={priority}
          />
        )
      )}
    </div>
  )
}
