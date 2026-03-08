"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

export default function LicensingPage() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(() => [
    { id: "scope",        title: "1. License Scope" },
    { id: "permitted",    title: "2. Permitted Uses" },
    { id: "restrictions", title: "3. Restrictions" },
    { id: "client",       title: "4. Client Work" },
    { id: "digital",      title: "5. Digital Asset Products" },
    { id: "ownership",    title: "6. Ownership" },
    { id: "questions",    title: "7. Questions" },
  ], [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)

      const currentSection = sections.find(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })

      if (currentSection) setActiveSection(currentSection.id)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" })
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Licensing
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Table of Contents */}
          <aside className="lg:w-1/4 print:hidden">
            <Card className="p-4 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted ${
                      activeSection === section.id ? "bg-muted font-medium" : ""
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                  <span>Print License</span>
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium">Related Policies</h3>
                <Link
                  href="/terms-of-service"
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Terms of Service</span>
                </Link>
                <Link
                  href="/refund-policy"
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Refund Policy</span>
                </Link>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <Card className="p-6 md:p-8">
              <div className="prose prose-gray max-w-none dark:prose-invert">

                <p className="text-lg">
                  All digital assets available on Brandex are provided under a standard
                  commercial license unless otherwise stated.
                </p>
                <p>
                  When you purchase or download an asset from Brandex, you are granted a
                  non-exclusive license to use the asset in personal and commercial projects
                  in accordance with the terms outlined below.
                </p>
                <p>
                  This license allows designers, marketers, businesses, and agencies to use
                  Brandex assets in their own creative work.
                </p>

                {/* Section 1 */}
                <h2 id="scope" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1) License Scope
                </h2>
                <p>
                  Each purchase grants a license for one end product, campaign, or client
                  project. A separate license is required for each additional use.
                </p>

                {/* Section 2 */}
                <h2 id="permitted" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2) Permitted Uses
                </h2>
                <p>Brandex assets may be used for:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Marketing and advertising materials</li>
                  <li>Websites and digital content</li>
                  <li>Social media graphics</li>
                  <li>Presentations and portfolios</li>
                  <li>Client projects</li>
                  <li>Product previews and visual mockups</li>
                </ul>
                <p>
                  Assets may be modified, customized, and incorporated into your own designs.
                </p>

                {/* Section 3 */}
                <h2 id="restrictions" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3) Restrictions
                </h2>
                <p>Brandex assets may not be:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Resold or redistributed as standalone files</li>
                  <li>Shared, transferred, or sublicensed to others</li>
                  <li>Uploaded to stock marketplaces or asset libraries</li>
                  <li>
                    Included in digital products where the asset itself is the primary value
                  </li>
                </ul>
                <p>You may not claim Brandex assets as your own original work.</p>

                {/* Section 4 */}
                <h2 id="client" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4) Client Work
                </h2>
                <p>
                  Brandex assets may be used in projects created for clients. However, the
                  original asset files may not be transferred or distributed as standalone
                  downloads.
                </p>

                {/* Section 5 */}
                <h2 id="digital" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5) Digital Asset Products
                </h2>
                <p>
                  Brandex assets may not be used to create competing digital products,
                  including mockups, templates, or other downloadable design resources
                  intended for resale.
                </p>

                {/* Section 6 */}
                <h2 id="ownership" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6) Ownership
                </h2>
                <p>
                  All assets remain the intellectual property of Brandex. Purchasing or
                  downloading an asset grants a license to use the asset but does not
                  transfer ownership.
                </p>

                {/* Section 7 */}
                <h2 id="questions" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  7) Questions
                </h2>
                <p>
                  If you have questions about licensing or usage, please contact Brandex
                  before using the asset in your project.
                </p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Brandex LLC</strong>
                    <br />
                    Granger, Indiana, United States
                    <br />
                    <a
                      href="mailto:team@brandexme.com"
                      className="text-primary hover:underline"
                    >
                      team@brandexme.com
                    </a>
                  </p>
                </div>

              </div>

              {/* Footer row */}
              <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                <Link
                  href="/"
                  className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>

                <Button
                  onClick={scrollToTop}
                  className={`print:hidden transition-opacity duration-300 ${
                    showBackToTop ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Back to top
                </Button>
              </div>
            </Card>
          </main>

        </div>
      </div>
    </div>
  )
}
