"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, X } from "lucide-react"
import { useSubscription } from "@/hooks/use-subscription"
import { useAuth } from "@clerk/nextjs"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { SubscriptionModal } from "@/components/modals/subscription-modal"
import { Badge } from "@/components/ui/badge"

export default function PremiumPage() {
    const [open, setOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { isSignedIn } = useAuth()

    // Get storeId directly from env to avoid SSR/render issues
    const storeId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || ""

    const { isActive: isPremium } = useSubscription(storeId, {
        autoRefresh: false
    })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Show loading state during hydration
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
                        <p className="text-muted-foreground mt-4">Store ID is not configured. Please contact support.</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen py-20">
            <SubscriptionModal
                open={open}
                onOpenChange={setOpen}
                storeId={storeId}
            />

            <Container>
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Choose the plan that fits your needs
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "rounded-2xl border bg-card p-8 shadow-sm flex flex-col relative",
                            !isPremium ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                        )}
                    >
                        {!isPremium && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                    Current Plan
                                </Badge>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground">Free</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tight">$0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-4 text-muted-foreground">
                                Perfect for getting started with our collection.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <FeatureItem text="Unlimited Free Downloads" />
                            <FeatureItem text="Download History" />
                            <FeatureItem text="Standard Support" />
                            <FeatureItem text="Premium Assets" included={false} />
                            <FeatureItem text="Commercial License" included={false} />
                        </div>

                        <Button
                            disabled={isPremium}
                            variant="outline"
                            className="w-full h-12 text-lg font-medium"
                            onClick={() => !isSignedIn && (window.location.href = "/sign-in")}
                        >
                            {!isSignedIn ? "Sign In" : !isPremium ? "Current Plan" : "Downgrade"}
                        </Button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={cn(
                            "relative rounded-2xl border-2 bg-card p-8 shadow-xl flex flex-col",
                            isPremium ? "border-green-500 bg-green-500/5" : "border-green-500"
                        )}
                    >
                        {isPremium ? (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                                <Check className="w-4 h-4" />
                                CURRENT PLAN
                            </div>
                        ) : (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                                <Crown className="w-4 h-4" />
                                MOST POPULAR
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                Pro
                            </h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tight">$5</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="mt-4 text-muted-foreground">
                                Unlock the full potential of your creativity.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <FeatureItem text="Everything in Free" />
                            <FeatureItem text="Unlimited Paid Downloads" highlighted />
                            <FeatureItem text="Priority Support" highlighted />
                            <FeatureItem text="Commercial License" />
                            <FeatureItem text="Early Access to New Items" />
                        </div>

                        <Button
                            onClick={() => setOpen(true)}
                            className={cn(
                                "w-full h-12 text-lg font-medium transition-all",
                                isPremium
                                    ? "bg-background text-foreground border border-border hover:bg-muted"
                                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                            )}
                        >
                            {isPremium ? "Manage Subscription" : "Upgrade to Pro"}
                        </Button>
                    </motion.div>
                </div>
            </Container>
        </div>
    )
}

function FeatureItem({ text, included = true, highlighted = false }: { text: string, included?: boolean, highlighted?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            {included ? (
                <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    highlighted ? "bg-green-500 text-white" : "bg-primary/10 text-primary"
                )}>
                    <Check className="h-4 w-4" />
                </div>
            ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <X className="h-4 w-4" />
                </div>
            )}
            <span className={cn(
                "text-sm",
                included ? "text-foreground" : "text-muted-foreground",
                highlighted && "font-semibold text-green-600 dark:text-green-400"
            )}>
                {text}
            </span>
        </div>
    )
}
