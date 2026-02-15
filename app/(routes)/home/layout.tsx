import { Metadata } from "next"
import { HomeNavbar } from "@/components/home/home-navbar"

export const metadata: Metadata = {
    title: "Brandex - Premium Design Assets & Mockups",
    description: "Elevate your creative projects with high-resolution mockups, packaging designs, and vector assets.",
}

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <HomeNavbar />
            {children}
        </div>
    )
}
