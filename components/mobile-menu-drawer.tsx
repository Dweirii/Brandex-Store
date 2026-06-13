"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Logo from "./logo"
import { cn } from "@/lib/utils"

interface MobileMenuDrawerProps {
  open: boolean
  onClose: () => void
}

const NAV_LINKS = [
  { label: "All", href: "/" },
  { label: "Packaging", href: "/category/packaging" },
  { label: "Mockups", href: "/category/mockups" },
  { label: "PSD", href: "/category/psd-lab" },
]

const SECONDARY_LINKS = [
  { label: "Custom Work", href: "/custom-work" },
  { label: "Favorites", href: "/favorites" },
  { label: "Downloads", href: "/downloads" },
]

/** Slide-in left sidebar for mobile navigation. */
export function MobileMenuDrawer({ open, onClose }: MobileMenuDrawerProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  if (!mounted) return null

  // Portal to <body> so the drawer escapes the navbar's backdrop-filter
  // containing block — otherwise `fixed` anchors to the (short) navbar.
  return createPortal(
    <div className="md:hidden" aria-hidden={!open}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[70] flex h-full w-[84%] max-w-xs flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-[#F4F4F4] dark:hover:bg-muted/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-[#F4F4F4] dark:hover:bg-muted/40"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="my-3 border-t border-border/60" />

          <div className="space-y-1">
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-[#F4F4F4] dark:hover:bg-muted/40"
              >
                {link.label}
              </Link>
            ))}
            <SignedIn>
              <Link
                href="/credits"
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-[#F4F4F4] dark:hover:bg-muted/40"
              >
                Credits
              </Link>
            </SignedIn>
          </div>
        </nav>

        {/* Footer: auth */}
        <div className="border-t border-border/60 p-4">
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="h-11 flex-1 rounded-full bg-[#F4F4F4] text-sm font-semibold text-foreground transition-colors hover:bg-[#ededed] dark:bg-muted/30 dark:hover:bg-muted/50"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="h-11 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-full bg-[#F4F4F4] text-sm font-semibold text-foreground transition-colors hover:bg-[#ededed] dark:bg-muted/30 dark:hover:bg-muted/50"
            >
              My Account
            </Link>
          </SignedIn>
        </div>
      </aside>
    </div>,
    document.body
  )
}
