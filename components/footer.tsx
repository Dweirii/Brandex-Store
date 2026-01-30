"use client"

import Link from "next/link"
import { Mail, Phone, Instagram } from "lucide-react"

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.5 4.5h4.5c1.58 0 2.5 1.69 2.5 2.5 0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5 0 .81-.92 2.5-2.5 2.5H6.5v-8zm2 3.5h2c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H8.5v1zm0 3h2.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H8.5v1zM15.5 7h3v1h-3V7zm-.5 5c-1.66 0-3 1.34-3 3s1.34 3 3 3c1.3 0 2.4-.84 2.83-2H16.5c-.28.28-.67.5-1.5.5-.83 0-1.5-.67-1.5-1.5h4.5c.28-1.66-.84-3-2.5-3zm-1.5 2.5c0-.28.22-.5.5-.5h2c-.28 0-.5.22-.5.5H13.5z" />
  </svg>
)

const Footer = () => {
  return (
    <footer className="bg-card text-foreground border-t border-border py-10 md:py-14">
      {" "}
      <div className="container mx-auto px-10 max-w-7xl">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">About Brandex</h3>{" "}
            {/* Ensured text-foreground */}
            <p className="text-sm text-muted-foreground">
              {" "}
              {/* Changed text-gray-400 to text-muted-foreground */}
              Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and
              brands who demand quality and speed.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3> {/* Ensured text-foreground */}
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Refund Policy", "Terms of Service"].map((label) => {
                const href = `/${label.toLowerCase().replace(/ /g, "-")}`
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {" "}
                      {/* Changed hover:text-green-400 to hover:text-primary, added text-muted-foreground */}
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3> {/* Ensured text-foreground */}
            <p className="text-sm text-muted-foreground mb-3">
              Need help? Email us and we&apos;ll get back to you soon.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> {/* Changed text-green-400 to text-primary */}
                <a href="mailto:team@brandexme.com" className="text-muted-foreground hover:underline">
                  {" "}
                  {/* Added text-muted-foreground */}
                  team@brandexme.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {/* Changed text-green-400 to text-primary */}
                <a href="tel:+18554042726" className="text-muted-foreground hover:underline">
                  {" "}
                  {/* Added text-muted-foreground */}
                  +1-855-404-2726
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stay Connected</h3>{" "}
            {/* Ensured text-foreground */}
            <p className="text-sm text-muted-foreground mb-4">
              {" "}
              {/* Changed text-gray-400 to text-muted-foreground */}
              Follow us on our social platforms for updates and more.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/brandexme?s=21&t=ZY2A-PurYFzWTpcYQkcePw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Brandex on X"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/brandex_llc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Brandex on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.behance.net/brandex-design"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Brandex on Behance"
              >
                <BehanceIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Brandex</span> — All Rights Reserved
        </div>
      </div>
    </footer>
  )
}

export { Footer }
