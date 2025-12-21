import { Metadata } from "next"
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
import {
  generateCategoryMetadata,
  generateBreadcrumbStructuredData,
  getSiteUrl,
} from "@/lib/seo"

// Generate dynamic metadata for category pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>
}): Promise<Metadata> {
  try {
    const { categoryId } = await params
    const category = await getCategory(categoryId)

    if (!category) {
      return {
        title: "Category Not Found | Brandex",
        description: "The requested category could not be found.",
      }
    }

    return generateCategoryMetadata(category, categoryId)
  } catch (error) {
    console.error("Error generating category metadata:", error)
    return {
      title: "Category | Brandex",
      description: "Browse products in this category.",
    }
  }
}

interface CategoryProductsProps {
  categoryId: string
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}

async function CategoryProducts({
  categoryId,
  priceFilter,
  sortBy,
}: CategoryProductsProps) {
  const [category, { products, total, page: current, pageCount }] = await Promise.all([
    getCategory(categoryId),
    getProducts({
      categoryId,
      page: 1,
      limit: 24,
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
      categoryId={categoryId}
      priceFilter={priceFilter}
      sortBy={sortBy}
    />
  )
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ priceFilter?: 'paid' | 'free' | 'all'; sortBy?: string }>
}) {
  const { categoryId } = await params
  const searchParamsData = await searchParams
  const priceFilter = searchParamsData?.priceFilter
  const sortBy = searchParamsData?.sortBy

  // Fetch category and categories for navigation
  const [category, categories] = await Promise.all([
    getCategory(categoryId),
    getCategories(),
  ])

  // Generate breadcrumb structured data
  const siteUrl = getSiteUrl()
  const breadcrumbStructuredData = category
    ? generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      { name: category.name, url: `${siteUrl}/category/${categoryId}` },
    ])
    : null

  return (
    <Container>
      {/* Structured Data */}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}
      <div className="min-h-screen py-6 sm:py-8">
        {/* Header with Categories and Filters */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Categories Bar - Left side */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <CategoryNav categories={categories} />
            </div>
            {/* Filters Bar - Right side (same place) */}
            <div className="flex flex-row items-center gap-3 flex-shrink-0">
              <PriceFilter className="flex-shrink-0" />
              <SortFilter className="flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 sm:px-6 lg:px-8">
          <Suspense
            key={`${categoryId}-${priceFilter || 'all'}-${sortBy || 'newest'}`}
            fallback={<ProductListSkeleton title="" />}
          >
            <CategoryProducts
              categoryId={categoryId}
              priceFilter={priceFilter}
              sortBy={sortBy || 'newest'}
            />
          </Suspense>
        </div>
      </div>
      <ScrollToTop />
    </Container>
  )
}

