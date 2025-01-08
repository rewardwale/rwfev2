import { Skeleton } from "@/components/ui/skeleton";

export default function WatchLoading() {
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header Skeleton */}
      <div className="h-16 px-4 flex items-center justify-between bg-background">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-[400px]" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Video Player Skeleton */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-full">
            <Skeleton className="w-full h-full" />
            
            {/* Controls Skeleton */}
            <div className="absolute inset-0">
              {/* Center Play Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>

              {/* Right Side Controls */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-16 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-4 w-[40%]" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}