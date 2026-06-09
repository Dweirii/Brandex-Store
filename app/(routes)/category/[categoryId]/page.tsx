import { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import getCategory from "@/actions/get-category"

import { loadArchiveProducts } from "@/actions/load-archive-products"
import getSubcategories from "@/actions/get-subcategories"
import ArchiveView from "@/components/archive/archive-view"
import ArchiveSkeleton from "@/components/archive/archive-skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
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
  isHiddenCategory,
} from "@/lib/category-slugs"

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

// ─── Category Archive sub-component ───────────────────────────────────────────

const PAGE_SIZE = 24

interface CategoryArchiveProps {
  categoryId: string
  heading: string
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  subcategoryId?: string
  page: number
}

async function CategoryArchive({
  categoryId,
  heading,
  priceFilter,
  sortBy,
  subcategoryId,
  page,
}: CategoryArchiveProps) {
  const [{ products, total, pageCount }, subcategories] = await Promise.all([
    loadArchiveProducts({
      scope: categoryId,
      page,
      limit: PAGE_SIZE,
      priceFilter,
      sortBy,
      subcategoryId,
    }),
    getSubcategories(categoryId),
  ])

  return (
    <ArchiveView
      heading={heading}
      products={products}
      page={page}
      pageCount={pageCount}
      total={total}
      subcategories={subcategories}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams?: Promise<{ priceFilter?: "paid" | "free" | "all"; sortBy?: string; type?: string; subcategory?: string; page?: string }>
}) {
  const { categoryId: param } = await params
  const searchParamsData = await searchParams
  const priceFilter = searchParamsData?.priceFilter
  const sortBy = searchParamsData?.sortBy
  const type = searchParamsData?.type
  const subcategoryId = searchParamsData?.subcategory
  const page = Math.max(1, Number(searchParamsData?.page) || 1)

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

  // Hidden categories (e.g. IMAGES) are not browsable — send visitors home
  if (isHiddenCategory(uuid)) {
    redirect("/")
  }

  // Only Packaging and Mockups are browsable — every other category redirects
  // home so products from other categories are never shown.
  const ALLOWED_SLUGS = ["packaging", "mockups"]
  if (!ALLOWED_SLUGS.includes(slug)) {
    redirect("/")
  }

  const category = await getCategory(uuid)

  // When landing on a group slug with no sub-type selected (e.g. /category/graphics),
  // use the group's display name ("Graphics") rather than the underlying
  // sub-category name ("Images") that the UUID resolves to.
  const heading =
    CATEGORY_GROUPS[slug] && !type
      ? CATEGORY_GROUPS[slug].name
      : category?.name || "Resources"

  // Canonical URL always uses the slug
  const siteUrl = getSiteUrl()
  const breadcrumbStructuredData = category
    ? generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      { name: category.name, url: `${siteUrl}/category/${slug}` },
    ])
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

      <main className="min-h-screen bg-[#FAFAFA] pb-10 dark:bg-background">
        <Suspense
          key={uuid}
          fallback={
            <div className="w-full px-4 pt-8 sm:px-6 lg:px-8">
              <ArchiveSkeleton />
            </div>
          }
        >
          <CategoryArchive
            categoryId={uuid}
            heading={heading}
            priceFilter={priceFilter}
            sortBy={sortBy || "newest"}
            subcategoryId={subcategoryId}
            page={page}
          />
        </Suspense>
      </main>

      <ScrollToTop />
    </>
  )
}
