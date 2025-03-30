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
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-16 xl:gap-24 max-w-6xl mx-auto">
          <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block pb-2 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:bg-primary">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-xs">
              Baha Store offers quality products with exceptional customer service, dedicated to bringing you the best
              shopping experience.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full mt-2"></div>
          </div>

          <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block pb-2 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:bg-primary">
              Policies
            </h3>
            <ul className="space-y-4 w-full max-w-xs flex flex-col items-center">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((item) => (
                <li key={item.href} className="text-center">
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 inline-flex items-center group relative"
                  >
                    <span className="absolute -left-4 h-1.5 w-1.5 bg-gray-400 rounded-full group-hover:bg-black transition-colors group-hover:scale-125 duration-200"></span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full mt-2"></div>
          </div>

          <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-black font-semibold text-lg relative inline-block pb-2 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:bg-primary">
              Contact Us
            </h3>
            <ul className="space-y-5 w-full max-w-xs">
              <li className="flex items-center justify-center gap-4 text-sm text-muted-foreground group">
                <div className="bg-gray-100 p-2.5 rounded-full group-hover:bg-gray-200 transition-colors duration-200 shadow-sm">
                  <Mail className="h-4 w-4 text-black" />
                </div>
                <a
                  href="mailto:support@albahaa-store.org"
                  className="hover:text-black transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-black after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  support@albahaa-store.org
                </a>
              </li>
              <li className="flex items-center justify-center gap-4 text-sm text-muted-foreground group">
                <div className="bg-gray-100 p-2.5 rounded-full group-hover:bg-gray-200 transition-colors duration-200 shadow-sm">
                  <Phone className="h-4 w-4 text-black" />
                </div>
                <a
                  href="tel:+962792977707"
                  className="hover:text-black transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-black after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  +962-79-297-7707
                </a>
              </li>
            </ul>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full mt-2"></div>
          </div>
        </div>

        {/* Mobile View - Keeping the same as before */}
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

