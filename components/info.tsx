"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Product } from "@/types"
import { Sparkles, Download, Coins } from "lucide-react"
import { DownloadButton } from "@/components/ui/download-button"
import { ProductShare } from "@/components/product-share"
import { useTheme } from "next-themes"
import Image from "next/image"

interface InfoProps {
  data: Product
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const isFreeProduct = Number(data.price) === 0
  const isPremiumProduct = !isFreeProduct
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground flex-1">
          {data.name}
        </h1>
        <ProductShare productId={data.id} productName={data.name} />
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-base text-muted-foreground leading-relaxed">
          {data.description}
        </p>
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
              5 Credits
            </span>
                  {/* Helper text */}
            {isPremiumProduct && (
                <p className="text-xs text-left text-muted-foreground">
                  Premium download costs 5 credits. Re-downloads are free.
                </p>
              )}
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400">
            <Download className="h-4 w-4" />
            Free
          </span>
        )}
      </div>

      {/* Download Button */}
      <div className="space-y-3 pt-4">
        <DownloadButton
          storeId={data.storeId}
          productId={data.id}
          size="lg"
          variant="premium"
          className="w-full h-12 text-base font-medium"
          iconOnly={false}
          customText={isFreeProduct ? "Free Download" : "Download (5 Credits)"}
        />
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
