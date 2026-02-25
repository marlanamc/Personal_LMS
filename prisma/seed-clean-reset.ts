import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🧹 CLEAN RESET');
  console.log('Deleting all data, then reseeding minimal personal workspace...\n');

  await prisma.activityProgress.deleteMany({});
  await prisma.speakingSubmission.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.quizResponse.deleteMany({});
  await prisma.userAchievement.deleteMany({});
  await prisma.pointsLedger.deleteMany({});
  await prisma.calendarEvent.deleteMany({});
  await prisma.classEnrollment.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database content cleared.');
  console.log('➡️ Next run: npm run db:seed:base');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
