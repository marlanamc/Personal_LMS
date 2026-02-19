/**
 * Migration script to consolidate 4 separate vocabulary activities into single consolidated activities
 *
 * This script:
 * 1. Groups existing vocab activities (packet, flashcards, matching, fillblank) by their base ID
 * 2. Creates a single consolidated activity with type: 'vocabulary' combining all 4 types' content
 * 3. Migrates student progress from 4 separate records to 1 with categoryData tracking each type
 * 4. Migrates assignments from the 4 old activities to the new consolidated activity
 * 5. Preserves all points in PointsLedger (immutable audit log)
 * 6. Deletes old activity records and progress records after successful migration
 * 7. Supports dry-run mode to preview changes before committing
 */

import { prisma } from "@/lib/prisma";

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

interface VocabActivityGroup {
  baseId: string;
  packet?: { id: string; title: string; content: string };
  flashcards?: { id: string; title: string; content: string };
  matching?: { id: string; title: string; content: string };
  fillblank?: { id: string; title: string; content: string };
}

async function main() {
  console.log(`Starting vocabulary migration (DRY_RUN: ${DRY_RUN})...\n`);

  try {
    // Step 1: Find all vocabulary activities
    const allActivities = await prisma.activity.findMany({
      where: {
        id: {
          contains: "vocab-",
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        category: true,
      },
    });

    if (allActivities.length === 0) {
      console.log("No vocabulary activities found. Migration complete.");
      return;
    }

    console.log(`Found ${allActivities.length} vocabulary activities\n`);

    // Step 2: Group by base ID
    const groups: Map<string, VocabActivityGroup> = new Map();

    for (const activity of allActivities) {
      // Extract base ID and type
      let baseId = activity.id;
      let typeKey: "packet" | "flashcards" | "matching" | "fillblank" | null =
        null;

      if (activity.id.endsWith("-packet")) {
        baseId = activity.id.replace("-packet", "");
        typeKey = "packet";
      } else if (activity.id.endsWith("-flashcards")) {
        baseId = activity.id.replace("-flashcards", "");
        typeKey = "flashcards";
      } else if (activity.id.endsWith("-matching")) {
        baseId = activity.id.replace("-matching", "");
        typeKey = "matching";
      } else if (activity.id.endsWith("-fillblank")) {
        baseId = activity.id.replace("-fillblank", "");
        typeKey = "fillblank";
      }

      if (!typeKey) {
        if (VERBOSE) {
          console.log(`⚠️  Skipping ${activity.id} - unknown type pattern`);
        }
        continue;
      }

      if (!groups.has(baseId)) {
        groups.set(baseId, { baseId });
      }

      const group = groups.get(baseId)!;
      group[typeKey] = {
        id: activity.id,
        title: activity.title,
        content: activity.content,
      };
    }

    console.log(`Grouped into ${groups.size} vocabulary units\n`);

    // Step 3: Migrate each group
    let successCount = 0;
    let errorCount = 0;

    for (const [baseId, group] of groups) {
      try {
        await migrateVocabGroup(baseId, group);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${baseId}:`, error);
        errorCount++;
      }
    }

    console.log(
      `\n✅ Migration complete: ${successCount} succeeded, ${errorCount} failed`
    );

    if (!DRY_RUN) {
      console.log(
        "\n🎉 Migration finished! All vocabulary activities have been consolidated."
      );
    } else {
      console.log(
        "\n📋 DRY RUN completed. No changes were made. Run without --dry-run to apply changes."
      );
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

async function migrateVocabGroup(
  baseId: string,
  group: VocabActivityGroup
): Promise<void> {
  if (!group.packet && !group.flashcards && !group.matching && !group.fillblank) {
    console.log(`⚠️  Skipping ${baseId} - no vocabulary activities found`);
    return;
  }

  if (VERBOSE) {
    console.log(`Processing ${baseId}...`);
  }

  // Extract title (remove type suffix)
  const title = group.packet?.title ||
    group.flashcards?.title ||
    group.matching?.title ||
    group.fillblank?.title || `Vocabulary: ${baseId}`;

  const cleanTitle = title
    .replace(/\s*[-–—]\s*(Word List|word list|packet|Packet)$/, "")
    .replace(/\s*[-–—]\s*(Flash ?Cards?|flashcards)$/, "")
    .replace(/\s*[-–—]\s*(Matching|matching)$/, "")
    .replace(/\s*[-–—]\s*(Fill[- ]in[- ](?:the[- ])?Blank|fill-?in-?blank)$/i, "")
    .trim();

  // Create consolidated content
  const consolidatedContent = {
    type: "vocabulary",
    wordList: group.packet ? parseContent(group.packet.content) : {},
    flashcards: group.flashcards ? parseContent(group.flashcards.content) : {},
    matching: group.matching ? parseContent(group.matching.content) : {},
    fillInBlank: group.fillblank ? parseContent(group.fillblank.content) : {},
  };

  if (DRY_RUN) {
    console.log(`DRY_RUN: Would create consolidated activity: ${baseId}`);
    console.log(
      `  Title: ${cleanTitle}`
    );
    console.log(
      `  Contains: ${[group.packet ? "📄" : "", group.flashcards ? "🎴" : "", group.matching ? "🧩" : "", group.fillblank ? "✍️" : ""].filter(Boolean).join(" ")}`
    );
    return;
  }

  // Step 1: Create the consolidated activity
  const newActivity = await prisma.activity.create({
    data: {
      id: baseId,
      title: cleanTitle,
      description: null,
      content: JSON.stringify(consolidatedContent),
      type: "vocabulary",
      category: "Vocab",
      level: null,
      ui: null,
    },
  });

  if (VERBOSE) {
    console.log(`✅ Created consolidated activity: ${baseId}`);
  }

  // Step 2: Migrate student progress
  const oldActivityIds = [
    group.packet?.id,
    group.flashcards?.id,
    group.matching?.id,
    group.fillblank?.id,
  ].filter(Boolean) as string[];

  const oldProgressRecords = await prisma.activityProgress.findMany({
    where: {
      activityId: { in: oldActivityIds },
    },
    select: {
      id: true,
      userId: true,
      activityId: true,
      assignmentId: true,
      progress: true,
      status: true,
      categoryData: true,
    },
  });

  // Group by userId + assignmentId
  const progressByStudent: Map<string, typeof oldProgressRecords> = new Map();

  for (const record of oldProgressRecords) {
    const key = `${record.userId}|${record.assignmentId || ""}`;
    if (!progressByStudent.has(key)) {
      progressByStudent.set(key, []);
    }
    progressByStudent.get(key)!.push(record);
  }

  // Create consolidated progress records
  for (const [key, records] of progressByStudent) {
    const [userId, assignmentId] = key.split("|");

    const categoryData: Record<string, any> = {};
    let anyCompleted = false;

    for (const record of records) {
      const vocabType = getVocabTypeFromActivityId(record.activityId);
      if (vocabType) {
        categoryData[vocabType] = {
          completed: record.progress >= 100,
          progress: record.progress,
          status: record.status,
        };
        if (record.progress >= 100) {
          anyCompleted = true;
        }
      }
    }

    // Calculate overall progress
    const completedCount = Object.values(categoryData).filter(
      (d: any) => d.completed
    ).length;
    const overallProgress = (completedCount / 4) * 100;

    // Create new consolidated progress record
    await prisma.activityProgress.create({
      data: {
        userId,
        activityId: baseId,
        assignmentId: assignmentId || null,
        progress: overallProgress,
        status: overallProgress >= 100 ? "completed" : "in_progress",
        categoryData: JSON.stringify(categoryData),
      },
    });

    if (VERBOSE) {
      console.log(
        `  ✅ Migrated progress for user ${userId.slice(0, 8)}...: ${completedCount}/4 types completed`
      );
    }
  }

  // Step 3: Migrate assignments
  const oldAssignments = await prisma.assignment.findMany({
    where: {
      activityId: { in: oldActivityIds },
    },
    select: {
      id: true,
      classId: true,
      activityId: true,
      dueDate: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  for (const assignment of oldAssignments) {
    // Check if consolidated assignment already exists
    const existingConsolidated = await prisma.assignment.findFirst({
      where: {
        classId: assignment.classId,
        activityId: baseId,
      },
    });

    if (!existingConsolidated) {
      await prisma.assignment.create({
        data: {
          classId: assignment.classId,
          activityId: baseId,
          dueDate: assignment.dueDate,
          isFeatured: assignment.isFeatured,
        },
      });

      if (VERBOSE) {
        console.log(
          `  ✅ Created consolidated assignment for class ${assignment.classId.slice(0, 8)}...`
        );
      }
    }
  }

  // Step 4: Delete old activity records and progress records
  // (Done after migration to preserve data during the operation)
  if (oldProgressRecords.length > 0) {
    await prisma.activityProgress.deleteMany({
      where: {
        activityId: { in: oldActivityIds },
      },
    });
  }

  // Delete old activities
  await prisma.activity.deleteMany({
    where: {
      id: { in: oldActivityIds },
    },
  });

  // Delete old assignments (the consolidated ones will be kept)
  await prisma.assignment.deleteMany({
    where: {
      activityId: { in: oldActivityIds },
    },
  });

  if (VERBOSE) {
    console.log(`✅ Deleted ${oldActivityIds.length} old activity records`);
  }
}

function getVocabTypeFromActivityId(
  activityId: string
): "word-list" | "flashcards" | "matching" | "fill-blank" | null {
  if (activityId.endsWith("-packet")) return "word-list";
  if (activityId.endsWith("-flashcards")) return "flashcards";
  if (activityId.endsWith("-matching")) return "matching";
  if (activityId.endsWith("-fillblank")) return "fill-blank";
  return null;
}

function parseContent(contentStr: string): any {
  try {
    return JSON.parse(contentStr);
  } catch {
    return { raw: contentStr };
  }
}

main().catch(console.error);
