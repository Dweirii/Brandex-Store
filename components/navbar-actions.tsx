import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import useRecentlyViewed from "@/hooks/use-recently-viewed"
import { Coins, Heart, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const favorites = useFavoritesWithAuth()
  const recentlyViewed = useRecentlyViewed()
  const router = useRouter()
  const { isSignedIn } = useAuth()

  // Get storeId from env
  const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""

  // Get credit balance
  const { balance } = useCredits(storeId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="ml-auto flex items-center gap-3">
      {isSignedIn && (
        <Link
          href="/credits"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all cursor-pointer group"
        >
          <Coins className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold text-primary">
            {balance} Credits
          </span>
        </Link>
      )}

      <button
        onClick={() => router.push("/favorites")}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted/50 transition-all duration-200 group"
        aria-label={`Favorites with ${favorites.items.length} items`}
      >
        <Heart className="h-4 w-4 text-foreground" />
        {favorites.items.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1 shadow-sm">
            {favorites.items.length > 99 ? '99+' : favorites.items.length}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          // Scroll to recently viewed section on home page
          if (window.location.pathname === '/' || window.location.pathname === '/home') {
            const recentlyViewedSection = document.querySelector('[data-recently-viewed]')
            if (recentlyViewedSection) {
              recentlyViewedSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          } else {
            router.push('/#recently-viewed')
          }
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted/50 transition-all duration-200 group"
        aria-label={`Recently viewed ${recentlyViewed.items.length} products`}
      >
        <Clock className="h-4 w-4 text-foreground" />
        {recentlyViewed.items.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1 shadow-sm">
            {recentlyViewed.items.length > 99 ? '99+' : recentlyViewed.items.length}
          </span>
        )}
      </button>
    </div>
  )
}

export default NavbarActions
