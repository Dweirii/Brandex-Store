"use client"

import Link from "next/link"
import {
  ArrowLeft,
  HelpCircle,
  Coins,
  Download,
  Shield,
  FileType,
  Wrench,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FAQItem {
  id: string
  question: string
  answer: React.ReactNode
}

interface FAQSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: FAQItem[]
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    id: "basics",
    label: "The Basics",
    icon: HelpCircle,
    items: [
      {
        id: "what-is-brandex",
        question: "What is brandexme.com?",
        answer: (
          <p>
            brandexme.com is a library of premium creative assets — mockups,
            graphics (images, vectors, PSD), packaging, and motion — ready to
            download and use in real projects.
          </p>
        ),
      },
    ],
  },
  {
    id: "credits",
    label: "Credits & Pricing",
    icon: Coins,
    items: [
      {
        id: "how-credits-work",
        question: "How do credits work?",
        answer: (
          <p>
            Credits are how you download premium assets. You buy a credit pack,
            then use credits at checkout when downloading.
          </p>
        ),
      },
      {
        id: "credits-cost",
        question: "How many credits does a premium download cost?",
        answer: <p>All premium assets cost <strong>5 credits</strong> per download.</p>,
      },
      {
        id: "free-assets",
        question: "Do you have free assets?",
        answer: (
          <p>
            Yes. Some assets are free and will show a{" "}
            <strong>Free Download</strong> button — no credits needed.
          </p>
        ),
      },
      {
        id: "credits-expire",
        question: "Do credits expire?",
        answer: (
          <p>
            No. Your credits stay in your account until you use them.
          </p>
        ),
      },
    ],
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: Download,
    items: [
      {
        id: "redownload",
        question: "Can I re-download an asset later?",
        answer: (
          <p>
            Yes. Re-downloads are free anytime from{" "}
            <Link href="/downloads" className="text-primary hover:underline font-medium">
              My Downloads
            </Link>
            .
          </p>
        ),
      },
      {
        id: "find-downloads",
        question: "Where do I find my downloads?",
        answer: (
          <p>
            Go to{" "}
            <Link href="/downloads" className="text-primary hover:underline font-medium">
              My Downloads
            </Link>{" "}
            to access everything you&apos;ve downloaded.
          </p>
        ),
      },
    ],
  },
  {
    id: "license",
    label: "License & Usage",
    icon: Shield,
    items: [
      {
        id: "what-license",
        question: "What license is included?",
        answer: (
          <p>
            A commercial license is included with every download, so you can use
            assets in commercial and client work.
          </p>
        ),
      },
      {
        id: "client-work",
        question: "Can I use assets for client work and paid projects?",
        answer: (
          <p>
            Yes. You can use assets for client projects, marketing, and
            commercial use under the included license.
          </p>
        ),
      },
    ],
  },
  {
    id: "file-types",
    label: "File Types",
    icon: FileType,
    items: [
      {
        id: "what-file-types",
        question: "What file types do you offer?",
        answer: (
          <ul className="space-y-1.5 mt-1">
            <li><strong>Images:</strong> JPG/JPEG and sometimes PNG</li>
            <li><strong>Vectors:</strong> SVG/AI/EPS (varies by item)</li>
            <li><strong>Mockups / PSD:</strong> PSD files, often with smart objects</li>
            <li><strong>Packaging:</strong> Print-ready template files (varies by item)</li>
            <li><strong>Motion:</strong> MP4/MOV (varies by item)</li>
          </ul>
        ),
      },
      {
        id: "need-photoshop",
        question: "Do I need Photoshop?",
        answer: (
          <p>
            Only for PSD and mockup files. Images, vectors, and motion files can
            be used in many different apps depending on the format.
          </p>
        ),
      },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    icon: Wrench,
    items: [
      {
        id: "download-fails",
        question: "What if my download fails or I see an error?",
        answer: (
          <p>
            Refresh the page and try again. If it still fails, contact us at{" "}
            <a
              href="mailto:team@brandexme.com"
              className="text-primary hover:underline font-medium"
            >
              team@brandexme.com
            </a>{" "}
            and include the product link and a screenshot of the error.
          </p>
        ),
      },
      {
        id: "refund",
        question: "Can I get a refund?",
        answer: (
          <p>
            Refunds depend on the situation and our{" "}
            <Link href="/refund-policy" className="text-primary hover:underline font-medium">
              Refund Policy
            </Link>
            . Please review that page for details.
          </p>
        ),
      },
    ],
  },
]

// ─── FAQ item — always visible ─────────────────────────────────────────────────

function FAQEntry({ item }: { item: FAQItem }) {
  return (
    <div className="border-b border-border last:border-0 py-4">
      <p className="text-sm font-semibold text-foreground mb-1.5">
        {item.question}
      </p>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {item.answer}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Help &amp; FAQ
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Quick answers to common questions about brandexme.com.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Sidebar — section nav */}
          <aside className="lg:w-56 shrink-0">
            <nav className="sticky top-20 space-y-0.5">
              {FAQ_SECTIONS.map((section) => {
                const Icon = section.icon
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {section.label}
                  </a>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-10">

            {FAQ_SECTIONS.map((section) => {
              const Icon = section.icon
              return (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  {/* Section heading */}
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <h2 className="text-base font-bold text-foreground">
                      {section.label}
                    </h2>
                  </div>

                  {/* Questions */}
                  <div className="rounded-xl border border-border bg-card px-5">
                    {section.items.map((item) => (
                      <FAQEntry key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })}

            {/* Still need help? */}
            <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground mb-1">
                    Still need help?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll
                    get back to you.
                  </p>
                  <Button
                    asChild
                    className="bg-primary hover:bg-logogreen-600 text-white font-semibold h-9 px-5 text-sm rounded-lg"
                  >
                    <a href="mailto:team@brandexme.com">
                      team@brandexme.com
                    </a>
                  </Button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
