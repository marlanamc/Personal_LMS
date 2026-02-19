import { PrismaClient } from '@prisma/client';
import { passiveVoiceContent } from '../src/content/grammar/passive-voice';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Passive Voice grammar guide...');

  await prisma.activity.upsert({
    where: { id: "passive-voice" },
    update: {
      content: JSON.stringify(passiveVoiceContent),
      title: "Passive Voice Guide",
      type: "guide",
      category: "grammar",
      description: "Master passive voice for understanding medical instructions, clinic procedures, and formal communication.",
    },
    create: {
      id: "passive-voice",
      title: "Passive Voice Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(passiveVoiceContent),
      description: "Master passive voice for understanding medical instructions, clinic procedures, and formal communication.",
    },
  });

  console.log('✅ Passive Voice guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
