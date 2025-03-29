"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ShoppingBag, CreditCard, Truck } from "lucide-react"
import { motion } from "framer-motion"

import Button from "@/components/ui/Button"
import Currency from "@/components/ui/currency"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/use-cart"
import toast from "react-hot-toast"
import { PaymentModal } from "@/components/payment-modal"
import { CashOnDeliveryForm } from "@/components/cash-on-delivery-form"

const Summary = () => {
  const searchParams = useSearchParams()

  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDeliveryFormOpen, setIsDeliveryFormOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.")
      removeAll()
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.")
    }
  }, [searchParams, removeAll])

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0)

  const onCheckout = () => {
    setIsPaymentModalOpen(true)
  }

  const handleSelectCashOnDelivery = () => {
    setIsPaymentModalOpen(false)
    setIsDeliveryFormOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Number of items</span>
            <span className="font-medium">{items.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <Currency value={totalPrice} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Shipping</span>
            </div>
            <span className="font-medium text-gray-800">Calculated at checkout</span>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between pt-2">
            <div className="text-base font-medium text-gray-900">Order Total</div>
            <Currency value={totalPrice}  />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={onCheckout}
            className="w-full py-2 rounded-lg text-base font-medium flex items-center justify-center gap-2 bg-black md:bg-black sm:bg-black transition-all hover:shadow-md"

          >
            <CreditCard className="h-5 w-5" />
            Proceed to Checkout
          </Button>

          <p className="text-xs text-center text-gray-500 px-4">
            By proceeding to checkout, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectCashOnDelivery={handleSelectCashOnDelivery}
      />

      <CashOnDeliveryForm isOpen={isDeliveryFormOpen} onClose={() => setIsDeliveryFormOpen(false)} />
    </>
  )
}

export default Summary

