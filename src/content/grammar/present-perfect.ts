import type { InteractiveGuideContent } from "@/types/activity";

export const presentPerfectContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Present Perfect: Past Meets Right Now",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #6366f1; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Present Perfect <strong style="color: #c86b51;">connects your past experiences to right now</strong>: places you've been, things you've done, changes that happened and you can still see the results.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Experiences</strong> (no specific time): "I've walked along the East Boston Harborwalk three times this year."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Actions that continue</strong> to now: "She has worked at the community health center since 2021."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0.25rem;">✓ <strong>Recent actions with present results</strong>: "I've just submitted my housing renewal form."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #c86b51; font-size: 1.125rem;">have/has + past participle</span></p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Answering "How long have you lived here?" ("I've lived here for 6 months")</li>
                        <li>Talking about budgeting and bills ("I've saved $500 since January")</li>
                        <li>Describing changes that continue to now ("I've had this credit card for 2 years")</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Documenting workplace issues</strong> ("I've asked three times for a schedule change")</li>
                        <li><strong>Talking about health history</strong> ("I've had this pain for two weeks")</li>
                        <li><strong>Review:</strong> Telling coherent stories with all tenses</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">⏱️ Present Perfect connects your past to right now - it shows what's still relevant!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-intro-pp-1",
                    title: "Practice: Does This Connect to Now?",
                    instructions: "Read each sentence and identify which tense fits best based on whether it connects to now.",
                    items: [
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-helper\'>have</span> just <span class=\'eg-verb\'>updated</span> the community calendar, so everyone knows the meeting time."',
                            options: [
                                { value: "past-simple", label: "Past Simple - finished action with specific time" },
                                { value: "present-perfect", label: "Present Perfect - recent action with present result" },
                                { value: "present-simple", label: "Present Simple - current habit or routine" },
                            ],
                            expectedAnswer: "present-perfect",
                        },
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-verb\'>visited</span> the ICA last Saturday."',
                            options: [
                                { value: "present-perfect", label: "Present Perfect - experience connected to now" },
                                { value: "present-simple", label: "Present Simple - current habit" },
                                { value: "past-simple", label: "Past Simple - finished action with specific time (last Saturday)" },
                            ],
                            expectedAnswer: "past-simple",
                        },
                        {
                            type: "radio",
                            label: '"We <span class=\'eg-helper\'>have</span> <span class=\'eg-verb\'>lived</span> on this block since 2020."',
                            options: [
                                { value: "present-perfect", label: "Present Perfect - started in past, continues now" },
                                { value: "past-simple", label: "Past Simple - finished action in the past" },
                                { value: "present-simple", label: "Present Simple - current situation only" },
                            ],
                            expectedAnswer: "present-perfect",
                        },
                        {
                            type: "radio",
                            label: '"She <span class=\'eg-helper\'>has</span> never <span class=\'eg-verb\'>ridden</span> the new ferry, but she <span class=\'eg-helper\'>has</span> <span class=\'eg-verb\'>driven</span> the same bus route 100 times."',
                            options: [
                                { value: "past-simple", label: "Past Simple - specific past actions" },
                                { value: "present-perfect", label: "Present Perfect - life experiences up to now" },
                                { value: "present-simple", label: "Present Simple - current habits" },
                            ],
                            expectedAnswer: "present-perfect",
                        },
                    ],
                },
            ],
        },

        // Meaning & Usage Section
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Do We Use Present Perfect?",
            icon: "⭐",
            explanation: `
                <p><strong>The key question:</strong> "Is this connected to NOW?"</p>
                <p>If YES → use Present Perfect! ✓</p>
            `,
            usageMeanings: [
                {
                    title: "🌍 1. Life Experiences",
                    description: "Things you've done at some point in life (no exact time given)",
                    examples: [
                        {
                            sentence: "I <strong>have explored</strong> three different neighborhoods around Boston this year.",
                            explanation: "✓ Experience without a specific date",
                        },
                        {
                            sentence: "She <strong>has never visited</strong> the waterfront farmers' market, but she <strong>has cooked</strong> for 100 neighbors.",
                            explanation: "✓ 'Never' shows zero experience up to now",
                        },
                    ],
                },
                {
                    title: "⏰ 2. Actions That Continue NOW",
                    description: "Started before now and still true (use 'for' or 'since')",
                    examples: [
                        {
                            sentence: "I <strong>have worked</strong> at the community health center <strong>since 2019</strong>.",
                            explanation: "✓ Started in 2019 and still working there",
                        },
                        {
                            sentence: "He <strong>has taken</strong> the same bus route <strong>for five years</strong>.",
                            explanation: "✓ Duration that reaches now",
                        },
                    ],
                },
                {
                    title: "🆕 3. Recent Actions",
                    description: "Just happened and we see the result now (use 'just', 'already', 'yet')",
                    examples: [
                        {
                            sentence: "I <strong>have just submitted</strong> my housing renewal form.",
                            explanation: "✓ Result is visible now",
                        },
                        {
                            sentence: "She <strong>has already shared</strong> the meeting notes with the team.",
                            explanation: "✓ Done earlier than expected",
                        },
                    ],
                },
                {
                    title: "🔢 4. Multiple Times",
                    description: "Repeated actions up to now",
                    examples: [
                        {
                            sentence: "I <strong>have taken</strong> the same volunteer shift <strong>five times</strong> this month and still have energy.",
                            explanation: "✓ Many times in the current time period",
                        },
                    ],
                },
                {
                    title: "➡️ 5. Past Action → Present Result",
                    description: "Something happened → we see the result NOW",
                    examples: [
                        {
                            sentence: "I <strong>have lost</strong> my work badge again—now I can't get on site.",
                            explanation: "PAST: lost badge → NOW: can't enter",
                        },
                        {
                            sentence: "Someone <strong>has eaten</strong> the team lunch, so there's nothing left for the meeting.",
                            explanation: "PAST: ate the lunch → NOW: no food",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Ask yourself: 'Is this connected to NOW?' If YES → Present Perfect!",
            },
            exercises: [
                {
                    id: "ex-meaning-1",
                    title: "Practice: Why Do We Use Present Perfect Here?",
                    instructions:
                        "Read each sentence and choose why we use Present Perfect. Think about the meaning!",
                    items: [
                        {
                            type: "radio",
                            label: '1. "I <span class=\'eg-helper\'>have</span> <span class=\'eg-verb\'>visited</span> three neighborhoods this year."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience (no specific time)",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action (continues to now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "life-experience",
                        },
                        {
                            type: "radio",
                            label: '2. "I <span class=\'eg-helper\'>have</span> <span class=\'eg-verb\'>worked</span> at the community kitchen for 5 years."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action (started in past, continues to now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "unfinished",
                        },
                        {
                            type: "radio",
                            label: '3. "I <span class=\'eg-helper\'>have</span> just <span class=\'eg-verb\'>shared</span> the meeting notes."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "unfinished",
                                    label: "Unfinished action",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action (just now)",
                                },
                            ],
                            expectedAnswer: "recent",
                        },
                        {
                            type: "radio",
                            label: '4. "I <span class=\'eg-helper\'>have</span> <span class=\'eg-verb\'>lost</span> my bus pass."',
                            options: [
                                {
                                    value: "life-experience",
                                    label: "Life experience",
                                },
                                {
                                    value: "present-result",
                                    label: "Past action with present result (can't ride the bus now)",
                                },
                                {
                                    value: "recent",
                                    label: "Recent action",
                                },
                            ],
                            expectedAnswer: "present-result",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization Section
        {
            id: "timeline-visualization",
            stepNumber: 2,
            title: "Timeline: Past → Present Connection",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Connection</h3>
                <p>Present Perfect is all about how a <strong>past action</strong> connects to the <strong>present moment</strong>. Let's see it visually:</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Past Action → Present Connection</h4>

                    <div style="display: flex; align-items: center; justify-content: space-between; position: relative; margin: 2rem 0; padding: 0 2rem;">
                        <div style="position: absolute; top: 50%; left: 15%; right: 15%; height: 4px; background: linear-gradient(to right, #6366f1, #8b5cf6); transform: translateY(-50%); z-index: 0;">
                            <div style="position: absolute; right: -8px; top: -6px; width: 0; height: 0; border-left: 10px solid #8b5cf6; border-top: 7px solid transparent; border-bottom: 7px solid transparent;"></div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center; flex: 1;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); margin: 0 auto;">
                                PAST
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #6366f1;">Past Action</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Lost keys</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center; flex: 1;">
                            <div style="width: 110px; height: 110px; border-radius: 50%; background: #8b5cf6; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 5px solid white; box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4); margin: 0 auto;">
                                <div>NOW</div>
                                <div style="font-size: 0.75rem; font-weight: 500; margin-top: 0.25rem;">Present Result</div>
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #8b5cf6;">Still Can't Find Them</div>
                        </div>
                    </div>

                    <div style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #6366f1; font-weight: 600;">have lost</span> my keys → <span style="color: #8b5cf6; font-weight: 600;">I can't open the door NOW</span></p>
                    </div>

                    <div style="margin-top: 1rem; padding: 1rem; background: #fef9f3; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        <p style="margin: 0; font-size: 0.875rem;"><strong>📍 Key Idea:</strong> The past action creates a situation that exists NOW. The exact time doesn't matter—what matters is the present connection!</p>
                    </div>
                </div>

                <h3>More Visual Examples</h3>
                <div style="margin: 1rem 0;">
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0;"><strong>Example 1:</strong> She <span style="color: #6366f1; font-weight: 600;">has broken</span> her arm (past) → <span style="color: #8b5cf6; font-weight: 600;">She can't write NOW</span> (present result)</p>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0;"><strong>Example 2:</strong> They <span style="color: #6366f1; font-weight: 600;">have moved</span> to this block (past) → <span style="color: #8b5cf6; font-weight: 600;">They live here NOW</span> (present state)</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Why This Matters",
                content: "Present Perfect is unique because it CONNECTS past to present. Unlike Past Simple (which is just 'finished and done'), Present Perfect shows how the past still affects NOW.",
            },
            exercises: [
                {
                    id: "ex-timeline-pp-1",
                    title: "Practice: Identify the Present Connection",
                    instructions: "For each Present Perfect sentence, identify the present result/relevance.",
                    items: [
                        {
                            type: "radio",
                            label: "I have lost my wallet.",
                            options: [
                                { value: "b", label: "I lost it yesterday" },
                                { value: "c", label: "I will find it tomorrow" },
                                { value: "a", label: "I can't pay for lunch NOW" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "She has broken her arm.",
                            options: [
                                { value: "b", label: "She can't write NOW" },
                                { value: "a", label: "She broke it last week" },
                                { value: "c", label: "She will heal soon" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "They have moved to this block.",
                            options: [
                                { value: "a", label: "They moved last month" },
                                { value: "c", label: "They live on this block NOW" },
                                { value: "b", label: "They will live on this block" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
        },

        // Past Participle Section
        {
            id: "past-participle",
            title: "Understanding Past Participles",
            icon: "📝",
            explanation: `
                <h3>What is a Past Participle?</h3>
                <p>The past participle is the special form of the verb we use with Present Perfect. For regular verbs, it's the same as the past simple (add -ed). For irregular verbs, you need to memorize them!</p>
            `,
            verbTable: {
                title: "Common Irregular Past Participles",
                headers: ["Infinitive", "Past Simple", "Past Participle"],
                rows: [
                    ["be", "was/were", "been"],
                    ["do", "did", "done"],
                    ["go", "went", "gone"],
                    ["see", "saw", "seen"],
                    ["eat", "ate", "eaten"],
                    ["take", "took", "taken"],
                    ["write", "wrote", "written"],
                    ["speak", "spoke", "spoken"],
                    ["break", "broke", "broken"],
                    ["know", "knew", "known"],
                    ["give", "gave", "given"],
                    ["make", "made", "made"],
                    ["have", "had", "had"],
                    ["leave", "left", "left"],
                    ["lose", "lost", "lost"],
                ],
            },
            tipBox: {
                title: "💡 Remember",
                content:
                    "Regular verbs: add -ed (work → worked, play → played). Irregular verbs: memorize them! There are about 200 common irregular verbs in English.",
            },
            exercises: [
                {
                    id: "ex-past-participle-1",
                    title: "📝 Practice: Complete the Past Participles",
                    instructions: "Fill in the missing past participle forms. Use the table above to help you!",
                    items: [
                        {
                            type: "text",
                            label: "be → was/were → ___",
                            expectedAnswer: "been",
                        },
                        {
                            type: "text",
                            label: "go → went → ___",
                            expectedAnswer: "gone",
                        },
                        {
                            type: "text",
                            label: "see → saw → ___",
                            expectedAnswer: "seen",
                        },
                        {
                            type: "text",
                            label: "eat → ate → ___",
                            expectedAnswer: "eaten",
                        },
                        {
                            type: "text",
                            label: "write → wrote → ___",
                            expectedAnswer: "written",
                        },
                    ],
                },
                {
                    id: "ex-past-participle-2",
                    title: "✓ Quick Check: Understanding",
                    instructions: "Answer these questions about past participles.",
                    items: [
                        {
                            type: "radio",
                            label: "What do we use past participles for?",
                            options: [
                                { value: "b", label: "To talk about yesterday" },
                                { value: "c", label: "To make questions only" },
                                { value: "a", label: "To form Present Perfect tense" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "How do you make the past participle of regular verbs?",
                            options: [
                                { value: "b", label: "Add -ed" },
                                { value: "a", label: "Add -ing" },
                                { value: "c", label: "No change" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which is an irregular past participle?",
                            options: [
                                { value: "a", label: "worked" },
                                { value: "c", label: "eaten" },
                                { value: "b", label: "played" },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
            ],
        },

        // Present Perfect vs Past Simple
        {
            id: "present-perfect-vs-past-simple",
            title: "Present Perfect vs. Past Simple",
            icon: "⚖️",
            explanation: `
                <h3>What's the Difference?</h3>
                <p>This is one of the most confusing parts for English learners! Both tenses talk about the past, but they have different meanings.</p>
            `,
            comparison: {
                title: "Side-by-Side Comparison",
                leftLabel: "Present Perfect",
                rightLabel: "Past Simple",
                rows: [
                    {
                        label: "Time Focus",
                        left: "Connects past to PRESENT - time is NOT specific",
                        right: "Finished action in the PAST - time IS specific",
                    },
                    {
                        label: "Time Words",
                        left: "ever, never, already, yet, just, still, for, since",
                        right: "yesterday, last week, in 2020, ago, when I was young",
                    },
                    {
                        label: "Example",
                        left: "I have attended the neighborhood listening session. (Sometime in my life - when is not important)",
                        right: "I attended the neighborhood listening session last Monday. (Specific time - finished action)",
                    },
                    {
                        label: "Example",
                        left: "She has lived here for 5 years. (Started in past, STILL lives here now)",
                        right: "She lived here for 5 years. (Doesn't live here anymore - finished)",
                    },
                    {
                        label: "Example",
                        left: "Have you seen this movie? (Ever in your life?)",
                        right: "Did you see this movie last night? (Specific time)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Present Perfect or Past Simple?",
                    instructions: "Choose the correct tense based on the meaning.",
                    items: [
                        {
                            type: "radio",
                            label: '1. I ___ to three neighborhood job fairs this year.',
                            options: [
                                { value: "have-attended", label: "have attended" },
                                { value: "went", label: "went" },
                            ],
                            expectedAnswer: "have-attended",
                        },
                        {
                            type: "radio",
                            label: "I ___ to the shelter event last weekend.",
                            options: [
                                { value: "have-attended", label: "have attended" },
                                { value: "went", label: "went" },
                            ],
                            expectedAnswer: "went",
                        },
                        {
                            type: "radio",
                            label: "She ___ in this city for 10 years. (She still lives here.)",
                            options: [
                                { value: "has-lived", label: "has lived" },
                                { value: "lived", label: "lived" },
                            ],
                            expectedAnswer: "has-lived",
                        },
                        {
                            type: "radio",
                            label: "She ___ in this city for 10 years. (She doesn't live here now.)",
                            options: [
                                { value: "has-lived", label: "has lived" },
                                { value: "lived", label: "lived" },
                            ],
                            expectedAnswer: "lived",
                        },
                    ],
                },
            ],
        },

        // STEP 1: Positive Form
        {
            id: "step-1-positive",
            stepNumber: 1,
            title: "How to Form Present Perfect (Positive)",
            explanation: `
                <h3>The Formula</h3>
                <p>Present Perfect is formed with: <strong>have/has + past participle</strong></p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">have finished</span> my homework.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">has been</span> to the waterfront art fair.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">have lived</span> here for 5 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            He <span style="color: #f59e0b; font-weight: 600;">has seen</span> that movie.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">have studied</span> English.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Use 'have' with I, you, we, they. Use 'has' with he, she, it.",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Forming Present Perfect",
                    instructions:
                        "Complete each sentence with the correct form of Present Perfect. Use 'have/has' + the past participle.",
                    items: [
                        {
                            type: "text",
                            label: "The museum ___ (win) several international awards for its architecture.",
                            expectedAnswer: "has won",
                        },
                        {
                            type: "text",
                            label: "My grandparents ___ (own) this house since 1985.",
                            expectedAnswer: "have owned",
                        },
                        {
                            type: "text",
                            label: "We ___ (adopt) three rescue animals over the years.",
                            expectedAnswer: "have adopted",
                        },
                        {
                            type: "text",
                            label: "She ___ (climb) Mount Everest—it's on her bucket list.",
                            expectedAnswer: "has climbed",
                        },
                        {
                            type: "text",
                            label: "The neighbors ___ (plant) a cherry tree that blooms beautifully every spring.",
                            expectedAnswer: "have planted",
                        },
                    ],
                },
                {
                    id: "ex-positive-1b",
                    title: "Exercise 1b: More Practice (Bonus)",
                    instructions:
                        "Complete these sentences with Present Perfect. Remember to use the past participle!",
                    items: [
                        {
                            type: "text",
                            label: "The local bakery ___ (serve) fresh croissants since it opened in 2015.",
                            expectedAnswer: "has served",
                        },
                        {
                            type: "text",
                            label: "My son ___ (break) his arm twice playing football.",
                            expectedAnswer: "has broken",
                        },
                        {
                            type: "text",
                            label: "We ___ (volunteer) at the animal shelter for several months now.",
                            expectedAnswer: "have volunteered",
                        },
                    ],
                },
            ],
        },

        // STEP 2: Negative Form
        {
            id: "step-2-negative",
            stepNumber: 2,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>To make Present Perfect negative, add <strong>'not'</strong> after 'have/has':</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">have not</span> (haven't) <span style="color: #f59e0b; font-weight: 600;">finished</span> my homework.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">has not</span> (hasn't) <span style="color: #f59e0b; font-weight: 600;">been</span> to the waterfront art fair.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            They <span style="color: #f59e0b; font-weight: 600;">have not</span> (haven't) <span style="color: #f59e0b; font-weight: 600;">seen</span> that movie.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "have/has", type: "verb" },
                { text: "+", type: "other" },
                { text: "not", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Short Forms",
                content:
                    "We usually use contractions: haven't = have not, hasn't = has not",
            },
            exercises: [
                {
                    id: "ex-negative-2",
                    title: "Exercise 2: Negative Sentences",
                    instructions: "Make these sentences negative. Use haven't or hasn't.",
                    items: [
                        {
                            type: "text",
                            label: "The city ___ (not repair) the potholes on our street yet.",
                            expectedAnswer: "hasn't repaired",
                        },
                        {
                            type: "text",
                            label: "My daughter ___ (not decide) which university to attend.",
                            expectedAnswer: "hasn't decided",
                        },
                        {
                            type: "text",
                            label: "We ___ (not hear) back from the insurance company.",
                            expectedAnswer: "haven't heard",
                        },
                        {
                            type: "text",
                            label: "The landlord ___ (not fix) the heating system yet.",
                            expectedAnswer: "hasn't fixed",
                        },
                        {
                            type: "text",
                            label: "They ___ (not announce) the winner of the competition.",
                            expectedAnswer: "haven't announced",
                        },
                    ],
                },
            ],
        },

        // STEP 3: Question Form
        {
            id: "step-3-questions",
            stepNumber: 3,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>To make questions, put <strong>'Have/Has'</strong> before the subject:</p>

                <div style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(245, 158, 11, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Have</span> you <span style="color: #f59e0b; font-weight: 600;">finished</span> your homework?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Has</span> she <span style="color: #f59e0b; font-weight: 600;">been</span> to the new community garden?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Have</span> they <span style="color: #f59e0b; font-weight: 600;">seen</span> that movie?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(245, 158, 11, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Has</span> he <span style="color: #f59e0b; font-weight: 600;">eaten</span> lunch?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Have/Has", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-3",
                    title: "Exercise 3: Making Questions",
                    instructions:
                        "Write questions in Present Perfect. Start with Have or Has.",
                    items: [
                        {
                            type: "text",
                            label: "___ the plumber (arrive) to fix the leak?",
                            expectedAnswer: "Has the plumber arrived",
                        },
                        {
                            type: "text",
                            label: "___ your parents (celebrate) their golden anniversary yet?",
                            expectedAnswer: "Have your parents celebrated",
                        },
                        {
                            type: "text",
                            label: "___ the neighbors (complain) about the noise?",
                            expectedAnswer: "Have the neighbors complained",
                        },
                        {
                            type: "text",
                            label: "___ she ever (ride) a motorcycle?",
                            expectedAnswer: "Has she ever ridden",
                        },
                        {
                            type: "text",
                            label: "___ you (donate) to any charities this year?",
                            expectedAnswer: "Have you donated",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (For vs Since)
        {
            id: "time-for-since",
            title: "For vs Since",
            icon: "⏳",
            explanation: `
                <h3>Talking About Time</h3>
                <p>Use <strong>for</strong> to show a duration and <strong>since</strong> to show the starting point.</p>
                <p><strong>Placement:</strong> usually after the verb phrase: "have/has + past participle + for/since + time".</p>
                <p><strong>Sentence types:</strong> works in affirmatives, negatives, and questions.</p>
            `,
            timeExpressions: [
                {
                    word: "For",
                    usage: "Duration of time (for 5 years, for a week, for a long time)",
                    examples: [
                        "I have studied English for 3 years.",
                        "They have been friends for a long time.",
                    ],
                },
                {
                    word: "Since",
                    usage: "Starting point in time (since 2020, since Monday, since I was a child)",
                    examples: [
                        "I have lived here since 2020.",
                        "She has worked here since Monday.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-for-since-1",
                    title: "Practice: For or Since?",
                    instructions: "Choose 'for' or 'since' for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "I have lived here ___ 5 years.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "I have lived here ___ 2020.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "She has worked here ___ last Monday.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "They have been friends ___ a long time.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "I have studied English ___ I was 10 years old.",
                            options: ["Choose...", "for", "since"],
                            expectedAnswer: "since",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (Already / Just / Yet / Still)
        {
            id: "time-already-just-yet",
            title: "Already, Just, Yet, or Still?",
            icon: "⏰",
            explanation: `
                <h3>Time Words: Already, Just, Yet, Still</h3>
                <p>These four words help you express timing and expectations with Present Perfect. Each one has a specific meaning and placement in the sentence.</p>
            `,
            verbTable: {
                title: "Quick Reference Guide",
                headers: ["Word", "Meaning", "Placement in Sentence", "Used In"],
                rows: [
                    ["already", "Earlier than expected; sooner than you thought", "Between have/has and past participle → I have already finished", "✓ Positive statements\n✓ Sometimes questions"],
                    ["just", "A moment ago; very recently", "Between have/has and past participle → She has just arrived", "✓ Positive statements"],
                    ["yet", "Expected to happen but hasn't (or asking if it happened)", "At the end of the sentence → I haven't eaten yet / Have you finished yet?", "✓ Questions\n✓ Negatives"],
                    ["still", "Continues to not happen; emphasizes the ongoing negative", "Before haven't/hasn't → I still haven't finished", "✓ Negatives only\n(emphasizes frustration)"],
                ],
            },
            timeExpressions: [
                {
                    word: "Already",
                    usage: "Happened sooner than expected (positive sentences)",
                    examples: [
                        "I have already finished my homework.",
                        "She has already eaten lunch.",
                    ],
                },
                {
                    word: "Just",
                    usage: "Very recently - a short time ago",
                    examples: [
                        "I have just arrived home.",
                        "He has just started the test.",
                    ],
                },
                {
                    word: "Yet",
                    usage: "Expected to happen but hasn't (questions and negatives)",
                    examples: [
                        "Have you finished yet?",
                        "I haven't eaten lunch yet.",
                    ],
                },
                {
                    word: "Still",
                    usage: "Emphasizes that something continues to not happen (used with negatives)",
                    examples: [
                        "I still haven't finished my Christmas shopping.",
                        "She still hasn't called me back.",
                        "They still haven't decided where to go.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-already-just-yet-1",
                    title: "Choose: already / just / yet / still",
                    instructions: "Select the best time word for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "I have ___ finished my homework.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "already",
                        },
                        {
                            type: "select",
                            label: "She hasn't eaten lunch ___.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "yet",
                        },
                        {
                            type: "select",
                            label: "We have ___ arrived, so we can start.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "just",
                        },
                        {
                            type: "select",
                            label: "Have you finished your project ___?",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "yet",
                        },
                        {
                            type: "select",
                            label: "He has ___ taken the test and is waiting outside.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "already",
                        },
                        {
                            type: "select",
                            label: "I ___ haven't finished my Christmas shopping.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "still",
                        },
                        {
                            type: "select",
                            label: "She ___ hasn't called me back about the job.",
                            options: ["Choose...", "already", "just", "yet", "still"],
                            expectedAnswer: "still",
                        },
                    ],
                },
            ],
        },

        // Time Expressions (Ever / Never)
        {
            id: "time-ever-never",
            title: "Ever vs Never",
            icon: "🌟",
            explanation: `
                <h3>Life Experiences</h3>
                <p><strong>Ever</strong> = at any time in your life (usually in questions). <strong>Never</strong> = not at any time.</p>
                <p><strong>Placement:</strong> "ever/never" go between have/has and the past participle (Have you <strong>ever been</strong>… / I have <strong>never seen</strong>…).</p>
                <p><strong>Sentence types:</strong> "ever" mainly in questions; "never" in affirmative structure but negative meaning.</p>
            `,
            timeExpressions: [
                {
                    word: "Ever",
                    usage: "In your life up to now (usually in questions)",
                    examples: [
                        "Have you ever been to the High Line?",
                        "Have you ever tried the new community cafe?",
                    ],
                },
                {
                    word: "Never",
                    usage: "Not at any time in your life",
                    examples: [
                        "I have never seen the sunrise from the rooftop garden.",
                        "She has never missed a neighborhood meeting.",
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-time-ever-never-1",
                    title: "Choose: ever / never",
                    instructions: "Pick the correct word to complete each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "Have you ___ visited the High Line?",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "ever",
                        },
                        {
                            type: "select",
                            label: "I have ___ missed the 6 AM bus.",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "never",
                        },
                        {
                            type: "select",
                            label: "Has she ___ tried the community cafe?",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "ever",
                        },
                        {
                            type: "select",
                            label: "They have ___ seen the mural on 23rd Street.",
                            options: ["Choose...", "ever", "never"],
                            expectedAnswer: "never",
                        },
                    ],
                },
            ],
        },

        // STEP 4: Mixed Practice with Word Scrambles
        {
            id: "step-4-mixed",
            stepNumber: 4,
            title: "Mixed Practice: All Forms Together",
            explanation: `
                <h3>Put It All Together!</h3>
                <p>Now let's practice positive, negative, and question forms. Pay attention to the meaning!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-4a",
                    title: "Exercise 4a: Word Scramble",
                    instructions:
                        "Put the words in the correct order to make Present Perfect sentences.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["I", "have", "visited", "many", "neighborhoods"],
                            correctAnswer: "I have visited many neighborhoods",
                            hint: "Life experience - where you've been",
                        },
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["She", "has", "lived", "here", "for", "5", "years"],
                            correctAnswer: "She has lived here for 5 years",
                            hint: "Unfinished action - started in past, continues to now",
                        },
                        {
                            type: "word-scramble",
                            label: "Make a question:",
                            words: ["Have", "you", "ever", "taken", "the", "Blue", "Line", "to", "Aquarium", "?"],
                            correctAnswer: "Have you ever taken the Blue Line to Aquarium?",
                            hint: "Question about life experience",
                        },
                    ],
                },
                {
                    id: "ex-mixed-4b",
                    title: "Exercise 4b: Complete Practice",
                    instructions:
                        "Choose the correct form (positive, negative, or question).",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (see) that movie three times. (positive)",
                            expectedAnswer: "have seen",
                        },
                        {
                            type: "text",
                            label: "She ___ (not finish) her work yet. (negative)",
                            expectedAnswer: "hasn't finished",
                        },
                        {
                            type: "text",
                            label: "___ they ___ (be) to the community garden? (question)",
                            expectedAnswer: "Have they been",
                        },
                    ],
                },
            ],
        },

        // Summary Section
        {
            id: "summary",
            title: "Summary: Key Points to Remember",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Form:</strong> Present Perfect = <strong>have/has + past participle</strong></li>
                    <li><strong>Meaning:</strong> Connects the PAST to the PRESENT (not finished, or important now)</li>
                    <li><strong>5 Main Uses:</strong>
                        <ol class="list-decimal pl-6 mt-2">
                            <li>Life experiences (no specific time)</li>
                            <li>Unfinished actions (started in past, continue to now)</li>
                            <li>Recent actions (just, already, yet)</li>
                            <li>Multiple times in life</li>
                            <li>Past actions with present results</li>
                        </ol>
                    </li>
                    <li><strong>Time Expressions:</strong> for, since, already, yet, just, still, ever, never</li>
                    <li><strong>Negative:</strong> haven't/hasn't + past participle</li>
                    <li><strong>Questions:</strong> Have/Has + subject + past participle?</li>
                    <li><strong>vs Past Simple:</strong> Present Perfect = connection to NOW. Past Simple = finished action with specific time.</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Final Tip",
                content:
                    "Always ask yourself: 'Is this connected to the present?' If yes, use Present Perfect!",
            },
            exercises: [
                {
                    id: "pp-summary-1",
                    title: "Quick Review: Present Perfect or Past Simple?",
                    instructions: "Choose the best tense for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I _______ my keys. (I can't find them now.)",
                            options: [
                                { value: "pp", label: "Present Perfect: have lost" },
                                { value: "ps", label: "Past Simple: lost" },
                            ],
                            expectedAnswer: "pp",
                        },
                        {
                            type: "radio",
                            label: "I _______ my keys yesterday. (finished past time)",
                            options: [
                                { value: "pp", label: "Present Perfect: have lost" },
                                { value: "ps", label: "Past Simple: lost" },
                            ],
                            expectedAnswer: "ps",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz for comprehension
    miniQuiz: [
        // 1. result-completed-action (easy)
        {
            id: "ppq-1",
            skillTag: "result-completed-action",
            difficulty: "easy",
            question: "Choose the correct sentence to show a completed action with a present result.",
            options: [
                { value: "b", label: "I lock the door, so the office is safe now." },
                { value: "c", label: "I locked the door yesterday, so the office is safe now." },
                { value: "a", label: "I have locked the door, so the office is safe now." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect connects the past action to a present result. Past Simple with 'yesterday' is not correct here."
        },
        // 2. result-life-experience-ever-never (easy)
        {
            id: "ppq-2",
            skillTag: "result-life-experience-ever-never",
            difficulty: "easy",
            question: "Which question correctly asks about life experience?",
            options: [
                { value: "b", label: "Have you ever visited the new library?" },
                { value: "a", label: "Did you ever visit the new library?" },
                { value: "c", label: "Do you ever visited the new library?" },
            ],
            correctAnswer: "b",
            explanation: "'Have you ever...' is the correct Present Perfect question for life experience."
        },
        // 3. result-recent-completion-just-already-yet (easy)
        {
            id: "ppq-3",
            skillTag: "result-recent-completion-just-already-yet",
            difficulty: "easy",
            question: "Complete the sentence: 'She ___ finished her application.'",
            options: [
                { value: "b", label: "just has" },
                { value: "a", label: "has just" },
                { value: "c", label: "has justed" },
            ],
            correctAnswer: "a",
            explanation: "'Just' goes between 'has' and the past participle in Present Perfect."
        },
        // 4. result-state-verb-duration (easy)
        {
            id: "ppq-4",
            skillTag: "result-state-verb-duration",
            difficulty: "easy",
            question: "Choose the correct sentence to show a state that started in the past and continues now.",
            options: [
                { value: "b", label: "I knew Maria for three years." },
                { value: "c", label: "I know Maria since three years." },
                { value: "a", label: "I have known Maria for three years." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect is used for state verbs (like 'know') with duration up to now."
        },
        // 5. result-count-how-many (easy)
        {
            id: "ppq-5",
            skillTag: "result-count-how-many",
            difficulty: "easy",
            question: "Fill in the blank: 'We ___ taken the English test twice this year.'",
            options: [
                { value: "a", label: "have" },
                { value: "b", label: "has" },
                { value: "c", label: "did" }
            ],
            correctAnswer: "a",
            explanation: "Use 'have' with 'we' for Present Perfect. 'Twice this year' means up to now."
        },
        // 6. duration-for-since-how-long (easy)
        {
            id: "ppq-6",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
            question: "Which word completes the sentence? 'She has lived here ___ 2019.'",
            options: [
                { value: "b", label: "for" },
                { value: "a", label: "since" },
                { value: "c", label: "from" },
            ],
            correctAnswer: "a",
            explanation: "'Since' + starting point (2019); 'for' needs a length of time."
        },
        // 7. error-specific-past-time (medium)
        {
            id: "ppq-7",
            skillTag: "error-specific-past-time",
            difficulty: "medium",
            question: "Find the error: 'I have seen that movie last Friday.'",
            options: [
                { value: "a", label: "Correct" },
                { value: "c", label: "Missing 'the' before movie" },
                { value: "b", label: "Wrong tense: 'saw' should be used with 'last Friday'" },
            ],
            correctAnswer: "b",
            explanation: "Specific past times (like 'last Friday') require Past Simple: 'I saw that movie last Friday.'"
        },
        // 8. error-already-placement (medium)
        {
            id: "ppq-8",
            skillTag: "error-already-placement",
            difficulty: "medium",
            question: "Which is correct?",
            options: [
                { value: "a", label: "I have already finished my homework." },
                { value: "b", label: "I already have finished my homework." },
                { value: "c", label: "I have finished already my homework." }
            ],
            correctAnswer: "a",
            explanation: "'Already' comes between 'have' and the past participle in Present Perfect."
        },
        // 9. error-still-negative (medium)
        {
            id: "ppq-9",
            skillTag: "error-still-negative",
            difficulty: "medium",
            question: "Choose the correct sentence with 'still' and Present Perfect negative.",
            options: [
                { value: "b", label: "I haven't still received my paycheck." },
                { value: "a", label: "I still haven't received my paycheck." },
                { value: "c", label: "I didn't still receive my paycheck." },
            ],
            correctAnswer: "a",
            explanation: "'Still' goes before 'haven't/hasn't' in Present Perfect negative."
        },
        // 10. error-yet-negative-question (easy)
        {
            id: "ppq-10",
            skillTag: "error-yet-negative-question",
            difficulty: "easy",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "Did you finished your homework yet?" },
                { value: "c", label: "Have you yet finished your homework?" },
                { value: "a", label: "Have you finished your homework yet?" },
            ],
            correctAnswer: "a",
            explanation: "'Yet' goes at the end in Present Perfect questions."
        },
        // 11. contrast-present-perfect-vs-past-simple (medium)
        {
            id: "ppq-11",
            skillTag: "contrast-present-perfect-vs-past-simple",
            difficulty: "medium",
            question: "Choose the sentence that shows an experience with no finished time.",
            options: [
                { value: "a", label: "I have visited the Science Museum several times." },
                { value: "b", label: "I visited the Science Museum last month." },
                { value: "c", label: "I have visited the Science Museum last month." }
            ],
            correctAnswer: "a",
            explanation: "Present Perfect is used for experiences with no specific finished time."
        },
        // 12. result-recent-completion-just-already-yet (easy)
        {
            id: "ppq-12",
            skillTag: "result-recent-completion-just-already-yet",
            difficulty: "easy",
            question: "Fill in the blank: 'They haven't called me ___. (I am still waiting)'",
            options: [
                { value: "b", label: "already" },
                { value: "a", label: "yet" },
                { value: "c", label: "just" },
            ],
            correctAnswer: "a",
            explanation: "Use 'yet' in Present Perfect negative to show something is still not done."
        },
        // 13. result-count-how-many (medium)
        {
            id: "ppq-13",
            skillTag: "result-count-how-many",
            difficulty: "medium",
            question: "How many times ___ you ___ (see) the new mural on Main Street?",
            options: [
                { value: "b", label: "did / see" },
                { value: "c", label: "has / saw" },
                { value: "a", label: "have / seen" },
            ],
            correctAnswer: "a",
            explanation: "Use 'have/has' + past participle for Present Perfect questions about experiences."
        },
        // 14. duration-for-since-how-long (medium)
        {
            id: "ppq-14",
            skillTag: "duration-for-since-how-long",
            difficulty: "medium",
            question: "Choose the correct sentence to ask about duration.",
            options: [
                { value: "a", label: "How long have you lived in this apartment?" },
                { value: "b", label: "How long did you lived in this apartment?" },
                { value: "c", label: "How long do you live in this apartment?" }
            ],
            correctAnswer: "a",
            explanation: "Present Perfect ('have you lived') is used to ask about duration up to now."
        },
        // 15. result-life-experience-ever-never (medium)
        {
            id: "ppq-15",
            skillTag: "result-life-experience-ever-never",
            difficulty: "medium",
            question: "Which sentence is correct?",
            options: [
                { value: "b", label: "I never have tried Ethiopian food." },
                { value: "a", label: "I have never tried Ethiopian food." },
                { value: "c", label: "I have tried never Ethiopian food." },
            ],
            correctAnswer: "a",
            explanation: "'Never' goes between 'have' and the past participle in Present Perfect."
        },
    ],

/*
TEACHER DIAGNOSTIC NOTES – Present Perfect Mini Quiz

Result-focused gaps:
- result-completed-action
- result-life-experience-ever-never
- result-recent-completion-just-already-yet
- result-count-how-many

Duration gaps:
- duration-for-since-how-long
- result-state-verb-duration

Time confusion:
- error-specific-past-time

Form & placement errors:
- error-already-placement
- error-still-negative
- error-yet-negative-question

Contrast issues:
- contrast-present-perfect-vs-past-simple

Reteaching guidance:
- If result tags are weak → reinforce "What changed NOW?"
- If duration tags are weak → drill for vs since with timelines
- If time errors are weak → do a hard reset on yesterday / last / in + year
- If placement errors are weak → sentence surgery with already / yet / still
- If contrast is weak → anchor the question: "Is the time finished?"
*/
};
