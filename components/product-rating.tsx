"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductRatingProps {
  rating: number
  totalReviews?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

const ProductRating = ({ 
  rating, 
  totalReviews = 0, 
  size = "md",
  showCount = true,
  className 
}: ProductRatingProps) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= Math.floor(rating)
          const partial = star === Math.ceil(rating) && rating % 1 !== 0
          
          return (
            <div key={star} className="relative">
              {/* Background star */}
              <Star className={cn(sizeClasses[size], "text-muted-foreground fill-muted")} />
              
              {/* Filled star */}
              {(filled || partial) && (
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(rating % 1) * 100}%` : '100%' }}
                >
                  <Star className={cn(sizeClasses[size], "text-yellow-500 fill-yellow-500")} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showCount && totalReviews > 0 && (
        <>
          <span className={cn("font-semibold text-foreground", textSizeClasses[size])}>
            {rating.toFixed(1)}
          </span>
          <span className={cn("text-muted-foreground", textSizeClasses[size])}>
            ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
          </span>
        </>
      )}
    </div>
  )
}

export { ProductRating }
