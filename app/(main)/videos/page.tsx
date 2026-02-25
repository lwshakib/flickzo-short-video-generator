import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { Video as VideoIcon } from "lucide-react";
import { VideosGrid } from "@/components/videos-grid";

export default async function VideosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <VideoIcon className="text-muted-foreground size-12 opacity-20" />
        <h3 className="text-xl font-bold">Sign in to view your videos</h3>
      </div>
    );
  }

  const videos = await prisma.video.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mt-10 flex flex-1 flex-col gap-6 p-4 !pt-2 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter">
          Your <span className="text-primary">Videos</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage and view all your AI-generated cinematic shorts.
        </p>
      </div>

      <VideosGrid initialVideos={JSON.parse(JSON.stringify(videos))} />
    </div>
  );
}
