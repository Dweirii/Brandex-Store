"use client"

import { usePathname } from "next/navigation"
import GlobalSearchBar from "./global-search-bar"
import Container from "@/components/ui/container"

export default function SearchBarWrapper() {
  const pathname = usePathname()
  
  // Hide search bar on product detail pages (e.g., /products/[productId])
  const isProductDetailPage = pathname?.startsWith("/products/") && 
    pathname !== "/products/search" &&
    pathname.split("/").length === 3 // e.g., /products/123 (not /products/search or /products/123/...)

  if (isProductDetailPage) {
    return null
  }

  return (
    <div className="bg-background/80 backdrop-blur-md border-b border-border/40">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <GlobalSearchBar />
          </div>
        </div>
      </Container>
    </div>
  )
}


