"use client"

import type React from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/Button"
import { Check, ShoppingCart, Sparkles } from "lucide-react"
import Currency from "@/components/ui/currency"
import { useState, type MouseEventHandler } from "react"
import useCart from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import { DownloadButton } from "@/components/ui/download-button"
import { useSubscription } from "@/hooks/use-subscription"
import { usePremiumModal } from "@/hooks/use-premium-modal"

interface InfoProps {
  data: Product
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart()
  const premiumModal = usePremiumModal()
  const [isAdding, setIsAdding] = useState(false)

  const isFreeProduct = Number(data.price) === 0
  const isPaidProduct = !isFreeProduct

  const { isActive: hasPremium } = useSubscription(data.storeId, {
    autoRefresh: false,
  })

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (isAdding) return

    setIsAdding(true)
    try {
      await Promise.resolve(cart.addItem(data))
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setTimeout(() => setIsAdding(false), 1500)
    }
  }

  const handleUpgradeToPremium = () => {
    premiumModal.onOpen(data.id)
  }

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">
        {data.name}
      </h1>

      {/* Description */}
      {data.description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold text-foreground">
          <Currency value={data.price} />
        </div>
        {isPaidProduct && hasPremium && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <Check className="h-3 w-3" />
            Included with Premium
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        {isFreeProduct ? (
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full h-12 text-base font-medium"
          />
        ) : hasPremium ? (
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full h-12 text-base font-medium"
          />
        ) : (
          <>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "w-full h-12 text-base font-medium",
                isAdding ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Added to Cart
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </span>
              )}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              onClick={handleUpgradeToPremium}
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get Premium Access
            </Button>
          </>
        )}
      </div>

      {/* Tags */}
      {data.keywords?.length > 0 && (
        <div className="pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {data.keywords
              .flatMap(keyword =>
                typeof keyword === 'string'
                  ? keyword.split(',').map(k => k.trim()).filter(k => k.length > 0)
                  : [keyword]
              )
              .slice(0, 8)
              .map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
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
