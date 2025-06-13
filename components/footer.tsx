"use client"

import Link from "next/link"
import { Mail, Phone, Instagram, Twitter, Linkedin } from "lucide-react"

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
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> {/* Changed text-green-400 to text-primary */}
                <a href="mailto:support@brandex.com" className="text-muted-foreground hover:underline">
                  {" "}
                  {/* Added text-muted-foreground */}
                  support@brandex.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {/* Changed text-green-400 to text-primary */}
                <a href="tel:+962792977707" className="text-muted-foreground hover:underline">
                  {" "}
                  {/* Added text-muted-foreground */}
                  +962-79-297-7707
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
                href="https://instagram.com/brandex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                {" "}
                {/* Added text-muted-foreground, changed hover:text-green-400 to hover:text-primary */}
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/brandex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                {" "}
                {/* Added text-muted-foreground, changed hover:text-green-400 to hover:text-primary */}
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/brandex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                {" "}
                {/* Added text-muted-foreground, changed hover:text-green-400 to hover:text-primary */}
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {" "}
          {/* Changed border-gray-700 to border-border, text-gray-500 to text-muted-foreground */}
          &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Brandex</span> — All Rights
          Reserved {/* Changed text-white to text-foreground */}
        </div>
      </div>
    </footer>
  )
}

export { Footer }
