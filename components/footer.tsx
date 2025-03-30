"use client"

import Link from "next/link"
import { Mail, Phone, ChevronDown } from "lucide-react"
import { useState } from "react"

const Footer = () => {
  // State for mobile accordion sections
  const [openSection, setOpenSection] = useState<string | null>(null)

  // Toggle section visibility on mobile
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter section - modern addition */}
      <div className="container mx-auto px-4 py-8">
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Desktop version - hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-black font-semibold relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Baha Store offers quality products with exceptional customer service, dedicated to bringing you the best
              shopping experience.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              Policies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 flex items-center"
                >
                  <span className="h-1 w-1 bg-black rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 flex items-center"
                >
                  <span className="h-1 w-1 bg-black rounded-full mr-2"></span>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 flex items-center"
                >
                  <span className="h-1 w-1 bg-black rounded-full mr-2"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-black after:bottom-0 after:left-0 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                  <Mail className="h-4 w-4 text-black" />
                </div>
                <a
                  href="mailto:support@albahaa-store.org"
                  className="hover:text-black transition-colors duration-200"
                >
                  support@albahaa-store.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground group">
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

        {/* Mobile version - modern accordion style */}
        <div className="md:hidden space-y-3">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("about")}
              className="flex justify-between items-center w-full p-4 text-left"
            >
              <h3 className="text-sm font-semibold">About Us</h3>
              <ChevronDown
                className={`h-4 w-4 text-black transition-transform duration-200 ${openSection === "about" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "about" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Baha Store offers quality products with exceptional customer service, dedicated to bringing you the
                  best shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* Policies Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("policies")}
              className="flex justify-between items-center w-full p-4 text-left"
            >
              <h3 className="text-sm font-semibold">Policies</h3>
              <ChevronDown
                className={`h-4 w-4 text-black transition-transform duration-200 ${openSection === "policies" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "policies" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 pt-0">
                <ul className="space-y-3">
                  <li>
                    <Link href="/privacy-policy" className="text-sm text-muted-foreground block py-1">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-policy" className="text-sm text-muted-foreground block py-1">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-sm text-muted-foreground block py-1">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection("contact")}
              className="flex justify-between items-center w-full p-4 text-left"
            >
              <h3 className="text-sm font-semibold">Contact Us</h3>
              <ChevronDown
                className={`h-4 w-4 text-black transition-transform duration-200 ${openSection === "contact" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === "contact" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 pt-0">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-black flex-shrink-0" />
                    <a href="mailto:support@albahaa-store.org">support@albahaa-store.org</a>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-black flex-shrink-0" />
                    <a href="tel:+962792977707">+962-79-297-7707</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright - modern styling */}
        <div className="mt-10 pt-6 border-t border-gray-200">
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

