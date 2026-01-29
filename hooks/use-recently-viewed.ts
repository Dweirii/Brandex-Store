"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface RecentlyViewedStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  clearAll: () => void
}

const useRecentlyViewed = create(
  persist<RecentlyViewedStore>(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        const currentItems = get().items
        // Remove if already exists to avoid duplicates
        const filteredItems = currentItems.filter((item) => item.id !== product.id)
        // Add to beginning and limit to 12 items
        set({ items: [product, ...filteredItems].slice(0, 12) })
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      clearAll: () => {
        set({ items: [] })
      },
    }),
    {
      name: "recently-viewed-storage",
    }
  )
)

export default useRecentlyViewed
