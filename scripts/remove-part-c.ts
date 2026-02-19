import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function removePartC(content: string): string {
  // Pattern to match the entire Part C section
  // Handles both: <section class="section"> and <section class="section page-break">
  const partCPattern = /<section class="section[^"]*">\s*(?:<!--[^>]*-->\s*)?<div class="section-header">\s*<h2 class="section-title">Part C: Partner Practice<\/h2>[\s\S]*?<\/section>/;

  return content.replace(partCPattern, '');
}

const worksheetsDir = join(process.cwd(), 'worksheets');
const htmlFiles = getAllHtmlFiles(worksheetsDir);

console.log(`Found ${htmlFiles.length} HTML files`);

let processedCount = 0;
let modifiedCount = 0;

for (const file of htmlFiles) {
  try {
    const content = readFileSync(file, 'utf-8');
    const newContent = removePartC(content);

    if (content !== newContent) {
      writeFileSync(file, newContent, 'utf-8');
      modifiedCount++;
      console.log(`✓ Modified: ${file.replace(worksheetsDir, '')}`);
    } else {
      console.log(`- No Part C found: ${file.replace(worksheetsDir, '')}`);
    }

    processedCount++;
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error);
  }
}

console.log(`\nProcessed ${processedCount} files`);
console.log(`Modified ${modifiedCount} files`);
