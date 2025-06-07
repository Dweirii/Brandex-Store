"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, CreditCard, Heart } from "lucide-react"
import { motion } from "framer-motion"
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

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0)

  const onCheckout = async () => {
    if (totalPrice < 0.6) {
      toast.error("Minimum payment amount is $0.60")
      return
    }

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
        },
      )

      window.location.href = response.data.url
    } catch (err) {
      console.error("Checkout Error:", err)
      toast.error("Failed to initiate checkout.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-muted-foreground" /> {/* Changed text-gray-600 to text-muted-foreground */}
        <h2 className="text-lg font-medium text-foreground">Order Summary</h2>{" "}
        {/* Changed text-gray-900 to text-foreground */}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Number of items</span>{" "}
          {/* Changed text-gray-600 to text-muted-foreground */}
          <span className="font-medium text-foreground">{items.length}</span> {/* Added text-foreground */}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span> {/* Changed text-gray-600 to text-muted-foreground */}
          <Currency value={totalPrice} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-primary" fill="currentColor" />{" "}
            {/* Changed text-white to text-primary, fill to currentColor */}
            <span className="text-muted-foreground">Brandex</span>{" "}
            {/* Changed text-gray-600 to text-muted-foreground */}
          </div>
          <span className="font-medium text-foreground">Thank you</span>{" "}
          {/* Changed text-gray-800 to text-foreground */}
        </div>
        <Separator className="my-2 bg-border" /> {/* Added bg-border */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-medium text-foreground">Order Total</div>{" "}
          {/* Changed text-gray-900 to text-foreground */}
          <Currency value={totalPrice} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Button
          onClick={onCheckout}
          className="w-full py-2 rounded-lg text-base font-medium flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 transition"
        >
          {" "}
          {/* Changed bg-black, added text-primary-foreground, hover:bg-primary/90, shadow-primary/20 */}
          <CreditCard className="h-5 w-5 text-primary-foreground" /> {/* Added text-primary-foreground */}
          Proceed to Checkout
        </Button>
        <p className="text-xs text-center text-muted-foreground px-4">
          {" "}
          {/* Changed text-gray-500 to text-muted-foreground */}
          By proceeding to checkout, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </motion.div>
  )
}

export default Summary
