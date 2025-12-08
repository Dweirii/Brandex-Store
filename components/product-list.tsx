import type React from "react"
import { memo } from "react"
import type { Product } from "@/types"

import NoResults from "@/components/ui/no-results"
import ProductCard from "./ui/product-card"
import Pagination from "@/components/paginatioon"

interface ProductListProps {
  title: string
  items: Product[]
  total: number
  page: number
  pageCount: number
}

// Memoize ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard)

const ProductList: React.FC<ProductListProps> = ({ title, items, total, page, pageCount }) => {
  // Only render items that have at least one image URL or a video URL
  const visibleItems = items.filter((item) => {
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

      {visibleItems.length === 0 && <NoResults />}

      {/* CSS masonry: responsive column counts, no JS */}
      <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-4 sm:gap-6">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid mb-4 sm:mb-6 rounded-lg shadow-sm"
          >
            <MemoizedProductCard data={item} />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="pt-6 flex justify-center">
          <Pagination currentPage={page} totalPages={pageCount} />
        </div>
      )}
    </div>
  )
}

export default ProductList
