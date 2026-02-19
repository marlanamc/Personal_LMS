import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assignments = await prisma.assignment.findMany({
    where: {
      OR: [
        { title: { contains: 'Spanish' } },
        { title: { contains: 'JS' } }
      ]
    },
    include: {
      activity: true
    }
  });

  console.log('Assignments found:');
  console.log(JSON.stringify(assignments.map(a => ({
    id: a.id,
    title: a.title,
    activityId: a.activityId,
    activityTitle: a.activity.title,
    activityCategory: a.activity.category
  })), null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
