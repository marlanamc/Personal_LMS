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

async function main() {
  console.log('🧹 Cleaning up existing activities...');

  // Delete all existing activities
  await prisma.activity.deleteMany({});
  console.log('✅ Removed all existing activities');

  console.log('\n📚 Adding Simple Tense Guides...');

  // Present Simple
  const presentSimple = await prisma.activity.create({
    data: {
      title: 'Present Simple Guide',
      description: 'Learn Present Simple tense with step-by-step lessons covering meaning, usage, positive/negative/question forms, time expressions, and interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(presentSimpleContent)
    }
  });
  console.log('✅ Added:', presentSimple.title);

  // Past Simple
  const pastSimple = await prisma.activity.create({
    data: {
      title: 'Past Simple Guide',
      description: 'Master Past Simple tense including regular and irregular verbs, positive/negative/question forms, and time expressions with interactive practice.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(pastSimpleContent)
    }
  });
  console.log('✅ Added:', pastSimple.title);

  // Future Simple
  const futureSimple = await prisma.activity.create({
    data: {
      title: 'Future Simple Guide',
      description: 'Learn Future Simple (will) for predictions, promises, and spontaneous decisions with clear examples and interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(futureSimpleContent)
    }
  });
  console.log('✅ Added:', futureSimple.title);

  console.log('\n📚 Adding Continuous Tense Guides...');

  // Present Continuous
  const presentContinuous = await prisma.activity.create({
    data: {
      title: 'Present Continuous Guide',
      description: 'Learn Present Continuous for actions happening now and temporary situations with step-by-step lessons and practice exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(presentContinuousContent)
    }
  });
  console.log('✅ Added:', presentContinuous.title);

  // Past Continuous
  const pastContinuous = await prisma.activity.create({
    data: {
      title: 'Past Continuous Guide',
      description: 'Master Past Continuous for actions in progress in the past and interrupted actions with interactive exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(pastContinuousContent)
    }
  });
  console.log('✅ Added:', pastContinuous.title);

  // Future Continuous
  const futureContinuous = await prisma.activity.create({
    data: {
      title: 'Future Continuous Guide',
      description: 'Learn Future Continuous for actions that will be in progress at specific future times with clear examples and practice.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(futureContinuousContent)
    }
  });
  console.log('✅ Added:', futureContinuous.title);

  console.log('\n📚 Adding Perfect Tenses...');

  // Present Perfect
  const presentPerfect = await prisma.activity.create({
    data: {
      title: 'Present Perfect Guide',
      description: 'Master Present Perfect for life experiences, recent actions, and unfinished time periods with clear explanations and practice.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(presentPerfectContent)
    }
  });
  console.log('✅ Added:', presentPerfect.title);

  // Past Perfect
  const pastPerfect = await prisma.activity.create({
    data: {
      title: 'Past Perfect Guide',
      description: 'Master past perfect tense to describe two past actions and show which happened first. Learn the "time machine" for understanding sequences of events in the past, with real-world examples from housing, travel, and everyday life.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(pastPerfectContent)
    }
  });
  console.log('✅ Added:', pastPerfect.title);

  // Future Perfect
  const futurePerfect = await prisma.activity.create({
    data: {
      title: 'Future Perfect Guide',
      description: 'Master Future Perfect for talking about deadlines, milestones, and goals. Learn to express what will be completed by a future point, plan career trajectories, and answer interview questions with confidence. Essential for discussing accomplishments and setting professional goals.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(futurePerfectContent)
    }
  });
  console.log('✅ Added:', futurePerfect.title);

  console.log('\n📚 Adding Perfect Family Guides...');

  const presentPerfectFamily = await prisma.activity.create({
    data: {
      title: 'Present Perfect Family Guide',
      description: 'Streamlined duo guide comparing Present Perfect Simple and Continuous for result vs duration thinking with focused practice.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(presentPerfectFamilyContent)
    }
  });
  console.log('✅ Added:', presentPerfectFamily.title);

  const pastPerfectFamily = await prisma.activity.create({
    data: {
      title: 'Past Perfect Family Guide',
      description: 'Short guide that pairs Past Perfect Simple and Continuous to show which action came first and how long it had been happening.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(pastPerfectFamilyContent)
    }
  });
  console.log('✅ Added:', pastPerfectFamily.title);

  const futurePerfectFamily = await prisma.activity.create({
    data: {
      title: 'Future Perfect Family Guide',
      description: 'Guided contrast of Future Perfect Simple and Continuous to highlight future results versus duration before future moments.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(futurePerfectFamilyContent)
    }
  });
  console.log('✅ Added:', futurePerfectFamily.title);

  console.log('\n📚 Adding Perfect Continuous Tenses...');

  // Present Perfect Continuous
  const presentPerfectContinuous = await prisma.activity.create({
    data: {
      title: 'Present Perfect Continuous Guide',
      description: 'Learn Present Perfect Continuous for emphasizing duration of ongoing actions up to now.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(presentPerfectContinuousContent)
    }
  });
  console.log('✅ Added:', presentPerfectContinuous.title);

  // Past Perfect Continuous
  const pastPerfectContinuous = await prisma.activity.create({
    data: {
      title: 'Past Perfect Continuous Guide',
      description: 'Master Past Perfect Continuous for showing duration of actions before another past event.',
      type: 'guide',
      category: 'grammar',
      level: 'advanced',
      content: JSON.stringify(pastPerfectContinuousContent)
    }
  });
  console.log('✅ Added:', pastPerfectContinuous.title);

  // Future Perfect Continuous
  const futurePerfectContinuous = await prisma.activity.create({
    data: {
      title: 'Future Perfect Continuous Guide',
      description: 'Learn Future Perfect Continuous for duration of actions up to a future point (milestones and anniversaries).',
      type: 'guide',
      category: 'grammar',
      level: 'advanced',
      content: JSON.stringify(futurePerfectContinuousContent)
    }
  });
  console.log('✅ Added:', futurePerfectContinuous.title);

  console.log('\n📚 Adding Review Guides...');

  // Simple Tenses Review
  const simpleTensesReview = await prisma.activity.create({
    data: {
      title: 'Simple Tenses Review',
      description: 'Comprehensive review of Present Simple, Past Simple, and Future Simple tenses with comparison exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(simpleTensesReviewContent)
    }
  });
  console.log('✅ Added:', simpleTensesReview.title);

  // Continuous Tenses Review
  const continuousTensesReview = await prisma.activity.create({
    data: {
      title: 'Continuous Tenses Review',
      description: 'Comprehensive review of Present Continuous, Past Continuous, and Future Continuous tenses with comparison exercises.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(continuousTensesReviewContent)
    }
  });
  console.log('✅ Added:', continuousTensesReview.title);

  // Perfect Tenses Review
  const perfectTensesReview = await prisma.activity.create({
    data: {
      title: 'Perfect Tenses Review',
      description: 'Comprehensive review of Present Perfect, Past Perfect, and Future Perfect with commonly confused tense comparisons.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(perfectTensesReviewContent)
    }
  });
  console.log('✅ Added:', perfectTensesReview.title);

  // Perfect Continuous Tenses Review
  const perfectContinuousTensesReview = await prisma.activity.create({
    data: {
      title: 'Perfect Continuous Tenses Review',
      description: 'Comprehensive review of all Perfect Continuous tenses with duration focus and common mistakes.',
      type: 'guide',
      category: 'grammar',
      level: 'advanced',
      content: JSON.stringify(perfectContinuousTensesReviewContent)
    }
  });
  console.log('✅ Added:', perfectContinuousTensesReview.title);

  // Cycle 1 Review
  const cycleOneReview = await prisma.activity.create({
    data: {
      title: 'Cycle 1 Review',
      description: 'A gentle flow through Cycle 1 grammar: simple, continuous, parts of speech, frequency, comparatives, and connectors with a final mini-quiz.',
      type: 'guide',
      category: 'grammar',
      level: 'beginner',
      content: JSON.stringify(cycleOneReviewContent)
    }
  });
  console.log('✅ Added:', cycleOneReview.title);

  console.log('\n🎯 Adding Conditionals & Gerunds/Infinitives...');

  // Zero & First Conditionals
  const conditionalsZeroFirst = await prisma.activity.create({
    data: {
      id: 'conditionals-zero-first',
      title: 'Zero & First Conditionals Guide',
      description: 'Master zero conditional for universal truths and facts, and first conditional for real future plans and possibilities. Learn to express cause-and-effect relationships and discuss realistic future scenarios in everyday life.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(conditionalsZeroFirstContent)
    }
  });
  console.log('✅ Added:', conditionalsZeroFirst.title);

  // Gerunds & Infinitives
  const gerundsInfinitives = await prisma.activity.create({
    data: {
      id: 'gerunds-infinitives',
      title: 'Gerunds & Infinitives Guide',
      description: 'Master the 6 essential patterns for using gerunds (-ing) and infinitives (to + verb). Learn when verbs become nouns, the critical "preposition + gerund" rule, and how to avoid common mistakes. Pattern-based approach makes this complex grammar simple and memorable.',
      type: 'guide',
      category: 'grammar',
      level: 'intermediate',
      content: JSON.stringify(gerundsInfinitivesContent)
    }
  });
  console.log('✅ Added:', gerundsInfinitives.title);

  console.log('\n🎮 Adding Games...');

  // Numbers Game
  const numbersGameContent = JSON.stringify({
    type: 'numbers-game',
    category: 'Basic Numbers (0-99)'
  });

  const numbersGame = await prisma.activity.create({
    data: {
      id: 'numbers-game',
      title: 'Numbers to English Words',
      description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
      category: 'numbers',
      type: 'game',
      level: 'beginner',
      content: numbersGameContent,
    }
  });
  console.log('✅ Added:', numbersGame.title);

  console.log('\n✨ Dashboard updated successfully!');
  console.log(`\nAdded ${21} grammar guides:`);
  console.log('  - 3 Simple tenses (Present, Past, Future)');
  console.log('  - 3 Continuous tenses (Present, Past, Future)');
  console.log('  - 3 Perfect tenses (Present, Past, Future)');
  console.log('  - 3 Perfect Continuous tenses (Present, Past, Future)');
  console.log('  - 5 Review guides (Simple, Continuous, Perfect, Perfect Continuous, Cycle 1)');
  console.log('  - 2 Conditional guides (Zero & First, Second & Third)');
  console.log('  - 1 Gerunds & Infinitives guide');
  console.log('  - 1 Past Perfect guide');
  console.log(`\nAdded 1 game:`);
  console.log('  - Numbers to English Words');
  console.log('\nYou can now view all activities at: /dashboard');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
