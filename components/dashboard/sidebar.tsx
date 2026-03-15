"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Download,
  Heart,
  ShoppingBag,
  Coins,
  FolderOpen,
  Settings,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCredits } from "@/hooks/use-credits"

const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Downloads", href: "/downloads", icon: Download },
  { label: "Favorites", href: "/favorites", icon: Heart },
]

const accountNav = [
  { label: "Purchases", href: "/orders", icon: ShoppingBag },
  { label: "Credits", href: "/credits", icon: Coins },
  { label: "Projects", href: "/custom-work", icon: FolderOpen },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { openUserProfile } = useClerk()
  const { balance } = useCredits(storeId)

  const progressPct = Math.min(((balance ?? 0) / 50) * 100, 100)

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-background sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex flex-col gap-5 py-6 px-3">

        {/* Main nav */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
            Main
          </p>
          <nav className="flex flex-col gap-0.5">
            {mainNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Account nav */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
            Account
          </p>
          <nav className="flex flex-col gap-0.5">
            {accountNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </button>
          </nav>
        </div>

        {/* Credits CTA card */}
        <div className="mt-4 mx-1 rounded-xl bg-foreground text-background p-4">
          <p className="text-xs font-semibold mb-0.5">Need credits?</p>
          <p className="text-[11px] opacity-60 mb-3">
            Each premium download costs 5 credits
          </p>
          <div className="flex items-center justify-between text-[10px] opacity-60 mb-1.5">
            <span>{balance ?? 0} credits available</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1 mb-3">
            <div
              className="bg-primary h-1 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <Link
            href="/credits"
            className="flex items-center justify-center gap-1.5 w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Buy Credits →
          </Link>
        </div>

      </div>
    </aside>
  )
}
