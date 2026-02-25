import { DEEPGRAM_API_KEY } from "@/lib/env";
import { createClient } from "@deepgram/sdk";

/**
 * Deepgram client initialization.
 * Used for AI-powered Text-to-Speech (TTS) and transcription services.
 */
export const deepgramClient = createClient(DEEPGRAM_API_KEY);

/**
 * Options for the generateAudio function.
 */
export interface GenerateAudioOptions {
  text: string; // The script content to convert to speech
  voice?: string; // The Deepgram voice model ID (e.g., aura-2-thalia-en)
}

/**
 * Result structure for the generateAudio function.
 */
export interface GenerateAudioResult {
  success: boolean;
  buffer?: Buffer; // The raw MP3 audio data
  text: string; // The original text that was processed
  error?: string; // Error message if generation fails
}

/**
 * Utility function to convert a ReadableStream (from Deepgram SDK) to a Node.js Buffer.
 *
 * @param stream The readable stream of audio chunks.
 * @returns A promise that resolves to a complete audio Buffer.
 */
async function getAudioBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  // Concatenate all chunks into a single Buffer
  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

/**
 * Generates audio from text using Deepgram's Speak API.
 *
 * @param options - Text and voice settings.
 * @returns A promise resolving to a GenerateAudioResult containing the audio buffer.
 */
export const generateAudio = async ({
  text,
  voice = "aura-2-thalia-en",
}: GenerateAudioOptions): Promise<GenerateAudioResult> => {
  try {
    // Basic validation for API key presence
    if (!DEEPGRAM_API_KEY) {
      throw new Error("Missing DEEPGRAM_API_KEY");
    }

    // Call Deepgram's TTS service
    const response = await deepgramClient.speak.request({ text }, {
      model: voice,
      encoding: "mp3",
    } as { model: string; encoding: "mp3" });

    // Retrieve the raw response stream
    const stream = await response.getStream();

    if (!stream) {
      throw new Error("No audio stream received from Deepgram");
    }

    // Convert the web stream to a Buffer for easier handling/storage
    const buffer = await getAudioBuffer(stream);

    return {
      success: true,
      buffer,
      text,
    };
  } catch (error) {
    // Standard error handling pattern for LLM/service failures
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      text,
    };
  }
};
