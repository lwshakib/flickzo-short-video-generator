import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VideoCard } from "@/components/videos-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

/**
 * Fetches the current authenticated user session.
 */
async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

/**
 * Retrieves dashboard statistics and recent video activity for the user.
 */
async function getDashboardData(userId: string) {
  const [videos] = await Promise.all([
    // Get the 4 most recent videos
    prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return { videos };
}

/**
 * Home (Dashboard) component with a minimalist layout.
 */
export default async function Home() {
  const user = await getUser();

  // Redirect to landing page if no active session
  if (!user) {
    return redirect("/");
  }

  const { videos } = await getDashboardData(user.id);

  return (
    <div className="flex w-full flex-col gap-10 p-4 sm:p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>

        <Link href="/create-video">
          <Button
            size="sm"
            className="h-9 rounded-xl px-4 text-xs font-bold shadow-sm"
          >
            <Plus className="mr-2 size-3.5" />
            Create
          </Button>
        </Link>
      </div>

      {/* Videos Section without header */}
      <div className="space-y-6">
        {videos.length > 0 ? (
          <div className="3xl:grid-cols-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={{
                  ...video,
                  images: video.images as unknown as { url: string }[],
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/10 hover:bg-muted/20 flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors">
            <p className="text-muted-foreground text-sm font-medium">
              No recent activity found.
            </p>
            <Link href="/create-video" className="mt-4">
              <Button variant="outline" size="sm">
                Start your first project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
