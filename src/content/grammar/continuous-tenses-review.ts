import type { InteractiveGuideContent } from "@/types/activity";

export const continuousTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Continuous Tenses Review: The -ing Action Tenses",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(240, 180, 90, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <h3 style="margin-top: 0; color: #7c3aed; font-size: 1.2rem;">🎯 The Big Idea</h3>
                    <p style="margin-bottom: 0;">Continuous tenses are one family: <strong style="color: #c86b51;">be + verb-ing</strong>. The structure stays consistent, but the time perspective changes: present, past, or future.</p>
                </div>

                <p>All the "-ing" tenses in one place: what's happening now, what was happening then, and what will be happening later.</p>
                <p><strong>Continuous Tenses:</strong> Present (now/temporary), Past (in progress in the past), Future (in progress at a future time)</p>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.25rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.05rem;">🗣️ When You'll Use This Review</h3>
                    <ul style="margin: 0;">
                        <li>Switching tenses clearly while telling a full story</li>
                        <li>Reporting incidents ("I was walking when...", "I'm still recovering...", "I'll be meeting...")</li>
                        <li>Professional communication across time frames in work, housing, and healthcare contexts</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "continuous-tenses-review-intro-1",
                    title: "Practice: Understanding Continuous Tenses",
                    instructions: "Identify what continuous tenses describe.",
                    items: [
                        {
                            type: "radio",
                            label: "What do continuous tenses show?",
                            options: [
                                { value: "b", label: "Completed actions" },
                                { value: "a", label: "Actions in motion - what's happening now, was happening then, or will be happening later" },
                                { value: "c", label: "Habits and routines" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are the three continuous tenses?",
                            options: [
                                { value: "b", label: "Present, Past, Future Simple" },
                                { value: "c", label: "Perfect tenses only" },
                                { value: "a", label: "Present Continuous (now/temporary), Past Continuous (in progress in past), Future Continuous (in progress at future time)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What do all continuous tenses have in common?",
                            options: [
                                { value: "a", label: "They all use -ing form and show actions in progress" },
                                { value: "b", label: "They all use past participles" },
                                { value: "c", label: "They all describe completed actions" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "comparison",
            stepNumber: 1,
            title: "When Real Life Needs Continuous Tenses",
            icon: "⭐",
            explanation: `
                <h3>The "Why" Matters More Than the "How"</h3>
                <p>Continuous tenses show actions in motion. They answer: "What's happening right now?" or "What was going on then?"</p>
            `,
            usageMeanings: [
                {
                    title: "▶️ Present Continuous: Actions Happening RIGHT NOW",
                    description: "For actions in progress as you speak",
                    examples: [
                        {
                            sentence: "I <span style=\"color: #8b5cf6; font-weight: 600;\">am watching</span> TV while my dinner cooks.",
                            explanation: "✓ In-progress action this exact moment",
                        },
                        {
                            sentence: "She <span style=\"color: #8b5cf6; font-weight: 600;\">is talking</span> on the phone, and her kid <span style=\"color: #8b5cf6; font-weight: 600;\">is yelling</span> in the background.",
                            explanation: "✓ Multiple ongoing actions right now",
                        },
                        {
                            sentence: "They <span style=\"color: #8b5cf6; font-weight: 600;\">are waiting</span> for the bus that's late again.",
                            explanation: "✓ Still happening as we speak",
                        },
                    ],
                },
                {
                    title: "⏳ Present Continuous: Temporary Situations",
                    description: "For short-term arrangements that aren't permanent",
                    examples: [
                        {
                            sentence: "I'm <span style=\"color: #8b5cf6; font-weight: 600;\">staying</span> with my sister this month while my apartment gets painted.",
                            explanation: "✓ Temporary living situation",
                        },
                        {
                            sentence: "He <span style=\"color: #8b5cf6; font-weight: 600;\">is working</span> the closing shift this week.",
                            explanation: "✓ Short-term schedule change",
                        },
                        {
                            sentence: "We <span style=\"color: #8b5cf6; font-weight: 600;\">are trying</span> a new recipe for dinner tonight.",
                            explanation: "✓ Temporary experiment",
                        },
                    ],
                },
                {
                    title: "🤝 Present Continuous: Near Future Plans",
                    description: "For arranged future activities (like 'going to')",
                    examples: [
                        {
                            sentence: "I'm <span style=\"color: #8b5cf6; font-weight: 600;\">meeting</span> my friend for coffee at 3 PM.",
                            explanation: "✓ Scheduled soon - confirmed plan",
                        },
                        {
                            sentence: "They're <span style=\"color: #8b5cf6; font-weight: 600;\">going</span> to the movies tonight.",
                            explanation: "✓ Near-future arrangement",
                        },
                    ],
                },
                {
                    title: "📅 Past Continuous: Ongoing Past Actions",
                    description: "For actions in progress at a specific past time",
                    examples: [
                        {
                            sentence: "I <span style=\"color: #f0b45a; font-weight: 600;\">was walking</span> home when it started raining.",
                            explanation: "✓ Ongoing action interrupted by another",
                        },
                        {
                            sentence: "She <span style=\"color: #f0b45a; font-weight: 600;\">was studying</span> when her phone rang.",
                            explanation: "✓ Background action at specific past moment",
                        },
                        {
                            sentence: "They <span style=\"color: #f0b45a; font-weight: 600;\">were playing</span> soccer at 3 PM yesterday.",
                            explanation: "✓ In progress during a past time period",
                        },
                    ],
                },
                {
                    title: "🔮 Future Continuous: Future Ongoing Actions",
                    description: "For actions that will be in progress at a future time",
                    examples: [
                        {
                            sentence: "I'll <span style=\"color: #06b6d4; font-weight: 600;\">be sleeping</span> when you arrive at midnight.",
                            explanation: "✓ Action in progress during another future event",
                        },
                        {
                            sentence: "She <span style=\"color: #06b6d4; font-weight: 600;\">will be working</span> from 9 to 5 tomorrow.",
                            explanation: "✓ Ongoing future time period",
                        },
                        {
                            sentence: "They <span style=\"color: #06b6d4; font-weight: 600;\">will be traveling</span> during the holidays.",
                            explanation: "✓ Future duration of action",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 The Key Pattern",
                content: "All continuous tenses use: be + verb-ing. Only the time changes: am/is/are (now), was/were (past), will be (future).",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Why This Continuous Tense? Think About Meaning",
                    instructions: "Read each situation and identify WHY we use continuous tense. Think about the timing!",
                    items: [
                        {
                            type: "radio",
                            label: '"The baby <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>sleeping</span> in the nursery while I prepare her bottle."',
                            options: [
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                                { value: "now", label: "Action happening right now" },
                            ],
                            expectedAnswer: "now",
                        },
                        {
                            type: "radio",
                            label: '"My uncle <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>renting</span> an apartment while his house is being renovated."',
                            options: [
                                { value: "temporary", label: "Temporary situation" },
                                { value: "now", label: "Action happening right now" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "temporary",
                        },
                        {
                            type: "radio",
                            label: '"The hikers <span class=\'eg-helper\'>were</span> <span class=\'eg-verb\'>climbing</span> the trail when the thunderstorm started."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                            ],
                            expectedAnswer: "past-ongoing",
                        },
                        {
                            type: "radio",
                            label: '"The volunteers <span class=\'eg-helper\'>will be</span> <span class=\'eg-verb\'>serving</span> lunch when the guests arrive."',
                            options: [
                                { value: "now", label: "Action happening right now" },
                                { value: "temporary", label: "Temporary situation" },
                                { value: "future-ongoing", label: "Future ongoing action" },
                                { value: "near-future", label: "Near-future plan" },
                                { value: "past-ongoing", label: "Past ongoing action" },
                            ],
                            expectedAnswer: "future-ongoing",
                        },
                    ],
                },
                {
                    id: "ex-comparison-2",
                    title: "Real-Life Continuous Situations",
                    instructions: "Choose the continuous tense that fits each scenario.",
                    items: [
                        {
                            type: "radio",
                            label: '"The kids ___ (play) in the park right now." (action in progress)',
                            options: [
                                { value: "were playing", label: "were playing" },
                                { value: "will be playing", label: "will be playing" },
                                { value: "are playing", label: "are playing" },
                            ],
                            expectedAnswer: "are playing",
                        },
                        {
                            type: "radio",
                            label: '"My sister ___ (practice) piano when the power went out." (past ongoing)',
                            options: [
                                { value: "was practicing", label: "was practicing" },
                                { value: "is practicing", label: "is practicing" },
                                { value: "will be practicing", label: "will be practicing" },
                            ],
                            expectedAnswer: "was practicing",
                        },
                        {
                            type: "radio",
                            label: '"They ___ (travel) next month." (future ongoing)',
                            options: [
                                { value: "are traveling", label: "are traveling" },
                                { value: "will be traveling", label: "will be traveling" },
                                { value: "were traveling", label: "were traveling" },
                            ],
                            expectedAnswer: "will be traveling",
                        },
                    ],
                },
            ],
        },
        {
            id: "continuous-vs-simple",
            stepNumber: 2,
            title: "Continuous vs Simple: Which Lens to Use?",
            icon: "🔍",
            explanation: `
                <h3>Continuous = action in motion. Simple = fact, routine, or completed event.</h3>
                <p>This comparison helps you decide whether to focus on process/duration or a general/finished fact.</p>

                <div style="overflow-x: auto; margin-top: 1rem;">
                    <table style="width: 100%; min-width: 680px; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Time Frame</th>
                                <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Continuous (in progress)</th>
                                <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Simple (habit/fact/event)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 600;">Present</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">I am working late today.</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">I work nights.</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 600;">Past</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">I was walking when it started raining.</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">It started raining at 6 PM.</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 600;">Future</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">I will be driving at 8 PM.</td>
                                <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">I will drive you home.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            tipBox: {
                title: "💡 Choice Rule",
                content: "Ask: Do I need to show the action as ongoing at that time? If yes, use continuous. If no, simple tense is often better.",
            },
            exercises: [
                {
                    id: "ex-continuous-vs-simple-1",
                    title: "Choose Continuous or Simple",
                    instructions: "Pick the best sentence for each context.",
                    items: [
                        {
                            type: "radio",
                            label: "You are describing your normal work routine:",
                            options: [
                                { value: "simple", label: "I work from 9 to 5." },
                                { value: "continuous", label: "I am working from 9 to 5." },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "You are talking about tonight at 9 PM:",
                            options: [
                                { value: "future-simple", label: "I will study at 9 PM and finish quickly." },
                                { value: "future-cont", label: "I will be studying at 9 PM." },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "You want to show background + interruption:",
                            options: [
                                { value: "past-mix", label: "I was cooking when the phone rang." },
                                { value: "past-simple", label: "I cooked when the phone rang." },
                            ],
                            expectedAnswer: "past-mix",
                        },
                    ],
                },
            ],
        },
        {
            id: "timeline-visualization",
            stepNumber: 3,
            title: "Timeline: Duration Across All Three Times",
            icon: "⏰",
            explanation: `
                <div style="max-width: 700px; margin: 2rem auto; padding: 2rem; background: linear-gradient(135deg, rgba(240, 180, 90, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.2);">
                    <p style="text-align: center; font-size: 1.125rem; margin-bottom: 2rem; color: #2b3a4a; font-weight: 600;">
                        Continuous tenses emphasize DURATION—actions happening over time
                    </p>

                    <!-- Timeline with three horizontal duration bars stacked vertically -->
                    <div style="display: flex; flex-direction: column; gap: 2rem; margin: 2rem 0;">

                        <!-- Past Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(240, 180, 90, 0) 0%, rgba(240, 180, 90, 0.9) 10%, rgba(240, 180, 90, 1) 50%, rgba(240, 180, 90, 0.9) 90%, rgba(240, 180, 90, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(240, 180, 90, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #f0b45a; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #f0b45a; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    was/were + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #f0b45a; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    PAST CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #f0b45a; font-weight: 700;">was walking</span> home
                                </div>
                            </div>
                        </div>

                        <!-- Present Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.9) 10%, rgba(139, 92, 246, 1) 50%, rgba(139, 92, 246, 0.9) 90%, rgba(139, 92, 246, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    am/is/are + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #8b5cf6; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    PRESENT CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #8b5cf6; font-weight: 700;">am walking</span> home
                                </div>
                            </div>
                        </div>

                        <!-- Future Continuous bar -->
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="flex: 1; position: relative; height: 50px; background: linear-gradient(90deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 0.9) 10%, rgba(6, 182, 212, 1) 50%, rgba(6, 182, 212, 0.9) 90%, rgba(6, 182, 212, 0) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);">
                                <!-- Dots at both ends -->
                                <div style="position: absolute; left: 10%; width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; border: 2px solid white;"></div>
                                <div style="position: absolute; right: 10%; width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; border: 2px solid white;"></div>
                                <!-- Formula inside bar -->
                                <div style="color: white; font-weight: 700; font-size: 0.875rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                                    will be + verb-ing
                                </div>
                            </div>
                            <div style="min-width: 200px; text-align: left;">
                                <div style="font-weight: 700; color: #06b6d4; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                    FUTURE CONTINUOUS
                                </div>
                                <div style="color: #2b3a4a; font-size: 0.85rem;">
                                    I <span style="color: #06b6d4; font-weight: 700;">will be walking</span> home
                                </div>
                            </div>
                        </div>

                    </div>

                    <div style="margin-top: 1.5rem; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 0.5rem; padding: 1rem;">
                        <h4 style="margin-top: 0; color: #c2410c;">Interrupted Action Pattern (Past)</h4>
                        <p style="margin: 0;">I <strong>was walking</strong> home <strong>when</strong> it <strong>started</strong> raining.</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.88rem; color: #7c2d12;">Background duration (Past Continuous) + short point event (Past Simple)</p>
                    </div>

                    <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.85rem;">
                            <h4 style="margin: 0 0 0.35rem 0;">While Pattern</h4>
                            <p style="margin: 0; font-size: 0.9rem;">While I <strong>was cooking</strong>, my son <strong>was setting</strong> the table.</p>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.85rem;">
                            <h4 style="margin: 0 0 0.35rem 0;">When Pattern</h4>
                            <p style="margin: 0; font-size: 0.9rem;">I <strong>was cooking</strong> when the smoke alarm <strong>went off</strong>.</p>
                        </div>
                    </div>

                    <div style="margin-top: 1rem; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 0.5rem; padding: 0.9rem;">
                        <p style="margin: 0;"><strong>Duration vs Point-in-Time:</strong> Continuous answers "What was happening during this period?" Simple often answers "What happened at this point?"</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Pattern",
                content: "All three use the SAME -ing verb. Only 'be' changes across time: was/were (past), am/is/are (now), will be (future). Pair this with while/when patterns to show duration vs interruptions clearly.",
            },
            exercises: [
                {
                    id: "continuous-tenses-review-timeline-1",
                    title: "Practice: Reading the Timeline",
                    instructions: "Choose the continuous tense that matches the time (past, now, future).",
                    items: [
                        {
                            type: "radio",
                            label: '"At 7 PM last night, I ___ dinner."',
                            options: [
                                { value: "am cooking", label: "am cooking" },
                                { value: "will be cooking", label: "will be cooking" },
                                { value: "was cooking", label: "was cooking" },
                            ],
                            expectedAnswer: "was cooking",
                        },
                        {
                            type: "radio",
                            label: '"Right now, the kids ___ in the living room."',
                            options: [
                                { value: "are playing", label: "are playing" },
                                { value: "were playing", label: "were playing" },
                                { value: "will be playing", label: "will be playing" },
                            ],
                            expectedAnswer: "are playing",
                        },
                        {
                            type: "radio",
                            label: '"Tomorrow at 9 AM, I ___ on the bus to work."',
                            options: [
                                { value: "was riding", label: "was riding" },
                                { value: "will be riding", label: "will be riding" },
                                { value: "am riding", label: "am riding" },
                            ],
                            expectedAnswer: "will be riding",
                        },
                        {
                            type: "radio",
                            label: "Which form of 'be' is used in Future Continuous?",
                            options: [
                                { value: "are", label: "are" },
                                { value: "was", label: "was" },
                                { value: "will be", label: "will be" },
                            ],
                            expectedAnswer: "will be",
                        },
                    ],
                },
            ],
        },
        {
            id: "common-mistakes-all-continuous",
            stepNumber: 4,
            title: "Common Mistakes Across All Continuous Tenses",
            icon: "⚠️",
            explanation: `
                <h3>These errors appear in present, past, and future continuous</h3>
                <p>If you fix these four areas, your accuracy improves fast.</p>
            `,
            verbTable: {
                title: "High-Frequency Stative Verbs (Usually Not Continuous)",
                headers: ["Category", "Examples"],
                rows: [
                    ["Emotion", "love, hate, prefer, want, need"],
                    ["Mental state", "know, believe, understand, remember"],
                    ["Possession", "have (possession), own, belong"],
                    ["State/appearance", "seem, appear, consist, contain"],
                ],
            },
            usageMeanings: [
                {
                    title: "❌ Missing 'be' Verb",
                    description: "Every continuous tense needs a form of 'be'",
                    examples: [
                        {
                            sentence: "❌ She <span style=\"color: #ef4444;\">working</span> now.",
                            explanation: "✓ She <strong>is working</strong> now.",
                        },
                        {
                            sentence: "❌ They <span style=\"color: #ef4444;\">waiting</span> when I arrived.",
                            explanation: "✓ They <strong>were waiting</strong> when I arrived.",
                        },
                    ],
                },
                {
                    title: "❌ Wrong Form After 'be'",
                    description: "Use -ing after am/is/are, was/were, will be",
                    examples: [
                        {
                            sentence: "❌ I am <span style=\"color: #ef4444;\">study</span> tonight.",
                            explanation: "✓ I am <strong>studying</strong> tonight.",
                        },
                        {
                            sentence: "❌ We will be <span style=\"color: #ef4444;\">work</span> late.",
                            explanation: "✓ We will be <strong>working</strong> late.",
                        },
                    ],
                },
                {
                    title: "❌ -ing Spelling Problems",
                    description: "Watch double consonants and dropping final -e",
                    examples: [
                        {
                            sentence: "❌ runing / writeing / stoping",
                            explanation: "✓ running / writing / stopping",
                        },
                    ],
                },
                {
                    title: "❌ Confusing Continuous with Simple",
                    description: "Use simple for facts/habits and many stative verbs",
                    examples: [
                        {
                            sentence: "❌ I am knowing the answer.",
                            explanation: "✓ I <strong>know</strong> the answer.",
                        },
                        {
                            sentence: "❌ I was owning a car in 2010.",
                            explanation: "✓ I <strong>owned</strong> a car in 2010.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Fast Self-Check",
                content: "Check 1) Is 'be' present? 2) Is the main verb in -ing? 3) Is this verb action-type or stative?",
            },
            exercises: [
                {
                    id: "ex-common-mistakes-all-cont-1",
                    title: "Fix the Mistake",
                    instructions: "Rewrite each sentence correctly.",
                    items: [
                        { type: "text", label: "He working at the front desk today.", expectedAnswer: "He is working at the front desk today" },
                        { type: "text", label: "I was know the answer yesterday.", expectedAnswer: "I knew the answer yesterday" },
                        { type: "text", label: "They will be come at 7 PM.", expectedAnswer: "They will be coming at 7 PM" },
                        { type: "text", label: "She is runing late right now.", expectedAnswer: "She is running late right now" },
                    ],
                },
            ],
        },
        {
            id: "commonly-confused-patterns",
            stepNumber: 5,
            title: "Commonly Confused Patterns",
            icon: "🧠",
            explanation: `
                <h3>Use meaning + time clues to choose the right tense</h3>
                <p>These are high-confusion pairs for multilingual learners.</p>
            `,
            usageMeanings: [
                {
                    title: "1) Present Continuous vs Present Perfect Continuous",
                    description: "Now in progress vs duration up to now",
                    examples: [
                        {
                            sentence: "I <strong>am waiting</strong> for the bus. (what is happening now)",
                            explanation: "Current action in progress",
                        },
                        {
                            sentence: "I <strong>have been waiting</strong> for two hours. (duration until now)",
                            explanation: "Length of ongoing action",
                        },
                    ],
                },
                {
                    title: "2) Past Continuous vs Past Simple",
                    description: "Background process vs completed event",
                    examples: [
                        {
                            sentence: "I <strong>was walking</strong> home when it started raining.",
                            explanation: "Background + interruption",
                        },
                        {
                            sentence: "I <strong>walked</strong> home at 6 PM.",
                            explanation: "Completed event at a point in time",
                        },
                    ],
                },
                {
                    title: "3) Future Continuous vs Will / Going to / Present Continuous (future)",
                    description: "In progress at future point vs decision/plan types",
                    examples: [
                        {
                            sentence: "I'll <strong>be working</strong> at 8 PM. (future action in progress)",
                            explanation: "Future Continuous",
                        },
                        {
                            sentence: "I'll help you. (decision now) / I'm going to move. (intention) / I'm meeting Sara at 4. (arrangement)",
                            explanation: "Other future forms",
                        },
                    ],
                },
                {
                    title: "4) Time Expressions Matter",
                    description: "Match tense to signal words and context",
                    examples: [
                        {
                            sentence: "<strong>Right now</strong> → Present Continuous",
                            explanation: "Action in progress now",
                        },
                        {
                            sentence: "<strong>At 9 PM yesterday</strong> → Past Continuous / <strong>This time tomorrow</strong> → Future Continuous",
                            explanation: "Specific past or future points",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Decision Frame",
                content: "Ask: What time is this? Is the action in progress or completed? Do I need duration, interruption, or arrangement meaning?",
            },
            exercises: [
                {
                    id: "ex-confused-patterns-1",
                    title: "Which Tense Fits Best?",
                    instructions: "Choose the tense that matches the meaning and time clue.",
                    items: [
                        {
                            type: "radio",
                            label: "You started waiting at 8:00. It is 10:00 now.",
                            options: [
                                { value: "ppc", label: "I have been waiting for two hours." },
                                { value: "pc", label: "I am waiting for two hours." },
                                { value: "ps", label: "I waited for two hours." },
                            ],
                            expectedAnswer: "ppc",
                        },
                        {
                            type: "radio",
                            label: "At 9 PM tomorrow, during your shift:",
                            options: [
                                { value: "future-simple", label: "I will work." },
                                { value: "future-cont", label: "I will be working." },
                                { value: "present-simple", label: "I work." },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "You describe a completed event yesterday at 6 PM:",
                            options: [
                                { value: "past-cont", label: "I was finishing the report at 6 PM." },
                                { value: "present-cont", label: "I am finishing the report at 6 PM yesterday." },
                                { value: "past-simple", label: "I finished the report at 6 PM." },
                            ],
                            expectedAnswer: "past-simple",
                        },
                    ],
                },
                {
                    id: "ex-which-continuous-diagnostic-1",
                    title: "Diagnostic: Which Continuous Tense?",
                    instructions: "Write the best continuous form for each context.",
                    items: [
                        { type: "text", label: "Right now, she ___ (talk) with the landlord.", expectedAnswer: "is talking" },
                        { type: "text", label: "At midnight, they ___ (drive) to the hospital.", expectedAnswer: "were driving" },
                        { type: "text", label: "This time next week, we ___ (travel) to visit family.", expectedAnswer: "will be traveling" },
                        { type: "text", label: "While I ___ (fill out) the form, the clerk was explaining the process.", expectedAnswer: "was filling out" },
                    ],
                },
            ],
        },
        {
            id: "future-choice-flow",
            stepNumber: 6,
            title: "Future Choices: Present Continuous, Going To, Will, or Future Continuous?",
            icon: "🧭",
            explanation: `
                <h3>Use a fast decision system so you do not overthink.</h3>
                <p>First: when was the decision made? Next: are you describing the middle of an action at a future time?</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.2rem; margin: 1rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #4f46e5;">Future Decision Flow</h4>
                    <div style="display: grid; gap: 0.75rem;">
                        <div style="background: #f5f3ff; border-left: 4px solid #6366f1; padding: 0.75rem; border-radius: 0.45rem;">
                            <strong>Arranged appointment?</strong> -> <strong>Present Continuous (future)</strong><br/>
                            <span style="font-size: 0.9rem;">"I'm meeting my dentist at 2 PM."</span>
                        </div>
                        <div style="background: #ecfeff; border-left: 4px solid #06b6d4; padding: 0.75rem; border-radius: 0.45rem;">
                            <strong>Plan before speaking or visible evidence?</strong> -> <strong>be going to + base verb</strong><br/>
                            <span style="font-size: 0.9rem;">"I'm going to study tonight." / "It's going to rain."</span>
                        </div>
                        <div style="background: #fef9f3; border-left: 4px solid #f59e0b; padding: 0.75rem; border-radius: 0.45rem;">
                            <strong>Instant reaction, offer, or promise?</strong> -> <strong>will + base verb</strong><br/>
                            <span style="font-size: 0.9rem;">"I'll help you with that."</span>
                        </div>
                        <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 0.75rem; border-radius: 0.45rem;">
                            <strong>Middle of an action at a future time?</strong> -> <strong>Future Continuous</strong><br/>
                            <span style="font-size: 0.9rem;">"At 8 PM, I'll be working."</span>
                        </div>
                    </div>
                </div>

                <h3>Clue Word Map</h3>
                <div style="overflow-x: auto; margin-top: 0.75rem;">
                    <table style="width: 100%; min-width: 740px; border-collapse: collapse; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 0.7rem; border: 1px solid #e2e8f0; text-align: left;">Form</th>
                                <th style="padding: 0.7rem; border: 1px solid #e2e8f0; text-align: left;">Good Clues</th>
                                <th style="padding: 0.7rem; border: 1px solid #e2e8f0; text-align: left;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0; font-weight: 600;">Present Continuous (future)</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">calendar event, arranged time, fixed meeting</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">We're meeting the landlord at 4 PM.</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0; font-weight: 600;">Going to</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">plan before now, look!/watch out!, clear evidence</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">Look at those clouds. It's going to rain.</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0; font-weight: 600;">Will</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">Oh!, wait!, no problem, I promise, probably</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">The phone is ringing. I'll answer it.</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0; font-weight: 600;">Future Continuous</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">at 8 PM tomorrow, this time next week, when you arrive</td>
                                <td style="padding: 0.7rem; border: 1px solid #e2e8f0;">At 8 PM, I'll be studying.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            tipBox: {
                title: "💡 Zero-Stress Rule",
                content: "Calendar = Present Continuous. Plan/evidence = going to. Instant choice/promise = will. In progress at future time = Future Continuous.",
            },
            exercises: [
                {
                    id: "ex-future-choice-flow-review-1",
                    title: "Future Choice Game: Read the Clue",
                    instructions: "Choose the best future form for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You react now because your friend dropped heavy bags:",
                            options: [
                                { value: "will", label: "I'll help you carry those." },
                                { value: "going-to", label: "I'm going to help you carry those (I planned this yesterday)." },
                                { value: "future-cont", label: "I'll be helping you carry those at 8 PM." },
                                { value: "present-cont-future", label: "I'm helping you carry those tomorrow at 2." },
                            ],
                            expectedAnswer: "will",
                        },
                        {
                            type: "radio",
                            label: "You can see dark clouds and lightning:",
                            options: [
                                { value: "going-to", label: "It's going to storm." },
                                { value: "will", label: "It storms." },
                                { value: "future-cont", label: "It will be storm." },
                                { value: "present-cont-future", label: "It's storming tomorrow." },
                            ],
                            expectedAnswer: "going-to",
                        },
                        {
                            type: "radio",
                            label: "At 10 PM tomorrow, you will be in the middle of your shift:",
                            options: [
                                { value: "future-cont", label: "I'll be working." },
                                { value: "will", label: "I'll work." },
                                { value: "going-to", label: "I'm going to work now." },
                                { value: "present-cont-future", label: "I'm working yesterday." },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "It is already fixed on your calendar for Friday at 4 PM:",
                            options: [
                                { value: "present-cont-future", label: "I'm meeting my advisor at 4 PM Friday." },
                                { value: "will", label: "I'll meet my advisor at 4 PM Friday, I guess." },
                                { value: "going-to", label: "I'm going to meet my advisor right now." },
                                { value: "future-cont", label: "I'll be meeting my advisor now." },
                            ],
                            expectedAnswer: "present-cont-future",
                        },
                    ],
                },
                {
                    id: "ex-future-choice-flow-review-2",
                    title: "Signal Match: Which Form?",
                    instructions: "Pick the form that each signal phrase usually indicates.",
                    items: [
                        {
                            type: "radio",
                            label: "Signal phrase: This time next week",
                            options: [
                                { value: "future-cont", label: "Future Continuous" },
                                { value: "going-to", label: "Going to" },
                                { value: "will", label: "Will" },
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "Signal phrase: Oh! I forgot!",
                            options: [
                                { value: "will", label: "Will" },
                                { value: "future-cont", label: "Future Continuous" },
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                                { value: "going-to", label: "Going to" },
                            ],
                            expectedAnswer: "will",
                        },
                        {
                            type: "radio",
                            label: "Signal phrase: fixed appointment at 3 PM",
                            options: [
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                                { value: "will", label: "Will" },
                                { value: "going-to", label: "Going to" },
                                { value: "future-cont", label: "Future Continuous" },
                            ],
                            expectedAnswer: "present-cont-future",
                        },
                    ],
                },
            ],
        },
        {
            id: "present-forms",
            stepNumber: 7,
            title: "Present Continuous Forms",
            explanation: `
                <h3>The Formula for Right Now</h3>
                <p>Present Continuous shows what's happening this moment. The formula is simple: swap 'be' for the time.</p>
            `,
            formula: [
                { text: "Present Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "am/is/are", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I am washing the dishes right now.",
                "You are listening to music on your headphones.",
                "He is fixing his car in the driveway.",
                "She is making dinner for the family.",
                "We are watching the game on TV.",
                "They are playing soccer in the park.",
            ],
            verbTable: {
                title: "Spelling Rules for -ing Forms",
                headers: ["Rule", "Examples"],
                rows: [
                    ["Most verbs: just add -ing", "work → working, email → emailing, call → calling"],
                    ["Ends in -e: drop -e, add -ing", "write → writing, give → giving, decide → deciding"],
                    ["One syllable CVC: double consonant", "run → running, sit → sitting, stop → stopping"],
                    ["Special cases", "lie → lying, die → dying (but tie → tying)"],
                ],
            },
            tipBox: {
                title: "💡 Quick Formation Check",
                content: "am/is/are + verb-ing. That's it! Say: 'I'm working' ✓ NOT 'I'm work' ✗",
            },
            exercises: [
                {
                    id: "ex-present-forms-1",
                    title: "Present Continuous: What Are They Doing?",
                    instructions: "Use am/is/are + verb-ing to show actions in progress right now.",
                    items: [
                        { type: "text", label: "The gardener ___ (trim) the hedges at the moment.", expectedAnswer: "is trimming" },
                        { type: "text", label: "My grandchildren ___ (build) a fort with blankets and pillows.", expectedAnswer: "are building" },
                        { type: "text", label: "The neighbors ___ (host) a barbecue in their backyard right now.", expectedAnswer: "are hosting" },
                        { type: "text", label: "The artist ___ (paint) a mural on the community center wall.", expectedAnswer: "is painting" },
                        { type: "text", label: "We ___ (explore) the historic district with a tour guide.", expectedAnswer: "are exploring" },
                    ],
                },
                {
                    id: "ex-present-forms-2",
                    title: "Present Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "The library ___ (not offer) late hours during summer break.", expectedAnswer: "is not offering" },
                        { type: "text", label: "___ your daughter ___ (apply) to graduate schools this course?", expectedAnswer: "Is your daughter applying" },
                        { type: "text", label: "The museum ___ (not charge) admission this weekend for the anniversary.", expectedAnswer: "is not charging" },
                        { type: "text", label: "___ the neighbors ___ (renovate) their kitchen right now?", expectedAnswer: "Are the neighbors renovating" },
                    ],
                },
            ],
        },
        {
            id: "past-forms",
            stepNumber: 8,
            title: "Past Continuous Forms",
            explanation: `
                <h3>The Formula for Past Ongoing Actions</h3>
                <p>Past Continuous shows what was happening at a specific past time. Same pattern, just past 'be'.</p>
            `,
            formula: [
                { text: "Past Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "was/were", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I was walking home when it started raining.",
                "She was studying when her phone rang.",
                "They were playing soccer at 3 PM yesterday.",
                "He was cooking dinner when I arrived.",
            ],
            tipBox: {
                title: "⚠️ Subject-Verb Agreement",
                content: "was = I/he/she/it. were = you/we/they. Say: 'I was running' ✓ 'They were running' ✓",
            },
            exercises: [
                {
                    id: "ex-past-forms-1",
                    title: "Past Continuous: What Was Happening?",
                    instructions: "Use was/were + verb-ing to show past ongoing actions.",
                    items: [
                        { type: "text", label: "I ___ (walk) home when it started raining.", expectedAnswer: "was walking" },
                        { type: "text", label: "She ___ (study) when her phone rang.", expectedAnswer: "was studying" },
                        { type: "text", label: "They ___ (play) soccer at 3 PM yesterday.", expectedAnswer: "were playing" },
                        { type: "text", label: "He ___ (cook) dinner when I arrived.", expectedAnswer: "was cooking" },
                        { type: "text", label: "We ___ (wait) for the bus when it finally came.", expectedAnswer: "were waiting" },
                    ],
                },
                {
                    id: "ex-past-forms-2",
                    title: "Past Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "I ___ (not sleep) when the alarm went off.", expectedAnswer: "was not sleeping" },
                        { type: "text", label: "___ you ___ (work) late last night?", expectedAnswer: "Were you working" },
                        { type: "text", label: "She ___ (not listen) to music while studying.", expectedAnswer: "was not listening" },
                        { type: "text", label: "___ they ___ (watch) TV when you called?", expectedAnswer: "Were they watching" },
                    ],
                },
            ],
        },
        {
            id: "future-forms",
            stepNumber: 9,
            title: "Future Continuous Forms",
            explanation: `
                <h3>The Formula for Future Ongoing Actions</h3>
                <p>Future Continuous shows what will be happening at a future time. will + be + verb-ing.</p>
            `,
            formula: [
                { text: "Future Continuous", type: "other" },
                { text: "=", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            examples: [
                "I'll be sleeping when you arrive at midnight.",
                "She will be working from 9 to 5 tomorrow.",
                "They will be traveling during the holidays.",
                "He will be waiting for us at the airport.",
            ],
            tipBox: {
                title: "💡 Will Be + Verb-ing",
                content: "All subjects use 'will be' - no changing! Say: 'I will be running' ✓ 'They will be running' ✓",
            },
            exercises: [
                {
                    id: "ex-future-forms-1",
                    title: "Future Continuous: What Will Be Happening?",
                    instructions: "Use will be + verb-ing to show future ongoing actions.",
                    items: [
                        { type: "text", label: "I ___ (sleep) when you arrive tonight.", expectedAnswer: "will be sleeping" },
                        { type: "text", label: "She ___ (work) late tomorrow.", expectedAnswer: "will be working" },
                        { type: "text", label: "They ___ (travel) next month.", expectedAnswer: "will be traveling" },
                        { type: "text", label: "He ___ (wait) for us at the station.", expectedAnswer: "will be waiting" },
                        { type: "text", label: "We ___ (study) when you call.", expectedAnswer: "will be studying" },
                    ],
                },
                {
                    id: "ex-future-forms-2",
                    title: "Future Continuous: Negative & Questions",
                    instructions: "Complete with the correct negative or question form.",
                    items: [
                        { type: "text", label: "I ___ (not work) tomorrow - it's Saturday.", expectedAnswer: "won't be working" },
                        { type: "text", label: "___ you ___ (sleep) when I call?", expectedAnswer: "Will you be sleeping" },
                        { type: "text", label: "She ___ (not travel) during the summer.", expectedAnswer: "won't be traveling" },
                        { type: "text", label: "___ they ___ (wait) for us?", expectedAnswer: "Will they be waiting" },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 10,
            title: "Mixed Practice: All Continuous Tenses",
            explanation: `
                <h3>Put It All Together</h3>
                <p>Time to mix all three continuous tenses - present, past, and future!</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct continuous tense form.",
                    items: [
                        { type: "text", label: "I ___ (not work) right now - I'm on break. (present negative)", expectedAnswer: "am not working" },
                        { type: "text", label: "She ___ (study) when the power went out. (past positive)", expectedAnswer: "was studying" },
                        { type: "text", label: "___ you ___ (sleep) when I call tonight? (future question)", expectedAnswer: "Will you be sleeping" },
                        { type: "text", label: "They ___ (not travel) during the holidays this year. (future negative)", expectedAnswer: "won't be traveling" },
                        { type: "text", label: "He ___ (cook) dinner when I arrived home. (past positive)", expectedAnswer: "was cooking" },
                        { type: "text", label: "We ___ (watch) a movie right now. (present positive)", expectedAnswer: "are watching" },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Real-Life Conversations",
                    instructions: "Complete these natural English conversations using continuous tenses.",
                    items: [
                        { type: "text", label: "1a. \"What ___ (you/do) right now?\"", expectedAnswer: "are you doing" },
                        { type: "text", label: "1b. \"I ___ (clean) the kitchen.\"", expectedAnswer: "am cleaning" },
                        { type: "text", label: "\"Where were you yesterday?\" \"I ___ (shop) when you called.\"", expectedAnswer: "was shopping" },
                        { type: "text", label: "\"Will you be home tonight?\" \"Yes, I ___ (work) from home.\"", expectedAnswer: "will be working" },
                        { type: "text", label: "\"Why is she so tired?\" \"She ___ (study) all night for the exam.\"", expectedAnswer: "was studying" },
                    ],
                },
            ],
        },
        {
            id: "verb-conjugation",
            stepNumber: 11,
            title: "Verb Conjugation Practice: Master All Continuous Forms",
            icon: "📊",
            explanation: `
                <h3>Complete Continuous Tense Conjugation Charts</h3>
                <p>Practice conjugating verbs across all three continuous tenses and all three forms (affirmative, negative, question). Remember: all continuous tenses use be + verb-ing!</p>

                <div style="background: rgba(240, 180, 90, 0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid rgba(240, 180, 90, 0.3);">
                    <p style="margin: 0;"><strong>💡 Pattern:</strong> Present (am/is/are + -ing) → Past (was/were + -ing) → Future (will be + -ing)</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-conjugation-present-cont",
                    title: "Present Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'eat' in Present Continuous with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ eating", expectedAnswer: "is" },
                        { type: "text", label: "Negative: She ___ eating", expectedAnswer: "isn't" },
                        { type: "text", label: "Question: ___ she eating?", expectedAnswer: "Is" },
                    ],
                },
                {
                    id: "ex-conjugation-past-cont",
                    title: "Past Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'sleep' in Past Continuous with the subject 'they'.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ sleeping", expectedAnswer: "were" },
                        { type: "text", label: "Negative: They ___ sleeping", expectedAnswer: "weren't" },
                        { type: "text", label: "Question: ___ they sleeping?", expectedAnswer: "Were" },
                    ],
                },
                {
                    id: "ex-conjugation-future-cont",
                    title: "Future Continuous Conjugation Chart",
                    instructions: "Complete the conjugation chart for the verb 'work' in Future Continuous with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ be working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ be working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I be working?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-conjugation-ing-forms",
                    title: "Spelling Practice: -ing Forms",
                    instructions: "Write the -ing form of each verb. Watch out for spelling rules!",
                    items: [
                        { type: "text", label: "run → ___", expectedAnswer: "running" },
                        { type: "text", label: "write → ___", expectedAnswer: "writing" },
                        { type: "text", label: "study → ___", expectedAnswer: "studying" },
                        { type: "text", label: "swim → ___", expectedAnswer: "swimming" },
                        { type: "text", label: "make → ___", expectedAnswer: "making" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-cont-1",
                    title: "Mixed Tenses: Verb 'read'",
                    instructions: "Conjugate the verb 'read' with the subject 'he' in all three continuous tenses (affirmative form only).",
                    items: [
                        { type: "text", label: "Present Continuous: He ___ reading", expectedAnswer: "is" },
                        { type: "text", label: "Past Continuous: He ___ reading", expectedAnswer: "was" },
                        { type: "text", label: "Future Continuous: He ___ be reading", expectedAnswer: "will" },
                    ],
                },
                {
                    id: "ex-conjugation-mixed-cont-2",
                    title: "Mixed Forms: Verb 'drive'",
                    instructions: "Conjugate the verb 'drive' with the subject 'we' in all three forms of Present Continuous.",
                    items: [
                        { type: "text", label: "Affirmative: We ___ driving", expectedAnswer: "are" },
                        { type: "text", label: "Negative: We ___ driving", expectedAnswer: "aren't" },
                        { type: "text", label: "Question: ___ we driving?", expectedAnswer: "Are" },
                    ],
                },
                {
                    id: "ex-conjugation-challenge-cont",
                    title: "Full Conjugation Challenge: Verb 'travel'",
                    instructions: "Complete the full conjugation chart for 'travel' with subject 'you' across all continuous tenses and forms.",
                    items: [
                        { type: "text", label: "Present Continuous - Affirmative: You ___ traveling", expectedAnswer: "are" },
                        { type: "text", label: "Present Continuous - Negative: You ___ traveling", expectedAnswer: "aren't" },
                        { type: "text", label: "Present Continuous - Question: ___ you traveling?", expectedAnswer: "Are" },
                        { type: "text", label: "Past Continuous - Affirmative: You ___ traveling", expectedAnswer: "were" },
                        { type: "text", label: "Past Continuous - Negative: You ___ traveling", expectedAnswer: "weren't" },
                        { type: "text", label: "Past Continuous - Question: ___ you traveling?", expectedAnswer: "Were" },
                        { type: "text", label: "Future Continuous - Affirmative: You ___ be traveling", expectedAnswer: "will" },
                        { type: "text", label: "Future Continuous - Negative: You ___ be traveling", expectedAnswer: "won't" },
                        { type: "text", label: "Future Continuous - Question: ___ you be traveling?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },
        {
            id: "advanced-practice",
            stepNumber: 12,
            title: "Advanced Practice: Mastering Continuous Tenses",
            icon: "🎯",
            explanation: `
                <h3>Real-World Challenges</h3>
                <p>These exercises test your ability to choose the right continuous tense in authentic scenarios. Can you think like a native speaker?</p>
            `,
            exercises: [
                {
                    id: "ex-error-correction",
                    title: "Error Correction: Fix the Continuous Tense Mistakes",
                    instructions: "Each sentence has ONE grammar mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She is study for her exam right now.", expectedAnswer: "She is studying for her exam right now" },
                        { type: "text", label: "They was watching TV when I arrived.", expectedAnswer: "They were watching TV when I arrived" },
                        { type: "text", label: "I will be travel to Europe next month.", expectedAnswer: "I will be traveling to Europe next month" },
                        { type: "text", label: "Are you come to the party tonight?", expectedAnswer: "Are you coming to the party tonight" },
                        { type: "text", label: "He were sleeping when the phone rang.", expectedAnswer: "He was sleeping when the phone rang" },
                    ],
                },
                {
                    id: "ex-stative-verbs",
                    title: "Common Mistakes: Stative Verbs",
                    instructions: "Choose the correct sentence. Some verbs can't be continuous!",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I know the answer." },
                                { value: "a", label: "I'm knowing the answer." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "She is having two cats." },
                                { value: "b", label: "She has two cats." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "They understand the concept now." },
                                { value: "a", label: "They are understanding the concept now." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "ex-continuous-vs-simple",
                    title: "Continuous vs Simple: Choose Wisely",
                    instructions: "Decide whether to use continuous or simple tense based on the context.",
                    items: [
                        {
                            type: "radio",
                            label: "Right now, at this exact moment:",
                            options: [
                                { value: "a", label: "I eat lunch." },
                                { value: "b", label: "I'm eating lunch." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "A general fact about your routine:",
                            options: [
                                { value: "a", label: "I work from 9 to 5." },
                                { value: "b", label: "I'm working from 9 to 5." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Describing background action when something else happened:",
                            options: [
                                { value: "a", label: "I walked home when it rained." },
                                { value: "b", label: "I was walking home when it started raining." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "ex-transformation-continuous",
                    title: "Transformation: Change the Tense",
                    instructions: "Transform each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "Change to negative: She is working on the project.", expectedAnswer: "She isn't working on the project" },
                        { type: "text", label: "Change to question: They were having dinner at 8 PM.", expectedAnswer: "Were they having dinner at 8 PM" },
                        { type: "text", label: "Change to Past Continuous: I am reading a book.", expectedAnswer: "I was reading a book" },
                        { type: "text", label: "Change to Future Continuous: We are traveling to Spain.", expectedAnswer: "We will be traveling to Spain" },
                    ],
                },
                {
                    id: "ex-contextual-story",
                    title: "Story Time: Complete with Continuous Tenses",
                    instructions: "Fill in the blanks with the correct continuous tense form.",
                    items: [
                        { type: "text", label: "Right now, I ___ (sit) in a café and writing this message.", expectedAnswer: "am sitting" },
                        { type: "text", label: "Yesterday at 3 PM, I ___ (work) on my laptop at the library.", expectedAnswer: "was working" },
                        { type: "text", label: "Tomorrow at noon, I ___ (meet) my friend for lunch.", expectedAnswer: "will be meeting" },
                        { type: "text", label: "While I ___ (walk) to work this morning, I saw a rainbow.", expectedAnswer: "was walking" },
                        { type: "text", label: "Next week at this time, I ___ (take) the Blue Line to class.", expectedAnswer: "will be taking" },
                        { type: "text", label: "The kids ___ (play) in the yard when it started raining.", expectedAnswer: "were playing" },
                    ],
                },
                {
                    id: "ex-dialogue-completion",
                    title: "Real Conversation: Fill in the Blanks",
                    instructions: "Complete this phone conversation with the correct continuous forms.",
                    items: [
                        { type: "text", label: "A: Hey! What ___ you ___ (do) right now?", expectedAnswer: "are you doing" },
                        { type: "text", label: "B: I ___ (cook) dinner. What about you?", expectedAnswer: "am cooking" },
                        { type: "text", label: "A: I ___ (drive) home from work. ___ you ___ (make) pasta?", expectedAnswer: "am driving" },
                        { type: "text", label: "B: No, I ___ (try) a new recipe for chicken.", expectedAnswer: "am trying" },
                        { type: "text", label: "A: Great! I ___ (join) you for dinner tomorrow?", expectedAnswer: "will be joining" },
                    ],
                },
                {
                    id: "ex-timeline-practice",
                    title: "Timeline Practice: When Was It Happening?",
                    instructions: "Choose the continuous tense that matches the timeline.",
                    items: [
                        {
                            type: "radio",
                            label: "Action happening RIGHT NOW as you speak:",
                            options: [
                                { value: "b", label: "She is writing an email." },
                                { value: "a", label: "She was writing an email." },
                                { value: "c", label: "She will be writing an email." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Action that was in progress yesterday at 5 PM:",
                            options: [
                                { value: "a", label: "They are having dinner." },
                                { value: "b", label: "They were having dinner." },
                                { value: "c", label: "They will be having dinner." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Action that will be in progress tomorrow at noon:",
                            options: [
                                { value: "a", label: "I am working on the project." },
                                { value: "b", label: "I was working on the project." },
                                { value: "c", label: "I will be working on the project." },
                            ],
                            expectedAnswer: "c",
                        },
                    ],
                },
                {
                    id: "ex-interrupted-actions",
                    title: "Interrupted Actions: Two Things Happening",
                    instructions: "Combine the two actions. Use Past Continuous for the ongoing action and Past Simple for the interruption.",
                    items: [
                        { type: "text", label: "I / watch TV + the phone / ring → ___ when ___", expectedAnswer: "I was watching TV when the phone rang" },
                        { type: "text", label: "She / study + her friend / arrive → ___ when ___", expectedAnswer: "She was studying when her friend arrived" },
                        { type: "text", label: "They / have dinner + the lights / go out → ___ when ___", expectedAnswer: "They were having dinner when the lights went out" },
                        { type: "text", label: "We / drive home + we / see the accident → ___ when ___", expectedAnswer: "We were driving home when we saw the accident" },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Quick Reference: Everything You Need",
            icon: "✓",
            explanation: `
                <h3>Your Continuous Tenses Cheat Sheet</h3>
                <p>Here's everything in one place for quick review:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Present Continuous:</strong> Actions happening now or temporary situations
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: am/is/are + verb-ing → "I'm working, She's eating"</li>
                            <li>Negative: am/is/are not + verb-ing → "I'm not working"</li>
                            <li>Question: Am/Is/Are + subject + verb-ing? → "Are you working?"</li>
                            <li>When to use: Right now, temporary arrangements, near-future plans</li>
                        </ul>
                    </li>
                    <li><strong>Past Continuous:</strong> Actions in progress at a specific past time
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: was/were + verb-ing → "I was working, They were eating"</li>
                            <li>Negative: was/were not + verb-ing → "I wasn't working"</li>
                            <li>Question: Was/Were + subject + verb-ing? → "Were you working?"</li>
                            <li>When to use: Ongoing past actions, especially when interrupted</li>
                        </ul>
                    </li>
                    <li><strong>Future Continuous:</strong> Actions that will be in progress at a future time
                        <ul class="list-disc pl-6 mt-2">
                            <li>Positive: will be + verb-ing → "I'll be working, They'll be eating"</li>
                            <li>Negative: won't be + verb-ing → "I won't be working"</li>
                            <li>Question: Will + subject + be + verb-ing? → "Will you be working?"</li>
                            <li>When to use: Future ongoing actions, overlapping with other future events</li>
                        </ul>
                    </li>
                </ul>
            `,
            tipBox: {
                title: "🚨 Common Continuous Mistakes to Avoid",
                content: "❌ I am work → ✅ I am working (must add -ing). ❌ I was ran → ✅ I was running (verb-ing, not past form). ❌ I will working → ✅ I will be working (will be + verb-ing). ❌ She was study → ✅ She was studying (-ying for study). ❌ They are run → ✅ They are running (double consonant + -ing).",
            },
            exercises: [
                {
                    id: "continuous-tenses-review-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of continuous tenses.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Present Continuous?",
                            options: [
                                { value: "a", label: "am/is/are + verb-ing" },
                                { value: "b", label: "was/were + verb-ing" },
                                { value: "c", label: "will be + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Past Continuous?",
                            options: [
                                { value: "a", label: "am/is/are + verb-ing" },
                                { value: "b", label: "was/were + verb-ing" },
                                { value: "c", label: "will be + verb-ing" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Continuous?",
                            options: [
                                { value: "a", label: "am/is/are + verb-ing" },
                                { value: "b", label: "was/were + verb-ing" },
                                { value: "c", label: "will be + verb-ing" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "When do you use Present Continuous?",
                            options: [
                                { value: "a", label: "Actions happening now, temporary situations, near-future plans" },
                                { value: "b", label: "Past actions that were interrupted" },
                                { value: "c", label: "Future actions in progress" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I am work right now." },
                                { value: "a", label: "I am working right now." },
                                { value: "c", label: "I will working right now." },
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
            question: "Which sentence correctly shows an action happening right now?",
            options: [
                { value: "b", label: "I was eating lunch at the moment." },
                { value: "c", label: "I will be eating lunch at the moment." },
                { value: "a", label: "I am eating lunch at the moment." },
            ],
            correctAnswer: "a",
            skillTag: "meaning-present-cont-now",
            difficulty: "easy",
            explanation: "Present Continuous (am eating) for actions happening right now. 'At the moment' signals present time.",
        },
        {
            id: "quiz-2",
            question: "Choose the correct continuous form for: 'She ___ (not work) today.'",
            options: [
                { value: "a", label: "is not working" },
                { value: "b", label: "was not working" },
                { value: "c", label: "will not be working" },
            ],
            correctAnswer: "a",
            skillTag: "form-present-cont-negative",
            difficulty: "easy",
            explanation: "Present Continuous negative: is not + verb-ing for current temporary situations.",
        },
        {
            id: "quiz-3",
            question: "Which tense fits: 'I ___ (sleep) when the phone rang.'",
            options: [
                { value: "a", label: "am sleeping" },
                { value: "b", label: "was sleeping" },
                { value: "c", label: "will be sleeping" },
            ],
            correctAnswer: "b",
            skillTag: "meaning-past-cont-interrupted",
            difficulty: "easy",
            explanation: "Past Continuous (was sleeping) for ongoing past action that was interrupted by another action ('rang' = Past Simple).",
        },
        {
            id: "quiz-4",
            question: "Pick the correct question: '___ you ___ (wait) long?'",
            options: [
                { value: "a", label: "Are you waiting" },
                { value: "c", label: "Will you be waiting" },
                { value: "b", label: "Were you waiting" },
            ],
            correctAnswer: "b",
            skillTag: "form-past-cont-question",
            difficulty: "medium",
            explanation: "Past Continuous question: Were + subject + verb-ing. The word 'long' suggests asking about a duration that already happened.",
        },
        {
            id: "quiz-5",
            question: "Which shows a temporary situation (not permanent)?",
            options: [
                { value: "a", label: "I'm living with my parents this month." },
                { value: "b", label: "I live with my parents." },
                { value: "c", label: "I lived with my parents." },
            ],
            correctAnswer: "a",
            skillTag: "meaning-present-cont-temporary",
            difficulty: "easy",
            explanation: "Present Continuous (am living) for temporary situations. 'This month' shows it's not permanent.",
        },
        {
            id: "quiz-6",
            question: "Which fits a future ongoing action: 'At 8 PM tomorrow, I ___ (work).'",
            options: [
                { value: "a", label: "am working" },
                { value: "c", label: "will be working" },
                { value: "b", label: "was working" },
            ],
            correctAnswer: "c",
            skillTag: "meaning-future-cont-specific-time",
            difficulty: "easy",
            explanation: "Future Continuous (will be working) for actions in progress at a specific future time.",
        },
        {
            id: "quiz-7",
            question: "What is the -ing form of 'run'?",
            options: [
                { value: "a", label: "runing" },
                { value: "c", label: "runeing" },
                { value: "b", label: "running" },
            ],
            correctAnswer: "b",
            skillTag: "spelling-ing-double-consonant",
            difficulty: "easy",
            explanation: "One-syllable verbs ending in consonant-vowel-consonant (CVC) double the final consonant: run → running.",
        },
        {
            id: "quiz-8",
            question: "Which sentence is INCORRECT?",
            options: [
                { value: "a", label: "I am knowing the answer." },
                { value: "b", label: "I am learning the answer." },
                { value: "c", label: "I am studying for the test." },
            ],
            correctAnswer: "a",
            skillTag: "error-stative-verb-continuous",
            difficulty: "medium",
            explanation: "'Know' is a stative verb—it describes a state, not an action. We say 'I know' (simple), NOT 'I am knowing.'",
        },
        {
            id: "quiz-9",
            question: "Fill in: 'They ___ (have) dinner when the power went out.'",
            options: [
                { value: "a", label: "are having" },
                { value: "b", label: "were having" },
                { value: "c", label: "will be having" },
            ],
            correctAnswer: "b",
            skillTag: "meaning-past-cont-interrupted",
            difficulty: "easy",
            explanation: "Past Continuous (were having) for an ongoing action interrupted by another past event ('went out').",
        },
        {
            id: "quiz-10",
            question: "What's the formula for Future Continuous?",
            options: [
                { value: "a", label: "am/is/are + verb-ing" },
                { value: "b", label: "was/were + verb-ing" },
                { value: "c", label: "will be + verb-ing" },
            ],
            correctAnswer: "c",
            skillTag: "form-future-cont-structure",
            difficulty: "easy",
            explanation: "Future Continuous = will be + verb-ing. It's the same for ALL subjects (I/you/he/she/we/they).",
        },
        {
            id: "quiz-11",
            question: "Which sentence uses Present Continuous for a NEAR FUTURE plan?",
            options: [
                { value: "a", label: "I'm meeting my friend for coffee at 3 PM." },
                { value: "b", label: "I was meeting my friend yesterday." },
                { value: "c", label: "I meet my friend every Tuesday." },
            ],
            correctAnswer: "a",
            skillTag: "meaning-present-cont-near-future",
            difficulty: "medium",
            explanation: "Present Continuous can express arranged future plans, especially with a specific time ('at 3 PM').",
        },
        {
            id: "quiz-12",
            question: "Which 'be' verb is used with 'she' in Present Continuous?",
            options: [
                { value: "a", label: "am" },
                { value: "b", label: "is" },
                { value: "c", label: "are" },
            ],
            correctAnswer: "b",
            skillTag: "form-present-cont-be-agreement",
            difficulty: "easy",
            explanation: "am = I, is = he/she/it, are = you/we/they. So 'She is working' is correct.",
        },
        {
            id: "quiz-13",
            question: "Change to negative: 'We were watching TV.'",
            options: [
                { value: "b", label: "We wasn't watching TV." },
                { value: "c", label: "We not were watching TV." },
                { value: "a", label: "We weren't watching TV." },
            ],
            correctAnswer: "a",
            skillTag: "form-past-cont-negative",
            difficulty: "easy",
            explanation: "To make Past Continuous negative, add 'not' after was/were: were not = weren't.",
        },
        {
            id: "quiz-14",
            question: "What's the -ing form of 'write'?",
            options: [
                { value: "c", label: "writing" },
                { value: "a", label: "writeing" },
                { value: "b", label: "writting" },
            ],
            correctAnswer: "c",
            skillTag: "spelling-ing-drop-e",
            difficulty: "easy",
            explanation: "Verbs ending in -e drop the -e before adding -ing: write → writing.",
        },
        {
            id: "quiz-15",
            question: "Which continuous tense emphasizes an action's DURATION?",
            options: [
                { value: "b", label: "Only Past Continuous" },
                { value: "a", label: "All continuous tenses (present, past, future)" },
                { value: "c", label: "Only Future Continuous" },
            ],
            correctAnswer: "a",
            skillTag: "meaning-continuous-duration",
            difficulty: "easy",
            explanation: "All continuous tenses show actions in progress over time—that's what makes them 'continuous'!",
        },
        {
            id: "quiz-16",
            question: "Choose the best sentence: action happening now vs duration up to now.",
            options: [
                { value: "a", label: "I am waiting for two hours." },
                { value: "c", label: "I was waiting for two hours now." },
                { value: "b", label: "I have been waiting for two hours." },
            ],
            correctAnswer: "b",
            skillTag: "contrast-present-cont-vs-present-perfect-continuous",
            difficulty: "hard",
            explanation: "Use Present Perfect Continuous for duration that started earlier and continues up to now.",
        },
        {
            id: "quiz-17",
            question: "Which sentence correctly uses a stative verb?",
            options: [
                { value: "b", label: "I know the answer now." },
                { value: "a", label: "I am knowing the answer now." },
                { value: "c", label: "I was knowing the answer." },
            ],
            correctAnswer: "b",
            skillTag: "error-stative-verb-continuous",
            difficulty: "medium",
            explanation: "Know is usually stative, so simple forms are preferred over continuous forms.",
        },
        {
            id: "quiz-18",
            question: "Which pair best shows background + interruption?",
            options: [
                { value: "b", label: "I drove when I was seeing the accident." },
                { value: "a", label: "I was driving when I saw the accident." },
                { value: "c", label: "I am driving when I saw the accident." },
            ],
            correctAnswer: "a",
            skillTag: "contrast-past-cont-vs-past-simple",
            difficulty: "medium",
            explanation: "Past Continuous sets background; Past Simple marks the shorter interrupting event.",
        },
        {
            id: "quiz-19",
            question: "Which form is best for a scheduled arrangement tomorrow at 3 PM?",
            options: [
                { value: "b", label: "I'll be meet my advisor at 3 PM tomorrow." },
                { value: "c", label: "I meeted my advisor at 3 PM tomorrow." },
                { value: "a", label: "I'm meeting my advisor at 3 PM tomorrow." },
            ],
            correctAnswer: "a",
            skillTag: "contrast-future-forms-arrangement",
            difficulty: "medium",
            explanation: "Present Continuous is common for fixed arranged appointments in the near future.",
        },
        {
            id: "quiz-20",
            question: "Choose the best sentence for a specific future time in progress.",
            options: [
                { value: "a", label: "At 8 PM tonight, I will be working." },
                { value: "b", label: "At 8 PM tonight, I am work." },
                { value: "c", label: "At 8 PM tonight, I worked." },
            ],
            correctAnswer: "a",
            skillTag: "meaning-future-cont-specific-time",
            difficulty: "easy",
            explanation: "Future Continuous (will be + verb-ing) fits actions in progress at a future clock time.",
        },
        {
            id: "quiz-21",
            question: "You see dark clouds and strong wind. Which choice fits best?",
            options: [
                { value: "a", label: "It's going to rain." },
                { value: "b", label: "It will be rain." },
                { value: "c", label: "It's rain now." },
            ],
            correctAnswer: "a",
            skillTag: "contrast-future-form-evidence-going-to",
            difficulty: "medium",
            explanation: "Visible evidence usually points to going to: 'It's going to rain.'",
        },
        {
            id: "quiz-22",
            question: "Your friend drops their books. What is the best immediate response?",
            options: [
                { value: "a", label: "I'll help you pick those up." },
                { value: "b", label: "I'm going to help you next week." },
                { value: "c", label: "I'm helping you yesterday." },
            ],
            correctAnswer: "a",
            skillTag: "contrast-future-form-instant-will",
            difficulty: "medium",
            explanation: "Instant decisions and offers usually use will.",
        },
    ],
/*
TEACHER DIAGNOSTIC NOTES – Continuous Tenses Review

Skill focus by tag:
- meaning-present-cont-now: understanding actions happening at the moment of speaking
- meaning-present-cont-temporary: distinguishing temporary vs permanent situations
- meaning-present-cont-near-future: using present continuous for scheduled plans
- meaning-past-cont-interrupted: background action interrupted by past simple
- meaning-future-cont-specific-time: actions in progress at a future time
- meaning-continuous-duration: recognizing that all continuous tenses emphasize duration
- contrast-present-cont-vs-present-perfect-continuous: now-in-progress vs duration-up-to-now
- contrast-past-cont-vs-past-simple: background action vs completed event
- contrast-future-forms-arrangement: choosing arrangement forms for future schedules
- contrast-future-form-evidence-going-to: using going to for evidence-based future predictions
- contrast-future-form-instant-will: using will for instant decisions and offers

Form focus:
- form-present-cont-negative
- form-present-cont-be-agreement
- form-past-cont-question
- form-past-cont-negative
- form-future-cont-structure

Common error patterns:
- error-stative-verb-continuous: reteach stative vs action verbs (know, believe, own)
- spelling-ing-double-consonant
- spelling-ing-drop-e

If this review shows widespread issues:
- Red on meaning tags → revisit timelines and "what is happening at this time?"
- Red on form tags → reset be + verb-ing formulas by tense
- Red on stative verbs → do quick contrast drills (I know vs I am learning)
*/
};
