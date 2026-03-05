"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { Sparkles, Download, Coins, Check, Shield, Lock, ArrowRight } from "lucide-react"
import { DownloadButton } from "@/components/ui/download-button"
import { ProductShare } from "@/components/product-share"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"

interface InfoProps {
  data: Product
}

const FEATURES = [
  "Instant download",
  "Commercial license included",
  "Free re-downloads",
  "Layered PSD with smart objects",
]

const MAX_TAGS_VISIBLE = 4
const MAX_MULTI_WORD_TAGS = 4

function buildCleanTags(keywords: string[]): string[] {
  const oneWord = keywords.filter((k) => k.trim().split(/\s+/).length === 1)
  const multiWord = keywords.filter((k) => k.trim().split(/\s+/).length > 1)
  return [...oneWord, ...multiWord.slice(0, MAX_MULTI_WORD_TAGS)]
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const isFreeProduct = Number(data.price) === 0
  const isPremiumProduct = !isFreeProduct
  const productPrice = 5
  const { theme, systemTheme } = useTheme()
  const { isSignedIn } = useAuth()
  const { balance } = useCredits(data.storeId)
  const [mounted, setMounted] = useState(false)
  const [tagsExpanded, setTagsExpanded] = useState(false)

  useEffect(() => setMounted(true), [])

  const cleanTags = data.keywords?.length ? buildCleanTags(data.keywords) : []
  const visibleTags = tagsExpanded ? cleanTags : cleanTags.slice(0, MAX_TAGS_VISIBLE)
  const hasHiddenTags = cleanTags.length > MAX_TAGS_VISIBLE
  const hiddenCount = cleanTags.length - MAX_TAGS_VISIBLE

  const currentBalance = mounted && isSignedIn ? (balance ?? 0) : 0
  const creditsNeeded = Math.max(0, productPrice - currentBalance)

  const getIconSrc = () => {
    if (!mounted) {
      if (typeof window !== "undefined") {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        return systemPreference ? "/icons-black.png" : "/icons-white.png"
      }
      return "/icons-white.png"
    }
    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark" ? "/icons-black.png" : "/icons-white.png"
  }

  const iconSrc = getIconSrc()

  return (
    <div className="space-y-5">
      {/* Title + Share */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground flex-1 leading-tight">
          {data.name}
        </h1>
        <ProductShare productId={data.slug ?? data.id} productName={data.name} />
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Keyword Tags — max 4 visible; rest behind "Show more" */}
      {cleanTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {visibleTags.map((keyword: string) => (
            <Link
              key={keyword}
              href={`/products/search?query=${encodeURIComponent(keyword)}`}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {keyword}
            </Link>
          ))}
          {hasHiddenTags && !tagsExpanded && (
            <button
              type="button"
              onClick={() => setTagsExpanded(true)}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Show more ({hiddenCount})
            </button>
          )}
          {hasHiddenTags && tagsExpanded && (
            <button
              type="button"
              onClick={() => setTagsExpanded(false)}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Show less
            </button>
          )}
        </div>
      )}

      {/* Product Type Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        {isPremiumProduct ? (
          <>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Premium
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
              <Coins className="h-4 w-4" />
              {productPrice} Credits
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
            <Download className="h-4 w-4" />
            Free
          </span>
        )}
      </div>

      {/* Download Card */}
      <div className="border border-[#E5E7EB] dark:border-border rounded-xl overflow-hidden bg-card">
        <div className="p-5 space-y-4 text-center">

          {/* Download count — floor at 125 as starting cap */}
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>{Math.max(data.downloadCount ?? 0, 125).toLocaleString()} downloads</span>
          </p>

          {/* Top Download Button */}
          <DownloadButton
            storeId={data.storeId}
            productId={data.id}
            size="lg"
            variant="premium"
            className="w-full h-12 text-base font-semibold"
            iconOnly={false}
            customText={isFreeProduct ? "Free Download" : `Download (${productPrice} Credits)`}
          />

          {/* Credit balance — signed-in + premium only */}
          {mounted && isSignedIn && isPremiumProduct && (
            <div className="text-sm space-y-1 text-center">
              <p className="text-muted-foreground">
                Credit Balance:{" "}
                <span className="font-semibold text-orange-500">{currentBalance} credits</span>
              </p>
              {creditsNeeded > 0 ? (
                <p className="text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
                  You need{" "}
                  <span className="font-semibold text-orange-500">{creditsNeeded} more credits</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <Link
                    href="/credits"
                    className="font-semibold text-[#00B81A] hover:underline"
                  >
                    Buy Credits
                  </Link>
                </p>
              ) : (
                <p className="font-medium" style={{ color: "#00B81A" }}>
                  You have enough credits ✓
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#E5E7EB] dark:border-border" />

          {/* Feature checklist — 2×2 grid, full width, green checkmarks */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-left">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#00B81A" }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#E5E7EB] dark:border-border" />

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure checkout powered by Stripe
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Login secured by Clerk
            </span>
          </div>

        </div>
      </div>

      {/* Full Artwork — Packaging category only */}
      {data.category?.id === "fd995552-baa8-4b86-bf7e-0acbefd43fd6" && (
        <div className="pt-2 flex flex-col items-center justify-center">
          <p className="text-xl md:text-black font-bold tracking-wide uppercase text-muted-foreground mb-3">
            Full Artwork
          </p>
          <Image
            src={iconSrc}
            alt="Full Artwork — PSD, Vector, Layers, Smart Object"
            width={1024}
            height={100}
            className="w-full md:w-2/3 lg:w-1/2 h-auto mx-auto opacity-90"
            priority={false}
          />
        </div>
      )}
    </div>
  )
}

export default Info
