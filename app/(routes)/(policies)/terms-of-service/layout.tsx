import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Brandex Terms of Service — the rules for using our website, design assets, credits, and downloads.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
