import OpenAI from "openai";

import { NEBIUS_API_KEY } from "@/lib/env";
import { cloudinaryClient } from "@/lib/save-audio-to-cloudinary";

export const nebiusClient = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: NEBIUS_API_KEY,
});




export interface GenerateImageOptions {
  prompt: string;
  width?: number;
  height?: number;
  negative_prompt?: string;
}

export interface GenerateImageResult {
  success: boolean;
  image?: string;
  publicId?: string;
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
  error?: string;
}

export const generateImage = async ({
  prompt,
  width = 1024,
  height = 1024,
  negative_prompt = "",
}: GenerateImageOptions): Promise<GenerateImageResult> => {
  if (!NEBIUS_API_KEY) {
    throw new Error("Missing NEBIUS_API_KEY");
  }

  try {
    const response = await fetch(
      "https://api.tokenfactory.nebius.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-schnell",
          response_format: "b64_json",
          response_extension: "png",
          width,
          height,
          num_inference_steps: 4,
          negative_prompt: negative_prompt || "",
          seed: -1,
          loras: null,
          prompt,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as any).error?.message || `API error: ${response.statusText}`
      );
    }

    const data = (await response.json()) as {
      data?: { b64_json?: string }[];
    };
    const base64Image = data.data?.[0]?.b64_json;

    if (!base64Image) {
      throw new Error("No image generated in response");
    }

    const imageBuffer = Buffer.from(base64Image, "base64");
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinaryClient.uploader
        .upload_stream(
          {
            folder: "loop-social-platform",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              reject(new Error("Upload returned no result"));
            }
          }
        )
        .end(imageBuffer);
    });

    return {
      success: true,
      image: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      prompt,
      width,
      height,
      model: "black-forest-labs/flux-schnell",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      prompt,
    };
  }
};