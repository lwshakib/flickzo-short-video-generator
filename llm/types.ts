export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

export interface GenerateAudioOptions {
  text: string;
  voice?: string;
}

/** Raw audio buffer result (Deepgram TTS from tmp/code_examples.md). */
export interface GenerateAudioBufferResult {
  success: boolean;
  buffer?: Buffer;
  text: string;
  error?: string;
}

export interface GenerateAudioResult {
  success: boolean;
  audioPath?: string;
  text: string;
  error?: string;
}

export type GenerateImageMode =
  | "text-to-image"
  | "image-to-image"
  | "blend"
  | "inpaint";

export interface GenerateImageOptions {
  mode?: GenerateImageMode;
  prompt: string;
  images?: (Blob | Buffer | File)[];
  mask?: Blob | Buffer | File;
  strength?: number;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  aspectRatio?: string;
  imageSize?: string;
  thinkingLevel?: "Minimal" | "High";
  includeThoughts?: boolean;
}

export interface GenerateImageLlmResult {
  success: boolean;
  /** data:image/png;base64,... */
  image?: string;
  prompt: string;
  model: string;
  error?: string;
}

/** After uploading generated pixels to object storage (`llm/pipeline`). */
export interface GenerateImageResult {
  success: boolean;
  imagePath?: string;
  prompt: string;
  width?: number;
  height?: number;
  model: string;
  error?: string;
}

export interface GenerateObjectOptions<O = Record<string, unknown>> {
  messages: Message[];
  outputSchema: O | import("zod").ZodType;
  temperature?: number;
}

export interface GenerateTextOptions {
  messages: Message[];
  temperature?: number;
}
