"use client"

import useCart from "@/hooks/use-cart"
import { ShoppingBag, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cart = useCart()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="ml-auto">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <motion.button
          onClick={() => router.push("/cart")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex h-9 lg:h-9 md:h-9 xl:h-9 items-center overflow-hidden rounded-md bg-[#111] shadow-[0_4px_10px_rgba(0,0,0,0.25)] sm:h-14"
          whileTap={{ scale: 0.97 }}
          transition={{
            scale: { duration: 0.1 },
          }}
          aria-label={`Shopping cart with ${cart.items.length} items`}
        >
          <div className="flex h-full items-center justify-center px-2 text-white">
            <motion.div
              animate={{
                rotate: isHovered ? [0, -8, 0] : 0,
              }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 1,
              }}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>

            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={{
                width: isHovered ? "auto" : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{
                width: { duration: 0.2, ease: "easeOut" },
                opacity: { duration: 0.15, ease: "easeOut" },
              }}
            >
              <span className="ml-2 whitespace-nowrap text-xs font-medium">View Cart</span>
            </motion.div>
          </div>

          <div className="flex h-full items-center justify-center px-2">
            <motion.div
              className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black sm:h-6 sm:min-w-6 sm:text-sm"
              initial={false}
              animate={{
                scale: cart.items.length > 0 ? [1, 1.15, 1] : 1,
              }}
              transition={{
                scale: {
                  duration: 0.3,
                  times: [0, 0.5, 1],
                },
              }}
              key={cart.items.length} 
            >
              {cart.items.length}
            </motion.div>
          </div>

          {/* Hover effect line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-white"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>

        {/* Notification dot - only shows when cart has items */}
        {cart.items.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              duration: 0.2,
            }}
          >
            <Plus className="h-2 w-2" />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default NavbarActions
