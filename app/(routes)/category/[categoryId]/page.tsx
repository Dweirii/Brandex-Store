// app/(routes)/category/[categoryId]/page.tsx

import { Suspense } from "react"
import getCategory from "@/actions/get-category"
import getProducts from "@/actions/get-products"
import { HeroSection } from "@/components/hero-section"
import Container from "@/components/ui/container"
import ProductList from "@/components/product-list"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CategoryHeader } from "@/components/category-header"

export const revalidate = 0

interface CategoryProductsWithHeaderProps {
  categoryId: string
  currentPage: number
}

async function CategoryProductsWithHeader({
  categoryId,
  currentPage,
}: CategoryProductsWithHeaderProps) {
  const [category, { products, total, page: current, pageCount }] = await Promise.all([
    getCategory(categoryId),
    getProducts({
      categoryId,
      page: currentPage,
      limit: 12,
    }),
  ])

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold">Category not found</p>
        <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-black text-white rounded">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <CategoryHeader categoryName={category.name} totalProducts={total} currentPage={current} />
      <ProductList
        title=""
        items={products}
        total={total}
        page={current}
        pageCount={pageCount}
      />
    </div>
  )
}

export default async function EnhancedCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ page?: string }>
}) {
  const { categoryId } = await params
  const currentPage = parseInt((await searchParams)?.page || "1", 10)  

  return (
    <div className="bg-white dark:bg-card transition-colors">
      <Container>
        <HeroSection />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <Suspense
            key={`${categoryId}-${currentPage}`}
            fallback={<ProductListSkeleton title="" />}
          >
            <CategoryProductsWithHeader categoryId={categoryId} currentPage={currentPage} />
          </Suspense>
        </div>
      </Container>
      <ScrollToTop />
    </div>
  )
}
