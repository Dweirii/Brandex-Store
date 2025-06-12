"use client"

import { motion } from "framer-motion"
import { Package, FileText, Lightbulb, Sparkles, Camera } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Mockups",
    description:
      "High-resolution, editable PSD packaging mockups designed for premium product presentation",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    bgPattern:
      "bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
    count: "300+",
    category: "Mockups",
    features: ["Box mockups", "Bag mockups", "Label templates", "Editable layers"],
  },
  {
    icon: FileText,
    title: "Ready Packaging Art Work",
    description:
      "Essential design elements and identity assets to maintain brand consistency across channels",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgPattern:
      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    count: "150+",
    category: "Assets",
    features: ["Logo kits", "Typography sets", "Color palettes", "Brand guidelines"],
  },
  {
    icon: Camera,
    title: "Product Photography",
    description:
      "Studio-quality product photos tailored for e-commerce, advertising, and marketing needs",
    gradient: "from-rose-500 via-red-500 to-orange-500",
    bgPattern:
      "bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20",
    count: "500+",
    category: "Photos",
    features: ["White background", "Lifestyle shots", "Close-ups", "360° views"],
  },
  {
    icon: Lightbulb,
    title: "PSD",
    description:
      "Editable concepts and campaign kickoffs to help you rapidly prototype visual ideas",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    bgPattern:
      "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    count: "100+",
    category: "Starters",
    features: ["Mood boards", "Creative briefs", "Ad concepts", "Storyboard slides"],
  },
]


export function WhatYouGetSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-32 bg-white dark:bg-card relative overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-400/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-32 right-20 w-4 h-4 bg-[#00EB02] rounded-full opacity-60"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-40 left-16 w-6 h-6 bg-purple-500 rounded-full opacity-40"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-32 w-3 h-3 bg-blue-500 rounded-full opacity-50"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <div className="container relative">
        {/* Creative Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00EB02]/10 to-purple-500/10 border border-[#00EB02]/20 text-sm font-medium text-[#00EB02] mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Premium Digital Arsenal
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#020817] to-[#00EB02] dark:from-white dark:to-[#00EB02] bg-clip-text text-transparent">
              What You Get
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-normal text-muted-foreground">
              Everything your brand needs to{" "}
              <span className="relative">
                thrive
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00EB02] to-purple-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </span>
            </span>
          </h2>
        </motion.div>

        {/* Creative Grid Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group relative ${index === 0 ? "lg:col-span-2" : ""} ${index === 1 ? "lg:row-span-2" : ""}`}
            >
              <div
                className={`relative h-full min-h-[400px] ${
                  index === 0 ? "lg:min-h-[300px]" : ""
                } ${index === 1 ? "lg:min-h-[600px]" : ""} 
                rounded-3xl ${feature.bgPattern} border border-gray-100 dark:border-gray-800 
                overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl 
                hover:shadow-purple-500/10 dark:hover:shadow-[#00EB02]/10`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, ${feature.gradient.split(" ")[1]} 0%, transparent 50%), 
                                       radial-gradient(circle at 80% 20%, ${feature.gradient.split(" ")[3]} 0%, transparent 50%)`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full p-8 lg:p-12 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">{feature.category}</div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#020817] dark:text-white group-hover:text-[#00EB02] transition-colors duration-300">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                      >
                        {feature.count}
                      </div>
                      <div className="text-sm text-muted-foreground">Items</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed flex-grow">{feature.description}</p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {feature.features.map((item, itemIndex) => (
                      <motion.div
                        key={item}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * itemIndex, duration: 0.5 }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                        <span className="text-sm font-medium text-[#020817] dark:text-white">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00EB02]/10 to-purple-500/10 border border-[#00EB02]/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00EB02]">30K+</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">24/7</div>
              <div className="text-sm text-muted-foreground">Access</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">∞</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
