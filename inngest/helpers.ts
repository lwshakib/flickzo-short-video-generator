import {
  generateAudio as llmGenerateAudio,
} from "@/llm/generateAudio";
import { inngest } from "./client";
import { GetStepTools } from "inngest";
import { saveAudioToCloudinary } from "@/lib/cloudinary";
import { generateImage } from "@/llm/generateImage";
import { generateObjectFromAI } from "@/llm/generateObject";
import { generateCaptions as llmGenerateCaptions, CaptionWord } from "@/llm/generateCaptions";
import { IMAGE_PROMPT_SCRIPT } from "@/llm/prompts";
import { z } from "zod";

/**
 * Interface representing the result of an image generation.
 */
interface ImageResult {
  url: string;
  publicId: string;
  prompt: string;
  content: string;
}

/**
 * Generates audio from text using an LLM and saves it to Cloudinary.
 *
 * @param text The text to convert to speech.
 * @param voice The voice ID or name to use for generation.
 * @returns An object containing the Cloudinary URL, public ID, and the original text.
 */
export async function generateVideoAudio(text: string, voice: string) {
  // Call the LLM service to generate and upload the audio
  const audioResult = await llmGenerateAudio({ text, voice });
  if (!audioResult.success || !audioResult.audioUrl) {
    throw new Error(audioResult.error || "Failed to generate audio");
  }

  return {
    audioUrl: audioResult.audioUrl,
    publicId: audioResult.publicId!,
    text: text,
  };
}

/**
 * Transcribes audio from a given URL using Deepgram's Nova-3 model.
 *
 * @param audioUrl The URL of the audio file to transcribe.
 * @param step The Inngest step tool for reliable execution.
 * @returns A promise that resolves to an array of CaptionWord objects.
 */
export async function transcribeAudio(
  audioUrl: string,
  step: GetStepTools<typeof inngest>
): Promise<CaptionWord[]> {
  const captions = await step.run("transcribe-audio", async () => {
    return await llmGenerateCaptions(audioUrl);
  });
  return captions;
}

/**
 * Generates a series of images based on a script and video style.
 * This function first generates image prompts using an AI model and then
 * generates actual images for each prompt.
 *
 * @param script The video script.
 * @param style The desired visual style for the images.
 * @param step The Inngest step tool for reliable execution.
 * @returns A promise that resolves to an array of ImageResult objects.
 */
export async function generateImages(
  script: string,
  style: string,
  step: GetStepTools<typeof inngest>
): Promise<ImageResult[]> {
  // Define the schema for the image prompts we expect from the AI
  const imagePromptsSchema = z.array(
    z.object({
      imagePrompt: z.string(),
      sceneContent: z.string(),
    })
  );

  // Step A: Generate image prompts using the AI model
  const imagePrompts = (await step.run("generate-image-prompts", async () => {
    return await generateObjectFromAI({
      messages: [
        { role: "system", content: IMAGE_PROMPT_SCRIPT },
        { role: "user", content: `Script: ${script}\nStyle: ${style}` },
      ],
      outputSchema: imagePromptsSchema,
    });
  })) as { imagePrompt: string; sceneContent: string }[];

  const images: ImageResult[] = [];
  // Step B: Loop through each prompt and generate the actual image
  for (let i = 0; i < imagePrompts.length; i++) {
    const promptData = imagePrompts[i];
    const imageResult = (await step.run(
      `generate-image-${i + 1}/${imagePrompts.length}`,
      async () => {
        // Call the image generation service (e.g., Flux)
        const result = await generateImage({
          prompt: promptData.imagePrompt,
          width: 1024,
          height: 1792, // 9:16 aspect ratio optimized for vertical short-form video
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to generate image");
        }
        return {
          url: result.image!,
          publicId: result.publicId!,
          prompt: result.prompt,
          content: promptData.sceneContent,
        };
      }
    )) as ImageResult;
    images.push(imageResult);
  }

  return images;
}
