"use client"

import type React from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/Button"
import { Check, Sparkles, Download, Unlock, Loader2 } from "lucide-react"
import { DownloadButton } from "@/components/ui/download-button"
import { usePremiumModal } from "@/hooks/use-premium-modal"
import { ProductShare } from "@/components/product-share"

interface InfoProps {
  data: Product
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const premiumModal = usePremiumModal()

  const isFreeProduct = Number(data.price) === 0
  const isPremiumProduct = !isFreeProduct

  // Debug logging
  console.log('[Info Component]', {
    productId: data.id,
    productName: data.name,
    isFree: isFreeProduct,
    hasActiveSubscription,
    hasActiveSubDirect,
    effectiveHasSubscription,
    hasCredits,
    hasDownloaded,
    creditsRemaining
  })

  const handleUpgradeToPremium = () => {
    premiumModal.onOpen(data.id)
  }

  // Determine button text, icon, and action
  const getButtonConfig = () => {
    // Free products are always downloadable
    if (isFreeProduct) {
      return {
        component: 'download',
        text: 'Free Download',
        icon: Download,
      }
    }

    // Premium product logic:
    // CRITICAL: PRO users ALWAYS get download button
    if (effectivePlanTier === 'PRO' && effectiveHasSubscription) {
      return {
        component: 'download',
        text: hasDownloaded ? 'Download Now' : 'Unlock with 1 Credit',
        icon: hasDownloaded ? Download : Unlock,
      }
    }

    // 1. If user already downloaded it, they can re-download
    if (hasDownloaded) {
      return {
        component: 'download',
        text: 'Download Now',
        icon: Download,
      }
    }

    // 2. STARTER users with active subscription and credits
    if (effectivePlanTier === 'STARTER' && effectiveHasSubscription && hasCredits) {
      return {
        component: 'download',
        text: 'Unlock with 1 Credit',
        icon: Unlock,
      }
    }

    // 3. If STARTER user ran out of credits, suggest upgrade to PRO
    if (effectivePlanTier === 'STARTER' && !hasCredits) {
      return {
        component: 'upgrade',
        text: 'Upgrade to Premium Pro',
        icon: Sparkles,
      }
    }

    // 4. If FREE user or no subscription, suggest getting a subscription
    return {
      component: 'upgrade',
      text: 'Upgrade to Unlock',
      icon: Sparkles,
    }
  }

  const buttonConfig = getButtonConfig()
  const ButtonIcon = buttonConfig.icon

  return (
    <div className="space-y-6">

      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground flex-1">
          {data.name}
        </h1>
        <ProductShare productId={data.id} productName={data.name} />
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Product Type Badge */}
      {isPremiumProduct && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Premium
          </span>
          {effectiveHasSubscription && effectivePlanTier === 'PRO' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <Check className="h-3 w-3" />
              Unlimited Access
            </span>
          )}
          {effectiveHasSubscription && effectivePlanTier === 'STARTER' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              <Check className="h-3 w-3" />
              {creditsRemaining !== null && creditsRemaining > 0 
                ? `${creditsRemaining} Credit${creditsRemaining !== 1 ? 's' : ''} Available`
                : 'No Credits Remaining'}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-4">
        {isLoading ? (
          <Button
            disabled
            className="w-full h-12 text-base font-medium"
          >
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        ) : buttonConfig.component === 'download' ? (
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full h-12 text-base font-medium"
            iconOnly={false}
            customText={buttonConfig.text}
            customIcon={ButtonIcon}
          />
        ) : (
          <Button
            onClick={handleUpgradeToPremium}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary via-primary/90 to-primary hover:shadow-lg transition-all"
          >
            <ButtonIcon className="h-4 w-4 mr-2" />
            {buttonConfig.text}
          </Button>
        )}
        
        {/* Helper text */}
        {isPremiumProduct && !hasDownloaded && (
          <p className="text-xs text-center text-muted-foreground">
            {effectivePlanTier === 'PRO' && effectiveHasSubscription
              ? "Unlock with 1 credit (you have unlimited credits)"
              : hasActiveSubscription && hasCredits 
                ? "One credit will be used to unlock this premium download" 
                : effectivePlanTier === 'STARTER'
                  ? "You've used all your credits this month. Upgrade to Premium Pro for unlimited access."
                  : "Subscribe to a plan to unlock premium downloads with credits"}
          </p>
        )}
      </div>
    </div>
  )
}

export default Info
