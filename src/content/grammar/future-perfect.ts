import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Future Perfect: The Deadline Machine",
            icon: "⏰",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(203, 213, 225, 0.2) 0%, rgba(6, 182, 212, 0.2) 50%, rgba(34, 197, 94, 0.2) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Future Perfect is like standing at a <strong style="color: #a855f7;">deadline in the future</strong> and looking back: <strong style="color: #06b6d4;">"By then, this will be DONE."</strong> It's the tense for talking about what you'll have accomplished by a specific time.</p>
                </div>

                <h3>The Time Machine to Your Deadlines</h3>
                <p>Imagine you can travel to a future moment—next Friday at 5 PM, next year, graduation day. You look back and ask: "What will I have completed by then?"</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #06b6d4;">Real-Life Uses</h4>
                    <ul style="list-style: none; padding-left: 0; margin: 0;">
                        <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">⏰ <strong>Deadlines</strong>: "By 6 PM, I will have finished my homework."</li>
                        <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">📅 <strong>Milestones</strong>: "By next year, I will have lived here for 10 years."</li>
                        <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">🔮 <strong>Predictions</strong>: "They will have left by the time we arrive."</li>
                        <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">🎯 <strong>Goals</strong>: "By summer, I will have saved $2,000."</li>
                    </ul>
                </div>

                <div style="background: linear-gradient(135deg, rgba(244, 211, 94, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%); padding: 1.25rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #f59e0b; font-size: 1.125rem;">📝 The Formula</h4>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        <span style="background: white; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Subject</span>
                        <span style="font-size: 1.5rem; color: #f59e0b; font-weight: 600;">+</span>
                        <span style="background: white; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">will have</span>
                        <span style="font-size: 1.5rem; color: #f59e0b; font-weight: 600;">+</span>
                        <span style="background: white; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "intro-exercise-1",
                    title: "Practice: Understanding the Big Idea",
                    instructions: "Check your understanding of when Future Perfect is used.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Perfect describe?",
                            options: [
                                { value: "b", label: "Actions happening right now" },
                                { value: "a", label: "Actions that will be complete by a future deadline" },
                                { value: "c", label: "Past actions that are finished" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which word is a strong signal for Future Perfect?",
                            options: [
                                { value: "b", label: "yesterday" },
                                { value: "c", label: "usually" },
                                { value: "a", label: "by (by tomorrow, by next week)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 1,
            title: "Timeline: Looking Back from the Future",
            icon: "📊",
            explanation: `
                <h3>Understanding Future Perfect Visually</h3>
                <p>Future Perfect is all about perspective: you mentally stand at a future point and look back at what's already done.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Action Complete Before Future Point</h4>

                    <div style="display: flex; align-items: center; justify-content: space-around; position: relative; margin: 2rem 0;">
                        <!-- Timeline Line -->
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 6px; background: linear-gradient(to right, #cbd5e1, #f97316, #22c55e); transform: translateY(-50%); z-index: 0; border-radius: 3px;"></div>

                        <!-- NOW -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 0 auto;">
                                NOW
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #64748b; font-weight: 600;">Present</div>
                        </div>

                        <!-- ACTION DONE -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: #f97316; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; border: 4px solid white; box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4); margin: 0 auto; text-align: center; padding: 0.5rem; line-height: 1.2;">
                                ACTION<br/>DONE
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #f97316; font-weight: 600;">Completed</div>
                        </div>

                        <!-- BY THEN -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: #22c55e; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; border: 4px solid white; box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4); margin: 0 auto; text-align: center; padding: 0.5rem; line-height: 1.2;">
                                BY<br/>THEN
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #22c55e; font-weight: 600;">Future Point</div>
                        </div>
                    </div>

                    <div style="background: #f0fdfa; padding: 1.25rem; border-radius: 0.5rem; margin-top: 2rem;">
                        <p style="margin: 0; text-align: center; font-size: 1.05rem;"><strong>Example:</strong> <span style="color: #cbd5e1; font-weight: 600;">Now</span> → <span style="color: #f97316; font-weight: 600;">I finish my work</span> → <span style="color: #22c55e; font-weight: 600;">By 5 PM</span></p>
                        <p style="margin: 0.75rem 0 0 0; text-align: center; font-size: 1.125rem; color: #06b6d4; font-weight: 700;">"By 5 PM, I will have finished my work."</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Key Question",
                content: "Ask yourself: 'Will it be DONE by then?' If yes, use Future Perfect. If it happens AT that time, use Future Simple.",
            },
            exercises: [
                {
                    id: "timeline-exercise-1",
                    title: "Practice: Reading the Timeline",
                    instructions: "Choose the correct tense based on the timeline.",
                    items: [
                        {
                            type: "radio",
                            label: "Which matches 'done BEFORE 6 PM'?",
                            options: [
                                { value: "a", label: "I will have finished by 6 PM." },
                                { value: "b", label: "I will finish at 6 PM." },
                                { value: "c", label: "I finished at 6 PM." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete: By the time you arrive, I ___ (cook) dinner.",
                            expectedAnswer: "will have cooked",
                        },
                    ],
                },
            ],
        },

        // Pattern 1: Actions Complete Before a Deadline
        {
            id: "pattern-1",
            stepNumber: 2,
            title: "Pattern 1: Actions Complete Before a Deadline",
            icon: "⏰",
            explanation: `
                <h3>The Most Common Use: Deadlines</h3>
                <p>Use Future Perfect when something will be finished <strong>before</strong> a specific future time.</p>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #06b6d4;">📋 Formula</h4>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; padding: 1rem; background: white; border-radius: 0.5rem;">
                        <span style="background: #e0f2fe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">Subject</span>
                        <span style="font-size: 1.25rem; color: #64748b;">+</span>
                        <span style="background: #dbeafe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">will have</span>
                        <span style="font-size: 1.25rem; color: #64748b;">+</span>
                        <span style="background: #bae6fd; color: #0369a1; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">past participle</span>
                        <span style="font-size: 1.25rem; color: #64748b;">+</span>
                        <span style="background: #ecfdf5; color: #059669; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">by/before + time</span>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⏰ Deadlines with 'by'",
                    description: "Something will be finished before a specific time",
                    examples: [
                        {
                            sentence: "I <strong style='color: #06b6d4;'>will have finished</strong> my homework <strong style='color: #22c55e;'>by 6 PM</strong>.",
                            explanation: "✓ Homework done before 6 PM arrives",
                        },
                        {
                            sentence: "She <strong style='color: #06b6d4;'>will have cleaned</strong> the kitchen <strong style='color: #22c55e;'>by the time the guests arrive</strong>.",
                            explanation: "✓ Kitchen clean before guests walk in",
                        },
                        {
                            sentence: "They <strong style='color: #06b6d4;'>will have left</strong> <strong style='color: #22c55e;'>by noon</strong>.",
                            explanation: "✓ Departure happens before noon",
                        },
                    ],
                },
                {
                    title: "⏳ Deadlines with 'before'",
                    description: "Something will be complete before another event",
                    examples: [
                        {
                            sentence: "I <strong style='color: #06b6d4;'>will have read</strong> the book <strong style='color: #22c55e;'>before class starts</strong>.",
                            explanation: "✓ Reading finished before class begins",
                        },
                        {
                            sentence: "We <strong style='color: #06b6d4;'>will have saved</strong> enough money <strong style='color: #22c55e;'>before summer</strong>.",
                            explanation: "✓ Savings goal reached before summer arrives",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-1-exercise",
                    title: "Exercise: Complete with Future Perfect",
                    instructions: "Use will have + past participle to show actions complete before a deadline.",
                    items: [
                        {
                            type: "text",
                            label: "By tomorrow, I ___ (finish) the project.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "She ___ (leave) by the time you arrive.",
                            expectedAnswer: "will have left",
                        },
                        {
                            type: "text",
                            label: "Before next week, they ___ (move) to their new house.",
                            expectedAnswer: "will have moved",
                        },
                        {
                            type: "text",
                            label: "By December, we ___ (save) $5,000.",
                            expectedAnswer: "will have saved",
                        },
                    ],
                },
            ],
        },

        // Pattern 2: Duration Up to a Future Point
        {
            id: "pattern-2",
            stepNumber: 3,
            title: "Pattern 2: Duration Up to a Future Point (Milestones)",
            icon: "📅",
            explanation: `
                <h3>How Long Will You Have Done Something?</h3>
                <p>Use Future Perfect to talk about how long something will have lasted <strong>by</strong> a future time—perfect for milestones!</p>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #a855f7;">📋 Formula</h4>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap; padding: 1rem; background: white; border-radius: 0.5rem;">
                        <span style="background: #f3e8ff; color: #7c3aed; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">By + future time</span>
                        <span style="font-size: 1.25rem; color: #64748b;">,</span>
                        <span style="background: #e0e7ff; color: #6366f1; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">subject</span>
                        <span style="font-size: 1.25rem; color: #64748b;">+</span>
                        <span style="background: #dbeafe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">will have + verb</span>
                        <span style="font-size: 1.25rem; color: #64748b;">+</span>
                        <span style="background: #fef3c7; color: #d97706; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 700;">for/since + duration</span>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📅 Milestones with 'for' (duration)",
                    description: "How long something will have lasted by a future point",
                    examples: [
                        {
                            sentence: "By next year, I <strong style='color: #a855f7;'>will have lived</strong> in this city <strong style='color: #d97706;'>for 10 years</strong>.",
                            explanation: "✓ Duration: 10 years completed by next year",
                        },
                        {
                            sentence: "By December, she <strong style='color: #a855f7;'>will have studied</strong> English <strong style='color: #d97706;'>for 5 years</strong>.",
                            explanation: "✓ 5 years of study by December",
                        },
                        {
                            sentence: "By the time he retires, he <strong style='color: #a855f7;'>will have worked</strong> here <strong style='color: #d97706;'>for 30 years</strong>.",
                            explanation: "✓ 30-year milestone at retirement",
                        },
                    ],
                },
                {
                    title: "🎯 Milestones with 'since' (starting point)",
                    description: "How long from a past starting point to a future point",
                    examples: [
                        {
                            sentence: "By next month, we <strong style='color: #a855f7;'>will have known</strong> each other <strong style='color: #d97706;'>since childhood</strong>.",
                            explanation: "✓ Friendship lasting from childhood to next month",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-2-exercise",
                    title: "Exercise: Duration and Milestones",
                    instructions: "Complete with Future Perfect to show how long something will have lasted.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I ___ (study) English for 3 years.",
                            expectedAnswer: "will have studied",
                        },
                        {
                            type: "text",
                            label: "By the time you graduate, you ___ (attend) this school for 4 years.",
                            expectedAnswer: "will have attended",
                        },
                        {
                            type: "text",
                            label: "By 2030, they ___ (live) here for a decade.",
                            expectedAnswer: "will have lived",
                        },
                    ],
                },
            ],
        },

        // Pattern 3: Predictions About Completion
        {
            id: "pattern-3",
            stepNumber: 4,
            title: "Pattern 3: Predictions About Completion",
            icon: "🔮",
            explanation: `
                <h3>Guessing What Will Be Done</h3>
                <p>Use Future Perfect to predict what will already be complete by a certain time.</p>
            `,
            usageMeanings: [
                {
                    title: "🔮 Predicting Completion",
                    description: "Making guesses about what will be done by then",
                    examples: [
                        {
                            sentence: "The store <strong style='color: #06b6d4;'>will have closed</strong> by the time we get there.",
                            explanation: "✓ Prediction: store already closed when we arrive",
                        },
                        {
                            sentence: "Don't worry—they <strong style='color: #06b6d4;'>will have finished</strong> eating by now.",
                            explanation: "✓ Assumption: meal already done",
                        },
                        {
                            sentence: "By the time the movie ends, it <strong style='color: #06b6d4;'>will have gotten</strong> dark outside.",
                            explanation: "✓ Prediction: darkness arrives before movie ends",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "pattern-3-exercise",
                    title: "Exercise: Make Predictions",
                    instructions: "Use Future Perfect to predict what will be complete.",
                    items: [
                        {
                            type: "text",
                            label: "By the time we arrive, the party ___ (start).",
                            expectedAnswer: "will have started",
                        },
                        {
                            type: "text",
                            label: "The bus ___ (leave) by the time you get to the station.",
                            expectedAnswer: "will have left",
                        },
                    ],
                },
            ],
        },

        // Forms: Positive, Negative, Question
        {
            id: "forms",
            stepNumber: 5,
            title: "All Forms: Positive, Negative, Questions",
            icon: "🔄",
            explanation: `
                <h3>How to Make All Forms</h3>
                <p>Future Perfect uses the same structure for all subjects—just change "will" to "won't" for negative, and move "will" to the front for questions.</p>
            `,
            comparison: {
                title: "All Forms",
                leftLabel: "Positive",
                rightLabel: "Negative",
                rows: [
                    {
                        label: "Formula",
                        left: "will have + past participle",
                        right: "won't have + past participle",
                    },
                    {
                        label: "I",
                        left: "I will have finished",
                        right: "I won't have finished",
                    },
                    {
                        label: "She",
                        left: "She will have left",
                        right: "She won't have left",
                    },
                    {
                        label: "They",
                        left: "They will have saved",
                        right: "They won't have saved",
                    },
                ],
            },
            exercises: [
                {
                    id: "forms-exercise",
                    title: "Exercise: Practice All Forms",
                    instructions: "Complete with the correct form of Future Perfect.",
                    items: [
                        {
                            type: "text",
                            label: "Positive: By tomorrow, I ___ (finish) the report.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "Negative: She ___ (arrive) by 5 PM because of traffic.",
                            expectedAnswer: "won't have arrived",
                        },
                        {
                            type: "text",
                            label: "Question: ___ you ___ (complete) the assignment by Friday?",
                            expectedAnswer: "Will you have completed",
                        },
                    ],
                },
            ],
        },

        // Comparison: Future Perfect vs Future Simple
        {
            id: "comparison",
            stepNumber: 6,
            title: "Future Perfect vs Future Simple",
            icon: "⚖️",
            explanation: `
                <h3>Don't Confuse These Two!</h3>
                <p>The difference is about <strong>when</strong> the action is complete: <strong>BY</strong> a time (Future Perfect) vs <strong>AT</strong> a time (Future Simple).</p>
            `,
            comparison: {
                title: "BY vs AT",
                leftLabel: "Future Perfect",
                rightLabel: "Future Simple",
                rows: [
                    {
                        label: "Meaning",
                        left: "Action COMPLETE BEFORE a deadline",
                        right: "Action HAPPENS AT a future time",
                    },
                    {
                        label: "Time Word",
                        left: "BY (by tomorrow, by 6 PM)",
                        right: "AT, ON, IN (at 6 PM, on Friday)",
                    },
                    {
                        label: "Example",
                        left: "I will have finished BY 6 PM. (done before 6)",
                        right: "I will finish AT 6 PM. (happens at 6)",
                    },
                    {
                        label: "Example",
                        left: "She will have left by the time you arrive.",
                        right: "She will leave when you arrive.",
                    },
                    {
                        label: "Question",
                        left: "Will it be DONE by then?",
                        right: "WHEN will it happen?",
                    },
                ],
            },
            exercises: [
                {
                    id: "comparison-exercise",
                    title: "Exercise: Future Perfect or Future Simple?",
                    instructions: "Choose the correct tense based on BY vs AT.",
                    items: [
                        {
                            type: "radio",
                            label: "I ___ the report BY Friday. (complete before Friday)",
                            options: [
                                { value: "b", label: "will finish" },
                                { value: "a", label: "will have finished" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I ___ the report ON Friday. (action happens Friday)",
                            options: [
                                { value: "b", label: "will finish" },
                                { value: "a", label: "will have finished" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "The train ___ by the time we arrive at the station.",
                            options: [
                                { value: "b", label: "will leave" },
                                { value: "a", label: "will have left" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 7,
            title: "Common Mistakes",
            icon: "⚠️",
            explanation: `
                <h3>Avoid These Errors!</h3>
                <p>Students often make these mistakes with Future Perfect. Learn to spot and fix them.</p>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 1: Forgetting "have"</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I will finished by tomorrow.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I will <strong>have</strong> finished by tomorrow.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">You need both "will" AND "have" before the past participle!</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 2: Using base form instead of past participle</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">She will have finish by 5 PM.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">She will have <strong>finished</strong> by 5 PM.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">After "will have," always use the past participle (finished, eaten, gone, etc.).</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 3: Wrong word order in questions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">You will have finished by tomorrow?</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;"><strong>Will</strong> you have finished by tomorrow?</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">In questions, "will" comes first, before the subject.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 4: Using Future Perfect when Future Simple is correct</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">The class will have started <strong>at</strong> 9 AM.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">The class will start <strong>at</strong> 9 AM.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">"At" = exact time of action → Future Simple. "By" = before that time → Future Perfect.</p>
                </div>
            `,
            exercises: [
                {
                    id: "mistakes-exercise",
                    title: "Exercise: Fix the Errors",
                    instructions: "Each sentence has ONE mistake. Write the corrected version.",
                    items: [
                        {
                            type: "text",
                            label: "They will have arrive by 6 PM.",
                            expectedAnswer: "They will have arrived by 6 PM",
                        },
                        {
                            type: "text",
                            label: "I will finished my homework by tomorrow.",
                            expectedAnswer: "I will have finished my homework by tomorrow",
                        },
                        {
                            type: "text",
                            label: "She will has left by the time you arrive.",
                            expectedAnswer: "She will have left by the time you arrive",
                        },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            stepNumber: 8,
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0;">
                    <ul style="list-style: none; padding-left: 0; margin: 0;">
                        <li style="padding: 0.75rem; margin: 0.5rem 0; background: white; border-left: 4px solid #06b6d4; border-radius: 0.375rem;">
                            ✓ <strong>Big Idea:</strong> Future Perfect = standing at a future point and looking back at what's done
                        </li>
                        <li style="padding: 0.75rem; margin: 0.5rem 0; background: white; border-left: 4px solid #06b6d4; border-radius: 0.375rem;">
                            ✓ <strong>Key Signal:</strong> "by" (by tomorrow, by 6 PM, by next year)
                        </li>
                        <li style="padding: 0.75rem; margin: 0.5rem 0; background: white; border-left: 4px solid #06b6d4; border-radius: 0.375rem;">
                            ✓ <strong>Formula:</strong> Subject + will have + past participle
                        </li>
                        <li style="padding: 0.75rem; margin: 0.5rem 0; background: white; border-left: 4px solid #06b6d4; border-radius: 0.375rem;">
                            ✓ <strong>Uses:</strong> Deadlines, milestones, predictions about completion
                        </li>
                        <li style="padding: 0.75rem; margin: 0.5rem 0; background: white; border-left: 4px solid #06b6d4; border-radius: 0.375rem;">
                            ✓ <strong>vs Future Simple:</strong> BY (Future Perfect) vs AT (Future Simple)
                        </li>
                    </ul>
                </div>

                <div style="background: #fff9e6; padding: 1.25rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #f59e0b;">🎯 Quick Reference Table</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: rgba(6, 182, 212, 0.1);">
                                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #06b6d4;">Form</th>
                                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #06b6d4;">Structure</th>
                                <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #06b6d4;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">Positive</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">will have + V3</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">I will have finished</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">Negative</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">won't have + V3</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">I won't have finished</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem;">Question</td>
                                <td style="padding: 0.75rem;">Will + S + have + V3?</td>
                                <td style="padding: 0.75rem;">Will I have finished?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            tipBox: {
                title: "💡 The Ultimate Test",
                content: "Ask: 'Will it be DONE by then?' If yes → Future Perfect. If it happens AT that time → Future Simple.",
            },
        },

        // Career Planning & Interviews (Supplementary)
        {
            id: "career-planning-context",
            stepNumber: 9,
            title: "💼 Career Planning & Interviews (Supplementary)",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4;">💼 Real-World Application: Career & Professional Context</h3>
                    <p>Future Perfect is ESSENTIAL for job interviews and career planning. It helps you talk about milestones, goals, and what you'll have accomplished by certain deadlines.</p>
                </div>

                <h3>Why Future Perfect Matters in Professional Settings</h3>
                <p>When interviewing or planning your career, you need to talk about:</p>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✅ <strong>Certifications/Training:</strong> "By next summer, I will have completed my CNA certification."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✅ <strong>Experience Milestones:</strong> "By December, I will have worked in customer service for 5 years."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✅ <strong>Project Completion:</strong> "By the end of Q2, I will have finished the training program."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✅ <strong>Skill Development:</strong> "By this time next year, I will have learned advanced Excel skills."</li>
                </ul>

                <div style="background: white; border: 2px solid #a855f7; border-radius: 0.75rem; padding: 1.5rem; margin: 2rem 0;">
                    <h4 style="margin-top: 0; color: #a855f7;">🎤 Common Interview Questions Using Future Perfect</h4>

                    <div style="margin: 1.5rem 0;">
                        <p style="font-weight: 700; color: #a855f7; margin-bottom: 0.5rem;">Question: "Where do you see yourself in 5 years?"</p>
                        <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                            <p style="margin: 0; font-weight: 600;">Strong Answer Using Future Perfect:</p>
                            <p style="margin: 0.5rem 0 0 0;">"In 5 years, I <strong style='color: #a855f7;'>will have gained</strong> extensive experience in this industry. By then, I <strong style='color: #a855f7;'>will have completed</strong> my associate degree and <strong style='color: #a855f7;'>will have developed</strong> leadership skills by taking on team projects."</p>
                        </div>
                    </div>

                    <div style="margin: 1.5rem 0;">
                        <p style="font-weight: 700; color: #a855f7; margin-bottom: 0.5rem;">Question: "What are your career goals?"</p>
                        <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                            <p style="margin: 0; font-weight: 600;">Strong Answer Using Future Perfect:</p>
                            <p style="margin: 0.5rem 0 0 0;">"By next year, I <strong style='color: #a855f7;'>will have completed</strong> my certification in medical coding. By 2028, I <strong style='color: #a855f7;'>will have worked</strong> in a hospital setting and <strong style='color: #a855f7;'>will have built</strong> strong relationships with healthcare teams."</p>
                        </div>
                    </div>

                    <div style="margin: 1.5rem 0;">
                        <p style="font-weight: 700; color: #a855f7; margin-bottom: 0.5rem;">Question: "Why should we hire you?"</p>
                        <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                            <p style="margin: 0; font-weight: 600;">Strong Answer Using Future Perfect:</p>
                            <p style="margin: 0.5rem 0 0 0;">"By the time I start, I <strong style='color: #a855f7;'>will have completed</strong> the required training. I also <strong style='color: #a855f7;'>will have gained</strong> 3 years of experience in fast-paced environments, which prepares me for this role."</p>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(34, 197, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.75rem; margin: 2rem 0;">
                    <h4 style="margin-top: 0; color: #06b6d4;">📅 Setting Professional Milestones</h4>
                    <p>Use Future Perfect to plan your career trajectory with specific deadlines:</p>

                    <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #06b6d4;">
                            <p style="margin: 0; font-weight: 700; color: #06b6d4;">Short-Term Goals (3-6 months)</p>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By June, I will have completed the onboarding training."</li>
                                <li>"By the end of Q1, I will have mastered the new software system."</li>
                            </ul>
                        </div>

                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
                            <p style="margin: 0; font-weight: 700; color: #22c55e;">Medium-Term Goals (1-2 years)</p>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By next year, I will have earned my project management certification."</li>
                                <li>"By 2027, I will have led at least 3 successful team projects."</li>
                            </ul>
                        </div>

                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                            <p style="margin: 0; font-weight: 700; color: #a855f7;">Long-Term Goals (3-5 years)</p>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem;">
                                <li>"By 2030, I will have advanced to a supervisory position."</li>
                                <li>"By the time I turn 30, I will have built a strong professional network."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 2rem 0;">
                    <h4 style="margin-top: 0; color: #06b6d4;">🎯 Resume & Cover Letter Power Phrases</h4>
                    <p>Make your application stand out with Future Perfect to show forward-thinking:</p>

                    <div style="background: #f0fdfa; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                        <p style="margin: 0; font-weight: 600; color: #06b6d4;">In Your Cover Letter:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; list-style-type: disc;">
                            <li>"By the time I begin this role, I <strong>will have completed</strong> specialized training in [skill]."</li>
                            <li>"With this opportunity, by year's end I <strong>will have contributed</strong> to [specific company goal]."</li>
                        </ul>
                    </div>

                    <div style="background: #f0fdfa; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600; color: #06b6d4;">In Your Interview:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; list-style-type: disc;">
                            <li>"If hired, by the end of my first 90 days I <strong>will have learned</strong> all key systems and processes."</li>
                            <li>"By my one-year anniversary, I <strong>will have built</strong> strong relationships with key stakeholders."</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fff9e6; padding: 1.25rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin: 2rem 0;">
                    <h4 style="margin-top: 0; color: #f59e0b;">💬 Practice Speaking: Career Goals</h4>
                    <p style="margin-bottom: 1rem;">Use these prompts to practice talking about your professional future:</p>
                    <ol style="margin: 0; padding-left: 1.25rem;">
                        <li style="margin-bottom: 0.75rem;"><strong>Short-term:</strong> "By 6 months from now, I will have..."</li>
                        <li style="margin-bottom: 0.75rem;"><strong>One year:</strong> "By this time next year, I will have..."</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Five years:</strong> "By 2030, I will have..."</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Milestone:</strong> "By the time I reach [age/date], I will have..."</li>
                    </ol>
                </div>

                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%); padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid #a855f7; margin: 2rem 0;">
                    <h4 style="margin-top: 0; color: #a855f7;">📝 Time Expressions for Career Context</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.5rem; margin-top: 0.75rem;">
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by next quarter</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by the end of the year</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by my review date</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by graduation</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by certification date</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by 2028</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by the deadline</span>
                        <span style="background: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #06b6d4; text-align: center;">by then</span>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "career-planning-exercise",
                    title: "Practice: Career Planning & Interviews",
                    instructions: "Complete these career-related sentences with Future Perfect.",
                    items: [
                        {
                            type: "text",
                            label: "Interview question response: 'By next year, I ___ (complete) my medical assistant certification.'",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "Professional goal: 'By 2028, I ___ (gain) 5 years of experience in this field.'",
                            expectedAnswer: "will have gained",
                        },
                        {
                            type: "text",
                            label: "Cover letter: 'By the time I start, I ___ (finish) the required training program.'",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "Career milestone: 'By my next performance review, I ___ (lead) at least 3 team projects.'",
                            expectedAnswer: "will have led",
                        },
                        {
                            type: "text",
                            label: "Long-term goal: 'By the time I retire, I ___ (build) a successful career in healthcare.'",
                            expectedAnswer: "will have built",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly uses Future Perfect?",
            options: [
                { value: "a", label: "I will have finish the work by tomorrow." },
                { value: "b", label: "I will have finished the work by tomorrow." },
                { value: "c", label: "I will finished the work by tomorrow." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect requires will have + past participle.",
            skillTag: "form-future-perfect-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct negative form.",
            options: [
                { value: "b", label: "She will haven't arrived by 6 PM." },
                { value: "c", label: "She won't has arrived by 6 PM." },
                { value: "a", label: "She won't have arrived by 6 PM." },
            ],
            correctAnswer: "a",
            explanation: "Negative form is won't have + past participle.",
            skillTag: "form-future-perfect-negative",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Will you have finished by tomorrow?" },
                { value: "b", label: "Will you has finished by tomorrow?" },
                { value: "c", label: "Have you will finished by tomorrow?" },
            ],
            correctAnswer: "a",
            explanation: "Questions use Will + subject + have + past participle.",
            skillTag: "form-future-perfect-question",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "When do we use Future Perfect instead of Future Simple?",
            options: [
                { value: "a", label: "When the action happens AT a specific time" },
                { value: "b", label: "When the action is complete BEFORE a deadline" },
                { value: "c", label: "When talking about daily habits" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect focuses on completion before a future time.",
            skillTag: "contrast-future-perfect-vs-simple-future",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Choose the best sentence for: 'complete before the deadline'",
            options: [
                { value: "a", label: "I will finish my homework by 6 PM." },
                { value: "c", label: "I finished my homework by 6 PM." },
                { value: "b", label: "I will have finished my homework by 6 PM." },
            ],
            correctAnswer: "b",
            explanation: "'By' signals a deadline, so we use Future Perfect.",
            skillTag: "result-future-completed-by-deadline",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "What's the formula for Future Perfect?",
            options: [
                { value: "a", label: "will have + past participle" },
                { value: "b", label: "have + past participle" },
                { value: "c", label: "will + base verb" },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect uses will have + past participle.",
            skillTag: "form-future-perfect-structure",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which word strongly signals Future Perfect?",
            options: [
                { value: "b", label: "yesterday" },
                { value: "a", label: "by (by tomorrow, by next week)" },
                { value: "c", label: "every day" },
            ],
            correctAnswer: "a",
            explanation: "'By' is the strongest signal for Future Perfect deadlines.",
            skillTag: "signal-by-future-perfect",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Fill in: 'By the time you arrive, I ___ (cook) dinner.'",
            options: [
                { value: "b", label: "will cook" },
                { value: "c", label: "am cooking" },
                { value: "a", label: "will have cooked" },
            ],
            correctAnswer: "a",
            explanation: "The cooking is complete before you arrive.",
            skillTag: "pattern-by-the-time-future-perfect",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Which is a milestone example?",
            options: [
                { value: "a", label: "By next month, I will have studied here for 5 years." },
                { value: "b", label: "I study here every day." },
                { value: "c", label: "I studied here last year." },
            ],
            correctAnswer: "a",
            explanation: "Milestones describe duration completed by a future time.",
            skillTag: "result-future-milestone",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Fix the error: 'They will have arrive by 6 PM.'",
            options: [
                { value: "b", label: "They will arrive by 6 PM." },
                { value: "a", label: "They will have arrived by 6 PM." },
                { value: "c", label: "They have arrived by 6 PM." },
            ],
            correctAnswer: "a",
            explanation: "Past participle is required after 'will have'.",
            skillTag: "error-base-verb-after-have",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which sentence looks BACK from a future point?",
            options: [
                { value: "b", label: "She is cleaning the kitchen now." },
                { value: "c", label: "She cleaned the kitchen yesterday." },
                { value: "a", label: "By Friday, she will have cleaned the kitchen." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect looks back from a future point.",
            skillTag: "meaning-look-back-from-future",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Complete: 'Before the meeting starts, I ___ (send) the email.'",
            options: [
                { value: "a", label: "will have sent" },
                { value: "b", label: "send" },
                { value: "c", label: "sent" },
            ],
            correctAnswer: "a",
            explanation: "The email will be sent before the meeting starts.",
            skillTag: "pattern-before-future-perfect",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Which is correct for an interview answer?",
            options: [
                { value: "b", label: "By next year, I will complete my certification." },
                { value: "a", label: "By next year, I will have completed my certification." },
                { value: "c", label: "By next year, I completed my certification." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect emphasizes completed goals by a deadline.",
            skillTag: "result-future-career-goal",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "What's the difference: 'I will finish AT 6' vs 'I will have finished BY 6'?",
            options: [
                { value: "b", label: "They mean the same thing" },
                { value: "c", label: "BY 6 is past tense" },
                { value: "a", label: "AT 6 = happens at that time; BY 6 = complete before that time" },
            ],
            correctAnswer: "a",
            explanation: "AT vs BY distinguishes Future Simple from Future Perfect.",
            skillTag: "contrast-at-vs-by",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "Which prediction uses Future Perfect correctly?",
            options: [
                { value: "a", label: "The store will have closed by the time we get there." },
                { value: "b", label: "The store closed by the time we get there." },
                { value: "c", label: "The store will closing by the time we get there." },
            ],
            correctAnswer: "a",
            explanation: "Future Perfect predicts completion before a future event.",
            skillTag: "prediction-future-perfect",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Future Perfect Mini Quiz

    Core meaning:
    - meaning-look-back-from-future
    - result-future-completed-by-deadline
    - result-future-milestone

    Form issues:
    - form-future-perfect-positive
    - form-future-perfect-negative
    - form-future-perfect-question
    - form-future-perfect-structure

    Pattern understanding:
    - signal-by-future-perfect
    - pattern-by-the-time-future-perfect
    - pattern-before-future-perfect

    Contrast issues:
    - contrast-future-perfect-vs-simple-future
    - contrast-at-vs-by

    Common errors:
    - error-base-verb-after-have

    Reteaching guidance:
    - If meaning tags are weak → re-teach the "future deadline → look back" mental model.
    - If form tags are weak → drill will / won't + have + past participle across subjects.
    - If pattern tags are weak → practice sentence frames with by, before, and by the time.
    - If contrast tags are weak → force AT vs BY sorting exercises.
    */
};
