"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, X, Maximize2, Volume2, VolumeX } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  description: string
  videoUrl: string
  posterUrl?: string
}

const sampleVideos: VideoItem[] = [
  {
    id: "1",
    title: "PREMIUM MOCKUPS",
    description: "High-resolution mockups designed for professional presentations and portfolios",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    title: "PACKAGING DESIGNS",
    description: "Stunning packaging mockups with smart objects and instant customization",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "3",
    title: "BRANDEX STUDIO",
    description: "Create custom designs with AI-powered tools and professional templates",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "4",
    title: "DIGITAL ASSETS",
    description: "Complete branding kits with logos, templates, and marketing materials",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "5",
    title: "4K RESOLUTION",
    description: "Ultra-high definition assets perfect for print and digital media",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "6",
    title: "SMART OBJECTS",
    description: "Drag and drop your designs with automatic perspective and lighting adjustments",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
]

function VideoCard({
  item,
  onExpand,
}: {
  item: VideoItem
  onExpand: (item: VideoItem) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    videoRef.current?.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2">
      <div className="group relative flex flex-col gap-3">
        <div
          className="relative aspect-video overflow-hidden rounded-xl cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => onExpand(item)}
        >
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.posterUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpand(item)
            }}
            className="absolute top-3 right-3 rounded-lg bg-black/50 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 backdrop-blur-sm"
            aria-label="Expand video"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          {isHovered && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-white">Playing</span>
            </div>
          )}
        </div>
        <div className="px-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function ExpandedVideo({
  item,
  onClose,
}: {
  item: VideoItem
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const bar = progressBarRef.current
    if (!video || !bar) return
    const rect = bar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          aria-label="Close expanded video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            src={item.videoUrl}
            muted={isMuted}
            loop
            playsInline
            className="w-full aspect-video object-cover"
          />
          <div className="px-4 pb-2 pt-1">
            <div
              ref={progressBarRef}
              className="group relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2.5"
              onClick={handleProgressClick}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <span className="text-xs text-white/60 font-mono">
                  {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 px-1">
          <h2 className="text-lg font-bold uppercase tracking-wide text-white">
            {item.title}
          </h2>
          <p className="mt-1 text-sm text-white/60">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function VideoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const [expandedItem, setExpandedItem] = useState<VideoItem | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("scroll", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("scroll", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const scrollToPosition = useCallback(
    (clientX: number) => {
      if (!emblaApi || !progressRef.current) return
      const rect = progressRef.current.getBoundingClientRect()
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const slideCount = emblaApi.scrollSnapList().length
      const targetSlide = Math.round(pos * (slideCount - 1))
      emblaApi.scrollTo(targetSlide)
    },
    [emblaApi]
  )

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDraggingSlider(true)
      scrollToPosition(e.clientX)
    },
    [scrollToPosition]
  )

  useEffect(() => {
    if (!isDraggingSlider) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      scrollToPosition(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDraggingSlider(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingSlider, scrollToPosition])

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Featured Products
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -mx-2">
            {sampleVideos.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                onExpand={setExpandedItem}
              />
            ))}
          </div>
        </div>

        {/* Slider progress bar - supports click and mouse drag */}
        <div className="mt-6 flex items-center gap-4">
          <div
            ref={progressRef}
            className={`group relative w-full cursor-pointer rounded-full bg-border transition-all select-none ${
              isDraggingSlider ? "h-2.5" : "h-1.5 hover:h-2.5"
            }`}
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-[width] duration-150"
              style={{ width: `${Math.max(scrollProgress, 1)}%` }}
            />
            <div
              className={`absolute top-1/2 h-4 w-4 rounded-full bg-foreground shadow-md transition-opacity ${
                isDraggingSlider ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                left: `${scrollProgress}%`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>
        </div>
      </div>

      {expandedItem && (
        <ExpandedVideo item={expandedItem} onClose={() => setExpandedItem(null)} />
      )}
    </section>
  )
}
