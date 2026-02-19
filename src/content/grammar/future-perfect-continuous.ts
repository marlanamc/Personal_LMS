import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Future Perfect Continuous: How Long Will You Have Been Doing That?",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Future Perfect Continuous shows <strong style="color: #06b6d4;">how long</strong> an action will have been happening <strong style="color: #a855f7;">by a future point</strong>. It's the rarest tense, but useful for milestones!</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Duration up to a future point</strong>: "By June, I will have been working here for 10 years."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Cause of a future situation</strong>: "She will be tired because she will have been traveling all day."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #06b6d4; font-size: 1.125rem;">will have been + verb-ing</span></p>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-size: 0.9rem;"><strong>📌 Note:</strong> This is the least common tense in English. You'll hear it occasionally, but don't worry if it feels advanced—focus on understanding it when you hear it!</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-perfect-continuous-intro-1",
                    title: "Practice: Understanding Future Perfect Continuous",
                    instructions: "Identify what Future Perfect Continuous shows.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Perfect Continuous show?",
                            options: [
                                { value: "b", label: "Current ongoing actions" },
                                { value: "a", label: "How long an action will have been happening by a future point" },
                                { value: "c", label: "Completed past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"By June, I will have been working here for 10 years." What does this show?',
                            options: [
                                { value: "b", label: "A current action" },
                                { value: "c", label: "A past action" },
                                { value: "a", label: "Duration (10 years) up to a future point (June)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect Continuous?",
                            options: [
                                { value: "a", label: "will have been + verb-ing" },
                                { value: "b", label: "have/has been + verb-ing" },
                                { value: "c", label: "had been + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Perfect Continuous",
            icon: "⭐",
            explanation: `
                <h3>The Key Question: "How long will this have been happening by then?"</h3>
                <p>This tense combines <strong>duration</strong> (continuous) with <strong>completion by a future point</strong> (perfect). It's perfect for work anniversaries and milestones!</p>
            `,
            usageMeanings: [
                {
                    title: "⏱️ 1. Duration Up to a Future Point",
                    description: "How long something will have been happening by a specific future time",
                    examples: [
                        {
                            sentence: "By next month, I <strong>will have been working</strong> here <strong>for 5 years</strong>.",
                            explanation: "✓ Duration (5 years) reaching a future milestone",
                        },
                        {
                            sentence: "By December, she <strong>will have been studying</strong> English <strong>for 3 years</strong>.",
                            explanation: "✓ Duration up to a future point",
                        },
                        {
                            sentence: "By the time you arrive, I <strong>will have been waiting</strong> <strong>for 2 hours</strong>.",
                            explanation: "✓ Duration before a future event",
                        },
                    ],
                },
                {
                    title: "💡 2. Explaining a Future Situation",
                    description: "Why something will be the way it is at a future time",
                    examples: [
                        {
                            sentence: "She'll be exhausted because she <strong>will have been traveling</strong> all day.",
                            explanation: "✓ Future state explained by ongoing action",
                        },
                        {
                            sentence: "He'll need a break—he <strong>will have been driving</strong> for 8 hours.",
                            explanation: "✓ Future need explained by duration",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 When to Use This Tense",
                content: "Use Future Perfect Continuous for work anniversaries, study milestones, or any time you want to emphasize HOW LONG something will have been happening BY a future date.",
            },
            exercises: [
                {
                    id: "ex-usage-fpc-1",
                    title: "Practice: Why Future Perfect Continuous Here?",
                    instructions: "Choose the best reason we use Future Perfect Continuous in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"By next year, I <span class=\'eg-helper\'>will have been</span> <span class=\'eg-verb\'>working</span> here for 10 years."',
                            options: [
                                { value: "prediction", label: "Simple prediction" },
                                { value: "duration", label: "Duration up to a future point" },
                                { value: "habit", label: "Regular habit" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: '"She will be tired because she <span class=\'eg-helper\'>will have been</span> <span class=\'eg-verb\'>traveling</span> all day."',
                            options: [
                                { value: "duration", label: "Duration up to a future point" },
                                { value: "past", label: "Past action" },
                                { value: "cause", label: "Explaining a future situation" },
                            ],
                            expectedAnswer: "cause",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 2,
            title: "Timeline: Duration Up to a Future Point",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Timeline Visually</h3>
                <p>Future Perfect Continuous shows an action that <strong>started before</strong> and <strong>continues up to a future point</strong>.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Duration Up to Future Point</h4>

                    <div style="position: relative; margin: 2rem auto; max-width: 650px; padding: 2rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 50px; background: linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.9)); border-radius: 25px; border: 3px solid #06b6d4; display: flex; align-items: center; padding: 0 2rem;">
                            <span style="color: #0e7490; font-weight: 600; font-size: 0.875rem;">will have been working...</span>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 10px; height: 10px; background: #06b6d4; border-radius: 50%; transform: translate(-5px, -50%);"></div>
                            <!-- End dot -->
                            <div style="position: absolute; right: 0; top: 50%; width: 10px; height: 10px; background: #06b6d4; border-radius: 50%; transform: translate(5px, -50%);"></div>
                        </div>

                        <!-- NOW marker -->
                        <div style="position: absolute; top: 50%; left: 30%; transform: translate(-50%, -50%);">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 600; color: #475569; border: 2px solid white;">NOW</div>
                        </div>

                        <!-- Future point marker -->
                        <div style="position: absolute; top: -15px; right: 0; transform: translateX(50%);">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: #a855f7; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: white; border: 3px solid white; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3); text-align: center;">BY<br/>JUNE</div>
                        </div>

                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; padding: 0 0.5rem;">
                            <div style="text-align: left;">
                                <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 600;">Started</div>
                                <div style="font-size: 0.7rem; color: #64748b;">5 years ago</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.875rem; color: #06b6d4; font-weight: 700;">← FOR 5 YEARS →</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.75rem; color: #a855f7; font-weight: 600;">Future Point</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f0fdfa; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> By June, I <span style="color: #06b6d4; font-weight: 600;">will have been working</span> here <span style="color: #a855f7; font-weight: 600;">for 5 years</span>.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Future Perfect vs Future Perfect Continuous",
                content: "Future Perfect = action COMPLETE by then. Future Perfect Continuous = action ONGOING for a duration by then. Compare: 'I will have finished' (done) vs 'I will have been working for 5 years' (duration).",
            },
            exercises: [
                {
                    id: "future-perfect-continuous-timeline-1",
                    title: "Practice: Duration Up to a Future Point",
                    instructions: "Choose Future Perfect Continuous when the focus is on how long by a future time.",
                    items: [
                        {
                            type: "radio",
                            label: '"By 6 PM, I ___ for 8 hours."',
                            options: [
                                { value: "will have been working", label: "will have been working" },
                                { value: "will be working", label: "will be working" },
                                { value: "have been working", label: "have been working" },
                            ],
                            expectedAnswer: "will have been working",
                        },
                        {
                            type: "radio",
                            label: "Future Perfect Continuous connects which two ideas?",
                            options: [
                                { value: "b", label: "A habit + every day" },
                                { value: "a", label: "Duration + a future point (by then)" },
                                { value: "c", label: "A finished past action + yesterday" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete: By next month, she ___ (study) English for two years.",
                            expectedAnswer: "will have been studying",
                        },
                    ],
                },
            ],
        },

        // Positive Form
        {
            id: "step-positive",
            stepNumber: 3,
            title: "Positive Form",
            explanation: `
                <h3>The Formula</h3>
                <p>Future Perfect Continuous is formed with: <strong>will have been + verb-ing</strong></p>
                <p>Same for all subjects—no changes needed!</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By next month, I <span style="color: #06b6d4; font-weight: 600;">will have been working</span> here for 10 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By December, she <span style="color: #06b6d4; font-weight: 600;">will have been studying</span> English for 3 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By the time you arrive, they <span style="color: #06b6d4; font-weight: 600;">will have been waiting</span> for 2 hours.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will have been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Complete with Future Perfect Continuous",
                    instructions: "Use will have been + verb-ing to show duration up to a future point.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I ___ (work) at this company for 5 years.",
                            expectedAnswer: "will have been working",
                        },
                        {
                            type: "text",
                            label: "By the time she graduates, she ___ (study) for 4 years.",
                            expectedAnswer: "will have been studying",
                        },
                        {
                            type: "text",
                            label: "By midnight, they ___ (drive) for 10 hours.",
                            expectedAnswer: "will have been driving",
                        },
                        {
                            type: "text",
                            label: "By June, we ___ (live) in this city for a decade.",
                            expectedAnswer: "will have been living",
                        },
                    ],
                },
            ],
        },

        // Negative Form
        {
            id: "step-negative",
            stepNumber: 4,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not have been (won't have been)</strong> + verb-ing.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            By next month, I <span style="color: #06b6d4; font-weight: 600;">won't have been working</span> here long enough to qualify.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">won't have been studying</span> long enough to pass the advanced exam.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't have been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use won't have been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "By next month, I ___ (not work) here long enough for a promotion.",
                            expectedAnswer: "won't have been working",
                        },
                        {
                            type: "text",
                            label: "She ___ (not study) long enough to take the advanced test.",
                            expectedAnswer: "won't have been studying",
                        },
                    ],
                },
            ],
        },

        // Question Form
        {
            id: "step-questions",
            stepNumber: 5,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning: Will + subject + have been + verb-ing?</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            How long <span style="color: #06b6d4; font-weight: 600;">will</span> you <span style="color: #06b6d4; font-weight: 600;">have been working</span> here by next year?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">have been studying</span> long enough by the exam date?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have been + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Future Duration",
                    instructions: "Form questions with Will + subject + have been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "How long ___ you ___ (work) here by next June?",
                            expectedAnswer: "will you have been working",
                        },
                        {
                            type: "text",
                            label: "___ she ___ (study) long enough by the exam?",
                            expectedAnswer: "Will she have been studying",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'work' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ have been working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ have been working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I have been working?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Duration of an action up to a future point (milestones, anniversaries)</li>
                    <li><strong>Key Questions:</strong> "How long will you have been...?"</li>
                    <li><strong>Positive:</strong> Subject + will have been + verb-ing</li>
                    <li><strong>Negative:</strong> Subject + won't have been + verb-ing</li>
                    <li><strong>Questions:</strong> Will + subject + have been + verb-ing?</li>
                    <li><strong>Time Words:</strong> by next year, by the time, for (duration)</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "This is the rarest tense! Use it for milestones: 'By next year, I will have been working here for 10 years.' Focus on understanding it when you hear it.",
            },
            exercises: [
                {
                    id: "future-perfect-continuous-summary-1",
                    title: "Practice: Key Points Check",
                    instructions: "Review the form and the meaning (how long by a future point).",
                    items: [
                        {
                            type: "select",
                            label: "Choose the missing word: By June, I will ___ been working here for 5 years.",
                            options: ["have", "has", "had"],
                            expectedAnswer: "have",
                        },
                        {
                            type: "radio",
                            label: "Which sentence focuses on duration up to a future time?",
                            options: [
                                { value: "b", label: "Right now, I am training for a race." },
                                { value: "c", label: "Yesterday, I trained at the gym." },
                                { value: "a", label: "By Friday, I will have been training for two weeks." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which time words often appear with Future Perfect Continuous?",
                            options: [
                                { value: "a", label: "by + future time, for + duration" },
                                { value: "b", label: "every day, usually" },
                                { value: "c", label: "yesterday, last week" },
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
            question: "Which sentence correctly uses Future Perfect Continuous?",
            options: [
                { value: "a", label: "By next year, I will have been work here for 5 years." },
                { value: "b", label: "By next year, I will have been working here for 5 years." },
                { value: "c", label: "By next year, I will been working here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous: will have been + verb-ing. The -ing form is required.",
            skillTag: "form-future-perfect-continuous-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "When do we use Future Perfect Continuous?",
            options: [
                { value: "a", label: "For actions happening right now" },
                { value: "c", label: "For finished past actions" },
                { value: "b", label: "For duration of an action up to a future point" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous = how long something will have been happening BY a future point.",
            skillTag: "duration-future-how-long-by-then",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Choose the correct negative form.",
            options: [
                { value: "a", label: "I won't have been working long enough." },
                { value: "b", label: "I won't have being working long enough." },
                { value: "c", label: "I will haven't been working long enough." },
            ],
            correctAnswer: "a",
            explanation: "Negative: won't have been + verb-ing. 'Have been' stays together.",
            skillTag: "form-future-perfect-continuous-negative",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which is a good use of Future Perfect Continuous?",
            options: [
                { value: "a", label: "Talking about what you did yesterday" },
                { value: "b", label: "Celebrating a work anniversary milestone" },
                { value: "c", label: "Describing your daily routine" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect Continuous is perfect for milestones: \"By June, I will have been working here for 10 years.\"",
            skillTag: "result-future-milestone-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "What's the formula for Future Perfect Continuous?",
            options: [
                { value: "b", label: "have been + verb-ing" },
                { value: "c", label: "had been + verb-ing" },
                { value: "a", label: "will have been + verb-ing" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Continuous = will have been + verb-ing. It's the same for ALL subjects.",
            skillTag: "form-future-perfect-continuous-structure",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Fill in: \"By the time she graduates, she ___ (study) for 4 years.\"",
            options: [
                { value: "a", label: "will have been studying" },
                { value: "b", label: "has been studying" },
                { value: "c", label: "was studying" },
            ],
            correctAnswer: "a",
            explanation: "\"By the time she graduates\" = future point. Use Future Perfect Continuous to show duration up to that point.",
            skillTag: "pattern-by-the-time-future-perfect-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "How long you will have been working here by next year?" },
                { value: "a", label: "How long will you have been working here by next year?" },
                { value: "c", label: "How long have you been working here by next year?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Will + subject + have been + verb-ing? 'Will' comes before the subject.",
            skillTag: "form-future-perfect-continuous-question",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "What does \"by\" signal in Future Perfect (Continuous) sentences?",
            options: [
                { value: "b", label: "A present habit" },
                { value: "c", label: "A past event" },
                { value: "a", label: "A future deadline or point in time" },
            ],
            correctAnswer: "a",
            explanation: "\"By\" + future time = the deadline when you measure the duration (by June, by tomorrow, by 2028).",
            skillTag: "signal-by-future-perfect",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Which sentence explains WHY someone will be tired using Future Perfect Continuous?",
            options: [
                { value: "a", label: "She will be tired because she will have been traveling all day." },
                { value: "b", label: "She was tired because she traveled." },
                { value: "c", label: "She is traveling right now." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Continuous can explain a future state by showing the ongoing action causing it.",
            skillTag: "future-perfect-continuous-cause-effect",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "What's the difference between Future Perfect and Future Perfect Continuous?",
            options: [
                { value: "b", label: "They are exactly the same" },
                { value: "a", label: "Perfect = completed action; Continuous = ongoing action with duration" },
                { value: "c", label: "Perfect is past; Continuous is present" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect = \"I will have finished.\" Future Perfect Continuous = \"I will have been working for 5 years.\"",
            skillTag: "contrast-future-perfect-vs-future-perfect-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Complete: \"By midnight, they ___ (drive) for 10 hours.\"",
            options: [
                { value: "b", label: "will be driving" },
                { value: "c", label: "have been driving" },
                { value: "a", label: "will have been driving" },
            ],
            correctAnswer: "a",
            explanation: "\"By midnight\" + duration (10 hours) = Future Perfect Continuous.",
            skillTag: "duration-future-how-long-by-then",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Which time expression fits Future Perfect Continuous?",
            options: [
                { value: "a", label: "by next month, for 3 years" },
                { value: "b", label: "yesterday, ago" },
                { value: "c", label: "right now, at the moment" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Continuous uses \"by\" + future time and \"for\" + duration.",
            skillTag: "time-words-future-perfect-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Fix the error: \"By June, I will have been work here for 5 years.\"",
            options: [
                { value: "b", label: "By June, I have been working here for 5 years." },
                { value: "a", label: "By June, I will have been working here for 5 years." },
                { value: "c", label: "By June, I was working here for 5 years." },
            ],
            correctAnswer: "a",
            explanation: "After \"will have been\", use the -ing form: \"will have been working.\"",
            skillTag: "error-base-verb-after-have",
            difficulty: "easy",
        },
        {
            id: "quiz-14",
            question: "Is Future Perfect Continuous common or rare in everyday English?",
            options: [
                { value: "b", label: "It's the most common tense" },
                { value: "c", label: "It's only used in British English" },
                { value: "a", label: "It's the rarest English tense, used mainly for milestones" },
            ],
            correctAnswer: "a",
            explanation: "This is the least common tense. Focus on understanding it when you hear it and using it for special situations.",
            skillTag: "meta-future-perfect-continuous-usage",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which sentence is a work anniversary milestone using Future Perfect Continuous?",
            options: [
                { value: "a", label: "By next month, I will have been working here for 10 years!" },
                { value: "b", label: "I worked here for 10 years." },
                { value: "c", label: "I am working here now." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect Continuous is perfect for celebrating how long you WILL have been doing something by a future date.",
            skillTag: "result-future-milestone-continuous",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Future Perfect Continuous Mini Quiz

    Meaning and duration:
    - duration-future-how-long-by-then
    - future-perfect-continuous-cause-effect
    - result-future-milestone-continuous

    Form skills:
    - form-future-perfect-continuous-positive
    - form-future-perfect-continuous-negative
    - form-future-perfect-continuous-question
    - form-future-perfect-continuous-structure

    Time words & patterns:
    - signal-by-future-perfect
    - pattern-by-the-time-future-perfect-continuous
    - time-words-future-perfect-continuous

    Contrast skills:
    - contrast-future-perfect-vs-future-perfect-continuous

    Common error patterns:
    - error-base-verb-after-have

    Meta understanding:
    - meta-future-perfect-continuous-usage

    Reteaching guidance:
    - If duration tags are weak → go back to the "HOW LONG by then" question and use timeline visuals with a clear future point (by June, by next year).
    - If form tags are weak → drill will / won't + have been + verb-ing across all subjects, with special focus on keeping "have been" together and using the -ing form.
    - If time-word tags are weak → contrast AT vs BY and build sentence frames with by + future time and for + duration.
    - If contrast tags are weak → compare Future Perfect ("will have finished") vs Future Perfect Continuous ("will have been working") and ask: "Do we care about the RESULT or the DURATION?"
    - If error tags appear (base verb after have) → do quick sentence surgery exercises turning *will have been work* into *will have been working*.
    - If meta usage is weak → remind students that this tense is rare and mostly used for milestones, so recognition is more important than production perfection.
    */
};
