"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  IconBell,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  videoId?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data);

      // Auto-mark notifications as read when fetched in the background if they weren't read already.
      // E.g., a "markedAllAsRead" API call goes here.
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Mark all as read as soon as they visit the page
    const markAllAsRead = async () => {
      try {
        await axios.patch("/api/notifications", { isRead: true });
      } catch (err) {
        console.error("Failed to mark all as read", err);
      }
    };
    markAllAsRead();
  }, []);

  const clearAllNotifications = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/notifications");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear notifications", err);
      toast.error("Failed to clear notifications");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Manage your alerts and stay updated with your video generations.
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              disabled={isLoading}
            >
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
      <Separator />

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24" />
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <IconBell className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            You don&apos;t have any notifications right now.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={
                notification.videoId ? `/videos/${notification.videoId}` : "#"
              }
              className="block"
            >
              <Card
                className={cn(
                  "hover:bg-muted/50 cursor-pointer transition-colors"
                )}
              >
                <CardHeader className="flex flex-row items-start space-y-0 pb-4">
                  <div className="mt-1 mr-4">
                    {notification.type === "SUCCESS" ? (
                      <div className="rounded-full bg-green-500/10 p-2 text-green-600">
                        <IconCircleCheck className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-red-500/10 p-2 text-red-600">
                        <IconAlertCircle className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {notification.title}
                      </CardTitle>
                      <div className="text-muted-foreground flex items-center text-xs">
                        <IconClock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <CardDescription className="text-foreground text-sm">
                      {notification.message}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
