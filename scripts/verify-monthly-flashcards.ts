import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying monthly flashcard activities...\n');

  const months = ['september', 'october', 'november', 'december', 'january'];

  for (const month of months) {
    const activity = await prisma.activity.findUnique({
      where: { id: `vocab-${month}-flashcards` },
      select: { id: true, title: true, content: true, type: true }
    });

    if (!activity) {
      console.log(`❌ ${month}-flashcards not found`);
      continue;
    }

    console.log(`✅ ${activity.id}`);
    console.log(`   Title: ${activity.title}`);
    console.log(`   Type: ${activity.type}`);

    // Check if content is in old format (plain text) or new format (JSON)
    try {
      const content = JSON.parse(activity.content);
      if (typeof content === 'string') {
        console.log(`   ⚠️  Content is plain text, needs conversion`);
      } else {
        console.log(`   ✅ Content is structured JSON`);
      }
    } catch {
      console.log(`   ⚠️  Content is plain text (not JSON)`);
    }
    console.log('');
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
