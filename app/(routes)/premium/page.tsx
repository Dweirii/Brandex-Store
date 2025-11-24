"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export default function PremiumPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    // Redirect to home page
    // The subscription modal will auto-open if there's a success parameter
    const success = searchParams.get("success")
    const sessionId = searchParams.get("session_id")
    const storeId = searchParams.get("storeId")

    if (success && sessionId) {
      // Redirect to home with the success params so modal can handle it
      router.replace(`/?success=${success}&session_id=${sessionId}${storeId ? `&storeId=${storeId}` : ''}`)
      } else {
      // Just redirect to home
      router.replace("/")
    }
  }, [router, searchParams])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
