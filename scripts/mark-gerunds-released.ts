import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📌 Marking gerunds & infinitives jobs guide as released...');

  try {
    const activity = await prisma.activity.update({
      where: { id: 'gerunds-infinitives-jobs' },
      data: { isReleased: true },
      select: { title: true, isReleased: true }
    });

    console.log(`✅ ${activity.title} - Released: ${activity.isReleased}`);
  } catch (error) {
    console.error(`❌ Error updating:`, error);
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
