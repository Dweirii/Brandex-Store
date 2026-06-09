import Link from "next/link"

interface Subcategory {
  id: string
  name: string
  productCount?: number
  image?: string | null
}

interface CategorySubcategoryGridProps {
  subcategories: Subcategory[]
  hrefBase: string
}

/** Image-backed category cards (top N). Product image + gradient + name/count. */
export default function CategorySubcategoryGrid({ subcategories, hrefBase }: CategorySubcategoryGridProps) {
  if (subcategories.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {subcategories.map((s) => (
        <Link
          key={s.id}
          href={`${hrefBase}?subcategory=${s.id}`}
          className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.06] transition-shadow hover:shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
        >
          {s.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.image}
              alt={s.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={640}
              height={800}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
          )}

          {/* Gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {/* Label */}
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <p className="text-sm font-semibold leading-tight text-white">{s.name}</p>
            <p className="mt-0.5 text-[11px] font-medium text-white/70">
              {(s.productCount ?? 0).toLocaleString()} templates
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
