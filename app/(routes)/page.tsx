import { Metadata } from "next"
import { Suspense } from "react"
import getProduct from "@/actions/get-products"

import ProductList from "@/components/product-list"
import Container from "@/components/ui/container"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import PriceFilter from "@/components/price-filter"
import SortFilter from "@/components/sort-filter"
import CategoryNav from "@/components/category-nav"
import { RecentlyViewed } from "@/components/recently-viewed"
import { HeroSection } from "@/components/category-hero"
import { heroConfigs } from "@/lib/heroConfig"
import { shuffle } from "@/lib/utils"
import {
  generateHomeMetadata,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo"

export const metadata: Metadata = generateHomeMetadata()

const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

interface HomePageProps {
  searchParams: Promise<{ priceFilter?: 'paid' | 'free' | 'all'; sortBy?: string }>
}

async function MockupProducts({
  priceFilter,
  sortBy
}: {
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}) {
  try {
    // Fetch first page with more items for initial display
    const { products, total, page, pageCount } = await getProduct({
      categoryId: MOCKUPS_CATEGORY_ID,
      page: 1,
      limit: 48,
      priceFilter: priceFilter,
      sortBy: sortBy,
    })

    // Shuffle the initial products for variety on each visit
    const shuffledProducts = shuffle(products)

    return (
      <ProductList
        title=""
        items={shuffledProducts}
        total={total}
        page={page}
        pageCount={pageCount}
        categoryId={MOCKUPS_CATEGORY_ID}
        priceFilter={priceFilter}
        sortBy={sortBy}
      />
    )
  } catch (error) {
    console.error("Error fetching mockup products:", error)
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Unable to load products. Please try again later.</p>
      </div>
    )
  }
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { priceFilter, sortBy } = await searchParams

  // Fetch nav categories and a small product sample for the hero collage in parallel
  const [heroProductData] = await Promise.all([
    getProduct({ categoryId: MOCKUPS_CATEGORY_ID, page: 1, limit: 8 }),
  ])

  const heroImages = shuffle(
    heroProductData.products
      .map((p) => p.images?.[0]?.url)
      .filter((url): url is string => Boolean(url))
  ).slice(0, 4)

  const homeHeroConfig = {
    ...heroConfigs.home,
    images: heroImages.length > 0 ? heroImages : heroConfigs.home.images,
  }

  const websiteStructuredData = generateWebsiteStructuredData()
  const organizationStructuredData = generateOrganizationStructuredData()

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />

      {/* Home hero — no category badge, images from real Mockup Studio products */}
      <HeroSection config={homeHeroConfig} />

      <Container>
        <div className="min-h-screen py-6 sm:py-8">
          <div className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center gap-3 mb-6 py-4 sm:py-5">
              <div className="flex-1 min-w-0 overflow-hidden hidden md:flex">
                <CategoryNav />
              </div>
              <div className="flex flex-row items-center gap-2 w-full md:w-auto md:shrink-0">
                <div className="flex-1 md:flex-none">
                  <PriceFilter />
                </div>
                <SortFilter />
              </div>
            </div>
          </div>

          <div id="product-grid" className="px-4 sm:px-6 lg:px-8">
            <Suspense
              key={`${priceFilter || 'all'}-${sortBy || 'newest'}`}
              fallback={<ProductListSkeleton title="" />}
            >
              <MockupProducts
                priceFilter={priceFilter}
                sortBy={sortBy || 'newest'}
              />
            </Suspense>
          </div>
        </div>
        <RecentlyViewed />
        <ScrollToTop />
      </Container>
    </>
  )
}

export default HomePage
