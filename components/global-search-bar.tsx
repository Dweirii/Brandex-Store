"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, ChevronRight, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ImageSearchButton } from "./image-search-button"

interface GlobalSearchBarProps {
  className?: string
}

interface AutocompleteResponse {
  suggestions: string[]
}

const DEFAULT_CATEGORY_ID = "all"

export default function GlobalSearchBar({ className }: GlobalSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryParam = searchParams.get("query") || ""

  const [query, setQuery] = useState(queryParam)
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const suggestionsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autocompleteControllerRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Tracks the last query we pushed to the URL so the URL→state sync
  // knows to skip its own updates and not overwrite what the user is typing.
  const lastPushedQueryRef = useRef<string>("")

  // Extract stable scalar values from searchParams for effect dependencies.
  // Prevents effects from re-firing when unrelated params (e.g. page) change.
  const storeIdParam = searchParams.get("storeId") || ""
  const categoryIdParam = searchParams.get("categoryId") || ""
  const priceFilterParam = searchParams.get("priceFilter") || ""
  const imageSearchParam = searchParams.get("imageSearch") || ""

  // Sync URL → state only for external navigation (back/forward button).
  // When our own router.push updates the URL, lastPushedQueryRef matches
  // the incoming queryParam so we skip the sync and preserve user input.
  useEffect(() => {
    if (queryParam === lastPushedQueryRef.current) {
      lastPushedQueryRef.current = ""
      return
    }
    setQuery(queryParam)
  }, [queryParam])

  // Fetch autocomplete suggestions with request cancellation
  useEffect(() => {
    if (suggestionsTimerRef.current) {
      clearTimeout(suggestionsTimerRef.current)
    }

    if (query.trim().length >= 1) {
      suggestionsTimerRef.current = setTimeout(async () => {
        setIsSearching(true)
        autocompleteControllerRef.current?.abort()
        const controller = new AbortController()
        autocompleteControllerRef.current = controller

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
          const params = new URLSearchParams({
            query: query.trim(),
            limit: "6",
          })
          if (storeIdParam) params.set("storeId", storeIdParam)

          const res = await fetch(`${apiUrl}/products/search/autocomplete?${params}`, {
            signal: controller.signal,
          })
          if (!res.ok) throw new Error("Autocomplete failed")
          const data: AutocompleteResponse = await res.json()

          if (!controller.signal.aborted) {
            setSuggestions(data.suggestions || [])
            setShowSuggestions(true)
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "AbortError") return
          console.error("Autocomplete failed:", error)
          setSuggestions([])
        } finally {
          if (!controller.signal.aborted) {
            setIsSearching(false)
          }
        }
      }, 150)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsSearching(false)
    }

    return () => {
      if (suggestionsTimerRef.current) {
        clearTimeout(suggestionsTimerRef.current)
      }
      autocompleteControllerRef.current?.abort()
    }
  }, [query, storeIdParam])

  // Debounced URL update as user types - triggers the search page
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (query.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        const params = new URLSearchParams()
        params.set("query", query.trim())
        if (storeIdParam) params.set("storeId", storeIdParam)

        if (categoryIdParam && categoryIdParam !== DEFAULT_CATEGORY_ID) {
          params.set("categoryId", categoryIdParam)
        }

        if (priceFilterParam && priceFilterParam !== "all") {
          params.set("priceFilter", priceFilterParam)
        }

        params.set("page", "1")

        lastPushedQueryRef.current = query.trim()
        if (pathname !== "/products/search") {
          router.push(`/products/search?${params.toString()}`)
        } else {
          router.push(`/products/search?${params.toString()}`, { scroll: false })
        }
        setShowSuggestions(false)
      }, 300)
    } else if (query.trim().length === 0) {
      const isImageSearch = imageSearchParam === "true"
      if (pathname === "/products/search" && !isImageSearch) {
        debounceTimerRef.current = setTimeout(() => {
          lastPushedQueryRef.current = ""
          router.push("/")
        }, 300)
      }
      setShowSuggestions(false)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, router, pathname, storeIdParam, categoryIdParam, priceFilterParam, imageSearchParam])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    const params = new URLSearchParams()
    params.set("query", suggestion)
    if (storeIdParam) params.set("storeId", storeIdParam)

    if (categoryIdParam && categoryIdParam !== DEFAULT_CATEGORY_ID) {
      params.set("categoryId", categoryIdParam)
    }

    if (priceFilterParam && priceFilterParam !== "all") {
      params.set("priceFilter", priceFilterParam)
    }

    params.set("page", "1")
    lastPushedQueryRef.current = suggestion
    router.push(`/products/search?${params.toString()}`)
  }, [router, storeIdParam, categoryIdParam, priceFilterParam])

  const handleClear = useCallback(() => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    autocompleteControllerRef.current?.abort()
    const isImageSearch = imageSearchParam === "true"
    if (!isImageSearch) {
      lastPushedQueryRef.current = ""
      router.push("/")
    }
  }, [router, imageSearchParam])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (query.trim().length >= 2) {
          const params = new URLSearchParams()
          params.set("query", query.trim())
          if (storeIdParam) params.set("storeId", storeIdParam)

          if (categoryIdParam && categoryIdParam !== DEFAULT_CATEGORY_ID) {
            params.set("categoryId", categoryIdParam)
          }

          if (priceFilterParam && priceFilterParam !== "all") {
            params.set("priceFilter", priceFilterParam)
          }

          params.set("page", "1")
          lastPushedQueryRef.current = query.trim()
          router.push(`/products/search?${params.toString()}`)
          setShowSuggestions(false)
        } else if (query.trim().length === 0) {
          const isImageSearch = imageSearchParam === "true"
          if (!isImageSearch) {
            lastPushedQueryRef.current = ""
            router.push("/")
          }
          setShowSuggestions(false)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Escape") {
        setShowSuggestions(false)
        setSelectedIndex(-1)
        const isImageSearch = imageSearchParam === "true"
        if (pathname === "/products/search" && query.trim().length === 0 && !isImageSearch) {
          lastPushedQueryRef.current = ""
          router.push("/")
        }
      }
    },
    [query, router, pathname, suggestions, selectedIndex, handleSuggestionClick, storeIdParam, categoryIdParam, priceFilterParam, imageSearchParam]
  )

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10 text-primary animate-spin"
              />
            ) : (
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10",
                  "text-muted-foreground/40"
                )}
              />
            )}
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(-1)
              }}
              onFocus={() => {
                setIsFocused(true)
                if (suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              onBlur={() => {
                setIsFocused(false)
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              onKeyDown={handleKeyDown}
              className={cn(
                "pl-10 pr-4 h-9 rounded-full bg-muted/30",
                "border border-border/30 transition-all duration-200 text-sm",
                "placeholder:text-muted-foreground/40",
                "hover:bg-muted/40 hover:border-border/50 hover:shadow-sm",
                isFocused
                  ? "bg-background border-primary/30 shadow-md ring-2 ring-primary/5"
                  : "",
                "focus-visible:outline-none focus-visible:ring-0"
              )}
            />
          </div>
          
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {process.env.NEXT_PUBLIC_ENABLE_IMAGE_SEARCH === 'true' && (
            <ImageSearchButton 
              className="shrink-0"
            />
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto overflow-x-hidden">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full text-left px-5 py-3 text-sm transition-all duration-150 flex items-center justify-between group/item",
                  selectedIndex === index
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="truncate flex-1">
                  {suggestion.split(new RegExp(`(${query.trim()})`, 'gi')).map((part, i) =>
                    part.toLowerCase() === query.trim().toLowerCase() ? (
                      <span key={i} className="font-semibold text-foreground">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </span>
                <ChevronRight className={cn(
                  "h-4 w-4 ml-3 shrink-0 transition-transform duration-200",
                  selectedIndex === index
                    ? "text-primary translate-x-0"
                    : "text-muted-foreground/40 group-hover/item:text-muted-foreground/60 group-hover/item:translate-x-0.5"
                )} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
