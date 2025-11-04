import qs from "query-string"
import { Product } from "@/types"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface Query {
  categoryId?: string
  isFeatured?: boolean
  page?: number
  limit?: number
  priceFilter?: 'paid' | 'free' | 'all'
  sortBy?: string
}

interface ProductResponse {
  products: Product[]
  total: number
  page: number
  pageCount: number
}

const getProducts = async (query: Query): Promise<ProductResponse> => {
  try { 
    const url = qs.stringifyUrl({
      url: URL,
      query: {
        categoryId: query.categoryId || undefined,
        isFeatured: query.isFeatured,
        page: query.page || 1,
        limit: query.limit || 24,
        priceFilter: query.priceFilter || undefined,
        sortBy: query.sortBy || undefined,
      },
    })

    const res = await fetch(url)

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status, res.statusText)
      throw new Error("Failed to fetch products")
    }

    const data = await res.json()

    const processedProducts = data.products.map((product: Product) => ({
      ...product,
      images: product.Image?.map((img: { url: string }) => ({ url: img.url })) || [],
    }))

    return {
      products: processedProducts,
      total: data.total,
      page: data.page,
      pageCount: data.pageCount,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      total: 0,
      page: 1,
      pageCount: 1,
    }
  }
}

export default getProducts