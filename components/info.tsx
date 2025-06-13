"use client"

import type React from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/Button"
import { Check, ShoppingCart } from "lucide-react"
import Currency from "@/components/ui/currency"
import { useState, type MouseEventHandler } from "react"
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
    setTimeout(() => setIsAdding(false), 1500)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Category */}
      {data.category?.name && (
        <p className="text-green-500 text-sm font-semibold uppercase">{data.category.name}</p>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        {data.name}
      </h1>

      {/* Description */}
      {data.description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Price */}
      <div className="text-3xl font-semibold text-foreground">
        <Currency value={data.price} />
      </div>

      {/* Buy Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={cn(
          "w-full h-12 text-base font-medium transition-all duration-300 ease-in-out",
          isAdding
            ? "bg-green-600 hover:bg-green-700 text-white shadow-green-300"
            : "bg-[#00FF00] hover:bg-green-400 text-black shadow-md",
          "transform hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        <span className="flex items-center justify-center gap-x-2 text-lg font-semibold">
          {isAdding ? (
            <>
              <Check className="w-5 h-5" />
              Added
            </>
          ) : (
            <>
              Buy Now
              <ShoppingCart className="w-5 h-5" />
            </>
          )}
        </span>
      </Button>

      {/* Keywords / Tags */}
      {data.keywords?.length > 0 && (
        <div className="pt-2">
          <h3 className="text-lg text-white font-bold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, i) => (
              <span
                key={i}
                className="bg-accent/10 text-foreground text-sm font-medium px-3 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Info
