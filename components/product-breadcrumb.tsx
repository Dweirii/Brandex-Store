import Link from "next/link"
import type { Category, Subcategory } from "@/types"
import { categoryHref } from "@/lib/category-slugs"

interface ProductBreadcrumbProps {
  category: Category
  subcategory?: Subcategory
  productName: string
}

export function ProductBreadcrumb({
  category,
  subcategory,
  productName,
}: ProductBreadcrumbProps) {
  const items = [
    { label: "Mockups", href: "/" },
    { label: category.name, href: categoryHref(category) },
    ...(subcategory ? [{ label: subcategory.name, href: null }] : []),
    { label: productName, href: null },
  ]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-sm mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className="select-none" style={{ color: "#9CA3AF" }}>›</span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:underline transition-colors"
                className="text-muted-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium truncate max-w-[180px] sm:max-w-xs"
                className={isLast ? "text-foreground" : "text-muted-foreground"}
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
