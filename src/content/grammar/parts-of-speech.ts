import type { InteractiveGuideContent } from "@/types/activity";

export const partsOfSpeechContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Parts of Speech: The Building Blocks of English",
            icon: "🧱",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Every sentence you speak is built from <strong>eight essential building blocks</strong>: <span style="color: #3b82f6;">nouns</span>, <span style="color: #dc2626;">verbs</span>, <span style="color: #16a34a;">adjectives</span>, <span style="color: #9333ea;">adverbs</span>, <span style="color: #0f766e;">pronouns</span>, <span style="color: #92400e;">articles</span>, <span style="color: #334155;">prepositions</span>, and <span style="color: #db2777;">conjunctions</span>. Understanding these parts helps you build stronger, clearer sentences.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Parts of speech are the foundation of everything in English:</p>
                <ul>
                    <li><strong>Building sentences:</strong> You need to know what type of word goes where</li>
                    <li><strong>Understanding grammar:</strong> Most grammar rules are based on parts of speech</li>
                    <li><strong>Expanding vocabulary:</strong> One word can change forms (work → worker → working)</li>
                    <li><strong>Fixing mistakes:</strong> Knowing parts of speech helps you spot and fix errors</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Understanding classroom instructions ("Use an <em>adjective</em> to describe it")</li>
                        <li>Building better sentences when you speak (knowing where each word type goes)</li>
                        <li>Learning grammar terminology so you can understand future lessons</li>
                        <li>Practicing question formation (you need to know what a "verb" and "noun" are!)</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>Throughout the course, you'll use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Every week:</strong> Understanding what "gerund," "infinitive," "helping verb," and "modal" mean</li>
                        <li><strong>Learning about gerunds vs infinitives</strong> (you need to know what a "verb" is first!)</li>
                        <li><strong>Understanding adverbs for workplace politeness:</strong> "Could you <em>possibly</em> help me?"</li>
                        <li><strong>Expanding vocabulary:</strong> If you know "happy" (adjective), you also know "happiness" (noun) and "happily" (adverb)</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🧱 Think of parts of speech as LEGO blocks - once you know what each piece does, you can build anything!</p>
                </div>
            `,
            exercises: [
                {
                    id: "parts-intro-1",
                    title: "Quick Check: Click the Word Type",
                    instructions: "Click the correct word(s) in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "the verb",
                            label: "I work on Tuesdays.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "work", after: " ", isTarget: true },
                                { text: "on", after: " " },
                                { text: "Tuesdays", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "the adjective",
                            label: "This is a small class.",
                            tokens: [
                                { text: "This", after: " " },
                                { text: "is", after: " " },
                                { text: "a", after: " " },
                                { text: "small", after: " ", isTarget: true },
                                { text: "class", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "the pronoun",
                            label: "Maria works at the hospital. She is a nurse.",
                            tokens: [
                                { text: "Maria", after: " " },
                                { text: "works", after: " " },
                                { text: "at", after: " " },
                                { text: "the", after: " " },
                                { text: "hospital", after: "", isTarget: false },
                                { text: ".", after: " " },
                                { text: "She", after: " ", isTarget: true },
                                { text: "is", after: " " },
                                { text: "a", after: " " },
                                { text: "nurse", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: "nouns",
            stepNumber: 1,
            title: "Nouns: Naming People, Places, Things, and Ideas",
            icon: "🔵",
            explanation: `
                <h3>What Is a Noun?</h3>
                <p>A <strong>noun</strong> is a word that names a person, place, thing, or idea. If you can see it, touch it, or think about it - it's probably a noun!</p>
            `,
            usageMeanings: [
                {
                    title: "👤 People",
                    description: "Names of people or their roles",
                    examples: [
                        {
                            sentence: "My <strong style='color: #3b82f6;'>teacher</strong> helps me learn English.",
                            explanation: "✓ A person and their role"
                        },
                        {
                            sentence: "<strong style='color: #3b82f6;'>Maria</strong> works at the hospital as a <strong style='color: #3b82f6;'>nurse</strong>.",
                            explanation: "✓ A specific person (proper noun) and a job title"
                        },
                        {
                            sentence: "The <strong style='color: #3b82f6;'>students</strong> are studying for the test.",
                            explanation: "✓ A group of people"
                        },
                    ],
                },
                {
                    title: "📍 Places",
                    description: "Locations, buildings, cities, countries",
                    examples: [
	                        {
	                            sentence: "I live in <strong style='color: #3b82f6;'>East Boston</strong>, <strong style='color: #3b82f6;'>Massachusetts</strong>.",
	                            explanation: "✓ City and state names (proper nouns)"
	                        },
	                        {
	                            sentence: "The <strong style='color: #3b82f6;'>clinic</strong> is on <strong style='color: #3b82f6;'>Bennington Street</strong>.",
	                            explanation: "✓ A building and a street name"
	                        },
                        {
                            sentence: "We're going to the <strong style='color: #3b82f6;'>park</strong> after <strong style='color: #3b82f6;'>work</strong>.",
                            explanation: "✓ Common place nouns"
                        },
                    ],
                },
                {
                    title: "📦 Things",
                    description: "Objects you can see, touch, or use",
                    examples: [
                        {
                            sentence: "I need to buy <strong style='color: #3b82f6;'>bread</strong>, <strong style='color: #3b82f6;'>milk</strong>, and <strong style='color: #3b82f6;'>eggs</strong>.",
                            explanation: "✓ Concrete objects you can touch"
                        },
                        {
                            sentence: "My <strong style='color: #3b82f6;'>phone</strong> is on the <strong style='color: #3b82f6;'>table</strong>.",
                            explanation: "✓ Everyday objects"
                        },
                        {
                            sentence: "The <strong style='color: #3b82f6;'>car</strong> won't start in cold <strong style='color: #3b82f6;'>weather</strong>.",
                            explanation: "✓ Vehicles and natural phenomena"
                        },
                    ],
                },
                {
                    title: "💭 Ideas & Feelings",
                    description: "Abstract concepts you can't touch but can think about",
                    examples: [
                        {
                            sentence: "<strong style='color: #3b82f6;'>Health</strong> is more important than <strong style='color: #3b82f6;'>money</strong>.",
                            explanation: "✓ Abstract concepts"
                        },
                        {
                            sentence: "I need more <strong style='color: #3b82f6;'>time</strong> and less <strong style='color: #3b82f6;'>stress</strong>.",
                            explanation: "✓ Ideas and feelings"
                        },
                        {
                            sentence: "Her <strong style='color: #3b82f6;'>happiness</strong> shows in her <strong style='color: #3b82f6;'>smile</strong>.",
                            explanation: "✓ Emotions and expressions"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-nouns-1",
                    title: "Quick Practice: Nouns",
                    instructions: "Click all the nouns in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all nouns",
                            label: "The suntanned lifeguard sat on the red chair in the sand.",
                            tokens: [
                                { text: "The", after: " " },
                                { text: "suntanned", after: " " },
                                { text: "lifeguard", after: " ", isTarget: true },
                                { text: "sat", after: " " },
                                { text: "on", after: " " },
                                { text: "the", after: " " },
                                { text: "red", after: " " },
                                { text: "chair", after: " ", isTarget: true },
                                { text: "in", after: " " },
                                { text: "the", after: " " },
                                { text: "sand", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all nouns",
                            label: "Give the worker the hammer and the nails. The worker will fix the broken shelf.",
                            tokens: [
                                { text: "Give", after: " " },
                                { text: "the", after: " " },
                                { text: "worker", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "hammer", after: " ", isTarget: true },
                                { text: "and", after: " " },
                                { text: "the", after: " " },
                                { text: "nails", after: "", isTarget: true },
                                { text: ".", after: " " },
                                { text: "The", after: " " },
                                { text: "worker", after: " ", isTarget: true },
                                { text: "will", after: " " },
                                { text: "fix", after: " " },
                                { text: "the", after: " " },
                                { text: "broken", after: " " },
                                { text: "shelf", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all nouns",
                            label: "Maria works at the hospital. Maria is a nurse.",
                            tokens: [
                                { text: "Maria", after: " ", isTarget: true },
                                { text: "works", after: " " },
                                { text: "at", after: " " },
                                { text: "the", after: " " },
                                { text: "hospital", after: "", isTarget: true },
                                { text: ".", after: " " },
                                { text: "Maria", after: " ", isTarget: true },
                                { text: "is", after: " " },
                                { text: "a", after: " " },
                                { text: "nurse", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tests",
                content: "NOUN: Can you put 'a', 'an', or 'the' before it? (a book, the car, an idea) → It's a noun!",
            },
        },

        {
            id: "verbs",
            stepNumber: 2,
            title: "Verbs: Action and State",
            icon: "🔴",
            explanation: `
                <h3>What Is a Verb?</h3>
                <p>A <strong>verb</strong> is a word that shows action (what you do) or state (how you are). Every sentence needs a verb!</p>
            `,
            usageMeanings: [
                {
                    title: "🏃 Action Verbs",
                    description: "Physical or mental actions you can do",
                    examples: [
                        {
                            sentence: "I <strong style='color: #dc2626;'>work</strong> at the hospital.",
                            explanation: "✓ What you do for a living"
                        },
                        {
                            sentence: "She <strong style='color: #dc2626;'>walks</strong> to the bus stop every morning.",
                            explanation: "✓ Physical movement"
                        },
                        {
                            sentence: "We <strong style='color: #dc2626;'>study</strong> English twice a week.",
                            explanation: "✓ Mental action"
                        },
                        {
                            sentence: "The doctor <strong style='color: #dc2626;'>checked</strong> my blood pressure.",
                            explanation: "✓ Professional action"
                        },
                    ],
                },
                {
                    title: "🧘 State Verbs (Be, Have, Feel)",
                    description: "How you are, what you have, or how you feel",
                    examples: [
                        {
                            sentence: "I <strong style='color: #dc2626;'>am</strong> tired today.",
                            explanation: "✓ Your current state (be verb)"
                        },
                        {
                            sentence: "She <strong style='color: #dc2626;'>has</strong> three children.",
                            explanation: "✓ What you possess (have)"
                        },
                        {
                            sentence: "They <strong style='color: #dc2626;'>feel</strong> stressed about the deadline.",
                            explanation: "✓ Emotional state"
                        },
                        {
                            sentence: "The coffee <strong style='color: #dc2626;'>tastes</strong> good.",
                            explanation: "✓ Sensory state"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-verbs-1",
                    title: "Quick Practice: Verbs",
                    instructions: "Click all verbs in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all verbs",
                            label: "After work, I cook dinner and clean the kitchen.",
                            tokens: [
                                { text: "After", after: " " },
                                { text: "work", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "I", after: " " },
                                { text: "cook", after: " ", isTarget: true },
                                { text: "dinner", after: " " },
                                { text: "and", after: " " },
                                { text: "clean", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "kitchen", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all verbs",
                            label: "The nurse checks the schedule, then calls the patients.",
                            tokens: [
                                { text: "The", after: " " },
                                { text: "nurse", after: " " },
                                { text: "checks", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "schedule", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "then", after: " " },
                                { text: "calls", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "patients", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all verbs",
                            label: "We feel tired, but we continue the lesson.",
                            tokens: [
                                { text: "We", after: " " },
                                { text: "feel", after: " ", isTarget: true },
                                { text: "tired", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "but", after: " " },
                                { text: "we", after: " " },
                                { text: "continue", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "lesson", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you add -ing to it and use it after 'I am'? (I am walking, I am thinking) → It's probably a verb!",
            },
        },

        {
            id: "adjectives",
            stepNumber: 3,
            title: "Adjectives: Describing Words",
            icon: "🟢",
            explanation: `
                <h3>What Is an Adjective?</h3>
                <p>An <strong>adjective</strong> describes or gives more information about a noun. It answers questions like: What kind? How many? Which one?</p>
            `,
            usageMeanings: [
                {
                    title: "🎨 What Kind? (Quality)",
                    description: "Describing the type, quality, or characteristics",
                    examples: [
                        {
                            sentence: "The <strong style='color: #16a34a;'>warm</strong> weather makes me happy.",
                            explanation: "✓ Describes temperature (what kind of weather?)"
                        },
                        {
                            sentence: "She's a <strong style='color: #16a34a;'>good</strong> teacher.",
                            explanation: "✓ Describes quality (what kind of teacher?)"
                        },
                        {
                            sentence: "I need a <strong style='color: #16a34a;'>quiet</strong> place to study.",
                            explanation: "✓ Describes atmosphere"
                        },
                    ],
                },
                {
                    title: "🔢 How Many? (Quantity)",
                    description: "Telling the number or amount",
                    examples: [
                        {
                            sentence: "I have <strong style='color: #16a34a;'>two</strong> jobs.",
                            explanation: "✓ Exact number"
                        },
                        {
                            sentence: "There are <strong style='color: #16a34a;'>many</strong> students in the class.",
                            explanation: "✓ Large quantity (not exact)"
                        },
                        {
                            sentence: "I need <strong style='color: #16a34a;'>more</strong> time to finish.",
                            explanation: "✓ Comparative quantity"
                        },
                    ],
                },
                {
                    title: "👉 Which One? (Specific)",
                    description: "Pointing out which specific one",
                    examples: [
                        {
                            sentence: "<strong style='color: #16a34a;'>This</strong> book is helpful.",
                            explanation: "✓ Pointing to a specific book (near)"
                        },
                        {
                            sentence: "I want <strong style='color: #16a34a;'>that</strong> job.",
                            explanation: "✓ Pointing to a specific job (far)"
                        },
                        {
                            sentence: "<strong style='color: #16a34a;'>My</strong> apartment is small.",
                            explanation: "✓ Showing ownership"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-adjectives-1",
                    title: "Quick Practice: Adjectives",
                    instructions: "Click all adjectives in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all adjectives",
                            label: "The crowded room was noisy and uncomfortable.",
                            tokens: [
                                { text: "The", after: " " },
                                { text: "crowded", after: " ", isTarget: true },
                                { text: "room", after: " " },
                                { text: "was", after: " " },
                                { text: "noisy", after: " ", isTarget: true },
                                { text: "and", after: " " },
                                { text: "uncomfortable", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all adjectives",
                            label: "I bought a new black jacket for cold mornings.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "bought", after: " " },
                                { text: "a", after: " " },
                                { text: "new", after: " ", isTarget: true },
                                { text: "black", after: " ", isTarget: true },
                                { text: "jacket", after: " " },
                                { text: "for", after: " " },
                                { text: "cold", after: " ", isTarget: true },
                                { text: "mornings", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all adjectives",
                            label: "Our helpful teacher gave clear instructions.",
                            tokens: [
                                { text: "Our", after: " " },
                                { text: "helpful", after: " ", isTarget: true },
                                { text: "teacher", after: " " },
                                { text: "gave", after: " " },
                                { text: "clear", after: " ", isTarget: true },
                                { text: "instructions", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you put it between 'the' and a noun? (the TALL building, the BLUE car) → It's probably an adjective!",
            },
        },

        {
            id: "adverbs",
            stepNumber: 4,
            title: "Adverbs: How, When, Where, How Much",
            icon: "🟣",
            explanation: `
                <h3>What Is an Adverb?</h3>
                <p>An <strong>adverb</strong> describes a verb (how you do something), an adjective (how much), or another adverb. Many adverbs end in -ly.</p>
            `,
            usageMeanings: [
                {
                    title: "🏃 How? (Manner)",
                    description: "Describing how an action is done",
                    examples: [
                        {
                            sentence: "She speaks English <strong style='color: #9333ea;'>fluently</strong>.",
                            explanation: "✓ How she speaks (manner)"
                        },
                        {
                            sentence: "Drive <strong style='color: #9333ea;'>carefully</strong> in the rain.",
                            explanation: "✓ How to drive"
                        },
                        {
                            sentence: "He works <strong style='color: #9333ea;'>hard</strong> every day.",
                            explanation: "✓ How he works (no -ly, but still an adverb!)"
                        },
                    ],
                },
                {
                    title: "⏰ When? (Time)",
                    description: "Telling when something happens",
                    examples: [
                        {
                            sentence: "I <strong style='color: #9333ea;'>always</strong> eat breakfast.",
                            explanation: "✓ Frequency (how often)"
                        },
                        {
                            sentence: "She called me <strong style='color: #9333ea;'>yesterday</strong>.",
                            explanation: "✓ Specific time in the past"
                        },
                        {
                            sentence: "I'll do it <strong style='color: #9333ea;'>later</strong>.",
                            explanation: "✓ Future time"
                        },
                    ],
                },
                {
                    title: "📍 Where? (Place)",
                    description: "Telling where something happens",
                    examples: [
                        {
                            sentence: "Come <strong style='color: #9333ea;'>here</strong>.",
                            explanation: "✓ Location (near the speaker)"
                        },
                        {
                            sentence: "I left my keys <strong style='color: #9333ea;'>there</strong>.",
                            explanation: "✓ Location (away from speaker)"
                        },
                        {
                            sentence: "Let's go <strong style='color: #9333ea;'>outside</strong>.",
                            explanation: "✓ Direction/location"
                        },
                    ],
                },
                {
                    title: "📊 How Much? (Degree)",
                    description: "Showing intensity or degree",
                    examples: [
                        {
                            sentence: "I'm <strong style='color: #9333ea;'>very</strong> tired.",
                            explanation: "✓ Describes how tired (degree)"
                        },
                        {
                            sentence: "The test was <strong style='color: #9333ea;'>extremely</strong> difficult.",
                            explanation: "✓ How difficult (intensity)"
                        },
                        {
                            sentence: "She speaks <strong style='color: #9333ea;'>too</strong> fast.",
                            explanation: "✓ Excessive degree"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-adverbs-1",
                    title: "Quick Practice: Adverbs",
                    instructions: "Click all adverbs in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all adverbs",
                            label: "Please drive carefully in the rain.",
                            tokens: [
                                { text: "Please", after: " " },
                                { text: "drive", after: " " },
                                { text: "carefully", after: " ", isTarget: true },
                                { text: "in", after: " " },
                                { text: "the", after: " " },
                                { text: "rain", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all adverbs",
                            label: "I usually take the bus, but today I walked.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "usually", after: " ", isTarget: true },
                                { text: "take", after: " " },
                                { text: "the", after: " " },
                                { text: "bus", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "but", after: " " },
                                { text: "today", after: " ", isTarget: true },
                                { text: "I", after: " " },
                                { text: "walked", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all adverbs",
                            label: "She spoke clearly during the meeting.",
                            tokens: [
                                { text: "She", after: " " },
                                { text: "spoke", after: " " },
                                { text: "clearly", after: " ", isTarget: true },
                                { text: "during", after: " " },
                                { text: "the", after: " " },
                                { text: "meeting", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Does it end in -ly and describe HOW something is done? (quickly, carefully, easily) → It's probably an adverb!",
            },
        },

        {
            id: "pronouns",
            stepNumber: 5,
            title: "Pronouns: Words That Replace Nouns",
            icon: "🟡",
            explanation: `
                <h3>What Is a Pronoun?</h3>
                <p>A <strong>pronoun</strong> is a word that takes the place of a noun. Instead of repeating "Maria" over and over, we can say "she."</p>
                <p><strong>Example:</strong> Maria went to work. <span style="color: #3b82f6;">Maria</span> is tired. → <span style="color: #0f766e;">She</span> is tired.</p>
            `,
            usageMeanings: [
                {
                    title: "👤 Subject Pronouns (Before the Verb)",
                    description: "Who/what is doing the action - comes BEFORE the verb",
                    examples: [
                        {
                            sentence: "<strong style='color: #0f766e;'>I</strong> work at the hospital.",
                            explanation: "✓ Subject doing the action (first person)"
                        },
                        {
                            sentence: "<strong style='color: #0f766e;'>She</strong> speaks English well.",
                            explanation: "✓ Subject doing the action (third person female)"
                        },
                        {
                            sentence: "<strong style='color: #0f766e;'>They</strong> are my classmates.",
                            explanation: "✓ Subject (plural)"
                        },
                        {
                            sentence: "<strong style='color: #0f766e;'>We</strong> study on Tuesdays and Thursdays.",
                            explanation: "✓ Subject (first person plural)"
                        },
                    ],
                },
                {
                    title: "🎯 Object Pronouns (After the Verb)",
                    description: "Who/what receives the action - comes AFTER the verb",
                    examples: [
                        {
                            sentence: "The teacher helps <strong style='color: #0f766e;'>me</strong> with grammar.",
                            explanation: "✓ Receiving the help (first person object)"
                        },
                        {
                            sentence: "I called <strong style='color: #0f766e;'>him</strong> yesterday.",
                            explanation: "✓ Receiving the action (third person male object)"
                        },
                        {
                            sentence: "People like <strong style='color: #0f766e;'>her</strong>. She's very kind.",
                            explanation: "✓ Receiving the liking (third person female object)"
                        },
                        {
                            sentence: "Can you help <strong style='color: #0f766e;'>us</strong> with this?",
                            explanation: "✓ Receiving the help (first person plural object)"
                        },
                    ],
                },
                {
                    title: "🏠 Possessive Adjectives (My, Your, His, Her...)",
                    description: "Shows ownership - always comes before a noun",
                    examples: [
                        {
                            sentence: "This is <strong style='color: #0f766e;'>my</strong> apartment.",
                            explanation: "✓ Shows who owns the apartment"
                        },
                        {
                            sentence: "<strong style='color: #0f766e;'>His</strong> name is Carlos.",
                            explanation: "✓ Shows whose name"
                        },
                        {
                            sentence: "Where is <strong style='color: #0f766e;'>your</strong> car?",
                            explanation: "✓ Shows who owns the car"
                        },
                        {
                            sentence: "<strong style='color: #0f766e;'>Their</strong> children go to this school.",
                            explanation: "✓ Shows whose children (plural)"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-pronouns-1",
                    title: "Quick Practice: Pronouns",
                    instructions: "Click all pronouns in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all pronouns",
                            label: "They gave me the form, and I filled it out.",
                            tokens: [
                                { text: "They", after: " ", isTarget: true },
                                { text: "gave", after: " " },
                                { text: "me", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "form", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "and", after: " " },
                                { text: "I", after: " ", isTarget: true },
                                { text: "filled", after: " " },
                                { text: "it", after: " ", isTarget: true },
                                { text: "out", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all pronouns",
                            label: "He helped her, and she thanked him.",
                            tokens: [
                                { text: "He", after: " ", isTarget: true },
                                { text: "helped", after: " " },
                                { text: "her", after: "", isTarget: true },
                                { text: ",", after: " " },
                                { text: "and", after: " " },
                                { text: "she", after: " ", isTarget: true },
                                { text: "thanked", after: " " },
                                { text: "him", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all pronouns",
                            label: "Maria and Carlos said that we should call them later.",
                            tokens: [
                                { text: "Maria", after: " " },
                                { text: "and", after: " " },
                                { text: "Carlos", after: " " },
                                { text: "said", after: " " },
                                { text: "that", after: " " },
                                { text: "we", after: " ", isTarget: true },
                                { text: "should", after: " " },
                                { text: "call", after: " " },
                                { text: "them", after: " ", isTarget: true },
                                { text: "later", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Common Mistake",
                content: "Don't say 'Me and my friend went to the store.' Say 'My friend and I went to the store.' Subject pronouns (I, he, she, we, they) come BEFORE the verb!",
            },
        },

        {
            id: "articles",
            stepNumber: 6,
            title: "Articles: a, an, the",
            icon: "🟠",
            explanation: `
                <h3>What Is an Article?</h3>
                <p>An <strong>article</strong> is a small word that comes before a noun. English has three articles: <strong>a</strong>, <strong>an</strong>, and <strong>the</strong>.</p>
            `,
            usageMeanings: [
                {
                    title: "📌 'a' - General, Consonant Sound",
                    description: "Use 'a' for general things (not specific) starting with a consonant SOUND",
                    examples: [
                        {
                            sentence: "I need <strong style='color: #92400e;'>a</strong> job.",
                            explanation: "✓ Any job (not a specific one), starts with 'j' sound"
                        },
                        {
                            sentence: "She's <strong style='color: #92400e;'>a</strong> teacher.",
                            explanation: "✓ General profession, starts with 't' sound"
                        },
                        {
                            sentence: "We saw <strong style='color: #92400e;'>a</strong> doctor at the clinic.",
                            explanation: "✓ Any doctor (not a specific one), starts with 'd' sound"
                        },
                    ],
                },
                {
                    title: "📌 'an' - General, Vowel Sound",
                    description: "Use 'an' for general things starting with a vowel SOUND (a, e, i, o, u)",
                    examples: [
                        {
                            sentence: "I ate <strong style='color: #92400e;'>an</strong> apple.",
                            explanation: "✓ Any apple, starts with 'a' sound"
                        },
                        {
                            sentence: "She's <strong style='color: #92400e;'>an</strong> engineer.",
                            explanation: "✓ General profession, starts with 'e' sound"
                        },
                        {
                            sentence: "It takes <strong style='color: #92400e;'>an</strong> hour to get there.",
                            explanation: "✓ Starts with vowel SOUND ('our'), even though 'h' is a consonant!"
                        },
                    ],
                },
                {
                    title: "📍 'the' - Specific (You Both Know Which One)",
                    description: "Use 'the' when talking about a SPECIFIC thing that both people know",
                    examples: [
                        {
                            sentence: "I need to go to <strong style='color: #92400e;'>the</strong> bank.",
                            explanation: "✓ Your specific bank (you both know which one)"
                        },
                        {
                            sentence: "<strong style='color: #92400e;'>The</strong> teacher said the test is on Thursday.",
                            explanation: "✓ Your specific teacher (everyone knows who)"
                        },
                        {
                            sentence: "Close <strong style='color: #92400e;'>the</strong> door, please.",
                            explanation: "✓ The specific door in this room (we can see it)"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-articles-1",
                    title: "Quick Practice: Articles",
                    instructions: "Click all articles (a, an, the) in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all articles",
                            label: "I had an appointment at the clinic.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "had", after: " " },
                                { text: "an", after: " ", isTarget: true },
                                { text: "appointment", after: " " },
                                { text: "at", after: " " },
                                { text: "the", after: " ", isTarget: true },
                                { text: "clinic", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all articles",
                            label: "The teacher gave us a worksheet and a pencil.",
                            tokens: [
                                { text: "The", after: " ", isTarget: true },
                                { text: "teacher", after: " " },
                                { text: "gave", after: " " },
                                { text: "us", after: " " },
                                { text: "a", after: " ", isTarget: true },
                                { text: "worksheet", after: " " },
                                { text: "and", after: " " },
                                { text: "a", after: " ", isTarget: true },
                                { text: "pencil", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all articles",
                            label: "He found a new job in the city.",
                            tokens: [
                                { text: "He", after: " " },
                                { text: "found", after: " " },
                                { text: "a", after: " ", isTarget: true },
                                { text: "new", after: " " },
                                { text: "job", after: " " },
                                { text: "in", after: " " },
                                { text: "the", after: " ", isTarget: true },
                                { text: "city", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Is it specific (you both know which one)? → Use 'the'. Is it general and starts with a vowel SOUND? → Use 'an'. Is it general and starts with a consonant sound? → Use 'a'.",
            },
        },

        {
            id: "prepositions",
            stepNumber: 7,
            title: "Prepositions: Location, Time, Direction",
            icon: "🔶",
            explanation: `
                <h3>What Is a Preposition?</h3>
                <p>A <strong>preposition</strong> shows the relationship between things - usually about time, location, or direction.</p>
                <p><strong>Common prepositions:</strong> in, on, at, to, from, between, next to, behind, in front of, under, over</p>
            `,
            usageMeanings: [
                {
                    title: "⏰ Time (in, on, at)",
                    description: "Shows when something happens",
                    examples: [
                        {
                            sentence: "Class is <strong style='color: #334155;'>at</strong> 6:00 PM.",
                            explanation: "✓ Specific time → use 'at'"
                        },
                        {
                            sentence: "I work <strong style='color: #334155;'>on</strong> Tuesdays.",
                            explanation: "✓ Days of the week → use 'on'"
                        },
                        {
                            sentence: "She was born <strong style='color: #334155;'>in</strong> January.",
                            explanation: "✓ Months/years/seasons → use 'in'"
                        },
                        {
                            sentence: "We have class <strong style='color: #334155;'>in</strong> the morning.",
                            explanation: "✓ General time period → use 'in'"
                        },
                    ],
                },
                {
                    title: "📍 Location (in, on, at)",
                    description: "Shows where something is",
                    examples: [
	                        {
	                            sentence: "I live <strong style='color: #334155;'>in</strong> East Boston.",
	                            explanation: "✓ City/country → use 'in'"
	                        },
                        {
                            sentence: "The book is <strong style='color: #334155;'>on</strong> the table.",
                            explanation: "✓ Surface contact → use 'on'"
                        },
                        {
                            sentence: "I'm <strong style='color: #334155;'>at</strong> work right now.",
                            explanation: "✓ Specific location/place → use 'at'"
                        },
                        {
                            sentence: "The bank is <strong style='color: #334155;'>next to</strong> the post office.",
                            explanation: "✓ Beside/adjacent to something"
                        },
                    ],
                },
                {
                    title: "➡️ Direction (to, from, into, through)",
                    description: "Shows movement from one place to another",
                    examples: [
                        {
                            sentence: "I walk <strong style='color: #334155;'>to</strong> work every day.",
                            explanation: "✓ Moving toward a destination"
                        },
                        {
                            sentence: "She's coming <strong style='color: #334155;'>from</strong> the hospital.",
                            explanation: "✓ Starting point of movement"
                        },
                        {
                            sentence: "Come <strong style='color: #334155;'>into</strong> the classroom.",
                            explanation: "✓ Movement from outside to inside"
                        },
                        {
                            sentence: "We drove <strong style='color: #334155;'>through</strong> the city.",
                            explanation: "✓ Movement passing through something"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-prepositions-1",
                    title: "Quick Practice: Prepositions",
                    instructions: "Click all prepositions in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all prepositions",
                            label: "I work at the hospital on Mondays.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "work", after: " " },
                                { text: "at", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "hospital", after: " " },
                                { text: "on", after: " ", isTarget: true },
                                { text: "Mondays", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all prepositions",
                            label: "We talked about the schedule during class.",
                            tokens: [
                                { text: "We", after: " " },
                                { text: "talked", after: " " },
                                { text: "about", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "schedule", after: " " },
                                { text: "during", after: " ", isTarget: true },
                                { text: "class", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all prepositions",
                            label: "She walked from the bus stop to her office.",
                            tokens: [
                                { text: "She", after: " " },
                                { text: "walked", after: " " },
                                { text: "from", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "bus", after: " " },
                                { text: "stop", after: " " },
                                { text: "to", after: " ", isTarget: true },
                                { text: "her", after: " " },
                                { text: "office", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
	            tipBox: {
	                title: "💡 Common Patterns",
	                content: "Time: at 6:00, on Tuesday, in January. Location: in East Boston, on Bennington Street, at the clinic. Direction: to work, from home, into the room.",
	            },
        },

        {
            id: "conjunctions",
            stepNumber: 8,
            title: "Conjunctions: Connecting Words (FANBOYS)",
            icon: "🔗",
            explanation: `
                <h3>What Is a Conjunction?</h3>
                <p>A <strong>conjunction</strong> is a word that connects two ideas in a sentence. The most common ones are called <strong>FANBOYS</strong>:</p>
                <p><strong>F</strong>or, <strong>A</strong>nd, <strong>N</strong>or, <strong>B</strong>ut, <strong>O</strong>r, <strong>Y</strong>et, <strong>S</strong>o</p>
            `,
            usageMeanings: [
                {
                    title: "➕ 'and' - Adding Information",
                    description: "Connects two similar ideas",
                    examples: [
                        {
                            sentence: "I work on Tuesdays <strong style='color: #db2777;'>and</strong> Thursdays.",
                            explanation: "✓ Adding two days together"
                        },
                        {
                            sentence: "She speaks English <strong style='color: #db2777;'>and</strong> Spanish.",
                            explanation: "✓ Two languages, both true"
                        },
                        {
                            sentence: "I need to buy milk <strong style='color: #db2777;'>and</strong> bread.",
                            explanation: "✓ Adding items to a list"
                        },
                    ],
                },
                {
                    title: "⚡ 'but' - Contrasting Ideas",
                    description: "Shows contrast or unexpected information",
                    examples: [
                        {
                            sentence: "I'm tired, <strong style='color: #db2777;'>but</strong> I need to work.",
                            explanation: "✓ Contrasting two ideas (tired vs working)"
                        },
                        {
                            sentence: "The apartment is small, <strong style='color: #db2777;'>but</strong> it's cheap.",
                            explanation: "✓ Showing contrast (size vs price)"
                        },
                        {
                            sentence: "She studied hard, <strong style='color: #db2777;'>but</strong> she didn't pass.",
                            explanation: "✓ Unexpected result"
                        },
                    ],
                },
                {
                    title: "❓ 'or' - Choices/Options",
                    description: "Shows alternatives or options",
                    examples: [
                        {
                            sentence: "Do you want tea <strong style='color: #db2777;'>or</strong> coffee?",
                            explanation: "✓ Giving a choice between two options"
                        },
                        {
                            sentence: "We can go now <strong style='color: #db2777;'>or</strong> wait until later.",
                            explanation: "✓ Two possible options"
                        },
                        {
                            sentence: "Is that your phone <strong style='color: #db2777;'>or</strong> mine?",
                            explanation: "✓ Question with two options"
                        },
                    ],
                },
                {
                    title: "📌 'so' - Result/Consequence",
                    description: "Shows the result or reason for something",
                    examples: [
                        {
                            sentence: "I was tired, <strong style='color: #db2777;'>so</strong> I went to bed early.",
                            explanation: "✓ Result of being tired → went to bed"
                        },
                        {
                            sentence: "It's raining, <strong style='color: #db2777;'>so</strong> take an umbrella.",
                            explanation: "✓ Because it's raining → consequence is take umbrella"
                        },
                        {
                            sentence: "She studied hard, <strong style='color: #db2777;'>so</strong> she passed the test.",
                            explanation: "✓ Result of studying → passed"
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "parts-conjunctions-1",
                    title: "Quick Practice: Conjunctions",
                    instructions: "Click all conjunctions in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all conjunctions",
                            label: "I wanted to rest, but I had homework.",
                            tokens: [
                                { text: "I", after: " " },
                                { text: "wanted", after: " " },
                                { text: "to", after: " " },
                                { text: "rest", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "but", after: " ", isTarget: true },
                                { text: "I", after: " " },
                                { text: "had", after: " " },
                                { text: "homework", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all conjunctions",
                            label: "You can email me or call me after work.",
                            tokens: [
                                { text: "You", after: " " },
                                { text: "can", after: " " },
                                { text: "email", after: " " },
                                { text: "me", after: " " },
                                { text: "or", after: " ", isTarget: true },
                                { text: "call", after: " " },
                                { text: "me", after: " " },
                                { text: "after", after: " " },
                                { text: "work", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all conjunctions",
                            label: "We studied together because the test was difficult.",
                            tokens: [
                                { text: "We", after: " " },
                                { text: "studied", after: " " },
                                { text: "together", after: " " },
                                { text: "because", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "test", after: " " },
                                { text: "was", after: " " },
                                { text: "difficult", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember FANBOYS",
                content: "For, And, Nor, But, Or, Yet, So - these are the seven main conjunctions. The most common ones you'll use daily are: and, but, or, so.",
            },
        },

        {
            id: "practice",
            stepNumber: 9,
            title: "Practice: Identify the Parts of Speech",
            icon: "✏️",
            explanation: `
                <h3>Let's Practice All 8 Parts!</h3>
                <p>Read each sentence and identify the parts of speech. Use the color-coding system:</p>
                <ul>
                    <li><strong style='color: #3b82f6;'>Blue = Noun</strong> (person, place, thing, idea)</li>
                    <li><strong style='color: #dc2626;'>Red = Verb</strong> (action or state)</li>
                    <li><strong style='color: #16a34a;'>Green = Adjective</strong> (describes noun)</li>
                    <li><strong style='color: #9333ea;'>Purple = Adverb</strong> (describes verb/adjective)</li>
                    <li><strong style='color: #0f766e;'>Teal = Pronoun</strong> (replaces noun)</li>
                    <li><strong style='color: #92400e;'>Brown = Article</strong> (a, an, the)</li>
                    <li><strong style='color: #334155;'>Slate = Preposition</strong> (in, on, at, to, from...)</li>
                    <li><strong style='color: #db2777;'>Pink = Conjunction</strong> (and, but, or, so...)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "parts-practice-1",
                    title: "Identify Parts of Speech",
                    instructions: "Click the requested part(s) of speech in each sentence.",
                    items: [
                        {
                            type: "word-select",
                            selectWhat: "all nouns and articles",
                            label: "The doctor called the patient after the appointment.",
                            tokens: [
                                { text: "The", after: " ", isTarget: true },
                                { text: "doctor", after: " ", isTarget: true },
                                { text: "called", after: " " },
                                { text: "the", after: " ", isTarget: true },
                                { text: "patient", after: " ", isTarget: true },
                                { text: "after", after: " " },
                                { text: "the", after: " ", isTarget: true },
                                { text: "appointment", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all verbs and adverbs",
                            label: "We quickly finished the report and left early.",
                            tokens: [
                                { text: "We", after: " " },
                                { text: "quickly", after: " ", isTarget: true },
                                { text: "finished", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "report", after: " " },
                                { text: "and", after: " " },
                                { text: "left", after: " ", isTarget: true },
                                { text: "early", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all adjectives and prepositions",
                            label: "The new coworkers sat in the small break room.",
                            tokens: [
                                { text: "The", after: " " },
                                { text: "new", after: " ", isTarget: true },
                                { text: "coworkers", after: " " },
                                { text: "sat", after: " " },
                                { text: "in", after: " ", isTarget: true },
                                { text: "the", after: " " },
                                { text: "small", after: " ", isTarget: true },
                                { text: "break", after: " " },
                                { text: "room", after: "", isTarget: false },
                                { text: ".", after: "" },
                            ],
                        },
                        {
                            type: "word-select",
                            selectWhat: "all pronouns and conjunctions",
                            label: "I was tired, but I still helped them.",
                            tokens: [
                                { text: "I", after: " ", isTarget: true },
                                { text: "was", after: " " },
                                { text: "tired", after: "", isTarget: false },
                                { text: ",", after: " " },
                                { text: "but", after: " ", isTarget: true },
                                { text: "I", after: " ", isTarget: true },
                                { text: "still", after: " " },
                                { text: "helped", after: " " },
                                { text: "them", after: "", isTarget: true },
                                { text: ".", after: "" },
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            stepNumber: 10,
            title: "Quick Reference",
            icon: "📋",
            explanation: `
                <h3>All 8 Parts of Speech - Quick Reference</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
	                        <h4 style="color: #3b82f6; margin-top: 0;">🔵 Nouns</h4>
	                        <p><strong>What:</strong> Person, place, thing, or idea</p>
	                        <p><strong>Examples:</strong> teacher, East Boston, book, happiness</p>
	                        <p><strong>Test:</strong> Can you add 'a/an/the'?</p>
	                    </div>

                    <div style="padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #dc2626; margin-top: 0;">🔴 Verbs</h4>
                        <p><strong>What:</strong> Action or state</p>
                        <p><strong>Examples:</strong> work, walk, am, have, feel</p>
                        <p><strong>Test:</strong> Can you add -ing after 'I am'?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(22, 163, 74, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #16a34a; margin-top: 0;">🟢 Adjectives</h4>
                        <p><strong>What:</strong> Describes a noun</p>
                        <p><strong>Examples:</strong> good, warm, two, this, my</p>
                        <p><strong>Test:</strong> Can it go between 'the' and a noun?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(147, 51, 234, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #9333ea; margin-top: 0;">🟣 Adverbs</h4>
                        <p><strong>What:</strong> Describes verb, adjective, or adverb</p>
                        <p><strong>Examples:</strong> fluently, always, here, very</p>
                        <p><strong>Test:</strong> Does it end in -ly or answer how/when/where?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(15, 118, 110, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #0f766e; margin-top: 0;">🟡 Pronouns</h4>
                        <p><strong>What:</strong> Replaces a noun</p>
                        <p><strong>Examples:</strong> I, you, he, she, it, we, they, me, him, her, us, them</p>
                        <p><strong>Test:</strong> Can it replace a person's name?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(146, 64, 14, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #92400e; margin-top: 0;">🟠 Articles</h4>
                        <p><strong>What:</strong> Small words before nouns</p>
                        <p><strong>Examples:</strong> a, an, the</p>
                        <p><strong>Test:</strong> Only 3 in English - a, an, the!</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(51, 65, 85, 0.1); border-radius: 0.5rem;">
                        <h4 style="color: #334155; margin-top: 0;">🔶 Prepositions</h4>
                        <p><strong>What:</strong> Shows time, location, direction</p>
                        <p><strong>Examples:</strong> in, on, at, to, from, between, next to</p>
                        <p><strong>Test:</strong> Does it show where, when, or which direction?</p>
                    </div>

                    <div style="padding: 1rem; background: rgba(219, 39, 119, 0.12); border-radius: 0.5rem;">
                        <h4 style="color: #db2777; margin-top: 0;">🔗 Conjunctions</h4>
                        <p><strong>What:</strong> Connects two ideas</p>
                        <p><strong>Examples:</strong> and, but, or, so (FANBOYS)</p>
                        <p><strong>Test:</strong> Does it join two sentences or ideas?</p>
                    </div>
                </div>

                <h3>Word Families (Same Word, Different Parts)</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Noun</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Verb</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Adjective</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Adverb</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">work</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">work</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">working</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">teacher</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">teach</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">care</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">care</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">careful</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">carefully</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happiness</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">—</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happy</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">happily</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Learning word families helps you expand your vocabulary fast. If you know 'happy', you also know 'happiness' and 'happily'!",
            },
            exercises: [
                {
                    id: "parts-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct part of speech.",
                    items: [
                        {
                            type: "radio",
                            label: "She speaks very <strong>quickly</strong>.",
                            options: [
                                { value: "adjective", label: "Adjective" },
                                { value: "adverb", label: "Adverb" },
                                { value: "noun", label: "Noun" },
                                { value: "verb", label: "Verb" },
                            ],
                            expectedAnswer: "adverb",
                        },
                    ],
                },
            ],
        },
    ],

        // Mini Quiz (16 questions)
        miniQuiz: [
            {
                id: "quiz-1",
                question:
                    "What part of speech is 'hospital' in: 'I work at the hospital'?",
                options: [
                    { value: "b", label: "Verb" },
                    { value: "c", label: "Adjective" },
                    { value: "a", label: "Noun" },
                    { value: "d", label: "Adverb" },
                ],
                correctAnswer: "a",
                explanation: "'Hospital' is a noun because it names a place.",
                skillTag: "identify-noun-place",
                difficulty: "easy",
            },
            {
                id: "quiz-2",
                question: "What part of speech is 'carefully' in: 'Drive carefully'?",
                options: [
                    { value: "a", label: "Noun" },
                    { value: "b", label: "Verb" },
                    { value: "c", label: "Adjective" },
                    { value: "d", label: "Adverb" },
                ],
                correctAnswer: "d",
                explanation:
                    "'Carefully' is an adverb because it describes HOW to drive and ends in -ly.",
                skillTag: "identify-adverb-manner-ly",
                difficulty: "easy",
            },
            {
                id: "quiz-3",
                question: "What part of speech is 'good' in: 'She is a good teacher'?",
                options: [
                    { value: "c", label: "Adjective" },
                    { value: "a", label: "Noun" },
                    { value: "b", label: "Verb" },
                    { value: "d", label: "Adverb" },
                ],
                correctAnswer: "c",
                explanation: "'Good' is an adjective because it describes the noun 'teacher'.",
                skillTag: "identify-adjective-quality",
                difficulty: "easy",
            },
            {
                id: "quiz-4",
                question: "What part of speech is 'walk' in: 'I walk to work'?",
                options: [
                    { value: "a", label: "Noun" },
                    { value: "b", label: "Verb" },
                    { value: "c", label: "Adjective" },
                    { value: "d", label: "Adverb" },
                ],
                correctAnswer: "b",
                explanation:
                    "'Walk' is a verb here because it shows the action you do to go to work.",
                skillTag: "identify-verb-action",
                difficulty: "easy",
            },
            {
                id: "quiz-5",
                question:
                    "What part of speech is 'they' in: 'They are my classmates'?",
                options: [
                    { value: "b", label: "Noun" },
                    { value: "c", label: "Verb" },
                    { value: "a", label: "Pronoun" },
                    { value: "d", label: "Article" },
                ],
                correctAnswer: "a",
                explanation:
                    "'They' is a pronoun because it replaces a group of people (the classmates).",
                skillTag: "identify-pronoun-subject",
                difficulty: "easy",
            },
            {
                id: "quiz-6",
                question: "What part of speech is 'the' in: 'Close the door'?",
                options: [
                    { value: "a", label: "Adjective" },
                    { value: "c", label: "Preposition" },
                    { value: "d", label: "Conjunction" },
                    { value: "b", label: "Article" },
                ],
                correctAnswer: "b",
                explanation:
                    "'The' is an article because it comes before a specific noun ('door').",
                skillTag: "identify-article-the",
                difficulty: "easy",
            },
            {
                id: "quiz-7",
                question:
                    "What part of speech is 'on' in: 'The book is on the table'?",
                options: [
                    { value: "b", label: "Preposition" },
                    { value: "a", label: "Adverb" },
                    { value: "c", label: "Conjunction" },
                    { value: "d", label: "Adjective" },
                ],
                correctAnswer: "b",
                explanation:
                    "'On' is a preposition because it shows the relationship of location between the book and the table.",
                skillTag: "identify-preposition-location",
                difficulty: "easy",
            },
            {
                id: "quiz-8",
                question:
                    "What part of speech is 'and' in: 'I need bread and milk'?",
                options: [
                    { value: "a", label: "Preposition" },
                    { value: "b", label: "Conjunction" },
                    { value: "c", label: "Adverb" },
                    { value: "d", label: "Article" },
                ],
                correctAnswer: "b",
                explanation:
                    "'And' is a conjunction because it connects two nouns in a list.",
                skillTag: "identify-conjunction-and",
                difficulty: "easy",
            },
            {
                id: "quiz-9",
                question:
                    "In the sentence 'The friendly nurse carefully explained the form,' what part of speech is 'friendly'?",
                options: [
                    { value: "a", label: "Noun" },
                    { value: "c", label: "Adverb" },
                    { value: "b", label: "Adjective" },
                    { value: "d", label: "Pronoun" },
                ],
                correctAnswer: "b",
                explanation:
                    "'Friendly' is an adjective because it describes the noun 'nurse'.",
                skillTag: "identify-adjective-describing-person",
                difficulty: "medium",
            },
            {
                id: "quiz-10",
                question:
                    "In the sentence 'She usually takes the bus to class,' what part of speech is 'usually'?",
                options: [
                    { value: "a", label: "Noun" },
                    { value: "c", label: "Adjective" },
                    { value: "d", label: "Preposition" },
                    { value: "b", label: "Adverb" },
                ],
                correctAnswer: "b",
                explanation:
                    "'Usually' is an adverb of frequency because it shows how often she takes the bus.",
                skillTag: "identify-adverb-frequency",
                difficulty: "medium",
            },
            {
                id: "quiz-11",
                question:
                    "In the sentence 'My coworkers and I had a long meeting,' what part of speech is 'my'?",
                options: [
                    { value: "b", label: "Possessive adjective" },
                    { value: "a", label: "Pronoun" },
                    { value: "c", label: "Article" },
                    { value: "d", label: "Conjunction" },
                ],
                correctAnswer: "b",
                explanation:
                    "'My' is a possessive adjective because it shows who the coworkers belong to and comes before the noun.",
                skillTag: "identify-possessive-adjective",
                difficulty: "medium",
            },
            {
                id: "quiz-12",
                question:
                    "In the sentence 'The students sat in the small classroom,' which word is a preposition?",
                options: [
                    { value: "a", label: "students" },
                    { value: "b", label: "in" },
                    { value: "c", label: "small" },
                    { value: "d", label: "classroom" },
                ],
                correctAnswer: "b",
                explanation:
                    "'In' is the preposition because it shows the relationship between the students and the classroom.",
                skillTag: "identify-preposition-in",
                difficulty: "easy",
            },
            {
                id: "quiz-13",
                question:
                    "In the sentence 'We were tired, so we left early,' what part of speech is 'so'?",
                options: [
                    { value: "a", label: "Adverb" },
                    { value: "c", label: "Preposition" },
                    { value: "b", label: "Conjunction" },
                    { value: "d", label: "Pronoun" },
                ],
                correctAnswer: "b",
                explanation:
                    "'So' is a conjunction because it connects the reason (we were tired) with the result (we left early).",
                skillTag: "identify-conjunction-so-result",
                difficulty: "medium",
            },
            {
                id: "quiz-14",
                question:
                    "In the sentence 'They helped us with the application,' what part of speech is 'us'?",
                options: [
                    { value: "a", label: "Subject pronoun" },
                    { value: "c", label: "Noun" },
                    { value: "d", label: "Article" },
                    { value: "b", label: "Object pronoun" },
                ],
                correctAnswer: "b",
                explanation:
                    "'Us' is an object pronoun because it receives the action of the verb 'helped'.",
                skillTag: "identify-pronoun-object",
                difficulty: "medium",
            },
            {
                id: "quiz-15",
                question:
                    "In the sentence 'The doctor quickly wrote a note,' which two words are the verb and adverb?",
                options: [
                    { value: "c", label: "'wrote' and 'quickly'" },
                    { value: "a", label: "'doctor' and 'note'" },
                    { value: "b", label: "'quickly' and 'note'" },
                    { value: "d", label: "'the' and 'wrote'" },
                ],
                correctAnswer: "c",
                explanation:
                    "'Wrote' is the verb (the action) and 'quickly' is the adverb that describes how the doctor wrote.",
                skillTag: "identify-verb-plus-adverb",
                difficulty: "medium",
            },
            {
                id: "quiz-16",
                question:
                    "In the sentence 'The new student is very quiet,' what part of speech is 'very'?",
                options: [
                    { value: "b", label: "Adjective" },
                    { value: "a", label: "Adverb" },
                    { value: "c", label: "Noun" },
                    { value: "d", label: "Pronoun" },
                ],
                correctAnswer: "a",
                explanation:
                    "'Very' is an adverb of degree because it shows how quiet the student is.",
                skillTag: "identify-adverb-degree",
                difficulty: "medium",
            },
        ],
    /*
    TEACHER DIAGNOSTIC NOTES – Parts of Speech Mini Quiz

    This mini quiz checks whether students can:
    - Recognize all eight parts of speech in real-world sentences.
    - Distinguish nouns, verbs, adjectives, and adverbs with simple tests.
    - Identify pronouns and possessive adjectives and understand their function.
    - Spot articles, prepositions, and conjunctions in context.
    - Connect what they see here to the color-coding and examples in the guide.

    Skill tags:

    Nouns and verbs
    - identify-noun-place
    - identify-verb-action
    - identify-verb-plus-adverb

    Adjectives and adverbs
    - identify-adjective-quality
    - identify-adjective-describing-person
    - identify-adverb-manner-ly
    - identify-adverb-frequency
    - identify-adverb-degree

    Pronouns and possessives
    - identify-pronoun-subject
    - identify-pronoun-object
    - identify-possessive-adjective

    Articles, prepositions, conjunctions
    - identify-article-the
    - identify-preposition-location
    - identify-preposition-in
    - identify-conjunction-and
    - identify-conjunction-so-result

    How to read the diagnostics:
    - If noun and verb tags are weak (identify-noun-place, identify-verb-action, identify-verb-plus-adverb) →
      Return to the basic tests:
      • Noun test: Can you put "a/an/the" before it? Can it be a person, place, thing, or idea?
      • Verb test: Can you put it after "I am" with -ing? (I am walking, I am working)
      Practice having students highlight all nouns in blue and all verbs in red in short sentences.

    - If adjective and adverb tags are weak (identify-adjective-quality, identify-adjective-describing-person, identify-adverb-manner-ly, identify-adverb-frequency, identify-adverb-degree) →
      Rebuild the adjective vs adverb chart:
      • Adjectives describe nouns: good teacher, small room, friendly nurse.
      • Adverbs describe verbs/adjectives/other adverbs: speak clearly, very quiet, drive carefully.
      Do contrast drills:
      • She is a careful driver vs She drives carefully.
      • The test is hard vs She worked hard.

    - If pronoun and possessive tags are weak (identify-pronoun-subject, identify-pronoun-object, identify-possessive-adjective) →
      Revisit the pronoun table:
      • Subject: I, you, he, she, it, we, they.
      • Object: me, you, him, her, it, us, them.
      • Possessive adjectives: my, your, his, her, its, our, their.
      Have students transform sentences:
      • Maria and Carlos are late → They are late.
      • The teacher helps the students → The teacher helps them.
      • This is the car of my brother → This is my brother's car.

    - If article, preposition, and conjunction tags are weak (identify-article-the, identify-preposition-location, identify-preposition-in, identify-conjunction-and, identify-conjunction-so-result) →
      Use simple pattern charts:
      • Articles: a, an, the + noun.
      • Prepositions: in, on, at, to, from, next to, behind, under.
      • Conjunctions (FANBOYS): and, but, or, so.
      Give students short sentences and ask them to label only these small words. Then ask: What do these little words do in the sentence?

    Suggested use:
    - Use this mini quiz at the end of the Parts of Speech guide as a checkpoint.
    - At the class level:
      • If nouns and verbs are red → slow down and practice marking them with colors before moving to more advanced grammar.
      • If adjectives vs adverbs are red → pause and do more compare/contrast sentences, especially with -ly adverbs and common adjectives.
      • If pronouns and possessives are red → integrate quick corrections into writing and speaking tasks ("Me and my friend" vs "My friend and I").
      • If articles/prepositions/conjunctions are red → focus on short, high-frequency phrases (at work, in the morning, on Tuesday, and/but/so) before returning to long sentences.
    */
};
