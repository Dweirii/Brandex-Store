"use client"

import { useRef, useEffect } from "react"
import { Heart, ArrowUpRight } from "lucide-react"

interface GalleryVideo {
  id: string
  videoUrl: string
  username?: string
  likes?: number
  showCta?: boolean
}

const galleryVideos: GalleryVideo[] = [
  {
    id: "1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "3",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "4",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "5",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    username: "designer_pro",
    likes: 248,
  },
  {
    id: "6",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "7",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "8",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "9",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "10",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "11",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "12",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "13",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "14",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "15",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    showCta: true,
  },
  {
    id: "16",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
]

function GalleryCell({ item }: { item: GalleryVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const cell = cellRef.current
    if (!video || !cell) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(cell)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cellRef}
      className="group relative overflow-hidden rounded-xl border border-border bg-background aspect-4/3"
    >
      <video
        ref={videoRef}
        src={item.videoUrl}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Username + likes overlay */}
      {item.username && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-black/60 py-1.5 px-3 backdrop-blur-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-[#00EB02]" />
            <span className="text-xs font-medium text-foreground">
              {item.username}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 py-1.5 px-3 backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5 text-foreground" />
            <span className="text-xs font-medium text-foreground">
              {item.likes}
            </span>
          </div>
        </div>
      )}

      {/* View all CTA overlay */}
      {item.showCta && (
        <div className="absolute inset-0 flex items-end justify-end p-4">
          <a
            href="/products"
            className="flex items-center gap-2 rounded-full bg-[#00EB02]/20 px-4 py-2 backdrop-blur-sm border border-[#00EB02]/30 text-[#00EB02] text-sm font-medium hover:bg-[#00EB02]/30 transition-colors"
          >
            {"View All Products"}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}

export default function ExclusiveGallery() {
  return (
    <section className="w-full rounded-2xl bg-background border border-border overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-0">
        {/* Left content panel */}
        <div className="flex flex-col justify-center gap-6 p-8 lg:p-12 lg:min-w-[340px] lg:max-w-[380px] shrink-0">
          {/* Decorative swirl */}
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="20"
              viewBox="0 0 32 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C2 5.58 5.58 2 10 2s8 3.58 8 8-3.58 8-8 8"
                stroke="#00EB02"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M14 10c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8"
                stroke="#00EB02"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00EB02]">
            Premium Quality
          </p>

          <h2 className="text-4xl font-black italic uppercase leading-[1.05] tracking-tight text-foreground lg:text-5xl">
            Brandex
            <br />
            Product
            <br />
            Gallery
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-[320px]">
            Explore our curated collection of premium mockups, packaging designs, and digital assets
          </p>

          <div className="flex flex-col gap-3 mt-2">
            <a href="/products" className="w-full text-center rounded-full bg-[#00EB02] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
              Browse Products
            </a>
            <a href="/category/free" className="w-full text-center rounded-full bg-transparent px-6 py-3.5 text-sm font-medium text-foreground hover:bg-muted transition-colors border border-border">
              Free Assets
            </a>
          </div>
        </div>

        {/* Right video grid */}
        <div className="flex-1 p-3 lg:p-4 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-2.5">
            {galleryVideos.map((item) => (
              <GalleryCell key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
