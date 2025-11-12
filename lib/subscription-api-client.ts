"use client"

/**
 * Subscription Status Response Interface
 */
export interface SubscriptionStatus {
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
 * Subscription Checkout Response Interface
 */
export interface SubscriptionCheckoutResponse {
  url: string
}

/**
 * Subscription Action Response Interface
 */
export interface SubscriptionActionResponse {
  success: boolean
  message?: string
  subscription?: {
    id: string
    status: string
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string | null
    updatedAt: string
  }
}

/**
 * Get API base URL helper
 */
const getAdminBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
  }
  const url = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
  const match = url.match(/https?:\/\/[^/]+/)
  return match ? match[0] : url
}


/**
 * Subscription API Client
 * 
 * Provides functions for interacting with the subscription API endpoints.
 * All functions require authentication via Clerk token.
 * 
 * @example
 * // In a client component with useAuth hook:
 * const { getToken } = useAuth()
 * const status = await getSubscriptionStatus(storeId, await getToken({ template: "CustomerJWTBrandex" }))
 */
export class SubscriptionApiClient {
  private baseUrl: string
  private getTokenFn: () => Promise<string | null>

  constructor(getTokenFn: () => Promise<string | null>) {
    this.baseUrl = getAdminBaseUrl()
    this.getTokenFn = getTokenFn
  }

  /**
   * Get subscription status for a user and store
   * 
   * @param storeId - Store ID to check subscription for
   * @returns Promise<SubscriptionStatus> - Subscription status information
   * @throws Error if authentication fails or API request fails
   * 
   * @example
   * const client = new SubscriptionApiClient(() => getToken({ template: "CustomerJWTBrandex" }))
   * const status = await client.getSubscriptionStatus(storeId)
   */
  async getSubscriptionStatus(storeId: string): Promise<SubscriptionStatus> {
    const token = await this.getTokenFn()
    if (!token) {
      throw new Error("Authentication token is required")
    }

    const response = await fetch(`${this.baseUrl}/api/${storeId}/subscription/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        // No subscription found - return empty status
        return {
          hasSubscription: false,
          isActive: false,
          subscription: null,
        }
      }
      const errorText = await response.text()
      throw new Error(`Failed to fetch subscription status: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  /**
   * Create a Stripe Checkout Session for subscription
   * 
   * @param storeId - Store ID for the subscription
   * @param priceId - Stripe Price ID (monthly or yearly)
   * @param email - User email address
   * @returns Promise<string> - Stripe Checkout Session URL
   * @throws Error if authentication fails or API request fails
   * 
   * @example
   * const client = new SubscriptionApiClient(() => getToken({ template: "CustomerJWTBrandex" }))
   * const checkoutUrl = await client.createSubscriptionCheckout(storeId, priceId, email)
   * window.location.href = checkoutUrl
   */
  async createSubscriptionCheckout(
    storeId: string,
    priceId: string,
    email: string
  ): Promise<string> {
    const token = await this.getTokenFn()
    if (!token) {
      throw new Error("Authentication token is required")
    }

    const response = await fetch(`${this.baseUrl}/api/${storeId}/subscription/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        email,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create checkout session: ${response.status} - ${errorText}`)
    }

    const data: SubscriptionCheckoutResponse = await response.json()
    if (!data.url) {
      throw new Error("No checkout URL received from server")
    }

    return data.url
  }

  /**
   * Cancel a subscription (sets cancel_at_period_end = true)
   * 
   * @param storeId - Store ID for the subscription
   * @returns Promise<void>
   * @throws Error if authentication fails or API request fails
   * 
   * @example
   * const client = new SubscriptionApiClient(() => getToken({ template: "CustomerJWTBrandex" }))
   * await client.cancelSubscription(storeId)
   */
  async cancelSubscription(storeId: string): Promise<void> {
    const token = await this.getTokenFn()
    if (!token) {
      throw new Error("Authentication token is required")
    }

    const response = await fetch(`${this.baseUrl}/api/${storeId}/subscription/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to cancel subscription: ${response.status} - ${errorText}`)
    }

    const data: SubscriptionActionResponse = await response.json()
    if (!data.success) {
      throw new Error(data.message || "Failed to cancel subscription")
    }
  }

  /**
   * Resume a subscription (sets cancel_at_period_end = false)
   * 
   * @param storeId - Store ID for the subscription
   * @returns Promise<void>
   * @throws Error if authentication fails or API request fails
   * 
   * @example
   * const client = new SubscriptionApiClient(() => getToken({ template: "CustomerJWTBrandex" }))
   * await client.resumeSubscription(storeId)
   */
  async resumeSubscription(storeId: string): Promise<void> {
    const token = await this.getTokenFn()
    if (!token) {
      throw new Error("Authentication token is required")
    }

    const response = await fetch(`${this.baseUrl}/api/${storeId}/subscription/resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to resume subscription: ${response.status} - ${errorText}`)
    }

    const data: SubscriptionActionResponse = await response.json()
    if (!data.success) {
      throw new Error(data.message || "Failed to resume subscription")
    }
  }
}

/**
 * Standalone functions for subscription API calls
 * These functions require a token to be passed explicitly
 */

/**
 * Get subscription status for a user and store
 * 
 * @param storeId - Store ID to check subscription for
 * @param token - Clerk authentication token
 * @returns Promise<SubscriptionStatus> - Subscription status information
 * 
 * @example
 * const { getToken } = useAuth()
 * const token = await getToken({ template: "CustomerJWTBrandex" })
 * const status = await getSubscriptionStatus(storeId, token)
 */
export async function getSubscriptionStatus(
  storeId: string,
  token: string | null
): Promise<SubscriptionStatus> {
  if (!token) {
    throw new Error("Authentication token is required")
  }

  const baseUrl = getAdminBaseUrl()
  const response = await fetch(`${baseUrl}/api/${storeId}/subscription/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    if (response.status === 404) {
      // No subscription found - return empty status
      return {
        hasSubscription: false,
        isActive: false,
        subscription: null,
      }
    }
    const errorText = await response.text()
    throw new Error(`Failed to fetch subscription status: ${response.status} - ${errorText}`)
  }

  return response.json()
}

/**
 * Create a Stripe Checkout Session for subscription
 * 
 * @param storeId - Store ID for the subscription
 * @param priceId - Stripe Price ID (monthly or yearly)
 * @param email - User email address
 * @param token - Clerk authentication token
 * @returns Promise<string> - Stripe Checkout Session URL
 * 
 * @example
 * const { getToken } = useAuth()
 * const token = await getToken({ template: "CustomerJWTBrandex" })
 * const checkoutUrl = await createSubscriptionCheckout(storeId, priceId, email, token)
 * window.location.href = checkoutUrl
 */
export async function createSubscriptionCheckout(
  storeId: string,
  priceId: string,
  email: string,
  token: string | null
): Promise<string> {
  if (!token) {
    throw new Error("Authentication token is required")
  }

  const baseUrl = getAdminBaseUrl()
  const response = await fetch(`${baseUrl}/api/${storeId}/subscription/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      priceId,
      email,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create checkout session: ${response.status} - ${errorText}`)
  }

  const data: SubscriptionCheckoutResponse = await response.json()
  if (!data.url) {
    throw new Error("No checkout URL received from server")
  }

  return data.url
}

/**
 * Cancel a subscription (sets cancel_at_period_end = true)
 * 
 * @param storeId - Store ID for the subscription
 * @param token - Clerk authentication token
 * @returns Promise<void>
 * 
 * @example
 * const { getToken } = useAuth()
 * const token = await getToken({ template: "CustomerJWTBrandex" })
 * await cancelSubscription(storeId, token)
 */
export async function cancelSubscription(
  storeId: string,
  token: string | null
): Promise<void> {
  if (!token) {
    throw new Error("Authentication token is required")
  }

  const baseUrl = getAdminBaseUrl()
  const response = await fetch(`${baseUrl}/api/${storeId}/subscription/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to cancel subscription: ${response.status} - ${errorText}`)
  }

  const data: SubscriptionActionResponse = await response.json()
  if (!data.success) {
    throw new Error(data.message || "Failed to cancel subscription")
  }
}

/**
 * Resume a subscription (sets cancel_at_period_end = false)
 * 
 * @param storeId - Store ID for the subscription
 * @param token - Clerk authentication token
 * @returns Promise<void>
 * 
 * @example
 * const { getToken } = useAuth()
 * const token = await getToken({ template: "CustomerJWTBrandex" })
 * await resumeSubscription(storeId, token)
 */
export async function resumeSubscription(
  storeId: string,
  token: string | null
): Promise<void> {
  if (!token) {
    throw new Error("Authentication token is required")
  }

  const baseUrl = getAdminBaseUrl()
  const response = await fetch(`${baseUrl}/api/${storeId}/subscription/resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to resume subscription: ${response.status} - ${errorText}`)
  }

  const data: SubscriptionActionResponse = await response.json()
  if (!data.success) {
    throw new Error(data.message || "Failed to resume subscription")
  }
}

