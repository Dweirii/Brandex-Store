import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import { Coins, Heart, Sparkles, PenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"
import { StudioPromoModal } from "./studio-promo-modal"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [showStudioModal, setShowStudioModal] = useState(false)
  const favorites = useFavoritesWithAuth()
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
  const { balance } = useCredits(storeId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const studioUrl = "https://studio.brandexme.com"

  return (
    <>
      <StudioPromoModal
        open={showStudioModal}
        onOpenChange={setShowStudioModal}
        studioUrl={studioUrl}
      />

      <div className="ml-auto flex items-center gap-2">

        {/* Studio — secondary, outline style */}
        <div className="relative">
          <button
            onClick={() => setShowStudioModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
            aria-label="Open Brandex Studio"
          >
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">Studio</span>
          </button>
          <span className="absolute -top-2.5 -right-2.5 px-1.5 py-[3px] text-[10px] font-bold bg-red-500 text-white rounded-full uppercase animate-pulse shadow-md z-20 leading-none pointer-events-none">
            NEW
          </span>
        </div>

        {/* Custom Work — primary */}
        <Link
          href="/custom-work"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary hover:bg-logogreen-600 text-white transition-all duration-200 group"
          aria-label="Custom Work"
        >
          <PenLine className="h-3.5 w-3.5 text-white group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-white whitespace-nowrap">
            Custom Work
          </span>
        </Link>

        {/* Credits */}
        {isSignedIn && (
          <Link
            href="/credits"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer group"
          >
            <Coins className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-semibold text-primary">
              {balance} Credits
            </span>
          </Link>
        )}

        {/* Favorites */}
        <button
          onClick={() => router.push("/favorites")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-background hover:bg-muted/50 transition-all duration-200 group"
          aria-label={`Favorites with ${favorites.items.length} items`}
        >
          <Heart className="h-4 w-4 text-foreground" />
          {favorites.items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1 shadow-sm">
              {favorites.items.length > 99 ? "99+" : favorites.items.length}
            </span>
          )}
        </button>

      </div>
    </>
  )
}

export default NavbarActions
