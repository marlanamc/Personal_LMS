import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'JS/TS' } },
        { title: { contains: 'Spanish Basics' } }
      ]
    },
    select: { id: true, title: true, category: true }
  });

  console.log('Activities found:');
  console.log(JSON.stringify(activities, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
