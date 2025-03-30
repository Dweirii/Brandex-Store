"use client"

import Link from "next/link"
import { Mail, Phone, ChevronDown } from "lucide-react"
import { useState } from "react"

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Desktop View */}
        <div className="hidden md:flex justify-center gap-8 lg:gap-16 xl:gap-24 max-w-6xl mx-auto">
          <div className="w-64 space-y-5 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Baha Store offers quality products with exceptional customer service, dedicated to bringing you the best
              shopping experience.
            </p>
          </div>

          <div className="w-64 space-y-5 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              Policies
            </h3>
            <ul className="space-y-3 w-full">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((item) => (
                <li key={item.href} className="flex justify-center">
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 flex items-center group"
                  >
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2 group-hover:bg-black transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-64 space-y-5 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4 w-full">
              <li className="flex items-center justify-center gap-3 text-sm text-muted-foreground group">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                  <Mail className="h-4 w-4 text-black" />
                </div>
                <a href="mailto:support@albahaa-store.org" className="hover:text-black transition-colors duration-200">
                  support@albahaa-store.org
                </a>
              </li>
              <li className="flex items-center justify-center gap-3 text-sm text-muted-foreground group">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                  <Phone className="h-4 w-4 text-black" />
                </div>
                <a href="tel:+962792977707" className="hover:text-black transition-colors duration-200">
                  +962-79-297-7707
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {[
            { id: "about", title: "About Us" },
            { id: "policies", title: "Policies" },
            { id: "contact", title: "Contact Us" },
          ].map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex justify-between items-center w-full p-4 text-left"
                aria-expanded={openSection === section.id}
                aria-controls={`section-${section.id}`}
              >
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <ChevronDown
                  className={`h-4 w-4 text-black transition-transform duration-200 ${
                    openSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`section-${section.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSection === section.id ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 pt-0">
                  {section.id === "about" && (
                    <p className="text-sm text-muted-foreground">
                      Baha Store offers quality products with exceptional customer service, dedicated to bringing you
                      the best shopping experience.
                    </p>
                  )}
                  {section.id === "policies" && (
                    <ul className="space-y-3">
                      {[
                        { href: "/privacy-policy", label: "Privacy Policy" },
                        { href: "/refund-policy", label: "Refund Policy" },
                        { href: "/terms-of-service", label: "Terms of Service" },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 flex items-center py-1"
                          >
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.id === "contact" && (
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Mail className="h-4 w-4 text-black flex-shrink-0" />
                        </div>
                        <a
                          href="mailto:support@albahaa-store.org"
                          className="hover:text-black transition-colors duration-200"
                        >
                          support@albahaa-store.org
                        </a>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Phone className="h-4 w-4 text-black flex-shrink-0" />
                        </div>
                        <a href="tel:+962792977707" className="hover:text-black transition-colors duration-200">
                          +962-79-297-7707
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-xs font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="text-black font-semibold">Baha Store Inc.</span> All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }

