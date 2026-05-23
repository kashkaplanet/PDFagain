const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icons/icon-512.svg');
  if (!fs.existsSync(svgPath)) {
    console.error('SVG not found:', svgPath);
    return;
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // Generate 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/icons/icon-192.png'));
  console.log('Generated icon-192.png');

  // Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/icons/icon-512.png'));
  console.log('Generated icon-512.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generateIcons().catch(console.error);
