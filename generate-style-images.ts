import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const FLUX_KLEIN_WORKER_URL = process.env.FLUX_KLEIN_WORKER_URL;
const STYLES_DIR = path.join(process.cwd(), 'public', 'styles');

const stylePrompts = [
  // { name: 'gta', prompt: 'Grand Theft Auto loading screen style, hyper-detailed, cel-shaded digital art masterpiece. A close-up of a badass protagonist with dark sunglasses and a leather jacket, standing next to a sleek luxury sports car on a palm tree-lined coastal road at sunset. Vibrant purple, pink, and orange sky, sharp outlines, intense high contrast pop art, cinematic lighting, 8k resolution, masterpiece.' },
  // { name: 'sketch', prompt: 'Detailed architectural sketch, pencil and ink, a futuristic steampunk city floating among the clouds, complex gears and intricate mechanical elements, highly detailed line work, shading, sepia tone, da vinci notebook style, exquisite rough textured drawing paper.' },
  // { name: 'cinematic', prompt: 'Epic cinematic shot, low angle. An ancient, colossal, rusted robot overgrown with thick moss and luminous vines fully awaking in a dense, mystical fantasy forest. God rays shining through the thick green canopy, glowing dust motes floating in the humid air, 35mm film, anamorphic lens flare, award-winning cinematography, hyper-realistic, 8k resolution.' },
  { name: 'realistic', prompt: 'Incredibly detailed, photorealistic photograph of an astronaut exploring a majestic alien landscape. Bioluminescent flora and glowing crystalline rivers illuminating the scene. Ultra-high resolution, 8k, natural and dramatic lighting, shot on 35mm lens, hyper-realistic textures, National Geographic style award-winning photography.' }
];

async function generateStyleImages() {
  console.log('--- Detailed 1024px Generation ---');

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
          width: 1024,
          height: 1024,
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
