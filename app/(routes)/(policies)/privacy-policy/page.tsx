"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft } from "lucide-react"
import  {Button}  from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(() => [
    { id: "who-we-are", title: "1. Who We Are" },
    { id: "key-points", title: "2. Key Points" },
    { id: "information-we-collect", title: "3. Information We Collect" },
    { id: "how-we-use", title: "4. How We Use Information" },
    { id: "legal-bases", title: "5. Legal Bases for Processing" },
    { id: "cookies", title: "6. Cookies and Similar Technologies" },
    { id: "how-we-share", title: "7. How We Share Information" },
    { id: "digital-products", title: "8. Digital Products Only" },
    { id: "data-retention", title: "9. Data Retention" },
    { id: "security", title: "10. Security" },
    { id: "your-rights", title: "11. Your Rights and Choices" },
    { id: "international-transfers", title: "12. International Data Transfers" },
    { id: "childrens-privacy", title: "13. Children's Privacy" },
    { id: "third-party-links", title: "14. Third-Party Links" },
    { id: "changes-policy", title: "15. Changes to This Privacy Policy" },
    { id: "contact-us", title: "16. Contact Us" },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Brandex LLC Privacy Policy (brandexme.com)</h1>
          <p className="text-muted-foreground mt-2">Effective Date: 3/21/2025</p>
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
                  This Privacy Policy describes how Brandex LLC (&quot;Brandex LLC,&quot; &quot;brandexme.com,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects personal information when you visit brandexme.com or use our services, including purchasing and accessing digital downloads (collectively, the &quot;Services&quot;).
                </p>
                <p>By using the Services, you agree to this Privacy Policy. If you do not agree, do not use the Services.</p>

                {/* Section 1 */}
                <h2 id="who-we-are" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  1) Who We Are
                </h2>
                <ul className="list-none pl-0 space-y-1 my-4">
                  <li><strong>Legal Entity:</strong> Brandex LLC</li>
                  <li><strong>Website:</strong> brandexme.com</li>
                  <li><strong>Location:</strong> Granger, Indiana, United States</li>
                  <li><strong>Email:</strong> <a href="mailto:team@brandexme.com" className="text-primary hover:underline">team@brandexme.com</a></li>
                </ul>

                {/* Section 2 */}
                <h2 id="key-points" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  2) Key Points
                </h2>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li><strong>Accounts required:</strong> You must be signed in to purchase, download, or leave a review (no guest checkout).</li>
                  <li><strong>Digital-only:</strong> We provide digital products only and do not ship physical goods.</li>
                  <li><strong>Payments:</strong> Payments are processed by Stripe.</li>
                  <li><strong>Hosting:</strong> Our Services are hosted on Vercel.</li>
                  <li><strong>Consent-gated analytics/ads:</strong> Non-essential cookies (including GA4 and Google Ads conversion tracking) are blocked unless you consent.</li>
                </ul>

                {/* Section 3 */}
                <h2 id="information-we-collect" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  3) Information We Collect
                </h2>
                <p>We collect information in the following ways:</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">A) Account and Identity Information (Clerk)</h3>
                <p>We use Clerk for authentication and user account management (shared across Store, Admin, and Studio apps). Clerk collects and processes:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Email address</li>
                  <li>First and last name</li>
                  <li>Password (handled by Clerk; we do not access your password)</li>
                  <li>Profile photo (optional, such as via OAuth)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">B) Payment and Billing Information (Stripe)</h3>
                <p>Payments are processed by Stripe. Stripe collects and stores:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Full billing address (required)</li>
                  <li>Phone number (collected at checkout)</li>
                  <li>Payment card details</li>
                </ul>
                <p>We do not store full payment card numbers on our servers. Payment processing is handled by Stripe under its own privacy and security practices.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">C) Information You Create or Submit on Our Site (Our Database)</h3>
                <p>We store certain information in our own database (hosted on Neon PostgreSQL), including:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Product reviews (star rating and review text)</li>
                  <li>Download records (user ID, product ID, timestamp, and credit cost)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">D) Studio Uploads and Prompts</h3>
                <p>If you use Studio features, we process and store:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Uploaded images and text prompts</li>
                </ul>
                <p>Studio uploads and prompts may be transmitted to third-party AI providers to generate outputs. Studio assets are stored on BunnyCDN.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">E) Search Queries (Typesense)</h3>
                <p>When you use search, we process search query strings using Typesense to return results.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">F) Automatically Collected Technical Data (Logs and Analytics)</h3>
                <p>When you use the Services, certain technical data is collected automatically, such as:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>IP address</li>
                  <li>Device and browser information</li>
                  <li>Pages viewed and interactions</li>
                  <li>Request metadata and diagnostics</li>
                </ul>
                <p>This data may be processed by our providers for hosting, delivery, security, and performance, including Vercel, BunnyCDN, Clerk, Sentry, and (with consent where required) Google Analytics 4.</p>

                <div className="bg-muted p-4 rounded-lg my-4">
                  <p><strong>Digital Download Delivery Note:</strong><br />
                  Digital files are stored on BunnyCDN, but downloads are delivered by our server proxy. This means our server receives request data (including IP address) when a download is streamed to you, and download activity is recorded in our database as described above.</p>
                </div>

                {/* Section 4 */}
                <h2 id="how-we-use" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  4) How We Use Information
                </h2>
                <p>We use personal information to:</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">Provide and Operate the Services</h3>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Create and manage accounts</li>
                  <li>Process purchases and confirm transactions</li>
                  <li>Deliver digital downloads and maintain access to purchased content</li>
                  <li>Enable reviews, credits, and download history</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">Maintain Security and Improve the Services</h3>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Monitor performance and debug issues</li>
                  <li>Detect and prevent fraud, abuse, and unauthorized access</li>
                  <li>Protect the integrity of our Services and enforce our policies</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">Communicate Administrative Updates</h3>
                <p>Send admin-facing operational notifications and reports (via Resend)</p>
                <p><em>Note: Customer-facing transactional emails (like receipts or download links) may be added in the future; if so, we will use your email to send those messages.</em></p>

                <h3 className="text-xl font-semibold mt-6 mb-2">Comply With Law and Business Requirements</h3>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Maintain records required for accounting/tax purposes</li>
                  <li>Respond to lawful requests and enforce legal rights</li>
                </ul>

                {/* Section 5 */}
                <h2 id="legal-bases" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  5) Legal Bases for Processing (EEA/UK and Similar Regions)
                </h2>
                <p>If you are located in the European Economic Area (EEA), the United Kingdom, or a similar jurisdiction, we rely on the following legal bases where applicable:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li><strong>Contract:</strong> to provide the Services and deliver digital products you purchase</li>
                  <li><strong>Legitimate interests:</strong> to operate, secure, and improve the Services</li>
                  <li><strong>Consent:</strong> for certain cookies/tracking where required</li>
                  <li><strong>Legal obligation:</strong> to comply with applicable laws</li>
                </ul>
                <p>Where we rely on consent, you may withdraw it at any time through our cookie controls or applicable settings.</p>

                {/* Section 6 */}
                <h2 id="cookies" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  6) Cookies and Similar Technologies
                </h2>
                <p>We use cookies and similar technologies (such as pixels and local storage) to operate and understand the Services.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">A) Essential Cookies</h3>
                <p>Essential cookies are required for core functions such as authentication, session management, and security. For example, Clerk uses session/authentication cookies to keep you signed in.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">B) Analytics Cookies (Consent-Based)</h3>
                <p>We use:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Vercel Analytics (performance/usage insights)</li>
                  <li>Google Analytics 4 (GA4) (web analytics; configured with IP anonymization)</li>
                </ul>
                <p>GA4 is configured to default to denied and only run after you consent through our banner/preferences.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">C) Advertising/Conversion Measurement (Consent-Based)</h3>
                <p>We use Google Ads conversion tracking to measure conversion events related to downloads. This tracking is gated behind cookie consent.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">D) Your Choices</h3>
                <p>We use a custom consent system that appears on first visit and supports:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Accept All</li>
                  <li>Reject All</li>
                  <li>Manage Preferences</li>
                </ul>
                <p>Non-essential cookies and tracking are blocked until you provide permission. We also implement Google Consent Mode v2, and Google signals default to denied before anything loads. Your choice is stored in your browser (currently via local storage key <code>brandex_cookie_consent_v1</code>).</p>
                <p>You can also control cookies through your browser settings. If you disable certain cookies, some features may not work properly.</p>

                {/* Section 7 */}
                <h2 id="how-we-share" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  7) How We Share Information
                </h2>
                <p>We share personal information only as needed to operate the Services.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">A) Service Providers</h3>
                <p>We share information with third-party providers that help us run the Services, including:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Clerk (authentication and identity management)</li>
                  <li>Stripe (payment processing)</li>
                  <li>Vercel (hosting, edge network, and analytics)</li>
                  <li>BunnyCDN (file storage/delivery for downloads and Studio assets; logs download requests)</li>
                  <li>Neon (PostgreSQL) (hosted database infrastructure)</li>
                  <li>Sentry (error monitoring and diagnostics)</li>
                  <li>Typesense (search processing)</li>
                  <li>Resend (admin notification emails)</li>
                  <li>Inngest (background job scheduling)</li>
                  <li>AI providers used for Studio and Admin features, including Replicate, Freepik AI, Stability AI, Photoroom, OpenAI, and Google Gemini (depending on the feature you use)</li>
                </ul>
                <p>These providers process information under their own terms and privacy practices, and where applicable, under agreements with us.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">B) Analytics and Conversion Measurement (With Consent Where Required)</h3>
                <p>If you consent, we share limited information with Google Analytics and Google Ads for analytics and conversion measurement.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">C) Legal, Safety, and Rights Protection</h3>
                <p>We may disclose information if required to comply with law or legal process, or to protect the rights, safety, and security of Brandex LLC, our users, or others.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">D) Business Transfers</h3>
                <p>If Brandex LLC is involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be transferred as part of that transaction.</p>

                <div className="bg-muted p-4 rounded-lg my-4">
                  <p><strong>No Sale of Personal Information</strong><br />
                  We do not sell personal information. We do not use retargeting as a business practice. We do use conversion measurement (Google Ads) which is gated behind consent.</p>
                </div>

                {/* Section 8 */}
                <h2 id="digital-products" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  8) Digital Products Only
                </h2>
                <p>brandexme.com provides digital products and digital downloads only. We do not ship physical goods. Delivery may occur through download access within your account or another digital method described at checkout.</p>

                {/* Section 9 */}
                <h2 id="data-retention" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  9) Data Retention
                </h2>
                <p>We retain personal information only as long as reasonably necessary for the purposes described in this Policy, including:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Providing access to purchased digital content</li>
                  <li>Maintaining account records and download history</li>
                  <li>Preventing fraud and securing the Services</li>
                  <li>Maintaining records required for accounting/tax and legal compliance</li>
                </ul>
                <p>Retention periods can vary depending on the type of data and legal requirements. We may delete or de-identify information when it is no longer needed.</p>

                {/* Section 10 */}
                <h2 id="security" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  10) Security
                </h2>
                <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. However, no system is completely secure, and we cannot guarantee absolute security.</p>

                {/* Section 11 */}
                <h2 id="your-rights" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  11) Your Rights and Choices
                </h2>

                <h3 className="text-xl font-semibold mt-6 mb-2">A) Cookie Choices</h3>
                <p>You can manage cookie preferences using our consent banner and preference controls, and through your browser settings.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">B) Access, Correction, Deletion, and Other Rights</h3>
                <p>Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-1 my-4">
                  <li>Request access to personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of certain personal information (subject to legal exceptions)</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Request a copy of your information (data portability)</li>
                </ul>
                <p>
                  To exercise your rights, email{" "}
                  <a href="mailto:team@brandexme.com" className="text-primary hover:underline">
                    team@brandexme.com
                  </a>{" "}
                  with the subject line &quot;Privacy Request.&quot; We may verify your identity before completing your request.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-2">C) US State Privacy Rights (Where Applicable)</h3>
                <p>Residents of certain US states may have additional rights, which may include the right to opt out of certain data sharing for advertising purposes (where applicable) and the right to appeal certain decisions. If we provide a &quot;Do Not Sell or Share My Personal Information&quot; link, you may use it to manage applicable preferences.</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">D) EEA/UK Complaints</h3>
                <p>If you are in the EEA/UK, you may have the right to lodge a complaint with your local data protection authority.</p>

                {/* Section 12 */}
                <h2 id="international-transfers" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  12) International Data Transfers
                </h2>
                <p>Brandex LLC is based in the United States. If you access the Services from outside the United States, your information may be transferred to and processed in the United States and other countries where we or our service providers operate. These jurisdictions may have different data protection laws than your country.</p>
                <p>Where required, we use appropriate safeguards for international transfers.</p>

                {/* Section 13 */}
                <h2 id="childrens-privacy" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  13) Children&apos;s Privacy
                </h2>
                <p>
                  The Services are not intended for children under 13 (or under 16 in certain regions). We do not knowingly collect personal information from children. If you believe a child has provided personal information, contact us at{" "}
                  <a href="mailto:team@brandexme.com" className="text-primary hover:underline">
                    team@brandexme.com
                  </a>{" "}
                  and we will take steps to delete it.
                </p>

                {/* Section 14 */}
                <h2 id="third-party-links" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  14) Third-Party Links
                </h2>
                <p>Our Services may include links to third-party websites or services. We are not responsible for their privacy practices. Please review the privacy policies of any third-party sites you visit.</p>

                {/* Section 15 */}
                <h2 id="changes-policy" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  15) Changes to This Privacy Policy
                </h2>
                <p>We may update this Privacy Policy from time to time. We will update the Last Updated date at the top of the page. If changes are material, we will take reasonable steps to provide notice (such as posting a prominent notice on our website).</p>

                {/* Section 16 */}
                <h2 id="contact-us" className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24">
                  16) Contact Us
                </h2>
                <div className="bg-muted p-4 rounded-lg my-4">
                  <p>
                    <strong>Brandex LLC</strong>
                    <br />
                    <strong>Location:</strong> Granger, Indiana, United States
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
