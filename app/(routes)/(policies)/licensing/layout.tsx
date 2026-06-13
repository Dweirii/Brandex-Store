import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Licensing",
  description: "Understand the Brandex license — commercial use and the allowed and prohibited uses for mockups, packaging templates, and PSD assets.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
