"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(() => [
    { id: "digital-products-only", title: "1. Digital Products Only" },
    { id: "general-refund-rule", title: "2. General Refund Rule" },
    { id: "limited-exceptions", title: "3. When We May Approve a Refund" },
    { id: "credits", title: "4. Credits" },
    { id: "how-to-request", title: "5. How to Request a Refund" },
    { id: "review-window", title: "6. Refund Review Window" },
    { id: "chargebacks", title: "7. Chargebacks" },
    { id: "legal-rights", title: "8. Legal Rights" },
    { id: "contact", title: "9. Contact" },
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

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      })
    }
  }

  const handlePrint = () => window.print()
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Brandex LLC Refund Policy (brandexme.com)</h1>
          <p className="text-muted-foreground mt-2">Effective Date: 2/23/2026</p>
          <p className="text-muted-foreground">Last Updated: 2/23/2026</p>
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
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Policy</span>
                </Button>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <Card className="p-6 md:p-8">
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg">
                  This Refund Policy explains how refunds work for purchases made on brandexme.com, operated by Brandex LLC (&quot;Brandex LLC,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p>By making a purchase, you agree to this Refund Policy in addition to our Terms of Service.</p>

                {/* Section 1 */}
                <h2 id="digital-products-only" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1) Digital Products Only
                </h2>
                <p>Brandex LLC sells digital products and digital downloads only through brandexme.com. We do not ship physical goods.</p>
                <p>Because digital products can be accessed immediately after purchase, all sales are generally final once access is granted, except where required by law or explicitly stated below.</p>

                {/* Section 2 */}
                <h2 id="general-refund-rule" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2) General Refund Rule
                </h2>
                <p>No refunds are issued for:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>change of mind</li>
                  <li>accidental purchase (unless it qualifies as a duplicate purchase—see below)</li>
                  <li>inability to use the product due to incompatible software/hardware</li>
                  <li>lack of internet access or technical limitations on the customer&apos;s side</li>
                  <li>failure to understand the product description before purchase</li>
                </ul>

                {/* Section 3 */}
                <h2 id="limited-exceptions" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3) When We May Approve a Refund (Limited Exceptions)
                </h2>
                <p>We may approve a refund, at our discretion, in limited situations such as:</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">A) Duplicate Purchase</h3>
                <p>If you were charged more than once for the same product in the same timeframe (or purchased the same product twice by mistake), we may refund the duplicate charge.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">B) Technical Failure to Deliver Access</h3>
                <p>If you paid but did not receive access to the digital product due to a verified technical error on our side, we will work to resolve it.</p>
                <p>If we cannot restore access within a reasonable time, we may issue a refund.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">C) Unauthorized Transactions</h3>
                <p>If you believe a purchase was unauthorized, contact us immediately. We may request information to investigate and may suspend access during review.</p>

                {/* Section 4 */}
                <h2 id="credits" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4) Credits (If You Purchase Credit Packs)
                </h2>
                <p>If brandexme.com offers credit packs or credit-based access:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Credits have no cash value and are non-transferable.</li>
                  <li>Unused credits are non-refundable, except where required by law.</li>
                  <li>If credits were added due to a verified billing error on our side, we may correct the balance or issue a refund, depending on the situation.</li>
                </ul>

                {/* Section 5 */}
                <h2 id="how-to-request" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5) How to Request a Refund
                </h2>
                <p>To request a refund review, email <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a> with:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Subject line: &quot;Refund Request&quot;</li>
                    <li>The email used on your account</li>
                    <li>Order date and product name</li>
                    <li>A clear explanation of the issue</li>
                    <li>Any relevant screenshots (if applicable)</li>
                  </ul>
                </div>

                {/* Section 6 */}
                <h2 id="review-window" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6) Refund Review Window
                </h2>
                <p>Refund requests must be submitted within <strong>7 days</strong> of purchase unless otherwise required by law.</p>
                <p>If approved, refunds are issued to the original payment method. Processing times depend on your bank/payment provider.</p>

                {/* Section 7 */}
                <h2 id="chargebacks" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  7) Chargebacks
                </h2>
                <p>If you file a chargeback without contacting us first, we may:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>suspend your account, and/or</li>
                  <li>restrict access to downloads and services during investigation.</li>
                </ul>

                {/* Section 8 */}
                <h2 id="legal-rights" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  8) Legal Rights
                </h2>
                <p>Nothing in this Refund Policy limits any consumer rights you may have under applicable law. If local law provides mandatory refund or withdrawal rights, those rights apply.</p>

                {/* Section 9 */}
                <h2 id="contact" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  9) Contact
                </h2>
                <p>Questions about refunds? Contact:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Brandex LLC</strong>
                    <br />
                    Granger, Indiana, United States
                    <br />
                    <strong>Email:</strong>{" "}
                    <a href="mailto:team@brandexme.com" className="text-primary hover:underline">
                      team@brandexme.com
                    </a>
                  </p>
                </div>
              </div>

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
                  className={`print:hidden transition-opacity duration-300 ${showBackToTop ? 'opacity-100' : 'opacity-0'}`}
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
