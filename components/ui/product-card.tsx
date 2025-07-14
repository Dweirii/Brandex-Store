"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useEffect, useState, useCallback } from "react"
import type { Product } from "@/types"
import Currency from "@/components/ui/currency"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = () => {
    router.push(`/products/${data.id}`)
  }

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && videoRef.current && data.videoUrl) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isMobile, data.videoUrl])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && videoRef.current && data.videoUrl) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [isMobile, data.videoUrl])

  const handleVideoClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isMobile) return // Only handle clicks on mobile

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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-card border border-border overflow-hidden shadow-md cursor-pointer group flex flex-col gpu-accelerated hover-scale"
    >
      <div className="relative w-full aspect-[4/3]">
        {data.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={data.videoUrl}
              muted
              loop
              playsInline
              preload="metadata" // This shows the first frame
              className="absolute inset-0 w-full h-full object-cover"
              onClick={isMobile ? handleVideoClick : undefined}
            />

            {/* Mobile play button overlay - only show when not playing */}
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

            {/* Video indicator */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </div>
          </>
        ) : // Fallback to product image if no video
        data.images?.[0]?.url ? (
          <Image 
            src={data.images[0].url || "/placeholder.svg"} 
            alt={data.name} 
            fill 
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">
            {data.category?.name || "Product"}
          </span>
          <span className="text-sm font-bold text-white">
            <Currency value={data.price} />
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{data.name}</h3>

        {data.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{data.description}</p>}

        <button className="text-sm font-medium text-green-500 hover:text-green-400 transition-all flex items-center gap-1">
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard
