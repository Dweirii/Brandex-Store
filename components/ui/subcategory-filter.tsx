"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Subcategory {
  id: string;
  name: string;
  productCount: number;
}

interface SubcategoryFilterProps {
  subcategories: Subcategory[];
}

export const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({
  subcategories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedSubcategories = searchParams.get("subcategories")?.split(",") || [];

  const toggleSubcategory = (subcategoryId: string) => {
    const params = new URLSearchParams(searchParams);
    
    let newSelected: string[];
    if (selectedSubcategories.includes(subcategoryId)) {
      // Remove from selection
      newSelected = selectedSubcategories.filter(id => id !== subcategoryId);
    } else {
      // Add to selection
      newSelected = [...selectedSubcategories, subcategoryId];
    }

    if (newSelected.length > 0) {
      params.set("subcategories", newSelected.join(","));
    } else {
      params.delete("subcategories");
    }

    // Reset to page 1 when filtering changes
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("subcategories");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Refine by Subcategory:</h3>
        {selectedSubcategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {subcategories.map((subcategory) => {
          const isSelected = selectedSubcategories.includes(subcategory.id);
          
          return (
            <button
              key={subcategory.id}
              onClick={() => toggleSubcategory(subcategory.id)}
              className={cn(
                "px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50 bg-background hover:bg-muted"
              )}
            >
              {subcategory.name}
              <span className="ml-2 text-xs opacity-75">
                ({subcategory.productCount})
              </span>
            </button>
          );
        })}
      </div>
      
      {selectedSubcategories.length > 0 && (
        <div className="mt-3 text-xs text-muted-foreground">
          Showing products in {selectedSubcategories.length} subcategor{selectedSubcategories.length === 1 ? "y" : "ies"}
        </div>
      )}
    </div>
  );
};
