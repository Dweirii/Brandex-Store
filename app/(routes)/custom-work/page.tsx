import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import {
  ArrowRight,
  ChevronDown,
  ClipboardList,
  Pencil,
  FileCheck,
  Package,
  Layers,
  Sparkles,
  Play,
  ImageIcon,
} from "lucide-react"
import getProducts from "@/actions/get-products"

export const metadata: Metadata = {
  title: "Custom Work — Brandex",
  description:
    "Custom design services for businesses, creators, and agencies seeking polished, high-quality visuals tailored to their exact needs.",
}

const MOCKUPS_CATEGORY_ID = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"

const WHAT_WE_CREATE = [
  { label: "Packaging Design", icon: Package },
  { label: "Product Mockups", icon: Layers },
  { label: "Brand Visuals", icon: Sparkles },
  { label: "Social Media Assets", icon: ImageIcon },
  { label: "Motion Graphics", icon: Play },
]

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    description: "Fill out the form with your project details.",
  },
  {
    icon: Pencil,
    title: "We design it",
    description: "Our team creates a custom design tailored to your brand.",
  },
  {
    icon: FileCheck,
    title: "You get final files",
    description: "Review, revise if needed, and download your final files.",
  },
]

const OUR_WORK_META = [
  {
    title: "Custom Packaging",
    description: "Fill out the form with your project details.",
  },
  {
    title: "Product Mockup",
    description: "Our team creates a custom design tailored to your brand.",
  },
  {
    title: "Brand Visuals",
    description: "Review, revise if needed and download your final files.",
  },
]

export default async function CustomWorkPage() {
  const { products } = await getProducts({
    categoryId: MOCKUPS_CATEGORY_ID,
    limit: 10,
    sortBy: "newest",
  })

  const imgUrls = products
    .map((p) => p.images?.[0]?.url)
    .filter((u): u is string => Boolean(u))

  // Distribute images across sections
  const heroImg = imgUrls[0]
  const categoryImgs = imgUrls.slice(0, 5)
  const workImgs = imgUrls.slice(1, 4)
  const howItWorksImg = imgUrls[4] ?? imgUrls[0]
  const ctaImg = imgUrls[3] ?? imgUrls[0]

  return (
    <div className="space-y-0 -mx-2">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="rounded-2xl overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-0">
          {/* Left — copy */}
          <div className="px-8 py-10 lg:py-14 lg:pl-10 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-3">
              Custom design,<br />built for your brand.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-7 max-w-sm">
              Need something specific? We create mockups, packaging, and assets
              uniquely tailored to fit your brand.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/intake"
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors shadow"
              >
                Start a Project
                <ChevronDown className="w-4 h-4" />
              </Link>
              <Link
                href="#our-work"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                View Examples
              </Link>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative h-56 lg:h-full min-h-[240px] overflow-hidden">
            {heroImg ? (
              <Image
                src={heroImg}
                alt="Custom design example"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted/50" />
            )}
            <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#f5f4f0]/20 dark:to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── What We Create ────────────────────────────────────── */}
      <section className="mb-10 px-2">
        <h2 className="text-xl font-bold text-foreground mb-1">What We Create</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Packaging, design, products, photography, and assets tailored to your brand.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {WHAT_WE_CREATE.map(({ label, icon: Icon }, i) => (
            <div key={label} className="group flex flex-col gap-2.5">
              {/* Square image with rounded corners — no card border */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                {categoryImgs[i] ? (
                  <Image
                    src={categoryImgs[i]}
                    alt={label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              {/* Label sits below the image */}
              <p className="text-sm font-medium text-foreground text-center">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Work ──────────────────────────────────────────── */}
      <section id="our-work" className="mb-10 px-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-foreground">Our Work</h2>
          <Link
            href="/category/mockups"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Examples of custom designs we&apos;ve created for clients.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OUR_WORK_META.map(({ title, description }, i) => (
            <div
              key={title}
              className="rounded-xl bg-background border border-border overflow-hidden group"
            >
              <div className="relative aspect-4/3 bg-muted overflow-hidden">
                {workImgs[i] ? (
                  <Image
                    src={workImgs[i]}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                <Link
                  href="/intake"
                  className="text-xs font-medium text-primary hover:underline mt-2 inline-block"
                >
                  Start this project →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="mb-8 px-2">
        <h2 className="text-xl font-bold text-foreground mb-1">How It Works</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Examples of custom designs we&apos;ve created for clients.
        </p>

        <div className="rounded-2xl bg-[#f5f4f0] dark:bg-muted/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0">
            {/* Steps */}
            <div className="p-7 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex flex-col gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E5E5] dark:bg-background dark:border-border flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side image (hidden on small screens) */}
            {howItWorksImg && (
              <div className="relative hidden lg:block w-52 overflow-hidden">
                <Image
                  src={howItWorksImg}
                  alt="How it works"
                  fill
                  className="object-cover object-center"
                  sizes="208px"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#f5f4f0]/80 to-transparent dark:from-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="rounded-2xl overflow-hidden bg-[#1B3A2B] relative px-2">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-0">
          <div className="px-8 py-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-4">
              Let&apos;s build something custom
            </h2>
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary/80 transition-colors shadow"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right image */}
          {ctaImg && (
            <div className="relative hidden lg:block h-40 w-52 overflow-hidden opacity-70">
              <Image
                src={ctaImg}
                alt="Let's build something custom"
                fill
                className="object-cover object-center"
                sizes="208px"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#1B3A2B]/80 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
