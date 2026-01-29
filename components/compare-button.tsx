"use client"

import { useState, useEffect } from "react"
import { GitCompareArrows } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import useCompare from "@/hooks/use-compare"

const CompareButton = () => {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const items = useCompare((state) => state.items)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  const handleClick = () => {
    router.push("/compare")
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -20 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        className="fixed bottom-24 left-6 z-40 p-3 rounded-full bg-card border-2 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-lg hover:shadow-xl transition-all duration-200 group"
        aria-label={`Compare ${items.length} products`}
      >
        <div className="relative">
          <GitCompareArrows className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-primary-foreground group-hover:text-primary">
            {items.length}
          </span>
        </div>
      </motion.button>
    </AnimatePresence>
  )
}

export { CompareButton }
