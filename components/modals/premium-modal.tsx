"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { SubscriptionButton } from "@/components/subscription-button"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { Separator } from "@/components/ui/separator"
import { 
  Crown, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"
import { usePremiumModal } from "@/hooks/use-premium-modal"
import { useSubscription } from "@/hooks/use-subscription"
import { cn } from "@/lib/utils"

export function PremiumModal() {
  const premiumModal = usePremiumModal()
  const { isSignedIn } = useAuth()
  const [storeId, setStoreId] = useState<string>("")
  
  // Get subscription status
  // No auto-refresh to reduce API calls
  const { isActive: hasPremium, isLoading } = useSubscription(storeId, {
    autoRefresh: false,
  })

  // Get storeId from env
  useEffect(() => {
    const defaultStoreId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
    setStoreId(defaultStoreId)
  }, [])

  const onChange = (open: boolean) => {
    if (!open) {
      premiumModal.onClose()
    }
  }

  if (!storeId) return null

  return (
    <Dialog open={premiumModal.isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3 text-center">
            <Crown className="h-8 w-8 text-green-500" />
            <span className="text-3xl font-bold">Brandex Premium</span>
            <PremiumBadge size="lg" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <p className="text-center text-lg text-muted-foreground">
            Get unlimited access to all premium content with a 7-day free trial
          </p>

          {hasPremium ? (
            /* Already Premium */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">You're Already Premium!</h3>
              <p className="text-muted-foreground">
                You have full access to all premium products and features.
              </p>
              <Button
                onClick={() => premiumModal.onClose()}
                className="mt-4"
                variant="outline"
              >
                Continue Browsing
              </Button>
            </motion.div>
          ) : !isSignedIn ? (
            /* Not Signed In */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-muted/30 border border-border rounded-lg text-center"
            >
              <Crown className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to subscribe to Brandex Premium
              </p>
              <Button
                onClick={() => {
                  premiumModal.onClose()
                  window.location.href = "/sign-in"
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Sign In to Continue
              </Button>
            </motion.div>
          ) : (
            /* Show Upgrade Options */
            <>
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "All paid mockups for free",
                  "Unlimited downloads",
                  "Access to all categories",
                  "Exclusive premium-only products",
                  "Commercial license included",
                  "Early access to new releases",
                  "Download library & history",
                  "Priority support",
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Separator />

              {/* Subscription Button */}
              <SubscriptionButton
                storeId={storeId}
                size="lg"
                variant="premium"
              />

              {/* Trial Info */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  7-day free trial • Cancel anytime • No commitments
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



