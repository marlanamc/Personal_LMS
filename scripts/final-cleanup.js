#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WARMUP_DIR = path.join(__dirname, '..', 'src', 'content', 'speaking', 'daily-warmups');

function cleanFile(filePath) {
  console.log(`Cleaning ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove duplicate warmupMode and participationPoints at the top level
  content = content.replace(/(\s+warmupMode: true,)\n\s+warmupMode: true,/g, '$1');
  content = content.replace(/(\s+participationPoints: 3,)\n\s+participationPoints: 3,/g, '$1');

  // Use a more sophisticated approach for prompt objects
  // Split by prompt objects and clean each one
  const promptRegex = /(\{\s*id:\s*"[^"]*",[\s\S]*?\},)/g;
  content = content.replace(promptRegex, (match) => {
    let cleaned = match;

    // Remove duplicate soloInstructions
    const soloRegex = /(\s+soloInstructions:\s*"[^"]*",)\n\s+soloInstructions:\s*"[^"]*",/g;
    cleaned = cleaned.replace(soloRegex, '$1');

    // Remove duplicate partnerInstructions
    const partnerRegex = /(\s+partnerInstructions:\s*"[^"]*",)\n\s+partnerInstructions:\s*"[^"]*",/g;
    cleaned = cleaned.replace(partnerRegex, '$1');

    return cleaned;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Cleaned successfully`);
}

function main() {
  console.log('Starting final cleanup...');

  const files = fs.readdirSync(WARMUP_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(WARMUP_DIR, file));

  let cleaned = 0;

  for (const file of files) {
    try {
      cleanFile(file);
      cleaned++;
    } catch (error) {
      console.error(`Error cleaning ${file}:`, error.message);
    }
  }

  console.log(`\nCleaned: ${cleaned} files`);
}

if (require.main === module) {
  main();
}