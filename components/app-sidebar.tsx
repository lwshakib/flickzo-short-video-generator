"use client"

import * as React from "react"
import {
  IconHome,
  IconSettings,
  IconHelp,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react"

import { NavRecentVideos } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import axios from "axios"
import { authClient } from "@/lib/auth-client"
import { useFlickzoStore } from "@/context"
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: IconHome,
    },
    {
      title: "Videos",
      url: "/videos",
      icon: IconVideo,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { recentVideos, setRecentVideos } = useFlickzoStore();

  const fetchRecentVideos = React.useCallback(() => {
    if (session?.user) {
      axios.get("/api/videos/recent")
        .then(res => setRecentVideos(res.data))
        .catch(err => console.error("Failed to fetch recent videos", err));
    }
  }, [session, setRecentVideos]);

  React.useEffect(() => {
    fetchRecentVideos();
  }, [fetchRecentVideos]);

  // Subscribe to realtime updates
  const { latestData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  React.useEffect(() => {
    if (latestData) {
      fetchRecentVideos();
    }
  }, [latestData, fetchRecentVideos]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg shadow-md shadow-primary/20">
                  <IconVideo className="size-4" />
                </div>
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Flickzo
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavRecentVideos videos={recentVideos} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user as any || { name: "Guest", email: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}

