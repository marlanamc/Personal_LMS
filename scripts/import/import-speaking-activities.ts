import { PrismaClient } from '@prisma/client';
import { housingBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/housing-basics';
import { bankingBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/banking-basics';
import { workplaceBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/workplace-basics';
import { healthcareBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/healthcare-basics';
import { transportationBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/transportation-basics';
import { foodBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/food-basics';
import { perfectTensesPracticeDailyWarmup } from '../../src/content/speaking/daily-warmups/perfect-tenses-practice';
import { classroomBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/classroom-basics';
import { careerBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/career-basics';
import { wellnessBasicsDailyWarmup } from '../../src/content/speaking/daily-warmups/wellness-basics';
import { gerundsInfinitivesDailyWarmup } from '../../src/content/speaking/daily-warmups/gerunds-infinitives';
import { perfectContinuousDailyWarmup } from '../../src/content/speaking/daily-warmups/perfect-continuous';
import { newYearGoalsDailyWarmup } from '../../src/content/speaking/daily-warmups/new-year-goals';
import { passiveVoiceDailyWarmup } from '../../src/content/speaking/daily-warmups/passive-voice';
import { reportedSpeechDailyWarmup } from '../../src/content/speaking/daily-warmups/reported-speech';
import { usedToStructuresDailyWarmup } from '../../src/content/speaking/daily-warmups/used-to-structures';
import { housingVocabRoomDescriptions_2026_01_20 } from '../../src/content/speaking/daily-warmups/housing-vocab-room-descriptions-2026-01-20';
import { tenantLandlordPhoneCall_2026_01_22 } from '../../src/content/speaking/daily-warmups/tenant-landlord-phone-call-2026-01-22';
import { housingProblemsSolutions_2026_02_03 } from '../../src/content/speaking/daily-warmups/housing-problems-solutions-2026-02-03';
import { pastPresentHabitsHousing_2026_02_10 } from '../../src/content/speaking/daily-warmups/past-present-habits-housing-2026-02-10';
import { interviewCommonQuestions_2026_03_05 } from '../../src/content/speaking/daily-warmups/interview-common-questions-2026-03-05';
import { jobApplicationTalkThrough_2026_03_10 } from '../../src/content/speaking/daily-warmups/job-application-talk-through-2026-03-10';
import { professionalMessages_2026_03_12 } from '../../src/content/speaking/daily-warmups/professional-messages-2026-03-12';
import { workplaceRightsScenarios_2026_03_17 } from '../../src/content/speaking/daily-warmups/workplace-rights-scenarios-2026-03-17';
import { negotiationSelfAdvocacy_2026_03_24 } from '../../src/content/speaking/daily-warmups/negotiation-self-advocacy-2026-03-24';
import { workplaceAdvocacyRoleplays_2026_03_26 } from '../../src/content/speaking/daily-warmups/workplace-advocacy-roleplays-2026-03-26';
import { workplaceSmallTalkSafeTopics_2026_03_31 } from '../../src/content/speaking/daily-warmups/workplace-small-talk-safe-topics-2026-03-31';
import { workplacePoliciesProcedures_2026_04_02 } from '../../src/content/speaking/daily-warmups/workplace-policies-procedures-2026-04-02';
import { workProblemSolution_2026_04_07 } from '../../src/content/speaking/daily-warmups/work-problem-solution-2026-04-07';
import { symptomsDuration_2026_04_16 } from '../../src/content/speaking/daily-warmups/symptoms-duration-2026-04-16';
import { clinicVisitStepsPassive_2026_04_28 } from '../../src/content/speaking/daily-warmups/clinic-visit-steps-passive-2026-04-28';
import { pharmacyInstructions_2026_04_30 } from '../../src/content/speaking/daily-warmups/pharmacy-instructions-2026-04-30';
import { myChartCallingOffice_2026_05_05 } from '../../src/content/speaking/daily-warmups/mychart-calling-office-2026-05-05';
import { nutritionFoodLabels_2026_05_14 } from '../../src/content/speaking/daily-warmups/nutrition-food-labels-2026-05-14';
import { homeRemediesProcess_2026_05_19 } from '../../src/content/speaking/daily-warmups/home-remedies-process-2026-05-19';
import { stressSolutionsRoundtable_2026_05_21 } from '../../src/content/speaking/daily-warmups/stress-solutions-roundtable-2026-05-21';
import { healthyHabitTracker_2026_05_26 } from '../../src/content/speaking/daily-warmups/healthy-habit-tracker-2026-05-26';
import { wellnessPresentationPractice_2026_05_28 } from '../../src/content/speaking/daily-warmups/wellness-presentation-practice-2026-05-28';
import { communityResourcesPitch_2026_06_02 } from '../../src/content/speaking/daily-warmups/community-resources-pitch-2026-06-02';
import { wellnessReflectionWhatsChanged_2026_06_04 } from '../../src/content/speaking/daily-warmups/wellness-reflection-whats-changed-2026-06-04';
import { yearInReviewCarousel_2026_06_09 } from '../../src/content/speaking/daily-warmups/year-in-review-carousel-2026-06-09';
import { summerNextStepsGoals_2026_06_11 } from '../../src/content/speaking/daily-warmups/summer-next-steps-goals-2026-06-11';
import { finalPresentationRehearsal_2026_06_16 } from '../../src/content/speaking/daily-warmups/final-presentation-rehearsal-2026-06-16';
import { exitInterviewAdvice_2026_06_18 } from '../../src/content/speaking/daily-warmups/exit-interview-advice-2026-06-18';

const prisma = new PrismaClient();

// Activities to import
const speakingActivities = [
  {
    id: 'speaking-housing-basics',
    content: housingBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-banking-basics',
    content: bankingBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-workplace-basics',
    content: workplaceBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-healthcare-basics',
    content: healthcareBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-transportation-basics',
    content: transportationBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-food-basics',
    content: foodBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-perfect-tenses',
    content: perfectTensesPracticeDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-classroom-basics',
    content: classroomBasicsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-career-basics',
    content: careerBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-wellness-basics',
    content: wellnessBasicsDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-gerunds-infinitives',
    content: gerundsInfinitivesDailyWarmup,
    level: 'intermediate',
  },
  {
    id: 'speaking-perfect-continuous',
    content: perfectContinuousDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-new-year-goals',
    content: newYearGoalsDailyWarmup,
    level: 'beginner',
  },
  {
    id: 'speaking-passive-voice',
    content: passiveVoiceDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-reported-speech',
    content: reportedSpeechDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-used-to-structures',
    content: usedToStructuresDailyWarmup,
    level: 'advanced',
  },
  {
    id: 'speaking-2026-01-20-housing-vocab-room-descriptions',
    content: housingVocabRoomDescriptions_2026_01_20,
    level: 'beginner',
  },
  {
    id: 'speaking-2026-01-22-tenant-landlord-phone-call',
    content: tenantLandlordPhoneCall_2026_01_22,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-02-03-housing-problems-solutions',
    content: housingProblemsSolutions_2026_02_03,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-02-10-past-present-housing-habits',
    content: pastPresentHabitsHousing_2026_02_10,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-05-interview-common-questions',
    content: interviewCommonQuestions_2026_03_05,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-10-job-application-talk-through',
    content: jobApplicationTalkThrough_2026_03_10,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-12-professional-messages',
    content: professionalMessages_2026_03_12,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-17-workplace-rights-scenarios',
    content: workplaceRightsScenarios_2026_03_17,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-24-negotiation-self-advocacy',
    content: negotiationSelfAdvocacy_2026_03_24,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-26-workplace-advocacy-roleplays',
    content: workplaceAdvocacyRoleplays_2026_03_26,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-03-31-workplace-small-talk-safe-topics',
    content: workplaceSmallTalkSafeTopics_2026_03_31,
    level: 'beginner',
  },
  {
    id: 'speaking-2026-04-02-workplace-policies-procedures',
    content: workplacePoliciesProcedures_2026_04_02,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-04-07-work-problem-solution',
    content: workProblemSolution_2026_04_07,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-04-16-symptoms-duration',
    content: symptomsDuration_2026_04_16,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-04-28-clinic-visit-steps-passive',
    content: clinicVisitStepsPassive_2026_04_28,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-04-30-pharmacy-instructions',
    content: pharmacyInstructions_2026_04_30,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-05-mychart-calling-office',
    content: myChartCallingOffice_2026_05_05,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-14-nutrition-food-labels',
    content: nutritionFoodLabels_2026_05_14,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-19-home-remedies-process',
    content: homeRemediesProcess_2026_05_19,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-21-stress-solutions-roundtable',
    content: stressSolutionsRoundtable_2026_05_21,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-26-healthy-habit-tracker',
    content: healthyHabitTracker_2026_05_26,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-05-28-wellness-presentation-practice',
    content: wellnessPresentationPractice_2026_05_28,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-06-02-community-resources-pitch',
    content: communityResourcesPitch_2026_06_02,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-06-04-wellness-reflection-whats-changed',
    content: wellnessReflectionWhatsChanged_2026_06_04,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-06-09-year-in-review-carousel',
    content: yearInReviewCarousel_2026_06_09,
    level: 'beginner',
  },
  {
    id: 'speaking-2026-06-11-summer-next-steps-goals',
    content: summerNextStepsGoals_2026_06_11,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-06-16-final-presentation-rehearsal',
    content: finalPresentationRehearsal_2026_06_16,
    level: 'intermediate',
  },
  {
    id: 'speaking-2026-06-18-exit-interview-advice',
    content: exitInterviewAdvice_2026_06_18,
    level: 'intermediate',
  },
];

async function main() {
  console.log('🗣️  Starting speaking activities import...\n');

  // Get the teacher user (assuming there's a teacher account)
  const teacher = await prisma.user.findFirst({
    where: { role: 'teacher' }
  });

  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    return;
  }

  console.log(`✓ Found teacher: ${teacher.name}\n`);

  let importCount = 0;
  let updateCount = 0;

  // Process each speaking activity
  for (const activity of speakingActivities) {
    const existing = await prisma.activity.findUnique({
      where: { id: activity.id },
      select: { content: true },
    });

    let content = activity.content;
    if (existing?.content) {
      try {
        const existingContent = JSON.parse(existing.content);
        if (Object.prototype.hasOwnProperty.call(existingContent, 'released')) {
          content = {
            ...activity.content,
            released: existingContent.released,
          };
        }
      } catch {
        // Keep default content if existing content is malformed.
      }
    }

    const payload = {
      title: content.title,
      description: content.description || '',
      type: 'speaking' as const,
      category: 'speaking' as const,
      level: activity.level,
      content: JSON.stringify(content),
    };

    const upserted = await prisma.activity.upsert({
      where: { id: activity.id },
      update: payload,
      create: {
        id: activity.id,
        ...payload,
        createdBy: teacher.id,
      },
    });

    const actionLabel = existing ? 'Updated' : 'Created';
    console.log(`✅ ${actionLabel} ${activity.content.title}`);
    console.log(`   - ID: ${upserted.id}`);
    console.log(`   - Level: ${activity.level}`);
    console.log(`   - Prompts: ${activity.content.prompts.length}`);
    console.log(`   - Key Phrases: ${activity.content.keyPhrases?.length || 0}\n`);

    if (existing) updateCount++;
    else importCount++;
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${importCount} speaking activities`);
  console.log(`   ♻️  Updated: ${updateCount} existing activities`);
  console.log(`   📝 Total activities: ${speakingActivities.length}`);
  console.log('\n✨ Import complete!\n');

  // Show sample query to verify
  console.log('📋 Sample query to verify:');
  const sampleActivity = await prisma.activity.findFirst({
    where: {
      type: 'speaking',
    },
    select: {
      id: true,
      title: true,
      category: true,
    }
  });

  if (sampleActivity) {
    console.log(`   Found activity: ${sampleActivity.title} (ID: ${sampleActivity.id})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
