import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script"; // ✅ لإضافة Google Analytics
import { Analytics } from "@vercel/analytics/react"; // ✅ لإضافة Vercel Analytics

import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import ModalProvider from "@/providers/model-provider";
import ToastProvider from "@/providers/toast.provider";
import { Providers } from "@/providers/Providers";
import { ThemeProvider } from "@/components/theme-provider";
import { DisableContextMenu } from "@/components/disable-context-menu";

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
  title: "Brandex",
  description:
    "Brandex — Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={`${font.className} ${font.variable} h-full flex flex-col min-h-screen bg-card/70 text-foreground transition-colors`}
        >
          {/* Google Analytics Scripts */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-ZMVM2S3DNV"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZMVM2S3DNV');
            `}
          </Script>

          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <DisableContextMenu />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </Providers>
          </ThemeProvider>

          {/* ✅ Vercel Analytics */}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
