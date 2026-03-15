// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import ModalProvider from "@/providers/model-provider";
import ToastProvider from "@/providers/toast.provider";
import { Providers } from "@/providers/Providers";
import { ThemeProvider } from "@/components/theme-provider";
import AppToaster from "@/components/ui/toaster";
import { GeoInitializer } from "@/components/geo-initializer";
import { HelpWidget } from "@/components/help-widget";
import { BackToTop } from "@/components/back-to-top";
import { CompareButton } from "@/components/compare-button";
import { CookieConsent } from "@/components/cookie-consent";

const font = Urbanist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Brandex Premium Mockups & Design Resources",
    template: "%s | Brandex",
  },
  description:
    "Brandex — Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.",
  keywords: "mockups, packaging design, PSD files, design resources, brand assets, premium designs",
  authors: [{ name: "Brandex" }],
  creator: "Brandex",
  publisher: "Brandex",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://brandexme.com" : "http://localhost:3000")
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Brandex",
    title: "Brandex — Premium Mockups & Design Resources",
    description:
      "Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandex — Premium Mockups & Design Resources",
    description:
      "Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/x-icon" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1YRZK4HX52";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/downloads">
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
          {/*
           * Consent Mode v2 — MUST run before gtag.js loads so GA4 and Google
           * Ads respect the default-deny state on every page load. The
           * CookieConsent component calls gtag('consent','update',{...}) after
           * the visitor makes a choice, which unlocks the blocked signals.
           */}
          <Script id="consent-mode-init" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage:    'denied',
                ad_storage:           'denied',
                ad_user_data:         'denied',
                ad_personalization:   'denied',
                wait_for_update:       500
              });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                anonymize_ip: true
              });
            `}
          </Script>
        </head>

        <body
          className={`${font.className} ${font.variable} h-full flex flex-col min-h-screen bg-background text-foreground transition-colors overflow-x-hidden`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <GeoInitializer />
              <Suspense fallback={<div className="h-20 shadow-[0_0_10px_0_rgba(0,0,0,0.6)]" />}>
                <header className="sticky top-0 z-50 flex flex-col">
                  <Navbar />
                </header>
              </Suspense>
              <main className="flex-1 pb-0">{children}</main>
              <AppToaster />
              <Footer />
              <HelpWidget />
              <BackToTop />
              <CompareButton />
              <CookieConsent />
            </Providers>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
