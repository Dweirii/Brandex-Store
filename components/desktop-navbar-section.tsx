"use client"

import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import NavbarActions from "./navbar-actions"
import { SearchBarWrapper } from "./search-bar-wrapper"

export function DesktopNavbarSection() {
  return (
    <div className="hidden md:flex relative px-4 sm:px-6 lg:px-8 items-center justify-between h-16 gap-6">
      <div className="shrink-0 relative">
        <Logo />
      </div>

      <div className="flex-1 flex justify-center relative max-w-xl mx-auto">
        <SearchBarWrapper />
      </div>

      <div className="flex items-center gap-3 shrink-0 relative">
        <UserDropdown />
        <NavbarActions />
      </div>
    </div>
  )
}

