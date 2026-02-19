import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Matching VerbQuizSubmission interface structure
interface VerbQuizSubmission {
  answers: Record<string, {
    v1_3rd: string;
    v1_ing: string;
    v2: string;
    v3: string;
  }>;
  score: number;
  totalPoints: number;
  correctCount: number;
  totalForms: number;
  results: Record<string, {
    v1_3rd: boolean;
    v1_ing: boolean;
    v2: boolean;
    v3: boolean;
  }>;
  submittedAt: string;
}

const QUIZZES_TO_FIX = [
  'Verb Quiz 1',
  'Verb Quiz 2'
];

async function main() {
  console.log('🔧 Starting quiz answer backfill...\n');

  for (const title of QUIZZES_TO_FIX) {
    console.log(`Searching for "${title}"...`);
    
    // 1. Find the quiz activity to get correct answers
    const quiz = await prisma.activity.findFirst({
      where: { title, type: 'quiz' }
    });

    if (!quiz) {
      console.log(`⚠️  Could not find quiz with title "${title}"`);
      continue;
    }

    const content = JSON.parse(quiz.content);
    const verbs = content.verbs as Record<string, any>;
    const verbKeys = Object.keys(verbs);
    const totalForms = verbKeys.length * 4; // 4 forms per verb

    console.log(`   Found quiz (ID: ${quiz.id})`);
    console.log(`   Verbs: ${verbKeys.join(', ')}`);

    // 2. Find all submissions for this quiz
    const submissions = await prisma.submission.findMany({
      where: { 
        activityId: quiz.id,
        // Optional: filter for only those with missing content if needed, 
        // but user asked to fix them, so simpler to fix all to be safe 
        // or checking for empty/invalid JSON
      },
      include: { user: true }
    });

    console.log(`   Found ${submissions.length} submissions to check/fix.`);

    // 3. Construct the perfect submission object
    const perfectAnswers: VerbQuizSubmission['answers'] = {};
    const perfectResults: VerbQuizSubmission['results'] = {};

    for (const [verb, data] of Object.entries(verbs)) {
      perfectAnswers[verb] = {
        v1_3rd: data.v1_3rd,
        v1_ing: data.v1_ing,
        v2: data.v2,
        v3: data.v3
      };
      
      perfectResults[verb] = {
        v1_3rd: true,
        v1_ing: true,
        v2: true,
        v3: true
      };
    }

    const perfectSubmission: VerbQuizSubmission = {
      answers: perfectAnswers,
      score: 100,
      totalPoints: totalForms, // usually 1 point per form
      correctCount: totalForms,
      totalForms: totalForms,
      results: perfectResults,
      submittedAt: new Date().toISOString()
    };

    const submissionString = JSON.stringify(perfectSubmission);

    // 4. Update submissions
    let updatedCount = 0;
    for (const sub of submissions) {
        // We overwrite content with the perfect answers
        // matches the user request: "fill those answers in... i just gave the students all 100s"
        await prisma.submission.update({
            where: { id: sub.id },
            data: {
                content: submissionString,
                score: 100, // Ensure score matches
                status: 'graded'
            }
        });
        updatedCount++;
    }
    
    console.log(`   ✅ Backfilled ${updatedCount} submissions for "${title}" with perfect answers.\n`);
  }

  console.log('✨ Quiz backfill complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
