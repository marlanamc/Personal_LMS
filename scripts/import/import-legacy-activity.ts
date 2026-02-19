/**
 * Script to import legacy HTML activity files into the database
 *
 * Usage: node --loader ts-node/esm scripts/import-legacy-activity.ts <path-to-html-file>
 * Example: node --loader ts-node/esm scripts/import-legacy-activity.ts _legacy/activities/present-simple-complete-guide.html
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ActivityMetadata {
    title: string;
    description: string;
    type: string;
    level: string;
    category: string;
    htmlContent: string;
}

function extractMetadata(htmlPath: string): ActivityMetadata {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const root = parse(htmlContent);

    // Extract metadata from meta tags
    const getMetaContent = (name: string): string => {
        const meta = root.querySelector(`meta[name="${name}"]`);
        return meta?.getAttribute('content') || '';
    };

    const title = root.querySelector('title')?.textContent?.trim() ||
                  path.basename(htmlPath, '.html').replace(/-/g, ' ');

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

async function importActivity(htmlPath: string) {
    try {
        console.log(`\n📚 Importing activity from: ${htmlPath}`);

        if (!fs.existsSync(htmlPath)) {
            throw new Error(`File not found: ${htmlPath}`);
        }

        const metadata = extractMetadata(htmlPath);

        console.log(`\n📋 Activity Details:`);
        console.log(`   Title: ${metadata.title}`);
        console.log(`   Type: ${metadata.type}`);
        console.log(`   Level: ${metadata.level}`);
        console.log(`   Category: ${metadata.category}`);
        console.log(`   Description: ${metadata.description}`);

        // Store the HTML content as JSON with a legacy type
        const content = JSON.stringify({
            type: 'legacy-html',
            html: metadata.htmlContent,
            imported: new Date().toISOString()
        });

        // Create activity in database
        const activity = await prisma.activity.create({
            data: {
                title: metadata.title,
                description: metadata.description,
                type: metadata.type,
                level: metadata.level,
                category: metadata.category,
                content: content,
                createdBy: null // Legacy activities don't have a creator
            }
        });

        console.log(`\n✅ Activity imported successfully!`);
        console.log(`   ID: ${activity.id}`);
        console.log(`   Created at: ${activity.createdAt}`);
        console.log(`\n🔗 View at: /activity/${activity.id}`);

        return activity;
    } catch (error) {
        console.error('\n❌ Error importing activity:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('❌ Usage: node --loader ts-node/esm scripts/import-legacy-activity.ts <path-to-html-file>');
    console.error('   Example: node --loader ts-node/esm scripts/import-legacy-activity.ts _legacy/activities/present-simple-complete-guide.html');
    process.exit(1);
}

const htmlPath = path.resolve(args[0]);
importActivity(htmlPath)
    .then(() => {
        console.log('\n✨ Import complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Import failed:', error);
        process.exit(1);
    });
