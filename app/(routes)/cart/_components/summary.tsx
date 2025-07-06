"use client"

import Link from "next/link"
import { useEffect, useState } from "react" 
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, CreditCard, Heart, Loader2 } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion" 
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"

import { Button } from "@/components/ui/Button"
import Currency from "@/components/ui/currency"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/use-cart"

const Summary = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.")
      removeAll()
      router.push("/thank-you")
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.")
    }
  }, [searchParams, removeAll, router])

  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0)
/*
  const onPayPalCheckout = async () => {
    if (totalPrice < 0.6) {
      toast.error("Minimum payment amount is $0.60")
      return
    }

    setIsLoading(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paypal/checkout`,
        {
          productIds: items.map((item) => item.id),
          email: user?.emailAddresses[0]?.emailAddress || "guest@brandex.com",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.data?.url) {
        toast.error("Failed to get PayPal redirect URL.")
        return
      }

      window.location.href = response.data.url
    } catch (err) {
      console.error("PayPal Checkout Error:", err)
      toast.error("Failed to initiate PayPal checkout.")
    } finally {
      setIsLoading(false)
    }
  }
*/
  const onCheckout = async () => {
    if (totalPrice < 0.6) {
      toast.error("Minimum payment amount is $0.60")
      return
    }

    setIsLoading(true)
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      window.location.href = response.data.url
    } catch (err) {
      console.error("Checkout Error:", err)
      toast.error("Failed to initiate checkout.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card shadow-2xl px-6 py-8 sm:p-8 lg:col-span-5 lg:mt-0 lg:p-10"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>
      </div>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Number of items</span>
          <span className="font-semibold text-foreground">{items.length}</span>
        </div>
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <Currency value={totalPrice}/>
        </div>
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
            <span className="text-muted-foreground">Brandex Loyalty</span>
          </div>
          <span className="font-semibold text-primary">Thank you!</span>
        </div>
        <Separator className="my-4 bg-border" />
        <div className="flex items-center justify-between pt-2">
          <div className="text-xl font-bold text-foreground">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <Button
          onClick={onCheckout}
          disabled={isLoading}
          className="w-full h-12 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
                Processing...
              </motion.span>
            ) : (
              <motion.span
                key="checkout"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <CreditCard className="h-6 w-6 text-primary-foreground" />
                Proceed to Checkout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <p className="text-xs text-center text-muted-foreground px-4 leading-relaxed">
          By proceeding to checkout, you agree to our{" "}
          <Link href="/terms-of-service" className="underline hover:text-primary">
            terms of service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-primary">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </motion.div>
  )
}

export default Summary
