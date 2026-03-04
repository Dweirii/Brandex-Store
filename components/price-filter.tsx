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
    <div className={cn("flex items-center gap-1 bg-muted/30 border border-border/60 p-1 rounded-xl h-[42px]", className)} role="group" aria-label="Price filter">
      <button
        onClick={() => handleFilterChange('all')}
        disabled={isPending}
        aria-pressed={currentFilter === 'all'}
        className={cn(
          "h-full px-4 text-[13px] font-bold rounded-lg transition-all duration-300",
          currentFilter === 'all'
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
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
          "h-full px-4 text-[13px] font-bold rounded-lg transition-all duration-300",
          currentFilter === 'paid'
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
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
          "h-full px-4 text-[13px] font-bold rounded-lg transition-all duration-300",
          currentFilter === 'free'
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        Free
      </button>
    </div>
  )
} 