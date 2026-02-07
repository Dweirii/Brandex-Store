"use client";

import { useEffect, useState } from "react";
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

export default function CreditsPage() {
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
      router.push("/sign-in?redirect=/credits");
      return;
    }

    // Handle success callback from Stripe
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast({
        title: "Purchase Successful!",
        description: "Your credits have been added to your account.",
        variant: "default",
      });
      refresh();
      // Clean URL
      window.history.replaceState({}, "", "/credits");
    } else if (canceled === "true") {
      toast({
        title: "Purchase Canceled",
        description: "Your credit purchase was canceled.",
        variant: "destructive",
      });
      // Clean URL
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Your Credits
          </h1>
          <p className="text-muted-foreground">
            Manage your credits and download history
          </p>
        </motion.div>

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
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-2xl text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Coins className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Available Balance</p>
                  <p className="text-4xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin inline" />
                    ) : (
                      `${balance} Credits`
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPurchaseModal(true)}
                variant="outline"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 border-0 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Buy Credits
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Each premium download costs 5 credits. Free products don&apos;t require credits.
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
              <h2 className="text-2xl font-bold mb-6">Buy Credits</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Pack 50 */}
                <div className="border-2 border-border rounded-xl p-6 hover:border-primary transition-colors">
                  <h3 className="text-xl font-semibold mb-2">50 Credits</h3>
                  <p className="text-3xl font-bold text-primary mb-4">$6.99</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    $0.14 per credit
                  </p>
                  <Button
                    onClick={() => handleBuyCredits("PACK_50")}
                    className="w-full"
                  >
                    Purchase
                  </Button>
                </div>

                {/* Pack 100 */}
                <div className="border-2 border-primary rounded-xl p-6 relative bg-primary/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Best Value
                  </div>
                  <h3 className="text-xl font-semibold mb-2">100 Credits</h3>
                  <p className="text-3xl font-bold text-primary mb-4">$11.99</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    $0.12 per credit
                  </p>
                  <Button
                    onClick={() => handleBuyCredits("PACK_100")}
                    className="w-full"
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
                        purchase.status === "COMPLETED" ? "text-green-600" : "text-muted-foreground"
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
                        download.isFree ? "text-green-600" : "text-primary"
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
