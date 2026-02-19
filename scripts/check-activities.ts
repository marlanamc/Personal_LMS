import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'Conditionals' } },
        { title: { contains: 'Gerunds' } },
        { title: { contains: 'Past Perfect' } },
      ]
    },
    select: {
      id: true,
      title: true,
      type: true,
      isReleased: true,
    },
    orderBy: {
      title: 'asc'
    }
  });

  console.log('\n=== Activities in Database ===\n');
  activities.forEach(a => {
    console.log(`- ${a.title}`);
    console.log(`  ID: ${a.id}`);
    console.log(`  Type: ${a.type}, Released: ${a.isReleased}\n`);
  });
  console.log(`Total: ${activities.length} activities\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
