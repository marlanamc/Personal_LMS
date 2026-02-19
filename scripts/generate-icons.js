// Simple script to generate placeholder PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
function createSVGIcon(size, text) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#d97757"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

// For now, we'll create SVG files that can be converted to PNG
// In production, you'd want actual PNG files
const sizes = [
  { size: 192, text: 'CC' },
  { size: 512, text: 'CC' }
];

sizes.forEach(({ size, text }) => {
  const svg = createSVGIcon(size, text);
  // Save as SVG for now - you can convert to PNG later
  fs.writeFileSync(
    path.join(__dirname, `../public/icon-${size}.svg`),
    svg
  );
  console.log(`Created icon-${size}.svg`);
});

console.log('\nNote: For production, convert these SVG files to PNG format.');
console.log('You can use tools like ImageMagick, online converters, or design software.');




