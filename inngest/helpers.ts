import { aiService, CaptionWord } from "@/services/ai.services";
import { inngest } from "./client";
import { GetStepTools } from "inngest";
import { IMAGE_PROMPT_SCRIPT } from "@/lib/prompts";

/**
 * Interface representing the result of an image generation.
 */
interface ImageResult {
  path: string;
  prompt: string;
  content: string;
}

/**
 * Generates audio from text using an LLM and saves it to S3.
 *
 * @param text The text to convert to speech.
 * @param voice The voice ID or name to use for generation.
 * @returns An object containing the S3 path and the original text.
 */
export async function generateVideoAudio(text: string, voice: string) {
  // Call the LLM service to generate and upload the audio
  const audioResult = await aiService.generateAudio({ text, voice });
  if (!audioResult.success || !audioResult.audioPath) {
    throw new Error(audioResult.error || "Failed to generate audio");
  }

  return {
    audioPath: audioResult.audioPath,
    text: text,
  };
}

/**
 * Transcribes audio from a given URL or S3 path via AI Service.
 *
 * @param audioPath The URL or path of the audio file to transcribe.
 * @param step The Inngest step tool for reliable execution.
 * @returns A promise that resolves to an array of CaptionWord objects.
 */
export async function transcribeAudio(
  audioPath: string,
  step: GetStepTools<typeof inngest>
): Promise<CaptionWord[]> {
  const captions = await step.run("transcribe-audio", async () => {
    return await aiService.generateCaptions(audioPath);
  });
  return captions;
}

/**
 * Generates a series of images based on a script and video style.
 * This function first generates image prompts using an AI model and then
 * generates actual images for each prompt via AI service to S3.
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
  // Define raw JSON schema for the image prompts we expect from the AI
  const imagePromptsSchema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        imagePrompt: { type: "string" },
        sceneContent: { type: "string" },
      },
      required: ["imagePrompt", "sceneContent"],
      additionalProperties: false,
    },
  };

  // Step A: Generate image prompts using the AI model
  const imagePrompts = (await step.run("generate-image-prompts", async () => {
    return await aiService.generateObject({
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
        // Call the image generation service
        const result = await aiService.generateImage({
          prompt: promptData.imagePrompt,
          width: 576,
          height: 1024, // Optimized 9:16 aspect ratio fitting within Cloudflare (max 1024) limits
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to generate image");
        }
        return {
          path: result.imagePath!,
          prompt: result.prompt,
          content: promptData.sceneContent,
        };
      }
    )) as ImageResult;
    images.push(imageResult);
  }

  return images;
}
