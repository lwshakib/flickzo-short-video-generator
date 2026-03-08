import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const FLUX_KLEIN_WORKER_URL = process.env.FLUX_KLEIN_WORKER_URL;
const STYLES_DIR = path.join(process.cwd(), 'public', 'styles');

const stylePrompts = [
  { name: 'gta', prompt: 'Digital art masterpiece, action game loading screen style, luxury sports car on a palm-fringed coast road at sunset, vibrant purple and orange sky, sharp cel-shaded outlines, high contrast pop art.' },
  { name: 'sketch', prompt: 'Exquisite and highly detailed charcoal sketch of a majestic lion head, intricate fur texture, deep expressive eyes, fine art drawing on textured paper, high contrast black and white.' }
];

async function generateStyleImages() {
  console.log('--- Detailed 512px (6 steps) Regeneration ---');

  if (!CLOUDFLARE_API_KEY || !FLUX_KLEIN_WORKER_URL) {
    console.error('❌ Missing CLOUDFLARE_API_KEY or FLUX_KLEIN_WORKER_URL in .env');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(STYLES_DIR)) {
    fs.mkdirSync(STYLES_DIR, { recursive: true });
  }

  for (const style of stylePrompts) {
    const fileName = `${style.name}.png`;
    const filePath = path.join(STYLES_DIR, fileName);

    console.log(`Generating image for style: ${style.name}...`);

    try {
      await new Promise(resolve => setTimeout(resolve, 5000)); 
      
      const response = await fetch(FLUX_KLEIN_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: style.prompt,
          width: 512,
          height: 512,
          steps: 6,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed: ${style.name} - ${response.status} ${errorText}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Saved: ${fileName}`);

    } catch (error) {
      console.error(`❌ Error generating image for ${style.name}:`, error);
    }
  }

  console.log('--- Style Image Generation Completed ---');
}

generateStyleImages().catch(console.error);
