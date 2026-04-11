import {
  CLOUDFLARE_AI_GATEWAY_API_KEY,
  CLOUDFLARE_AI_GATEWAY_ENDPOINT,
} from "@/lib/env";
import { s3Service } from "./s3.services";
import {
  CHAT_MODEL_ID,
  IMAGE_GENERATION_MODEL_ID,
  TTS_MODEL_ID,
  STT_MODEL_ID,
} from "@/lib/constants";

export interface GenerateAudioOptions {
  text: string;
  voice?: string;
}

export interface GenerateAudioResult {
  success: boolean;
  audioPath?: string;
  text: string;
  error?: string;
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
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
}

export interface GenerateImageResult {
  success: boolean;
  imagePath?: string;
  prompt: string;
  width?: number;
  height?: number;
  model: string;
  error?: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

class AIServiceClass {
  private async getAudioBuffer(
    text: string,
    voice: string
  ): Promise<Buffer> {
    if (!CLOUDFLARE_AI_GATEWAY_ENDPOINT || !CLOUDFLARE_AI_GATEWAY_API_KEY) {
      throw new Error("Missing Cloudflare AI Gateway configuration");
    }

    // Adjusting endpoint if needed? The user said to use CLOUDFLARE_AI_GATEWAY_ENDPOINT
    // if the endpoint requires appending the model, we can do it here, but per instructions,
    // we use it exactly as provided. Let's assume the Gateway is configured to route.
    const url = CLOUDFLARE_AI_GATEWAY_ENDPOINT;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_AI_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        model: TTS_MODEL_ID,
        text,
        speaker: voice,
        encoding: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Aura-2 API Error: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  public async generateAudio({
    text,
    voice = "zeus",
  }: GenerateAudioOptions): Promise<GenerateAudioResult> {
    try {
      const buffer = await this.getAudioBuffer(text, voice);
      
      // We pass the UUID or timestamp as part of the filename for uniqueness
      const fileName = `${voice}.mp3`;
      const path = await s3Service.uploadAudio(buffer, fileName);

      return {
        success: true,
        audioPath: path,
        text,
      };
    } catch (error) {
      console.error("[GENERATE_AUDIO_ERROR]", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        text,
      };
    }
  }

  public async generateAudioFile(
    segments: { content: string; voice: string }[]
  ) {
    const audioBuffers = await Promise.all(
      segments.map(async (segment) => {
        try {
          return await this.getAudioBuffer(segment.content, segment.voice);
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
    const path = await s3Service.uploadAudio(mergedBuffer, fileName);

    return {
      audioPath: path,
    };
  }

  public async generateCaptions(
    audioUrlOrPath: string
  ): Promise<CaptionWord[]> {
    try {
      console.log("Fetching audio for transcription...", { audioUrlOrPath });

      // Assuming audioUrlOrPath might be a signed URL or path. In our system,
      // it's likely a path now. So we must get the signed URL to fetch the file contents.
      let signedUrl = audioUrlOrPath;
      if (!audioUrlOrPath.startsWith("http")) {
        signedUrl = await s3Service.getSignedUrl(audioUrlOrPath);
      }

      const audioRes = await fetch(signedUrl);
      if (!audioRes.ok) {
        throw new Error(`Failed to fetch audio: ${audioRes.statusText}`);
      }
      const contentType = audioRes.headers.get("content-type") || "audio/mpeg";
      const arrayBuffer = await audioRes.arrayBuffer();
      const audioBase64 = Buffer.from(arrayBuffer).toString("base64");

      if (!CLOUDFLARE_AI_GATEWAY_ENDPOINT || !CLOUDFLARE_AI_GATEWAY_API_KEY) {
        throw new Error("Missing Cloudflare AI Gateway configuration");
      }

      const response = await fetch(CLOUDFLARE_AI_GATEWAY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CLOUDFLARE_AI_GATEWAY_API_KEY}`,
        },
        body: JSON.stringify({
          model: STT_MODEL_ID,
          audio: {
            body: audioBase64,
            contentType: contentType,
          },
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

      const captions =
        data?.results?.channels?.[0]?.alternatives?.[0]?.words || [];

      console.log("Captions generated successfully", {
        captionCount: captions.length || 0,
      });

      return captions;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Caption generation failed", { error: error.message });
      } else {
        console.error("Caption generation failed", { error });
      }
      return [];
    }
  }

  public async generateImage(
    options: GenerateImageOptions
  ): Promise<GenerateImageResult> {
    const {
      mode = "text-to-image",
      prompt,
      images = [],
      mask,
      strength = 1.0,
      width = 1024,
      height = 1024,
      steps = 4,
      seed,
    } = options;

    const MODEL_NAME = IMAGE_GENERATION_MODEL_ID;

    if (!CLOUDFLARE_AI_GATEWAY_API_KEY) {
      return {
        success: false,
        error: "Missing CLOUDFLARE_AI_GATEWAY_API_KEY",
        prompt,
        model: MODEL_NAME,
      };
    }

    try {
      let response: Response;

      const isFormDataNeeded =
        mode !== "text-to-image" || images.length > 0 || !!mask;

      if (!isFormDataNeeded) {
        response = await fetch(CLOUDFLARE_AI_GATEWAY_ENDPOINT!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CLOUDFLARE_AI_GATEWAY_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            prompt,
            width,
            height,
            steps,
            seed,
          }),
        });
      } else {
        const form = new FormData();
        form.append("model", MODEL_NAME);
        form.append("prompt", prompt);
        if (width) form.append("width", width.toString());
        if (height) form.append("height", height.toString());
        if (steps) form.append("steps", steps.toString());
        if (seed !== undefined) form.append("seed", seed.toString());

        if (images.length === 1) {
          form.append("image", images[0] as Blob);
        } else if (images.length > 1) {
          images.forEach((img, index) => {
            form.append(`image${index}`, img as Blob);
          });
        }

        if (mode === "image-to-image" || mode === "inpaint") {
          if (strength !== undefined)
            form.append("strength", strength.toString());
          if (mode === "inpaint" && mask) {
            form.append("mask", mask as Blob);
          }
        }

        response = await fetch(CLOUDFLARE_AI_GATEWAY_ENDPOINT!, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_AI_GATEWAY_API_KEY}`,
          },
          body: form,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Image generation failed (${response.status}): ${errorText}`
        );
      }

      const contentType = response.headers.get("content-type") || "";
      let imageBuffer: Buffer;

      if (contentType.includes("application/json")) {
        const data = await response.json();
        const base64Str = data?.result?.image || data?.image;

        if (!base64Str) {
          throw new Error(
            "API returned JSON but no image base64 data was found in response payload."
          );
        }

        imageBuffer = Buffer.from(base64Str, "base64");
      } else {
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }

      // Save to S3
      const fileName = `generated-image.png`;
      const path = await s3Service.uploadImage(imageBuffer, fileName);

      return {
        success: true,
        imagePath: path,
        prompt,
        width,
        height,
        model: MODEL_NAME,
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
        model: MODEL_NAME,
      };
    }
  }

  public async generateObject({
    messages,
    outputSchema,
  }: {
    messages: Message[];
    outputSchema: Record<string, any>;
  }) {
    if (!CLOUDFLARE_AI_GATEWAY_API_KEY || !CLOUDFLARE_AI_GATEWAY_ENDPOINT) {
      throw new Error("Cloudflare AI Gateway configuration is missing");
    }

    const response = await fetch(CLOUDFLARE_AI_GATEWAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_AI_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL_ID,
        messages: messages,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "response_schema",
            strict: true,
            schema: outputSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `AI Gateway Object Generation Error (${response.status}): ${errorText}`
      );
    }

    const result = await response.json();

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error("Unexpected response format from Gateway");
    }

    const content = result.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch {
      console.error("Failed to parse JSON from model response:", content);
      throw new Error("Model returned invalid JSON");
    }
  }
}

export const aiService = new AIServiceClass();
