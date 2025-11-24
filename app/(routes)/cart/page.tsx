"use client"

import { Suspense } from "react"
import Container from "@/components/ui/container"
import useCart from "@/hooks/use-cart"
import CartItem from "./_components/cart-item"
import Summary from "./_components/summary"

const CartContent = () => {
  const cart = useCart()

  return (
    <div className="bg-white dark:bg-card transition-colors">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>

          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500 dark:text-neutral-400">No items added to Cart</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
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
