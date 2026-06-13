import { Metadata } from "next"
import { Suspense } from "react"

import { loadArchiveProducts } from "@/actions/load-archive-products"
import ArchiveView from "@/components/archive/archive-view"
import ArchiveSkeleton from "@/components/archive/archive-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import {
  generateHomeMetadata,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo"

export const metadata: Metadata = generateHomeMetadata()

// Items per page fetched as the user scrolls (small = fast first paint).
const PAGE_SIZE = 24

interface HomePageProps {
  searchParams: Promise<{
    priceFilter?: "paid" | "free" | "all"
    sortBy?: string
    page?: string
  }>
}

async function HomeArchive({
  priceFilter,
  sortBy,
  page,
}: {
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  page: number
}) {
  const { products, pageCount, total } = await loadArchiveProducts({
    scope: "home",
    page,
    limit: PAGE_SIZE,
    priceFilter,
    sortBy,
  })

  return (
    <ArchiveView
      heading="Premium PSD Mockups, Packaging Templates & Design Resources"
      subtitle="Premium and free design resources, all in one place."
      products={products}
      page={page}
      pageCount={pageCount}
      total={total}
      scope="home"
      priceFilter={priceFilter}
      sortBy={sortBy}
      pageSize={PAGE_SIZE}
    />
  )
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { priceFilter, sortBy, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const websiteStructuredData = generateWebsiteStructuredData()
  const organizationStructuredData = generateOrganizationStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />

      <main className="min-h-screen bg-[#FAFAFA] pb-10 dark:bg-background">
        <Suspense
          key="home-archive"
          fallback={
            <div className="w-full px-4 pt-8 sm:px-6 lg:px-8">
              <ArchiveSkeleton withPills={false} />
            </div>
          }
        >
          <HomeArchive priceFilter={priceFilter} sortBy={sortBy || "newest"} page={page} />
        </Suspense>
      </main>

      <ScrollToTop />
    </>
  )
}

export default HomePage
