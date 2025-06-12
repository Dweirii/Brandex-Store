"use client"

import { HeroSection } from "@/components/home/hero"
import { WhatYouGetSection } from "@/components/home/what-you-get-section"
import { WhyBuyFromBrandexSection } from "@/components/home/why-buy-from-brandex-section"
import { CallToActionSection } from "@/components/home/cta"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-card">
      <main className="bg-white dark:bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <HeroSection />
          <WhatYouGetSection />
          <WhyBuyFromBrandexSection />
          <CallToActionSection />
        </div>
      </main>
    </div>
  )
}
