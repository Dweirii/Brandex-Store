"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"



const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

export default function CategoryNav() {
  const pathname = usePathname()

  // Define the ordered top-level navigation items
  // We want: Packaging, Mockups, Signature Services, Graphics, Motion Library
  const navItems = [
    { id: "fd995552-baa8-4b86-bf7e-0acbefd43fd6", label: "Packaging", href: "/category/packaging" },
    { id: "mockups", label: "Mockups", href: "/category/mockups", isGroup: true },
    { id: "graphics", label: "Graphics", href: "/category/graphics", isGroup: true },
    { id: "c302954a-6cd2-43a7-9916-16d9252f754c", label: "Motion Library", href: "/category/motion-library" },
  ]

  return (
    <div className="hidden md:flex items-center gap-6 relative z-10 pointer-events-auto">
      {/* Category Links */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.isGroup && pathname.startsWith(item.href)) ||
            (pathname === "/" && item.id === MOCKUPS_CATEGORY_ID) ||
            (item.id === "graphics" && (pathname.includes("/images") || pathname.includes("/vectors") || pathname.includes("/psd-lab")))

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "h-[42px] flex items-center px-4 text-[13px] font-bold rounded-xl transition-all duration-300 relative z-10 shrink-0",
                isActive
                  ? "text-white bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
