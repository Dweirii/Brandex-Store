import { Metadata } from "next"
import type { Product } from "@/types"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import getCategory from "@/actions/get-category"

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
import {
  isUUID,
  categoryParamToSlug,
  categoryParamToId,
  CATEGORY_GROUPS,
  SLUG_TO_GROUP_MAP,
  CATEGORY_SLUG_MAP,
} from "@/lib/category-slugs"
import { CategorySubNav } from "@/components/category-sub-nav"

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ type?: string }>
}): Promise<Metadata> {
  try {
    const { categoryId: param } = await params
    const { type } = (await searchParams) || {}

    const slug = categoryParamToSlug(param)

    // Resolve ID: If it's a group, check for 'type', otherwise use default group ID or param ID
    let uuid = categoryParamToId(param)
    if (CATEGORY_GROUPS[slug] && type) {
      const subtab = CATEGORY_GROUPS[slug].subtabs.find(s => s.slug === type)
      if (subtab) uuid = subtab.id
    }

    const category = await getCategory(uuid)

    if (!category) {
      return {
        title: "Category Not Found | Brandex",
        description: "The requested category could not be found.",
      }
    }

    // Always generate canonical with the slug
    return generateCategoryMetadata(category, slug)
  } catch (error) {
    console.error("Error generating category metadata:", error)
    return {
      title: "Category | Brandex",
      description: "Browse products in this category.",
    }
  }
}

// ─── Category Products sub-component ─────────────────────────────────────────

interface CategoryProductsProps {
  categoryId: string
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
}

async function CategoryProducts({
  categoryId,
  priceFilter,
  sortBy,
}: CategoryProductsProps) {
  const [category, { products, total, page: current, pageCount }] =
    await Promise.all([
      getCategory(categoryId),
      getProducts({
        categoryId,
        page: 1,
        limit: 48,
        priceFilter,
        sortBy,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ priceFilter?: "paid" | "free" | "all"; sortBy?: string; type?: string }>
}) {
  const { categoryId: param } = await params
  const searchParamsData = await searchParams
  const priceFilter = searchParamsData?.priceFilter
  const sortBy = searchParamsData?.sortBy
  const type = searchParamsData?.type

  // 1. 301-redirect old member slugs to group slugs (e.g., /category/images -> /category/graphics?type=images)
  const groupSlugFromOldMember = SLUG_TO_GROUP_MAP[param]
  if (groupSlugFromOldMember) {
    const qs = new URLSearchParams()
    qs.set("type", param)
    if (priceFilter) qs.set("priceFilter", priceFilter)
    if (sortBy) qs.set("sortBy", sortBy)
    redirect(`/category/${groupSlugFromOldMember}?${qs.toString()}`)
  }

  // 2. 301-redirect UUID-based URLs to their slug equivalent
  if (isUUID(param)) {
    const slug = categoryParamToSlug(param)
    // Only redirect if we have a known slug mapping
    if (slug !== param) {
      const qs = new URLSearchParams()
      // If the old UUID belonged to a member of a group, set the type
      const oldSlug = CATEGORY_SLUG_MAP[param]
      if (oldSlug && SLUG_TO_GROUP_MAP[oldSlug]) {
        qs.set("type", oldSlug)
      }
      if (priceFilter) qs.set("priceFilter", priceFilter)
      if (sortBy) qs.set("sortBy", sortBy)
      const suffix = qs.toString() ? `?${qs.toString()}` : ""
      redirect(`/category/${slug}${suffix}`)
    }
  }

  // Resolve the real UUID for API calls
  const slug = categoryParamToSlug(param)
  let uuid = categoryParamToId(param)

  // Resolve specific sub-category ID if in a group and 'type' is provided
  if (CATEGORY_GROUPS[slug] && type) {
    const subtab = CATEGORY_GROUPS[slug].subtabs.find(s => s.slug === type)
    if (subtab) uuid = subtab.id
  }

  const heroConfigBase = getHeroConfigById(uuid)

  const [category, heroProductData] = await Promise.all([
    getCategory(uuid),
    heroConfigBase
      ? getProducts({ categoryId: uuid, page: 1, limit: 8 })
      : Promise.resolve({ products: [] as Product[] }),
  ])

  const heroImages = shuffle(
    heroProductData.products
      .map((p) => p.images?.[0]?.url)
      .filter((url): url is string => Boolean(url))
  ).slice(0, 4)

  // Canonical URL always uses the slug
  const siteUrl = getSiteUrl()
  const breadcrumbStructuredData = category
    ? generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      { name: category.name, url: `${siteUrl}/category/${slug}` },
    ])
    : null

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
        <HeroSection
          config={heroConfig}
          categoryLabel={
            // When landing on a group slug with no sub-type selected (e.g. /category/graphics),
            // use the group's display name ("Graphics") rather than the underlying
            // sub-category name ("Images") that the UUID resolves to.
            CATEGORY_GROUPS[slug] && !type
              ? CATEGORY_GROUPS[slug].name
              : category?.name
          }
        />
      )}

      <Container>
        <div className="min-h-screen py-6 sm:py-8">
          {/* Header with Categories and Filters */}
          <div className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center gap-3 py-4 sm:py-5">
              {/* Categories Bar — desktop only */}
              <div className="flex-1 min-w-0 overflow-hidden hidden md:flex">
                <CategoryNav />
              </div>
              {/* Filters — full-width on mobile, auto on desktop */}
              <div className="flex flex-row items-center gap-2 w-full md:w-auto md:shrink-0">
                <div className="flex-1 md:flex-none">
                  <PriceFilter />
                </div>
                <SortFilter />
              </div>
            </div>

            {/* Sub-navigation for groups (Mockups, Graphics) */}
            <CategorySubNav groupSlug={slug} currentType={type} />
          </div>

          {/* Products Grid */}
          <div id="product-grid" className="px-4 sm:px-6 lg:px-8">
            <Suspense
              key={`${uuid}-${priceFilter || "all"}-${sortBy || "newest"}`}
              fallback={<ProductListSkeleton title="" />}
            >
              <CategoryProducts
                categoryId={uuid}
                priceFilter={priceFilter}
                sortBy={sortBy || "newest"}
              />
            </Suspense>
          </div>
        </div>
        <ScrollToTop />
      </Container>
    </>
  )
}
