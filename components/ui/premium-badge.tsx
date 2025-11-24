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
    sm: "text-[10px] px-1.5 py-0.5",
    default: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1.5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold w-fit whitespace-nowrap shrink-0",
        "bg-[#D4AF37] text-white",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {label}
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
        "inline-flex items-center justify-center rounded-md font-bold w-fit whitespace-nowrap shrink-0",
        "bg-gradient-to-r from-green-600 to-[#00FF00]",
        "text-black shadow-md shadow-green-500/20",
        "border border-green-400/30",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {label}
    </div>
  )
}

