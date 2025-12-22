"use client"

import { useRef, useEffect } from "react"
import type { Product } from "@/types"
import Image from "next/image"

import { getDisplayImageUrl } from "@/lib/image-utils"

interface GalleryProps {
  data: Product
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Calculate display URL (watermarked if paid)
  // We check price > 0 for paid items
  const isPaid = Number(data.price) > 0
  const displayImageUrl = getDisplayImageUrl(data.images?.[0]?.url, !isPaid)

  // Optimize video loading for single product page
  useEffect(() => {
    if (videoRef.current && data.videoUrl) {
      // Load video immediately for single product page
      videoRef.current.load()
    }
  }, [data.videoUrl])

  return (
    <div className="w-full overflow-hidden bg-background shadow-md border border-border rounded-xl">
      <div className="relative aspect-[4/3] w-full">
        {data.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={data.videoUrl}
              muted
              loop
              autoPlay
              preload="metadata"
              poster={displayImageUrl}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              onLoadedData={() => { }}
            />
            {/* Video indicator badge */}
            <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-10">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </div>
          </>
        ) : (
          <Image
            src={displayImageUrl}
            alt={data.name}
            fill
            className="object-cover rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        )}
        {/* Client-side watermark removed (handled by server proxy) */}

        {/* Protection Layer */}
        <div
          className="absolute inset-0 z-40 bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Global Gallery Watermark for paid products */}
        {isPaid && (
          <div
            className="absolute inset-[-50%] z-30 pointer-events-none opacity-[0.06] select-none"
            style={{
              backgroundImage: `url('/water-mark.png')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px',
              transform: 'rotate(30deg)',
              filter: 'brightness(0) invert(1)',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Gallery