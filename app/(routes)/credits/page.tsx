"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Coins, ShoppingBag, Download, Calendar, Check, AlertCircle, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "a940170f-71ea-4c2b-b0ec-e2e9e3c68567";

function CreditsPageContent() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const {
    balance,
    isLoading,
    error,
    purchases,
    downloads,
    refresh,
    purchaseCredits,
  } = useCredits(storeId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/credits&message=Sign+in+to+buy+credits.");
      return;
    }

    // Handle success callback from Stripe
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      const returnTo = sessionStorage.getItem("creditsReturnTo");
      sessionStorage.removeItem("creditsReturnTo");

      toast({
        title: "Purchase Successful!",
        description: returnTo
          ? "Credits added! Returning you to your download…"
          : "Your credits have been added to your account.",
        variant: "default",
      });
      refresh();

      if (returnTo) {
        setTimeout(() => { window.location.href = returnTo }, 1500);
      } else {
        window.history.replaceState({}, "", "/credits");
      }
    } else if (canceled === "true") {
      sessionStorage.removeItem("creditsReturnTo");
      toast({
        title: "Purchase Canceled",
        description: "Your credit purchase was canceled.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", "/credits");
    }
  }, [isLoaded, isSignedIn, searchParams, router, toast, refresh]);

  const handleBuyCredits = async (packId: "PACK_50" | "PACK_100") => {
    const result = await purchaseCredits(packId);

    if (result.error) {
      toast({
        title: "Purchase Failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.url) {
      // Persist returnTo so we can redirect after Stripe brings user back
      const returnTo = searchParams.get("returnTo");
      if (returnTo) {
        sessionStorage.setItem("creditsReturnTo", returnTo);
      }
      window.location.href = result.url;
    }
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="py-4 px-2">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Your Credits
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your credits and download history
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Credit Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl px-5 py-4 shadow-lg text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Coins className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">Credits Available</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin inline" />
                    ) : (
                      balance
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPurchaseModal(true)}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 border-0 shadow-lg text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Buy Credits
              </Button>
            </div>
            <p className="text-xs opacity-70 mt-2">
              You have {isLoading ? "…" : balance} credits available. Each premium download costs 5 credits.
            </p>
          </div>
        </motion.div>

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Buy Credits</h2>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {/* Pack 50 */}
                <div className="border-2 border-border rounded-xl p-4 hover:border-primary transition-colors">
                  <h3 className="text-base font-semibold mb-1">50 Credits</h3>
                  <p className="text-2xl font-bold text-primary mb-1">$6.99</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    $0.14 per credit
                  </p>
                  <Button
                    onClick={() => handleBuyCredits("PACK_50")}
                    className="w-full"
                    size="sm"
                  >
                    Purchase
                  </Button>
                </div>

                {/* Pack 100 */}
                <div className="border-2 border-primary rounded-xl p-4 relative bg-primary/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Best Value
                  </div>
                  <h3 className="text-base font-semibold mb-1">100 Credits</h3>
                  <p className="text-2xl font-bold text-primary mb-1">$11.99</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    $0.12 per credit
                  </p>
                  <Button
                    onClick={() => handleBuyCredits("PACK_100")}
                    className="w-full"
                    size="sm"
                  >
                    Purchase
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowPurchaseModal(false)}
                variant="ghost"
                className="w-full"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Purchase History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Purchase History</h2>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No purchases yet</p>
                  <Button
                    onClick={() => setShowPurchaseModal(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    Buy Your First Credits
                  </Button>
                </div>
              ) : (
                purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Coins className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{purchase.amount} Credits</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${purchase.price}</p>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        purchase.status === "COMPLETED" ? "text-primary" : "text-muted-foreground"
                      )}>
                        {purchase.status === "COMPLETED" && <Check className="h-3 w-3" />}
                        {purchase.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Download History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Download History</h2>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </div>
              ) : downloads.length === 0 ? (
                <div className="text-center py-12">
                  <Download className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No downloads yet</p>
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    className="mt-4"
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                downloads.map((download) => (
                  <div
                    key={download.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    {download.productImage && (
                      <Image
                        src={download.productImage}
                        alt={download.productName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{download.productName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(download.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-semibold",
                        download.isFree ? "text-primary" : "text-primary"
                      )}>
                        {download.isFree ? "Free" : `${download.creditsUsed} credits`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CreditsPageContent />
    </Suspense>
  );
}
