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
      className="flex flex-col sm:flex-row py-6 gap-4 border-b border-border relative" // Added border-border
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="relative h-40 w-full sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-lg overflow-hidden bg-muted self-center sm:self-start">
        {" "}
        <motion.div className="h-full w-full" animate={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
          {data.videoUrl ? (
              <video
                src={data.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster={data.images?.[0]?.url || "/placeholder.jpg"}
              />
                  ) : (
                    <Image
                      src={data.images?.[0]?.url || "/placeholder.jpg"}
                      alt={data.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
          )}
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="relative flex flex-1 flex-col justify-between mt-2 sm:mt-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 pr-8">
            <h3 className="text-base font-medium text-foreground line-clamp-2">{data.name}</h3>{" "}
            <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>{" "}
            {Array.isArray(data.keywords) && data.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full"
                  >
                    {" "}
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
              className="bg-background hover:bg-muted text-foreground shadow-sm"
            />{" "}
          </motion.div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4">
          <motion.div
            className="font-semibold text-foreground"
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
