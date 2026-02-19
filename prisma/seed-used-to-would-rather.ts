import { PrismaClient } from '@prisma/client';
import { usedToWouldRatherContent } from '../src/content/grammar/used-to-would-rather';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Used To & Would Rather grammar guide...');

  await prisma.activity.upsert({
    where: { id: "used-to-would-rather" },
    update: {
      content: JSON.stringify(usedToWouldRatherContent),
      title: "Used To & Would Rather Guide",
      type: "guide",
      category: "grammar",
      description: "Master past habits with 'used to' and 'would', and express preferences with 'would rather'. Perfect for health and work discussions.",
    },
    create: {
      id: "used-to-would-rather",
      title: "Used To & Would Rather Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(usedToWouldRatherContent),
      description: "Master past habits with 'used to' and 'would', and express preferences with 'would rather'. Perfect for health and work discussions.",
    },
  });

  console.log('✅ Used To & Would Rather guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
