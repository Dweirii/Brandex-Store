"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { CATEGORY_GROUPS } from "@/lib/category-slugs"

interface CategorySubNavProps {
    groupSlug: string
    currentType?: string
}

export function CategorySubNav({ groupSlug, currentType }: CategorySubNavProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const group = CATEGORY_GROUPS[groupSlug]

    if (!group || group.subtabs.length <= 1) {
        return null
    }

    const handleTabClick = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("type", slug)
        params.delete("page") // Reset page when changing sub-category
        router.push(`/category/${groupSlug}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 mt-2 mb-6 border-b border-border/50 pb-px overflow-x-auto scrollbar-hide">
            {group.subtabs.map((tab) => {
                const isActive = currentType === tab.slug || (!currentType && group.subtabs[0].slug === tab.slug)

                return (
                    <button
                        key={tab.slug}
                        onClick={() => handleTabClick(tab.slug)}
                        className={cn(
                            "px-5 py-3 text-[13px] font-bold transition-all duration-300 relative whitespace-nowrap",
                            isActive
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}
