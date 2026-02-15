"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"

export function StudioAnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden dark:pt-5 dark:bg-background bg-primary shadow-sm">
      <div className="relative z-10 flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Badge 1 - Highlighted label */}
          <span className="hidden shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white/90 sm:inline-flex animate-pulse">
            New Release
          </span>

          {/* Badge 2 - Pill tag */}
          <span className="hidden shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white/90 sm:inline-flex">
            Brandex Studio 2.0
          </span>

          {/* Promotional text */}
          <p className="hidden truncate text-sm text-white md:block">
            <span className="font-semibold text-white">
              AI-Powered Image Editing
            </span>
            {" "}is now available for everyone.{" "}
            <span className="font-bold text-white underline decoration-white/40 underline-offset-4 decoration-2">Free access.</span>
          </p>

          {/* Mobile short text */}
          <p className="truncate text-sm text-white md:hidden">
            <span className="font-semibold text-white">AI Editing</span>
            {" "}&mdash;{" "}
            <span className="font-bold text-white">Free access</span>
          </p>

          {/* CTA link */}
          <Link
            href={
              process.env.NEXT_PUBLIC_STUDIO_URL ||
              "https://studio.brandex.com"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group ml-1 shrink-0 flex items-center gap-1 text-sm font-bold text-white transition-all hover:text-white/90"
          >
            Try it now 
            <span className="inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
