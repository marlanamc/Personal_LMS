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
    id: 'spanish-comparatives-superlatives-guide',
    title: 'Spanish Comparatives & Superlatives Guide',
    description: 'A2 guide for más/menos/tan comparisons and el/la/los/las más superlatives.',
    level: 'A2',
    content: spanishComparativesSuperlativesContent,
  },
  {
    id: 'spanish-commands-polite-requests-guide',
    title: 'Spanish Commands & Polite Requests Guide',
    description: 'A2 guide for tú/usted commands and polite instruction language.',
    level: 'A2',
    content: spanishCommandsPoliteRequestsContent,
  },
  {
    id: 'spanish-object-pronouns-basics-guide',
    title: 'Spanish Object Pronouns Basics Guide',
    description: 'A2 guide for direct and indirect object pronouns in practical communication.',
    level: 'A2',
    content: spanishObjectPronounsBasicsContent,
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
  {
    id: 'spanish-present-perfect-b1-guide',
    title: 'Presente Perfecto en Español (B1)',
    description: 'B1 guide for present perfect form, usage, and contrast with preterite.',
    level: 'B1',
    content: spanishPresentPerfectB1Content,
  },
  {
    id: 'spanish-conectores-argumentacion-b1-guide',
    title: 'Conectores Discursivos y Argumentación Breve (B1)',
    description: 'B1 guide for connectors and short-form argument organization.',
    level: 'B1',
    content: spanishConectoresArgumentacionB1Content,
  },
  {
    id: 'spanish-subjuntivo-intro-b1-guide',
    title: 'Subjuntivo Presente: Introducción (B1)',
    description: 'B1 guide for present subjunctive triggers, form, and controlled production.',
    level: 'B1',
    content: spanishSubjuntivoIntroB1Content,
  },
  {
    id: 'spanish-b1-integrated-assessment-guide',
    title: 'Evaluación Integrada B1',
    description: 'B1 integrated assessment pack with reading, writing, and mini project tasks.',
    level: 'B1',
    content: spanishB1IntegratedAssessmentContent,
  },
  {
    id: 'spanish-subjuntivo-clausulas-b2-guide',
    title: 'Subjuntivo en Cláusulas Sustantivas y Adjetivas (B2)',
    description: 'B2 guide for advanced subjunctive control in noun and adjective clauses.',
    level: 'B2',
    content: spanishSubjuntivoClausulasB2Content,
  },
  {
    id: 'spanish-contraste-tiempos-b2-guide',
    title: 'Contraste Fino de Tiempos y Modos (B2)',
    description: 'B2 guide for tense/mood contrast in academic and workplace discourse.',
    level: 'B2',
    content: spanishContrasteTiemposB2Content,
  },
  {
    id: 'spanish-pasiva-impersonales-b2-guide',
    title: 'Voz Pasiva e Impersonales con Se (B2)',
    description: 'B2 guide for passive voice and impersonal se in formal registers.',
    level: 'B2',
    content: spanishPasivaImpersonalesB2Content,
  },
  {
    id: 'spanish-b2-integrated-assessment-guide',
    title: 'Evaluación Integrada B2',
    description: 'B2 integrated assessment with reading, audio synthesis, and argument response.',
    level: 'B2',
    content: spanishB2IntegratedAssessmentContent,
  },
  {
    id: 'spanish-register-control-c1-guide',
    title: 'Control de Registro y Reescritura (C1)',
    description: 'C1 guide for formal, semiformal, and close-register control with rewriting tasks.',
    level: 'C1',
    content: spanishRegisterControlC1Content,
  },
  {
    id: 'spanish-conectores-persuasion-c1-guide',
    title: 'Conectores Avanzados y Discurso Persuasivo (C1)',
    description: 'C1 guide for advanced connectors and persuasive discourse organization.',
    level: 'C1',
    content: spanishConectoresPersuasionC1Content,
  },
  {
    id: 'spanish-c1-production-lab-guide',
    title: 'Laboratorio de Producción C1',
    description: 'C1 production lab for essay drafting and rubric-based revision.',
    level: 'C1',
    content: spanishC1ProductionLabContent,
  },
  {
    id: 'spanish-matices-pragmaticos-c2-guide',
    title: 'Matices Pragmáticos e Intención (C2)',
    description: 'C2 guide for pragmatic nuance, tone control, and implicature handling.',
    level: 'C2',
    content: spanishMaticesPragmaticosC2Content,
  },
  {
    id: 'spanish-precision-lab-c2-guide',
    title: 'Precision Lab C2',
    description: 'C2 lab for subtle error correction and high-precision reformulation.',
    level: 'C2',
    content: spanishPrecisionLabC2Content,
  },
  {
    id: 'spanish-c2-capstone-guide',
    title: 'Capstone Integrado C2',
    description: 'C2 integrated capstone for professional/academic simulation tasks.',
    level: 'C2',
    content: spanishC2CapstoneContent,
  },
  {
    id: 'spanish-for-esol-teachers-guide',
    title: 'Learning Spanish for ESOL Teachers',
    description: 'C1 guide with contrastive strategies for ESOL teachers building advanced Spanish proficiency.',
    level: 'C1',
    content: spanishForEsolTeachersContent,
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
