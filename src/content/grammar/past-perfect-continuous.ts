import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Past Perfect Continuous: How Long Before That Moment?",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #f59e0b; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Past Perfect Continuous shows <strong style="color: #f59e0b;">how long</strong> an action had been happening <strong style="color: #8b5cf6;">before another past event</strong>. It's like looking back at duration in a story.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">✓ <strong>Duration before a past event</strong>: "I had been waiting for an hour when the bus finally came."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">✓ <strong>Cause of a past situation</strong>: "She was tired because she had been working all day."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">✓ <strong>Background in storytelling</strong>: "The ground was wet. It had been raining."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #f59e0b; font-size: 1.125rem;">had been + verb-ing</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "past-perfect-continuous-intro-1",
                    title: "Practice: Understanding Past Perfect Continuous",
                    instructions: "Identify what Past Perfect Continuous shows.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Past Perfect Continuous show?",
                            options: [
                                { value: "b", label: "Current ongoing actions" },
                                { value: "a", label: "How long an action had been happening before another past event" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I had been waiting for an hour when the bus finally came." What does this show?',
                            options: [
                                { value: "b", label: "A current action" },
                                { value: "c", label: "A future plan" },
                                { value: "a", label: "Duration (1 hour) before another past event (bus came)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Past Perfect Continuous?",
                            options: [
                                { value: "a", label: "had been + verb-ing" },
                                { value: "b", label: "have/has been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
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
            title: "When Real Life Needs Past Perfect Continuous",
            icon: "⭐",
            explanation: `
                <h3>The Key Question: "How long had this been happening before that?"</h3>
                <p>This tense combines <strong>duration</strong> (continuous) with <strong>sequence</strong> (before another past event). It's perfect for explaining background situations in stories.</p>
            `,
            usageMeanings: [
                {
                    title: "⏱️ 1. Duration Before a Past Event",
                    description: "How long something had been happening before another action interrupted or followed",
                    examples: [
                        {
                            sentence: "I <strong>had been waiting</strong> for an hour when the bus finally <strong>arrived</strong>.",
                            explanation: "✓ Duration (1 hour) before past event (bus arrived)",
                        },
                        {
                            sentence: "She <strong>had been working</strong> at the factory for five years before she <strong>got</strong> promoted.",
                            explanation: "✓ Duration (5 years) before past event (promotion)",
                        },
                        {
                            sentence: "They <strong>had been living</strong> in that apartment for a decade when they finally <strong>bought</strong> a house.",
                            explanation: "✓ Duration (10 years) before past event (bought house)",
                        },
                    ],
                },
                {
                    title: "💡 2. Explaining a Past Situation (Cause & Effect)",
                    description: "Why something was the way it was in the past",
                    examples: [
                        {
                            sentence: "She was tired because she <strong>had been working</strong> double shifts all week.",
                            explanation: "✓ Past situation (tired) explained by prior ongoing action",
                        },
                        {
                            sentence: "His hands were dirty because he <strong>had been fixing</strong> the machine.",
                            explanation: "✓ Visible result explained by recent past activity",
                        },
                        {
                            sentence: "The ground was wet. It <strong>had been raining</strong>.",
                            explanation: "✓ Past evidence of prior ongoing action",
                        },
                    ],
                },
                {
                    title: "📖 3. Background in Storytelling",
                    description: "Setting the scene for what was happening before the main action",
                    examples: [
                        {
                            sentence: "When I arrived, everyone looked exhausted. They <strong>had been cleaning</strong> all morning.",
                            explanation: "✓ Background activity before the story's main moment",
                        },
                        {
                            sentence: "The chef was sweating. He <strong>had been cooking</strong> for hours.",
                            explanation: "✓ Explains the chef's condition",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Two Past Actions",
                content: "Like Past Perfect, Past Perfect Continuous usually needs TWO past references: the ongoing action (had been + verb-ing) and the later event (Past Simple).",
            },
            exercises: [
                {
                    id: "ex-usage-ppc-1",
                    title: "Practice: Why Past Perfect Continuous Here?",
                    instructions: "Choose the best reason we use Past Perfect Continuous in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I had been waiting for 30 minutes when the train finally arrived."',
                            options: [
                                { value: "cause", label: "Explaining a past situation" },
                                { value: "duration", label: "Duration before a past event" },
                                { value: "future", label: "Future action" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: '"She was exhausted because she had been working all night."',
                            options: [
                                { value: "duration", label: "Duration before a past event" },
                                { value: "habit", label: "Regular habit" },
                                { value: "cause", label: "Explaining a past situation (cause)" },
                            ],
                            expectedAnswer: "cause",
                        },
                        {
                            type: "radio",
                            label: '"The streets were wet. It had been raining."',
                            options: [
                                { value: "background", label: "Background/evidence of prior activity" },
                                { value: "duration", label: "Duration before a past event" },
                                { value: "present", label: "Current situation" },
                            ],
                            expectedAnswer: "background",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 2,
            title: "Timeline: Duration Before a Past Moment",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Timeline Visually</h3>
                <p>Past Perfect Continuous shows an action that was <strong>ongoing for a period</strong> before <strong>another past event</strong>.</p>

                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Duration Before Past Event</h4>

                    <div style="position: relative; margin: 2rem auto; max-width: 650px; padding: 2rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 50px; background: linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.9)); border-radius: 25px; border: 3px solid #f59e0b; display: flex; align-items: center; padding: 0 2rem;">
                            <span style="color: #92400e; font-weight: 600; font-size: 0.875rem;">had been waiting...</span>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; transform: translate(-5px, -50%);"></div>
                            <!-- End dot -->
                            <div style="position: absolute; right: 0; top: 50%; width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; transform: translate(5px, -50%);"></div>
                        </div>

                        <!-- Interruption marker -->
                        <div style="position: absolute; top: -10px; right: 15%; transform: translateX(50%);">
                            <div style="width: 3px; height: 70px; background: #8b5cf6; position: relative;">
                                <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #8b5cf6;"></div>
                            </div>
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: #8b5cf6; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                bus arrived
                            </div>
                        </div>

                        <!-- NOW marker -->
                        <div style="position: absolute; top: 50%; right: -30px; transform: translateY(-50%);">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; color: #475569;">NOW</div>
                        </div>

                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; padding: 0 0.5rem;">
                            <div style="text-align: left;">
                                <div style="font-size: 0.75rem; color: #f59e0b; font-weight: 600;">Started waiting</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.875rem; color: #f59e0b; font-weight: 700;">← FOR 1 HOUR →</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 600;">Past Event</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #f59e0b; font-weight: 600;">had been waiting</span> for an hour when the bus <span style="color: #8b5cf6; font-weight: 600;">arrived</span>.</p>
                        <p style="margin: 0.5rem 0 0 0; text-align: center; font-size: 0.875rem; color: #64748b;">The waiting (duration) happened BEFORE the bus arrived (past event).</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Past Perfect Continuous vs Past Continuous",
                content: "Past Continuous = action in progress at a past moment. Past Perfect Continuous = duration of action BEFORE another past moment. Compare: 'I was waiting when he called' vs 'I had been waiting for an hour when he called.'",
            },
            exercises: [
                {
                    id: "past-perfect-continuous-timeline-1",
                    title: "Practice: Duration Before Another Past Event",
                    instructions: "Use Past Perfect Continuous to show how long something was happening before a past event.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ for an hour when the bus arrived."',
                            options: [
                                { value: "was waiting", label: "was waiting" },
                                { value: "had been waiting", label: "had been waiting" },
                                { value: "have been waiting", label: "have been waiting" },
                            ],
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "text",
                            label: "Complete: She was exhausted because she ___ (work) all day.",
                            expectedAnswer: "had been working",
                        },
                        {
                            type: "radio",
                            label: "Past Perfect Continuous focuses on...",
                            options: [
                                { value: "b", label: "a habit that happens every day" },
                                { value: "c", label: "a plan for tomorrow" },
                                { value: "a", label: "duration before another past moment" },
                            ],
                            expectedAnswer: "a",
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
                <p>Past Perfect Continuous is formed with: <strong>had been + verb-ing</strong></p>
                <p>Same for all subjects—no changes needed!</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">had been working</span> for 8 hours when my shift ended.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">had been cooking</span> all afternoon before the guests arrived.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">had been waiting</span> in line for two hours.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">had been driving</span> for five hours when we stopped for gas.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "had been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Complete with Past Perfect Continuous",
                    instructions: "Use had been + verb-ing to show duration before a past event.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (wait) for 30 minutes when the bus finally came.",
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "text",
                            label: "She ___ (work) at the restaurant for two years before she quit.",
                            expectedAnswer: "had been working",
                        },
                        {
                            type: "text",
                            label: "They ___ (live) in that house for a decade when they sold it.",
                            expectedAnswer: "had been living",
                        },
                        {
                            type: "text",
                            label: "He ___ (study) all night, so he was exhausted.",
                            expectedAnswer: "had been studying",
                        },
                        {
                            type: "text",
                            label: "We ___ (drive) for hours when we finally saw the ocean.",
                            expectedAnswer: "had been driving",
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
                <p>Use <strong>had not been (hadn't been)</strong> + verb-ing.</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">hadn't been sleeping</span> well, so I was tired at work.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">hadn't been working</span> there long when she got promoted.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">hadn't been waiting</span> long when the doors opened.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "hadn't been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use hadn't been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not sleep) well before the big exam.",
                            expectedAnswer: "hadn't been sleeping",
                        },
                        {
                            type: "text",
                            label: "She ___ (not work) there long when she got the promotion.",
                            expectedAnswer: "hadn't been working",
                        },
                        {
                            type: "text",
                            label: "They ___ (not wait) long when the manager came out.",
                            expectedAnswer: "hadn't been waiting",
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
                <p>Put <strong>Had</strong> at the beginning: Had + subject + been + verb-ing?</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> you <span style="color: #f59e0b; font-weight: 600;">been waiting</span> long when the bus came?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            How long <span style="color: #f59e0b; font-weight: 600;">had</span> she <span style="color: #f59e0b; font-weight: 600;">been working</span> there before she quit?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> they <span style="color: #f59e0b; font-weight: 600;">been living</span> in that city for a long time?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Had", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "been + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Past Duration",
                    instructions: "Form questions with Had + subject + been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "How long ___ you ___ (wait) before the train arrived?",
                            expectedAnswer: "had you been waiting",
                        },
                        {
                            type: "text",
                            label: "___ she ___ (work) there long before she got promoted?",
                            expectedAnswer: "Had she been working",
                        },
                        {
                            type: "text",
                            label: "What ___ they ___ (do) before the accident happened?",
                            expectedAnswer: "had they been doing",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'wait' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ been waiting", expectedAnswer: "had" },
                        { type: "text", label: "Negative: I ___ been waiting", expectedAnswer: "hadn't" },
                        { type: "text", label: "Question: ___ I been waiting?", expectedAnswer: "Had" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "I had been wait for an hour.", expectedAnswer: "I had been waiting for an hour" },
                        { type: "text", label: "She had being working all day.", expectedAnswer: "She had been working all day" },
                        { type: "text", label: "They has been living there for years.", expectedAnswer: "They had been living there for years" },
                    ],
                },
            ],
        },

        // Common Mistakes Section
        {
            id: "common-mistakes",
            title: "Common Mistakes: Past Perfect Continuous vs Past Continuous",
            icon: "⚠️",
            explanation: `
                <h3>Don't Confuse These!</h3>
                <p>Both describe ongoing past actions, but they have different time relationships.</p>
            `,
            comparison: {
                title: "Past Perfect Continuous vs Past Continuous",
                leftLabel: "Past Perfect Continuous",
                rightLabel: "Past Continuous",
                rows: [
                    {
                        label: "Time Relationship",
                        left: "Duration BEFORE another past event",
                        right: "Action in progress AT a past moment",
                    },
                    {
                        label: "Focus",
                        left: "How long before?",
                        right: "What was happening then?",
                    },
                    {
                        label: "Example",
                        left: "I had been waiting for an hour when the bus arrived.",
                        right: "I was waiting when the bus arrived.",
                    },
                    {
                        label: "Example",
                        left: "She was tired because she had been working all day.",
                        right: "She was working when I called.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Past Perfect Continuous or Past Continuous?",
                    instructions: "Choose the correct tense based on the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ for 2 hours when the bus finally came." (duration before)',
                            options: [
                                { value: "had been waiting", label: "had been waiting" },
                                { value: "was waiting", label: "was waiting" },
                            ],
                            expectedAnswer: "had been waiting",
                        },
                        {
                            type: "radio",
                            label: '"I ___ when the phone rang." (action at that moment)',
                            options: [
                                { value: "had been sleeping", label: "had been sleeping" },
                                { value: "was sleeping", label: "was sleeping" },
                            ],
                            expectedAnswer: "was sleeping",
                        },
                        {
                            type: "radio",
                            label: '"She was exhausted because she ___ all night." (cause of past state)',
                            options: [
                                { value: "had been working", label: "had been working" },
                                { value: "was working", label: "was working" },
                            ],
                            expectedAnswer: "had been working",
                        },
                        {
                            type: "radio",
                            label: '"What ___ you ___ at 8 PM yesterday?" (action at specific time)',
                            options: [
                                { value: "had been doing", label: "had you been doing" },
                                { value: "were doing", label: "were you doing" },
                            ],
                            expectedAnswer: "were doing",
                        },
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
                    <li><strong>When to Use:</strong> Duration of an action BEFORE another past event; explaining causes of past situations</li>
                    <li><strong>Key Questions:</strong> "How long had you been...?" "Had you been...?"</li>
                    <li><strong>Positive:</strong> Subject + had been + verb-ing</li>
                    <li><strong>Negative:</strong> Subject + hadn't been + verb-ing</li>
                    <li><strong>Questions:</strong> Had + subject + been + verb-ing?</li>
                    <li><strong>Time Words:</strong> for (duration), since, all day, all morning, before, when</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Past Perfect Continuous = duration BEFORE a past event. Past Continuous = action AT a past moment. Ask: 'Am I emphasizing how long before something happened?'",
            },
            exercises: [
                {
                    id: "past-perfect-continuous-summary-1",
                    title: "Practice: Key Points Check",
                    instructions: "Review the form and when to use Past Perfect Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "Which structure is correct?",
                            options: [
                                { value: "b", label: "have been + verb-ing" },
                                { value: "a", label: "had been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Pick the best choice: "He was tired because he ___ all night."',
                            options: [
                                { value: "b", label: "was working" },
                                { value: "c", label: "worked" },
                                { value: "a", label: "had been working" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which question form is correct?",
                            options: [
                                { value: "a", label: "Had you been waiting long?" },
                                { value: "b", label: "Did you been waiting long?" },
                                { value: "c", label: "Were you been waiting long?" },
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
            question: "Which sentence correctly uses Past Perfect Continuous?",
            options: [
                { value: "a", label: "I had been wait for an hour." },
                { value: "b", label: "I had been waiting for an hour." },
                { value: "c", label: "I have been waiting for an hour." },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous: had been + verb-ing.",
            skillTag: "form-ppc-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct negative form.",
            options: [
                { value: "b", label: "She hadn't being sleeping well." },
                { value: "c", label: "She hasn't been sleeping well." },
                { value: "a", label: "She hadn't been sleeping well." },
            ],
            correctAnswer: "a",
            explanation: "Negative: hadn't been + verb-ing.",
            skillTag: "form-ppc-negative",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Had you been waiting long?" },
                { value: "b", label: "Had you been wait long?" },
                { value: "c", label: "Have you been waiting long?" },
            ],
            correctAnswer: "a",
            explanation: "Question: Had + subject + been + verb-ing.",
            skillTag: "form-ppc-question",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "When do we use Past Perfect Continuous instead of Past Continuous?",
            options: [
                { value: "a", label: "When describing what was happening at a specific past moment" },
                { value: "b", label: "When emphasizing duration BEFORE another past event" },
                { value: "c", label: "When talking about future plans" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous = duration before another past event. Past Continuous = action at a past moment.",
            skillTag: "contrast-past-perfect-continuous-vs-past-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Choose the best answer: \"She was tired because she ___ all day.\"",
            options: [
                { value: "a", label: "was working" },
                { value: "c", label: "worked" },
                { value: "b", label: "had been working" },
            ],
            correctAnswer: "b",
            explanation: "Explaining a past state (tired) with prior duration uses Past Perfect Continuous.",
            skillTag: "past-perfect-continuous-cause-effect",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Fill in the blank: \"I ___ for three hours when my friend called.\"",
            options: [
                { value: "a", label: "had been studying" },
                { value: "b", label: "was studying" },
                { value: "c", label: "studied" },
            ],
            correctAnswer: "a",
            explanation: "We show duration before a past event (the call), so we use Past Perfect Continuous.",
            skillTag: "past-perfect-continuous-two-past-actions-sequence",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "Complete the sentence: \"They had been living there ___ 2010.\"",
            options: [
                { value: "b", label: "for" },
                { value: "a", label: "since" },
                { value: "c", label: "at" },
            ],
            correctAnswer: "a",
            explanation: "Since + starting point (since 2010). For + duration.",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Complete the sentence: \"We had been waiting ___ two hours when the doors opened.\"",
            options: [
                { value: "b", label: "since" },
                { value: "c", label: "during" },
                { value: "a", label: "for" },
            ],
            correctAnswer: "a",
            explanation: "For + a length of time (for two hours).",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "In this sentence, which action happened first? \"I had been working at the company for five years when it closed.\"",
            options: [
                { value: "b", label: "I started working at the company." },
                { value: "a", label: "The company closed." },
                { value: "c", label: "I looked for a new job." },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous (had been working) describes the earlier, longer action.",
            skillTag: "past-perfect-continuous-first-action-identification",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Choose the best option: \"By the time we arrived, they ___ for two hours.\"",
            options: [
                { value: "a", label: "were waiting" },
                { value: "b", label: "had been waiting" },
                { value: "c", label: "waited" },
            ],
            correctAnswer: "b",
            explanation: "\"By the time\" plus duration before that past point → Past Perfect Continuous.",
            skillTag: "pattern-by-the-time-past-perfect-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Which question correctly asks about duration before another past event?",
            options: [
                { value: "a", label: "How long were you waiting when the bus came?" },
                { value: "c", label: "How long have you been waiting when the bus came?" },
                { value: "b", label: "How long had you been waiting when the bus came?" },
            ],
            correctAnswer: "b",
            explanation: "We ask about duration before a past event with: How long + had + subject + been + verb-ing.",
            skillTag: "duration-for-since-how-long",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "Which sentence is correct and natural?",
            options: [
                { value: "b", label: "I had known him for years before we got married." },
                { value: "a", label: "I had been knowing him for years before we got married." },
                { value: "c", label: "I had been known him for years before we got married." },
            ],
            correctAnswer: "b",
            explanation: "State verbs like know do not usually take continuous forms; use Past Perfect Simple instead.",
            skillTag: "error-stative-verb-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Choose the best sentence to show duration before a past moment.",
            options: [
                { value: "a", label: "When the teacher came in, we were talking for a long time." },
                { value: "b", label: "When the teacher came in, we had been talking for a long time." },
                { value: "c", label: "When the teacher came in, we had talked for a long time." },
            ],
            correctAnswer: "b",
            explanation: "\"Had been talking\" emphasizes how long the action had been happening before the teacher came in.",
            skillTag: "contrast-past-perfect-continuous-vs-past-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Which sentence correctly uses Past Perfect Continuous with \"when\"?",
            options: [
                { value: "b", label: "When I had arrived, they were eating dinner for an hour." },
                { value: "c", label: "When I had been arriving, they ate dinner for an hour." },
                { value: "a", label: "When I arrived, they had been eating dinner for an hour." },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect Continuous describes the ongoing action before the simple past event (I arrived).",
            skillTag: "pattern-when-past-perfect-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "What question does Past Perfect Continuous usually answer?",
            options: [
                { value: "b", label: "How long had something been happening before another past event?" },
                { value: "a", label: "What will happen in the future?" },
                { value: "c", label: "What is happening right now?" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous focuses on duration before another past moment.",
            skillTag: "meta-ppc-meaning",
            difficulty: "easy",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Past Perfect Continuous Mini Quiz

    Meaning and sequence:
    - past-perfect-continuous-two-past-actions-sequence
    - past-perfect-continuous-first-action-identification
    - past-perfect-continuous-cause-effect

    Duration skills:
    - duration-for-since-how-long

    Form skills:
    - form-ppc-positive
    - form-ppc-negative
    - form-ppc-question

    Pattern skills:
    - pattern-by-the-time-past-perfect-continuous
    - pattern-when-past-perfect-continuous

    Contrast skills:
    - contrast-past-perfect-continuous-vs-past-continuous

    Common error patterns:
    - error-stative-verb-continuous

    Meta understanding:
    - meta-ppc-meaning

    Reteaching guidance:
    - If meaning/sequence tags are weak → go back to the TWO-VERB RULE and have students label FIRST and SECOND actions on a timeline.
    - If duration tags are weak → drill for vs since and HOW LONG questions anchored to a later past event (when, by the time, before).
    - If form tags are weak → practice had been + verb-ing across subjects in positive, negative, and question forms.
    - If pattern tags are weak → build sentence frames with "by the time" and "when" plus Past Perfect Continuous + Past Simple.
    - If contrast tags are weak → compare pairs like "was waiting" vs "had been waiting" and ask: "Am I talking about what was happening at that moment, or how long before it?"
    - If stative-verb errors appear → review common stative verbs (know, like, love, believe, understand) and replace Past Perfect Continuous with Past Perfect Simple in those cases.
    */
};
