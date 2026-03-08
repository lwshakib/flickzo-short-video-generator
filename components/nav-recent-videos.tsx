"use client";

import { IconVideo, IconSparkles, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

export function NavRecentVideos({
  videos,
  isLoading,
}: {
  videos: { id: string; title: string; status: string }[];
  isLoading?: boolean;
}) {
  const pathname = usePathname();

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Recent Videos</SidebarGroupLabel>
        <SidebarMenu className="space-y-2 px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex h-8 items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3 flex-1" />
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Videos</SidebarGroupLabel>
      <SidebarMenu>
        {videos.map((video) => {
          const url = `/videos/${video.id}`;
          const isActive = pathname === url;
          const isPending = video.status === "PENDING";
          const isFailed = video.status === "FAILED";

          return (
            <SidebarMenuItem key={video.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={video.title}
                className={cn(
                  "group/sidebar-item relative overflow-hidden",
                  isPending && "bg-muted/30",
                  isFailed && "bg-destructive/5 hover:bg-destructive/10"
                )}
              >
                <Link href={url}>
                  {isPending ? (
                    <IconSparkles className="text-primary size-4 shrink-0" />
                  ) : isFailed ? (
                    <IconAlertCircle className="text-destructive size-4 shrink-0" />
                  ) : (
                    <IconVideo className="size-4 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "truncate",
                      isFailed && "text-destructive/80 font-medium"
                    )}
                  >
                    {video.title}
                  </span>

                  {/* AI Shimmer Loader for Pending Videos */}
                  {isPending && (
                    <div className="pointer-events-none absolute inset-0">
                      <div className="via-primary/5 animate-shine absolute inset-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-transparent" />
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
