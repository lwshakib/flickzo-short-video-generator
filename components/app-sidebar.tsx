"use client"

import * as React from "react"
import {
  IconHome,
  IconSettings,
  IconHelp,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react"

import { NavRecentVideos } from "@/components/nav-recent-videos"
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
import { Logo } from "./logo"
import { SearchCommand } from "./search-command"
import { SettingsDialog } from "./settings-dialog"

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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { recentVideos, setRecentVideos } = useFlickzoStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const navSecondary = [
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
      onClick: () => setSearchOpen(true),
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      onClick: () => setSettingsOpen(true),
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ];

  const fetchRecentVideos = React.useCallback(async () => {
    if (session?.user) {
      try {
        const res = await axios.get("/api/videos/recent");
        setRecentVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch recent videos", err);
      } finally {
        setIsLoading(false);
      }
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
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="/" className="flex items-center gap-2 px-1.5 py-2 rounded-lg transition-none outline-none">
                <Logo />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavRecentVideos videos={recentVideos} isLoading={isLoading} />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={session?.user as any || { name: "Guest", email: "" }} />
        </SidebarFooter>
      </Sidebar>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      <SettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}
