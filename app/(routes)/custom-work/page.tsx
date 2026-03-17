import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Brush, Package, Image, Printer, Sparkles, ClipboardList, Search, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Work — Brandex",
  description: "Custom design services for businesses, creators, and agencies seeking polished, high-quality visuals tailored to their exact needs.",
}

const offerings = [
  { icon: Brush, label: "Branding & Identity" },
  { icon: Package, label: "Packaging Design" },
  { icon: Image, label: "Custom Mockups" },
  { icon: Printer, label: "Print Design" },
  { icon: Sparkles, label: "Other Creative Requests" },
]

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: "Submit Your Request",
    description: "Share your project details, goals, and any references.",
  },
  {
    number: 2,
    icon: Search,
    title: "Request Review",
    description: "We review the scope, creative direction, and project needs.",
  },
  {
    number: 3,
    icon: FileText,
    title: "Receive a Quote",
    description: "We'll follow up with pricing and next steps before any work begins.",
  },
]

export default function CustomWorkPage() {
  return (
    <div className="py-4 px-2">

        {/* Header */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Custom Work
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Need something created specifically for your brand? Brandex offers custom design services for businesses, creators, and agencies seeking polished, high-quality visuals tailored to their exact needs.
          </p>
        </div>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {offerings.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-5 hover:border-primary/40 hover:bg-muted/30 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="rounded-xl border border-border bg-background p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{number}</span>
                  </div>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-foreground mb-2">Start Your Request</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Send us your project details and we&apos;ll review your request and provide a quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/intake"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Start Your Request
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/intake/track"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background hover:bg-muted/50 text-foreground px-5 py-2.5 text-sm font-medium transition-colors"
              >
                Track Your Project
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Already submitted a request? View your project status using the tracking link above.
            </p>
          </div>
        </section>

      </div>
  )
}
