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
  
  const currentSort = searchParams.get('sortBy') || 'newest'
  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Newest"
  
  const handleSortChange = (sortValue: string) => {
    startTransition(() => {
      try {
        const params = new URLSearchParams(searchParams.toString())
        
        if (sortValue === 'newest') {
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
            "px-3 py-1.5 sm:px-4 text-sm font-medium rounded-lg border border-border/60 bg-background hover:bg-muted/50 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 sm:min-w-[160px]",
            isPending && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="hidden sm:inline text-muted-foreground">Sort:</span>
          <span className="text-foreground hidden sm:inline">{currentSortLabel}</span>
          <span className="text-foreground sm:hidden text-xs">Sort</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[190px] bg-background border-border/60 rounded-xl shadow-md p-1">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              "cursor-pointer flex items-center justify-between text-sm rounded-lg px-3 py-2",
              "focus:bg-muted/50 focus:text-foreground",
              currentSort === option.value
                ? "text-primary font-semibold bg-primary/8 focus:bg-primary/10 focus:text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{option.label}</span>
            {currentSort === option.value && (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

