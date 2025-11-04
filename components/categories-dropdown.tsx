"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"

interface CategoriesDropdownProps {
  categories: Category[]
}

export default function CategoriesDropdown({ categories }: CategoriesDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isCategoryPage = pathname?.startsWith("/category/")

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 h-9",
            isCategoryPage && "border-primary text-primary bg-primary/5"
          )}
        >
          <Grid3x3 className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 max-h-[400px] overflow-y-auto">
        {categories.map((category) => {
          const isActive = pathname === `/category/${category.id}`
          return (
            <DropdownMenuItem
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "cursor-pointer",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
            >
              {category.name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

