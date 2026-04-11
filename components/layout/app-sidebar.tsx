"use client";

import * as React from "react";
import {
  IconHome,
  IconSettings,
  IconHelp,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { NavRecentVideos } from "./nav-recent-videos";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import { useFlickzoStore } from "@/context";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/actions/get-subscribe-token";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { SettingsDialog } from "./settings-dialog";
import { HelpDialog } from "./help-dialog";

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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { recentVideos, setRecentVideos } = useFlickzoStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [credits, setCredits] = React.useState<number | null>(null);

  const fetchCredits = React.useCallback(async () => {
    if (session?.user) {
      try {
        const res = await axios.get("/api/user/credits");
        setCredits(res.data.credits);
      } catch (err) {
        console.error("Failed to fetch credits", err);
      }
    }
  }, [session]);

  const navSecondary = [
    {
      title: "Credits",
      url: "#",
      unclickable: true,
      content:
        credits !== null ? (
          <span className="text-muted-foreground text-xs font-semibold">
            {credits} credits remaining
          </span>
        ) : (
          <Skeleton className="h-4 w-28 rounded-md" />
        ),
    },
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
      onClick: () => setHelpOpen(true),
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
    fetchCredits();
  }, [fetchRecentVideos, fetchCredits]);

  // Subscribe to realtime updates
  const { latestData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  React.useEffect(() => {
    if (latestData) {
      fetchRecentVideos();
      fetchCredits();
    }
  }, [latestData, fetchRecentVideos, fetchCredits]);

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-1.5 py-2 transition-none outline-none"
              >
                <Logo />
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavRecentVideos videos={recentVideos} isLoading={isLoading} />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={
              (session?.user as {
                name: string;
                email: string;
                avatar?: string | null;
                image?: string | null;
              }) || { name: "Guest", email: "" }
            }
          />
        </SidebarFooter>
      </Sidebar>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      <SettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
      <HelpDialog open={helpOpen} setOpen={setHelpOpen} />
    </>
  );
}
