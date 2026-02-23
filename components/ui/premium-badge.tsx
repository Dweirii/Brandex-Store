"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps extends React.ComponentProps<"div"> {

  size?: "sm" | "default" | "lg"

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
        "text-black shadow-md",
        "border",
        sizeClasses[size],
        className
      )}
      style={{ background: 'linear-gradient(to right, #009916, #00c853)', boxShadow: '0 4px 6px -1px rgba(0, 200, 83, 0.2)', borderColor: 'rgba(0, 200, 83, 0.3)' }}
      {...props}
    >
      {label}
    </div>
  )
}

