const { PrismaClient } = require('@prisma/client');

// Temporarily override the provider to read from SQLite
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

async function main() {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        type: { in: ['quiz', 'worksheet'] }
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        category: true,
        level: true,
        content: true,
        createdBy: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(JSON.stringify(activities, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
