import fs from 'fs';
import path from 'path';
import Decor8AI from 'decor8ai';

const client = new Decor8AI();

async function run() {
  try {
    const inputPath = path.resolve('../decor8ai-sdk/js/sdk_test_image.png');
    
    // Copy the original to public/hero-before.png
    const publicDir = path.resolve('./public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    fs.copyFileSync(inputPath, path.join(publicDir, 'hero-before.png'));

    const buffer = fs.readFileSync(inputPath);
    console.log('Generating hero after image...');
    
    const result = await client.generateDesigns(buffer, 'LIVINGROOM', 'MODERN', { numImages: 1 });
    console.log('Result:', result);
    
    const images = result?.info?.images || result?.images || [];
    if (images.length > 0) {
      const url = images[0].url;
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(path.join(publicDir, 'hero-after.jpg'), Buffer.from(arrayBuffer));
      console.log('Successfully saved hero images to public/');
    } else {
      console.error('No images generated');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
