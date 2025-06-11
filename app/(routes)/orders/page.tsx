"use client"

import dynamic from 'next/dynamic'
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { DownloadButton } from "@/components/ui/download-button"
import Container from "@/components/ui/container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, ShoppingBag, CheckCircle2, XCircle, RefreshCw, Calendar, Package, Coins } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Currency from "@/components/ui/currency"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const DownloadButtonWrapper = dynamic(() => import('@/components/orders/DownloadButtonWrapper'), { ssr: false })

interface OrderItemRaw {
  id: string
  price: number
  productId: string
  product: {
    id: string
    name: string
    storeId: string
  } | null
}

interface Order {
  id: string
  createdAt: string
  isPaid: boolean
  price: number
  orderItems: OrderItemRaw[]
}



export default function OrdersPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        headers: {
          "x-user-id": user.id,
        },
      })
      setOrders(response.data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Unable to fetch your orders. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user?.id])

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
  }

  const getTotalItems = () => orders.reduce((total, order) => total + order.orderItems.length, 0)
  const getTotalSpent = () => orders.reduce((total, order) => total + order.price, 0)

  return (
    <Container>
      <div className="py-8 md:py-12 lg:py-16">
        <div className="text-center mb-12">
          <motion.h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            My Orders
          </motion.h1>
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            Track your purchases and download your digital products
          </motion.p>
        </div>

        {/* Stats */}
        {!isLoading && !error && orders.length > 0 && (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{getTotalItems()}</p>
              <p className="text-sm text-muted-foreground">Items Purchased</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Coins className='h-8 w-8 text-primary mx-auto mb-2'/>
              <Currency value={getTotalSpent()} />
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </motion.div>
        )}

        {/* Render States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border">
              <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
              <p className="text-xl font-semibold mb-2">Loading your orders...</p>
              <p className="text-sm">Please wait a moment while we fetch your data.</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Error Loading Orders</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div key="no-orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border">
              <div className="relative mb-8">
                <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">0</span>
                </div>
              </div>
              <p className="text-3xl font-bold mb-4 text-foreground">No Orders Yet!</p>
              <p className="text-lg text-center max-w-md mb-8 leading-relaxed">
                It looks like you haven&apos;t placed any orders with us yet.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link href="/">
                  <ShoppingBag className="h-5 w-5 mr-2" /> Start Shopping
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div key="orders-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order, index) => {
                  const { date, time } = formatOrderDate(order.createdAt)
                  return (
                    <motion.div key={order.id} className="border border-border rounded-2xl p-6 shadow-lg bg-card" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-foreground mb-1">Order #{order.id.substring(0, 8)}</h2>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{date} at {time}</span>
                          </div>
                        </div>
                        <Badge variant={order.isPaid ? "default" : "secondary"} className={order.isPaid ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"}>
                          {order.isPaid ? <><CheckCircle2 className="h-3 w-3" /> Paid</> : <><XCircle className="h-3 w-3" /> Unpaid</>}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{order.orderItems.length}</p>
                          <p className="text-xs text-muted-foreground">Items</p>
                        </div>
                        <Separator orientation="vertical" className="h-8 bg-border" />
                        <div className="text-center">
                          <Currency value={order.price} />
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>

                      <Separator className="bg-border mb-4" />

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Package className="h-4 w-4" /> Order Details
                        </h3>
                        <ul className="space-y-3">
                          {order.orderItems.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{item.product?.name ?? "Unknown Product"}</p>
                              </div>
                              {item.product && order.isPaid && (
                                <DownloadButtonWrapper storeId={item.product.storeId} productId={item.productId} />
                              )}
                              {item.product && !order.isPaid && (
                                <DownloadButton storeId={item.product.storeId} productId={item.productId} disabled />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  )
}
