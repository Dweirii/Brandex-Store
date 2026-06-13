import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Brandex Refund Policy — eligibility and the process for refunds on credit purchases and downloads.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
