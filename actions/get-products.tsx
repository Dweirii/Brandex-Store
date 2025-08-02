import qs from "query-string"
import { Product } from "@/types"

// Utility function to safely parse price values
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    const parsed = parseFloat(price.replace(/[^0-9.-]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface Query {
  categoryId?: string
  isFeatured?: boolean
  page?: number
  limit?: number
  priceFilter?: 'paid' | 'free' | 'all'
}

interface ProductResponse {
  products: Product[]
  total: number
  page: number
  pageCount: number
}

const getProducts = async (query: Query): Promise<ProductResponse> => {
  try {
    // If we're filtering by price, we need to fetch ALL products first to filter properly
    const shouldFetchAll = query.priceFilter && query.priceFilter !== 'all'
    
    const url = qs.stringifyUrl({
      url: URL,
      query: {
        categoryId: query.categoryId || undefined,
        isFeatured: query.isFeatured,
        page: shouldFetchAll ? 1 : (query.page || 1),
        limit: shouldFetchAll ? 1000 : (query.limit || 12), // Fetch more when filtering
        priceFilter: query.priceFilter || undefined,
      },
    })

    const res = await fetch(url)

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status, res.statusText)
      throw new Error("Failed to fetch products")
    }

    const data = await res.json()

    const processedProducts = data.products.map((product: any) => ({
      ...product,
      images: product.Image?.map((img: any) => ({ url: img.url })) || [],
    }))

    // Client-side filtering and pagination when price filter is applied
    if (query.priceFilter && query.priceFilter !== 'all') {
      try {
        let allFilteredProducts = processedProducts

        // If we didn't fetch all products in first request, fetch them now
        if (!shouldFetchAll || processedProducts.length >= 1000) {
          // Try to get all products by making multiple requests if needed
          let allProducts = [...processedProducts]
          let currentPage = 2
          let hasMore = data.pageCount > 1
          
          while (hasMore && allProducts.length < 2000) { // Safety limit
            try {
              const moreUrl = qs.stringifyUrl({
                url: URL,
                query: {
                  categoryId: query.categoryId || undefined,
                  isFeatured: query.isFeatured,
                  page: currentPage,
                  limit: 100,
                },
              })
              
              const moreRes = await fetch(moreUrl)
              if (moreRes.ok) {
                const moreData = await moreRes.json()
                const moreProcessed = moreData.products.map((product: any) => ({
                  ...product,
                  images: product.Image?.map((img: any) => ({ url: img.url })) || [],
                }))
                
                allProducts.push(...moreProcessed)
                hasMore = currentPage < moreData.pageCount
                currentPage++
              } else {
                hasMore = false
              }
            } catch {
              hasMore = false
            }
          }
          
          allFilteredProducts = allProducts
        }

        // Apply price filter
        if (query.priceFilter === 'free') {
          allFilteredProducts = allFilteredProducts.filter((product: any) => {
            const price = parsePrice(product.price)
            return price === 0
          })
        } else if (query.priceFilter === 'paid') {
          allFilteredProducts = allFilteredProducts.filter((product: any) => {
            const price = parsePrice(product.price)
            return price > 0
          })
        }

        // Calculate pagination for filtered results
        const limit = query.limit || 12
        const page = query.page || 1
        const total = allFilteredProducts.length
        const pageCount = Math.max(1, Math.ceil(total / limit))
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex)

        return {
          products: paginatedProducts,
          total: total,
          page: page,
          pageCount: pageCount,
        }
      } catch (filterError) {
        console.error('Error filtering products by price:', filterError)
        // Fallback to unfiltered results if filtering fails
        return {
          products: processedProducts,
          total: data.total,
          page: data.page,
          pageCount: data.pageCount,
        }
      }
    }

    // No filtering applied, return normal paginated results
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
