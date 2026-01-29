"use client"

import * as React from "react"
import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"
import { Sparkles, Loader2, Check } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { triggerSubscriptionRefresh } from "@/hooks/use-subscription"



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

  // Get API URL - NEXT_PUBLIC_API_URL already includes the store path
  const getApiUrl = () => {
    if (typeof window === "undefined") return ""
    return process.env.NEXT_PUBLIC_API_URL || ""
  }

  // Get Stripe price IDs from environment
  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID

  // Get pricing from environment variables (defaults to $5/month and $39.99/year)
  const monthlyPrice = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE || "5")
  const yearlyPrice = parseFloat(process.env.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE || "39.99")

  // Calculate savings (monthly price * 12 - yearly price)
  const monthlyYearlyTotal = monthlyPrice * 12
  const savings = monthlyYearlyTotal - yearlyPrice

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

      const apiUrl = getApiUrl()
      if (!apiUrl) {
        toast.error("API URL not configured. Please contact support.")
        setLoading(false)
        return
      }

      const response = await axios.post(
        `${apiUrl}/subscription/checkout`,
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
    } catch (error) {
      // Extract detailed error message
      let errorMessage = "Failed to create subscription. Please try again."

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any

      if (err.response?.data) {
        // Try to parse JSON error response
        const errorData = typeof err.response.data === 'string'
          ? JSON.parse(err.response.data)
          : err.response.data

        errorMessage = errorData?.error || errorData?.message || errorMessage
      } else if (err.message) {
        errorMessage = err.message
      }

      // Handle "already subscribed" error gracefully
      if (errorMessage.includes("already have an active subscription")) {
        toast.success("You already have an active subscription!")
        // Force a refresh of the subscription status
        triggerSubscriptionRefresh()
        // Close modal if possible (this component doesn't control modal, but refreshing might trigger parent to close)
        setLoading(false)
        return
      }

      toast.error(errorMessage)
      setLoading(false)
    }
  }

  // Premium variant styling
  const premiumClasses =
    variant === "premium"
      ? "bg-gradient-to-r from-green-500 via-[#00FF00] to-green-500 text-white font-bold border-green-400/50 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
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
              ${selectedPlan === "monthly"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-background hover:border-primary/50"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Monthly</div>
                <div className="text-2xl font-bold">${monthlyPrice.toFixed(monthlyPrice % 1 === 0 ? 0 : 2)}</div>
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
              ${selectedPlan === "yearly"
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
                <div className="text-2xl font-bold">${yearlyPrice.toFixed(yearlyPrice % 1 === 0 ? 0 : 2)}</div>
                <div className="text-xs text-muted-foreground">per year</div>
                {savings > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                    Save ${savings.toFixed(2)}/year
                  </div>
                )}
              </div>
              {selectedPlan === "yearly" && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </button>
        </div>
      )}

      {showTrialInfo && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">7-day free trial</span>
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
          <span>Choose Plan</span>
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

