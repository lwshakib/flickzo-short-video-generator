import { Skeleton } from "@/components/ui/skeleton";

export default function VideoDetailLoading() {
    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-background">
            {/* Left Column - Preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-muted/5 border-r border-border/50">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    <div className="relative aspect-[9/16] max-h-[75vh] w-full max-w-[420px] mx-auto rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-border/50 bg-black">
                        <Skeleton className="absolute inset-0" />
                    </div>
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full lg:w-[450px] flex flex-col bg-background h-full overflow-y-auto border-l border-border/50">
                <div className="p-8 md:p-10 space-y-10">
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
