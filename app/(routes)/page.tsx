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

// Cache for 60 seconds - products change frequently but not instantly
export const revalidate = 60

// Mockups category ID
const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

interface HomePageProps {
  searchParams: Promise<{ page?: string; priceFilter?: 'paid' | 'free' | 'all'; sortBy?: string }>
}

async function MockupProducts({ 
  currentPage, 
  priceFilter,
  sortBy 
}: { 
  currentPage: number
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}) {
  try {
    const { products, total, page, pageCount } = await getProduct({
      categoryId: MOCKUPS_CATEGORY_ID,
      page: currentPage,
      limit: 60,
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
  const { page, priceFilter, sortBy } = await searchParams
  const currentPage = parseInt(page || "1", 10)
  const categories = await getCategories()

  return (
    <Container>
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
            key={`${currentPage}-${priceFilter || 'all'}-${sortBy || 'mostPopular'}`} 
            fallback={<ProductListSkeleton title="" />}
          >
            <MockupProducts 
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

export default HomePage
