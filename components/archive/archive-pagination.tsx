"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useArchiveFilter } from "./archive-filter-provider"

interface ArchivePaginationProps {
  page: number
  pageCount: number
}

/**
 * Prev / page-numbers / Next pagination for the archive grid.
 *
 * Navigation goes through the shared archive transition (`navigate`), so the
 * current page stays on screen and dims while the next one loads — no skeleton
 * flash. The page lives in the `?page=` search param so URLs are shareable and
 * the browser back button works.
 */
export default function ArchivePagination({ page, pageCount }: ArchivePaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { navigate, isPending } = useArchiveFilter()

  if (pageCount <= 1) return null

  const go = (target: number) => {
    const next = Math.min(Math.max(1, target), pageCount)
    if (next === page) return

    const params = new URLSearchParams(searchParams.toString())
    if (next === 1) params.delete("page")
    else params.set("page", String(next))
    const qs = params.toString()
    navigate(qs ? `${pathname}?${qs}` : pathname)

    // Start the new page at the top of the grid.
    if (typeof window !== "undefined") {
      document.getElementById("archive-grid")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const pages = buildPageList(page, pageCount)

  const arrowClasses =
    "inline-flex h-9 items-center gap-1 rounded-full border border-border/60 bg-[#F4F4F4] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-[#ededed] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-muted/30 dark:hover:bg-muted/50"

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1 || isPending}
        className={arrowClasses}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-2 text-sm text-muted-foreground select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              disabled={isPending}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
                p === page
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount || isPending}
        className={arrowClasses}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

/**
 * Compact page list with ellipses: always shows first, last, current and its
 * neighbours, e.g. [1, …, 4, 5, 6, …, 20].
 */
function buildPageList(page: number, pageCount: number): Array<number | "…"> {
  const out: Array<number | "…"> = []
  const window = 1 // neighbours on each side of the current page
  const first = 1
  const last = pageCount

  for (let p = first; p <= last; p++) {
    const isEdge = p === first || p === last
    const isNear = Math.abs(p - page) <= window
    if (isEdge || isNear) {
      out.push(p)
    } else if (out[out.length - 1] !== "…") {
      out.push("…")
    }
  }
  return out
}
