import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VideoCard } from "@/components/videos-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Video, Activity, Zap, ArrowRight } from "lucide-react";

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
  const [videos, totalCount, pendingCount] = await Promise.all([
    // Get the 4 most recent videos
    prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // Count total videos ever created
    prisma.video.count({ where: { userId } }),
    // Count videos currently in the production pipeline
    prisma.video.count({ where: { userId, status: "PENDING" } }),
  ]);

  return { videos, totalCount, pendingCount };
}

/**
 * Home (Dashboard) component.
 * Provides an overview of user activity, stats, and quick actions.
 */
export default async function Home() {
  const user = await getUser();

  // Redirect to landing page if no active session
  if (!user) {
    return redirect("/");
  }

  const { videos, totalCount, pendingCount } = await getDashboardData(user.id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 lg:p-10">
      {/* Header & Quick Action */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <h1 className="text-foreground text-3xl font-black tracking-tight lg:text-4xl">
            Welcome back, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-lg">
            You have{" "}
            <span className="text-primary font-bold">
              {pendingCount} videos
            </span>{" "}
            processing and {totalCount} total creations.
          </p>
        </div>
        <div className="flex justify-end">
          <Link href="/create-video" className="w-full md:w-auto">
            <Button
              size="lg"
              className="shadow-primary/20 h-14 w-full gap-2 text-base font-bold shadow-xl transition-transform hover:scale-105"
            >
              <Plus className="size-5" />
              Create New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 border-none p-6 transition-colors">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Video className="size-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Total Projects
            </p>
            <h3 className="text-2xl font-black">{totalCount}</h3>
          </div>
        </Card>
        <Card className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 border-none p-6 transition-colors">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Activity className="size-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Processing
            </p>
            <h3 className="text-2xl font-black">{pendingCount}</h3>
          </div>
        </Card>
        <Card className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 border-none p-6 transition-colors">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Zap className="size-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Credits Left
            </p>
            <h3 className="text-2xl font-black">Unlimited</h3>
          </div>
        </Card>
      </div>

      {/* Recent Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <Link
            href="/videos"
            className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View all library <ArrowRight className="size-4" />
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="border-border/50 rounded-3xl border-2 border-dashed py-20 text-center">
            <p className="text-muted-foreground">
              No recent activity. Start your first project!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
