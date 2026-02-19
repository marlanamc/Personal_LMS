import type { InteractiveGuideContent } from "@/types/activity";

export const informationQuestionsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Information Questions: Getting the Answers You Need",
            icon: "❓",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"When does the lease start?" "How much is the security deposit?" "Who do I call for repairs?" Real life requires real questions - and knowing how to ask them correctly can make all the difference.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Information questions (also called WH-questions) help you:</p>
                <ul>
                    <li><strong>Get crucial information</strong> - About housing, jobs, healthcare, your rights</li>
                    <li><strong>Advocate for yourself</strong> - Ask follow-up questions when you don't understand</li>
                    <li><strong>Sound professional</strong> - In interviews, meetings, and important conversations</li>
                    <li><strong>Avoid misunderstandings</strong> - Clarify details before it's too late</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>Throughout the course, you'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong> Asking your landlord questions (rent, repairs, rules)</li>
                        <li><strong> Preparing for job interviews (asking about the job, schedule, benefits)</li>
                        <li><strong> Asking about your rights at work</li>
                        <li><strong> Talking to your doctor (symptoms, medications, appointments)</li>
                        <li><strong> Getting information about community resources</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">✨ This is one of the MOST IMPORTANT grammar topics - that's why we practice it 6 times this course!</p>
                </div>
            `,
            exercises: [
                {
                    id: "infoq-intro-1",
                    title: "Quick Check: Pick the Best Question Word",
                    instructions: "Choose the best WH-word for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "You want to know the price of the utilities (money). _____ are the utilities?",
                            options: ["Who", "What", "When", "Where", "Why", "How much", "How many"],
                            expectedAnswer: "How much",
                        },
                        {
                            type: "select",
                            label: "You want to know the person responsible for repairs. _____ do I call for repairs?",
                            options: ["Who", "What", "When", "Where", "Why", "How", "How many"],
                            expectedAnswer: "Who",
                        },
                    ],
                },
            ],
        },

        // WH-Words Overview
        {
            id: "wh-words-overview",
            stepNumber: 1,
            title: "The Question Words: Who, What, When, Where, Why, How",
            icon: "🔍",
            explanation: `
                <h3>The Six Essential Question Words</h3>
                <p>Each question word asks for a different type of information. Knowing which one to use helps you get the exact answer you need.</p>
            `,
            exercises: [
                {
                    id: "infoq-wh-1",
                    title: "Practice: Match the Question Word",
                    instructions: "Choose the best question word.",
                    items: [
                        {
                            type: "select",
                            label: "_____ is the bus stop? (location)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "Where",
                        },
                        {
                            type: "select",
                            label: "_____ do you need this form? (reason)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "Why",
                        },
                        {
                            type: "select",
                            label: "_____ can I contact maintenance? (method)",
                            options: ["Who", "What", "When", "Where", "Why", "How"],
                            expectedAnswer: "How",
                        },
                    ],
                },
            ],
            usageMeanings: [
                {
                    title: "👤 WHO = Person",
                    description: "Use 'who' to ask about people - their identity, role, or responsibility",
                    examples: [
                        {
                            sentence: "<strong>Who</strong> is the landlord?",
                            explanation: "✓ Identity"
                        },
                        {
                            sentence: "<strong>Who</strong> do I report to?",
                            explanation: "✓ Role/Position"
                        },
                    ],
                },
                {
                    title: "📝 WHAT = Thing/Information/Action",
                    description: "Use 'what' to ask about things, information, or details.",
                    examples: [
                        {
                            sentence: "<strong>What</strong> are the building rules?",
                            explanation: "✓ Information"
                        },
                        {
                            sentence: "<strong>What</strong> documents do I need?",
                            explanation: "✓ Things"
                        },
                    ],
                },
                {
                    title: "🧩 WHAT + NOUN = Specific Details",
                    description: "Combine 'what' with a noun to ask for very specific details.",
                    examples: [
                        {
                            sentence: "<strong>What time</strong> does it start?",
                            explanation: "✓ Specific hour"
                        },
                        {
                            sentence: "<strong>What size</strong> is the apartment?",
                            explanation: "✓ Specific measurement"
                        },
                        {
                            sentence: "<strong>What kind</strong> of pets are allowed?",
                            explanation: "✓ Specific category"
                        },
                    ],
                },
                {
                    title: "📅 WHEN = Time",
                    description: "Use 'when' to ask about dates, hours, and deadlines.",
                    examples: [
                        {
                            sentence: "<strong>When</strong> is rent due?",
                            explanation: "✓ Deadline"
                        },
                    ],
                },
                {
                    title: "📍 WHERE = Place/Location",
                    description: "Use 'where' to ask about locations or positions.",
                    examples: [
                        {
                            sentence: "<strong>Where</strong> do I park?",
                            explanation: "✓ Location"
                        },
                    ],
                },
                {
                    title: "🤔 WHY = Reason/Explanation",
                    description: "Use 'why' to ask for reasons or causes.",
                    examples: [
                        {
                            sentence: "<strong>Why</strong> is the rent going up?",
                            explanation: "✓ Reason"
                        },
                    ],
                },
                {
                    title: "🔧 HOW = Method/Manner",
                    description: "Use 'how' to ask about the way something is done.",
                    examples: [
                        {
                            sentence: "<strong>How</strong> do I pay rent?",
                            explanation: "✓ Method/Process"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Tip",
                content:
                    "All these words start with WH except 'how.' That's why we call them 'WH-questions'!",
            },
        },

        // How Much vs How Many
        {
            id: "how-much-how-many",
            stepNumber: 2,
            title: "How Much vs How Many: The Money Question",
            icon: "💰",
            explanation: `
                <h3>Two of the Most Important Questions</h3>
                <p>These questions come up constantly when discussing money, time, rent, and work. Getting them right makes you sound professional.</p>
            `,
            usageMeanings: [
                {
                    title: "🔢 HOW MANY = Countable Nouns",
                    description: "Use 'how many' when asking about things you can count (plural nouns)",
                    examples: [
                        {
                            sentence: "<strong>How many hours</strong> per week do you work?",
                            explanation: "✓ Hours are countable (1 hour, 2 hours, 40 hours)"
                        },
                        {
                            sentence: "<strong>How many bedrooms</strong> does the apartment have?",
                            explanation: "✓ Bedrooms are countable units"
                        },
                        {
                            sentence: "<strong>How many vacation days</strong> do you get?",
                            explanation: "✓ Days are countable"
                        },
                        {
                            sentence: "<strong>How many employees</strong> work here?",
                            explanation: "✓ People/employees are countable"
                        },
                    ],
                },
                {
                    title: "💵 HOW MUCH = Uncountable Nouns",
                    description: "Use 'how much' when asking about amounts you can't count individually",
                    examples: [
                        {
                            sentence: "<strong>How much is</strong> the rent?",
                            explanation: "✓ Money/rent is uncountable (asking about amount)"
                        },
                        {
                            sentence: "<strong>How much is</strong> the security deposit?",
                            explanation: "✓ Money as a concept is uncountable"
                        },
                        {
                            sentence: "<strong>How much time</strong> do I have before the deadline?",
                            explanation: "✓ Time is uncountable (though hours/minutes are countable)"
                        },
                        {
                            sentence: "<strong>How much experience</strong> is required?",
                            explanation: "✓ Experience is uncountable"
                        },
                    ],
                },
                {
                    title: "💼 Essential Housing & Work Questions",
                    description: "The questions you'll actually use when apartment hunting or job searching",
                    examples: [
                        {
                            sentence: "<strong>How much</strong> is the rent per month?",
                            explanation: "✓ Rent = money = uncountable"
                        },
                        {
                            sentence: "<strong>How many</strong> people can live here?",
                            explanation: "✓ People = countable"
                        },
                        {
                            sentence: "<strong>How much</strong> notice do I need to give?",
                            explanation: "✓ Notice (time) = uncountable"
                        },
                        {
                            sentence: "<strong>How many</strong> sick days do I get?",
                            explanation: "✓ Days = countable"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Same rule as many/much from the last lesson! Can you count it (1, 2, 3...)? Use HOW MANY. Can't count it? Use HOW MUCH.",
            },
            exercises: [
                {
                    id: "ex-how-much-many-1",
                    title: "Practice: How Much or How Many?",
                    instructions:
                        "Choose the correct question word for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "___ does the apartment cost per month?",
                            options: [
                                { value: "how-much", label: "How much" },
                                { value: "how-many", label: "How many" },
                            ],
                            expectedAnswer: "how-much",
                        },
                        {
                            type: "radio",
                            label: "___ bedrooms does it have?",
                            options: [
                                { value: "how-much", label: "How much" },
                                { value: "how-many", label: "How many" },
                            ],
                            expectedAnswer: "how-many",
                        },
                        {
                            type: "radio",
                            label: "___ notice do I need to give before moving out?",
                            options: [
                                { value: "how-much", label: "How much" },
                                { value: "how-many", label: "How many" },
                            ],
                            expectedAnswer: "how-much",
                        },
                        {
                            type: "radio",
                            label: "___ people live in the building?",
                            options: [
                                { value: "how-much", label: "How much" },
                                { value: "how-many", label: "How many" },
                            ],
                            expectedAnswer: "how-many",
                        },
                    ],
                },
            ],
        },

        // Question Word Order
        {
            id: "question-word-order",
            stepNumber: 3,
            title: "Word Order: The Formula That Always Works",
            icon: "📐",
            explanation: `
                <h3>The Standard Question Pattern</h3>
                <p>Information questions follow a specific word order. Get this right, and your questions will always sound natural:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="font-size: 1.25rem; text-align: center; margin-bottom: 1rem; font-weight: 600;">
                        WH-word + Helping Verb + Subject + Main Verb + ?
                    </div>
                    <p style="text-align: center; margin: 0; font-style: italic;">
                        (Question word) + (do/does/did/is/are/can) + (who/what) + (verb) + ?
                    </p>
                </div>

                <h4>Examples with Different Auxiliaries:</h4>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">Present Simple (do/does):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>When</strong> <span style="color: #d97757;">do</span> <span style="color: #3b82f6;">you</span> <span style="color: #22c55e;">pay</span> rent?</li>
                        <li><strong>Where</strong> <span style="color: #d97757;">does</span> <span style="color: #3b82f6;">the manager</span> <span style="color: #22c55e;">work</span>?</li>
                        <li><strong>How</strong> <span style="color: #d97757;">do</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">contact</span> maintenance?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">With 'be' (is/are/was/were):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Where</strong> <span style="color: #d97757;">is</span> <span style="color: #3b82f6;">the laundry room</span>?</li>
                        <li><strong>What</strong> <span style="color: #d97757;">are</span> <span style="color: #3b82f6;">the building rules</span>?</li>
                        <li><strong>When</strong> <span style="color: #d97757;">was</span> <span style="color: #3b82f6;">the building</span> <span style="color: #22c55e;">built</span>?</li>
                    </ul>
                </div>

                <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-weight: 600;">With modals (can/will/should):</p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>How</strong> <span style="color: #d97757;">can</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">pay</span> the deposit?</li>
                        <li><strong>When</strong> <span style="color: #d97757;">will</span> <span style="color: #3b82f6;">you</span> <span style="color: #22c55e;">fix</span> the heater?</li>
                        <li><strong>Who</strong> <span style="color: #d97757;">should</span> <span style="color: #3b82f6;">I</span> <span style="color: #22c55e;">call</span> for emergencies?</li>
                    </ul>
                </div>
                <div style="background: #fdf6e3; padding: 1rem; border-left: 4px solid #b58900; border-radius: 0.3rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; font-weight: 600;">🛑 Stop and Think:</p>
                    <p style="margin-bottom: 0;">In English, we usually say "I live here" (Subj + Verb). But in a question, we <strong>split</strong> the verb: "Where <strong>do</strong> you <strong>live</strong>?"</p>
                </div>
            `,
            formula: [
                { text: "WH-word", type: "other" },
                { text: "+", type: "other" },
                { text: "Helping Verb", type: "verb" },
                { text: "+", type: "other" },
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "Main Verb", type: "verb" },
                { text: "+", type: "other" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-word-order-1",
                    title: "Practice: Put Words in Order",
                    instructions:
                        "Rewrite each scrambled question in the correct order.",
                    items: [
                        {
                            type: "text",
                            label: "(rent / when / is / due / the) ?",
                            expectedAnswer: "When is the rent due?",
                        },
                        {
                            type: "text",
                            label: "(landlord / does / where / live / the) ?",
                            expectedAnswer: "Where does the landlord live?",
                        },
                        {
                            type: "text",
                            label: "(utilities / what / included / are) ?",
                            expectedAnswer: "What utilities are included?",
                        },
                        {
                            type: "text",
                            label: "(I / how / pay / can / rent) ?",
                            expectedAnswer: "How can I pay rent?",
                        },
                    ],
                },
            ],
        },

        // Subject vs Object Questions
        {
            id: "subject-object-questions",
            stepNumber: 4,
            title: "Subject Questions: When 'Who' and 'What' Break the Rules",
            icon: "⚡",
            explanation: `
                <div style="background: rgba(122, 143, 124, 0.1); padding: 1.5rem; border-radius: 0.75rem; border-left: 5px solid #7ba884; margin-bottom: 2rem;">
                    <h3 style="margin-top: 0; color: #2d3748;">The One Rule to Remember</h3>
                    <p style="font-size: 1.2rem; font-weight: 600; color: #2f855a; margin-bottom: 0;">If "who" or "what" is doing the action, do NOT use do / does / did.</p>
                </div>

                <div style="margin-bottom: 2.5rem; text-align: center;">
                    <h3 style="color: #4a5568; margin-bottom: 1rem;">The Simple Test</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">Ask yourself this every time:</p>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #d97757; background: #fff; display: inline-block; padding: 1rem 2rem; border-radius: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid rgba(217, 119, 87, 0.2);">
                        👉 Who is the doer?
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="background: #f0f7f1; border: 2px solid #7ba884; border-radius: 1rem; padding: 1.5rem; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; font-size: 4rem; opacity: 0.05; pointer-events: none;">👤</div>
                        <h4 style="color: #2f855a; margin-top: 0; display: flex; align-items: center; gap: 1rem; font-size: 1.2rem;">
                            <span style="background: #7ba884; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">1</span>
                            "Who / What" is the doer
                        </h4>
                        <p style="font-weight: 700; font-size: 1.3rem; color: #2d3748; margin: 0.5rem 0 1rem 3rem;">❌ NO do / does / did</p>
                        
                        <div style="background: white; padding: 1.25rem; border-radius: 0.75rem; margin-left: 3rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                            <p style="font-family: monospace; font-size: 1.1rem; margin-bottom: 0.75rem; color: #4a5568;"><strong>Pattern:</strong> Who / What + verb</p>
                            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 0.75rem 0;">
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <p style="margin: 0;"><strong>Who pays</strong> the rent? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ Someone pays.</span></p>
                                <p style="margin: 0;"><strong>Who lives</strong> in apartment 3B? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ Someone lives there.</span></p>
                                <p style="margin: 0;"><strong>What includes</strong> heat and water? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ Something includes it.</span></p>
                            </div>
                        </div>
                        <p style="margin: 1rem 0 0 3rem; font-size: 1rem; color: #4a5568;">🧠 <strong>Think:</strong> Who is the doer? The doer is <strong>who</strong>, so no do.</p>
                    </div>

                    <div style="background: #fff5f2; border: 2px solid #d97757; border-radius: 1rem; padding: 1.5rem; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -10px; right: -10px; font-size: 4rem; opacity: 0.05; pointer-events: none;">🎯</div>
                        <h4 style="color: #c05621; margin-top: 0; display: flex; align-items: center; gap: 1rem; font-size: 1.2rem;">
                            <span style="background: #d97757; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">2</span>
                            "Who / What" is NOT the doer
                        </h4>
                        <p style="font-weight: 700; font-size: 1.3rem; color: #2d3748; margin: 0.5rem 0 1rem 3rem;">✅ USE do / does / did</p>
                        
                        <div style="background: white; padding: 1.25rem; border-radius: 0.75rem; margin-left: 3rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                            <p style="font-family: monospace; font-size: 1.1rem; margin-bottom: 0.75rem; color: #4a5568;"><strong>Pattern:</strong> Who / What + <span style="color: #d97757;">do/does/did</span> + subj + verb</p>
                            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 0.75rem 0;">
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <p style="margin: 0;">Who <strong>do you pay</strong>? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ You pay someone.</span></p>
                                <p style="margin: 0;">Who <strong>did you call</strong>? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ You called someone.</span></p>
                                <p style="margin: 0;">What <strong>does the rent include</strong>? <span style="color: #718096; font-size: 0.9rem; margin-left: 0.5rem;">→ The rent includes something.</span></p>
                            </div>
                        </div>
                        <p style="margin: 1rem 0 0 3rem; font-size: 1rem; color: #4a5568;">🧠 <strong>Think:</strong> Who is the doer? <strong>You</strong> are the doer, so use do / does / did.</p>
                    </div>
                </div>

                <div style="background: #ebf8ff; padding: 1.5rem; border-radius: 1rem; border: 1px solid #bee3f8; margin-bottom: 2rem;">
                    <h4 style="color: #2b6cb0; margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">✨ A Helpful Trick</h4>
                    <p>Try to answer the question in a full sentence:</p>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; background: white; padding: 0.75rem; border-radius: 0.5rem;">
                            <div style="flex: 1;"><strong>Who pays the rent?</strong><br><span style="color: #718096;">→ Someone pays the rent.</span></div>
                            <div style="color: #38a169; font-weight: bold; font-size: 0.9rem;">✔️ No do</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem; background: white; padding: 0.75rem; border-radius: 0.5rem;">
                            <div style="flex: 1;"><strong>Who do you pay?</strong><br><span style="color: #718096;">→ I pay someone.</span></div>
                            <div style="color: #3182ce; font-weight: bold; font-size: 0.9rem;">✔️ Use do</div>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(0, 0, 0, 0.02); padding: 1.5rem; border-radius: 1rem; text-align: center; border: 1px dashed #cbd5e0;">
                    <p style="margin-top: 0; font-weight: 600; color: #4a5568;">Final Takeaway</p>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><strong>Who does the action?</strong></p>
                    <p style="margin: 0.25rem 0;">If it’s <strong>who / what</strong> → no do</p>
                    <p style="margin: 0.25rem 0;">If it’s <strong>you / another person</strong> → use do / does / did</p>
                </div>

                <div style="margin-top: 2rem; padding: 1rem; background: #fffaf0; border-radius: 0.75rem; border: 1px solid #feebc8; font-style: italic; color: #7b341e; text-align: center;">
                    <p style="margin: 0;">This rule is hard, even for advanced English learners. If you forget, people will still understand you. The goal is progress, not perfection.</p>
                </div>
            `,
            tipBox: {
                title: "💡 Quick Test",
                content:
                    "Can you answer with a simple subject? Then it's a subject question (no helping verb). Example: 'Who manages the building?' → 'Maria does.' vs 'Who do you know?' → 'I know Maria.'",
            },
            exercises: [
                {
                    id: "ex-subject-object-1",
                    title: "Practice: Subject or Object Question?",
                    instructions:
                        "Choose the correct question form.",
                    items: [
                        {
                            type: "radio",
                            label: "___ lives in apartment 3B?",
                            options: [
                                { value: "who-does", label: "Who does" },
                                { value: "who-do", label: "Who do" },
                                { value: "who", label: "Who" },
                            ],
                            expectedAnswer: "who",
                        },
                        {
                            type: "radio",
                            label: "___ you contact for repairs?",
                            options: [
                                { value: "who-do", label: "Who do" },
                                { value: "who", label: "Who" },
                                { value: "who-does", label: "Who does" },
                            ],
                            expectedAnswer: "who-do",
                        },
                        {
                            type: "radio",
                            label: "___ pays for pest control?",
                            options: [
                                { value: "who-does", label: "Who does" },
                                { value: "who", label: "Who" },
                                { value: "who-do", label: "Who do" },
                            ],
                            expectedAnswer: "who",
                        },
                    ],
                },
            ],
        },

        // Housing Questions
        {
            id: "housing-questions",
            stepNumber: 5,
            title: "Essential Housing Questions: What to Ask Landlords",
            icon: "🏠",
            explanation: `
                <h3>Real Questions for Real Situations</h3>
                <p>These are the questions you actually need when looking for housing or dealing with landlords:</p>

                <div style="margin-top: 1.5rem;">
                    <div style="background: rgba(110, 145, 118, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #7ba884;">
                        <h4 style="margin-top: 0;">About Money:</h4>
                        <ul style="margin: 0;">
                            <li>How much is the rent per month?</li>
                            <li>How much is the security deposit?</li>
                            <li>When is rent due?</li>
                            <li>What utilities are included?</li>
                            <li>How can I pay rent?</li>
                        </ul>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #d97757;">
                        <h4 style="margin-top: 0;">About the Apartment:</h4>
                        <ul style="margin: 0;">
                            <li>How many bedrooms does it have?</li>
                            <li>Where is parking?</li>
                            <li>What's included in the apartment?</li>
                            <li>When was it last renovated?</li>
                            <li>Where is the laundry?</li>
                        </ul>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.05); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="margin-top: 0;">About Rules & Repairs:</h4>
                        <ul style="margin: 0;">
                            <li>What are the building rules?</li>
                            <li>Who do I contact for repairs?</li>
                            <li>How much notice do I give before moving?</li>
                            <li>When can I move in?</li>
                            <li>Why did the last tenant move out?</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-housing-1",
                    title: "Practice: Write Your Own Questions",
                    instructions:
                        "Complete these landlord interview questions with the correct WH-word.",
                    items: [
                        {
                            type: "text",
                            label: "___ do I contact if the heat doesn't work?",
                            expectedAnswer: "Who",
                        },
                        {
                            type: "text",
                            label: "___ does the landlord call for repairs?",
                            expectedAnswer: "Who",
                        },
                        {
                            type: "text",
                            label: "___ is garbage collection day?",
                            expectedAnswer: "When",
                        },
                        {
                            type: "text",
                            label: "___ can I park my car?",
                            expectedAnswer: "Where",
                        },
                        {
                            type: "text",
                            label: "___ notice do I need to give before moving out?",
                            expectedAnswer: "How much",
                        },
                        {
                            type: "text",
                            label: "___ is the rent going up next year?",
                            expectedAnswer: "Why",
                        },
                    ],
                },
            ],
        },


        // What vs Which
        {
            id: "what-vs-which",
            stepNumber: 6,
            title: "What vs Which: Choosing Between Options",
            icon: "🤔",
            explanation: `
                <h3>Which One Should You Use?</h3>
                <p>Students often get confused between <strong>What</strong> and <strong>Which</strong>. The rule is simple: it depends on how many choices you have.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                            <h4 style="color: #d97757; margin-top: 0;">📝 WHAT</h4>
                            <p style="font-weight: 600;">Unlimited Choices</p>
                            <p>Use "what" when there are many, many possible answers.</p>
                            <p style="font-style: italic;">"What is your name?" (Thousands of possibilities)</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                            <h4 style="color: #7ba884; margin-top: 0;">🎯 WHICH</h4>
                            <p style="font-weight: 600;">Limited Choices</p>
                            <p>Use "which" when you are choosing from a small group (usually 2-5 things).</p>
                            <p style="font-style: italic;">"Which apartment do you want, 3A or 3B?" (Only two choices)</p>
                        </div>
                    </div>
                </div>

                <h4>In Housing and Work:</h4>
                <ul>
                    <li>"<strong>What</strong> is the address?" (Unlimited possibilities)</li>
                    <li>"<strong>Which</strong> floor is the apartment on?" (Limited floors in a building)</li>
                    <li>"<strong>What</strong> kind of job do you want?" (General)</li>
                    <li>"<strong>Which</strong> shift do you prefer, morning or night?" (Specific choices)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "ex-what-vs-which-1",
                    title: "Practice: What or Which?",
                    instructions: "Choose the best question word for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You see three different keys on the table. You ask: '____ key is for the mailbox?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "which",
                        },
                        {
                            type: "radio",
                            label: "You want to know someone's phone number. You ask: '____ is your number?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "what",
                        },
                        {
                            type: "radio",
                            label: "There are two buses at the stop. You ask: '____ bus goes to downtown?'",
                            options: [
                                { value: "what", label: "What" },
                                { value: "which", label: "Which" },
                            ],
                            expectedAnswer: "which",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Quick Reference: Information Questions Cheat Sheet",
            icon: "📋",
            explanation: `
                <h3>Question Words Quick Guide</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Question Word</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Asks About</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Who</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Person</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Who is the manager?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>What</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Thing/Information (Unlimited)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">What's the address?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Which</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Choice (Limited)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Which floor?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>When</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">When is rent due?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Where</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Place</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Where do I park?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>Why</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Reason</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Why is rent increasing?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Method/Manner</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How do I pay?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How much</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Amount (non-count)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How much is rent?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"><strong>How many</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Number (count)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">How many rooms?</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Standard Word Order</h3>
                <p><strong>WH-word + Helping Verb + Subject + Main Verb + ?</strong></p>
                <ul>
                    <li>Where <em>do</em> you live?</li>
                    <li>When <em>does</em> the lease start?</li>
                    <li>What <em>is</em> the deposit?</li>
                </ul>

                <h3>Exception: Who is the Doer?</h3>
                <p><strong>Who/What + Verb + ?</strong> (NO helping verb when who/what is the doer)</p>
                <ul>
                    <li>Who pays utilities? <span style="color: #718096; font-size: 0.95rem;">→ The doer is "Who"</span></li>
                    <li>What includes parking? <span style="color: #718096; font-size: 0.95rem;">→ The doer is "What"</span></li>
                </ul>

                <h3>Common Mistakes to Avoid:</h3>
                <ul>
                    <li>❌ "Where you live?" → ✅ "Where do you live?" (need helping verb)</li>
                    <li>❌ "How much bedrooms?" → ✅ "How many bedrooms?" (bedrooms are countable)</li>
                    <li>❌ "Who does pay rent?" → ✅ "Who pays rent?" (The doer is "Who", no "do")</li>
                    <li>❌ "What is the rent costs?" → ✅ "How much is the rent?" OR "What does the rent cost?"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice Tip",
                content:
                    "Next time you need to ask a question, pause and think: What information do I need? (Choose WH-word) → What's the helping verb? (do/does/is/are/can) → Put them in order. With practice, it becomes automatic!",
            },
            exercises: [
                {
                    id: "infoq-summary-1",
                    title: "Comprehensive Review: Information Questions",
                    instructions: "Choose the correct answer for each question.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to ask about the due date of rent.",
                            options: [
                                { value: "b", label: "When the rent is due?" },
                                { value: "c", label: "When is due the rent?" },
                                { value: "a", label: "When is the rent due?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Subject question (no helping verb):",
                            options: [
                                { value: "a", label: "Who pays utilities?" },
                                { value: "b", label: "Who does pay utilities?" },
                                { value: "c", label: "Who do pay utilities?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which WH-word asks about a person?",
                            options: [
                                { value: "a", label: "What" },
                                { value: "b", label: "Who" },
                                { value: "c", label: "Where" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question about money:",
                            options: [
                                { value: "a", label: "How many is the rent?" },
                                { value: "c", label: "How much are the rent?" },
                                { value: "b", label: "How much is the rent?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You see two apartments available. You ask:",
                            options: [
                                { value: "b", label: "Which apartment do you prefer?" },
                                { value: "a", label: "What apartment do you prefer?" },
                                { value: "c", label: "Where apartment do you prefer?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct indirect question:",
                            options: [
                                { value: "a", label: "Could you tell me where is the office?" },
                                { value: "b", label: "Could you tell me where the office is?" },
                                { value: "c", label: "Could you tell me is where the office?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Object question (needs helping verb):",
                            options: [
                                { value: "a", label: "Who you call for repairs?" },
                                { value: "c", label: "Who calls for repairs?" },
                                { value: "b", label: "Who do you call for repairs?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which question asks about a reason?",
                            options: [
                                { value: "b", label: "Why is the rent going up?" },
                                { value: "a", label: "When is the rent going up?" },
                                { value: "c", label: "Where is the rent going up?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question about countable items:",
                            options: [
                                { value: "a", label: "How much bedrooms does it have?" },
                                { value: "b", label: "How many bedrooms does it have?" },
                                { value: "c", label: "How many bedroom does it have?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which is an embedded question?",
                            options: [
                                { value: "a", label: "What time does the clinic close?" },
                                { value: "c", label: "What time the clinic closes?" },
                                { value: "b", label: "I'm wondering what time the clinic closes." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        // ADVANCED: Indirect Questions
        {
            id: "indirect-questions",
            stepNumber: 7,
            title: "Indirect Questions: Polite and Professional",
            icon: "💼",
            explanation: `
                <h3>Making Questions More Polite</h3>
                <p>In English, asking questions directly can sometimes sound a bit demanding. To be extra professional and polite (at work, at the doctor, or with landlords), we often use <strong>Indirect Questions</strong>.</p>

                <div style="background: #fdf6e3; padding: 1rem; border-left: 4px solid #b58900; border-radius: 0.3rem; margin-bottom: 1.5rem;">
                    <p style="margin-top: 0; font-weight: 600;">🛑 Stop and Think:</p>
                    <p style="margin-bottom: 0;">If you are asking your boss about your paycheck, which sounds better? "Where is my check?" or "Could you tell me where my check is?"</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); border-left: 4px solid #7ba884; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem;">🧠 Think of Indirect Questions Like This</h3>
                    <p>An indirect question is:<br><strong>A polite sentence + a question inside it</strong></p>
                    <p>The question itself does NOT change.<br>It just goes inside a sentence.</p>
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0.5rem 0;"><strong>Direct question:</strong><br>Where is the office?</p>
                        <p style="margin: 0.5rem 0;"><strong>Polite sentence:</strong><br>Could you tell me…</p>
                        <p style="margin: 0.5rem 0;"><strong>Polite long question:</strong><br>Could you tell me where the office is?</p>
                    </div>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #b58900; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; margin-bottom: 0.75rem; font-weight: 600; color: #856404;">⚠️ Important Reminder</p>
                    <p style="margin: 0.5rem 0;">Inside an indirect question, the word order is like a statement:<br><strong>subject + verb</strong></p>
                    <p style="margin: 0.75rem 0 0.5rem 0;"><strong>We say:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>where the office is</li>
                        <li>what time the clinic closes</li>
                        <li>how much the deposit is</li>
                    </ul>
                    <p style="margin: 0.75rem 0 0.5rem 0;"><strong>NOT:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>where is the office</li>
                        <li>what time does the clinic close</li>
                        <li>how much does the deposit cost</li>
                    </ul>
                    <p style="margin-top: 0.75rem; margin-bottom: 0;">This reinforces what you already taught, without reframing.</p>
                </div>

                <div style="background: rgba(110, 145, 118, 0.1); border-left: 4px solid #7ba884; padding: 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <p style="margin-top: 0; margin-bottom: 0.5rem; font-weight: 600; color: #7ba884;">✅ Good to Know</p>
                    <p style="margin: 0;">If you accidentally use question word order in an indirect question, people will usually still understand you.</p>
                    <p style="margin: 0.75rem 0 0;">Indirect questions are about being polite and professional, not about being perfect.</p>
                </div>

                <p style="margin-top: 1.5rem; margin-bottom: 0; font-weight: 600; font-size: 1.05rem;"><strong>Takeaway:</strong><br>In polite long questions, use statement word order inside the sentence.</p>
            `,
            comparison: {
                title: "Direct vs. Indirect Word Order",
                leftLabel: "Direct (Less Polite)",
                rightLabel: "Indirect (More Polite)",
                rows: [
                    {
                        label: "Location",
                        left: "Where <strong>is the office</strong>?",
                        right: "Could you tell me where <strong>the office is</strong>?"
                    },
                    {
                        label: "Price",
                        left: "How much <strong>does it cost</strong>?",
                        right: "Do you know how much <strong>it costs</strong>?"
                    },
                    {
                        label: "Time",
                        left: "When <strong>does it start</strong>?",
                        right: "I was wondering when <strong>it starts</strong>?"
                    }
                ]
            },
            formula: [
                { text: "Polite Phrase", type: "other" },
                { text: "+", type: "other" },
                { text: "WH-word", type: "other" },
                { text: "+", type: "other" },
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "Verb", type: "verb" },
                { text: "+", type: "other" },
                { text: "?", type: "other" },
            ],
            tipBox: {
                title: "💡 Why Use Indirect Questions?",
                content:
                    "Use indirect questions when: (1) Talking to your boss or doctor, (2) Asking for sensitive information (salary, rent cost), (3) You don't know the person well. They sound more respectful!",
            },
            exercises: [
                {
                    id: "ex-indirect-1",
                    title: "Practice: Make It Indirect",
                    instructions:
                        "Rewrite each direct question as an indirect question.",
                    items: [
                        {
                            type: "text",
                            label: "Direct: Where is the manager's office?",
                            expectedAnswer: "Could you tell me where the manager's office is?",
                            expectedAnswers: [
                                "Do you know where the manager's office is?",
                                "I was wondering where the manager's office is?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: What time does the clinic close?",
                            expectedAnswer: "Do you know what time the clinic closes?",
                            expectedAnswers: [
                                "Could you tell me what time the clinic closes?",
                                "I was wondering what time the clinic closes?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: How much is the security deposit?",
                            expectedAnswer: "Could you tell me how much the security deposit is?",
                            expectedAnswers: [
                                "Do you know how much the security deposit is?",
                                "I was wondering how much the security deposit is?",
                            ],
                        },
                        {
                            type: "text",
                            label: "Direct: When is the rent due?",
                            expectedAnswer: "I was wondering when the rent is due?",
                            expectedAnswers: [
                                "Could you tell me when the rent is due?",
                                "Do you know when the rent is due?",
                            ],
                        },
                    ],
                },
            ],
        },

        // ADVANCED: Embedded Questions
        {
            id: "embedded-questions",
            stepNumber: 8,
            title: "Embedded Questions: Even More Professional",
            icon: "🎓",
            explanation: `
                <h3>Questions Within Statements</h3>
                <p>Embedded questions are indirect questions that are part of a larger statement. They're extremely polite and professional - perfect for work, healthcare, and formal situations.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Examples:</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "I'm wondering...":</p>
                        <ul style="margin: 0;">
                            <li>I'm wondering <strong>if you could explain</strong> the benefits package.</li>
                            <li>I'm wondering <strong>whether there's flexibility</strong> in the schedule.</li>
                            <li>I'm wondering <strong>what time</strong> the interview is.</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "I'd like to know...":</p>
                        <ul style="margin: 0;">
                            <li>I'd like to know <strong>if this position</strong> offers health insurance.</li>
                            <li>I'd like to know <strong>how many hours</strong> per week this is.</li>
                            <li>I'd like to know <strong>when you need</strong> someone to start.</li>
                        </ul>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Starting with "Could you clarify...":</p>
                        <ul style="margin: 0;">
                            <li>Could you clarify <strong>what the dress code is</strong>?</li>
                            <li>Could you clarify <strong>whether overtime is paid</strong>?</li>
                            <li>Could you clarify <strong>how the commission works</strong>?</li>
                        </ul>
                    </div>
                </div>

                <h4>Why They Sound Professional:</h4>
                <ul>
                    <li>They soften requests for information</li>
                    <li>They show thoughtfulness (not demanding answers)</li>
                    <li>They're perfect for job interviews, doctor visits, and landlord questions</li>
                </ul>
            `,
            tipBox: {
                title: "💡 When to Use Embedded Questions",
                content:
                    "Job interviews, asking about salary/benefits, talking to your landlord about repairs, asking your doctor about treatment options. Basically: anytime you want to sound extra professional!",
            },
            exercises: [
                {
                    id: "ex-embedded-1",
                    title: "Practice: Embedded Questions",
                    instructions:
                        "Choose the correct embedded question for each situation. Remember: embedded questions use statement word order (subject + verb).",
                    items: [
                        {
                            type: "radio",
                            label: "You want to ask your boss about health insurance politely. Choose the best embedded question:",
                            options: [
                                { value: "b", label: "I'm wondering if does the position offer health insurance." },
                                { value: "a", label: "I'm wondering if the position offers health insurance." },
                                { value: "c", label: "I'm wondering does the position offer health insurance." },
                                { value: "d", label: "I'm wondering if offers the position health insurance." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You want to ask your landlord about utilities. Choose the correct embedded question:",
                            options: [
                                { value: "b", label: "Could you clarify whether does the rent include utilities?" },
                                { value: "c", label: "Could you clarify whether includes the rent utilities?" },
                                { value: "a", label: "Could you clarify whether the rent includes utilities?" },
                                { value: "d", label: "Could you clarify does the rent include utilities?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You're in a job interview asking about hours. Choose the correct embedded question:",
                            options: [
                                { value: "b", label: "I'd like to know how many hours per week is this position." },
                                { value: "c", label: "I'd like to know how many hours per week does this position have." },
                                { value: "d", label: "I'd like to know how many hours per week this position has?" },
                                { value: "a", label: "I'd like to know how many hours per week this position is." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You want to ask your doctor about side effects. Choose the best embedded question:",
                            options: [
                                { value: "b", label: "I'm wondering what the side effects of this medication are." },
                                { value: "a", label: "I'm wondering what are the side effects of this medication." },
                                { value: "c", label: "I'm wondering what do the side effects of this medication include." },
                                { value: "d", label: "I'm wondering what are side effects of this medication." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You're asking about a job start date. Choose the correct embedded question:",
                            options: [
                                { value: "a", label: "I'd like to know when do you need someone to start." },
                                { value: "b", label: "I'd like to know when you need someone to start." },
                                { value: "c", label: "I'd like to know when need you someone to start." },
                                { value: "d", label: "I'd like to know when does you need someone to start." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You want to ask about the dress code at work. Choose the best embedded question:",
                            options: [
                                { value: "a", label: "Could you clarify what is the dress code?" },
                                { value: "c", label: "Could you clarify what does the dress code require?" },
                                { value: "b", label: "Could you clarify what the dress code is?" },
                                { value: "d", label: "Could you clarify what is dress code?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You're asking about overtime pay. Choose the correct embedded question:",
                            options: [
                                { value: "a", label: "I'm wondering whether is overtime paid." },
                                { value: "c", label: "I'm wondering whether does overtime get paid." },
                                { value: "d", label: "I'm wondering whether overtime paid is." },
                                { value: "b", label: "I'm wondering whether overtime is paid." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "You want to ask about the commission structure. Choose the best embedded question:",
                            options: [
                                { value: "b", label: "I'd like to know how the commission works." },
                                { value: "a", label: "I'd like to know how does the commission work." },
                                { value: "c", label: "I'd like to know how works the commission." },
                                { value: "d", label: "I'd like to know how is the commission calculated." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        // ADVANCED: Question Chains
        {
            id: "question-chains",
            stepNumber: 9,
            title: "Professional Question Chains: Digging Deeper",
            icon: "🔗",
            explanation: `
                <h3>Asking Follow-Up Questions</h3>
                <p>In professional situations (job interviews, doctor visits, landlord meetings), you need to ask <strong>3-4 follow-up questions</strong> to get the complete picture. This shows you're engaged and thinking critically.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Example: Asking About a Job</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 1 - Initial Question:</p>
                        <p style="margin: 0;">"What are the hours for this position?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 2 - Clarify Details:</p>
                        <p style="margin: 0;">"Is that Monday through Friday, or does it include weekends?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 3 - Dig Deeper:</p>
                        <p style="margin: 0;">"How much flexibility is there if I need to adjust my schedule occasionally?"</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Level 4 - Plan for Scenarios:</p>
                        <p style="margin: 0;">"What would be the process for requesting time off?"</p>
                    </div>
                </div>

                <h4>The 4-Level Question Strategy:</h4>
                <ol>
                    <li><strong>Initial:</strong> Ask the basic question (What? When? How much?)</li>
                    <li><strong>Clarify:</strong> Get specific details ("Does that include...?" "Is that...?")</li>
                    <li><strong>Dig deeper:</strong> Ask about flexibility, exceptions, options</li>
                    <li><strong>Plan ahead:</strong> "What if...?" "How would...?" "What would happen if...?"</li>
                </ol>

                <h4>Why This Matters:</h4>
                <ul>
                    <li><strong>You avoid misunderstandings</strong> (don't assume - ask!)</li>
                    <li><strong>You show professionalism</strong> (employers/landlords see you're thoughtful)</li>
                    <li><strong>You make informed decisions</strong> (know all the facts before signing a lease or accepting a job)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice This in Class!",
                content:
                    "When we do speaking activities, challenge yourself to ask at least 3 follow-up questions. Don't just accept the first answer - dig deeper! This is how you become a confident communicator.",
            },
            exercises: [
                {
                    id: "ex-chains-1",
                    title: "Practice: Build Complete Question Chains",
                    instructions:
                        "Read each scenario. Then choose the BEST next question to continue the question chain logically.",
                    items: [
                        {
                            type: "radio",
                            label: "Scenario: You're asking about a job. Initial question: 'What are the hours?' Answer: 'The shift is 9:00 AM to 5:00 PM.' What is the BEST next question to clarify?",
                            options: [
                                { value: "b", label: "Where is the office located?" },
                                { value: "c", label: "How much is the salary?" },
                                { value: "a", label: "Does this shift stay the same every week, or does it change?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Scenario: You're asking about an apartment. Initial question: 'Does the rent include utilities?' Answer: 'Yes, some utilities are included.' What is the BEST next question to dig deeper?",
                            options: [
                                { value: "b", label: "Which utilities are included exactly (heat, water, electricity)?" },
                                { value: "a", label: "How much is the rent?" },
                                { value: "c", label: "Who is the landlord?" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Scenario: At a doctor's visit. Initial question: 'How often do I take this?' Answer: 'Twice daily with food.' What is the BEST next question to plan for scenarios?",
                            options: [
                                { value: "b", label: "What is the name of the medicine?" },
                                { value: "a", label: "What should I do if I miss a dose?" },
                                { value: "c", label: "When do I take it?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Scenario: In a job interview. Initial question: 'How much vacation time do I get?' Answer: 'Two weeks per year.' What is the BEST next question to understand the process?",
                            options: [
                                { value: "a", label: "What are the benefits?" },
                                { value: "c", label: "When can I start?" },
                                { value: "b", label: "What is the process for requesting time off?" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz
      // Mini Quiz
  miniQuiz: [
    {
      id: "quiz-1",
      question: "Which question is correct?",
      options: [
        { value: "c", label: "How many bedrooms does the apartment have?" },
        { value: "a", label: "How much bedrooms does the apartment have?" },
        { value: "b", label: "How many bedrooms the apartment has?" },
    ],
    correctAnswer: "c",
      explanation:
        "Use 'How many' with countable nouns like 'bedrooms', and use the helping verb before the subject: 'How many bedrooms does the apartment have?'",
      skillTag: "how-many-vs-how-much-countable",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Choose the correct question about money:",
      options: [
        { value: "a", label: "How many is the rent per month?" },
        { value: "b", label: "How much is the rent per month?" },
        { value: "c", label: "How much are the rent per month?" },
      ],
      correctAnswer: "b",
      explanation:
        "Money/rent is uncountable, so we use 'How much' and a singular verb: 'How much is the rent per month?'",
      skillTag: "how-much-vs-how-many-uncountable",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "Put the words in correct order: (rent / when / due / is / the)",
      options: [
        { value: "a", label: "When the rent is due?" },
        { value: "c", label: "When is due the rent?" },
        { value: "b", label: "When is the rent due?" },
    ],
    correctAnswer: "b",
      explanation:
        "Information questions follow WH-word + helping verb + subject + main verb: 'When is the rent due?'",
      skillTag: "word-order-wh-aux-subject-verb",
      difficulty: "easy",
    },
    {
      id: "quiz-4",
      question: "Choose the correct subject question:",
      options: [
        { value: "b", label: "Who pays the utilities?" },
        { value: "a", label: "Who does pay the utilities?" },
        { value: "c", label: "Who do pay the utilities?" },
    ],
    correctAnswer: "b",
      explanation:
        "Here 'Who' is the subject (the doer), so we do NOT use 'do/does'. The verb takes -s: 'Who pays the utilities?'",
      skillTag: "subject-question-who-no-aux",
      difficulty: "medium",
    },
    {
      id: "quiz-5",
      question: "Choose the correct object question:",
      options: [
        { value: "a", label: "Who you pay every month?" },
        { value: "b", label: "Who do you pay every month?" },
        { value: "c", label: "Who does you pay every month?" },
      ],
      correctAnswer: "b",
      explanation:
        "Here 'you' is the subject (the doer), so we need the helping verb: 'Who do you pay every month?'",
      skillTag: "object-question-who-does-do",
      difficulty: "medium",
    },
    {
      id: "quiz-6",
      question: "Which question asks about a person?",
      options: [
        { value: "a", label: "What should I call for emergencies?" },
        { value: "c", label: "When should I call for emergencies?" },
        { value: "b", label: "Who should I call for emergencies?" },
    ],
    correctAnswer: "b",
      explanation:
        "'Who' is used for people. 'What' is for things/information, and 'When' is for time.",
      skillTag: "wh-choice-who-vs-what-when",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "You see two buses at the stop. What is the best question?",
      options: [
        { value: "b", label: "Which bus goes to downtown?" },
        { value: "a", label: "What bus goes to downtown?" },
        { value: "c", label: "Where bus goes to downtown?" },
    ],
    correctAnswer: "b",
      explanation:
        "You are choosing from a small number of options (two buses), so use 'Which bus goes to downtown?'",
      skillTag: "what-vs-which-limited-choice",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "Choose the correct question about a phone number:",
      options: [
        { value: "a", label: "Which is your phone number?" },
        { value: "b", label: "What is your phone number?" },
        { value: "c", label: "What number is your phone?" },
      ],
      correctAnswer: "b",
      explanation:
        "There are many possible answers, so we use 'What is your phone number?' not 'Which'.",
      skillTag: "what-vs-which-unlimited-choice",
      difficulty: "easy",
    },
    {
      id: "quiz-9",
      question: "Which question correctly asks about method?",
      options: [
        { value: "b", label: "What do I pay rent?" },
        { value: "c", label: "Why do I pay rent?" },
        { value: "a", label: "How do I pay rent?" },
    ],
    correctAnswer: "a",
      explanation:
        "'How' asks about method or process: 'How do I pay rent?'",
      skillTag: "wh-choice-how-method",
      difficulty: "easy",
    },
    {
      id: "quiz-10",
      question: "Choose the correct question about reason:",
      options: [
        { value: "c", label: "Why is the rent going up?" },
        { value: "a", label: "When is the rent going up?" },
        { value: "b", label: "Where is the rent going up?" },
    ],
    correctAnswer: "c",
      explanation:
        "'Why' asks about reason: 'Why is the rent going up?'",
      skillTag: "wh-choice-why-reason",
      difficulty: "easy",
    },
    {
      id: "quiz-11",
      question: "Choose the correct indirect question:",
      options: [
        { value: "a", label: "Could you tell me where is the office?" },
        { value: "b", label: "Could you tell me where the office is?" },
        { value: "c", label: "Could you tell me where does the office is?" },
      ],
      correctAnswer: "b",
      explanation:
        "In indirect questions, the inner clause uses statement word order: 'where the office is', not 'where is the office'.",
      skillTag: "indirect-question-statement-word-order",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Choose the correct embedded question:",
      options: [
        { value: "a", label: "I'm wondering what time does the clinic close." },
        { value: "c", label: "I'm wondering what time is the clinic closing." },
        { value: "b", label: "I'm wondering what time the clinic closes." },
    ],
    correctAnswer: "b",
      explanation:
        "Embedded questions also use statement word order: 'what time the clinic closes'.",
      skillTag: "embedded-question-statement-word-order",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question:
        "You want to be polite with your boss. Which question is more professional?",
      options: [
        { value: "b", label: "Could you tell me when my paycheck is ready?" },
        { value: "a", label: "When is my paycheck ready?" },
        { value: "c", label: "When my paycheck is ready?" },
    ],
    correctAnswer: "b",
      explanation:
        "Adding a polite phrase and using an indirect question sounds more professional: 'Could you tell me when my paycheck is ready?'",
      skillTag: "politeness-indirect-vs-direct-question",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question:
        "You want to ask your landlord about utilities. Which is the best housing question?",
      options: [
        { value: "a", label: "How many is the utilities?" },
        { value: "c", label: "Which utilities are included in the rent?" },
        { value: "b", label: "What are the building rules?" },
    ],
    correctAnswer: "c",
      explanation:
        "This question is specific and useful: 'Which utilities are included in the rent?' connects directly to housing and money.",
      skillTag: "housing-context-which-utilities-included",
      difficulty: "medium",
    },
    {
      id: "quiz-15",
      question:
        "You want to know the exact date to move out. Which question is best?",
      options: [
        { value: "a", label: "When can I move in?" },
        { value: "c", label: "Where is the laundry?" },
        { value: "b", label: "How much notice do I need to give before moving out?" },
    ],
    correctAnswer: "b",
      explanation:
        "'How much notice do I need to give before moving out?' is the key housing question about time and rules.",
      skillTag: "housing-context-how-much-notice",
      difficulty: "medium",
    },
    {
      id: "quiz-16",
      question:
        "Which question is a correct object question using 'who'?",
      options: [
        { value: "a", label: "Who do I contact if the heat doesn't work?" },
        { value: "b", label: "Who I contact if the heat doesn't work?" },
        { value: "c", label: "Who does contact I if the heat doesn't work?" },
      ],
      correctAnswer: "a",
      explanation:
        "Here 'I' is the subject, so we need the helping verb 'do': 'Who do I contact if the heat doesn't work?'",
      skillTag: "object-question-who-do-i-contact",
      difficulty: "medium",
    },
  ],
    /*
  TEACHER DIAGNOSTIC NOTES – Information Questions Mini Quiz

  This mini quiz checks whether students can:
  - Choose the correct WH-word (who/what/when/where/why/how).
  - Choose between HOW MUCH vs HOW MANY for money, time, and countable nouns.
  - Use the standard word order: WH-word + helping verb + subject + main verb.
  - Distinguish SUBJECT vs OBJECT questions with WHO.
  - Use WHAT vs WHICH based on how many choices they have.
  - Use statement word order inside indirect and embedded questions.
  - Apply this to real housing, landlord, and work situations.

  Skill tags:

  WH-word choice:
  - wh-choice-who-vs-what-when
  - wh-choice-how-method
  - wh-choice-why-reason

  How much / How many:
  - how-many-vs-how-much-countable
  - how-much-vs-how-many-uncountable

  Word order:
  - word-order-wh-aux-subject-verb

  Subject vs object questions:
  - subject-question-who-no-aux
  - object-question-who-does-do
  - object-question-who-do-i-contact

  What vs Which:
  - what-vs-which-limited-choice
  - what-vs-which-unlimited-choice

  Indirect & embedded questions:
  - indirect-question-statement-word-order
  - embedded-question-statement-word-order
  - politeness-indirect-vs-direct-question

  Housing / landlord context:
  - housing-context-which-utilities-included
  - housing-context-how-much-notice

  How to read the diagnostics:
  - If HOW MUCH / HOW MANY tags are weak →
    Re-teach the countable/uncountable contrast using money, rooms, people, time.
    Use housing examples: rent, deposit, notice, bedrooms, people.

  - If WH-choice tags are weak →
    Sort questions by type of information:
    • WHO → person
    • WHAT → thing/information
    • WHEN → time
    • WHERE → place
    • WHY → reason
    • HOW → method
    Have students match landlord/doctor/job questions to the right WH-word.

  - If word-order tags are weak →
    Go back to the core formula:
    WH-word + helping verb + subject + main verb + ?
    Do quick board drills starting from statements:
    • You pay rent on the first. → When do you pay rent?
    • The office is on the third floor. → Where is the office?

  - If subject/object WHO tags are weak →
    Use the “Who is the doer?” test:
    • If WHO is the doer → no DO/DOES (Who pays the rent?)
    • If YOU/another person is the doer → use DO/DOES (Who do you pay?)
    Practice turning one sentence into both a subject question and an object question.

  - If WHAT vs WHICH tags are weak →
    Practice with real objects in the room and housing images:
    • Many possible answers → WHAT apartment complex is this?
    • Small set of choices → WHICH apartment do you want, 3A or 3B?

  - If indirect/embedded tags are weak →
    Contrast pairs on the board:
    • Where is the office? → Could you tell me where the office is?
    • What time does the clinic close? → Do you know what time the clinic closes?
    Highlight that inside the longer sentence we use statement order (subject + verb).

  - If housing-context tags are weak →
    Revisit the “Essential Housing Questions” section.
    Have students build their own landlord question list and check each one for:
    • Correct WH-word.
    • Correct money/time word (How much / How many).
    • Correct word order.

  Suggested use:
  - Use this mini quiz after students have completed the main sections:
    WH-words, How much/How many, word order, subject/object questions, What vs Which,
    and indirect/embedded questions.
  - At the class level, use skillTag patterns to decide:
    • If WH-choice and How much/How many are red → do more controlled grammar drills.
    • If indirect/embedded and politeness tags are red → focus on role-plays with bosses,
      landlords, and doctors using indirect questions.
    • If housing-context tags are red → repeat the landlord interview activity and
      have students rewrite their questions using correct forms.
  */
};
