import { Suspense } from "react"
import getProduct from "@/actions/get-products"
import { HeroSection } from "@/components/hero-section"
import ProductList from "@/components/product-list"
import Container from "@/components/ui/container"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import PriceFilter from "@/components/price-filter"

export const revalidate = 0

interface HomePageProps {
  searchParams: Promise<{ page?: string; priceFilter?: 'paid' | 'free' | 'all' }>
}

async function FeaturedProducts({ currentPage, priceFilter }: { currentPage: number; priceFilter?: 'paid' | 'free' | 'all' }) {
  try {
    const { products, total, page, pageCount } = await getProduct({
      isFeatured: true,
      page: currentPage,
      limit: 12,
      priceFilter: priceFilter,
    })

    return (
      <ProductList
        title="Featured Products"
        items={products}
        total={total}
        page={page}
        pageCount={pageCount}
      />
    )
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-600 mb-4">We&apos;re having trouble loading the featured products. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { page, priceFilter } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <HeroSection />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <PriceFilter className="mb-6" />
          <Suspense 
            key={`${currentPage}-${priceFilter || 'all'}`} 
            fallback={<ProductListSkeleton title="Featured Products" />}
          >
            <FeaturedProducts currentPage={currentPage} priceFilter={priceFilter} />
          </Suspense>
        </div>
      </div>
      <ScrollToTop />
    </Container>
  )
}

export default HomePage
