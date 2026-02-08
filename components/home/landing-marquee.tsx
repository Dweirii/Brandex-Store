"use client"

import { motion } from "framer-motion"

const BRANDS = [
    "ADOBE PHOTOSHOP",
    "FIGMA",
    "SKETCH",
    "4K RESOLUTION",
    "SMART OBJECTS",
    "COMMERCIAL LICENSE",
]

export function LandingMarquee() {
    return (
        <div className="w-full overflow-hidden bg-secondary/10 border-y border-border py-8">
            <div className="flex">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 25 }}
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {BRANDS.map((brand, index) => (
                                <div key={index} className="flex items-center mx-8">
                                    <span className="text-2xl font-bold text-muted-foreground/30">
                                        {brand}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
