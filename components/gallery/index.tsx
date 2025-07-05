"use client"

import type { Product } from "@/types"
import Image from "next/image"

interface GalleryProps {
  data:Product
}

const Gallery:React.FC<GalleryProps> = ({ data }) => {


  return (
    <div className="w-full overflow-hidden bg-background shadow-md border border-border">
      <div className="relative aspect-[4/3] w-full">
        {data.videoUrl ? (
              <video
                  src={data.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={data.images?.[0]?.url || "/placeholder.jpg"}
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
    </div>
  )
}

export default Gallery
