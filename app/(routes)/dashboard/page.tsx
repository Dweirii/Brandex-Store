"use client"

import { useEffect, useState, Suspense } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import Link from "next/link"
import {
  Coins,
  Download,
  Package,
  ShoppingBag,
  Check,
  Loader2,
  Plus,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCredits } from "@/hooks/use-credits"
import ProductCard from "@/components/ui/product-card"
import type { Product } from "@/types"

interface DownloadRecord {
  id: string
  productId: string
  productSlug?: string
  productName: string
  categoryId: string
  categoryName: string
  storeId: string
  isFree: boolean
  createdAt: string
  price: number
  imageUrl: string | null
}

const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""
const TABS = ["All", "Mockup", "Packaging", "Images", "Video"]

function DashboardContent() {
  const { user } = useUser()
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [dlLoading, setDlLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const [mounted, setMounted] = useState(false)

  const { balance, isLoading: creditsLoading, purchases } = useCredits(storeId)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!user?.id) return

    setDlLoading(true)
    axios
      .get(`/api/downloads`, { headers: { "x-user-id": user.id } })
      .then((res) => {
        const data = res.data
        setDownloads(Array.isArray(data) ? data : data?.downloads ?? [])
      })
      .catch(() => {})
      .finally(() => setDlLoading(false))
  }, [user?.id])

  const totalDownloads = downloads.length
  const freeDownloads = downloads.filter((d) => d.isFree).length
  const premiumDownloads = downloads.filter((d) => !d.isFree).length
  const recentPurchases = purchases.slice(0, 5)
  const recentDownloads = downloads.slice(0, 5)

  const activeDownloads = downloads.filter((d) => d.imageUrl)

  const filteredFiles =
    activeTab === "All"
      ? activeDownloads
      : activeDownloads.filter((d) =>
          d.categoryName?.toLowerCase().includes(activeTab.toLowerCase())
        )

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  if (!mounted || !isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isSignedIn) return null

  return (
    <div className="py-4 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to your dashboard, {user?.firstName ?? "there"}!
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Manage your account, credits, and download history from here.
        </p>
      </div>

      {/* Credits card + stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Credits balance */}
        <div className="lg:col-span-1 bg-primary rounded-xl px-5 py-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 mb-1">
            Credits Available
          </p>
          <p className="text-2xl font-bold mb-2">
            {creditsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              balance
            )}
          </p>
          <p className="text-[11px] opacity-70 mb-3">
            You have {creditsLoading ? "…" : balance} credits available.
          </p>
          <Link
            href="/credits"
            className="inline-flex items-center gap-1.5 bg-white text-primary text-[11px] font-semibold px-2.5 py-1 rounded-md hover:bg-white/90 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Buy Credits
          </Link>
        </div>

        {/* Download stats */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-1.5">
              <Download className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold">{dlLoading ? "—" : totalDownloads}</p>
            <p className="text-[11px] text-muted-foreground">Total Downloads</p>
          </div>
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-1.5">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold">{dlLoading ? "—" : freeDownloads}</p>
            <p className="text-[11px] text-muted-foreground">Free Downloads</p>
          </div>
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-1.5">
              <Coins className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold">{dlLoading ? "—" : premiumDownloads}</p>
            <p className="text-[11px] text-muted-foreground">Premium Downloads</p>
          </div>
        </div>
      </div>

      {/* My Files */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-bold text-xl">My Files</h2>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {dlLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No files found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((d) => {
              const product: Product = {
                id: d.productId,
                slug: d.productSlug,
                storeId: d.storeId,
                name: d.productName,
                price: String(d.price),
                isFeatured: false,
                keywords: [],
                images: d.imageUrl ? [{ id: d.productId, url: d.imageUrl }] : [],
                category: {
                  id: d.categoryId,
                  name: d.categoryName,
                  billboard: { id: "", label: "", imageUrl: "" },
                },
              }
              return <ProductCard key={d.id} data={product} />
            })}
          </div>
        )}
      </div>

      {/* Recent Purchases + Recent Downloads */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Recent Purchases</h2>
          </div>
          <div className="space-y-4">
            {creditsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : recentPurchases.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No purchases yet
              </p>
            ) : (
              recentPurchases.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.amount} Credits</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${p.price}</p>
                    <p
                      className={cn(
                        "text-xs flex items-center gap-1 justify-end",
                        p.status === "COMPLETED"
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {p.status === "COMPLETED" ? (
                        <>
                          <Check className="h-3 w-3" /> COMPLETED
                        </>
                      ) : (
                        <span className="text-destructive">✕ FAILED</span>
                      )}
                    </p>
                    {p.status !== "COMPLETED" && (
                      <Link
                        href="/credits"
                        className="text-[10px] text-primary hover:underline"
                      >
                        Retry purchase →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Downloads */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Recent Downloads</h2>
            </div>
            <Link
              href="/downloads"
              className="text-xs text-primary hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {dlLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : recentDownloads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No downloads yet
              </p>
            ) : (
              recentDownloads.map((d) => (
                <Link
                  key={d.id}
                  href={`/products/${d.productSlug ?? d.productId}`}
                  className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-colors"
                >
                  {d.imageUrl ? (
                    <ImageWithFallback
                      src={d.imageUrl}
                      alt={d.productName}
                      fallbackSeed={d.productName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{d.productName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary">
                      {d.isFree ? "Free" : `${d.price} credits`}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
