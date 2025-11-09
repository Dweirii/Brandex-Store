"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortFilterProps {
  className?: string
}

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: "mostPopular", label: "Most Popular" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "nameAsc", label: "Name: A-Z" },
  { value: "nameDesc", label: "Name: Z-A" },
]

export default function SortFilter({ className }: SortFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const currentSort = searchParams.get('sortBy') || 'mostPopular'
  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Most Popular"
  
  const handleSortChange = (sortValue: string) => {
    startTransition(() => {
      try {
        const params = new URLSearchParams(searchParams.toString())
        
        if (sortValue === 'mostPopular') {
          params.delete('sortBy')
        } else {
          params.set('sortBy', sortValue)
        }
        
        // Reset to first page when sort changes
        params.delete('page')
        
        const queryString = params.toString()
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname
        
        router.push(newUrl)
      } catch (error) {
        console.error('Error applying sort filter:', error)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-lg border border-border/60 bg-background hover:bg-muted/50 transition-all duration-200 flex items-center gap-2 justify-between min-w-[180px]",
            isPending && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline text-muted-foreground">Sort:</span>
            <span className="text-foreground">{currentSortLabel}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-background border-border/60 rounded-lg shadow-sm">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              "cursor-pointer flex items-center justify-between text-sm",
              currentSort === option.value && "bg-muted/50"
            )}
          >
            <span className={currentSort === option.value ? "text-foreground font-medium" : "text-muted-foreground"}>{option.label}</span>
            {currentSort === option.value && (
              <Check className="h-4 w-4 text-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

