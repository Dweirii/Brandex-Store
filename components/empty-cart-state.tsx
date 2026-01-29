"use client"

import { ShoppingBag, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

const EmptyCartState = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="relative bg-muted/50 rounded-full p-8">
          <ShoppingBag className="h-24 w-24 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-3">Your Cart is Empty</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to find amazing mockups and design resources!
      </p>
      
      <Button
        onClick={() => router.push("/home")}
        size="lg"
        className="group"
      >
        Continue Shopping
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
        <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary mb-2">1000+</div>
          <div className="text-sm text-muted-foreground">Premium Mockups</div>
        </div>
        <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary mb-2">Free</div>
          <div className="text-sm text-muted-foreground">Downloads Available</div>
        </div>
        <div className="text-center p-6 bg-muted/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary mb-2">24/7</div>
          <div className="text-sm text-muted-foreground">Instant Delivery</div>
        </div>
      </div>
    </div>
  )
}

export { EmptyCartState }
