"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  IconBell,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch("/api/notifications", { id, isRead: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications", { isRead: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to update notifications");
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
          >
            <IconCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
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
            <Card
              key={notification.id}
              className={cn(
                "hover:bg-muted/50 relative overflow-hidden transition-colors",
                !notification.isRead && "border-primary/50 bg-primary/5"
              )}
            >
              <CardHeader className="flex flex-row items-start space-y-0 pb-2">
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
              <CardContent className="flex justify-end pt-0">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary h-8 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </CardContent>
              {!notification.isRead && (
                <div className="bg-primary absolute top-0 left-0 h-full w-1" />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
