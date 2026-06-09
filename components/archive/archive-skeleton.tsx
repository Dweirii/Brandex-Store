import { cn } from "@/lib/utils"

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

/** Shimmer skeleton for the archive's responsive grid (server-rendered). */
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
      <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2100px]:grid-cols-6", withHeader && "pt-6")}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={cn(shimmer, "aspect-[4/5] rounded-[14px]")} />
        ))}
      </div>
    </div>
  )
}
