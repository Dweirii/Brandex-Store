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

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = memo(({ data }) => {
  const router = useRouter()
  const cart = useCart()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  const handleVideoClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isMobile) return
      e.stopPropagation()
      if (!videoRef.current || !data.videoUrl) return
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    },
    [isMobile, isPlaying, data.videoUrl],
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate media
  const firstImageUrl = data.images?.find((img) => img?.url)?.url
  const hasVideo = Boolean(data.videoUrl)
  const hasImage = Boolean(firstImageUrl)

  // Don't render if no media
  if (!hasVideo && !hasImage) return null

  return (
    <motion.div
      whileHover={!isMobile ? { scale: 1.02 } : {}}
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
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              onClick={isMobile ? handleVideoClick : undefined}
            />
            {isMobile && !isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                onClick={handleVideoClick}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10">
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

        {/* Desktop Hover Overlay */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product Name on Hover (Optional, minimal) */}
            {isHovered && (
              <motion.h3
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white font-semibold text-sm text-center line-clamp-2 mb-2"
              >
                {data.name}
              </motion.h3>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 w-full max-w-[200px]">
              {isFree ? (
                <>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    size="sm"
                    variant="default"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
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
                    <span className="hidden sm:inline">Buy</span>
                  </Button>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Mobile: Always Visible Buttons */}
        {isMobile && (
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
