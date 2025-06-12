"use client"

import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function CallToActionSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-white dark:bg-card">
      <div className="container relative">
        <motion.div
          className="text-center space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00EB02]/20 border border-[#00EB02]/30 text-sm font-medium text-[#00EB02] mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Zap className="w-4 h-4" />
            Start Building Today
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Ready to power{" "}
            <span className="relative">
              your brand?
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#00EB02] to-[#00C402] rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Join thousands of creators and businesses who trust Brandex for their digital product needs. Start your
            journey today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="group bg-[#00EB02] hover:bg-[#00C402] text-[#020817] font-semibold px-10 py-6 text-xl rounded-xl shadow-2xl hover:shadow-[#00EB02]/25 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/" className="flex items-center gap-3">
                Explore Products
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="text-center text-slate-400">
              <p className="text-sm">No subscription required</p>
              <p className="text-xs">Instant access • Lifetime license</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
