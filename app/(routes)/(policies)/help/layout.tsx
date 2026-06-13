import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Brandex help center — answers on downloads, credits, licensing, and managing your account.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
