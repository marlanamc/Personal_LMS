import { PrismaClient } from '@prisma/client';
import { workplacePhrasalVerbsContent } from '../src/content/grammar/workplace-phrasal-verbs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Workplace Phrasal Verbs grammar guide...');

  await prisma.activity.upsert({
    where: { id: "workplace-phrasal-verbs" },
    update: {
      content: JSON.stringify(workplacePhrasalVerbsContent),
      title: "Workplace Phrasal Verbs Guide",
      type: "guide",
      category: "grammar",
      description: "Master essential workplace phrasal verbs: clock in/out, fill out, turn in, call back, cover for, and follow up.",
    },
    create: {
      id: "workplace-phrasal-verbs",
      title: "Workplace Phrasal Verbs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(workplacePhrasalVerbsContent),
      description: "Master essential workplace phrasal verbs: clock in/out, fill out, turn in, call back, cover for, and follow up.",
    },
  });

  console.log('✅ Workplace Phrasal Verbs guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
