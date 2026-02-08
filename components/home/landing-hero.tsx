"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Container from "@/components/ui/container"

export function LandingHero() {
    return (
        <section className="w-full min-h-[90vh] flex items-center bg-background">
            <Container className="px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Typography */}
                    <div className="flex flex-col space-y-8">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95]">
                            Premium
                            <br />
                            Mockups.
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                            High-resolution assets designed for professionals.
                            Smart objects, instant downloads, commercial license included.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center h-14 px-8 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
                            >
                                Browse Collection
                            </Link>
                            <Link
                                href="/category/free"
                                className="inline-flex items-center justify-center h-14 px-8 border-2 border-border font-semibold rounded-full hover:bg-muted transition-colors"
                            >
                                Free Assets <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
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
