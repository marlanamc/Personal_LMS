import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding all gerund/infinitive related activities...\n');

  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'gerund', mode: 'insensitive' } },
        { title: { contains: 'infinitive', mode: 'insensitive' } },
        { id: { contains: 'gerund' } },
        { id: { contains: 'infinitive' } },
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
    },
    orderBy: { title: 'asc' }
  });

  if (activities.length === 0) {
    console.log('No gerund/infinitive activities found.');
    return;
  }

  console.log(`Found ${activities.length} activities:\n`);
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
