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
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10",
              "text-muted-foreground/40"
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
            className={cn(
              "pl-10 pr-4 h-9 w-full bg-muted/30",
              "border border-border/30 transition-colors text-sm",
              "placeholder:text-muted-foreground/40",
              "rounded-md",
              "hover:bg-muted/40 hover:border-border/50",
              isFocused 
                ? "bg-background border-border shadow-sm" 
                : "",
              "focus-visible:outline-none focus-visible:ring-0"
            )}
          />
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown - Enhanced */}
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
                  "h-4 w-4 ml-3 flex-shrink-0 transition-transform duration-200",
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

