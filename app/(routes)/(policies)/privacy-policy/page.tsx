"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft } from "lucide-react"
import  {Button}  from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Sections for the table of contents
  const sections = useMemo(() => [
    { id: "information-we-collect", title: "1. Information We Collect" },
    { id: "how-we-use", title: "2. How We Use Your Information" },
    { id: "payment-processing", title: "3. Payment Processing" },
    { id: "sharing-information", title: "4. Sharing Your Information" },
    { id: "cookies-tracking", title: "5. Cookies and Tracking" },
    { id: "data-security", title: "6. Data Security" },
    { id: "your-rights", title: "7. Your Rights" },
    { id: "third-party", title: "8. Third-Party Services" },
    { id: "changes-policy", title: "9. Changes to This Policy" },
  ], []);

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Effective Date: 21/3/2025</p>
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
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                  visit our website or use our services. By accessing or using our platform, you agree to the practices
                  described in this policy.
                </p>

                <h2 id="information-we-collect" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1. Information We Collect
                </h2>
                <p>We may collect the following types of personal information:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Billing and Shipping Address</li>
                  <li>Payment Details (processed securely through third-party providers)</li>
                  <li>Order History</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>

                <h2 id="how-we-use" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2. How We Use Your Information
                </h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you regarding your purchases</li>
                  <li>Improve our website and services</li>
                  <li>Ensure compliance with legal and regulatory requirements</li>
                  <li>Detect and prevent fraudulent activity</li>
                </ul>

                <h2 id="payment-processing" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3. Payment Processing
                </h2>
                <p>
                  All payment transactions are handled by third-party providers (such as Stripe) using secure
                  encryption protocols. We do not store or have access to your full card details. Please review
                  Stripe&apos;s own privacy policy for details on their data handling practices.
                </p>

                <h2 id="sharing-information" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4. Sharing Your Information
                </h2>
                <p>
                  We do <strong>not</strong> sell, rent, or trade your personal information. We may share data with:
                </p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Payment processors</li>
                  <li>Shipping and logistics partners</li>
                  <li>Legal or regulatory authorities when required by law</li>
                </ul>

                <h2 id="cookies-tracking" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5. Cookies and Tracking
                </h2>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Remember your preferences</li>
                  <li>Track site performance</li>
                  <li>Improve user experience</li>
                </ul>
                <p>You can manage your cookie settings in your browser.</p>

                <h2 id="data-security" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 id="your-rights" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  7. Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Access the data we hold about you</li>
                  <li>Request correction or deletion of your personal data</li>
                  <li>Withdraw consent to data processing (where applicable)</li>
                </ul>
                <p>
                  To exercise these rights, contact us at:{" "}
                  <a href="mailto:support@Brandex.com" className="text-primary hover:underline">
                    support@Brandex.com
                  </a>
                </p>

                <h2 id="third-party" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  8. Third-Party Services
                </h2>
                <p>
                  Our website may contain links to third-party services. We are not responsible for their privacy
                  practices. Please review their policies before using their services.
                </p>

                <h2 id="changes-policy" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  9. Changes to This Policy
                </h2>
                <p>
                  We reserve the right to update this Privacy Policy at any time. The latest version will always be
                  available on this page, with an updated &apos;Effective Date.&apos;
                </p>

                <h2 id="contact-us" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  10. Contact Us
                </h2>
                <p>If you have questions about this Privacy Policy or how we handle your data, please contact us at:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:support@Brandex.com" className="text-primary hover:underline">
                      support@Brandex.com
                    </a>
                    <br />
                    <strong>Phone:</strong> +962-79-297-7707
                    <br />
                    <strong>Business Name:</strong> Brandex
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

