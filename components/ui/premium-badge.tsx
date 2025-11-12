"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps extends React.ComponentProps<"div"> {

  size?: "sm" | "default" | "lg"

  showIcon?: boolean

  label?: string
}

/**
 * Premium Badge Component
 * 
 * A badge component styled with gold/premium colors to indicate premium products.
 * Used on product cards for paid products that are included in premium subscription.
 * 
 * @example
 * <PremiumBadge />
 * <PremiumBadge size="sm" />
 * <PremiumBadge label="Premium Only" showIcon={false} />
 */
export function PremiumBadge({
  className,
  size = "default",
  showIcon = true,
  label = "Premium",
  ...props
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-0.5 [&>svg]:size-2.5",
    default: "text-xs px-2 py-1 gap-1 [&>svg]:size-3",
    lg: "text-sm px-2.5 py-1.5 gap-1.5 [&>svg]:size-4",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold w-fit whitespace-nowrap shrink-0",
        "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500",
        "text-white shadow-lg shadow-amber-500/30",
        "border border-amber-400/50",
        "backdrop-blur-sm",
        "transition-all duration-200",
        "hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105",
        "relative overflow-hidden",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
      

      <div className="relative flex items-center gap-1">
        {showIcon && (
          <Sparkles
            className="size-3 fill-current"
            aria-hidden="true"
          />
        )}
        <span className="font-semibold tracking-wide">{label}</span>
      </div>
    </div>
  )
}

/**
 * Alternative simpler premium badge variant
 * For use cases where a more subtle badge is needed
 */
export function PremiumBadgeSimple({
  className,
  size = "default",
  label = "Premium",
  ...props
}: Omit<PremiumBadgeProps, "showIcon">) {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    default: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1.5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold w-fit whitespace-nowrap shrink-0",
        "bg-gradient-to-r from-amber-600 to-yellow-500",
        "text-white shadow-md shadow-amber-500/20",
        "border border-amber-400/30",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {label}
    </div>
  )
}

