"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { metaPageView } from "@/lib/meta-pixel"

/**
 * Fires Meta Pixel `PageView` on every client-side route change.
 *
 * Next.js App Router navigates without a hard reload, so the base pixel's
 * PageView (in <head>) only fires on the very first load. This re-fires it on
 * each pathname change — and skips the initial mount so the first page isn't
 * counted twice. (Pathname-only on purpose: query-string changes like filters
 * shouldn't count as new page views.)
 */
export function MetaPixelRouteTracker() {
  const pathname = usePathname()
  const isInitial = useRef(true)

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    metaPageView()
  }, [pathname])

  return null
}
