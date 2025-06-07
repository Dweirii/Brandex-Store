"use client";

import Link from "next/link";
import { Mail, Phone, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {

  return (
    <footer className="bg-[#020817] text-white border-t border-gray-700 py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Brandex</h3>
            <p className="text-sm text-gray-400">
              Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Refund Policy", "Terms of Service"].map((label) => {
                const href = `/${label.toLowerCase().replace(/ /g, "-")}`;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-green-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-400" />
                <a href="mailto:support@brandex.com" className="hover:underline">
                  support@brandex.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+962792977707" className="hover:underline">
                  +962-79-297-7707
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow us on our social platforms for updates and more.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/brandex" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/brandex" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/brandex" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Brandex</span> — All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export { Footer };