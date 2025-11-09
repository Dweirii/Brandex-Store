"use client"

import { useState } from "react"
import { Search} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import GlobalSearchBar from "./global-search-bar"
import { Suspense } from "react"

function MobileSearchContent() {
  return (
    <div className="w-full">
      <GlobalSearchBar className="w-full" />
    </div>
  )
}

export default function MobileSearchButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors"
          aria-label="Open search"
        >
          <Search className="h-4 w-4 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full p-4 sm:p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">Search Products</SheetTitle>
        </SheetHeader>
        <Suspense fallback={<div className="w-full h-12 bg-muted/20 rounded-md animate-pulse" />}>
          <MobileSearchContent />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

