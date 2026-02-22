import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface VerbData {
  v1: string;
  v1_3rd: string;
  v1_ing: string;
  v2: string;
  v3: string;
}

interface WeekData {
  due_date: string;
  verbs: Record<string, VerbData>;
}

interface QuizzesData {
  [week: string]: WeekData;
}

async function main() {
  console.log('🚀 Starting verb quiz import...\n');

  // Read the quizzes.json file
  const quizzesPath = path.join(process.cwd(), 'class_uploads', 'quizzes.json');
  if (!fs.existsSync(quizzesPath)) {
    console.error(`❌ quizzes.json not found at: ${quizzesPath}`);
    console.error('   Add your quiz data to class_uploads/quizzes.json and run again.');
    process.exit(1);
  }
  const quizzesData: QuizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

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
  let skipCount = 0;

  // Process each week
  const weekEntries = Object.entries(quizzesData);
  for (let i = 0; i < weekEntries.length; i++) {
    const [weekName, weekData] = weekEntries[i];
    const quizNumber = i + 1;
    const title = `Verb Quiz ${quizNumber}`;

    // Check if this quiz already exists
    const existing = await prisma.activity.findFirst({
      where: {
        title: title,
        type: 'quiz'
      }
    });

    if (existing) {
      console.log(`⏭️  Skipping Verb Quiz ${quizNumber} (${weekName}) - already exists`);
      skipCount++;
      continue;
    }

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        title: title,
        description: `Complete the irregular verb forms for this week's verbs. Test your knowledge of V1 (3rd person), V1-ing, V2 (past), and V3 (past participle).`,
        type: 'quiz',
        category: 'quizzes',
        level: 'intermediate',
        content: JSON.stringify({
          type: 'verb-quiz',
          week: weekName,
          due_date: weekData.due_date,
          verbs: weekData.verbs
        }),
        createdBy: teacher.id
      }
    });

    console.log(`✅ Created Verb Quiz ${quizNumber} (${weekName})`);
    console.log(`   - Activity ID: ${activity.id}`);
    console.log(`   - Due date: ${weekData.due_date}`);
    console.log(`   - Verbs: ${Object.keys(weekData.verbs).join(', ')}\n`);
    importCount++;

    // Note: Calendar events are class-specific, so not creating global events
    // Teachers can create calendar events when assigning quizzes to classes
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${importCount} quizzes`);
  console.log(`   ⏭️  Skipped: ${skipCount} quizzes (already existed)`);
  console.log(`   📝 Total in file: ${Object.keys(quizzesData).length} quizzes`);
  console.log('\n✨ Import complete!\n');

  // Show sample query to verify
  console.log('📋 Sample query to verify:');
  const sampleQuiz = await prisma.activity.findFirst({
    where: {
      type: 'quiz',
      content: {
        contains: '"type":"verb-quiz"'
      }
    },
    select: {
      id: true,
      title: true,
    }
  });

  if (sampleQuiz) {
    console.log(`   Found quiz: ${sampleQuiz.title} (ID: ${sampleQuiz.id})`);
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
