"use client"

import { memo, useState, useEffect, useRef, useCallback } from "react"
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
  isFeatured?: boolean
  variant?: 'default' | 'related'
}

// Memoize ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard)

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1024: 3,
  640: 2,
  500: 1
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
  isFeatured,
  variant = 'default'
}) => {
  const [products, setProducts] = useState<Product[]>(items)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialPage < initialPageCount)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  // Track the key combination to detect filter/sort changes
  const filterKey = `${categoryId}-${priceFilter}-${sortBy}`
  const prevFilterKeyRef = useRef(filterKey)

  // Reset state when filters change OR when initial items change
  useEffect(() => {
    // Check if filters changed
    const filtersChanged = filterKey !== prevFilterKeyRef.current
    prevFilterKeyRef.current = filterKey

    if (filtersChanged) {
      // Filters changed - reset everything
      setProducts(items)
      setPage(initialPage)
      setHasMore(initialPage < initialPageCount)
    }
  }, [filterKey, items, initialPage, initialPageCount])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await loadMoreProducts({
        page: nextPage,
        limit: 48,
        categoryId,
        priceFilter,
        sortBy,
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
  }, [page, loading, hasMore, categoryId, priceFilter, sortBy, isFeatured])

  // Intersection Observer for infinite scroll
  useEffect(() => {
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
  }, [loadMore, loading, hasMore])

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

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4 sm:-ml-6"
        columnClassName="pl-4 sm:pl-6 bg-clip-padding"
      >
        {visibleItems.map((item) => (
          <div key={item.id} className="mb-4 sm:mb-6">
            {variant === 'related' ? (
              <RelatedProductCard data={item} />
            ) : (
              <MemoizedProductCard data={item} />
            )}
          </div>
        ))}

        {/* Loading Skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="mb-4 sm:mb-6">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          </div>
        ))}
      </Masonry>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={lastElementRef} className="h-20 w-full flex items-center justify-center">
          {!loading && <div className="h-8 w-8" />}
        </div>
      )}
    </div>
  )
}

export default ProductList
