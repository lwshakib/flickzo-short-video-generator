import * as env from '@/lib/env';

/**
 * Interface representing a single word in the generated captions.
 */
export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

/**
 * Transcribes audio to generate word-level timestamped captions via Deepgram Nova-3 Worker.
 *
 * This orchestrates:
 * 1. Remote audio fetching via URL.
 * 2. Base64 encoding for worker payload compatibility.
 * 3. Secure invocation of the Nova-3 Cloudflare Worker.
 *
 * @param audioUrl - Link to the hosted audio file (e.g., Cloudinary URL).
 * @returns Array of word objects with timing data or empty array on failure.
 */
export async function generateCaptions(audioUrl: string): Promise<CaptionWord[]> {
  try {
    console.log('Fetching audio for transcription...', { audioUrl });

    // 1. Fetch audio from URL
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      throw new Error(`Failed to fetch audio: ${audioRes.statusText}`);
    }
    const contentType = audioRes.headers.get('content-type') || 'audio/mpeg';
    const arrayBuffer = await audioRes.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    // 2. Call Nova-3 Worker
    if (!env.NOVA_3_WORKER_URL || !env.CLOUDFLARE_API_KEY) {
      throw new Error('Flux/Nova-3 configuration is incomplete (URL or API Key missing)');
    }

    const response = await fetch(env.NOVA_3_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
      },
      body: JSON.stringify({
        audio: audioBase64,
        contentType: contentType,
        detect_language: true,
        smart_format: true,
        diarize: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Extract word-level data for precise sync
    const captions = data?.results?.channels?.[0]?.alternatives?.[0]?.words || [];

    console.log('Captions generated successfully', {
      captionCount: captions.length || 0,
    });

    return captions;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Caption generation failed', { error: error.message });
    } else {
      console.error('Caption generation failed', { error });
    }
    // Deepgram failure shouldn't kill the whole process; return empty captions as fallback
    return [];
  }
}
