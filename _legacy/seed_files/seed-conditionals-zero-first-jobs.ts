import { PrismaClient } from '@prisma/client';
import { conditionalsZeroFirstJobsContent } from '../src/content/grammar/conditionals-zero-first-jobs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Zero & First Conditionals: Jobs - Rules & Expectations grammar guide...');

  await prisma.activity.upsert({
    where: { id: "conditionals-zero-first-jobs" },
    update: {
      content: JSON.stringify(conditionalsZeroFirstJobsContent),
      title: "Zero & First Conditionals: Jobs Guide",
      type: "guide",
      category: "grammar",
      description: "Learn to use zero conditional for workplace policies and rules, and first conditional for real future job plans and possibilities. Essential for understanding workplace expectations and discussing your career goals.",
    },
    create: {
      id: "conditionals-zero-first-jobs",
      title: "Zero & First Conditionals: Jobs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(conditionalsZeroFirstJobsContent),
      description: "Learn to use zero conditional for workplace policies and rules, and first conditional for real future job plans and possibilities. Essential for understanding workplace expectations and discussing your career goals.",
    },
  });

  console.log('✅ Zero & First Conditionals: Jobs - Rules & Expectations guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
