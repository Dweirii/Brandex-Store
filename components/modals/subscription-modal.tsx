"use client"

import { useState, useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Crown,
  CheckCircle2,
  Loader2,
  Calendar,
  XCircle,
  RefreshCw
} from "lucide-react"
import { useSubscription, triggerSubscriptionRefresh } from "@/hooks/use-subscription"
import { cancelSubscription, resumeSubscription, createSubscriptionCheckout } from "@/lib/subscription-api-client"
import toast from "react-hot-toast"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

const getAdminBaseUrl = () => {
  if (typeof window === "undefined") return ""
  const url = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
  const match = url.match(/https?:\/\/[^/]+/)
  return match ? match[0] : url
}

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeId: string
}

export function SubscriptionModal({ open, onOpenChange, storeId }: SubscriptionModalProps) {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  // NO auto-refresh - only fetch on mount and manual refresh
  const { subscription, hasSubscription, isActive, isLoading, refresh, clearCache } = useSubscription(storeId, {
    autoRefresh: false, // Disabled to stop excessive API calls
  })

  const [isVerifying, setIsVerifying] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)

  // Plan pricing IDs
  const starterMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID
  const proMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
  const proYearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
  
  // Legacy support
  const legacyMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID
  const legacyYearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID

  // Handle Stripe redirect after checkout
  useEffect(() => {
    if (!open) return

    const success = searchParams.get("success")
    const sessionId = searchParams.get("session_id")
    const upgrade = searchParams.get("upgrade")

    // Handle instant upgrade success
    if (upgrade === "success") {
      clearCache()
      refresh()
      triggerSubscriptionRefresh()
      router.replace(window.location.pathname, { scroll: false })
      return
    }

    if (success === "true" && sessionId) {
      setIsVerifying(true)

      const pollSubscription = async () => {
        const maxAttempts = 30
        let attempts = 0

        const poll = async (): Promise<boolean> => {
          if (attempts >= maxAttempts) return false

          try {
            const token = await getToken({ template: "CustomerJWTBrandex" })
            if (!token) return false

            const adminBaseUrl = getAdminBaseUrl()
            const verifyResponse = await axios.get(
              `${adminBaseUrl}/api/${storeId}/subscription/verify-session?session_id=${sessionId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )

            if (verifyResponse.data?.verified && verifyResponse.data?.hasSubscription) {
              clearCache()
              await refresh()
              triggerSubscriptionRefresh()
              setIsVerifying(false)
              router.replace(window.location.pathname, { scroll: false })
              toast.success("Subscription activated")
              return true
            }

            attempts++
            await new Promise(resolve => setTimeout(resolve, 1000))
            return poll()
          } catch {
            attempts++
            if (attempts >= maxAttempts) {
              setIsVerifying(false)
              toast.error("Verification timed out. Please refresh.")
              return false
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
            return poll()
          }
        }

        await poll()
      }

      pollSubscription()
    }
  }, [searchParams, open, storeId, getToken, refresh, router, user, clearCache])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubscribe = async (planTier: "STARTER" | "PRO", interval: "monthly" | "yearly" = "monthly") => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to subscribe")
      return
    }

    // Determine price ID based on plan tier and interval
    let priceId: string | undefined
    
    if (planTier === "STARTER") {
      priceId = starterMonthlyPriceId
    } else if (planTier === "PRO") {
      priceId = interval === "monthly" ? proMonthlyPriceId : proYearlyPriceId
    }
    
    // Fallback to legacy IDs if new ones aren't configured
    if (!priceId && planTier === "PRO") {
      priceId = interval === "monthly" ? legacyMonthlyPriceId : legacyYearlyPriceId
    }

    if (!priceId) {
      toast.error("Subscription pricing not configured")
      return
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed")
        return
      }

      // Temporarily send email as fallback until Clerk JWT template is updated
      const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || ""
      const checkoutUrl = await createSubscriptionCheckout(storeId, priceId, email, token)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to start checkout")
    }
  }

  const handleCancel = () => {
    setShowCancelConfirm(true)
  }

  const confirmCancel = async () => {
    setShowCancelConfirm(false)

    if (!storeId) {
      toast.error("Store ID is missing")
      return
    }

    setIsCanceling(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed. Please sign in again.")
        setIsCanceling(false)
        return
      }

      const wasTrial = subscription?.status === "TRIALING"

      await cancelSubscription(storeId, token)

      // Clear cache and refresh
      clearCache()
      await new Promise(resolve => setTimeout(resolve, 300))
      await refresh()
      triggerSubscriptionRefresh()

      const message = wasTrial
        ? "Trial canceled"
        : "Subscription canceled"

      toast.success(message)
    } catch (error) {
      console.error("[MODAL_CANCEL_ERROR] Cancel error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel subscription"
      toast.error(errorMessage)
    } finally {
      setIsCanceling(false)
    }
  }

  const handleResume = async () => {
    setIsResuming(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed")
        return
      }

      await resumeSubscription(storeId, token)
      clearCache()
      await new Promise(resolve => setTimeout(resolve, 300))
      await refresh()
      triggerSubscriptionRefresh()
      toast.success("Subscription resumed")
    } catch (error) {
      console.error("Resume error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to resume subscription")
    } finally {
      setIsResuming(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  // Get the current plan tier from subscription
  const currentPlanTier = subscription?.planTier || "FREE"

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed")
        return
      }

      const email = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress || ""
      const priceId = proMonthlyPriceId || legacyMonthlyPriceId
      
      if (!priceId) {
        toast.error("Pro plan not configured")
        return
      }

      const redirectUrl = await createSubscriptionCheckout(storeId, priceId, email, token)
      
      // Check if this is an instant upgrade (contains upgrade=success) or a checkout URL
      if (redirectUrl.includes("upgrade=success")) {
        // Instant upgrade - refresh subscription and show success
        clearCache()
        await new Promise(resolve => setTimeout(resolve, 500))
        await refresh()
        triggerSubscriptionRefresh()
        toast.success("Successfully upgraded to Pro!")
      } else {
        // Redirect to Stripe checkout
        window.location.href = redirectUrl
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upgrade. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-primary" />
            Subscription
          </DialogTitle>
        </DialogHeader>

        {isVerifying ? (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Verifying your subscription...
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : !isSignedIn ? (
          <div className="py-6 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to manage your subscription
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        ) : hasSubscription && isActive ? (
          <div className="space-y-4">
            {/* Active Subscription */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Active</span>
                </div>
                <Badge variant="default" className="bg-primary">
                  {currentPlanTier === "STARTER" ? "Starter" : currentPlanTier === "PRO" ? "Pro" : "Free"}
                </Badge>
              </div>

              {subscription && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Current Plan:</span>
                    <span className="text-muted-foreground">
                      {currentPlanTier === "STARTER" ? "Starter" : currentPlanTier === "PRO" ? "Pro" : "Free"}
                    </span>
                  </div>

                  {subscription.status === "TRIALING" && subscription.trialEnd && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Trial ends: {formatDate(subscription.trialEnd)}</span>
                    </div>
                  )}

                  {subscription.currentPeriodEnd && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {subscription.cancelAtPeriodEnd
                          ? `Access until: ${formatDate(subscription.currentPeriodEnd)}`
                          : `Renews: ${formatDate(subscription.currentPeriodEnd)}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 text-center">
                <Link href="/premium" className="text-xs text-primary hover:underline" onClick={() => onOpenChange(false)}>
                  View All Plans
                </Link>
              </div>

              <Separator className="my-4" />

              {/* Upgrade to Pro for Starter users */}
              {currentPlanTier === "STARTER" && !subscription?.cancelAtPeriodEnd && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm font-medium">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">
                    Get access to advanced features and unlimited content
                  </p>
                  <Button
                    onClick={handleUpgradeToPro}
                    disabled={isUpgrading}
                    className="w-full"
                    variant="default"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </>
                    )}
                  </Button>
                  <Separator className="my-4" />
                </div>
              )}

              {subscription?.cancelAtPeriodEnd ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your subscription will cancel at the end of the current period.
                  </p>
                  <Button
                    onClick={handleResume}
                    disabled={isResuming}
                    className="w-full"
                    variant="default"
                  >
                    {isResuming ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resume Subscription
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleCancel}
                  disabled={isCanceling}
                  variant="outline"
                  className="w-full"
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      {currentPlanTier === "PRO" ? "Downgrade / Cancel" : "Cancel Subscription"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-6">
            {/* No Subscription - Redirect to Pricing Page */}
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get unlimited access to premium content with our Starter or Pro plans
            </p>
            <Button
              onClick={() => window.location.href = "/premium"}
              className="w-full"
              size="lg"
            >
              View Plans & Pricing
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Subscription?</DialogTitle>
            <DialogDescription>
              {subscription?.status === "TRIALING"
                ? "Your trial will end immediately."
                : subscription?.currentPeriodEnd
                  ? `Access until ${formatDate(subscription.currentPeriodEnd)}`
                  : "You'll retain access until the billing period ends."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(false)}
              disabled={isCanceling}
              className="flex-1"
            >
              Keep
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={isCanceling}
              className="flex-1"
            >
              {isCanceling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

