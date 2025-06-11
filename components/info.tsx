"use client"

import type React from "react"

import type { Product } from "@/types"
import Currency from "./ui/currency"
import { Button } from "@/components/ui/Button"
import { ShoppingCart, Check } from "lucide-react"
import { type MouseEventHandler, useState } from "react"
import useCart from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface InfoProps {
  data: Product
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    setIsAdding(true)
    cart.addItem(data)

    // Reset animation after 1.5 seconds
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div className="relative overflow-hidden bg-card rounded-2xl p-4 shadow-lg border border-border">
      {/* Background accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-muted/50 to-background rounded-full opacity-70" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-muted/50 to-background rounded-full opacity-70" />

      <div className="relative z-10">
        {/* Product Name */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">{data?.name}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-foreground to-muted-foreground rounded-full" />
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                <Currency value={data?.price} />
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-sm">
            <div className="bg-gradient-to-r from-background to-card px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Description</h3>
            </div>
            <div className="p-6 bg-card">
              <p className="text-base leading-relaxed text-foreground">{data.description}</p>
            </div>
          </div>
        )}

      {data.keywords && data.keywords.length > 0 && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-sm">
          <div className="bg-gradient-to-r from-background to-card px-6 py-3 border-b border-border">
            <h3 className="text-sm font-semibold tracking-wider text-foreground">KEYWORDS</h3>
          </div>
          <div className="px-6 py-3 flex flex-wrap gap-2">
            {data.keywords.map((keyword, index) => (
              <div key={index} className="rounded-md bg-accent/5 px-4 py-2 w-max">
                <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {keyword}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
        <hr className="my-8 border-border" />

        {/* Add to Cart Button */}
        <div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "w-full h-12 text-base font-medium rounded-md transition-all duration-300 ease-in-out",
              isAdding
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-300"
                : "bg-[#00FF00] hover:bg-green-500 text-black shadow-green-200",
              "transform hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <span className="relative flex items-center justify-center gap-x-3">
              {isAdding ? (
                <>
                  <span className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <Check className="w-4 h-4 text-white" />
                  </span>
                  <span className="pl-6 text-lg text-white">Added to Cart</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Add To Cart</span>
                  <ShoppingCart className="w-5 h-5" />
                </>
              )}
            </span>
          </Button>

        </div>
      </div>
    </div>
  )
}

export default Info
