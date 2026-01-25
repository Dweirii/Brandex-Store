"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@clerk/nextjs"

// Global request deduplication - prevents multiple components from making the same request
const globalPendingRequests = new Map<string, Promise<SubscriptionStatus | null>>()
const globalRequestCache = new Map<string, { data: SubscriptionStatus | null; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 60 seconds

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
    planTier: 'FREE' | 'STARTER' | 'PRO'
    monthlyDownloadLimit: number | null
    createdAt: string
    updatedAt: string
    store: {
      id: string
      name: string
    } | null
  } | null
}

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
  const hasFetchedRef = useRef(false)
  const pendingFetchRef = useRef<Promise<SubscriptionStatus | null> | null>(null)

  // Fetch subscription from API
  const fetchSubscription = useCallback(async (showLoading = true, skipCache = false) => {
    if (!isSignedIn || !storeId) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    // Check global cache first (unless skipping cache)
    if (!skipCache) {
      const cached = globalRequestCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (isMountedRef.current) {
          setSubscription(cached.data)
          setIsLoading(false)
        }
        return
      }

      // Check if there's already a pending request for this cache key
      const pendingRequest = globalPendingRequests.get(cacheKey)
      if (pendingRequest) {
        try {
          const data = await pendingRequest
          if (isMountedRef.current) {
            setSubscription(data)
            setIsLoading(false)
          }
        } catch (err) {
          // Error will be handled by the original request
        }
        return
      }
    }

    const fetchPromise = (async (): Promise<SubscriptionStatus | null> => {
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
          return null
        }

        // Use the same API URL pattern as other API calls
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured")
        }
        
        // Use default cache strategy (allows browser/Next.js to cache)
        const response = await fetch(`${apiUrl}/subscription/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Use default cache - Next.js will respect Cache-Control headers from API
        })

      if (!response.ok) {
        if (response.status === 404) {
          // No subscription found - this is normal
          const noSubscriptionData: SubscriptionStatus = {
            hasSubscription: false,
            isActive: false,
            subscription: null,
          }
          
          // Update global cache
          globalRequestCache.set(cacheKey, { data: noSubscriptionData, timestamp: Date.now() })
          
          if (isMountedRef.current) {
            setSubscription(noSubscriptionData)
            setIsLoading(false)
            // Cache the "no subscription" state
            if (typeof window !== "undefined") {
              sessionStorage.setItem(cacheKey, JSON.stringify(noSubscriptionData))
            }
          }
          return noSubscriptionData
        }
        throw new Error(`Failed to fetch subscription: ${response.status}`)
      }

      const data: SubscriptionStatus = await response.json()

      // Update global cache
      globalRequestCache.set(cacheKey, { data, timestamp: Date.now() })

      if (isMountedRef.current) {
        setSubscription(data)
        setIsLoading(false)
        // Cache the subscription data in sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, JSON.stringify(data))
        }
      }

      return data
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch subscription")
        setIsLoading(false)
      }
      throw err
    } finally {
      globalPendingRequests.delete(cacheKey)
      pendingFetchRef.current = null
    }
    })()
    
    // Store pending request globally for deduplication
    globalPendingRequests.set(cacheKey, fetchPromise)
    pendingFetchRef.current = fetchPromise
    
    try {
      await fetchPromise
    } catch (err) {
      // Error already handled in promise
    }
  }, [isSignedIn, storeId, getToken, userId, cacheKey])

  // Combined initialization: load from cache first, then fetch fresh data
  useEffect(() => {
    isMountedRef.current = true
    
    if (!isSignedIn || !storeId) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    // Prevent duplicate fetches
    if (hasFetchedRef.current) {
      return
    }

    // Try to load from sessionStorage cache first
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const cachedData = JSON.parse(cached) as SubscriptionStatus
          setSubscription(cachedData)
          setIsLoading(false)
          hasFetchedRef.current = true
          // Fetch fresh data in background (silently)
          fetchSubscription(false, true)
          return
        }
      } catch (err) {
        // Ignore cache errors, continue to fetch
      }
    }

    // No cache found, fetch immediately
    hasFetchedRef.current = true
    fetchSubscription(true)

    // Disabled window focus refresh to reduce excessive API calls
    // const handleFocus = () => {
    //   if (options?.autoRefresh !== false) {
    //     fetchSubscription(false) // Don't show loading on focus refresh
    //   }
    // }

    // Setup periodic refresh (if explicitly enabled)
    // Default is FALSE - no auto-refresh to reduce API calls
    if (options?.autoRefresh === true) {
      const interval = options?.refreshInterval || 10 * 60 * 1000 // Default 10 minutes
      refreshIntervalRef.current = setInterval(() => {
        fetchSubscription(false) // Don't show loading on periodic refresh
      }, interval)
    }

    // Listen for custom subscription update events
    const handleSubscriptionUpdate = () => {
      fetchSubscription(false)
    }

    // window.addEventListener("focus", handleFocus) // Disabled to reduce API calls
    window.addEventListener("subscription:updated", handleSubscriptionUpdate)

    return () => {
      isMountedRef.current = false
      // window.removeEventListener("focus", handleFocus) // Disabled
      window.removeEventListener("subscription:updated", handleSubscriptionUpdate)
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isSignedIn, storeId, fetchSubscription, options?.autoRefresh, options?.refreshInterval])

  // Reset fetch flag when storeId or userId changes
  useEffect(() => {
    hasFetchedRef.current = false
  }, [storeId, userId])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchSubscription(true)
  }, [fetchSubscription])

  // Clear cache function
  const clearCache = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(cacheKey)
    }
    // Also clear global cache
    globalRequestCache.delete(cacheKey)
    globalPendingRequests.delete(cacheKey)
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

