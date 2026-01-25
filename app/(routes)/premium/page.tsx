"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, X } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { useAuth, useUser } from "@clerk/nextjs"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { createSubscriptionCheckout } from "@/lib/subscription-api-client"
import toast from "react-hot-toast"

export default function PremiumPage() {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
    const [loading, setLoading] = useState<string | null>(null)
    const { isSignedIn, getToken } = useAuth()
    const { user } = useUser()

    const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "a940170f-71ea-4c2b-b0ec-e2e9e3c68567"

    const { isActive: isPremium } = useSubscription(storeId, {
        autoRefresh: false
    })

    // Pricing
    const starterPrice = parseFloat(process.env.NEXT_PUBLIC_STARTER_PLAN_PRICE || "4.99")
    const proMonthlyPrice = parseFloat(process.env.NEXT_PUBLIC_PRO_MONTHLY_PRICE || "14.99")
    const proYearlyPrice = parseFloat(process.env.NEXT_PUBLIC_PRO_YEARLY_PRICE || "149.00")
    const proYearlySavings = (proMonthlyPrice * 12 - proYearlyPrice).toFixed(0)

    // Price IDs
    const starterMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID
    const proMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
    const proYearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleSubscribe = async (planTier: "STARTER" | "PRO", interval: "monthly" | "yearly" = "monthly") => {
        if (!isSignedIn || !user) {
            window.location.href = "/sign-in"
            return
        }

        setLoading(planTier)

        try {
            const token = await getToken({ template: "CustomerJWTBrandex" })
            if (!token) {
                toast.error("Authentication failed")
                return
            }

            let priceId: string | undefined
            if (planTier === "STARTER") {
                priceId = starterMonthlyPriceId
            } else if (planTier === "PRO") {
                priceId = interval === "monthly" ? proMonthlyPriceId : proYearlyPriceId
            }

            if (!priceId) {
                toast.error("Pricing not configured")
                return
            }

            const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || ""
            const checkoutUrl = await createSubscriptionCheckout(storeId, priceId, email, token)
            window.location.href = checkoutUrl
        } catch (error) {
            console.error("Subscription error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to start checkout")
        } finally {
            setLoading(null)
        }
    }

    if (!isMounted) {
        return (
            <div className="bg-background min-h-screen py-20">
                <Container>
                    <div className="text-center">
                        <div className="animate-pulse space-y-8">
                            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
                            <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (!storeId) {
        return (
            <div className="bg-background min-h-screen py-20">
                <Container>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
                        <p className="text-muted-foreground mt-4">Store ID is not configured.</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen py-20">
            <Container>
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold tracking-tight mb-4">
                            Simple Pricing
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the plan that works for you
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={cn(
                            "rounded-xl border bg-card p-8 flex flex-col relative",
                            !isPremium ? "border-primary/50" : "border-border"
                        )}
                    >
                        {!isPremium && (
                            <Badge variant="outline" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background">
                                Current
                            </Badge>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Free</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                For exploring our collection
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <Feature text="Free products only" />
                            <Feature text="Standard resolution" />
                            <Feature text="Download history" />
                            <Feature text="Premium downloads" included={false} />
                        </ul>

                        <Button variant="outline" disabled className="w-full">
                            {!isPremium ? "Current Plan" : "Downgrade"}
                        </Button>
                    </motion.div>

                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-xl border border-border bg-card p-8 flex flex-col relative hover:border-primary/50 transition-colors"
                    >
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Starter</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">${starterPrice}</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                For regular users
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <Feature text="25 premium downloads/month" />
                            <Feature text="Full resolution" />
                            <Feature text="All categories" />
                            <Feature text="Download history" />
                        </ul>

                        <Button
                            onClick={() => handleSubscribe("STARTER", "monthly")}
                            disabled={loading === "STARTER"}
                            className="w-full"
                        >
                            {loading === "STARTER" ? "Loading..." : "Get Started"}
                        </Button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="rounded-xl border-2 border-primary bg-card p-8 flex flex-col relative shadow-lg"
                    >
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Crown className="h-3 w-3 mr-1" />
                            Recommended
                        </Badge>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Crown className="h-5 w-5 text-primary" />
                                Pro
                            </h3>

                            {/* Interval Toggle */}
                            <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
                                <button
                                    onClick={() => setSelectedPlan("monthly")}
                                    className={cn(
                                        "flex-1 px-3 py-1.5 rounded text-sm font-medium transition",
                                        selectedPlan === "monthly" 
                                            ? "bg-primary text-primary-foreground" 
                                            : "hover:bg-background"
                                    )}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setSelectedPlan("yearly")}
                                    className={cn(
                                        "flex-1 px-3 py-1.5 rounded text-sm font-medium transition",
                                        selectedPlan === "yearly" 
                                            ? "bg-primary text-primary-foreground" 
                                            : "hover:bg-background"
                                    )}
                                >
                                    Yearly
                                </button>
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold">
                                    ${selectedPlan === "monthly" ? proMonthlyPrice : proYearlyPrice}
                                </span>
                                <span className="text-muted-foreground">
                                    /{selectedPlan === "monthly" ? "mo" : "yr"}
                                </span>
                            </div>
                            {selectedPlan === "yearly" && (
                                <p className="text-sm text-primary font-medium mb-4">
                                    Save ${proYearlySavings}/year
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                For professionals
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <Feature text="Unlimited downloads" />
                            <Feature text="Commercial license" />
                            <Feature text="PSD + Smart Objects" />
                            <Feature text="Early access" />
                            <Feature text=" 7-day free trial" />
                            <Feature text="Cancel anytime" />
                        </ul>

                        <Button
                            onClick={() => handleSubscribe("PRO", selectedPlan)}
                            disabled={loading === "PRO"}
                            className="w-full"
                        >
                            {loading === "PRO" ? "Loading..." : "Get Started"}
                        </Button>
                    </motion.div>
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-24"
                >
                    <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
                    
                    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-6 font-semibold text-foreground">Features</th>
                                    <th className="text-center p-6 font-semibold text-foreground w-1/4">Free</th>
                                    <th className="text-center p-6 font-semibold text-foreground w-1/4">Starter</th>
                                    <th className="text-center p-6 font-semibold text-foreground w-1/4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Crown className="h-4 w-4 text-primary" />
                                            Pro
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableSection title="Downloads" />
                                <TableRow 
                                    feature="Free product downloads" 
                                    free={true} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Premium downloads per month" 
                                    free="—" 
                                    starter="25" 
                                    pro="Unlimited" 
                                />
                                <TableRow 
                                    feature="Download history & tracking" 
                                    free={true} 
                                    starter={true} 
                                    pro={true} 
                                />
                                
                                <TableSection title="Resolution & Quality" />
                                <TableRow 
                                    feature="Standard resolution" 
                                    free={true} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Full high-resolution assets" 
                                    free={false} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="PSD files with layers" 
                                    free={false} 
                                    starter={false} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Smart Objects" 
                                    free={false} 
                                    starter={false} 
                                    pro={true} 
                                />
                                
                                <TableSection title="License & Usage" />
                                <TableRow 
                                    feature="Personal use license" 
                                    free={true} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Commercial use license" 
                                    free={false} 
                                    starter={false} 
                                    pro={true} 
                                />
                                
                                <TableSection title="Content Access" />
                                <TableRow 
                                    feature="All product categories" 
                                    free="Free only" 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Premium & exclusive content" 
                                    free={false} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Early-release products" 
                                    free={false} 
                                    starter={false} 
                                    pro={true} 
                                />
                                
                                <TableSection title="Support" />
                                <TableRow 
                                    feature="Community support" 
                                    free={true} 
                                    starter={true} 
                                    pro={true} 
                                />
                                <TableRow 
                                    feature="Priority email support" 
                                    free={false} 
                                    starter={false} 
                                    pro={true} 
                                />
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Manage Subscription Link */}
                {isPremium && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12"
                    >
                        <a href="/downloads" className="text-sm text-primary hover:underline">
                            Manage your subscription →
                        </a>
                    </motion.div>
                )}
            </Container>
        </div>
    )
}

function Feature({ text, included = true }: { text: string; included?: boolean }) {
    return (
        <li className="flex items-center gap-2 text-sm">
            {included ? (
                <Check className="h-4 w-4 text-primary shrink-0" />
            ) : (
                <X className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={included ? "text-foreground" : "text-muted-foreground"}>
                {text}
            </span>
        </li>
    )
}

function TableSection({ title }: { title: string }) {
    return (
        <tr className="bg-muted/30">
            <td colSpan={4} className="p-4 font-semibold text-sm text-foreground">
                {title}
            </td>
        </tr>
    )
}

function TableRow({ 
    feature, 
    free, 
    starter, 
    pro 
}: { 
    feature: string
    free: boolean | string
    starter: boolean | string
    pro: boolean | string
}) {
    const renderCell = (value: boolean | string, highlight = false) => {
        if (typeof value === "boolean") {
            return (
                <div className="flex justify-center">
                    {value ? (
                        <Check className={cn("h-5 w-5", highlight ? "text-primary" : "text-primary/70")} />
                    ) : (
                        <X className="h-5 w-5 text-muted-foreground/40" />
                    )}
                </div>
            )
        }
        return (
            <span className={cn(
                "text-sm font-medium",
                highlight ? "text-primary" : "text-foreground"
            )}>
                {value}
            </span>
        )
    }

    return (
        <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
            <td className="p-4 text-sm text-foreground">{feature}</td>
            <td className="p-4 text-center">{renderCell(free)}</td>
            <td className="p-4 text-center">{renderCell(starter)}</td>
            <td className="p-4 text-center bg-primary/5">{renderCell(pro, true)}</td>
        </tr>
    )
}
