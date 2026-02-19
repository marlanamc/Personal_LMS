const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createPresentPerfectGuide() {
    try {
        // Get teacher user
        const teacher = await prisma.user.findFirst({
            where: { role: 'teacher' }
        });

        if (!teacher) {
            throw new Error('No teacher user found. Please run seed first.');
        }

        // Create interactive guide content
        const guideContent = {
            type: 'interactive-guide',
            sections: [
                {
                    stepNumber: 1,
                    title: 'What is Present Perfect?',
                    explanation: 'Present Perfect connects the past to the present. We use it to talk about life experiences, unfinished actions, recent actions, and past actions with present results.',
                    examples: [
                        'I have been to Paris. (life experience)',
                        'I have lived here for 5 years. (unfinished action - still living)',
                        'I have just finished my homework. (recent action)',
                        'I have lost my keys. (past action with present result - I don\'t have them now)'
                    ],
                    exercises: []
                },
                {
                    stepNumber: 2,
                    title: 'Past Participles - Regular Verbs',
                    explanation: 'For regular verbs, add -ed to the base form. Spelling rules: -e → add -d | consonant + y → change y to i + -ed',
                    formula: [
                        { text: 'Base Form', type: 'subject' },
                        { text: '→', type: 'other' },
                        { text: 'Base Form + -ed', type: 'verb' }
                    ],
                    examples: [
                        'work → worked',
                        'play → played',
                        'study → studied',
                        'live → lived'
                    ],
                    exercises: [
                        {
                            title: 'Practice: Regular Past Participles',
                            instructions: 'Write the past participle form of each verb.',
                            items: [
                                { type: 'text', label: '1. walk', placeholder: 'walked', correctAnswer: 'walked' },
                                { type: 'text', label: '2. study', placeholder: 'studied', correctAnswer: 'studied' },
                                { type: 'text', label: '3. play', placeholder: 'played', correctAnswer: 'played' },
                                { type: 'text', label: '4. live', placeholder: 'lived', correctAnswer: 'lived' }
                            ]
                        }
                    ]
                },
                {
                    stepNumber: 3,
                    title: 'Past Participles - Irregular Verbs',
                    explanation: 'Irregular verbs have different forms - you must memorize them!',
                    examples: [
                        'be → been',
                        'go → gone',
                        'see → seen',
                        'do → done',
                        'eat → eaten',
                        'write → written'
                    ],
                    exercises: [
                        {
                            title: 'Practice: Irregular Past Participles',
                            instructions: 'Match the base form with its past participle.',
                            items: [
                                { type: 'select', label: '1. go', options: ['gone', 'went', 'goed'], expectedAnswer: 'gone' },
                                { type: 'select', label: '2. see', options: ['saw', 'seen', 'seed'], expectedAnswer: 'seen' },
                                { type: 'select', label: '3. do', options: ['did', 'done', 'doed'], expectedAnswer: 'done' },
                                { type: 'select', label: '4. eat', options: ['ate', 'eaten', 'eated'], expectedAnswer: 'eaten' }
                            ]
                        }
                    ]
                },
                {
                    stepNumber: 4,
                    title: 'Structure: Positive Sentences',
                    explanation: 'Subject + have/has + past participle',
                    formula: [
                        { text: 'I/You/We/They', type: 'subject' },
                        { text: 'have', type: 'verb' },
                        { text: 'past participle', type: 'object' }
                    ],
                    examples: [
                        'I have finished my homework.',
                        'You have seen that movie.',
                        'We have lived here for 5 years.',
                        'They have eaten lunch.'
                    ],
                    exercises: []
                },
                {
                    stepNumber: 5,
                    title: 'Structure: Negative Sentences',
                    explanation: 'Subject + have/has + not + past participle',
                    formula: [
                        { text: 'I/You/We/They', type: 'subject' },
                        { text: 'have not', type: 'verb' },
                        { text: 'past participle', type: 'object' }
                    ],
                    examples: [
                        'I have not finished my homework.',
                        'You have not seen that movie.',
                        'We have not lived here long.',
                        'They have not eaten lunch.'
                    ],
                    exercises: []
                },
                {
                    stepNumber: 6,
                    title: 'Structure: Questions',
                    explanation: 'Have/Has + subject + past participle?',
                    formula: [
                        { text: 'Have', type: 'verb' },
                        { text: 'I/you/we/they', type: 'subject' },
                        { text: 'past participle?', type: 'object' }
                    ],
                    examples: [
                        'Have you finished your homework?',
                        'Have they seen that movie?',
                        'Have we lived here long?',
                        'Has she eaten lunch?'
                    ],
                    exercises: [
                        {
                            title: 'Practice: Form Questions',
                            instructions: 'Change these statements into questions.',
                            items: [
                                { type: 'text', label: '1. You have finished. →', placeholder: 'Have you finished?', correctAnswer: 'Have you finished?' },
                                { type: 'text', label: '2. She has eaten. →', placeholder: 'Has she eaten?', correctAnswer: 'Has she eaten?' },
                                { type: 'text', label: '3. They have arrived. →', placeholder: 'Have they arrived?', correctAnswer: 'Have they arrived?' }
                            ]
                        }
                    ]
                },
                {
                    stepNumber: 7,
                    title: 'Time Expressions: For and Since',
                    explanation: 'Use FOR with periods of time (for 5 years, for 3 months). Use SINCE with a point in time (since 2020, since Monday).',
                    examples: [
                        'I have lived here FOR 5 years.',
                        'I have lived here SINCE 2020.',
                        'She has worked there FOR 3 months.',
                        'She has worked there SINCE January.'
                    ],
                    exercises: [
                        {
                            title: 'Practice: For or Since?',
                            instructions: 'Choose the correct word.',
                            items: [
                                { type: 'select', label: '1. I have studied English ___ 3 years.', options: ['for', 'since'], expectedAnswer: 'for' },
                                { type: 'select', label: '2. I have studied English ___ 2021.', options: ['for', 'since'], expectedAnswer: 'since' },
                                { type: 'select', label: '3. She has worked here ___ last month.', options: ['for', 'since'], expectedAnswer: 'since' },
                                { type: 'select', label: '4. They have been friends ___ a long time.', options: ['for', 'since'], expectedAnswer: 'for' }
                            ]
                        }
                    ]
                },
                {
                    stepNumber: 8,
                    title: 'Time Expressions: Already, Yet, Just',
                    explanation: 'ALREADY = completed (often earlier than expected), YET = not completed (but expected), JUST = very recently',
                    examples: [
                        'I have ALREADY finished my homework. (completed)',
                        'I haven\'t finished YET. (not completed, but will)',
                        'I have JUST finished. (very recently)'
                    ],
                    exercises: [
                        {
                            title: 'Practice: Already, Yet, or Just?',
                            instructions: 'Choose the correct word.',
                            items: [
                                { type: 'select', label: '1. I have ___ finished my homework.', options: ['already', 'yet', 'just'], expectedAnswer: 'already' },
                                { type: 'select', label: '2. Have you eaten ___?', options: ['already', 'yet', 'just'], expectedAnswer: 'yet' },
                                { type: 'select', label: '3. She has ___ arrived.', options: ['already', 'yet', 'just'], expectedAnswer: 'just' }
                            ]
                        }
                    ]
                },
                {
                    stepNumber: 9,
                    title: 'Present Perfect vs Past Simple',
                    explanation: 'Use Present Perfect for experiences without a specific time. Use Past Simple when you mention a specific time.',
                    examples: [
                        'I have been to Paris. (Present Perfect - no specific time)',
                        'I went to Paris in 2020. (Past Simple - specific time)',
                        'She has lost her keys. (Present Perfect - present result)',
                        'She lost her keys yesterday. (Past Simple - specific time)'
                    ],
                    exercises: [
                        {
                            title: 'Practice: Present Perfect or Past Simple?',
                            instructions: 'Choose the correct form.',
                            items: [
                                { type: 'select', label: '1. I ___ to Paris last year.', options: ['have been', 'went'], expectedAnswer: 'went' },
                                { type: 'select', label: '2. I ___ to Paris three times.', options: ['have been', 'went'], expectedAnswer: 'have been' },
                                { type: 'select', label: '3. She ___ her keys yesterday.', options: ['has lost', 'lost'], expectedAnswer: 'lost' },
                                { type: 'select', label: '4. She ___ her keys. (She doesn\'t have them now)', options: ['has lost', 'lost'], expectedAnswer: 'has lost' }
                            ]
                        }
                    ]
                }
            ],
            metadata: {
                source: 'legacy',
                originalFile: 'present-perfect-complete-guide.html',
                interactive: true
            }
        };

        // Create or update the activity
        const activity = await prisma.activity.upsert({
            where: { id: 'present-perfect-interactive-guide' },
            update: {
                title: 'Present Perfect - Interactive Student Guide',
                description: 'Complete interactive guide to Present Perfect tense with step-by-step explanations, examples, and practice exercises. Learn past participles, for/since, already/yet/just, and the difference between Present Perfect and Past Simple.',
                type: 'guide',
                category: 'grammar',
                level: 'intermediate',
                content: JSON.stringify(guideContent),
                createdBy: teacher.id,
            },
            create: {
                id: 'present-perfect-interactive-guide',
                title: 'Present Perfect - Interactive Student Guide',
                description: 'Complete interactive guide to Present Perfect tense with step-by-step explanations, examples, and practice exercises. Learn past participles, for/since, already/yet/just, and the difference between Present Perfect and Past Simple.',
                type: 'guide',
                category: 'grammar',
                level: 'intermediate',
                content: JSON.stringify(guideContent),
                createdBy: teacher.id,
            },
        });

        console.log('✅ Successfully created Present Perfect Interactive Guide!');
        console.log(`   Activity ID: ${activity.id}`);
        console.log(`   Title: ${activity.title}`);
        console.log(`   Sections: ${guideContent.sections.length}`);
        console.log(`   Total Exercises: ${guideContent.sections.reduce((sum, s) => sum + s.exercises.length, 0)}`);

        return activity;
    } catch (error) {
        console.error('❌ Error creating guide:', error);
        throw error;
    }
}

// Run the creation
createPresentPerfectGuide()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

