import { PrismaClient } from '@prisma/client';
import { futurePerfectContent } from '../src/content/grammar/future-perfect';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Future Perfect grammar guide...');

  await prisma.activity.upsert({
    where: { id: "future-perfect" },
    update: {
      content: JSON.stringify(futurePerfectContent),
      title: "Future Perfect Guide",
      type: "guide",
      category: "grammar",
      description: "Master Future Perfect for talking about deadlines, milestones, and goals. Learn to express what will be completed by a future point, plan career trajectories, and answer interview questions with confidence. Essential for discussing accomplishments and setting professional goals.",
    },
    create: {
      id: "future-perfect",
      title: "Future Perfect Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(futurePerfectContent),
      description: "Master Future Perfect for talking about deadlines, milestones, and goals. Learn to express what will be completed by a future point, plan career trajectories, and answer interview questions with confidence. Essential for discussing accomplishments and setting professional goals.",
    },
  });

  console.log('✅ Future Perfect guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
