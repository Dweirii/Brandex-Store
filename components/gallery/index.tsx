"use client"

import { useRef, useEffect } from "react"
import type { Product } from "@/types"
import Image from "next/image"

interface GalleryProps {
  data: Product
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

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
              poster={data.images?.[0]?.url || undefined}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              onLoadedData={() => {}}
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
            src={data.images?.[0]?.url || "/placeholder.jpg"}
            alt={data.name}
            fill
            className="object-cover rounded-xl"
          />
        )}
      </div>
    </div>
  )
}

export default Gallery
