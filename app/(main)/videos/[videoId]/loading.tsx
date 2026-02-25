import { Skeleton } from "@/components/ui/skeleton";

export default function VideoDetailLoading() {
  return (
    <div className="bg-background flex h-full flex-col overflow-hidden lg:flex-row">
      {/* Left Column - Preview */}
      <div className="bg-muted/5 border-border/50 flex flex-1 flex-col items-center justify-center border-r p-6 lg:p-10">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="ring-border/50 relative mx-auto aspect-[9/16] max-h-[75vh] w-full max-w-[420px] overflow-hidden rounded-[32px] bg-black shadow-2xl ring-1">
            <Skeleton className="absolute inset-0" />
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="bg-background border-border/50 flex h-full w-full flex-col overflow-y-auto border-l lg:w-[450px]">
        <div className="space-y-10 p-8 md:p-10">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>

          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
