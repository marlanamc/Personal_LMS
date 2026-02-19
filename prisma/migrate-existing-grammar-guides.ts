import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting data migration: Setting existing grammar guides to released...');

    // Set all existing grammar guides to released
    const result = await prisma.activity.updateMany({
        where: {
            type: 'guide',
            category: 'grammar'
        },
        data: {
            isReleased: true
        }
    });

    console.log(`✓ Updated ${result.count} grammar guides to released status`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('Migration completed successfully');
    })
    .catch(async (e) => {
        console.error('Migration failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
