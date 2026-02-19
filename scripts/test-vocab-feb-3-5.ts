import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activity = await prisma.activity.findUnique({
    where: { id: 'vocab-feb-3-5' }
  });

  if (!activity) {
    console.log('❌ Activity not found!');
    return;
  }

  console.log('✅ Activity: vocab-feb-3-5');
  console.log('   Title:', activity.title);
  console.log('   Type:', activity.type);
  console.log('   Category:', activity.category);
  console.log('\n📦 Content preview:');

  try {
    const content = JSON.parse(activity.content);

    // Check structure
    console.log('\n🔍 Content structure:');
    console.log('   - type:', content.type);
    console.log('   - wordList:', content.wordList ? '✅ Present' : '❌ Missing');
    console.log('   - flashcards:', content.flashcards ? '✅ Present' : '❌ Missing');
    console.log('   - matching:', content.matching ? '✅ Present' : '❌ Missing');
    console.log('   - fillInBlank:', content.fillInBlank ? '✅ Present' : '❌ Missing');

    // Check first word in each section
    if (content.wordList?.cards?.[0]) {
      console.log('\n📝 First word in wordList:');
      console.log('   Term:', content.wordList.cards[0].term);
      console.log('   Definition:', content.wordList.cards[0].definition);
    }

    if (content.flashcards?.cards?.[0]) {
      console.log('\n🎴 First flashcard:');
      console.log('   Term:', content.flashcards.cards[0].term);
      console.log('   Definition:', content.flashcards.cards[0].definition);
    }

    if (content.matching?.pairs?.[0]) {
      console.log('\n🧩 First matching pair:');
      console.log('   Term:', content.matching.pairs[0].term);
      console.log('   Definition:', content.matching.pairs[0].definition);
    }

    if (content.fillInBlank?.sentences?.[0]) {
      console.log('\n✍️ First fill-in-blank:');
      console.log('   Text:', content.fillInBlank.sentences[0].text);
      console.log('   Answer:', content.fillInBlank.sentences[0].correctAnswers);
    }
  } catch (e) {
    console.log('❌ Error parsing content:', e);
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
