"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"
import { Download, AlertCircle, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

interface DownloadUsageProps {
  storeId: string
  planTier?: string
  className?: string
}

interface DownloadStats {
  count: number
  limit: number | null
  remaining: number | null
}

export function DownloadUsage({ storeId, planTier, className }: DownloadUsageProps) {
  const { getToken } = useAuth()
  const [stats, setStats] = useState<DownloadStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      console.log("[DownloadUsage] Fetching stats for STARTER plan user")
      try {
        const token = await getToken({ template: "CustomerJWTBrandex" })
        if (!token) {
          console.log("[DownloadUsage] No token available")
          return
        }

        const adminBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com"
        const baseUrl = adminBaseUrl.match(/https?:\/\/[^/]+/)?.[0] || adminBaseUrl

        console.log("[DownloadUsage] Fetching from:", `${baseUrl}/api/${storeId}/downloads`)

        const response = await fetch(`${baseUrl}/api/${storeId}/downloads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("[DownloadUsage] Response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[DownloadUsage] Response data:", data)
          if (data.monthlyStats) {
            console.log("[DownloadUsage] Monthly stats:", data.monthlyStats)
            setStats(data.monthlyStats)
          } else {
            console.log("[DownloadUsage] No monthlyStats in response")
          }
        } else {
          console.error("[DownloadUsage] Response not OK:", response.status)
        }
      } catch (error) {
        console.error("[DownloadUsage] Failed to fetch download stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch for STARTER plan users
    if (planTier === "STARTER") {
      console.log("[DownloadUsage] Plan tier is STARTER, fetching stats")
      fetchStats()
    } else {
      console.log("[DownloadUsage] Plan tier is not STARTER:", planTier)
      setIsLoading(false)
    }
  }, [storeId, planTier, getToken])

  // Don't show for FREE or PRO plans
  if (planTier !== "STARTER") {
    return null
  }

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-muted-foreground animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const { count, limit, remaining } = stats
  const percentage = limit ? (count / limit) * 100 : 0
  const isNearLimit = remaining !== null && remaining <= 5
  const isAtLimit = remaining === 0

  return (
    <Card className={`p-4 ${className} ${isAtLimit ? 'border-destructive' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className={`h-5 w-5 ${isAtLimit ? 'text-destructive' : 'text-primary'}`} />
            <span className="font-semibold">Monthly Downloads</span>
          </div>
          <Badge variant={isAtLimit ? "destructive" : "secondary"}>
            {planTier === "STARTER" ? "Starter" : planTier === "PRO" ? "Pro" : "Free"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">This month</span>
            <span className="font-medium">
              {count}/{limit} used
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className={`h-2 ${isAtLimit ? '[&>div]:bg-destructive' : ''}`}
          />

          <div className="flex items-center justify-between text-xs">
            <span className={isNearLimit ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
              {remaining !== null ? (
                isAtLimit ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Limit reached
                  </span>
                ) : (
                  `${remaining} remaining`
                )
              ) : (
                'Unlimited'
              )}
            </span>
            <span className="text-muted-foreground">
              Resets on 1st of month
            </span>
          </div>
        </div>

        {isAtLimit && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              You&apos;ve reached your monthly limit. Upgrade to Pro for unlimited downloads.
            </p>
            <Link href="/?subscription=true">
              <Button size="sm" variant="default" className="w-full">
                <TrendingUp className="h-3 w-3 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <p className="text-xs text-orange-600">
            ⚠️ Only {remaining} downloads remaining this month
          </p>
        )}
      </div>
    </Card>
  )
}
