"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import axios from "axios"

interface GlobalSearchBarProps {
  className?: string
}

interface AutocompleteResponse {
  suggestions: string[]
}

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const suggestionsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update query when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (suggestionsTimerRef.current) {
      clearTimeout(suggestionsTimerRef.current)
    }

    if (query.trim().length >= 1) {
      suggestionsTimerRef.current = setTimeout(async () => {
        try {
          const storeId = searchParams.get("storeId")
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
          const res = await axios.get<AutocompleteResponse>(`${apiUrl}/products/search/autocomplete`, {
            params: {
              query: query.trim(),
              storeId,
              limit: 8,
            },
          })
          setSuggestions(res.data.suggestions || [])
          setShowSuggestions(true)
        } catch (error) {
          console.error("Autocomplete failed:", error)
          setSuggestions([])
        }
      }, 300) // 300ms debounce for suggestions
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (suggestionsTimerRef.current) {
        clearTimeout(suggestionsTimerRef.current)
      }
    }
  }, [query, searchParams])

  // Debounced search - updates URL as user types
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Only search if query has at least 2 characters
    if (query.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        const storeId = searchParams.get("storeId")
        const params = new URLSearchParams()
        params.set("query", query.trim())
        if (storeId) params.set("storeId", storeId)

        // Navigate to search page if not already there
        if (pathname !== "/products/search") {
          router.push(`/products/search?${params.toString()}`)
        } else {
          // Update URL without navigation if already on search page
          router.push(`/products/search?${params.toString()}`, { scroll: false })
        }
        setShowSuggestions(false)
      }, 500) // 500ms debounce
    } else if (query.trim().length === 0) {
      // If query is empty, navigate back to home page
      if (pathname === "/products/search") {
        debounceTimerRef.current = setTimeout(() => {
          router.push("/")
        }, 300)
      }
      setShowSuggestions(false)
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, router, searchParams, pathname])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    const storeId = searchParams.get("storeId")
    const params = new URLSearchParams()
    params.set("query", suggestion)
    if (storeId) params.set("storeId", storeId)
    router.push(`/products/search?${params.toString()}`)
  }, [router, searchParams])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        // Clear debounce and search immediately
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          // Use selected suggestion
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (query.trim().length >= 2) {
          // Search with current query
          const storeId = searchParams.get("storeId")
          const params = new URLSearchParams()
          params.set("query", query.trim())
          if (storeId) params.set("storeId", storeId)
          router.push(`/products/search?${params.toString()}`)
          setShowSuggestions(false)
        } else if (query.trim().length === 0) {
          // If empty, go to home page
          router.push("/")
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
        // If on search page and query is empty, go to home
        if (pathname === "/products/search" && query.trim().length === 0) {
          router.push("/")
        }
      }
    },
    [query, router, searchParams, pathname, suggestions, selectedIndex, handleSuggestionClick]
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
        <div className="relative group">
          <Search
            className={cn(
              "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors pointer-events-none z-10",
              isFocused 
                ? "text-primary" 
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <Input
            type="search"
            placeholder="Search products, categories..."
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
              // Delay hiding suggestions to allow click
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 sm:pl-12 pr-4 h-9 sm:h-10 w-full bg-background border border-input hover:border-ring/50 focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px] transition-all shadow-sm hover:shadow-md focus-visible:shadow-lg text-sm sm:text-base placeholder:text-muted-foreground"
          />
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between",
                  selectedIndex === index && "bg-muted"
                )}
              >
                <span className="truncate">
                  {suggestion.split(new RegExp(`(${query.trim()})`, 'gi')).map((part, i) => 
                    part.toLowerCase() === query.trim().toLowerCase() ? (
                      <span key={i} className="font-semibold text-primary">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

