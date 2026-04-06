"use client"

import Link from "next/link"
import { Mail, Instagram, ArrowUpRight } from "lucide-react"
import Image from "next/image"
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
)

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Licensing", href: "/licensing" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
]

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com/brandexme",
    icon: XIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/brandex_llc/",
    icon: Instagram,
  },
  {
    label: "Behance",
    href: "https://www.behance.net/brandex-design",
    icon: BehanceIcon,
  },
]

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-muted/30">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.svg"
                alt="Brandex Logo"
                width={120}
                height={30}
                className="h-7 w-auto dark:invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium creative assets including mockups, graphics, packaging, and motion. Instant downloads, commercial-ready, built for real-world projects.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
                  aria-label={`Follow Brandex on ${social.label}`}
                >
                  <social.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Mockups", href: "/category/mockup-studio" },
                { label: "Packaging", href: "/category/packaging" },
                { label: "Images", href: "/category/images" },
                { label: "Vectors", href: "/category/vectors" },
                { label: "PSD Lab", href: "/category/psd-lab" },
                { label: "Motion", href: "/category/motion-library" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Have questions or need help? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:team@brandexme.com"
              className="group mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <Mail className="h-4 w-4" />
              <span>team@brandexme.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brandex LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/licensing"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
