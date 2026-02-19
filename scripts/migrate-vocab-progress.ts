#!/usr/bin/env tsx
/**
 * Migration script to sync vocabulary progress from assignment-specific records to global records
 *
 * This fixes the issue where students completed vocabulary activities through assignments,
 * but the global progress (without assignmentId) wasn't synced, causing the selection page
 * to show 0/4 completion.
 *
 * Usage: npx tsx scripts/migrate-vocab-progress.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting vocabulary progress migration...\n');

    // Find all vocabulary activities
    const vocabActivities = await prisma.activity.findMany({
        where: {
            type: 'vocabulary',
        },
        select: {
            id: true,
            title: true,
        },
    });

    console.log(`Found ${vocabActivities.length} vocabulary activities\n`);

    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;

    // For each vocabulary activity, aggregate progress across all assignment contexts
    for (const activity of vocabActivities) {
        console.log(`Processing: ${activity.title} (${activity.id})`);

        // Get all progress records for this activity (across all users and assignments)
        const allProgressRecords = await prisma.activityProgress.findMany({
            where: {
                activityId: activity.id,
            },
            select: {
                id: true,
                userId: true,
                assignmentId: true,
                categoryData: true,
                progress: true,
                status: true,
            },
        });

        // Group by userId
        const userProgressMap = new Map<string, any[]>();
        for (const record of allProgressRecords) {
            if (!userProgressMap.has(record.userId)) {
                userProgressMap.set(record.userId, []);
            }
            userProgressMap.get(record.userId)!.push(record);
        }

        console.log(`  Found ${userProgressMap.size} users with progress`);

        // For each user, merge their progress and sync to global record
        for (const [userId, userRecords] of userProgressMap) {
            // Check if there's already a global record (assignmentId = null)
            const globalRecord = userRecords.find(r => r.assignmentId === null);
            const assignmentRecords = userRecords.filter(r => r.assignmentId !== null);

            if (assignmentRecords.length === 0) {
                // No assignment-specific records, skip
                skippedCount++;
                continue;
            }

            // Merge categoryData from all assignment records
            const mergedCategoryData: any = {};
            const vocabTypes = ['word-list', 'flashcards', 'matching', 'fill-blank'];

            for (const record of assignmentRecords) {
                if (!record.categoryData) continue;

                const data = typeof record.categoryData === 'string'
                    ? JSON.parse(record.categoryData)
                    : record.categoryData;

                // For each vocab type, take the one with highest progress
                for (const vType of vocabTypes) {
                    if (data[vType]) {
                        if (!mergedCategoryData[vType] || data[vType].progress > (mergedCategoryData[vType].progress || 0)) {
                            mergedCategoryData[vType] = data[vType];
                        }
                    }
                }
            }

            // Calculate overall progress
            const completedCount = vocabTypes.filter(vType => mergedCategoryData[vType]?.completed).length;
            const overallProgress = Math.round((completedCount / vocabTypes.length) * 100);
            const overallStatus = overallProgress >= 100 ? 'completed' : 'in_progress';

            // If there's category data to sync
            if (Object.keys(mergedCategoryData).length > 0) {
                if (globalRecord) {
                    // Update existing global record
                    await prisma.activityProgress.update({
                        where: { id: globalRecord.id },
                        data: {
                            categoryData: JSON.stringify(mergedCategoryData),
                            progress: overallProgress,
                            status: overallStatus,
                        },
                    });
                    updatedCount++;
                    console.log(`    ✓ Updated global record for user ${userId.slice(0, 8)}... (${completedCount}/4 complete)`);
                } else {
                    // Create new global record
                    await prisma.activityProgress.create({
                        data: {
                            userId,
                            activityId: activity.id,
                            assignmentId: null,
                            categoryData: JSON.stringify(mergedCategoryData),
                            progress: overallProgress,
                            status: overallStatus,
                        },
                    });
                    createdCount++;
                    console.log(`    ✓ Created global record for user ${userId.slice(0, 8)}... (${completedCount}/4 complete)`);
                }
            } else {
                skippedCount++;
            }
        }

        console.log('');
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Created: ${createdCount} global records`);
    console.log(`Updated: ${updatedCount} global records`);
    console.log(`Skipped: ${skippedCount} records (no category data)`);
    console.log(`Total:   ${createdCount + updatedCount + skippedCount}`);
}

main()
    .catch((e) => {
        console.error('Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
