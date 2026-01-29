"use client"

import { Suspense } from "react"
import Container from "@/components/ui/container"
import useCart from "@/hooks/use-cart"
import CartItem from "./_components/cart-item"
import Summary from "./_components/summary"
import { RecentlyViewed } from "@/components/recently-viewed"
import { EmptyCartState } from "@/components/empty-cart-state"

const CartContent = () => {
  const cart = useCart()

  return (
    <div className="bg-white dark:bg-card transition-colors">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>

          {cart.items.length === 0 ? (
            <EmptyCartState />
          ) : (
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
              <div className="lg:col-span-7">
                <ul>
                  {cart.items.map((item) => (
                    <CartItem key={item.id} data={item} />
                  ))}
                </ul>
              </div>
              <Summary />
            </div>
          )}
        </div>
      </Container>
      <RecentlyViewed />
    </div>
  )
}

export default function CartPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading cart...</div>}>
      <CartContent />
    </Suspense>
  )
}
