/**
 * Preset styles for the generated videos.
 * Each style includes a user-friendly label and a corresponding preview image path.
 */
export const videoStyles = [
  { label: "Anime", src: "/styles/anime.png" },
  { label: "GTA", src: "/styles/gta.png" },
  { label: "Cyberpunk", src: "/styles/cyberpunk.png" },
  { label: "Watercolor", src: "/styles/watercolor.png" },
  { label: "Cartoon", src: "/styles/cartoon.png" },
  { label: "Cinematic", src: "/styles/cinematic.png" },
  { label: "Realistic", src: "/styles/realistic.png" },
];

/**
 * Available voices for Text-to-Speech (TTS) using Deepgram Aura.
 * Each voice includes metadata such as gender, model ID, and descriptive traits.
 */
export const videoVoices = [
  {
    Gender: "Female",
    Id: "Thalia",
    LanguageCode: "en-US",
    LanguageName: "US English",
    Name: "Thalia",
    Model: "aura-2-thalia-en",
    SupportedEngines: ["aura-2"],
    Description: "Clear, Confident, Energetic, Enthusiastic",
  },
  {
    Gender: "Female",
    Id: "Helena",
    LanguageCode: "en-US",
    LanguageName: "US English",
    Name: "Helena",
    Model: "aura-2-helena-en",
    SupportedEngines: ["aura-2"],
    Description: "Caring, Natural, Positive, Friendly, Raspy",
  },
  {
    Gender: "Male",
    Id: "Arcas",
    LanguageCode: "en-US",
    LanguageName: "US English",
    Name: "Arcas",
    Model: "aura-2-arcas-en",
    SupportedEngines: ["aura-2"],
    Description: "Natural, Smooth, Clear, Comfortable",
  },
  {
    Gender: "Male",
    Id: "Zeus",
    LanguageCode: "en-US",
    LanguageName: "US English",
    Name: "Zeus",
    Model: "aura-2-zeus-en",
    SupportedEngines: ["aura-2"],
    Description: "Deep, Trustworthy, Smooth",
  },
];

/**
 * Styling presets for the video captions.
 * These map to CSS utility classes (Tailwind) used in the video player or generator.
 */
export const captionStyles = [
  { label: "YOUTUBER", className: "text-yellow-400 font-extrabold" },
  { label: "Supreme", className: "italic text-white font-semibold" },
  { label: "NEON", className: "text-green-400 font-bold" },
  { label: "GLITCH", className: "text-pink-500 font-bold" },
  { label: "FIRE", className: "text-red-400 font-bold" },
  { label: "Futuristic", className: "text-cyan-400 font-bold" },
];

/**
 * Suggestion keywords for the video generator prompt input.
 */
export const suggestions = [
  "History",
  "Kids Story",
  "AI",
  "Innovation",
  "Travel",
  "Science",
  "Motivation",
  "Technology",
  "Fitness",
  "Cooking",
  "Finance",
  "Education",
  "Gaming",
  "Music",
  "Nature",
  "Comedy",
  "Fashion",
  "Sports",
  "Productivity",
  "Self Improvement",
  "Mystery",
  "Space",
  "Health",
  "Art",
  "Entrepreneurship",
];
