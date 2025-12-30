"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    Clock,
    Video as VideoIcon,
    Sparkles,
    Mic2,
    Palette,
    FileText,
    ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import RemotionPlayer from "@/components/remotion-player";
import { VideoControls } from "@/components/video-controls";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";

export function VideoDetailsView({ initialVideo, voiceData }: { initialVideo: any; voiceData: any }) {
    const [video, setVideo] = useState(initialVideo);
    const router = useRouter();

    const fetchVideo = async () => {
        try {
            // We can use a simple GET endpoint or refetch from the current page data
            // For simplicity, let's refresh the router or fetch the specific video
            const res = await axios.get(`/api/videos/${video.id}`);
            if (res.data) {
                setVideo(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch video", err);
        }
    };

    const { latestData } = useInngestSubscription({
        refreshToken: fetchRealtimeSubscriptionToken,
    });

    useEffect(() => {
        if (latestData && latestData.data.videoId === video.id) {
            fetchVideo();
        }
    }, [latestData]);

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-background">
            {/* Left Column - Preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-muted/5 border-r border-border/50">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <Link href="/videos" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Videos
                        </Link>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                                {video.status === 'COMPLETED' ? 'GENERATED' : video.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="relative aspect-[9/16] max-h-[75vh] mx-auto rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-border/50 bg-black">
                        {video.status === "COMPLETED" ? (
                            <RemotionPlayer videoData={video} />
                        ) : video.status === "FAILED" ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-12 text-center text-muted-foreground">
                                <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <VideoIcon className="size-10 text-red-500/40" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Generation Failed</h3>
                                <p className="text-sm font-medium">Something went wrong while casting your masterpiece. Please try creating it again.</p>
                                <div className="w-full max-w-[200px] mt-4">
                                    <VideoControls videoId={video.id} status={video.status} />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center">
                                <div className="size-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase">Architecting...</h3>
                                    <p className="text-muted-foreground text-sm font-medium">Sit tight, your cinematic short is being synthesized by our AI core.</p>
                                </div>
                                <div className="w-full max-w-[200px]">
                                    <VideoControls videoId={video.id} status={video.status} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full lg:w-[450px] flex flex-col bg-background h-full overflow-y-auto custom-scrollbar border-l border-border/50">
                <div className="p-8 md:p-10 space-y-10">
                    <div className="space-y-4">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-[0.2em] uppercase py-1 px-3">
                            Production Details
                        </Badge>
                        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
                            {video.title}
                        </h1>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <Clock className="size-3.5" />
                            Generated {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <DetailItem
                            icon={<Sparkles className="size-4" />}
                            label="Topic / Vision"
                            value={video.topic || "Untitled"}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                icon={<Palette className="size-4" />}
                                label="Aesthetic Style"
                                value={video.videoStyle}
                            />
                            <DetailItem
                                icon={<Mic2 className="size-4" />}
                                label="Narration Voice"
                                value={voiceData?.Name || "AI Voice"}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <FileText className="size-3.5" /> Generated Script
                        </div>
                        <Card className="p-6 bg-muted/30 border-none ring-1 ring-border/50 rounded-2xl">
                            <p className="text-sm leading-relaxed font-medium text-muted-foreground italic">
                                "{video.script}"
                            </p>
                        </Card>
                    </div>

                    <VideoControls videoId={video.id} status={video.status} />
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <Card className="p-4 bg-muted/20 border-none ring-1 ring-border/50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                {icon} {label}
            </div>
            <div className="text-sm font-black uppercase tracking-tight truncate">
                {value}
            </div>
        </Card>
    );
}
