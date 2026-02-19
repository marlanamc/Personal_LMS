const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Import the same vocabulary data from update-all-vocab.js
const monthToUnit = {
    september: 1,
    october: 2,
    november: 3,
    december: 4,
    january: 5,
    february: 6,
    march: 7,
    april: 8,
    may: 9,
    june: 10,
};

const vocabData = {
    september: {
        topic: "Getting to Know You",
        words: [
            { term: "background", pos: "noun", def: "your life experiences and history", ex: "Her art background helps her design posters quickly." },
            { term: "registration", pos: "noun", def: "the process of signing up for school or services", ex: "Online registration closes on Friday." },
            { term: "vocational", pos: "adjective", def: "education/training that prepares you for a specific job", ex: "He joined a vocational program to become a mechanic." },
            { term: "motivation", pos: "noun", def: "the reason or drive behind someone's actions or goals", ex: "Her motivation for studying English is to get a better job." },
            { term: "transition", pos: "noun", def: "the process of change from one situation to another", ex: "Moving to a new country can be a big transition." },
            { term: "immigration", pos: "noun", def: "moving to a new country to live permanently", ex: "Her immigration story inspires her classmates." },
            { term: "commitment", pos: "noun", def: "dedication to a task, goal, or promise", ex: "His commitment to homework shows in his grades." },
            { term: "barrier", pos: "noun", def: "something that blocks or makes it difficult to move forward", ex: "Lack of childcare is a barrier to attending class." },
            { term: "opportunity", pos: "noun", def: "a chance to do something or achieve success", ex: "The job fair is an opportunity to meet employers." },
            { term: "qualification", pos: "noun", def: "proof of training or education", ex: "She needs a qualification to apply for the nursing program." },
        ],
    },
    october: {
        topic: "Daily Life in the Community",
        words: [
            { term: "obstacle", pos: "noun", def: "something that blocks your way or makes progress difficult", ex: "Language was an obstacle at first, but she overcame it." },
            { term: "reliable", pos: "adjective", def: "trustworthy and dependable", ex: "He is a reliable worker who is never late." },
            { term: "beneficial", pos: "adjective", def: "helpful or advantageous", ex: "Exercise is beneficial for your health." },
            { term: "harmful", pos: "adjective", def: "causing damage or injury", ex: "Smoking is harmful to your lungs." },
            { term: "distraction", pos: "noun", def: "something that takes your attention away", ex: "My phone is a distraction when I study." },
            { term: "concentrate", pos: "verb", def: "to focus all your attention on something", ex: "I need silence to concentrate on my homework." },
            { term: "improve", pos: "verb", def: "to make or become better", ex: "She wants to improve her English skills." },
            { term: "go over", pos: "phrasal verb", def: "to review or examine something", ex: "Let's go over the lesson one more time." },
            { term: "outgoing", pos: "adjective", def: "friendly and sociable", ex: "She is very outgoing and makes friends easily." },
            { term: "reserved", pos: "adjective", def: "quiet and not showing emotions openly", ex: "He is more reserved and prefers to listen." },
        ],
    },
    november: {
        topic: "Community Participation",
        words: [
            { term: "waived", pos: "verb", def: "not required to pay", ex: "The fee was waived for low-income families." },
            { term: "tab", pos: "noun", def: "a section on a website you can click", ex: "Click the 'Contact' tab to find our phone number." },
            { term: "errands", pos: "noun", def: "short trips to accomplish tasks", ex: "I need to run some errands after work." },
            { term: "navigate", pos: "verb", def: "to find your way or move through a place or website", ex: "She learned to navigate the bus system." },
            { term: "urgently", pos: "adverb", def: "very quickly or needing fast help", ex: "We need this done urgently." },
            { term: "fundraiser", pos: "noun", def: "an event to raise money for a cause", ex: "The school held a fundraiser for new books." },
            { term: "courthouse", pos: "noun", def: "a building where legal cases are heard", ex: "We went to the courthouse to file paperwork." },
            { term: "entry-level", pos: "adjective", def: "suitable for beginners with little experience", ex: "He found an entry-level job at the warehouse." },
            { term: "affordable", pos: "adjective", def: "reasonably priced; not too expensive", ex: "We're looking for affordable housing." },
            { term: "relocate", pos: "verb", def: "to move to a new place", ex: "The company will relocate to a bigger office." },
        ],
    },
    december: {
        topic: "Consumer Smarts",
        words: [
            { term: "installation", pos: "noun", def: "the process of setting up equipment", ex: "The installation of the new AC takes two hours." },
            { term: "included", pos: "adjective", def: "part of the package or price", ex: "Breakfast is included in the hotel rate." },
            { term: "disadvantages", pos: "noun", def: "unfavorable conditions or drawbacks", ex: "What are the disadvantages of this plan?" },
            { term: "refund", pos: "noun", def: "money returned after a purchase", ex: "I got a full refund for the defective product." },
            { term: "scam", pos: "noun", def: "a dishonest scheme or fraud", ex: "That email is a scam—don't click it." },
            { term: "warranty", pos: "noun", def: "a guarantee for repairs or replacements", ex: "The laptop comes with a one-year warranty." },
            { term: "expire", pos: "verb", def: "to come to an end or no longer be valid", ex: "My coupon will expire next week." },
            { term: "outlet", pos: "noun", def: "a store selling goods at reduced prices", ex: "We shop at the outlet for deals." },
            { term: "installments", pos: "noun", def: "payments made in parts over time", ex: "You can pay in monthly installments." },
            { term: "commission", pos: "noun", def: "a payment based on sales made", ex: "She earns a commission on each sale." },
        ],
    },
    january: {
        topic: "Housing",
        words: [
            { term: "spacious", pos: "adjective", def: "having plenty of room", ex: "The apartment is very spacious and bright." },
            { term: "deposit", pos: "noun", def: "money paid upfront as security", ex: "The landlord requires a security deposit." },
            { term: "utilities", pos: "noun", def: "services like water, gas, and electricity", ex: "Utilities are not included in the rent." },
            { term: "tenant", pos: "noun", def: "a person who rents property", ex: "The tenant must pay rent on the first." },
            { term: "landlord", pos: "noun", def: "the owner of rental property", ex: "Call the landlord if something breaks." },
            { term: "equivalent", pos: "adjective", def: "equal in value or meaning", ex: "This is equivalent to two months' rent." },
            { term: "stable", pos: "adjective", def: "steady and not likely to change", ex: "He has a stable job and good income." },
            { term: "lease", pos: "noun", def: "a rental agreement or contract", ex: "We signed a one-year lease." },
            { term: "property", pos: "noun", def: "land or buildings owned by someone", ex: "The property includes a garage." },
            { term: "maintenance", pos: "noun", def: "the upkeep and repair of something", ex: "Maintenance of the building is the landlord's job." },
        ],
    },
    february: {
        topic: "Workforce Preparation",
        words: [
            { term: "under pressure", pos: "phrase", def: "experiencing stress or urgency", ex: "She works well under pressure." },
            { term: "fast-paced", pos: "adjective", def: "moving or happening quickly", ex: "This is a fast-paced work environment." },
            { term: "environment", pos: "noun", def: "the surroundings or conditions", ex: "We have a friendly work environment." },
            { term: "prior", pos: "adjective", def: "existing or coming before", ex: "Do you have prior experience in sales?" },
            { term: "detail-oriented", pos: "adjective", def: "careful about small details", ex: "This job requires a detail-oriented person." },
            { term: "fluent", pos: "adjective", def: "able to speak smoothly and easily", ex: "She is fluent in Spanish and English." },
            { term: "preferences", pos: "noun", def: "things you like better than others", ex: "What are your schedule preferences?" },
            { term: "role", pos: "noun", def: "a job or position", ex: "What is your role in the company?" },
            { term: "self-confidence", pos: "noun", def: "belief in your own abilities", ex: "Building self-confidence takes practice." },
            { term: "enthusiasm", pos: "noun", def: "strong excitement or interest", ex: "She showed great enthusiasm in the interview." },
        ],
    },
    march: {
        topic: "Career Awareness",
        words: [
            { term: "behavior", pos: "noun", def: "the way someone acts", ex: "Professional behavior is important at work." },
            { term: "criticize", pos: "verb", def: "to point out faults or problems", ex: "Don't criticize without offering solutions." },
            { term: "ambitious", pos: "adjective", def: "having strong desires for success", ex: "She is ambitious and wants to be a manager." },
            { term: "courtesy", pos: "noun", def: "polite and respectful behavior", ex: "He always treats customers with courtesy." },
            { term: "strict", pos: "adjective", def: "demanding exact obedience to rules", ex: "The supervisor is strict about punctuality." },
            { term: "gross pay", pos: "noun", def: "total earnings before deductions", ex: "My gross pay is $2,000 per month." },
            { term: "deductions", pos: "noun", def: "amounts subtracted from pay", ex: "Deductions include taxes and insurance." },
            { term: "coordinate", pos: "verb", def: "to organize and arrange activities", ex: "I coordinate meetings for the team." },
            { term: "recruit", pos: "verb", def: "to hire or enlist new people", ex: "The company will recruit new employees." },
            { term: "take on", pos: "phrasal verb", def: "to accept a new responsibility", ex: "She's ready to take on more tasks." },
        ],
    },
    april: {
        topic: "Health",
        words: [
            { term: "infected", pos: "adjective", def: "affected by harmful bacteria or viruses", ex: "The wound became infected." },
            { term: "depressed", pos: "adjective", def: "feeling very sad or hopeless", ex: "He felt depressed after losing his job." },
            { term: "inflamed", pos: "adjective", def: "red, swollen, and painful", ex: "Her throat is inflamed from the infection." },
            { term: "pediatrician", pos: "noun", def: "a doctor for children", ex: "The pediatrician checked the baby's growth." },
            { term: "cardiologist", pos: "noun", def: "a heart doctor", ex: "The cardiologist performed a heart test." },
            { term: "bladder", pos: "noun", def: "organ that stores urine", ex: "She has a bladder infection." },
            { term: "liver", pos: "noun", def: "organ that filters blood", ex: "Alcohol can damage your liver." },
            { term: "kidneys", pos: "noun", def: "organs that filter waste from your blood", ex: "Drink water to keep your kidneys healthy." },
            { term: "pancreas", pos: "noun", def: "organ that produces insulin", ex: "Diabetes affects the pancreas." },
            { term: "stroke", pos: "noun", def: "when blood flow to the brain is blocked", ex: "High blood pressure can cause a stroke." },
        ],
    },
    may: {
        topic: "Holistic Wellness",
        words: [
            { term: "addiction", pos: "noun", def: "dependence on a harmful substance or activity", ex: "He is recovering from alcohol addiction." },
            { term: "self-esteem", pos: "noun", def: "confidence in your own worth", ex: "Positive feedback boosts self-esteem." },
            { term: "sustain", pos: "verb", def: "to maintain or keep going", ex: "Exercise helps sustain energy levels." },
            { term: "recreational", pos: "adjective", def: "done for enjoyment and relaxation", ex: "Swimming is a recreational activity." },
            { term: "well-being", pos: "noun", def: "the state of being healthy and happy", ex: "Meditation improves well-being." },
            { term: "regimen", pos: "noun", def: "a systematic plan or routine", ex: "She follows a daily exercise regimen." },
            { term: "hydration", pos: "noun", def: "the process of drinking enough water", ex: "Proper hydration is important in hot weather." },
            { term: "moderation", pos: "noun", def: "avoiding excess; keeping balance", ex: "Eat sweets in moderation." },
            { term: "coping skills", pos: "noun", def: "strategies for dealing with stress", ex: "Therapy teaches coping skills for anxiety." },
            { term: "burnout", pos: "noun", def: "extreme physical, mental, or emotional tiredness caused by too much work, stress, or lack of rest", ex: "Work burnout is common in healthcare." },
        ],
    },
    june: {
        topic: "Future Academic Goals",
        words: [
            { term: "personal growth", pos: "noun", def: "improvement and development of yourself", ex: "Reading promotes personal growth." },
            { term: "networking", pos: "noun", def: "building professional relationships", ex: "Networking helps you find job opportunities." },
            { term: "decision-making", pos: "noun", def: "the process of making choices", ex: "Good decision-making requires careful thought." },
            { term: "professional development", pos: "noun", def: "improving job-related skills", ex: "The workshop focuses on professional development." },
        ],
    },
};

// Generate fill-in-the-blank questions from vocabulary
function generateFillBlankContent(month, data) {
    if (!data || !data.words) return "";

    let content = "";

    // Include ALL words for fill-in-blank questions
    const selectedWords = data.words;

    for (const word of selectedWords) {
        // Create a question using the example sentence
        // Replace the first occurrence of the term (case-insensitive) with blank
        const termLower = word.term.toLowerCase();
        const exLower = word.ex.toLowerCase();
        const firstIndex = exLower.indexOf(termLower);
        
        let sentence;
        if (firstIndex !== -1) {
            // Replace first occurrence, preserving original case
            const before = word.ex.substring(0, firstIndex);
            const match = word.ex.substring(firstIndex, firstIndex + word.term.length);
            const after = word.ex.substring(firstIndex + word.term.length);
            sentence = before + "_____" + after;
        } else {
            // If term not found in example, create a simple sentence
            sentence = `Fill in the blank: ${word.term} means ${word.def}.`;
        }

        // Generate wrong options from other words in the same unit
        // Use up to 3 wrong options, or fewer if not enough words available
        const availableWords = data.words.filter(w => w.term !== word.term);
        const numWrongOptions = Math.min(3, availableWords.length);
        const wrongOptions = availableWords
            .sort(() => 0.5 - Math.random())
            .slice(0, numWrongOptions)
            .map(w => w.term);

        // Combine and shuffle all options (ensure at least 2 options total)
        const allOptions = [word.term, ...wrongOptions].sort(() => 0.5 - Math.random());

        content += `Q: ${sentence}\n`;
        content += `A: ${word.term}\n`;
        content += `OPTIONS: ${allOptions.join(", ")}\n`;
        content += `EXPLAIN: ${word.def}\n\n`;
    }

    return content.trim();
}

// Generate matching pairs from vocabulary
function generateMatchingContent(month, data) {
    if (!data || !data.words) return "";

    let content = "";

    for (const word of data.words) {
        content += `${word.term} :: ${word.def}\n`;
    }

    return content.trim();
}

async function main() {
    const months = Object.keys(monthToUnit);

    for (const month of months) {
        const unit = monthToUnit[month];
        const data = vocabData[month];

        if (!data) continue;

        const fillBlankId = `vocab-${month}-fillblank`;
        const matchingId = `vocab-${month}-matching`;

        const fillBlankContent = generateFillBlankContent(month, data);
        const matchingContent = generateMatchingContent(month, data);

        // Create Fill-in-the-Blank activity
        await prisma.activity.upsert({
            where: { id: fillBlankId },
            update: {
                title: `Unit ${unit}: Fill-in-the-Blank`,
                category: `Unit ${unit}: Fill-in-the-Blank`,
                type: "game",
                description: `Fill-in-the-blank practice for Unit ${unit}: ${data.topic}`,
                content: fillBlankContent,
            },
            create: {
                id: fillBlankId,
                title: `Unit ${unit}: Fill-in-the-Blank`,
                category: `Unit ${unit}: Fill-in-the-Blank`,
                type: "game",
                level: "intermediate",
                description: `Fill-in-the-blank practice for Unit ${unit}: ${data.topic}`,
                content: fillBlankContent,
            },
        });

        // Create Matching activity
        await prisma.activity.upsert({
            where: { id: matchingId },
            update: {
                title: `Unit ${unit}: Matching`,
                category: `Unit ${unit}: Matching`,
                type: "game",
                description: `Match terms to definitions for Unit ${unit}: ${data.topic}`,
                content: matchingContent,
            },
            create: {
                id: matchingId,
                title: `Unit ${unit}: Matching`,
                category: `Unit ${unit}: Matching`,
                type: "game",
                level: "intermediate",
                description: `Match terms to definitions for Unit ${unit}: ${data.topic}`,
                content: matchingContent,
            },
        });

        console.log(`✓ Created games for Unit ${unit} (${month.charAt(0).toUpperCase() + month.slice(1)})`);
    }

    console.log(`\n✅ Created ${months.length * 2} vocabulary game activities!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
