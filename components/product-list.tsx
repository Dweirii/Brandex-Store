"use client"

import { memo, useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import Masonry from "react-masonry-css"
import type { Product } from "@/types"
import { loadMoreProducts } from "@/actions/load-more-products"
import NoResults from "@/components/ui/no-results"
import ProductCard from "./ui/product-card"
import RelatedProductCard from "./ui/related-product-card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductListProps {
  title: string
  items: Product[]
  total: number
  page?: number
  pageCount?: number
  categoryId?: string
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
  fileType?: string
  size?: string
  isFeatured?: boolean
  variant?: 'default' | 'related'
  /** How additional pages are loaded. Default: 'infinite' (IntersectionObserver). */
  loadMoreMode?: 'infinite' | 'button' | 'none'
  /** Items requested per "load more" call. Default: 24. */
  pageSize?: number
}

// Memoize ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard)

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

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  768: 2,
  480: 1,
}

const relatedBreakpointColumnsObj = {
  default: 4,
  1280: 3,
  768: 2,
  480: 1,
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items,
  total,
  page: initialPage = 1,
  pageCount: initialPageCount = 1,
  categoryId,
  priceFilter,
  sortBy,
  fileType,
  size,
  isFeatured,
  variant = 'default',
  loadMoreMode = 'infinite',
  pageSize = 24,
}) => {
  const [products, setProducts] = useState<Product[]>(items)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialPage < initialPageCount)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  // Track the key combination to detect filter/sort changes
  const filterKey = `${categoryId}-${priceFilter}-${sortBy}-${fileType}-${size}`
  const prevFilterKeyRef = useRef(filterKey)

  // ── Scroll/state restoration on back navigation ──────────────────────────
  // Persist the loaded list + scroll position so returning from a product page
  // restores exactly where the user was (infinite scroll resets to page 1
  // otherwise, losing the items they'd scrolled past).
  const pathname = usePathname()
  const persist = variant !== "related" && loadMoreMode !== "none"
  const dataKey = `plist:data:${pathname}:${filterKey}`
  const scrollKey = `plist:scroll:${pathname}:${filterKey}`
  const skipSaveRef = useRef(true)

  // Restore once on mount (runs before the save effect below)
  useEffect(() => {
    if (!persist) return

    // Only restore on a back/forward navigation — not on a fresh forward visit
    // (e.g. clicking the logo). The flag is set by ScrollToTop's popstate handler.
    // Note: do NOT consume (remove) the flag here — React StrictMode double-mounts
    // effects in dev, and the first mount removing it would make the real second
    // mount bail. ScrollToTop clears it on the next forward navigation instead.
    let isBackForward = false
    try {
      const popAt = Number(sessionStorage.getItem("brandex:popnav") || 0)
      isBackForward = Date.now() - popAt < 4000
    } catch { /* ignore */ }
    if (!isBackForward) return

    // Take manual control so the browser's native scroll restoration (which
    // fires before our lazy-loaded grid is tall enough) doesn't fight us.
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual" } catch { /* ignore */ }

    let targetY = 0
    try {
      const raw = sessionStorage.getItem(dataKey)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved?.filterKey === filterKey && Array.isArray(saved.products) && saved.products.length > items.length) {
          setProducts(saved.products)
          setPage(saved.page ?? initialPage)
          setHasMore(Boolean(saved.hasMore))
        }
      }
      targetY = Number(sessionStorage.getItem(scrollKey) || 0)
    } catch { /* ignore */ }

    if (targetY <= 0) return

    // Re-assert the position every frame as the grid renders, images load, and
    // the page grows tall enough to actually reach targetY. Only stop once we've
    // HELD the target for several frames (page is tall + stable) — or time out /
    // the user scrolls themselves.
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
      const cur = getScrollTop()
      const reached = Math.abs(cur - targetY) <= 2
      heldFrames = reached ? heldFrames + 1 : 0
      const elapsed = Date.now() - start
      if ((reached && heldFrames >= 5) || elapsed > 6000) {
        cleanup()
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => { cancelled = true; cleanup() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist loaded items whenever they change (skips the initial mount render
  // so it doesn't clobber the snapshot we just restored)
  useEffect(() => {
    if (!persist) return
    if (skipSaveRef.current) { skipSaveRef.current = false; return }
    try {
      sessionStorage.setItem(dataKey, JSON.stringify({ filterKey, products, page, hasMore }))
    } catch { /* quota/unavailable — ignore */ }
  }, [products, page, hasMore, persist, dataKey, filterKey])

  // Persist scroll position (cheap, throttled to one write per frame).
  // capture:true so we still catch scroll when <body> is the scroller (its
  // scroll event doesn't bubble to window).
  useEffect(() => {
    if (!persist) return
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
  }, [persist, scrollKey])

  // Reset state when filters change OR when initial items change
  useEffect(() => {
    // Check if filters changed
    const filtersChanged = filterKey !== prevFilterKeyRef.current
    prevFilterKeyRef.current = filterKey

    if (filtersChanged) {
      // Filters changed - reset everything and drop any stale saved snapshot
      setProducts(items)
      setPage(initialPage)
      setHasMore(initialPage < initialPageCount)
      try {
        sessionStorage.removeItem(dataKey)
        sessionStorage.removeItem(scrollKey)
      } catch { /* ignore */ }
    }
  }, [filterKey, items, initialPage, initialPageCount, dataKey, scrollKey])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await loadMoreProducts({
        page: nextPage,
        limit: pageSize,
        categoryId,
        priceFilter,
        sortBy,
        fileType,
        size,
        isFeatured
      })

      if (response.products.length > 0) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newProducts = response.products.filter(p => !existingIds.has(p.id))
          return [...prev, ...newProducts]
        })
        setPage(response.page)
        setHasMore(response.page < response.pageCount)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more products", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, categoryId, priceFilter, sortBy, fileType, size, isFeatured, pageSize])

  // Intersection Observer for infinite scroll (only when mode is 'infinite')
  useEffect(() => {
    if (loadMoreMode !== 'infinite') return
    if (loading || !hasMore) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore()
      }
    }, { rootMargin: '200px' })

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [loadMore, loading, hasMore, loadMoreMode])

  // Only render items that have at least one image URL or a video URL
  const visibleItems = products.filter((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasVideo = Boolean((item as any).videoUrl && String((item as any).videoUrl).trim().length > 0)
    const hasImage = Array.isArray(item.images) && item.images.some((img) => Boolean(img?.url && String(img.url).trim().length > 0))
    return hasVideo || hasImage
  })

  return (
    <div className="space-y-6">
      {/* Only show header if title is provided */}
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-3xl text-foreground">{title}</h3>
          <span className="text-sm text-muted-foreground">{total} items</span>
        </div>
      )}

      {visibleItems.length === 0 && !loading && <NoResults />}

      <div className="overflow-x-hidden">
      <Masonry
        breakpointCols={variant === 'related' ? relatedBreakpointColumnsObj : breakpointColumnsObj}
        className="flex w-auto -ml-3 sm:-ml-4"
        columnClassName="pl-3 sm:pl-4 bg-clip-padding"
      >
        {visibleItems.map((item) => (
          <div key={item.id} className="mb-3 sm:mb-4">
            {variant === 'related' ? (
              <RelatedProductCard data={item} />
            ) : (
              <MemoizedProductCard data={item} />
            )}
          </div>
        ))}

        {/* Loading Skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="mb-3 sm:mb-4">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          </div>
        ))}
      </Masonry>
      </div>

      {/* Load more trigger */}
      {hasMore && loadMoreMode === 'infinite' && (
        <div ref={lastElementRef} className="h-20 w-full flex items-center justify-center">
          {!loading && <div className="h-8 w-8" />}
        </div>
      )}

      {hasMore && loadMoreMode === 'button' && (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 text-sm font-semibold transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductList
