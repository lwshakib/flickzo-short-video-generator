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
  { label: "Oil Painting", src: "/styles/oil-painting.png" },
  { label: "Charcoal Sketch", src: "/styles/sketch.png" },
];

export interface VideoVoice {
  name: string;
  id: string; // Model name
  gender: "Male" | "Female";
  description: string;
  sampleUrl: string;
}

/**
 * Available voices for Text-to-Speech (TTS) using Deepgram Aura.
 * Consolidates technical model names with human personas.
 */
export const videoVoices: VideoVoice[] = [
  // AUTHORITATIVE & POWERFUL
  { name: 'Robert', id: 'zeus', gender: 'Male', description: 'Deep, powerful, and commanding.', sampleUrl: '/audio/zeus.mp3' },
  { name: 'Sophie', id: 'athena', gender: 'Female', description: 'Intelligent, clear, and authoritative.', sampleUrl: '/audio/athena.mp3' },
  { name: 'Julian', id: 'jupiter', gender: 'Male', description: 'Regal and steady broadcaster feel.', sampleUrl: '/audio/jupiter.mp3' },
  { name: 'Hera', id: 'hera', gender: 'Female', description: 'Dignified, sophisticated, and strong.', sampleUrl: '/audio/hera.mp3' },
  { name: 'Minerva', id: 'minerva', gender: 'Female', description: 'Wise, analytical, and articulate.', sampleUrl: '/audio/minerva.mp3' },

  // FRIENDLY & SOFT
  { name: 'Sarah', id: 'luna', gender: 'Female', description: 'Soft, friendly, and inviting.', sampleUrl: '/audio/luna.mp3' },
  { name: 'David', id: 'apollo', gender: 'Male', description: 'Bright, enthusiastic, and approachable.', sampleUrl: '/audio/apollo.mp3' },
  { name: 'Lily', id: 'iris', gender: 'Female', description: 'Optimistic, energetic, and youthful.', sampleUrl: '/audio/iris.mp3' },
  { name: 'Aurora', id: 'aurora', gender: 'Female', description: 'Radiant, gentle, and calming.', sampleUrl: '/audio/aurora.mp3' },
  { name: 'Cora', id: 'cora', gender: 'Female', description: 'Kind, grounded, and sincere.', sampleUrl: '/audio/cora.mp3' },

  // DEEP & MASCULINE
  { name: 'Marcus', id: 'orion', gender: 'Male', description: 'Rich, resonant, and thoughtful.', sampleUrl: '/audio/orion.mp3' },
  { name: 'James', id: 'atlas', gender: 'Male', description: 'Calm, reliable, and solid.', sampleUrl: '/audio/atlas.mp3' },
  { name: 'Leo', id: 'mars', gender: 'Male', description: 'Dynamic, direct, and energetic.', sampleUrl: '/audio/mars.mp3' },
  { name: 'Noah', id: 'neptune', gender: 'Male', description: 'Deep, fluid, and expressive.', sampleUrl: '/audio/neptune.mp3' },
  { name: 'Pluto', id: 'pluto', gender: 'Male', description: 'Dark, mysterious, and intriguing.', sampleUrl: '/audio/pluto.mp3' },
  { name: 'Saturn', id: 'saturn', gender: 'Male', description: 'Ancient, gravelly, and wise.', sampleUrl: '/audio/saturn.mp3' },

  // ELEGANT & CLASSICAL
  { name: 'Elena', id: 'callista', gender: 'Female', description: 'Elegant, sophisticated, and articulate.', sampleUrl: '/audio/callista.mp3' },
  { name: 'Emma', id: 'cordelia', gender: 'Female', description: 'Refined and gentle flow.', sampleUrl: '/audio/cordelia.mp3' },
  { name: 'Clara', id: 'ophelia', gender: 'Female', description: 'Artistic and expressive.', sampleUrl: '/audio/ophelia.mp3' },
  { name: 'Helena', id: 'helena', gender: 'Female', description: 'Classic, poise, and balanced.', sampleUrl: '/audio/helena.mp3' },

  // ADDITIONAL FEMALE VOICES
  { name: 'Amara', id: 'amalthea', gender: 'Female', description: 'Nurturing and warm.', sampleUrl: '/audio/amalthea.mp3' },
  { name: 'Andrea', id: 'andromeda', gender: 'Female', description: 'Spacious, ethereal, and clear.', sampleUrl: '/audio/andromeda.mp3' },
  { name: 'Astrid', id: 'asteria', gender: 'Female', description: 'Light, shimmering, and precise.', sampleUrl: '/audio/asteria.mp3' },
  { name: 'Delilah', id: 'delia', gender: 'Female', description: 'Charming and narrative-focused.', sampleUrl: '/audio/delia.mp3' },
  { name: 'Electra', id: 'electra', gender: 'Female', description: 'Sharp, fast-paced, and energetic.', sampleUrl: '/audio/electra.mp3' },
  { name: 'Harmony', id: 'harmonia', gender: 'Female', description: 'Melodic and perfectly paced.', sampleUrl: '/audio/harmonia.mp3' },
  { name: 'Juno', id: 'juno', gender: 'Female', description: 'Commanding yet rhythmic.', sampleUrl: '/audio/juno.mp3' },
  { name: 'Pandora', id: 'pandora', gender: 'Female', description: 'Curious, lively, and engaging.', sampleUrl: '/audio/pandora.mp3' },
  { name: 'Phoebe', id: 'phoebe', gender: 'Female', description: 'Bright and intellectually stimulating.', sampleUrl: '/audio/phoebe.mp3' },
  { name: 'Thalia', id: 'thalia', gender: 'Female', description: 'Cheerful and conversational.', sampleUrl: '/audio/thalia.mp3' },
  { name: 'Thea', id: 'theia', gender: 'Female', description: 'Clear, high-fidelity, and consistent.', sampleUrl: '/audio/theia.mp3' },
  { name: 'Vesta', id: 'vesta', gender: 'Female', description: 'Homely, comforting, and steady.', sampleUrl: '/audio/vesta.mp3' },

  // ADDITIONAL MALE VOICES
  { name: 'Arthur', id: 'aries', gender: 'Male', description: 'Bold, pioneering, and assertive.', sampleUrl: '/audio/aries.mp3' },
  { name: 'Arcas', id: 'arcas', gender: 'Male', description: 'Friendly, rustic, and honest.', sampleUrl: '/audio/arcas.mp3' },
  { name: 'Draco', id: 'draco', gender: 'Male', description: 'Intense and focused.', sampleUrl: '/audio/draco.mp3' },
  { name: 'Hermes', id: 'hermes', gender: 'Male', description: 'Quick-witted, agile, and informative.', sampleUrl: '/audio/hermes.mp3' },
  { name: 'Harold', id: 'hyperion', gender: 'Male', description: 'Broad, expansive, and bright.', sampleUrl: '/audio/hyperion.mp3' },
  { name: 'Janus', id: 'janus', gender: 'Male', description: 'Dual-toned, versatile, and balanced.', sampleUrl: '/audio/janus.mp3' },
  { name: 'Oliver', id: 'odysseus', gender: 'Male', description: 'Crafty and storytelling-oriented.', sampleUrl: '/audio/odysseus.mp3' },
  { name: 'Orpheus', id: 'orpheus', gender: 'Male', description: 'Smooth, lyrical, and soulful.', sampleUrl: '/audio/orpheus.mp3' },
];

/**
 * Styling presets for the video captions.
 * These map to CSS utility classes (Tailwind) used in the video player or generator.
 */
export const captionStyles = [
  { label: "Youtuber", className: "text-yellow-400 font-extrabold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" },
  { label: "Supreme", className: "italic text-white font-black tracking-tighter bg-red-600 px-2" },
  { label: "Neon", className: "text-green-400 font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" },
  { label: "Glitch", className: "text-white font-bold mix-blend-difference" },
  { label: "Fire", className: "text-transparent bg-clip-text bg-gradient-to-t from-red-600 to-yellow-400 font-black" },
  { label: "Futuristic", className: "text-cyan-400 font-mono tracking-widest border-b-2 border-cyan-400" },
  { label: "Minimal", className: "text-white font-light tracking-widest" },
  { label: "Elegant", className: "text-amber-200 font-serif italic" },
];

/**
 * Suggestion keywords for the video generator prompt input.
 */
export const suggestions = [
  "Mind-blowing History Facts",
  "Bedtime Stories for Kids",
  "The Future of AI and Robotics",
  "Space Exploration Secrets",
  "Luxury Travel Destinations",
  "Quick Healthy Breakfast Recipes",
  "Daily Motivational Quotes",
  "Latest Tech Gadgets 2024",
  "5-Minute Home Workouts",
  "Personal Finance Tips",
  "Coding for Beginners",
  "Cybersecurity Awareness",
  "Nature documentary: The Deep Sea",
  "Stand-up Comedy Highlights",
  "Summer Fashion Trends",
  "Olympic Sports Insights",
  "Time Management Hacks",
  "Psychology of Success",
  "True Crime Mysteries",
  "Yoga for Stress Relief",
  "Modern Abstract Art",
  "Startup Founder Journeys",
  "The Rise of Renewable Energy",
  "Ancient Civilizations Uncovered",
  "World War II Untold Stories",
];
