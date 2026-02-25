import { PrismaClient } from '@prisma/client';
import { spanishPresentTenseContent } from '../src/content/spanish/guides/spanish-present-tense';
import { spanishPreteriteTenseContent } from '../src/content/spanish/guides/spanish-preterite-tense';
import { spanishSerVsEstarContent } from '../src/content/spanish/guides/spanish-ser-vs-estar';
import { spanishAdjectiveAgreementContent } from '../src/content/spanish/guides/spanish-adjective-agreement';
import { spanishPresentProgressiveContent } from '../src/content/spanish/guides/spanish-present-progressive';
import { spanishObligationNecessityContent } from '../src/content/spanish/guides/spanish-obligation-necessity';
import { spanishRestaurantConversationsContent } from '../src/content/spanish/guides/spanish-restaurant-conversations';
import { spanishTravelConversationsContent } from '../src/content/spanish/guides/spanish-travel-conversations';
import { spanishAlphabetPronunciationContent } from '../src/content/spanish/guides/spanish-alphabet-pronunciation';
import { spanishNounGenderArticlesContent } from '../src/content/spanish/guides/spanish-noun-gender-articles';
import { spanishQuestionWordsSentencesContent } from '../src/content/spanish/guides/spanish-question-words-sentences';
import { spanishImmediateFutureContent } from '../src/content/spanish/guides/spanish-immediate-future';
import { spanishComparativesSuperlativesContent } from '../src/content/spanish/guides/spanish-comparatives-superlatives';
import { spanishCommandsPoliteRequestsContent } from '../src/content/spanish/guides/spanish-commands-polite-requests';
import { spanishObjectPronounsBasicsContent } from '../src/content/spanish/guides/spanish-object-pronouns-basics';
import { spanishReflexiveVerbsRoutinesContent } from '../src/content/spanish/guides/spanish-reflexive-verbs-routines';
import { spanishImperfectTenseContent } from '../src/content/spanish/guides/spanish-imperfect-tense';
import { spanishPresentPerfectB1Content } from '../src/content/spanish/guides/spanish-present-perfect-b1';
import { spanishConectoresArgumentacionB1Content } from '../src/content/spanish/guides/spanish-conectores-argumentacion-b1';
import { spanishSubjuntivoIntroB1Content } from '../src/content/spanish/guides/spanish-subjuntivo-intro-b1';
import { spanishB1IntegratedAssessmentContent } from '../src/content/spanish/guides/spanish-b1-integrated-assessment';
import { spanishSubjuntivoClausulasB2Content } from '../src/content/spanish/guides/spanish-subjuntivo-clausulas-b2';
import { spanishContrasteTiemposB2Content } from '../src/content/spanish/guides/spanish-contraste-tiempos-b2';
import { spanishPasivaImpersonalesB2Content } from '../src/content/spanish/guides/spanish-pasiva-impersonales-b2';
import { spanishB2IntegratedAssessmentContent } from '../src/content/spanish/guides/spanish-b2-integrated-assessment';
import { spanishRegisterControlC1Content } from '../src/content/spanish/guides/spanish-register-control-c1';
import { spanishConectoresPersuasionC1Content } from '../src/content/spanish/guides/spanish-conectores-persuasion-c1';
import { spanishC1ProductionLabContent } from '../src/content/spanish/guides/spanish-c1-production-lab';
import { spanishMaticesPragmaticosC2Content } from '../src/content/spanish/guides/spanish-matices-pragmaticos-c2';
import { spanishPrecisionLabC2Content } from '../src/content/spanish/guides/spanish-precision-lab-c2';
import { spanishC2CapstoneContent } from '../src/content/spanish/guides/spanish-c2-capstone';
import { spanishForEsolTeachersContent } from '../src/content/spanish/guides/spanish-for-esol-teachers';
import { SPANISH_GUIDE_IDS, SPANISH_GUIDE_META } from '../src/content/spanish/registry';

const prisma = new PrismaClient();

const contentByGuideId: Record<(typeof SPANISH_GUIDE_IDS)[number], unknown> = {
  'spanish-present-tense-guide': spanishPresentTenseContent,
  'spanish-alphabet-pronunciation-guide': spanishAlphabetPronunciationContent,
  'spanish-noun-gender-articles-guide': spanishNounGenderArticlesContent,
  'spanish-question-words-sentences-guide': spanishQuestionWordsSentencesContent,
  'spanish-preterite-tense-guide': spanishPreteriteTenseContent,
  'spanish-imperfect-tense-guide': spanishImperfectTenseContent,
  'spanish-immediate-future-guide': spanishImmediateFutureContent,
  'spanish-comparatives-superlatives-guide': spanishComparativesSuperlativesContent,
  'spanish-commands-polite-requests-guide': spanishCommandsPoliteRequestsContent,
  'spanish-obligation-necessity-guide': spanishObligationNecessityContent,
  'spanish-object-pronouns-basics-guide': spanishObjectPronounsBasicsContent,
  'spanish-reflexive-verbs-routines-guide': spanishReflexiveVerbsRoutinesContent,
  'spanish-ser-vs-estar-guide': spanishSerVsEstarContent,
  'spanish-adjective-agreement-guide': spanishAdjectiveAgreementContent,
  'spanish-present-progressive-guide': spanishPresentProgressiveContent,
  'spanish-restaurant-conversations-guide': spanishRestaurantConversationsContent,
  'spanish-travel-conversations-guide': spanishTravelConversationsContent,
  'spanish-present-perfect-b1-guide': spanishPresentPerfectB1Content,
  'spanish-conectores-argumentacion-b1-guide': spanishConectoresArgumentacionB1Content,
  'spanish-subjuntivo-intro-b1-guide': spanishSubjuntivoIntroB1Content,
  'spanish-b1-integrated-assessment-guide': spanishB1IntegratedAssessmentContent,
  'spanish-subjuntivo-clausulas-b2-guide': spanishSubjuntivoClausulasB2Content,
  'spanish-contraste-tiempos-b2-guide': spanishContrasteTiemposB2Content,
  'spanish-pasiva-impersonales-b2-guide': spanishPasivaImpersonalesB2Content,
  'spanish-b2-integrated-assessment-guide': spanishB2IntegratedAssessmentContent,
  'spanish-register-control-c1-guide': spanishRegisterControlC1Content,
  'spanish-conectores-persuasion-c1-guide': spanishConectoresPersuasionC1Content,
  'spanish-c1-production-lab-guide': spanishC1ProductionLabContent,
  'spanish-matices-pragmaticos-c2-guide': spanishMaticesPragmaticosC2Content,
  'spanish-precision-lab-c2-guide': spanishPrecisionLabC2Content,
  'spanish-c2-capstone-guide': spanishC2CapstoneContent,
  'spanish-for-esol-teachers-guide': spanishForEsolTeachersContent,
};

const spanishGuides = SPANISH_GUIDE_IDS.map((id) => {
  const meta = SPANISH_GUIDE_META[id];
  const title =
    meta.lessonNumber > 0
      ? `${meta.tier.charAt(0).toUpperCase() + meta.tier.slice(1)}: Lesson ${meta.lessonNumber} – ${meta.topic}`
      : meta.topic;
  return {
    id,
    title,
    description: meta.description,
    level: meta.tier,
    content: contentByGuideId[id],
  };
});

function validateGuideRegistryAlignment(ids: readonly (typeof SPANISH_GUIDE_IDS)[number][]): void {
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
