import { Skeleton } from "@/components/ui/skeleton"

interface ProductListSkeletonProps {
  title: string
  itemCount?: number
}

export function ProductListSkeleton({ title, itemCount = 12 }: ProductListSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold">{title}</h3>
        <Skeleton className="h-4 w-24 bg-gray-500" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4 sm:mb-6">
            <Skeleton className="aspect-[4/3] w-full rounded-xl bg-gray-500" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2 pt-8">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
