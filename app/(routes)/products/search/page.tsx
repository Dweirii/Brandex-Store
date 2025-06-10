"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { Search, PackageSearch } from "lucide-react"

import type { Product } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import ProductCard from "@/components/ui/product-card"
import NoResults from "@/components/ui/no-results"

export default function ProductSearchPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("storeId") || undefined

  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim() || query.trim().length < 2) {
      setProducts([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
      const res = await axios.get(`${apiUrl}/products/search`, {
        params: { query, storeId },
      })
      const results = Array.isArray(res.data) ? res.data : res.data?.results || []
      setProducts(results)
    } catch (error) {
      console.error("Search failed:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (trimmedQuery.length >= 2) {
      const handler = setTimeout(() => {
        handleSearch()
      }, 500)
      return () => clearTimeout(handler)
    } else {
      setProducts([])
      setHasSearched(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, storeId])

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-background text-foreground transition-colors">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Search Products</h1>
        <p className="text-muted-foreground">Find exactly what you&apos;re looking for.</p>
      </header>

      <div className="relative mb-10 max-w-2xl mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, description, category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 pr-28 py-3 h-12 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
        />
        <Button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-6"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="w-full h-48 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-5 w-1/4" />
            </Card>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && hasSearched && <NoResults />}

      {!loading && products.length === 0 && !hasSearched && query.trim().length < 2 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">Start typing to search for products.</p>
          <p className="text-sm">Enter at least 2 characters to begin your search.</p>
        </div>
      )}

      {!loading && products.length === 0 && !hasSearched && query.trim().length >= 2 && (
        <div className="text-center py-12 text-muted-foreground">
          <PackageSearch className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">No products found yet. Try initiating a search.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Search Results{" "}
            <span className="text-muted-foreground text-lg">({products.length} found)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
            {products.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
