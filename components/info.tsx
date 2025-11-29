"use client"

import type React from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/Button"
import { Check, ShoppingCart, Crown, Sparkles } from "lucide-react"
import Currency from "@/components/ui/currency"
import { useState, type MouseEventHandler } from "react"
import useCart from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import { DownloadButton } from "@/components/ui/download-button"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { useSubscription } from "@/hooks/use-subscription"
import { Separator } from "@/components/ui/separator"
import { usePremiumModal } from "@/hooks/use-premium-modal"

interface InfoProps {
  data: Product
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart()
  const premiumModal = usePremiumModal()
  const [isAdding, setIsAdding] = useState(false)

  // Check if product is free (price is 0)
  const isFreeProduct = Number(data.price) === 0
  const isPaidProduct = !isFreeProduct

  // Get subscription status (no auto-refresh to reduce API calls)
  const { isActive: hasPremium } = useSubscription(data.storeId, {
    autoRefresh: false,
  })

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    // Prevent double-clicks
    if (isAdding) return

    setIsAdding(true)
    try {
      // Make sure cart.addItem is awaited if it's async
      await Promise.resolve(cart.addItem(data))
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      // Keep the "Added" state visible for a moment
      setTimeout(() => setIsAdding(false), 1500)
    }
  }

  const handleUpgradeToPremium = () => {
    premiumModal.onOpen(data.id)
  }

  return (
    <div className="space-y-8 px-4 sm:px-0">
      {/* Title & Price Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          {hasPremium && (
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                <Crown className="h-4 w-4" />
                Premium Member
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {data.name}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-semibold text-foreground">
                <Currency value={data.price} />
              </div>
              {isPaidProduct && hasPremium && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Included with Premium
                </span>
              )}
            </div>
            {isPaidProduct && <PremiumBadge />}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Description */}
      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{data.description}</p>
      </div>

      {/* Actions */}
      <div className="space-y-6 pt-2">
        {isFreeProduct ? (
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full h-14 text-lg shadow-lg shadow-green-500/20"
          />
        ) : hasPremium ? (
          <div className="space-y-4">
            <DownloadButton
              storeId={data.storeId}
              productId={data.id}
              size="lg"
              variant="premium"
              className="w-full h-14 text-lg shadow-lg shadow-green-500/20"
            />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Crown className="h-4 w-4 text-[#D4AF37]" />
              <span className="font-medium">Premium Download</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "w-full h-14 text-lg font-semibold transition-all shadow-md hover:shadow-lg",
                isAdding ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" /> Added to Cart
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Buy Now <ShoppingCart className="w-5 h-5" />
                </span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-background px-2 text-muted-foreground">Or unlock with premium</span>
              </div>
            </div>

            <Button
              onClick={handleUpgradeToPremium}
              variant="outline"
              className="w-full h-14 text-lg font-medium border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] transition-colors"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Get Premium Access
            </Button>
          </div>
        )}
      </div>

      {/* Tags */}
      {data.keywords?.length > 0 && (
        <div className="pt-8">
          <div className="flex flex-wrap gap-2">
            {data.keywords
              .flatMap(keyword =>
                typeof keyword === 'string'
                  ? keyword.split(',').map(k => k.trim()).filter(k => k.length > 0)
                  : [keyword]
              )
              .map((keyword, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors cursor-default"
                >
                  {keyword}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Info
