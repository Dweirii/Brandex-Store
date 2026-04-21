"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { Sparkles, Download, Coins, Check, ArrowRight, Ruler, HardDrive } from "lucide-react"
import { DownloadButton } from "@/components/ui/download-button"
import { ProductShare } from "@/components/product-share"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"
import { useFileSize } from "@/hooks/use-file-size"
import { formatBytes } from "@/lib/utils"
import { getProductDimensions } from "@/lib/product-specs"

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
  const { isSignedIn } = useAuth()
  const { balance } = useCredits(data.storeId)
  const fileSizeBytes = useFileSize(data.storeId, data.id)
  const fileSizeLabel = formatBytes(fileSizeBytes)
  const dimensions    = getProductDimensions(data.category?.id)
  const [mounted, setMounted] = useState(false)
  const [tagsExpanded, setTagsExpanded] = useState(false)

  useEffect(() => setMounted(true), [])

  const cleanTags = data.keywords?.length ? buildCleanTags(data.keywords) : []
  const visibleTags = tagsExpanded ? cleanTags : cleanTags.slice(0, MAX_TAGS_VISIBLE)
  const hasHiddenTags = cleanTags.length > MAX_TAGS_VISIBLE
  const hiddenCount = cleanTags.length - MAX_TAGS_VISIBLE

  const currentBalance = mounted && isSignedIn ? (balance ?? 0) : 0
  const creditsNeeded = Math.max(0, productPrice - currentBalance)

  const downloadsLabel = getDisplayDownloadCount(data.id, data.downloadCount)

  return (
    <div className="space-y-6">
      {/* Header: category eyebrow → title → share */}
      <div className="space-y-3">
        {data.category?.name && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {data.category.name}
          </p>
        )}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-[26px] sm:text-[28px] font-bold text-foreground flex-1 leading-[1.2] tracking-tight">
            {data.name}
          </h1>
          <ProductShare productId={data.slug ?? data.id} productName={data.name} />
        </div>

        {/* Downloads count — subtle social proof under title */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5" />
          <span>
            <span className="font-semibold text-foreground">{downloadsLabel}</span> downloads
          </span>
        </div>
      </div>

      {/* Keyword Tags — subtler, smaller, pill style */}
      {cleanTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTags.map((keyword: string) => (
            <Link
              key={keyword}
              href={`/products/search?query=${encodeURIComponent(keyword)}`}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-muted-foreground bg-muted/60 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {keyword}
            </Link>
          ))}
          {hasHiddenTags && (
            <button
              type="button"
              onClick={() => setTagsExpanded((v) => !v)}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {tagsExpanded ? "Show less" : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      )}

      {/* Price & Download — hero card */}
      <div className="relative rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
        {/* Price / type row */}
        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="flex flex-col">
            {isPremiumProduct ? (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
                  Price
                </span>
                <div className="flex items-baseline gap-1.5">
                  <Coins className="h-5 w-5 text-amber-500 self-center" />
                  <span className="text-3xl font-bold text-foreground leading-none tracking-tight">
                    {productPrice}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">credits</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
                  Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground leading-none tracking-tight">
                    Free
                  </span>
                </div>
              </>
            )}
          </div>

          <span
            className={
              isPremiumProduct
                ? "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
            }
          >
            {isPremiumProduct ? (
              <>
                <Sparkles className="h-3 w-3" /> Premium
              </>
            ) : (
              <>
                <Download className="h-3 w-3" /> Free
              </>
            )}
          </span>
        </div>

        {/* Primary CTA */}
        <DownloadButton
          storeId={data.storeId}
          productId={data.id}
          productSlug={data.slug ?? data.id}
          size="lg"
          variant="premium"
          className="w-full h-12 text-base font-semibold"
          iconOnly={false}
          customText={isFreeProduct ? "Free Download" : `Download for ${productPrice} Credits`}
          productName={data.name}
          creditCost={isFreeProduct ? 0 : productPrice}
          fileSizeBytes={fileSizeBytes ?? undefined}
        />

        {/* File meta — subtle inline text, no chips */}
        {(dimensions || fileSizeLabel) && (
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            {dimensions && (
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                {dimensions}
              </span>
            )}
            {dimensions && fileSizeLabel && (
              <span className="text-muted-foreground/40">•</span>
            )}
            {fileSizeLabel && (
              <span className="inline-flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5" />
                {fileSizeLabel}
              </span>
            )}
          </div>
        )}

        {/* Credit balance indicator */}
        {mounted && isSignedIn && isPremiumProduct && (
          <div className="mt-4 pt-4 border-t border-border/60 text-sm text-center">
            {creditsNeeded > 0 ? (
              <p className="text-muted-foreground inline-flex items-center gap-1.5 flex-wrap justify-center">
                <span>
                  Balance:{" "}
                  <span className="font-semibold text-foreground">{currentBalance}</span>
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  Need{" "}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {creditsNeeded} more
                  </span>
                </span>
                <Link
                  href="/credits"
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Buy credits
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            ) : (
              <p className="inline-flex items-center gap-1.5 text-primary font-medium justify-center">
                <Check className="h-4 w-4" />
                You have enough credits ({currentBalance})
              </p>
            )}
          </div>
        )}
      </div>

      {/* What's included */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          What's included
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>{FEATURES[0]}</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>{FEATURES[2]}</span>
          </li>
          {!isFreeProduct && (
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>{FEATURES[1]}</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>{FEATURES[3]}</span>
          </li>
        </ul>
      </div>

    </div>
  )
}

export default Info
