"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"
import { ClipboardList, Search } from "lucide-react"

interface CategoryNavProps {
  categories: Category[]
}

// Mockups category ID - treat "/" as this category
const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

const CATEGORY_ORDER = [
  "fd995552-baa8-4b86-bf7e-0acbefd43fd6", // Packaging
  "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a", // Mockup Studio
  "374e7e6a-f6d9-45a8-b1ce-72aad0450367", // Signature Services
  "6214c586-a7c7-4f71-98ab-e1bc147a07f4", // Images
  "b0469986-6cb9-4a35-8cd6-6cc9ec51a561", // Vectors
  "1364f5f9-6f45-48fd-8cd1-09815e1606c0", // PSD Lab
  "c302954a-6cd2-43a7-9916-16d9252f754c", // Motion Library
]

function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.id)
    const bi = CATEGORY_ORDER.indexOf(b.id)
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname()

  if (!categories || categories.length === 0) {
    return null
  }

  const sorted = sortCategories(categories)

  const isIntakeActive = pathname === "/intake" || pathname.startsWith("/intake/")

  return (
    <div className="hidden md:flex items-center gap-2 relative z-10 pointer-events-auto w-full min-w-0">
      {/* Scrollable category list */}
      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        <nav className="flex items-center gap-1 min-w-max h-full py-1">
          {sorted.map((category) => {
            const isActive =
              pathname === `/category/${category.id}` ||
              (pathname === "/" && category.id === MOCKUPS_CATEGORY_ID)

            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 relative z-10 shrink-0",
                  isActive
                    ? "text-foreground bg-muted/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {category.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Intake actions — pinned to the right, never scrolls */}
      <div className="shrink-0 pl-2 border-l border-border flex items-center gap-1">
        <Link
          href="/intake"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md whitespace-nowrap transition-all duration-200",
            isIntakeActive && !pathname.startsWith("/intake/track")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Start a Project
        </Link>
        <Link
          href="/intake/track"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200",
            pathname.startsWith("/intake/track")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          <Search className="w-3.5 h-3.5" />
          Track Request
        </Link>
      </div>
    </div>
  )
}

