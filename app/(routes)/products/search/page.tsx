"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { PackageSearch } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import type { Product, Category } from "@/types"
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

const DEFAULT_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a" // MOCKUP STUDIO

export default function ProductSearchPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("storeId") || undefined
  const queryParam = searchParams.get("query") || ""
  const categoryIdParam = searchParams.get("categoryId") || DEFAULT_CATEGORY_ID
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("MOCKUP STUDIO")

  // Fetch category name on mount and when categoryId changes
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const res = await fetch(`${apiUrl}/categories/${categoryIdParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          const category: Category = await res.json()
          setSelectedCategoryName(category.name)
        }
      } catch (error) {
        console.error("Failed to fetch category:", error)
      }
    }

    if (categoryIdParam !== DEFAULT_CATEGORY_ID) {
      fetchCategoryName()
    } else {
      setSelectedCategoryName("MOCKUP STUDIO")
    }
  }, [categoryIdParam])

  const performSearch = useCallback(
    async (searchQuery: string, page: number = 1, categoryId: string = DEFAULT_CATEGORY_ID) => {
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
        const params: Record<string, string | number> = {
          query: searchQuery.trim(),
          storeId: storeId || "",
          page,
          limit: 60,
        }

        // Only add categoryId if it's not the default
        if (categoryId !== DEFAULT_CATEGORY_ID) {
          params.categoryId = categoryId
        }

        const res = await axios.get<SearchResponse>(`${apiUrl}/products/search`, {
          params,
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

  // Debounced search to prevent excessive API calls (only for query changes)
  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string, page: number, categoryId: string) => {
      performSearch(searchQuery, page, categoryId)
    },
    300 // Wait 300ms after user stops typing
  )

  // Track previous values to detect what changed
  const prevQueryRef = useRef<string>("")
  const prevPageRef = useRef<number>(1)
  const prevCategoryIdRef = useRef<string>(DEFAULT_CATEGORY_ID)

  // Handle search when query, page, or categoryId param changes
  useEffect(() => {
    const currentQuery = searchParams.get("query") || ""
    const currentPage = parseInt(searchParams.get("page") || "1", 10)
    const currentCategoryId = searchParams.get("categoryId") || DEFAULT_CATEGORY_ID
    
    // Update currentPage state to match URL
    setCurrentPage(currentPage)
    
    const queryChanged = currentQuery !== prevQueryRef.current
    const pageChanged = currentPage !== prevPageRef.current
    const categoryChanged = currentCategoryId !== prevCategoryIdRef.current
    
    // Update refs
    prevQueryRef.current = currentQuery
    prevPageRef.current = currentPage
    prevCategoryIdRef.current = currentCategoryId
    
    if (currentQuery.trim().length >= 2) {
      // If only page changed, search immediately (no debounce)
      // If query or category changed, use debounced search
      if (pageChanged && !queryChanged && !categoryChanged) {
        performSearch(currentQuery, currentPage, currentCategoryId)
      } else {
        debouncedSearch(currentQuery, currentPage, currentCategoryId)
      }
    } else {
      setProducts([])
      setHasSearched(false)
    }
  }, [searchParams, debouncedSearch, performSearch])

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
                  {categoryIdParam !== DEFAULT_CATEGORY_ID && (
                    <span className="ml-2">in {selectedCategoryName}</span>
                  )}
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