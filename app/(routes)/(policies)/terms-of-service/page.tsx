"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft, Shield, FileText } from 'lucide-react'
import  {Button}  from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(() => [
    { id: "who-we-are", title: "1. Who We Are" },
    { id: "eligibility", title: "2. Eligibility" },
    { id: "accounts", title: "3. Accounts and Authentication" },
    { id: "digital-products", title: "4. Digital Products and Delivery" },
    { id: "purchases-payments", title: "5. Purchases, Payments, and Taxes" },
    { id: "credits", title: "6. Credits, Wallets, and Usage-Based Features" },
    { id: "refunds", title: "7. Refunds and Chargebacks" },
    { id: "license", title: "8. License to Digital Products" },
    { id: "user-content", title: "9. User Content" },
    { id: "studio-ai", title: "10. Studio and AI Features" },
    { id: "prohibited-conduct", title: "11. Prohibited Conduct" },
    { id: "intellectual-property", title: "12. Intellectual Property" },
    { id: "dmca", title: "13. DMCA / Copyright Complaints" },
    { id: "termination", title: "14. Termination" },
    { id: "disclaimers", title: "15. Disclaimers" },
    { id: "limitation-liability", title: "16. Limitation of Liability" },
    { id: "indemnification", title: "17. Indemnification" },
    { id: "disputes", title: "18. Disputes, Governing Law, and Venue" },
    { id: "changes-terms", title: "19. Changes to These Terms" },
    { id: "contact", title: "20. Contact" },
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

  const handlePrint = () => {
    window.print()
  }

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Brandex LLC Terms of Service (brandexme.com)</h1>
          <p className="text-muted-foreground mt-2">Effective Date: 2/23/2026</p>
          <p className="text-muted-foreground">Last Updated: 2/23/2026</p>
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
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg">
                  These Terms of Service (&quot;Terms&quot;) govern your access to and use of brandexme.com and any related applications, products, and services operated by Brandex LLC (&quot;Brandex LLC,&quot; &quot;brandexme.com,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) (collectively, the &quot;Services&quot;).
                </p>
                <p>By accessing or using the Services, you agree to these Terms. If you do not agree, do not use the Services.</p>

                {/* Section 1 */}
                <h2 id="who-we-are" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1) Who We Are
                </h2>
                <p>Brandex LLC operates brandexme.com.</p>
                <ul className="list-none pl-0 space-y-1 my-4">
                  <li>Granger, Indiana, United States</li>
                  <li><strong>Email:</strong> <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a></li>
                </ul>

                {/* Section 2 */}
                <h2 id="eligibility" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2) Eligibility
                </h2>
                <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account and make purchases, or use the Services under the supervision of a parent/guardian who is responsible for your actions.</p>

                {/* Section 3 */}
                <h2 id="accounts" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3) Accounts and Authentication
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li><strong>Account required:</strong> You must be signed in to purchase, download, or leave a review. There is no guest checkout.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</li>
                  <li>You agree to provide accurate information and keep it up to date.</li>
                  <li>We may suspend or terminate accounts that violate these Terms or pose a security risk.</li>
                </ul>

                {/* Section 4 */}
                <h2 id="digital-products" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4) Digital Products and Delivery
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>brandexme.com provides digital products and digital downloads only. We do not ship physical goods.</li>
                  <li>Delivery and access may be provided through your account download area or another digital method described at checkout.</li>
                  <li>You are responsible for ensuring you have compatible devices/software and internet access to download and use digital products.</li>
                </ul>

                {/* Section 5 */}
                <h2 id="purchases-payments" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5) Purchases, Payments, and Taxes
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Payments are processed by third-party payment processors (currently Stripe).</li>
                  <li>Prices and availability may change at any time.</li>
                  <li>You authorize us (and our payment processors) to charge your chosen payment method for purchases you make.</li>
                  <li>You are responsible for any applicable taxes, duties, or fees unless otherwise stated at checkout.</li>
                </ul>

                {/* Section 6 */}
                <h2 id="credits" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6) Credits, Wallets, and Usage-Based Features (If Applicable)
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Some features or products may use a credit-based system (for example, generating content or unlocking downloads), as shown in the Services.</li>
                  <li>Credits have no cash value, are non-transferable, and may not be resold.</li>
                  <li>Credits may expire or be modified if stated in the product or checkout flow.</li>
                  <li>We may adjust credit pricing or credit costs from time to time.</li>
                </ul>

                {/* Section 7 */}
                <h2 id="refunds" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  7) Refunds and Chargebacks
                </h2>
                <p>Because we sell digital products, all sales are generally final once access is granted or a download is made available, unless otherwise required by law or explicitly stated in a specific product&apos;s purchase terms.</p>
                <p>We may, at our discretion, consider refunds in limited cases (for example, duplicate purchases or proven technical failure preventing access that we cannot resolve). If you believe you qualify, contact <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a>.</p>
                <p><strong>Chargebacks:</strong> If you initiate a chargeback without contacting us first, we may suspend your account and restrict access to the Services while we investigate.</p>

                {/* Section 8 */}
                <h2 id="license" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  8) License to Digital Products
                </h2>
                <p>Unless a product listing states otherwise, when you purchase a digital product from brandexme.com, you receive a limited, non-exclusive, non-transferable, revocable license to download and use that product for your personal or internal business use.</p>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>resell, sublicense, distribute, share, or publicly post the product files (or any portion of them) unless the product license explicitly permits it,</li>
                  <li>remove proprietary notices or branding embedded in the files,</li>
                  <li>use the products to create a competing marketplace/library, or</li>
                  <li>use the products in a way that violates law or infringes others&apos; rights.</li>
                </ul>
                <p>We retain all right, title, and interest in and to the products and the Services except for the limited license granted to you.</p>

                {/* Section 9 */}
                <h2 id="user-content" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  9) User Content (Reviews and Submissions)
                </h2>
                <p>If you submit content such as reviews, ratings, text, images, or other materials (&quot;User Content&quot;):</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>You represent you have the rights to submit it and that it does not violate law or others&apos; rights.</li>
                  <li>You grant Brandex LLC a worldwide, non-exclusive, royalty-free license to host, store, reproduce, display, and distribute your User Content solely for operating, improving, and marketing the Services (for example, displaying your review on a product page).</li>
                  <li>We may remove User Content at our discretion, including content that violates these Terms.</li>
                </ul>

                {/* Section 10 */}
                <h2 id="studio-ai" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  10) Studio and AI Features
                </h2>
                <p>If the Services include &quot;Studio&quot; or AI-assisted features:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>You are responsible for the prompts, images, and other inputs you provide.</li>
                  <li>You agree not to submit content that is illegal, infringing, deceptive, harassing, sexually exploitative, or otherwise harmful.</li>
                  <li>Outputs may be generated using third-party AI providers. Outputs can be imperfect and may be similar to content created for others.</li>
                  <li>You are responsible for verifying outputs before using them in production, marketing, legal, or commercial contexts.</li>
                  <li><strong>Ownership of outputs:</strong> As between you and Brandex LLC, you retain your rights (if any) in your inputs. For outputs, ownership may depend on the underlying model/provider terms and applicable law. We grant you a license to use outputs you generate through your account for lawful purposes, subject to these Terms and any product-specific or provider restrictions.</li>
                </ul>

                {/* Section 11 */}
                <h2 id="prohibited-conduct" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  11) Prohibited Conduct
                </h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>violate any law or regulation,</li>
                  <li>infringe intellectual property or privacy rights,</li>
                  <li>attempt to gain unauthorized access to accounts, systems, or networks,</li>
                  <li>scrape, reverse engineer, disrupt, or overload the Services,</li>
                  <li>upload malware or malicious code,</li>
                  <li>abuse credits, purchases, reviews, or promotions,</li>
                  <li>impersonate others or misrepresent affiliation, or</li>
                  <li>use the Services to develop or promote competing products that materially copy our content or platform.</li>
                </ul>

                {/* Section 12 */}
                <h2 id="intellectual-property" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  12) Intellectual Property
                </h2>
                <p>The Services, including the website, software, design, text, logos, and all brandexme.com content (excluding User Content), are owned by Brandex LLC or its licensors and are protected by intellectual property laws.</p>

                {/* Section 13 */}
                <h2 id="dmca" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  13) DMCA / Copyright Complaints
                </h2>
                <p>If you believe content on the Services infringes your copyright, email <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a> with:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>your contact information,</li>
                  <li>identification of the copyrighted work,</li>
                  <li>identification of the allegedly infringing material (with URL),</li>
                  <li>a statement you have a good-faith belief the use is unauthorized, and</li>
                  <li>a statement under penalty of perjury that your notice is accurate and you are the rights holder (or authorized agent).</li>
                </ul>

                {/* Section 14 */}
                <h2 id="termination" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  14) Termination
                </h2>
                <p>We may suspend or terminate your access to the Services at any time if:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>you violate these Terms,</li>
                  <li>your use poses a security or legal risk, or</li>
                  <li>required by law.</li>
                </ul>
                <p>You may stop using the Services at any time. Termination may result in loss of access to certain features. Where legally required, we will provide access to purchases as required by law, but digital products may be subject to license restrictions and fraud prevention policies.</p>

                {/* Section 15 */}
                <h2 id="disclaimers" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  15) Disclaimers
                </h2>
                <p className="uppercase font-semibold">THE SERVICES AND ALL DIGITAL PRODUCTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot;</p>
                <p className="uppercase">TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                <p>We do not warrant that the Services will be uninterrupted, error-free, or completely secure, or that digital products or AI outputs will meet your requirements.</p>

                {/* Section 16 */}
                <h2 id="limitation-liability" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  16) Limitation of Liability
                </h2>
                <p className="uppercase">TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRANDEX LLC WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICES OR DIGITAL PRODUCTS.</p>
                <p className="uppercase">TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICES WILL NOT EXCEED THE AMOUNT YOU PAID TO BRANDEX LLC FOR THE SERVICES IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM.</p>
                <p>(Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.)</p>

                {/* Section 17 */}
                <h2 id="indemnification" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  17) Indemnification
                </h2>
                <p>You agree to indemnify and hold harmless Brandex LLC and its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, and expenses (including reasonable attorneys&apos; fees) arising out of or related to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>your use of the Services,</li>
                  <li>your violation of these Terms, or</li>
                  <li>your infringement of any rights of another person or entity.</li>
                </ul>

                {/* Section 18 */}
                <h2 id="disputes" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  18) Disputes, Governing Law, and Venue
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>These Terms are governed by the laws of the State of Indiana, without regard to conflict of law principles.</li>
                  <li>If a dispute arises, you agree to first contact us at <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a> to attempt informal resolution.</li>
                  <li>Unless prohibited by law, any legal action must be brought in the state or federal courts located in Indiana, and you consent to personal jurisdiction and venue in those courts.</li>
                </ul>

                {/* Section 19 */}
                <h2 id="changes-terms" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  19) Changes to These Terms
                </h2>
                <p>We may update these Terms from time to time. We will update the Last Updated date above. If changes are material, we may provide notice through the Services or by other reasonable means. Your continued use of the Services after changes become effective constitutes acceptance of the updated Terms.</p>

                {/* Section 20 */}
                <h2 id="contact" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  20) Contact
                </h2>
                <p>Questions about these Terms? Contact:</p>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Brandex LLC</strong>
                    <br />
                    Granger, Indiana, United States
                    <br />
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
