"use client"

import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import NavbarActions from "./navbar-actions"
import { SearchBarWrapper } from "./search-bar-wrapper"

export function DesktopNavbarSection() {
  return (
    <div className="hidden md:flex relative px-4 sm:px-6 lg:px-8 items-center justify-between h-20 gap-4">
      {/* Logo - Left */}
      <div className="flex-shrink-0 relative z-20">
        <Logo />
      </div>

      {/* Search Bar - Centered */}
      <div className="flex-1 flex justify-center relative z-20 max-w-2xl mx-auto">
        <SearchBarWrapper />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-20">
        <UserDropdown />
        <NavbarActions />
      </div>
    </div>
  )
}

