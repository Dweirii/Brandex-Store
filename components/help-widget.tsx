"use client"

import { useState } from "react"
import { Mail, Phone, X, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const HelpWidget = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded Help Card */}
        {isOpen && (
          <div className="bg-card border border-border rounded-lg shadow-2xl p-5 w-80 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Need Help?</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close help"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions or need assistance? Email or call us and we&apos;ll get back to you as soon as possible!
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:team@brandexme.com"
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2.5 rounded-md text-sm font-medium w-full justify-center"
              >
                <Mail className="h-4 w-4" />
                team@brandexme.com
              </a>
              <a
                href="tel:+18554042726"
                className="flex items-center gap-2 border border-border bg-muted/50 hover:bg-muted transition-colors px-4 py-2.5 rounded-md text-sm font-medium w-full justify-center"
              >
                <Phone className="h-4 w-4" />
                +1 (855) 404-2726
              </a>
            </div>
          </div>
        )}

        {/* Help Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-full p-4 shadow-lg hover:shadow-xl",
            isOpen && "rotate-0 scale-95"
          )}
          aria-label="Toggle help"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <HelpCircle className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  )
}

export { HelpWidget }
