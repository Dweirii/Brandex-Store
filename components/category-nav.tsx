"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"


export default function CategoryNav() {
  const pathname = usePathname()

  const navItems = [
    { id: "all", label: "All", href: "/" },
    { id: "fd995552-baa8-4b86-bf7e-0acbefd43fd6", label: "Packaging", href: "/category/packaging" },
    { id: "mockups", label: "Mockups", href: "/category/mockups", isGroup: true },
    { id: "graphics", label: "Graphics", href: "/category/graphics", isGroup: true },
    { id: "c302954a-6cd2-43a7-9916-16d9252f754c", label: "Motion Library", href: "/category/motion-library" },
  ]

  return (
    <div className="hidden md:flex items-center relative z-10 pointer-events-auto">
      <nav className="flex items-center gap-1 bg-muted/30 border border-border/60 p-1 rounded-lg h-9">
        {navItems.map((item) => {
          const isActive =
            (item.id === "all" && pathname === "/") ||
            (item.id !== "all" && (
              pathname === item.href ||
              (item.isGroup && pathname.startsWith(item.href)) ||
              (item.id === "graphics" && (pathname.includes("/images") || pathname.includes("/vectors") || pathname.includes("/psd-lab")))
            ))

          return (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "h-full flex items-center px-4 text-sm font-semibold rounded-md transition-all duration-300 shrink-0",
                isActive
                  ? "text-white bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
