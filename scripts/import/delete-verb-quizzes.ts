import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting verb quizzes...\n');

  // First, find all verb quiz activity IDs
  const verbQuizzes = await prisma.activity.findMany({
    where: {
      type: 'quiz',
      content: {
        contains: '"type":"verb-quiz"'
      }
    },
    select: { id: true }
  });

  const quizIds = verbQuizzes.map(q => q.id);

  if (quizIds.length === 0) {
    console.log('No verb quizzes found to delete.\n');
    return;
  }

  console.log(`Found ${quizIds.length} verb quizzes\n`);

  // Delete related assignments first
  const assignmentsResult = await prisma.assignment.deleteMany({
    where: {
      activityId: { in: quizIds }
    }
  });
  console.log(`✅ Deleted ${assignmentsResult.count} related assignments\n`);

  // Delete related submissions
  const submissionsResult = await prisma.submission.deleteMany({
    where: {
      activityId: { in: quizIds }
    }
  });
  console.log(`✅ Deleted ${submissionsResult.count} related submissions\n`);

  // Delete related activity progress
  const progressResult = await (prisma.activityProgress as any).deleteMany({
    where: {
      activityId: { in: quizIds }
    }
  });
  console.log(`✅ Deleted ${progressResult.count} related progress records\n`);

  // Now delete the activities
  const deleteResult = await prisma.activity.deleteMany({
    where: {
      id: { in: quizIds }
    }
  });

  console.log(`✅ Deleted ${deleteResult.count} verb quiz activities\n`);

  console.log('✨ Cleanup complete! You can now run the import script again.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
