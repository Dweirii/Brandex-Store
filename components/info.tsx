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

// First 3 items are constant across all product types.
// The 4th item is type-specific and shown in the bottom-right cell of the checklist.
const FEATURES_BY_CATEGORY: Record<string, [string, string, string, string]> = {
  // Mockups
  "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "Layered PSD with smart objects",
  ],
  // Images
  "6214c586-a7c7-4f71-98ab-e1bc147a07f4": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "High-resolution image files",
  ],
  // Vectors
  "b0469986-6cb9-4a35-8cd6-6cc9ec51a561": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "Scalable vector files (SVG/AI/EPS)",
  ],
  // Packaging
  "fd995552-baa8-4b86-bf7e-0acbefd43fd6": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "Print-ready packaging template files",
  ],
  // PSD Lab
  "1364f5f9-6f45-48fd-8cd1-09815e1606c0": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "Layered PSD with smart objects",
  ],
  // Motion Library
  "c302954a-6cd2-43a7-9916-16d9252f754c": [
    "Instant download",
    "Free re-downloads",
    "Commercial license included",
    "High-quality motion file(s) (MP4/MOV)",
  ],
}

const DEFAULT_FEATURES: [string, string, string, string] = [
  "Instant download",
  "Free re-downloads",
  "Commercial license included",
  "Layered PSD with smart objects",
]

/**
 * Returns a display-safe download count string.
 * - Real count ≥ 126 → show real count
 * - Real count < 126  → show a seeded-random number in 10–125
 *   (seeded on productId so the same product always shows the same number)
 */
function getDisplayDownloadCount(productId: string, rawCount: number | undefined): string {
  const real = Number(rawCount) || 0
  if (real >= 126) return real.toLocaleString()

  // Deterministic hash of productId → stable per product across renders
  let hash = 0
  for (let i = 0; i < productId.length; i++) {
    hash = Math.imul(31, hash) + productId.charCodeAt(i)
    hash |= 0
  }
  const mocked = (Math.abs(hash) % 116) + 10 // range 10–125
  return mocked.toLocaleString()
}

const MAX_TAGS_VISIBLE = 4
const MAX_MULTI_WORD_TAGS = 4

function buildCleanTags(keywords: string[]): string[] {
  const split = keywords.flatMap((k) => k.split(",").map((s) => s.trim()).filter(Boolean))
  const oneWord = split.filter((k) => k.split(/\s+/).length === 1)
  const multiWord = split.filter((k) => k.split(/\s+/).length > 1)
  return [...oneWord, ...multiWord.slice(0, MAX_MULTI_WORD_TAGS)]
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const isFreeProduct = Number(data.price) === 0
  const isPremiumProduct = !isFreeProduct
  const FEATURES = (data.category?.id && FEATURES_BY_CATEGORY[data.category.id]) || DEFAULT_FEATURES
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

      {/* Download Card — no text-center so feature list & trust row alignment are not affected */}
      <div className="border border-[#E5E7EB] dark:border-border rounded-xl overflow-hidden bg-card">
        <div className="p-5 space-y-4">

          {/* Top Download Button — wrapper ensures full width so sections below match */}
          <div className="w-full min-w-0">
            <DownloadButton
              storeId={data.storeId}
              productId={data.id}
              productSlug={data.slug ?? data.id}
              size="lg"
              variant="premium"
              className="w-full h-12 text-base font-semibold"
              iconOnly={false}
              customText={isFreeProduct ? "Free Download" : `Download for ${productPrice} Credits`}
            />
          </div>

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
                    className="font-semibold text-primary hover:underline"
                  >
                    Buy Credits
                  </Link>
                </p>
              ) : (
                <p className="font-medium text-primary">
                  You have enough credits ✓
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Feature checklist — full width, aligned with button; left column text-left, right column text-right */}
          <div className="w-full min-w-0 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-foreground">
            <div className="flex items-center gap-2 text-left">
              <Check className="h-4 w-4 shrink-0 text-primary" />
              <span>{FEATURES[0]}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-right">
              <Check className="h-4 w-4 shrink-0 order-2 text-primary" />
              <span className="order-1">{FEATURES[2]}</span>
            </div>
            {!isFreeProduct && (
              <div className="flex items-center gap-2 text-left">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span>{FEATURES[1]}</span>
              </div>
            )}
            <div className={isFreeProduct ? "col-span-2 flex items-center gap-2 text-left" : "flex items-center justify-end gap-2 text-right"}>
              <Check className={isFreeProduct ? "h-4 w-4 shrink-0 text-primary" : "h-4 w-4 shrink-0 order-2 text-primary"} />
              <span className={isFreeProduct ? "" : "order-1"}>{FEATURES[3]}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Trust row — full width, same as button; three segments spread edge-to-edge */}
          <div className="w-full min-w-0 flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 shrink-0">
              <Download className="h-3 w-3" />
              {getDisplayDownloadCount(data.id, data.downloadCount)} downloads
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Shield className="h-3 w-3" />
              Secure checkout powered by Stripe
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Lock className="h-3 w-3" />
              Login secured by Clerk
            </span>
          </div>

        </div>
      </div>

      {/* Full Artwork — Packaging category only */}
      {data.category?.id === "fd995552-baa8-4b86-bf7e-0acbefd43fd6" && (
        <div className="pt-2 flex flex-col items-center justify-center">
          <p className="text-xl md:text-foreground font-bold tracking-wide uppercase text-muted-foreground mb-3">
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
