"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Container from "@/components/ui/container"

export function LandingCTA() {
    return (
        <section className="py-24 lg:py-32 bg-secondary/5 w-full">
            <Container className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Ready to elevate your designs?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of designers who trust Brandex for their professional work.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground font-semibold text-lg rounded-full hover:opacity-90 transition-opacity"
                    >
                        Browse All Products <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </Container>
        </section>
    )
}
