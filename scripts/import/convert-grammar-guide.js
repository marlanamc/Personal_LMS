#!/usr/bin/env node

/**
 * Script to convert legacy HTML grammar guides to TypeScript interactive guide format
 * Usage: node scripts/convert-grammar-guide.js <tense-name> <output-name>
 * Example: node scripts/convert-grammar-guide.js "Past Simple" past-simple
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const [,, tenseName, outputName] = process.argv;

if (!tenseName || !outputName) {
    console.error('Usage: node scripts/convert-grammar-guide.js <tense-name> <output-name>');
    console.error('Example: node scripts/convert-grammar-guide.js "Past Simple" past-simple');
    process.exit(1);
}

const camelCaseName = outputName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

console.log(`Tense: ${tenseName}`);
console.log(`Output: ${camelCaseName}Content\n`);

// Generate TypeScript content
const outputPath = path.join(process.cwd(), 'src', 'content', 'grammar', `${outputName}.ts`);

const tsContent = `import type { InteractiveGuideContent } from "@/types/activity";

export const ${camelCaseName}Content: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // TODO: Convert sections from HTML
        // This is a template - customize for ${tenseName}
        {
            id: "introduction",
            title: "Welcome! Let's Learn ${tenseName} Together",
            icon: "📚",
            explanation: \`
                <p>We're going to learn ${tenseName} step by step. Don't worry - we'll practice each part before moving to the next!</p>
            \`,
        },
        // Add more sections here...
    ],
    miniQuiz: [
        // TODO: Add quiz questions
    ],
};
`;

// Write the TypeScript file
fs.writeFileSync(outputPath, tsContent);
console.log(`✅ Created: ${outputPath}`);

// Generate route file
const routePath = path.join(process.cwd(), 'src', 'app', 'grammar-reader', outputName, 'page.tsx');
const routeDir = path.dirname(routePath);

if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
}

const routeContent = `import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { ${camelCaseName}Content } from "@/content/grammar/${outputName}";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "${tenseName} - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to ${tenseName} tense with exercises, examples, and practice. Learn when and how to use ${tenseName} correctly.",
};

export default function ${tenseName.replace(/\s+/g, '')}Page() {
    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader content={${camelCaseName}Content} />
        </div>
    );
}
`;

fs.writeFileSync(routePath, routeContent);
console.log(`✅ Created: ${routePath}`);

// Generate seed entry
console.log(`\n📝 Add this to prisma/seed.js:\n`);
console.log(`    // Create ${tenseName} Guide
    const ${camelCaseName}Guide = await prisma.activity.upsert({
        where: { id: '${outputName}-guide' },
        update: {
            title: '${tenseName} Guide',
            description: 'Complete guide to ${tenseName} tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/${outputName}'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: '${outputName}-guide',
            title: '${tenseName} Guide',
            description: 'Complete guide to ${tenseName} tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/${outputName}'
            }),
            createdBy: teacher.id,
        },
    });

    console.log('📚 ${tenseName} guide added:', ${camelCaseName}Guide.title);
`);

console.log(`\n✨ Template files created!`);
console.log(`\nNext steps:`);
console.log(`1. Edit src/content/grammar/${outputName}.ts to add the actual content`);
console.log(`2. Add the seed entry to prisma/seed.js`);
console.log(`3. Run: node prisma/seed.js`);
console.log(`4. Visit: http://localhost:3000/grammar-reader/${outputName}\n`);
