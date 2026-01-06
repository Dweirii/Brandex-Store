"use client"

import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface SearchCategoryNavProps {
    categories: Category[]
    selectedCategoryId: string
    onCategoryChange: (id: string) => void
}

export default function SearchCategoryNav({
    categories,
    selectedCategoryId,
    onCategoryChange
}: SearchCategoryNavProps) {
    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <div className="overflow-x-auto scrollbar-hide py-4 mb-6">
            <nav className="flex items-center gap-2 min-w-max">
                <button
                    onClick={() => onCategoryChange("all")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border whitespace-nowrap",
                        selectedCategoryId === "all"
                            ? "bg-foreground text-background border-foreground shadow-md"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                    )}
                >
                    All Categories
                </button>
                {categories.map((category) => {
                    const isActive = category.id === selectedCategoryId

                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border whitespace-nowrap",
                                isActive
                                    ? "bg-foreground text-background border-foreground shadow-md"
                                    : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                            )}
                        >
                            {category.name}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
