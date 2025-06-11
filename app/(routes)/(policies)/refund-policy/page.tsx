"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronUp, Printer, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RefundPolicy() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handlePrint = () => window.print()
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">Effective Date: March 20, 2025</p>
        </div>

        <Card className="p-6 md:p-10">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Brandex is committed to customer satisfaction. This refund policy outlines the conditions under which refunds are granted.
            </AlertDescription>
          </Alert>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Refund Eligibility</h2>
            <p>
              Refunds may be requested within <strong>7 days</strong> of purchase if the following conditions apply:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>No download or access of the purchased product occurred.</li>
              <li>The item is defective due to an error on our part.</li>
              <li>Duplicate transactions were made unintentionally.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">2. Ineligible Refund Cases</h2>
            <p>Refunds will not be issued in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Digital items have already been downloaded or accessed.</li>
              <li>Refund requested due to a change of mind or personal reason.</li>
              <li>Failure to review product details or specifications prior to purchase.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">3. Payment Method & Processing</h2>
            <p>
              All payments made via <strong>Stripe</strong> are processed securely. Once a refund is approved, funds will be returned to
              your original payment method within <strong>5–10 business days</strong>, depending on your bank or provider.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">4. Requesting a Refund</h2>
            <p>Submit your refund request by emailing us with the following details:</p>
            <div className="bg-muted p-4 rounded-lg my-4">
              <ul className="list-disc pl-6">
                <li>Full name and email address used at checkout</li>
                <li>Order ID or payment reference number</li>
                <li>Clear explanation of the refund reason</li>
              </ul>
              <p className="mt-2">
                Email: <a href="mailto:support@Brandexme.com" className="text-primary hover:underline">support@Brandexme.com</a>
              </p>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-4">5. Contact Information</h2>
            <p>For any refund-related questions or issues, contact us via:</p>
            <div className="bg-muted p-4 rounded-lg my-4">
              <p>
                <strong>Email:</strong> <a href="mailto:support@Brandexme.com" className="text-primary hover:underline">support@Brandexme.com</a><br />
                <strong>Phone:</strong> +962-79-297-7707<br />
                <strong>Business Name:</strong> Brandex<br />
                <strong>Headquarters:</strong> Amman, Jordan
              </p>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-border flex justify-between items-center">
            <Link 
              href="/" 
              className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="flex gap-3">
              <Button onClick={handlePrint} className="print:hidden">
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button 
                onClick={scrollToTop} 
                className={`print:hidden transition-opacity duration-300 ${showBackToTop ? 'opacity-100' : 'opacity-0'}`}
              >
                <ChevronUp className="h-4 w-4 mr-2" /> Top
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
