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
import getCategories from "@/actions/get-categories";
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
import { ScrollToTop } from "@/components/scroll-to-top";
import { WelcomeCreditsPopup } from "@/components/welcome-credits-popup";

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

const GTM_ID = "GTM-PM89X24C";
const META_PIXEL_ID = "561913850219327";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories().catch(() => []);
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
          {/*
           * Google Tag Manager — loads after consent defaults are set so GTM
           * respects the Consent Mode v2 state. The CookieConsent component's
           * consent updates flow through `dataLayer` to all GTM-managed tags
           * (GA4, Google Ads, etc.).
           */}
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          {/*
           * Meta Pixel — loaded with consent revoked by default. The
           * CookieConsent component calls fbq('consent','grant') once the
           * visitor opts in to marketing cookies, mirroring the Google
           * Consent Mode v2 flow above.
           */}
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('consent', 'revoke');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        </head>

        <body
          className={`${font.className} ${font.variable} h-full flex flex-col min-h-screen bg-background text-foreground transition-colors overflow-x-hidden`}
        >
          {/* Google Tag Manager (noscript) — per Google's install spec. */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* Meta Pixel (noscript) — per Meta's install spec. */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <GeoInitializer />
              <Suspense fallback={<div className="h-20 shadow-[0_0_10px_0_rgba(0,0,0,0.6)]" />}>
                <header className="sticky top-0 z-50 flex flex-col">
                  <Navbar categories={categories} />
                </header>
              </Suspense>
              <main className="flex-1 pb-0">{children}</main>
              <AppToaster />
              <Footer />
              <HelpWidget />
              <BackToTop />
              <CompareButton />
              <Suspense><ScrollToTop /></Suspense>
              <WelcomeCreditsPopup />
              <CookieConsent />
            </Providers>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
