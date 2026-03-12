"use client"

import Image from "next/image"
import Link from "next/link"
import { Zap, LayoutGrid, ShieldCheck } from "lucide-react"
import Container from "@/components/ui/container"

const trustBadges = [
    { icon: Zap,         label: "Instant download" },
    { icon: LayoutGrid,  label: "Layered PSD" },
    { icon: ShieldCheck, label: "Commercial license" },
]

export function LandingHero() {
    return (
        <section className="w-full min-h-[90vh] flex items-center bg-background">
            <Container className="px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Typography */}
                    <div className="flex flex-col space-y-8">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95]">
                            Real assets.
                            <br />
                            Real deadlines.
                            <br />
                            Real results.
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                            Mockups, packaging, vectors, photos and motion — professionally crafted and ready to use today. Stop searching. Start creating.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                Explore Assets
                            </Link>
                            <Link
                                href="/credits"
                                className="inline-flex items-center justify-center h-14 px-8 border-2 border-border font-semibold rounded-full hover:bg-muted transition-colors"
                            >
                                See Pricing
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
                            {trustBadges.map(({ icon: Icon, label }, i) => (
                                <div key={label} className="flex items-center gap-2">
                                    {i > 0 && (
                                        <span className="w-px h-5 bg-border shrink-0" />
                                    )}
                                    <Icon className="h-5 w-5 text-primary shrink-0" strokeWidth={2} />
                                    <span className="text-sm font-medium text-foreground">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust line */}
                        <p className="text-sm text-muted-foreground">
                            Ready to use&nbsp;&bull;&nbsp;Easy to customize&nbsp;&bull;&nbsp;Commercial-ready
                        </p>
                    </div>

                    {/* Right: Image */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                        <Image
                            src="https://Brandex-cdn.b-cdn.net/Daily/3-Feb-2026/Mockup/Brandex%20Can%20330ml%20Mockup744974081.jpeg"
                            alt="Brandex Soda Can Mockup"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                </div>
            </Container>
        </section>
    )
}
