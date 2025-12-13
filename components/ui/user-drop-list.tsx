"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/Button"
import { useClerk, useUser, SignInButton } from "@clerk/nextjs"
import Link from "next/link"
import {
  ShoppingCart,
  LogOut,
  User,
  Settings,
  Sun,
  Moon,
  Laptop,
  Crown,
  Download,
  Trophy,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SubscriptionModal } from "@/components/modals/subscription-modal"
import { useSubscription } from "@/hooks/use-subscription"

export function UserDropdown() {
  const { user, isLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [storeId, setStoreId] = useState<string>("")

  // Check subscription status
  const { isActive: isPremium } = useSubscription(storeId, {
    autoRefresh: false
  })

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
    const defaultStoreId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
    setStoreId(defaultStoreId)

    // Auto-open modal if returning from Stripe checkout (on any page)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get("success")
      const sessionId = urlParams.get("session_id")

      if (success === "true" && sessionId) {
        // Small delay to ensure modal is ready
        setTimeout(() => {
          setSubscriptionModalOpen(true)
        }, 100)
      }
    }
  }, [])

  if (!isMounted || !isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" role="status" aria-label="Loading user menu" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <SignInButton mode="modal">
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 transition-all duration-200 hover:scale-105 h-8 px-2 sm:px-3"
          >
            <User className="w-4 h-4 sm:mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0 transition-all duration-200"
            aria-label="User menu"
          >
            <Avatar className="cursor-pointer border-2 border-border hover:border-primary hover:shadow-md transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9">
              <AvatarImage
                src={user?.imageUrl || "/placeholder.svg"}
                alt={`${user?.firstName || 'User'}'s avatar`}
                className="object-cover"
                loading="lazy"
              />
              <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                {user?.firstName?.charAt(0)?.toUpperCase() ??
                  user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ??
                  "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-60 bg-card/95 backdrop-blur-sm text-foreground border border-border shadow-xl rounded-xl p-2"
          align="end"
          sideOffset={8}
        >
          {/* User Info Header */}
          <div className="px-3 py-2.5 mb-1">
            <p className="text-sm font-semibold text-foreground">
              {user?.firstName || "User"}
            </p>
            {user?.emailAddresses?.[0]?.emailAddress && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.emailAddresses[0].emailAddress}
              </p>
            )}
          </div>

          <DropdownMenuSeparator className="bg-border/50" />

          {/* Premium */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/premium" className="flex items-center gap-3 px-3 py-2.5 group">
              <Crown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="flex-1 text-sm font-medium group-hover:text-foreground transition-colors">Premium</span>
              {isPremium && (
                <span className="text-[10px] font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                  Active
                </span>
              )}
            </Link>
          </DropdownMenuItem>

          {/* Orders */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 group">
              <ShoppingCart className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium group-hover:text-foreground transition-colors">Orders</span>
            </Link>
          </DropdownMenuItem>

          {/* Downloads */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/downloads" className="flex items-center gap-3 px-3 py-2.5 group">
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium group-hover:text-foreground transition-colors">Downloads</span>
            </Link>
          </DropdownMenuItem>

          {/* Leaderboard */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/leaderboard" className="flex items-center gap-3 px-3 py-2.5 group">
              <Trophy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium group-hover:text-foreground transition-colors">Leaderboard</span>
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem onClick={() => openUserProfile()} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-muted/50">
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
            <span className="text-sm font-medium group-hover:text-foreground transition-colors">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/50 my-1.5" />

          {/* Theme Section */}
          <DropdownMenuLabel className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Appearance
          </DropdownMenuLabel>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("light"), 10)} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-muted/50">
            <Sun className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
            <span className="text-sm font-medium group-hover:text-foreground transition-colors">Light</span>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("dark"), 10)} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-muted/50">
            <Moon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
            <span className="text-sm font-medium group-hover:text-foreground transition-colors">Dark</span>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("system"), 10)} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-muted/50">
            <Laptop className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
            <span className="text-sm font-medium group-hover:text-foreground transition-colors">System</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/50 my-1.5" />

          {/* Sign Out */}
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-destructive/10 text-destructive">
            <LogOut className="w-4 h-4 mr-3 transition-all" />
            <span className="text-sm font-semibold">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {storeId && (
        <SubscriptionModal
          open={subscriptionModalOpen}
          onOpenChange={setSubscriptionModalOpen}
          storeId={storeId}
        />
      )}
    </div>
  )
}
