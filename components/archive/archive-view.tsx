import type { Product } from "@/types"
import type { ApprovedSubcategory } from "@/actions/get-subcategories"
import ArchiveInfinite from "./archive-infinite"
import ArchiveFilterTabs from "./archive-filter-tabs"
import ArchiveSubcategoryPills from "./archive-subcategory-pills"
import { ArchiveFilterProvider } from "./archive-filter-provider"
import ArchiveGridDimmer from "./archive-grid-dimmer"
import SortFilter from "@/components/sort-filter"

interface ArchiveViewProps {
  heading: string
  products: Product[]
  /** 1-based current page (from the `?page=` search param). */
  page: number
  pageCount: number
  total: number
  /** Passed to loadArchiveProducts for infinite scroll: "home" or a categoryId. */
  scope: string
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  subcategoryId?: string
  /** Items per page fetched as the user scrolls. */
  pageSize: number
  /** Optional tagline shown under the heading (e.g. on the home page). */
  subtitle?: string
  /** Subcategory pills (empty → no pills row). */
  subcategories?: ApprovedSubcategory[]
}

/**
 * rawpixel-style archive layout:
 *   title + count  ·············  [All|Free|Premium]  Sort▾
 *   subcategory pills row
 *   ──────────────────────────────────────────────
 *   paginated masonry-grid + Prev/Next controls
 * Shared by the home page and category pages.
 */
export default function ArchiveView({
  heading,
  products,
  page,
  pageCount,
  scope,
  priceFilter,
  sortBy,
  subcategoryId,
  pageSize,
  subtitle,
  subcategories = [],
}: ArchiveViewProps) {
  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url))
  )

  return (
    <ArchiveFilterProvider>
      <div className="w-full px-4 pt-8 sm:px-6 lg:px-8">
        {/* Toolbar: title + count (left) · filters + sort (right) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              {heading}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArchiveFilterTabs />
            <SortFilter />
          </div>
        </div>

        {/* Subcategory pills (only when the category has subcategories) */}
        {subcategories.length > 0 && (
          <div className="mt-4">
            <ArchiveSubcategoryPills subcategories={subcategories} />
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 border-t border-border/60" />

        {/* Paginated grid — dims (not skeleton) while a page change is in flight */}
        <ArchiveGridDimmer>
          <div id="archive-grid" className="scroll-mt-24 pb-10 pt-6">
            {visible.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No resources found.</p>
            ) : (
              <ArchiveInfinite
                key={`${scope}-${priceFilter ?? "all"}-${sortBy ?? "newest"}-${subcategoryId ?? ""}`}
                initialProducts={products}
                scope={scope}
                priceFilter={priceFilter}
                sortBy={sortBy}
                subcategoryId={subcategoryId}
                initialPage={page}
                pageCount={pageCount}
                pageSize={pageSize}
              />
            )}
          </div>
        </ArchiveGridDimmer>
      </div>
    </ArchiveFilterProvider>
  )
}
