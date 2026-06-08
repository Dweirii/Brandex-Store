"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GlobalSearchBar from "./global-search-bar"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface SearchToolbarProps {
  categories: Category[]
  /** When false, hide the in-bar category dropdown and show just the search
   *  (used on mobile for a clean, prominent search bar). */
  showCategory?: boolean
  /** Taller, hero-sized bar (used on mobile). */
  large?: boolean
}

/**
 * Search toolbar:
 *   [ Category ▾ │ 🔍 Search……………… ]   (showCategory)
 *   [ 🔍 Search……………… ]                 (compact / mobile)
 *
 * The in-bar category dropdown writes the `categoryId` search param, which
 * GlobalSearchBar already reads to scope a search to one category.
 */
export function SearchToolbar({ categories, showCategory = true, large = false }: SearchToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Only these categories are searchable from the in-bar dropdown.
  const prettyLabel = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes("mockup")) return "Mockups"
    if (n.includes("packaging")) return "Packaging"
    return name
  }
  const navCategories = categories.filter((c) => {
    const n = c.name.toLowerCase()
    return n.includes("packaging") || n.includes("mockup")
  })

  const currentCategoryId = searchParams.get("categoryId") || "all"
  const currentCategory = navCategories.find((c) => c.id === currentCategoryId)
  const currentName = currentCategory ? prettyLabel(currentCategory.name) : "All"

  const selectCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id === "all") {
      params.delete("categoryId")
    } else {
      params.set("categoryId", id)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="flex items-center">
      {/* Large search bar with in-bar category dropdown */}
      <div
        className={cn(
          "flex flex-1 items-center bg-[#F4F4F4] pr-2 transition-all dark:bg-muted/30",
          "focus-within:bg-background focus-within:shadow-sm hover:bg-[#ededed] dark:hover:bg-muted/40",
          large
            ? "h-11 rounded-full border border-border/70 focus-within:border-primary/40"
            : "h-9 rounded-full border-none focus-within:border-primary/30",
          showCategory ? "pl-1" : large ? "pl-3" : "pl-2"
        )}
      >
        {showCategory && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-4 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
                >
                  <span className="max-w-[120px] truncate">{currentName}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={10} className="max-h-80 w-56 overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => selectCategory("all")}
                  className={cn("cursor-pointer", currentCategoryId === "all" && "bg-primary/10 text-primary font-medium")}
                >
                  All 
                </DropdownMenuItem>
                {navCategories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className={cn(
                      "cursor-pointer",
                      currentCategoryId === category.id && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {prettyLabel(category.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="mx-1 h-6 w-px shrink-0 bg-border/70" />
          </>
        )}

        {/* The actual search input, flattened to blend into this pill */}
        <GlobalSearchBar
          className="flex-1"
          placeholder={`Search ${currentCategoryId === "all" ? "all resources" : currentName}…`}
          inputClassName={cn(
            "rounded-none border-0 bg-transparent rounded-full shadow-none ring-0 hover:bg-transparent hover:border-0 hover:shadow-none focus-visible:ring-0",
            large ? "h-11 text-base" : "h-9"
          )}
        />
      </div>
    </div>
  )
}
