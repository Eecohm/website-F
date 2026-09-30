// scripts/compress-images.js
// Build-time image compression using sharp.
// Converts all images in src/assets/images to WebP, resizes to max display dimensions.
// Outputs to public/images/ (served as static assets via Vite's public folder).
//
// Usage: node scripts/compress-images.js
// npm script: "preoptimize": "node scripts/compress-images.js"
//
// Run ONCE before first build, or whenever new images are added.

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR  = join(__dirname, '..', 'src', 'assets', 'images');
const OUT_DIR  = join(__dirname, '..', 'public', 'images');

// Max dimensions per subfolder (px) — balances quality vs. file size
const FOLDER_CONFIG = {
  'Images': { maxWidth: 1920, maxHeight: 1080, quality: 82 },
  'F':      { maxWidth: 800,  maxHeight: 600,  quality: 80 },
  'Icons':  { maxWidth: 200,  maxHeight: 200,  quality: 90 },
  'pngs':   { maxWidth: 240,  maxHeight: 120,  quality: 85 },
};

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG']);

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function processImage(srcPath, outPath, config) {
  const ext = extname(srcPath).toLowerCase();
  if (!IMAGE_EXTS.has(extname(srcPath))) return;

  // Output always as WebP
  const outWebP = outPath.replace(/\.[^.]+$/, '.webp');

  try {
    await sharp(srcPath)
      .resize({
        width: config.maxWidth,
        height: config.maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: config.quality })
      .toFile(outWebP);

    const srcSize = (statSync(srcPath).size / 1024).toFixed(0);
    const outSize = (statSync(outWebP).size / 1024).toFixed(0);
    console.log(`  ✓ ${basename(srcPath)} → ${basename(outWebP)} (${srcSize}KB → ${outSize}KB)`);
  } catch (err) {
    console.warn(`  ⚠ Skipped ${basename(srcPath)}: ${err.message}`);
  }
}

async function processFolder(folderName) {
  const config = FOLDER_CONFIG[folderName] || { maxWidth: 1200, maxHeight: 900, quality: 82 };
  const srcFolder = join(SRC_DIR, folderName);
  const outFolder = join(OUT_DIR, folderName);

  if (!existsSync(srcFolder)) {
    console.warn(`  ⚠ Source folder not found: ${srcFolder}`);
    return;
  }

  ensureDir(outFolder);
  const files = readdirSync(srcFolder);

  console.log(`\n📁 Processing ${folderName}/ (${files.length} files)…`);
  for (const file of files) {
    const srcPath = join(srcFolder, file);
    if (!statSync(srcPath).isFile()) continue;
    const outPath = join(outFolder, file);
    await processImage(srcPath, outPath, config);
  }
}

async function processLogo() {
  // SVG logo — copy as-is (no compression needed for SVG)
  const { copyFileSync } = await import('fs');
  const srcLogo = join(SRC_DIR, 'logo.svg');
  const outLogo = join(OUT_DIR, 'logo.svg');
  ensureDir(OUT_DIR);
  if (existsSync(srcLogo)) {
    copyFileSync(srcLogo, outLogo);
    console.log(`\n  ✓ logo.svg copied`);
  }
}

async function main() {
  console.log('🖼  EECOHM Image Compression Script');
  console.log('=====================================');
  ensureDir(OUT_DIR);

  await processLogo();
  for (const folder of Object.keys(FOLDER_CONFIG)) {
    await processFolder(folder);
  }

  console.log('\n✅ Image optimization complete!');
  console.log(`   Output: ${OUT_DIR}`);
  console.log('   Note: Components reference /images/... paths which map to public/images/');
}

main().catch((err) => {
  console.error('❌ Error during image compression:', err);
  process.exit(1);
});
