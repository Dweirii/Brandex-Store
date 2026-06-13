import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Brandex — a premium library of mockups, packaging templates, and PSD design resources built for designers, brands, and agencies.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
