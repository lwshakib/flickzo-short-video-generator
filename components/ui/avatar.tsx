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

function AvatarImage({
  className,
  src,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  // Gracefully handle raw S3 paths (like avatars/... or uploads/...)
  const [resolvedSrc, setResolvedSrc] = React.useState(src);

  React.useEffect(() => {
    if (typeof src === "string" && !src.startsWith("http") && !src.startsWith("data:")) {
      setResolvedSrc(`/api/s3/view?path=${encodeURIComponent(src)}`);
    } else {
      setResolvedSrc(src);
    }
  }, [src]);

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={resolvedSrc}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
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
