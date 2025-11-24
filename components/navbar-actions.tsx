"use client"

import useCart from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const cart = useCart()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="ml-auto flex-shrink-0">
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
