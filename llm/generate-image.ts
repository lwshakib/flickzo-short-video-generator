import { ThinkingLevel } from "@google/genai";
import type { GoogleGenAI } from "@google/genai";
import { IMAGE_MODEL_ID } from "@/llm/constants";
import { dimensionsToGeminiAspectRatio } from "@/llm/aspect-ratio";
import { getGoogleGenAI } from "@/llm/client";
import { imageInputToBase64 } from "@/llm/to-base64";
import type { GenerateImageLlmResult, GenerateImageOptions } from "@/llm/types";

/**
 * Gemini-native image (“Nano Banana” style flow from `tmp/code_examples.md`).
 */
export async function generateImage(
  options: GenerateImageOptions,
  client?: GoogleGenAI
): Promise<GenerateImageLlmResult> {
  const {
    prompt,
    images = [],
    width = 1024,
    height = 1024,
    aspectRatio: aspectRatioOpt,
    imageSize = "1K",
    thinkingLevel = "Minimal",
    includeThoughts = false,
  } = options;

  const ai = client ?? getGoogleGenAI();

  try {
    const contents: Record<string, unknown>[] = [{ text: prompt }];

    if (images.length > 0) {
      const base64Images = await Promise.all(
        images.slice(0, 14).map(async (img) => {
          const data = await imageInputToBase64(img);
          const mimeType =
            img instanceof Blob || img instanceof File
              ? img.type
              : "image/png";
          return {
            inlineData: {
              data,
              mimeType: mimeType || "image/png",
            },
          };
        })
      );
      contents.push(...base64Images);
    }

    const aspectRatio =
      aspectRatioOpt ??
      dimensionsToGeminiAspectRatio(width, height ?? width);

    const tl =
      thinkingLevel === "High" ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_ID,
      contents,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
        imageConfig: {
          aspectRatio,
          imageSize,
        },
        thinkingConfig: {
          thinkingLevel: tl,
          includeThoughts,
        },
      },
    });

    let generatedImageBase64 = "";
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (
        part?.inlineData?.data &&
        part.inlineData.mimeType?.startsWith("image/") &&
        !part.thought
      ) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
      const anyImagePart = parts.find(
        (p) =>
          p?.inlineData?.data && p.inlineData.mimeType?.startsWith("image/")
      );
      if (anyImagePart?.inlineData?.data) {
        generatedImageBase64 = anyImagePart.inlineData.data;
      }
    }

    if (!generatedImageBase64) {
      throw new Error("Gemini image generation returned no raster data");
    }

    return {
      success: true,
      image: `data:image/png;base64,${generatedImageBase64}`,
      prompt,
      model: IMAGE_MODEL_ID,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error ?? "failure");
    console.error("[GENERATE_IMAGE_LLM]", message);
    return {
      success: false,
      prompt,
      model: IMAGE_MODEL_ID,
      error: message,
    };
  }
}
