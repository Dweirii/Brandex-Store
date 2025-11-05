"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { PackageSearch } from "lucide-react"

import type { Product } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import ProductCard from "@/components/ui/product-card"
import NoResults from "@/components/ui/no-results"
import Pagination from "@/components/paginatioon"
import Container from "@/components/ui/container"

interface SearchResponse {
  results: Product[]
  total: number
  page: number
  pageCount: number
  limit: number
}

export default function ProductSearchPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("storeId") || undefined
  const queryParam = searchParams.get("query") || ""
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(
    async (searchQuery: string, page: number = 1) => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setProducts([])
        setTotal(0)
        setPageCount(1)
        setHasSearched(false)
        return
      }

      setLoading(true)
      setHasSearched(true)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const res = await axios.get<SearchResponse>(`${apiUrl}/products/search`, {
          params: {
            query: searchQuery.trim(),
            storeId,
            page,
            limit: 48,
          },
        })

        const data = res.data
        setProducts(data.results || [])
        setTotal(data.total || 0)
        setCurrentPage(data.page || 1)
        setPageCount(data.pageCount || 1)
      } catch (error) {
        console.error("Search failed:", error)
        setProducts([])
        setTotal(0)
        setPageCount(1)
      } finally {
        setLoading(false)
      }
    },
    [storeId]
  )

  // Handle search when query param changes (from navbar search)
  useEffect(() => {
    if (queryParam.trim().length >= 2) {
      performSearch(queryParam, pageParam)
    } else {
      setProducts([])
      setHasSearched(false)
    }
  }, [queryParam, pageParam, performSearch])

  return (
    <Container>
      <div className="min-h-screen py-6 sm:py-8">
        {/* Results Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          {queryParam && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  Search Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  Results for &quot;{queryParam}&quot;
                </p>
              </div>
              {!loading && hasSearched && (
                <span className="text-sm text-muted-foreground">
                  {total} {total === 1 ? "result" : "results"}
                </span>
              )}
            </div>
          )}

          {!queryParam && (
            <div className="text-center py-12 text-muted-foreground">
              <PackageSearch className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">Use the search bar above to find products.</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="w-full h-48 rounded-lg mb-4 bg-gray-500" />
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-500" />
                  <Skeleton className="h-4 w-1/2 mb-2 bg-gray-500" />
                  <Skeleton className="h-4 w-full mb-3 bg-gray-500" />
                  <Skeleton className="h-5 w-1/4 bg-gray-500" />
                </Card>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && hasSearched && <NoResults />}

          {!loading && products.length > 0 && (
            <div className="space-y-6">
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="pt-6 flex justify-center">
                  <Pagination currentPage={currentPage} totalPages={pageCount} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
