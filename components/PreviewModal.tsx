"use client"

import { useEffect, useState } from "react"
import usePreviewModal from "@/hooks/use-preview-modal"
import Modal from "./ui/modal"
import Gallery from "./gallery"
import { DownloadButton } from "@/components/ui/download-button"
import { Check, Download, Coins, Shield, Lock, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"

// ─── Category IDs ────────────────────────────────────────────────────────────
const CAT_MOCKUP    = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"
const CAT_IMAGES    = "6214c586-a7c7-4f71-98ab-e1bc147a07f4"
const CAT_VECTORS   = "b0469986-6cb9-4a35-8cd6-6cc9ec51a561"
const CAT_PACKAGING = "fd995552-baa8-4b86-bf7e-0acbefd43fd6"
const CAT_PSD       = "1364f5f9-6f45-48fd-8cd1-09815e1606c0"
const CAT_VIDEO     = "c302954a-6cd2-43a7-9916-16d9252f754c"

// ─── Static specs per category ───────────────────────────────────────────────
const SPECS: Record<string, { label: string; value: string }[]> = {
  [CAT_MOCKUP]: [
    { label: "Application",  value: "Adobe Photoshop" },
    { label: "File Type",    value: "PSD" },
    { label: "Resolution",   value: "4500 × 3000 px" },
    { label: "DPI",          value: "300" },
    { label: "Color Space",  value: "RGB" },
    { label: "Layered",      value: "Yes" },
  ],
  [CAT_PACKAGING]: [
    { label: "Application",  value: "Adobe Photoshop" },
    { label: "File Type",    value: "PSD" },
    { label: "Resolution",   value: "4500 × 3000 px" },
    { label: "DPI",          value: "300" },
    { label: "Color Space",  value: "RGB" },
    { label: "Layered",      value: "Yes" },
  ],
  [CAT_PSD]: [
    { label: "Application",  value: "Adobe Photoshop" },
    { label: "File Type",    value: "PSD" },
    { label: "Resolution",   value: "4500 × 3000 px" },
    { label: "DPI",          value: "300" },
    { label: "Color Space",  value: "RGB" },
    { label: "Layered",      value: "Yes" },
  ],
  [CAT_IMAGES]: [
    { label: "File Type",       value: "JPG / JPEG" },
    { label: "Quantity",        value: "1 file" },
    { label: "Resolution",      value: "High-resolution" },
    { label: "Color Mode",      value: "RGB" },
    { label: "Software Needed", value: "None" },
    { label: "Delivery",        value: "Instant download" },
  ],
  [CAT_VECTORS]: [
    { label: "Application", value: "Adobe Illustrator / vector editor" },
    { label: "File Type",   value: "AI, EPS, SVG" },
    { label: "Scalable",    value: "Yes — no quality loss" },
    { label: "Editable",    value: "Shapes, paths, text" },
  ],
  [CAT_VIDEO]: [
    { label: "Format",     value: "MP4, MOV" },
    { label: "Resolution", value: "1080p / 4K" },
    { label: "Frame Rate", value: "24–30 fps" },
    { label: "Usage",      value: "Ready for editing" },
  ],
}

// ─── Feature checklists per category ─────────────────────────────────────────
const FEATURES: Record<string, string[]> = {
  [CAT_MOCKUP]:    ["Instant download", "Commercial license included", "Free re-downloads", "Layered PSD with smart objects"],
  [CAT_PACKAGING]: ["Instant download", "Commercial license included", "Free re-downloads", "Print-ready packaging template files"],
  [CAT_PSD]:       ["Instant download", "Commercial license included", "Free re-downloads", "Layered PSD with smart objects"],
  [CAT_IMAGES]:    ["Instant download", "Commercial license included", "Free re-downloads", "High-resolution image files"],
  [CAT_VECTORS]:   ["Instant download", "Commercial license included", "Free re-downloads", "Scalable vector files (SVG/AI/EPS)"],
  [CAT_VIDEO]:     ["Instant download", "Commercial license included", "Free re-downloads", "High-quality motion file(s) (MP4/MOV)"],
}
const DEFAULT_FEATURES = ["Instant download", "Commercial license included", "Free re-downloads", "Layered PSD with smart objects"]

function getDisplayDownloadCount(productId: string, rawCount: number | undefined): string {
  const real = Number(rawCount) || 0
  if (real >= 126) return real.toLocaleString()
  let hash = 0
  for (let i = 0; i < productId.length; i++) {
    hash = Math.imul(31, hash) + productId.charCodeAt(i)
    hash |= 0
  }
  return ((Math.abs(hash) % 116) + 10).toLocaleString()
}

const PreviewModal = () => {
  const previewModal = usePreviewModal()
  const product = usePreviewModal((state) => state.data)
  const { isSignedIn } = useAuth()
  const { balance } = useCredits(product?.storeId ?? "")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!product) return null

  const isFree        = Number(product.price) === 0
  const productPrice  = 5
  const catId         = product.category?.id ?? ""
  const specs         = SPECS[catId] ?? []
  const features      = FEATURES[catId] ?? DEFAULT_FEATURES
  const isPackaging   = catId === CAT_PACKAGING

  const currentBalance  = mounted && isSignedIn ? (balance ?? 0) : 0
  const creditsNeeded   = Math.max(0, productPrice - currentBalance)

  return (
    <Modal open={previewModal.isOpen} onClose={previewModal.onClose} className="sm:max-w-[94%] lg:max-w-5xl xl:max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

        {/* ── Left column: image + checklist ── */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <Gallery data={product} />

          {/* Feature checklist — below image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: info ── */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Title + badge */}
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-snug">{product.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              {isFree ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Download className="h-3.5 w-3.5" /> Free
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-3.5 w-3.5" /> Premium
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
                    <Coins className="h-3.5 w-3.5" /> {productPrice} Credits
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Spec table */}
          {specs.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              {specs.map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-2 gap-4 px-4 py-2.5 text-sm ${i < specs.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Download button */}
          <div className="space-y-2">
            <DownloadButton
              storeId={product.storeId}
              productId={product.id}
              productSlug={product.slug ?? product.id}
              size="lg"
              variant="premium"
              className="w-full h-12 text-base font-semibold"
              iconOnly={false}
              customText={isFree ? "Free Download" : `Download for ${productPrice} Credits`}
              productName={product.name}
              creditCost={isFree ? 0 : productPrice}
            />

            {/* Credit balance — signed-in + premium only */}
            {mounted && isSignedIn && !isFree && (
              <div className="text-xs text-center text-muted-foreground space-y-0.5">
                <p>Balance: <span className="font-semibold text-orange-500">{currentBalance} credits</span></p>
                {creditsNeeded > 0 ? (
                  <p className="flex items-center justify-center gap-1 flex-wrap">
                    Need <span className="font-semibold text-orange-500">{creditsNeeded} more</span>
                    <ArrowRight className="h-3 w-3" />
                    <Link href="/credits" className="font-semibold text-primary hover:underline">Buy Credits</Link>
                  </p>
                ) : (
                  <p className="text-primary font-medium">You have enough credits ✓</p>
                )}
              </div>
            )}
          </div>

          {/* Trust row */}
          <div className="border-t border-border pt-3 flex items-center justify-between gap-2 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {getDisplayDownloadCount(product.id, product.downloadCount)} downloads
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure checkout by Stripe
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Login by Clerk
            </span>
          </div>

          {/* Full Artwork — packaging only */}
          {isPackaging && (
            <div className="border-t border-border pt-3">
              <p className="text-sm font-bold tracking-widest uppercase text-foreground flex items-center gap-1">
                Full Artwork <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </div>
          )}

          {/* View full page link */}
          <div className="border-t border-border pt-3">
            <Link
              href={`/products/${product.slug ?? product.id}`}
              onClick={previewModal.onClose}
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View full details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default PreviewModal
