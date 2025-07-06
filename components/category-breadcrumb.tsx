"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryBreadcrumbProps {
  categoryName: string
  className?: string
}

export function CategoryBreadcrumb({ categoryName, className }: CategoryBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6", className)}>
      <Link href="/" className="flex items-center hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        <Home className="w-4 h-4" />
        <span className="ml-1">Home</span>
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 dark:text-gray-100 font-medium">{categoryName}</span>
    </nav>
  )
}
