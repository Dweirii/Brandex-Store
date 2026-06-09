"use client"

import { CategoryBreadcrumb } from "@/components/category-breadcrumb"

interface CategoryHeaderProps {
  categoryName: string
  totalProducts: number
  currentPage: number
}

export function CategoryHeader({ categoryName }: CategoryHeaderProps) {
  return (
    <div className="space-y-4">
      <CategoryBreadcrumb categoryName={categoryName} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{categoryName}</h1>
        </div>
      </div>
    </div>
  )
}
