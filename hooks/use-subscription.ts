"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@clerk/nextjs"

interface SubscriptionStatus {
  hasSubscription: boolean
  isActive: boolean
  subscription: {
    id: string
    status: string
    statusDescription: string
    daysRemaining: number | null
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    trialStart: string | null
    trialEnd: string | null
    cancelAtPeriodEnd: boolean
    stripeSubscriptionId: string | null
    stripeCustomerId: string | null
    createdAt: string
    updatedAt: string
    store: {
      id: string
      name: string
    } | null
  } | null
}

/**
 * Hook to fetch and cache subscription status
 * 
 * Features:
 * - Automatic caching of subscription state
 * - Refresh on subscription changes (via custom events)
 * - Manual refresh capability
 * - Optimistic updates support
 * 
 * @param storeId - Store ID to check subscription for
 * @param options - Optional configuration
 * @param options.autoRefresh - Enable automatic refresh on window focus (default: true)
 * @param options.refreshInterval - Interval in ms for automatic refresh (default: 5 minutes)
 * 
 * @returns Subscription status and loading state
 * 
 * @example
 * const { subscription, isActive, isLoading, refresh } = useSubscription(storeId)
 * 
 * // Trigger refresh after subscription action
 * await cancelSubscription()
 * refresh()
 */
export function useSubscription(
  storeId: string,
  options?: {
    autoRefresh?: boolean
    refreshInterval?: number
  }
) {
  const { getToken, isSignedIn, userId } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Cache key for this subscription
  const cacheKey = `subscription_${storeId}_${userId || 'anonymous'}`
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Get API base URL
  const getAdminBaseUrl = () => {
    if (typeof window === "undefined") return ""
    const url = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
    const match = url.match(/https?:\/\/[^/]+/)
    return match ? match[0] : url
  }

  // Fetch subscription from API
  const fetchSubscription = useCallback(async (showLoading = true) => {
    if (!isSignedIn || !storeId) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    try {
      if (showLoading) {
        setIsLoading(true)
      }
      setError(null)

      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        if (isMountedRef.current) {
          setSubscription(null)
          setIsLoading(false)
        }
        return
      }

      const adminBaseUrl = getAdminBaseUrl()
      const response = await fetch(
        `${adminBaseUrl}/api/${storeId}/subscription/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          // No subscription found - this is normal
          const noSubscriptionData: SubscriptionStatus = {
            hasSubscription: false,
            isActive: false,
            subscription: null,
          }
          
          if (isMountedRef.current) {
            setSubscription(noSubscriptionData)
            setIsLoading(false)
            // Cache the "no subscription" state
            if (typeof window !== "undefined") {
              sessionStorage.setItem(cacheKey, JSON.stringify(noSubscriptionData))
            }
          }
          return
        }
        throw new Error(`Failed to fetch subscription: ${response.status}`)
      }

      const data: SubscriptionStatus = await response.json()

      if (isMountedRef.current) {
        setSubscription(data)
        setIsLoading(false)
        // Cache the subscription data
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, JSON.stringify(data))
        }
      }
    } catch (err) {
      console.error("[USE_SUBSCRIPTION_ERROR]", err)
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch subscription")
        setIsLoading(false)
      }
    }
  }, [isSignedIn, storeId, getToken, userId, cacheKey])

  // Load from cache on mount
  useEffect(() => {
    if (typeof window !== "undefined" && isSignedIn && storeId) {
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const cachedData = JSON.parse(cached) as SubscriptionStatus
          setSubscription(cachedData)
          setIsLoading(false)
          // Still fetch fresh data in background
          fetchSubscription(false)
        }
      } catch (err) {
        console.error("[USE_SUBSCRIPTION_CACHE_ERROR]", err)
      }
    }
  }, [cacheKey, isSignedIn, storeId, fetchSubscription])

  // Initial fetch and setup
  useEffect(() => {
    isMountedRef.current = true
    
    if (!isSignedIn || !storeId) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    // Fetch subscription
    fetchSubscription()

    // Setup auto-refresh on window focus (if enabled)
    const handleFocus = () => {
      if (options?.autoRefresh !== false) {
        fetchSubscription(false) // Don't show loading on focus refresh
      }
    }

    // Setup periodic refresh (if enabled)
    if (options?.autoRefresh !== false) {
      const interval = options?.refreshInterval || 5 * 60 * 1000 // Default 5 minutes
      refreshIntervalRef.current = setInterval(() => {
        fetchSubscription(false) // Don't show loading on periodic refresh
      }, interval)
    }

    // Listen for custom subscription update events
    const handleSubscriptionUpdate = () => {
      fetchSubscription(false)
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("subscription:updated", handleSubscriptionUpdate)

    return () => {
      isMountedRef.current = false
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("subscription:updated", handleSubscriptionUpdate)
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isSignedIn, storeId, fetchSubscription, options?.autoRefresh, options?.refreshInterval])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchSubscription(true)
  }, [fetchSubscription])

  // Clear cache function
  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(cacheKey)
    }
  }, [cacheKey])

  return {
    subscription: subscription?.subscription || null,
    hasSubscription: subscription?.hasSubscription || false,
    isActive: subscription?.isActive || false,
    isLoading,
    error,
    refresh,
    clearCache,
  }
}

/**
 * Utility function to trigger subscription refresh across all components
 * Call this after subscription actions (cancel, resume, checkout success)
 * 
 * @example
 * await cancelSubscription()
 * triggerSubscriptionRefresh()
 */
export function triggerSubscriptionRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("subscription:updated"))
  }
}

