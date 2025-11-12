"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/Button"
import { SubscriptionButton } from "@/components/subscription-button"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Crown, 
  Loader2, 
  Calendar, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  Sparkles,
  RefreshCw,
  X,
  Check
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import axios from "axios"
import { useSubscription, triggerSubscriptionRefresh } from "@/hooks/use-subscription"

// Get API base URL helper
const getAdminBaseUrl = () => {
  if (typeof window === "undefined") return ""
  const url = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
  const match = url.match(/https?:\/\/[^/]+/)
  return match ? match[0] : url
}

interface DownloadStats {
  totalDownloads: number
  premiumDownloads: number
  freeDownloads: number
}

export default function PremiumPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getToken, isSignedIn, userId } = useAuth()
  const storeId = searchParams.get("storeId") || process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
  const productId = searchParams.get("productId") // Optional: redirect after subscription
  
  // Hooks must be called before early returns
  const { subscription, hasSubscription, isActive, isLoading: subscriptionLoading, refresh } = useSubscription(storeId || "")
  
  // Show error if storeId is missing
  if (!storeId) {
    return (
      <Container>
        <div className="py-8 md:py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
          >
            <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-6" />
            <p className="text-2xl font-bold mb-4 text-foreground">Store ID Required</p>
            <p className="text-lg text-center max-w-md mb-8">
              Please provide a store ID to view subscription information.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <a href="/">Go Home</a>
            </Button>
          </motion.div>
        </div>
      </Container>
    )
  }
  
  const [downloadStats, setDownloadStats] = useState<DownloadStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCanceled, setShowCanceled] = useState(false)

  // Check for success/canceled params from Stripe redirect
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    
    if (success === "true") {
      setShowSuccess(true)
      refresh()
      // Clean URL
      router.replace("/premium", { scroll: false })
      setTimeout(() => setShowSuccess(false), 5000)
    }
    
    if (canceled === "true") {
      setShowCanceled(true)
      router.replace("/premium", { scroll: false })
      setTimeout(() => setShowCanceled(false), 5000)
    }
  }, [searchParams, router, refresh])

  // Fetch download statistics
  useEffect(() => {
    if (!isSignedIn || !storeId || !isActive) {
      setDownloadStats(null)
      return
    }

    const fetchDownloadStats = async () => {
      setIsLoadingStats(true)
      try {
        const token = await getToken({ template: "CustomerJWTBrandex" })
        if (!token) return

        const adminBaseUrl = getAdminBaseUrl()
        // Note: You may need to create this endpoint
        // For now, we'll use a placeholder or calculate from orders
        const response = await axios.get(
          `${adminBaseUrl}/api/${storeId}/subscription/download-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setDownloadStats(response.data)
      } catch (error) {
        console.error("[PREMIUM_PAGE] Failed to fetch download stats:", error)
        // Don't show error - stats are optional
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchDownloadStats()
  }, [isSignedIn, storeId, isActive, getToken])

  const handleCancel = async () => {
    if (!storeId || !subscription) return

    if (!confirm("Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.")) {
      return
    }

    setIsCanceling(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed. Please try again.")
        return
      }

      const adminBaseUrl = getAdminBaseUrl()
      const response = await axios.post(
        `${adminBaseUrl}/api/${storeId}/subscription/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Subscription canceled. You'll keep access until the end of your billing period.")
        refresh()
        triggerSubscriptionRefresh() // Notify all components
      } else {
        throw new Error(response.data.message || "Failed to cancel subscription")
      }
    } catch (error: any) {
      console.error("[PREMIUM_PAGE] Cancel error:", error)
      toast.error(error.response?.data || "Failed to cancel subscription. Please try again.")
    } finally {
      setIsCanceling(false)
    }
  }

  const handleResume = async () => {
    if (!storeId || !subscription) return

    setIsResuming(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed. Please try again.")
        return
      }

      const adminBaseUrl = getAdminBaseUrl()
      const response = await axios.post(
        `${adminBaseUrl}/api/${storeId}/subscription/resume`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Subscription resumed! Your subscription will continue to renew automatically.")
        refresh()
        triggerSubscriptionRefresh() // Notify all components
      } else {
        throw new Error(response.data.message || "Failed to resume subscription")
      }
    } catch (error: any) {
      console.error("[PREMIUM_PAGE] Resume error:", error)
      toast.error(error.response?.data || "Failed to resume subscription. Please try again.")
    } finally {
      setIsResuming(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusBadge = () => {
    if (!subscription) return null

    const status = subscription.status
    const isTrialing = status === "TRIALING"
    const isCanceled = subscription.cancelAtPeriodEnd

    if (isTrialing) {
      return (
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Trial Active
        </Badge>
      )
    }

    if (isCanceled) {
      return (
        <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Canceling
        </Badge>
      )
    }

    if (status === "ACTIVE") {
      return (
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )
    }

    return (
      <Badge variant="secondary">
        {status}
      </Badge>
    )
  }

  return (
    <Container>
      <div className="py-8 md:py-12 lg:py-16">
        {/* Success/Canceled Alerts */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle2 className="h-5 w-5" />
                <AlertTitle>Subscription Activated!</AlertTitle>
                <AlertDescription>
                  Welcome to Brandex Premium! Your subscription is now active.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {showCanceled && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Checkout Canceled</AlertTitle>
                <AlertDescription>
                  Your subscription checkout was canceled. You can try again anytime.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Crown className="h-12 w-12 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Brandex Premium
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Unlock unlimited access to all premium mockups, artwork, photography, and PSDs
          </motion.p>
        </div>

        {/* Loading State */}
        {subscriptionLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
          >
            <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
            <p className="text-xl font-semibold mb-2">Loading subscription status...</p>
            <p className="text-sm">Please wait a moment.</p>
          </motion.div>
        ) : !isSignedIn ? (
          /* Not Signed In */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
          >
            <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-6" />
            <p className="text-2xl font-bold mb-4 text-foreground">Sign In Required</p>
            <p className="text-lg text-center max-w-md mb-8">
              Please sign in to view and manage your subscription.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <a href="/sign-in">Sign In</a>
            </Button>
          </motion.div>
        ) : !hasSubscription ? (
          /* No Subscription - Show Upgrade Options */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <PremiumBadge size="lg" className="mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Upgrade to Premium
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Get unlimited access to all premium content with a 7-day free trial
                </p>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Subscription Button */}
              {storeId && (
                <SubscriptionButton
                  storeId={storeId}
                  size="lg"
                  variant="premium"
                  className="max-w-md mx-auto"
                />
              )}
            </div>
          </motion.div>
        ) : (
          /* Has Subscription - Show Management */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Subscription Status Card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <PremiumBadge size="lg" />
                    {getStatusBadge()}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Premium Subscription
                  </h2>
                  {subscription?.statusDescription && (
                    <p className="text-muted-foreground mt-1">
                      {subscription.statusDescription}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  {subscription?.cancelAtPeriodEnd ? (
                    <Button
                      onClick={handleResume}
                      disabled={isResuming}
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
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
                  ) : (
                    <Button
                      onClick={handleCancel}
                      disabled={isCanceling || subscription?.status === "CANCELED"}
                      variant="destructive"
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trial Period */}
                {subscription?.trialEnd && subscription.status === "TRIALING" && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <h3 className="font-semibold text-foreground">Trial Period</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Trial ends: {formatDate(subscription.trialEnd)}
                    </p>
                    {subscription.daysRemaining !== null && (
                      <p className="text-lg font-bold text-blue-400">
                        {subscription.daysRemaining} day{subscription.daysRemaining !== 1 ? "s" : ""} remaining
                      </p>
                    )}
                  </div>
                )}

                {/* Current Period */}
                {subscription?.currentPeriodEnd && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Billing Period</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {subscription.cancelAtPeriodEnd ? "Access until" : "Renews on"}: {formatDate(subscription.currentPeriodEnd)}
                    </p>
                    {subscription.daysRemaining !== null && (
                      <p className="text-lg font-bold text-foreground">
                        {subscription.daysRemaining} day{subscription.daysRemaining !== 1 ? "s" : ""} {subscription.cancelAtPeriodEnd ? "remaining" : "until renewal"}
                      </p>
                    )}
                  </div>
                )}

                {/* Subscription Start */}
                {subscription?.currentPeriodStart && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-foreground">Member Since</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(subscription.currentPeriodStart)}
                    </p>
                  </div>
                )}

                {/* Store Info */}
                {subscription?.store && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-foreground">Store</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subscription.store.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Download Statistics */}
            {isActive && (
              <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Download Statistics</h2>
                </div>

                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : downloadStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold text-foreground">{downloadStats.totalDownloads}</p>
                      <p className="text-sm text-muted-foreground">Total Downloads</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <Crown className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-foreground">{downloadStats.premiumDownloads}</p>
                      <p className="text-sm text-muted-foreground">Premium Downloads</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-foreground">{downloadStats.freeDownloads}</p>
                      <p className="text-sm text-muted-foreground">Free Downloads</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Download statistics will appear here once you start downloading.
                  </p>
                )}
              </div>
            )}

            {/* Benefits Reminder */}
            <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Premium Benefits
              </h3>
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
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Container>
  )
}

