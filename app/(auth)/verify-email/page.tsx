"use client";

import { Logo } from "@/components/logo";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function VerifyEmail() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  const isVerified = state === "verified";
  const isSent = state === "sent";

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
          <div className="w-full max-w-md space-y-6">
            {isSent && (
              <div className="text-center md:text-left">
                <Link
                  href="/sign-in"
                  className="group text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Link>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
              {isVerified ? (
                <div className="animate-in zoom-in-50 mb-4 flex size-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-8 ring-green-500/5 duration-500">
                  <CheckCircle2 className="size-12" />
                </div>
              ) : (
                <div className="bg-primary/10 text-primary ring-primary/5 mb-4 flex size-20 items-center justify-center rounded-full ring-8">
                  <Mail className="size-10" />
                </div>
              )}

              <h1 className="text-3xl font-bold tracking-tight">
                {isVerified
                  ? "Email verified successfully"
                  : "Check your email"}
              </h1>
              <p className="text-muted-foreground text-lg text-balance">
                {isVerified
                  ? "Your email address has been successfully verified. You can now access all features of Flickzo."
                  : "We've sent a verification link to your email address. Please click the link to verify your account."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {isSent && (
                <Button
                  asChild
                  size="lg"
                  className="shadow-primary/20 w-full text-base font-semibold shadow-lg"
                >
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 size-5" />
                    Go to Gmail
                  </a>
                </Button>
              )}

              {isVerified && (
                <Button
                  asChild
                  size="lg"
                  className="shadow-primary/20 w-full text-base font-semibold shadow-lg"
                >
                  <Link href="/sign-in">Back to Login</Link>
                </Button>
              )}
            </div>

            {!isVerified && (
              <p className="text-muted-foreground text-center text-sm md:text-left">
                Didn&apos;t receive the email? Check your spam folder or contact
                support.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <Image
          src="/signup-bg.png"
          alt="Verification Support"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          fill
          sizes="50vw"
          priority
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Your journey begins with a click.
          </h2>
          <p className="text-lg text-white/80">
            Secure and simple verification to keep your content safe.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
