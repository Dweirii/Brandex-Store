"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"

interface ProductAccessStatus {
  hasDownloaded: boolean
  hasCredits: boolean
  creditsRemaining: number | null
  isLoading: boolean
  planTier: 'FREE' | 'STARTER' | 'PRO'
  hasActiveSubscription: boolean
}

/**
 * Hook to check if user has access to download a product
 * Returns download status and credit information
 */
export function useProductAccess(storeId: string, productId: string, isFreeProduct: boolean): ProductAccessStatus {
  const { getToken, isSignedIn } = useAuth()
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [hasCredits, setHasCredits] = useState(false)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [planTier, setPlanTier] = useState<'FREE' | 'STARTER' | 'PRO'>('FREE')
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAccess = useCallback(async () => {
    // For free products, no need to check
    if (isFreeProduct) {
      setIsLoading(false)
      setHasCredits(true) // Free products don't need credits
      return
    }

    if (!isSignedIn || !storeId) {
      setIsLoading(false)
      return
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        setIsLoading(false)
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        console.error("[useProductAccess] NEXT_PUBLIC_API_URL is not configured")
        setIsLoading(false)
        return
      }

      const baseUrl = apiUrl.match(/https?:\/\/[^/]+/)?.[0] || apiUrl

      // Fetch subscription status first
      const subResponse = await fetch(`${baseUrl}/api/${storeId}/subscription/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      let tier: 'FREE' | 'STARTER' | 'PRO' = 'FREE'
      let isActive = false

      if (subResponse.ok) {
        const subData = await subResponse.json()
        tier = subData?.subscription?.planTier || 'FREE'
        isActive = subData?.isActive || false
        setPlanTier(tier)
        setHasActiveSubscription(isActive)

        console.log("[useProductAccess] Subscription status:", { tier, isActive })
      }

      // Fetch download history to check if product was already downloaded
      const downloadsResponse = await fetch(`${baseUrl}/api/${storeId}/downloads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (downloadsResponse.ok) {
        const data = await downloadsResponse.json()
        
        // Check if this product has been downloaded
        const downloads = Array.isArray(data) ? data : (data?.downloads || [])
        const productDownloaded = downloads.some((d: any) => d.productId === productId)
        setHasDownloaded(productDownloaded)

        console.log("[useProductAccess] Product downloaded:", productDownloaded)

        // Get credit information from monthlyStats
        if (data.monthlyStats) {
          const { remaining } = data.monthlyStats
          setCreditsRemaining(remaining)
          
          console.log("[useProductAccess] Credits remaining:", remaining)
        }
      }

      // Determine if user has credits based on plan tier and active subscription
      // IMPORTANT: PRO and STARTER users with active subscriptions always have access
      if (isActive) {
        if (tier === 'PRO') {
          // PRO users have unlimited credits
          setHasCredits(true)
          setCreditsRemaining(null) // null = unlimited
          console.log("[useProductAccess] PRO user - unlimited credits")
        } else if (tier === 'STARTER') {
          // STARTER users need to check remaining credits
          // But if they already downloaded this product, they can re-download
          if (hasDownloaded) {
            setHasCredits(true)
            console.log("[useProductAccess] STARTER user - already downloaded, can re-download")
          } else {
            // Check if they have credits remaining
            const hasCreditsLeft = creditsRemaining !== null && creditsRemaining > 0
            setHasCredits(hasCreditsLeft)
            console.log("[useProductAccess] STARTER user - has credits:", hasCreditsLeft)
          }
        } else {
          setHasCredits(false)
        }
      } else {
        // No active subscription
        setHasCredits(false)
        console.log("[useProductAccess] No active subscription")
      }
    } catch (error) {
      console.error("[useProductAccess] Failed to check access:", error)
      setHasCredits(false)
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn, storeId, productId, isFreeProduct, getToken, hasDownloaded, creditsRemaining])

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  return {
    hasDownloaded,
    hasCredits,
    creditsRemaining,
    isLoading,
    planTier,
    hasActiveSubscription,
  }
}
