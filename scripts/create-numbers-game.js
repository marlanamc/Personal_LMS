const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const numbersGameContent = JSON.stringify({
        type: 'numbers-game',
        category: 'Basic Numbers (0-99)'
    });

    // Create Numbers Game activity
    await prisma.activity.upsert({
        where: { id: 'numbers-game' },
        update: {
            title: 'Numbers to English Words',
            description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
            category: 'games',
            type: 'game',
            level: 'beginner',
            content: numbersGameContent,
        },
        create: {
            id: 'numbers-game',
            title: 'Numbers to English Words',
            description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
            category: 'games',
            type: 'game',
            level: 'beginner',
            content: numbersGameContent,
        },
    });

    console.log('✅ Created Numbers Game activity!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
