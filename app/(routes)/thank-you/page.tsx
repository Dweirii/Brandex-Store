"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, SnowflakeIcon as Confetti, Package, ShoppingBag } from "lucide-react"

import  Button  from "@/components/ui/Button"

export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation after a short delay
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-background to-background/80">
      {/* Animated confetti particles */}
      {showConfetti && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed w-3 h-3 rounded-full bg-primary"
              initial={{
                top: "-5%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                top: "100%",
                opacity: 0,
                scale: [0, 1, 0.5],
                x: Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 3 + 3,
              }}
            />
          ))}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i + 30}
              className="fixed w-2 h-6 rounded-full bg-secondary"
              initial={{
                top: "-5%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                top: "100%",
                opacity: 0,
                rotate: 180,
                x: Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                delay: Math.random() * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 3 + 2,
              }}
            />
          ))}
        </>
      )}

      <div className="max-w-md w-full flex flex-col items-center text-center z-10">
        {/* Success checkmark animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
              <Check className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Confetti className="h-8 w-8 text-primary" />
          </motion.div>
        </motion.div>

        {/* Thank you text with staggered animation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Thank You!
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Your order has been received
          </motion.p>
          <motion.div
            className="text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Order #24601 • Total: $172.37
          </motion.div>
        </motion.div>

        {/* Animated cards */}
        <motion.div
          className="w-full space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.div
            className="bg-card p-4 rounded-lg border flex items-center gap-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Your order is being prepared</p>
              <p className="text-sm text-muted-foreground">We&apos;ll email you tracking info soon</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-card p-4 rounded-lg border flex items-center gap-4"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.4, type: "spring" }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Ready to shop more?</p>
              <p className="text-sm text-muted-foreground">Check out our latest products</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <Button
            className="w-full sm:w-1/2"
          >
            <Link href="/account/orders">View Order</Link>
          </Button>
          <Button
            className="w-full sm:w-1/2"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </motion.div>

        {/* Floating animation at the bottom */}
        <motion.div
          className="mt-12 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.p
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              repeatType: "reverse",
            }}
          >
            Thanks for shopping with us!
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

