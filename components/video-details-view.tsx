"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Video as VideoIcon, ChevronLeft } from "lucide-react";
import RemotionPlayer from "@/components/remotion-player";
import { VideoControls } from "@/components/video-controls";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";

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
    <div className="bg-background relative flex h-full flex-col overflow-hidden lg:flex-row">
      {/* Left Column - Preview */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/videos"
              className="text-muted-foreground hover:text-foreground group flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back
            </Link>
          </div>

          <div className="ring-border relative mx-auto aspect-[9/16] max-h-[80vh] overflow-hidden rounded-xl bg-black shadow-sm ring-1">
            <AnimatePresence mode="wait">
              {video.status === "COMPLETED" ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="size-full"
                >
                  <RemotionPlayer videoData={video} />
                </motion.div>
              ) : video.status === "FAILED" ? (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-4 p-12 text-center"
                >
                  <VideoIcon className="text-muted-foreground/40 size-10" />
                  <div className="space-y-1">
                    <h3 className="text-foreground text-base font-semibold">
                      Failed
                    </h3>
                  </div>
                  <div className="mt-2 w-full max-w-[160px]">
                    <VideoControls videoId={video.id} status={video.status} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-12 text-center"
                >
                  <div className="border-primary/20 border-t-primary size-10 animate-spin rounded-full border-2" />
                  <span className="text-muted-foreground text-xs font-medium">
                    Generating...
                  </span>
                  <div className="w-full max-w-[160px]">
                    <VideoControls videoId={video.id} status={video.status} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="border-border/40 flex h-full w-full flex-col border-l lg:w-[380px]">
        <div className="custom-scrollbar flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="space-y-10">
            <header className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">
                {video.title}
              </h1>
              <div className="text-muted-foreground text-[11px] font-medium">
                {formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </header>

            <div className="space-y-6">
              <DetailItem label="Style" value={video.videoStyle} />
              <DetailItem label="Voice" value={voiceData?.Name || "AI Voice"} />
              <DetailItem label="Topic" value={video.topic || "—"} />
            </div>

            <div className="space-y-3">
              <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Script
              </div>
              <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium">
                {video.script}
              </p>
            </div>

            <div className="pt-6">
              <VideoControls videoId={video.id} status={video.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-muted-foreground text-[10px] font-medium tracking-tight uppercase">
        {label}
      </div>
      <div className="text-foreground text-sm font-medium">{value}</div>
    </div>
  );
}
