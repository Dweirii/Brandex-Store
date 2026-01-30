"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import {
  Crown,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"
import { usePremiumModal } from "@/hooks/use-premium-modal"
import { useSubscription } from "@/hooks/use-subscription"

export function PremiumModal() {
  const premiumModal = usePremiumModal()
  const { isSignedIn } = useAuth()
  const [storeId, setStoreId] = useState<string>("")

  // Get subscription status
  // No auto-refresh to reduce API calls
  const { subscription } = useSubscription(storeId, {
    autoRefresh: false,
  })
  
  const currentPlanTier = subscription?.planTier || "FREE"

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
            <span className="text-3xl font-bold">Brandex Plans</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <p className="text-center text-lg text-muted-foreground">
            {currentPlanTier === "STARTER"
              ? "Upgrade to Premium Pro for unlimited credits and priority support"
              : currentPlanTier === "PRO"
              ? "You have unlimited credits and full access to all premium content"
              : "Explore free content. Upgrade to unlock premium downloads with credits."}
          </p>

          {currentPlanTier === "PRO" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">You&apos;re on Premium Pro!</h3>
              <p className="text-muted-foreground">
                You have unlimited credits and full access to all premium products.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={() => premiumModal.onClose()}
                  variant="outline"
                >
                  Continue Browsing
                </Button>
                <Link href="/premium" className="text-sm text-green-600 hover:underline" onClick={() => premiumModal.onClose()}>
                  View All Plans
                </Link>
              </div>
            </motion.div>
          ) : currentPlanTier === "STARTER" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center"
            >
              <Crown className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">You&apos;re on Premium</h3>
              <p className="text-muted-foreground mb-4">
                You have 50 credits per month. Upgrade to Premium Pro for unlimited credits and priority support.
              </p>
              <Link href="/premium">
                <Button
                  onClick={() => premiumModal.onClose()}
                  className="w-full"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium Pro
                </Button>
              </Link>
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
                Please sign in to view and subscribe to plans
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
              <div className="mt-4">
                <Link href="/premium" className="text-sm text-muted-foreground hover:text-primary hover:underline" onClick={() => premiumModal.onClose()}>
                  View all plans
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Use credits to unlock premium downloads",
                  "Unlimited free downloads",
                  "50 credits per month (Premium) or unlimited (Premium Pro)",
                  "Access to all categories",
                  "Download library & history",
                  "Priority support (Premium Pro)",
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
              <div className="flex flex-col gap-3">
                <Link href="/premium" onClick={() => premiumModal.onClose()}>
                  <Button size="lg" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    View plans & pricing
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  Cancel anytime • No commitments
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



