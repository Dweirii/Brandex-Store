"use client"

import { useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useArchiveFilter } from "./archive-filter-provider"

const TABS = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Premium", value: "paid" },
] as const

/**
 * Compact segmented filter (All / Free / Premium) for the archive toolbar.
 * Drives the `priceFilter` search param via the shared archive transition.
 */
export default function ArchiveFilterTabs() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { navigate, isPending } = useArchiveFilter()

  const current = searchParams.get("priceFilter") || "all"

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("priceFilter")
    } else {
      params.set("priceFilter", value)
    }
    params.delete("page")
    const qs = params.toString()
    navigate(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <nav
      aria-label="Filter resources"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[#F4F4F4] p-1 dark:bg-muted/30",
        isPending && "opacity-70"
      )}
    >
      {TABS.map((tab) => {
        const active = current === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleSelect(tab.value)}
            aria-pressed={active}
            className={cn(
              "h-8 rounded-full px-4 text-sm font-semibold transition-colors",
              active
                ? "bg-white text-foreground shadow-sm dark:bg-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
