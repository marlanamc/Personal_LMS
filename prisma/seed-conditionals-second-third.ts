import { PrismaClient } from '@prisma/client';
import { conditionalsSecondThirdContent } from '../src/content/grammar/conditionals-second-third';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Second & Third Conditionals grammar guide...');

  await prisma.activity.upsert({
    where: { id: "conditionals-second-third" },
    update: {
      content: JSON.stringify(conditionalsSecondThirdContent),
      title: "Second & Third Conditionals Guide",
      type: "guide",
      category: "grammar",
      description: "Learn second conditional for hypothetical present/future situations and dreams, and third conditional for reflecting on past events. Master the art of giving advice with 'If I were you' and discussing regrets or what might have been. Includes professional context for career planning.",
    },
    create: {
      id: "conditionals-second-third",
      title: "Second & Third Conditionals Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(conditionalsSecondThirdContent),
      description: "Learn second conditional for hypothetical present/future situations and dreams, and third conditional for reflecting on past events. Master the art of giving advice with 'If I were you' and discussing regrets or what might have been. Includes professional context for career planning.",
    },
  });

  console.log('✅ Second & Third Conditionals guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
