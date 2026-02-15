"use client"

import { useRef, useEffect } from "react"

export default function HeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
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
          Premium mockups and designs starting at{" "}
          <span className="text-[#00EB02]">$9.99</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base max-w-md">
          Access thousands of professional-grade mockups, packaging designs, and branding assets. 
          Perfect for agencies, designers, and creative professionals.
        </p>
        <div className="mt-5">
          <a href="/products" className="inline-block rounded-full bg-[#00EB02] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00EB02] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Browse Collection
          </a>
        </div>
      </div>
    </div>
  )
}
