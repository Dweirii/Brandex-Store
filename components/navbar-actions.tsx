import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import { Coins, Heart, PenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const favorites = useFavoritesWithAuth()
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
  const { balance } = useCredits(storeId)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="ml-auto flex items-center gap-2">

        {/* Custom Work — primary */}
        <Link
          href="/custom-work"
          className="hidden sm:flex h-9 items-center gap-1.5 px-4 rounded-full bg-foreground hover:bg-foreground/90 text-background transition-all duration-200 group"
          aria-label="Request a Custom Project"
        >
          <PenLine className="h-3.5 w-3.5 text-background group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-background whitespace-nowrap">
            Custom Work
          </span>
        </Link>

        {/* Credits */}
        {isSignedIn && (
          <Link
            href="/credits"
            className="hidden sm:flex h-9 items-center gap-1.5 px-3.5 rounded-full bg-[#F4F4F4] hover:bg-[#ededed] dark:bg-muted/30 dark:hover:bg-muted/50 transition-all cursor-pointer group"
          >
            <Coins className="h-3.5 w-3.5 text-foreground/70 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-semibold text-foreground">
              {balance} Credits
            </span>
          </Link>
        )}

        {/* Favorites */}
        <button
          onClick={() => router.push("/favorites")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F4F4F4] dark:hover:bg-muted/40 bg-[#F4F4F4] dark:bg-muted/30 transition-all duration-200 group"
          aria-label={`Favorites with ${favorites.items.length} items`}
        >
          <Heart className="h-4 w-4 text-foreground " />
          {favorites.items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background px-1 shadow-sm">
              {favorites.items.length > 99 ? "99+" : favorites.items.length}
            </span>
          )}
        </button>

    </div>
  )
}

export default NavbarActions
