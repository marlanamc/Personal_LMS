/**
 * Script to import the "Time Indicators Sorting Game"
 *
 * This game teaches students which time expressions require Past Simple (specified time)
 * vs Present Perfect (unspecified time). Difficulty increases across 6 rounds.
 *
 * Usage: npx tsx scripts/import/import-time-indicators-game.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gameContent = `[ROUND 1]
yesterday :: Specified - A specific past day. Use Past Simple: "I worked yesterday."
last week :: Specified - A specific past week. Use Past Simple: "She visited last week."
in 2020 :: Specified - A specific year. Use Past Simple: "We moved in 2020."
ago :: Specified - A specific time before now. Use Past Simple: "I started two years ago."
when I was young :: Specified - A specific time in your life. Use Past Simple: "When I was young, I played soccer."
ever :: Unspecified - At any time in your life (no specific time). Use Present Perfect: "Have you ever tried sushi?"
never :: Unspecified - Not at any time (no specific time). Use Present Perfect: "I have never been to Paris."
already :: Unspecified - Before now (exact time not important). Use Present Perfect: "She has already finished."
yet :: Unspecified - Up to now (expecting something to happen). Use Present Perfect: "Have you finished yet?"
just :: Unspecified - A very short time ago (exact time not important). Use Present Perfect: "I have just arrived."

[ROUND 2]
last month :: Specified - A specific past month. Use Past Simple: "I paid the rent last month."
last year :: Specified - A specific past year. Use Past Simple: "They graduated last year."
on Monday :: Specified - A specific day. Use Past Simple: "We met on Monday."
at 3 o'clock :: Specified - A specific time. Use Past Simple: "The meeting started at 3 o'clock."
when :: Specified - Asking about a specific time. Use Past Simple: "When did you arrive?"
for (+ time) :: Unspecified - Duration up to now. Use Present Perfect: "I have lived here for 5 years."
since :: Unspecified - From a starting point to now. Use Present Perfect: "She has worked here since 2019."
recently :: Unspecified - In the near past (no specific time). Use Present Perfect: "I have recently started a new job."
lately :: Unspecified - In the recent period (no specific time). Use Present Perfect: "Have you seen any good movies lately?"
so far :: Unspecified - Up to this point in time. Use Present Perfect: "So far, we have completed three projects."

[ROUND 3]
this morning :: Specified - If the morning is over, use Past Simple: "I ate breakfast this morning."
last night :: Specified - The previous night (finished). Use Past Simple: "I slept well last night."
the day before yesterday :: Specified - Two days ago. Use Past Simple: "I called her the day before yesterday."
in January :: Specified - A specific month. Use Past Simple: "It snowed in January."
that day :: Specified - A specific day being discussed. Use Past Simple: "That day, everything changed."
this week :: Unspecified - The week is not finished yet! Use Present Perfect: "I have worked hard this week."
this month :: Unspecified - The month is not finished yet! Use Present Perfect: "She has visited twice this month."
this year :: Unspecified - The year is not finished yet! Use Present Perfect: "We have traveled a lot this year."
today :: Unspecified - Today is not finished yet! Use Present Perfect: "I have had three meetings today."
still :: Unspecified - Continuing situation up to now. Use Present Perfect: "I still haven't finished."

[ROUND 4]
at that moment :: Specified - A specific moment in the past. Use Past Simple: "At that moment, I understood."
during the meeting :: Specified - A specific event time. Use Past Simple: "I took notes during the meeting."
while I was working :: Specified - During a specific past action. Use Past Simple: "While I was working, she called."
before the interview :: Specified - Before a specific past event. Use Past Simple: "I practiced before the interview."
after lunch :: Specified - After a specific past meal. Use Past Simple: "We left after lunch."
up to now :: Unspecified - From past until the present. Use Present Perfect: "Up to now, I have saved $500."
over the years :: Unspecified - During a period reaching now. Use Present Perfect: "Over the years, I have learned a lot."
many times :: Unspecified - Multiple times (no specific times). Use Present Perfect: "I have called her many times."
before :: Unspecified - At some time in the past (no specific time). Use Present Perfect: "Have you been here before?"
several times :: Unspecified - Multiple unspecified occasions. Use Present Perfect: "She has visited several times."

[ROUND 5]
just now :: Specified - A very specific recent moment. Use Past Simple: "She left just now."
a moment ago :: Specified - A specific recent time. Use Past Simple: "He was here a moment ago."
earlier today :: Specified - A specific earlier time today. Use Past Simple: "I saw him earlier today."
once :: Unspecified - One time in the past (no specific time). Use Present Perfect: "I have only been there once."
twice :: Unspecified - Two times (no specific times). Use Present Perfect: "She has called twice."
always :: Unspecified - At all times up to now. Use Present Perfect: "I have always loved music."
all my life :: Unspecified - Your entire life up to now. Use Present Perfect: "I have lived here all my life."
not yet :: Unspecified - Up to now but expecting change. Use Present Perfect: "I haven't eaten yet."
ever since :: Unspecified - From a point in the past to now. Use Present Perfect: "Ever since then, I have been careful."
until now :: Unspecified - Up to the present moment. Use Present Perfect: "Until now, I haven't told anyone."

[ROUND 6]
the other day :: Specified - A recent but specific day. Use Past Simple: "I met her the other day."
ages ago :: Specified - A long time in the past. Use Past Simple: "That happened ages ago."
back then :: Specified - At that past time. Use Past Simple: "Back then, we didn't have smartphones."
in those days :: Specified - During that past period. Use Past Simple: "In those days, life was simpler."
at first :: Specified - At the beginning of a past situation. Use Past Simple: "At first, I didn't understand."
all week :: Unspecified - Throughout a period including now. Use Present Perfect: "I have been busy all week."
all day :: Unspecified - Throughout the day (if not finished). Use Present Perfect: "I have been working all day."
throughout my career :: Unspecified - Spanning past to present. Use Present Perfect: "I have seen many changes throughout my career."
in recent years :: Unspecified - In the past few years up to now. Use Present Perfect: "In recent years, technology has improved."
from the beginning :: Unspecified - From start until now. Use Present Perfect: "I have supported you from the beginning."`;

async function importGame() {
    try {
        console.log('🎮 Starting Time Indicators Sorting Game import...\n');

        // Find a teacher account (required for createdBy field)
        const teacher = await prisma.user.findFirst({
            where: { role: 'teacher' }
        });

        if (!teacher) {
            console.error('❌ No teacher account found. Please create a teacher account first.');
            process.exit(1);
        }

        console.log(`✓ Found teacher: ${teacher.name || teacher.username}\n`);

        // Check if activity already exists
        const existing = await prisma.activity.findUnique({
            where: { id: 'time-indicators-sorting' }
        });

        if (existing) {
            console.log('⚠️  Activity already exists. Updating content...\n');

            const updated = await prisma.activity.update({
                where: { id: 'time-indicators-sorting' },
                data: {
                    title: 'Time Indicators: Past Simple vs Present Perfect',
                    description: 'Learn which time expressions require Past Simple (specified times like "yesterday", "last week") and which require Present Perfect (unspecified times like "ever", "yet", "this week"). Difficulty increases across 6 rounds!',
                    content: gameContent,
                    type: 'game',
                    category: 'games',
                    level: 'intermediate',
                    ui: 'matching'
                }
            });

            console.log('✅ Activity updated successfully!');
            console.log(`   ID: ${updated.id}`);
            console.log(`   Type: ${updated.type}`);
            console.log(`   Category: ${updated.category}`);
        } else {
            const created = await prisma.activity.create({
                data: {
                    id: 'time-indicators-sorting',
                    title: 'Time Indicators: Past Simple vs Present Perfect',
                    description: 'Learn which time expressions require Past Simple (specified times like "yesterday", "last week") and which require Present Perfect (unspecified times like "ever", "yet", "this week"). Difficulty increases across 6 rounds!',
                    type: 'game',
                    category: 'games',
                    level: 'intermediate',
                    content: gameContent,
                    ui: 'matching',
                    createdBy: teacher.id
                }
            });

            console.log('✅ Activity created successfully!');
            console.log(`   ID: ${created.id}`);
            console.log(`   Type: ${created.type}`);
            console.log(`   Category: ${created.category}`);
        }

        console.log('\n📊 Import Summary:');
        console.log('   Activity ID: time-indicators-sorting');
        console.log('   Activity Type: game (matching)');
        console.log('   Category: games');
        console.log('   Level: intermediate');
        console.log('   Rounds: 6 (Easy → Medium → Hard)');
        console.log('   Time Expressions: 60');
        console.log('\n   Difficulty Progression:');
        console.log('     Rounds 1-2: Easy (clear-cut expressions)');
        console.log('     Rounds 3-4: Medium (context-dependent)');
        console.log('     Rounds 5-6: Hard (tricky/nuanced)');
        console.log('\n🔗 Access at: /activity/time-indicators-sorting');
        console.log('\n✨ Import complete!\n');
    } catch (error) {
        console.error('❌ Error during import:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Main execution
importGame()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Import failed:', error);
        process.exit(1);
    });
