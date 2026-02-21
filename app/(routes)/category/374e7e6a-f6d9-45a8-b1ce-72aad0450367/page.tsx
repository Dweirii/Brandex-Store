import { Metadata } from "next"
import Link from "next/link"
import getCategories from "@/actions/get-categories"
import Container from "@/components/ui/container"
import CategoryNav from "@/components/category-nav"
import { ScrollToTop } from "@/components/scroll-to-top"
import { generateBreadcrumbStructuredData, getSiteUrl } from "@/lib/seo"

const CATEGORY_ID = "374e7e6a-f6d9-45a8-b1ce-72aad0450367"
const CATEGORY_NAME = "Signature Services"
const CATEGORY_URL = `/category/${CATEGORY_ID}`

export const metadata: Metadata = {
  title: "Signature Services | Brandex",
  description:
    "Custom packaging design, logos, mockups, and print-ready files. Your all-in-one design studio for brands that need premium results, clean files, and press-ready delivery.",
  keywords:
    "signature services, custom packaging design, logo design, brand kit, mockups, pre-print setup, print-ready files, dieline, Brandex",
  openGraph: {
    title: "Signature Services | Brandex",
    description:
      "Custom packaging design, logos, mockups, and print-ready files. Design + Pre-Print, Done Right.",
    url: `https://brandexme.com${CATEGORY_URL}`,
    siteName: "Brandex",
    images: [{ url: "https://brandexme.com/Logo.png", width: 1200, height: 630, alt: "Brandex Signature Services" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signature Services | Brandex",
    description: "Custom packaging design, logos, mockups, and print-ready files.",
    images: ["https://brandexme.com/Logo.png"],
  },
  alternates: {
    canonical: `https://brandexme.com${CATEGORY_URL}`,
  },
}

export default async function SignatureServicesPage() {
  const [categories] = await Promise.all([getCategories()])

  const siteUrl = getSiteUrl()
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: siteUrl },
    { name: CATEGORY_NAME, url: `${siteUrl}${CATEGORY_URL}` },
  ])

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="min-h-screen py-6 sm:py-8">
        {/* Category Nav */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <CategoryNav categories={categories} />
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-[980px] mx-auto font-sans text-[#111]">

            {/* ── HERO HEADER ────────────────────────────────────── */}
            <header className="text-center py-10 pb-5">
              <span className="inline-block px-3 py-1.5 rounded-full bg-[#00C853] text-[#0b1a10] font-black text-[13px] tracking-[0.35px] uppercase">
                Signature Services
              </span>

              <h1 className="mt-4 mb-3 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Design + Pre-Print, Done Right
              </h1>

              <p className="mx-auto max-w-[780px] text-lg text-[#333]">
                Signature Services is your all-in-one custom design studio for brands that need packaging, logos,
                mockups, and print-ready files that look premium and come out clean on press.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl bg-[#00C853] text-[#0b1a10] font-black text-sm no-underline transition-opacity hover:opacity-90"
                >
                  Start a Signature Project
                </Link>
                <Link
                  href="/book"
                  className="px-6 py-3.5 rounded-xl border-2 border-[#111] text-[#111] font-extrabold text-sm no-underline transition-colors hover:bg-muted/30"
                >
                  Book a Quick Call
                </Link>
              </div>

              <p className="mt-4 text-sm text-[#666]">
                Fast communication • Clean files • Real packaging-ready results
              </p>
            </header>

            <hr className="border-t border-[#e6e6e6] my-5" />

            {/* ── WHAT WE BUILD ───────────────────────────────────── */}
            <section className="mt-5">
              <h2 className="text-2xl font-black mb-3 flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                What We Build
              </h2>

              <p className="text-[#333] mb-4">
                Whether you&apos;re launching something new or leveling up your current look, we create custom visuals
                that are made to sell and made to print. You get strong design, clean layouts, and production-ready
                files—no messy handoffs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "Custom Packaging Design",
                    desc: "Boxes, labels, pouches, bottle wraps, sleeves, inserts—built for shelf impact.",
                  },
                  {
                    title: "Logo + Brand Design",
                    desc: "Clean, modern logos and brand kits that stay consistent everywhere you show up.",
                  },
                  {
                    title: "Mockups + Product Previews",
                    desc: "Professional mockups for websites, ads, presentations, and launch content.",
                  },
                  {
                    title: "Pre-Print Setup",
                    desc: "Print-ready files with the right specs: bleed, safe areas, dielines, and export formats.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="border border-[#e6e6e6] rounded-2xl p-4 bg-white"
                  >
                    <h3 className="text-[18px] font-black mb-1.5">{title}</h3>
                    <p className="text-[#333] m-0">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── WHAT'S INCLUDED ─────────────────────────────────── */}
            <section className="mt-6">
              <h2 className="text-2xl font-black mb-3 flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                What&apos;s Included
              </h2>

              <ul className="list-disc pl-5 space-y-2 text-[#333]">
                <li>
                  <strong>Custom concept + layout:</strong> made for your product and your audience
                </li>
                <li>
                  <strong>Dieline alignment:</strong> clean placement, folds, flaps, and cut lines (when provided)
                </li>
                <li>
                  <strong>Print-ready exports:</strong> packaged files in the formats your printer requests
                </li>
                <li>
                  <strong>Mockups:</strong> realistic previews for online listings and marketing
                </li>
                <li>
                  <strong>Logo/branding support:</strong> matching your packaging and visuals for a consistent look
                </li>
                <li>
                  <strong>Organized delivery:</strong> clear folders and labeled files so nothing gets lost
                </li>
              </ul>
            </section>

            {/* ── HOW IT WORKS ────────────────────────────────────── */}
            <section className="mt-6">
              <h2 className="text-2xl font-black mb-3 flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                How It Works
              </h2>

              <ol className="list-decimal pl-5 space-y-2 text-[#333]">
                <li>
                  <strong>Send details:</strong> product info, sizes, copy, and any packaging template/dieline (if you
                  have one).
                </li>
                <li>
                  <strong>We design:</strong> we build the look, layout, and brand direction to match your goals.
                </li>
                <li>
                  <strong>We refine:</strong> you review, we polish, and we lock in the final version.
                </li>
                <li>
                  <strong>Pre-print handoff:</strong> you receive press-ready files + mockups for marketing.
                </li>
              </ol>
            </section>

            {/* ── CTA BANNER ──────────────────────────────────────── */}
            <section className="mt-8 p-5 border border-[#e6e6e6] rounded-2xl bg-linear-to-b from-[rgba(0,200,83,0.12)] to-[rgba(0,200,83,0)]">
              <h2 className="text-[22px] font-black mb-2">Ready to Build Something Clean?</h2>
              <p className="text-[#333] mb-4">
                Tell us what you need: packaging type, dimensions, and the vibe you&apos;re going for. We&apos;ll take
                it from idea to print-ready.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl bg-[#00C853] text-[#0b1a10] font-black text-sm no-underline transition-opacity hover:opacity-90"
                >
                  Get Started
                </Link>
                <Link
                  href="/services"
                  className="px-6 py-3.5 rounded-xl border-2 border-[#111] text-[#111] font-extrabold text-sm no-underline transition-colors hover:bg-muted/30"
                >
                  View All Services
                </Link>
              </div>

              <p className="mt-3 text-center text-[#666] text-sm">
                Need a rush? Add your deadline in the message and we&apos;ll reply with options.
              </p>
            </section>

            {/* ── INTAKE FORM ─────────────────────────────────────── */}
            <section className="mt-10">
              <header className="text-center pb-5">
                <span className="inline-block px-3 py-1.5 rounded-full bg-[#00C853] text-[#0b1a10] font-black text-[13px] tracking-[0.35px] uppercase">
                  Signature Project Intake
                </span>
                <h2 className="mt-4 mb-2 text-3xl sm:text-4xl font-black tracking-tight">
                  Let&apos;s Get Your Project Started
                </h2>
                <p className="mx-auto max-w-[780px] text-base text-[#333]">
                  Fill this out with as much detail as you can. The more we know upfront, the faster we can design
                  clean, print-ready results.
                </p>
              </header>

              <hr className="border-t border-[#e6e6e6] my-5" />

              <form className="space-y-6">

                {/* CONTACT */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Contact
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "name", label: "Full Name", type: "text" },
                      { id: "email", label: "Email", type: "email" },
                      { id: "phone", label: "Phone (optional)", type: "tel" },
                      { id: "company", label: "Company / Brand", type: "text" },
                    ].map(({ id, label, type }) => (
                      <div key={id} className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                        <label htmlFor={id} className="block font-black mb-2 text-sm">
                          {label}
                        </label>
                        <input
                          id={id}
                          name={id}
                          type={type}
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* WHAT DO YOU NEED */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    What do you need?
                  </legend>
                  <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white space-y-4">
                    <p className="text-[#333] text-sm">Select all that apply:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: "svc_packaging",
                          label: "Custom Packaging Design",
                          sub: "Boxes, labels, pouches, wraps, sleeves, inserts",
                        },
                        {
                          id: "svc_logo",
                          label: "Logo + Brand Design",
                          sub: "Logo refresh or full brand kit and business stationary",
                        },
                        {
                          id: "svc_mockups",
                          label: "Mockups + Product Previews",
                          sub: "Website, ads, pitch decks, launch content",
                        },
                        {
                          id: "svc_preprint",
                          label: "Pre-Print Setup",
                          sub: "Bleed, safe areas, dielines, print-ready exports",
                        },
                      ].map(({ id, label, sub }) => (
                        <label
                          key={id}
                          htmlFor={id}
                          className="flex items-start gap-3 border border-[#e6e6e6] rounded-2xl p-4 bg-white cursor-pointer hover:border-[#00C853] transition-colors"
                        >
                          <input id={id} name={id} type="checkbox" className="mt-1 accent-[#00C853]" />
                          <div>
                            <div className="font-black text-sm">{label}</div>
                            <div className="text-[#666] text-xs mt-0.5">{sub}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="primary_goal" className="block font-black mb-2 text-sm">
                        Main goal (in one sentence)
                      </label>
                      <input
                        id="primary_goal"
                        name="primary_goal"
                        type="text"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* PROJECT DETAILS */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Project Details
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "product_type", label: "Product type", placeholder: "e.g. supplement bottle, candle box" },
                      { id: "deliverables", label: "Deliverables needed", placeholder: "e.g. label, box, mockup" },
                      { id: "quantity_skus", label: "How many SKUs/versions?", placeholder: "e.g. 3 flavors" },
                      { id: "vibe", label: "Style / vibe", placeholder: "e.g. minimal, bold, earthy" },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id} className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                        <label htmlFor={id} className="block font-black mb-2 text-sm">
                          {label}
                        </label>
                        <input
                          id={id}
                          name={id}
                          type="text"
                          placeholder={placeholder}
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                    <label htmlFor="notes" className="block font-black mb-2 text-sm">
                      Anything we should know?
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={5}
                      className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors resize-none"
                    />
                  </div>
                </fieldset>

                {/* PRINT + SIZE SPECS */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Print + Size Specs
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="dimensions" className="block font-black mb-2 text-sm">
                        Dimensions
                      </label>
                      <input
                        id="dimensions"
                        name="dimensions"
                        type="text"
                        placeholder="e.g. 4×6 in, 100×150 mm"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                      />
                      <p className="mt-2 text-[#666] text-xs">
                        If you don&apos;t know, tell us the container/product and we&apos;ll guide it.
                      </p>
                    </div>
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="printer" className="block font-black mb-2 text-sm">
                        Printer / vendor (if known)
                      </label>
                      <input
                        id="printer"
                        name="printer"
                        type="text"
                        placeholder="e.g. Printingforless, local shop"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                      />
                    </div>
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="finishes" className="block font-black mb-2 text-sm">
                        Finishes (optional)
                      </label>
                      <input
                        id="finishes"
                        name="finishes"
                        type="text"
                        placeholder="e.g. matte laminate, UV spot, foil"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                      />
                    </div>
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="dieline" className="block font-black mb-2 text-sm">
                        Dieline / template (if you have it)
                      </label>
                      <input
                        id="dieline"
                        name="dieline"
                        type="url"
                        placeholder="Link to file (Dropbox, Drive, etc.)"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                      />
                      <p className="mt-2 text-[#666] text-xs">Upload PDF/AI files if available.</p>
                    </div>
                  </div>
                </fieldset>

                {/* BRAND ASSETS */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Brand Assets
                  </legend>
                  <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white space-y-4">
                    <p className="text-[#333] text-sm">Upload anything you have (logos, fonts, references, copy, images):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="brand_colors" className="block font-black mb-2 text-sm">
                          Brand colors (if known)
                        </label>
                        <input
                          id="brand_colors"
                          name="brand_colors"
                          type="text"
                          placeholder="e.g. #00C853, navy, gold"
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                        />
                      </div>
                      <div>
                        <label htmlFor="fonts" className="block font-black mb-2 text-sm">
                          Fonts (if known)
                        </label>
                        <input
                          id="fonts"
                          name="fonts"
                          type="text"
                          placeholder="e.g. Montserrat, Helvetica"
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="references" className="block font-black mb-2 text-sm">
                        Reference links (optional)
                      </label>
                      <textarea
                        id="references"
                        name="references"
                        rows={3}
                        placeholder="Links to inspiration, competitors, or existing brand assets"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors resize-none placeholder:text-[#aaa]"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* TIMELINE + BUDGET */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Timeline + Budget
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="deadline" className="block font-black mb-2 text-sm">
                        Target deadline
                      </label>
                      <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors"
                      />
                      <p className="mt-2 text-[#666] text-xs">If you have a hard date, add it here.</p>
                    </div>
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="budget" className="block font-black mb-2 text-sm">
                        Budget range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors bg-white"
                      >
                        <option value="">Select one</option>
                        <option>Under $500</option>
                        <option>$500–$1,000</option>
                        <option>$1,000–$2,500</option>
                        <option>$2,500–$5,000</option>
                        <option>$5,000+</option>
                      </select>
                    </div>
                    <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white">
                      <label htmlFor="rush" className="block font-black mb-2 text-sm">
                        Rush needed?
                      </label>
                      <select
                        id="rush"
                        name="rush"
                        className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors bg-white"
                      >
                        <option value="">Select one</option>
                        <option>No</option>
                        <option>Yes (mild rush)</option>
                        <option>Yes (urgent)</option>
                      </select>
                      <p className="mt-2 text-[#666] text-xs">If yes, include details in your notes above.</p>
                    </div>
                  </div>
                </fieldset>

                {/* FINAL FILES + APPROVALS */}
                <fieldset className="space-y-3">
                  <legend className="text-[22px] font-black flex items-center gap-2.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853] shrink-0" />
                    Final Files + Approvals
                  </legend>
                  <div className="border border-[#e6e6e6] rounded-2xl p-4 bg-white space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="file_formats" className="block font-black mb-2 text-sm">
                          Preferred file formats
                        </label>
                        <input
                          id="file_formats"
                          name="file_formats"
                          type="text"
                          placeholder="e.g. PDF, AI, PNG, PSD"
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                        />
                      </div>
                      <div>
                        <label htmlFor="approver" className="block font-black mb-2 text-sm">
                          Who approves final?
                        </label>
                        <input
                          id="approver"
                          name="approver"
                          type="text"
                          placeholder="Name or role"
                          className="w-full px-3 py-2.5 border border-[#ddd] rounded-xl text-sm outline-none focus:border-[#00C853] transition-colors placeholder:text-[#aaa]"
                        />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="confirm" className="mt-1 accent-[#00C853]" required />
                      <span className="text-sm text-[#333]">
                        <strong>I confirm:</strong> I&apos;ve provided the best available copy/claims and I&apos;m
                        responsible for final content approval.
                      </span>
                    </label>
                  </div>
                </fieldset>

                {/* SUBMIT */}
                <div className="p-5 border border-[#e6e6e6] rounded-2xl bg-linear-to-b from-[rgba(0,200,83,0.12)] to-[rgba(0,200,83,0)]">
                  <h3 className="text-[22px] font-black mb-2">Submit Intake</h3>
                  <p className="text-[#333] text-sm mb-4">
                    Once submitted, we&apos;ll review and reply with next steps.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-xl bg-[#00C853] text-[#0b1a10] font-black text-sm border-none cursor-pointer transition-opacity hover:opacity-90"
                    >
                      Send Intake Form
                    </button>
                    <Link
                      href="/book"
                      className="px-6 py-3.5 rounded-xl border-2 border-[#111] text-[#111] font-extrabold text-sm no-underline transition-colors hover:bg-muted/30"
                    >
                      Prefer a Quick Call?
                    </Link>
                  </div>
                  <p className="mt-3 text-center text-[#666] text-xs">
                    Tip: If you have a dieline/template, upload it above for the fastest start.
                  </p>
                </div>
              </form>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────── */}
            <footer className="text-center mt-8 pb-4 text-[#666] text-sm">
              <p className="flex items-center justify-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#00C853]" />
                brandexme.COM — Signature Services
              </p>
            </footer>

          </div>
        </div>
      </div>

      <ScrollToTop />
    </Container>
  )
}
