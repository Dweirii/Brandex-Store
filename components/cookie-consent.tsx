"use client"

import { useEffect, useState, useCallback } from "react"
import { X, Cookie, Settings } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type ConsentState = { analytics: boolean; marketing: boolean }

const CONSENT_KEY = "brandex_cookie_consent_v1"

interface StoredConsent extends ConsentState {
  timestamp: string
}

function pushGtagConsent(analytics: boolean, marketing: boolean) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  })
}

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredConsent
  } catch {
    return null
  }
}

function persistConsent(analytics: boolean, marketing: boolean) {
  const record: StoredConsent = {
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  pushGtagConsent(analytics, marketing)
}

// ─── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<ConsentState>({ analytics: false, marketing: false })

  // On mount: restore saved consent or show banner
  useEffect(() => {
    const stored = readStoredConsent()
    if (stored) {
      pushGtagConsent(stored.analytics, stored.marketing)
      return
    }
    const t = setTimeout(() => setShow(true), 600)
    return () => clearTimeout(t)
  }, [])

  const acceptAll = useCallback(() => {
    persistConsent(true, true)
    setShow(false)
    setShowPrefs(false)
  }, [])

  const rejectAll = useCallback(() => {
    persistConsent(false, false)
    setShow(false)
    setShowPrefs(false)
  }, [])

  const openPrefs = useCallback(() => {
    const stored = readStoredConsent()
    setPrefs(stored ? { analytics: stored.analytics, marketing: stored.marketing } : { analytics: false, marketing: false })
    setShowPrefs(true)
  }, [])

  const savePrefs = useCallback(() => {
    persistConsent(prefs.analytics, prefs.marketing)
    setShow(false)
    setShowPrefs(false)
  }, [prefs])

  if (!show) return null

  return (
    <>
      {/* ── Preferences modal ────────────────────────────────────────── */}
      {showPrefs && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-100"
            onClick={() => setShowPrefs(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] z-101 rounded-xl border border-border bg-card shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base">Cookie Preferences</h2>
              <button
                onClick={() => setShowPrefs(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close preferences"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Essential – always on */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium">Essential Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Required for authentication, cart, and security. Cannot be disabled.
                  </p>
                </div>
                <span className="text-xs font-medium text-primary shrink-0 mt-0.5">Always on</span>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Help us understand how visitors use the site (Google Analytics 4, Vercel Analytics).
                  </p>
                </div>
                <Toggle
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                  label="Toggle analytics cookies"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-medium">Marketing Cookies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Used for conversion measurement via Google Ads. We do not run retargeting ads.
                  </p>
                </div>
                <Toggle
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                  label="Toggle marketing cookies"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button variant="outline" className="flex-1" onClick={rejectAll}>
                Reject All
              </Button>
              <Button className="flex-1" onClick={savePrefs}>
                Save Preferences
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Main banner ───────────────────────────────────────────────── */}
      {!showPrefs && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-6 md:left-6 md:w-[440px] z-99 rounded-xl border border-border bg-card shadow-2xl p-5"
        >
          <div className="flex gap-3">
            <Cookie className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">We use cookies</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to improve your experience, measure site performance, and support Google
                Ads conversion measurement. Read our{" "}
                <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={acceptAll}>
                  Accept All
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={rejectAll}>
                  Reject All
                </Button>
                <Button size="sm" variant="ghost" className="flex-1" onClick={openPrefs}>
                  <Settings className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
