"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface CategoryNavProps {
  categories: Category[]
}

// Mockups category ID - treat "/" as this category
const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

export default function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname()

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="hidden md:block overflow-x-auto scrollbar-hide relative z-10 pointer-events-auto">
      <nav className="flex items-center gap-1 min-w-max h-full py-1 pr-2">
        {categories.map((category) => {
          // Active if on category page OR if on homepage and this is the mockups category
          const isActive = 
            pathname === `/category/${category.id}` || 
            (pathname === "/" && category.id === MOCKUPS_CATEGORY_ID)
          
          return (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 relative z-10 flex-shrink-0",
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
  )
}

