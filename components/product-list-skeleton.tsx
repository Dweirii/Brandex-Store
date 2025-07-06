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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl bg-gray-500" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-500" />
              <Skeleton className="h-4 w-1/2 bg-gray-500" />
              <Skeleton className="h-6 w-1/3 bg-gray-500" />
            </div>
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
