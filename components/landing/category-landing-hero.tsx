import Link from "next/link"
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

/** One infinite vertical-scrolling image column. */
function ScrollColumn({ images, direction, duration }: { images: HeroImage[]; direction: "up" | "down"; duration: number }) {
  if (images.length === 0) return null
  const list = [...images, ...images] // duplicate for seamless loop
  const animationClass = direction === "up" ? "packaging-scroll-up" : "packaging-scroll-down"

  return (
    <div className={`packaging-scroll-track ${animationClass}`} style={{ animationDuration: `${duration}s` }}>
      {list.map((img, i) => (
        <div key={`${img.url}-${i}`} className="overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.05]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt}
            className="aspect-[4/5] w-full object-cover"
            width={800}
            height={1000}
            loading={i < 2 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : undefined}
            draggable={false}
          />
        </div>
      ))}
    </div>
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
      <div className="grid items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16">
        {/* Copy */}
        <div className="packaging-fade-up" style={{ animationDelay: "0.03s" }}>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>

          <h1
            className="packaging-fade-up mt-4 text-[32px] font-semibold leading-[1.06] tracking-tight text-foreground sm:mt-5 sm:text-[56px] sm:leading-[1.04]"
            style={{ animationDelay: "0.09s" }}
          >
            {titleLead} <span className="text-primary">{titleAccent}</span>
          </h1>

          <p
            className="packaging-fade-up mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg"
            style={{ animationDelay: "0.15s" }}
          >
            {subtitle}
          </p>

          {/* Trust badges */}
          <ul className="packaging-fade-up mt-5 flex flex-wrap gap-x-4 gap-y-2 sm:mt-6 sm:gap-x-5" style={{ animationDelay: "0.21s" }}>
            {badges.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 sm:text-sm">
                <Check className="h-4 w-4 text-primary" />
                {b}
              </li>
            ))}
          </ul>

          <div
            className="packaging-fade-up mt-6 flex flex-col items-stretch gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ animationDelay: "0.27s" }}
          >
            <Link
              href={browseHref}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:px-7"
            >
              {browseLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border/70 px-5 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground sm:w-auto sm:border-transparent"
            >
              {secondaryLabel}
            </Link>
          </div>

          <dl
            className="packaging-fade-up mt-8 grid grid-cols-3 gap-3 border-t border-border/60 pt-5 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-4 sm:pt-7"
            style={{ animationDelay: "0.33s" }}
          >
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-2xl">{s.value}</dt>
                <dd className="text-[11px] text-muted-foreground sm:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Dual vertical-scroll image columns */}
        <div
          className="packaging-fade-in relative hidden h-[300px] overflow-hidden sm:block sm:h-[440px] lg:h-[560px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <ScrollColumn images={colA} direction="up" duration={32} />
            <div className="pt-10">
              <ScrollColumn images={colB} direction="down" duration={38} />
            </div>
          </div>
        </div>

        {/* Mobile: simple horizontal scroll */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:hidden">
          {images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className="aspect-[4/5] w-[42vw] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.05]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover"
                width={400}
                height={500}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
