"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

import Image from "next/image";

function AvatarImage({
  className,
  src,
  alt,
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [resolvedSrc, setResolvedSrc] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (typeof src === "string") {
      if (src.startsWith("http") || src.startsWith("data:")) {
        setResolvedSrc(src);
      } else {
        // Resolve raw S3 path via API
        fetch("/api/s3/signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: src }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.url) setResolvedSrc(data.url);
            else setResolvedSrc(src);
          })
          .catch(() => setResolvedSrc(src));
      }
    } else {
      setResolvedSrc(undefined);
    }
  }, [src]);

  return (
    <div className={cn("relative aspect-square h-full w-full", className)}>
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt || "Avatar"}
          fill
          className="object-cover"
          sizes="32px"
        />
      ) : (
        <div className="bg-muted h-full w-full" />
      )}
    </div>
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
