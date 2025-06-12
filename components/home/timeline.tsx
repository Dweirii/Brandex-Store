"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

const timelineEvents = [
  {
    year: 2018,
    title: "Flowers & Saints Launched",
    description:
      "Built to solve a key problem for designers: finding premium, print-ready mockup templates without the noise.",
    details:
      "Our journey began with a mission to provide designers with high-quality, usable templates that actually work in real-world applications.",
  },
  {
    year: 2019,
    title: "First Mockup Collection Released",
    description:
      "Introduced a curated library of high-resolution packaging and product mockups tailored for real-world use.",
    details:
      "Our initial collection focused on product presentation mockups that designers could use immediately for client work.",
  },
  {
    year: 2020,
    title: "Print-Ready Templates Go Live",
    description:
      "Expanded into full-scale, print-ready design templates — all optimized for CMYK and real-world production specs.",
    details:
      "We added comprehensive templates with proper bleed, trim marks, and color profiles to ensure smooth printing processes.",
  },
  {
    year: 2021,
    title: "Exclusive, One-of-a-Kind Asset Series",
    description:
      "Launched limited-edition templates created by top designers — only available through Flowers & Saints.",
    details:
      "Collaborations with industry-leading designers brought unique, premium assets that can't be found anywhere else.",
  },
  {
    year: 2022,
    title: "Affordable Creative Access",
    description:
      "Rolled out flexible pricing and special licensing to support freelancers, agencies, and scaling brands.",
    details:
      "Our new pricing structure made premium design assets accessible to creators at every stage of their career.",
  },
  {
    year: 2023,
    title: "Priority Support + Asset Requests",
    description:
      "Introduced hands-on support and a new request system — so designers can ask for the assets they need, when they need them.",
    details:
      "Our dedicated support team now helps designers find exactly what they need or create custom solutions for specific projects.",
  },
]

const FlowerIcon = ({ progress }: { progress: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    style={{ transform: `scale(${progress})` }}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 8C12 8 14 10 14 12C14 14 12 16 12 16C12 16 10 14 10 12C10 10 12 8 12 8Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

export default function Timeline() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section ref={containerRef} className="py-20 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#020817] to-[#00EB02] dark:from-white dark:to-[#00EB02] bg-clip-text text-transparent">Our Journey</h2>
          <p className="mt-4 text-lg text-muted-foreground">The evolution of Flowers & Saints through the years</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"
            style={{ scaleY: scaleX }}
          />

          {/* Flower icon */}
          <motion.div
            className="sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-primary"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          >
            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            <FlowerIcon progress={useTransform(scrollYProgress, [0, 1], [0.5, 1]) as any} />
          </motion.div>

          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              isExpanded={expandedEvent === index}
              onToggle={() => setExpandedEvent(expandedEvent === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: (typeof timelineEvents)[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="w-5/12" />
      <div className="z-20">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <div className="w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <motion.div
        className="w-5/12 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <div className="p-4 bg-card rounded-lg shadow-md border border-primary/10">
          <span className="font-bold text-primary">{event.year}</span>
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <p className="text-muted-foreground">{event.description}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-muted-foreground">{event.details}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
