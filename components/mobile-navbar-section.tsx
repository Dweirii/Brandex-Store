"use client"

import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import NavbarActions from "./navbar-actions"
import MobileSearchButton from "./mobile-search-button"
import CategoriesDropdown from "./categories-dropdown"
import type { Category } from "@/types"

interface MobileNavbarSectionProps {
  categories: Category[] // Can be empty array while loading
}

export function MobileNavbarSection({ categories }: MobileNavbarSectionProps) {
  return (
    <div className="md:hidden relative px-2 sm:px-4 flex items-center justify-between h-16 gap-1 sm:gap-2 min-w-0">
      {/* Logo - Mobile */}
      <div className="flex-shrink-0 relative z-20 min-w-0">
        <Logo />
      </div>

      {/* Right Actions - Mobile */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 relative z-20">
        <CategoriesDropdown categories={categories} />
        <MobileSearchButton />
        <UserDropdown />
        <NavbarActions />
      </div>
    </div>
  )
}

