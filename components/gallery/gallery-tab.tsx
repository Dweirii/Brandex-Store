"use client"

import type React from "react"
import Image from "next/image"
import { Tab } from "@headlessui/react"
import { cn } from "@/lib/utils"
import type { Image as ImageType } from "@/types"

interface GalleryTabProps {
  image: ImageType
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md 
      bg-background-light dark:bg-background-dark outline-none 
      focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 
      overflow-hidden group transition-all duration-200">
      
      {({ selected }) => (
        <div className="w-full h-full">
          {/* Image display */}
          <span className="absolute inset-0 aspect-square overflow-hidden rounded-md">
            <Image
              fill
              src={image.url || "/placeholder.svg"}
              alt=""
              className={cn(
                "object-cover object-center transition-all duration-300",
                "group-hover:scale-105",
                selected ? "brightness-100" : "group-hover:brightness-90"
              )}
              sizes="(max-width: 768px) 25vw, 150px"
            />
          </span>

          {/* Ring indicator */}
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-1 transition-all duration-200",
              selected
                ? "ring-emerald-500"
                : "ring-transparent group-hover:ring-gray-300 dark:group-hover:ring-gray-600"
            )}
          />

          {/* Selected gradient overlay */}
          {selected && (
            <span className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-md" />
          )}

          {/* Hover overlay */}
          <span
            className={cn(
              "absolute inset-0 bg-transparent transition-colors duration-200 rounded-md",
              selected ? "" : "group-hover:bg-gray-200/10 dark:group-hover:bg-white/5"
            )}
          />
        </div>
      )}
    </Tab>
  )
}

export default GalleryTab
