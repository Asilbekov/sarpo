import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images/processed';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const productImages = fs.readdirSync(inputDir).filter(f => f.startsWith('product_') && f.endsWith('.jpg'));

async function processImage(filename) {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  
  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const channels = info.channels;
  
  // Replace dark/black pixels with white
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Calculate luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    if (lum < 25) {
      // Very dark pixel - make it white with full transparency
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 0; // Transparent
    } else if (lum < 55) {
      // Semi-dark pixel - make partially transparent
      const alpha = Math.min(255, (lum / 55) * 255);
      data[i + 3] = Math.round(alpha);
      // Lighten the pixel
      const factor = 1 + (1 - lum / 55) * 0.5;
      data[i] = Math.min(255, Math.round(r * factor));
      data[i + 1] = Math.min(255, Math.round(g * factor));
      data[i + 2] = Math.min(255, Math.round(b * factor));
    }
  }
  
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: channels
    }
  })
  .flatten({ background: { r: 255, g: 255, b: 255 } }) // Composite onto white
  .jpeg({ quality: 90 })
  .toFile(outputPath);
  
  console.log(`Processed: ${filename}`);
}

for (const filename of productImages) {
  try {
    await processImage(filename);
  } catch (e) {
    console.error(`Error processing ${filename}:`, e.message);
  }
}

// Also copy hero images and logo as-is
const otherImages = fs.readdirSync(inputDir).filter(f => 
  (f.startsWith('hero_') || f.startsWith('sarpo_')) && !f.endsWith('.svg')
);
for (const filename of otherImages) {
  fs.copyFileSync(path.join(inputDir, filename), path.join(outputDir, filename));
  console.log(`Copied: ${filename}`);
}

console.log('Done!');
