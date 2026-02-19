/**
 * Script to import the "Countable vs Uncountable Nouns" matching game
 *
 * Usage: npx tsx scripts/import/import-countable-uncountable-game.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gameContent = `[ROUND 1]
phone :: Countable - you can count them (1 phone, 2 phones, 3 phones)
book :: Countable - you can count them (1 book, 2 books, 3 books)
chair :: Countable - you can count them (1 chair, 2 chairs, 3 chairs)
cup :: Countable - you can count them (1 cup, 2 cups, 3 cups)
car :: Countable - you can count them (1 car, 2 cars, 3 cars)
water :: Uncountable - a group word. You can't count it (but you can count glasses of water)
money :: Uncountable - a group word. You can't count it (but you can count dollars or coins)
advice :: Uncountable - a group word. You can't count it (but you can count pieces of advice)
time :: Uncountable - a group word. You can't count it (but you can count hours or minutes)
furniture :: Uncountable - a group word. You can't count it (but you can count chairs or tables)

[ROUND 2]
teacher :: Countable - you can count them (1 teacher, 2 teachers, 5 teachers)
restaurant :: Countable - you can count them (1 restaurant, 2 restaurants, many restaurants)
classroom :: Countable - you can count them (1 classroom, 2 classrooms, 10 classrooms)
table :: Countable - you can count them (1 table, 2 tables, 4 tables)
painting :: Countable - you can count them (1 painting, 2 paintings, many paintings)
equipment :: Uncountable - a group word. You can't count it (but you can count pieces of equipment)
luggage :: Uncountable - a group word. You can't count it (but you can count bags or suitcases)
knowledge :: Uncountable - a group word. You can't count it (but you can count facts or ideas)
traffic :: Uncountable - a group word. You can't count it (but you can count cars in a jam)
weather :: Uncountable - a group word. You can't count it (but you can count days with different weather)

[ROUND 3]
house :: Countable - you can count them (1 house, 2 houses, 10 houses)
store :: Countable - you can count them (1 store, 2 stores, 5 stores)
desk :: Countable - you can count them (1 desk, 2 desks, 3 desks)
window :: Countable - you can count them (1 window, 2 windows, 4 windows)
email :: Countable - you can count them (1 email, 2 emails, 50 emails)
work :: Uncountable - a group word. You can't count it (but you can count jobs or tasks)
silence :: Uncountable - a group word. You can't count it (silence is peaceful or it isn't)
light :: Uncountable - a group word. You can't count it (but you can count lights or lamps)
bread :: Uncountable - a group word. You can't count it (but you can count loaves or slices)
milk :: Uncountable - a group word. You can't count it (but you can count cups of milk)

[ROUND 4]
project :: Countable - you can count them (1 project, 2 projects, many projects)
lesson :: Countable - you can count them (1 lesson, 2 lessons, 5 lessons)
question :: Countable - you can count them (1 question, 2 questions, many questions)
goal :: Countable - you can count them (1 goal, 2 goals, 3 goals)
actor :: Countable - you can count them (1 actor, 2 actors, many actors)
stress :: Uncountable - a group word. You can't count it (but you can count stressful moments)
patience :: Uncountable - a group word. You can't count it (you either have patience or not)
happiness :: Uncountable - a group word. You can't count it (but you can count happy moments)
progress :: Uncountable - a group word. You can't count it (but you can count milestones)
creativity :: Uncountable - a group word. You can't count it (but you can count creative ideas)

[ROUND 5]
apartment :: Countable - you can count them (1 apartment, 2 apartments, many apartments)
assignment :: Countable - you can count them (1 assignment, 2 assignments, several assignments)
document :: Countable - you can count them (1 document, 2 documents, stacks of documents)
package :: Countable - you can count them (1 package, 2 packages, 6 packages)
ticket :: Countable - you can count them (1 ticket, 2 tickets, 10 tickets)
information :: Uncountable - a group word. You can't count it (but you can count facts or pieces)
experience :: Uncountable - a group word. You can't count it (but you can count experiences or events)
energy :: Uncountable - a group word. You can't count it (but you can count bursts of energy)
safety :: Uncountable - a group word. You can't count it (but you can count safety checks)
nutrition :: Uncountable - a group word. You can't count it (but you can count nutrients or meals)

[ROUND 6]
conversation :: Countable - you can count them (1 conversation, 2 conversations, many conversations)
opportunity :: Countable - you can count them (1 opportunity, 2 opportunities, several opportunities)
gesture :: Countable - you can count them (1 gesture, 2 gestures, many gestures)
problem :: Countable - you can count them (1 problem, 2 problems, multiple problems)
resource :: Countable - you can count them (1 resource, 2 resources, many resources)
kindness :: Uncountable - a group word. You can't count it (but you can count kind acts)
trust :: Uncountable - a group word. You can't count it (but you can count moments of trust)
support :: Uncountable - a group word. You can't count it (but you can count support messages)
growth :: Uncountable - a group word. You can't count it (but you can count growth spurts)
freedom :: Uncountable - a group word. You can't count it (but you can count freedoms or rights)`;

async function importGame() {
    try {
        console.log('🎮 Starting Countable vs Uncountable Nouns game import...\n');

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
            where: { id: 'countable-uncountable-nouns' }
        });

        if (existing) {
            console.log('⚠️  Activity already exists. Updating content...\n');

            const updated = await prisma.activity.update({
                where: { id: 'countable-uncountable-nouns' },
                data: {
                    title: 'Countable vs Uncountable Nouns',
                    description: 'Learn to identify which nouns are countable (jobs, hours, apartments) and which are uncountable (money, time, experience). This is essential for using quantifiers like many/much, few/little, and fewer/less correctly.',
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
                    id: 'countable-uncountable-nouns',
                    title: 'Countable vs Uncountable Nouns',
                    description: 'Learn to identify which nouns are countable (jobs, hours, apartments) and which are uncountable (money, time, experience). This is essential for using quantifiers like many/much, few/little, and fewer/less correctly.',
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
        console.log(`   Activity ID: countable-uncountable-nouns`);
        console.log(`   Activity Type: game (matching)`);
        console.log(`   Category: games`);
        console.log(`   Level: intermediate`);
        console.log(`   Noun Pairs: 60`);
        console.log('\n🔗 Access at: /activity/countable-uncountable-nouns');
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
