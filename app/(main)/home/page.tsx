import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VideoCard } from "@/components/videos-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Video, Activity, Zap, ArrowRight } from "lucide-react";

async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user;
}

async function getDashboardData(userId: string) {
    const [videos, totalCount, pendingCount] = await Promise.all([
        prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 4,
        }),
        prisma.video.count({ where: { userId } }),
        prisma.video.count({ where: { userId, status: "PENDING" } }),
    ]);

    return { videos, totalCount, pendingCount };
}

export default async function Home() {
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    const { videos, totalCount, pendingCount } = await getDashboardData(user.id);

    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            {/* Header & Quick Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                        Welcome back, {user.name?.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        You have <span className="font-bold text-primary">{pendingCount} videos</span> processing and {totalCount} total creations.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Link href="/create-video" className="w-full md:w-auto">
                        <Button size="lg" className="w-full font-bold gap-2 h-14 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                            <Plus className="size-5" />
                            Create New Video
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-6 border-none bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Video className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                        <h3 className="text-2xl font-black">{totalCount}</h3>
                    </div>
                </Card>
                <Card className="p-6 border-none bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-4">
                    <div className="size-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Activity className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Processing</p>
                        <h3 className="text-2xl font-black">{pendingCount}</h3>
                    </div>
                </Card>
                <Card className="p-6 border-none bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-4">
                    <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Zap className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Credits Left</p>
                        <h3 className="text-2xl font-black">Unlimited</h3>
                    </div>
                </Card>
            </div>

            {/* Recent Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                    <Link href="/videos" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        View all library <ArrowRight className="size-4" />
                    </Link>
                </div>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
                        <p className="text-muted-foreground">No recent activity. Start your first project!</p>
                    </div>
                )}
            </div>
        </div>
    );
}