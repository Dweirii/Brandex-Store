// app/(routes)/thank-you/page.tsx
import { Suspense } from "react"
import ThankYouClient from "./components/ThankYouClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  )
}
