"use client"

import { HeroSection } from "@/components/home/hero"
import { WhatYouGetSection } from "@/components/home/what-you-get-section"
import { WhyBuyFromBrandexSection } from "@/components/home/why-buy-from-brandex-section"
import { CallToActionSection } from "@/components/home/cta"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="bg-white dark:bg-black">
        <HeroSection />
        <WhatYouGetSection />
        <WhyBuyFromBrandexSection />
        <CallToActionSection />
      </main>
    </div>
  )
}
