"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface CompareStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  clearAll: () => void
  isInCompare: (id: string) => boolean
}

const useCompare = create(
  persist<CompareStore>(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        const currentItems = get().items
        const existing = currentItems.find((item) => item.id === product.id)

        if (existing) {
          toast.error("Product already in comparison")
          return
        }

        if (currentItems.length >= 4) {
          toast.error("You can compare up to 4 products at a time")
          return
        }

        set({ items: [...currentItems, product] })
        toast.success("Added to comparison")
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) })
        toast.success("Removed from comparison")
      },
      clearAll: () => {
        set({ items: [] })
      },
      isInCompare: (id: string) => {
        return get().items.some((item) => item.id === id)
      },
    }),
    {
      name: "compare-storage",
    }
  )
)

export default useCompare
