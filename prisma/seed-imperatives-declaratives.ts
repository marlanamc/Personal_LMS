import { PrismaClient } from '@prisma/client';
import { imperativesDeclarativesContent } from '../src/content/grammar/imperatives-declaratives';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Imperatives vs Declaratives grammar guide...');

  await prisma.activity.upsert({
    where: { id: "imperatives-declaratives" },
    update: {
      content: JSON.stringify(imperativesDeclarativesContent),
      title: "Imperatives vs Declaratives Guide",
      type: "guide",
      category: "grammar",
      description: "Understand tone differences between commands (imperatives) and statements (declaratives) for medical and professional communication.",
    },
    create: {
      id: "imperatives-declaratives",
      title: "Imperatives vs Declaratives Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(imperativesDeclarativesContent),
      description: "Understand tone differences between commands (imperatives) and statements (declaratives) for medical and professional communication.",
    },
  });

  console.log('✅ Imperatives vs Declaratives guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
