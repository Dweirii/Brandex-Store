"use client"

import type React from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import IconButton from "@/components/ui/icon-button"
import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"
import type { Product } from "@/types"

interface CartItemProps {
  data: Product
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const onRemove = () => {
    cart.removeItem(data.id)
  }

  return (
    <motion.li
      className="flex flex-col sm:flex-row py-6 gap-4 border-b relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* Product Image with hover effect */}
      <div className="relative h-40 w-full sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-lg overflow-hidden bg-gray-50 self-center sm:self-start">
        <motion.div className="h-full w-full" animate={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
          <Image
            fill
            src={data.images[0]?.url || "/placeholder.svg"}
            alt={data.name}
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 128px, 144px"
            priority
          />
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="relative flex flex-1 flex-col justify-between mt-2 sm:mt-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 pr-8">
            <h3 className="text-base font-medium text-gray-900 line-clamp-2">{data.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>

            {/* Keywords displayed as tags */}
            {Array.isArray(data.keywords) && data.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.keywords.map((keyword, index) => (
                  <span key={index} className="inline-flex text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="absolute top-0 right-0">
            <IconButton
              onClick={onRemove}
              icon={<X size={16} />}
              className="bg-white hover:bg-gray-100 text-gray-600 shadow-sm"
            />
          </motion.div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4">
          <motion.div
            className="font-semibold"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Currency value={data.price} />
          </motion.div>
        </div>
      </div>
    </motion.li>
  )
}

export default CartItem
