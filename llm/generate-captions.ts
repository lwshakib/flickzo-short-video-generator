import { DEEPGRAM_API_KEY } from "@/lib/env";
import { getSignedUrl } from "@/lib/s3";
import { transcribeAudioUrl } from "@/llm/transcribe";
import type { CaptionWord } from "@/llm/types";

/**
 * Generates captions for an audio file.
 * Handles resolving S3 paths to signed URLs before transcription.
 */
export async function generateCaptions(
  audioUrlOrPath: string
): Promise<CaptionWord[]> {
  try {
    const key = DEEPGRAM_API_KEY?.trim();
    if (!key) {
      throw new Error("DEEPGRAM_API_KEY is not set");
    }

    let signedUrl = audioUrlOrPath;
    if (!audioUrlOrPath.startsWith("http")) {
      signedUrl = await getSignedUrl(audioUrlOrPath);
    }

    return transcribeAudioUrl(signedUrl, key);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Caption generation failed", { error: error.message });
    } else {
      console.error("Caption generation failed", { error });
    }
    return [];
  }
}
