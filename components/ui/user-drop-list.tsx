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
} from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function UserDropdown() {
  const { user, isLoaded } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { setTheme } = useTheme()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 transition-all duration-200 hover:scale-105"
          >
            <User className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </SignInButton>
      </div>
    )
  }

  const menuItemClass =
    "group cursor-pointer transition-all duration-200 rounded-lg mx-1 my-1 px-3 py-3 hover:bg-primary/10 focus:bg-primary/10"
  const iconWrapperClass =
    "p-1 rounded-md bg-primary/10 group-hover:bg-primary/20"

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Avatar className="cursor-pointer border-2 border-border transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
              <AvatarImage
                src={user?.imageUrl || "/placeholder.svg"}
                alt={`${user?.firstName}'s avatar`}
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
    </div>
  )
}
