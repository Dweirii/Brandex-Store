import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import ModalProvider from "@/providers/model-provider";
import ToastProvider from "@/providers/toast.provider";
import { Providers } from "@/providers/Providers";
import { ThemeProvider } from "@/components/theme-provider";

const font = Urbanist({ subsets: ["latin"] });

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
          className={`${font.className} h-full flex flex-col min-h-screen bg-card/70 text-foreground transition-colors`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
