import { PrismaClient } from '@prisma/client';
import { reportedSpeechContent } from '../src/content/grammar/reported-speech';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Reported Speech grammar guide...');

  await prisma.activity.upsert({
    where: { id: "reported-speech" },
    update: {
      content: JSON.stringify(reportedSpeechContent),
      title: "Reported Speech Guide",
      type: "guide",
      category: "grammar",
      description: "Master reported speech for communicating messages from MyChart, phone calls, and medical appointments. Learn say vs tell and tense backshifting.",
    },
    create: {
      id: "reported-speech",
      title: "Reported Speech Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(reportedSpeechContent),
      description: "Master reported speech for communicating messages from MyChart, phone calls, and medical appointments. Learn say vs tell and tense backshifting.",
    },
  });

  console.log('✅ Reported Speech guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
