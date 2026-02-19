import { PrismaClient } from '@prisma/client';
import { punctuationCapitalizationContent } from '../src/content/grammar/punctuation-capitalization';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Punctuation & Capitalization grammar guide...');

  await prisma.activity.upsert({
    where: { id: "punctuation-capitalization" },
    update: {
      content: JSON.stringify(punctuationCapitalizationContent),
      title: "Punctuation & Capitalization Guide",
      type: "guide",
      category: "grammar",
      description: "Master punctuation and capitalization rules for professional writing. Learn commas, apostrophes, quotation marks, and capital letters.",
    },
    create: {
      id: "punctuation-capitalization",
      title: "Punctuation & Capitalization Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(punctuationCapitalizationContent),
      description: "Master punctuation and capitalization rules for professional writing. Learn commas, apostrophes, quotation marks, and capital letters.",
    },
  });

  console.log('✅ Punctuation & Capitalization guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
