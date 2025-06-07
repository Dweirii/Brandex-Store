"use client"

import type React from "react"
import Image from "next/image"
import { Eye, Plus, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { MouseEventHandler } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/Button"
import usePreviewModal from "@/hooks/use-preview-modal"
import useCart from "@/hooks/use-cart"
import Currency from "@/components/ui/currency"
import type { Product } from "@/types"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const imageUrl = data.images?.[0]?.url || "/placeholder.jpg"
  const router = useRouter()
  const previewModal = usePreviewModal()
  const cart = useCart()

  const handleClick = () => {
    router.push(`/products/${data.id}`)
  }

  const handlePreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    previewModal.onOpen(data)
  }

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    cart.addItem(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={data?.name || "Product Image"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Floating action buttons */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Button
                onClick={handlePreview}
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border-0 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Eye size={14} />
              </Button>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                onClick={handleAddToCart}
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border-0 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Plus size={14} />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {data.category?.name && (
            <div className="mb-3">
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {data.category.name}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {data.name}
          </h3>

          {/* Description */}
          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{data.description}</p>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Currency value={data?.price} />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary hover:text-primary/80 hover:bg-transparent group/btn"
            >
              <span className="text-sm font-medium">View</span>
              <ArrowUpRight
                size={16}
                className="ml-1 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
