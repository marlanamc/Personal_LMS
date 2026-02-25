import { PrismaClient } from '@prisma/client';
import { spanishPresentTenseContent } from '../src/content/spanish/guides/spanish-present-tense';
import { spanishPreteriteTenseContent } from '../src/content/spanish/guides/spanish-preterite-tense';
import { spanishSerVsEstarContent } from '../src/content/spanish/guides/spanish-ser-vs-estar';
import { spanishAdjectiveAgreementContent } from '../src/content/spanish/guides/spanish-adjective-agreement';
import { spanishRestaurantConversationsContent } from '../src/content/spanish/guides/spanish-restaurant-conversations';
import { spanishAlphabetPronunciationContent } from '../src/content/spanish/guides/spanish-alphabet-pronunciation';
import { spanishNounGenderArticlesContent } from '../src/content/spanish/guides/spanish-noun-gender-articles';
import { spanishQuestionWordsSentencesContent } from '../src/content/spanish/guides/spanish-question-words-sentences';
import { spanishImmediateFutureContent } from '../src/content/spanish/guides/spanish-immediate-future';
import { spanishReflexiveVerbsRoutinesContent } from '../src/content/spanish/guides/spanish-reflexive-verbs-routines';
import { spanishImperfectTenseContent } from '../src/content/spanish/guides/spanish-imperfect-tense';
import { SPANISH_GUIDE_IDS } from '../src/content/spanish/registry';

const prisma = new PrismaClient();

const spanishGuides = [
  {
    id: 'spanish-present-tense-guide',
    title: 'Spanish Present Tense Guide',
    description: 'A1 guide for present tense conjugation and common irregulars.',
    level: 'A1',
    content: spanishPresentTenseContent,
  },
  {
    id: 'spanish-alphabet-pronunciation-guide',
    title: 'Spanish Alphabet & Pronunciation Guide',
    description: 'A1 guide for core sounds, stress, and accent mark basics.',
    level: 'A1',
    content: spanishAlphabetPronunciationContent,
  },
  {
    id: 'spanish-noun-gender-articles-guide',
    title: 'Spanish Noun Gender & Articles Guide',
    description: 'A1 guide for el/la/los/las, un/una, and adjective agreement.',
    level: 'A1',
    content: spanishNounGenderArticlesContent,
  },
  {
    id: 'spanish-question-words-sentences-guide',
    title: 'Spanish Question Words & Basic Sentences',
    description: 'A1-A2 guide for asking questions and building simple conversational patterns.',
    level: 'A1-A2',
    content: spanishQuestionWordsSentencesContent,
  },
  {
    id: 'spanish-preterite-tense-guide',
    title: 'Spanish Preterite Tense Guide',
    description: 'A2 guide for completed past actions in the preterite.',
    level: 'A2',
    content: spanishPreteriteTenseContent,
  },
  {
    id: 'spanish-imperfect-tense-guide',
    title: 'Spanish Imperfect Tense Guide',
    description: 'A2 guide for past habits, background, and imperfect vs preterite contrast.',
    level: 'A2',
    content: spanishImperfectTenseContent,
  },
  {
    id: 'spanish-immediate-future-guide',
    title: 'Spanish Immediate Future Guide',
    description: 'A2 guide for ir + a + infinitive and planning language.',
    level: 'A2',
    content: spanishImmediateFutureContent,
  },
  {
    id: 'spanish-reflexive-verbs-routines-guide',
    title: 'Spanish Reflexive Verbs for Routines',
    description: 'A2 guide for daily routine verbs and reflexive pronouns.',
    level: 'A2',
    content: spanishReflexiveVerbsRoutinesContent,
  },
  {
    id: 'spanish-ser-vs-estar-guide',
    title: 'Spanish Ser vs Estar Guide',
    description: 'A1-A2 guide for choosing between ser and estar correctly.',
    level: 'A1-A2',
    content: spanishSerVsEstarContent,
  },
  {
    id: 'spanish-adjective-agreement-guide',
    title: 'Spanish Adjective Agreement Guide',
    description: 'A1 guide for gender and number agreement in adjectives.',
    level: 'A1',
    content: spanishAdjectiveAgreementContent,
  },
  {
    id: 'spanish-restaurant-conversations-guide',
    title: 'Restaurant Conversations in Spanish',
    description: 'A2 guide for ordering food, asking follow-up questions, and handling restaurant interactions.',
    level: 'A2',
    content: spanishRestaurantConversationsContent,
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
