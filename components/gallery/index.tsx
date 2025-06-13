"use client"

import type { Image as ImageType } from "@/types"
import Image from "next/image"

interface GalleryProps {
  images: ImageType[]
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const image = images[0]

  if (!image) return null

  return (
    <div className="w-full overflow-hidden bg-background shadow-md border border-border">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image.url || "/placeholder.svg"}
          alt="Product Image"
          fill
          priority
          className="object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 800px"
        />
      </div>
    </div>
  )
}

export default Gallery
