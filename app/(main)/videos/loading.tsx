import { Skeleton } from "@/components/ui/skeleton";

export default function VideosLoading() {
  return (
    <div className="mt-10 flex flex-1 flex-col gap-6 p-4 !pt-2 md:p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="ring-border/50 bg-muted/20 relative aspect-[9/16] overflow-hidden rounded-2xl ring-1"
          >
            <Skeleton className="absolute inset-0" />
            <div className="absolute right-3 bottom-3 left-3 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
            <div className="absolute top-2 left-2">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
