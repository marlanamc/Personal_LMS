import { PrismaClient } from '@prisma/client';
import { futurePerfectJobsContent } from '../src/content/grammar/future-perfect-jobs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Future Perfect: Jobs - Goals & Planning grammar guide...');

  await prisma.activity.upsert({
    where: { id: "future-perfect" },
    update: {
      content: JSON.stringify(futurePerfectJobsContent),
      title: "Future Perfect: Jobs Guide",
      type: "guide",
      category: "grammar",
      description: "Learn to use future perfect tense to set career goals, plan professional development, discuss project deadlines, and communicate future accomplishments. Essential for job interviews, performance reviews, and career planning.",
    },
    create: {
      id: "future-perfect",
      title: "Future Perfect: Jobs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(futurePerfectJobsContent),
      description: "Learn to use future perfect tense to set career goals, plan professional development, discuss project deadlines, and communicate future accomplishments. Essential for job interviews, performance reviews, and career planning.",
    },
  });

  console.log('✅ Future Perfect: Jobs - Goals & Planning guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
