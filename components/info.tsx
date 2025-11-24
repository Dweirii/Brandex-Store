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
    <div className="p-8 space-y-6">
      {/* Category */}
      {data.category?.name && (
        <p className="text-green-500 text-sm font-semibold uppercase">{data.category.name}</p>
      )}

      {/* Title with Premium Badge */}
      <div className="flex items-start gap-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex-1 min-w-0">
          {data.name}
        </h1>
        {isPaidProduct && (
          <PremiumBadge size="lg" className="shrink-0" />
        )}
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <div className="text-3xl font-semibold text-foreground">
          <Currency value={data.price} />
        </div>
        {isPaidProduct && hasPremium && (
          <span className="text-sm text-green-500 font-medium flex items-center gap-1">
            <Check className="h-4 w-4" />
            Free with Premium
          </span>
        )}
      </div>

      <Separator />

      {/* Action Buttons - Download, Buy, or Premium CTA */}
      {isFreeProduct ? (
        /* Free Product - Always show download */
        <div className="w-full">
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
          />
        </div>
      ) : hasPremium ? (
        /* Paid Product + Premium User - Show Download Free */
        <div className="w-full space-y-3">
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full"
          />
          <p className="text-sm text-muted-foreground text-center font-medium">
            <Crown className="h-4 w-4 inline mr-1 text-[#D4AF37]" />
            Downloading as a Premium member
          </p>
        </div>
      ) : (
        /* Paid Product + No Premium - Show Buy Now + Premium CTA */
        <div className="w-full space-y-4">
          {/* Buy Now Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "w-full h-12 text-base font-medium transition-all duration-300 ease-in-out",
              "cursor-pointer",
              isAdding
                ? "bg-primary/80 hover:bg-primary/90 text-primary-foreground shadow-primary/30"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md",
              "transform hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <span className="flex items-center justify-center gap-x-2 text-lg font-semibold">
              {isAdding ? (
                <>
                  <Check className="w-5 h-5" />
                  Added
                </>
              ) : (
                <>
                  Buy Now
                  <ShoppingCart className="w-5 h-5" />
                </>
              )}
            </span>
          </Button>

          {/* Premium CTA */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8941F]/10 border border-[#D4AF37]/20 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <Crown className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  Unlock with Premium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get unlimited access to all premium products for just $7/month
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpgradeToPremium}
              size="default"
              className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold hover:scale-105 transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Unlock with Premium
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              <Sparkles className="h-3 w-3 inline mr-1 text-[#D4AF37]" />
              <span className="text-muted-foreground font-medium">7-day free trial included</span>
            </p>
          </div>
        </div>
      )}

      {/* Keywords / Tags */}
      {data.keywords?.length > 0 && (
        <div className="pt-2">
          <h3 className="text-lg text-foreground font-bold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {/* Handle keywords splitting if they come as comma-separated strings */}
            {data.keywords
              .flatMap(keyword =>
                typeof keyword === 'string'
                  ? keyword.split(',').map(k => k.trim()).filter(k => k.length > 0)
                  : [keyword]
              )
              .map((keyword, i) => (
                <span
                  key={i}
                  className="bg-accent/10 text-foreground text-sm font-medium px-3 py-1 rounded-full"
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
