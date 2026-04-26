"use client"

import { create } from "zustand"

interface BuyCreditsModalStore {
  isOpen: boolean
  returnTo?: string
  onOpen: (returnTo?: string) => void
  onClose: () => void
}

export const useBuyCreditsModal = create<BuyCreditsModalStore>((set) => ({
  isOpen: false,
  returnTo: undefined,
  onOpen: (returnTo?: string) => set({ isOpen: true, returnTo }),
  onClose: () => set({ isOpen: false, returnTo: undefined }),
}))
