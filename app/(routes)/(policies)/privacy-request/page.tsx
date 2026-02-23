"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/card"

const REQUEST_TYPES = [
  { value: "access", label: "Access my data — send me a copy of all personal data you hold about me" },
  { value: "delete", label: "Delete my data — erase my personal information (right to erasure)" },
  { value: "correct", label: "Correct my data — update inaccurate or incomplete information" },
  { value: "opt_out_sale", label: "Do Not Sell / Do Not Share my personal information (CCPA)" },
  { value: "portability", label: "Data portability — receive my data in a machine-readable format" },
  { value: "restrict", label: "Restrict processing — limit how my data is used" },
  { value: "withdraw_consent", label: "Withdraw consent — opt out of analytics or marketing cookies" },
] as const

type RequestType = (typeof REQUEST_TYPES)[number]["value"]

interface FormState {
  name: string
  email: string
  type: RequestType | ""
  details: string
}

export default function PrivacyRequestPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", type: "", details: "" })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [serverError, setServerError] = useState("")

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = "Full name is required."
    if (!form.email.trim()) {
      next.email = "Email address is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address."
    }
    if (!form.type) next.type = "Please select a request type." as RequestType
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus("loading")
    setServerError("")

    try {
      const res = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error || "Submission failed")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Request Received</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We received your privacy request and will respond within{" "}
            <strong>45 days</strong> as required by applicable law. A confirmation has been logged.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            If you have follow-up questions, email us at{" "}
            <a href="mailto:team@brandexme.com" className="text-primary underline underline-offset-2">
              team@brandexme.com
            </a>
            .
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-3xl mx-auto px-4 py-10 md:py-14">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Request</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Submit a request to access, delete, correct, or opt out of the sale of your personal data.
                We honor rights under CCPA, GDPR, and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-lg border border-border bg-muted/40 p-4 mb-8 text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Response time:</strong> We will respond within{" "}
          <strong className="text-foreground">45 days</strong> (extendable by 45 days for complex
          requests with prior notice). We may need to verify your identity before fulfilling your request.
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name ? "border-destructive focus:ring-destructive/30" : "border-input"
                }`}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.email ? "border-destructive focus:ring-destructive/30" : "border-input"
                }`}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              <p className="text-xs text-muted-foreground">
                Use the email address associated with your Brandex account so we can locate your data.
              </p>
            </div>

            {/* Request type */}
            <div className="space-y-1.5">
              <label htmlFor="type" className="text-sm font-medium">
                Request Type <span className="text-destructive">*</span>
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as RequestType }))}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.type ? "border-destructive focus:ring-destructive/30" : "border-input"
                } ${!form.type ? "text-muted-foreground" : "text-foreground"}`}
              >
                <option value="" disabled>
                  Select a request type…
                </option>
                {REQUEST_TYPES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <label htmlFor="details" className="text-sm font-medium">
                Additional Details <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="details"
                rows={4}
                placeholder="Provide any additional context that may help us locate or process your data…"
                value={form.details}
                onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background resize-none transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Server error */}
            {status === "error" && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={status === "loading"}>
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "loading" ? "Submitting…" : "Submit Request"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link href="/privacy-policy">View Privacy Policy</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form you confirm the information is accurate. For questions, email{" "}
              <a href="mailto:team@brandexme.com" className="text-primary underline underline-offset-2">
                team@brandexme.com
              </a>
              .
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
