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

  return (
    <>
      <div className="bg-background/95 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm overflow-visible pt-10 pb-5">
        <ul className="christmas-lights">
          {Array.from({ length: 40 }).map((_, i) => (
            <li key={i} className="hidden sm:block" />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <li key={i} className="sm:hidden" />
          ))}
        </ul>
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
