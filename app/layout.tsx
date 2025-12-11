// src/app/layout.tsx
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Brandex — Premium Mockups & Design Resources",
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
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
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
          className={`${font.className} ${font.variable} h-full flex flex-col min-h-screen bg-card/70 text-foreground transition-colors`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <GeoInitializer />
              <Suspense fallback={<div className="h-20 shadow-[0_0_10px_0_rgba(0,0,0,0.6)]" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1">{children}</main>
              <AppToaster />
              <Footer />
            </Providers>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
