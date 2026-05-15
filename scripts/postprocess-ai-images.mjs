import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputDir = 'public/images/ai-generated';

async function makeLogoTransparent() {
  const inputPath = path.join(outputDir, 'sarpo_logo.png');
  const outputPath = path.join(outputDir, 'sarpo_logo_transparent.png');
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const channels = info.channels;
  
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Make white/near-white background pixels transparent
    if (lum > 245) {
      data[i + 3] = 0;
    } else if (lum > 230) {
      const t = (245 - lum) / 15;
      data[i + 3] = Math.round(t * 255);
    }
  }
  
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels }
  })
  .png()
  .toFile(outputPath);
  
  // Replace the original with the transparent version
  fs.unlinkSync(inputPath);
  fs.renameSync(outputPath, inputPath);
  
  console.log(`Logo made transparent: sarpo_logo.png`);
}

// Also ensure all product images are on pure white backgrounds
async function ensureWhiteBg(filename) {
  const inputPath = path.join(outputDir, filename);
  if (!fs.existsSync(inputPath)) return;
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const channels = info.channels;
  let changed = 0;
  
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // If pixel is very light gray (near-white but not pure white), make it pure white
    if (r > 240 && g > 240 && b > 240) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
      changed++;
    }
  }
  
  if (changed > 0) {
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 95 })
    .toFile(inputPath + '.tmp');
    
    fs.unlinkSync(inputPath);
    fs.renameSync(inputPath + '.tmp', inputPath);
    console.log(`Whitened bg: ${filename} (${changed} pixels)`);
  } else {
    console.log(`Already white: ${filename}`);
  }
}

await makeLogoTransparent();

const productImages = fs.readdirSync(outputDir).filter(f => f.startsWith('product_') && f.endsWith('.jpg'));
for (const filename of productImages) {
  await ensureWhiteBg(filename);
}

console.log('Done!');
