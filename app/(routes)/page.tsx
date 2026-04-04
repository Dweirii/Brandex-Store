import { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { Package, Layers, Sparkles, Play, ArrowRight } from "lucide-react"

import getProducts from "@/actions/get-products"
import ProductList from "@/components/product-list"
import ProductCard from "@/components/ui/product-card"
import Container from "@/components/ui/container"
import { ProductListSkeleton } from "@/components/product-list-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import PriceFilter from "@/components/price-filter"
import SortFilter from "@/components/sort-filter"
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
const PACKAGING_CATEGORY_ID = "fd995552-baa8-4b86-bf7e-0acbefd43fd6"
const IMAGES_CATEGORY_ID = "6214c586-a7c7-4f71-98ab-e1bc147a07f4"
const MOTION_CATEGORY_ID = "c302954a-6cd2-43a7-9916-16d9252f754c"

const CATEGORY_LINKS = [
  {
    name: "Packaging",
    description: "Print-ready templates with dielines",
    href: "/category/packaging",
    icon: Package,
  },
  {
    name: "Mockups",
    description: "Smart-object PSD scenes",
    href: "/category/mockups",
    icon: Layers,
  },
  {
    name: "Graphics",
    description: "Images, vectors & PSD assets",
    href: "/category/graphics",
    icon: Sparkles,
  },
  {
    name: "Motion Library",
    description: "Ready-to-drop video elements",
    href: "/category/motion-library",
    icon: Play,
  },
] as const

interface HomePageProps {
  searchParams: Promise<{ priceFilter?: "paid" | "free" | "all"; sortBy?: string }>
}

async function FeaturedProducts({
  priceFilter,
  sortBy,
}: {
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
}) {
  try {
    const { products, total, page, pageCount } = await getProducts({
      page: 1,
      limit: 24,
      priceFilter,
      sortBy,
    })

    return (
      <ProductList
        title=""
        items={products}
        total={total}
        page={page}
        pageCount={pageCount}
        priceFilter={priceFilter}
        sortBy={sortBy}
      />
    )
  } catch {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Unable to load products. Please try again later.</p>
      </div>
    )
  }
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { priceFilter, sortBy } = await searchParams

  const [mockupData, packagingData, imagesData, motionData, newReleasesData] = await Promise.all([
    getProducts({ categoryId: MOCKUPS_CATEGORY_ID, page: 1, limit: 2 }),
    getProducts({ categoryId: PACKAGING_CATEGORY_ID, page: 1, limit: 2 }),
    getProducts({ categoryId: IMAGES_CATEGORY_ID, page: 1, limit: 2 }),
    getProducts({ categoryId: MOTION_CATEGORY_ID, page: 1, limit: 2 }),
    getProducts({ sortBy: "newest", limit: 8 }),
  ])

  // Mix one image from each category for the hero collage
  const heroImagePool = shuffle(
    [
      ...mockupData.products.map((p) => p.images?.[0]?.url),
      ...packagingData.products.map((p) => p.images?.[0]?.url),
      ...imagesData.products.map((p) => p.images?.[0]?.url),
      ...motionData.products.map((p) => p.images?.[0]?.url),
    ].filter((url): url is string => Boolean(url))
  ).slice(0, 4)

  const homeHeroConfig = {
    ...heroConfigs.home,
    images: heroImagePool.length > 0 ? heroImagePool : heroConfigs.home.images,
  }

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

      {/* Hero — mixed thumbnails, library-wide messaging */}
      <HeroSection config={homeHeroConfig} />

      <Container>
        <div className="min-h-screen pt-6 pb-6 sm:pb-8">
          <div className="px-4 sm:px-6 lg:px-8">

            {/* ── Category Quick Links ────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {CATEGORY_LINKS.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="group flex items-center gap-3.5 rounded-xl border border-border bg-background p-4 sm:p-5 hover:border-primary/50 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{cat.name}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">{cat.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                )
              })}
            </div>

            {/* ── Just Added ──────────────────────────────────────────── */}
            {newReleasesData.products.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Just Added</h2>
                  <Link
                    href="/?sortBy=newest"
                    className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Browse All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {newReleasesData.products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} data={product} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Featured Product Grid header + filters ──────────────── */}
            <div className="flex items-center gap-3 mb-6 py-4 sm:py-5">
              <h2 className="text-xl font-bold text-foreground flex-1">All Assets</h2>
              <div className="flex flex-row items-center gap-2">
                <PriceFilter />
                <SortFilter />
              </div>
            </div>

          </div>

          {/* ── Product Grid ────────────────────────────────────────── */}
          <div id="product-grid" className="px-4 sm:px-6 lg:px-8">
            <Suspense
              key={`${priceFilter || "all"}-${sortBy || "newest"}`}
              fallback={<ProductListSkeleton title="" />}
            >
              <FeaturedProducts
                priceFilter={priceFilter}
                sortBy={sortBy || "newest"}
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
