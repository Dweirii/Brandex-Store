import { Suspense } from "react"
import Container from "@/components/ui/container"
import { MobileNavbarSection } from "./mobile-navbar-section"
import { DesktopNavbarSection } from "./desktop-navbar-section"
import type { Category } from "@/types"

const HIDDEN_CATEGORIES = ["Customer Service"]

interface NavbarProps {
  categories: Category[]
}

const Navbar = ({ categories }: NavbarProps) => {
  const visibleCategories = categories.filter(
    (c) => !HIDDEN_CATEGORIES.includes(c.name)
  )

  return (
    <div className="overflow-visible pt-1.5 pb-3 bg-background/95 backdrop-blur-lg shadow-sm">
      <Container>
        <Suspense fallback={<div className="md:hidden h-16" />}>
          <MobileNavbarSection categories={visibleCategories} />
        </Suspense>
        <DesktopNavbarSection />
      </Container>
    </div>
  )
}

export { Navbar }
