const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const studentNames = [
    'Ricardo',
    'Andrea',
    'Carolina',
    'Ingrid',
    'Elena',
    'Ever',
    'Carlos M',
    'Edwar',
    'Alexandra',
    'Sonia',
    'Erica',
    'Carlos O',
    'Julian',
    'Esteban',
    'Esmeralda',
    'Susan',
    'Will',
    'Marlie',
    'Tolesa',
    'Yonatan',
    'Hazel',
    'Evelyn',
];

const toUsername = (name) => name.trim().toLowerCase().replace(/\s+/g, '');

// SECURITY: Industry-standard bcrypt rounds for 2025 (matches src/lib/auth-config.ts)
const BCRYPT_ROUNDS = 12;

async function upsertUser(username, name, role = 'student', mustChangePassword = true) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    return prisma.user.upsert({
        where: { username },
        update: {
            // Don't overwrite existing passwords or mustChangePassword flags
            name,
            role,
        },
        create: {
            username,
            name,
            password: passwordHash,
            role,
            mustChangePassword,
        },
    });
}

async function main() {
    // Create teacher (with mustChangePassword = true)
    const teacher = await upsertUser('teacher', 'Teacher User', 'teacher', true);

    // Create all students
    const students = [];
    for (const name of studentNames) {
        const username = toUsername(name);
        const student = await upsertUser(username, name, 'student');
        students.push(student);
    }

    // Create ESOL 3 class
    const esol3Class = await prisma.class.upsert({
        where: { code: 'ESOL3' },
        update: {},
        create: {
            name: 'ESOL 3',
            description: 'ESOL Level 3 - Your Class',
            code: 'ESOL3',
            teacherId: teacher.id,
        },
    });

    // Enroll all students in ESOL 3
    for (const student of students) {
        await prisma.classEnrollment.upsert({
            where: {
                classId_studentId: {
                    classId: esol3Class.id,
                    studentId: student.id,
                },
            },
            update: {},
            create: {
                classId: esol3Class.id,
                studentId: student.id,
            },
        });
    }

    // NOTE: Legacy cleanup removed to preserve student progress
    // Old activities are now left in place rather than deleted
    // Use db:seed:full for a complete reset if needed


    // NOTE: Tense guide stubs removed - we now use full-content guides from individual seed files
    // The following guides are created with full content elsewhere:
    // - All Simple Tenses (Present, Past, Future)
    // - All Continuous Tenses (Present, Past, Future)
    // - All Perfect Tenses (Present, Past, Future)
    // - All Perfect Continuous Tenses (Present, Past, Future)
    // - Tense Review Guides (Simple, Continuous, Perfect, Perfect Continuous)

    // -------------------------
    // Additional Grammar Guides
    // -------------------------
    const additionalGrammarGuides = [
        {
            id: 'parts-of-speech',
            title: 'Parts of Speech Guide',
            description: 'Master nouns, verbs, adjectives, and adverbs — the building blocks of English sentences.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/parts-of-speech',
        },
        {
            id: 'superlatives-quantifiers',
            title: 'Superlatives & Quantifiers Guide',
            description: 'Compare and describe with superlatives (most/least) and quantifiers (many/much, fewer/less, a few/a little).',
            level: 'intermediate',
            externalUrl: '/grammar-reader/superlatives-quantifiers',
        },
        {
            id: 'information-questions',
            title: 'Information Questions Guide',
            description: 'Master WH-questions: who, what, when, where, why, how — plus how much vs how many and correct word order.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/information-questions',
        },
        {
            id: 'modals-obligation-permission',
            title: 'Modals for Obligation & Permission Guide',
            description: 'Use must/have to/should and can/may/could to talk about rules, permission, and polite requests at work and in daily life.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/modals-obligation-permission',
        },
        {
            id: 'workplace-phrasal-verbs',
            title: 'Workplace Phrasal Verbs Guide',
            description: 'Learn high-frequency workplace phrasal verbs (clock in/out, fill in, call out) with clear meanings and practice.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/workplace-phrasal-verbs',
        },
        {
            id: 'used-to-would-rather',
            title: 'Used To & Would Rather Guide',
            description: "Talk about past habits with 'used to' and express preferences with 'would rather' for everyday and work situations.",
            level: 'intermediate',
            externalUrl: '/grammar-reader/used-to-would-rather',
        },
        {
            id: 'imperatives-declaratives',
            title: 'Imperatives vs Declaratives Guide',
            description: "Give advice and instructions with imperatives (Don't..., Please...) and compare to statements (You should...).",
            level: 'intermediate',
            externalUrl: '/grammar-reader/imperatives-declaratives',
        },
        {
            id: 'reported-speech',
            title: 'Reported Speech Guide',
            description: 'Report what someone said using tense shifts, reporting verbs, and pronoun/time changes with guided practice.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/reported-speech',
        },
        {
            id: 'passive-voice',
            title: 'Passive Voice Guide',
            description: 'Use be + past participle to focus on the action (and the result) when the doer is unknown or unimportant.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/passive-voice',
        },
        {
            id: 'conditionals-second',
            title: 'Second Conditional Guide',
            description: 'Express hypothetical and unlikely situations using if + past, would + verb. Perfect for dreams, advice, and "what if" scenarios.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/conditionals-second',
        },
        {
            id: 'conditionals-review',
            title: 'Conditionals Review Guide',
            description: 'Master all conditional types (zero, first, second) with side-by-side comparisons and decision tools to choose the right one.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/conditionals-review',
        },
        {
            id: 'paragraph-format',
            title: 'Paragraph Format Guide',
            description: 'Write clear paragraphs with topic sentences, supporting details, and conclusions — plus organization and transitions.',
            level: 'intermediate',
            externalUrl: '/grammar-reader/paragraph-format',
        },
        {
            id: 'punctuation-capitalization',
            title: 'Punctuation & Capitalization Guide',
            description: 'Improve writing clarity with basic punctuation and capitalization rules (sentences, commas, quotes, and common mistakes).',
            level: 'intermediate',
            externalUrl: '/grammar-reader/punctuation-capitalization',
        },
    ];

    for (const guide of additionalGrammarGuides) {
        const upserted = await prisma.activity.upsert({
            where: { id: guide.id },
            update: {
                title: guide.title,
                description: guide.description,
                type: 'guide',
                category: 'grammar',
                level: guide.level,
                content: JSON.stringify({ externalUrl: guide.externalUrl }),
                createdBy: teacher.id,
            },
            create: {
                id: guide.id,
                title: guide.title,
                description: guide.description,
                type: 'guide',
                category: 'grammar',
                level: guide.level,
                content: JSON.stringify({ externalUrl: guide.externalUrl }),
                createdBy: teacher.id,
            },
        });
        console.log('📚 Grammar guide added:', upserted.title);
    }

    // Update Vocab September Flashcards
    const vocabSeptemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-september-flashcards' },
        update: {
            title: 'Unit 1: Getting to Know You — Flash Cards',
            description: 'Unit 1 flash cards: Getting to Know You',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) background — your life experiences and history
   Example: Her art background helps her design posters quickly.

2) registration — the process of signing up for school or services
   Example: Online registration closes on Friday.

3) vocational — education/training that prepares you for a specific job
   Example: He joined a vocational program to become a mechanic.

4) motivation — the reason or drive behind someone's actions or goals
   Example: Her motivation for studying English is to get a better job.

5) transition — the process of change from one situation to another
   Example: Moving to a new country can be a big transition.

6) immigration — moving to a new country to live permanently
   Example: Her immigration story inspires her classmates.

7) commitment — dedication to a task, goal, or promise
   Example: His commitment to homework shows in his grades.

8) barrier — something that blocks or makes it difficult to move forward
   Example: Lack of childcare is a barrier to attending class.

9) opportunity — a chance to do something or achieve success
   Example: The job fair is an opportunity to meet employers.

10) qualification — proof of training or education
   Example: She needs a qualification to apply for the nursing program.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-september-flashcards',
            title: 'Unit 1: Flash Cards',
            description: 'Unit 1 flash cards: Getting to Know You',
            type: 'game',
            category: 'Unit 1: Flash Cards',
            level: 'intermediate',
            content: `1) background — your life experiences and history
   Example: Her art background helps her design posters quickly.

2) registration — the process of signing up for school or services
   Example: Online registration closes on Friday.

3) vocational — education/training that prepares you for a specific job
   Example: He joined a vocational program to become a mechanic.

4) motivation — the reason or drive behind someone's actions or goals
   Example: Her motivation for studying English is to get a better job.

5) transition — the process of change from one situation to another
   Example: Moving to a new country can be a big transition.

6) immigration — moving to a new country to live permanently
   Example: Her immigration story inspires her classmates.

7) commitment — dedication to a task, goal, or promise
   Example: His commitment to homework shows in his grades.

8) barrier — something that blocks or makes it difficult to move forward
   Example: Lack of childcare is a barrier to attending class.

9) opportunity — a chance to do something or achieve success
   Example: The job fair is an opportunity to meet employers.

10) qualification — proof of training or education
   Example: She needs a qualification to apply for the nursing program.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab September Flashcards updated:', vocabSeptemberFlashcards.title);

    // October Flashcards
    const vocabOctoberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-october-flashcards' },
        update: {
            title: 'Unit 2: Daily Life in the Community — Flash Cards',
            description: 'Unit 2 flash cards: Daily Life in the Community',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) obstacle — something that blocks your way or makes progress difficult
   Example: Language was an obstacle at first, but she overcame it.

2) reliable — trustworthy and dependable
   Example: He is a reliable worker who is never late.

3) beneficial — helpful or advantageous
   Example: Exercise is beneficial for your health.

4) harmful — causing damage or injury
   Example: Smoking is harmful to your lungs.

5) distraction — something that takes your attention away
   Example: My phone is a distraction when I study.

6) concentrate — to focus all your attention on something
   Example: I need silence to concentrate on my homework.

7) improve — to make or become better
   Example: She wants to improve her English skills.

8) go over — to review or examine something
   Example: Let's go over the lesson one more time.

9) outgoing — friendly and sociable
   Example: She is very outgoing and makes friends easily.

10) reserved — quiet and not showing emotions openly
   Example: He is more reserved and prefers to listen.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-october-flashcards',
            title: 'Unit 2: Flash Cards',
            description: 'Unit 2 flash cards: Daily Life in the Community',
            type: 'game',
            category: 'Unit 2: Flash Cards',
            level: 'intermediate',
            content: `1) obstacle — something that blocks your way or makes progress difficult
   Example: Language was an obstacle at first, but she overcame it.

2) reliable — trustworthy and dependable
   Example: He is a reliable worker who is never late.

3) beneficial — helpful or advantageous
   Example: Exercise is beneficial for your health.

4) harmful — causing damage or injury
   Example: Smoking is harmful to your lungs.

5) distraction — something that takes your attention away
   Example: My phone is a distraction when I study.

6) concentrate — to focus all your attention on something
   Example: I need silence to concentrate on my homework.

7) improve — to make or become better
   Example: She wants to improve her English skills.

8) go over — to review or examine something
   Example: Let's go over the lesson one more time.

9) outgoing — friendly and sociable
   Example: She is very outgoing and makes friends easily.

10) reserved — quiet and not showing emotions openly
   Example: He is more reserved and prefers to listen.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab October Flashcards updated:', vocabOctoberFlashcards.title);

    // November Flashcards
    const vocabNovemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-november-flashcards' },
        update: {
            title: 'Unit 3: Community Participation — Flash Cards',
            description: 'Unit 3 flash cards: Community Participation',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) waived — not required to pay
   Example: The fee was waived for low-income families.

2) tab — a section on a website you can click
   Example: Click the 'Contact' tab to find our phone number.

3) errands — short trips to accomplish tasks
   Example: I need to run some errands after work.

4) navigate — to find your way or move through a place or website
   Example: She learned to navigate the bus system.

5) urgently — very quickly or needing fast help
   Example: We need this done urgently.

6) fundraiser — an event to raise money for a cause
   Example: The school held a fundraiser for new books.

7) courthouse — a building where legal cases are heard
   Example: We went to the courthouse to file paperwork.

8) entry-level — suitable for beginners with little experience
   Example: He found an entry-level job at the warehouse.

9) affordable — reasonably priced; not too expensive
   Example: We're looking for affordable housing.

10) relocate — to move to a new place
   Example: The company will relocate to a bigger office.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-november-flashcards',
            title: 'Unit 3: Flash Cards',
            description: 'Unit 3 flash cards: Community Participation',
            type: 'game',
            category: 'Unit 3: Flash Cards',
            level: 'intermediate',
            content: `1) waived — not required to pay
   Example: The fee was waived for low-income families.

2) tab — a section on a website you can click
   Example: Click the 'Contact' tab to find our phone number.

3) errands — short trips to accomplish tasks
   Example: I need to run some errands after work.

4) navigate — to find your way or move through a place or website
   Example: She learned to navigate the bus system.

5) urgently — very quickly or needing fast help
   Example: We need this done urgently.

6) fundraiser — an event to raise money for a cause
   Example: The school held a fundraiser for new books.

7) courthouse — a building where legal cases are heard
   Example: We went to the courthouse to file paperwork.

8) entry-level — suitable for beginners with little experience
   Example: He found an entry-level job at the warehouse.

9) affordable — reasonably priced; not too expensive
   Example: We're looking for affordable housing.

10) relocate — to move to a new place
   Example: The company will relocate to a bigger office.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab November Flashcards updated:', vocabNovemberFlashcards.title);

    // December Flashcards
    const vocabDecemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-december-flashcards' },
        update: {
            title: 'Unit 4: Consumer Smarts — Flash Cards',
            description: 'Unit 4 flash cards: Consumer Smarts',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) installation — the process of setting up equipment
   Example: The installation of the new AC takes two hours.

2) included — part of the package or price
   Example: Breakfast is included in the hotel rate.

3) disadvantages — unfavorable conditions or drawbacks
   Example: What are the disadvantages of this plan?

4) refund — money returned after a purchase
   Example: I got a full refund for the defective product.

5) scam — a dishonest scheme or fraud
   Example: That email is a scam—don't click it.

6) warranty — a guarantee for repairs or replacements
   Example: The laptop comes with a one-year warranty.

7) expire — to come to an end or no longer be valid
   Example: My coupon will expire next week.

8) outlet — a store selling goods at reduced prices
   Example: We shop at the outlet for deals.

9) installments — payments made in parts over time
   Example: You can pay in monthly installments.

10) commission — a payment based on sales made
   Example: She earns a commission on each sale.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-december-flashcards',
            title: 'Unit 4: Flash Cards',
            description: 'Unit 4 flash cards: Consumer Smarts',
            type: 'game',
            category: 'Unit 4: Flash Cards',
            level: 'intermediate',
            content: `1) installation — the process of setting up equipment
   Example: The installation of the new AC takes two hours.

2) included — part of the package or price
   Example: Breakfast is included in the hotel rate.

3) disadvantages — unfavorable conditions or drawbacks
   Example: What are the disadvantages of this plan?

4) refund — money returned after a purchase
   Example: I got a full refund for the defective product.

5) scam — a dishonest scheme or fraud
   Example: That email is a scam—don't click it.

6) warranty — a guarantee for repairs or replacements
   Example: The laptop comes with a one-year warranty.

7) expire — to come to an end or no longer be valid
   Example: My coupon will expire next week.

8) outlet — a store selling goods at reduced prices
   Example: We shop at the outlet for deals.

9) installments — payments made in parts over time
   Example: You can pay in monthly installments.

10) commission — a payment based on sales made
   Example: She earns a commission on each sale.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab December Flashcards updated:', vocabDecemberFlashcards.title);

    // January Flashcards
    const vocabJanuaryFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-january-flashcards' },
        update: {
            title: 'Unit 5: Housing — Flash Cards',
            description: 'Unit 5 flash cards: Housing',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) spacious — having plenty of room
   Example: The apartment is very spacious and bright.

2) deposit — money paid upfront as security
   Example: The landlord requires a security deposit.

3) utilities — services like water, gas, and electricity
   Example: Utilities are not included in the rent.

4) tenant — a person who rents property
   Example: The tenant must pay rent on the first.

5) landlord — the owner of rental property
   Example: Call the landlord if something breaks.

6) equivalent — equal in value or meaning
   Example: This is equivalent to two months' rent.

7) stable — steady and not likely to change
   Example: He has a stable job and good income.

8) lease — a rental agreement or contract
   Example: We signed a one-year lease.

9) property — land or buildings owned by someone
   Example: The property includes a garage.

10) maintenance — the upkeep and repair of something
   Example: Maintenance of the building is the landlord's job.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-january-flashcards',
            title: 'Unit 5: Flash Cards',
            description: 'Unit 5 flash cards: Housing',
            type: 'game',
            category: 'Unit 5: Flash Cards',
            level: 'intermediate',
            content: `1) spacious — having plenty of room
   Example: The apartment is very spacious and bright.

2) deposit — money paid upfront as security
   Example: The landlord requires a security deposit.

3) utilities — services like water, gas, and electricity
   Example: Utilities are not included in the rent.

4) tenant — a person who rents property
   Example: The tenant must pay rent on the first.

5) landlord — the owner of rental property
   Example: Call the landlord if something breaks.

6) equivalent — equal in value or meaning
   Example: This is equivalent to two months' rent.

7) stable — steady and not likely to change
   Example: He has a stable job and good income.

8) lease — a rental agreement or contract
   Example: We signed a one-year lease.

9) property — land or buildings owned by someone
   Example: The property includes a garage.

10) maintenance — the upkeep and repair of something
   Example: Maintenance of the building is the landlord's job.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab January Flashcards updated:', vocabJanuaryFlashcards.title);

    // February Flashcards
    const vocabFebruaryFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-february-flashcards' },
        update: {
            title: 'Unit 6: Workforce Preparation — Flash Cards',
            description: 'Unit 6 flash cards: Workforce Preparation',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) under pressure — experiencing stress or urgency
   Example: She works well under pressure.

2) fast-paced — moving or happening quickly
   Example: This is a fast-paced work environment.

3) environment — the surroundings or conditions
   Example: We have a friendly work environment.

4) prior — existing or coming before
   Example: Do you have prior experience in sales?

5) detail-oriented — careful about small details
   Example: This job requires a detail-oriented person.

6) fluent — able to speak smoothly and easily
   Example: She is fluent in Spanish and English.

7) preferences — things you like better than others
   Example: What are your schedule preferences?

8) role — a job or position
   Example: What is your role in the company?

9) self-confidence — belief in your own abilities
   Example: Building self-confidence takes practice.

10) enthusiasm — strong excitement or interest
   Example: She showed great enthusiasm in the interview.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-february-flashcards',
            title: 'Unit 6: Flash Cards',
            description: 'Unit 6 flash cards: Workforce Preparation',
            type: 'game',
            category: 'Unit 6: Flash Cards',
            level: 'intermediate',
            content: `1) under pressure — experiencing stress or urgency
   Example: She works well under pressure.

2) fast-paced — moving or happening quickly
   Example: This is a fast-paced work environment.

3) environment — the surroundings or conditions
   Example: We have a friendly work environment.

4) prior — existing or coming before
   Example: Do you have prior experience in sales?

5) detail-oriented — careful about small details
   Example: This job requires a detail-oriented person.

6) fluent — able to speak smoothly and easily
   Example: She is fluent in Spanish and English.

7) preferences — things you like better than others
   Example: What are your schedule preferences?

8) role — a job or position
   Example: What is your role in the company?

9) self-confidence — belief in your own abilities
   Example: Building self-confidence takes practice.

10) enthusiasm — strong excitement or interest
   Example: She showed great enthusiasm in the interview.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab February Flashcards updated:', vocabFebruaryFlashcards.title);

    // March Flashcards
    const vocabMarchFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-march-flashcards' },
        update: {
            title: 'Unit 7: Career Awareness — Flash Cards',
            description: 'Unit 7 flash cards: Career Awareness',
            type: 'game',
            category: 'Vocab',
            level: 'intermediate',
            content: `1) behavior — the way someone acts
   Example: Professional behavior is important at work.

2) criticize — to point out faults or problems
   Example: Don't criticize without offering solutions.

3) ambitious — having strong desires for success
   Example: She is ambitious and wants to be a manager.

4) courtesy — polite and respectful behavior
   Example: He always treats customers with courtesy.

5) strict — demanding exact obedience to rules
   Example: The supervisor is strict about punctuality.

6) gross pay — total earnings before deductions
   Example: My gross pay is $2,000 per month.

7) deductions — amounts subtracted from pay
   Example: Deductions include taxes and insurance.

8) coordinate — to organize and arrange activities
   Example: I coordinate meetings for the team.

9) recruit — to hire or enlist new people
   Example: The company will recruit new employees.

10) take on — to accept a new responsibility
   Example: She's ready to take on more tasks.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-march-flashcards',
            title: 'Unit 7: Flash Cards',
            description: 'Unit 7 flash cards: Career Awareness',
            type: 'game',
            category: 'Unit 7: Flash Cards',
            level: 'intermediate',
            content: `1) behavior — the way someone acts
   Example: Professional behavior is important at work.

2) criticize — to point out faults or problems
   Example: Don't criticize without offering solutions.

3) ambitious — having strong desires for success
   Example: She is ambitious and wants to be a manager.

4) courtesy — polite and respectful behavior
   Example: He always treats customers with courtesy.

5) strict — demanding exact obedience to rules
   Example: The supervisor is strict about punctuality.

6) gross pay — total earnings before deductions
   Example: My gross pay is $2,000 per month.

7) deductions — amounts subtracted from pay
   Example: Deductions include taxes and insurance.

8) coordinate — to organize and arrange activities
   Example: I coordinate meetings for the team.

9) recruit — to hire or enlist new people
   Example: The company will recruit new employees.

10) take on — to accept a new responsibility
   Example: She's ready to take on more tasks.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab March Flashcards updated:', vocabMarchFlashcards.title);

    // April Flashcards
    const vocabAprilFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-april-flashcards' },
        update: {
            title: 'Unit 8: Flash Cards',
            description: 'Unit 8 flash cards: Health',
            type: 'game',
            category: 'Unit 8: Flash Cards',
            level: 'intermediate',
            content: `1) infected — affected by harmful bacteria or viruses
   Example: The wound became infected.

2) depressed — feeling very sad or hopeless
   Example: He felt depressed after losing his job.

3) inflamed — red, swollen, and painful
   Example: Her throat is inflamed from the infection.

4) pediatrician — a doctor for children
   Example: The pediatrician checked the baby's growth.

5) cardiologist — a heart doctor
   Example: The cardiologist performed a heart test.

6) bladder — organ that stores urine
   Example: She has a bladder infection.

7) liver — organ that filters blood
   Example: Alcohol can damage your liver.

8) kidneys — organs that filter waste from your blood
   Example: Drink water to keep your kidneys healthy.

9) pancreas — organ that produces insulin
   Example: Diabetes affects the pancreas.

10) stroke — when blood flow to the brain is blocked
   Example: High blood pressure can cause a stroke.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-april-flashcards',
            title: 'Unit 8: Flash Cards',
            description: 'Unit 8 flash cards: Health',
            type: 'game',
            category: 'Unit 8: Flash Cards',
            level: 'intermediate',
            content: `1) infected — affected by harmful bacteria or viruses
   Example: The wound became infected.

2) depressed — feeling very sad or hopeless
   Example: He felt depressed after losing his job.

3) inflamed — red, swollen, and painful
   Example: Her throat is inflamed from the infection.

4) pediatrician — a doctor for children
   Example: The pediatrician checked the baby's growth.

5) cardiologist — a heart doctor
   Example: The cardiologist performed a heart test.

6) bladder — organ that stores urine
   Example: She has a bladder infection.

7) liver — organ that filters blood
   Example: Alcohol can damage your liver.

8) kidneys — organs that filter waste from your blood
   Example: Drink water to keep your kidneys healthy.

9) pancreas — organ that produces insulin
   Example: Diabetes affects the pancreas.

10) stroke — when blood flow to the brain is blocked
   Example: High blood pressure can cause a stroke.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab April Flashcards updated:', vocabAprilFlashcards.title);

    // May Flashcards
    const vocabMayFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-may-flashcards' },
        update: {
            title: 'Unit 9: Flash Cards',
            description: 'Unit 9 flash cards: Holistic Wellness',
            type: 'game',
            category: 'Unit 9: Flash Cards',
            level: 'intermediate',
            content: `1) addiction — dependence on a harmful substance or activity
   Example: He is recovering from alcohol addiction.

2) self-esteem — confidence in your own worth
   Example: Positive feedback boosts self-esteem.

3) sustain — to maintain or keep going
   Example: Exercise helps sustain energy levels.

4) recreational — done for enjoyment and relaxation
   Example: Swimming is a recreational activity.

5) well-being — the state of being healthy and happy
   Example: Meditation improves well-being.

6) regimen — a systematic plan or routine
   Example: She follows a daily exercise regimen.

7) hydration — the process of drinking enough water
   Example: Proper hydration is important in hot weather.

8) moderation — avoiding excess; keeping balance
   Example: Eat sweets in moderation.

9) coping skills — strategies for dealing with stress
   Example: Therapy teaches coping skills for anxiety.

10) burnout — extreme physical, mental, or emotional tiredness caused by too much work, stress, or lack of rest
   Example: Work burnout is common in healthcare.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-may-flashcards',
            title: 'Unit 9: Flash Cards',
            description: 'Unit 9 flash cards: Holistic Wellness',
            type: 'game',
            category: 'Unit 9: Flash Cards',
            level: 'intermediate',
            content: `1) addiction — dependence on a harmful substance or activity
   Example: He is recovering from alcohol addiction.

2) self-esteem — confidence in your own worth
   Example: Positive feedback boosts self-esteem.

3) sustain — to maintain or keep going
   Example: Exercise helps sustain energy levels.

4) recreational — done for enjoyment and relaxation
   Example: Swimming is a recreational activity.

5) well-being — the state of being healthy and happy
   Example: Meditation improves well-being.

6) regimen — a systematic plan or routine
   Example: She follows a daily exercise regimen.

7) hydration — the process of drinking enough water
   Example: Proper hydration is important in hot weather.

8) moderation — avoiding excess; keeping balance
   Example: Eat sweets in moderation.

9) coping skills — strategies for dealing with stress
   Example: Therapy teaches coping skills for anxiety.

10) burnout — extreme physical, mental, or emotional tiredness caused by too much work, stress, or lack of rest
   Example: Work burnout is common in healthcare.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab May Flashcards updated:', vocabMayFlashcards.title);

    // June Flashcards
    const vocabJuneFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-june-flashcards' },
        update: {
            title: 'Unit 10: Flash Cards',
            description: 'Unit 10 flash cards: Future Academic Goals',
            type: 'game',
            category: 'Unit 10: Flash Cards',
            level: 'intermediate',
            content: `1) personal growth — improvement and development of yourself
   Example: Reading promotes personal growth.

2) networking — building professional relationships
   Example: Networking helps you find job opportunities.

3) decision-making — the process of making choices
   Example: Good decision-making requires careful thought.

4) professional development — improving job-related skills
   Example: The workshop focuses on professional development.`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-june-flashcards',
            title: 'Unit 10: Flash Cards',
            description: 'Unit 10 flash cards: Future Academic Goals',
            type: 'game',
            category: 'Unit 10: Flash Cards',
            level: 'intermediate',
            content: `1) personal growth — improvement and development of yourself
   Example: Reading promotes personal growth.

2) networking — building professional relationships
   Example: Networking helps you find job opportunities.

3) decision-making — the process of making choices
   Example: Good decision-making requires careful thought.

4) professional development — improving job-related skills
   Example: The workshop focuses on professional development.`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab June Flashcards updated:', vocabJuneFlashcards.title);

    const articlesGuide = await prisma.activity.upsert({
        where: { id: 'articles-community-resources-guide' },
        update: {
            title: 'Articles & References for Community Resources Guide',
            description: 'Learn how to use a/an/the and the zero article when talking about housing, jobs, and health services in East Boston.',
            type: 'guide',
            category: 'grammar',
            level: 'beginner',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/articles-community-resources'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'articles-community-resources-guide',
            title: 'Articles & References for Community Resources Guide',
            description: 'Learn how to use a/an/the and the zero article when talking about housing, jobs, and health services in East Boston.',
            type: 'guide',
            category: 'grammar',
            level: 'beginner',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/articles-community-resources'
            }),
            createdBy: teacher.id,
        },
    });
    console.log('📚 Articles & References guide added:', articlesGuide.title);

    const prepositionsGuide = await prisma.activity.upsert({
        where: { id: 'prepositions-time-place-guide' },
        update: {
            title: 'Prepositions of Time & Place Guide',
            description: 'Practice at/on/in and other prepositions to give clear directions and talk about schedules.',
            type: 'guide',
            category: 'grammar',
            level: 'beginner',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/prepositions-time-place'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'prepositions-time-place-guide',
            title: 'Prepositions of Time & Place Guide',
            description: 'Practice at/on/in and other prepositions to give clear directions and talk about schedules.',
            type: 'guide',
            category: 'grammar',
            level: 'beginner',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/prepositions-time-place'
            }),
            createdBy: teacher.id,
        },
    });
    console.log('📚 Prepositions of Time & Place guide added:', prepositionsGuide.title);

    // -------------------------
    // Numbers Game
    // -------------------------
    const numbersGame = await prisma.activity.upsert({
        where: { id: 'numbers-game' },
        update: {
            title: 'Numbers to English Words',
            description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
            category: 'games',
            type: 'game',
            level: 'beginner',
            content: JSON.stringify({
                type: 'numbers-game',
                category: 'Basic Numbers (0-99)'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'numbers-game',
            title: 'Numbers to English Words',
            description: 'Practice converting numbers to their English word equivalents. Choose from various categories including basic numbers, hundreds, thousands, ordinals, and years.',
            category: 'games',
            type: 'game',
            level: 'beginner',
            content: JSON.stringify({
                type: 'numbers-game',
                category: 'Basic Numbers (0-99)'
            }),
            createdBy: teacher.id,
        },
    });
    console.log('🎮 Numbers Game added:', numbersGame.title);

    console.log('✅ Seeded database with teacher, ESOL 3 class, students, and grammar guides');
    console.log('👥 Students added:', students.length);
    console.log('📚 Note: Tense guides are seeded separately with full content (not stub URLs)');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
