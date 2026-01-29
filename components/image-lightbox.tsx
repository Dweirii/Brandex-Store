"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageAlt: string
}

const ImageLightbox = ({ isOpen, onClose, imageUrl, imageAlt }: ImageLightboxProps) => {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden"
      setZoom(1) // Reset zoom when opening
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Zoom indicator */}
          {zoom !== 1 && (
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>
          )}

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[95vw] max-h-[95vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={1200}
                height={1600}
                className="w-auto h-auto max-w-full max-h-[95vh] object-contain"
                quality={100}
                priority
              />
            </div>
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            Click outside to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { ImageLightbox }
