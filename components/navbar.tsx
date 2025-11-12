"use client"

import { useEffect, useState, Suspense } from "react"
import Container from "@/components/ui/container"
import { MobileNavbarSection } from "./mobile-navbar-section"
import { DesktopNavbarSection } from "./desktop-navbar-section"
import type { Category } from "@/types"


const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load categories asynchronously - don't block initial render
    // Use client-side fetch (without Next.js caching options)
    const fetchCategories = async () => {
      try {
        const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`
        const res = await fetch(URL, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Client-side fetch doesn't support Next.js caching options
          cache: 'default', // Use browser cache
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`)
        }

        const data = await res.json()
        setCategories(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load categories:", error)
        setLoading(false)
        // Set empty array on error to prevent UI issues
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  return (
    <>
      {/* Main Navbar - Mobile Friendly */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors duration-300 sticky top-0 z-50">
        <Container>
          {/* Mobile Layout */}
          <Suspense fallback={<div className="md:hidden h-16" />}>
            <MobileNavbarSection categories={categories} />
          </Suspense>

          {/* Desktop Layout */}
          <DesktopNavbarSection />
        </Container>
      </div>
    </>
  )
}

export { Navbar }
