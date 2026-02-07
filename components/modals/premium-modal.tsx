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

export function PremiumModal() {
  const premiumModal = usePremiumModal()
  const { isSignedIn } = useAuth()
  const [storeId, setStoreId] = useState<string>("")

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
            <span className="text-3xl font-bold">Brandex Credits</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <p className="text-center text-lg text-muted-foreground">
            Buy credits to unlock premium downloads. Each premium download costs 5 credits.
          </p>

          {!isSignedIn ? (
            /* Not Signed In */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-muted/30 border border-border rounded-lg text-center"
            >
              <Crown className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to purchase credits and download premium products
              </p>
              <Button
                onClick={() => {
                  premiumModal.onClose()
                  window.location.href = "/sign-in"
                }}
                className="w-full"
              >
                Sign In to Continue
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "5 credits per premium download",
                  "Unlimited free downloads",
                  "Credits never expire",
                  "Access to all categories",
                  "Download library & history",
                  "Re-downloads are free",
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/credits" onClick={() => premiumModal.onClose()}>
                  <Button size="lg" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Buy Credits
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  50 credits for $6.99 • 100 credits for $11.99
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



