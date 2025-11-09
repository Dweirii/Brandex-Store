"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import GlobalSearchBar from "./global-search-bar"

function SearchBarContent() {
  return (
    <div className="w-full relative z-20 pointer-events-auto">
      <GlobalSearchBar className="w-full" />
    </div>
  )
}

export function SearchBarWrapper() {
  const pathname = usePathname()
  
  // Hide search bar on product detail pages (e.g., /products/[productId])
  const isProductDetailPage = pathname?.startsWith("/products/") && 
    pathname !== "/products/search" &&
    pathname.split("/").length === 3 // e.g., /products/123 (not /products/search or /products/123/...)

  if (isProductDetailPage) {
    return null
  }

  return (
    <Suspense fallback={<div className="w-full h-10" />}>
      <SearchBarContent />
    </Suspense>
  )
}



