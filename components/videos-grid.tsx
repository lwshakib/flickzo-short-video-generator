"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Play,
  Clock,
  AlertCircle,
  CheckCircle2,
  Video as VideoIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { videoStyles } from "@/lib/data";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";

interface VideoItem {
  id: string;
  title: string;
  videoStyle: string;
  images: { url: string }[];
  createdAt: string | Date;
  status: string;
}

export function VideosGrid({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState(initialVideos);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get("/api/videos/recent?take=50"); // Fetch more for the library
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  }, []);

  const { latestData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  useEffect(() => {
    if (latestData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchVideos();
    }
  }, [latestData, fetchVideos]);

  if (videos.length === 0) {
    return (
      <div className="border-border/50 bg-muted/5 flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed">
        <div className="bg-muted/50 flex size-16 items-center justify-center rounded-full">
          <VideoIcon className="text-muted-foreground size-8" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">No videos yet</h3>
          <p className="text-muted-foreground">
            Create your first cinematic video to see it here.
          </p>
        </div>
        <Link href="/create-video">
          <Card className="bg-primary text-primary-foreground shadow-primary/20 cursor-pointer border-none px-6 py-3 font-bold shadow-xl transition-transform hover:scale-105">
            Create Video
          </Card>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export function VideoCard({ video }: { video: VideoItem }) {
  const styleData = videoStyles.find((s) => s.label === video.videoStyle);

  return (
    <Link href={`/videos/${video.id}`}>
      <Card className="group ring-border/50 bg-muted/20 hover:ring-primary/50 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border-none p-0 ring-1 transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-[9/16] overflow-hidden bg-black">
          {video.images && video.images.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={video.images[0].url}
              alt={video.title}
              className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={styleData?.src}
              alt={video.title}
              className="h-full w-full object-cover opacity-40 grayscale transition-transform duration-700 group-hover:scale-110"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          <div className="absolute top-2 left-2">
            <StatusBadge status={video.status} />
          </div>

          <div className="absolute right-3 bottom-3 left-3 space-y-1">
            <h3 className="line-clamp-2 text-[10px] leading-tight font-bold tracking-tight text-white uppercase">
              {video.title}
            </h3>
            <p className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="bg-primary/90 text-primary-foreground flex size-10 scale-75 items-center justify-center rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-100">
              <Play className="size-5 translate-x-0.5 fill-current" />
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
        <Badge className="border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-emerald-500 uppercase backdrop-blur-md">
          <CheckCircle2 className="mr-1 size-2.5" /> Ready
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-500 uppercase backdrop-blur-md">
          <Clock className="mr-1 size-2.5 animate-pulse" /> Processing
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-red-500 uppercase backdrop-blur-md">
          <AlertCircle className="mr-1 size-2.5" /> Failed
        </Badge>
      );
    default:
      return null;
  }
}
