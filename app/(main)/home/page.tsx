import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VideosGrid } from "@/components/videos-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    // Get all recent videos
    prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
          <Button size="sm" className="rounded-full px-5 font-semibold">
            New Video
          </Button>
        </Link>
      </div>

      {/* Videos Section without header */}
      <div className="space-y-6">
        {videos.length > 0 ? (
          <VideosGrid initialVideos={JSON.parse(JSON.stringify(videos))} />
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
