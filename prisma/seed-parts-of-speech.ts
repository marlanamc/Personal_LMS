import { PrismaClient } from '@prisma/client';
import { partsOfSpeechContent } from '../src/content/grammar/parts-of-speech';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Parts of Speech grammar guide...');

  await prisma.activity.upsert({
    where: { id: "parts-of-speech" },
    update: {
      content: JSON.stringify(partsOfSpeechContent),
      title: "Parts of Speech Guide",
      type: "guide",
      category: "grammar",
      description: "Master the building blocks of English: nouns, verbs, adjectives, and adverbs.",
    },
    create: {
      id: "parts-of-speech",
      title: "Parts of Speech Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(partsOfSpeechContent),
      description: "Master the building blocks of English: nouns, verbs, adjectives, and adverbs.",
    },
  });

  console.log('✅ Parts of Speech guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
