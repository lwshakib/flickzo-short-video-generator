"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Play, Clock, AlertCircle, CheckCircle2, Video as VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { videoStyles } from "@/lib/data";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";

export function VideosGrid({ initialVideos }: { initialVideos: any[] }) {
    const [videos, setVideos] = useState(initialVideos);

    const fetchVideos = async () => {
        try {
            const res = await axios.get("/api/videos/recent?take=50"); // Fetch more for the library
            setVideos(res.data);
        } catch (err) {
            console.error("Failed to fetch videos", err);
        }
    };

    const { latestData } = useInngestSubscription({
        refreshToken: fetchRealtimeSubscriptionToken,
    });

    useEffect(() => {
        if (latestData) {
            fetchVideos();
        }
    }, [latestData]);

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 gap-4">
                <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <VideoIcon className="size-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold">No videos yet</h3>
                    <p className="text-muted-foreground">Create your first cinematic video to see it here.</p>
                </div>
                <Link href="/create-video">
                    <Card className="px-6 py-3 bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform cursor-pointer border-none shadow-xl shadow-primary/20">
                        Create Video
                    </Card>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}

export function VideoCard({ video }: { video: any }) {
    const styleData = videoStyles.find((s) => s.label === video.videoStyle);

    return (
        <Link href={`/videos/${video.id}`}>
            <Card className="group relative overflow-hidden rounded-2xl border-none ring-1 ring-border/50 bg-muted/20 hover:ring-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 p-0">
                <div className="aspect-[9/16] relative overflow-hidden bg-black">
                    {video.images && video.images.length > 0 ? (
                        <img
                            src={(video.images[0] as any).url}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                        />
                    ) : (
                        <img
                            src={styleData?.src}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 grayscale"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute top-2 left-2">
                        <StatusBadge status={video.status} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <h3 className="font-bold text-white text-[10px] leading-tight line-clamp-2 uppercase tracking-tight">
                            {video.title}
                        </h3>
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="size-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play className="size-5 fill-current translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "COMPLETED":
            return (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    <CheckCircle2 className="size-2.5 mr-1" /> Ready
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    <Clock className="size-2.5 mr-1 animate-pulse" /> Processing
                </Badge>
            );
        case "FAILED":
            return (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    <AlertCircle className="size-2.5 mr-1" /> Failed
                </Badge>
            );
        default:
            return null;
    }
}
