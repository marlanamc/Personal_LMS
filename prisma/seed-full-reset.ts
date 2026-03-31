import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('\n⚠️  FULL DATABASE RESET');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('This will DELETE ALL student progress data:');
  console.log('  • ActivityProgress (quiz scores, guide progress)');
  console.log('  • Submissions (quiz answers, graded work)');
  console.log('  • SpeakingSubmissions (speaking exercise completions)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const confirmed = await confirm('Are you sure you want to continue? (y/N): ');

  if (!confirmed) {
    console.log('\n❌ Aborted. No data was deleted.');
    process.exit(0);
  }

  console.log('\n🗑️  Deleting all student progress data...');

  // Delete progress data first (before activities, to avoid cascade issues)
  const progressCount = await prisma.activityProgress.count();
  const submissionCount = await prisma.submission.count();
  const speakingCount = await prisma.speakingSubmission.count();
  const quizResponseCount = await prisma.quizResponse.count();
  const assignmentCount = await prisma.assignment.count();

  await prisma.activityProgress.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.speakingSubmission.deleteMany({});
  await prisma.quizResponse.deleteMany({});
  await prisma.assignment.deleteMany({});

  console.log(`  ✅ Deleted ${progressCount} ActivityProgress records`);
  console.log(`  ✅ Deleted ${submissionCount} Submission records`);
  console.log(`  ✅ Deleted ${speakingCount} SpeakingSubmission records`);
  console.log(`  ✅ Deleted ${quizResponseCount} QuizResponse records`);
  console.log(`  ✅ Deleted ${assignmentCount} Assignment records`);

  // Delete all activities
  const activityCount = await prisma.activity.count();
  await prisma.activity.deleteMany({});
  console.log(`  ✅ Deleted ${activityCount} Activity records`);

  console.log('\n✨ Full reset complete! Now run the remaining seed scripts:');
  console.log('   The db:seed:full script will continue with seeding...\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
