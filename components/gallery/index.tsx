"use client"

import type { Product } from "@/types"
import Image from "next/image"

interface GalleryProps {
  data: Product
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  return (
    <div className="w-full overflow-hidden bg-background shadow-md border border-border">
      <div className="relative aspect-[4/3] w-full">
        {data.videoUrl ? (
          <video
            src={data.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={data.images?.[0]?.url || undefined}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
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
