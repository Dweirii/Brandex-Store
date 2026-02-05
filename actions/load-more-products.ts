"use server"

import getProducts from "@/actions/get-products"
import { Product } from "@/types"
import { shuffle } from "@/lib/utils"

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
  
  // Shuffle products on each page load for variety
  return {
    ...result,
    products: shuffle(result.products)
  }
}

