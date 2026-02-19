import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // -------------------------------------------------------------------------
        // 1. Introduction
        // -------------------------------------------------------------------------
        {
            id: "family-intro",
            title: "The Past Perfect Family: Looking Back from the Past",
            icon: "🕰️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think about telling a story from last week. "When I arrived, she had already left." "I was tired because I had been working all day." These forms let you show what happened <strong>first</strong> or how long something was happening <strong>before</strong> another past event.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Past Perfect is your storytelling tool. It creates a "flashback" in your stories, helping you explain background events and show the order of what happened. Without it, your stories would sound flat!</p>
            `,
            exercises: [
                {
                    id: "intro-check",
                    title: "Quick Check: Order or Duration?",
                    instructions: "Choose what each sentence emphasizes.",
                    items: [
                        {
                            type: "radio",
                            label: "\"When I arrived, she had already left.\"",
                            options: [
                                { value: "order", label: "Order: She left first, then I arrived" },
                                { value: "duration", label: "Duration: How long she had been there" },
                            ],
                            expectedAnswer: "order",
                        },
                        {
                            type: "radio",
                            label: "\"I was tired because I had been working all day.\"",
                            options: [
                                { value: "order", label: "Order: The sequence of events" },
                                { value: "duration", label: "Duration: How long I was working" },
                            ],
                            expectedAnswer: "duration",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 1.5 Core Idea Lens
        // -------------------------------------------------------------------------
        {
            id: "core-idea-lens",
            title: "Core Idea Lens: The Past Before the Past",
            icon: "🧠",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0;"><strong>Core idea:</strong> Perfect means <strong>two times connected</strong>.</p>
                    <p style="margin: 0.5rem 0 0 0;">Here the connection is <strong>past + past</strong>: one earlier past action connected to a later past moment.</p>
                </div>

                <div style="background: #fdfbf7; border: 1px solid #e2ddd5; border-radius: 0.5rem; padding: 0.875rem 1rem; margin: 1.25rem 0; text-align: center;">
                    <p style="margin: 0; font-size: 1rem;"><strong>When to use which:</strong> <span style="color: #b45309; font-weight: 600;">What happened first / result?</span> → <strong>result form</strong>. <span style="color: #6d28d9; font-weight: 600;">How long before that past moment?</span> → <strong>duration form</strong>.</p>
                </div>

                <p style="margin-bottom: 0.75rem; font-size: 0.8125rem; color: #5e6b7d;">(These are also called Past Perfect and Past Perfect Continuous—different from Past Simple or Past Continuous.)</p>

                <h3 style="margin-top: 1rem;">Result form (Past Perfect): Story sequence</h3>
                <p style="margin-bottom: 0.5rem;">Use when you want to show <strong>what happened first</strong> or what was already done before another past moment. Useful words: before, after, by the time, already.</p>
                <p>Example: <strong>"When I arrived, she had left."</strong></p>

                <h3>Result form in story cause and effect</h3>
                <p>Use it to explain reasons in a story: <strong>"I was tired because I had worked all night."</strong></p>

                <h3>Duration form (Past Perfect Continuous): Background duration</h3>
                <p>Use when you want to stress <strong>how long</strong> something had been happening before another past event:</p>
                <p><strong>"She was upset because she had been waiting for hours."</strong></p>

                <div style="background: #f4f1ea; border: 1px solid #e2ddd5; border-radius: 0.5rem; padding: 1rem 1.25rem; margin-top: 1rem;">
                    <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #1a202c;">Ask yourself</p>
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li>Emphasize <strong>what happened first</strong> or <strong>result</strong>? → <strong>result form</strong>.</li>
                        <li>Emphasize <strong>how long</strong> before that past moment? → <strong>duration form</strong>.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "ex-core-idea-past-family",
                    title: "Core Idea Check",
                    instructions: "Choose the best explanation for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"By the time we got there, the movie had started.\"",
                            options: [
                                { value: "order", label: "Past-before-past sequence (movie started first)" },
                                { value: "now", label: "Past connected directly to now" },
                                { value: "future", label: "Future deadline completion" },
                            ],
                            expectedAnswer: "order",
                        },
                        {
                            type: "radio",
                            label: "\"I was tired because I had worked all night.\" What is this doing?",
                            options: [
                                { value: "cause", label: "Giving a past cause for a past result" },
                                { value: "experience", label: "Describing life experience up to now" },
                                { value: "plan", label: "Describing a future plan" },
                            ],
                            expectedAnswer: "cause",
                        },
                        {
                            type: "radio",
                            label: "\"She had been waiting for an hour before the bus came.\"",
                            options: [
                                { value: "duration", label: "Background duration before another past event" },
                                { value: "single", label: "A single finished action only" },
                                { value: "deadline", label: "Action complete by a future point" },
                            ],
                            expectedAnswer: "duration",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 2. Side-by-Side Timeline Comparison
        // -------------------------------------------------------------------------
        {
            id: "timeline-comparison",
            title: "Visual Comparison: Two Timelines",
            icon: "📊",
            stepNumber: 1,
            explanation: `
                <h3>See the Difference</h3>
                <p>Both forms look backward from a past moment, but they focus on different things. Think of it like this:</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0;"><strong>Order = Sequence:</strong> "This happened, THEN that happened." (1st → 2nd)</p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>Duration = Background:</strong> "Something WAS happening before that moment."</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Order Timeline -->
                    <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #b45309;">Order: Which Happened First?</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: linear-gradient(to right, #f59e0b, #14b8a6, #94a3b8); transform: translateY(-50%);"></div>
                            <!-- 1st action -->
                            <div style="position: absolute; left: 15%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 50px; height: 50px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; border: 3px solid white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">1st</div>
                                <div style="position: absolute; top: 55px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #f59e0b; font-weight: 600;">had left</div>
                            </div>
                            <!-- 2nd action -->
                            <div style="position: absolute; left: 55%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 50px; height: 50px; background: #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9rem; border: 3px solid white; box-shadow: 0 2px 8px rgba(20, 184, 166, 0.4);">2nd</div>
                                <div style="position: absolute; top: 55px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #14b8a6; font-weight: 600;">arrived</div>
                            </div>
                            <!-- NOW -->
                            <div style="position: absolute; right: 5%; top: 50%; transform: translate(0, -50%);">
                                <div style="width: 40px; height: 40px; background: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1.5rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"When I <strong>arrived</strong>, she <strong>had already left</strong>."</p>
                    </div>

                    <!-- Duration Timeline -->
                    <div style="background: white; border: 2px solid #8b5cf6; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #6d28d9;">Duration: How Long Before?</h4>
                        <div style="position: relative; height: 80px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Duration bar -->
                            <div style="position: absolute; top: 50%; left: 15%; width: 40%; height: 24px; background: linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.8)); border-radius: 12px; transform: translateY(-50%); border: 2px solid #8b5cf6;">
                                <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: #4c1d95; font-weight: 600;">had been working</span>
                            </div>
                            <!-- Past event marker -->
                            <div style="position: absolute; left: 60%; top: 15%; transform: translateX(-50%);">
                                <div style="width: 3px; height: 55px; background: #14b8a6;"></div>
                                <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #14b8a6; font-weight: 600; background: white; padding: 0 0.25rem;">arrived</div>
                            </div>
                            <!-- NOW -->
                            <div style="position: absolute; right: 5%; top: 50%; transform: translate(0, -50%);">
                                <div style="width: 40px; height: 40px; background: #94a3b8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.7rem;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 1.5rem 0 0 0; font-size: 0.85rem; color: #4b5563;">"I was tired because I <strong>had been working</strong> all day."</p>
                    </div>
                </div>

                <h3>More Examples Side by Side</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Story Context</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; color: #b45309;">The Order (What First)</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #8b5cf6; color: #6d28d9;">The Duration (How Long)</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">The movie started...</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"...but I <strong>had already seen</strong> it."<br><span style="font-size: 0.8rem; color: #6b7280;">→ I saw it before (sequence)</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>had been waiting</strong> for 30 minutes."<br><span style="font-size: 0.8rem; color: #6b7280;">→ The waiting time (duration)</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">She got the job...</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"...because she <strong>had studied</strong> hard."<br><span style="font-size: 0.8rem; color: #6b7280;">→ Completed preparation</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"...after she <strong>had been applying</strong> for months."<br><span style="font-size: 0.8rem; color: #6b7280;">→ Long process (duration)</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">When I met him...</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"...he <strong>had just arrived</strong> from Spain."<br><span style="font-size: 0.8rem; color: #6b7280;">→ Recent completed action</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"...he <strong>had been living</strong> in Spain for 5 years."<br><span style="font-size: 0.8rem; color: #6b7280;">→ How long before our meeting</span></td>
                    </tr>
                </table>

                <div style="background: #fef9c3; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #eab308; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">⚠️ Important: Both forms need TWO past references!</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Past Perfect always works with another past action or time marker. You can't use it alone!</p>
                    <div style="margin-top: 0.75rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #dc2626; font-size: 0.9rem;">❌ "I had eaten breakfast." (Alone - unclear)</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #16a34a; font-size: 0.9rem;">✓ "I had eaten breakfast <strong>before I left</strong>." (With reference)</p>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Memory Trick:</p>
                    <p style="margin: 0.5rem 0 0 0;">Past Perfect is like telling a story with a "flashback." You're in the past, but you need to go EVEN FURTHER back to explain something!</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-timeline",
                    title: "Which Form Fits?",
                    instructions: "Match each sentence to the correct focus.",
                    items: [
                        {
                            type: "radio",
                            label: "\"When the police arrived, the thief had escaped.\"",
                            options: [
                                { value: "order", label: "Order: What happened first (thief escaped first)" },
                                { value: "duration", label: "Duration: How long something took" },
                            ],
                            expectedAnswer: "order",
                        },
                        {
                            type: "radio",
                            label: "\"She was exhausted because she had been studying for 8 hours.\"",
                            options: [
                                { value: "order", label: "Order: What happened first" },
                                { value: "duration", label: "Duration: How long before (8 hours)" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "\"By the time we got there, the movie had started.\"",
                            options: [
                                { value: "order", label: "Order: The movie started before we arrived" },
                                { value: "duration", label: "Duration: How long the movie played" },
                            ],
                            expectedAnswer: "order",
                        },
                    ],
                },
                {
                    id: "ex-story-context",
                    title: "Choose the Right Form for the Story",
                    instructions: "Which form fits better in each storytelling situation?",
                    items: [
                        {
                            type: "radio",
                            label: "The party was over. Everyone ___ home. (completed action before)",
                            options: [
                                { value: "continuous", label: "had been going (Duration)" },
                                { value: "simple", label: "had gone (Order - they left earlier)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Her eyes were red. She ___. (activity that explains her condition)",
                            options: [
                                { value: "continuous", label: "had been crying (Duration - ongoing activity)" },
                                { value: "simple", label: "had cried (Order - just states it happened)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "By the time I woke up, my parents ___ to work. (completed departure)",
                            options: [
                                { value: "continuous", label: "had been going (Duration)" },
                                { value: "simple", label: "had already gone (Order - sequence)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "The ground was wet. It ___ all night. (duration of weather)",
                            options: [
                                { value: "continuous", label: "had been raining (Duration - emphasizes duration)" },
                                { value: "simple", label: "had rained (Order - just states fact)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. Focus on Order (Simple)
        // -------------------------------------------------------------------------
        {
            id: "focus-order",
            title: "Focus on Order",
            icon: "🔢",
            stepNumber: 2,
            explanation: `
                <h3>What Happened First?</h3>
                <p>Use <strong>The Past Perfect (Order)</strong> (had + past participle) to show which action happened <strong>FIRST</strong> when telling a story about two past events.</p>

                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #b45309;">The Two-Verb Rule</h4>
                    <p style="margin: 0.5rem 0;">This tense almost ALWAYS needs TWO past events:</p>
                    <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 180px; background: #fef3c7; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; font-weight: 600; color: #b45309;">Past Perfect = FIRST action</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">had + past participle</p>
                        </div>
                        <div style="flex: 1; min-width: 180px; background: #ccfbf1; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #14b8a6;">
                            <p style="margin: 0; font-weight: 600; color: #0f766e;">Past Simple = SECOND action</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">regular past tense</p>
                        </div>
                    </div>
                </div>

                <h4>Common Patterns</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li><strong>When</strong> + Past Simple, Past Perfect → "When I <span style="color: #14b8a6;">arrived</span>, she <span style="color: #f59e0b;">had left</span>."</li>
                    <li>Past Perfect + <strong>before</strong> + Past Simple → "She <span style="color: #f59e0b;">had finished</span> before she <span style="color: #14b8a6;">went</span> home."</li>
                    <li><strong>After</strong> + Past Perfect, Past Simple → "After he <span style="color: #f59e0b;">had eaten</span>, he <span style="color: #14b8a6;">watched</span> TV."</li>
                    <li><strong>By the time</strong> + Past Simple, Past Perfect → "By the time we <span style="color: #14b8a6;">arrived</span>, the show <span style="color: #f59e0b;">had ended</span>."</li>
                </ul>

                <h4>More Example Sentences</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.95rem;">
                        <li>"The streets were wet because it <strong>had rained</strong> earlier." <span style="color: #6b7280;">(Rain → wet streets)</span></li>
                        <li>"She knew the answer because she <strong>had studied</strong> hard." <span style="color: #6b7280;">(Study → knew)</span></li>
                        <li>"I wasn't hungry because I <strong>had just eaten</strong>." <span style="color: #6b7280;">(Eat → not hungry)</span></li>
                        <li>"He couldn't enter because he <strong>had forgotten</strong> his key." <span style="color: #6b7280;">(Forget → couldn't enter)</span></li>
                        <li>"They were happy because they <strong>had won</strong> the game." <span style="color: #6b7280;">(Win → happy)</span></li>
                    </ul>
                </div>

                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border: 2px solid #10b981; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✓ Remember the Formula</h4>
                    <p style="margin: 0; font-size: 1.1rem; font-family: monospace; text-align: center;">
                        <strong>had</strong> + <strong>past participle</strong> (eaten, written, gone, done)
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; text-align: center;">
                        Same for ALL subjects: I/you/he/she/it/we/they <strong>had</strong> + verb³
                    </p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📍 Sequence in Stories",
                    description: "Showing the order of events when telling a story",
                    examples: [
                        {
                            sentence: "When I <strong style='color: #14b8a6;'>got</strong> home, my roommate <strong style='color: #f59e0b;'>had cooked</strong> dinner.",
                            explanation: "First: cooked → Second: got home",
                        },
                        {
                            sentence: "The bus <strong style='color: #f59e0b;'>had already left</strong> when we <strong style='color: #14b8a6;'>arrived</strong> at the stop.",
                            explanation: "First: bus left → Second: we arrived",
                        },
                    ],
                },
                {
                    title: "📍 Explaining Past Situations",
                    description: "Giving background to why something was a certain way",
                    examples: [
                        {
                            sentence: "She was nervous because she <strong style='color: #f59e0b;'>hadn't flown</strong> before.",
                            explanation: "The lack of flying experience came first",
                        },
                        {
                            sentence: "I knew the city well because I <strong style='color: #f59e0b;'>had visited</strong> many times.",
                            explanation: "The visits happened before knowing the city",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-simple-order",
                    title: "Identify the First Action",
                    instructions: "Which action happened FIRST?",
                    items: [
                        {
                            type: "radio",
                            label: "When the bell rang, the students had finished the test.",
                            options: [
                                { value: "bell", label: "The bell rang" },
                                { value: "students", label: "The students finished the test" },
                            ],
                            expectedAnswer: "students",
                        },
                        {
                            type: "radio",
                            label: "She had saved money before she bought the car.",
                            options: [
                                { value: "saved", label: "She saved money" },
                                { value: "bought", label: "She bought the car" },
                            ],
                            expectedAnswer: "saved",
                        },
                        {
                            type: "radio",
                            label: "By the time I called, they had already left.",
                            options: [
                                { value: "called", label: "I called" },
                                { value: "left", label: "They left" },
                            ],
                            expectedAnswer: "left",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 4. Focus on Duration (Continuous)
        // -------------------------------------------------------------------------
        {
            id: "focus-duration",
            title: "Focus on Duration",
            icon: "⏱️",
            stepNumber: 2,
            explanation: `
                <h3>How Long Before That Moment?</h3>
                <p>Use <strong>The Past Perfect (Duration)</strong> (had been + verb-ing) to show <strong>how long</strong> something was happening before another past event, or to paint background for your story.</p>

                <div style="background: white; border: 2px solid #8b5cf6; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #6d28d9;">Duration Before a Past Moment</h4>
                    <div style="position: relative; margin: 1.5rem auto; max-width: 450px;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 36px; background: linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.8)); border-radius: 18px; border: 2px solid #8b5cf6;">
                            <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.85rem; color: #4c1d95; font-weight: 600;">had been waiting for 2 hours</span>
                        </div>
                        <!-- Labels -->
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">
                            <span>Started waiting</span>
                            <span style="color: #8b5cf6; font-weight: 600;">→ bus arrived</span>
                        </div>
                    </div>
                    <p style="text-align: center; margin: 0; font-size: 0.9rem;">"I <strong>had been waiting</strong> for 2 hours when the bus <strong>finally arrived</strong>."</p>
                </div>

                <h4>Three Main Uses for Past Perfect Continuous</h4>

                <div style="display: grid; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6d28d9;">1. Duration Before a Past Event</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Emphasizing how long something had been happening:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"They <strong>had been dating</strong> for 3 years before they got married."</li>
                            <li>"I <strong>had been studying</strong> for hours when you called."</li>
                        </ul>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6d28d9;">2. Explaining Past Conditions (Background)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Why someone or something was in a certain state:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"He was out of breath because he <strong>had been running</strong>."</li>
                            <li>"Her eyes were red because she <strong>had been crying</strong>."</li>
                        </ul>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6d28d9;">3. Activity That Had Just Stopped</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Recent past activity with visible evidence:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"The ground was wet. It <strong>had been raining</strong>."</li>
                            <li>"The kitchen smelled good. Someone <strong>had been cooking</strong>."</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border: 2px solid #10b981; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✓ Remember the Formula</h4>
                    <p style="margin: 0; font-size: 1.1rem; font-family: monospace; text-align: center;">
                        <strong>had been</strong> + <strong>verb-ing</strong>
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; text-align: center;">
                        Same for ALL subjects: I/you/he/she/it/we/they <strong>had been</strong> + -ing
                    </p>
                </div>
            `,
            usageMeanings: [
                {
                    title: "⏱️ Duration Before a Past Event",
                    description: "Emphasizing how long something was happening",
                    examples: [
                        {
                            sentence: "She <strong>had been working</strong> at the company for 5 years when she got promoted.",
                            explanation: "Duration (5 years) before the promotion",
                        },
                        {
                            sentence: "We <strong>had been driving</strong> for hours when we finally saw the ocean.",
                            explanation: "Duration before seeing the ocean",
                        },
                    ],
                },
                {
                    title: "🎨 Painting Background (Explaining Why)",
                    description: "Explaining past situations with prior activity",
                    examples: [
                        {
                            sentence: "He was exhausted because he <strong>had been running</strong> all morning.",
                            explanation: "The running explains why he was exhausted",
                        },
                        {
                            sentence: "The ground was wet. It <strong>had been raining</strong>.",
                            explanation: "Recent activity explains the wet ground",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-pp-continuous-duration",
                    title: "Duration Focus",
                    instructions: "Complete with Past Perfect Continuous (had been + -ing).",
                    items: [
                        {
                            type: "text",
                            label: "She was tired because she ___ (study) all night.",
                            expectedAnswer: "had been studying",
                            placeholder: "had been studying",
                        },
                        {
                            type: "text",
                            label: "They ___ (wait) for an hour when the doors finally opened.",
                            expectedAnswer: "had been waiting",
                            placeholder: "had been waiting",
                        },
                        {
                            type: "text",
                            label: "I ___ (live) in Boston for 3 years before I moved to New York.",
                            expectedAnswer: "had been living",
                            placeholder: "had been living",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 5. Positive Forms
        // -------------------------------------------------------------------------
        {
            id: "positive-forms",
            title: "Positive Forms: Side by Side",
            icon: "✓",
            stepNumber: 3,
            explanation: `
                <h3>Building Positive Sentences</h3>
                <p>Both forms use <strong>had</strong> for all subjects (I, you, he, she, it, we, they).</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Order</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #f59e0b;">had</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">She <strong>had finished</strong> her work.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>had left</strong> early.</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Duration</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #ede9fe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #8b5cf6;">had been</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">She <strong>had been working</strong> all day.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>had been waiting</strong> for hours.</p>
                    </div>
                </div>

                <h3>Side-by-Side Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Context</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #f59e0b; color: #b45309;">Order (What first)</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #8b5cf6; color: #6d28d9;">Duration (How long)</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Work</td>
                        <td style="padding: 0.5rem;">She <strong>had finished</strong> the report.</td>
                        <td style="padding: 0.5rem;">She <strong>had been working</strong> on it all week.</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Travel</td>
                        <td style="padding: 0.5rem;">They <strong>had left</strong> before I arrived.</td>
                        <td style="padding: 0.5rem;">They <strong>had been driving</strong> for 10 hours.</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem;">Study</td>
                        <td style="padding: 0.5rem;">He <strong>had passed</strong> all his exams.</td>
                        <td style="padding: 0.5rem;">He <strong>had been studying</strong> for months.</td>
                    </tr>
                </table>
            `,
            exercises: [
                {
                    id: "ex-pp-positive",
                    title: "Complete with the Correct Form",
                    instructions: "Use Order (had + participle) or Duration (had been + -ing) based on context.",
                    items: [
                        {
                            type: "text",
                            label: "When I arrived, the meeting ___ (already / start). [order]",
                            expectedAnswer: "had already started",
                            placeholder: "had already started",
                        },
                        {
                            type: "text",
                            label: "She was exhausted because she ___ (work) for 12 hours. [duration]",
                            expectedAnswer: "had been working",
                            placeholder: "had been working",
                        },
                        {
                            type: "text",
                            label: "Before he moved to the US, he ___ (never / see) snow. [order]",
                            expectedAnswer: "had never seen",
                            placeholder: "had never seen",
                        },
                        {
                            type: "text",
                            label: "They ___ (drive) all day, so they were tired. [duration]",
                            expectedAnswer: "had been driving",
                            placeholder: "had been driving",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 6. Negative Forms
        // -------------------------------------------------------------------------
        {
            id: "negative-forms",
            title: "Negative Forms: Side by Side",
            icon: "✗",
            stepNumber: 4,
            explanation: `
                <h3>Making Negatives</h3>
                <p>Add <strong>not</strong> after <strong>had</strong>. Use the contraction <strong>hadn't</strong> in conversation.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Order Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">hadn't</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>hadn't finished</strong> when he called.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">She <strong>hadn't seen</strong> the movie before.</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Duration Negative</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">Subject</span>
                            <span>+</span>
                            <span style="background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #ef4444;">hadn't been</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">verb-ing</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">I <strong>hadn't been sleeping</strong> well.</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">They <strong>hadn't been waiting</strong> long.</p>
                    </div>
                </div>

                <h3>Understanding Negative Meanings</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Explaining lack of experience:</p>
                        <p style="margin: 0.25rem 0 0 0;">"She was nervous because she <strong>hadn't flown</strong> before."</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ Zero flying experience before that moment</p>
                    </div>
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Explaining lack of recent activity:</p>
                        <p style="margin: 0.25rem 0 0 0;">"He failed the test because he <strong>hadn't been studying</strong>."</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ Studying wasn't happening before the test</p>
                    </div>
                    <div>
                        <p style="margin: 0; font-weight: 600;">Denying a prior action:</p>
                        <p style="margin: 0.25rem 0 0 0;">"I <strong>hadn't met</strong> him before the party."</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ We were strangers before that night</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-negative",
                    title: "Make It Negative",
                    instructions: "Complete with the negative form.",
                    items: [
                        {
                            type: "text",
                            label: "She was nervous because she ___ (not / fly) before. [Order]",
                            expectedAnswer: "hadn't flown",
                            placeholder: "hadn't flown",
                        },
                        {
                            type: "text",
                            label: "He ___ (not / work) there long when he got promoted. [Duration]",
                            expectedAnswer: "hadn't been working",
                            placeholder: "hadn't been working",
                        },
                        {
                            type: "text",
                            label: "We ___ (not / meet) before that day. [Order]",
                            expectedAnswer: "hadn't met",
                            placeholder: "hadn't met",
                        },
                        {
                            type: "text",
                            label: "I ___ (not / feel) well lately. [Duration]",
                            expectedAnswer: "hadn't been feeling",
                            placeholder: "hadn't been feeling",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 7. Question Forms
        // -------------------------------------------------------------------------
        {
            id: "question-forms",
            title: "Question Forms: Side by Side",
            icon: "❓",
            stepNumber: 5,
            explanation: `
                <h3>Asking Questions</h3>
                <p>Put <strong>Had</strong> at the beginning of the sentence.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Order Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #f59e0b;">Had</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #fed7aa; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">past participle</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #b45309;">What had happened?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Had she finished before you left?</p>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Duration Questions</h4>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                            <span style="background: #ede9fe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600; border: 1px solid #8b5cf6;">Had</span>
                            <span>+</span>
                            <span style="background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">subject</span>
                            <span>+</span>
                            <span style="background: #c4b5fd; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">been + -ing</span>
                            <span>?</span>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem;"><strong style="color: #6d28d9;">How long had it been going on?</strong></p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; font-style: italic;">Had you been waiting long?</p>
                    </div>
                </div>

                <h3>Common Question Patterns</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600; color: #b45309;">Result form questions:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li><strong>Had</strong> you <strong>met</strong> before?</li>
                            <li><strong>Had</strong> she <strong>finished</strong> by then?</li>
                            <li><strong>What had</strong> <strong>happened</strong>?</li>
                            <li><strong>Why had</strong> he <strong>left</strong>?</li>
                        </ul>
                    </div>
                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600; color: #6d28d9;">Duration form questions:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li><strong>How long had</strong> you <strong>been waiting</strong>?</li>
                            <li><strong>What had</strong> she <strong>been doing</strong>?</li>
                            <li><strong>Had</strong> it <strong>been raining</strong>?</li>
                            <li><strong>Had</strong> they <strong>been working</strong> hard?</li>
                        </ul>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-questions",
                    title: "Form Questions",
                    instructions: "Complete the questions.",
                    items: [
                        {
                            type: "text",
                            label: "___ you ___ (see) the movie before? [result form]",
                            expectedAnswer: "Had you seen",
                            placeholder: "Had you seen",
                        },
                        {
                            type: "text",
                            label: "How long ___ she ___ (work) there before she quit? [duration form]",
                            expectedAnswer: "had she been working",
                            placeholder: "had she been working",
                        },
                        {
                            type: "text",
                            label: "___ they ___ (meet) before the wedding? [result form]",
                            expectedAnswer: "Had they met",
                            placeholder: "Had they met",
                        },
                        {
                            type: "text",
                            label: "___ you ___ (wait) long when the bus came? [duration form]",
                            expectedAnswer: "Had you been waiting",
                            placeholder: "Had you been waiting",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 8. Time Expressions
        // -------------------------------------------------------------------------
        {
            id: "time-expressions",
            title: "Time Expressions & Signal Words",
            icon: "📅",
            stepNumber: 6,
            explanation: `
                <h3>Key Time Words</h3>
                <p>These words help signal which form to use.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">Result form signal words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">already</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">just</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">never</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">before</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">after</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">by the time</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">when</span>
                        </div>
                    </div>

                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #6d28d9;">Duration form signal words</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">for + duration</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">since</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">all day/morning</span>
                            <span style="background: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 500;">how long</span>
                        </div>
                    </div>
                </div>

                <h3>Signal Words in Sentences</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #b45309;"><strong>Result form:</strong> "I <strong>had already finished</strong> when you called."</p>
                        <p style="margin: 0.25rem 0 0 0; color: #b45309;">"She <strong>had never seen</strong> snow before that trip."</p>
                        <p style="margin: 0.25rem 0 0 0; color: #b45309;">"<strong>By the time</strong> we arrived, they <strong>had left</strong>."</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #6d28d9;"><strong>Duration form:</strong> "They <strong>had been waiting</strong> <strong>for</strong> 2 hours."</p>
                        <p style="margin: 0.25rem 0 0 0; color: #6d28d9;">"I was tired because I <strong>had been working</strong> <strong>all day</strong>."</p>
                        <p style="margin: 0.25rem 0 0 0; color: #6d28d9;">"<strong>How long</strong> <strong>had</strong> you <strong>been living</strong> there?"</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">Quick Rule</h4>
                    <p style="margin: 0;"><strong>For/Since + duration</strong> before another past event → usually duration form</p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>Already/just/before + result</strong> → usually result form</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-time-words",
                    title: "Which Form?",
                    instructions: "Choose result form or duration form based on the signal words.",
                    items: [
                        {
                            type: "radio",
                            label: "She had ___ finished when I arrived. (already)",
                            options: [
                                { value: "simple", label: "Result form: had already finished" },
                                { value: "continuous", label: "Duration form: had been already finishing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "They had ___ for 3 hours when the rain stopped. (for + duration)",
                            options: [
                                { value: "simple", label: "Result form: had waited" },
                                { value: "continuous", label: "Duration form: had been waiting" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "I had ___ seen snow before that day. (never)",
                            options: [
                                { value: "simple", label: "Result form: had never seen" },
                                { value: "continuous", label: "Duration form: had never been seeing" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 9. Common Mistakes
        // -------------------------------------------------------------------------
        {
            id: "common-mistakes",
            title: "Common Mistakes & Comparisons",
            icon: "⚠️",
            stepNumber: 7,
            explanation: `
                <h3>Avoid These Errors!</h3>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 1: Using Past Perfect with Only ONE Action</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I had eaten lunch yesterday.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I ate lunch yesterday.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">Past Perfect needs TWO past references. For single past actions, use Past Simple.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 2: Using Past Perfect for BOTH Actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">She had finished before she had left.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">She had finished before she left.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">Only the FIRST action uses Past Perfect (result or duration form). The second uses Past Simple.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 3: Confusing with Present Perfect</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">When I arrived, she has left.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">When I arrived, she had left.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">Past Perfect (had) looks back from a past moment. Present Perfect (have/has) connects to NOW.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 4: Using the duration form with state verbs</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.75rem 0;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I had been knowing her for years.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I had known her for years.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">State verbs (know, believe, like, own, want) use the result form even for duration.</p>
                </div>

                <h3>More Wrong vs Right Examples</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #dc2626;">❌ "I went to the cinema after I had been finishing work."</p>
                        <p style="margin: 0; color: #16a34a;">✓ "I went to the cinema after I had finished work." <span style="font-size: 0.85rem; color: #6b7280;">(finish = completion)</span></p>
                    </div>
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #dc2626;">❌ "She had been owning that car for 5 years."</p>
                        <p style="margin: 0; color: #16a34a;">✓ "She had owned that car for 5 years." <span style="font-size: 0.85rem; color: #6b7280;">(own = state verb)</span></p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #dc2626;">❌ "When I arrived, she had left already."</p>
                        <p style="margin: 0; color: #16a34a;">✓ "When I arrived, she had already left." <span style="font-size: 0.85rem; color: #6b7280;">(already goes before the main verb)</span></p>
                    </div>
                </div>
            `,
            comparison: {
                title: "Past Perfect vs Past Simple",
                leftLabel: "Past Perfect (First Action)",
                rightLabel: "Past Simple (Second/Single Action)",
                rows: [
                    {
                        label: "Purpose",
                        left: "Shows which of TWO past actions happened FIRST",
                        right: "Describes a completed past action (can stand alone)",
                    },
                    {
                        label: "Formula",
                        left: "had + past participle",
                        right: "verb + -ed or irregular past",
                    },
                    {
                        label: "Example",
                        left: "When I arrived, she had left.",
                        right: "She left at 5pm.",
                    },
                ],
            },
            exercises: [
                {
                    id: "ex-pp-mistakes",
                    title: "Fix the Mistakes",
                    instructions: "Choose the CORRECT version.",
                    items: [
                        {
                            type: "radio",
                            label: "Single past action:",
                            options: [
                                { value: "wrong", label: "I had visited Paris last year." },
                                { value: "correct", label: "I visited Paris last year." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Two past actions:",
                            options: [
                                { value: "correct", label: "When I arrived, she had already left." },
                                { value: "wrong", label: "When I arrived, she already left." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Past Perfect for first action only:",
                            options: [
                                { value: "wrong", label: "After he had eaten, he had watched TV." },
                                { value: "correct", label: "After he had eaten, he watched TV." },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 10. Mixed Practice
        // -------------------------------------------------------------------------
        {
            id: "mixed-practice",
            title: "Mixed Practice: Storytelling",
            icon: "📖",
            stepNumber: 8,
            explanation: `
                <h3>Put It All Together!</h3>
                <p>In real storytelling, we use both forms to paint a complete picture of the past.</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #64748b;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #475569;">Example Story</h4>
                    <p style="margin: 0; line-height: 1.8;">
                        "When Maria <span style="color: #14b8a6; font-weight: 600;">arrived</span> at the job interview,
                        she was nervous. She <span style="color: #8b5cf6; font-weight: 600;">had been preparing</span> for weeks,
                        but she <span style="color: #f59e0b; font-weight: 600;">had never done</span> an interview in English before.
                        Luckily, she <span style="color: #f59e0b; font-weight: 600;">had practiced</span> her answers with a friend."
                    </p>
                </div>

                <h4>Decision Guide:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>What happened first?</strong> → result form (had + past participle)</li>
                    <li><strong>How long before?</strong> → duration form (had been + -ing)</li>
                    <li><strong>Background/cause?</strong> → Usually duration form</li>
                    <li><strong>Result/completion?</strong> → Usually result form</li>
                </ul>

                <h3>More Story Examples</h3>
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #ede9fe 100%); padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0; font-weight: 600;">🏠 Moving Day:</p>
                    <p style="margin: 0; font-size: 1.05rem; line-height: 1.8;">
                        "When the movers <span style="color: #14b8a6; font-weight: 600;">arrived</span>,
                        we <span style="color: #f59e0b; font-weight: 600;">had already packed</span> most of the boxes <span style="color: #6b7280;">(completed first)</span>.
                        We were exhausted because we <span style="color: #8b5cf6; font-weight: 600;">had been packing</span> since 6am <span style="color: #6b7280;">(duration)</span>.
                        Luckily, we <span style="color: #f59e0b; font-weight: 600;">had hired</span> professionals <span style="color: #6b7280;">(prior decision)</span>,
                        so we <span style="color: #f59e0b; font-weight: 600;">hadn't had to</span> worry about the heavy furniture <span style="color: #6b7280;">(no prior worry)</span>."
                    </p>
                </div>

                <div style="background: linear-gradient(135deg, #fef3c7 0%, #ede9fe 100%); padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0 0 0.5rem 0; font-weight: 600;">🎓 Graduation Day:</p>
                    <p style="margin: 0; font-size: 1.05rem; line-height: 1.8;">
                        "I <span style="color: #14b8a6; font-weight: 600;">felt</span> incredibly proud.
                        I <span style="color: #8b5cf6; font-weight: 600;">had been working</span> toward this moment for four years <span style="color: #6b7280;">(duration)</span>.
                        I <span style="color: #f59e0b; font-weight: 600;">had passed</span> all my exams <span style="color: #6b7280;">(completed first)</span>,
                        and I <span style="color: #f59e0b; font-weight: 600;">had made</span> so many friends along the way <span style="color: #6b7280;">(completed first)</span>."
                    </p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-pp-mixed",
                    title: "Complete the Story",
                    instructions: "Choose result form or duration form based on context.",
                    items: [
                        {
                            type: "radio",
                            label: "By the time I got to the station, the train ___ .",
                            options: [
                                { value: "simple", label: "had already left (result: train is gone)" },
                                { value: "continuous", label: "had been leaving (duration)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "She was exhausted because she ___ all night for the exam.",
                            options: [
                                { value: "simple", label: "had studied (completed action)" },
                                { value: "continuous", label: "had been studying (duration: all night)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "He couldn't pay the rent because he ___ his job.",
                            options: [
                                { value: "simple", label: "had lost (result: no job now)" },
                                { value: "continuous", label: "had been losing (ongoing loss)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "The road was wet. It ___ earlier.",
                            options: [
                                { value: "simple", label: "had rained (it rained and stopped)" },
                                { value: "continuous", label: "had been raining (evidence of recent activity)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
                {
                    id: "ex-pp-fill-story",
                    title: "Your Turn: Complete the Sentences",
                    instructions: "Fill in with the correct form.",
                    items: [
                        {
                            type: "text",
                            label: "When the landlord inspected the apartment, we ___ (already / clean) everything.",
                            expectedAnswer: "had already cleaned",
                            placeholder: "had already cleaned",
                        },
                        {
                            type: "text",
                            label: "They ___ (live) in that neighborhood for 5 years before they moved.",
                            expectedAnswer: "had been living",
                            placeholder: "had been living",
                        },
                        {
                            type: "text",
                            label: "I got the job because I ___ (prepare) well for the interview.",
                            expectedAnswer: "had prepared",
                            placeholder: "had prepared",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // Summary
        // -------------------------------------------------------------------------
        {
            id: "family-summary",
            title: "Summary: The Past Perfect Family",
            icon: "📋",
            stepNumber: 9,
            explanation: `
                <h3>What You've Learned</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #b45309;">The Time Traveler (result form)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> had + past participle</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> What happened FIRST</p>
                        <p style="margin: 0;"><strong>Key words:</strong> already, just, before, after, by the time, when, never</p>
                    </div>
                    <div style="background: #ede9fe; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #8b5cf6;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #6d28d9;">The Background Painter (duration form)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> had been + verb-ing</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> How LONG before</p>
                        <p style="margin: 0;"><strong>Key words:</strong> for, since, all day/morning, how long</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">🎯 The Golden Rules</h4>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>Both forms need <strong>TWO past references</strong></li>
                        <li>Past Perfect = FIRST action; Past Simple = SECOND action</li>
                        <li>Result form for <strong>sequence/result</strong>; duration form for <strong>duration/background</strong></li>
                        <li>State verbs (know, believe, own) → Always result form</li>
                    </ul>
                </div>

                <h3>Quick Reference Chart</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Use...</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #f59e0b; color: #b45309;">Result form</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #8b5cf6; color: #6d28d9;">Duration form</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Sequence (first action)</td>
                        <td style="padding: 0.5rem;">✓ had finished before...</td>
                        <td style="padding: 0.5rem;">-</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Duration before</td>
                        <td style="padding: 0.5rem;">-</td>
                        <td style="padding: 0.5rem;">✓ had been waiting for...</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Explain a past state</td>
                        <td style="padding: 0.5rem;">-</td>
                        <td style="padding: 0.5rem;">✓ was tired because had been working</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Never/already/just</td>
                        <td style="padding: 0.5rem;">✓ had never seen</td>
                        <td style="padding: 0.5rem;">-</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem;">State verbs</td>
                        <td style="padding: 0.5rem;">✓ had known for years</td>
                        <td style="padding: 0.5rem;">✗ Never use!</td>
                    </tr>
                </table>

                <h3>One Final Example</h3>
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #ede9fe 100%); padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0; font-style: italic; font-size: 1.05rem; line-height: 1.7;">
                        "When I <strong style="color: #14b8a6;">met</strong> my wife <span style="color: #6b7280;">(Past Simple - reference point)</span>,
                        she <strong style="color: #8b5cf6;">had been living</strong> in London for 3 years <span style="color: #6b7280;">(duration)</span>.
                        She <strong style="color: #f59e0b;">had already finished</strong> her degree <span style="color: #6b7280;">(completed before)</span>,
                        and she <strong style="color: #f59e0b;">had just started</strong> her first job <span style="color: #6b7280;">(recent completion)</span>.
                        I <strong style="color: #f59e0b;">had known</strong> her name for a while <span style="color: #6b7280;">(state verb = Simple)</span>,
                        but we <strong style="color: #f59e0b;">had never spoken</strong> before that day <span style="color: #6b7280;">(never = Simple)</span>."
                    </p>
                </div>
            `,
            tipBox: {
                title: "🚀 Keep Practicing!",
                content: "The Past Perfect Family is essential for storytelling. Practice by retelling events from your day or week, emphasizing what happened first and how long things took!"
            },
        },
    ],

    // -------------------------------------------------------------------------
    // Mini Quiz: 15 Questions
    // -------------------------------------------------------------------------
    miniQuiz: [
        // Concepts & Usage (1-5)
        {
            id: "ppf-q1",
            question: "When do we use the result form (Past Perfect)?",
            options: [
                { value: "a", label: "To show how long something took" },
                { value: "c", label: "To describe current situations" },
                { value: "b", label: "To show which of two past actions happened FIRST" },
            ],
            correctAnswer: "b",
            explanation: "The result form (Past Perfect) shows sequence - which action happened first in a story about the past.",
        },
        {
            id: "ppf-q2",
            question: "When do we use the duration form (Past Perfect Continuous)?",
            options: [
                { value: "a", label: "To show duration BEFORE another past event" },
                { value: "b", label: "To count completed actions" },
                { value: "c", label: "To talk about future plans" },
            ],
            correctAnswer: "a",
            explanation: "The duration form (Past Perfect Continuous) shows how long something had been happening before another past moment.",
        },
        {
            id: "ppf-q3",
            question: "\"When I arrived, the movie had started.\" Which action happened first?",
            options: [
                { value: "b", label: "The movie started" },
                { value: "a", label: "I arrived" },
            ],
            correctAnswer: "b",
            explanation: "The action with Past Perfect (had started) happened FIRST.",
        },
        {
            id: "ppf-q4",
            question: "Why is this sentence wrong? \"I had eaten lunch yesterday.\"",
            options: [
                { value: "a", label: "The verb form is wrong" },
                { value: "c", label: "\"Lunch\" should be \"dinner\"" },
                { value: "b", label: "Past Perfect needs TWO past references, not just one" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect needs two past actions or times. For a single past action, use Past Simple: \"I ate lunch yesterday.\"",
        },
        {
            id: "ppf-q5",
            question: "\"She was exhausted because she had been working all day.\" What's the focus?",
            options: [
                { value: "b", label: "The duration of working (all day)" },
                { value: "a", label: "The result of finishing work" },
                { value: "c", label: "What she will do tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "\"All day\" emphasizes duration, so we use Continuous to paint the background for why she was exhausted.",
        },

        // Sentence Completion (6-10)
        {
            id: "ppf-q6",
            question: "By the time the ambulance arrived, the patient ___ .",
            options: [
                { value: "b", label: "has already died" },
                { value: "a", label: "had already died" },
                { value: "c", label: "already died" },
            ],
            correctAnswer: "a",
            explanation: "The result form shows the first action (dying) happened before the second (ambulance arrived).",
        },
        {
            id: "ppf-q7",
            question: "She was nervous because she ___ an interview before.",
            options: [
                { value: "b", label: "had never been doing" },
                { value: "c", label: "never did" },
                { value: "a", label: "had never done" },
            ],
            correctAnswer: "a",
            explanation: "\"Never\" + completion = Simple. She had no interview experience before that moment.",
        },
        {
            id: "ppf-q8",
            question: "They ___ in that apartment for 10 years when they decided to move.",
            options: [
                { value: "b", label: "had been living" },
                { value: "a", label: "lived" },
                { value: "c", label: "have been living" },
            ],
            correctAnswer: "b",
            explanation: "\"For 10 years\" emphasizes duration before the decision, so we use Continuous.",
        },
        {
            id: "ppf-q9",
            question: "After she ___ her homework, she watched TV.",
            options: [
                { value: "b", label: "had been finishing" },
                { value: "a", label: "had finished" },
                { value: "c", label: "has finished" },
            ],
            correctAnswer: "a",
            explanation: "\"After\" shows sequence. The first action (finish) uses the result form (Past Perfect).",
        },
        {
            id: "ppf-q10",
            question: "How long ___ you ___ before the bus came?",
            options: [
                { value: "a", label: "had / waited" },
                { value: "c", label: "have / been waiting" },
                { value: "b", label: "had / been waiting" },
            ],
            correctAnswer: "b",
            explanation: "\"How long\" asks about duration, so we use Continuous.",
        },

        // Form Accuracy (11-13)
        {
            id: "ppf-q11",
            question: "What is the correct negative form of \"She had finished\"?",
            options: [
                { value: "a", label: "She hadn't finished" },
                { value: "b", label: "She hasn't finished" },
                { value: "c", label: "She didn't finished" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect negative: had not (hadn't) + past participle.",
        },
        {
            id: "ppf-q12",
            question: "Which question form is correct?",
            options: [
                { value: "b", label: "Did they had been working all day?" },
                { value: "a", label: "Had they been working all day?" },
                { value: "c", label: "Were they had been working all day?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Had + subject + been + verb-ing?",
        },
        {
            id: "ppf-q13",
            question: "Choose the correct structure for Past Perfect Continuous:",
            options: [
                { value: "a", label: "had + past participle" },
                { value: "c", label: "have been + verb-ing" },
                { value: "b", label: "had been + verb-ing" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect Continuous: had been + verb-ing (e.g., had been working).",
        },

        // Error Identification (14-15)
        {
            id: "ppf-q14",
            question: "Is this correct? \"She had finished her work before she had gone home.\"",
            options: [
                { value: "a", label: "Yes, it's correct" },
                { value: "b", label: "No - only the FIRST action should use Past Perfect" },
            ],
            correctAnswer: "b",
            explanation: "Only the first action uses Past Perfect. Correct: \"She had finished her work before she went home.\"",
        },
        {
            id: "ppf-q15",
            question: "Choose the best summary of the Past Perfect Family:",
            options: [
                { value: "b", label: "Both forms are exactly the same" },
                { value: "a", label: "Result form shows sequence (first action); duration form shows duration before" },
                { value: "c", label: "Result form is for present; duration form is for past" },
            ],
            correctAnswer: "a",
            explanation: "This is the core distinction: result form = what happened first; duration form = how long before.",
        },
    ],
};
