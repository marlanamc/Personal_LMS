import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for vocab activities in the database...\n');

  const vocabActivities = await prisma.activity.findMany({
    where: {
      OR: [
        { category: { contains: 'Vocab', mode: 'insensitive' } },
        { id: { startsWith: 'vocab-' } },
      ]
    },
    select: {
      id: true,
      title: true,
      category: true,
      type: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (vocabActivities.length === 0) {
    console.log('❌ No vocab activities found in database!');
    console.log('   Run: npm run db:seed');
  } else {
    console.log(`✅ Found ${vocabActivities.length} vocab activities:\n`);
    vocabActivities.forEach((activity) => {
      console.log(`   ID: ${activity.id}`);
      console.log(`   Title: ${activity.title}`);
      console.log(`   Category: ${activity.category}`);
      console.log(`   Type: ${activity.type}`);
      console.log('');
    });
  }
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
