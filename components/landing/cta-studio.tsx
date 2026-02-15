"use client"

import { useRef, useEffect, useState } from "react"
import { StudioPromoModal } from "@/components/studio-promo-modal"

export default function HeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showStudioModal, setShowStudioModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get Studio URL from env
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3002"

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault()
      setShowStudioModal(true)
    }
  }

  return (
    <>
      <StudioPromoModal 
        open={showStudioModal} 
        onOpenChange={setShowStudioModal}
        studioUrl={studioUrl}
      />
      
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 4.5" }}>
      {/* Video background */}
      <video
        ref={videoRef}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 py-8 sm:px-12 md:px-16 max-w-xl">
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl text-balance">
          Create stunning designs with{" "}
          <span className="text-[#00EB02]">Brandex Studio</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base max-w-md">
          AI-powered design tools, customizable templates, and professional assets. 
          Build your brand identity with ease and confidence.
        </p>
        <div className="mt-5">
          <a 
            href={studioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-block rounded-md bg-[#00EB02] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00EB02]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00EB02] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
          >
            Try Studio
          </a>
        </div>
      </div>
      </div>
    </>
  )
}
