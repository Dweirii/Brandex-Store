"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"

interface PriceFilterProps {
  className?: string
}

export default function PriceFilter({ className }: PriceFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const currentFilter = searchParams.get('priceFilter') || 'all'
  
  const handleFilterChange = (filter: 'paid' | 'free' | 'all') => {
    startTransition(() => {
      try {
        const params = new URLSearchParams(searchParams.toString())
        
        if (filter === 'all') {
          params.delete('priceFilter')
        } else {
          params.set('priceFilter', filter)
        }
        
        // Reset to first page when filter changes
        params.delete('page')
        
        const queryString = params.toString()
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname
        
        router.push(newUrl)
      } catch (error) {
        console.error('Error applying price filter:', error)
      }
    })
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1 bg-muted/30 p-1 rounded-lg", className)} role="group" aria-label="Price filter">
      <button
        onClick={() => handleFilterChange('all')}
        disabled={isPending}
        aria-pressed={currentFilter === 'all'}
        className={cn(
          "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          currentFilter === 'all' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        All
      </button>
      
      <button
        onClick={() => handleFilterChange('paid')}
        disabled={isPending}
        aria-pressed={currentFilter === 'paid'}
        className={cn(
          "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          currentFilter === 'paid' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        Paid
      </button>
      
      <button
        onClick={() => handleFilterChange('free')}
        disabled={isPending}
        aria-pressed={currentFilter === 'free'}
        className={cn(
          "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          currentFilter === 'free' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        Free
      </button>
    </div>
  )
} 