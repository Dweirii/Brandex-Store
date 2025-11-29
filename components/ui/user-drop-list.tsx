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
  Mail,
  Calendar,
  Sun,
  Moon,
  Laptop,
  Crown,
} from "lucide-react"
import { motion } from "framer-motion"
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

  const menuItemClass =
    "group cursor-pointer transition-all duration-200 rounded-lg mx-1 my-1 px-3 py-3 hover:bg-primary/20 focus:bg-primary/20"
  const iconWrapperClass =
    "p-1 rounded-md bg-primary/10 group-hover:bg-primary/30"

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0"
            aria-label="User menu"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="cursor-pointer border-2 border-border transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/20 h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage
                  src={user?.imageUrl || "/placeholder.svg"}
                  alt={`${user?.firstName || 'User'}'s avatar`}
                  className="object-cover"
                  loading="lazy"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-muted text-foreground font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase() ??
                    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ??
                    "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-72 bg-card/95 backdrop-blur-md text-foreground border border-border shadow-2xl rounded-xl p-2"
          align="end"
          sideOffset={8}
        >
          <div className="px-3 py-4 bg-gradient-to-r from-primary/10 to-muted/20 rounded-lg mb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src={user?.imageUrl || "/placeholder.svg"}
                  alt={`${user?.firstName}'s avatar`}
                  loading="lazy"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-muted text-foreground font-semibold text-lg">
                  {user?.firstName?.charAt(0)?.toUpperCase() ??
                    user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() ??
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <DropdownMenuLabel className="text-foreground font-bold text-lg p-0 leading-tight">
                  {user?.firstName ? `Hi, ${user.firstName}!` : "Welcome!"}
                </DropdownMenuLabel>
                {user?.emailAddresses?.[0]?.emailAddress && (
                  <p className="text-muted-foreground text-sm truncate flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {user.emailAddresses[0].emailAddress}
                  </p>
                )}
                {user?.createdAt && (
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-border my-2" />

          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href="/premium" className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">
                  {isPremium ? "Premium Membership" : "Get Premium"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {isPremium ? "Manage subscription" : "Unlock exclusive features"}
                </p>
              </div>
              {isPremium && (
                <div className="bg-green-500/10 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-500/20">
                  ACTIVE
                </div>
              )}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className={menuItemClass}>
            <Link href="/orders" className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <ShoppingCart className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">My Orders</span>
                <p className="text-xs text-muted-foreground">View your purchase history</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => openUserProfile()} className={menuItemClass}>
            <div className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Account Settings</span>
                <p className="text-xs text-muted-foreground">Manage your profile</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuLabel className="px-3 text-xs text-muted-foreground">Theme</DropdownMenuLabel>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("light"), 10)} className={menuItemClass}>
            <div className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <Sun className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Light</span>
                <p className="text-xs text-muted-foreground">Bright and clear</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("dark"), 10)} className={menuItemClass}>
            <div className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Dark</span>
                <p className="text-xs text-muted-foreground">Dim and focused</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setTimeout(() => setTheme("system"), 10)} className={menuItemClass}>
            <div className="flex items-center gap-3 w-full">
              <div className={iconWrapperClass}>
                <Laptop className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">System</span>
                <p className="text-xs text-muted-foreground">Follow device settings</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border my-2" />

          <DropdownMenuItem onClick={() => signOut()} className={menuItemClass + " text-destructive hover:bg-destructive/10 focus:bg-destructive/10"}>
            <div className="flex items-center gap-3 w-full">
              <div className="p-1 rounded-md bg-destructive/10">
                <LogOut className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Sign Out</span>
                <p className="text-xs text-destructive/70">End your session</p>
              </div>
            </div>
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
