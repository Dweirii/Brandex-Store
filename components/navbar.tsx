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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`
        const res = await fetch(URL, {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'default',
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
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div 
        className={`overflow-visible pt-1.5 pb-3 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-lg shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <Container>
          <Suspense fallback={<div className="md:hidden h-16" />}>
            <MobileNavbarSection categories={categories} />
          </Suspense>
          <DesktopNavbarSection />
        </Container>
      </div>
    </>
  )
}

export { Navbar }
