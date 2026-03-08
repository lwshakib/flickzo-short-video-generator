import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const FLUX_KLEIN_WORKER_URL = process.env.FLUX_KLEIN_WORKER_URL;
const STYLES_DIR = path.join(process.cwd(), 'public', 'styles');

const stylePrompts = [
  { name: 'gta', prompt: 'Digital art, comic book style loading screen, luxury car parked near a palm tree, high contrast, vibrant saturated colors, cinematic lighting, cell-shaded masterpiece.' },
  { name: 'oil-painting', prompt: 'Oil painting on canvas, thick impasto brushstrokes, rich texture, a serene sunset over a rolling mountain range, warm golden lighting.' },
  { name: 'sketch', prompt: 'Detailed charcoal sketch, realistic pencil shading, a close-up profile of a lion, fine lines, artistic cross-hatching, high contrast.' }
];

async function generateStyleImages() {
  console.log('--- Style Image Generation (RETRY) Started ---');

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
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds delay
      const response = await fetch(FLUX_KLEIN_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: style.prompt,
          width: 1024,
          height: 1024,
          steps: 28,
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
