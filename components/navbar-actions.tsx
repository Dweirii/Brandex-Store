"use client"

import useCart from "@/hooks/use-cart"
import { ShoppingBag, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { usePremiumModal } from "@/hooks/use-premium-modal"
import { useSubscription } from "@/hooks/use-subscription"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const cart = useCart()
  const router = useRouter()
  const premiumModal = usePremiumModal()

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
    <div className="ml-auto flex items-center gap-4">
      {isPremium && (
        <button
          onClick={() => premiumModal.onOpen()}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all cursor-pointer group"
        >
          <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Premium
          </span>
        </button>
      )}

      <button
        onClick={() => router.push("/cart")}
        className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors"
        aria-label={`Shopping cart with ${cart.items.length} items`}
      >
        <ShoppingBag className="h-4 w-4 text-foreground" />
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-1">
            {cart.items.length > 99 ? '99+' : cart.items.length}
          </span>
        )}
      </button>
    </div>
  )
}

export default NavbarActions
