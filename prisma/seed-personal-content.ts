import { PrismaClient } from '@prisma/client';
import { codingJsTsContent } from '../src/content/personal/coding-js-ts';
import { spanishRefresherContent } from '../src/content/personal/spanish-refresher';

const prisma = new PrismaClient();

const personalActivities = [
  {
    id: 'coding-js-ts',
    title: 'Coding JS/TS Refresher',
    description: 'Quick personal refresher on JavaScript and TypeScript essentials.',
    level: 'beginner',
    content: codingJsTsContent,
  },
  {
    id: 'spanish-refresher',
    title: 'Spanish Basics Refresher',
    description: 'Personal Spanish practice with greetings and core present-tense verbs.',
    level: 'beginner',
    content: spanishRefresherContent,
  },
];

async function main() {
  console.log('🧠 Upserting personal activities...\n');

  for (const activity of personalActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'personal',
        level: activity.level,
        isReleased: true,
        content: JSON.stringify(activity.content),
      },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: 'guide',
        category: 'personal',
        level: activity.level,
        isReleased: true,
        content: JSON.stringify(activity.content),
      },
    });

    console.log(`  ✅ ${activity.title}`);
  }

  console.log('\n✨ Personal activities seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
