import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Listing all conditional-related activities...\n');

  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { title: { contains: 'conditional', mode: 'insensitive' } },
        { id: { contains: 'conditional' } },
      ]
    },
    select: {
      id: true,
      title: true,
      type: true,
      category: true,
      isReleased: true,
    },
    orderBy: { title: 'asc' }
  });

  if (activities.length === 0) {
    console.log('No conditional activities found.');
    return;
  }

  console.log(`Found ${activities.length} conditional activities:\n`);
  activities.forEach(activity => {
    const releaseStatus = activity.isReleased ? '✅' : '🔒';
    console.log(`${releaseStatus} ${activity.title}`);
    console.log(`   ID: ${activity.id}`);
    console.log(`   Type: ${activity.type} | Category: ${activity.category}\n`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
