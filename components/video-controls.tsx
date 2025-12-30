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
            loading: status === "PENDING" ? "Canceling production..." : "Deleting video...",
            success: () => {
                removeVideo(videoId);
                router.push("/videos");
                router.refresh();
                return status === "PENDING" ? "Production canceled and video deleted." : "Video deleted successfully.";
            },
            error: "Failed to delete video. Please try again."
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
                        className="h-12 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
                    >
                        <Download className="size-4 mr-2" /> Download
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-12 rounded-xl bg-muted font-bold hover:bg-muted/80 transition-colors"
                    >
                        <Share2 className="size-4 mr-2" /> Share
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
                            <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : status === "PENDING" ? (
                            <XCircle className="size-4 mr-2" />
                        ) : (
                            <Trash2 className="size-4 mr-2" />
                        )}
                        {status === "PENDING" ? "Cancel & Delete" : "Delete Video"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl border-none ring-1 ring-border/50 bg-background/95 backdrop-blur-xl max-w-[400px]">
                    <AlertDialogHeader className="space-y-3">
                        <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-2">
                            <Trash2 className="size-7 text-red-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight uppercase leading-none">
                            {status === "PENDING" ? "Stop Production?" : "Delete Masterpiece?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-medium text-sm leading-relaxed">
                            {status === "PENDING"
                                ? "This will immediately halt all AI synthesis and delete the draft. This action cannot be reversed."
                                : "This video will be permanently removed from your library. This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="h-12 rounded-xl border-none bg-muted font-bold hover:bg-muted/80 transition-colors">
                            Keep it
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="h-12 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors border-none shadow-lg shadow-red-500/20"
                        >
                            {status === "PENDING" ? "Yes, Cancel Production" : "Yes, Delete Forever"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {status === "PENDING" && (
                <p className="text-[10px] text-center text-muted-foreground font-medium opacity-50 uppercase tracking-tighter">
                    Canceling will stop all ongoing AI processing for this video.
                    All generated assets will be purged from our servers.
                </p>
            )}
        </div>
    );
}

