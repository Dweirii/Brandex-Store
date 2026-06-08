"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import { SearchToolbar } from "./search-toolbar"
import { MobileMenuDrawer } from "./mobile-menu-drawer"
import type { Category } from "@/types"

interface MobileNavbarSectionProps {
  categories: Category[]
}

export function MobileNavbarSection({ categories }: MobileNavbarSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Row 1: hamburger · centered logo · auth */}
      <div className="relative flex h-14 items-center justify-between px-3">
        {/* Hamburger → sidebar */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-[#F4F4F4] dark:hover:bg-muted/40"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Centered logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo compact />
        </div>

        {/* Auth: Login pill when logged out, bigger avatar when logged in */}
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#009915]"
              >
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserDropdown size="lg" />
          </SignedIn>
        </div>
      </div>

      {/* Row 2: full-width hero search */}
      <div className="px-3 pb-2.5">
        <SearchToolbar categories={categories} showCategory={false} large />
      </div>

      {/* Slide-in sidebar */}
      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
