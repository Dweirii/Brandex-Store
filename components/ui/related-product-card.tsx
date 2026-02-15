"use client"

import type React from "react"
import { memo, useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import useMobile from "@/hooks/use-mobile"
import usePreviewModal from "@/hooks/use-preview-modal"
import { getDisplayImageUrl } from "@/lib/image-utils"

interface RelatedProductCardProps {
    data: Product
}

const RelatedProductCard: React.FC<RelatedProductCardProps> = memo(({ data }) => {
    const router = useRouter()
    const previewModal = usePreviewModal()
    const isMobile = useMobile()
    const [isMounted, setIsMounted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [mediaLoaded, setMediaLoaded] = useState(false)
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const isFree = Number(data.price) === 0
    const rawFirstImageUrl = data.images?.find((img) => img?.url)?.url
    const firstImageUrl = getDisplayImageUrl(rawFirstImageUrl, isFree)
    const hasVideo = Boolean(data.videoUrl)

    // Intersection Observer for lazy loading video
    useEffect(() => {
        if (hasVideo && containerRef.current) {
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
    }, [hasVideo])

    const handleMouseEnter = useCallback(() => {
        if (!isMobile) {
            setIsHovered(true)
            if (videoRef.current && data.videoUrl) {
                videoRef.current.play().catch(() => { })
            }
        }
    }, [isMobile, data.videoUrl])

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            setIsHovered(false)
            if (videoRef.current && data.videoUrl) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
            }
        }
    }, [isMobile, data.videoUrl])

    const handleViewClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            previewModal.onOpen(data)
        },
        [previewModal, data]
    )

    if (!rawFirstImageUrl && !hasVideo) return null

    return (
        <motion.div
            ref={containerRef}
            whileHover={isMounted && !isMobile ? { y: -5, scale: 1.02 } : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => router.push(`/products/${data.id}`)}
            className="relative aspect-[3/4] bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
            {/* Media Layer */}
            <div className="absolute inset-0 z-0">
                {rawFirstImageUrl && (
                    <Image
                        src={firstImageUrl!}
                        alt={data.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-110",
                            hasVideo && isHovered && !isMobile ? "opacity-0" : "opacity-100"
                        )}
                        onLoadingComplete={() => setMediaLoaded(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}

                {hasVideo && shouldLoadVideo && (
                    <video
                        ref={videoRef}
                        src={data.videoUrl!}
                        muted
                        loop
                        playsInline
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                            (isHovered || isMobile) ? "opacity-100" : "opacity-0"
                        )}
                    />
                )}

                {/* Loading States */}
                {!mediaLoaded && (
                    <Skeleton className="absolute inset-0 z-10 bg-muted/20" />
                )}
            </div>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badge Layer */}
            <div className="absolute top-3 left-3 z-20 flex gap-2">
                {isFree ? (
                    <div className="px-3 py-1 bg-green-500/90 dark:bg-green-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                        Free
                    </div>
                ) : (
                    <div className="px-3 py-1 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                        Premium
                    </div>
                )}
            </div>

            {/* Content Layer (Hidden and revealed on hover) */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="text-white font-semibold text-sm line-clamp-1 drop-shadow-md">
                        {data.name}
                    </h4>
                    <button
                        onClick={handleViewClick}
                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Glassy Protection Layer */}
            <div className="absolute inset-0 z-10 group-hover:bg-white/[0.02] dark:group-hover:bg-black/[0.02] transition-colors duration-300" />
        </motion.div>
    )
})

RelatedProductCard.displayName = "RelatedProductCard"
export default RelatedProductCard
