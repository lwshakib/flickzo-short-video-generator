"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Video as VideoIcon,
  Sparkles,
  Mic2,
  Palette,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import RemotionPlayer from "@/components/remotion-player";
import { VideoControls } from "@/components/video-controls";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";

interface Video {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  videoStyle: string;
  voice: string;
  topic: string;
  script: string;
  createdAt: string | Date;
  audio: Record<string, unknown>;
  captions: { start: number; end: number; word: string }[];
  images: { url: string }[];
  [key: string]: unknown;
}

export function VideoDetailsView({
  initialVideo,
  voiceData,
}: {
  initialVideo: Video;
  voiceData: { Name: string } | null | undefined;
}) {
  const [video, setVideo] = useState<Video>(initialVideo);

  const fetchVideo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/videos/${video.id}`);
      if (res.data) {
        setVideo(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch video", err);
    }
  }, [video.id]);

  const { latestData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  useEffect(() => {
    if (latestData && latestData.data.videoId === video.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchVideo();
    }
  }, [latestData, video.id, fetchVideo]);

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden lg:flex-row">
      {/* Left Column - Preview */}
      <div className="bg-muted/5 border-border/50 flex flex-1 flex-col items-center justify-center border-r p-6 lg:p-10">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/videos"
              className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm font-bold transition-colors"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back to Videos
            </Link>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur-sm"
              >
                {video.status === "COMPLETED" ? "GENERATED" : video.status}
              </Badge>
            </div>
          </div>

          <div className="ring-border/50 relative mx-auto aspect-[9/16] max-h-[75vh] overflow-hidden rounded-[32px] bg-black shadow-2xl ring-1">
            {video.status === "COMPLETED" ? (
              <RemotionPlayer videoData={video} />
            ) : video.status === "FAILED" ? (
              <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-4 p-12 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10">
                  <VideoIcon className="size-10 text-red-500/40" />
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  Generation Failed
                </h3>
                <p className="text-sm font-medium">
                  Something went wrong while casting your masterpiece. Please
                  try creating it again.
                </p>
                <div className="mt-4 w-full max-w-[200px]">
                  <VideoControls videoId={video.id} status={video.status} />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center">
                <div className="border-primary/20 border-t-primary size-24 animate-spin rounded-full border-4" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight uppercase">
                    Architecting...
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    Sit tight, your cinematic short is being synthesized by our
                    AI core.
                  </p>
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
      <div className="bg-background custom-scrollbar border-border/50 flex h-full w-full flex-col overflow-y-auto border-l lg:w-[450px]">
        <div className="space-y-10 p-8 md:p-10">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
              Production Details
            </Badge>
            <h1 className="text-3xl leading-none font-black tracking-tighter uppercase">
              {video.title}
            </h1>
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <Clock className="size-3.5" />
              Generated{" "}
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
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
            <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
              <FileText className="size-3.5" /> Generated Script
            </div>
            <Card className="bg-muted/30 ring-border/50 rounded-2xl border-none p-6 ring-1">
              <p className="text-muted-foreground text-sm leading-relaxed font-medium italic">
                &ldquo;{video.script}&rdquo;
              </p>
            </Card>
          </div>

          <VideoControls videoId={video.id} status={video.status} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="bg-muted/20 ring-border/50 space-y-2 rounded-2xl border-none p-4 ring-1">
      <div className="text-muted-foreground flex items-center gap-2 text-[9px] font-black tracking-widest uppercase">
        {icon} {label}
      </div>
      <div className="truncate text-sm font-black tracking-tight uppercase">
        {value}
      </div>
    </Card>
  );
}
