import type { GenerateAudioBufferResult } from "@/llm/types";

/** Deepgram Aura TTS (`tmp/code_examples.md`). */
export async function textToSpeech(
  options: { text: string; voice?: string },
  deepgramApiKey: string
): Promise<GenerateAudioBufferResult> {
  const { text, voice = "luna" } = options;

  try {
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=aura-${voice.toLowerCase()}-en`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${deepgramApiKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Deepgram TTS error (${response.status}): ${errorText}`
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return { success: true, buffer, text };
  } catch (error) {
    console.error("[GENERATE_AUDIO_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      text,
    };
  }
}
