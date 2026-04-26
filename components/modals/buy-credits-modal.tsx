"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useBuyCreditsModal } from "@/hooks/use-buy-credits-modal"
import { useCredits } from "@/hooks/use-credits"
import { useToast } from "@/components/ui/use-toast"

const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "a940170f-71ea-4c2b-b0ec-e2e9e3c68567"

export function BuyCreditsModal() {
  const { isOpen, returnTo, onClose } = useBuyCreditsModal()
  const { purchaseCredits } = useCredits(storeId)
  const { toast } = useToast()
  const [pendingPack, setPendingPack] = useState<"PACK_50" | "PACK_100" | null>(null)

  const handleBuyCredits = async (packId: "PACK_50" | "PACK_100") => {
    setPendingPack(packId)
    const result = await purchaseCredits(packId)

    if (result.error) {
      toast({
        title: "Purchase Failed",
        description: result.error,
        variant: "destructive",
      })
      setPendingPack(null)
      return
    }

    if (result.url) {
      if (returnTo) {
        sessionStorage.setItem("creditsReturnTo", returnTo)
      }
      window.location.href = result.url
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl px-10 pt-8 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Buy Credits
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose a credit pack to continue your download.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col">
                <p className="text-sm font-medium text-gray-600">50 Credits</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$6.99</p>
                <p className="text-xs text-gray-400 mt-1">$0.14 per credit</p>
                <button
                  type="button"
                  onClick={() => handleBuyCredits("PACK_50")}
                  disabled={pendingPack !== null}
                  className="mt-4 w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {pendingPack === "PACK_50" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Purchase"
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-primary bg-primary/5 p-4 flex flex-col">
                <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Best Value
                </span>
                <p className="text-sm font-medium text-gray-600">100 Credits</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$11.99</p>
                <p className="text-xs text-gray-400 mt-1">$0.12 per credit</p>
                <button
                  type="button"
                  onClick={() => handleBuyCredits("PACK_100")}
                  disabled={pendingPack !== null}
                  className="mt-4 w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {pendingPack === "PACK_100" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Purchase"
                  )}
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Secure checkout. Instant credit delivery.
            </p>
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
