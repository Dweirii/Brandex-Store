"use client"

import { X, CreditCard, Truck } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import  Button  from "@/components/ui/Button"

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCashOnDelivery: () => void;
  onSelectCardPayment: () => void; // ✅ هذا هو المطلوب
}




export const PaymentModal = ({
  isOpen,
  onClose,
  onSelectCashOnDelivery,
  onSelectCardPayment,
}: PaymentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
            <DialogTitle className="text-xl font-semibold">
            Select Payment Method
            </DialogTitle>
            <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
            </button>
            <div className="grid gap-4 py-4 rounded-2xl">
            <Button
                onClick={onSelectCashOnDelivery}
                className="flex items-center justify-start gap-3 h-16 text-lg bg-gray-200 rounded-2xl"
            >
                <Truck className="h-6 w-6 text-black" />
                <span className="text-black">Cash on Delivery</span>
            </Button>
            
            <div className="relative">
            <Button
  onClick={onSelectCardPayment}
  className="flex items-center justify-start gap-3 h-16 text-lg w-full bg-black hover:bg-gray-900 rounded-2xl"
>
  <CreditCard className="h-6 w-6 text-white" />
  <span className="text-white">Visa / MasterCard</span>
</Button>


                <p className="text-sm text-muted-foreground mt-1 ml-1">
                💳 Visa payments will be available soon.
                </p>
            </div>
            </div>
        </DialogContent>
    </Dialog>

  )
}
