import type { InteractiveGuideContent } from "@/types/activity";

export const superlativesQuantifiersContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Superlatives & Quantifiers Guide",
            icon: "📊",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"This is the cheapest apartment I found." "My new job has the most benefits." "We have less time but more responsibilities." These comparisons are essential for describing your life, making decisions, and explaining situations.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Whether you're apartment hunting, job searching, or just describing your day, you need to compare and quantify. This lesson gives you the tools to:</p>
                <ul>
                    <li><strong>Find the best deal</strong> - Compare apartments, jobs, prices</li>
                    <li><strong>Make informed decisions</strong> - "Which option has the most advantages?"</li>
                    <li><strong>Describe situations accurately</strong> - "I have too much work and too little time"</li>
                    <li><strong>Negotiate effectively</strong> - At work, at stores, with landlords</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Describing your home ("My apartment is the quietest one in the building")</li>
                        <li>Comparing apartments ("This one has fewer bedrooms but more space")</li>
                        <li>Talking about food and restaurants ("Which restaurant has the best prices?")</li>
                        <li>Speaking game: Comparing homes and neighborhoods</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Tip: When you're apartment hunting or job searching, these comparisons help you explain your choices and find the best option!</p>
                </div>
            `,
            exercises: [
                {
                    id: "sq-intro-1",
                    title: "Quick Check: What Are We Doing?",
                    instructions: "Choose the best label for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "This is <span class='eg-superlative'>the cheapest</span> apartment I found.",
                            options: [
                                { value: "superlative", label: "Superlative (the extreme in a group)" },
                                { value: "quantifier", label: "Quantifier (amount: much/many/few/less)" },
                            ],
                            expectedAnswer: "superlative",
                        },
                        {
                            type: "radio",
                            label: "I have <span class='eg-quantifier'>less</span> time but <span class='eg-quantifier'>more</span> responsibilities.",
                            options: [
                                { value: "superlative", label: "Superlative" },
                                { value: "quantifier", label: "Quantifier" },
                            ],
                            expectedAnswer: "quantifier",
                        },
                    ],
                },
            ],
        },

        // Superlatives Section
        {
            id: "superlatives-intro",
            stepNumber: 1,
            title: "Superlatives: The Most, The Best, The -est",
            icon: "🏆",
            explanation: `
                <h3>What Are Superlatives?</h3>
                <p>Superlatives help you identify the <strong>extreme</strong> in a group - the highest, the lowest, the best, the worst. Use them when comparing <strong>three or more</strong> things.</p>
            `,
            exercises: [
                {
                    id: "sq-superlatives-intro-1",
                    title: "Practice: Superlative or Comparative?",
                    instructions: "Choose the correct answer.",
                    items: [
                        {
                            type: "radio",
                            label: "This is <span class='eg-superlative'>the cheapest</span> apartment in the neighborhood.",
                            options: [
                                { value: "superlative", label: "Superlative (3+ things)" },
                                { value: "comparative", label: "Comparative (2 things)" },
                            ],
                            expectedAnswer: "superlative",
                        },
                        {
                            type: "radio",
                            label: "This apartment is <span class='eg-comparative'>cheaper</span> than that one.",
                            options: [
                                { value: "superlative", label: "Superlative" },
                                { value: "comparative", label: "Comparative" },
                            ],
                            expectedAnswer: "comparative",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "💰 Finding the Best Deal",
                    description: "Use superlatives when comparing apartments, jobs, or shopping options to identify the extreme in a group",
                    examples: [
                        {
                            sentence: "This is <strong>the cheapest</strong> apartment in the neighborhood.",
                            explanation: "✓ Comparing this apartment to all others in the area (3+ apartments)"
                        },
                        {
                            sentence: "This apartment is <strong>cheaper</strong> than that one.",
                            explanation: "✗ NOT a superlative! This compares only 2 apartments (use comparative)"
                        },
                    ],
                },
                {
                    title: "📅 Describing Your Schedule",
                    description: "Talk about the busiest days, longest shifts, or most demanding tasks",
                    examples: [
                        {
                            sentence: "Monday is <strong>the busiest</strong> day at work.",
                            explanation: "✓ Monday compared to all other days of the week"
                        },
                        {
                            sentence: "That restaurant has <strong>the best</strong> food downtown.",
                            explanation: "✓ This restaurant compared to all others downtown"
                        },
                    ],
                },
                {
                    title: "💼 Job Comparisons",
                    description: "Compare job offers, benefits, or work conditions",
                    examples: [
                        {
                            sentence: "This job offers <strong>the most</strong> vacation days.",
                            explanation: "✓ Comparing vacation days across all jobs you're considering"
                        },
                        {
                            sentence: "She's <strong>the most experienced</strong> person on the team.",
                            explanation: "✓ Comparing her experience to all other team members"
                        },
                    ],
                },
            ],
            formula: [
                { text: "the", type: "other" },
                { text: "+", type: "other" },
                { text: "adjective + -est", type: "subject" },
                { text: "OR", type: "other" },
                { text: "most/least + adjective", type: "subject" },
            ],
            tipBox: {
                title: "💡 Three or More",
                content:
                    "Superlatives are for comparing 3+ things. For comparing just 2 things, use comparatives (cheaper, better, more expensive). Example: 'This apartment is cheaper than that one' (2 apartments) vs 'This is the cheapest apartment' (3+ apartments).",
            },
        },

        // Superlatives Formation
        {
            id: "superlatives-formation",
            stepNumber: 2,
            title: "How to Form Superlatives",
            icon: "⚙️",
            explanation: `
                <h3>The Two Main Patterns</h3>
                <p>How you form a superlative depends on how long the adjective is:</p>
            `,
            verbTable: {
                title: "Superlative Formation Rules",
                headers: ["Type", "Pattern", "Examples"],
                rows: [
                    ["Short adjectives (1 syllable)", "the + adjective + -est", "cheap → the cheapest, old → the oldest, big → the biggest"],
                    ["Short adjectives ending in -y", "the + adjective (y→iest)", "busy → the busiest, happy → the happiest, easy → the easiest"],
                    ["Long adjectives (2+ syllables)", "the most/least + adjective", "expensive → the most expensive, comfortable → the most comfortable, affordable → the most affordable"],
                    ["Irregular adjectives", "(special forms)", "good → the best, bad → the worst, far → the farthest"],
                ],
            },
            exercises: [
                {
                    id: "ex-superlatives-1",
                    title: "Practice: Form the Superlative",
                    instructions:
                        "Complete each sentence with the correct superlative form.",
                    items: [
                        {
                            type: "text",
                            label: "This is ___ (cheap) apartment I can afford.",
                            expectedAnswer: "the cheapest",
                        },
                        {
                            type: "text",
                            label: "Monday is ___ (busy) day of the week at the restaurant.",
                            expectedAnswer: "the busiest",
                        },
                        {
                            type: "text",
                            label: "She's ___ (experienced) worker on our team.",
                            expectedAnswer: "the most experienced",
                        },
                        {
                            type: "text",
                            label: "That was ___ (good) interview I've ever had!",
                            expectedAnswer: "the best",
                        },
                        {
                            type: "text",
                            label: "This job has ___ (good) benefits in the industry.",
                            expectedAnswer: "the best",
                        },
                    ],
                },
            ],
        },

        // Quantifiers Introduction
        {
            id: "quantifiers-intro",
            stepNumber: 3,
            title: "Quantifiers: How Much? How Many?",
            icon: "🔢",
            explanation: `
                <h3>What Are Quantifiers?</h3>
                <p>Quantifiers tell you <strong>how much</strong> or <strong>how many</strong> of something there is. They're essential for describing amounts without being specific.</p>
            `,
            exercises: [
                {
                    id: "sq-quantifiers-intro-1",
                    title: "Practice: Count or Non-Count?",
                    instructions: "Choose the best answer for each word.",
                    items: [
                        {
                            type: "radio",
                            label: "<strong>jobs</strong>",
                            options: [
                                { value: "count", label: "Countable noun (you can count it)" },
                                { value: "noncount", label: "Uncountable noun (you can't count it)" },
                            ],
                            expectedAnswer: "count",
                        },
                        {
                            type: "radio",
                            label: "<strong>money</strong>",
                            options: [
                                { value: "count", label: "Countable noun" },
                                { value: "noncount", label: "Uncountable noun" },
                            ],
                            expectedAnswer: "noncount",
                        },
                        {
                            type: "radio",
                            label: "<strong>time</strong>",
                            options: [
                                { value: "noncount", label: "Uncountable noun" },
                                { value: "count", label: "Countable noun" },
                            ],
                            expectedAnswer: "noncount",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "🔢 Countable Nouns",
                    description: "Things you can count individually - use numbers with them",
                    examples: [
                        {
                            sentence: "I applied for three <strong>jobs</strong> this week.",
                            explanation: "✓ You can count jobs: 1 job, 2 jobs, 3 jobs"
                        },
                        {
                            sentence: "The apartment has two <strong>bedrooms</strong> and one <strong>bathroom</strong>.",
                            explanation: "✓ Bedrooms and bathrooms are countable"
                        },
                        {
                            sentence: "How many <strong>hours</strong> do you work per week?",
                            explanation: "✓ Hours are countable: 1 hour, 2 hours, 40 hours"
                        },
                    ],
                },
                {
                    title: "💧 Non-Countable Nouns",
                    description: "Things you can't count individually - substances, abstract concepts, collective ideas",
                    examples: [
                        {
                            sentence: "The rent costs too much <strong>money</strong>.",
                            explanation: "✓ You don't say '1 money, 2 moneys' - it's uncountable"
                        },
                        {
                            sentence: "I don't have much <strong>time</strong> before my shift.",
                            explanation: "✓ Time is uncountable (though hours/minutes/days are countable)"
                        },
                        {
                            sentence: "This job requires a lot of <strong>experience</strong>.",
                            explanation: "✓ Experience is uncountable (though 'experiences' as events can be countable)"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content:
                    "Can you put a number in front of it? If yes, it's countable (1 job, 2 jobs). If no, it's uncountable (money, not *1 money). When in doubt, uncountable nouns are usually substances, abstract ideas, or collective concepts.",
            },
        },

        // Many vs Much
        {
            id: "many-much",
            stepNumber: 4,
            title: "Many vs Much: The Most Common Mistake",
            icon: "🔀",
            explanation: `
                <h3>The Rule That Changes Everything</h3>
                <p>One of the most common mistakes in English: using "much" with countable nouns or "many" with uncountable ones. Master this, and you'll sound more natural.</p>
            `,
            usageMeanings: [
                {
                    title: "✅ MANY = Countable Nouns",
                    description: "Use 'many' with things you can count (plural nouns)",
                    examples: [
                        {
                            sentence: "How <strong>many hours</strong> do you work per week?",
                            explanation: "✓ Hours are countable (1 hour, 2 hours...)"
                        },
                        {
                            sentence: "She has <strong>many responsibilities</strong> at work.",
                            explanation: "✓ You can count responsibilities: 1 responsibility, 2 responsibilities..."
                        },
                        {
                            sentence: "There aren't <strong>many apartments</strong> available.",
                            explanation: "✓ Apartments are countable units"
                        },
                    ],
                },
                {
                    title: "✅ MUCH = Non-Countable Nouns",
                    description: "Use 'much' with things you cannot count individually (singular nouns)",
                    examples: [
                        {
                            sentence: "I don't have <strong>much time</strong> for lunch.",
                            explanation: "✓ Time is uncountable (you can't say '1 time, 2 times' in this sense)"
                        },
                        {
                            sentence: "The rent costs too <strong>much money</strong>.",
                            explanation: "✓ Money as a concept is uncountable"
                        },
                        {
                            sentence: "This job requires <strong>much experience</strong>.",
                            explanation: "✓ Experience is uncountable"
                        },
                    ],
                },
                {
                    title: "❌ Common Mistakes",
                    description: "Watch out for these errors that even advanced learners make",
                    examples: [
                        {
                            sentence: "❌ How <strong>much hours</strong> do you work?",
                            explanation: "✗ WRONG! Hours are countable → use 'many hours'"
                        },
                        {
                            sentence: "❌ I don't have <strong>many time</strong>.",
                            explanation: "✗ WRONG! Time is uncountable → use 'much time'"
                        },
                        {
                            sentence: "❌ She has <strong>much responsibilities</strong>.",
                            explanation: "✗ WRONG! Responsibilities are countable → use 'many responsibilities'"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-many-much-1",
                    title: "Practice: Many or Much?",
                    instructions:
                        "Choose 'many' or 'much' for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "How ___ vacation days do you get?",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "many",
                        },
                        {
                            type: "radio",
                            label: "I don't have ___ experience with computers.",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "much",
                        },
                        {
                            type: "radio",
                            label: "There aren't ___ affordable apartments available.",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "many",
                        },
                        {
                            type: "radio",
                            label: "This job requires too ___ travel.",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "much",
                        },
                    ],
                },
            ],
        },

        // Few vs Little
        {
            id: "few-little",
            stepNumber: 5,
            title: "Few vs Little: Not Enough",
            icon: "📉",
            explanation: `
                <h3>Describing Small Amounts</h3>
                <p>Just like many/much, the choice between few and little depends on count vs uncountable:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <h4 style="color: #7ba884; margin-top: 0;">FEW = Countable Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Small number, not enough</p>
                            <ul style="margin: 0;">
                                <li>few <strong>options</strong></li>
                                <li>few <strong>openings</strong></li>
                                <li>few <strong>applicants</strong></li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <h4 style="color: #d97757; margin-top: 0;">LITTLE = Non-Countable Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Small amount, not enough</p>
                            <ul style="margin: 0;">
                                <li>little <strong>money</strong></li>
                                <li>little <strong>space</strong></li>
                                <li>little <strong>hope</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h4>Bonus: A FEW vs A LITTLE (Positive Meaning)</h4>
                <ul>
                    <li><strong>a few</strong> = some, a small number (positive) → "I have a few friends here" (I do have some!)</li>
                    <li><strong>few</strong> = almost none (negative) → "I have few friends here" (I'm lonely)</li>
                    <li><strong>a little</strong> = some, a small amount (positive) → "I have a little time" (enough for something)</li>
                    <li><strong>little</strong> = almost none (negative) → "I have little time" (I'm rushed)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-few-little-1",
                    title: "Practice: Few or Little?",
                    instructions:
                        "Choose the correct quantifier.",
                    items: [
                        {
                            type: "radio",
                            label: "There are very ___ good apartments in my budget.",
                            options: [
                                { value: "little", label: "little" },
                                { value: "few", label: "few" },
                            ],
                            expectedAnswer: "few",
                        },
                        {
                            type: "radio",
                            label: "I have very ___ patience for rude customers.",
                            options: [
                                { value: "little", label: "little" },
                                { value: "few", label: "few" },
                            ],
                            expectedAnswer: "little",
                        },
                        {
                            type: "radio",
                            label: "We received ___ applications for the position. (only 3)",
                            options: [
                                { value: "little", label: "little" },
                                { value: "few", label: "few" },
                            ],
                            expectedAnswer: "few",
                        },
                    ],
                },
            ],
        },

        // Fewer vs Less
        {
            id: "fewer-less",
            stepNumber: 6,
            title: "Fewer vs Less: The Grocery Store Rule",
            icon: "🛒",
            explanation: `
                <h3>The Rule Everyone Gets Wrong</h3>
                <p>You've probably seen the supermarket sign: "10 items or less." Guess what? It's wrong! It should be "10 items or fewer" because items are countable.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 2px solid #7ba884;">
                            <h4 style="color: #7ba884; margin-top: 0;">FEWER = Countable Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Comparing numbers</p>
                            <ul style="margin: 0;">
                                <li>fewer <strong>hours</strong></li>
                                <li>fewer <strong>employees</strong></li>
                                <li>fewer <strong>benefits</strong></li>
                                <li>fewer <strong>problems</strong></li>
                            </ul>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 2px solid #d97757;">
                            <h4 style="color: #d97757; margin-top: 0;">LESS = Non-Countable Nouns</h4>
                            <p style="margin: 0 0 0.5rem 0; font-style: italic;">Comparing amounts</p>
                            <ul style="margin: 0;">
                                <li>less <strong>time</strong></li>
                                <li>less <strong>stress</strong></li>
                                <li>less <strong>money</strong></li>
                                <li>less <strong>experience</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h4>Real-Life Comparisons:</h4>
                <ul>
                    <li>My new job has <strong>fewer hours</strong> but <strong>less stress</strong>.</li>
                    <li>This apartment has <strong>fewer rooms</strong> but costs <strong>less money</strong>.</li>
                    <li>We need <strong>fewer meetings</strong> and <strong>less paperwork</strong>!</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Memory Trick",
                content:
                    "FEWER has an 'e' like countablE. LESS has no 'e' like uncountablE (no 'e'). Also: if you can say 'number of,' use fewer. If you can say 'amount of,' use less.",
            },
            exercises: [
                {
                    id: "ex-fewer-less-1",
                    title: "Practice: Fewer or Less?",
                    instructions:
                        "Choose the correct word for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "This job offers ___ vacation days than my last one.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "fewer",
                        },
                        {
                            type: "radio",
                            label: "I want a job with ___ responsibility.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "less",
                        },
                        {
                            type: "radio",
                            label: "The new apartment has ___ bedrooms.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "fewer",
                        },
                        {
                            type: "radio",
                            label: "Working night shift means ___ traffic on my commute.",
                            options: [
                                { value: "fewer", label: "fewer" },
                                { value: "less", label: "less" },
                            ],
                            expectedAnswer: "less",
                        },
                    ],
                },
            ],
        },

        // Most vs Least
        {
            id: "most-least",
            stepNumber: 7,
            title: "Most vs Least: The Extremes",
            icon: "⚖️",
            explanation: `
                <h3>Talking About Extremes</h3>
                <p>Use <strong>most</strong> and <strong>least</strong> to describe the maximum and minimum in a group:</p>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>MOST = Maximum/Highest</h4>
                    <ul>
                        <li>This job has <strong>the most</strong> benefits.</li>
                        <li>Monday has <strong>the most</strong> traffic.</li>
                        <li>She does <strong>the most</strong> work on our team.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <h4>LEAST = Minimum/Lowest</h4>
                    <ul>
                        <li>This option costs <strong>the least</strong> money.</li>
                        <li>Wednesday has <strong>the least</strong> traffic.</li>
                        <li>That job requires <strong>the least</strong> experience.</li>
                    </ul>
                </div>

                <h4>Good News!</h4>
                <p>MOST and LEAST work with BOTH count and uncountable nouns:</p>
                <ul>
                    <li>the most <strong>hours</strong> (count)</li>
                    <li>the most <strong>time</strong> (uncountable)</li>
                    <li>the least <strong>problems</strong> (count)</li>
                    <li>the least <strong>stress</strong> (uncountable)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-most-least-1",
                    title: "Practice: Real-Life Comparisons",
                    instructions:
                        "Complete these comparison sentences. Think about whether you're comparing countable nouns (bedrooms, hours) or uncountable nouns (money, time, experience).",
                    items: [
                        {
                            type: "text",
                            label: "I looked at three apartments: A has 2 bedrooms, B has 3 bedrooms, and C has 1 bedroom. Apartment C has ___ bedrooms.",
                            expectedAnswer: "the fewest",
                        },
                        {
                            type: "text",
                            label: "I received three job offers: Job A pays $15 per hour, Job B pays $18 per hour, and Job C pays $20 per hour. Job C pays ___ money.",
                            expectedAnswer: "the most",
                        },
                        {
                            type: "text",
                            label: "Of all my coworkers, Maria has ___ experience because she's been working here for 10 years.",
                            expectedAnswer: "the most",
                        },
                        {
                            type: "text",
                            label: "I compared three neighborhoods: Downtown has heavy traffic, Midtown has moderate traffic, and Riverside has almost no traffic. Riverside has ___ traffic.",
                            expectedAnswer: "the least",
                        },
                        {
                            type: "text",
                            label: "I interviewed at three companies. Company A offers 5 vacation days, Company B offers 10 days, and Company C offers 15 days. Company C offers ___ vacation days.",
                            expectedAnswer: "the most",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Superlatives & Quantifiers Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Superlatives</h3>
                <ul>
                    <li><strong>Short adjectives:</strong> the + -est → the cheapest, the oldest, the biggest</li>
                    <li><strong>Long adjectives:</strong> the most/least + adjective → the most expensive, the least crowded</li>
                    <li><strong>Irregular:</strong> good → the best, bad → the worst</li>
                </ul>

                <h3>Quantifiers Cheat Sheet</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Quantifier</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Use With</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>many</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Countable nouns</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">many jobs, many hours</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>much</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Uncountable nouns</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">much time, much stress</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>few</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Countable nouns (not enough)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">few options, few applicants</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>little</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Uncountable nouns (not enough)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">little money, little hope</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>fewer</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Countable nouns (comparison)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">fewer hours, fewer problems</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>less</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Uncountable nouns (comparison)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">less time, less stress</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>most/least</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Both!</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">the most hours, the most time</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Mistakes to Avoid:</h3>
                <ul>
                    <li>❌ "much hours" → ✅ "many hours" (hours are countable)</li>
                    <li>❌ "less employees" → ✅ "fewer employees" (employees are countable)</li>
                    <li>❌ "the most cheap" → ✅ "the cheapest" (short adjective = -est)</li>
                    <li>❌ "more better" → ✅ "better" (better already means "more good")</li>
                </ul>
            `,
            tipBox: {
                title: "💡 The Ultimate Test",
                content:
                    "Count vs uncountable? Ask: Can I say 'one ___'? If yes → count (use many/few/fewer). If no → uncountable (use much/little/less). Examples: 'one hour' works (count), but 'one time' sounds weird (uncountable).",
            },
            exercises: [
                {
                    id: "sq-summary-1",
                    title: "Quick Review: Put It All Together",
                    instructions: "Choose the best answer for each sentence. Think about count vs uncountable nouns and superlative formation.",
                    items: [
                        {
                            type: "radio",
                            label: "I'm looking for an apartment, but there aren't ___ options in my price range.",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "many",
                        },
                        {
                            type: "radio",
                            label: "How ___ experience do you need for this position?",
                            options: [
                                { value: "many", label: "many" },
                                { value: "much", label: "much" },
                            ],
                            expectedAnswer: "much",
                        },
                        {
                            type: "radio",
                            label: "This is ___ apartment I've seen in this neighborhood.",
                            options: [
                                { value: "the-cheapest", label: "the cheapest" },
                                { value: "the-most-cheap", label: "the most cheap" },
                            ],
                            expectedAnswer: "the-cheapest",
                        },
                        {
                            type: "radio",
                            label: "My new job offers ___ vacation days than my last job, but I have ___ stress.",
                            options: [
                                { value: "less-fewer", label: "less / fewer" },
                                { value: "fewer-fewer", label: "fewer / fewer" },
                                { value: "fewer-less", label: "fewer / less" },
                                { value: "less-less", label: "less / less" },
                            ],
                            expectedAnswer: "fewer-less",
                        },
                        {
                            type: "radio",
                            label: "Of all the restaurants downtown, this one has ___ parking spaces.",
                            options: [
                                { value: "the-fewest", label: "the fewest" },
                                { value: "the-least", label: "the least" },
                            ],
                            expectedAnswer: "the-fewest",
                        },
                        {
                            type: "radio",
                            label: "I need a job with ___ responsibility and ___ hours.",
                            options: [
                                { value: "less-fewer", label: "less / fewer" },
                                { value: "fewer-less", label: "fewer / less" },
                                { value: "little-few", label: "little / few" },
                                { value: "few-little", label: "few / little" },
                            ],
                            expectedAnswer: "less-fewer",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (15 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "This is the most cheap apartment in the building." },
                { value: "c", label: "This is the cheapest apartment in the building." },
                { value: "b", label: "This is the cheaper apartment in the building." },
            ],
            correctAnswer: "c",
            explanation: "'Cheap' is a short adjective (1 syllable), so use -est: the cheapest.",
            skillTag: "superlative-short-adjective-est",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct quantifier: 'How ___ experience do you have?'",
            options: [
                { value: "a", label: "many" },
                { value: "c", label: "few" },
                { value: "b", label: "much" },
            ],
            correctAnswer: "b",
            explanation:
                "'Experience' is uncountable, so use 'much.' You can't say 'one experience' in this meaning.",
            skillTag: "quantifier-much-uncount-experience",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which is correct? 'My new job has ___ hours than my old one.'",
            options: [
                { value: "a", label: "fewer" },
                { value: "b", label: "less" },
                { value: "c", label: "few" },
            ],
            correctAnswer: "a",
            explanation: "'Hours' are countable (1 hour, 2 hours), so use 'fewer' for comparisons.",
            skillTag: "quantifier-fewer-count-hours",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "What's the best completion? 'I have very ___ time before my shift starts.'",
            options: [
                { value: "a", label: "few" },
                { value: "b", label: "little" },
                { value: "c", label: "less" },
            ],
            correctAnswer: "b",
            explanation:
                "'Time' is uncountable, and we are not comparing, so 'little' is correct (very little = almost none).",
            skillTag: "quantifier-little-uncount-time-negative",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question:
                "Which sentence correctly uses superlatives AND quantifiers? 'Of all the options, this apartment has...'",
            options: [
                { value: "a", label: "the most space and the fewer problems." },
                { value: "c", label: "the much space and the least problems." },
                { value: "b", label: "the most space and the fewest problems." },
            ],
            correctAnswer: "b",
            explanation:
                "'The most space' (superlative + uncountable) and 'the fewest problems' (superlative + countable) are both correct.",
            skillTag: "superlative-most-space-fewest-problems",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question:
                "Complete the sentence: 'I have ___ friends here, so I'm happy.' (meaning: I do have some friends)",
            options: [
                { value: "b", label: "a few" },
                { value: "a", label: "few" },
                { value: "c", label: "little" },
            ],
            correctAnswer: "b",
            explanation:
                "'A few' has a positive meaning (some friends = good). 'Few' without 'a' means almost none (negative).",
            skillTag: "quantifier-a-few-positive-friends",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "Which sentence is correct?",
            options: [
                { value: "b", label: "This job requires fewer experience than that one." },
                { value: "a", label: "This job requires less experience than that one." },
                { value: "c", label: "This job requires little experience than that one." },
            ],
            correctAnswer: "a",
            explanation:
                "'Experience' is uncountable, so use 'less' for comparisons. 'Fewer' is for countable nouns, and 'little' is not used with 'than' in this way.",
            skillTag: "quantifier-less-uncount-experience-comparison",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question:
                "What's the superlative form? 'Of all the apartments I saw, this one was ___ (expensive).'",
            options: [
                { value: "a", label: "the expensivest" },
                { value: "c", label: "the more expensive" },
                { value: "b", label: "the most expensive" },
            ],
            correctAnswer: "b",
            explanation:
                "'Expensive' is a long adjective (3+ syllables), so use 'the most' + adjective. Never use -est with long adjectives.",
            skillTag: "superlative-long-adjective-most",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question:
                "Complete: 'There are very ___ good apartments available right now.' (meaning: almost none, negative)",
            options: [
                { value: "a", label: "few" },
                { value: "b", label: "a few" },
                { value: "c", label: "little" },
            ],
            correctAnswer: "a",
            explanation:
                "'Few' (without 'a') means almost none (negative). 'A few' would mean some (positive), and 'little' is for uncountable nouns.",
            skillTag: "quantifier-few-negative-apartments",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence correctly combines superlatives and quantifiers?",
            options: [
                { value: "b", label: "This job offers the most vacation days and requires the less experience." },
                { value: "a", label: "This job offers the most vacation days and requires the least experience." },
                { value: "c", label: "This job offers the most vacation days and requires the fewest experience." },
            ],
            correctAnswer: "a",
            explanation:
                "'The most vacation days' (countable noun) and 'the least experience' (uncountable noun) are both correct superlatives.",
            skillTag: "superlative-most-least-jobs",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "What's the correct form? 'She's ___ (good) employee we have.'",
            options: [
                { value: "a", label: "the goodest" },
                { value: "b", label: "the most good" },
                { value: "c", label: "the best" },
            ],
            correctAnswer: "c",
            explanation:
                "'Good' is irregular. The superlative is 'the best,' not 'the goodest' or 'the most good.'",
            skillTag: "superlative-irregular-good-best",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question:
                "Complete: 'I need ___ help with this project.' (meaning: some help, positive)",
            options: [
                { value: "b", label: "a little" },
                { value: "a", label: "little" },
                { value: "c", label: "few" },
            ],
            correctAnswer: "b",
            explanation:
                "'A little' means some (positive). 'Little' without 'a' means almost none (negative). 'Few' is for countable nouns.",
            skillTag: "quantifier-a-little-positive-help",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Which is correct? 'Of all three neighborhoods, this one has ___ crime.'",
            options: [
                { value: "a", label: "the fewest" },
                { value: "b", label: "the least" },
                { value: "c", label: "fewer" },
            ],
            correctAnswer: "b",
            explanation:
                "'Crime' is typically uncountable in this context, so use 'the least.' 'Fewer' and 'the fewest' are used with countable nouns.",
            skillTag: "superlative-least-uncount-crime",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                "What's wrong with this sentence? 'This job has less benefits than my last one.'",
            options: [
                { value: "a", label: "Nothing - it's correct" },
                { value: "c", label: "Should be 'little benefits' (benefits are uncountable)" },
                { value: "b", label: "Should be 'fewer benefits' (benefits are countable)" },
            ],
            correctAnswer: "b",
            explanation:
                "'Benefits' are countable (1 benefit, 2 benefits), so use 'fewer,' not 'less.' This is a very common mistake.",
            skillTag: "fewer-vs-less-benefits-count",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question:
                "Complete: 'I have ___ patience for rude customers.' (meaning: almost none, negative)",
            options: [
                { value: "c", label: "little" },
                { value: "a", label: "few" },
                { value: "b", label: "a few" },
            ],
            correctAnswer: "c",
            explanation:
                "'Patience' is uncountable, and 'little' (without 'a') means almost none (negative). 'Few' is for countable nouns.",
            skillTag: "quantifier-little-negative-patience",
            difficulty: "medium",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – Superlatives & Quantifiers Mini Quiz

    This mini quiz checks whether students can:
    - Form superlatives correctly with short adjectives (-est), long adjectives (most/least), and irregular adjectives (good → best).
    - Distinguish countable vs uncountable nouns and choose the correct quantifiers (many/much, few/little, fewer/less).
    - Use a few vs few and a little vs little to show positive vs negative meaning.
    - Combine superlatives and quantifiers in real-life situations (jobs, apartments, neighborhoods).

    Skill tags:

    Superlatives
    - superlative-short-adjective-est
    - superlative-long-adjective-most
    - superlative-irregular-good-best
    - superlative-most-space-fewest-problems
    - superlative-most-least-jobs
    - superlative-least-uncount-crime

    Quantifiers – count vs uncountable
    - quantifier-much-uncount-experience
    - quantifier-fewer-count-hours
    - quantifier-little-uncount-time-negative
    - quantifier-few-negative-apartments
    - quantifier-a-few-positive-friends
    - quantifier-a-little-positive-help
    - quantifier-little-negative-patience
    - quantifier-less-uncount-experience-comparison
    - fewer-vs-less-benefits-count

    How to read the diagnostics:
    - If superlative tags are weak (superlative-short-adjective-est, superlative-long-adjective-most, superlative-irregular-good-best, superlative-most-space-fewest-problems, superlative-most-least-jobs, superlative-least-uncount-crime) →
      Rebuild the superlative chart:
      • Short adjectives (1 syllable): the + adj + -est → the cheapest, the busiest.
      • Long adjectives (2+ syllables): the most/least + adj → the most expensive, the least crowded.
      • Irregular: good → the best, bad → the worst.
      Practice with real examples from housing and jobs: cheapest apartment, most experience, least traffic, most vacation days.

    - If basic quantifier tags are weak (quantifier-much-uncount-experience, quantifier-fewer-count-hours, quantifier-little-uncount-time-negative, quantifier-less-uncount-experience-comparison, fewer-vs-less-benefits-count) →
      Go back to countable vs uncountable:
      • Countable: use many/few/fewer (jobs, hours, benefits).
      • Uncountable: use much/little/less (money, time, experience, patience).
      Use a T-chart on the board with real nouns from students' lives (jobs, hours, rent, traffic) and sort them together.

    - If a few vs few or a little vs little tags are weak (quantifier-a-few-positive-friends, quantifier-few-negative-apartments, quantifier-a-little-positive-help, quantifier-little-negative-patience) →
      Contrast positive vs negative meaning:
      • a few / a little = some (enough, positive).
      • few / little = almost none (not enough, negative).
      Have students write pairs:
      • I have a few friends here. (positive)
      • I have few friends here. (negative)
      • I have a little time. (positive)
      • I have little time. (negative)

    - If combined superlative + quantifier tags are weak (superlative-most-space-fewest-problems, superlative-most-least-jobs, superlative-least-uncount-crime) →
      Use comparison tables:
      • Compare 3 job offers (pay, hours, vacation, experience).
      • Compare 3 apartments (rooms, rent, problems, space).
      Ask students to write sentences using:
      • the most + count/uncount (the most vacation days, the most space).
      • the least + uncount (the least experience, the least crime).
      • the fewest + count (the fewest problems, the fewest bedrooms).

    Suggested use:
    - Use this mini quiz after students have:
      • Reviewed superlative formation (short/long/irregular).
      • Practiced count vs uncountable nouns.
      • Practiced many/much, few/little, fewer/less, most/least.
    - At the class level:
      • If superlatives are red, spend more time on short vs long adjective patterns with real housing and job examples.
      • If quantifiers are red, slow down and do quick daily warm ups sorting nouns into countable/uncountable, then choose many/much/few/little/fewer/less.
      • If the positive vs negative forms (a few vs few, a little vs little) are red, use simple feelings-based examples (lonely, rushed, happy, relaxed) to make the meaning contrast clear.
    */
};
