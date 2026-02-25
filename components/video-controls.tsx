"use client";

import { useState } from "react";
import { Trash2, Download, Share2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFlickzoStore } from "@/context";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  videoId: string;
  status: string;
};

export function VideoControls({ videoId, status }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeVideo } = useFlickzoStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    const promise = axios.delete(`/api/videos/${videoId}`);

    toast.promise(promise, {
      loading:
        status === "PENDING" ? "Canceling production..." : "Deleting video...",
      success: () => {
        removeVideo(videoId);
        router.push("/videos");
        router.refresh();
        return status === "PENDING"
          ? "Production canceled and video deleted."
          : "Video deleted successfully.";
      },
      error: "Failed to delete video. Please try again.",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      {status === "COMPLETED" && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="default"
            className="bg-foreground text-background h-12 rounded-xl font-bold transition-opacity hover:opacity-90"
          >
            <Download className="mr-2 size-4" /> Download
          </Button>
          <Button
            variant="secondary"
            className="bg-muted hover:bg-muted/80 h-12 rounded-xl font-bold transition-colors"
          >
            <Share2 className="mr-2 size-4" /> Share
          </Button>
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            disabled={isDeleting}
            className={cn(
              "h-12 rounded-xl font-bold transition-all",
              status === "PENDING"
                ? "border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
                : "border-red-500/20 text-red-500 hover:bg-red-500/10"
            )}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : status === "PENDING" ? (
              <XCircle className="mr-2 size-4" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            {status === "PENDING" ? "Cancel & Delete" : "Delete Video"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="ring-border/50 bg-background/95 max-w-[400px] rounded-3xl border-none ring-1 backdrop-blur-xl">
          <AlertDialogHeader className="space-y-3">
            <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-red-500/10">
              <Trash2 className="size-7 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl leading-none font-black tracking-tight uppercase">
              {status === "PENDING"
                ? "Stop Production?"
                : "Delete Masterpiece?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed font-medium">
              {status === "PENDING"
                ? "This will immediately halt all AI synthesis and delete the draft. This action cannot be reversed."
                : "This video will be permanently removed from your library. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="bg-muted hover:bg-muted/80 h-12 rounded-xl border-none font-bold transition-colors">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-12 rounded-xl border-none bg-red-500 font-bold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-600"
            >
              {status === "PENDING"
                ? "Yes, Cancel Production"
                : "Yes, Delete Forever"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {status === "PENDING" && (
        <p className="text-muted-foreground text-center text-[10px] font-medium tracking-tighter uppercase opacity-50">
          Canceling will stop all ongoing AI processing for this video. All
          generated assets will be purged from our servers.
        </p>
      )}
    </div>
  );
}
