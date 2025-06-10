"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"

export default function SearchButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/products/search")}
      variant="link"
      size="sm"
      className="flex items-center gap-1 text-gray"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search</span>
    </Button>
  )
}
