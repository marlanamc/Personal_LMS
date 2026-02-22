import { PrismaClient } from '@prisma/client';
import { spanishPresentTenseContent } from '../src/content/spanish/guides/spanish-present-tense';
import { spanishPreteriteTenseContent } from '../src/content/spanish/guides/spanish-preterite-tense';
import { spanishSerVsEstarContent } from '../src/content/spanish/guides/spanish-ser-vs-estar';
import { spanishAdjectiveAgreementContent } from '../src/content/spanish/guides/spanish-adjective-agreement';
import { SPANISH_GUIDE_IDS } from '../src/content/spanish/registry';

const prisma = new PrismaClient();

const spanishGuides = [
  {
    id: 'spanish-present-tense-guide',
    title: 'Spanish Present Tense Guide',
    description: 'Interactive Spanish guide for present tense conjugation and common irregulars.',
    level: 'beginner',
    content: spanishPresentTenseContent,
  },
  {
    id: 'spanish-preterite-tense-guide',
    title: 'Spanish Preterite Tense Guide',
    description: 'Interactive Spanish guide for completed past actions in the preterite.',
    level: 'beginner',
    content: spanishPreteriteTenseContent,
  },
  {
    id: 'spanish-ser-vs-estar-guide',
    title: 'Spanish Ser vs Estar Guide',
    description: 'Interactive Spanish guide for choosing between ser and estar correctly.',
    level: 'beginner',
    content: spanishSerVsEstarContent,
  },
  {
    id: 'spanish-adjective-agreement-guide',
    title: 'Spanish Adjective Agreement Guide',
    description: 'Interactive Spanish guide for gender and number agreement in adjectives.',
    level: 'beginner',
    content: spanishAdjectiveAgreementContent,
  },
];

function validateGuideRegistryAlignment(ids: readonly string[]): void {
  const guideIds = spanishGuides.map((guide) => guide.id);
  const missingFromRegistry = guideIds.filter((id) => !ids.includes(id));
  const missingFromSeed = ids.filter((id) => !guideIds.includes(id));

  if (missingFromRegistry.length || missingFromSeed.length) {
    throw new Error(
      `Spanish guide registry mismatch.\n` +
      `Missing in registry: ${missingFromRegistry.join(', ') || 'none'}\n` +
      `Missing in seed: ${missingFromSeed.join(', ') || 'none'}`
    );
  }
}

async function main() {
  console.log('🇪🇸 Upserting Spanish personal guides...\n');
  validateGuideRegistryAlignment(SPANISH_GUIDE_IDS);

  for (const guide of spanishGuides) {
    await prisma.activity.upsert({
      where: { id: guide.id },
      update: {
        title: guide.title,
        description: guide.description,
        type: 'guide',
        category: 'personal',
        level: guide.level,
        content: JSON.stringify(guide.content),
        isReleased: true,
      },
      create: {
        id: guide.id,
        title: guide.title,
        description: guide.description,
        type: 'guide',
        category: 'personal',
        level: guide.level,
        content: JSON.stringify(guide.content),
        isReleased: true,
      },
    });

    console.log(`  ✅ ${guide.title}`);
  }

  console.log('\n✨ Spanish guides seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
