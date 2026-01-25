"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { PackageSearch, ImageIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import Masonry from "react-masonry-css"
import { toast } from "sonner"

import type { Product, Category } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import RelatedProductCard from "@/components/ui/related-product-card"
import SearchCategoryNav from "@/components/search-category-nav"
import NoResults from "@/components/ui/no-results"
import Pagination from "@/components/paginatioon"
import Container from "@/components/ui/container"
import { getStoredImageData } from "@/components/image-search-button"

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
        formData.append('limit', '250') // Increased for more results per page
        
        const res = await axios.post<SearchResponse>(
          `${apiUrl}/products/search-by-image`,
          formData,
          {
            params: { storeId: storeId || "" },
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )

        const data = res.data
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
      } catch (error) {
        console.error("Image search failed:", error)
        toast.error("Image search failed. Please try uploading the image again.")
        setProducts([])
        setTotal(0)
        setPageCount(1)
        setSearchInfo(null)
      } finally {
        setLoading(false)
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

      setLoading(true)
      setHasSearched(true)
      setIsImageSearch(false)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
        const params: Record<string, string | number> = {
          query: searchQuery.trim(),
          storeId: storeId || "",
          page,
          limit: 250, // Increased for more results per page
        }

        // Only add categoryId if it's not the default "all"
        if (categoryId !== DEFAULT_CATEGORY_ID && categoryId) {
          params.categoryId = categoryId
        }

        const res = await axios.get<SearchResponse>(`${apiUrl}/products/search`, {
          params,
        })

        const data = res.data
        // De-duplicate results by ID to prevent key warnings
        const uniqueResults = data.results?.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) || []

        setProducts(uniqueResults)
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
    const imageSearchParam = searchParams.get("imageSearch")
    const imageId = searchParams.get("imageId")

    // Update currentPage state to match URL
    setCurrentPage(currentPage)

    // Check if this is an image search
    if (imageSearchParam === "true" && imageId) {
      // Get the image data from sessionStorage
      const base64Image = getStoredImageData(imageId)
      
      console.log('Image search detected. ImageId:', imageId)
      console.log('Base64 image found:', !!base64Image)
      
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
    } else if (currentQuery.trim().length === 0 && currentCategoryId === DEFAULT_CATEGORY_ID) {
      setProducts([])
      setHasSearched(false)
      setIsImageSearch(false)
    }
  }, [searchParams, debouncedSearch, performSearch, performImageSearch])

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
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-4 sm:-ml-6"
              columnClassName="pl-4 sm:pl-6 bg-clip-padding"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="mb-4 sm:mb-6">
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-muted/20 animate-pulse" />
                </div>
              ))}
            </Masonry>
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