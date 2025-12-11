"use client"

import useCart from "@/hooks/use-cart"
import { ShoppingBag, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const cart = useCart()
  const router = useRouter()

  // Get storeId from env
  const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""

  // Check subscription status
  const { isActive: isPremium } = useSubscription(storeId, {
    autoRefresh: false
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      {isPremium && (
        <Link
          href="/premium"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-all cursor-pointer group"
        >
          <Sparkles className="h-3.5 w-3.5 text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
            Premium
          </span>
        </Link>
      )}

      <button
        onClick={() => router.push("/cart")}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted/50 transition-all duration-200"
        aria-label={`Shopping cart with ${cart.items.length} items`}
      >
        <ShoppingBag className="h-4 w-4 text-foreground" />
        {cart.items.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1 shadow-sm">
            {cart.items.length > 99 ? '99+' : cart.items.length}
          </span>
        )}
      </button>
    </div>
  )
}

export default NavbarActions
