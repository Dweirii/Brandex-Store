"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { trackLogin, trackSignUp } from "@/lib/analytics"

// How recent a Clerk timestamp must be (ms) to count as "just happened".
const RECENT_MS = 5 * 60 * 1000

/**
 * Fires GA4 `sign_up` / `login` events after Clerk authentication.
 *
 * On a fresh page load an existing Clerk session is already signed-in, so we
 * can't watch a signed-out → signed-in transition. Instead we use Clerk's
 * timestamps:
 *   - `createdAt` recent  → brand-new account → sign_up
 *   - `lastSignInAt` recent → an actual sign-in just occurred → login
 *   - neither recent → a persisted session being reloaded → fire nothing
 *
 * A sessionStorage key (per user + sign-in time) dedupes so we emit once per
 * real auth event, not on every navigation.
 */
export function AuthAnalytics() {
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    const now = Date.now()
    const createdAt = user.createdAt ? new Date(user.createdAt).getTime() : 0
    const lastSignInAt = user.lastSignInAt ? new Date(user.lastSignInAt).getTime() : 0

    const isNewSignUp = createdAt > 0 && now - createdAt < RECENT_MS
    const isRecentLogin = lastSignInAt > 0 && now - lastSignInAt < RECENT_MS
    if (!isNewSignUp && !isRecentLogin) return

    // Dedupe per actual auth event (changes when the user signs in again).
    const dedupeKey = `brandex_auth_evt:${user.id}:${lastSignInAt || createdAt}`
    try {
      if (sessionStorage.getItem(dedupeKey)) return
      sessionStorage.setItem(dedupeKey, "1")
    } catch {
      /* sessionStorage unavailable — fall through and fire anyway */
    }

    const provider = user.externalAccounts?.[0]?.provider
    const method = provider ? provider.replace(/^oauth_/, "") : "email"

    if (isNewSignUp) trackSignUp(method)
    else trackLogin(method)
  }, [isLoaded, isSignedIn, user])

  return null
}
