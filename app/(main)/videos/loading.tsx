import { Skeleton } from "@/components/ui/skeleton";

export default function VideosLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 !pt-2 mt-10">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="aspect-[9/16] relative rounded-2xl overflow-hidden ring-1 ring-border/50 bg-muted/20">
                        <Skeleton className="absolute inset-0" />
                        <div className="absolute bottom-3 left-3 right-3 space-y-2">
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
