"use client"

import { LandingHero } from "@/components/home/landing-hero"
import { LandingMarquee } from "@/components/home/landing-marquee"
import { LandingFeatures } from "@/components/home/landing-features"
import { LandingShowcase } from "@/components/home/landing-showcase"
import { LandingDetails } from "@/components/home/landing-details"
import { LandingCTA } from "@/components/home/landing-cta"

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingMarquee />
      <LandingFeatures />
      <LandingShowcase />
      <LandingDetails />
      <LandingCTA />
    </>
  )
}
