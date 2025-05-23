"use client"

import type React from "react"

import Image from "next/image"
import { Tab } from "@headlessui/react"
import { cn } from "@/lib/utils"

import type { Image as ImageType } from "@/types"
import GalleryTab from "./gallery-tab"

interface GalleryProps {
  images: ImageType[]
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse space-y-reverse space-y-4">
      {/* Thumbnails */}
      <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
        <Tab.List className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id ?? image.url} image={image} />
          ))}
        </Tab.List>
      </div>

      {/* Main Image */}
      <Tab.Panels className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden">
        {images.map((image, index) => (
          <Tab.Panel
            key={image.id}
            className={cn(
              "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
              "transition-opacity duration-300 ease-in-out",
              "h-full w-full",
            )}
          >
            <div className="aspect-square relative h-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
              <Image
                fill
                src={image.url || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                className="object-cover object-center transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 800px"
                priority={index === 0}
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>

      {/* Mobile indicator dots */}
      <div className="flex justify-center sm:hidden mt-4 space-x-2">
        {images.map((image, index) => (
          <Tab
            key={`dot-${image.id}`}
            className={({ selected }) =>
              cn("w-2.5 h-2.5 rounded-full transition-colors", selected ? "bg-black" : "bg-gray-300 hover:bg-gray-400")
            }
          >
            <span className="sr-only">Image {index + 1}</span>
          </Tab>
        ))}
      </div>
    </Tab.Group>
  )
}

export default Gallery

