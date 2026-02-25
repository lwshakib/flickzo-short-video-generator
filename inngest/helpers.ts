import {
  deepgramClient,
  generateAudio as llmGenerateAudio,
} from "@/llm/generateAudio";
import { inngest } from "./client";
import { GetStepTools } from "inngest";
import { saveAudioToCloudinary } from "@/lib/save-audio-to-cloudinary";
import { generateImage } from "@/llm/generateImage";
import { generateObjectFromAI } from "@/llm/generateObject";
import { IMAGE_PROMPT_SCRIPT } from "@/llm/prompts";
import { z } from "zod";

interface CaptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

interface ImageResult {
  url: string;
  publicId: string;
  prompt: string;
  content: string;
}

export async function generateAudio(text: string, voice: string) {
  const audioResult = await llmGenerateAudio({ text, voice });
  if (!audioResult.success || !audioResult.buffer) {
    throw new Error(audioResult.error || "Failed to generate audio");
  }

  const cloudinaryResult = await saveAudioToCloudinary(audioResult.buffer);

  return {
    audioUrl: cloudinaryResult.audioUrl,
    publicId: cloudinaryResult.publicId,
    text: text,
  };
}

export async function generateCaptions(
  audioUrl: string,
  step: GetStepTools<typeof inngest>
): Promise<CaptionWord[]> {
  const captions = await step.run("transcribe-audio", async () => {
    const { result, error } =
      await deepgramClient.listen.prerecorded.transcribeUrl(
        {
          url: audioUrl,
        },
        {
          model: "nova-3",
          smart_format: true,
        }
      );
    if (error) throw error;
    return result.results.channels[0]?.alternatives[0].words as CaptionWord[];
  });
  return captions;
}

export async function generateImages(
  script: string,
  style: string,
  step: GetStepTools<typeof inngest>
): Promise<ImageResult[]> {
  const imagePromptsPrompt = IMAGE_PROMPT_SCRIPT.replace(
    "{{STYLE}}",
    style
  ).replace("{{SCRIPT}}", script);

  const imagePromptsSchema = z.array(
    z.object({
      imagePrompt: z.string(),
      sceneContent: z.string(),
    })
  );

  const imagePrompts = (await step.run("generate-image-prompts", async () => {
    return await generateObjectFromAI(imagePromptsPrompt, imagePromptsSchema);
  })) as { imagePrompt: string; sceneContent: string }[];

  const images = [];
  for (let i = 0; i < imagePrompts.length; i++) {
    const promptData = imagePrompts[i];
    const imageResult = (await step.run(
      `generate-image-${i + 1}/${imagePrompts.length}`,
      async () => {
        const result = await generateImage({
          prompt: promptData.imagePrompt,
          width: 1024,
          height: 1792, // 9:16 aspect ratio for vertical video
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to generate image");
        }
        return {
          url: result.image,
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
