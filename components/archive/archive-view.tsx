import type { Product } from "@/types"
import type { ApprovedSubcategory } from "@/actions/get-subcategories"
import ArchiveInfiniteGrid from "./archive-infinite-grid"
import ArchiveFilterTabs from "./archive-filter-tabs"
import ArchiveSubcategoryPills from "./archive-subcategory-pills"
import { ArchiveFilterProvider } from "./archive-filter-provider"
import ArchiveGridDimmer from "./archive-grid-dimmer"
import SortFilter from "@/components/sort-filter"

interface ArchiveViewProps {
  heading: string
  products: Product[]
  pageCount: number
  total: number
  /** "home" → merged feed; otherwise a categoryId. Used for infinite scroll. */
  scope: string
  pageSize: number
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  /** Subcategory pills (empty → no pills row). */
  subcategories?: ApprovedSubcategory[]
  /** Currently-selected subcategory id (filters the grid). */
  subcategoryId?: string
}

/**
 * rawpixel-style archive layout:
 *   title + count  ·············  [All|Free|Premium]  Sort▾
 *   subcategory pills row
 *   ──────────────────────────────────────────────
 *   infinite-scroll masonry grid
 * Shared by the home page and category pages.
 */
export default function ArchiveView({
  heading,
  products,
  pageCount,
  total,
  scope,
  pageSize,
  priceFilter,
  sortBy,
  subcategories = [],
  subcategoryId,
}: ArchiveViewProps) {
  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url))
  )

  return (
    <ArchiveFilterProvider>
      <div className="w-full px-4 pt-8 sm:px-6 lg:px-8">
        {/* Toolbar: title + count (left) · filters + sort (right) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-xl font-bold capitalize text-foreground sm:text-2xl">
              {heading.toLowerCase()}
            </h1>
            {total > 0 && (
              <span className="text-sm text-muted-foreground">{total.toLocaleString()} items</span>
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

        {/* Infinite-scroll masonry grid — dims (not skeleton) while filtering */}
        <ArchiveGridDimmer>
          <div id="archive-grid" className="scroll-mt-24 pb-10 pt-6">
            {visible.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No resources found.</p>
            ) : (
              <ArchiveInfiniteGrid
                initialProducts={visible}
                pageCount={pageCount}
                scope={scope}
                pageSize={pageSize}
                priceFilter={priceFilter}
                sortBy={sortBy}
                subcategoryId={subcategoryId}
              />
            )}
          </div>
        </ArchiveGridDimmer>
      </div>
    </ArchiveFilterProvider>
  )
}
