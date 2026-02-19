import { PrismaClient } from '@prisma/client';
import { pastPerfectJobsContent } from '../src/content/grammar/past-perfect-jobs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Past Perfect: Jobs - Experience & Timelines grammar guide...');

  await prisma.activity.upsert({
    where: { id: "past-perfect" },
    update: {
      content: JSON.stringify(pastPerfectJobsContent),
      title: "Past Perfect: Jobs Guide",
      type: "guide",
      category: "grammar",
      description: "Learn to use past perfect tense to describe your work history, explain career transitions, and talk about training and certifications. Perfect for job interviews and professional conversations about experience timelines.",
    },
    create: {
      id: "past-perfect",
      title: "Past Perfect: Jobs Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(pastPerfectJobsContent),
      description: "Learn to use past perfect tense to describe your work history, explain career transitions, and talk about training and certifications. Perfect for job interviews and professional conversations about experience timelines.",
    },
  });

  console.log('✅ Past Perfect: Jobs - Experience & Timelines guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
