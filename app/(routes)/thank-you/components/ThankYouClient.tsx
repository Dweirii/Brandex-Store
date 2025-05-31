'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Clock, AlertTriangle, Download } from "lucide-react"
import useCart from "@/hooks/use-cart" 
import Button from "@/components/ui/Button"
import { DownloadButton } from "@/components/ui/download-button"
import { useApiRequest } from "@/hooks/use-api-request"

interface OrderItem {
  id: string
  productId: string
  productName: string
  storeId: string
}

export default function ThankYouPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const { apiRequest } = useApiRequest()

  useEffect(() => {
    async function fetchOrderData() {
      if (!sessionId) return
      try {
        const data = await apiRequest(
          `/api/a5a89728-3d04-481d-ae07-6d4d3c209e27/checkout/session?session_id=${sessionId}`,
        )
        setOrderItems(data.orderItems || [])
      } catch (error) {
        console.error("Failed to load order items", error)
      }
    }

    fetchOrderData()

    // Auto-trigger confetti after component mounts
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [sessionId, apiRequest])

  const cart = useCart()
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchOrderData() {
      if (!sessionId) return
      try {
        const data = await apiRequest(
          `/api/a5a89728-3d04-481d-ae07-6d4d3c209e27/checkout/session?session_id=${sessionId}`,
        )
        setOrderItems(data.orderItems || [])

        if (data.status === "paid") {
          cart.removeAll()
        }

      } catch (error) {
        console.error("Failed to load order items", error)
      }
    }

    fetchOrderData()
  }, [sessionId, apiRequest, cart])

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Determine urgency level
  const getUrgencyLevel = () => {
    if (timeLeft <= 300) return "critical" // Last 5 minutes
    if (timeLeft <= 600) return "warning" // Last 10 minutes
    return "normal"
  }

  const urgencyLevel = getUrgencyLevel()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-white dark:bg-black">
      {/* Monochrome Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,black_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Monochrome Confetti Animation */}
      {showConfetti && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed w-3 h-3 rounded-full bg-black dark:bg-white"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                top: "110%",
                opacity: 0,
                scale: [0, 1, 0.5],
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 4 + 4,
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i + 30}
              className="fixed w-2 h-8 bg-gray-600 dark:bg-gray-400"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                top: "110%",
                opacity: 0,
                rotate: 180,
                x: Math.random() * 150 - 75,
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                delay: Math.random() * 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 5 + 3,
              }}
            />
          ))}
        </>
      )}

      <div className="max-w-2xl w-full flex flex-col items-center text-center z-10 relative">
        {/* Success Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-500"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </motion.div>

        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Thank You!
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Your order has been received successfully
          </motion.p>
        </motion.div>

        {/* Countdown Timer - Prominent Alert */}
        <motion.div
          className={`w-full max-w-md p-6 rounded-2xl border-2 mb-8 ${
            urgencyLevel === "critical"
              ? "bg-red-50 border-red-500 dark:bg-red-950/20 dark:border-red-500"
              : urgencyLevel === "warning"
                ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-500"
                : "bg-green-50 border-green-500 dark:bg-green-950/20 dark:border-green-500"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {urgencyLevel === "critical" ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <Clock className="h-6 w-6 text-green-500" />
            )}
            <h2 className="text-lg font-bold text-black dark:text-white">
              {urgencyLevel === "critical" ? "URGENT: Download Now!" : "Download Time Remaining"}
            </h2>
          </div>

          <motion.div
            className={`text-4xl font-mono font-bold mb-3 ${
              urgencyLevel === "critical"
                ? "text-red-600 dark:text-red-400"
                : urgencyLevel === "warning"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-green-600 dark:text-green-400"
            }`}
            animate={urgencyLevel === "critical" ? { scale: [1, 1.05, 1] } : {}}
            transition={urgencyLevel === "critical" ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
          >
            {formatTime(timeLeft)}
          </motion.div>

          <p
            className={`text-sm font-medium ${
              urgencyLevel === "critical"
                ? "text-red-700 dark:text-red-300"
                : urgencyLevel === "warning"
                  ? "text-yellow-700 dark:text-yellow-300"
                  : "text-green-700 dark:text-green-300"
            }`}
          >
            {timeLeft === 0 ? "Download time has expired" : "You have 30 minutes to download your files"}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <motion.div
              className={`h-2 rounded-full ${
                urgencyLevel === "critical"
                  ? "bg-red-500"
                  : urgencyLevel === "warning"
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          className="w-full space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }} 
        >
          {orderItems?.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-6"
              initial={{ x: 50, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4 + index * 0.1, 
                duration: 0.4,
                ease: "easeOut",
              }}
              whileHover={{ y: -2 }}
            >
              <div className="text-left flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Download className="h-5 w-5 text-green-500" />
                  <p className="font-semibold text-lg text-black dark:text-white">{item.productName}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {timeLeft === 0 ? "Download expired" : "Click below to download immediately"}
                </p>
              </div>
              <div className="shrink-0">
                <DownloadButton storeId={item.storeId} productId={item.productId} />
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* Action Button */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black border-2 border-black dark:border-white transition-all duration-300">
              <Link href="/" className="flex items-center justify-center gap-2">
                Continue Shopping
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  →
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-12 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          <motion.p
            className="text-lg font-medium"
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            Thanks for shopping with us!
          </motion.p>
          <motion.p
            className="text-sm mt-2 opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 2.6 }}
          >
            {timeLeft === 0
              ? "Contact support if you need to re-download your files"
              : "Download your files before the timer expires"}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

