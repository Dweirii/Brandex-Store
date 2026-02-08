"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import Container from "@/components/ui/container"

export function LandingDetails() {
    return (
        <section className="py-24 lg:py-32 bg-background w-full">
            <Container className="px-4 sm:px-6 lg:px-8">
                <div className="space-y-32">

                    {/* Feature 1 */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                            <Image
                                src="https://Brandex-cdn.b-cdn.net/MOCKUPS/Mockup/Brandex%20drink%20Bottle%20Mockup874497406.jpeg"
                                alt="High Resolution Details"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Every pixel matters.
                            </h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our mockups are crafted in 4K resolution. Whether you&apos;re presenting to a client or printing a portfolio, the quality remains pristine.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {["8000x8000px", "300 DPI Ready", "Close-up Textures", "Color Calibrated"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-6">
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Smart Objects.
                                <br />Simple Workflow.
                            </h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Forget complex manual warping. Just double click, paste your design, and save. It wraps perfectly in seconds.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {["Drag & Drop", "Auto Perspective", "Organized Layers", "Separate Shadows"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative aspect-square rounded-3xl overflow-hidden bg-muted">
                            <Image
                                src="https://Brandex-cdn.b-cdn.net/Daily/3-Feb-2026/Mockup/Brandex%20Milk%20%26%20Juice%20Box%20Carton%20Mockup744974100.jpeg"
                                alt="Smart Object Workflow"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    )
}
