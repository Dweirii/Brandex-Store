import type React from "react"
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

const ProductList: React.FC<ProductListProps> = ({ title, items, total, page, pageCount }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-3xl text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">{total} items</span>
      </div>

      {items.length === 0 && <NoResults />}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} data={item} />
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
