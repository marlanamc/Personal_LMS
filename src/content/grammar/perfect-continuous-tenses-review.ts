import type { InteractiveGuideContent } from "@/types/activity";

export const perfectContinuousTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Perfect Continuous Tenses Review: Duration Across Time",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Perfect Continuous tenses combine <strong>duration</strong> (how long) with <strong>connection to another time</strong>. They answer: "How long has/had/will this have been happening?"</p>
                </div>

                <h3>The Three Perfect Continuous Tenses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; border-radius: 0.25rem;">
                        <strong style="color: #6366f1;">Present Perfect Continuous:</strong> Duration up to NOW<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"I have been working here for 5 years." (still working)</span>
                    </li>
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        <strong style="color: #f59e0b;">Past Perfect Continuous:</strong> Duration before a past event<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"I had been waiting for an hour when the bus came." (waiting before bus)</span>
                    </li>
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        <strong style="color: #06b6d4;">Future Perfect Continuous:</strong> Duration up to a future point<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"By June, I will have been working here for 10 years." (milestone)</span>
                    </li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 The Pattern: <span style="font-size: 1.125rem;">have/has/had/will have + been + verb-ing</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "perfect-continuous-tenses-review-intro-1",
                    title: "Practice: Understanding Perfect Continuous Tenses",
                    instructions: "Identify what perfect continuous tenses combine.",
                    items: [
                        {
                            type: "radio",
                            label: "What do perfect continuous tenses combine?",
                            options: [
                                { value: "b", label: "Only completed actions" },
                                { value: "a", label: "Duration (how long) with connection to another time" },
                                { value: "c", label: "Only future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I have been working here for 5 years." What does this show?',
                            options: [
                                { value: "b", label: "A completed action" },
                                { value: "c", label: "A future plan" },
                                { value: "a", label: "Duration (5 years) up to NOW (still working)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the pattern for all perfect continuous tenses?",
                            options: [
                                { value: "a", label: "have/has/had/will have + been + verb-ing" },
                                { value: "b", label: "have/has + past participle" },
                                { value: "c", label: "will + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline-visualization",
            title: "Timeline: Duration Bars Across Time",
            icon: "⏰",
            explanation: `
                <div style="max-width: 750px; margin: 2rem auto; padding: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.2);">
                    <p style="text-align: center; font-size: 1.125rem; margin-bottom: 2rem; color: #2b3a4a; font-weight: 600;">
                        Perfect Continuous = Duration bars connecting to reference points
                    </p>

                    <!-- Three duration bars stacked -->
                    <div style="display: flex; flex-direction: column; gap: 2rem; margin: 2rem 0;">

                        <!-- Past Perfect Continuous -->
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="min-width: 140px; text-align: right;">
                                <div style="font-weight: 700; color: #f59e0b; font-size: 0.8rem;">PAST PERFECT</div>
                                <div style="font-weight: 700; color: #f59e0b; font-size: 0.8rem;">CONTINUOUS</div>
                            </div>
                            <div style="flex: 1; position: relative; height: 40px;">
                                <!-- Duration bar -->
                                <div style="position: absolute; left: 0; right: 30%; top: 50%; height: 30px; background: linear-gradient(to right, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.9)); border-radius: 15px; transform: translateY(-50%); border: 2px solid #f59e0b;">
                                    <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #92400e; font-weight: 600;">had been + -ing</span>
                                </div>
                                <!-- Past event marker -->
                                <div style="position: absolute; right: 30%; top: 50%; transform: translate(50%, -50%); width: 20px; height: 20px; background: #8b5cf6; border-radius: 50%; border: 2px solid white;"></div>
                                <!-- NOW marker -->
                                <div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background: #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.5rem; font-weight: 600;">NOW</div>
                            </div>
                        </div>

                        <!-- Present Perfect Continuous -->
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="min-width: 140px; text-align: right;">
                                <div style="font-weight: 700; color: #6366f1; font-size: 0.8rem;">PRESENT PERFECT</div>
                                <div style="font-weight: 700; color: #6366f1; font-size: 0.8rem;">CONTINUOUS</div>
                            </div>
                            <div style="flex: 1; position: relative; height: 40px;">
                                <!-- Duration bar -->
                                <div style="position: absolute; left: 20%; right: 0; top: 50%; height: 30px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.9)); border-radius: 15px; transform: translateY(-50%); border: 2px solid #6366f1;">
                                    <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #4338ca; font-weight: 600;">have/has been + -ing</span>
                                </div>
                                <!-- NOW marker (pulsing) -->
                                <div style="position: absolute; right: 0; top: 50%; transform: translate(50%, -50%); width: 35px; height: 35px; background: #6366f1; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; font-weight: 600; color: white;">NOW</div>
                            </div>
                        </div>

                        <!-- Future Perfect Continuous -->
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="min-width: 140px; text-align: right;">
                                <div style="font-weight: 700; color: #06b6d4; font-size: 0.8rem;">FUTURE PERFECT</div>
                                <div style="font-weight: 700; color: #06b6d4; font-size: 0.8rem;">CONTINUOUS</div>
                            </div>
                            <div style="flex: 1; position: relative; height: 40px;">
                                <!-- Duration bar -->
                                <div style="position: absolute; left: 10%; right: 10%; top: 50%; height: 30px; background: linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.9)); border-radius: 15px; transform: translateY(-50%); border: 2px solid #06b6d4;">
                                    <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #0e7490; font-weight: 600;">will have been + -ing</span>
                                </div>
                                <!-- NOW marker -->
                                <div style="position: absolute; left: 30%; top: 50%; transform: translate(-50%, -50%); width: 25px; height: 25px; background: #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.45rem; font-weight: 600;">NOW</div>
                                <!-- Future point marker -->
                                <div style="position: absolute; right: 10%; top: 50%; transform: translate(50%, -50%); width: 35px; height: 35px; background: #06b6d4; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.3); display: flex; align-items: center; justify-content: center; font-size: 0.45rem; font-weight: 600; color: white;">BY</div>
                            </div>
                        </div>
                    </div>

                    <!-- Example sentences -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 2rem;">
                        <div style="background: rgba(245, 158, 11, 0.1); padding: 0.6rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
                            <div style="font-size: 0.75rem; color: #2b3a4a; line-height: 1.3;">
                                I <span style="color: #f59e0b; font-weight: 700;">had been waiting</span> for an hour when...
                            </div>
                        </div>
                        <div style="background: rgba(99, 102, 241, 0.1); padding: 0.6rem; border-radius: 6px; border-left: 3px solid #6366f1;">
                            <div style="font-size: 0.75rem; color: #2b3a4a; line-height: 1.3;">
                                I <span style="color: #6366f1; font-weight: 700;">have been working</span> here for 5 years.
                            </div>
                        </div>
                        <div style="background: rgba(6, 182, 212, 0.1); padding: 0.6rem; border-radius: 6px; border-left: 3px solid #06b6d4;">
                            <div style="font-size: 0.75rem; color: #2b3a4a; line-height: 1.3;">
                                By June, I <span style="color: #06b6d4; font-weight: 700;">will have been working</span> here for 10 years.
                            </div>
                        </div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Pattern",
                content: "All Perfect Continuous tenses use: helping verb 'have' + been + verb-ing. Only the form of 'have' changes: have/has (present), had (past), will have (future).",
            },
            exercises: [
                {
                    id: "perfect-continuous-tenses-review-timeline-1",
                    title: "Practice: Pick the Right Perfect Continuous",
                    instructions: "Use the timeline idea: duration up to NOW, before a past event, or by a future point.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ here for 3 years." (still working now)',
                            options: [
                                { value: "had been working", label: "had been working" },
                                { value: "have been working", label: "have been working" },
                                { value: "will have been working", label: "will have been working" },
                            ],
                            expectedAnswer: "have been working",
                        },
                        {
                            type: "radio",
                            label: '"I ___ for an hour when the train arrived." (before the train arrived)',
                            options: [
                                { value: "have been waiting", label: "have been waiting" },
                                { value: "will have been waiting", label: "will have been waiting" },
                                { value: "had been waiting", label: "had been waiting" },
                            ],
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "radio",
                            label: '"By next month, I ___ in this city for 2 years." (future milestone)',
                            options: [
                                { value: "will have been living", label: "will have been living" },
                                { value: "have been living", label: "have been living" },
                                { value: "had been living", label: "had been living" },
                            ],
                            expectedAnswer: "will have been living",
                        },
                    ],
                },
            ],
        },

        // Comparison Section
        {
            id: "comparison",
            stepNumber: 1,
            title: "When to Use Each Perfect Continuous Tense",
            icon: "⭐",
            explanation: `
                <h3>Choosing the Right Perfect Continuous Tense</h3>
                <p>Each tense emphasizes <strong>duration</strong> connected to a different reference point. Ask: <strong>Duration up to WHEN?</strong></p>
            `,
            usageMeanings: [
                {
                    title: "🔵 Present Perfect Continuous: Duration → NOW",
                    description: "How long something has been happening up to the present moment",
                    examples: [
                        {
                            sentence: "I <strong>have been working</strong> here for 5 years.",
                            explanation: "✓ Started 5 years ago, still working NOW",
                        },
                        {
                            sentence: "You're sweating! <strong>Have</strong> you <strong>been running</strong>?",
                            explanation: "✓ Recent activity with visible result NOW",
                        },
                        {
                            sentence: "She <strong>has been studying</strong> all morning.",
                            explanation: "✓ Duration up to now",
                        },
                    ],
                },
                {
                    title: "🟠 Past Perfect Continuous: Duration → Before Past Event",
                    description: "How long something had been happening before another past action",
                    examples: [
                        {
                            sentence: "I <strong>had been waiting</strong> for an hour when the bus finally came.",
                            explanation: "✓ Duration (1 hour) before past event (bus came)",
                        },
                        {
                            sentence: "She was tired because she <strong>had been working</strong> all day.",
                            explanation: "✓ Duration explains past state",
                        },
                        {
                            sentence: "They <strong>had been living</strong> there for 10 years before they moved.",
                            explanation: "✓ Duration before another past action",
                        },
                    ],
                },
                {
                    title: "🔷 Future Perfect Continuous: Duration → By Future Point",
                    description: "How long something will have been happening by a future time",
                    examples: [
                        {
                            sentence: "By next month, I <strong>will have been working</strong> here for 10 years.",
                            explanation: "✓ Duration reaching a future milestone",
                        },
                        {
                            sentence: "By the time you arrive, I <strong>will have been waiting</strong> for 2 hours.",
                            explanation: "✓ Duration up to a future event",
                        },
                        {
                            sentence: "She'll be exhausted—she <strong>will have been traveling</strong> all day.",
                            explanation: "✓ Duration explains future state",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Decision Guide",
                content: "Duration up to NOW? = Present Perfect Continuous. Duration before a PAST event? = Past Perfect Continuous. Duration by a FUTURE point? = Future Perfect Continuous.",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Which Perfect Continuous Tense?",
                    instructions: "Choose the correct tense based on the time reference.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ here for 5 years." (still working now)',
                            options: [
                                { value: "had been working", label: "had been working" },
                                { value: "have been working", label: "have been working" },
                                { value: "will have been working", label: "will have been working" },
                            ],
                            expectedAnswer: "have been working",
                        },
                        {
                            type: "radio",
                            label: '"I ___ for an hour when the bus came." (before the bus)',
                            options: [
                                { value: "have been waiting", label: "have been waiting" },
                                { value: "will have been waiting", label: "will have been waiting" },
                                { value: "had been waiting", label: "had been waiting" },
                            ],
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "radio",
                            label: '"By next year, she ___ English for 3 years." (future milestone)',
                            options: [
                                { value: "will have been studying", label: "will have been studying" },
                                { value: "has been studying", label: "has been studying" },
                                { value: "had been studying", label: "had been studying" },
                            ],
                            expectedAnswer: "will have been studying",
                        },
                    ],
                },
            ],
        },

        // Perfect vs Perfect Continuous
        {
            id: "perfect-vs-continuous",
            stepNumber: 2,
            title: "Perfect vs Perfect Continuous: What's the Difference?",
            icon: "⚠️",
            explanation: `
                <h3>Result form vs duration form</h3>
                <p>Perfect tenses focus on <strong>completion/result</strong> (we call this the <strong>result form</strong> in the family guides). Perfect Continuous tenses focus on <strong>duration/ongoing activity</strong> (the <strong>duration form</strong>).</p>
            `,
            comparison: {
                title: "Result form vs duration form (Perfect vs Perfect Continuous)",
                leftLabel: "Result form (Perfect)",
                rightLabel: "Duration form (Perfect Continuous)",
                rows: [
                    {
                        label: "Focus",
                        left: "COMPLETION or RESULT",
                        right: "DURATION or ONGOING ACTIVITY",
                    },
                    {
                        label: "Question",
                        left: "How many? Is it done?",
                        right: "How long?",
                    },
                    {
                        label: "Present",
                        left: "I have read 3 books. (count)",
                        right: "I have been reading all day. (duration)",
                    },
                    {
                        label: "Past",
                        left: "I had finished before she arrived. (done)",
                        right: "I had been working for hours. (duration)",
                    },
                    {
                        label: "Future",
                        left: "I will have finished by 5 PM. (complete)",
                        right: "I will have been working for 8 hours. (duration)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-perfect-vs-cont-1",
                    title: "Practice: Result or Duration?",
                    instructions: "Choose the result form (Perfect) for results/completion, the duration form (Perfect Continuous) for duration.",
                    items: [
                        {
                            type: "radio",
                            label: '"How many emails ___ you ___?" (counting)',
                            options: [
                                { value: "have been sending", label: "have you been sending" },
                                { value: "have sent", label: "have you sent" },
                            ],
                            expectedAnswer: "have sent",
                        },
                        {
                            type: "radio",
                            label: '"How long ___ you ___?" (duration)',
                            options: [
                                { value: "have been waiting", label: "have you been waiting" },
                                { value: "have waited", label: "have you waited" },
                            ],
                            expectedAnswer: "have been waiting",
                        },
                        {
                            type: "radio",
                            label: '"She was tired because she ___ all day." (duration explains state)',
                            options: [
                                { value: "had worked", label: "had worked" },
                                { value: "had been working", label: "had been working" },
                            ],
                            expectedAnswer: "had been working",
                        },
                        {
                            type: "radio",
                            label: '"By 5 PM, I ___ the report." (complete before deadline)',
                            options: [
                                { value: "will have finished", label: "will have finished" },
                                { value: "will have been finishing", label: "will have been finishing" },
                            ],
                            expectedAnswer: "will have finished",
                        },
                    ],
                },
            ],
        },

        // Forms Section
        {
            id: "forms",
            stepNumber: 3,
            title: "How to Form Each Perfect Continuous Tense",
            icon: "📝",
            explanation: `
                <h3>The Formulas</h3>
                <p>All Perfect Continuous tenses follow the same pattern: <strong>helping verb 'have' + been + verb-ing</strong></p>

                <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(99, 102, 241, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6366f1;">Present Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Positive:</strong> Subject + have/has been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Negative:</strong> Subject + haven't/hasn't been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Question:</strong> Have/Has + subject + been + verb-ing?</p>
                    </div>

                    <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b;">Past Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Positive:</strong> Subject + had been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Negative:</strong> Subject + hadn't been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Question:</strong> Had + subject + been + verb-ing?</p>
                    </div>

                    <div style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #06b6d4;">Future Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Positive:</strong> Subject + will have been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Negative:</strong> Subject + won't have been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Question:</strong> Will + subject + have been + verb-ing?</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-forms-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct Perfect Continuous form.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (work) here for 5 years. (present, positive)",
                            expectedAnswer: "have been working",
                        },
                        {
                            type: "text",
                            label: "She ___ (wait) for an hour when the bus came. (past, positive)",
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "text",
                            label: "By next year, they ___ (live) here for a decade. (future, positive)",
                            expectedAnswer: "will have been living",
                        },
                        {
                            type: "text",
                            label: "I ___ (not sleep) well lately. (present, negative)",
                            expectedAnswer: "haven't been sleeping",
                        },
                        {
                            type: "text",
                            label: "How long ___ you ___ (study) when you passed the exam? (past, question)",
                            expectedAnswer: "had you been studying",
                        },
                    ],
                },
            ],
        },

        // Conjugation Practice
        {
            id: "conjugation",
            stepNumber: 4,
            title: "Conjugation Charts",
            icon: "📊",
            explanation: `
                <h3>Master the Forms</h3>
                <p>Practice conjugating verbs in all three Perfect Continuous tenses.</p>
            `,
            exercises: [
                {
                    id: "ex-conjugation-present",
                    title: "Present Perfect Continuous: Verb 'work' with 'she'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ been working", expectedAnswer: "has" },
                        { type: "text", label: "Negative: She ___ been working", expectedAnswer: "hasn't" },
                        { type: "text", label: "Question: ___ she been working?", expectedAnswer: "Has" },
                    ],
                },
                {
                    id: "ex-conjugation-past",
                    title: "Past Perfect Continuous: Verb 'wait' with 'they'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ been waiting", expectedAnswer: "had" },
                        { type: "text", label: "Negative: They ___ been waiting", expectedAnswer: "hadn't" },
                        { type: "text", label: "Question: ___ they been waiting?", expectedAnswer: "Had" },
                    ],
                },
                {
                    id: "ex-conjugation-future",
                    title: "Future Perfect Continuous: Verb 'study' with 'I'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ have been studying", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ have been studying", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I have been studying?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Watch Out for These Errors!</h3>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 1: Missing 'been'</h4>
                    <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">"I have working here for 5 years."</span></p>
                    <p style="margin: 0.25rem 0 0 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">"I have <strong>been</strong> working here for 5 years."</span></p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 2: Wrong verb form (not -ing)</h4>
                    <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">"I have been work here."</span></p>
                    <p style="margin: 0.25rem 0 0 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">"I have been work<strong>ing</strong> here."</span></p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 3: For vs Since confusion</h4>
                    <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">"I have been working here since 5 years."</span></p>
                    <p style="margin: 0.25rem 0 0 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">"I have been working here <strong>for</strong> 5 years."</span></p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">FOR = duration (5 years). SINCE = starting point (2019).</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 4: Using with stative verbs</h4>
                    <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">"I have been knowing him for years."</span></p>
                    <p style="margin: 0.25rem 0 0 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">"I have <strong>known</strong> him for years."</span></p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">Stative verbs (know, believe, love, want) don't use continuous forms.</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-errors-1",
                    title: "Error Correction",
                    instructions: "Find and correct the mistake in each sentence.",
                    items: [
                        {
                            type: "text",
                            label: "I have working here for 5 years.",
                            expectedAnswer: "I have been working here for 5 years",
                        },
                        {
                            type: "text",
                            label: "She has been study English since 2020.",
                            expectedAnswer: "She has been studying English since 2020",
                        },
                        {
                            type: "text",
                            label: "They had been wait for an hour.",
                            expectedAnswer: "They had been waiting for an hour",
                        },
                        {
                            type: "text",
                            label: "I have been living here since 3 years.",
                            expectedAnswer: "I have been living here for 3 years",
                        },
                    ],
                },
            ],
        },

        // Mixed Practice
        {
            id: "mixed-practice",
            stepNumber: 6,
            title: "Mixed Practice: All Perfect Continuous Tenses",
            icon: "📝",
            explanation: `
                <h3>Put It All Together</h3>
                <p>Practice choosing the right Perfect Continuous tense in various situations.</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct Perfect Continuous form.",
                    items: [
                        {
                            type: "text",
                            label: "How long ___ you ___ (wait)? (present)",
                            expectedAnswer: "have you been waiting",
                        },
                        {
                            type: "text",
                            label: "She was exhausted because she ___ (work) all night. (past)",
                            expectedAnswer: "had been working",
                        },
                        {
                            type: "text",
                            label: "By December, I ___ (study) English for 3 years. (future)",
                            expectedAnswer: "will have been studying",
                        },
                        {
                            type: "text",
                            label: "Your eyes are red. ___ you ___ (cry)? (present)",
                            expectedAnswer: "Have you been crying",
                        },
                        {
                            type: "text",
                            label: "They ___ (live) there for 10 years when they finally moved. (past)",
                            expectedAnswer: "had been living",
                        },
                        {
                            type: "text",
                            label: "By the time you arrive, I ___ (wait) for 2 hours. (future)",
                            expectedAnswer: "will have been waiting",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Perfect Continuous at a Glance",
            icon: "✓",
            explanation: `
                <h3>Quick Reference</h3>

                <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(99, 102, 241, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6366f1;">Present Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> have/has been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Duration up to NOW</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Example:</strong> "I have been working here for 5 years."</p>
                    </div>

                    <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b;">Past Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> had been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Duration before a PAST event</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Example:</strong> "I had been waiting for an hour when the bus came."</p>
                    </div>

                    <div style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #06b6d4;">Future Perfect Continuous</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> will have been + verb-ing</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Duration by a FUTURE point</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Example:</strong> "By June, I will have been working here for 10 years."</p>
                    </div>
                </div>

                <h3>Key Time Words</h3>
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>For</strong> = duration (for 5 years, for 2 hours)</li>
                    <li><strong>Since</strong> = starting point (since 2020, since Monday)</li>
                    <li><strong>All day/morning/week</strong> = duration period</li>
                    <li><strong>By + future time</strong> = future reference point</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 The Golden Rule",
                content: "Duration form (Perfect Continuous) = HOW LONG. Result form (Perfect) = RESULT/COMPLETION. Ask: 'Am I emphasizing duration or result?'",
            },
            exercises: [
                {
                    id: "perfect-continuous-tenses-review-summary-1",
                    title: "Practice: Perfect Continuous Tenses Review",
                    instructions: "Test your understanding of perfect continuous tenses.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Present Perfect Continuous?",
                            options: [
                                { value: "b", label: "had been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
                                { value: "a", label: "have/has been + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Past Perfect Continuous?",
                            options: [
                                { value: "b", label: "had been + verb-ing" },
                                { value: "a", label: "have/has been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect Continuous?",
                            options: [
                                { value: "a", label: "have/has been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
                                { value: "b", label: "had been + verb-ing" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "When do you use Present Perfect Continuous?",
                            options: [
                                { value: "b", label: "Duration before a PAST event" },
                                { value: "c", label: "Duration by a FUTURE point" },
                                { value: "a", label: "Duration up to NOW (emphasizing how long)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What's the difference between 'for' and 'since'?",
                            options: [
                                { value: "a", label: "'for' = duration (for 5 years) | 'since' = starting point (since 2020)" },
                                { value: "b", label: "They mean the same thing" },
                                { value: "c", label: "'for' = starting point | 'since' = duration" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses Present Perfect Continuous?",
            options: [
                { value: "a", label: "I have working here for 5 years." },
                { value: "b", label: "I have been working here for 5 years." },
                { value: "c", label: "I have been work here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Present Perfect Continuous = have/has been + verb-ing.",
            skillTag: "form-present-perfect-continuous-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct tense: 'She was tired because she ___ all day.'",
            options: [
                { value: "a", label: "has been working" },
                { value: "c", label: "will have been working" },
                { value: "b", label: "had been working" },
            ],
            correctAnswer: "b",
            explanation: "The tired feeling happened in the past, so the duration happened before it.",
            skillTag: "past-perfect-continuous-cause-effect",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which sentence shows a future milestone?",
            options: [
                { value: "b", label: "By next year, I will have been working here for 10 years." },
                { value: "a", label: "By next year, I have been working here for 10 years." },
                { value: "c", label: "By next year, I had been working here for 10 years." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous shows duration up to a future point.",
            skillTag: "duration-future-how-long-by-then",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "For vs Since: 'I have been living here ___ 2020.'",
            options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
            ],
            correctAnswer: "b",
            explanation: "'Since' is used with a starting point. 'For' is used with a duration.",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Which sentence correctly uses Past Perfect Continuous?",
            options: [
                { value: "a", label: "I was waiting for an hour when she arrived." },
                { value: "c", label: "I have been waiting for an hour when she arrived." },
                { value: "b", label: "I had been waiting for an hour when she arrived." },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous shows duration before another past event.",
            skillTag: "form-past-perfect-continuous-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which question form is correct?",
            options: [
                { value: "a", label: "How long have you been studying English?" },
                { value: "b", label: "How long you have been studying English?" },
                { value: "c", label: "How long did you been studying English?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Have/Has + subject + been + verb-ing.",
            skillTag: "form-present-perfect-continuous-question",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which sentence explains a result using duration?",
            options: [
                { value: "a", label: "She passed the test because she studied." },
                { value: "b", label: "She passed the test because she had been studying all week." },
                { value: "c", label: "She studies every week." },
            ],
            correctAnswer: "b",
            explanation: "Perfect Continuous can explain a result by showing duration.",
            skillTag: "perfect-continuous-cause-effect",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "Perfect vs Perfect Continuous: 'How many emails ___ you ___?'",
            options: [
                { value: "b", label: "have you been sending" },
                { value: "a", label: "have you sent" },
            ],
            correctAnswer: "a",
            explanation: "'How many' asks about result or quantity, not duration.",
            skillTag: "contrast-perfect-vs-perfect-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Which sentence has a common error?",
            options: [
                { value: "a", label: "I have been knowing her for years." },
                { value: "b", label: "I have known her for years." },
                { value: "c", label: "I have been working here for years." },
            ],
            correctAnswer: "a",
            explanation: "Stative verbs like 'know' usually do not use continuous forms.",
            skillTag: "error-stative-verb-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which tense answers the question 'How long by then?'",
            options: [
                { value: "a", label: "Present Perfect Continuous" },
                { value: "c", label: "Future Perfect Continuous" },
                { value: "b", label: "Past Perfect Continuous" },
            ],
            correctAnswer: "c",
            explanation: "Future Perfect Continuous measures duration up to a future point.",
            skillTag: "meta-perfect-continuous-meaning",
            difficulty: "easy",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Perfect Continuous Tenses Review Mini Quiz

    This review mini quiz is designed to give you a quick cross-check of all three Perfect Continuous tenses.

    Form skills:
    - form-present-perfect-continuous-positive
    - form-present-perfect-continuous-question
    - form-past-perfect-continuous-positive

    Meaning & duration skills:
    - past-perfect-continuous-cause-effect
    - duration-future-how-long-by-then
    - duration-for-since-how-long
    - perfect-continuous-cause-effect
    - meta-perfect-continuous-meaning

    Contrast skills:
    - contrast-perfect-vs-perfect-continuous

    Common error patterns:
    - error-stative-verb-continuous

    How to read the diagnostics:
    - If present perfect cont. form tags are weak → reteach have/has been + verb-ing and the question pattern (Have/Has + subject + been + verb-ing?).
    - If past perfect cont. cause-effect is weak → go back to timelines that show duration BEFORE a past event (had been waiting → bus arrived).
    - If future duration tags are weak → use "By next year / By June" milestone sentences and ask "How long by then?" explicitly.
    - If for/since tags are weak → build a T-chart: FOR = length of time, SINCE = starting point, and practice swapping incorrect examples.
    - If contrast-perfect-vs-perfect-continuous is weak → use pairs like:
        • "How many emails have you sent?" (result)
        • "How long have you been sending emails?" (duration)
      and have students choose RESULT vs DURATION.
    - If stative-verb error tags appear → highlight a short "no continuous" list (know, believe, love, understand) and convert sentences like
      "have been knowing" → "have known".

    Suggested use:
    - Use this review after students complete the individual Present / Past / Future Perfect Continuous guides.
    - Use the skillTags to decide whether to review:
        • one tense (present / past / future),
        • one concept (for vs since, result vs duration),
        • or one error type (stative verbs in continuous).
    */
};
