"use client"

import type React from "react"
import { memo, useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Eye, Download } from "lucide-react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/Button"
import { DownloadButton } from "@/components/ui/download-button"
import useCart from "@/hooks/use-cart"
import useMobile from "@/hooks/use-mobile"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = memo(({ data }) => {
  const router = useRouter()
  const cart = useCart()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isMobile = useMobile()
  const [isMounted, setIsMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if product is free (price is 0)
  const isFree = Number(data.price) === 0

  // Hooks
  const handleViewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/products/${data.id}`)
    },
    [router, data.id]
  )

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      cart.addItem(data)
    },
    [cart, data]
  )

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true)
      if (videoRef.current && data.videoUrl) {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    }
  }, [isMobile, data.videoUrl])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false)
      if (videoRef.current && data.videoUrl) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }
  }, [isMobile, data.videoUrl])



  // Calculate media
  const firstImageUrl = data.images?.find((img) => img?.url)?.url
  const hasVideo = Boolean(data.videoUrl)
  const hasImage = Boolean(firstImageUrl)

  // Don't render if no media
  if (!hasVideo && !hasImage) return null

  return (
    <motion.div
      whileHover={isMounted && !isMobile ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer group will-change-transform"
    >
      {/* Image/Video Container */}
      <div className="relative w-full aspect-[4/3]">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={data.videoUrl!}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </div>
          </>
        ) : (
          <Image
            src={firstImageUrl!}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
            Free
          </div>
        )}

        {/* Desktop Hover Overlay - Minimal Buttons */}
        {isMounted && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center gap-2 z-30 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons - Minimal */}
            <div className="flex gap-2 pointer-events-auto">
              {isFree ? (
                <>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    size="sm"
                    variant="default"
                    className="bg-white/90 hover:bg-white text-black shadow-lg"
                  />
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-black border-white/50 shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    variant="default"
                    className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-black border-white/50 shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Mobile: Always Visible Buttons */}
        {isMounted && isMobile && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
            <div className="flex gap-2">
              {isFree ? (
                <>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  />
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-xs">Add to Cart</span>
                  </Button>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View Details</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
})

ProductCard.displayName = "ProductCard"
export default ProductCard
