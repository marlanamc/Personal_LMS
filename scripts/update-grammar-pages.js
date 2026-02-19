const fs = require('fs');
const path = require('path');

// Find all grammar reader page files
const grammarReaderDir = path.join(__dirname, '../src/app/grammar-reader');
const folders = fs.readdirSync(grammarReaderDir);
const grammarPages = folders
    .map(folder => path.join(grammarReaderDir, folder, 'page.tsx'))
    .filter(filePath => fs.existsSync(filePath));

console.log(`Found ${grammarPages.length} grammar reader pages to update`);

let updatedCount = 0;
let skippedCount = 0;

grammarPages.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already using the helper
    if (content.includes('getActivityIdSafely')) {
        console.log(`⏭️  Skipped ${path.dirname(filePath)} (already updated)`);
        skippedCount++;
        return;
    }

    // Replace the import
    content = content.replace(
        /import { prisma } from "@\/lib\/prisma";/g,
        'import { getActivityIdSafely } from "@/lib/build-helpers";'
    );

    // Replace the database query pattern
    content = content.replace(
        /const activity = await prisma\.activity\.findFirst\(\{\s*where:\s*\{\s*title:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*\},\s*select:\s*\{\s*id:\s*true\s*\}\s*\}\);/g,
        (match, title, type, category) => {
            return `const activityId = await getActivityIdSafely(\n        "${title}",\n        "${type}",\n        "${category}"\n    );`;
        }
    );

    // Replace activityId={activity?.id} with activityId={activityId}
    content = content.replace(
        /activityId={activity\?\.id}/g,
        'activityId={activityId}'
    );

    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.dirname(filePath)}`);
    updatedCount++;
});

console.log(`\n✨ Done! Updated ${updatedCount} files, skipped ${skippedCount} files`);
