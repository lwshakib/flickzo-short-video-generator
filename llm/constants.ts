/**
 * Model identifiers aligned with `tmp/docs.md` / `tmp/code_examples.md`.
 * Override individual models via env if your workspace uses different SKU names.
 */
export const CHAT_MODEL_ID =
  process.env.GEMINI_CHAT_MODEL ?? "gemini-3-flash-preview";

export const IMAGE_MODEL_ID =
  process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-preview-image-generation";

/** Deepgram transcription model (Nova-3 per tmp examples). */
export const TRANSCRIPTION_MODEL_ID = "nova-3";
