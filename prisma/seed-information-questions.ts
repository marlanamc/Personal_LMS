import { PrismaClient } from '@prisma/client';
import { informationQuestionsContent } from '../src/content/grammar/information-questions';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Information Questions grammar guide...');

  await prisma.activity.upsert({
    where: { id: "information-questions" },
    update: {
      content: JSON.stringify(informationQuestionsContent),
      title: "Information Questions Guide",
      type: "guide",
      category: "grammar",
      description: "Master WH-questions: who, what, when, where, why, how. Learn question word order and how much vs how many.",
    },
    create: {
      id: "information-questions",
      title: "Information Questions Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(informationQuestionsContent),
      description: "Master WH-questions: who, what, when, where, why, how. Learn question word order and how much vs how many.",
    },
  });

  console.log('✅ Information Questions guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
