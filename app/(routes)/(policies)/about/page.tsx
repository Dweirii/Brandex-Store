"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, Layers, Package, Sparkles, Play, PenLine } from "lucide-react"
import { Button } from "@/components/ui/Button"

const CATEGORIES = [
  { icon: Layers, label: "Mockups", desc: "Smart-object PSD scenes", href: "/category/mockups" },
  { icon: Package, label: "Packaging", desc: "Print-ready templates with dielines", href: "/category/packaging" },
  { icon: Sparkles, label: "Graphics", desc: "Images, vectors & PSD assets", href: "/category/graphics" },
  { icon: Play, label: "Motion", desc: "Ready-to-drop video elements", href: "/category/motion-library" },
]

const SECTIONS = [
  {
    id: "what-we-offer",
    title: "What We Offer",
    body: "Brandex offers a curated collection of premium digital assets across essential creative categories, including mockups, packaging, graphics, and motion content. Each resource is created to support high-level visual work across marketing, advertising, brand presentations, digital content, and client-facing materials.\n\nAlongside our ready-made asset library, Brandex also provides custom project work for select projects requiring a more tailored creative direction.",
  },
  {
    id: "who-its-for",
    title: "Who It's For",
    body: "Brandex is built for designers, marketers, agencies, businesses, and creators who expect more from the visual tools they use. Our platform serves those who value quality, presentation, and efficiency — and who need assets that feel as refined as the work they produce.",
  },
  {
    id: "why-brandex",
    title: "Why Brandex",
    body: "Brandex is guided by a simple standard: creative assets should feel premium in both form and function. Every collection is built with attention to visual refinement, flexibility, and professional use, making it easier to create work that feels elevated, cohesive, and brand-ready from the start.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Hero header */}
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            About Brandex
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
            Brandex creates premium digital design assets for brands, businesses, creators, and agencies that value elevated presentation and refined visual quality. Designed for modern creative work, our growing library features mockups, packaging assets, graphics, and motion content crafted to bring a more polished, sophisticated finish to every project.
          </p>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
            Every asset is developed with a focus on clarity, detail, and usability — balancing strong visual impact with practical, real-world application. Whether supporting a product launch, shaping a campaign, enhancing branded content, or strengthening a presentation, Brandex is built to deliver design resources that feel considered, professional, and visually distinctive.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {CATEGORIES.map(({ icon: Icon, label, desc, href }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Content sections */}
        <div className="space-y-4 mb-12">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-border bg-card px-6 py-5"
            >
              <h2 className="text-sm font-bold text-foreground mb-3">{section.title}</h2>
              {section.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground mb-1">Explore Brandex</h2>
              <p className="text-sm text-muted-foreground">
                Discover premium assets designed for modern creative work, or connect with Brandex for custom design support.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-primary hover:bg-logogreen-600 text-white font-semibold h-9 px-5 text-sm rounded-lg"
              >
                <Link href="/">
                  Browse Assets
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 px-4 text-sm rounded-lg"
              >
                <Link href="/intake">
                  <PenLine className="w-3.5 h-3.5 mr-1.5" />
                  Request a Custom Project
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
