"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import type { Product } from "@/types"
import Currency from "@/components/ui/currency"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleClick = () => {
    router.push(`/products/${data.id}`)
  }

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {}) // Avoid unhandled promise
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-card border border-border overflow-hidden shadow-md cursor-pointer group flex flex-col"
    >
      <div className="relative w-full aspect-[4/3]">
        {data.videoUrl ? (
          <video
            ref={videoRef}
            src={data.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            poster={data.images?.[0]?.url || undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={data.images?.[0]?.url || "/placeholder.jpg"}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
            {data.category?.name || "Product"}
          </span>
          <span className="text-sm font-bold text-white">
            <Currency value={data.price} />
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
          {data.name}
        </h3>

        {data.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {data.description}
          </p>
        )}

        <button className="text-sm font-medium text-green-500 hover:text-green-400 transition-all flex items-center gap-1">
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard
