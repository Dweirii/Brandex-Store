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
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 h-8 px-2 text-xs",
            isCategoryPage && "text-primary bg-primary/5"
          )}
        >
          <Grid3x3 className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Categories</span>
          <ChevronDown className="h-2.5 w-2.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 max-h-[350px] overflow-y-auto">
        {categories.map((category) => {
          const isActive = pathname === `/category/${category.id}`
          return (
            <DropdownMenuItem
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "cursor-pointer text-sm py-2",
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

