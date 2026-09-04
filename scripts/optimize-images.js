/**
 * scripts/optimize-images.js
 *
 * Usage:
 * 1. Place original images in /assets/originals (hero.jpg, photo1.jpg, photo2.jpg, photo3.jpg)
 * 2. npm install
 * 3. npm run optimize-images
 *
 * This script generates resized JPEG, WebP and AVIF versions into /assets/optimized
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const INPUT_DIR = path.join(__dirname, '..', 'assets', 'originals');
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'optimized');

const widths = [400, 800, 1200, 1600];
const formats = ['jpeg', 'webp', 'avif'];

if (!fs.existsSync(INPUT_DIR)) {
  console.error('Input directory not found:', INPUT_DIR);
  console.error('Create the directory and add your original images (e.g. hero.jpg, photo1.jpg) and re-run.');
  process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function basenameNoExt(filename) {
  return path.basename(filename, path.extname(filename));
}

async function processImage(file) {
  const name = basenameNoExt(file);
  const inputPath = path.join(INPUT_DIR, file);
  console.log('Processing', inputPath);

  for (const w of widths) {
    const pipeline = sharp(inputPath).rotate().resize(w);

    // JPEG
    const outJpeg = path.join(OUTPUT_DIR, `${name}-${w}.jpg`);
    await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(outJpeg);

    // WebP
    const outWebp = path.join(OUTPUT_DIR, `${name}-${w}.webp`);
    await pipeline.clone().webp({ quality: 80 }).toFile(outWebp);

    // AVIF
    const outAvif = path.join(OUTPUT_DIR, `${name}-${w}.avif`);
    await pipeline.clone().avif({ quality: 50 }).toFile(outAvif);

    console.log(`  -> ${name}-${w}.{jpg,webp,avif}`);
  }
}

async function run() {
  glob('*.{jpg,jpeg,png}', { cwd: INPUT_DIR }, async (err, files) => {
    if (err) throw err;
    if (!files.length) {
      console.error('No images found in', INPUT_DIR);
      process.exit(1);
    }

    for (const file of files) {
      try {
        await processImage(file);
      } catch (e) {
        console.error('Failed to process', file, e);
      }
    }

    console.log('Done. Optimized images are in', OUTPUT_DIR);
  });
}

run();
