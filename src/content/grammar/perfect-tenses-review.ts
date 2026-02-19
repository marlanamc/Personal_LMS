import type { InteractiveGuideContent } from "@/types/activity";

export const perfectTensesReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction
        {
            id: "introduction",
            title: "Perfect Tenses Review: Connecting Time Periods",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Perfect tenses are your tools for <strong>connecting different time periods</strong>. They show how actions in one time affect another time—past to present, earlier past to later past, or present to future.</p>
                </div>

                <h3>The Three Perfect Tenses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; border-radius: 0.25rem;">
                        <strong style="color: #6366f1;">Present Perfect:</strong> Past action → connects to NOW<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"I have worked here for 5 years." (still working now)</span>
                    </li>
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        <strong style="color: #f59e0b;">Past Perfect:</strong> Earlier past action → before later past action<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"I had finished work before she arrived." (finished first, then she arrived)</span>
                    </li>
                    <li style="padding: 0.75rem; margin: 0.5rem 0; background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; border-radius: 0.25rem;">
                        <strong style="color: #06b6d4;">Future Perfect:</strong> Action complete → before a future point<br/>
                        <span style="font-size: 0.9rem; color: #64748b;">"I will have finished by 5 PM." (done before 5 PM)</span>
                    </li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 The Pattern: <span style="font-size: 1.125rem;">have/has/had/will have + past participle</span></p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Year-in-Review Carousel: Telling your story using all tenses together</li>
                        <li>Talking about summer plans and next steps ("I will have finished this class by June")</li>
                        <li>Creating coherent narratives that connect past, present, and future</li>
                        <li>Final review: Using perfect tenses for real-life speaking</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎓 This is it - you're combining EVERYTHING you've learned to tell your complete story!</p>
                </div>
            `,
            exercises: [
                {
                    id: "perfect-tenses-review-intro-1",
                    title: "Practice: Understanding Perfect Tenses",
                    instructions: "Identify what perfect tenses do.",
                    items: [
                        {
                            type: "radio",
                            label: "What do perfect tenses do?",
                            options: [
                                { value: "b", label: "Describe only current actions" },
                                { value: "a", label: "Connect different time periods - show how actions in one time affect another" },
                                { value: "c", label: "Describe only future actions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I have worked here for 5 years." What does this show?',
                            options: [
                                { value: "b", label: "Only a past action" },
                                { value: "c", label: "Only a future action" },
                                { value: "a", label: "Past action (started 5 years ago) connecting to NOW (still working)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the pattern for all perfect tenses?",
                            options: [
                                { value: "a", label: "have/has/had/will have + past participle" },
                                { value: "b", label: "verb + -ing" },
                                { value: "c", label: "will + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // Core Idea Lens
        {
            id: "core-teaching-lens",
            title: "Core Idea Lens: Perfect = Two Times Connected",
            icon: "🧠",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.1) 100%); padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid #10b981;">
                    <p style="margin: 0; font-size: 1.05rem;"><strong>Perfect tenses should not feel like "just another tense."</strong> Teach the core idea first: <strong>Perfect = connection between two times.</strong></p>
                    <p style="margin: 0.5rem 0 0 0; color: #334155;">If learners feel this connection, forms become easier and panic drops.</p>
                </div>

                <h3 style="margin-top: 1.25rem;">The Question That Simplifies Everything</h3>
                <p style="margin-bottom: 0.5rem;">Before grammar rules, ask: <strong>"What two times are connected?"</strong></p>
                <ul>
                    <li><strong>Present Perfect:</strong> past + now</li>
                    <li><strong>Past Perfect:</strong> past + past</li>
                    <li><strong>Future Perfect:</strong> completed action + future reference point (a "past" action from a future viewpoint)</li>
                </ul>

                <h3>Result form (Present Perfect): Past action connected to NOW</h3>
                <p style="margin-bottom: 0.5rem;">Teach these high-value contexts together:</p>
                <ul>
                    <li><strong>Life experience:</strong> ever, never, before<br/>Example: "Have you ever traveled alone?"</li>
                    <li><strong>Change over time:</strong> has grown, has improved, has increased<br/>Example: "My English has improved."</li>
                    <li><strong>Unfinished time:</strong> today, this week, this year, recently, lately<br/>Example: "I have worked a lot this week." vs "I worked a lot last week."</li>
                    <li><strong>Conversation markers:</strong> already, yet, just<br/>Example: "I've already finished." / "She hasn't called yet." / "I've just eaten."</li>
                </ul>

                <h3>Duration form (Present Perfect Continuous): Duration or visible result now</h3>
                <p style="margin-bottom: 0.5rem; font-size: 0.9375rem; color: #5e6b7d;">In the perfect family guides we call these the <strong>result form</strong> (Present Perfect) and <strong>duration form</strong> (Present Perfect Continuous) so they're not confused with Present Simple or Present Continuous.</p>
                <ul>
                    <li><strong>Duration:</strong> for, since<br/>Example: "I've been studying for three hours."</li>
                    <li><strong>Visible results:</strong> explain what students can see now<br/>Example: "You're tired." "Yes, I've been working all day."</li>
                    <li><strong>Emotional tone:</strong> waiting, trying, thinking<br/>Example: "I've been waiting."</li>
                </ul>

                <h3>Past Perfect: The Past Before the Past</h3>
                <ul>
                    <li><strong>Storytelling sequence:</strong> before, after, by the time, already<br/>Example: "When I arrived, she had left."</li>
                    <li><strong>Cause and effect in stories:</strong><br/>Example: "I was tired because I had worked all night."</li>
                </ul>

                <h3>Future Perfect: Completed Before a Future Point</h3>
                <ul>
                    <li><strong>Planning language:</strong> by, by the time, in 5 years<br/>Example: "By next year, I will have finished school."</li>
                    <li><strong>Best context:</strong> goals, deadlines, and milestones</li>
                </ul>

                <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 0.5rem; padding: 1rem; margin-top: 1.25rem;">
                    <p style="margin: 0; font-weight: 600;">Teaching move that works:</p>
                    <p style="margin: 0.5rem 0 0 0;">Less "form + rules." More timeline thinking and real contexts:</p>
                    <ol style="margin: 0.5rem 0 0 1.25rem;">
                        <li>Timeline visuals</li>
                        <li>Time-connection questions</li>
                        <li>Real contexts (experience, change, storytelling, goals)</li>
                    </ol>
                </div>
            `,
            exercises: [
                {
                    id: "perfect-tenses-review-core-idea-1",
                    title: "Practice: Identify the Two-Time Connection",
                    instructions: "Choose the best timeline connection for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: '"My English has improved a lot this year."',
                            options: [
                                { value: "a", label: "Past to NOW (change over time connected to the present)" },
                                { value: "b", label: "Past before another past event" },
                                { value: "c", label: "Completed before a future deadline" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"When we arrived, the movie had already started."',
                            options: [
                                { value: "b", label: "Past before past (story sequence)" },
                                { value: "a", label: "Past to NOW" },
                                { value: "c", label: "Future completion" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: '"By next summer, I will have saved $3,000."',
                            options: [
                                { value: "c", label: "Completed action before a future point" },
                                { value: "a", label: "Past to NOW" },
                                { value: "b", label: "Past before past" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: '"I have been waiting for an hour." What is the teaching focus?',
                            options: [
                                { value: "a", label: "Duration from past to now (for/since logic)" },
                                { value: "b", label: "Single completed result only" },
                                { value: "c", label: "Future planning" },
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
            title: "Timeline: All Perfect Tenses",
            icon: "⏰",
            explanation: `
                <div style="max-width: 750px; margin: 2rem auto; padding: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.2);">
                    <p style="text-align: center; font-size: 1.125rem; margin-bottom: 2rem; color: #2b3a4a; font-weight: 600;">
                        Perfect tenses CONNECT different time periods
                    </p>

                    <!-- Main timeline -->
                    <div style="position: relative; display: flex; justify-content: space-between; align-items: center; margin: 3rem 0; padding: 0 1rem;">
                        <!-- Timeline line -->
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #6366f1 50%, #06b6d4 100%); transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Past Perfect circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.75rem; line-height: 1.2; padding: 0.5rem;">
                                PAST<br/>PERFECT
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #f59e0b; font-weight: 600; text-align: center;">
                                had + pp
                            </div>
                            <div style="font-size: 0.7rem; color: #64748b; text-align: center; max-width: 100px;">
                                before another past
                            </div>
                        </div>

                        <!-- Present Perfect circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.75rem; line-height: 1.2; padding: 0.5rem;">
                                PRESENT<br/>PERFECT
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #6366f1; font-weight: 600; text-align: center;">
                                have/has + pp
                            </div>
                            <div style="font-size: 0.7rem; color: #64748b; text-align: center; max-width: 100px;">
                                past → NOW
                            </div>
                        </div>

                        <!-- Future Perfect circle -->
                        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%); border: 4px solid #fff; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-weight: 700; font-size: 0.75rem; line-height: 1.2; padding: 0.5rem;">
                                FUTURE<br/>PERFECT
                            </div>
                            <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #06b6d4; font-weight: 600; text-align: center;">
                                will have + pp
                            </div>
                            <div style="font-size: 0.7rem; color: #64748b; text-align: center; max-width: 100px;">
                                done by future
                            </div>
                        </div>
                    </div>

                    <!-- Example sentences -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem;">
                        <div style="background: rgba(245, 158, 11, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #f59e0b;">
                            <div style="font-size: 0.8rem; color: #2b3a4a; line-height: 1.4;">
                                She <span style="color: #f59e0b; font-weight: 700;">had left</span> when I arrived.
                            </div>
                        </div>
                        <div style="background: rgba(99, 102, 241, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #6366f1;">
                            <div style="font-size: 0.8rem; color: #2b3a4a; line-height: 1.4;">
                                I <span style="color: #6366f1; font-weight: 700;">have worked</span> here for 5 years.
                            </div>
                        </div>
                        <div style="background: rgba(6, 182, 212, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #06b6d4;">
                            <div style="font-size: 0.8rem; color: #2b3a4a; line-height: 1.4;">
                                I <span style="color: #06b6d4; font-weight: 700;">will have finished</span> by 5 PM.
                            </div>
                        </div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 The Key Insight",
                content: "All perfect tenses use the same pattern: helping verb 'have' + past participle. Only the form of 'have' changes: have/has (present), had (past), will have (future).",
            },
            exercises: [
                {
                    id: "perfect-tenses-review-timeline-1",
                    title: "Practice: Matching Perfect Tense to Time",
                    instructions: "Choose the perfect tense that matches the timeline connection.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ here for 5 years." (started in the past, still true now)',
                            options: [
                                { value: "had worked", label: "had worked" },
                                { value: "have worked", label: "have worked" },
                                { value: "will have worked", label: "will have worked" },
                            ],
                            expectedAnswer: "have worked",
                        },
                        {
                            type: "radio",
                            label: '"When I arrived, she ___ already." (she left before I arrived)',
                            options: [
                                { value: "has left", label: "has left" },
                                { value: "will have left", label: "will have left" },
                                { value: "had left", label: "had left" },
                            ],
                            expectedAnswer: "had left",
                        },
                        {
                            type: "radio",
                            label: '"By Friday, I ___ the paperwork." (done before a deadline)',
                            options: [
                                { value: "will have finished", label: "will have finished" },
                                { value: "have finished", label: "have finished" },
                                { value: "had finished", label: "had finished" },
                            ],
                            expectedAnswer: "will have finished",
                        },
                    ],
                },
            ],
        },

        // Comparison Section
        {
            id: "comparison",
            stepNumber: 1,
            title: "When to Use Each Perfect Tense",
            icon: "⭐",
            explanation: `
                <h3>Choosing the Right Perfect Tense</h3>
                <p>Each perfect tense connects different time periods. Ask yourself: <strong>What times am I connecting?</strong></p>
            `,
            usageMeanings: [
                {
                    title: "🔵 Present Perfect: Past → NOW",
                    description: "Use when the past action matters to the present moment",
                    examples: [
                        {
                            sentence: "I <strong>have worked</strong> here for 5 years.",
                            explanation: "✓ Started in past, STILL working now",
                        },
                        {
                            sentence: "She <strong>has lost</strong> her keys.",
                            explanation: "✓ Past action, present result (can't find them NOW)",
                        },
                        {
                            sentence: "<strong>Have</strong> you ever <strong>been</strong> to Paris?",
                            explanation: "✓ Life experience up to now",
                        },
                    ],
                },
                {
                    title: "🟠 Past Perfect: Earlier Past → Later Past",
                    description: "Use when one past action happened BEFORE another past action",
                    examples: [
                        {
                            sentence: "When I arrived, she <strong>had already left</strong>.",
                            explanation: "✓ She left FIRST, then I arrived",
                        },
                        {
                            sentence: "I was tired because I <strong>had worked</strong> all day.",
                            explanation: "✓ Working happened BEFORE being tired",
                        },
                        {
                            sentence: "They <strong>had finished</strong> dinner before the movie started.",
                            explanation: "✓ Dinner finished FIRST, then movie started",
                        },
                    ],
                },
                {
                    title: "🔷 Future Perfect: Action Complete → Before Future Point",
                    description: "Use when an action will be finished BEFORE a future deadline",
                    examples: [
                        {
                            sentence: "I <strong>will have finished</strong> by 5 PM.",
                            explanation: "✓ Done BEFORE the deadline",
                        },
                        {
                            sentence: "By next year, she <strong>will have worked</strong> here for 10 years.",
                            explanation: "✓ Duration reaching a future milestone",
                        },
                        {
                            sentence: "They <strong>will have left</strong> by the time we arrive.",
                            explanation: "✓ Gone BEFORE we get there",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Decision Guide",
                content: "Past → NOW? = Present Perfect. Earlier past → Later past? = Past Perfect. Done BY future? = Future Perfect.",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Which Perfect Tense?",
                    instructions: "Choose the correct perfect tense based on the time relationship.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ here for 5 years." (started in past, still working now)',
                            options: [
                                { value: "had worked", label: "had worked (Past Perfect)" },
                                { value: "have worked", label: "have worked (Present Perfect)" },
                                { value: "will have worked", label: "will have worked (Future Perfect)" },
                            ],
                            expectedAnswer: "have worked",
                        },
                        {
                            type: "radio",
                            label: '"When I arrived, she ___ already." (she left before I arrived)',
                            options: [
                                { value: "has left", label: "has left (Present Perfect)" },
                                { value: "will have left", label: "will have left (Future Perfect)" },
                                { value: "had left", label: "had left (Past Perfect)" },
                            ],
                            expectedAnswer: "had left",
                        },
                        {
                            type: "radio",
                            label: '"I ___ the report by Friday." (complete before the deadline)',
                            options: [
                                { value: "will have finished", label: "will have finished (Future Perfect)" },
                                { value: "have finished", label: "have finished (Present Perfect)" },
                                { value: "had finished", label: "had finished (Past Perfect)" },
                            ],
                            expectedAnswer: "will have finished",
                        },
                    ],
                },
            ],
        },

        // COMMONLY CONFUSED TENSES SECTION
        {
            id: "common-mistakes-1",
            stepNumber: 2,
            title: "Commonly Confused: Present Perfect vs Past Simple",
            icon: "⚠️",
            explanation: `
                <h3>The #1 Most Confused Pair!</h3>
                <p>This is the most common mistake for English learners. Both talk about the past, but they have very different meanings.</p>

                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444; margin: 1rem 0;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">❌ Common Mistake:</p>
                    <p style="margin: 0.5rem 0 0 0;">"I have visited Paris last year." → Should be: "I visited Paris last year."</p>
                </div>
            `,
            comparison: {
                title: "Present Perfect vs Past Simple",
                leftLabel: "Present Perfect",
                rightLabel: "Past Simple",
                rows: [
                    {
                        label: "Time",
                        left: "NO specific time (connected to now)",
                        right: "SPECIFIC time (finished, done)",
                    },
                    {
                        label: "Time Words",
                        left: "ever, never, already, yet, just, for, since",
                        right: "yesterday, last week, in 2020, ago, when",
                    },
                    {
                        label: "Example",
                        left: "I have visited Paris. (sometime in my life)",
                        right: "I visited Paris in 2019. (specific year)",
                    },
                    {
                        label: "Example",
                        left: "She has lived here for 5 years. (still lives here)",
                        right: "She lived here for 5 years. (doesn't live here now)",
                    },
                    {
                        label: "Example",
                        left: "Have you seen this movie? (ever in your life)",
                        right: "Did you see this movie last night? (specific time)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-pp-vs-ps-1",
                    title: "Practice: Present Perfect or Past Simple?",
                    instructions: "Choose the correct tense. Look for time words!",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ to Japan three times in my life."',
                            options: [
                                { value: "went", label: "went" },
                                { value: "have been", label: "have been" },
                            ],
                            expectedAnswer: "have been",
                        },
                        {
                            type: "radio",
                            label: '"I ___ to Japan last summer."',
                            options: [
                                { value: "went", label: "went" },
                                { value: "have been", label: "have been" },
                            ],
                            expectedAnswer: "went",
                        },
                        {
                            type: "radio",
                            label: '"She ___ here since 2020." (still here now)',
                            options: [
                                { value: "worked", label: "worked" },
                                { value: "has worked", label: "has worked" },
                            ],
                            expectedAnswer: "has worked",
                        },
                        {
                            type: "radio",
                            label: '"She ___ here from 2015 to 2020." (not here now)',
                            options: [
                                { value: "worked", label: "worked" },
                                { value: "has worked", label: "has worked" },
                            ],
                            expectedAnswer: "worked",
                        },
                        {
                            type: "radio",
                            label: '"___ you ever ___ sushi?"',
                            options: [
                                { value: "Did try", label: "Did you ever try" },
                                { value: "Have tried", label: "Have you ever tried" },
                            ],
                            expectedAnswer: "Have tried",
                        },
                        {
                            type: "radio",
                            label: '"___ you ___ sushi yesterday?"',
                            options: [
                                { value: "Did eat", label: "Did you eat" },
                                { value: "Have eaten", label: "Have you eaten" },
                            ],
                            expectedAnswer: "Did eat",
                        },
                    ],
                },
            ],
        },

        // More Common Mistakes
        {
            id: "common-mistakes-2",
            stepNumber: 3,
            title: "Commonly Confused: Present Perfect vs Present Perfect Continuous",
            icon: "⚠️",
            explanation: `
                <h3>Result vs Duration</h3>
                <p>Both connect past to present, but they focus on different things.</p>
            `,
            comparison: {
                title: "Result form vs duration form (Present Perfect vs Present Perfect Continuous)",
                leftLabel: "Result form (Present Perfect)",
                rightLabel: "Duration form (Present Perfect Continuous)",
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
                        left: "I have read 3 books. (result: 3 books done)",
                        right: "I have been reading all day. (duration)",
                    },
                    {
                        label: "Example",
                        left: "She has written 10 emails. (count: 10)",
                        right: "She has been writing emails all morning. (ongoing)",
                    },
                    {
                        label: "Example",
                        left: "They have painted the room. (finished!)",
                        right: "They have been painting the room. (still in progress)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-pp-vs-ppc-1",
                    title: "Practice: Result or Duration?",
                    instructions: "Choose based on whether we're counting results or emphasizing duration.",
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
                            label: '"Your eyes are red. ___ you ___?" (visible result of recent activity)',
                            options: [
                                { value: "Have been crying", label: "Have you been crying" },
                                { value: "Have cried", label: "Have you cried" },
                            ],
                            expectedAnswer: "Have been crying",
                        },
                    ],
                },
            ],
        },

        // Past Perfect vs Past Simple
        {
            id: "common-mistakes-3",
            stepNumber: 4,
            title: "Commonly Confused: Past Perfect vs Past Simple",
            icon: "⚠️",
            explanation: `
                <h3>When Do You Need Past Perfect?</h3>
                <p>Past Perfect is only needed when you're showing that one past action happened BEFORE another past action. If there's only one past action, use Past Simple!</p>

                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444; margin: 1rem 0;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">❌ Common Mistake (overusing Past Perfect):</p>
                    <p style="margin: 0.5rem 0 0 0;">"I had eaten breakfast this morning." → Should be: "I ate breakfast this morning."</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #64748b;">Only one action = Past Simple is enough!</p>
                </div>
            `,
            comparison: {
                title: "Past Perfect vs Past Simple",
                leftLabel: "Past Perfect",
                rightLabel: "Past Simple",
                rows: [
                    {
                        label: "When to Use",
                        left: "TWO past actions, showing which was FIRST",
                        right: "ONE past action, or actions in sequence",
                    },
                    {
                        label: "Example",
                        left: "When I arrived, she had already left. (she left FIRST)",
                        right: "She left at 5 PM. (one action)",
                    },
                    {
                        label: "Example",
                        left: "I was tired because I had worked all day. (work before tired)",
                        right: "I worked all day yesterday. (one action)",
                    },
                    {
                        label: "Example",
                        left: "After he had eaten, he watched TV. (eat first, then TV)",
                        right: "He ate dinner and watched TV. (sequence, both past)",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-pp-vs-ps-2",
                    title: "Practice: Do You Need Past Perfect?",
                    instructions: "Choose Past Perfect only when showing which action happened first.",
                    items: [
                        {
                            type: "radio",
                            label: '"When I got home, she ___ already." (she left before I got home)',
                            options: [
                                { value: "left", label: "left" },
                                { value: "had left", label: "had left" },
                            ],
                            expectedAnswer: "had left",
                        },
                        {
                            type: "radio",
                            label: '"She ___ at 5 PM yesterday." (one action, specific time)',
                            options: [
                                { value: "left", label: "left" },
                                { value: "had left", label: "had left" },
                            ],
                            expectedAnswer: "left",
                        },
                        {
                            type: "radio",
                            label: '"I ___ breakfast this morning." (one action)',
                            options: [
                                { value: "had eaten", label: "had eaten" },
                                { value: "ate", label: "ate" },
                            ],
                            expectedAnswer: "ate",
                        },
                        {
                            type: "radio",
                            label: '"I wasn\'t hungry because I ___ a big lunch." (lunch before not hungry)',
                            options: [
                                { value: "had eaten", label: "had eaten" },
                                { value: "ate", label: "ate" },
                            ],
                            expectedAnswer: "had eaten",
                        },
                    ],
                },
            ],
        },

        // Future Perfect vs Future Simple
        {
            id: "common-mistakes-4",
            stepNumber: 5,
            title: "Commonly Confused: Future Perfect vs Future Simple",
            icon: "⚠️",
            explanation: `
                <h3>BY vs AT</h3>
                <p>The key difference is whether the action happens AT a time or is complete BY (before) a time.</p>
            `,
            comparison: {
                title: "Future Perfect vs Future Simple",
                leftLabel: "Future Perfect",
                rightLabel: "Future Simple",
                rows: [
                    {
                        label: "Meaning",
                        left: "Action COMPLETE before a deadline",
                        right: "Action happens at a future time",
                    },
                    {
                        label: "Key Word",
                        left: "BY (by tomorrow, by 5 PM, by the time...)",
                        right: "AT, ON, WHEN (at 5 PM, on Friday, when...)",
                    },
                    {
                        label: "Example",
                        left: "I will have finished BY 5 PM. (done before 5)",
                        right: "I will finish AT 5 PM. (finish happens at 5)",
                    },
                    {
                        label: "Example",
                        left: "She will have left by the time you arrive.",
                        right: "She will leave when you arrive.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-fp-vs-fs-1",
                    title: "Practice: BY or AT?",
                    instructions: "Choose Future Perfect for 'by' (before) and Future Simple for 'at/when'.",
                    items: [
                        {
                            type: "radio",
                            label: '"I ___ the report BY Friday." (complete before Friday)',
                            options: [
                                { value: "will finish", label: "will finish" },
                                { value: "will have finished", label: "will have finished" },
                            ],
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "radio",
                            label: '"I ___ the report ON Friday." (action happens Friday)',
                            options: [
                                { value: "will finish", label: "will finish" },
                                { value: "will have finished", label: "will have finished" },
                            ],
                            expectedAnswer: "will finish",
                        },
                        {
                            type: "radio",
                            label: '"The bus ___ by the time we get there." (already gone)',
                            options: [
                                { value: "will leave", label: "will leave" },
                                { value: "will have left", label: "will have left" },
                            ],
                            expectedAnswer: "will have left",
                        },
                        {
                            type: "radio",
                            label: '"The bus ___ at 3 PM." (scheduled departure)',
                            options: [
                                { value: "will leave", label: "will leave" },
                                { value: "will have left", label: "will have left" },
                            ],
                            expectedAnswer: "will leave",
                        },
                    ],
                },
            ],
        },

        // Mixed Practice
        {
            id: "mixed-practice",
            stepNumber: 6,
            title: "Mixed Practice: All Perfect Tenses",
            icon: "📝",
            explanation: `
                <h3>Put It All Together</h3>
                <p>Now let's practice choosing the right perfect tense in various situations.</p>
            `,
            exercises: [
                {
                    id: "ex-mixed-1",
                    title: "Choose the Correct Perfect Tense",
                    instructions: "Select the best tense for each situation.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (work) here for 10 years. (still working now)",
                            expectedAnswer: "have worked",
                        },
                        {
                            type: "text",
                            label: "When I arrived, they ___ (leave) already.",
                            expectedAnswer: "had left",
                        },
                        {
                            type: "text",
                            label: "By next month, she ___ (finish) her training.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "I was tired because I ___ (not sleep) well.",
                            expectedAnswer: "hadn't slept",
                        },
                        {
                            type: "text",
                            label: "___ you ever ___ (try) Korean food?",
                            expectedAnswer: "Have you ever tried",
                        },
                        {
                            type: "text",
                            label: "By the time you arrive, I ___ (wait) for 2 hours.",
                            expectedAnswer: "will have been waiting",
                        },
                    ],
                },
                {
                    id: "ex-mixed-2",
                    title: "Error Correction",
                    instructions: "Find and correct the mistake in each sentence.",
                    items: [
                        {
                            type: "text",
                            label: "I have visited Paris last year.",
                            expectedAnswer: "I visited Paris last year",
                        },
                        {
                            type: "text",
                            label: "I had eaten breakfast this morning.",
                            expectedAnswer: "I ate breakfast this morning",
                        },
                        {
                            type: "text",
                            label: "She has been here since 5 years.",
                            expectedAnswer: "She has been here for 5 years",
                        },
                    ],
                },
            ],
        },

        // Conjugation Practice
        {
            id: "conjugation",
            stepNumber: 7,
            title: "Conjugation Charts: All Perfect Tenses",
            icon: "📊",
            explanation: `
                <h3>Master the Forms</h3>
                <p>Practice conjugating verbs in all three perfect tenses.</p>
            `,
            exercises: [
                {
                    id: "ex-conjugation-present",
                    title: "Present Perfect: Verb 'finish' with 'she'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ finished", expectedAnswer: "has" },
                        { type: "text", label: "Negative: She ___ finished", expectedAnswer: "hasn't" },
                        { type: "text", label: "Question: ___ she finished?", expectedAnswer: "Has" },
                    ],
                },
                {
                    id: "ex-conjugation-past",
                    title: "Past Perfect: Verb 'leave' with 'they'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: They ___ left", expectedAnswer: "had" },
                        { type: "text", label: "Negative: They ___ left", expectedAnswer: "hadn't" },
                        { type: "text", label: "Question: ___ they left?", expectedAnswer: "Had" },
                    ],
                },
                {
                    id: "ex-conjugation-future",
                    title: "Future Perfect: Verb 'complete' with 'I'",
                    instructions: "Complete the conjugation chart.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ have completed", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ have completed", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I have completed?", expectedAnswer: "Will" },
                    ],
                },
            ],
        },

        // Summary
        {
            id: "summary",
            title: "Summary: Perfect Tenses at a Glance",
            icon: "✓",
            explanation: `
                <h3>Quick Reference</h3>

                <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(99, 102, 241, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6366f1;">Present Perfect</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> have/has + past participle</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Past → NOW connection</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Words:</strong> ever, never, already, yet, just, for, since</p>
                    </div>

                    <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b;">Past Perfect</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> had + past participle</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Earlier past → Later past (which happened first)</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Words:</strong> when, before, after, by the time, already</p>
                    </div>

                    <div style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #06b6d4;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #06b6d4;">Future Perfect</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Form:</strong> will have + past participle</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Use:</strong> Action complete BY a future deadline</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Words:</strong> by tomorrow, by next week, by the time</p>
                    </div>
                </div>

                <h3>Common Mistakes to Avoid</h3>
                <ul class="list-disc pl-6 space-y-1">
                    <li><strong>Present Perfect + specific past time</strong> ❌ "I have visited Paris last year."</li>
                    <li><strong>Past Perfect with only one action</strong> ❌ "I had eaten breakfast this morning."</li>
                    <li><strong>For vs Since confusion</strong> ❌ "I have worked here since 5 years."</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 The Golden Rule",
                content: "Perfect tenses CONNECT time periods. Ask: 'What times am I connecting?' Past → NOW = Present Perfect. Earlier past → Later past = Past Perfect. Done BY future = Future Perfect.",
            },
            exercises: [
                {
                    id: "perfect-tenses-review-summary-1",
                    title: "Practice: Perfect Tenses Review",
                    instructions: "Test your understanding of perfect tenses.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Present Perfect?",
                            options: [
                                { value: "b", label: "had + past participle" },
                                { value: "a", label: "have/has + past participle" },
                                { value: "c", label: "will have + past participle" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Past Perfect?",
                            options: [
                                { value: "a", label: "have/has + past participle" },
                                { value: "c", label: "will have + past participle" },
                                { value: "b", label: "had + past participle" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect?",
                            options: [
                                { value: "c", label: "will have + past participle" },
                                { value: "a", label: "have/has + past participle" },
                                { value: "b", label: "had + past participle" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "When do you use Present Perfect?",
                            options: [
                                { value: "b", label: "Earlier past → Later past (which happened first)" },
                                { value: "a", label: "Past → NOW connection (past action with present relevance)" },
                                { value: "c", label: "Action complete BY a future deadline" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I have visited Paris last year." },
                                { value: "c", label: "I had visited Paris last year." },
                                { value: "a", label: "I visited Paris last year." },
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
            question: "Which sentence is correct?",
            options: [
                { value: "b", label: "I visited Paris last year." },
                { value: "a", label: "I have visited Paris last year." },
                { value: "c", label: "I had visited Paris last year." },
            ],
            correctAnswer: "b",
            explanation: "'Last year' is a specific past time → use Past Simple, not Present Perfect.",
            skillTag: "error-specific-past-time",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Choose the correct tense: \"When I arrived, she ___ already.\"",
            options: [
                { value: "a", label: "has left" },
                { value: "b", label: "had left" },
                { value: "c", label: "left" },
            ],
            correctAnswer: "b",
            explanation: "Two past actions, showing which was first → Past Perfect for the earlier action.",
            skillTag: "past-perfect-two-past-actions-sequence",
            difficulty: "medium",
        },
        {
            id: "quiz-3",
            question: "Which is correct for 'complete before the deadline'?",
            options: [
                { value: "a", label: "I will finish by Friday." },
                { value: "c", label: "I have finished by Friday." },
                { value: "b", label: "I will have finished by Friday." },
            ],
            correctAnswer: "b",
            explanation: "'By Friday' = before the deadline → Future Perfect.",
            skillTag: "result-future-completed-by-deadline",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Present Perfect vs Present Perfect Continuous: \"How many books ___ you ___?\"",
            options: [
                { value: "b", label: "have you been reading (duration)" },
                { value: "a", label: "have you read (counting result)" },
            ],
            correctAnswer: "a",
            explanation: "'How many' asks about quantity/result → result form (Present Perfect).",
            skillTag: "result-count-how-many",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Which sentence correctly uses Past Perfect?",
            options: [
                { value: "a", label: "I had eaten breakfast this morning." },
                { value: "b", label: "I was tired because I had worked all day." },
                { value: "c", label: "She had left at 5 PM." },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect is used to show the cause that happened before another past result.",
            skillTag: "past-perfect-cause-effect",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question: "Choose the best sentence for a past action connected to now.",
            options: [
                { value: "a", label: "I worked here for 5 years." },
                { value: "c", label: "I had worked here for 5 years." },
                { value: "b", label: "I have worked here for 5 years." },
            ],
            correctAnswer: "b",
            explanation: "Present Perfect (have worked) connects past duration to NOW (still true).",
            skillTag: "result-state-verb-duration",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which sentence is correct for ONE past action this morning?",
            options: [
                { value: "c", label: "I ate breakfast this morning." },
                { value: "a", label: "I had eaten breakfast this morning." },
                { value: "b", label: "I have eaten breakfast this morning." },
            ],
            correctAnswer: "c",
            explanation: "Only one past action at a specific time → Past Simple is enough.",
            skillTag: "error-past-perfect-overuse",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Choose the correct sentence about a future time clause.",
            options: [
                { value: "a", label: "When you will arrive, I will have finished." },
                { value: "b", label: "When you arrive, I will have finished." },
                { value: "c", label: "When you are arriving, I will have finished." },
            ],
            correctAnswer: "b",
            explanation: "Future time clauses use present forms (When you arrive), not 'will'.",
            skillTag: "error-future-perfect-time-clause-will",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Which sentence shows that Past Perfect is NOT necessary?",
            options: [
                { value: "b", label: "I had eaten breakfast this morning." },
                { value: "a", label: "When I got home, she had already left." },
            ],
            correctAnswer: "b",
            explanation: "Only one past action with a clear time (this morning) → Past Simple would be better.",
            skillTag: "error-past-perfect-overuse",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence is correct?",
            options: [
                { value: "b", label: "She lived here in 2019." },
                { value: "a", label: "She has lived here in 2019." },
                { value: "c", label: "She has been lived here in 2019." },
            ],
            correctAnswer: "b",
            explanation: "Specific past year (2019) → Past Simple only.",
            skillTag: "error-specific-past-time",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which sentence talks about life experience (no specific time)?",
            options: [
                { value: "b", label: "I saw this movie last night." },
                { value: "a", label: "I have seen this movie three times." },
                { value: "c", label: "I had seen this movie last night." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect is used for life experience and repeated actions up to now.",
            skillTag: "result-life-experience-ever-never",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Which sentence correctly uses Future Perfect for a milestone?",
            options: [
                { value: "a", label: "By next year, she will work here for 10 years." },
                { value: "c", label: "By next year, she will have been worked here for 10 years." },
                { value: "b", label: "By next year, she will have worked here for 10 years." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect shows a completed duration by a future time.",
            skillTag: "result-future-milestone",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Which tense do you use for: past action → connected to NOW?",
            options: [
                { value: "a", label: "Present Perfect" },
                { value: "b", label: "Past Perfect" },
                { value: "c", label: "Future Perfect" },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect connects past actions or states to the present moment.",
            skillTag: "meta-choose-present-perfect",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Which sentence correctly uses Present Perfect (no specific time)?",
            options: [
                { value: "b", label: "I have finished my homework yesterday." },
                { value: "a", label: "I have finished my homework." },
                { value: "c", label: "I finished my homework since yesterday." },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect is fine without a specific past time expression.",
            skillTag: "result-completed-action",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which situation is best for Future Perfect?",
            options: [
                { value: "a", label: "Talking about an action at 5 PM tomorrow (at that time)" },
                { value: "c", label: "Talking about a habit in the future" },
                { value: "b", label: "Talking about an action that will be finished BEFORE 5 PM tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect is used for actions completed before a future time or event.",
            skillTag: "contrast-future-perfect-vs-simple-future",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Perfect Tenses Review Mini Quiz

    Present Perfect vs Past Simple:
    - result-completed-action
    - result-life-experience-ever-never
    - error-specific-past-time

    Present Perfect vs Present Perfect Continuous:
    - result-count-how-many

    Past Perfect vs Past Simple:
    - past-perfect-two-past-actions-sequence
    - past-perfect-cause-effect
    - error-past-perfect-overuse

    Future Perfect vs Future Simple:
    - result-future-completed-by-deadline
    - result-future-milestone
    - contrast-future-perfect-vs-simple-future
    - error-future-perfect-time-clause-will

    Meta understanding:
    - meta-choose-present-perfect

    If Present Perfect vs Past Simple tags are weak → review specific past time words (yesterday, last year, in 2019) vs no specific time and life experience.
    If Past Perfect tags are weak → focus on timelines with TWO past actions and highlight which one happened first.
    If Future Perfect tags are weak → contrast BY (before a time) vs AT/ON/WHEN (at that time), and practice “By the time…” sentences.
    If error tags are weak → do quick correction drills on:
      - Present Perfect + specific time (✗ I have visited Paris last year → ✓ I visited Paris last year)
      - Unnecessary Past Perfect for single past actions (✗ I had eaten breakfast this morning → ✓ I ate breakfast this morning)
      - Using “will” inside time clauses (✗ When you will arrive → ✓ When you arrive)
    */
};
