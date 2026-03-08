import * as env from '@/lib/env';
import { saveAudioToCloudinary } from '@/lib/cloudinary';

/**
 * Options for the generateAudio function.
 */
export interface GenerateAudioOptions {
  text: string; // The script content to convert to speech
  voice?: string; // The speaker persona (e.g., zeus, luna)
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
 * Communicates with the Aura-2 Cloudflare Worker to generate realistic speech.
 *
 * @param options - Text to speak and voice persona.
 * @returns Result object with success flag and audio Buffer.
 */
export const generateAudio = async ({
  text,
  voice = 'zeus',
}: GenerateAudioOptions): Promise<GenerateAudioResult> => {
  try {
    const workerURL = env.AURA_2_EN_WORKER_URL!;

    const response = await fetch(workerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        speaker: voice,
        encoding: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aura-2 API Error: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      buffer,
      text,
    };
  } catch (error) {
    console.error('[GENERATE_AUDIO_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      text,
    };
  }
};

/**
 * Orchestrates the full audio generation pipeline:
 * 1. Converts each script segment to speech in parallel.
 * 2. Merges all generated audio buffers.
 * 3. Uploads the final combined audio to Cloudinary.
 * 
 * @param segments - Array of text segments with their respective voices.
 * @returns The Cloudinary URL and public ID of the generated audio file.
 */
export const generateAudioFile = async (segments: { content: string; voice: string }[]) => {
  const audioBuffers = await Promise.all(
    segments.map(async (segment) => {
      const { success, buffer } = await generateAudio({
        text: segment.content,
        voice: segment.voice,
      });
      return success && buffer ? buffer : null;
    })
  );

  const validBuffers = audioBuffers.filter((b): b is Buffer => b !== null);

  if (validBuffers.length === 0) {
    throw new Error('Failed to generate any audio segments');
  }

  const mergedBuffer = Buffer.concat(validBuffers);

  // Upload the final merged audio to Cloudinary
  const { url: audioUrl, publicId } = await saveAudioToCloudinary(mergedBuffer);

  return {
    audioUrl,
    publicId,
  };
};
