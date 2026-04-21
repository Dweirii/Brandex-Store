import Link from "next/link"
import Image from "next/image"
import { Fragment } from "react"
import type { Metadata } from "next"
import {
  ArrowRight,
  PenTool,
  Package,
  Layers,
  Printer,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Custom Work — Brandex",
  description:
    "Custom design services for businesses, creators, and agencies seeking polished, high-quality visuals tailored to their exact needs.",
}

const WHAT_WE_OFFER = [
  {
    label: "Branding & Identity",
    description: "Unique logos, color palettes, and brand guidelines.",
    icon: PenTool,
  },
  {
    label: "Packaging Design",
    description: "Eye-catching packaging that stands out on shelves.",
    icon: Package,
  },
  {
    label: "Custom Mockups",
    description: "Realistic, high-quality mockups for presentations.",
    icon: Layers,
  },
  {
    label: "Print Design",
    description: "Business cards, brochures, posters, and more.",
    icon: Printer,
  },
]

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Submit Your Request",
    description: "Share your project details, goals, and any references.",
  },
  {
    step: "2",
    title: "Request Review",
    description: "We review the scope, creative direction, and project needs.",
  },
  {
    step: "3",
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
          <h1 className="text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-[1.1] tracking-[-0.02em] mb-5">
            World-Class Design Services Tailored for Your Brand
          </h1>

          <p className="text-[14px] text-muted-foreground leading-[1.6] mb-8 max-w-md">
            Elevate your brand with custom designs crafted to impress. From logos and packaging
            to marketing materials and mockups, we bring your vision to life with polished
            designs that sell.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              href="/intake"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#00A63E] hover:bg-[#00A63E]/90 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            >
              Start Your Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors shadow-sm"
            >
              Track Your Project
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00A63E]" />
              Professional designers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00A63E]" />
              Free revisions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00A63E]" />
              100% satisfied clients
            </span>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WHAT_WE_OFFER.map(({ label, description, icon: Icon }) => (
            <div
              key={label}
              className="bg-background border border-[#ECECEC] dark:border-border/60 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00A63E]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#00A63E]" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                {label}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug">
                {description}
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

        <div className="flex flex-col md:flex-row md:items-stretch gap-4">
          {HOW_IT_WORKS.map(({ step, title, description }, i) => (
            <Fragment key={title}>
              <div className="flex-1 bg-background border border-[#ECECEC] dark:border-border/60 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00A63E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground mb-1.5 leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:flex items-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/40" strokeWidth={2} />
                </div>
              )}
            </Fragment>
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
