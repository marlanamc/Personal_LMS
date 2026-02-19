import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📌 Marking conditional guides as released...');

  const conditionalIds = [
    'conditionals-zero-first-jobs',
    'conditionals-second-third-jobs',
  ];

  for (const id of conditionalIds) {
    try {
      const activity = await prisma.activity.update({
        where: { id },
        data: { isReleased: true },
        select: { title: true, isReleased: true }
      });

      console.log(`✅ ${activity.title} - Released: ${activity.isReleased}`);
    } catch (error) {
      console.error(`❌ Error updating ${id}:`, error);
    }
  }

  console.log('\n✨ Done!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
