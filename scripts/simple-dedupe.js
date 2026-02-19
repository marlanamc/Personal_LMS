#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WARMUP_DIR = path.join(__dirname, '..', 'src', 'content', 'speaking', 'daily-warmups');

function dedupeFile(filePath) {
  console.log(`Deduping ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const seen = new Set();
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      result.push(line);
      continue;
    }

    // Skip duplicate property lines
    if ((trimmed.startsWith('soloInstructions:') || trimmed.startsWith('partnerInstructions:') ||
         trimmed.startsWith('warmupMode:') || trimmed.startsWith('participationPoints:')) &&
        seen.has(trimmed)) {
      continue;
    }

    if (trimmed.startsWith('soloInstructions:') || trimmed.startsWith('partnerInstructions:') ||
        trimmed.startsWith('warmupMode:') || trimmed.startsWith('participationPoints:')) {
      seen.add(trimmed);
    }

    result.push(line);
  }

  content = result.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Deduped successfully`);
}

function main() {
  console.log('Starting simple deduplication...');

  const files = fs.readdirSync(WARMUP_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(WARMUP_DIR, file));

  let deduped = 0;

  for (const file of files) {
    try {
      dedupeFile(file);
      deduped++;
    } catch (error) {
      console.error(`Error deduping ${file}:`, error.message);
    }
  }

  console.log(`\nDeduped: ${deduped} files`);
}

if (require.main === module) {
  main();
}