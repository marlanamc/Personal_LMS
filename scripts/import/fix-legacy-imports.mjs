/**
 * Script to fix legacy-html imports to use the proper legacy-guide format
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function fixLegacyImports() {
    console.log('🔧 Fixing legacy HTML imports...\n');

    // Find all activities with type: "legacy-html"
    const activities = await prisma.activity.findMany();

    let fixed = 0;
    let skipped = 0;

    for (const activity of activities) {
        try {
            const content = JSON.parse(activity.content);

            // Check if this is a legacy-html import that needs fixing
            if (content.type === 'legacy-html' && content.html) {
                console.log(`📝 Processing: ${activity.title}`);

                // Create a filename from the activity ID
                const filename = `${activity.id}.html`;
                const filepath = join(__dirname, '../_legacy/imported', filename);

                // Ensure directory exists
                mkdirSync(dirname(filepath), { recursive: true });

                // Write the HTML to a file
                writeFileSync(filepath, content.html, 'utf-8');
                console.log(`   📄 Saved HTML to: _legacy/imported/${filename}`);

                // Update the activity content to use the proper legacy-guide format
                const newContent = {
                    type: 'interactive-guide',
                    sections: [],
                    metadata: {
                        source: 'legacy',
                        originalFile: `imported/${filename}`
                    }
                };

                await prisma.activity.update({
                    where: { id: activity.id },
                    data: {
                        content: JSON.stringify(newContent)
                    }
                });

                console.log(`   ✅ Updated activity content\n`);
                fixed++;
            } else {
                skipped++;
            }
        } catch (error) {
            console.error(`   ❌ Error processing ${activity.title}:`, error.message);
        }
    }

    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Fixed: ${fixed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log('='.repeat(50));
}

fixLegacyImports()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Error:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
