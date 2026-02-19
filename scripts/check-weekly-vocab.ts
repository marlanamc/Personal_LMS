import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking weekly vocab activities (Feb-Jun)...\n');

  // Check one week as an example
  const weekId = 'vocab-feb-3-5';

  const types = ['packet', 'flashcards', 'matching', 'fillblank'];

  console.log(`Checking ${weekId}:\n`);

  for (const type of types) {
    const activityId = type === 'packet' ? weekId : `${weekId}-${type}`;
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true, title: true, category: true, type: true }
    });

    if (activity) {
      console.log(`✅ ${type}: ${activityId}`);
      console.log(`   Title: ${activity.title}`);
      console.log(`   Type: ${activity.type}\n`);
    } else {
      console.log(`❌ ${type}: ${activityId} NOT FOUND\n`);
    }
  }

  // Check all weekly vocab activities
  console.log('\n📊 All weekly vocab activities in database:');
  const weeklyActivities = await prisma.activity.findMany({
    where: {
      AND: [
        { id: { startsWith: 'vocab-' } },
        {
          OR: [
            { id: { contains: 'feb-' } },
            { id: { contains: 'mar-' } },
            { id: { contains: 'apr-' } },
            { id: { contains: 'may-' } },
            { id: { contains: 'jun-' } },
          ]
        }
      ]
    },
    select: { id: true, title: true, type: true },
    orderBy: { id: 'asc' }
  });

  console.log(`\nFound ${weeklyActivities.length} weekly vocab activities:\n`);
  weeklyActivities.forEach(activity => {
    console.log(`   ${activity.id} (${activity.type})`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
