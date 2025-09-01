// components/ui/toaster.tsx
"use client"

import { Toaster } from "sonner"

export default function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      // expand
      // position="top-center"
      // theme="system" // "light" | "dark" | "system"
      // className="pointer-events-auto"
    />
  )
}
