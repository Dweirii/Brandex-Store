"use client"

import dynamic from 'next/dynamic'
import axios, { AxiosError } from "axios"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState, useCallback, Suspense } from "react"
import Container from "@/components/ui/container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Download, RefreshCw, Calendar, Package, Filter, DollarSign } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"

const DownloadButtonWrapper = dynamic(() => import('@/components/orders/DownloadButtonWrapper'), { ssr: false })

interface DownloadRecord {
  id: string
  productId: string
  productName: string
  categoryId: string
  categoryName: string
  storeId: string
  isFree: boolean
  createdAt: string
  price: number
  imageUrl: string | null
}

interface Category {
  id: string
  name: string
}

function DownloadsPageContent() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const selectedCategoryId = searchParams.get("category") || ""

  const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Log environment variables in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("Environment check:", {
      hasApiUrl: !!apiUrl,
      apiUrl: apiUrl,
      hasStoreId: !!storeId,
      storeId: storeId,
    })
  }

  const fetchCategories = useCallback(async () => {
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not configured")
      setIsLoadingCategories(false)
      return
    }

    try {
      // Categories endpoint is at /api/[storeId]/categories, so NEXT_PUBLIC_API_URL should include storeId
      const response = await axios.get(`${apiUrl}/categories`)
      setCategories(response.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      // Don't show error for categories, just log it
      if (err instanceof AxiosError && err.response?.status === 404) {
        console.warn("Categories endpoint not found. Category filter will be disabled.")
      }
    } finally {
      setIsLoadingCategories(false)
    }
  }, [apiUrl])

  const fetchDownloads = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      setError("Please sign in to view your downloads.")
      return
    }

    if (!storeId) {
      setIsLoading(false)
      setError("Store ID is not configured. Please check your environment variables.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured")
      }

      const categoryParam = selectedCategoryId ? `?category=${selectedCategoryId}` : ""
      // Match the pattern used for orders - NEXT_PUBLIC_API_URL likely already includes the storeId path
      const fullApiUrl = `${apiUrl}/downloads${categoryParam}`
      console.log("Fetching downloads from:", fullApiUrl)
      console.log("User ID:", user.id)
      console.log("Store ID:", storeId)
      
      const response = await axios.get(fullApiUrl, {
        headers: {
          "x-user-id": user.id,
        },
      })
      const data = response.data; setDownloads(Array.isArray(data) ? data : (data?.downloads || []))
    } catch (err) {
      const error = err as AxiosError<{ message?: string }> | Error
      console.error("Error fetching downloads:", error)
      
      if (error instanceof AxiosError) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          code: error.code,
          isNetworkError: !error.response,
        })
        
        // Handle network errors (no response object)
        if (!error.response) {
          if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
            setError(
              "Cannot connect to the server. Please make sure the API server is running and accessible."
            )
          } else {
            setError("Network error occurred. Please check your connection and try again.")
          }
        } else {
          // Handle HTTP errors
          setError(
            error.response.status === 404
              ? "Downloads endpoint not found. Please check your API configuration."
              : error.response.status === 401
              ? "Please sign in to view your downloads."
              : error.response.status === 500
              ? "Server error occurred. Please try again later."
              : "Unable to fetch your downloads. Please try again later."
          )
        }
      } else {
        // Handle non-Axios errors
        setError(error.message || "An unexpected error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, storeId, selectedCategoryId, apiUrl])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchDownloads()
  }, [fetchDownloads])

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId === "all" || !categoryId) {
      params.delete("category")
    } else {
      params.set("category", categoryId)
    }

    router.push(`?${params.toString()}`)
  }

  const formatDownloadDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
  }

  const getTotalDownloads = () => downloads.length
  const getFreeDownloads = () => downloads.filter((d) => d.isFree).length
  const getPaidDownloads = () => downloads.filter((d) => !d.isFree).length

  return (
    <Container>
      <div className="py-8 md:py-12 lg:py-16">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-4" 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            My Downloads
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto" 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            View and re-download your purchased digital products
          </motion.p>
        </div>

        {/* Subscription Management Card */}
        {(planTier === "STARTER" || planTier === "PRO") && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {planTier === "STARTER" ? "Starter Plan" : "Pro Plan"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.cancelAtPeriodEnd 
                        ? `Cancels ${subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "soon"}`
                        : subscription?.currentPeriodEnd 
                          ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                          : "Active subscription"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/credits')}
                  variant="outline"
                  size="sm"
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        


        {/* Stats */}
        {!isLoading && !error && downloads.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{getTotalDownloads()}</p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{getFreeDownloads()}</p>
              <p className="text-sm text-muted-foreground">Free Downloads</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{getPaidDownloads()}</p>
              <p className="text-sm text-muted-foreground">Paid Downloads</p>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        {!isLoadingCategories && categories.length > 0 && (
          <motion.div 
            className="mb-6 flex justify-end" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategoryId || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* Render States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
            >
              <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
              <p className="text-xl font-semibold mb-2">Loading your downloads...</p>
              <p className="text-sm">Please wait a moment while we fetch your data.</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="space-y-4"
            >
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Error Loading Downloads</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button onClick={fetchDownloads} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : downloads.length === 0 ? (
            <motion.div 
              key="no-downloads" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }} 
              className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
            >
              <div className="relative mb-8">
                <Download className="h-20 w-20 text-muted-foreground/50" />
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">0</span>
                </div>
              </div>
              <p className="text-3xl font-bold mb-4 text-foreground">
                {selectedCategoryId ? "No Downloads in This Category" : "No Downloads Yet!"}
              </p>
              <p className="text-lg text-center max-w-md mb-8 leading-relaxed">
                {selectedCategoryId
                  ? "You haven't downloaded any products from this category yet."
                  : "It looks like you haven't downloaded any products yet. Start shopping to build your collection!"}
              </p>
              {selectedCategoryId ? (
                <Button onClick={() => handleCategoryChange("all")} variant="outline" size="lg">
                  View All Downloads
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link href="/">
                    <Package className="h-5 w-5 mr-2" /> Start Shopping
                  </Link>
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="downloads-list" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {downloads.map((download, index) => {
                  const { date, time } = formatDownloadDate(download.createdAt)
                  return (
                    <motion.div 
                      key={download.id} 
                      className="border border-border rounded-2xl overflow-hidden shadow-lg bg-card hover:shadow-xl transition-shadow" 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {/* Product Image */}
                      {download.imageUrl && (
                        <div className="relative w-full h-48 bg-muted">
                          <Image
                            src={download.imageUrl}
                            alt={download.productName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground mb-2 truncate" title={download.productName}>
                              {download.productName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Calendar className="h-4 w-4" />
                              <span>{date} at {time}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="bg-primary/10 text-primary border-primary/20 mb-2"
                            >
                              {download.categoryName}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="bg-border mb-4" />

                        <div className="flex items-center justify-between">
                          <div>
                            <Badge
                              variant={download.isFree ? "default" : "secondary"}
                              className={
                                download.isFree
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              }
                            >
                              {download.isFree ? (
                                <>
                                  <Package className="h-3 w-3 mr-1" />
                                  Free
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  Premium
                                </>
                              )}
                            </Badge>
                          </div>
                          <DownloadButtonWrapper storeId={download.storeId} productId={download.productId} />
                        </div>
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

export default function DownloadsPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="py-8 md:py-12 lg:py-16">
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border">
              <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
              <p className="text-xl font-semibold mb-2">Loading downloads...</p>
            </div>
          </div>
        </Container>
      }
    >
      <DownloadsPageContent />
    </Suspense>
  )
}
