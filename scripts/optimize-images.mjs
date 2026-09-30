// Generates WebP/AVIF variants next to the source images referenced by index.html.
// Run with `npm run images` after adding or replacing an image.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'img');

// [directory, max output width, formats]
const jobs = [
  ['portfolio', 1200, ['avif', 'webp']],
  ['portfolio/gallery_2x', 1920, ['webp']],
  ['thumbs', 800, ['avif', 'webp'], /-image\.(png|jpe?g)$/],
];

const encoders = {
  webp: (img) => img.webp({ quality: 80, effort: 6 }),
  avif: (img) => img.avif({ quality: 55, effort: 6 }),
};

for (const [dir, width, formats, match = /\.(png|jpe?g)$/] of jobs) {
  for (const file of fs.readdirSync(path.join(root, dir))) {
    if (!match.test(file)) continue;
    const src = path.join(root, dir, file);
    for (const fmt of formats) {
      const out = src.replace(/\.(png|jpe?g)$/, `.${fmt}`);
      await encoders[fmt](sharp(src).resize({ width, withoutEnlargement: true })).toFile(out);
      const kb = (p) => Math.round(fs.statSync(p).size / 1024);
      console.log(`${path.relative(root, out)}  ${kb(src)}K -> ${kb(out)}K`);
    }
  }
}
