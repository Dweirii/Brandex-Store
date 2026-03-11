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
  LogOut,
  User,
  Settings,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function UserDropdown() {
  const { user, isLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
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

          {/* Dashboard */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 group">
              <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="flex-1 text-sm font-medium group-hover:text-foreground transition-colors">Dashboard</span>
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem onClick={() => openUserProfile()} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-muted/50">
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-3" />
            <span className="text-sm font-medium group-hover:text-foreground transition-colors">Settings</span>
          </DropdownMenuItem>

          {/* Help */}
          <DropdownMenuItem asChild className="cursor-pointer rounded-md my-0.5 transition-colors focus:bg-transparent hover:bg-muted/50">
            <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 group">
              <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium group-hover:text-foreground transition-colors">Help &amp; FAQ</span>
            </Link>
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

          <DropdownMenuSeparator className="bg-border/50 my-1.5" />

          {/* Sign Out */}
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer rounded-md my-0.5 px-3 py-2.5 group transition-colors focus:bg-transparent hover:bg-destructive/10 text-destructive">
            <LogOut className="w-4 h-4 mr-3 transition-all" />
            <span className="text-sm font-semibold">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
