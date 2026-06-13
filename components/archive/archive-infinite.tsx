"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { loadArchiveProducts } from "@/actions/load-archive-products"
import type { Product } from "@/types"
import ArchiveMasonry from "./archive-masonry"

interface ArchiveInfiniteProps {
  initialProducts: Product[]
  /** "home" or a categoryId — passed straight to loadArchiveProducts. */
  scope: string
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  subcategoryId?: string
  initialPage: number
  pageCount: number
  pageSize: number
}

// The page's scroll container is ambiguous: `html, body { overflow-x: hidden }`
// + a fixed height can make <body> (not window) the actual scroller, so
// window.scrollY/scrollTo become no-ops. Read/write whichever element scrolls.
function getScrollTop(): number {
  if (typeof window === "undefined") return 0
  return window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0
}
function setScrollTop(y: number): void {
  if (typeof window === "undefined") return
  window.scrollTo(0, y)
  if (document.documentElement) document.documentElement.scrollTop = y
  if (document.body) document.body.scrollTop = y
}

/**
 * Pinterest-style infinite-scroll wrapper around the archive masonry.
 *
 * Page 1 is server-rendered (initialProducts); subsequent pages stream in via an
 * IntersectionObserver with a generous rootMargin so the next page is fetched
 * well before the user reaches the bottom — it feels seamless. The loaded list +
 * scroll position are persisted so returning from a product page restores the
 * user exactly where they were (instead of snapping back to page 1).
 *
 * This component is keyed by its filters in ArchiveView, so a filter/sort change
 * remounts it fresh — no stale-append handling needed here.
 */
export default function ArchiveInfinite({
  initialProducts,
  scope,
  priceFilter,
  sortBy,
  subcategoryId,
  initialPage,
  pageCount,
  pageSize,
}: ArchiveInfiniteProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialPage < pageCount)
  const [loading, setLoading] = useState(false)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const pathname = usePathname()
  const filterKey = `${scope}-${priceFilter ?? "all"}-${sortBy ?? "newest"}-${subcategoryId ?? ""}`
  const dataKey = `arch:data:${pathname}:${filterKey}`
  const scrollKey = `arch:scroll:${pathname}:${filterKey}`
  const skipSaveRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    try {
      const next = page + 1
      const res = await loadArchiveProducts({
        scope,
        page: next,
        limit: pageSize,
        priceFilter,
        sortBy,
        subcategoryId,
      })
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [...prev, ...res.products.filter((p) => !seen.has(p.id))]
      })
      setPage(res.page)
      setHasMore(res.hasMore)
    } catch (err) {
      console.error("[ArchiveInfinite] load more failed", err)
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [page, hasMore, scope, pageSize, priceFilter, sortBy, subcategoryId])

  // ── Infinite scroll ───────────────────────────────────────────────────────
  // Large rootMargin prefetches the next page before the bottom is reached.
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: "900px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore, hasMore])

  // ── Restore loaded list + scroll position on back/forward navigation ───────
  useEffect(() => {
    let isBackForward = false
    try {
      const popAt = Number(sessionStorage.getItem("brandex:popnav") || 0)
      isBackForward = Date.now() - popAt < 4000
    } catch { /* ignore */ }
    if (!isBackForward) return

    // Take manual control so native scroll restoration (which fires before the
    // lazy grid is tall enough) doesn't fight us.
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual" } catch { /* ignore */ }

    let targetY = 0
    try {
      const raw = sessionStorage.getItem(dataKey)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved?.filterKey === filterKey && Array.isArray(saved.products) && saved.products.length > initialProducts.length) {
          setProducts(saved.products)
          setPage(saved.page ?? initialPage)
          setHasMore(Boolean(saved.hasMore))
        }
      }
      targetY = Number(sessionStorage.getItem(scrollKey) || 0)
    } catch { /* ignore */ }

    if (targetY <= 0) return

    let cancelled = false
    let heldFrames = 0
    const cleanup = () => {
      window.removeEventListener("wheel", onUserScroll)
      window.removeEventListener("touchmove", onUserScroll)
      window.removeEventListener("keydown", onKey)
    }
    const onUserScroll = () => { cancelled = true; cleanup() }
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) onUserScroll()
    }
    window.addEventListener("wheel", onUserScroll, { passive: true })
    window.addEventListener("touchmove", onUserScroll, { passive: true })
    window.addEventListener("keydown", onKey)

    const start = Date.now()
    const tick = () => {
      if (cancelled) return
      setScrollTop(targetY)
      const reached = Math.abs(getScrollTop() - targetY) <= 2
      heldFrames = reached ? heldFrames + 1 : 0
      if ((reached && heldFrames >= 5) || Date.now() - start > 6000) { cleanup(); return }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => { cancelled = true; cleanup() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist loaded items (skip the initial mount so it doesn't clobber a restore)
  useEffect(() => {
    if (skipSaveRef.current) { skipSaveRef.current = false; return }
    try {
      sessionStorage.setItem(dataKey, JSON.stringify({ filterKey, products, page, hasMore }))
    } catch { /* quota/unavailable — ignore */ }
  }, [products, page, hasMore, dataKey, filterKey])

  // Persist scroll position (throttled to one write per frame). capture:true so
  // we still catch scroll when <body> is the scroller.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        try { sessionStorage.setItem(scrollKey, String(getScrollTop())) } catch { /* ignore */ }
      })
    }
    const opts = { passive: true, capture: true } as const
    window.addEventListener("scroll", onScroll, opts)
    return () => { window.removeEventListener("scroll", onScroll, opts); if (raf) cancelAnimationFrame(raf) }
  }, [scrollKey])

  return (
    <>
      <ArchiveMasonry products={products} />

      {hasMore && <div ref={sentinelRef} aria-hidden className="h-1 w-full" />}

      {loading && (
        <div className="flex justify-center py-10">
          <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        </div>
      )}
    </>
  )
}
