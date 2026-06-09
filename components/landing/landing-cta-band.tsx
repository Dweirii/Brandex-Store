import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface LandingCtaBandProps {
  title: string
  subtitle: string
  href: string
  label: string
  /** Product previews used to build the mosaic background (already proxied). */
  images: { url: string; alt: string }[]
}

/**
 * Dark CTA band with a product-preview mosaic bleeding in from the edges and a
 * radial vignette keeping the centre dark so the headline + button stay crisp.
 * Shared by the packaging and mockups landing pages.
 */
export default function LandingCtaBand({ title, subtitle, href, label, images }: LandingCtaBandProps) {
  // Repeat the available previews so the mosaic always fills the band, even
  // when only a handful of images came back.
  const tiles = images.length
    ? Array.from({ length: 24 }, (_, i) => images[i % images.length])
    : []

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-foreground px-6 py-20 text-center ring-1 ring-white/10 sm:px-12 sm:py-28">
      {tiles.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          {/* Mosaic of real product previews */}
          <div className="grid h-full grid-cols-4 gap-2.5 p-2.5 sm:grid-cols-6 lg:grid-cols-8">
            {tiles.map((img, i) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Vignette: previews stay vivid at the edges, centre goes near-black */}
          <div className="absolute inset-0 bg-[radial-gradient(115%_115%_at_50%_50%,rgba(8,8,8,0.97)_36%,rgba(8,8,8,0.78)_58%,rgba(8,8,8,0.4)_100%)]" />
          {/* Brand glow behind the CTA */}
          <div className="absolute left-1/2 top-1/2 h-56 w-[34rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[110px]" />
        </div>
      )}

      <div className="relative z-10">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-background drop-shadow-sm sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-background/70 sm:text-base">
          {subtitle}
        </p>
        <Link
          href={href}
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          {label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
