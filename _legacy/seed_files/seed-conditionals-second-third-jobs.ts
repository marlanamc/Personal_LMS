import { PrismaClient } from '@prisma/client';
import { conditionalsSecondThirdJobsContent } from '../src/content/grammar/conditionals-second-third-jobs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Second & Third Conditionals: Jobs - Advice & Reflection grammar guide...');

  await prisma.activity.upsert({
    where: { id: "conditionals-second-third-jobs" },
    update: {
      content: JSON.stringify(conditionalsSecondThirdJobsContent),
      title: "Second & Third Conditionals: Jobs Guide",
      type: "guide",
      category: "grammar",
      description: "Learn to use second conditional for career advice and hypothetical job scenarios, and third conditional for reflecting on past job decisions and lessons learned. Perfect for professional discussions and career planning.",
    },
    create: {
      id: "conditionals-second-third-jobs",
      title: "Second & Third Conditionals: Jobs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(conditionalsSecondThirdJobsContent),
      description: "Learn to use second conditional for career advice and hypothetical job scenarios, and third conditional for reflecting on past job decisions and lessons learned. Perfect for professional discussions and career planning.",
    },
  });

  console.log('✅ Second & Third Conditionals: Jobs - Advice & Reflection guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
