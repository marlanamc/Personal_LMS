
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const activity = await prisma.activity.findUnique({
    where: { id: 'vocab-feb-3-5-matching' }
  });
  console.log(JSON.stringify(activity, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
