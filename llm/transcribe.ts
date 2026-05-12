import { DeepgramClient } from "@deepgram/sdk";
import { TRANSCRIPTION_MODEL_ID } from "@/llm/constants";
import type { CaptionWord } from "@/llm/types";

/** Deepgram prerecorded URL transcription (Nova-3 — `tmp/code_examples.md`). */
export async function transcribeAudioUrl(
  audioUrl: string,
  deepgramApiKey: string,
  keyterms?: string[]
): Promise<CaptionWord[]> {
  if (!deepgramApiKey) {
    console.error("[GENERATE_CAPTIONS_ERROR] Deepgram API key is missing");
    return [];
  }

  const deepgram = new DeepgramClient({ apiKey: deepgramApiKey });

  try {
    const res = await deepgram.listen.v1.media.transcribeUrl({
      url: audioUrl,
      model: TRANSCRIPTION_MODEL_ID,
      smart_format: true,
      punctuate: true,
      keyterm: keyterms,
    });

    if (!("results" in res)) {
      return [];
    }
    const words =
      res.results.channels?.[0]?.alternatives?.[0]?.words ?? [];
    return words as CaptionWord[];
  } catch (error) {
    console.error("[GENERATE_CAPTIONS_ERROR]", error);
    return [];
  }
}
