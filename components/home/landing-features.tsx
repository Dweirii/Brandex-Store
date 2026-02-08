"use client"

import { ShieldCheck, Zap, MonitorPlay, Layers, Download, Search } from "lucide-react"
import Container from "@/components/ui/container"

const FEATURES = [
    {
        icon: Search,
        title: "Curated Selection",
        description: "Every asset is hand-picked for quality.",
    },
    {
        icon: Layers,
        title: "Smart Objects",
        description: "Drag-and-drop editing with organized layers.",
    },
    {
        icon: MonitorPlay,
        title: "4K Resolution",
        description: "Ultra-high definition for screens and print.",
    },
    {
        icon: Zap,
        title: "Instant Access",
        description: "Secure payment and immediate downloads.",
    },
    {
        icon: ShieldCheck,
        title: "Commercial License",
        description: "Use for client work and portfolios.",
    },
    {
        icon: Download,
        title: "Free Updates",
        description: "Lifetime access to newer versions.",
    },
]

export function LandingFeatures() {
    return (
        <section className="py-24 lg:py-32 bg-background w-full">
            <Container className="px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Why Brandex?</h2>
                    <p className="text-muted-foreground text-lg">Built for quality and professionalism.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
