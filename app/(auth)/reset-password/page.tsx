"use client";

import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSuccess = state === "success";

  useEffect(() => {
    if (!token && !isSuccess) {
      setError("Missing reset token. Please request a new password reset link.");
    }
  }, [token, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please request a new password reset link.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        // If the error is specifically about the token, make it clearer
        const message = error.message?.toLowerCase().includes("token") 
          ? "The reset link is invalid or has expired. Please request a new one."
          : (error.message || "Failed to reset password");
        
        setError(message);
        setIsLoading(false);
        return;
      }

      // Redirect or show success
      router.push("/reset-password?state=success");
      setIsLoading(false);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <Image
          src="/signin-bg.png"
          alt="Security and Privacy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          fill
          sizes="50vw"
          priority
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Security first, always.
          </h2>
          <p className="text-lg text-white/80">
            Keep your workspace safe with a strong, memorable password.
          </p>
        </div>
      </div>
      <div className="bg-background flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8 text-center md:text-left">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <div className={`${isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'} mb-4 flex size-20 items-center justify-center rounded-full ring-8 ring-offset-0 ${isSuccess ? 'ring-green-500/5' : 'ring-primary/5'}`}>
                {isSuccess ? <CheckCircle2 className="size-12" /> : <Lock className="size-10" />}
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight">
                {isSuccess ? "Password reset successfully" : "Set new password"}
              </h1>
              <p className="text-muted-foreground text-lg text-balance">
                {isSuccess 
                  ? "Your password has been successfully updated. You can now login with your new credentials."
                  : "Please enter your new password below."
                }
              </p>
            </div>

            {isSuccess ? (
              <div className="pt-4">
                <Button asChild size="lg" className="w-full text-base font-semibold shadow-lg shadow-primary/20">
                  <Link href="/sign-in">
                    Back to Login
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-left space-y-6">
                <FieldGroup>
                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded-md p-3 text-center text-sm">
                      {error}
                    </div>
                  )}
                  <Field>
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <Button type="submit" size="lg" className="w-full font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
