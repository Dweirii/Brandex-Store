"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function PremiumPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

export default function PremiumPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <PremiumPageContent />
    </Suspense>
  )
}
