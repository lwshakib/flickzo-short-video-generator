"use client";

import { useState } from "react";
import { Trash2, Loader2, XCircle } from "lucide-react";
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
        <AlertDialogContent className="max-w-[380px] rounded-2xl">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-bold">
              {status === "PENDING" ? "Stop Production?" : "Delete Video?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {status === "PENDING"
                ? "This will halt all AI processing and delete the draft. This cannot be undone."
                : "This video will be permanently removed from your library."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 rounded-lg text-xs font-semibold">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-10 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700"
            >
              {status === "PENDING" ? "Cancel Production" : "Delete Forever"}
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
