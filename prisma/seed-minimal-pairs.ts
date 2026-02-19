import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Minimal Pairs Listening activity...');

  const title = 'Minimal Pairs Listening Lab';
  const existing = await prisma.activity.findFirst({
    where: { title },
  });

  const data = {
    title,
    description: 'Train listening for high-impact minimal pairs (sit/seat, ship/sheep, b/v, r/l, sh/ch).',
    content: JSON.stringify({
      type: 'minimal-pairs',
      contrastId: 'mixed',
      difficulty: 'mixed',
      roundSize: 12,
    }),
    type: 'game',
    ui: 'minimal-pairs',
    category: 'pronunciation',
    level: 'beginner',
  };

  if (existing) {
    const updated = await prisma.activity.update({
      where: { id: existing.id },
      data,
    });
    console.log(`Updated activity: ${updated.id}`);
  } else {
    const created = await prisma.activity.create({ data });
    console.log(`Created activity: ${created.id}`);
  }

  console.log('Done! Minimal Pairs Listening activity is ready.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
