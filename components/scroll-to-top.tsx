"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, usePathname } from "next/navigation"

export function ScrollToTop() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const page = searchParams.get("page")
  const isFirstRender = useRef(true)

  // Scroll to top on route change (e.g. switching categories)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
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
