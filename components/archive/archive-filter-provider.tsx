"use client"

import { createContext, useContext, useTransition } from "react"
import { useRouter } from "next/navigation"

interface ArchiveFilterContextValue {
  /** True while a filter/sort/subcategory navigation is in flight. */
  isPending: boolean
  /** Navigate to a new URL inside a transition (keeps current UI, sets isPending). */
  navigate: (url: string) => void
}

const ArchiveFilterContext = createContext<ArchiveFilterContextValue>({
  isPending: false,
  navigate: () => {},
})

/**
 * Shares one transition across the archive filter controls and the grid, so
 * changing a filter dims the *current* results (with a spinner) instead of
 * flashing a full skeleton — smooth stale-while-revalidate.
 */
export function ArchiveFilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = (url: string) => {
    startTransition(() => router.push(url, { scroll: false }))
  }

  return (
    <ArchiveFilterContext.Provider value={{ isPending, navigate }}>
      {children}
    </ArchiveFilterContext.Provider>
  )
}

export const useArchiveFilter = () => useContext(ArchiveFilterContext)
