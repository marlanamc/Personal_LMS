import { PrismaClient } from '@prisma/client';
import { awardPoints, updateStreak, checkAndAwardAchievements, calculateQuizPoints } from '../src/lib/gamification';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Giving all students 100% on Verb Quiz 1 and Verb Quiz 2...\n');

  // Find Verb Quiz 1 and Verb Quiz 2
  const quiz1 = await prisma.activity.findFirst({
    where: {
      title: 'Verb Quiz 1',
      type: 'quiz'
    }
  });

  const quiz2 = await prisma.activity.findFirst({
    where: {
      title: 'Verb Quiz 2',
      type: 'quiz'
    }
  });

  if (!quiz1) {
    console.error('❌ Verb Quiz 1 not found!');
    process.exit(1);
  }

  if (!quiz2) {
    console.error('❌ Verb Quiz 2 not found!');
    process.exit(1);
  }

  console.log(`✅ Found Verb Quiz 1: ${quiz1.id}`);
  console.log(`✅ Found Verb Quiz 2: ${quiz2.id}\n`);

  // Parse quiz content to get verb structure
  const quiz1Content = typeof quiz1.content === 'string' 
    ? JSON.parse(quiz1.content) 
    : quiz1.content;
  const quiz2Content = typeof quiz2.content === 'string' 
    ? JSON.parse(quiz2.content) 
    : quiz2.content;

  // Get all students
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    select: { id: true, username: true, name: true }
  });

  console.log(`📚 Found ${students.length} students\n`);

  if (students.length === 0) {
    console.log('⚠️  No students found. Nothing to do.');
    return;
  }

  const score = 100;
  const pointsAwarded = calculateQuizPoints(score); // Returns 15 for perfect score

  let createdCount1 = 0;
  let updatedCount1 = 0;
  let createdCount2 = 0;
  let updatedCount2 = 0;

  // Helper function to create perfect submission content
  function createPerfectSubmissionContent(quizContent: any) {
    const answers: any = {};
    const results: any = {};

    // Fill in perfect answers for all verbs
    Object.keys(quizContent.verbs || {}).forEach(verb => {
      const correctAnswers = quizContent.verbs[verb];
      answers[verb] = {
        v1_3rd: correctAnswers.v1_3rd || '',
        v1_ing: correctAnswers.v1_ing || '',
        v2: correctAnswers.v2 || '',
        v3: correctAnswers.v3 || ''
      };
      results[verb] = {
        v1_3rd: true,
        v1_ing: true,
        v2: true,
        v3: true
      };
    });

    const totalForms = Object.keys(quizContent.verbs || {}).length * 4;
    const correctCount = totalForms; // Perfect score

    return {
      answers,
      score,
      totalPoints: pointsAwarded,
      correctCount,
      totalForms,
      results,
      submittedAt: new Date().toISOString()
    };
  }

  // Process each student
  for (const student of students) {
    const studentName = student.name || student.username;

    // Verb Quiz 1
    try {
      const submissionContent1 = createPerfectSubmissionContent(quiz1Content);
      
      // Check if submission already exists
      const existing1 = await prisma.submission.findFirst({
        where: {
          userId: student.id,
          activityId: quiz1.id,
          assignmentId: null
        }
      });

      const submissionData1 = {
        userId: student.id,
        activityId: quiz1.id,
        assignmentId: null,
        content: JSON.stringify(submissionContent1),
        score: score,
        pointsAwarded: pointsAwarded,
        status: 'submitted' as const,
        completedAt: new Date()
      };

      if (existing1) {
        await prisma.submission.update({
          where: { id: existing1.id },
          data: submissionData1
        });
        updatedCount1++;
      } else {
        await prisma.submission.create({ data: submissionData1 });
        createdCount1++;
        // Award points for new submission
        await awardPoints(
          student.id,
          pointsAwarded,
          `Completed: ${quiz1.title}`
        );
        await updateStreak(student.id, pointsAwarded);
        await checkAndAwardAchievements(student.id);
      }

      // Update activity progress for Quiz 1
      const existingProgress1 = await prisma.activityProgress.findFirst({
        where: {
          userId: student.id,
          activityId: quiz1.id,
          assignmentId: null
        }
      });

      if (existingProgress1) {
        await prisma.activityProgress.update({
          where: { id: existingProgress1.id },
          data: {
            progress: 100,
            status: 'completed'
          }
        });
      } else {
        await prisma.activityProgress.create({
          data: {
            userId: student.id,
            activityId: quiz1.id,
            assignmentId: null,
            progress: 100,
            status: 'completed'
          }
        });
      }
    } catch (error: any) {
      console.error(`   ❌ Error processing ${studentName} for Verb Quiz 1:`, error.message);
    }

    // Verb Quiz 2
    try {
      const submissionContent2 = createPerfectSubmissionContent(quiz2Content);
      
      // Check if submission already exists
      const existing2 = await prisma.submission.findFirst({
        where: {
          userId: student.id,
          activityId: quiz2.id,
          assignmentId: null
        }
      });

      const submissionData2 = {
        userId: student.id,
        activityId: quiz2.id,
        assignmentId: null,
        content: JSON.stringify(submissionContent2),
        score: score,
        pointsAwarded: pointsAwarded,
        status: 'submitted' as const,
        completedAt: new Date()
      };

      if (existing2) {
        await prisma.submission.update({
          where: { id: existing2.id },
          data: submissionData2
        });
        updatedCount2++;
      } else {
        await prisma.submission.create({ data: submissionData2 });
        createdCount2++;
        // Award points for new submission
        await awardPoints(
          student.id,
          pointsAwarded,
          `Completed: ${quiz2.title}`
        );
        await updateStreak(student.id, pointsAwarded);
        await checkAndAwardAchievements(student.id);
      }

      // Update activity progress for Quiz 2
      const existingProgress2 = await prisma.activityProgress.findFirst({
        where: {
          userId: student.id,
          activityId: quiz2.id,
          assignmentId: null
        }
      });

      if (existingProgress2) {
        await prisma.activityProgress.update({
          where: { id: existingProgress2.id },
          data: {
            progress: 100,
            status: 'completed'
          }
        });
      } else {
        await prisma.activityProgress.create({
          data: {
            userId: student.id,
            activityId: quiz2.id,
            assignmentId: null,
            progress: 100,
            status: 'completed'
          }
        });
      }
    } catch (error: any) {
      console.error(`   ❌ Error processing ${studentName} for Verb Quiz 2:`, error.message);
    }
  }

  console.log('\n✨ Done!\n');
  console.log('📊 Summary:');
  console.log(`   Verb Quiz 1:`);
  console.log(`     ✅ Created: ${createdCount1} submissions`);
  console.log(`     🔄 Updated: ${updatedCount1} submissions`);
  console.log(`   Verb Quiz 2:`);
  console.log(`     ✅ Created: ${createdCount2} submissions`);
  console.log(`     🔄 Updated: ${updatedCount2} submissions`);
  console.log(`\n   Total points awarded: ${(createdCount1 + createdCount2) * pointsAwarded}`);
  console.log(`   (${pointsAwarded} points per quiz × ${createdCount1 + createdCount2} new submissions)\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
