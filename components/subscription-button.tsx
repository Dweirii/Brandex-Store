"use client"

import * as React from "react"
import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"
import { Sparkles, Loader2, Check } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

interface SubscriptionButtonProps {
  /**
   * Store ID for the subscription
   */
  storeId: string
  /**
   * Button size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  /**
   * Button variant
   * @default "default"
   */
  variant?: "default" | "outline" | "premium"
  /**
   * Show pricing details
   * @default true
   */
  showPricing?: boolean
  /**
   * Show trial information
   * @default true
   */
  showTrialInfo?: boolean
  /**
   * Custom className
   */
  className?: string
}

/**
 * Subscription Button Component
 * 
 * Button component for upgrading to Brandex Premium subscription.
 * Shows pricing options ($7/month or $70/year) and handles checkout flow.
 * 
 * @example
 * <SubscriptionButton storeId="store_123" />
 * <SubscriptionButton storeId="store_123" size="lg" showPricing={false} />
 */
export function SubscriptionButton({
  storeId,
  size = "default",
  variant = "default",
  showPricing = true,
  showTrialInfo = true,
  className,
}: SubscriptionButtonProps) {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  // Get API base URL
  const getAdminBaseUrl = () => {
    if (typeof window === "undefined") return ""
    const url = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
    const match = url.match(/https?:\/\/[^/]+/)
    return match ? match[0] : url
  }

  // Get Stripe price IDs from environment
  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe")
      return
    }

    if (!storeId) {
      toast.error("Store ID is required")
      return
    }

    const priceId = selectedPlan === "monthly" ? monthlyPriceId : yearlyPriceId

    if (!priceId) {
      toast.error("Subscription pricing not configured. Please contact support.")
      console.error("Missing price ID:", { monthlyPriceId, yearlyPriceId })
      return
    }

    const email = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress

    if (!email) {
      toast.error("Email address not found. Please sign in again.")
      return
    }

    setLoading(true)

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      
      if (!token) {
        toast.error("Failed to get authentication token. Please sign in again.")
        setLoading(false)
        return
      }

      const adminBaseUrl = getAdminBaseUrl()

      console.log("[SUBSCRIPTION_CHECKOUT] Creating subscription checkout", {
        storeId,
        priceId,
        plan: selectedPlan,
        email,
      })

      const response = await axios.post(
        `${adminBaseUrl}/api/${storeId}/subscription/checkout`,
        {
          priceId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url
      } else {
        throw new Error("No redirect URL in response")
      }
    } catch (error: any) {
      console.error("[SUBSCRIPTION_CHECKOUT_ERROR]", error)
      
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create subscription. Please try again."

      toast.error(errorMessage)
      setLoading(false)
    }
  }

  // Premium variant styling
  const premiumClasses =
    variant === "premium"
      ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white border-amber-400/50 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105"
      : ""

  return (
    <div className={className}>
      {showPricing && (
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedPlan("monthly")}
            disabled={loading}
            className={`
              flex-1 rounded-lg border-2 p-3 text-left transition-all
              ${
                selectedPlan === "monthly"
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-background hover:border-primary/50"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Monthly</div>
                <div className="text-2xl font-bold">$7</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              {selectedPlan === "monthly" && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan("yearly")}
            disabled={loading}
            className={`
              flex-1 rounded-lg border-2 p-3 text-left transition-all relative
              ${
                selectedPlan === "yearly"
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-background hover:border-primary/50"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              SAVE
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Yearly</div>
                <div className="text-2xl font-bold">$70</div>
                <div className="text-xs text-muted-foreground">per year</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  Save $14/year
                </div>
              </div>
              {selectedPlan === "yearly" && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </button>
        </div>
      )}

      {showTrialInfo && (
        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">7-day free trial</span>
            <span className="text-muted-foreground">• Cancel anytime</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubscribe}
        disabled={loading || !isSignedIn}
        size={size}
        variant={variant === "premium" ? "default" : variant}
        className={`w-full ${premiumClasses}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Upgrade to Premium</span>
          </>
        )}
      </Button>

      {!isSignedIn && (
        <p className="mt-2 text-xs text-center text-muted-foreground">
          Please sign in to subscribe
        </p>
      )}
    </div>
  )
}

/**
 * Simple subscription button without pricing selector
 * For use cases where you just need a simple "Upgrade" button
 */
export function SimpleSubscriptionButton({
  storeId,
  size = "default",
  className,
}: Omit<SubscriptionButtonProps, "showPricing" | "showTrialInfo" | "variant">) {
  return (
    <SubscriptionButton
      storeId={storeId}
      size={size}
      showPricing={false}
      showTrialInfo={false}
      className={className}
    />
  )
}

