import { Suspense } from "react"
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
    <div className="w-full overflow-visible bg-background/95 backdrop-blur-lg shadow-sm">
      <Suspense fallback={<div className="md:hidden h-16" />}>
        <MobileNavbarSection categories={visibleCategories} />
      </Suspense>
      <DesktopNavbarSection categories={visibleCategories} />
    </div>
  )
}

export { Navbar }
