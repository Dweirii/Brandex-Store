"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Coins, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useBuyCreditsModal } from "@/hooks/use-buy-credits-modal"
import { useCredits } from "@/hooks/use-credits"
import { useToast } from "@/components/ui/use-toast"

const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "a940170f-71ea-4c2b-b0ec-e2e9e3c68567"

export function BuyCreditsModal() {
  const { isOpen, returnTo, onClose } = useBuyCreditsModal()
  const { balance, isLoading, purchaseCredits } = useCredits(storeId)
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-150 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-[35%_65%]">
              <div className="relative overflow-hidden border-b border-border/60 bg-linear-to-br from-primary to-primary/85 p-4 text-primary-foreground md:border-b-0 md:border-r">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-12 -left-6 h-24 w-24 rounded-full bg-white/10" />

                <div className="relative z-10">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                    <Coins className="h-3.5 w-3.5" />
                    CREDIT PACKS
                  </div>

                  <h2 className="text-lg font-bold leading-tight">
                    Buy credits and keep downloading
                  </h2>

                  <p className="mt-2 text-sm text-primary-foreground/85">
                    One-time credit packs. No subscription.
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Instant checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Credits added automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Best value highlighted</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/70">
                      Current balance
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-xl font-bold">
                        {isLoading ? "…" : balance}
                      </span>
                      <span className="pb-0.5 text-sm text-primary-foreground/75">
                        credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Choose a pack
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-foreground">
                      Select your credits
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border-2 border-border p-3 transition-colors hover:border-primary">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      50 Credits
                    </h3>
                    <p className="mb-1 text-xl font-bold text-primary">$6.99</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      $0.14 per credit
                    </p>

                    <div className="mb-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        Standard value
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        Good for light usage
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuyCredits("PACK_50")}
                      disabled={pendingPack !== null}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {pendingPack === "PACK_50" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Buy 50"
                      )}
                    </Button>
                  </div>

                  <div className="relative rounded-xl border-2 border-primary bg-primary/5 p-3">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                      Best Value
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      100 Credits
                    </h3>
                    <p className="mb-1 text-xl font-bold text-primary">$11.99</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      $0.12 per credit
                    </p>

                    <div className="mb-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        Better value per credit
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        Best for frequent downloads
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuyCredits("PACK_100")}
                      disabled={pendingPack !== null}
                      className="w-full"
                      size="sm"
                    >
                      {pendingPack === "PACK_100" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Buy 100"
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="mt-4 w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
