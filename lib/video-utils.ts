import "server-only";
import { getSignedUrl } from "@/lib/s3";

/**
 * Resolves all S3 paths in a video object to signed URLs.
 * Handles the 'images' array and the 'audio' metadata object.
 * Marked with 'server-only' to ensure it never runs on the client.
 */
export async function resolveVideoMedia<T extends Record<string, unknown>>(
  video: T
): Promise<T> {
  const resolved = { ...video } as Record<string, unknown>;

  // 1. Resolve Images
  if (Array.isArray(resolved.images)) {
    const images = resolved.images as { url: string; path?: string }[];
    const resolvedImages = await Promise.all(
      images.map(async (image) => {
        const path = image.path || image.url;
        if (
          path &&
          typeof path === "string" &&
          !path.startsWith("http") &&
          !path.startsWith("data:")
        ) {
          try {
            const signedUrl = await getSignedUrl(path);
            return { ...image, url: signedUrl };
          } catch (err) {
            console.error(`Failed to sign image URL (${path}):`, err);
          }
        }
        return image;
      })
    );
    resolved.images = resolvedImages;
  }

  // 2. Resolve Audio
  const audio = resolved.audio as {
    audioPath?: string;
    audioUrl?: string;
  } | null;
  if (audio && audio.audioPath && typeof audio.audioPath === "string") {
    if (
      !audio.audioPath.startsWith("http") &&
      !audio.audioPath.startsWith("data:")
    ) {
      try {
        const signedUrl = await getSignedUrl(audio.audioPath);
        resolved.audio = { ...audio, audioUrl: signedUrl };
      } catch (err) {
        console.error(`Failed to sign audio URL (${audio.audioPath}):`, err);
      }
    } else {
      resolved.audio = { ...audio, audioUrl: audio.audioPath };
    }
  }

  return resolved as T;
}

/**
 * Resolves only the first image of a video object (useful for grid views).
 */
export async function resolveVideoThumbnail<T extends Record<string, unknown>>(
  video: T
): Promise<T> {
  const resolved = { ...video } as Record<string, unknown>;

  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    const images = [...(resolved.images as { url: string; path?: string }[])];
    const firstImage = images[0];
    const path = firstImage.path || firstImage.url;

    if (
      path &&
      typeof path === "string" &&
      !path.startsWith("http") &&
      !path.startsWith("data:")
    ) {
      try {
        const signedUrl = await getSignedUrl(path);
        images[0] = { ...firstImage, url: signedUrl };
        resolved.images = images;
      } catch (err) {
        console.error(`Failed to sign thumbnail URL (${path}):`, err);
      }
    }
  }

  return resolved as T;
}
