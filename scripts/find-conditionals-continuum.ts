import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding Conditionals Continuum Guide...\n');

  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'Conditionals Continuum', mode: 'insensitive' } },
        { title: { contains: 'continuum', mode: 'insensitive' } },
        { id: { contains: 'continuum' } },
      ]
    },
    select: {
      id: true,
      title: true,
      type: true,
      category: true,
      isReleased: true,
      _count: {
        select: {
          submissions: true,
          assignments: true
        }
      }
    }
  });

  if (activities.length === 0) {
    console.log('No Conditionals Continuum activities found.');
    return;
  }

  console.log(`Found ${activities.length} activity/activities:\n`);
  activities.forEach(activity => {
    console.log(`ID: ${activity.id}`);
    console.log(`Title: ${activity.title}`);
    console.log(`Type: ${activity.type} | Category: ${activity.category}`);
    console.log(`Released: ${activity.isReleased}`);
    console.log(`Submissions: ${activity._count.submissions} | Assignments: ${activity._count.assignments}`);
    console.log('---');
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
