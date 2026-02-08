import { Metadata } from "next"

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
            {children}
        </div>
    )
}
