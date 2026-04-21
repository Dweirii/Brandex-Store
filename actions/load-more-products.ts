"use server"

import getProducts from "@/actions/get-products"
import { interleaveByDay } from "@/lib/utils"

interface LoadMoreQuery {
  categoryId?: string
  isFeatured?: boolean
  page?: number
  limit?: number
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}

export async function loadMoreProducts(query: LoadMoreQuery) {
  const result = await getProducts(query)

  // On newest (default) sort, interleave by day so same-day items don't cluster.
  // Other sorts (price, name, oldest, mostPopular) must preserve their order.
  const shouldInterleave = !query.sortBy || query.sortBy === "newest"

  return {
    ...result,
    products: shouldInterleave ? interleaveByDay(result.products) : result.products,
  }
}

