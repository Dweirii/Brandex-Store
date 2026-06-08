"use server"

import getProducts from "@/actions/get-products"
import { categoryParamToId } from "@/lib/category-slugs"
import type { Product } from "@/types"

interface LoadArchiveArgs {
  /** "home" → merged Packaging + Mockups feed; otherwise a single categoryId. */
  scope: string
  page: number
  limit: number
  priceFilter?: "paid" | "free" | "all"
  sortBy?: string
  /** Optional subcategory filter (only meaningful for a single-category scope). */
  subcategoryId?: string
}

export interface ArchivePage {
  products: Product[]
  page: number
  pageCount: number
  total: number
  hasMore: boolean
}

/**
 * Single source of truth for the archive feed, used by both the initial server
 * render and infinite-scroll load-more. The "home" scope shows ONLY Packaging
 * and Mockups (interleaved) since the API filters one category at a time.
 */
export async function loadArchiveProducts({
  scope,
  page,
  limit,
  priceFilter,
  sortBy,
  subcategoryId,
}: LoadArchiveArgs): Promise<ArchivePage> {
  if (scope === "home") {
    const half = Math.ceil(limit / 2)
    const [packaging, mockups] = await Promise.all([
      getProducts({ categoryId: categoryParamToId("packaging"), page, limit: half, priceFilter, sortBy }),
      getProducts({ categoryId: categoryParamToId("mockups"), page, limit: half, priceFilter, sortBy }),
    ])

    const products: Product[] = []
    for (let i = 0; i < half; i++) {
      if (packaging.products[i]) products.push(packaging.products[i])
      if (mockups.products[i]) products.push(mockups.products[i])
    }

    const pageCount = Math.max(packaging.pageCount, mockups.pageCount, 1)
    return {
      products,
      page,
      pageCount,
      total: packaging.total + mockups.total,
      hasMore: page < pageCount,
    }
  }

  const res = await getProducts({ categoryId: scope, page, limit, priceFilter, sortBy, subcategoryId })
  return {
    products: res.products,
    page: res.page,
    pageCount: res.pageCount,
    total: res.total,
    hasMore: res.page < res.pageCount,
  }
}
