import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import {
  ArrowRight,
  ClipboardList,
  Search,
  FileText,
  PenTool,
  Package,
  Layers,
  Printer,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Work — Brandex",
  description:
    "Custom design services for businesses, creators, and agencies seeking polished, high-quality visuals tailored to their exact needs.",
}

const WHAT_WE_OFFER = [
  { label: "Branding & Identity", icon: PenTool },
  { label: "Packaging Design", icon: Package },
  { label: "Custom Mockups", icon: Layers },
  { label: "Print Design", icon: Printer },
  { label: "Other Creative\nRequests", icon: Sparkles },
]

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: ClipboardList,
    title: "Submit Your Request",
    description: "Share your project details, goals, and any references.",
  },
  {
    step: "2",
    icon: Search,
    title: "Request Review",
    description: "We review the scope, creative direction, and project needs.",
  },
  {
    step: "3",
    icon: FileText,
    title: "Receive a Quote",
    description: "We'll follow up with pricing and next steps before any work begins.",
  },
]

export default function CustomWorkPage() {
  return (
    <div className="space-y-16 pb-8">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-[40%_60%] lg:gap-4 pt-6 lg:items-center overflow-hidden">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-[2.75rem] font-[800] text-foreground leading-[1.1] tracking-[-0.02em] mb-4">
            Design Made for<br />Your Brand
          </h1>
          
          <h2 className="text-xl font-medium text-muted-foreground mb-6">
            Custom design services built around your brand
          </h2>
          
          <p className="text-[13px] text-muted-foreground leading-[1.6] mb-8 max-w-md">
            From branding and packaging to mockups and print design, Brandex helps
            businesses, creators, and agencies get polished visuals tailored to their goals.
            Submit your request, and we&apos;ll review the details and send a quote before work
            begins.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-lg bg-[#00A63E] hover:bg-[#00A63E]/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            >
              Start Your Request
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors shadow-sm"
            >
              Track Your Project
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative w-full mt-10 lg:mt-0 flex items-center justify-end lg:-mr-16">
          <Image
            src="/custom-page-hero.webp"
            alt="Design showcase"
            width={2000}
            height={1000}
            className="w-[160%] h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* ── What We Offer ────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-6">
          WHAT WE OFFER
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {WHAT_WE_OFFER.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="border border-[#e9e9e9] dark:border-border/80 bg-background rounded-xl p-5 flex flex-col items-start gap-4 aspect-auto h-32 hover:border-border transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="w-8 h-8 rounded shrink-0 bg-[#f0f8f4] dark:bg-primary/10 flex items-center justify-center text-[#00A63E]">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[13px] font-medium text-foreground whitespace-pre-line leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-6">
          HOW IT WORKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-[#e9e9e9] dark:border-border/80 bg-background rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-6 h-6 rounded-full border border-[#00A63E]/20 bg-[#f0f8f4] dark:bg-primary/5 flex items-center justify-center text-[#00A63E] font-bold text-[11px]">
                  {step}
                </div>
                <Icon className="w-4 h-4 text-muted-foreground/80" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2.5">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-[#f7f7f7] dark:bg-muted/40 rounded-2xl p-8 md:p-10 relative mt-8">
        <div className="max-w-2xl">
          <h2 className="text-[1.15rem] font-bold text-foreground mb-2">
            Start Your Request
          </h2>
          <p className="text-[13px] text-muted-foreground mb-8 text-balance">
            Send us your project details and we&apos;ll review your request and provide a quote.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00A63E] hover:bg-[#00A63E]/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              Start Your Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-border/80 bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              Track Your Project
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground max-w-lg leading-relaxed">
            Already submitted a request? View your project status using the tracking link above.
          </p>
        </div>
      </section>
    </div>
  )
}
