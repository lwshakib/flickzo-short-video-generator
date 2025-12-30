"use client"

import {
  IconDots,
  IconVideo,
  IconSparkles,
  IconAlertCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavRecentVideos({
  videos,
}: {
  videos: any[]
}) {
  const pathname = usePathname()

  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Videos</SidebarGroupLabel>
      <SidebarMenu>
        {videos.map((video) => {
          const url = `/videos/${video.id}`
          const isActive = pathname === url
          const isPending = video.status === "PENDING"
          const isFailed = video.status === "FAILED"

          return (
            <SidebarMenuItem key={video.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={video.title}
                className={cn(
                  "relative overflow-hidden group/sidebar-item",
                  isPending && "bg-muted/30",
                  isFailed && "bg-destructive/5 hover:bg-destructive/10"
                )}
              >
                <Link href={url}>
                  {isPending ? (
                    <IconSparkles className="size-4 shrink-0 text-primary animate-spin" />
                  ) : isFailed ? (
                    <IconAlertCircle className="size-4 shrink-0 text-destructive" />
                  ) : (
                    <IconVideo className="size-4 shrink-0" />
                  )}
                  <span className={cn(
                    "truncate",
                    isFailed && "text-destructive/80 font-medium"
                  )}>
                    {video.title}
                  </span>

                  {/* AI Shimmer Loader for Pending Videos */}
                  {isPending && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 animate-shine" />
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

