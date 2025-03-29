"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, User, Phone, MapPin, Building2, FileText, Loader2 } from 'lucide-react'
import  Button  from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import axios from "axios"
import toast from "react-hot-toast"
import useCart from "@/hooks/use-cart"


interface CashOnDeliveryFormProps {
  isOpen: boolean
  onClose: () => void
}

export const CashOnDeliveryForm = ({
  isOpen,
  onClose
}: CashOnDeliveryFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const items = useCart((state) => state.items)
  const removeAll = useCart((state) => state.removeAll)
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    notes: ""
  })
  
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: ""
  })
  
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "fullName":
        return value.trim() === "" ? "Full name is required" : "";
      case "phoneNumber":
        return value.trim() === "" ? "Phone number is required" : 
               !/^\+?[0-9\s-()]{8,}$/.test(value) ? "Please enter a valid phone number" : "";
      case "address":
        return value.trim() === "" ? "Address is required" : "";
      case "city":
        return value.trim() === "" ? "City is required" : "";
      default:
        return "";
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const errorMessage = validateField(name, value)
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      phoneNumber: validateField("phoneNumber", formData.phoneNumber),
      address: validateField("address", formData.address),
      city: validateField("city", formData.city)
    }
    
    setErrors(newErrors)
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== "")) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Submit order with cash on delivery details
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout/cash`, {
        productsIds: items.map((item) => item.id),
        paymentMethod: "cash_on_delivery",
        deliveryDetails: formData
      })
      
      toast.success("Order placed successfully!")
      removeAll()
      onClose()
      router.push("/thank-you")
    } catch {
      toast.error("Something went wrong with your order.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Delivery Details</DialogTitle>
            <Button 
              onClick={onClose}
              className="h-8 w-8 rounded-full absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Please provide your delivery information
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 h-12 ${errors.fullName ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 h-12 ${errors.phoneNumber ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 h-12 ${errors.address ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                />
              </div>
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 h-12 ${errors.city ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                />
              </div>
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <FileText className="h-4 w-4" />
                </div>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special instructions for delivery"
                  value={formData.notes}
                  onChange={handleChange}
                  className="pl-10 min-h-[100px]"
                  rows={3}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSubmit}
              className="w-full h-12 text-base font-medium rounded-xl mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Order"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
