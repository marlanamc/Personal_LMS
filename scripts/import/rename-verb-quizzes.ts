import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface WeekData {
  due_date: string;
  verbs: Record<string, any>;
}

interface QuizzesData {
  [week: string]: WeekData;
}

async function main() {
  console.log('🔄 Renaming verb quizzes...\n');

  // Read the quizzes.json file to get the week order
  const quizzesPath = path.join(process.cwd(), 'class_uploads', 'quizzes.json');
  if (!fs.existsSync(quizzesPath)) {
    console.error(`❌ quizzes.json not found at: ${quizzesPath}`);
    console.error('   Add your quiz data to class_uploads/quizzes.json and run again.');
    process.exit(1);
  }
  const quizzesData: QuizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

  // Get all verb quiz activities
  const verbQuizzes = await prisma.activity.findMany({
    where: {
      type: 'quiz',
      content: {
        contains: '"type":"verb-quiz"'
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  console.log(`Found ${verbQuizzes.length} verb quizzes to rename\n`);

  let updateCount = 0;
  const weekOrder = Object.keys(quizzesData);

  for (const quiz of verbQuizzes) {
    const content = JSON.parse(quiz.content as string);
    const weekName = content.week;

    // Find the quiz number based on week order
    const quizNumber = weekOrder.indexOf(weekName) + 1;

    if (quizNumber === 0) {
      console.log(`⚠️  Could not find week order for ${quiz.title}`);
      continue;
    }

    const newTitle = `Verb Quiz ${quizNumber}`;

    // Skip if already renamed
    if (quiz.title === newTitle) {
      console.log(`⏭️  ${quiz.title} already has correct name`);
      continue;
    }

    // Update the activity
    await prisma.activity.update({
      where: { id: quiz.id },
      data: { title: newTitle }
    });

    console.log(`✅ Renamed "${quiz.title}" → "${newTitle}" (${weekName})`);
    updateCount++;
  }

  console.log(`\n📊 Rename Summary:`);
  console.log(`   ✅ Renamed: ${updateCount} quizzes`);
  console.log(`   ⏭️  Skipped: ${verbQuizzes.length - updateCount} quizzes`);
  console.log('\n✨ Renaming complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during rename:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
