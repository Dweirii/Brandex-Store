import Link from "next/link"

interface MarqueeItem {
  id: string
  name: string
  productCount?: number
}

interface CategoryMarqueeProps {
  items: MarqueeItem[]
  hrefBase: string
}

/** Infinite horizontal marquee of subcategory chips (real data). */
export default function CategoryMarquee({ items, hrefBase }: CategoryMarqueeProps) {
  if (items.length === 0) return null
  const track = [...items, ...items] // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-background/60 py-4">
      <div className="packaging-marquee-track" style={{ animationDuration: "45s" }}>
        {track.map((s, i) => (
          <Link
            key={`${s.id}-${i}`}
            href={`${hrefBase}?subcategory=${s.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s.name}
            {s.productCount != null && (
              <span className="rounded-full bg-[#F4F4F4] px-2 py-0.5 text-xs font-bold text-muted-foreground dark:bg-muted/40">
                {s.productCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent dark:from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent dark:from-background" />
    </div>
  )
}
