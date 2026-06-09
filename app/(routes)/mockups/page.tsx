import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight, Download, BadgeCheck, Ruler, Layers } from "lucide-react"

import getProducts from "@/actions/get-products"
import getSubcategories from "@/actions/get-subcategories"
import { categoryParamToId } from "@/lib/category-slugs"
import { getDisplayImageUrl } from "@/lib/image-utils"
import { getSiteUrl, generateBreadcrumbStructuredData } from "@/lib/seo"
import CategoryLandingHero from "@/components/landing/category-landing-hero"
import CategoryMarquee from "@/components/landing/category-marquee"
import CategorySubcategoryGrid from "@/components/landing/category-subcategory-grid"
import Reveal from "@/components/landing/reveal"
import LandingShowcaseGrid from "@/components/landing/landing-showcase-grid"
import LandingCtaBand from "@/components/landing/landing-cta-band"
import { ScrollToTop } from "@/components/scroll-to-top"

const SITE_URL = getSiteUrl()
const BROWSE_HREF = "/category/mockups"
// Marketing display figures — intentionally rounded/inflated, NOT the live catalogue counts.
const MOCKUP_COUNT = "8,000+"
const CATEGORY_COUNT = "45+"
const PAGE_TITLE = "Mockup Templates — Editable PSD Scenes for Branding & Product Presentation | Brandex"
const PAGE_DESC =
  "Browse premium mockup templates for packaging, products, labels, and brand presentations. Fully editable high-resolution PSD scenes with smart objects and commercial licensing."

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: [
    "mockup templates",
    "psd mockup",
    "product mockups",
    "packaging mockups",
    "branding mockup scene",
    "smart object mockup",
    "high resolution mockup",
    "commercial mockup license",
    "Brandex mockups",
  ],
  alternates: { canonical: `${SITE_URL}/mockups` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/mockups`,
    siteName: "Brandex",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
}

const VALUE_PROPS = [
  { icon: Download, title: "Instant download", desc: "Get your source files immediately and start presenting fast." },
  { icon: BadgeCheck, title: "Commercial license", desc: "Use each mockup in client, brand, and commercial projects." },
  { icon: Ruler, title: "High resolution", desc: "Sharp, presentation-ready visuals with realistic detail and depth." },
  { icon: Layers, title: "Smart objects", desc: "Layered PSD files built for quick edits and clean customization." },
]

export default async function MockupsLandingPage() {
  const categoryId = categoryParamToId("mockups")

  const [newest, subcategories] = await Promise.all([
    getProducts({ categoryId, sortBy: "newest", limit: 14 }),
    getSubcategories(categoryId),
  ])

  type P = (typeof newest.products)[number]
  const hasImage = (p: P) => Array.isArray(p.images) && p.images.some((img) => img?.url)
  const firstImage = (p: P, width: number) =>
    getDisplayImageUrl(p.images.find((i) => i?.url)?.url, Number(p.price) === 0, {
      width,
      quality: 72,
      useProxyForFree: true,
    })

  const withImage = newest.products.filter(hasImage)
  const heroImages = withImage.slice(0, 8).map((p) => ({ url: firstImage(p, 760), alt: p.name }))
  const showcase = withImage.slice(0, 8)
  const ctaImages = withImage.slice(0, 12).map((p) => ({ url: firstImage(p, 400), alt: p.name }))
  const marqueeItems = [...subcategories]
    .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))
    .slice(0, 24)

  // Top 10 subcategories, each with a representative product image.
  const top10 = [...subcategories]
    .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))
    .slice(0, 10)
  const reps = await Promise.all(
    top10.map((s) => getProducts({ categoryId, subcategoryId: s.id, limit: 1, sortBy: "mostPopular" }))
  )
  const topSubcats = top10.map((s, i) => {
    const p = reps[i].products.find(hasImage)
    return { ...s, image: p ? firstImage(p, 560) : null }
  })

  // ── Structured data ──
  const breadcrumb = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_URL },
    { name: "Mockups", url: `${SITE_URL}/mockups` },
  ])
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mockup Templates",
    description: PAGE_DESC,
    url: `${SITE_URL}/mockups`,
    isPartOf: { "@type": "WebSite", name: "Brandex", url: SITE_URL },
    about: { "@type": "Thing", name: "Mockup templates" },
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-16 dark:bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />

      {/* Hero */}
      <CategoryLandingHero
        eyebrow="Mockup Templates"
        titleLead="Mockup scenes,"
        titleAccent="ready to present."
        subtitle="Premium and free mockup templates, all in one place. From product shots to branded packaging previews, every Brandex mockup is built with editable smart objects and clean layered files. Drop in your design and deliver polished visuals in minutes."
        browseHref={BROWSE_HREF}
        browseLabel={`Browse ${MOCKUP_COUNT} mockups`}
        secondaryHref="#categories"
        secondaryLabel="Explore categories"
        badges={["Editable smart objects", "High-resolution assets", "Commercial license"]}
        stats={[
          { value: MOCKUP_COUNT, label: "Mockups" },
          { value: CATEGORY_COUNT, label: "Categories" },
          { value: "PSD Ready", label: "Source files" },
        ]}
        images={heroImages}
      />

      {/* Category marquee */}
      <div className="mt-2">
        <CategoryMarquee items={marqueeItems} hrefBase={BROWSE_HREF} />
      </div>

      {/* Shop by category */}
      <section id="categories" className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 pt-16 sm:px-6">
        <Reveal>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Shop by category</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Top {topSubcats.length} of {CATEGORY_COUNT} categories.</p>
            </div>
            <Link
              href={BROWSE_HREF}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <CategorySubcategoryGrid subcategories={topSubcats} hrefBase={BROWSE_HREF} />
        </Reveal>
      </section>

      {/* Just added */}
      {showcase.length > 0 && (
        <section className="mx-auto w-full max-w-[1320px] px-4 pt-16 sm:px-6">
          <Reveal>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Just added</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Fresh mockup scenes, ready for your next presentation.</p>
              </div>
              <Link
                href={BROWSE_HREF}
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
              >
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <LandingShowcaseGrid products={showcase} />
          </Reveal>
        </section>
      )}

      {/* Value props */}
      <section className="mx-auto w-full max-w-[1320px] px-4 pt-16 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="rounded-2xl border border-border/70 bg-background p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </Reveal>
      </section>

      {/* About / SEO copy */}
      <section className="mx-auto w-full max-w-[1320px] px-4 pt-16 sm:px-6">
        <Reveal>
          <div className="grid gap-8 rounded-3xl border border-border/60 bg-background p-8 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Mockup templates built for faster presentations
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Brandex includes {MOCKUP_COUNT} professionally crafted mockup templates across {CATEGORY_COUNT} categories.
                Whether you are presenting packaging, product labels, or full brand visuals, each scene is designed to make
                your work look production-ready with minimal setup.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every mockup ships with editable smart objects, organized layers, and high-resolution files so you can
                replace artwork quickly and export polished previews for clients, ads, and launch decks.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "High-resolution mockup scenes",
                "Editable smart object layers",
                "Layered PSD source files",
                "Realistic lighting and shadows",
                "Commercial license on every download",
                "New scenes added every week",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl bg-[#F6F6F6] px-4 py-3.5 text-sm font-medium text-foreground/80 dark:bg-muted/30"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* CTA band */}
      <section className="mx-auto w-full max-w-[1320px] px-4 pt-16 sm:px-6">
        <Reveal>
          <LandingCtaBand
            title="Find your next mockup template"
            subtitle={`${MOCKUP_COUNT} editable mockups across ${CATEGORY_COUNT} categories.`}
            href={BROWSE_HREF}
            label="Browse the full mockup library"
            images={ctaImages}
          />
        </Reveal>
      </section>

      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </main>
  )
}
