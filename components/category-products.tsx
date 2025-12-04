// components/category-products.tsx
"use client"

import { useEffect, useState } from "react"
import getCategory from "@/actions/get-category"
import getProducts from "@/actions/get-products"
import ProductList from "./product-list"
import { CategoryHeader } from "./category-header"

interface CategoryProductsWithHeaderProps {
  categoryId: string
  currentPage: number
}

export default function CategoryProductsWithHeader({ categoryId, currentPage }: CategoryProductsWithHeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [category, setCategory] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCategory(categoryId),
      getProducts({ categoryId, page: currentPage, limit: 24 }),
    ]).then(([cat, prodRes]) => {
      setCategory(cat)
      setProducts(prodRes.products)
      setTotal(prodRes.total)
      setPage(prodRes.page)
      setPageCount(prodRes.pageCount)
    }).finally(() => setLoading(false))
  }, [categoryId, currentPage])

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!category) return <div className="text-center py-12">Category not found.</div>

  return (
    <div className="space-y-8">
      <CategoryHeader categoryName={category.name} totalProducts={total} currentPage={page} />
      <ProductList
        title=""
        items={products}
        total={total}
        page={page}
        pageCount={pageCount}
      />
    </div>
  )
}
