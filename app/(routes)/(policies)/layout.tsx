import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Legal | brandexme.com",
    template: "%s | brandexme.com",
  },
  description: "Legal policies for brandexme.com — Privacy Policy, Refund Policy, and Terms of Service.",
}

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
