import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding -ed Pronunciation Game activity...');

  const canonicalTitle = '-ed Sounds Game';
  const canonicalData = {
    title: canonicalTitle,
    description: 'Master the three pronunciations of -ed endings: /t/, /d/, and /ɪd/',
    content: JSON.stringify({
      type: 'ed-pronunciation',
      mode: 'mixed',
      difficulty: 'mixed',
    }),
    type: 'game',
    ui: 'ed-pronunciation',
    category: 'pronunciation',
    level: 'beginner',
  };

  // Keep one canonical activity that exposes mode + difficulty in-game settings.
  const canonical = await prisma.activity.findFirst({
    where: { title: canonicalTitle },
  });

  const canonicalId = canonical
    ? (
      await prisma.activity.update({
        where: { id: canonical.id },
        data: canonicalData,
      })
    ).id
    : (
      await prisma.activity.create({
        data: canonicalData,
      })
    ).id;

  console.log(`${canonical ? 'Updated' : 'Created'} canonical activity: ${canonicalId}`);

  const legacyVariantCount = await prisma.activity.count({
    where: {
      ui: 'ed-pronunciation',
      NOT: { id: canonicalId },
    },
  });

  if (legacyVariantCount > 0) {
    console.log(`Found ${legacyVariantCount} legacy -ed variant(s). They are left untouched to preserve assignment/progress history.`);
    console.log('Activity lists now collapse these variants to one entry.');
  }

  console.log('\nDone! -ed pronunciation uses a single canonical activity with in-game settings.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
