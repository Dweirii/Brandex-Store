"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import NavbarActions from "./navbar-actions"
import { SearchToolbar } from "./search-toolbar"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface DesktopNavbarSectionProps {
  categories: Category[]
}

// The top nav always shows ONLY these links (in this order), regardless of what
// else exists in the data (Images, Motion, Vectors, etc. are hidden).
const NAV_LINKS = [
  { label: "Packaging", href: "/category/packaging" },
  { label: "Mockups", href: "/category/mockups" },
  { label: "PSD", href: "/category/psd-lab" },
]

export function DesktopNavbarSection({ categories }: DesktopNavbarSectionProps) {
  const pathname = usePathname()

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
      active
        ? "bg-foreground font-semibold text-background"
        : "bg-[#F4F4F4] text-foreground/75 hover:bg-[#ededed] hover:text-foreground dark:bg-muted/30 dark:hover:bg-muted/50"
    )

  return (
    <div className="hidden md:block px-4 sm:px-6 lg:px-8">
      {/* ── Single top row: logo · categories · search · actions ────────── */}
      <div className="flex h-16 items-center gap-3">
        <div className="mr-1 shrink-0">
          <Logo />
        </div>

        {/* Category links */}
        <nav className="flex shrink-0 items-center gap-1.5">
          <Link href="/" className={linkClass(pathname === "/")}>
            All
          </Link>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(pathname === link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar (in-bar category dropdown) */}
        <div className="min-w-0 flex-1">
          <SearchToolbar categories={categories} />
        </div>

        {/* Right cluster: actions + auth */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Custom Work + Credits + Favorites */}
          <NavbarActions />

          {/* Auth: Sign In + Sign Up when logged out, Profile when logged in */}
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full bg-[#F4F4F4] px-5 text-sm font-semibold text-foreground transition-colors hover:bg-[#ededed] dark:bg-muted/30 dark:hover:bg-muted/50"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserDropdown />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
