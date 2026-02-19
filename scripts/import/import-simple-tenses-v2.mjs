/**
 * Script to batch import Simple tense complete guides (simplified version without JSDOM)
 *
 * Usage: node scripts/import-simple-tenses-v2.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function extractMetadata(htmlPath) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Extract metadata using regex (simple approach)
    const getMetaContent = (name) => {
        const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i');
        const match = htmlContent.match(regex);
        return match ? match[1] : '';
    };

    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(htmlPath, '.html').replace(/-/g, ' ');

    const description = getMetaContent('description') ||
                       `Interactive ${getMetaContent('activity-type')} for ${title}`;

    const type = getMetaContent('activity-type') || 'guide';
    const level = getMetaContent('activity-level') || 'intermediate';
    const category = getMetaContent('activity-category') || 'grammar';

    return {
        title,
        description,
        type,
        level,
        category,
        htmlContent
    };
}

async function importActivity(htmlPath, filename) {
    try {
        console.log(`\n📚 Importing: ${filename}`);

        if (!fs.existsSync(htmlPath)) {
            console.log(`   ⚠️  File not found, skipping...`);
            return null;
        }

        const metadata = extractMetadata(htmlPath);

        // Check if already imported
        const existing = await prisma.activity.findFirst({
            where: {
                title: metadata.title
            }
        });

        if (existing) {
            console.log(`   ℹ️  Already exists (ID: ${existing.id}), skipping...`);
            return existing;
        }

        const content = JSON.stringify({
            type: 'legacy-html',
            html: metadata.htmlContent,
            imported: new Date().toISOString()
        });

        const activity = await prisma.activity.create({
            data: {
                title: metadata.title,
                description: metadata.description,
                type: metadata.type,
                level: metadata.level,
                category: metadata.category,
                content: content,
                createdBy: null
            }
        });

        console.log(`   ✅ Imported successfully (ID: ${activity.id})`);
        return activity;
    } catch (error) {
        console.error(`   ❌ Error:`, error.message);
        return null;
    }
}

async function batchImport() {
    console.log('🚀 Starting batch import of Simple tense guides...\n');

    const legacyDir = path.resolve(__dirname, '../_legacy/activities');

    // List of Simple tense activities to import
    const simpleTenseFiles = [
        'present-simple-complete-guide.html',
        'past-simple-complete-guide.html',
        'future-simple-complete-guide.html',
        'simple-tenses-review-guide.html',
        'will-vs-going-to-complete-guide.html',
        'present-perfect-complete-guide.html', // We know this one exists
    ];

    let imported = 0;
    let skipped = 0;
    let failed = 0;
    let notFound = 0;

    for (const filename of simpleTenseFiles) {
        const filePath = path.join(legacyDir, filename);

        if (!fs.existsSync(filePath)) {
            notFound++;
            continue;
        }

        const result = await importActivity(filePath, filename);

        if (result === null) {
            failed++;
        } else if (result && result.createdAt.getTime() > Date.now() - 5000) {
            imported++;
        } else {
            skipped++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log(`   ✅ Newly imported: ${imported}`);
    console.log(`   ℹ️  Already existed: ${skipped}`);
    console.log(`   ⚠️  Not found: ${notFound}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('='.repeat(50));

    if (imported > 0) {
        console.log('\n🔗 View activities at: /dashboard/activities');
    }

    if (notFound > 0) {
        console.log('\n💡 Tip: Some files were not found in _legacy/activities/');
        console.log('   You can copy them from your legacy folder or create new activities manually.');
    }
}

// Main execution
batchImport()
    .then(() => {
        console.log('\n✨ Batch import complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Batch import failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
