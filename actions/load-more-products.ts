"use server"

import getProducts from "@/actions/get-products"
import { Product } from "@/types"

interface LoadMoreQuery {
  categoryId?: string
  isFeatured?: boolean
  page?: number
  limit?: number
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}

export async function loadMoreProducts(query: LoadMoreQuery) {
  return await getProducts(query)
}

