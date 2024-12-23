import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block w-64 p-4 border-r">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
          <Skeleton className="h-[1px] w-full my-6" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={`menu-${i}`} className="h-10 w-full" />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {/* Header Skeleton */}
        <div className="h-16 border-b px-4 flex items-center justify-between">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[400px]" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="border-b p-3">
          <div className="flex gap-2 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={`category-${i}`} className="h-8 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Video Grid Skeleton */}
        <div className="p-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={`video-${i}`} className="space-y-3">
                <Skeleton className="aspect-video rounded-lg" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}