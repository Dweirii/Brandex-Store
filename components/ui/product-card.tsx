"use client"

import type React from "react"
import { memo, useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Eye, Coins, Heart, GitCompareArrows } from "lucide-react"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadButton } from "@/components/ui/download-button"
import { PremiumBadge } from "@/components/ui/premium-badge"
import useMobile from "@/hooks/use-mobile"
import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import usePreviewModal from "@/hooks/use-preview-modal"
import useCompare from "@/hooks/use-compare"

import { getDisplayImageUrl } from "@/lib/image-utils"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = memo(({ data }) => {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useMobile()
  const [isMounted, setIsMounted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [imageErrored, setImageErrored] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const previewModal = usePreviewModal()

  // Check if product is free
  const isFree = Number(data.price) === 0

  const favorites = useFavoritesWithAuth()
  const isLiked = favorites.items.some((item) => item.id === data.id)
  
  const compare = useCompare()
  const isInCompare = compare.isInCompare(data.id)

  const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) {
      await favorites.removeItem(data.id)
    } else {
      await favorites.addItem(data)
    }
  }, [favorites, data, isLiked])

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

  // Motion-only cards (no image fallback) need the video loaded immediately
  // so there's something to show — otherwise the card is blank.
  const isVideoOnly = hasVideo && !hasImage

  useEffect(() => {
    if (!hasVideo) return

    // Video-only cards or mobile: load immediately
    if (isVideoOnly || isMobile) {
      setShouldLoadVideo(true)
      return
    }

    // Image + video cards on desktop: lazy-load the video via IntersectionObserver
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true)
            observer.disconnect()
          }
        },
        { rootMargin: '200px' }
      )
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [isMobile, hasVideo, isVideoOnly])

  // Safety net: if no media event fires within 3s for a motion-only card,
  // dismiss the skeleton so we can see whatever the video element is doing.
  useEffect(() => {
    if (!isVideoOnly || mediaLoaded) return
    const t = window.setTimeout(() => setMediaLoaded(true), 3000)
    return () => window.clearTimeout(t)
  }, [isVideoOnly, mediaLoaded])

  // Paint the thumbnail frame ONCE per element instance.
  // Runs autoplay → short delay → pause on a mid-video content frame.
  // Using useEffect (not an inline ref callback) so re-renders don't retrigger it.
  useEffect(() => {
    if (!isVideoOnly || !shouldLoadVideo) return
    const el = videoRef.current
    if (!el) return

    let paintTimer: number | undefined
    let done = false

    const tryPaintFrame = () => {
      if (done) return
      done = true
      el.muted = true
      const targetTime = el.duration && isFinite(el.duration) ? el.duration * 0.5 : 1.0
      try { el.currentTime = targetTime } catch {}
      const playPromise = el.play()
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            paintTimer = window.setTimeout(() => {
              if (!el.isConnected) return
              // If the user is hovering, don't interrupt playback.
              if (!el.paused && el.currentTime > targetTime + 0.2) return
              try {
                el.pause()
                el.currentTime = targetTime
              } catch {}
            }, 300)
          })
          .catch((err) => {
            console.warn("[ProductCard] video play() failed:", err?.message ?? err)
            setVideoError(err?.message ?? "play failed")
          })
      }
    }

    if (el.readyState >= 1) {
      tryPaintFrame()
    } else {
      el.addEventListener("loadedmetadata", tryPaintFrame, { once: true })
    }

    return () => {
      if (paintTimer) window.clearTimeout(paintTimer)
      el.removeEventListener("loadedmetadata", tryPaintFrame)
    }
  }, [isVideoOnly, shouldLoadVideo])

  // CHECK IF PRODUCT IS FREE variable already calculated at top level
  // const isFree = Number(data.price) === 0 // Removed redeclaration

  // Hooks
  const handleViewClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      previewModal.onOpen(data)
    },
    [previewModal, data]
  )

  // Prefetch product page on hover
  const handleMouseEnterCard = useCallback(() => {
    router.prefetch(`/products/${data.slug ?? data.id}`)
  }, [router, data.slug, data.id])

  const handleCompare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isInCompare) {
        compare.removeItem(data.id)
      } else {
        compare.addItem(data)
      }
    },
    [compare, data, isInCompare]
  )

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true)
      if (videoRef.current && data.videoUrl) {
        const v = videoRef.current
        // Restart from the beginning so hover plays the full video.
        // `loop` will make it keep running as long as the mouse stays over.
        try { v.currentTime = 0 } catch {}
        v.play().catch(() => { })
        setIsPlaying(true)
      }
    }
  }, [isMobile, data.videoUrl])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false)
      if (videoRef.current && data.videoUrl) {
        const v = videoRef.current
        v.pause()
        // For motion-only cards, seek back to the middle (where the thumbnail
        // was set on mount). For image+video cards, reset to 0 since the image
        // takes over as the visible state.
        v.currentTime = isVideoOnly
          ? (v.duration && isFinite(v.duration) ? v.duration * 0.5 : 1.0)
          : 0
        setIsPlaying(false)
      }
    }
  }, [isMobile, data.videoUrl, isVideoOnly])

  // Don't render if no media or if the image 404'd with no video fallback
  if (!hasVideo && !hasImage) return null
  if (imageErrored && !hasVideo) return null

  return (
    <motion.div
      whileHover={isMounted && !isMobile ? { y: -4 } : {}}
      transition={{ duration: 0.22, ease: "easeOut" as const }}
      onMouseEnter={() => {
        handleMouseEnter()
        handleMouseEnterCard()
      }}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/products/${data.slug ?? data.id}`)}
      className="relative bg-white border border-[#ECECEC] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)] cursor-pointer group will-change-transform transition-[box-shadow,border-color] duration-220 ease-[ease]"
    >
      {/* Image/Video Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-muted/5 aspect-3/4">
        {/* Frosty Reveal Overlay */}
        {!isMobile && (
          <div className="frost-overlay">
            <div className="frost-texture" />
          </div>
        )}
        {/* Always render Image if available */}
        {hasImage && (
          <ImageWithFallback
            src={firstImageUrl!}
            alt={data.name}
            fallbackSeed={data.name}
            width={800}
            height={1000}
            className={cn(
              "w-full h-full object-cover transition-all duration-220 ease-[ease] group-hover:scale-[1.03] select-none pointer-events-none",
              hasVideo ? "group-hover:brightness-105" : "group-hover:brightness-110 group-hover:saturate-105"
            )}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1920px) 33vw, 40vw"
            onLoadingComplete={() => setMediaLoaded(true)}
            onError={() => setImageErrored(true)}
          />
        )}

        {/* Protection Layer - Prevents direct interaction with media */}
        <div
          className="absolute inset-0 z-20 bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Hover dark overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-220 ease-[ease] pointer-events-none z-25" />


        {/* Client-side watermark removed (handled by server proxy) */}

        {/* Video Overlay */}
        {hasVideo && shouldLoadVideo && (
          <video
            ref={videoRef}
            src={data.videoUrl!}
            muted
            loop
            playsInline
            preload={hasImage ? "none" : "auto"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-220 ease-[ease] group-hover:scale-[1.03] group-hover:brightness-105",
              hasImage ? "z-10" : "z-0",
              (hasImage && !isHovered && !isMobile) ? "opacity-0" : "opacity-100"
            )}
            onLoadedData={() => setMediaLoaded(true)}
            onLoadedMetadata={() => setMediaLoaded(true)}
            onCanPlay={() => setMediaLoaded(true)}
            onError={(e) => {
              const err = (e.currentTarget as HTMLVideoElement).error
              const msg = err ? `code ${err.code}: ${err.message}` : "unknown"
              console.warn("[ProductCard] video error:", msg, "src:", data.videoUrl)
              setVideoError(msg)
              setMediaLoaded(true)
            }}
          />
        )}

        {/* Graceful fallback when the video file uses a codec the browser can't decode */}
        {isVideoOnly && videoError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-muted/40 text-muted-foreground pointer-events-none">
            <svg className="w-8 h-8 opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <p className="text-[10px] font-medium">Preview unavailable</p>
          </div>
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


        {!isFree && (
          <div
            className="absolute inset-0 z-30 pointer-events-none opacity-[0.06] select-none overflow-hidden"
            style={{
              backgroundImage: `url('/water-mark.png')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '40px',
              transform: 'rotate(30deg) scale(1.5)',
              filter: 'brightness(0) invert(1)',
            }}
          />
        )}

        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
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
            <div className="flex flex-col gap-2 pointer-events-auto px-3 py-4 rounded-xl backdrop-blur-md bg-white/20 dark:bg-black/20 shadow-xl">
              {isFree ? (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    productSlug={data.slug ?? data.id}
                    size="sm"
                    variant="default"
                    iconOnly
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm"
                  />
                  <Button
                    onClick={toggleFavorite}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                      isLiked && "text-red-500 hover:text-red-500 bg-red-50/90 hover:bg-red-50"
                    )}
                    title={isLiked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                  </Button>
                  <Button
                    onClick={handleCompare}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                      isInCompare && "text-primary hover:text-primary bg-primary/10 hover:bg-primary/10"
                    )}
                    title={isInCompare ? "Remove from compare" : "Add to compare"}
                  >
                    <GitCompareArrows className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {isFree ? (
                    /* If product is free, show Download button */
                    <>
                      <DownloadButton
                        storeId={data.storeId}
                        productId={data.id}
                        productSlug={data.slug ?? data.id}
                        size="sm"
                        variant="default"
                        iconOnly
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm"
                      />
                      <Button
                        onClick={toggleFavorite}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                          isLiked && "text-red-500 hover:text-red-500 bg-red-50/90 hover:bg-red-50"
                        )}
                        title={isLiked ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                      </Button>
                      <Button
                        onClick={handleCompare}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                          isInCompare && "text-primary hover:text-primary bg-primary/10 hover:bg-primary/10"
                        )}
                        title={isInCompare ? "Remove from compare" : "Add to compare"}
                      >
                        <GitCompareArrows className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push('/credits')
                        }}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm"
                        title="Buy Credits"
                      >
                        <Coins className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={toggleFavorite}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                          isLiked && "text-red-500 hover:text-red-500 bg-red-50/90 hover:bg-red-50"
                        )}
                        title={isLiked ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                      </Button>
                      <Button
                        onClick={handleCompare}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 w-8 p-0 bg-white/90 hover:bg-white text-foreground hover:text-foreground border-0 shadow-lg backdrop-blur-sm",
                          isInCompare && "text-primary hover:text-primary bg-primary/10 hover:bg-primary/10"
                        )}
                        title={isInCompare ? "Remove from compare" : "Add to compare"}
                      >
                        <GitCompareArrows className="h-4 w-4" />
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
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/60 to-transparent p-3 z-40">
            <div className="flex gap-2">
              {isFree ? (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-0"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    productSlug={data.slug ?? data.id}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-0"
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={handleViewClick}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-0"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">View</span>
                  </Button>
                  <DownloadButton
                    storeId={data.storeId}
                    productId={data.id}
                    productSlug={data.slug ?? data.id}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-white/90 hover:bg-white text-foreground border-0"
                    customText={isFree ? "Free" : "5 Credits"}
                  />
                  <Button
                    onClick={toggleFavorite}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "flex-1 bg-white/90 hover:bg-white text-foreground border-0",
                      isLiked && "text-red-500 hover:text-red-500 bg-red-50"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
    </motion.div>
  )
})

ProductCard.displayName = "ProductCard"
export default ProductCard
