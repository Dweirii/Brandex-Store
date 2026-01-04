"use client"

import { useEffect, useState } from "react"
import Container from "@/components/ui/container"
import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import ProductCard from "@/components/ui/product-card"
import { Heart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export default function FavoritesPage() {
  const favorites = useFavoritesWithAuth()
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync from server when component mounts and user is signed in
  useEffect(() => {
    if (isMounted && isSignedIn) {
      favorites.syncFromServer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isSignedIn])

  if (!isMounted) {
    return (
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
            {favorites.items.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({favorites.items.length} {favorites.items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
        </div>

        {/* Empty State */}
        {favorites.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/50">
              <Heart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start exploring and add products you love to your favorites. They'll be saved here for easy access.
            </p>
            <Button onClick={() => router.push('/')} variant="default">
              Browse Products
            </Button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {favorites.items.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

