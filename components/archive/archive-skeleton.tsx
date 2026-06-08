import { cn } from "@/lib/utils"

// Varied heights so the skeleton mimics the masonry grid's organic rhythm.
const HEIGHTS = [240, 320, 280, 360, 250, 300, 220, 340, 270, 310, 230, 290]

interface ArchiveSkeletonProps {
  count?: number
  /** Show the toolbar placeholder above the grid (initial load). */
  withHeader?: boolean
  /** Show the subcategory pills placeholder row (category pages only). */
  withPills?: boolean
  className?: string
}

const shimmer =
  "relative overflow-hidden bg-neutral-200/70 dark:bg-neutral-800/60 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/55 before:to-transparent dark:before:via-white/10"

/**
 * Shimmer skeleton for the archive. Uses CSS multi-column so it renders on the
 * server (initial Suspense fallback) without JS.
 */
export default function ArchiveSkeleton({ count = 12, withHeader = true, withPills = true, className }: ArchiveSkeletonProps) {
  return (
    <div className={className}>
      {withHeader && (
        <>
          {/* Toolbar row: title + controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className={cn(shimmer, "h-7 w-44 rounded-md")} />
            <div className="flex items-center gap-2">
              <div className={cn(shimmer, "h-9 w-44 rounded-full")} />
              <div className={cn(shimmer, "h-9 w-40 rounded-full")} />
            </div>
          </div>
          {/* Pills row */}
          {withPills && (
            <div className="mt-4 flex gap-2 overflow-hidden">
              {[72, 96, 84, 110, 68, 90, 100].map((w, i) => (
                <div key={i} className={cn(shimmer, "h-9 shrink-0 rounded-full")} style={{ width: `${w}px` }} />
              ))}
            </div>
          )}
          <div className="mt-4 border-t border-border/60" />
        </>
      )}

      {/* Grid */}
      <div className={cn("columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4", withHeader && "pt-6")}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <div className={cn(shimmer, "rounded-[14px]")} style={{ height: `${HEIGHTS[i % HEIGHTS.length]}px` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
