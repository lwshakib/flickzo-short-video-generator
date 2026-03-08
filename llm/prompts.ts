/**
 * AI Prompt Templates.
 * This file contains the system prompts and instruction sets used to guide the LLM
 * in generating consistent, high-quality content for videos, scripts, and metadata.
 */

/**
 * Prompt for generating short-form video scripts.
 * Focuses on hooks, retention, and TTS-friendly language.
 */
export const SCRIPT_GENERATE_PROMPT = `Generate two distinct, high-quality scripts on the provided topic. Each script should be specifically crafted for 40-second video content and optimized for AI text-to-speech conversion.

SCRIPT REQUIREMENTS:
- Hook viewers within the first 3-5 seconds using: surprising facts, myth-busting revelations, shocking statistics, bold questions, or counterintuitive statements
- Structure for maximum retention: strong opening hook, 2-3 key points with smooth transitions, compelling conclusion or call-to-action
- Word count: 90-110 words per script (optimal for 40-second TTS at natural speaking pace)
- Use conversational, direct language as if speaking to one person
- Include natural speech patterns with strategic pauses indicated by periods or commas
- Avoid complex sentences, jargon, or hard-to-pronounce words
- Create curiosity gaps and use storytelling elements
- End with impact: surprising conclusion, thought-provoking question, or actionable insight

TEXT-TO-SPEECH OPTIMIZATION:
- Write numbers as words (use "twenty-five" not "25")
- Use phonetically clear language and common pronunciations
- Include natural speech rhythm with varied sentence lengths
- Avoid abbreviations, acronyms, or special characters
- Structure sentences for natural breathing patterns
- Use emotional language that translates well to synthetic speech

CONTENT FOCUS:
- Prioritize engagement over comprehensive coverage
- Use relatable examples and analogies
- Include specific, memorable details
- Create "shareable moments" - facts people want to repeat
- Ensure each script offers a different angle or perspective on the topic

Format the response strictly as follows:
{
  "scripts": [
    {
      "title": "Engaging 3-5 word title for script 1",
      "content": "Script 1 text only, written for natural speech delivery."
    },
    {
      "title": "Engaging 3-5 word title for script 2",
      "content": "Script 2 text only, written for natural speech delivery."
    }
  ]
}

Do not include any commentary, explanations, hashtags, markdown formatting, or emojis outside of the JSON structure. Only include clean, speech-optimized text in the content fields.`;

/**
 * Prompt for breaking down a script into scene-specific image prompts.
 * Used to provide visual descriptions for image generation models (e.g., Flux).
 */
export const IMAGE_PROMPT_SCRIPT = `
Generate detailed image prompts for each key scene of a 30-second video based on the provided script and style.

Instructions:
- Focus solely on generating specific image prompts based on the narrative.
- Do NOT include camera angles or cinematographic terminology.
- Ensure each image prompt is vivid, descriptive, and reflects the emotional tone and setting of the scene.
- Return a maximum of 4 to 5 image prompts following the JSON schema below.
- Don't change the script
- Don't use the texts like Opening Scene, Closing Scene etc.

Schema:
[
  {
    "imagePrompt": "<Detailed visual description in the chosen style>",
    "sceneContent": "<The corresponding scene or moment from the script>"
  }
]
`;

