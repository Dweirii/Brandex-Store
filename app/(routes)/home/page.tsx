"use client"

import VideoCarousel from "@/components/landing/video-carosel"
import ExclusiveGallery from "@/components/landing/products"
import HeroBannerBrandex from "@/components/landing/cta-brandex"
import HeroBannerStudio from "@/components/landing/cta-studio"
import Container from "@/components/ui/container"

export default function HomePage() {
  return (
    <Container className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <VideoCarousel />
        <ExclusiveGallery />
        <HeroBannerBrandex />
        <HeroBannerStudio />
      </div>
    </Container>
  )
}
