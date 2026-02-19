import type { InteractiveGuideContent } from "@/types/activity";

export const presentPerfectContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Present Perfect Continuous: How Long Have You Been Doing That?",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(240, 180, 90, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #6366f1; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Present Perfect Continuous emphasizes <strong style="color: #6366f1;">HOW LONG</strong> an action has been happening. It started in the past and is <strong style="color: #f0b45a;">still going on NOW</strong> (or just stopped).</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Duration up to now</strong>: "I have been working here for 5 years."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Recent activity with visible results</strong>: "You're sweating! Have you been running?"</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Temporary ongoing situations</strong>: "She has been staying with us this week."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #6366f1; font-size: 1.125rem;">have/has been + verb-ing</span></p>
                </div>
            `,
            exercises: [
                {
                    id: "present-perfect-continuous-intro-1",
                    title: "Practice: Understanding Present Perfect Continuous",
                    instructions: "Identify what Present Perfect Continuous emphasizes.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Present Perfect Continuous emphasize?",
                            options: [
                                { value: "b", label: "Completed past actions" },
                                { value: "a", label: "HOW LONG an action has been happening (duration up to now)" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I have been working here for 5 years." What does this show?',
                            options: [
                                { value: "b", label: "A completed action" },
                                { value: "c", label: "A future plan" },
                                { value: "a", label: "Duration up to now - started 5 years ago, still working" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Present Perfect Continuous?",
                            options: [
                                { value: "a", label: "have/has been + verb-ing" },
                                { value: "b", label: "have/has + past participle" },
                                { value: "c", label: "will + base verb" },
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
            title: "When Real Life Needs Present Perfect Continuous",
            icon: "⭐",
            explanation: `
                <h3>The Key Question: "How long have you been doing this?"</h3>
                <p>This tense focuses on the <strong>duration</strong> of an ongoing action. It's perfect for talking about activities that started in the past and continue now.</p>
            `,
            usageMeanings: [
                {
                    title: "⏱️ 1. Duration: How Long Something Has Been Happening",
                    description: "Actions that started in the past and continue to the present moment",
                    examples: [
                        {
                            sentence: "I <strong>have been working</strong> at this factory <strong>for three years</strong>.",
                            explanation: "✓ Started 3 years ago, still working there now",
                        },
                        {
                            sentence: "She <strong>has been waiting</strong> for the bus <strong>since 7 AM</strong>.",
                            explanation: "✓ Started at 7 AM, still waiting now",
                        },
                        {
                            sentence: "They <strong>have been living</strong> in this apartment <strong>for six months</strong>.",
                            explanation: "✓ Moved in 6 months ago, still living there",
                        },
                    ],
                },
                {
                    title: "👀 2. Recent Activity with Visible Results",
                    description: "Something just stopped, and you can see the evidence",
                    examples: [
                        {
                            sentence: "You're sweating! <strong>Have you been running</strong>?",
                            explanation: "✓ Evidence (sweat) shows recent activity",
                        },
                        {
                            sentence: "Your hands are dirty. <strong>Have you been working</strong> in the garden?",
                            explanation: "✓ Dirty hands = visible result of recent activity",
                        },
                        {
                            sentence: "The kitchen smells amazing! <strong>Have you been cooking</strong>?",
                            explanation: "✓ Smell = evidence of recent cooking",
                        },
                    ],
                },
                {
                    title: "🔄 3. Temporary Ongoing Situations",
                    description: "Something happening around now, but not permanent",
                    examples: [
                        {
                            sentence: "I <strong>have been taking</strong> extra shifts this month.",
                            explanation: "✓ Temporary situation, not forever",
                        },
                        {
                            sentence: "She <strong>has been staying</strong> with her sister while her apartment is being painted.",
                            explanation: "✓ Temporary arrangement",
                        },
                        {
                            sentence: "We <strong>have been trying</strong> a new schedule at work.",
                            explanation: "✓ Temporary experiment",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 For vs Since",
                content: "'For' = duration (for 3 hours, for 5 years). 'Since' = starting point (since Monday, since 2020). Both are common with Present Perfect Continuous!",
            },
            exercises: [
                {
                    id: "ex-usage-ppc-1",
                    title: "Practice: Why Present Perfect Continuous Here?",
                    instructions: "Choose the best reason we use Present Perfect Continuous in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"I have been working here for 5 years."',
                            options: [
                                { value: "result", label: "Recent activity with visible result" },
                                { value: "duration", label: "Duration of ongoing action" },
                                { value: "finished", label: "Finished past action" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: '"You look tired. Have you been sleeping well?"',
                            options: [
                                { value: "duration", label: "Duration of ongoing action" },
                                { value: "habit", label: "Regular habit" },
                                { value: "result", label: "Recent activity with visible result" },
                            ],
                            expectedAnswer: "result",
                        },
                        {
                            type: "radio",
                            label: '"She has been taking the bus this week because her car is broken."',
                            options: [
                                { value: "temporary", label: "Temporary ongoing situation" },
                                { value: "duration", label: "Duration of ongoing action" },
                                { value: "permanent", label: "Permanent situation" },
                            ],
                            expectedAnswer: "temporary",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization
        {
            id: "timeline",
            stepNumber: 2,
            title: "Timeline: Duration Up to Now",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Duration Visually</h3>
                <p>Present Perfect Continuous shows an action that <strong>started in the past</strong> and <strong>continues to NOW</strong>. The focus is on HOW LONG.</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Ongoing Duration</h4>

                    <div style="position: relative; margin: 2rem auto; max-width: 600px; padding: 2rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 50px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.9)); border-radius: 25px; border: 3px solid #6366f1; display: flex; align-items: center; padding: 0 2rem;">
                            <span style="color: #4338ca; font-weight: 600; font-size: 0.875rem;">have been working...</span>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 12px; height: 12px; background: #6366f1; border-radius: 50%; transform: translate(-6px, -50%); border: 2px solid white;"></div>
                            <!-- NOW dot (pulsing) -->
                            <div style="position: absolute; right: 0; top: 50%; width: 16px; height: 16px; background: #f0b45a; border-radius: 50%; transform: translate(8px, -50%); border: 3px solid white; box-shadow: 0 0 0 4px rgba(240, 180, 90, 0.3);"></div>
                        </div>

                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; padding: 0 0.5rem;">
                            <div style="text-align: left;">
                                <div style="font-size: 0.75rem; color: #6366f1; font-weight: 600;">Started</div>
                                <div style="font-size: 0.7rem; color: #64748b;">3 years ago</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 0.875rem; color: #6366f1; font-weight: 700;">← FOR 3 YEARS →</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.75rem; color: #f0b45a; font-weight: 600;">NOW</div>
                                <div style="font-size: 0.7rem; color: #64748b;">Still happening</div>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #6366f1; font-weight: 600;">have been working</span> here <span style="color: #f0b45a; font-weight: 600;">for 3 years</span>.</p>
                        <p style="margin: 0.5rem 0 0 0; text-align: center; font-size: 0.875rem; color: #64748b;">The action started 3 years ago and is STILL happening now.</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Key Difference from Present Perfect",
                content: "Present Perfect = focuses on RESULT or EXPERIENCE. Present Perfect Continuous = focuses on DURATION or ONGOING ACTIVITY. Compare: 'I have read 3 books' (result) vs 'I have been reading all day' (duration).",
            },
            exercises: [
                {
                    id: "present-perfect-continuous-timeline-1",
                    title: "Practice: Duration Up to Now",
                    instructions: "Choose Present Perfect Continuous for actions that started in the past and continue to now (focus on how long).",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ here for two years." (still working now)',
                            options: [
                                { value: "have worked", label: "have worked" },
                                { value: "have been working", label: "have been working" },
                                { value: "worked", label: "worked" },
                            ],
                            expectedAnswer: "have been working",
                        },
                        {
                            type: "select",
                            label: "Choose the best time word: I have been waiting ___ 7 AM.",
                            options: ["since", "for", "yesterday"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "text",
                            label: "Complete: She ___ (study) all morning.",
                            expectedAnswer: "has been studying",
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
                <p>Present Perfect Continuous is formed with: <strong>have/has been + verb-ing</strong></p>

                <div style="margin-top: 1.5rem; background: rgba(99, 102, 241, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(99, 102, 241, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            I <span style="color: #6366f1; font-weight: 600;">have been working</span> double shifts this week.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            She <span style="color: #6366f1; font-weight: 600;">has been learning</span> English for two years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            They <span style="color: #6366f1; font-weight: 600;">have been waiting</span> since 8 AM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            We <span style="color: #6366f1; font-weight: 600;">have been trying</span> to fix the machine all morning.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            tipBox: {
                title: "💡 Have vs Has",
                content: "Use 'have been' with I, you, we, they. Use 'has been' with he, she, it.",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Complete with Present Perfect Continuous",
                    instructions: "Use have/has been + verb-ing to show ongoing duration.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (work) at this restaurant for six months.",
                            expectedAnswer: "have been working",
                        },
                        {
                            type: "text",
                            label: "She ___ (wait) for the bus since 7:30.",
                            expectedAnswer: "has been waiting",
                        },
                        {
                            type: "text",
                            label: "They ___ (live) in this apartment for two years.",
                            expectedAnswer: "have been living",
                        },
                        {
                            type: "text",
                            label: "He ___ (study) English since he moved here.",
                            expectedAnswer: "has been studying",
                        },
                        {
                            type: "text",
                            label: "We ___ (try) to reach you all morning.",
                            expectedAnswer: "have been trying",
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
                <p>Use <strong>have not been (haven't been)</strong> or <strong>has not been (hasn't been)</strong> + verb-ing.</p>

                <div style="margin-top: 1.5rem; background: rgba(99, 102, 241, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(99, 102, 241, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            I <span style="color: #6366f1; font-weight: 600;">haven't been sleeping</span> well lately.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            She <span style="color: #6366f1; font-weight: 600;">hasn't been feeling</span> well this week.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            They <span style="color: #6366f1; font-weight: 600;">haven't been coming</span> to work on time.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "haven't/hasn't been", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Make It Negative",
                    instructions: "Use haven't/hasn't been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not sleep) well because of the noise.",
                            expectedAnswer: "haven't been sleeping",
                        },
                        {
                            type: "text",
                            label: "She ___ (not eat) properly since she got sick.",
                            expectedAnswer: "hasn't been eating",
                        },
                        {
                            type: "text",
                            label: "They ___ (not practice) enough for the test.",
                            expectedAnswer: "haven't been practicing",
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
                <p>Put <strong>Have/Has</strong> at the beginning: Have/Has + subject + been + verb-ing?</p>

                <div style="margin-top: 1.5rem; background: rgba(99, 102, 241, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(99, 102, 241, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            <span style="color: #6366f1; font-weight: 600;">Have</span> you <span style="color: #6366f1; font-weight: 600;">been waiting</span> long?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            <span style="color: #6366f1; font-weight: 600;">Has</span> she <span style="color: #6366f1; font-weight: 600;">been working</span> here for a long time?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(99, 102, 241, 0.1);">
                            How long <span style="color: #6366f1; font-weight: 600;">have</span> they <span style="color: #6366f1; font-weight: 600;">been living</span> in this city?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Have/Has", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "been + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About Duration",
                    instructions: "Form questions with Have/Has + subject + been + verb-ing.",
                    items: [
                        {
                            type: "text",
                            label: "How long ___ you ___ (wait)?",
                            expectedAnswer: "have you been waiting",
                        },
                        {
                            type: "text",
                            label: "___ she ___ (work) here long?",
                            expectedAnswer: "Has she been working",
                        },
                        {
                            type: "text",
                            label: "What ___ they ___ (do) all morning?",
                            expectedAnswer: "have they been doing",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'work' with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ been working", expectedAnswer: "has" },
                        { type: "text", label: "Negative: She ___ been working", expectedAnswer: "hasn't" },
                        { type: "text", label: "Question: ___ she been working?", expectedAnswer: "Has" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "I have been work here for two years.", expectedAnswer: "I have been working here for two years" },
                        { type: "text", label: "She has being waiting since 9 AM.", expectedAnswer: "She has been waiting since 9 AM" },
                        { type: "text", label: "They have been study English for months.", expectedAnswer: "They have been studying English for months" },
                    ],
                },
            ],
        },

        // Common Mistakes Section
        {
            id: "common-mistakes",
            title: "Common Mistakes: Present Perfect vs Present Perfect Continuous",
            icon: "⚠️",
            explanation: `
                <h3>Don't Confuse These!</h3>
                <p>Both tenses connect past to present, but they focus on different things.</p>
            `,
            comparison: {
                title: "Present Perfect vs Present Perfect Continuous",
                leftLabel: "Present Perfect",
                rightLabel: "Present Perfect Continuous",
                rows: [
                    {
                        label: "Focus",
                        left: "RESULT or COMPLETION",
                        right: "DURATION or ONGOING ACTIVITY",
                    },
                    {
                        label: "Question",
                        left: "How many? How much?",
                        right: "How long?",
                    },
                    {
                        label: "Example",
                        left: "I have read 3 books this month. (result: 3 books)",
                        right: "I have been reading all day. (duration: all day)",
                    },
                    {
                        label: "Example",
                        left: "She has written 10 emails. (completed: 10 emails)",
                        right: "She has been writing emails all morning. (ongoing activity)",
                    },
                    {
                        label: "Example",
                        left: "They have painted the kitchen. (finished!)",
                        right: "They have been painting the kitchen. (still in progress)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Present Perfect or Present Perfect Continuous?",
                    instructions: "Choose the correct tense based on the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '"How many pages ___ you ___?" (asking about quantity)',
                            options: [
                                { value: "have been reading", label: "have you been reading" },
                                { value: "have read", label: "have you read" },
                            ],
                            expectedAnswer: "have read",
                        },
                        {
                            type: "radio",
                            label: '"How long ___ you ___?" (asking about duration)',
                            options: [
                                { value: "have been reading", label: "have you been reading" },
                                { value: "have read", label: "have you read" },
                            ],
                            expectedAnswer: "have been reading",
                        },
                        {
                            type: "radio",
                            label: '"I ___ three cups of coffee today." (counting)',
                            options: [
                                { value: "have been drinking", label: "have been drinking" },
                                { value: "have drunk", label: "have drunk" },
                            ],
                            expectedAnswer: "have drunk",
                        },
                        {
                            type: "radio",
                            label: '"I ___ coffee all morning." (ongoing activity)',
                            options: [
                                { value: "have been drinking", label: "have been drinking" },
                                { value: "have drunk", label: "have drunk" },
                            ],
                            expectedAnswer: "have been drinking",
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
                    <li><strong>When to Use:</strong> Duration of ongoing actions, recent activity with visible results, temporary situations</li>
                    <li><strong>Key Questions:</strong> "How long have you been...?" "Have you been...?"</li>
                    <li><strong>Positive:</strong> Subject + have/has been + verb-ing</li>
                    <li><strong>Negative:</strong> Subject + haven't/hasn't been + verb-ing</li>
                    <li><strong>Questions:</strong> Have/Has + subject + been + verb-ing?</li>
                    <li><strong>Time Words:</strong> for (duration), since (starting point), all day, all morning, lately, recently</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Present Perfect Continuous = HOW LONG. Present Perfect = HOW MANY/RESULT. Ask yourself: 'Am I focusing on duration or on the result?'",
            },
            exercises: [
                {
                    id: "present-perfect-continuous-summary-1",
                    title: "Practice: Key Points Check",
                    instructions: "Review the form and when to use Present Perfect Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "Which structure is correct?",
                            options: [
                                { value: "a", label: "have/has been + verb-ing" },
                                { value: "b", label: "had been + verb-ing" },
                                { value: "c", label: "will have been + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which question asks about duration?",
                            options: [
                                { value: "b", label: "Did you wait yesterday?" },
                                { value: "a", label: "How long have you been waiting?" },
                                { value: "c", label: "Will you wait tomorrow?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Choose the best sentence for a temporary situation.",
                            options: [
                                { value: "b", label: "I stay with my cousin every week." },
                                { value: "c", label: "I stayed with my cousin last week." },
                                { value: "a", label: "I have been staying with my cousin this week." },
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
                { value: "b", label: "I have been working here for 5 years." },
                { value: "a", label: "I have been work here for 5 years." },
                { value: "c", label: "I have working here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Present Perfect Continuous uses have/has been + verb-ing.",
            skillTag: "form-ppc-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct negative form.",
            options: [
                { value: "b", label: "She hasn't being sleeping well." },
                { value: "a", label: "She hasn't been sleeping well." },
                { value: "c", label: "She haven't been sleeping well." },
            ],
            correctAnswer: "a",
            explanation: "Negative form: hasn't been + verb-ing for she/he/it.",
            skillTag: "form-ppc-negative",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "Have you been wait long?" },
                { value: "c", label: "Are you been waiting long?" },
                { value: "a", label: "Have you been waiting long?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Have/Has + subject + been + verb-ing.",
            skillTag: "form-ppc-question",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "When do we use Present Perfect Continuous instead of Present Perfect?",
            options: [
                { value: "b", label: "When emphasizing duration or ongoing activity" },
                { value: "a", label: "When counting completed actions" },
                { value: "c", label: "When talking about finished past events with yesterday or last" },
            ],
            correctAnswer: "b",
            explanation: "Present Perfect Continuous focuses on duration/ongoing activity. Present Perfect focuses on result/completion.",
            skillTag: "contrast-result-vs-duration",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Choose the best answer: \"Your eyes are red. ___ you ___?\"",
            options: [
                { value: "a", label: "Have you cried" },
                { value: "b", label: "Have you been crying" },
                { value: "c", label: "Did you cry" },
            ],
            correctAnswer: "b",
            explanation: "Visible evidence (red eyes) plus recent activity is usually expressed with Present Perfect Continuous.",
            skillTag: "duration-recent-activity-evidence",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "What's the formula for Present Perfect Continuous?",
            options: [
                { value: "b", label: "have/has + past participle" },
                { value: "c", label: "was/were + verb-ing" },
                { value: "a", label: "have/has been + verb-ing" },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect Continuous = have/has been + verb-ing.",
            skillTag: "form-ppc-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Complete: \"I have been waiting ___ 7 AM.\"",
            options: [
                { value: "a", label: "since" },
                { value: "b", label: "for" },
                { value: "c", label: "at" },
            ],
            correctAnswer: "a",
            explanation: "Since + starting point (since 7 AM). For + duration (for three hours).",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Complete: \"She has been studying ___ two hours.\"",
            options: [
                { value: "b", label: "since" },
                { value: "a", label: "for" },
                { value: "c", label: "at" },
            ],
            correctAnswer: "a",
            explanation: "For + a length of time (for two hours).",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Which sentence shows a temporary ongoing situation?",
            options: [
                { value: "b", label: "She stayed with her cousin last week." },
                { value: "c", label: "She stays with her cousin every week." },
                { value: "a", label: "She has been staying with her cousin this week." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect Continuous often describes temporary situations happening around now.",
            skillTag: "duration-ongoing-temporary",
            difficulty: "easy",
        },
        {
            id: "quiz-10",
            question: "Which is correct for he/she/it?",
            options: [
                { value: "b", label: "He has been working hard." },
                { value: "a", label: "He have been working hard." },
                { value: "c", label: "He has been work hard." },
            ],
            correctAnswer: "b",
            explanation: "Use has been with he/she/it and verb-ing.",
            skillTag: "form-ppc-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which question asks about HOW LONG (duration)?",
            options: [
                { value: "b", label: "How many pages have you read?" },
                { value: "a", label: "How long have you been waiting?" },
                { value: "c", label: "Did you wait yesterday?" },
            ],
            correctAnswer: "a",
            explanation: "How long + have/has + been + verb-ing asks about duration.",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Compare: \"I have read 3 books\" vs \"I have been reading all day.\" What's the difference?",
            options: [
                { value: "b", label: "They mean exactly the same thing." },
                { value: "c", label: "First = future. Second = past." },
                { value: "a", label: "First = result/quantity. Second = duration/ongoing activity." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect focuses on result or quantity; Present Perfect Continuous focuses on duration or activity.",
            skillTag: "contrast-simple-vs-continuous-meaning",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Fix the error: \"They has been living here for 5 years.\"",
            options: [
                { value: "a", label: "They have been living here for 5 years." },
                { value: "b", label: "They has been live here for 5 years." },
                { value: "c", label: "They been living here for 5 years." },
            ],
            correctAnswer: "a",
            explanation: "With they, use have been + verb-ing.",
            skillTag: "form-ppc-positive",
            difficulty: "easy",
        },
        {
            id: "quiz-14",
            question: "Which sentence is NOT natural in Present Perfect Continuous?",
            options: [
                { value: "b", label: "I have known her for years." },
                { value: "a", label: "I have been knowing her for years." },
                { value: "c", label: "We have been working together for years." },
            ],
            correctAnswer: "a",
            explanation: "State verbs like know, like, love usually do not take continuous forms.",
            skillTag: "error-stative-verb-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "Which sentence correctly uses Present Perfect Continuous (not Present Perfect)?",
            options: [
                { value: "b", label: "I have drunk coffee all morning." },
                { value: "c", label: "I drank coffee all morning." },
                { value: "a", label: "I have been drinking coffee all morning." },
            ],
            correctAnswer: "a",
            explanation: "For an ongoing activity with duration (all morning), Present Perfect Continuous is the best choice.",
            skillTag: "duration-ongoing-temporary",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Present Perfect Continuous Mini Quiz

    Duration-focused skills:
    - duration-for-since-how-long
    - duration-ongoing-temporary
    - duration-recent-activity-evidence

    Form skills:
    - form-ppc-positive
    - form-ppc-negative
    - form-ppc-question

    Contrast skills:
    - contrast-result-vs-duration
    - contrast-simple-vs-continuous-meaning

    Common error patterns:
    - error-stative-verb-continuous

    Reteaching guidance:
    - If duration tags are weak → revisit the HOW LONG question and practice for vs since with timelines.
    - If form tags are weak → drill have/has been + verb-ing in positive, negative, and question forms (especially has vs have).
    - If contrast tags are weak → use side-by-side sentences (I have read 3 pages vs I have been reading for an hour) and ask: "Do we care about RESULT or DURATION?"
    - If stative-verb errors appear → create a no-continuous list (know, like, love, believe, understand) and substitute Present Perfect instead.
    */
};
