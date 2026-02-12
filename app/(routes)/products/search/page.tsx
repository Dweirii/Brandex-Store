"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PackageSearch, ImageIcon } from "lucide-react"
import Masonry from "react-masonry-css"
import { toast } from "sonner"

import type { Product, Category } from "@/types"
import RelatedProductCard from "@/components/ui/related-product-card"
import SearchCategoryNav from "@/components/search-category-nav"
import NoResults from "@/components/ui/no-results"
import Pagination from "@/components/paginatioon"
import Container from "@/components/ui/container"
import { getStoredImageData } from "@/components/image-search-button"
import { SearchLoadingState } from "@/components/search-loading-state"

interface SearchResponse {
  results: Product[]
  total: number
  page: number
  pageCount: number
  limit: number
  searchType?: 'text' | 'image'
  info?: string // Optional info message from API
}

const DEFAULT_CATEGORY_ID = "all"
const RESULTS_PER_PAGE = 24

const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1024: 3,
  640: 2,
  500: 1
}

export default function ProductSearchPage() {
  const router = useRouter()
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
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All Categories")
  const [categories, setCategories] = useState<Category[]>([])
  const [isImageSearch, setIsImageSearch] = useState(false)
  const [searchInfo, setSearchInfo] = useState<string | null>(null)

  // AbortController ref to cancel stale requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const res = await fetch(`${apiUrl}/categories`)
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Update active category name from fetched categories list
  useEffect(() => {
    if (categoryIdParam === DEFAULT_CATEGORY_ID) {
      setSelectedCategoryName("All Categories")
      return
    }

    if (categories.length > 0) {
      const category = categories.find(c => c.id === categoryIdParam)
      if (category) {
        setSelectedCategoryName(category.name)
      }
    }
  }, [categoryIdParam, categories])

  const performImageSearch = useCallback(
    async (base64Image: string, page: number = 1, categoryId: string = DEFAULT_CATEGORY_ID) => {
      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setLoading(true)
      setHasSearched(true)
      setIsImageSearch(true)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        
        // Convert base64 to File object
        const response = await fetch(base64Image)
        const blob = await response.blob()
        const file = new File([blob], 'search-image.jpg', { type: blob.type })
        
        const formData = new FormData()
        formData.append('image', file)
        if (categoryId !== DEFAULT_CATEGORY_ID && categoryId) {
          formData.append('categoryId', categoryId)
        }
        formData.append('page', page.toString())
        formData.append('limit', RESULTS_PER_PAGE.toString())
        
        const params = new URLSearchParams({ storeId: storeId || "" })
        const res = await fetch(
          `${apiUrl}/products/search-by-image?${params}`,
          {
            method: "POST",
            body: formData,
            signal: controller.signal,
          }
        )

        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        const data: SearchResponse = await res.json()
        
        // Don't update state if this request was cancelled
        if (controller.signal.aborted) return

        const uniqueResults = data.results?.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) || []

        setProducts(uniqueResults)
        setTotal(data.total || 0)
        setCurrentPage(data.page || 1)
        setPageCount(data.pageCount || 1)
        setSearchInfo(data.info || null)
        
        // Show info message if provided (e.g., memory limitation warning)
        if (data.info && uniqueResults.length === 0) {
          toast.info(data.info, { duration: 8000 })
        }
      } catch (error: any) {
        if (error.name === "AbortError") return // Silently ignore cancelled requests
        console.error("Image search failed:", error)
        toast.error("Image search failed. Please try uploading the image again.")
        setProducts([])
        setTotal(0)
        setPageCount(1)
        setSearchInfo(null)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [storeId]
  )

  const performSearch = useCallback(
    async (searchQuery: string, page: number = 1, categoryId: string = DEFAULT_CATEGORY_ID) => {
      // Allow searching even if query is short if a specific category is selected
      // But for global search, we still want a minimum query length
      if (!searchQuery.trim() && categoryId === DEFAULT_CATEGORY_ID) {
        setProducts([])
        setTotal(0)
        setPageCount(1)
        setHasSearched(false)
        setIsImageSearch(false)
        return
      }

      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setLoading(true)
      setHasSearched(true)
      setIsImageSearch(false)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const params = new URLSearchParams({
          query: searchQuery.trim(),
          storeId: storeId || "",
          page: page.toString(),
          limit: RESULTS_PER_PAGE.toString(),
        })

        // Only add categoryId if it's not the default "all"
        if (categoryId !== DEFAULT_CATEGORY_ID && categoryId) {
          params.set("categoryId", categoryId)
        }

        const res = await fetch(`${apiUrl}/products/search?${params}`, {
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        const data: SearchResponse = await res.json()

        // Don't update state if this request was cancelled
        if (controller.signal.aborted) return

        // De-duplicate results by ID to prevent key warnings
        const uniqueResults = data.results?.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) || []

        setProducts(uniqueResults)
        setTotal(data.total || 0)
        setCurrentPage(data.page || 1)
        setPageCount(data.pageCount || 1)
      } catch (error: any) {
        if (error.name === "AbortError") return // Silently ignore cancelled requests
        console.error("Search failed:", error)
        setProducts([])
        setTotal(0)
        setPageCount(1)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [storeId]
  )

  // Fire search immediately when URL params change (search bar already debounces)
  useEffect(() => {
    const currentQuery = searchParams.get("query") || ""
    const currentPage = parseInt(searchParams.get("page") || "1", 10)
    const currentCategoryId = searchParams.get("categoryId") || DEFAULT_CATEGORY_ID
    const imageSearchParam = searchParams.get("imageSearch")
    const imageId = searchParams.get("imageId")

    // Update currentPage state to match URL
    setCurrentPage(currentPage)

    // Check if this is an image search
    if (imageSearchParam === "true" && imageId) {
      // Get the image data from sessionStorage
      const base64Image = getStoredImageData(imageId)
      
      if (base64Image) {
        performImageSearch(base64Image, currentPage, currentCategoryId)
      } else {
        // Image data not found in sessionStorage
        console.warn("Image data not found. Please upload the image again.")
        setHasSearched(true)
        setIsImageSearch(true)
        setProducts([])
        setTotal(0)
        setLoading(false)
        toast.info('Image file lost. Please upload the image again to search.')
      }
      return
    }

    if (currentQuery.trim().length >= 2) {
      // No debounce here - the search bar already debounces before updating the URL
      performSearch(currentQuery, currentPage, currentCategoryId)
    } else if (currentQuery.trim().length === 0 && currentCategoryId === DEFAULT_CATEGORY_ID) {
      setProducts([])
      setHasSearched(false)
      setIsImageSearch(false)
    }

    // Cleanup: cancel in-flight request when params change
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [searchParams, performSearch, performImageSearch])

  // Function to handle category changes from the SearchCategoryNav
  const handleCategoryNavChange = useCallback((newCategoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("categoryId", newCategoryId)
    params.set("page", "1") // Reset to page 1
    router.push(`/products/search?${params.toString()}`)
  }, [router, searchParams])

  return (
    <Container>
      <div className="min-h-screen py-6 sm:py-8">
        {/* Results Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          {(queryParam || isImageSearch) && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  Search Results
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {isImageSearch ? (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      <span>Image search results</span>
                    </>
                  ) : (
                    <>Results for &quot;{queryParam}&quot;</>
                  )}
                  {categoryIdParam !== DEFAULT_CATEGORY_ID && selectedCategoryName && selectedCategoryName !== "All Categories" && (
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

          {/* Search Category Navigation Filter */}
          <SearchCategoryNav
            categories={categories}
            selectedCategoryId={categoryIdParam}
            onCategoryChange={handleCategoryNavChange}
          />

          {!queryParam && !hasSearched && !isImageSearch && (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl bg-muted/5">
              <PackageSearch className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg">Select a category, search by text, or upload an image to find products.</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="py-12">
              <SearchLoadingState isImageSearch={isImageSearch} />
            </div>
          )}

          {!loading && products.length === 0 && hasSearched && (
            <div className="space-y-4">
              <NoResults />
              {searchInfo && (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ℹ️ {searchInfo}
                  </p>
                </div>
              )}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="space-y-6">
              {/* Products Grid with Masonry */}
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-4 sm:-ml-6"
                columnClassName="pl-4 sm:pl-6 bg-clip-padding"
              >
                {products.map((product) => (
                  <div key={product.id} className="mb-4 sm:mb-6">
                    <RelatedProductCard data={product} />
                  </div>
                ))}
              </Masonry>

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