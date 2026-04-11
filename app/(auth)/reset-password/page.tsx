"use client";

import { Logo } from "@/components/layout/logo";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

/**
 * ResetPassword component.
 * Allows users to set a new password using a token received via email.
 */
function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state"); // Checks if reset was a "success"
  const token = searchParams.get("token"); // The secure reset token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSuccess = state === "success";

  // Validate token presence immediately
  const missingTokenError =
    !token && !isSuccess
      ? "Missing reset token. Please request a new password reset link."
      : "";
  const displayError = error || missingTokenError;

  /**
   * Submits the new password to Better-Auth.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError(
        "Reset token is missing. Please request a new password reset link."
      );
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
        // Handle token-specific errors (expired or invalid)
        const message = error.message?.toLowerCase().includes("token")
          ? "The reset link is invalid or has expired. Please request a new one."
          : error.message || "Failed to reset password";

        setError(message);
        setIsLoading(false);
        return;
      }

      // On success, redirect to the success state of the same page
      router.push("/reset-password?state=success");
      setIsLoading(false);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Visual background section */}
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
              <div
                className={`${isSuccess ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"} mb-4 flex size-20 items-center justify-center rounded-full ring-8 ring-offset-0 ${isSuccess ? "ring-green-500/5" : "ring-primary/5"}`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="size-12" />
                ) : (
                  <Lock className="size-10" />
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                {isSuccess ? "Password reset successfully" : "Set new password"}
              </h1>
              <p className="text-muted-foreground text-lg text-balance">
                {isSuccess
                  ? "Your password has been successfully updated. You can now login with your new credentials."
                  : "Please enter your new password below."}
              </p>
            </div>

            {isSuccess ? (
              // Success State: Redirect to login
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="shadow-primary/20 w-full text-base font-semibold shadow-lg"
                >
                  <Link href="/sign-in">Back to Login</Link>
                </Button>
              </div>
            ) : (
              // Initial State: Reset form
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <FieldGroup>
                  {displayError && (
                    <div className="bg-destructive/10 text-destructive rounded-md p-3 text-center text-sm">
                      {displayError}
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
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm New Password
                    </FieldLabel>
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
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={isLoading}
                  >
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

/**
 * ResetPasswordPage export.
 * Wrapped in Suspense to handle useSearchParams.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
