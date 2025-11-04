"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/Button"
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
    <div className={cn("flex flex-wrap items-center gap-2", className)} role="group" aria-label="Price filter">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('all')}
        disabled={isPending}
        aria-pressed={currentFilter === 'all'}
        className={cn(
          "transition-all duration-200",
          currentFilter === 'all' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        All
      </Button>
      
      <Button
        variant={currentFilter === 'paid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('paid')}
        disabled={isPending}
        aria-pressed={currentFilter === 'paid'}
        className={cn(
          "transition-all duration-200",
          currentFilter === 'paid' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        Paid
      </Button>
      
      <Button
        variant={currentFilter === 'free' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('free')}
        disabled={isPending}
        aria-pressed={currentFilter === 'free'}
        className={cn(
          "transition-all duration-200",
          currentFilter === 'free' 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        Free
      </Button>
    </div>
  )
} 