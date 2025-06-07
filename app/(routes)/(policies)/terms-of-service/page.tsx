"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft, AlertCircle, Scale, Shield, FileText } from 'lucide-react'
import  {Button}  from "@/components/ui/Button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Sections for the table of contents
  const sections = useMemo(() =>[
    { id: "use-of-website", title: "1. Use of the Website" },
    { id: "products-services", title: "2. Products and Services" },
    { id: "payment-terms", title: "3. Payment Terms" },
    { id: "refunds-cancellations", title: "4. Refunds and Cancellations" },
    { id: "intellectual-property", title: "5. Intellectual Property" },
    { id: "limitation-liability", title: "6. Limitation of Liability" },
    { id: "modifications-terms", title: "7. Modifications to Terms" },
    { id: "governing-law", title: "8. Governing Law" },
  ], [])

  // Handle scroll to highlight active section in table of contents
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      setShowBackToTop(window.scrollY > 300)
      
      // Find the current active section
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

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
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
      behavior: "smooth"
    })
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Terms of Service</h1>
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
                  <span>Print Terms</span>
                </Button>
              </div>
              
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium">Related Policies</h3>
                <Link 
                  href="/privacy-policy" 
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Privacy Policy</span>
                </Link>
                <Link 
                  href="/refund-policy" 
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Refund Policy</span>
                </Link>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <Card className="p-6 md:p-8">
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  By using our website and services, you agree to these Terms of Service. Please read them carefully.
                </AlertDescription>
              </Alert>
              
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg">
                  These Terms of Service govern your access to and use of our website, products, and services. By using our
                  platform, you agree to be bound by these terms. If you do not agree, you may not access or use our services.
                </p>

                <h2 id="use-of-website" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  1. Use of the Website
                </h2>
                <p>You agree to use the website only for lawful purposes and in accordance with these terms. You must not:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Use the site in any way that violates any applicable laws or regulations.</li>
                  <li>Attempt to gain unauthorized access to any portion of the site.</li>
                  <li>Engage in any conduct that restricts or inhibits others from using the platform.</li>
                </ul>

                <h2 id="products-services" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  2. Products and Services
                </h2>
                <p>
                  We strive to display accurate information regarding our products, pricing, and availability. However, we do
                  not guarantee that all descriptions are error-free. We reserve the right to modify or discontinue products
                  at any time without notice.
                </p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p className="text-sm">
                    <strong>Note:</strong> Product images are for illustrative purposes only. Actual products may vary slightly from what is shown.
                  </p>
                </div>

                <h2 id="payment-terms" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  3. Payment Terms
                </h2>
                <p>Payments are processed through secure third-party providers. By making a purchase, you:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Authorize us to charge your selected payment method.</li>
                  <li>Agree to the pricing, taxes, and fees listed during checkout.</li>
                  <li>Understand that we do not store your full payment details.</li>
                </ul>

                <h2 id="refunds-cancellations" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  4. Refunds and Cancellations
                  <Badge variant="outline" className="ml-2">Important</Badge>
                </h2>
                <p>
                  Please refer to our <Link href="/refund-policy" className="text-primary hover:underline font-medium">Refund Policy</Link> for details about cancellations, returns, and eligibility
                  for refunds. All refund requests must comply with the conditions outlined there.
                </p>

                <h2 id="intellectual-property" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  5. Intellectual Property
                </h2>
                <p>
                  All content, including text, images, logos, and code, is the property of Bahaa Qatamin and is protected by
                  copyright and intellectual property laws. You may not copy, modify, or distribute any part of this site
                  without our written permission.
                </p>

                <h2 id="limitation-liability" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  6. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, or
                  consequential damages arising out of your use of the site or services, including but not limited to loss of
                  data, loss of revenue, or interruption of service.
                </p>
                <Alert className="my-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-300">
                    Our liability is limited to the amount you paid for the product or service that is the subject of the claim.
                  </AlertDescription>
                </Alert>

                <h2 id="modifications-terms" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  7. Modifications to Terms
                </h2>
                <p>
                  We reserve the right to update or modify these Terms of Service at any time without prior notice. Any
                  changes will be posted on this page with an updated effective date.
                </p>

                <h2 id="governing-law" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  8. Governing Law
                  <Scale className="h-5 w-5 ml-2 text-muted-foreground" />
                </h2>
                <p>
                  These terms shall be governed by and interpreted in accordance with the laws of the Hashemite Kingdom of
                  Jordan.
                </p>

                <h2 id="contact-information" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 flex items-center gap-2">
                  9. Contact Information
                </h2>
                <p>If you have any questions or concerns about these Terms, please contact us at:</p>
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
