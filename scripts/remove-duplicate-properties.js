#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WARMUP_DIR = path.join(__dirname, '..', 'src', 'content', 'speaking', 'daily-warmups');

function removeDuplicateProperties(filePath) {
  console.log(`Fixing duplicates in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove duplicate warmupMode and participationPoints
  content = content.replace(/(\s+warmupMode: true,)\n\s+warmupMode: true,/g, '$1');

  content = content.replace(/(\s+participationPoints: 3,)\n\s+participationPoints: 3,/g, '$1');

  // Remove duplicate soloInstructions and partnerInstructions in prompt objects
  // This is more complex because they appear within prompt objects
  const lines = content.split('\n');
  const cleanedLines = [];
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // If we previously decided to skip this line, skip it
    if (skipNext) {
      skipNext = false;
      continue;
    }

    // Check if this line has soloInstructions or partnerInstructions
    if (line.includes('soloInstructions:') || line.includes('partnerInstructions:')) {
      // Check if the next line is the same property
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim() === line.trim()) {
        // Skip the duplicate line
        skipNext = true;
      }
    }

    cleanedLines.push(line);
  }

  content = cleanedLines.join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Fixed successfully`);
}

function main() {
  console.log('Starting duplicate property removal...');

  const files = fs.readdirSync(WARMUP_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.join(WARMUP_DIR, file));

  let fixed = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Check if file has duplicates (look for multiple instances of the same property)
      const warmupModeCount = (content.match(/warmupMode:/g) || []).length;
      const participationPointsCount = (content.match(/participationPoints:/g) || []).length;
      const soloInstructionsCount = (content.match(/soloInstructions:/g) || []).length;
      const partnerInstructionsCount = (content.match(/partnerInstructions:/g) || []).length;

      if (warmupModeCount > 1 || participationPointsCount > 1 ||
          soloInstructionsCount > content.match(/id:\s*"[^"]*"/g).length ||
          partnerInstructionsCount > content.match(/id:\s*"[^"]*"/g).length) {
        removeDuplicateProperties(file);
        fixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed: ${fixed} files`);
}

if (require.main === module) {
  main();
}