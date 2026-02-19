import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for Cycle 1 vocab activities (Sept-Jan)...\n');

  const cycle1Months = ['september', 'october', 'november', 'december', 'january'];

  for (const month of cycle1Months) {
    const baseId = `vocab-${month}`;
    const flashcardId = `${baseId}-flashcards`;

    const baseActivity = await prisma.activity.findUnique({
      where: { id: baseId },
      select: { id: true, title: true, category: true, type: true }
    });

    const flashcardActivity = await prisma.activity.findUnique({
      where: { id: flashcardId },
      select: { id: true, title: true, category: true, type: true }
    });

    console.log(`\n📅 ${month.toUpperCase()}:`);
    if (baseActivity) {
      console.log(`   ✅ Base activity found: ${baseActivity.id}`);
      console.log(`      Title: ${baseActivity.title}`);
      console.log(`      Category: ${baseActivity.category}`);
      console.log(`      Type: ${baseActivity.type}`);
    } else {
      console.log(`   ❌ Base activity NOT found: ${baseId}`);
    }

    if (flashcardActivity) {
      console.log(`   ✅ Flashcard activity found: ${flashcardActivity.id}`);
      console.log(`      Title: ${flashcardActivity.title}`);
      console.log(`      Category: ${flashcardActivity.category}`);
      console.log(`      Type: ${flashcardActivity.type}`);
    } else {
      console.log(`   ⚠️  Flashcard activity NOT found: ${flashcardId}`);
    }
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
