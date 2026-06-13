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
const BROWSE_HREF = "/category/packaging"
// Marketing display figures — intentionally rounded/inflated, NOT the live catalogue counts.
const TEMPLATE_COUNT = "12,000+"
const CATEGORY_COUNT = "60+"
const PAGE_TITLE = "Packaging Design Templates, PSD Mockups & Product Branding Assets"
const PAGE_DESC =
  "Browse hundreds of print-ready packaging design templates — boxes, pouches, bottles, cans, labels and more across dozens of categories. Fully editable PSD, AI & EPS with accurate dielines and a commercial license. Instant download."

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: [
    "packaging design templates",
    "packaging mockups",
    "box packaging template",
    "pouch mockup",
    "bottle label template",
    "print-ready dieline",
    "editable PSD packaging",
    "AI EPS packaging",
    "food packaging design",
    "Brandex packaging",
  ],
  alternates: { canonical: `${SITE_URL}/packaging` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/packaging`,
    siteName: "Brandex",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
}

const VALUE_PROPS = [
  { icon: Download, title: "Instant download", desc: "Grab the source files the moment you need them — no waiting." },
  { icon: BadgeCheck, title: "Commercial license", desc: "Use every template in client and commercial projects." },
  { icon: Ruler, title: "Print-ready dielines", desc: "Accurate cut & fold guides at 300 DPI, built for production." },
  { icon: Layers, title: "Fully editable", desc: "Layered PSD / AI / EPS with smart objects — swap art in seconds." },
]

export default async function PackagingLandingPage() {
  const categoryId = categoryParamToId("packaging")

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
    { name: "Packaging", url: `${SITE_URL}/packaging` },
  ])
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Packaging Design Templates",
    description: PAGE_DESC,
    url: `${SITE_URL}/packaging`,
    isPartOf: { "@type": "WebSite", name: "Brandex", url: SITE_URL },
    about: { "@type": "Thing", name: "Packaging design templates" },
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-16 dark:bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />

      {/* Hero */}
      <CategoryLandingHero
        eyebrow="Packaging Templates"
        titleLead="Packaging design,"
        titleAccent="ready to brand."
        subtitle="Premium and free packaging templates, all in one place. From coffee bags to cosmetics, every Brandex packaging template ships print-ready with accurate dielines and editable PSD, AI & EPS files. Pick a design, drop in your brand, and send it straight to print."
        browseHref={BROWSE_HREF}
        browseLabel={`Browse ${TEMPLATE_COUNT} templates`}
        secondaryHref="#categories"
        secondaryLabel="Explore categories"
        badges={["Editable PSD · AI · EPS", "Print-ready dielines", "Commercial license"]}
        stats={[
          { value: TEMPLATE_COUNT, label: "Templates" },
          { value: CATEGORY_COUNT, label: "Categories" },
          { value: "300 DPI", label: "Print quality" },
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
                <p className="mt-1.5 text-sm text-muted-foreground">Fresh packaging templates, hot off the press.</p>
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
                Packaging templates built for speed
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Brandex is a library of {TEMPLATE_COUNT} professionally crafted packaging designs — spanning{" "}
                {CATEGORY_COUNT} categories from chocolate bars and coffee bags to cosmetics, beverages and
                pharmaceuticals. Every template is production-ready, so brands, designers and agencies can move from idea
                to shelf in hours, not weeks.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Each design ships as editable PSD, AI or EPS with smart objects and accurate dielines at 300 DPI. Swap in
                your logo, colours and copy, export, and send straight to your printer — with a commercial license
                included on everything.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Print-ready dielines with cut & fold guides",
                "Editable PSD, AI & EPS source files",
                "Smart objects for one-click branding",
                "300 DPI, CMYK-friendly artwork",
                "Commercial license on every download",
                "New designs added every week",
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
            title="Find your next packaging design"
            subtitle={`${TEMPLATE_COUNT} editable, print-ready templates across ${CATEGORY_COUNT} categories.`}
            href={BROWSE_HREF}
            label="Browse the full library"
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
