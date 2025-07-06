"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function ScrollToTop() {
  const searchParams = useSearchParams()
  const page = searchParams.get("page")

  useEffect(() => {
    if (page && page !== "1") {
      // Smooth scroll to top when page changes
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [page])

  return null
}
