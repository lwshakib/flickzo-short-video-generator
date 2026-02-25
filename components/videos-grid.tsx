"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Play, Clock, AlertCircle, Video as VideoIcon } from "lucide-react";
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
    <div className="3xl:grid-cols-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export function VideoCard({ video }: { video: VideoItem }) {
  const styleData = videoStyles.find((s) => s.label === video.videoStyle);

  return (
    <Link href={`/videos/${video.id}`} className="group block">
      <div className="bg-muted relative aspect-[9/16] overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
        {video.images && video.images.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={video.images[0].url}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={styleData?.src}
            alt={video.title}
            className="h-full w-full object-cover opacity-60 grayscale transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

        <div className="absolute top-2 left-2">
          <StatusBadge status={video.status} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="bg-background/90 flex size-9 items-center justify-center rounded-full border shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="size-4 translate-x-0.5 fill-current" />
          </div>
        </div>
      </div>

      <div className="mt-2.5 space-y-0.5 px-0.5">
        <h3 className="text-foreground line-clamp-1 text-[11px] font-bold tracking-tight uppercase">
          {video.title}
        </h3>
        <p className="text-muted-foreground text-[10px] font-medium">
          {formatDistanceToNow(new Date(video.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return null;
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
