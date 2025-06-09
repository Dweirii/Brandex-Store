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
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} transition-colors`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ModalProvider />
              <ToastProvider />
              <Navbar />
              {children}
              <Footer />
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
