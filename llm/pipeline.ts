import { DEEPGRAM_API_KEY } from "@/lib/env";
import { getSignedUrl, uploadAudio, uploadImage } from "@/lib/s3";
import { generateImage as generateImageLlm } from "@/llm/generate-image";
import { transcribeAudioUrl } from "@/llm/transcribe";
import { textToSpeech } from "@/llm/text-to-speech";
import { IMAGE_MODEL_ID } from "@/llm/constants";
import type {
  CaptionWord,
  GenerateAudioBufferResult,
  GenerateAudioOptions,
  GenerateAudioResult,
  GenerateImageOptions,
  GenerateImageResult,
} from "@/llm/types";

function requireDeepgram(): string {
  const key = DEEPGRAM_API_KEY?.trim();
  if (!key) {
    throw new Error("DEEPGRAM_API_KEY is not set");
  }
  return key;
}

async function bufferFromTts(
  text: string,
  voice: string
): Promise<GenerateAudioBufferResult> {
  return textToSpeech({ text, voice }, requireDeepgram());
}

/** Deepgram TTS then upload to S3. */
export async function generateAudio({
  text,
  voice = "zeus",
}: GenerateAudioOptions): Promise<GenerateAudioResult> {
  try {
    const out = await bufferFromTts(text, voice);
    if (!out.success || !out.buffer) {
      return {
        success: false,
        error: out.error ?? "TTS failed",
        text,
      };
    }
    const fileName = `${voice}.mp3`;
    const path = await uploadAudio(out.buffer, fileName);
    return { success: true, audioPath: path, text };
  } catch (error) {
    console.error("[GENERATE_AUDIO_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      text,
    };
  }
}

/** Multiple TTS segments concatenated and uploaded as one MP3. */
export async function generateAudioFile(
  segments: { content: string; voice: string }[]
) {
  const audioBuffers = await Promise.all(
    segments.map(async (segment) => {
      try {
        const out = await bufferFromTts(segment.content, segment.voice);
        return out.success && out.buffer ? out.buffer : null;
      } catch (error) {
        console.error("Failed to generate audio segment", error);
        return null;
      }
    })
  );

  const validBuffers = audioBuffers.filter((b): b is Buffer => b !== null);

  if (validBuffers.length === 0) {
    throw new Error("Failed to generate any audio segments");
  }

  const mergedBuffer = Buffer.concat(validBuffers);
  const fileName = `merged-audio.mp3`;
  const path = await uploadAudio(mergedBuffer, fileName);
  return { audioPath: path };
}

/** Deepgram transcription; `audioUrlOrPath` may be an S3 key or HTTP URL. */
export async function generateCaptions(
  audioUrlOrPath: string
): Promise<CaptionWord[]> {
  try {
    let signedUrl = audioUrlOrPath;
    if (!audioUrlOrPath.startsWith("http")) {
      signedUrl = await getSignedUrl(audioUrlOrPath);
    }
    return transcribeAudioUrl(signedUrl, requireDeepgram());
  } catch (error) {
    if (error instanceof Error) {
      console.error("Caption generation failed", { error: error.message });
    } else {
      console.error("Caption generation failed", { error });
    }
    return [];
  }
}

/** Gemini image generation then upload PNG to S3. */
export async function generateImageToS3(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const { width = 1024, height = 1024, prompt } = options;

  try {
    const result = await generateImageLlm(options);
    if (!result.success || !result.image) {
      return {
        success: false,
        error: result.error ?? "Image generation failed",
        prompt,
        model: IMAGE_MODEL_ID,
      };
    }

    const base64Str = result.image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Str, "base64");
    const fileName = `generated-image.png`;
    const path = await uploadImage(imageBuffer, fileName);

    return {
      success: true,
      imagePath: path,
      prompt,
      width,
      height,
      model: result.model,
    };
  } catch (error) {
    console.error("[GENERATE_IMAGE_EXCEPTION]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during image generation",
      prompt,
      model: IMAGE_MODEL_ID,
    };
  }
}
