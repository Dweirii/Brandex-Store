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
    <footer className="bg-white border-t border-gray-100 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 border-t border-gray-100 pt-6">
          <div>
            <h3 className="text-sm font-medium mb-3">About Us</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Brandex offers quality Mock-ups with exceptional customer service, dedicated to bringing you the best
              shopping experience.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-3">Policies</h3>
            <ul className="space-y-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center"
                  >
                    <span className="h-1 w-1 bg-gray-300 rounded-full mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@Brandex.com"
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Mail className="h-3 w-3" />
                  support@Brandex.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+962792977707"
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Phone className="h-3 w-3" />
                  +962-79-297-7707
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-1 border-t border-gray-100 pt-4">
          {[
            {
              id: "about",
              title: "About Us",
              content: (
                <p className="text-xs text-gray-500">
                  Brandex offers quality Mock-ups with exceptional customer service, dedicated to bringing you the
                  best shopping experience.
                </p>
              ),
            },
            {
              id: "policies",
              title: "Policies",
              content: (
                <ul className="space-y-2">
                  {[
                    { href: "/privacy-policy", label: "Privacy Policy" },
                    { href: "/refund-policy", label: "Refund Policy" },
                    { href: "/terms-of-service", label: "Terms of Service" },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center"
                      >
                        <span className="h-1 w-1 bg-gray-300 rounded-full mr-2"></span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "contact",
              title: "Contact Us",
              content: (
                <ul className="space-y-2">
                  <li>
                    <a
                      href="mailto:support@Brandex.com"
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                      <Mail className="h-3 w-3" />
                      support@Brandex.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+962792977707"
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                      <Phone className="h-3 w-3" />
                      +962-79-297-7707
                    </a>
                  </li>
                </ul>
              ),
            },
          ].map((section) => (
            <div key={section.id} className="border-b border-gray-100 pb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex justify-between items-center w-full py-2 text-left"
                aria-expanded={openSection === section.id}
                aria-controls={`section-${section.id}`}
              >
                <h3 className="text-sm font-medium">{section.title}</h3>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    openSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === section.id && <div className="py-2">{section.content}</div>}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} <span className="font-medium">Brandex</span> • All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
