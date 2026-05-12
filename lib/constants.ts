/** Free tier: max AI videos a user can start per UTC calendar day. */
export const DAILY_FREE_VIDEO_LIMIT = 3;

export {
  CHAT_MODEL_ID,
  IMAGE_MODEL_ID as IMAGE_GENERATION_MODEL_ID,
  TRANSCRIPTION_MODEL_ID as STT_MODEL_ID,
} from "@/llm/constants";

/** Legacy alias: speech is routed through Deepgram Aura in `@/llm/text-to-speech`. */
export const TTS_MODEL_ID = "deepgram-aura";
