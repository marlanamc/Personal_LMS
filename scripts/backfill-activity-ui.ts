import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillMatchingUi() {
  console.log('🔧 Backfilling matching UI metadata for legacy activities...');

  const { count } = await prisma.activity.updateMany({
    where: {
      type: 'game',
      ui: null,
      content: {
        contains: '::',
      },
    },
    data: {
      ui: 'matching',
    },
  });

  console.log(`✅ Updated ${count} matching activities.`);
}

backfillMatchingUi()
  .catch((error) => {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
