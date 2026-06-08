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
  }>
}

async function HomeArchive({
  priceFilter,
  sortBy,
}: {
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
}) {
  const { products, pageCount, total } = await loadArchiveProducts({
    scope: "home",
    page: 1,
    limit: PAGE_SIZE,
    priceFilter,
    sortBy,
  })

  return (
    <ArchiveView
      heading="All resources"
      products={products}
      pageCount={pageCount}
      total={total}
      scope="home"
      pageSize={PAGE_SIZE}
      priceFilter={priceFilter}
      sortBy={sortBy}
    />
  )
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { priceFilter, sortBy } = await searchParams

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
          <HomeArchive priceFilter={priceFilter} sortBy={sortBy || "newest"} />
        </Suspense>
      </main>

      <ScrollToTop />
    </>
  )
}

export default HomePage
