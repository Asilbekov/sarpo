import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images/processed';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Flood-fill based background detection from edges
async function removeBackground(filename) {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const channels = info.channels;
  const w = info.width;
  const h = info.height;
  const totalPixels = w * h;
  
  // Create alpha map (0 = background, 1 = foreground)
  const alphaMap = new Uint8Array(totalPixels);
  const visited = new Uint8Array(totalPixels);
  
  // Get pixel RGB at position
  function getPixel(pos) {
    const idx = pos * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }
  
  // Calculate color distance
  function colorDist(p1, p2) {
    return Math.sqrt(
      (p1[0] - p2[0]) ** 2 +
      (p1[1] - p2[1]) ** 2 +
      (p1[2] - p2[2]) ** 2
    );
  }
  
  // Get luminance
  function luminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }
  
  // Get saturation
  function saturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max > 0 ? (max - min) / max : 0;
  }
  
  // Sample background color from corners
  const corners = [
    0,                          // top-left
    w - 1,                      // top-right
    (h - 1) * w,                // bottom-left
    (h - 1) * w + w - 1,       // bottom-right
  ];
  
  const bgColor = getPixel(0); // Top-left pixel as reference
  
  // BFS flood fill from all edges to find background
  const queue = [];
  
  // Add all edge pixels to queue
  for (let x = 0; x < w; x++) {
    queue.push(x);                    // top row
    queue.push((h - 1) * w + x);     // bottom row
  }
  for (let y = 1; y < h - 1; y++) {
    queue.push(y * w);               // left column
    queue.push(y * w + w - 1);       // right column
  }
  
  // Mark all edge pixels as visited
  for (const pos of queue) {
    visited[pos] = 1;
  }
  
  const threshold = 50; // Color distance threshold for background
  
  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    const pixel = getPixel(pos);
    const dist = colorDist(pixel, bgColor);
    const lum = luminance(pixel[0], pixel[1], pixel[2]);
    const sat = saturation(pixel[0], pixel[1], pixel[2]);
    
    // Consider it background if:
    // - Close to background color, OR
    // - Very dark (luminance < 30) with low saturation (not colorful clothing)
    const isBg = (dist < threshold) || (lum < 30 && sat < 0.2);
    
    if (isBg) {
      alphaMap[pos] = 0; // Background
      
      // Check 4-connected neighbors
      const x = pos % w;
      const y = Math.floor(pos / w);
      
      const neighbors = [];
      if (x > 0) neighbors.push(pos - 1);
      if (x < w - 1) neighbors.push(pos + 1);
      if (y > 0) neighbors.push(pos - w);
      if (y < h - 1) neighbors.push(pos + w);
      
      for (const npos of neighbors) {
        if (!visited[npos]) {
          visited[npos] = 1;
          queue.push(npos);
        }
      }
    } else {
      alphaMap[pos] = 1; // Foreground
    }
  }
  
  // Mark all unvisited pixels as foreground
  for (let i = 0; i < totalPixels; i++) {
    if (!visited[i]) {
      alphaMap[i] = 1;
    }
  }
  
  // Smooth the alpha map with multiple passes of box blur
  const smoothedAlpha = new Float32Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    smoothedAlpha[i] = alphaMap[i];
  }
  
  // Apply 3x3 box blur multiple times for smooth edges
  for (let pass = 0; pass < 3; pass++) {
    const temp = new Float32Array(totalPixels);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += smoothedAlpha[(y + dy) * w + (x + dx)];
          }
        }
        temp[y * w + x] = sum / 9;
      }
    }
    for (let i = 0; i < totalPixels; i++) {
      smoothedAlpha[i] = temp[i];
    }
  }
  
  // Apply smoothed alpha - blend with white
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const idx = i * channels;
      const alpha = smoothedAlpha[i];
      
      if (alpha >= 0.98) {
        // Fully foreground - keep original
        data[idx + 3] = 255;
      } else if (alpha <= 0.02) {
        // Fully background - white
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      } else {
        // Transition - blend with white
        const a = alpha;
        data[idx] = Math.round(data[idx] * a + 255 * (1 - a));
        data[idx + 1] = Math.round(data[idx + 1] * a + 255 * (1 - a));
        data[idx + 2] = Math.round(data[idx + 2] * a + 255 * (1 - a));
        data[idx + 3] = 255;
      }
    }
  }
  
  await sharp(data, {
    raw: { width: w, height: h, channels }
  })
  .jpeg({ quality: 94 })
  .toFile(outputPath);
  
  console.log(`Processed: ${filename} (${w}x${h})`);
}

// Process all product images
const productImages = fs.readdirSync(inputDir).filter(f => f.startsWith('product_') && f.endsWith('.jpg'));

for (const filename of productImages) {
  try {
    await removeBackground(filename);
  } catch (e) {
    console.error(`Error processing ${filename}:`, e.message);
  }
}

// Process logo
const logoInput = path.join(inputDir, 'sarpo_logo.png');
const logoOutput = path.join(outputDir, 'sarpo_logo.png');
if (fs.existsSync(logoInput)) {
  try {
    const { data: logoData, info: logoInfo } = await sharp(logoInput)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const ch = logoInfo.channels;
    
    // Flood fill from corners for logo too
    for (let i = 0; i < logoData.length; i += ch) {
      const r = logoData[i];
      const g = logoData[i + 1];
      const b = logoData[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // White/near-white = transparent (for dark headers)
      if (lum > 240) {
        logoData[i + 3] = 0;
      } else if (lum > 220) {
        logoData[i + 3] = Math.round(((240 - lum) / 20) * 255);
      } else {
        logoData[i + 3] = 255;
      }
    }
    
    await sharp(logoData, {
      raw: { width: logoInfo.width, height: logoInfo.height, channels: ch }
    })
    .png()
    .toFile(logoOutput);
    
    console.log(`Processed logo: sarpo_logo.png`);
  } catch (e) {
    console.error(`Error processing logo:`, e.message);
    fs.copyFileSync(logoInput, logoOutput);
  }
}

// Copy hero images
const heroImages = fs.readdirSync(inputDir).filter(f => f.startsWith('hero_') && f.endsWith('.jpg'));
for (const filename of heroImages) {
  fs.copyFileSync(path.join(inputDir, filename), path.join(outputDir, filename));
  console.log(`Copied: ${filename}`);
}

console.log('Done!');
