import OpenAI from "openai";

import { NEBIUS_API_KEY } from "@/lib/env";
import { cloudinaryClient } from "@/lib/save-audio-to-cloudinary";

/**
 * Nebius AI client initialization.
 * Used for high-performance image generation using models like Flux.
 * It uses an OpenAI-compatible SDK for easier integration.
 */
export const nebiusClient = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: NEBIUS_API_KEY,
});

/**
 * Options for the image generation function.
 */
export interface GenerateImageOptions {
  prompt: string; // The visual description for the AI to generate
  width?: number; // Image width in pixels
  height?: number; // Image height in pixels
  negative_prompt?: string; // Things to exclude from the image
}

/**
 * Result structure for the image generation process.
 */
export interface GenerateImageResult {
  success: boolean;
  image?: string; // The Resulting Cloudinary URL
  publicId?: string; // Cloudinary public ID for asset management
  prompt: string; // The final prompt used
  width?: number;
  height?: number;
  model?: string; // The model name used for generation
  error?: string; // Error message if the process fails
}

/**
 * Generates an image using Nebius AI (Flux Model) and uploads it to Cloudinary.
 *
 * @param options - Generation settings including prompt, dimensions, and styling.
 * @returns A promise resolving to the final image metadata and storage URLs.
 */
export const generateImage = async ({
  prompt,
  width = 1024,
  height = 1024,
  negative_prompt = "",
}: GenerateImageOptions): Promise<GenerateImageResult> => {
  // Ensure the API key is present before proceeding
  if (!NEBIUS_API_KEY) {
    throw new Error("Missing NEBIUS_API_KEY");
  }

  try {
    // Perform a POST request to the Nebius image generation endpoint
    const response = await fetch(
      "https://api.tokenfactory.nebius.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "black-forest-labs/flux-schnell", // High-speed Flux model
          response_format: "b64_json", // Request base64 response for immediate buffer conversion
          response_extension: "png",
          width,
          height,
          num_inference_steps: 4, // optimized for speed/quality balance with "schnell" model
          negative_prompt: negative_prompt || "",
          seed: -1, // Random seed for variability
          loras: null,
          prompt,
        }),
      }
    );

    // Handle non-200 responses from the AI provider
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { error?: { message?: string } }).error?.message ||
          `API error: ${response.statusText}`
      );
    }

    const data = (await response.json()) as {
      data?: { b64_json?: string }[];
    };
    const base64Image = data.data?.[0]?.b64_json;

    if (!base64Image) {
      throw new Error("No image generated in response");
    }

    // Convert the base64 string provided by Nebius into a Buffer for Cloudinary
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Upload the buffer directly to Cloudinary via a stream
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinaryClient.uploader
        .upload_stream(
          {
            folder: "flickzo/images", // Organized folder for app images
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
    // Categorize and return the error to the caller (e.g., Inngest workflow)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      prompt,
    };
  }
};
