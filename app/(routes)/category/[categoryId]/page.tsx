import { Metadata } from "next"
import type { Product } from "@/types"
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
import { HeroSection } from "@/components/category-hero"
import { getHeroConfigById } from "@/lib/heroConfig"
import { shuffle } from "@/lib/utils"
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
      limit: 48,
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

  const heroConfigBase = getHeroConfigById(categoryId)

  // Fetch category, nav categories, and (if this page has a hero) a small
  // product sample to populate the collage with real images.
  const [category, categories, heroProductData] = await Promise.all([
    getCategory(categoryId),
    getCategories(),
    heroConfigBase
      ? getProducts({ categoryId, page: 1, limit: 8 })
      : Promise.resolve({ products: [] as Product[] }),
  ])

  // Pick one image per product, shuffle, take 4 for the collage
  const heroImages = shuffle(
    heroProductData.products
      .map((p) => p.images?.[0]?.url)
      .filter((url): url is string => Boolean(url))
  ).slice(0, 4)

  // Generate breadcrumb structured data
  const siteUrl = getSiteUrl()
  const breadcrumbStructuredData = category
    ? generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      { name: category.name, url: `${siteUrl}/category/${categoryId}` },
    ])
    : null

  // Merge real images into the config (fall back to placeholder URLs if none fetched)
  const heroConfig = heroConfigBase
    ? { ...heroConfigBase, images: heroImages.length > 0 ? heroImages : heroConfigBase.images }
    : null

  return (
    <>
      {/* Structured Data — invisible */}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}

      {/* Full-width hero — only rendered for configured categories */}
      {heroConfig && (
        <HeroSection config={heroConfig} categoryLabel={category?.name} />
      )}

      <Container>
        <div className="min-h-screen py-6 sm:py-8">
          {/* Header with Categories and Filters */}
          <div className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center gap-3 mb-6 py-4 sm:py-5">
              {/* Categories Bar — desktop only */}
              <div className="flex-1 min-w-0 overflow-hidden hidden md:flex">
                <CategoryNav categories={categories} />
              </div>
              {/* Filters — full-width on mobile, auto on desktop */}
              <div className="flex flex-row items-center gap-2 w-full md:w-auto md:shrink-0">
                <div className="flex-1 md:flex-none">
                  <PriceFilter />
                </div>
                <SortFilter />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div id="product-grid" className="px-4 sm:px-6 lg:px-8">
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
    </>
  )
}

