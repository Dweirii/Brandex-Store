"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00EB02]/10 border border-[#00EB02]/20 text-xs sm:text-sm font-medium text-[#00EB02] mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Premium Digital Products Store
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary dark:from-foreground dark:via-foreground dark:to-primary bg-clip-text text-transparent leading-tight sm:leading-snug"
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
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Explore ready-to-use assets crafted to grow your brand instantly. Professional quality, instant access,
            lifetime value.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
