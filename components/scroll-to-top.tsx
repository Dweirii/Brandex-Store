"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, usePathname } from "next/navigation"

export function ScrollToTop() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const page = searchParams.get("page")
  const isFirstRender = useRef(true)
  // Tracks whether the current navigation came from the browser back/forward
  // button (popstate). On those we must NOT scroll to top — the browser/Next.js
  // restores the previous scroll position, so the user lands where they left off.
  const isPopNavigation = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true
      // Signal list components that this navigation is a back/forward, so they
      // restore their saved scroll position (and not on plain forward clicks).
      try { sessionStorage.setItem("brandex:popnav", String(Date.now())) } catch { /* ignore */ }
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  // Scroll to top on forward route changes (e.g. switching categories),
  // but leave scroll alone on back/forward so the position is restored.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isPopNavigation.current) {
      isPopNavigation.current = false
      return
    }
    // Forward navigation (e.g. clicking a category/logo): clear any stale
    // back/forward flag so list pages don't wrongly restore a saved position.
    try { sessionStorage.removeItem("brandex:popnav") } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  // Smooth scroll to top on pagination
  useEffect(() => {
    if (page && page !== "1") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [page])

  return null
}
