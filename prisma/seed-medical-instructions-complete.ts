import { PrismaClient } from '@prisma/client';
import { medicalInstructionsCompleteContent } from '../src/content/grammar/medical-instructions-complete';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Medical Instructions Complete grammar guide...');

  await prisma.activity.upsert({
    where: { id: "medical-instructions-complete" },
    update: {
      content: JSON.stringify(medicalInstructionsCompleteContent),
      title: "Medical Instructions: Modals, Imperatives & Declaratives",
      type: "guide",
      category: "grammar",
      description: "Comprehensive guide covering imperatives (commands), declaratives (statements), and modals (should/must/can) for healthcare and workplace communication.",
      isReleased: true,
    },
    create: {
      id: "medical-instructions-complete",
      title: "Medical Instructions: Modals, Imperatives & Declaratives",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(medicalInstructionsCompleteContent),
      description: "Comprehensive guide covering imperatives (commands), declaratives (statements), and modals (should/must/can) for healthcare and workplace communication.",
      isReleased: true,
    },
  });

  console.log('✅ Medical Instructions Complete guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
