const fs = require('fs');
const path = require('path');

const filesToCopy = [
  'index.html',
  'styles.css',
  'app.js',
  'sw.js',
  'manifest.webmanifest',
  'manifest.json'
];

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy core files to public and dist
for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

// Copy icon.svg to root, public, and dist
const iconSrc = path.join(publicDir, 'icon.svg');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(__dirname, 'icon.svg'));
  fs.copyFileSync(iconSrc, path.join(distDir, 'icon.svg'));

  // Ensure ./public/icon.svg works when served from public/ or dist/
  const publicPublicDir = path.join(publicDir, 'public');
  if (!fs.existsSync(publicPublicDir)) fs.mkdirSync(publicPublicDir, { recursive: true });
  fs.copyFileSync(iconSrc, path.join(publicPublicDir, 'icon.svg'));

  const distPublicDir = path.join(distDir, 'public');
  if (!fs.existsSync(distPublicDir)) fs.mkdirSync(distPublicDir, { recursive: true });
  fs.copyFileSync(iconSrc, path.join(distPublicDir, 'icon.svg'));
}

console.log('Static site build complete: Assets mirrored across root, public/, and dist/');
