import { TTS_MODEL_ID } from '@/lib/constants';
import { GenerateAudioOptions, GenerateAudioResult } from '@/types/ai';

/**
 * Audio Generation (Deepgram Aura)
 */
export async function generateAudio(
  options: GenerateAudioOptions,
  config: { deepgramKey: string }
): Promise<GenerateAudioResult> {
  const { text, voice = 'luna' } = options;
  const { deepgramKey } = config;

  try {
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=aura-${voice.toLowerCase()}-en`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${deepgramKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram TTS error (${response.status}): ${errorText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return { success: true, buffer, text };
  } catch (error) {
    console.error('[GENERATE_AUDIO_ERROR]', error);
    return { success: false, error: String(error), text };
  }
}


import { DeepgramClient } from '@deepgram/sdk';
import { TRANSCRIPTION_MODEL_ID } from '@/lib/constants';

/**
 * Transcription (Deepgram Nova-3) using official SDK v5
 */
export async function generateCaptions(
  audioUrl: string,
  config: { deepgramKey: string },
  keyterms?: string[]
): Promise<any[]> {
  const { deepgramKey } = config;

  if (!deepgramKey) {
    console.error('[GENERATE_CAPTIONS_ERROR] Deepgram API key is missing');
    return [];
  }

  // Deepgram SDK v5 uses the options object for initialization
  const deepgram = new DeepgramClient({ apiKey: deepgramKey });

  try {
    // Deepgram SDK v5 method path for remote URL transcription.
    // We cast the options object to 'any' to resolve the TypeScript error:
    // "Object literal may only specify known properties, and 'model' does not exist in type 'RequestOptions'".
    const response = await deepgram.listen.v1.media.transcribeUrl({ url: audioUrl }, {
      model: TRANSCRIPTION_MODEL_ID, // nova-3
      smart_format: true,
      punctuate: true,
      keyterm: keyterms,
    } as any);

    // Deepgram SDK v5 returns a union type that might be an 'Accepted' response (for callbacks).
    // Since we are using it synchronously, we cast to 'any' to access the 'results' property safely.
    // We also handle both 'response.results' and 'response.result.results' patterns seen in different v5 sub-versions.
    const res = response as any;
    const results = res.results || res.result?.results;

    return results?.channels[0]?.alternatives[0]?.words || [];
  } catch (error) {
    console.error('[GENERATE_CAPTIONS_ERROR]', error);
    return [];
  }
}


import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { IMAGE_MODEL_ID } from '@/lib/constants';
import { GenerateImageOptions, GenerateImageResult } from '@/types/ai';

/**
 * Utility to convert various image inputs to Base64
 */
export async function toBase64(input: Blob | Buffer | File | string): Promise<string> {
  if (typeof input === 'string') {
    // If it's already a data URL, strip the prefix
    return input.replace(/^data:image\/\w+;base64,/, '');
  }
  if (Buffer.isBuffer(input)) {
    return input.toString('base64');
  }
  if (input instanceof Blob) {
    const arrayBuffer = await input.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  }
  return '';
}

/**
 * Nano Banana Image Generation (Gemini 3 Image Models)
 * Supports Text-to-Image, Image Editing, and Reasoning (Thinking).
 */
export async function generateImage(
  options: GenerateImageOptions,
  config: { apiKey: string }
): Promise<GenerateImageResult> {
  const {
    prompt,
    images = [],
    aspectRatio = '1:1',
    imageSize = '1K',
    thinkingLevel = 'Minimal',
    includeThoughts = false,
  } = options;
  const { apiKey } = config;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents: any[] = [];

    // Add prompt text
    contents.push({ text: prompt });

    // Handle reference images (Up to 14 for Gemini 3.1 Flash Image)
    if (images.length > 0) {
      const base64Images = await Promise.all(
        images.slice(0, 14).map(async (img) => {
          const data = await toBase64(img);
          const mimeType = img instanceof Blob || img instanceof File ? img.type : 'image/png';

          return {
            inlineData: {
              data,
              mimeType: mimeType || 'image/png',
            },
          };
        })
      );
      contents.push(...base64Images);
    }

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_ID,
      contents,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: {
          aspectRatio,
          imageSize,
        },
        thinkingConfig: {
          thinkingLevel: thinkingLevel === 'High' ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL,
          includeThoughts,
        },
      },
    });

    // Extract the final generated image
    // Gemini returns multiple parts; the final image is usually the last non-thought image part.
    let generatedImageBase64 = '';
    const parts = response.candidates?.[0]?.content?.parts || [];

    // Iterate backwards to find the final rendered image
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (
        part.inlineData?.data &&
        part.inlineData.mimeType?.startsWith('image/') &&
        !part.thought
      ) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
      // Fallback: Check if any image part exists if no "non-thought" one was found
      const anyImagePart = parts.find(
        (p) => p.inlineData?.data && p.inlineData.mimeType?.startsWith('image/')
      );
      if (anyImagePart) {
        generatedImageBase64 = anyImagePart.inlineData!.data!;
      }
    }

    if (!generatedImageBase64) {
      throw new Error('Nano Banana: No image returned from model');
    }

    return {
      success: true,
      image: `data:image/png;base64,${generatedImageBase64}`,
      prompt,
      model: IMAGE_MODEL_ID,
    };
  } catch (error: any) {
    console.error('Nano Banana Error:', error);
    return {
      success: false,
      prompt,
      model: IMAGE_MODEL_ID,
      error: error.message || 'Failed to generate image',
    };
  }
}

import { GoogleGenAI } from '@google/genai';
import { CHAT_MODEL_ID } from '@/lib/constants';
import { GenerateObjectOptions } from '@/types/ai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

/**
 * Structured JSON Generation using the Gemini 3 Chat System and Zod
 * Supports Multimodal inputs and follows Best Practices.
 */
export async function generateObject<T>(
  options: GenerateObjectOptions,
  config: { apiKey: string }
): Promise<T> {
  const { messages, outputSchema, temperature } = options;
  const { apiKey } = config;

  const ai = new GoogleGenAI({ apiKey });

  const jsonSchema =
    outputSchema instanceof z.ZodType
      ? (zodToJsonSchema(outputSchema as any) as any)
      : outputSchema;

  const systemInstruction = messages.find((m: any) => m.role === 'system')?.content;

  const conversationMessages = messages.filter((m: any) => m.role !== 'system');
  const history = conversationMessages.slice(0, -1).map((m: any) => {
    const parts: any[] = [];
    if (typeof m.content === 'string') {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      parts.push(...m.content);
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const lastMessageContent = lastMessage.content;

  const chat = ai.chats.create({
    model: CHAT_MODEL_ID,
    history,
    config: {
      systemInstruction,
      temperature: temperature ?? 1.0,
      responseMimeType: 'application/json',
      responseJsonSchema: jsonSchema,
    },
  });

  const response = await chat.sendMessage({
    message: lastMessageContent,
  });

  if (!response.text) {
    throw new Error('Gemini 3 Chat: No response text returned for generateObject');
  }

  try {
    return JSON.parse(response.text) as T;
  } catch (error) {
    console.error('Gemini 3 Chat: Failed to parse structured output:', response.text);
    throw new Error('Gemini 3 Chat: Invalid JSON returned from model');
  }
}

import { GoogleGenAI } from '@google/genai';
import { CHAT_MODEL_ID } from '@/lib/constants';
import { GenerateTextOptions } from '@/types/ai';

/**
 * Non-streaming Text Generation using the Gemini 3 Chat System
 * Supports Multimodal inputs and follows Best Practices (Temp 1.0).
 */
export async function generateText(
  options: GenerateTextOptions,
  config: { apiKey: string }
): Promise<string> {
  const { messages, temperature } = options;
  const { apiKey } = config;

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = messages.find((m: any) => m.role === 'system')?.content;

  const conversationMessages = messages.filter((m: any) => m.role !== 'system');
  const history = conversationMessages.slice(0, -1).map((m: any) => {
    const parts: any[] = [];
    if (typeof m.content === 'string') {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      parts.push(...m.content);
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const lastMessageContent = lastMessage.content;

  const chat = ai.chats.create({
    model: CHAT_MODEL_ID,
    history,
    config: {
      systemInstruction,
      // Gemini 3 recommends temperature 1.0
      temperature: temperature ?? 1.0,
    },
  });

  const response = await chat.sendMessage({
    message: lastMessageContent,
  });

  return response.text || '';
}

import { CHAT_MODEL_ID } from '@/lib/constants';
import { StreamTextOptions, ToolContext, InferaTool } from '@/types/ai';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createTools } from './tools';

/**
 * SSE Text Streaming with Multi-turn Chat, Multimodal support, and Zod Tools
 */
export async function streamText(options: StreamTextOptions, config: { apiKey: string }) {
  const { messages, context, onFinish, abortSignal } = options;
  const { apiKey } = config;

  const ai = new GoogleGenAI({ apiKey });
  const toolHandlers = context ? createTools(context) : {};

  const functionDeclarations = Object.values(toolHandlers).map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema as any) as any,
  }));

  const tools = functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined;
  const systemInstruction = messages.find((m: any) => m.role === 'system')?.content;

  // Robust history conversion with Multimodal support
  const conversationMessages = messages.filter((m: any) => m.role !== 'system');
  const history = conversationMessages.slice(0, -1).map((m: any) => {
    const parts: any[] = [];

    // Prioritize 'parts' as they contain rich multimodal and tool data
    if (Array.isArray(m.parts) && m.parts.length > 0) {
      m.parts.forEach((p: any) => {
        if (p.type === 'text') {
          parts.push({ text: p.text });
        } else if (p.type === 'reasoning') {
          // Skip reasoning/thought parts in history for better stability across turns
          // unless explicitly required by the model.
        } else if (p.type?.startsWith('tool-')) {
          // If it has output, it's a function response turn
          if (p.output) {
            parts.push({
              functionResponse: {
                name: p.type.replace('tool-', ''),
                response: p.output,
                id: p.toolCallId,
              },
            });
          } else {
            // Otherwise it's the function call part
            parts.push({
              functionCall: {
                name: p.type.replace('tool-', ''),
                args: p.args,
                id: p.toolCallId,
              },
            });
          }
        } else if (p.inlineData) {
          // Multimodal parts (images, audio)
          parts.push({ inlineData: p.inlineData });
        }
      });
    } else if (typeof m.content === 'string' && m.content) {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      parts.push(...m.content);
    }

    // Fallback for legacy toolInvocations format
    if (m.toolInvocations && parts.length === 1 && parts[0].text) {
      m.toolInvocations.forEach((ti: any) => {
        if (ti.result !== undefined) {
          parts.push({
            functionResponse: {
              name: ti.toolName,
              response: ti.result,
              id: ti.toolCallId,
            },
          });
        } else {
          parts.push({
            functionCall: {
              name: ti.toolName,
              args: ti.args,
              id: ti.toolCallId,
            },
          });
        }
      });
    }

    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts,
    };
  });

  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const lastMessageParts: any[] = [];

  if (Array.isArray(lastMessage.parts) && lastMessage.parts.length > 0) {
    lastMessage.parts.forEach((p: any) => {
      if (p.type === 'text') lastMessageParts.push({ text: p.text });
      else if (p.inlineData) lastMessageParts.push({ inlineData: p.inlineData });
    });
  } else if (typeof lastMessage.content === 'string' && lastMessage.content) {
    lastMessageParts.push({ text: lastMessage.content });
  } else if (Array.isArray(lastMessage.content)) {
    lastMessageParts.push(...lastMessage.content);
  }

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let finalContent = '';
      let finalReasoning = '';
      const finalToolInvocations: any[] = [];
      const sendEvent = (data: any) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const chat = ai.chats.create({
          model: CHAT_MODEL_ID,
          history,
          config: {
            systemInstruction,
            tools,
            // Gemini 3 recommends temperature 1.0 for optimal reasoning
            temperature: 1.0,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
              includeThoughts: true,
            },
          },
        });

        let currentMessage: any = lastMessageParts;
        let toolCallsAttempt = 0;

        while (toolCallsAttempt < 10) {
          if (abortSignal?.aborted) break;

          const stream = await chat.sendMessageStream({
            message: currentMessage,
          });

          let assistantContent = '';
          let assistantThoughts = '';
          let toolCalls: any[] = [];

          for await (const chunk of stream) {
            if (abortSignal?.aborted) break;

            const parts = chunk.candidates?.[0]?.content?.parts || [];

            for (const part of parts) {
              // Extract thoughts (reasoning)
              if (part.thought) {
                const thoughts = part.text || '';
                if (thoughts) {
                  assistantThoughts += thoughts;
                  finalReasoning += thoughts;
                  sendEvent({ type: 'reasoning', content: thoughts });
                }
              }

              // Extract text
              if (part.text && !part.thought) {
                const text = part.text;
                assistantContent += text;
                finalContent += text;
                sendEvent({ type: 'text', content: text });
              }

              // Extract tool calls (function calls)
              const fc = part.functionCall;
              if (fc) {
                // Ensure we don't add the same function call multiple times if it spans chunks
                if (!toolCalls.find((tc) => tc.id === fc.id)) {
                  toolCalls.push(fc);
                  // Emit event immediately so the UI shows the loading indicator
                  sendEvent({
                    type: 'tool_call',
                    id: fc.id,
                    name: fc.name,
                    args: fc.args,
                  });
                }
              }
            }
          }

          if (abortSignal?.aborted) break;

          if (toolCalls.length > 0) {
            toolCallsAttempt++;
            const toolResultsParts: any[] = [];

            for (const tc of toolCalls) {
              const toolName = tc.name;
              const args = tc.args;
              const tool = toolHandlers[toolName];

              if (tool) {
                try {
                  // Add a small artificial delay (min 600ms) so the UI shimmer is actually visible to the user
                  // especially for fast operations like vector searches.
                  const [result] = await Promise.all([
                    tool.execute(args),
                    new Promise((resolve) => setTimeout(resolve, 600)),
                  ]);

                  sendEvent({ type: 'tool_result', id: tc.id, result });
                  finalToolInvocations.push({ toolCallId: tc.id, toolName, args, result });

                  // Mandatory: map function ID back to the response turn
                  toolResultsParts.push({
                    functionResponse: { name: toolName, response: result, id: tc.id },
                  });
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  sendEvent({ type: 'tool_result', id: tc.id, error: msg });
                  finalToolInvocations.push({ toolCallId: tc.id, toolName, args, error: msg });
                  toolResultsParts.push({
                    functionResponse: { name: toolName, response: { error: msg }, id: tc.id },
                  });
                }
              } else {
                const error = 'Tool not found';
                sendEvent({ type: 'tool_result', id: tc.id, error });
                toolResultsParts.push({
                  functionResponse: { name: toolName, response: { error }, id: tc.id },
                });
              }
            }

            // Next turn with tool results
            currentMessage = toolResultsParts;
          } else {
            break;
          }
        }
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          console.error('Gemini 3 Stream Error:', err);
          sendEvent({ type: 'error', message: 'Streaming failed' });
          controller.error(err);
        }
      } finally {
        if (onFinish && (finalContent || finalReasoning || finalToolInvocations.length > 0)) {
          await onFinish({
            content: finalContent,
            reasoning: finalReasoning || undefined,
            toolInvocations: finalToolInvocations,
          });
        }
        controller.close();
      }
    },
  });
}