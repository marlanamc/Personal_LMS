import { PrismaClient } from '@prisma/client';
import { paragraphFormatContent } from '../src/content/grammar/paragraph-format';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Paragraph Format grammar guide...');

  await prisma.activity.upsert({
    where: { id: "paragraph-format" },
    update: {
      content: JSON.stringify(paragraphFormatContent),
      title: "Paragraph Format Guide",
      type: "guide",
      category: "grammar",
      description: "Master paragraph structure: topic sentence, supporting details, and conclusion. Essential for academic and professional writing.",
    },
    create: {
      id: "paragraph-format",
      title: "Paragraph Format Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(paragraphFormatContent),
      description: "Master paragraph structure: topic sentence, supporting details, and conclusion. Essential for academic and professional writing.",
    },
  });

  console.log('✅ Paragraph Format guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
