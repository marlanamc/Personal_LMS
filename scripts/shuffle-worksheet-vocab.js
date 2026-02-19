#!/usr/bin/env node
/**
 * Script to add vocab definition shuffling to all worksheet HTML files.
 * This ensures the vocabulary matching exercise has randomized definition order.
 */

const fs = require('fs');
const path = require('path');

// JavaScript snippet to inject into each worksheet
const shuffleScript = `
  <script>
    // Shuffle vocab definitions on page load for randomized matching exercises
    (function() {
      const defsContainer = document.querySelector('.vocab-defs');
      if (!defsContainer) return;

      const defs = Array.from(defsContainer.querySelectorAll('.vocab-def'));
      if (defs.length === 0) return;

      // Fisher-Yates shuffle
      for (let i = defs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [defs[i], defs[j]] = [defs[j], defs[i]];
      }

      // Re-assign letters after shuffling
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      defs.forEach((def, idx) => {
        const letterSpan = def.querySelector('.letter');
        if (letterSpan) {
          letterSpan.textContent = letters[idx] + '.';
        }
      });

      // Clear and re-append in shuffled order
      defsContainer.innerHTML = '';
      defs.forEach(def => defsContainer.appendChild(def));
    })();
  </script>
`;

// Recursively find all HTML files in a directory
function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

function main() {
  const worksheetsDir = path.join(__dirname, '..', 'worksheets');
  const files = findHtmlFiles(worksheetsDir);

  let updated = 0;
  let skipped = 0;
  let noVocab = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');

    // Skip if already has our shuffle script
    if (content.includes('Shuffle vocab definitions on page load')) {
      console.log(`⏭️  Skipped (already has script): ${path.relative(worksheetsDir, file)}`);
      skipped++;
      continue;
    }

    // Check if file has vocab matching section
    if (!content.includes('vocab-defs')) {
      console.log(`📄 Skipped (no vocab-defs): ${path.relative(worksheetsDir, file)}`);
      noVocab++;
      continue;
    }

    // Insert script before </body>
    if (content.includes('</body>')) {
      content = content.replace('</body>', shuffleScript + '</body>');
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`✅ Updated: ${path.relative(worksheetsDir, file)}`);
      updated++;
    } else {
      console.log(`⚠️  No </body> tag found: ${path.relative(worksheetsDir, file)}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already has script): ${skipped}`);
  console.log(`   Skipped (no vocab section): ${noVocab}`);
  console.log(`   Total files: ${files.length}`);
}

main();
