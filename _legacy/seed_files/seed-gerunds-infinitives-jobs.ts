import { PrismaClient } from '@prisma/client';
import { gerundsInfinitivesJobsContent } from '../src/content/grammar/gerunds-infinitives-jobs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gerunds & Infinitives: Jobs - Skills & Qualifications grammar guide...');

  await prisma.activity.upsert({
    where: { id: "gerunds-infinitives-jobs" },
    update: {
      content: JSON.stringify(gerundsInfinitivesJobsContent),
      title: "Gerunds & Infinitives: Jobs Guide",
      type: "guide",
      category: "grammar",
      description: "Master gerunds and infinitives for professional communication. Learn the essential patterns for resume writing, cover letters, interviews, and workplace discussions about skills and qualifications.",
    },
    create: {
      id: "gerunds-infinitives-jobs",
      title: "Gerunds & Infinitives: Jobs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(gerundsInfinitivesJobsContent),
      description: "Master gerunds and infinitives for professional communication. Learn the essential patterns for resume writing, cover letters, interviews, and workplace discussions about skills and qualifications.",
    },
  });

  console.log('✅ Gerunds & Infinitives: Jobs - Skills & Qualifications guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
