"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Container from "@/components/ui/container"

const showcaseImages = [
    {
        src: "https://Brandex-cdn.b-cdn.net/Daily/3-Feb-2026/Mockup/Brandex%20Milk%20%26%20Juice%20Box%20Carton%20Mockup744974094.jpeg",
        title: "Carton Packaging",
        category: "Packaging",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        src: "https://Brandex-cdn.b-cdn.net/MOCKUPS/Mockup/Brandex%20drink%20Bottle%20Mockup874497406.jpeg",
        title: "Drink Bottle",
        category: "Mockups",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        src: "https://Brandex-cdn.b-cdn.net/MOCKUPS/Mockups-Rafat/Mobile%20Mockup%209665473357.jpeg",
        title: "App Presentation",
        category: "Digital",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        src: "https://Brandex-cdn.b-cdn.net/PACKAGING/Brandex%2013%20Dec/Cofino%20Ice%20Coffee-673670292/Cofino%20Ice%20Coffee-673670292.jpeg",
        title: "Coffee Series",
        category: "Branding",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        src: "https://Brandex-cdn.b-cdn.net/MOCKUPS/Mockups-Rafat/Sachet%20Mockup%2096654733514.jpeg",
        title: "Sachet Design",
        category: "Packaging",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        src: "https://Brandex-cdn.b-cdn.net/PACKAGING/Brandex%2013%20Dec/Menos%20Melon%20Sugar%20Free%20Packaging339957424/Menos%20Melon%20Sugar%20Free%20Packaging339957424.jpeg",
        title: "Melon Branding",
        category: "Identity",
        span: "md:col-span-2 md:row-span-1",
    },
]

export function LandingShowcase() {
    return (
        <section className="py-24 lg:py-32 bg-secondary/5 w-full">
            <Container className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight mb-2">
                            Featured Work
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Fresh from our studio.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {showcaseImages.map((image, i) => (
                        <div
                            key={i}
                            className={`group relative ${image.span} overflow-hidden rounded-3xl bg-card`}
                        >
                            <Image
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                <span className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">{image.category}</span>
                                <h3 className="font-bold text-white">{image.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
