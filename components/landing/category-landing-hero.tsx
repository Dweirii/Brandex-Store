"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export interface HeroImage {
  url: string
  alt: string
}

interface CategoryLandingHeroProps {
  eyebrow: string
  titleLead: string
  titleAccent: string
  subtitle: string
  browseHref: string
  browseLabel: string
  secondaryHref: string
  secondaryLabel: string
  badges: string[]
  stats: { value: string; label: string }[]
  images: HeroImage[]
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

/** One infinite vertical-scrolling image column. */
function ScrollColumn({ images, direction, duration }: { images: HeroImage[]; direction: "up" | "down"; duration: number }) {
  if (images.length === 0) return null
  const list = [...images, ...images] // duplicate for seamless loop
  return (
    <motion.div
      className="flex flex-col gap-4"
      animate={{ y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {list.map((img, i) => (
        <div key={`${img.url}-${i}`} className="overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.05]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt={img.alt} className="aspect-[4/5] w-full object-cover" loading="lazy" draggable={false} />
        </div>
      ))}
    </motion.div>
  )
}

export default function CategoryLandingHero({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  browseHref,
  browseLabel,
  secondaryHref,
  secondaryLabel,
  badges,
  stats,
  images,
}: CategoryLandingHeroProps) {
  const mid = Math.ceil(images.length / 2)
  const colA = images.slice(0, mid)
  const colB = images.slice(mid)

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16">
        {/* Copy */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
          <motion.span
            variants={fade}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </motion.span>

          <motion.h1
            variants={fade}
            className="mt-5 text-[40px] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-[56px]"
          >
            {titleLead} <span className="text-primary">{titleAccent}</span>
          </motion.h1>

          <motion.p variants={fade} className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </motion.p>

          {/* Trust badges */}
          <motion.ul variants={fade} className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {badges.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <Check className="h-4 w-4 text-primary" />
                {b}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              href={browseHref}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-[#009915]"
            >
              {browseLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
            >
              {secondaryLabel}
            </Link>
          </motion.div>

          <motion.dl variants={fade} className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-border/60 pt-7">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-semibold tracking-tight text-foreground">{s.value}</dt>
                <dd className="text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Dual vertical-scroll image columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden h-[300px] overflow-hidden sm:block sm:h-[440px] lg:h-[560px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
        >
          <div className="grid grid-cols-2 gap-4">
            <ScrollColumn images={colA} direction="up" duration={32} />
            <div className="pt-10">
              <ScrollColumn images={colB} direction="down" duration={38} />
            </div>
          </div>
        </motion.div>

        {/* Mobile: simple horizontal scroll */}
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:hidden">
          {images.slice(0, 5).map((img, i) => (
            <div key={i} className="aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
