"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft, AlertCircle } from "lucide-react"
import  Button  from "@/components/ui/Button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Sections for the table of contents
  const sections = useMemo(() => [
    { id: "eligibility", title: "1. Eligibility for Refunds" },
    { id: "non-refundable", title: "2. Non-Refundable Items" },
    { id: "request-process", title: "3. Refund Request Process" },
    { id: "chargebacks", title: "4. Chargebacks" },
    { id: "policy-changes", title: "5. Policy Changes" },
  ], [])

  // Handle scroll to highlight active section in table of contents
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      setShowBackToTop(window.scrollY > 300)

      // Find the current active section
      const currentSection = sections.find((section) => {
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

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">Effective Date: 20/3/2025</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Hidden on print */}
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
                  We value your satisfaction and aim to provide a fair and transparent refund process. This Refund
                  Policy outlines the conditions under which refunds may be issued for purchases made on our platform.
                </p>

                <Alert className="my-6 border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    Please review this policy carefully before making a purchase. By completing a purchase, you agree to
                    these terms.
                  </AlertDescription>
                </Alert>

                <h2 id="eligibility" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1. Eligibility for Refunds
                </h2>
                <p>Refunds are only applicable under the following conditions:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>You purchased a digital product or service and did not receive access or delivery.</li>
                  <li>You were charged more than once for the same order.</li>
                  <li>You experienced a technical issue that prevented the use of the product or service.</li>
                </ul>

                <h2 id="non-refundable" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2. Non-Refundable Items
                </h2>
                <p>We do not offer refunds for:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Digital products or services that have been accessed, downloaded, or used.</li>
                  <li>Any customized or personalized services once initiated.</li>
                  <li>Cases where the refund request is made more than 7 days after the original purchase date.</li>
                </ul>

                <div className="bg-muted p-4 rounded-lg my-6">
                  <p className="font-medium">Important Timeline:</p>
                  <p className="text-sm mt-1">
                    All refund requests must be submitted within 7 days of purchase. Requests received after this period
                    will not be considered.
                  </p>
                </div>

                <h2 id="request-process" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3. Refund Request Process
                </h2>
                <p>
                  To request a refund, please contact our support team at{" "}
                  <a href="mailto:support@albahaa-store.org" className="text-primary hover:underline">
                    support@albahaa-store.org
                  </a>{" "}
                  with the following details:
                </p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Full Name</li>
                  <li>Order Number</li>
                  <li>Reason for the refund</li>
                  <li>Supporting evidence (if applicable)</li>
                </ul>
                <p>
                  Once your request is received and reviewed, we will notify you of the approval or rejection of your
                  refund. Approved refunds will be processed to your original method of payment within 7–14 business
                  days.
                </p>

                <h2 id="chargebacks" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4. Chargebacks
                </h2>
                <p>
                  Initiating a chargeback without contacting our support team may result in account suspension. We
                  encourage you to resolve any issues with us directly before contacting your bank.
                </p>

                <Alert className="my-6 border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription>
                    Filing a chargeback without first attempting to resolve the issue with our support team may result
                    in permanent account suspension.
                  </AlertDescription>
                </Alert>

                <h2 id="policy-changes" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5. Policy Changes
                </h2>
                <p>
                  We reserve the right to update or modify this Refund Policy at any time. Changes will be reflected on
                  this page with an updated effective date.
                </p>

                <h2 id="contact-us" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6. Contact Us
                </h2>
                <p>For questions regarding this policy, please contact:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:support@albahaa-store.org" className="text-primary hover:underline">
                      support@albahaa-store.org
                    </a>
                    <br />
                    <strong>Phone:</strong> +962-79-297-7707
                    <br />
                    <strong>Business Name:</strong> Bahaa Qatamin
                    <br />
                    <strong>Location:</strong> Amman, Jordan
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
                  className={`print:hidden transition-opacity duration-300 ${showBackToTop ? "opacity-100" : "opacity-0"}`}
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

