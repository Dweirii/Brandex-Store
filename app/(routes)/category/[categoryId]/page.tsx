// app/(routes)/category/[categoryId]/page.tsx

import { Suspense } from "react"
import getCategory from "@/actions/get-category"
import getCategories from "@/actions/get-categories"
import getProducts from "@/actions/get-products"
import Container from "@/components/ui/container"
import ProductList from "@/components/product-list"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import PriceFilter from "@/components/price-filter"
import SortFilter from "@/components/sort-filter"
import CategoryNav from "@/components/category-nav"

export const revalidate = 0

interface CategoryProductsProps {
  categoryId: string
  currentPage: number
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}

async function CategoryProducts({
  categoryId,
  currentPage,
  priceFilter,
  sortBy,
}: CategoryProductsProps) {
  const [category, { products, total, page: current, pageCount }] = await Promise.all([
    getCategory(categoryId),
    getProducts({
      categoryId,
      page: currentPage,
      limit: 60,
      priceFilter: priceFilter,
      sortBy: sortBy,
    }),
  ])

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Category not found</p>
      </div>
    )
  }

  return (
    <ProductList
      title=""
      items={products}
      total={total}
      page={current}
      pageCount={pageCount}
    />
  )
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ page?: string; priceFilter?: 'paid' | 'free' | 'all'; sortBy?: string }>
}) {
  const { categoryId } = await params
  const searchParamsData = await searchParams
  const currentPage = parseInt(searchParamsData?.page || "1", 10)
  const priceFilter = searchParamsData?.priceFilter
  const sortBy = searchParamsData?.sortBy

  // Fetch categories for navigation
  const categories = await getCategories()

  return (
    <Container>
      <div className="min-h-screen py-6 sm:py-8">
        {/* Header with Categories and Filters */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Categories Bar - Left side */}
            <div className="flex-1 min-w-0">
              <CategoryNav categories={categories} />
            </div>
            {/* Filters Bar - Right side (same place) */}
            <div className="flex flex-row items-center gap-3">
              <PriceFilter className="flex-shrink-0" />
              <SortFilter className="flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 sm:px-6 lg:px-8">
          <Suspense
            key={`${categoryId}-${currentPage}-${priceFilter || 'all'}-${sortBy || 'mostPopular'}`}
            fallback={<ProductListSkeleton title="" />}
          >
            <CategoryProducts 
              categoryId={categoryId} 
              currentPage={currentPage} 
              priceFilter={priceFilter}
              sortBy={sortBy}
            />
          </Suspense>
        </div>
      </div>
      <ScrollToTop />
    </Container>
  )
}
