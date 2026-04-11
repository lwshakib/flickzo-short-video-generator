"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Laptop,
  Monitor,
  Smartphone,
  LogOut,
  Loader2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SessionData {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string | Date;
}

interface AccountData {
  id: string;
  providerId: string;
}

export default function AccountPage() {
  const {
    data: session,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = authClient.useSession();

  // Local state for fetched data instead of reactive hooks
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);
  const [isAccountsLoading, setIsAccountsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const router = useRouter();

  // Manual fetching logic as per user's provided example
  const fetchSessions = async () => {
    setIsSessionsLoading(true);
    try {
      const res = await (
        authClient as unknown as Record<
          string,
          () => Promise<{ data: SessionData[] }>
        >
      ).listSessions();
      if (res.data) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setIsAccountsLoading(true);
    try {
      const res = await (
        authClient as unknown as Record<
          string,
          () => Promise<{ data: AccountData[] }>
        >
      ).listAccounts();
      if (res.data) {
        setAccounts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setIsAccountsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      void fetchSessions();
      void fetchAccounts();
    }
  }, [session]);

  if (isSessionPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setIsUpdatingName(true);
    try {
      await authClient.updateUser({
        name: name.trim(),
      });
      toast.success("Profile updated");
      refetchSession();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading image...", { id: "upload-avatar" });

      // 1. Get presigned url
      const res = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `avatars/${session.session.userId}/${Date.now()}-${file.name}`,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, path } = await res.json();

      // 2. Upload to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      // 3. Update User profile via authClient
      await authClient.updateUser({
        image: path,
      });

      toast.success("Profile image updated!", { id: "upload-avatar" });
      refetchSession();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading", { id: "upload-avatar" });
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      toast.error("Please fill all fields and ensure passwords match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });
      if (error) throw error;
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevokeSession = async (id: string) => {
    setRevokingId(id);
    try {
      await (
        authClient as unknown as Record<
          string,
          (args: { id: string }) => Promise<void>
        >
      ).revokeSession({
        id,
      });
      toast.success("Session revoked");
      void fetchSessions();
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleLinkAccount = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/account",
      });
    } catch {
      toast.error(`Failed to link ${provider} account`);
    }
  };

  const handleUnlinkAccount = async (id: string) => {
    try {
      await (
        authClient as unknown as Record<
          string,
          (args: { accountRecordId: string }) => Promise<void>
        >
      ).unlinkAccount({
        accountRecordId: id,
      });
      toast.success("Account unlinked");
      void fetchAccounts();
    } catch {
      toast.error("Failed to unlink account");
    }
  };

  // Improved linked check that includes the current session's provider
  const isProviderLinked = (provider: string) => {
    // Check if the current user's initial provider matches
    if ((user as { provider?: string }).provider === provider) return true;
    // Check the accounts table
    return accounts?.some((acc: AccountData) => acc.providerId === provider);
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/30 min-h-screen font-sans">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Sidebar / Profile Info */}
          <div className="space-y-8 lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <div className="group relative mx-auto h-32 w-32 overflow-hidden rounded-full lg:mx-0">
                <Avatar className="h-32 w-32 border shadow-sm transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-muted text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80">
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadAvatar}
                  />
                </label>
              </div>
              <div className="mt-8 text-center lg:text-left">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {user.email}
                </p>
              </div>

              <div className="mt-12 hidden space-y-2 lg:block">
                {["Profile", "Security", "Sessions"].map((item) => (
                  <button
                    key={item}
                    className="text-muted-foreground hover:text-foreground hover:bg-secondary w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-all"
                    onClick={() => {
                      const el = document.getElementById(
                        item.toLowerCase().replace(" ", "-")
                      );
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-20 pb-40 lg:col-span-8">
            {/* Profile Section */}
            <section id="profile" className="scroll-mt-12 space-y-8">
              <div className="border-border border-b pb-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  Profile Settings
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Manage your public information and connected accounts.
                </p>
              </div>

              <div className="space-y-10">
                <div className="grid gap-3">
                  <Label
                    htmlFor="name"
                    className="text-muted-foreground text-xs font-bold"
                  >
                    Display Name
                  </Label>
                  <div className="flex gap-4">
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-border bg-secondary/50 text-foreground focus-visible:ring-primary/50 h-11 max-w-md rounded-xl"
                    />
                    <Button
                      onClick={handleUpdateName}
                      disabled={isUpdatingName || name === user.name}
                      variant="default"
                      className="hover:shadow-primary/20 h-11 rounded-xl px-6 font-bold shadow-lg transition-all"
                    >
                      {isUpdatingName ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs font-bold">
                      Connected Accounts
                    </Label>
                    {isAccountsLoading && (
                      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    )}
                  </div>

                  <div className="grid gap-1">
                    {/* Google Provider */}
                    <div className="border-border/50 flex items-center justify-between border-b py-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-background flex h-10 w-10 items-center justify-center rounded-lg border">
                          <Image
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="google"
                            width={20}
                            height={20}
                            className="h-4 w-4"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">
                            Google
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {isProviderLinked("google")
                              ? "Connected"
                              : "Not connected"}
                          </p>
                        </div>
                      </div>
                      {isProviderLinked("google") ? (
                        <div className="flex items-center gap-2">
                          {accounts?.some(
                            (a: AccountData) => a.providerId === "google"
                          ) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const acc = accounts?.find(
                                  (a: AccountData) => a.providerId === "google"
                                );
                                if (acc) void handleUnlinkAccount(acc.id);
                              }}
                              className="text-destructive hover:bg-destructive/10 h-8 rounded-lg px-3 text-[10px] font-bold"
                            >
                              Unlink
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleLinkAccount("google")}
                          className="h-8 rounded-lg px-4 text-[10px] font-bold"
                        >
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* Email Provider */}
                    <div className="border-border/50 flex items-center justify-between border-b py-4 last:border-0">
                      <div className="flex items-center gap-4 opacity-80">
                        <div className="bg-background flex h-10 w-10 items-center justify-center rounded-lg border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-foreground h-4 w-4"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">
                            Email & Password
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Standard Credentials
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground bg-secondary rounded px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
                          Primary
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="scroll-mt-12 space-y-8">
              <div className="border-border border-b pb-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  Account Security
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Change your password and secure your identity.
                </p>
              </div>

              <div className="max-w-md space-y-5">
                <div className="grid gap-2">
                  <Label className="text-muted-foreground text-[10px] font-bold">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-muted/50 h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-muted-foreground text-[10px] font-bold">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-muted/50 h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-muted-foreground text-[10px] font-bold">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-muted/50 h-11 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={
                    isUpdatingPassword || !currentPassword || !newPassword
                  }
                  className="h-11 w-full rounded-xl font-bold shadow-sm transition-all"
                >
                  {isUpdatingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </div>
            </section>

            {/* Sessions Section */}
            <section id="sessions" className="scroll-mt-12 space-y-8">
              <div className="border-border/50 border-b pb-4">
                <h2 className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                  Active Sessions
                  {isSessionsLoading && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  )}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Devices that are currently logged into your account.
                </p>
              </div>

              <div className="grid gap-1">
                {sessions.length > 0 ? (
                  sessions.map((s: SessionData) => (
                    <div
                      key={s.id}
                      className="border-border/50 flex items-center justify-between border-b py-5 last:border-0"
                    >
                      <div className="flex items-center gap-5">
                        <div className="bg-background flex h-10 w-10 items-center justify-center rounded-lg border">
                          {s.userAgent?.toLowerCase().includes("mobile") ? (
                            <Smartphone className="text-muted-foreground size-5" />
                          ) : (
                            <Laptop className="text-muted-foreground size-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-medium">
                              {s.userAgent?.split(")")[0]?.split("(")[1] ||
                                "Modern Browser"}
                            </p>
                            {s.id === session.session.id && (
                              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-[11px]">
                            {s.ipAddress || "Active Connection"} • Last active
                            recently
                          </p>
                        </div>
                      </div>
                      {s.id !== session.session.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleRevokeSession(s.id)}
                          disabled={revokingId === s.id}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 rounded-lg px-3"
                        >
                          {revokingId === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="size-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
                    <Monitor className="text-muted-foreground/50 mb-4 size-8" />
                    <h3 className="text-muted-foreground text-sm font-medium">
                      No other sessions active
                    </h3>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
