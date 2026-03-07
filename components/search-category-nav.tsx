"use client"

import { ChevronDown } from "lucide-react"
import type { Category } from "@/types"

interface SearchCategoryNavProps {
  categories: Category[]
  selectedCategoryId: string
  onCategoryChange: (id: string) => void
}

export default function SearchCategoryNav({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: SearchCategoryNavProps) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="relative inline-flex items-center">
      <span className="absolute left-3 text-[13px] font-bold text-muted-foreground pointer-events-none select-none z-10 whitespace-nowrap">
        Category:
      </span>
      <select
        value={selectedCategoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-[42px] pl-[82px] pr-8 text-[13px] font-bold rounded-xl border border-border/60 bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-foreground/30"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    </div>
  )
}
