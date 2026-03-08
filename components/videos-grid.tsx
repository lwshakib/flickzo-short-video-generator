"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Play,
  AlertCircle,
  Video as VideoIcon,
  X,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { videoStyles } from "@/lib/data";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import axios from "axios";
import { cn } from "@/lib/utils";
import { deleteVideo } from "@/actions/delete-video";
import { toast } from "sonner";
import { useFlickzoStore } from "@/context";

interface VideoItem {
  id: string;
  title: string;
  videoStyle: string;
  images: { url: string }[];
  createdAt: string | Date;
  status: string;
}

export function VideosGrid({
  initialVideos,
  limit,
}: {
  initialVideos: VideoItem[];
  limit?: number;
}) {
  const [videos, setVideos] = useState(initialVideos);

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

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

  const displayVideos = limit ? videos.slice(0, limit) : videos;

  return (
    <div className="3xl:grid-cols-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {displayVideos.map((video) => (
        <VideoCard key={video.id} video={video} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export function VideoCard({
  video,
  onDelete,
}: {
  video: VideoItem;
  onDelete?: (id: string) => void;
}) {
  const styleData = videoStyles.find((s) => s.label === video.videoStyle);
  const isPending = video.status === "PENDING";
  const [isDeleting, setIsDeleting] = useState(false);

  const { removeVideo } = useFlickzoStore();

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    setIsDeleting(true);
    const promise = deleteVideo(video.id);

    toast.promise(promise, {
      loading: "Canceling production...",
      success: "Production canceled successfully",
      error: "Failed to cancel production",
    });

    try {
      const result = await promise;
      if (result.success) {
        onDelete?.(video.id);
        removeVideo(video.id);
      } else {
        setIsDeleting(false);
      }
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={isPending ? "#" : `/videos/${video.id}`}
      className={cn("group block", isPending && "cursor-default")}
      onClick={(e) => isPending && e.preventDefault()}
    >
      <div className="bg-muted relative aspect-[9/16] overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
        {video.images && video.images.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={video.images[0].url}
            alt={video.title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
              isPending && "opacity-80 grayscale"
            )}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={styleData?.src}
            alt={video.title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
              isPending ? "opacity-80 grayscale" : "opacity-60 grayscale"
            )}
          />
        )}

        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* Shimmer Effect Overlay */}
            <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Cancel Icon */}
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className={cn(
                "bg-background/20 hover:bg-background/40 relative z-20 flex size-12 items-center justify-center rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all duration-200 active:scale-95 disabled:opacity-50",
                !isDeleting &&
                  "opacity-0 transition-opacity group-hover:opacity-100"
              )}
            >
              {isDeleting ? (
                <Loader2 className="size-6 animate-spin text-white" />
              ) : (
                <X className="size-6 text-white" />
              )}
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

        <div className="absolute top-2 left-2">
          <StatusBadge status={video.status} />
        </div>

        {!isPending && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="bg-background/90 flex size-9 items-center justify-center rounded-full border shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="size-4 translate-x-0.5 fill-current" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-0.5 px-0.5">
        <h3 className="text-foreground line-clamp-1 text-[11px] font-bold tracking-tight">
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
    case "PENDING":
      return null;
    case "FAILED":
      return (
        <Badge className="border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-red-500 backdrop-blur-md">
          <AlertCircle className="mr-1 size-2.5" /> Failed
        </Badge>
      );
    default:
      return null;
  }
}
