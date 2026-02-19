import { PrismaClient } from '@prisma/client';
import { conditionalsZeroFirstContent } from '../src/content/grammar/conditionals-zero-first';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Zero & First Conditionals grammar guide...');

  await prisma.activity.upsert({
    where: { id: "conditionals-zero-first" },
    update: {
      content: JSON.stringify(conditionalsZeroFirstContent),
      title: "Zero & First Conditionals Guide",
      type: "guide",
      category: "grammar",
      description: "Master zero conditional for universal truths and facts, and first conditional for real future plans and possibilities. Learn to express cause-and-effect relationships and discuss realistic future scenarios in everyday life.",
    },
    create: {
      id: "conditionals-zero-first",
      title: "Zero & First Conditionals Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(conditionalsZeroFirstContent),
      description: "Master zero conditional for universal truths and facts, and first conditional for real future plans and possibilities. Learn to express cause-and-effect relationships and discuss realistic future scenarios in everyday life.",
    },
  });

  console.log('✅ Zero & First Conditionals guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
