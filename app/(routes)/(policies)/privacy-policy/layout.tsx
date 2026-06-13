import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Brandex Privacy Policy — how we collect, use, store, and protect your personal data.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
