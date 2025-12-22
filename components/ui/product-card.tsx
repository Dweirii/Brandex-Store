"use client"

import type React from "react"
import { memo, useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Eye, Crown } from "lucide-react"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadButton } from "@/components/ui/download-button"
import { PremiumBadge } from "@/components/ui/premium-badge"
import useCart from "@/hooks/use-cart"
import useMobile from "@/hooks/use-mobile"
import { useSubscription } from "@/hooks/use-subscription"
import { SubscriptionModal } from "@/components/modals/subscription-modal"

import { getDisplayImageUrl } from "@/lib/image-utils"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = memo(({ data }) => {
  const router = useRouter()
  // ... (previous hooks) ...
  const cart = useCart()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMobile()
  const [isMounted, setIsMounted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)

  // Check subscription status
  const { isActive: hasPremium } = useSubscription(data.storeId, {
    autoRefresh: false,
  })

  // Check if product is free
  const isFree = Number(data.price) === 0

  // Calculate media
  const rawFirstImageUrl = data.images?.find((img) => img?.url)?.url
  // Use our helper to determine the source URL (watermarked if paid)
  // Always use watermark for paid products to protect content
  const firstImageUrl = getDisplayImageUrl(rawFirstImageUrl, isFree)

  const hasVideo = Boolean(data.videoUrl)
  const hasImage = Boolean(rawFirstImageUrl)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Lazy load videos only when in viewport using Intersection Observer
  useEffect(() => {
    if (!isMobile && hasVideo && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: '200px' // Start loading 200px before entering viewport
        }
      )

      observer.observe(containerRef.current)

      return () => observer.disconnect()
    } else if (isMobile && hasVideo) {
      // On mobile, load videos immediately but with lower priority
      setShouldLoadVideo(true)
    }
  }, [isMobile, hasVideo])

  // CHECK IF PRODUCT IS FREE variable already calculated at top level
  // const isFree = Number(data.price) === 0 // Removed redeclaration

  // Hooks
  const handleViewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/products/${data.id}`)
    },
    [router, data.id]
  )

  // Prefetch product page on hover
  const handleMouseEnterCard = useCallback(() => {
    router.prefetch(`/products/${data.id}`)
  }, [router, data.id])

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      cart.addItem(data)
    },
    [cart, data]
  )

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true)
      if (videoRef.current && data.videoUrl) {
        videoRef.current.play().catch(() => { })
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

  // Don't render if no media
  if (!hasVideo && !hasImage) return null

  return (
    <motion.div
      whileHover={isMounted && !isMobile ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={() => {
        handleMouseEnter()
        handleMouseEnterCard()
      }}
      onMouseLeave={handleMouseLeave}
      className="relative bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer group will-change-transform"
    >
      {/* Image/Video Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-muted/5 aspect-[3/4] md:aspect-auto">
        {/* Always render Image if available */}
        {hasImage && (
          <Image
            src={firstImageUrl!}
            alt={data.name}
            width={800}
            height={1000}
            className={cn(
              "w-full h-full md:h-auto object-cover md:object-contain transition-all duration-200 group-hover:scale-105 select-none pointer-events-none",
              hasVideo ? "group-hover:brightness-105" : "group-hover:brightness-110 group-hover:saturate-105"
            )}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 40vw"
            onLoadingComplete={() => setMediaLoaded(true)}
          />
        )}

        {/* Protection Layer - Prevents direct interaction with media */}
        <div
          className="absolute inset-0 z-20 bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Client-side watermark removed (handled by server proxy) */}

        {/* Video Overlay */}
        {hasVideo && shouldLoadVideo && (
          <video
            ref={videoRef}
            src={data.videoUrl!}
            muted
            loop
            playsInline
            preload={hasImage ? "none" : "metadata"}
            className={cn(
              "transition-all duration-200 group-hover:scale-105 group-hover:brightness-105",
              hasImage ? "absolute inset-0 w-full h-full object-cover md:object-contain z-10" : "w-full h-full md:h-auto object-cover md:object-contain",
              (hasImage && !isHovered && !isMobile) ? "opacity-0" : "opacity-100"
            )}
            onLoadedData={() => setMediaLoaded(true)}
          />
        )}

        {hasVideo && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-30">
            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Video
          </div>
        )}

        {/* Media skeleton overlay to prevent white flashes while loading */}
        {!mediaLoaded && (hasVideo || hasImage) && (
          <Skeleton className="absolute inset-0 z-20 rounded-lg bg-muted/20 animate-pulse pointer-events-none" />
        )}

        {/* Overlay for non-video items */}
        {!hasVideo && hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        )}

        {!isFree && (
          <div
            className="absolute inset-[-50%] z-30 pointer-events-none opacity-[0.06] select-none"
            style={{
              backgroundImage: `url('/water-mark.png')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '40px',
              transform: 'rotate(30deg)',
              filter: 'brightness(0) invert(1)',
            }}
          />
        )}

        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
            Free
          </div>
        )}

        {/* Premium Badge for paid products */}
        {!isFree && (
          <div className="absolute top-2 left-2 z-10">
            <PremiumBadge size="sm" />
          </div>
        )}

        {/* Desktop Hover Overlay - Side Buttons */}
        {isMounted && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-end pr-4 gap-2 z-30 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons - Side with Blur Background */}
            <div className="flex flex-col gap-2 pointer-events-auto px-3 py-4 rounded-xl backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 shadow-xl">
              {isFree ? (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/products/${data.id}`)
                    }}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    size="sm"
                    variant="default"
                    iconOnly
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {hasPremium ? (
                    /* If user has Premium, show Download Free button */
                    <DownloadButton
                      storeId={data.storeId}
                      productId={data.id}
                      size="sm"
                      variant="default"
                      iconOnly
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                    />
                  ) : (
                    <>
                      {/* If no Premium, show Buy Now button */}
                      <Button
                        onClick={handleAddToCart}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      {/* Always show Unlock with Premium option for non-premium users */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSubscriptionModalOpen(true)
                        }}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-border/50 shadow-lg backdrop-blur-sm"
                        title="Unlock with Premium"
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                    </>
                  )}
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
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                  {hasPremium ? (
                    /* If user has Premium, show Download Free button */
                    <DownloadButton
                      storeId={data.storeId}
                      productId={data.id}
                      size="sm"
                      variant="default"
                      className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                    />
                  ) : (
                    <>
                      {/* If no Premium, show Buy Now button */}
                      <Button
                        onClick={handleAddToCart}
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="text-xs">Buy</span>
                      </Button>
                      {/* Show Unlock with Premium option */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSubscriptionModalOpen(true)
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white/90 hover:bg-white text-foreground border-border/50"
                      >
                        <Crown className="h-4 w-4" />
                        <span className="text-xs">Premium</span>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {data.storeId && (
        <SubscriptionModal
          open={subscriptionModalOpen}
          onOpenChange={setSubscriptionModalOpen}
          storeId={data.storeId}
        />
      )}
    </motion.div>
  )
})

ProductCard.displayName = "ProductCard"
export default ProductCard
