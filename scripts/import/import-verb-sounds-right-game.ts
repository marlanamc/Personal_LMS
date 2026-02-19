/**
 * Script to import the "Pick the Word That Sounds Right" verb game
 * Uses MatchingGame format with support for single and two-blank sentences
 *
 * Single-blank format: sentence :: correct :: wrong :: tense :: explanation
 * Two-blank format: sentence :: correct1 :: wrong1 :: tense1 :: explain1 :: correct2 :: wrong2 :: tense2 :: explain2
 *
 * Verbs from Quizzes 1-7: be, have, do, make, go, come, find, buy, keep, build,
 * pay, hold, break, leave, sell, burst, freeze, leak, call, fix, sleep, wake,
 * eat, drink, sit, spend, cost, lend, give, send, write, submit, work, apply, meet
 *
 * Usage: npx tsx scripts/import/import-verb-sounds-right-game.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SUPPORTED_TENSES = new Set([
  'present-simple',
  'present-continuous',
  'present-perfect',
  'present-perfect-continuous',
  'past-simple',
  'past-continuous',
  'past-perfect',
  'past-perfect-continuous',
  'future-simple',
  'future-continuous',
  'future-perfect',
]);

function normalizeOption(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function validateGameContent(content: string): void {
  const issues: string[] = [];
  const lines = content.split('\n');

  const addIssue = (lineNumber: number, message: string, line: string) => {
    issues.push(`Line ${lineNumber}: ${message} -> ${line}`);
  };

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith('[ROUND') || !line.includes('_____') || !line.includes('::')) return;

    const parts = line.split('::').map((s) => s.trim());
    const sentence = parts[0] ?? '';
    const blankCount = (sentence.match(/_____/g) || []).length;

    if (blankCount === 1) {
      const correct = parts[1] ?? '';
      const wrong = parts[2] ?? '';
      if (!correct || !wrong) {
        addIssue(lineNumber, 'Missing single-blank options', line);
        return;
      }
      if (normalizeOption(correct) === normalizeOption(wrong)) {
        addIssue(lineNumber, `Duplicate single-blank options "${correct}"`, line);
      }
      return;
    }

    if (blankCount !== 2) return;

    let correct1 = '';
    let wrong1 = '';
    let correct2 = '';
    let wrong2 = '';

    if (parts.length >= 9) {
      // Canonical two-blank format:
      // sentence :: correct1 :: wrong1 :: tense1 :: explain1 :: correct2 :: wrong2 :: tense2 :: explain2
      correct1 = parts[1] ?? '';
      wrong1 = parts[2] ?? '';
      correct2 = parts[5] ?? '';
      wrong2 = parts[6] ?? '';
    } else if (parts.length >= 8 && !SUPPORTED_TENSES.has(parts[3] ?? '') && SUPPORTED_TENSES.has(parts[5] ?? '')) {
      // Legacy compact two-blank format:
      // sentence :: correct1 :: wrong1 :: correct2 :: wrong2 :: tense1 :: tense2 :: explanation
      correct1 = parts[1] ?? '';
      wrong1 = parts[2] ?? '';
      correct2 = parts[3] ?? '';
      wrong2 = parts[4] ?? '';
    } else if (parts.length >= 7) {
      // Best-effort fallback when explanation fields are omitted.
      correct1 = parts[1] ?? '';
      wrong1 = parts[2] ?? '';
      correct2 = parts[5] ?? '';
      wrong2 = parts[6] ?? '';
    } else {
      addIssue(lineNumber, 'Too few fields for two-blank row', line);
      return;
    }

    if (!correct1 || !wrong1 || !correct2 || !wrong2) {
      addIssue(lineNumber, 'Missing two-blank options', line);
      return;
    }
    if (normalizeOption(correct1) === normalizeOption(wrong1)) {
      addIssue(lineNumber, `Duplicate blank-1 options "${correct1}"`, line);
    }
    if (normalizeOption(correct2) === normalizeOption(wrong2)) {
      addIssue(lineNumber, `Duplicate blank-2 options "${correct2}"`, line);
    }
  });

  if (issues.length > 0) {
    throw new Error(`Game content validation failed with ${issues.length} issue(s):\n${issues.join('\n')}`);
  }
}

const gameContent = `[ROUND 1 - Present Simple vs Past Simple]
She _____ to work every day. :: goes :: went :: present-simple :: "Every day" tells us this is a regular habit, so we use present simple: "She goes."
I _____ him at the party last night. :: met :: meet :: past-simple :: "Last night" is a finished time in the past, so we use past simple: "I met."
He _____ coffee every morning. :: drinks :: drank :: present-simple :: "Every morning" is a routine, so we use present simple: "He drinks."
They _____ a new house last year. :: bought :: buy :: past-simple :: "Last year" is finished, so we use past simple: "They bought."
She _____ hard to support her family. :: works :: worked :: present-simple :: This describes her life in general (a fact), so we use present simple: "She works."
We _____ to the beach yesterday. :: went :: go :: past-simple :: "Yesterday" is finished, so we use past simple: "We went."
The shop _____ at 9am every day. :: opens :: opened :: present-simple :: A regular schedule uses present simple: "The shop opens."
I _____ my keys on the table this morning. :: left :: leave :: past-simple :: This morning is finished (it happened earlier), so we use past simple: "I left."
He _____ two languages fluently. :: speaks :: spoke :: present-simple :: A permanent ability uses present simple: "He speaks."
She _____ the answer to that question. :: found :: finds :: past-simple :: This is about a moment when she discovered it (completed action), so past simple: "She found."

[ROUND 2 - Present Continuous vs Past Continuous]
She _____ dinner right now. :: is cooking :: was cooking :: present-continuous :: "Right now" means it's happening at this moment: "She is cooking."
I _____ when you _____ me. :: was sleeping :: am sleeping :: past-continuous :: I was in the middle of sleeping (ongoing). :: called :: were calling :: past-simple :: You "called" is a single completed action.
They _____ TV at the moment. :: are watching :: were watching :: present-continuous :: "At the moment" = right now, so present continuous: "They are watching."
He _____ a book when the lights _____ out. :: was reading :: is reading :: past-continuous :: He was in the middle of reading (ongoing action). :: went :: were going :: past-simple :: The lights "went out" is a sudden completed action that interrupted.
We _____ for the bus right now. :: are waiting :: were waiting :: present-continuous :: "Right now" tells us it's happening now: "We are waiting."
She _____ on a big project last month. :: was working :: is working :: past-continuous :: "Last month" is in the past, and it was ongoing: "She was working."
The children _____ in the garden now. :: are playing :: were playing :: present-continuous :: "Now" means the present moment: "The children are playing."
I _____ about you when you _____. :: was thinking :: am thinking :: past-continuous :: I was in the middle of thinking (ongoing). :: texted :: were texting :: past-simple :: You "texted" is a single completed action.
Look! It _____! :: is raining :: was raining :: present-continuous :: "Look!" draws attention to something happening now: "It is raining!"
At 8pm last night, we _____ dinner. :: were eating :: are eating :: past-continuous :: At a specific past time, the action was in progress: "We were eating."

[ROUND 3 - Present Perfect vs Past Simple]
I have _____ that movie three times. :: seen :: saw :: present-perfect :: "Three times" counts experiences in your life up to now: "I have seen."
She _____ to Paris last summer. :: went :: has gone :: past-simple :: "Last summer" is a specific finished time: "She went."
They have _____ in London for five years. :: lived :: live :: present-perfect :: "For five years" and they still live there now: "They have lived."
He _____ his homework an hour ago. :: finished :: has finished :: past-simple :: "An hour ago" is a specific past time: "He finished."
I have never _____ sushi. :: eaten :: ate :: present-perfect :: "Never" talks about your whole life experience: "I have never eaten."
We _____ married in 2019. :: got :: have gotten :: past-simple :: "In 2019" is a specific year in the past: "We got married."
She has _____ a lot of money this year. :: spent :: spend :: present-perfect :: "This year" includes the present, so: "She has spent."
They _____ to the new restaurant yesterday. :: went :: have gone :: past-simple :: "Yesterday" is finished: "They went."
I have _____ my report. Can I go home? :: submitted :: submit :: present-perfect :: The action just finished and affects now (can I go?): "I have submitted."
He _____ his job last week. :: lost :: has lost :: past-simple :: "Last week" is a specific finished time: "He lost."

[ROUND 4 - Future Simple vs Present Continuous (future)]
I _____ you tomorrow. :: will call :: am calling :: future-simple :: A promise or decision made now: "I will call you."
We _____ dinner with friends tonight. :: are having :: will have :: present-continuous :: An arrangement already made with others: "We are having dinner."
She _____ 30 next month. :: will be :: is being :: future-simple :: A future fact about age: "She will be 30."
They _____ to Japan next week. :: are flying :: will fly :: present-continuous :: Tickets are booked—it's a scheduled plan: "They are flying."
Don't worry, I _____ you. :: will help :: am helping :: future-simple :: A spontaneous offer made right now: "I will help you."
He _____ the doctor at 3pm. :: is seeing :: will see :: present-continuous :: An appointment that's already made: "He is seeing the doctor."
It _____ rain later, I think. :: will :: is going to :: future-simple :: A prediction based on opinion, not evidence: "It will rain."
We _____ a party on Saturday. :: are having :: will have :: present-continuous :: A planned event with people invited: "We are having a party."
I promise I _____ late. :: won't be :: am not being :: future-simple :: A promise uses "will": "I won't be late."
She _____ her exam results next week. :: will get :: is getting :: future-simple :: An expected future event (not a plan she made): "She will get."

[ROUND 5 - Mixed Tenses: Two Verbs]
She _____ dinner while he _____ TV. :: was cooking :: cooked :: was watching :: watched :: past-continuous :: past-continuous :: Both actions were happening at the same time in the past: "She was cooking while he was watching."
I _____ when the phone _____. :: was sleeping :: slept :: rang :: was ringing :: past-continuous :: past-simple :: "I was sleeping" (ongoing) when "the phone rang" (sudden interruption).
He _____ to music while he _____. :: listens :: listened :: works :: worked :: present-simple :: present-simple :: Two things he does regularly at the same time: "He listens... while he works."
She _____ home after she _____ shopping. :: went :: goes :: finished :: had finished :: past-simple :: past-simple :: Two completed past actions in sequence: "She went home after she finished."
They _____ lunch when I _____. :: were having :: had :: arrived :: was arriving :: past-continuous :: past-simple :: "They were having lunch" (in progress) when "I arrived" (completed action).
I _____ coffee while I _____ the news. :: drink :: drank :: read :: am reading :: present-simple :: present-simple :: A daily habit: "I drink coffee while I read the news."
She _____ upset because she _____ bad news. :: was :: is :: received :: had received :: past-simple :: past-simple :: Past feeling and its past cause: "She was upset because she received bad news."
He _____ to work after he _____ breakfast. :: goes :: went :: has :: had :: present-simple :: present-simple :: His daily routine: "He goes to work after he has breakfast."
We _____ tired because we _____ all day. :: were :: are :: had worked :: worked :: past-simple :: past-simple :: Past feeling and its cause: "We were tired because we worked all day."
I _____ when you _____ at the door. :: was cooking :: cooked :: knocked :: were knocking :: past-continuous :: past-simple :: "I was cooking" (ongoing) when "you knocked" (sudden action).

[ROUND 6 - Advanced Tenses]
By this time tomorrow, I _____ on the beach. :: will be lying :: am lying :: future-continuous :: Future continuous for an action in progress at a future time: "I will be lying on the beach."
She _____ Japanese for three years now. :: has been studying :: studied :: present-perfect :: "For three years" up to now, and still continuing: "She has been studying."
They _____ the project by Friday. :: will have finished :: finish :: future-simple :: Completed before a future deadline: "They will have finished by Friday."
I _____ to that song all morning. :: have been listening :: listened :: present-perfect :: An ongoing action from past until now: "I have been listening all morning."
He _____ very tired lately. :: has been :: was :: present-perfect :: "Lately" connects the recent past to now: "He has been tired."
We _____ for two hours when she finally _____. :: had been waiting :: waited :: past-perfect-continuous :: We had been waiting for a duration before she arrived. :: arrived :: was arriving :: past-simple :: "Arrived" is a single completed action that ended the waiting.
By next year, they _____ here for a decade. :: will have lived :: live :: future-simple :: A future point looking back at a duration: "They will have lived here."
She _____ about getting a new job recently. :: has been thinking :: thought :: present-perfect :: "Recently" = from the recent past until now: "She has been thinking."
The company _____ since 1990. :: has existed :: existed :: present-perfect :: "Since 1990" means from then until now: "The company has existed."
I _____ all day, so I'm exhausted. :: have been working :: worked :: present-perfect :: The ongoing work explains the current exhaustion: "I have been working."
By the time you _____, I _____ dinner. :: arrive :: will arrive :: present-simple :: After "by the time," we use present simple for the future event. :: will have finished :: am finishing :: future-perfect :: The dinner will be complete before you arrive: "I will have finished."`;

async function importGame() {
  try {
    console.log('🎮 Starting "Pick the Word That Sounds Right" game import...\n');
    validateGameContent(gameContent);
    console.log('✓ Content validation passed (no duplicate options)\n');

    const teacher = await prisma.user.findFirst({
      where: { role: 'teacher' }
    });

    if (!teacher) {
      console.error('❌ No teacher account found. Please create a teacher account first.');
      process.exit(1);
    }

    console.log(`✓ Found teacher: ${teacher.name || teacher.username}\n`);

    const activityId = 'verb-sounds-right-quiz-1-7';

    const existing = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    const data = {
      title: 'Pick the Word That Sounds Right',
      description: 'Practice verbs from Quizzes 1–7 across all tenses. Choose what sounds right in each sentence—trust your ear!',
      content: gameContent,
      type: 'game',
      category: 'games',
      level: 'intermediate',
      ui: 'matching',
    };

    if (existing) {
      await prisma.activity.update({
        where: { id: activityId },
        data: { ...data, updatedAt: new Date() }
      });
      console.log('⚠️  Activity already exists. Updated content.\n');
    } else {
      await prisma.activity.create({
        data: {
          id: activityId,
          ...data,
          createdBy: teacher.id
        }
      });
      console.log('✅ Activity created successfully!\n');
    }

    // Count questions (each blank counts)
    const blankCount = (gameContent.match(/_____/g) || []).length;
    const roundCount = (gameContent.match(/\[ROUND/g) || []).length;

    console.log('📊 Import Summary:');
    console.log(`   Activity ID: ${activityId}`);
    console.log(`   Type: game (verb sounds right)`);
    console.log(`   Category: games`);
    console.log(`   Level: intermediate`);
    console.log(`   Rounds: ${roundCount}`);
    console.log(`   Blanks to fill: ${blankCount}`);
    console.log('\n📝 Tenses covered:');
    console.log('   • Present simple, Present continuous, Present perfect');
    console.log('   • Past simple, Past continuous');
    console.log('   • Future simple, Future continuous');
    console.log('\n🔗 Access at: /activity/verb-sounds-right-quiz-1-7');
    console.log('\n✨ Import complete!\n');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importGame()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });
