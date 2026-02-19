import type { InteractiveGuideContent } from "@/types/activity";

export const pastContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Past Continuous: What Was Going On",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(240, 180, 90, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #f0b45a; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Past Continuous is your <strong style="color: #c86b51;">storytelling tense</strong>—it sets the scene for what was happening at a specific moment, shows background actions that got interrupted, and paints a picture of the past in motion.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f0b45a; border-radius: 0.25rem;">✓ <strong>Interrupted actions</strong>: "I was walking home when it started raining."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f0b45a; border-radius: 0.25rem;">✓ <strong>Specific past time</strong>: "At midnight, my neighbors were playing loud music."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #f0b45a; border-radius: 0.25rem;">✓ <strong>Setting the scene</strong>: "The sun was setting. People were walking home from work."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #f0b45a; font-size: 1.125rem;">was/were + verb-ing</span></p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Telling detailed housing problem stories</li>
                        <li>Using "when" and "while" to connect two actions</li>
                        <li>Describing what was happening at a specific time</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Incident reports</strong>: "I was walking to the bus stop when I slipped on ice."</li>
                        <li><strong>Medical history</strong>: "I was having chest pain when I called 911."</li>
                        <li><strong>Housing complaints</strong>: "At midnight, my neighbors were playing loud music."</li>
                        <li><strong>Workplace explanations</strong>: "I wasn't ignoring you—I was helping another customer."</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎬 Past Continuous adds drama to your stories—it sets the scene!</p>
                </div>
            `,
            exercises: [
                {
                    id: "past-continuous-intro-1",
                    title: "Practice: Understanding Past Continuous",
                    instructions: "Identify what Past Continuous describes.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Past Continuous describe?",
                            options: [
                                { value: "b", label: "Completed past actions" },
                                { value: "a", label: "What was happening at a specific moment in the past, especially when interrupted" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>sleeping</span> when you called." What does this show?',
                            options: [
                                { value: "b", label: "A completed action" },
                                { value: "c", label: "A habit" },
                                { value: "a", label: "An action in progress that was interrupted" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When is Past Continuous especially useful?",
                            options: [
                                { value: "a", label: "To show what was happening when something else interrupted" },
                                { value: "b", label: "To describe habits" },
                                { value: "c", label: "To talk about the future" },
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
            title: "When Real Life Needs Past Continuous",
            icon: "⭐",
            explanation: `
                <h3>Past Continuous Helps You Reconstruct What Was Happening</h3>
                <p>Use it for background actions, overlapping activities, and scene-setting details that make your story clear.</p>
            `,
            usageMeanings: [
                {
                    title: "⏸️ 1. Action In Progress at a Past Time",
                    description: "Show what was happening at an exact past moment",
                    examples: [
                        {
                            sentence: "I <strong>was sleeping</strong> at midnight when you called.",
                            explanation: "✓ Ongoing action at a specific past time",
                        },
                        {
                            sentence: "At midnight, my neighbors <strong>were playing</strong> loud music.",
                            explanation: "✓ Describes what was in progress at a clock time",
                        },
                    ],
                },
                {
                    title: "⚡ 2. Interrupted Actions",
                    description: "A longer action stopped by a shorter one",
                    examples: [
                        {
                            sentence: "She <strong>was walking</strong> home when it <strong>started</strong> raining.",
                            explanation: "✓ Walking = in progress; rain = interruption",
                        },
                        {
                            sentence: "We <strong>were eating</strong> dinner when someone <strong>knocked</strong> on the door.",
                            explanation: "✓ Eating = longer action; knock = interruption",
                        },
                    ],
                },
                {
                    title: "🤝 3. Parallel Actions",
                    description: "Two longer actions happening at the same time in the past",
                    examples: [
                        {
                            sentence: "While I <strong>was cooking</strong>, my husband <strong>was cleaning</strong> the kitchen.",
                            explanation: "✓ Two simultaneous background actions",
                        },
                        {
                            sentence: "I <strong>was studying</strong> while my son <strong>was doing</strong> his homework.",
                            explanation: "✓ Both actions continued over the same period",
                        },
                    ],
                },
                {
                    title: "🎬 4. Scene-Setting in Stories",
                    description: "Paint the atmosphere before the main event",
                    examples: [
                        {
                            sentence: "The sun <strong>was setting</strong>. People <strong>were walking</strong> home. Kids <strong>were playing</strong> outside.",
                            explanation: "✓ Builds a clear background scene",
                        },
                        {
                            sentence: "It <strong>was snowing</strong> and cars <strong>were moving</strong> slowly when the bus arrived.",
                            explanation: "✓ Describes the environment in motion",
                        },
                    ],
                },
                {
                    title: "🙏 5. Polite Requests (Softening Language)",
                    description: "Use Past Continuous to sound less direct in requests",
                    examples: [
                        {
                            sentence: "I <strong>was wondering</strong> if you could help me with this form.",
                            explanation: "✓ Softer than a direct request",
                        },
                        {
                            sentence: "I <strong>was hoping</strong> we could reschedule the appointment.",
                            explanation: "✓ Diplomatic and polite tone",
                        },
                    ],
                },
                {
                    title: "😤 6. Repeated Past Habits (with 'always')",
                    description: "Show irritation about repeated past behavior",
                    examples: [
                        {
                            sentence: "She <strong>was always complaining</strong> about the noise.",
                            explanation: "✓ Repeated behavior with emotional tone",
                        },
                        {
                            sentence: "He <strong>was always leaving</strong> dirty dishes in the sink.",
                            explanation: "✓ Ongoing annoying pattern in the past",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Contrast",
                content: "Past Continuous = in-progress background. Past Simple = completed event. 'I was cooking when the fire alarm went off.'",
            },
            exercises: [
                {
                    id: "ex-usage-past-cont-1",
                    title: "Was It In Progress?",
                    instructions: "Choose the best reason for using Past Continuous.",
                    items: [
                        {
                            type: "radio",
                            label: '"She <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>walking</span> when it started raining."',
                            options: [
                                { value: "finished", label: "Finished one-time action" },
                                { value: "interrupted", label: "Interrupted action in progress" },
                                { value: "habit", label: "Habit/routine" },
                            ],
                            expectedAnswer: "interrupted",
                        },
                        {
                            type: "radio",
                            label: '"They <span class=\'eg-helper\'>were</span> <span class=\'eg-verb\'>sleeping</span> at 3 AM yesterday."',
                            options: [
                                { value: "completed", label: "Completed past action" },
                                { value: "future", label: "Future plan" },
                                { value: "time-in-progress", label: "Action in progress at a past time" },
                            ],
                            expectedAnswer: "time-in-progress",
                        },
                        {
                            type: "radio",
                            label: '"While I <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>cooking</span>, my roommate <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>cleaning</span>."',
                            options: [
                                { value: "parallel", label: "Parallel actions happening at the same time" },
                                { value: "interrupted", label: "One short interruption" },
                                { value: "habit", label: "Daily routine" },
                            ],
                            expectedAnswer: "parallel",
                        },
                        {
                            type: "radio",
                            label: '"The wind <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>blowing</span>. People <span class=\'eg-helper\'>were</span> <span class=\'eg-verb\'>running</span> for cover."',
                            options: [
                                { value: "future", label: "Future arrangement" },
                                { value: "scene", label: "Scene-setting background description" },
                                { value: "fact", label: "General fact" },
                            ],
                            expectedAnswer: "scene",
                        },
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>driving</span> when my phone rang."',
                            options: [
                                { value: "habit", label: "Habit" },
                                { value: "future", label: "Future ongoing" },
                                { value: "interrupted", label: "Interrupted action" },
                            ],
                            expectedAnswer: "interrupted",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization Section
        {
            id: "timeline-visualization",
            stepNumber: 2,
            title: "Timeline: Seeing the Interruption",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Interrupted Action</h3>
                <p>Past Continuous shows a <strong>longer action in progress</strong> that gets interrupted by a <strong>shorter, sudden event</strong>. Let's see it visually:</p>

                <div style="background: white; border: 2px solid #f0b45a; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: The Interrupted Action</h4>

                    <p style="text-align: center; color: #64748b; font-size: 0.95rem; margin-bottom: 2rem;">Past Continuous shows a <strong>longer action in progress</strong> that gets interrupted by a <strong>shorter, sudden event</strong>.</p>

                    <div style="position: relative; margin: 2rem auto; max-width: 650px; padding: 4rem 0 2rem;">
                        <div style="position: relative; height: 50px; background: linear-gradient(to right, rgba(240, 180, 90, 0.2), rgba(240, 180, 90, 0.9), rgba(240, 180, 90, 0.9), rgba(240, 180, 90, 0.2)); border-radius: 25px; border: 3px solid #f0b45a; display: flex; align-items: center; padding: 0 2rem;">
                            <span style="color: #7c5d0a; font-weight: 600; font-size: 0.875rem;">I was walking home...</span>
                            <div style="position: absolute; left: 0; top: 50%; width: 10px; height: 10px; background: #f0b45a; border-radius: 50%; transform: translate(-5px, -50%);"></div>
                            <div style="position: absolute; right: 0; top: 50%; width: 10px; height: 10px; background: #f0b45a; border-radius: 50%; transform: translate(5px, -50%);"></div>
                        </div>

                        <div style="text-align: center; margin-top: 0.5rem;">
                            <span style="font-size: 0.75rem; color: #f0b45a; font-weight: 600;">Past Continuous = Ongoing Background Action</span>
                        </div>

                        <div style="position: absolute; top: 2rem; left: 60%; transform: translateX(-50%);">
                            <div style="width: 3px; height: 80px; background: #d97757; position: relative;">
                                <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #d97757;"></div>
                            </div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background: #d97757; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(217, 119, 87, 0.4); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.5rem;">
                                ⚡
                            </div>
                            <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: #d97757; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                It started raining
                            </div>
                            <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #94a3b8;">
                                Past Simple = Interruption
                            </div>
                        </div>
                    </div>

                    <div style="background: #fef3e7; padding: 1.25rem; border-radius: 0.5rem; margin-top: 3.5rem; border-left: 4px solid #f0b45a;">
                        <p style="margin: 0; text-align: center; font-size: 1rem;">
                            <strong>Full Sentence:</strong> I <span style="background: rgba(240, 180, 90, 0.3); color: #f0b45a; font-weight: 700; padding: 2px 8px; border-radius: 4px;">was walking</span> home when it <span style="background: rgba(217, 119, 87, 0.3); color: #d97757; font-weight: 700; padding: 2px 8px; border-radius: 4px;">started</span> raining.
                        </p>
                        <p style="margin: 0.75rem 0 0 0; text-align: center; font-size: 0.875rem; color: #64748b;">
                            The longer action (<span style="color: #f0b45a; font-weight: 600;">walking</span>) was in progress. Then the shorter event (<span style="color: #d97757; font-weight: 600;">started raining</span>) interrupted it.
                        </p>
                    </div>

                    <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                        <div style="background: #f8fafc; padding: 0.875rem; border-radius: 0.5rem; border-left: 3px solid #f0b45a;">
                            <p style="margin: 0; font-size: 0.875rem;">She <span style="color: #f0b45a; font-weight: 600;">was studying</span> when her phone <span style="color: #d97757; font-weight: 600;">rang</span>.</p>
                        </div>
                        <div style="background: #f8fafc; padding: 0.875rem; border-radius: 0.5rem; border-left: 3px solid #f0b45a;">
                            <p style="margin: 0; font-size: 0.875rem;">We <span style="color: #f0b45a; font-weight: 600;">were eating</span> dinner when someone <span style="color: #d97757; font-weight: 600;">knocked</span> on the door.</p>
                        </div>
                        <div style="background: #f8fafc; padding: 0.875rem; border-radius: 0.5rem; border-left: 3px solid #f0b45a;">
                            <p style="margin: 0; font-size: 0.875rem;">They <span style="color: #f0b45a; font-weight: 600;">were playing</span> soccer when the coach <span style="color: #d97757; font-weight: 600;">arrived</span>.</p>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem; padding: 1rem; background: #fef9f3; border-left: 4px solid #d97757; border-radius: 0.25rem;">
                        <p style="margin: 0; font-size: 0.875rem;"><strong>🎯 The Pattern:</strong> Past Continuous (was/were + verb-ing) = the background scene. Past Simple (verb-ed) = the sudden event that interrupts. This is THE most common use of Past Continuous!</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The 'When' Pattern",
                content: "The word 'when' is your clue: 'I was walking WHEN it started raining.' The 'when' introduces the interrupting event (Past Simple), while the main clause shows what was in progress (Past Continuous).",
            },
            exercises: [
                {
                    id: "ex-timeline-pc-1",
                    title: "Practice: Identify the Interruption",
                    instructions: "In each sentence, which action is the ONGOING action (Past Continuous) and which is the INTERRUPTION (Past Simple)?",
                    items: [
                        {
                            type: "radio",
                            label: "I <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>cooking</span> when the fire alarm went off.",
                            options: [
                                { value: "a", label: "Ongoing: cooking (PC), Interruption: alarm went off (PS)" },
                                { value: "b", label: "Ongoing: alarm went off (PC), Interruption: cooking (PS)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "She <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>reading</span> when her friend called.",
                            options: [
                                { value: "b", label: "Ongoing: called (PC), Interruption: reading (PS)" },
                                { value: "a", label: "Ongoing: reading (PC), Interruption: called (PS)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "They <span class=\'eg-helper\'>were</span> <span class=\'eg-verb\'>watching</span> TV when the power went out.",
                            options: [
                                { value: "a", label: "Ongoing: watching TV (PC), Interruption: power went out (PS)" },
                                { value: "b", label: "Ongoing: power went out (PC), Interruption: watching TV (PS)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "while-vs-when",
            stepNumber: 3,
            title: "While vs When: Build Clear Past Stories",
            icon: "🧭",
            explanation: `
                <h3>Use <strong>while</strong> for longer background actions. Use <strong>when</strong> for shorter events.</h3>
                <p>This pattern helps listeners understand which action was already in progress and which action interrupted it.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.25rem 0;">
                    <div style="background: #fef9f3; border: 2px solid #f0b45a; border-radius: 0.5rem; padding: 1rem;">
                        <h4 style="margin-top: 0; color: #f0b45a;">WHILE + Past Continuous</h4>
                        <p style="margin: 0.5rem 0;">Shows the longer background action.</p>
                        <p style="margin: 0; font-size: 0.92rem;">While I <strong>was cooking</strong>, my daughter was setting the table.</p>
                    </div>
                    <div style="background: #fff5f0; border: 2px solid #d97757; border-radius: 0.5rem; padding: 1rem;">
                        <h4 style="margin-top: 0; color: #d97757;">WHEN + Past Simple</h4>
                        <p style="margin: 0.5rem 0;">Introduces the short interrupting event.</p>
                        <p style="margin: 0; font-size: 0.92rem;">I was cooking <strong>when</strong> the smoke alarm rang.</p>
                    </div>
                </div>

                <div style="background: #f8fafc; border-left: 4px solid #f0b45a; border-radius: 0.5rem; padding: 1rem;">
                    <p style="margin: 0;"><strong>Pattern:</strong> While + Past Continuous, Past Continuous OR Past Continuous + when + Past Simple</p>
                    <p style="margin: 0.5rem 0 0 0;">Examples: "While I was walking, I was listening to a podcast." / "I was walking when I slipped on ice."</p>
                </div>
            `,
            tipBox: {
                title: "💡 Quick Rule",
                content: "If both actions were long and parallel, use while + Past Continuous in both clauses. If one action interrupts, use when + Past Simple for the interruption.",
            },
            exercises: [
                {
                    id: "ex-while-when-story-1",
                    title: "Story Completion: While or When?",
                    instructions: "Complete each sentence with while/when and the correct tense.",
                    items: [
                        { type: "text", label: "I ___ (walk) to the bus stop ___ I slipped on ice.", expectedAnswer: "was walking when" },
                        { type: "text", label: "___ I ___ (fill out) the report, my manager was asking questions.", expectedAnswer: "While I was filling out" },
                        { type: "text", label: "My neighbors ___ (play) loud music ___ I was trying to sleep.", expectedAnswer: "were playing while" },
                        { type: "text", label: "She ___ (wait) for the train ___ she saw her coworker.", expectedAnswer: "was waiting when" },
                    ],
                },
                {
                    id: "ex-while-when-scramble-1",
                    title: "Word Scramble: Build the Pattern",
                    instructions: "Reorder the words to make correct while/when sentences.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "was / while / cooking / he / I / dishes / washing / the / was",
                            words: ["was", "while", "cooking", "he", "I", "dishes", "washing", "the", "was"],
                            correctAnswer: "I was cooking while he was washing the dishes",
                        },
                        {
                            type: "word-scramble",
                            label: "phone / when / was / the / rang / I / driving",
                            words: ["phone", "when", "was", "the", "rang", "I", "driving"],
                            correctAnswer: "I was driving when the phone rang",
                        },
                    ],
                },
            ],
        },
        {
            id: "comparison",
            stepNumber: 4,
            title: "Past Continuous vs Past Simple",
            icon: "⚖️",
            explanation: `
                <h3>Background vs Main Event</h3>
                <p>Past Continuous usually gives context; Past Simple usually gives the key event.</p>
            `,
            comparison: {
                title: "Side-by-Side Comparison",
                leftLabel: "Past Continuous",
                rightLabel: "Past Simple",
                rows: [
                    { label: "Focus", left: "In progress (background)", right: "Completed (main event)" },
                    { label: "Duration", left: "Longer action over time", right: "Shorter/point action" },
                    { label: "Time Signals", left: "while, at 10 PM, all evening", right: "when, suddenly, then, last night" },
                    { label: "Example", left: "I was walking home...", right: "...when it started raining." },
                    { label: "Example", left: "She was studying...", right: "...when the phone rang." },
                ],
            },
            tipBox: {
                title: "💡 Memory Trick",
                content: "Think movie scene: Past Continuous is the background camera shot; Past Simple is the moment something happens.",
            },
            exercises: [
                {
                    id: "ex-comparison-past-cont-1",
                    title: "Choose the Best Pair",
                    instructions: "Pick the sentence that correctly combines background + event.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is best?",
                            options: [
                                { value: "a", label: "I was taking a shower when the power went out." },
                                { value: "b", label: "I took a shower when the power was going out." },
                                { value: "c", label: "I was taking a shower when the power was go out." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence shows parallel background actions?",
                            options: [
                                { value: "b", label: "While we cooked, the kids set the table." },
                                { value: "a", label: "While we were cooking, the kids were setting the table." },
                                { value: "c", label: "While we are cooking, the kids were setting the table." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Mistakes with Past Continuous",
            icon: "⚠️",
            explanation: `
                <h3>Three Problems Learners Often Make</h3>
                <ul style="margin: 0.75rem 0 0 0;">
                    <li>Using Past Continuous for a short, completed one-time action</li>
                    <li>Using stative verbs in Past Continuous (I was knowing)</li>
                    <li>Using "while" with Past Simple when a background action is intended</li>
                </ul>
            `,
            usageMeanings: [
                {
                    title: "❌ Mistake 1: Past Continuous for Completed Events",
                    description: "Use Past Simple for short completed actions",
                    examples: [
                        {
                            sentence: "❌ The bus <span style=\"color: #ef4444;\">was arriving</span> at 8:01.",
                            explanation: "✓ The bus <strong>arrived</strong> at 8:01.",
                        },
                        {
                            sentence: "❌ I <span style=\"color: #ef4444;\">was dropping</span> my keys yesterday.",
                            explanation: "✓ I <strong>dropped</strong> my keys yesterday.",
                        },
                    ],
                },
                {
                    title: "❌ Mistake 2: Stative Verbs in Past Continuous",
                    description: "Many state verbs usually stay in simple past",
                    examples: [
                        {
                            sentence: "❌ I <span style=\"color: #ef4444;\">was knowing</span> the answer.",
                            explanation: "✓ I <strong>knew</strong> the answer.",
                        },
                        {
                            sentence: "❌ She <span style=\"color: #ef4444;\">was having</span> two cars.",
                            explanation: "✓ She <strong>had</strong> two cars. (possession)",
                        },
                    ],
                },
                {
                    title: "❌ Mistake 3: While + Wrong Tense",
                    description: "When the action is ongoing, use Past Continuous after while",
                    examples: [
                        {
                            sentence: "❌ While I <span style=\"color: #ef4444;\">cooked</span>, he was cleaning.",
                            explanation: "✓ While I <strong>was cooking</strong>, he was cleaning.",
                        },
                        {
                            sentence: "✓ While I <strong>was cooking</strong>, the phone rang. (background + interruption)",
                            explanation: "✓ 'While' highlights the longer action in progress",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Stative Reminder",
                content: "Common stative verbs: know, believe, understand, love, hate, own, belong. In many cases, use Past Simple with these.",
            },
            exercises: [
                {
                    id: "ex-common-mistakes-past-1",
                    title: "Error Correction",
                    instructions: "Rewrite each sentence correctly.",
                    items: [
                        { type: "text", label: "I was knowing it was a bad idea.", expectedAnswer: "I knew it was a bad idea" },
                        { type: "text", label: "While we cooked, our neighbors were arguing.", expectedAnswer: "While we were cooking, our neighbors were arguing" },
                        { type: "text", label: "She was droping the plate when I walked in.", expectedAnswer: "She was dropping the plate when I walked in" },
                        { type: "text", label: "They was waiting outside when the office opened.", expectedAnswer: "They were waiting outside when the office opened" },
                        { type: "text", label: "He were helping another customer when I arrived.", expectedAnswer: "He was helping another customer when I arrived" },
                    ],
                },
                {
                    id: "ex-scene-setting-past-1",
                    title: "Scene-Setting Practice",
                    instructions: "Complete with Past Continuous to create a background scene.",
                    items: [
                        { type: "text", label: "At midnight, the wind ___ (blow) and people ___ (run) for shelter.", expectedAnswer: "was blowing and were running" },
                        { type: "text", label: "During the storm, the lights ___ (flash) and rain ___ (hit) the windows.", expectedAnswer: "were flashing and was hitting" },
                        { type: "text", label: "While the nurse ___ (ask) questions, the patient ___ (hold) his chest.", expectedAnswer: "was asking and was holding" },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 6,
            title: "Positive Form",
            explanation: `<p>Formula: <strong>was/were + verb-ing</strong>. Same pattern for everyone—just choose was or were.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "was/were", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I was sleeping when you called last night.",
                "You were standing by the door when I saw you.",
                "He was cooking dinner at 7 PM.",
                "She was walking to work when the bus passed her.",
                "We were watching a movie when the power went out.",
                "They were playing outside when it started raining.",
            ],
            exercises: [
                {
                    id: "ex-1",
                    title: "Exercise 1: Describe What Was Happening",
                    instructions: "Use was/were + verb-ing.",
                    items: [
                        { type: "text", label: "The children ___ (build) a snowman when their mom called them inside.", expectedAnswer: "were building" },
                        { type: "text", label: "My grandfather ___ (tell) stories about his childhood all evening.", expectedAnswer: "was telling" },
                        { type: "text", label: "The neighbors ___ (carry) groceries upstairs when the elevator stopped.", expectedAnswer: "were carrying" },
                    ],
                },
            ],
        },
        {
            id: "step-negative",
            stepNumber: 7,
            title: "Negative Form",
            explanation: `<p>Add <strong>not</strong> after was/were to show what wasn't happening.</p>`,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "wasn't/weren't", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I wasn't sleeping when you called—I was reading.",
                "They weren't paying attention when the teacher spoke.",
            ],
            exercises: [
                {
                    id: "ex-neg-1",
                    title: "Exercise 2: Say What Wasn't Happening",
                    instructions: "Use wasn't/weren't + verb-ing.",
                    items: [
                        { type: "text", label: "The customers ___ (not pay) attention when the clerk called their number.", expectedAnswer: "weren't paying" },
                        { type: "text", label: "My daughter ___ (not study) for her exam—she was texting her friends.", expectedAnswer: "wasn't studying" },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 8,
            title: "Question Form",
            explanation: `<p>Flip was/were to the front to ask about what was going on.</p>`,
            formula: [
                { text: "Was/Were", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            examples: [
                "Were you sleeping when I knocked?",
                "Was she cooking when you arrived?",
                "Were they playing outside when it started raining?",
            ],
            exercises: [
                {
                    id: "past-continuous-question-1",
                    title: "Practice: Past Continuous Question Form",
                    instructions: "Choose the correct question form for past continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the question form for past continuous?",
                            options: [
                                { value: "b", label: "Subject + was/were + verb-ing?" },
                                { value: "c", label: "Did + subject + verb-ing?" },
                                { value: "a", label: "Was/Were + subject + verb-ing?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which question is correct?",
                            options: [
                                { value: "a", label: "Were you sleeping when I knocked?" },
                                { value: "b", label: "You were sleeping when I knocked?" },
                                { value: "c", label: "Did you sleeping when I knocked?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which question correctly uses 'was'?",
                            options: [
                                { value: "b", label: "Were she cooking when you arrived?" },
                                { value: "a", label: "Was she cooking when you arrived?" },
                                { value: "c", label: "Was she cook when you arrived?" },
                            ],
                            expectedAnswer: "a",
                        },
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
                    <li><strong>Use:</strong> Actions in progress at a specific past time; background actions interrupted by shorter events</li>
                    <li><strong>Form:</strong> was/were + verb-ing</li>
                    <li><strong>Signal words:</strong> while, when, at 8pm yesterday, during, all night</li>
                    <li><strong>Need full tense contrast?</strong> Review <em>Continuous Tenses Review</em> for present vs past vs future choices.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "past-continuous-summary-1",
                    title: "Practice: Past Continuous Review",
                    instructions: "Test your understanding of past continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Past Continuous?",
                            options: [
                                { value: "b", label: "am/is/are + verb-ing" },
                                { value: "c", label: "will be + verb-ing" },
                                { value: "a", label: "was/were + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do you use Past Continuous?",
                            options: [
                                { value: "a", label: "Actions in progress at a specific past time; background actions interrupted by shorter events" },
                                { value: "b", label: "Actions happening right now" },
                                { value: "c", label: "Future actions in progress" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are signal words for Past Continuous?",
                            options: [
                                { value: "b", label: "now, at the moment, currently" },
                                { value: "a", label: "while, when, at 8pm yesterday, during, all night" },
                                { value: "c", label: "tomorrow, next week, soon" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I cooked when the phone rang." },
                                { value: "c", label: "I am cooking when the phone rang." },
                                { value: "a", label: "I was cooking when the phone rang." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses Past Continuous?",
                            options: [
                                { value: "a", label: "I was cleaning the house at 9 PM yesterday." },
                                { value: "b", label: "I cleaned the house at 9 PM yesterday." },
                                { value: "c", label: "I am cleaning the house at 9 PM yesterday." },
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
            question: "Which sentence correctly shows an interrupted action?",
            options: [
                { value: "b", label: "I cooked when the smoke alarm was ringing." },
                { value: "a", label: "I was cooking when the smoke alarm rang." },
                { value: "c", label: "I am cooking when the smoke alarm rang." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous (was cooking) is the longer background action; Past Simple (rang) is the interruption.",
            skillTag: "meaning-interrupted-action-past",
            difficulty: "medium",
        },
        {
            id: "quiz-2",
            question: "Which sentence fits 'action in progress at a specific past time'?",
            options: [
                { value: "b", label: "At 8 PM last night, we ate dinner." },
                { value: "c", label: "At 8 PM last night, we are eating dinner." },
                { value: "a", label: "At 8 PM last night, we were eating dinner." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous highlights what was happening at a specific past moment: were eating.",
            skillTag: "meaning-past-in-progress-specific-time",
            difficulty: "medium",
        },
        {
            id: "quiz-3",
            question: "Choose the correct form of 'be' for Past Continuous.",
            options: [
                { value: "b", label: "They were waiting for the bus." },
                { value: "a", label: "They was waiting for the bus." },
                { value: "c", label: "They are waiting for the bus." },
            ],
            correctAnswer: "b",
            explanation: "Past Continuous uses was/were + verb-ing: They were waiting.",
            skillTag: "form-past-cont-be-agreement",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which sentence shows two actions happening at the same time?",
            options: [
                { value: "b", label: "I cooked, and my roommate cleaned." },
                { value: "a", label: "While I was cooking, my roommate was cleaning." },
                { value: "c", label: "I am cooking, and my roommate cleaned." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous with 'while' often shows two background actions happening at the same time.",
            skillTag: "meaning-two-actions-same-time-past",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "Which sentence is NOT a good Past Continuous use?",
            options: [
                { value: "b", label: "She was studying when I texted her." },
                { value: "c", label: "They were talking when the teacher walked in." },
                { value: "a", label: "She was knowing the answer during the quiz." },
            ],
            correctAnswer: "a",
            explanation: "Stative verbs like 'know' usually avoid -ing; use Past Simple instead (She knew the answer.).",
            skillTag: "error-stative-verb-past-continuous",
            difficulty: "hard",
        },
        {
            id: "quiz-6",
            question: "Which question is correct?",
            options: [
                { value: "a", label: "Were you sleeping when I knocked?" },
                { value: "b", label: "Was you sleeping when I knocked?" },
                { value: "c", label: "Did you sleeping when I knocked?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Was/Were + subject + verb-ing.",
            skillTag: "form-past-cont-question",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which negative sentence is correct?",
            options: [
                { value: "b", label: "We didn't listening when the announcement played." },
                { value: "a", label: "We weren't listening when the announcement played." },
                { value: "c", label: "We wasn't listening when the announcement played." },
            ],
            correctAnswer: "a",
            explanation: "Negative Past Continuous is wasn't/weren't + verb-ing.",
            skillTag: "form-past-cont-negative",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Pick the best sentence to set the scene (background action).",
            options: [
                { value: "b", label: "I walked home when I saw the police lights." },
                { value: "c", label: "I am walking home when I saw the police lights." },
                { value: "a", label: "I was walking home when I saw the police lights." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous sets the scene for what was in progress when something happened.",
            skillTag: "meaning-interrupted-action-past",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Choose the best pair: longer action + interruption.",
            options: [
                { value: "a", label: "She was filling out the form when the pen ran out." },
                { value: "b", label: "She filled out the form when the pen was running out." },
                { value: "c", label: "She was fill out the form when the pen ran out." },
            ],
            correctAnswer: "a",
            explanation: "Background action uses was/were + verb-ing; the interruption uses Past Simple.",
            skillTag: "meaning-interrupted-action-past",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence is correct?",
            options: [
                { value: "b", label: "At midnight, my neighbors played loud music." },
                { value: "a", label: "At midnight, my neighbors were playing loud music." },
                { value: "c", label: "At midnight, my neighbors are playing loud music." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous works well with specific times to show an action in progress.",
            skillTag: "meaning-past-in-progress-specific-time",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which sentence has correct verb-ing form?",
            options: [
                { value: "a", label: "They were shoping when it started raining." },
                { value: "c", label: "They were shop when it started raining." },
                { value: "b", label: "They were shopping when it started raining." },
            ],
            correctAnswer: "b",
            explanation: "Shop → shopping (double the final consonant + ing).",
            skillTag: "spelling-ing-double-consonant",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Choose the best sentence to answer: 'What were you doing at 6 PM yesterday?'",
            options: [
                { value: "a", label: "I was cooking dinner." },
                { value: "b", label: "I cooked dinner." },
                { value: "c", label: "I cook dinner." },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous answers 'what was happening at that time' questions.",
            skillTag: "meaning-past-in-progress-specific-time",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Which sentence correctly uses 'while'?",
            options: [
                { value: "a", label: "While I cooked, the kids were doing homework." },
                { value: "b", label: "While I was cooking, the kids were doing homework." },
                { value: "c", label: "While I am cooking, the kids did homework." },
            ],
            correctAnswer: "b",
            explanation: "'While' often introduces the background action in Past Continuous.",
            skillTag: "meaning-two-actions-same-time-past",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "Was they waiting outside?" },
                { value: "c", label: "Did they waiting outside?" },
                { value: "b", label: "Were they waiting outside?" },
            ],
            correctAnswer: "b",
            explanation: "They → were. Question: Were they + verb-ing?",
            skillTag: "form-past-cont-be-agreement",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which time words often go with Past Continuous?",
            options: [
                { value: "a", label: "while, when, at 9 PM, all night" },
                { value: "b", label: "now, currently, right now" },
                { value: "c", label: "tomorrow, next week, soon" },
            ],
            correctAnswer: "a",
            explanation: "Past Continuous often appears with while/when and specific past times (at 9 PM, all night).",
            skillTag: "time-expressions-past-continuous",
            difficulty: "easy",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Past Continuous

    Skill map by skillTag:
    - meaning-interrupted-action-past: questions 1, 8, 9
    - meaning-past-in-progress-specific-time: questions 2, 10, 12
    - form-past-cont-be-agreement: questions 3, 14
    - meaning-two-actions-same-time-past: questions 4, 13
    - error-stative-verb-past-continuous: question 5
    - form-past-cont-question: question 6
    - form-past-cont-negative: question 7
    - spelling-ing-double-consonant: question 11
    - time-expressions-past-continuous: question 15

    How to use this data:
    - If many students miss questions 1, 8, or 9, spend more time on the Interrupted Action pattern:
      longer background action in Past Continuous + shorter event in Past Simple (was/were + verb-ing WHEN verb-2).
    - Weak scores on questions 2, 10, or 12 suggest confusion about "what was happening at a specific past time".
      Practice questions like "What were you doing at 6 PM yesterday?" and have students answer with Past Continuous.
    - If questions 3, 6, 7, or 14 are low, review the basic form chart: was/were + verb-ing, including negatives
      (wasn't/weren't) and question order (Was/Were + subject + verb-ing).
    - If question 5 is often wrong, highlight common stative verbs (know, like, understand, believe) and show that we
      normally use Past Simple for these in simple sentences.
    - Low scores on questions 4, 11, 13, or 15 indicate students may need more work with "while" sentences, -ing spelling
      rules, and time expressions (while/when, at 9 PM, all night). Use timelines and story chains to recycle these.
    */
};
