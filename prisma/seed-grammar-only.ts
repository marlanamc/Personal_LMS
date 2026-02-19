import { PrismaClient } from '@prisma/client';
import { presentSimpleContent } from '../src/content/grammar/present-simple';
import { pastSimpleContent } from '../src/content/grammar/past-simple';
import { futureSimpleContent } from '../src/content/grammar/future-simple';
import { presentContinuousContent } from '../src/content/grammar/present-continuous';
import { pastContinuousContent } from '../src/content/grammar/past-continuous';
import { futureContinuousContent } from '../src/content/grammar/future-continuous';
import { presentPerfectContent } from '../src/content/grammar/present-perfect';
import { pastPerfectContent } from '../src/content/grammar/past-perfect';
import { futurePerfectContent } from '../src/content/grammar/future-perfect';
import { presentPerfectFamilyContent } from '../src/content/grammar/present-perfect-family';
import { pastPerfectFamilyContent } from '../src/content/grammar/past-perfect-family';
import { futurePerfectFamilyContent } from '../src/content/grammar/future-perfect-family';
import { presentPerfectContinuousContent } from '../src/content/grammar/present-perfect-continuous';
import { pastPerfectContinuousContent } from '../src/content/grammar/past-perfect-continuous';
import { futurePerfectContinuousContent } from '../src/content/grammar/future-perfect-continuous';
import { simpleTensesReviewContent } from '../src/content/grammar/simple-tenses-review';
import { continuousTensesReviewContent } from '../src/content/grammar/continuous-tenses-review';
import { perfectTensesReviewContent } from '../src/content/grammar/perfect-tenses-review';
import { perfectContinuousTensesReviewContent } from '../src/content/grammar/perfect-continuous-tenses-review';
import { cycleOneReviewContent } from '../src/content/grammar/cycle-1-review';
import { conditionalsZeroFirstContent } from '../src/content/grammar/conditionals-zero-first';
import { gerundsInfinitivesContent } from '../src/content/grammar/gerunds-infinitives';

const prisma = new PrismaClient();

// Grammar guides with stable IDs for safe upserts
const grammarGuides = [
  // Simple Tenses
  {
    id: 'present-simple-guide',
    title: 'Present Simple Guide',
    description: 'Learn Present Simple tense with step-by-step lessons covering meaning, usage, positive/negative/question forms, time expressions, and interactive exercises.',
    level: 'beginner',
    content: presentSimpleContent,
  },
  {
    id: 'past-simple-guide',
    title: 'Past Simple Guide',
    description: 'Master Past Simple tense including regular and irregular verbs, positive/negative/question forms, and time expressions with interactive practice.',
    level: 'beginner',
    content: pastSimpleContent,
  },
  {
    id: 'future-simple-guide',
    title: 'Future Simple Guide',
    description: 'Learn Future Simple (will) for predictions, promises, and spontaneous decisions with clear examples and interactive exercises.',
    level: 'beginner',
    content: futureSimpleContent,
  },
  // Continuous Tenses
  {
    id: 'present-continuous-guide',
    title: 'Present Continuous Guide',
    description: 'Learn Present Continuous for actions happening now and temporary situations with step-by-step lessons and practice exercises.',
    level: 'beginner',
    content: presentContinuousContent,
  },
  {
    id: 'past-continuous-guide',
    title: 'Past Continuous Guide',
    description: 'Master Past Continuous for actions in progress in the past and interrupted actions with interactive exercises.',
    level: 'intermediate',
    content: pastContinuousContent,
  },
  {
    id: 'future-continuous-guide',
    title: 'Future Continuous Guide',
    description: 'Learn Future Continuous for actions that will be in progress at specific future times with clear examples and practice.',
    level: 'intermediate',
    content: futureContinuousContent,
  },
  // Perfect Tenses
  {
    id: 'present-perfect-guide',
    title: 'Present Perfect Guide',
    description: 'Master Present Perfect for life experiences, recent actions, and unfinished time periods with clear explanations and practice.',
    level: 'intermediate',
    content: presentPerfectContent,
  },
  {
    id: 'past-perfect-guide',
    title: 'Past Perfect Guide',
    description: 'Master past perfect tense to describe two past actions and show which happened first. Learn the "time machine" for understanding sequences of events in the past, with real-world examples from housing, travel, and everyday life.',
    level: 'intermediate',
    content: pastPerfectContent,
  },
  {
    id: 'future-perfect-guide',
    title: 'Future Perfect Guide',
    description: 'Master Future Perfect for talking about deadlines, milestones, and goals. Learn to express what will be completed by a future point, plan career trajectories, and answer interview questions with confidence.',
    level: 'intermediate',
    content: futurePerfectContent,
  },
  // Perfect Family Guides
  {
    id: 'present-perfect-family-guide',
    title: 'Present Perfect Family Guide',
    description: 'Streamlined duo guide comparing Present Perfect Simple and Continuous for result vs duration thinking with focused practice.',
    level: 'intermediate',
    content: presentPerfectFamilyContent,
  },
  {
    id: 'past-perfect-family-guide',
    title: 'Past Perfect Family Guide',
    description: 'Short guide that pairs Past Perfect Simple and Continuous to show which action came first and how long it had been happening.',
    level: 'intermediate',
    content: pastPerfectFamilyContent,
  },
  {
    id: 'future-perfect-family-guide',
    title: 'Future Perfect Family Guide',
    description: 'Guided contrast of Future Perfect Simple and Continuous to highlight future results versus duration before future moments.',
    level: 'intermediate',
    content: futurePerfectFamilyContent,
  },
  // Perfect Continuous Tenses
  {
    id: 'present-perfect-continuous-guide',
    title: 'Present Perfect Continuous Guide',
    description: 'Learn Present Perfect Continuous for emphasizing duration of ongoing actions up to now.',
    level: 'intermediate',
    content: presentPerfectContinuousContent,
  },
  {
    id: 'past-perfect-continuous-guide',
    title: 'Past Perfect Continuous Guide',
    description: 'Master Past Perfect Continuous for showing duration of actions before another past event.',
    level: 'advanced',
    content: pastPerfectContinuousContent,
  },
  {
    id: 'future-perfect-continuous-guide',
    title: 'Future Perfect Continuous Guide',
    description: 'Learn Future Perfect Continuous for duration of actions up to a future point (milestones and anniversaries).',
    level: 'advanced',
    content: futurePerfectContinuousContent,
  },
  // Review Guides
  {
    id: 'simple-tenses-review',
    title: 'Simple Tenses Review',
    description: 'Comprehensive review of Present Simple, Past Simple, and Future Simple tenses with comparison exercises.',
    level: 'beginner',
    content: simpleTensesReviewContent,
  },
  {
    id: 'continuous-tenses-review',
    title: 'Continuous Tenses Review',
    description: 'Comprehensive review of Present Continuous, Past Continuous, and Future Continuous tenses with comparison exercises.',
    level: 'intermediate',
    content: continuousTensesReviewContent,
  },
  {
    id: 'perfect-tenses-review',
    title: 'Perfect Tenses Review',
    description: 'Comprehensive review of Present Perfect, Past Perfect, and Future Perfect with commonly confused tense comparisons.',
    level: 'intermediate',
    content: perfectTensesReviewContent,
  },
  {
    id: 'perfect-continuous-tenses-review',
    title: 'Perfect Continuous Tenses Review',
    description: 'Comprehensive review of all Perfect Continuous tenses with duration focus and common mistakes.',
    level: 'advanced',
    content: perfectContinuousTensesReviewContent,
  },
  {
    id: 'cycle-1-review',
    title: 'Cycle 1 Review',
    description: 'A gentle flow through Cycle 1 grammar: simple, continuous, parts of speech, frequency, comparatives, and connectors with a final mini-quiz.',
    level: 'beginner',
    content: cycleOneReviewContent,
  },
  // Conditionals & Gerunds/Infinitives
  {
    id: 'conditionals-zero-first',
    title: 'Zero & First Conditionals Guide',
    description: 'Master zero conditional for universal truths and facts, and first conditional for real future plans and possibilities.',
    level: 'intermediate',
    content: conditionalsZeroFirstContent,
  },
  {
    id: 'gerunds-infinitives',
    title: 'Gerunds & Infinitives Guide',
    description: 'Master the 6 essential patterns for using gerunds (-ing) and infinitives (to + verb). Pattern-based approach makes this complex grammar simple and memorable.',
    level: 'intermediate',
    content: gerundsInfinitivesContent,
  },
];

async function main() {
  console.log('📚 Upserting grammar guides (student progress preserved)...\n');

  let updated = 0;
  let created = 0;

  for (const guide of grammarGuides) {
    const existing = await prisma.activity.findUnique({ where: { id: guide.id } });
    
    await prisma.activity.upsert({
      where: { id: guide.id },
      update: {
        title: guide.title,
        description: guide.description,
        type: 'guide',
        category: 'grammar',
        level: guide.level,
        content: JSON.stringify(guide.content),
      },
      create: {
        id: guide.id,
        title: guide.title,
        description: guide.description,
        type: 'guide',
        category: 'grammar',
        level: guide.level,
        content: JSON.stringify(guide.content),
      },
    });

    if (existing) {
      updated++;
      console.log(`  ✏️  Updated: ${guide.title}`);
    } else {
      created++;
      console.log(`  ✅ Created: ${guide.title}`);
    }
  }

  console.log('\n✨ Grammar guides seeded successfully!');
  console.log(`   Created: ${created} | Updated: ${updated}`);
  console.log('\n💡 Student progress (ActivityProgress, Submissions) was preserved.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
