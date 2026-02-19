import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying consolidated vocab activity structure...\n');

  const activity = await prisma.activity.findUnique({
    where: { id: 'vocab-feb-3-5' },
    select: { id: true, title: true, content: true }
  });

  if (!activity) {
    console.log('❌ Activity not found!');
    return;
  }

  console.log('✅ Activity found:', activity.id);
  console.log('   Title:', activity.title);
  console.log('\n📦 Content structure:');

  try {
    const content = JSON.parse(activity.content);
    console.log('   - type:', content.type);
    console.log('   - wordList:', content.wordList ? `✅ ${content.wordList.cards?.length || 0} cards` : '❌ Missing');
    console.log('   - flashcards:', content.flashcards ? `✅ ${content.flashcards.cards?.length || 0} cards` : '❌ Missing');
    console.log('   - matching:', content.matching ? `✅ ${content.matching.pairs?.length || 0} pairs` : '❌ Missing');
    console.log('   - fillInBlank:', content.fillInBlank ? `✅ ${content.fillInBlank.sentences?.length || 0} sentences` : '❌ Missing');
  } catch (e) {
    console.log('   ❌ Error parsing content:', e);
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
