"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

const ProductBackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home page if no history
      router.push("/")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBack}
      className="mb-4 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  )
}

export { ProductBackButton }
