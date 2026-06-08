"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Masonry from "react-masonry-css"
import type { Product } from "@/types"
import ArchiveCard from "./archive-card"
import { loadArchiveProducts } from "@/actions/load-archive-products"

interface ArchiveInfiniteGridProps {
  initialProducts: Product[]
  pageCount: number
  scope: string
  pageSize: number
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  subcategoryId?: string
}

// Column counts by viewport: large 4 · laptop 3 · tablet 2 · mobile 1.
const breakpointCols = { default: 4, 1280: 3, 768: 2, 480: 1 }
const SKELETON_HEIGHTS = [260, 320, 240, 300, 280, 340, 230, 290]

/**
 * Infinite-scroll masonry grid. Loads one page at a time (kept small for speed)
 * as the user nears the bottom, with shimmer skeletons + a spinner while loading.
 */
export default function ArchiveInfiniteGrid({
  initialProducts,
  pageCount,
  scope,
  pageSize,
  priceFilter,
  sortBy,
  subcategoryId,
}: ArchiveInfiniteGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(1 < pageCount)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Reset when the server sends a fresh feed (filters / scope changed).
  useEffect(() => {
    setProducts(initialProducts)
    setPage(1)
    setHasMore(1 < pageCount)
  }, [initialProducts, pageCount])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const next = page + 1
      const res = await loadArchiveProducts({ scope, page: next, limit: pageSize, priceFilter, sortBy, subcategoryId })
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        const fresh = res.products.filter((p) => p?.id && !seen.has(p.id))
        return [...prev, ...fresh]
      })
      setPage(res.page)
      setHasMore(res.hasMore)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, scope, pageSize, priceFilter, sortBy, subcategoryId])

  // IntersectionObserver: prefetch the next page ~600px before the sentinel.
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: "600px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  const visible = products.filter(
    (p) => Array.isArray(p.images) && p.images.some((img) => Boolean(img?.url))
  )

  return (
    <div>
      <Masonry
        breakpointCols={breakpointCols}
        className="-ml-6 flex w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {visible.map((product) => (
          <div key={product.id} className="mb-6">
            <ArchiveCard data={product} />
          </div>
        ))}

        {/* Inline shimmer placeholders while a page loads */}
        {loading &&
          SKELETON_HEIGHTS.map((h, i) => (
            <div key={`sk-${i}`} className="mb-6">
              <div
                className="relative overflow-hidden rounded-[14px] bg-neutral-200/70 dark:bg-neutral-800/60"
                style={{ height: `${h}px` }}
              >
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/55 to-transparent dark:via-white/10" />
              </div>
            </div>
          ))}
      </Masonry>

      {/* Sentinel + spinner */}
      {hasMore && <div ref={sentinelRef} className="h-px w-full" />}
      {loading && (
        <div className="flex items-center justify-center gap-2.5 py-8 text-sm font-medium text-muted-foreground">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
          Loading more…
        </div>
      )}
    </div>
  )
}
