"use client"

import { create } from "zustand"

interface PremiumModalStore {
  isOpen: boolean
  productId?: string
  onOpen: (productId?: string) => void
  onClose: () => void
}

/**
 * Premium Modal Hook
 * 
 * Global state management for the premium subscription modal.
 * Allows opening the modal from anywhere in the app.
 * 
 * @example
 * const premiumModal = usePremiumModal()
 * premiumModal.onOpen() // Open modal
 * premiumModal.onOpen(productId) // Open modal with product context
 */
export const usePremiumModal = create<PremiumModalStore>((set) => ({
  isOpen: false,
  productId: undefined,
  onOpen: (productId?: string) => set({ isOpen: true, productId }),
  onClose: () => set({ isOpen: false, productId: undefined }),
}))







