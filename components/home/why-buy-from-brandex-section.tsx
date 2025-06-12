"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Infinity, Award, CheckCircle } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure & Instant Access",
    description:
      "Experience peace of mind with our protected payment system and get immediate access to your digital products the moment you complete your purchase.",
    features: ["SSL encrypted checkout", "Instant downloads", "Secure file hosting", "24/7 availability"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Infinity,
    title: "Lifetime Value & Ownership",
    description:
      "Make a single investment and own your digital assets forever. No recurring fees, no subscription traps - just pure value that grows with your business.",
    features: [
      "No subscription fees",
      "Unlimited downloads",
      "Commercial license included",
      "Future updates at no cost",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Award,
    title: "Premium Quality Guarantee",
    description:
      "Every product in our collection is handpicked by experts and designed to meet the highest professional standards for business success.",
    features: [
      "Expert curation process",
      "Quality assurance testing",
      "Regular content updates",
      "Professional design standards",
    ],
    color: "text-[#00EB02]",
    bgColor: "bg-[#00EB02]/10",
  },
]

export function WhyBuyFromBrandexSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-32 bg-white dark:bg-card relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#00EB02]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00EB02]/3 rounded-full blur-3xl" />

      <div className="container relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#020817] to-[#00EB02] dark:from-white dark:to-[#00EB02] bg-clip-text text-transparent">
            Why Choose Brandex
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We&apos;ve built our platform around three core principles that make digital product shopping simple, secure, and
            valuable for creators and businesses worldwide.
          </p>
        </motion.div>

        <motion.div
          className="space-y-20 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Icon and Visual Element */}
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-32 h-32 rounded-3xl ${benefit.bgColor} flex items-center justify-center relative overflow-hidden`}
                >
                  <benefit.icon className={`w-16 h-16 ${benefit.color}`} />
                  <div className={`absolute inset-0 ${benefit.bgColor} opacity-50 blur-xl`} />
                </div>
                {/* Decorative elements */}
                <div className={`absolute -top-4 -right-4 w-8 h-8 ${benefit.bgColor} rounded-full opacity-60`} />
                <div className={`absolute -bottom-4 -left-4 w-6 h-6 ${benefit.bgColor} rounded-full opacity-40`} />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#020817] dark:text-white">{benefit.title}</h3>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">{benefit.description}</p>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefit.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex, duration: 0.5 }}
                    >
                      <div className={`p-1 rounded-full ${benefit.bgColor} group-hover:scale-110 transition-transform`}>
                        <CheckCircle className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <span className="font-medium text-[#020817] dark:text-white group-hover:text-[#00EB02] transition-colors">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
