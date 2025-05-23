"use client"

import type React from "react"

import type { Product } from "@/types"
import Currency from "./ui/currency"
import Button  from "@/components/ui/Button"
import { ShoppingCart, Check} from "lucide-react"
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
    <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      {/* Background accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-70" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full opacity-70" />

      <div className="relative z-10">
        {/* Product Name */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{data?.name}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full" />
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                <Currency value={data?.price} />
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Description</h3>
            </div>
            <div className="p-6 bg-white">
              <p className="text-base leading-relaxed text-gray-700">{data.description}</p>
            </div>
          </div>
        )}

        <hr className="my-8 border-gray-200" />

        {/* Add to Cart Button */}
        <div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "w-full h-12 text-base font-medium rounded-md transition-all duration-300 ease-in-out shadow-lg",
              isAdding
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200"
                : "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 shadow-gray-200",
              "transform hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            <span className="relative flex items-center justify-center gap-x-3">
              {isAdding ? (
                <>
                  <span className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="pl-6 text-lg">Added to Cart</span>
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
