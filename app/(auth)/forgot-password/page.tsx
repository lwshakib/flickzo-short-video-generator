"use client";

import { Logo } from "@/components/logo";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSent = state === "sent";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Redirect to same page with sent state
      window.history.pushState(null, "", "?state=sent");
      setIsLoading(false);
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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
              <div className="bg-primary/10 text-primary mb-4 flex size-20 items-center justify-center rounded-full ring-8 ring-primary/5">
                <Mail className="size-10" />
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight">
                {isSent ? "Email has been sent" : "Reset password"}
              </h1>
              <p className="text-muted-foreground text-lg text-balance">
                {isSent 
                  ? "We've sent a password reset link to your email address."
                  : "Enter your email address and we'll send you a link to reset your password."
                }
              </p>
            </div>

            {isSent ? (
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full text-base font-semibold">
                  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 size-5" />
                    Go to Gmail
                  </a>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full text-base">
                  <Link href="/sign-in">
                    <ArrowLeft className="mr-2 size-5" />
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
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </Field>
                  <Button type="submit" size="lg" className="w-full font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <div className="text-center md:text-left">
                    <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Back to Login
                    </Link>
                  </div>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <Image
          src="/forgot-password-bg.png"
          alt="Reset Password Support"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          fill
          sizes="50vw"
          priority
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Secure your creativity.
          </h2>
          <p className="text-lg text-white/80">
            Quick recovery to get you back to creating magic.
          </p>
        </div>
      </div>
    </div>
  );
}
