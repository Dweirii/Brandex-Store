"use client"

import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import NavbarActions from "./navbar-actions"
import { SearchBarWrapper } from "./search-bar-wrapper"

export function DesktopNavbarSection() {
  return (
    <div className="hidden md:flex relative px-4 sm:px-6 lg:px-8 items-center justify-between h-20 gap-4">
      <div className="flex-shrink-0 relative">
        <Logo />
      </div>

      <div className="flex-1 flex justify-center relative max-w-2xl mx-auto">
        <SearchBarWrapper />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative">
        <UserDropdown />
        <NavbarActions />
      </div>
    </div>
  )
}

