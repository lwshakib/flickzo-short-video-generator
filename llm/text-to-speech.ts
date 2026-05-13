import { DeepgramClient } from "@deepgram/sdk";
import type { GenerateAudioResult } from "@/llm/types";
import { uploadAudio } from "@/lib/s3";
import { DEEPGRAM_API_KEY } from "@/lib/env";

/**
 * Converts a ReadableStream to a Buffer.
 * Essential for handling the streaming response from Deepgram SDK in a Node.js environment.
 */
async function getAudioBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const dataArray = chunks.reduce((acc, chunk) => {
    const res = new Uint8Array(acc.length + chunk.length);
    res.set(acc);
    res.set(chunk, acc.length);
    return res;
  }, new Uint8Array(0));

  return Buffer.from(dataArray.buffer);
}

/**
 * Deepgram Aura TTS using the official SDK + S3 Upload.
 * Converts text to speech and returns the S3 audio path.
 */
export async function textToSpeech(options: {
  text: string;
  voice?: string;
}): Promise<GenerateAudioResult> {
  const { text, voice = "luna" } = options;

  try {
    const apiKey = DEEPGRAM_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("DEEPGRAM_API_KEY is not set");
    }

    const deepgram = new DeepgramClient({ apiKey });

    const response = await deepgram.speak.v1.audio.generate({
      text,
      model: `aura-2-${voice.toLowerCase()}-en`,
    });

    const stream = response.stream();
    if (!stream) {
      throw new Error("Deepgram: No audio stream returned in response");
    }

    const buffer = await getAudioBuffer(stream);

    // Upload to S3 immediately
    const fileName = `${voice}-${Date.now()}.mp3`;
    const audioPath = await uploadAudio(buffer, fileName);

    return { success: true, audioPath, text };
  } catch (error) {
    console.error("[GENERATE_AUDIO_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      text,
    };
  }
}
