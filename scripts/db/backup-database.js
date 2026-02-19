const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backupDatabase() {
    try {
        console.log('📦 Starting database backup...\n');

        // Get all data
        const users = await prisma.user.findMany();
        const classes = await prisma.class.findMany();
        const activities = await prisma.activity.findMany();
        const submissions = await prisma.submission.findMany();
        const activityProgress = await prisma.activityProgress.findMany();
        const pointsLedger = await prisma.pointsLedger.findMany();

        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                users,
                classes,
                activities,
                submissions,
                activityProgress,
                pointsLedger
            }
        };

        const filename = `backup-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
        fs.writeFileSync(filename, JSON.stringify(backup, null, 2));

        console.log(`✅ Backup saved to: ${filename}`);
        console.log(`\nStats:`);
        console.log(`  Users: ${users.length}`);
        console.log(`  Submissions: ${submissions.length}`);
        console.log(`  Activity Progress: ${activityProgress.length}`);
        console.log(`  Points Ledger: ${pointsLedger.length}`);
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backupDatabase();
