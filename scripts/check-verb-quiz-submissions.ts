import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking verb quiz submissions and scores...\n');

  // Check all submissions for quiz activities
  const allQuizSubmissions = await prisma.submission.findMany({
    where: {
      activity: {
        type: 'quiz'
      }
    },
    include: {
      activity: {
        select: {
          id: true,
          title: true,
          content: true
        }
      },
      user: {
        select: {
          id: true,
          username: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`📊 Total quiz submissions: ${allQuizSubmissions.length}\n`);

  // Filter for verb quiz submissions
  const verbQuizSubmissions = allQuizSubmissions.filter(sub => {
    try {
      const content = typeof sub.activity.content === 'string' 
        ? JSON.parse(sub.activity.content) 
        : sub.activity.content;
      return content?.type === 'verb-quiz';
    } catch {
      return false;
    }
  });

  console.log(`📝 Verb quiz submissions: ${verbQuizSubmissions.length}\n`);

  if (verbQuizSubmissions.length === 0) {
    console.log('❌ No verb quiz submissions found!\n');
    
    // Check if verb quiz activities exist
    const verbQuizActivities = await prisma.activity.findMany({
      where: {
        type: 'quiz',
        content: {
          contains: '"type":"verb-quiz"'
        }
      },
      select: {
        id: true,
        title: true
      }
    });
    
    console.log(`📚 Verb quiz activities found: ${verbQuizActivities.length}\n`);
    
    if (verbQuizActivities.length > 0) {
      console.log('✅ Verb quiz activities exist, but no submissions found.');
      console.log('   This could mean:');
      console.log('   1. Students haven\'t submitted any quizzes yet');
      console.log('   2. Submissions were deleted (possibly when activities were recreated)\n');
    }
  } else {
    // Show submissions with scores
    console.log('✅ Found verb quiz submissions:\n');
    
    const withScores = verbQuizSubmissions.filter(s => s.score !== null);
    const withoutScores = verbQuizSubmissions.filter(s => s.score === null);
    
    console.log(`   With scores: ${withScores.length}`);
    console.log(`   Without scores: ${withoutScores.length}\n`);

    if (withScores.length > 0) {
      console.log('📊 Submissions WITH scores:\n');
      withScores.forEach(sub => {
        const userName = sub.user.name || sub.user.username;
        const activityTitle = sub.activity.title;
        console.log(`   - ${userName}: ${activityTitle} - Score: ${sub.score}% (${new Date(sub.createdAt).toLocaleDateString()})`);
      });
      console.log('');
    }

    if (withoutScores.length > 0) {
      console.log('⚠️  Submissions WITHOUT scores:\n');
      withoutScores.forEach(sub => {
        const userName = sub.user.name || sub.user.username;
        const activityTitle = sub.activity.title;
        console.log(`   - ${userName}: ${activityTitle} (${new Date(sub.createdAt).toLocaleDateString()})`);
        
        // Check if content has score info
        try {
          const content = typeof sub.content === 'string' ? JSON.parse(sub.content) : sub.content;
          if (content?.score) {
            console.log(`     ⚠️  WARNING: Score exists in content (${content.score}), but not in submission.score field!`);
          }
        } catch (e) {
          // Ignore parse errors
        }
      });
      console.log('');
    }

    // Check for orphaned submissions (activity content doesn't match)
    const orphanedSubmissions = allQuizSubmissions.filter(sub => {
      if (verbQuizSubmissions.some(vs => vs.id === sub.id)) {
        return false; // Already counted as verb quiz
      }
      // Check if submission content suggests it's a verb quiz
      try {
        const content = typeof sub.content === 'string' ? JSON.parse(sub.content) : sub.content;
        return content?.answers && Object.keys(content.answers).length > 0;
      } catch {
        return false;
      }
    });

    if (orphanedSubmissions.length > 0) {
      console.log(`⚠️  Found ${orphanedSubmissions.length} potentially orphaned submissions\n`);
      console.log('   These submissions might be from verb quizzes but the activity content doesn\'t match:\n');
      orphanedSubmissions.slice(0, 5).forEach(sub => {
        const userName = sub.user.name || sub.user.username;
        console.log(`   - ${userName}: Activity "${sub.activity.title}" - Score: ${sub.score ?? 'N/A'}`);
      });
      if (orphanedSubmissions.length > 5) {
        console.log(`   ... and ${orphanedSubmissions.length - 5} more\n`);
      }
    }
  }

  // Summary
  console.log('\n📋 Summary:');
  console.log(`   Total quiz submissions: ${allQuizSubmissions.length}`);
  console.log(`   Verb quiz submissions: ${verbQuizSubmissions.length}`);
  console.log(`   Submissions with scores: ${verbQuizSubmissions.filter(s => s.score !== null).length}`);
  console.log(`   Submissions without scores: ${verbQuizSubmissions.filter(s => s.score === null).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
