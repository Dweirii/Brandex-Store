"use client"

import { cn } from "@/lib/utils"
import { useArchiveFilter } from "./archive-filter-provider"

/**
 * Wraps the grid: while a filter navigation is pending, the current results
 * dim and a spinner appears — no skeleton flash, results swap in when ready.
 */
export default function ArchiveGridDimmer({ children }: { children: React.ReactNode }) {
  const { isPending } = useArchiveFilter()

  return (
    <div className="relative">
      <div className={cn("transition-opacity duration-200", isPending && "pointer-events-none opacity-40")}>
        {children}
      </div>
      {isPending && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-16">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-muted-foreground shadow-md ring-1 ring-border/60 backdrop-blur">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            Updating…
          </span>
        </div>
      )}
    </div>
  )
}
