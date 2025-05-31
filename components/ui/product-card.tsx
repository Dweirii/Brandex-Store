"use client"

import type React from "react"

import type { Product } from "@/types"
import Image from "next/image"
import { Expand, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import type { MouseEventHandler } from "react"
import Button from "@/components/ui/Button"
import usePreviewModal from "@/hooks/use-preview-modal"
import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const imageUrl = data.images?.[0]?.url || "/placeholder.jpg"
  const router = useRouter()
  const previewModal = usePreviewModal()
  const cart = useCart();

  const handleClick = () => {
    router.push(`/products/${data.id}`)
  }

  const handlePreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    previewModal.onOpen(data)
  }

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    cart.addItem(data);
  }

  return (
    <div
      onClick={handleClick}
      className="bg-background group cursor-pointer rounded-xl border p-3 space-y-4 mb-5 transition hover:shadow-md"
    >
      {/* Product Image */}
      <div className="aspect-square rounded-xl bg-muted relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={data?.name || "Product Image"}
          fill
          className="object-cover rounded-md"
        />

        {/* Action Buttons */}
        <div className="absolute w-full px-6 bottom-5 transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <div className="flex gap-x-6 justify-center">
            <Button onClick={handlePreview}  className="rounded-full bg-white shadow-md">
              <Expand size={20} className="text-foreground" />
              <span className="sr-only">Quick view</span>
            </Button>
            <Button
              onClick={handleAddToCart}
  
              className="rounded-full bg-white shadow-md"
            >
              <ShoppingCart size={20} className="text-foreground" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <p className="font-semibold text-lg line-clamp-1">{data.name}</p>
        <p className="text-sm text-muted-foreground line-clamp-1">{data.category?.name}</p>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between">
        <Currency value={data?.price} />
      </div>
    </div>
  )
}

export default ProductCard

