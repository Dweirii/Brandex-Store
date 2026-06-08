"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useArchiveFilter } from "./archive-filter-provider"

interface Subcategory {
  id: string
  name: string
  productCount?: number
}

interface ArchiveSubcategoryPillsProps {
  subcategories: Subcategory[]
}

/**
 * Row 3 — real subcategory pills. Selecting one writes the `subcategory`
 * search param (the subcategory id) which the page uses to filter products.
 */
export default function ArchiveSubcategoryPills({ subcategories }: ArchiveSubcategoryPillsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { navigate, isPending } = useArchiveFilter()

  if (!subcategories.length) return null

  const current = searchParams.get("subcategory") || "all"

  const select = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id === "all") params.delete("subcategory")
    else params.set("subcategory", id)
    params.delete("page")
    const qs = params.toString()
    navigate(qs ? `${pathname}?${qs}` : pathname)
  }

  const pill = (active: boolean) =>
    cn(
      "h-9 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
      active
        ? "bg-foreground text-background"
        : "bg-[#F4F4F4] text-foreground/75 hover:bg-[#ededed] hover:text-foreground dark:bg-muted/30 dark:hover:bg-muted/50",
      isPending && "opacity-60"
    )

  return (
    <div className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1">
      <button type="button" onClick={() => select("all")} className={pill(current === "all")}>
        All
      </button>
      {subcategories.map((s) => (
        <button key={s.id} type="button" onClick={() => select(s.id)} className={pill(current === s.id)}>
          {s.name}
        </button>
      ))}
    </div>
  )
}
