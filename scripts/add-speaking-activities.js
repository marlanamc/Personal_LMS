const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Adding speaking-focused activities...');

    // Read the content files
    const pastPerfectContent = fs.readFileSync(
        path.join(__dirname, '../src/content/grammar/past-perfect-housing.md'),
        'utf8'
    );

    const futurePerfectContent = fs.readFileSync(
        path.join(__dirname, '../src/content/grammar/future-perfect-consumer-finance.md'),
        'utf8'
    );

    const housingPromptsContent = fs.readFileSync(
        path.join(__dirname, '../src/content/speaking/housing-conversation-prompts.md'),
        'utf8'
    );

    const financePromptsContent = fs.readFileSync(
        path.join(__dirname, '../src/content/speaking/consumer-finance-prompts.md'),
        'utf8'
    );

    // Create Past Perfect Housing Guide
    const pastPerfectGuide = await prisma.activity.upsert({
        where: { id: 'past-perfect-housing-guide' },
        update: {
            title: 'Past Perfect Tense - Housing Context',
            description: 'Past Perfect tense guide with housing-themed examples and speaking practice. Includes form, use, housing examples, practice sentences, and common mistakes.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-perfect-housing',
                content: pastPerfectContent
            })
        },
        create: {
            id: 'past-perfect-housing-guide',
            title: 'Past Perfect Tense - Housing Context',
            description: 'Past Perfect tense guide with housing-themed examples and speaking practice. Includes form, use, housing examples, practice sentences, and common mistakes.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-perfect-housing',
                content: pastPerfectContent
            })
        }
    });

    console.log('✓ Created/Updated Past Perfect Housing Guide');

    // Create Future Perfect Consumer Finance Guide
    const futurePerfectGuide = await prisma.activity.upsert({
        where: { id: 'future-perfect-consumer-finance-guide' },
        update: {
            title: 'Future Perfect Tense - Consumer & Finance Context',
            description: 'Future Perfect tense guide with consumer and finance-themed examples. Includes form, use, financial examples, practice sentences, and real-life applications.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-perfect-consumer-finance',
                content: futurePerfectContent
            })
        },
        create: {
            id: 'future-perfect-consumer-finance-guide',
            title: 'Future Perfect Tense - Consumer & Finance Context',
            description: 'Future Perfect tense guide with consumer and finance-themed examples. Includes form, use, financial examples, practice sentences, and real-life applications.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-perfect-consumer-finance',
                content: futurePerfectContent
            })
        }
    });

    console.log('✓ Created/Updated Future Perfect Consumer Finance Guide');

    // Create Housing Speaking Prompts
    const housingPrompts = await prisma.activity.upsert({
        where: { id: 'speaking-housing-prompts' },
        update: {
            title: 'Speaking Prompts - Housing & Home Life',
            description: 'Comprehensive speaking prompts for housing and home life conversations. Includes 5 levels from basic descriptions to complex scenarios, role-plays, pronunciation practice, and progress tracking.',
            type: 'guide',
            category: 'speaking',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/speaking-housing-prompts',
                content: housingPromptsContent
            })
        },
        create: {
            id: 'speaking-housing-prompts',
            title: 'Speaking Prompts - Housing & Home Life',
            description: 'Comprehensive speaking prompts for housing and home life conversations. Includes 5 levels from basic descriptions to complex scenarios, role-plays, pronunciation practice, and progress tracking.',
            type: 'guide',
            category: 'speaking',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/speaking-housing-prompts',
                content: housingPromptsContent
            })
        }
    });

    console.log('✓ Created/Updated Housing Speaking Prompts');

    // Create Consumer Finance Speaking Prompts
    const financePrompts = await prisma.activity.upsert({
        where: { id: 'speaking-consumer-finance-prompts' },
        update: {
            title: 'Speaking Prompts - Consumer & Finance',
            description: 'Speaking prompts for consumer and finance conversations. Includes shopping, banking, budget topics, financial decision-making, customer service scenarios, and money-related vocabulary.',
            type: 'guide',
            category: 'speaking',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/speaking-consumer-finance-prompts',
                content: financePromptsContent
            })
        },
        create: {
            id: 'speaking-consumer-finance-prompts',
            title: 'Speaking Prompts - Consumer & Finance',
            description: 'Speaking prompts for consumer and finance conversations. Includes shopping, banking, budget topics, financial decision-making, customer service scenarios, and money-related vocabulary.',
            type: 'guide',
            category: 'speaking',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/speaking-consumer-finance-prompts',
                content: financePromptsContent
            })
        }
    });

    console.log('✓ Created/Updated Consumer Finance Speaking Prompts');

    console.log('\n✅ All speaking-focused activities have been added successfully!');
    console.log('\nSummary of created activities:');
    console.log(`1. ${pastPerfectGuide.title} (ID: ${pastPerfectGuide.id})`);
    console.log(`2. ${futurePerfectGuide.title} (ID: ${futurePerfectGuide.id})`);
    console.log(`3. ${housingPrompts.title} (ID: ${housingPrompts.id})`);
    console.log(`4. ${financePrompts.title} (ID: ${financePrompts.id})`);
}

main()
    .catch((e) => {
        console.error('Error adding speaking activities:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
