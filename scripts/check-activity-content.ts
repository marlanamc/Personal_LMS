import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activityIds = [
    'conditionals-second-third-jobs',
    'conditionals-zero-first-jobs',
    'gerunds-infinitives-jobs',
    'past-perfect-jobs'
  ];

  for (const id of activityIds) {
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
      }
    });

    if (activity) {
      console.log(`\n=== ${activity.title} ===`);
      console.log(`ID: ${activity.id}`);

      try {
        const content = JSON.parse(activity.content);
        console.log(`Content type: ${content.type}`);
        console.log(`Has sections: ${Array.isArray(content.sections)}`);
        console.log(`Number of sections: ${content.sections?.length || 0}`);
        if (content.sections?.length > 0) {
          console.log(`First section title: ${content.sections[0].title}`);
        }
      } catch (e) {
        console.log('Failed to parse content:', e);
      }
    } else {
      console.log(`\nActivity ${id} not found`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
