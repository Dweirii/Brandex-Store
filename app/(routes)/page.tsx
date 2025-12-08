import { Metadata } from "next"
import { Suspense } from "react"
import getProduct from "@/actions/get-products"
import getCategories from "@/actions/get-categories"
import ProductList from "@/components/product-list"
import Container from "@/components/ui/container"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import PriceFilter from "@/components/price-filter"
import SortFilter from "@/components/sort-filter"
import CategoryNav from "@/components/category-nav"
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
    const { products, total, page, pageCount } = await getProduct({
      categoryId: MOCKUPS_CATEGORY_ID,
      page: 1,
      limit: 24,
      priceFilter: priceFilter,
      sortBy: sortBy,
    })

    return (
      <ProductList
        title=""
        items={products}
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
  const categories = await getCategories()

  const websiteStructuredData = generateWebsiteStructuredData()
  const organizationStructuredData = generateOrganizationStructuredData()

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <div className="min-h-screen py-6 sm:py-8">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0 overflow-hidden">
              <CategoryNav categories={categories} />
            </div>
            <div className="flex flex-row items-center gap-3 flex-shrink-0">
              <PriceFilter className="flex-shrink-0" />
              <SortFilter className="flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
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
      <ScrollToTop />
    </Container>
  )
}

export default HomePage

