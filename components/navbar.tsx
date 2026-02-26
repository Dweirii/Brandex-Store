"use client"

import { useEffect, useState, Suspense } from "react"
import Container from "@/components/ui/container"
import { MobileNavbarSection } from "./mobile-navbar-section"
import { DesktopNavbarSection } from "./desktop-navbar-section"
import type { Category } from "@/types"

const HIDDEN_CATEGORIES = ["Customer Service"]

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

        const data: Category[] = await res.json()
        setCategories(data.filter((c) => !HIDDEN_CATEGORIES.includes(c.name)))
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
      <div className="overflow-visible pt-1.5 pb-3 bg-background/95 backdrop-blur-lg shadow-sm">
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
