import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Request",
  description: "Submit a privacy request to Brandex to access, correct, or delete your personal data.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
