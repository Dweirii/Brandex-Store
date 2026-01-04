"use client"

import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-card">
      <div className="container relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00EB02]/10 border border-[#00EB02]/20 badge-text text-[#00EB02] mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Premium Digital Products Store
          </motion.div>

          <motion.h1
            className="heading-hero bg-gradient-to-r from-foreground via-foreground to-primary dark:from-foreground dark:via-foreground dark:to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Gateway to Premium{" "}
            <span className="relative inline-block">
              Digital Products
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#00EB02] to-[#00C402] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-body-large text-medium-contrast max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Explore ready-to-use assets crafted to grow your brand instantly. Professional quality, instant access,
            lifetime value.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 sm:pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground button-text px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                Browse Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="button-text px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl border-2 hover:border-primary hover:text-primary transition-all duration-300"
              asChild
            >
              <Link href="/">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
