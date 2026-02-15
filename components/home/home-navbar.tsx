"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3002"

const navigationItems = [
  { label: "Explore", href: "/products" },
  { label: "Image", href: "/category/images" },
  { label: "Video", href: "/category/videos" },
  { label: "Edit", href: studioUrl, external: true },
  { label: "Character", href: "/category/characters" },
  { label: "Contests", href: "/contests", badge: "New" },
  { label: "Vibe Motion", href: "/vibe-motion" },
  { label: "Cinema Studio", href: "/cinema-studio", badge: "2.0" },
  { label: "AI Influencer", href: "/ai-influencer" },
  { label: "Apps", href: "/apps" },
  { label: "Asst", href: "/assistant" },
  { label: "Pricing", href: "/pricing" },
]

export function HomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="text-background font-bold text-sm">B</span>
            </div>
          </Link>

          {/* Navigation Items - Hidden on small screens */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto">
            {navigationItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap rounded-md hover:bg-muted/50"
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 inline-flex items-center rounded-md bg-[#00EB02] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap rounded-md hover:bg-muted/50"
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 inline-flex items-center rounded-md bg-[#00EB02] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Asset Library Button */}
            <Button
              asChild
              className="hidden md:inline-flex bg-[#00EB02] text-white hover:opacity-90 h-9 rounded-full px-4 transition-opacity"
            >
              <Link href="/downloads">
                <span className="mr-1.5">📦</span>
                Asset library
              </Link>
            </Button>

            {/* Personal Dropdown */}
            <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors">
              Personal
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* User Avatar */}
            <Link href="/profile" className="w-9 h-9 rounded-full bg-[#00EB02] flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
              <span className="text-white font-semibold text-sm">U</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center rounded-md bg-[#00EB02] px-2 py-1 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center rounded-md bg-[#00EB02] px-2 py-1 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
