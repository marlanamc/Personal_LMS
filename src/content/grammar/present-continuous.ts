import type { InteractiveGuideContent } from "@/types/activity";

export const presentContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Present Continuous: What's Happening Right Now",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #8b5cf6; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Present Continuous captures <strong style="color: #c86b51;">actions in motion</strong>—what's happening right this second, temporary situations that won't last forever, and plans you've already arranged. Look around: the TV is playing, someone is cooking, your phone is charging. That's Present Continuous!</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 0.25rem;">✓ <strong>Right now</strong>: "I'm waiting for the bus—it's late again."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 0.25rem;">✓ <strong>Temporary situations</strong>: "I'm staying with my sister this month."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 0.25rem;">✓ <strong>Arranged plans</strong>: "We're meeting the landlord tomorrow at 10."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #8b5cf6; font-size: 1.125rem;">am/is/are + verb-ing</span></p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Describing what's happening in pictures or videos</li>
                        <li>Explaining temporary living or work situations</li>
                        <li>Making plans with classmates ("We're studying together on Thursday")</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Workplace</strong>: "I'm covering the front desk today" / "Are you working on the Smith file?"</li>
                        <li><strong>Housing</strong>: "My landlord is painting the building this week"</li>
                        <li><strong>Healthcare</strong>: "I'm feeling much better today"</li>
                        <li><strong>Family</strong>: "She's picking up the kids because I'm working late"</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">⏱️ Present Continuous = in motion NOW or just for a while!</p>
                </div>
            `,
            exercises: [
                {
                    id: "present-continuous-intro-1",
                    title: "Practice: Understanding Present Continuous",
                    instructions: "Identify what Present Continuous is used for.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Present Continuous used for?",
                            options: [
                                { value: "b", label: "Habits and routines" },
                                { value: "a", label: "Actions happening right now or temporary situations" },
                                { value: "c", label: "Past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"The TV <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>playing</span>." What does this describe?',
                            options: [
                                { value: "b", label: "A habit" },
                                { value: "c", label: "A future plan" },
                                { value: "a", label: "What's happening right now" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do we use Present Continuous?",
                            options: [
                                { value: "a", label: "For actions in motion right now or temporary situations" },
                                { value: "b", label: "Only for future plans" },
                                { value: "c", label: "Only for past actions" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Present Continuous",
            icon: "⭐",
            explanation: `
                <h3>Use it when something is actively in motion</h3>
                <p>If it's happening right now or only for a short period, it's Present Continuous—not your forever habits.</p>
            `,
            usageMeanings: [
                {
                    title: "▶️ 1. Actions Happening RIGHT NOW",
                    description: "Things in progress as you speak",
                    examples: [
                        {
                            sentence: "I <strong>am watching</strong> TV while my dinner cooks.",
                            explanation: "✓ In-progress action this moment",
                        },
                        {
                            sentence: "She <strong>is talking</strong> on the phone, and her kid <strong>is yelling</strong> in the background.",
                            explanation: "✓ Ongoing action + the reality of life",
                        },
                        {
                            sentence: "They <strong>are waiting</strong> for the bus that's late again.",
                            explanation: "✓ Still happening right now",
                        },
                    ],
                },
                {
                    title: "⏳ 2. Temporary Situations (Not Forever)",
                    description: "Short-term arrangements or phases",
                    examples: [
                        {
                            sentence: "I'm <strong>staying</strong> with my sister this month while my apartment gets painted.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <strong>is working</strong> the closing shift this week.",
                            explanation: "✓ Short-term schedule",
                        },
                        {
                            sentence: "We <strong>are trying</strong> a new recipe for dinner tonight.",
                            explanation: "✓ Temporary experiment, not our usual",
                        },
                    ],
                },
                {
                    title: "🤝 3. Plans in the Near Future",
                    description: "Arranged future plans (similar to 'going to')",
                    examples: [
                        {
                            sentence: "I'm <strong>meeting</strong> my friend for coffee at 3 PM.",
                            explanation: "✓ Scheduled soon",
                        },
                        {
                            sentence: "They're <strong>going</strong> to the movies tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
                {
                    title: "😤 4. Annoying Repeated Actions (with 'always')",
                    description: "Express irritation about habits using 'always' + Present Continuous",
                    examples: [
                        {
                            sentence: "He's <strong>always leaving</strong> the lights on!",
                            explanation: "✓ Complaining about a repeated behavior",
                        },
                        {
                            sentence: "My roommate is <strong>always forgetting</strong> to lock the door.",
                            explanation: "✓ Frustration about a pattern",
                        },
                        {
                            sentence: "She's <strong>always interrupting</strong> me when I'm talking.",
                            explanation: "✓ Strong emotion about repeated action",
                        },
                    ],
                },
                {
                    title: "📈 5. Changing or Developing Situations",
                    description: "Trends, gradual changes, things getting better or worse",
                    examples: [
                        {
                            sentence: "The neighborhood <strong>is getting</strong> more expensive.",
                            explanation: "✓ Gradual change over time",
                        },
                        {
                            sentence: "My English <strong>is improving</strong> every week.",
                            explanation: "✓ Progress happening now",
                        },
                        {
                            sentence: "The weather <strong>is getting</strong> colder.",
                            explanation: "✓ Current trend",
                        },
                    ],
                },
                {
                    title: "🎬 6. Background Description (Storytelling)",
                    description: "Setting the scene—what's happening around you",
                    examples: [
                        {
                            sentence: "It's a sunny day. Birds <strong>are singing</strong>. Kids <strong>are playing</strong> in the park.",
                            explanation: "✓ Painting a picture of the moment",
                        },
                        {
                            sentence: "Everyone <strong>is working</strong> quietly when suddenly the fire alarm goes off.",
                            explanation: "✓ Background action before the main event",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Contrast",
                content:
                    "Present Simple = routines and facts. Present Continuous = happening now or just for a while. 'I work nights' (general). 'I'm working the day shift this week' (temporary).",
            },
            exercises: [
                {
                    id: "ex-usage-pc-1",
                    title: "When Do We Use Present Continuous?",
                    instructions: "Choose the best reason for Present Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "\"She <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>talking</span> on the phone right now.\"",
                            options: [
                                { value: "habit", label: "Habit/routine" },
                                { value: "now", label: "Action happening now" },
                                { value: "future", label: "Future schedule" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: "\"My parents <span class=\'eg-helper\'>are</span> <span class=\'eg-verb\'>renovating</span> their bathroom this summer.\"",
                            options: [
                                { value: "fact", label: "Permanent fact" },
                                { value: "past", label: "Finished past" },
                                { value: "temporary", label: "Temporary situation" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: "\"The kids <span class=\'eg-helper\'>are</span> <span class=\'eg-verb\'>performing</span> in the school play tomorrow evening.\"",
                            options: [
                                { value: "near-future", label: "Arranged near-future plan" },
                                { value: "habit", label: "Habit" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "near-future",
                        },
                    ],
                },
            ],
        },
        {
            id: "future-choice-flow",
            stepNumber: 2,
            title: "Future Choices: Present Continuous, Going To, or Will?",
            icon: "🧭",
            explanation: `
                <h3>Yes: teach these together. Students need one decision system.</h3>
                <p>When learners confuse future forms, ask one key question: <strong>When did you decide?</strong></p>

            `,
            futureChoiceFlow: {
                title: "Future Choice Decision Flow",
                description: "When did you decide?",
                options: [
                    {
                        trigger: "Did you decide before speaking?",
                        form: "going-to",
                        example: "I'm going to study tonight.",
                        color: "green"
                    },
                    {
                        trigger: "Are you deciding right now (instant reaction)?",
                        form: "will",
                        example: "The phone is ringing. I'll answer it.",
                        color: "cyan"
                    },
                    {
                        trigger: "Is it an arranged appointment?",
                        form: "present-continuous",
                        example: "I'm meeting my advisor at 3 PM.",
                        color: "violet"
                    }
                ]
            },
            postExplanation: `
                <h3>Going to + infinitive (base verb)</h3>
                <p><strong>Form:</strong> am/is/are + going to + base verb</p>
                <ul>
                    <li>I'm going to <strong>apply</strong> for that job.</li>
                    <li>She's going to <strong>call</strong> her landlord.</li>
                    <li>It's going to <strong>rain</strong>. (prediction from evidence)</li>
                </ul>

                <h3>Important contrast: same words, different grammar</h3>
                <div style="overflow-x: auto; margin-top: 0.75rem;">
                    <table style="width: 100%; min-width: 700px; border-collapse: collapse; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 0.7rem; border: 1px solid #e2e8f0; text-align: left;">Sentence</th>
                                <th style="padding: 0.7rem; border: 1px solid #e2e8f0; text-align: left;">Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">I'm going to the store.</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">Movement to a place (go + destination)</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">I'm going to study tonight.</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">Future intention (going to + base verb)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            tipBox: {
                title: "💡 Classroom Shortcut",
                content:
                    "Ask yourself one question first: 'Did you decide before speaking, or right now?' That one question fixes most errors.",
            },
            exercises: [
                {
                    id: "ex-future-choice-flow-1",
                    title: "Decision Flow Practice",
                    instructions: "Choose the best form for each context.",
                    items: [
                        {
                            type: "radio",
                            label: "You planned this yesterday: \"I ___ apply for the new position tonight.\"",
                            options: [
                                { value: "a", label: "am going to" },
                                { value: "b", label: "will" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Your friend drops books. You react now: \"I ___ help you pick those up.\"",
                            options: [
                                { value: "a", label: "am going to" },
                                { value: "b", label: "will" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "It is already in your calendar at 2 PM:",
                            options: [
                                { value: "a", label: "I'm meeting my advisor at 2 PM." },
                                { value: "b", label: "I'll meet my advisor at 2 PM (decision now)." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "ex-going-to-infinitive-1",
                    title: "Going To + Base Verb (Infinitive) Practice",
                    instructions: "Complete using am/is/are + going to + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "Look at the sky. It ___ (rain).",
                            expectedAnswer: "is going to rain",
                        },
                        {
                            type: "text",
                            label: "We ___ (visit) my parents this weekend.",
                            expectedAnswer: "are going to visit",
                        },
                        {
                            type: "text",
                            label: "She ___ (not accept) that offer.",
                            expectedAnswer: "is not going to accept",
                        },
                    ],
                },
            ],
        },
        // Timeline Visualization Section
        {
            id: "timeline-visualization",
            stepNumber: 3,
            title: "Timeline: Actions in Progress",
            icon: "⏰",
            explanation: `
                <h3>Understanding Present Continuous Visually</h3>
                <p>Present Continuous shows actions <strong>in progress</strong>—they started before now and are still happening. Let's see it:</p>

                <div style="background: white; border: 2px solid #8b5cf6; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #8b5cf6;">Timeline: Action Happening NOW</h4>

                    <!-- Timeline visualization -->
                    <div style="position: relative; margin: 2rem 0 1.25rem 0; padding: 0 1rem; height: 170px;">
                        <!-- Timeline line -->
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: linear-gradient(to right, #e2e8f0, #8b5cf6 40%, #8b5cf6 60%, #e2e8f0); transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Duration bar showing action in progress -->
                        <div style="position: absolute; top: calc(50% - 15px); left: 25%; right: 35%; height: 30px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.8)); border-radius: 15px; z-index: 1; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-weight: 600; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">action in progress...</span>
                        </div>

                        <!-- NOW marker -->
                        <div style="position: absolute; top: calc(50% - 45px); left: calc(60% - 30px); text-align: center; z-index: 2;">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: #8b5cf6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4); margin: 0 auto;">
                                NOW
                            </div>
                        </div>

                        <!-- Start label -->
                        <div style="position: absolute; top: calc(50% + 25px); left: 20%; text-align: center;">
                            <div style="font-size: 0.75rem; color: #64748b;">started earlier</div>
                        </div>

                        <!-- Continue label -->
                        <div style="position: absolute; top: calc(50% + 25px); right: 25%; text-align: center;">
                            <div style="font-size: 0.75rem; color: #64748b;">still happening</div>
                        </div>
                    </div>

                    <div style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem; margin-top: 3rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #8b5cf6; font-weight: 600;">am cooking</span> dinner → The cooking started and is <span style="color: #8b5cf6; font-weight: 600;">still happening NOW</span></p>
                    </div>
                </div>

                <h3 style="margin-top: 2rem;">Contrast: Present Continuous vs Present Simple</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #f5f3ff; padding: 1rem; border-radius: 0.5rem; border: 2px solid #8b5cf6;">
                        <h4 style="margin-top: 0; color: #8b5cf6; text-align: center;">Present Continuous</h4>
                        <p style="text-align: center; margin: 0.5rem 0; font-size: 0.875rem; color: #64748b;">ONE ongoing action</p>
                        <div style="height: 40px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0.9)); border-radius: 20px; margin: 1rem 0; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-weight: 600; font-size: 0.75rem;">━━━━━━━━━</span>
                        </div>
                        <p style="margin: 0; text-align: center; font-size: 0.875rem;">"I'm <strong>working</strong> from home <em>this week</em>."</p>
                    </div>
                    <div style="background: #fef9f3; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b;">
                        <h4 style="margin-top: 0; color: #f59e0b; text-align: center;">Present Simple</h4>
                        <p style="text-align: center; margin: 0.5rem 0; font-size: 0.875rem; color: #64748b;">Repeated habit/routine</p>
                        <div style="height: 40px; display: flex; align-items: center; justify-content: center; gap: 8px; margin: 1rem 0;">
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                        </div>
                        <p style="margin: 0; text-align: center; font-size: 0.875rem;">"I <strong>work</strong> from home <em>every Friday</em>."</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Key Insight",
                content: "Present Continuous = ONE action stretching across time. Present Simple = repeated dots (habits). Ask yourself: Is this ONE ongoing action or a regular pattern?",
            },
            exercises: [
                {
                    id: "ex-timeline-pc-1",
                    title: "Practice: Ongoing Action or Habit?",
                    instructions: "Decide if each sentence describes ONE ongoing action (Present Continuous) or a repeated habit (Present Simple).",
                    items: [
                        {
                            type: "radio",
                            label: "\"She is reading a book right now.\"",
                            options: [
                                { value: "continuous", label: "ONE ongoing action (Present Continuous)" },
                                { value: "simple", label: "Repeated habit (Present Simple)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "\"He takes the bus every morning.\"",
                            options: [
                                { value: "continuous", label: "ONE ongoing action (Present Continuous)" },
                                { value: "simple", label: "Repeated habit (Present Simple)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "\"The weather is getting colder.\"",
                            options: [
                                { value: "continuous", label: "ONE ongoing action/change (Present Continuous)" },
                                { value: "simple", label: "Repeated pattern (Present Simple)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ],
        },
        // Comparison Section
        {
            id: "comparison",
            stepNumber: 4,
            title: "Present Continuous vs Present Simple",
            icon: "⚖️",
            explanation: `
                <h3>When to Use Which?</h3>
                <p>This is one of the most common confusions for English learners. Let's clear it up!</p>
            `,
            comparison: {
                title: "Side-by-Side Comparison",
                leftLabel: "Present Continuous",
                rightLabel: "Present Simple",
                rows: [
                    { label: "Focus", left: "Temporary, in progress NOW", right: "Permanent, routine, fact" },
                    { label: "Duration", left: "Just for now / this period", right: "Always / regularly" },
                    { label: "Time Words", left: "right now, at the moment, this week, today, currently", right: "always, usually, every day, often, never" },
                    { label: "Example", left: "I'm working the night shift this week.", right: "I work nights. (always)" },
                    { label: "Example", left: "She's living with her cousin temporarily.", right: "She lives in Boston. (permanent)" },
                    { label: "Example", left: "The bus is running late today.", right: "The bus runs every 20 minutes." },
                ],
            },
            tipBox: {
                title: "💡 Quick Test",
                content: "Ask: 'Is this just for now, or always?' If just for now → Present Continuous. If always/regularly → Present Simple.",
            },
            exercises: [
                {
                    id: "ex-comparison-pc-1",
                    title: "Practice: Choose the Right Tense",
                    instructions: "Select Present Continuous or Present Simple based on the context.",
                    items: [
                        {
                            type: "radio",
                            label: "My schedule this week: \"I ___ (work) the early shift.\" (temporary this week)",
                            options: [
                                { value: "simple", label: "work (Present Simple)" },
                                { value: "continuous", label: "am working (Present Continuous)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "My normal routine: \"I ___ (take) the 8 AM bus every day.\" (regular habit)",
                            options: [
                                { value: "simple", label: "take (Present Simple)" },
                                { value: "continuous", label: "am taking (Present Continuous)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Right now: \"She ___ (talk) on the phone.\" (action happening now)",
                            options: [
                                { value: "simple", label: "talks (Present Simple)" },
                                { value: "continuous", label: "is talking (Present Continuous)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "General fact: \"Water ___ (boil) at 100°C.\" (scientific fact)",
                            options: [
                                { value: "simple", label: "boils (Present Simple)" },
                                { value: "continuous", label: "is boiling (Present Continuous)" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },
        // Common Mistakes Section
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes & Stative Verbs",
            icon: "⚠️",
            explanation: `
                <h3>🚫 Stative Verbs: Verbs That Don't Use Continuous</h3>
                <p>Some verbs describe <strong>states</strong> (not actions), so they rarely use -ing. These are called <strong>stative verbs</strong>.</p>

                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <p style="margin: 0; text-align: center; color: #dc2626;"><strong>❌ WRONG:</strong> I'm knowing the answer. → <strong>✓ CORRECT:</strong> I know the answer.</p>
                </div>
            `,
            verbTable: {
                title: "Common Stative Verbs (Don't Use -ing)",
                headers: ["Category", "Verbs"],
                rows: [
                    ["Emotions", "love, hate, like, prefer, want, need, wish"],
                    ["Mental States", "know, believe, understand, remember, forget, think (opinion), realize"],
                    ["Possession", "have (possession), own, belong, possess"],
                    ["Senses", "see, hear, smell, taste, feel (when meaning 'seem')"],
                    ["Other States", "be, seem, appear, contain, consist, mean, cost"],
                ],
            },
            tipBox: {
                title: "⚡ Exception: Some Verbs Work Both Ways!",
                content: "'Have' for possession = I have a car (✓). 'Have' for experience = I'm having lunch (✓). 'Think' for opinion = I think it's good (✓). 'Think' for process = I'm thinking about it (✓). Context matters!",
            },
            usageMeanings: [
                {
                    title: "❌ Common Error #1: Missing 'be' Verb",
                    description: "Forgetting am/is/are before verb-ing",
                    examples: [
                        {
                            sentence: "❌ She <span style=\"color: #ef4444;\">cooking</span> dinner right now.",
                            explanation: "✓ She <strong>is cooking</strong> dinner right now.",
                        },
                        {
                            sentence: "❌ They <span style=\"color: #ef4444;\">waiting</span> for the bus.",
                            explanation: "✓ They <strong>are waiting</strong> for the bus.",
                        },
                    ],
                },
                {
                    title: "❌ Common Error #2: Wrong Form After 'be'",
                    description: "Using base verb instead of verb-ing",
                    examples: [
                        {
                            sentence: "❌ He is <span style=\"color: #ef4444;\">work</span> on a project.",
                            explanation: "✓ He is <strong>working</strong> on a project.",
                        },
                        {
                            sentence: "❌ I am <span style=\"color: #ef4444;\">study</span> for my exam.",
                            explanation: "✓ I am <strong>studying</strong> for my exam.",
                        },
                    ],
                },
                {
                    title: "❌ Common Error #3: Using Continuous with Stative Verbs",
                    description: "Putting -ing on verbs that describe states",
                    examples: [
                        {
                            sentence: "❌ I'm <span style=\"color: #ef4444;\">understanding</span> you now.",
                            explanation: "✓ I <strong>understand</strong> you now.",
                        },
                        {
                            sentence: "❌ She's <span style=\"color: #ef4444;\">having</span> two children.",
                            explanation: "✓ She <strong>has</strong> two children. (possession)",
                        },
                        {
                            sentence: "❌ They're <span style=\"color: #ef4444;\">believing</span> in hard work.",
                            explanation: "✓ They <strong>believe</strong> in hard work.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-stative-1",
                    title: "Stative or Action? Choose the Correct Form",
                    instructions: "Decide if the verb should use continuous (-ing) or simple form.",
                    items: [
                        {
                            type: "radio",
                            label: "I ___ (know) the answer to this question.",
                            options: [
                                { value: "knowing", label: "am knowing (continuous)" },
                                { value: "know", label: "know (simple)" },
                            ],
                            expectedAnswer: "know",
                        },
                        {
                            type: "radio",
                            label: "She ___ (read) a book right now.",
                            options: [
                                { value: "reading", label: "is reading (continuous)" },
                                { value: "reads", label: "reads (simple)" },
                            ],
                            expectedAnswer: "reading",
                        },
                        {
                            type: "radio",
                            label: "This soup ___ (taste) delicious!",
                            options: [
                                { value: "tasting", label: "is tasting (continuous)" },
                                { value: "tastes", label: "tastes (simple)" },
                            ],
                            expectedAnswer: "tastes",
                        },
                        {
                            type: "radio",
                            label: "The chef ___ (taste) the sauce to check the seasoning.",
                            options: [
                                { value: "tasting", label: "is tasting (continuous)" },
                                { value: "tastes", label: "tastes (simple)" },
                            ],
                            expectedAnswer: "tasting",
                        },
                        {
                            type: "radio",
                            label: "I ___ (have) a headache right now.",
                            options: [
                                { value: "having", label: "am having (continuous)" },
                                { value: "have", label: "have (simple)" },
                            ],
                            expectedAnswer: "have",
                        },
                    ],
                },
                {
                    id: "ex-error-fix-1",
                    title: "Fix the Mistakes",
                    instructions: "Each sentence has an error with Present Continuous. Write the correct version.",
                    items: [
                        { type: "text", label: "I am understand this lesson now.", expectedAnswer: "I understand this lesson now" },
                        { type: "text", label: "She cooking dinner for the family.", expectedAnswer: "She is cooking dinner for the family" },
                        { type: "text", label: "They are believe in you.", expectedAnswer: "They believe in you" },
                        { type: "text", label: "He is have three cats.", expectedAnswer: "He has three cats" },
                        { type: "text", label: "We study English right now.", expectedAnswer: "We are studying English right now" },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 6,
            title: "Positive Form",
            explanation: `
                <p>Formula: <strong>am/is/are + verb-ing</strong>. Same for all subjects—just swap am/is/are.</p>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            I <span style="color: #8b5cf6; font-weight: 600;">am washing</span> the dishes right now.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            You <span style="color: #8b5cf6; font-weight: 600;">are listening</span> to music on your headphones.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            He <span style="color: #8b5cf6; font-weight: 600;">is fixing</span> his car in the driveway.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            She <span style="color: #8b5cf6; font-weight: 600;">is making</span> dinner for the family.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            We <span style="color: #8b5cf6; font-weight: 600;">are watching</span> the game on TV.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            They <span style="color: #8b5cf6; font-weight: 600;">are playing</span> soccer in the park.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            verbTable: {
                title: "Spelling Rules for -ing",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: add -ing", "work → working, email → emailing"],
                    ["Ends in -e: drop -e, add -ing", "write → writing, give → giving"],
                    ["One syllable CVC: double last consonant", "run → running, sit → sitting"],
                ],
            },
            exercises: [
                {
                    id: "ex-pos-1",
                    title: "Exercise 1: What Are They Doing?",
                    instructions: "Use am/is/are + verb-ing to show actions in progress.",
                    items: [
                        { type: "text", label: "The baby ___ (sleep) peacefully in her crib right now.", expectedAnswer: "is sleeping" },
                        { type: "text", label: "My neighbors ___ (plant) a vegetable garden in their backyard.", expectedAnswer: "are planting" },
                        { type: "text", label: "I ___ (take) guitar lessons every Tuesday this course.", expectedAnswer: "am taking" },
                    ],
                },
            ],
        },
        {
            id: "step-negative",
            stepNumber: 7,
            title: "Negative Form",
            explanation: `
                <p>Add <strong>not</strong> after am/is/are to show something is NOT happening.</p>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            I<span style="color: #8b5cf6; font-weight: 600;">'m not eating</span> meat this month—I'm trying something new.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            He <span style="color: #8b5cf6; font-weight: 600;">isn't taking</span> the early shift this week.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            They <span style="color: #8b5cf6; font-weight: 600;">aren't going</span> to the party tonight.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "am/is/are not", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What's NOT Happening",
                    instructions: "Use am/is/are not + verb-ing.",
                    items: [
                        { type: "text", label: "The museum ___ (not charge) admission fees this weekend.", expectedAnswer: "is not charging" },
                        { type: "text", label: "We ___ (not buy) a new couch this month because we're saving money.", expectedAnswer: "are not buying" },
                        { type: "text", label: "My son ___ (not listen) to my advice about his college applications.", expectedAnswer: "is not listening" },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 8,
            title: "Question Form",
            explanation: `
                <p>Flip am/is/are to the front to ask about actions in progress.</p>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Are</span> you <span style="color: #8b5cf6; font-weight: 600;">coming</span> to dinner tonight?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Is</span> he <span style="color: #8b5cf6; font-weight: 600;">watching</span> the game?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #8b5cf6; font-weight: 600;">Are</span> they <span style="color: #8b5cf6; font-weight: 600;">making</span> pizza for everyone?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Am/Is/Are", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-q-1",
                    title: "Exercise 3: Ask About Right Now",
                    instructions: "Form questions with am/is/are + subject + verb-ing.",
                    items: [
                        { type: "text", label: "___ the library ___ (offer) free workshops this month?", expectedAnswer: "Is the library offering" },
                        { type: "text", label: "___ your cousins ___ (visit) next week?", expectedAnswer: "Are your cousins visiting" },
                        { type: "text", label: "___ the city ___ (repair) the sidewalks in our neighborhood?", expectedAnswer: "Is the city repairing" },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'eat' with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ eating", expectedAnswer: "are" },
                        { type: "text", label: "Negative: They ___ eating", expectedAnswer: "aren't" },
                        { type: "text", label: "Question: ___ they eating?", expectedAnswer: "Are" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She is cook dinner right now.", expectedAnswer: "She is cooking dinner right now" },
                        { type: "text", label: "They is watching a movie.", expectedAnswer: "They are watching a movie" },
                        { type: "text", label: "I'm not go to the party tonight.", expectedAnswer: "I'm not going to the party tonight" },
                        { type: "text", label: "Are you come with us?", expectedAnswer: "Are you coming with us" },
                        { type: "text", label: "He working on a new project.", expectedAnswer: "He is working on a new project" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 6: Transformation Practice",
                    instructions: "Change each sentence as instructed.",
                    items: [
                        { type: "text", label: "Make negative: I am studying for my exam.", expectedAnswer: "I am not studying for my exam" },
                        { type: "text", label: "Make a question: She is working from home today.", expectedAnswer: "Is she working from home today" },
                        { type: "text", label: "Make affirmative: They aren't working this weekend.", expectedAnswer: "They are working this weekend" },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Use:</strong> Actions happening now, temporary situations, near-future plans</li>
                    <li><strong>Form:</strong> am/is/are + verb-ing (same structure for all subjects)</li>
                    <li><strong>Future Decision Rule:</strong> Before speaking → going to. Now → will. Arranged appointment → Present Continuous.</li>
                    <li><strong>Signal words:</strong> right now, currently, at the moment, this week, today</li>
                    <li><strong>Need full tense contrast?</strong> Review <em>Continuous Tenses Review</em> to compare present, past, and future continuous choices.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "present-continuous-summary-1",
                    title: "Practice: Quick Summary Check",
                    instructions: "Use am/is/are + verb-ing for actions in progress or temporary situations.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is a good use of Present Continuous?",
                            options: [
                                { value: "b", label: "I wait for the bus every day." },
                                { value: "a", label: "I am waiting for the bus right now." },
                                { value: "c", label: "I waited for the bus yesterday." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete: They ___ (not watch) TV right now.",
                            expectedAnswer: "are not watching",
                        },
                        {
                            type: "word-scramble",
                            label: "Put the words in order to make a correct sentence.",
                            words: ["She", "is", "cooking", "right", "now"],
                            correctAnswer: "She is cooking right now",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence correctly shows an action in progress?",
            options: [
                { value: "a", label: "I cook dinner right now." },
                { value: "c", label: "I cooked dinner right now." },
                { value: "b", label: "I am cooking dinner right now." },
            ],
            correctAnswer: "b",
            explanation: "Use am/is/are + verb-ing for actions happening at this moment.",
            skillTag: "form-present-continuous-basic",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which sentence shows a temporary situation (not permanent)?",
            options: [
                { value: "b", label: "My aunt is living with her sister this month while her apartment is painted." },
                { value: "a", label: "My aunt lives in Dorchester." },
                { value: "c", label: "My aunt lived in Dorchester when she was a child." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous fits temporary arrangements that are true for a short period.",
            skillTag: "meaning-temporary-situation",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which sentence is an arranged near-future plan (Present Continuous)?",
            options: [
                { value: "b", label: "I meet the teacher tomorrow afternoon." },
                { value: "a", label: "I'm meeting the teacher tomorrow afternoon." },
                { value: "c", label: "I met the teacher tomorrow afternoon." },
            ],
            correctAnswer: "a",
            explanation: "We often use Present Continuous for arranged plans: I'm meeting… tomorrow.",
            skillTag: "meaning-near-future-plan",
            difficulty: "medium",
        },
        {
            id: "quiz-4",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "Do you working today?" },
                { value: "c", label: "Are you work today?" },
                { value: "a", label: "Are you working today?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Am/Is/Are + subject + verb-ing.",
            skillTag: "form-question-am-is-are-subject-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Which negative sentence is correct?",
            options: [
                { value: "a", label: "He isn't taking the early shift this week." },
                { value: "b", label: "He doesn't taking the early shift this week." },
                { value: "c", label: "He isn't take the early shift this week." },
            ],
            correctAnswer: "a",
            explanation: "Negative Present Continuous: am/is/are not + verb-ing.",
            skillTag: "form-negative-am-is-are-not-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which sentence is NOT a good use of Present Continuous?",
            options: [
                { value: "b", label: "She's staying with her cousin this week." },
                { value: "a", label: "I'm knowing the answer right now." },
                { value: "c", label: "They're waiting for the bus right now." },
            ],
            correctAnswer: "a",
            explanation: "Stative verbs like 'know' rarely take -ing; we normally say 'I know the answer.'",
            skillTag: "error-stative-verb-ing",
            difficulty: "hard",
        },
        {
            id: "quiz-7",
            question: "Choose the correct -ing form: write → ____",
            options: [
                { value: "a", label: "writeing" },
                { value: "c", label: "writting" },
                { value: "b", label: "writing" },
            ],
            correctAnswer: "b",
            explanation: "Drop final -e, then add -ing: write → writing.",
            skillTag: "spelling-ing-drop-e",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Choose the correct -ing form: run → ____",
            options: [
                { value: "b", label: "running" },
                { value: "a", label: "runing" },
                { value: "c", label: "runeing" },
            ],
            correctAnswer: "b",
            explanation: "One-syllable CVC verbs double the last consonant: run → running.",
            skillTag: "spelling-ing-double-consonant",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Choose Present Continuous or Present Simple: Which sentence is a habit?",
            options: [
                { value: "a", label: "I am taking the bus to work every day." },
                { value: "b", label: "I take the bus to work every day." },
                { value: "c", label: "I took the bus to work every day." },
            ],
            correctAnswer: "b",
            explanation: "Habits/routines usually use Present Simple: I take… every day.",
            skillTag: "contrast-present-simple-vs-continuous-habit",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence correctly shows something happening now?",
            options: [
                { value: "a", label: "The kids play outside right now." },
                { value: "c", label: "The kids played outside right now." },
                { value: "b", label: "The kids are playing outside right now." },
            ],
            correctAnswer: "b",
            explanation: "'Right now' signals Present Continuous: are playing.",
            skillTag: "meaning-happening-now",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which sentence has the correct word order?",
            options: [
                { value: "b", label: "Why are you waiting?" },
                { value: "a", label: "Why you are waiting?" },
                { value: "c", label: "Why are waiting you?" },
            ],
            correctAnswer: "b",
            explanation: "Questions: WH-word + am/is/are + subject + verb-ing.",
            skillTag: "form-question-word-order-present-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "Someone knocks at the door. What do you say to your family right now?",
            options: [
                { value: "a", label: "I'm answering the door." },
                { value: "b", label: "I'll answer the door." },
                { value: "c", label: "I answer the door." },
            ],
            correctAnswer: "b",
            explanation: "A spontaneous decision right now usually uses will: I'll answer.",
            skillTag: "contrast-will-vs-present-continuous-decision",
            difficulty: "hard",
        },
        {
            id: "quiz-13",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "She is cook dinner right now." },
                { value: "c", label: "She cooking dinner right now." },
                { value: "b", label: "She is cooking dinner right now." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous needs am/is/are + verb-ing: is cooking.",
            skillTag: "error-missing-be-verb-present-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-14",
            question: "Which sentence correctly uses going to + base verb (infinitive)?",
            options: [
                { value: "a", label: "It's going to rain." },
                { value: "b", label: "It's going to raining." },
                { value: "c", label: "It's go to rain." },
            ],
            correctAnswer: "a",
            explanation: "Future 'going to' uses: am/is/are + going to + base verb.",
            skillTag: "form-going-to-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which sentence best describes a temporary work schedule?",
            options: [
                { value: "a", label: "He works the night shift." },
                { value: "b", label: "He is working the night shift this week." },
                { value: "c", label: "He worked the night shift this week." },
            ],
            correctAnswer: "b",
            explanation: "'This week' suggests a temporary situation, so Present Continuous fits: is working.",
            skillTag: "meaning-temporary-work-schedule",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question: "Which sentence expresses irritation about a repeated behavior?",
            options: [
                { value: "a", label: "He always leaves the lights on." },
                { value: "c", label: "He left the lights on." },
                { value: "b", label: "He's always leaving the lights on!" },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous with 'always' expresses annoyance: He's always leaving...",
            skillTag: "meaning-annoying-habit-always",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "Which sentence describes a changing situation?",
            options: [
                { value: "b", label: "The neighborhood is getting more expensive." },
                { value: "a", label: "The neighborhood is expensive." },
                { value: "c", label: "The neighborhood was expensive." },
            ],
            correctAnswer: "b",
            explanation: "Present Continuous shows gradual change: is getting more expensive.",
            skillTag: "meaning-changing-situation",
            difficulty: "medium",
        },
        {
            id: "quiz-18",
            question: "Which verb should NOT use continuous form?",
            options: [
                { value: "a", label: "I'm cooking dinner." },
                { value: "b", label: "I'm knowing this now." },
                { value: "c", label: "I'm working late today." },
            ],
            correctAnswer: "b",
            explanation: "'Know' is a stative verb—say 'I know this now,' not 'I'm knowing this now.'",
            skillTag: "error-stative-verb-know",
            difficulty: "medium",
        },
        {
            id: "quiz-19",
            question: "Which sentence correctly uses 'have' with Present Continuous?",
            options: [
                { value: "a", label: "She's having two children." },
                { value: "c", label: "She's having a car." },
                { value: "b", label: "She's having lunch right now." },
            ],
            correctAnswer: "b",
            explanation: "'Have' for experiences (lunch, fun, problems) CAN use continuous. 'Have' for possession (children, car) cannot.",
            skillTag: "meaning-have-action-vs-state",
            difficulty: "hard",
        },
        {
            id: "quiz-20",
            question: "You decided yesterday, and now you're reporting your plan. Which sentence is best?",
            options: [
                { value: "a", label: "I'm going to call the landlord tonight." },
                { value: "b", label: "I'll call the landlord tonight. (decision now)" },
                { value: "c", label: "I called the landlord tonight." },
            ],
            correctAnswer: "a",
            explanation: "Decision before speaking usually uses going to; instant decisions often use will.",
            skillTag: "contrast-going-to-vs-will-decision-time",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Present Continuous (Enhanced Version)

    Skill map by skillTag:
    FORM:
    - form-present-continuous-basic: questions 1, 13
    - form-question-am-is-are-subject-verb-ing: question 4
    - form-negative-am-is-are-not-verb-ing: question 5
    - form-question-word-order-present-continuous: question 11
    - error-missing-be-verb: questions 13, 20
    - error-missing-be-verb-present-continuous: question 13

    MEANING:
    - meaning-temporary-situation: question 2
    - meaning-near-future-plan: question 3
    - meaning-happening-now: question 10
    - meaning-temporary-work-schedule: question 15
    - meaning-annoying-habit-always: question 16
    - meaning-changing-situation: question 17
    - meaning-have-action-vs-state: question 19

    STATIVE VERBS:
    - error-stative-verb-ing: question 6
    - error-stative-verb-know: question 18

    SPELLING:
    - spelling-ing-drop-e: question 7
    - spelling-ing-double-consonant: question 8

    CONTRASTS:
    - contrast-present-simple-vs-continuous-habit: question 9
    - contrast-will-vs-present-continuous-decision: question 12
    - form-going-to-base-verb: question 14
    - contrast-going-to-vs-will-decision-time: question 20

    How to use this data:
    - If students miss questions 1, 4, 5, 13, or 20, review the basic Present Continuous form: am/is/are + verb-ing.
      Focus on the fact that the 'be' verb is REQUIRED before -ing.

    - If questions 6, 18, or 19 are weak (stative verbs), spend dedicated time on:
      * Which verbs describe STATES vs ACTIONS
      * Common stative verbs: know, understand, believe, love, hate, have (possession)
      * Exception verbs that work both ways: have (experience), think (process vs opinion), see (understand vs meeting)

    - If questions 16 or 17 are low (annoying habits, changing situations), practice these specific patterns:
      * "always + Present Continuous" for irritation
      * "getting + adjective" for changes/trends

    - Weak scores on questions 2, 3, 9, 10, or 15 suggest confusion about WHEN to use Present Continuous vs Present Simple.
      Recycle contrasts: "I work nights" (general) vs "I'm working the day shift this week" (temporary).

    - If question 11 is low, practice WH-questions: Why/What/Where + am/is/are + subject + verb-ing.

    - If questions 12, 14, or 20 are weak, use the decision flow explicitly:
      * before speaking -> going to
      * now -> will
      * arranged appointment -> Present Continuous
      Also drill the form: am/is/are + going to + base verb.

    - If spelling questions (7 and 8) are often wrong, revisit -ing spelling rules and have students build word lists.
    */
};
