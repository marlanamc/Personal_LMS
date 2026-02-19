import { PrismaClient } from '@prisma/client';
import { superlativesQuantifiersContent } from '../src/content/grammar/superlatives-quantifiers';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Superlatives & Quantifiers grammar guide...');

  await prisma.activity.upsert({
    where: { id: "superlatives-quantifiers" },
    update: {
      content: JSON.stringify(superlativesQuantifiersContent),
      title: "Superlatives & Quantifiers Guide",
      type: "guide",
      category: "grammar",
      description: "Master comparisons and quantities: superlatives (most/least/-est) and quantifiers (many/much, few/little, fewer/less).",
    },
    create: {
      id: "superlatives-quantifiers",
      title: "Superlatives & Quantifiers Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(superlativesQuantifiersContent),
      description: "Master comparisons and quantities: superlatives (most/least/-est) and quantifiers (many/much, few/little, fewer/less).",
    },
  });

  console.log('✅ Superlatives & Quantifiers guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
