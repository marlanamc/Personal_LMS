import type {
    InteractiveGuideContent,
} from "@/types/activity";

export const presentPerfectFamilyContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // -------------------------------------------------------------------------
        // 1. Introduction
        // -------------------------------------------------------------------------
        {
            id: "family-intro",
            title: "The Present Perfect Family: Connecting Past to Present",
            icon: "👨‍👩‍👧‍👦",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Think about telling someone about your day. "I've finished my shift." "I've been working all morning." Same situation—both are about work—but two different ways to talk about it. That's the Present Perfect family! One focuses on what's <strong>done</strong>, the other on what you've been <strong>doing</strong>.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>The Present Perfect connects past actions to the present moment. Whether you want to show a completed result or emphasize ongoing effort, these two forms give you the flexibility to express exactly what you mean.</p>
            `,
            exercises: [
                {
                    id: "intro-check",
                    title: "Quick Check: Result or Activity?",
                    instructions: "Choose what each sentence emphasizes.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I have finished my homework.\"",
                            options: [
                                { value: "result", label: "Result: The homework is done" },
                                { value: "duration", label: "Duration: How long I worked on it" },
                            ],
                            expectedAnswer: "result",
                        },
                        {
                            type: "radio",
                            label: "\"I have been studying all afternoon.\"",
                            options: [
                                { value: "result", label: "Result: The studying is complete" },
                                { value: "duration", label: "Duration: The time spent studying" },
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
            title: "Core Idea Lens: What Two Times Are Connected?",
            icon: "🧠",
            explanation: `
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                    <p class="font-medium text-base text-slate-800 mb-2"><strong>Core idea:</strong> Perfect tenses connect <strong>two times</strong>. Here, the connection is <strong>past → now</strong>.</p>
                    <p class="text-sm text-slate-700 mb-0"><strong>Ask yourself:</strong> Do I want to emphasize the <strong>result now</strong>, or the <strong>activity/duration up to now</strong>?</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div class="bg-white border border-orange-200 rounded-xl p-5">
                        <h3 class="text-orange-700 font-bold text-lg mb-1">Result form (Present Perfect)</h3>
                        <p class="text-sm text-slate-600 mb-3">Use this when completion or count is most important.</p>
                        <ul class="text-sm text-slate-700 m-0 pl-5 space-y-2">
                            <li><strong>Concept:</strong> Completion. "I have finished."</li>
                            <li><strong>Quantity:</strong> "How many?" — "I've written 3 emails."</li>
                            <li><strong>Evidence:</strong> Present result — "The car is clean."</li>
                            <li><strong>Time:</strong> Life experience — <em>ever, never, before</em></li>
                            <li><strong>Markers:</strong> <em>just, already, yet</em></li>
                        </ul>
                    </div>

                    <div class="bg-white border border-indigo-200 rounded-xl p-5">
                        <h3 class="text-indigo-700 font-bold text-lg mb-1">Duration form (Present Perfect Continuous)</h3>
                        <p class="text-sm text-slate-600 mb-3">Use this when time in progress or activity is most important.</p>
                        <ul class="text-sm text-slate-700 m-0 pl-5 space-y-2">
                            <li><strong>Concept:</strong> Ongoing activity. "I have been working."</li>
                            <li><strong>Duration:</strong> "How long?" — "I've been writing all morning."</li>
                            <li><strong>Evidence:</strong> Side effect — "My hands are dirty."</li>
                            <li><strong>Time:</strong> Recent period — <em>lately, recently</em></li>
                            <li><strong>Markers:</strong> <em>all day, for hours, since morning</em></li>
                        </ul>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-lg px-4 py-3">
                    <p class="text-sm text-slate-700 m-0"><strong>Contrast:</strong> "I have worked a lot <em>this week</em>" (unfinished) vs "I worked a lot <em>last week</em>" (finished).</p>
                </div>
            `,
            tipBox: {
                title: "For & Since: Both Forms Use Them",
                content: "Result form: <em>\"I've lived here for 5 years\"</em> (focus on the state). Duration form: <em>\"I've been living here for 5 years\"</em> (focus on the ongoing activity). Same time span, different emphasis."
            },
            exercises: [
                {
                    id: "ex-core-idea-present-family",
                    title: "Core Idea Check",
                    instructions: "Choose the best focus for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Have you ever traveled alone?\"",
                            options: [
                                { value: "story", label: "Story order in the past" },
                                { value: "experience", label: "Life experience up to now (no specific time)" },
                                { value: "deadline", label: "Future deadline completion" },
                            ],
                            expectedAnswer: "experience",
                        },
                        {
                            type: "radio",
                            label: "\"I have worked a lot this week.\" Why Present Perfect?",
                            options: [
                                { value: "finished", label: "It is a finished past time like last week" },
                                { value: "future", label: "It is about a future point" },
                                { value: "unfinished", label: "This week is unfinished time, connected to now" },
                            ],
                            expectedAnswer: "unfinished",
                        },
                        {
                            type: "radio",
                            label: "\"You look tired.\" \"I've been working all day.\" What is emphasized?",
                            options: [
                                { value: "single", label: "One completed single action only" },
                                { value: "visible", label: "Visible result now plus duration activity" },
                                { value: "sequence", label: "Past-before-past story order" },
                            ],
                            expectedAnswer: "visible",
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
            icon: "⏱️",
            stepNumber: 1,
            explanation: `
                <h3>See the Difference</h3>
                <p>Both forms connect past to present, but they show different things. Think of it like taking a photo vs. recording a video:</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0;"><strong>Result = Photo:</strong> "Here's the finished result!" 📸</p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>Duration = Video:</strong> "Watch how long I've been doing this!" 🎥</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Result Timeline -->
                    <div style="background: white; border: 2px solid #f97316; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #c2410c;">Result Focus</h4>
                        <div style="position: relative; height: 60px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Action point -->
                            <div style="position: absolute; left: 25%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 16px; height: 16px; background: #f97316; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px #f97316;"></div>
                                <div style="position: absolute; top: 22px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #f97316; font-weight: 600;">Action</div>
                            </div>
                            <!-- Arrow to result -->
                            <div style="position: absolute; top: 50%; left: 30%; right: 25%; height: 0; border-top: 2px dashed #f97316; transform: translateY(-50%);"></div>
                            <!-- Result at NOW -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #fff7ed; border: 2px solid #f97316; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #c2410c;">NOW: ✓</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #4b5563;">"I <strong>have finished</strong>."</p>
                        <p style="text-align: center; margin: 0; font-size: 0.8rem; color: #9ca3af;">Focus: The result is here now.</p>
                    </div>

                    <!-- Duration Timeline -->
                    <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="text-align: center; margin: 0 0 1rem 0; color: #4338ca;">Duration Focus</h4>
                        <div style="position: relative; height: 60px; margin: 1rem 0;">
                            <!-- Timeline line -->
                            <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 3px; background: #e5e7eb; transform: translateY(-50%);"></div>
                            <!-- Duration bar -->
                            <div style="position: absolute; top: 50%; left: 20%; right: 15%; height: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.8)); border-radius: 10px; transform: translateY(-50%); border: 2px solid #6366f1;"></div>
                            <!-- Start dot -->
                            <div style="position: absolute; left: 20%; top: 50%; transform: translate(-50%, -50%);">
                                <div style="width: 10px; height: 10px; background: #6366f1; border-radius: 50%;"></div>
                                <div style="position: absolute; top: 22px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 0.7rem; color: #6366f1; font-weight: 600;">Start</div>
                            </div>
                            <!-- NOW dot -->
                            <div style="position: absolute; right: 10%; top: 50%; transform: translate(0, -50%);">
                                <div style="background: #eef2ff; border: 2px solid #6366f1; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: #4338ca;">NOW</div>
                            </div>
                        </div>
                        <p style="text-align: center; margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #4b5563;">"I <strong>have been working</strong>."</p>
                        <p style="text-align: center; margin: 0; font-size: 0.8rem; color: #9ca3af;">Focus: The duration up to now.</p>
                    </div>
                </div>

                <h3>Same Situation, Two Different Answers</h3>
                <p>Think about this: You've been cooking dinner. Your friend asks about it. You could answer two different ways:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f97316;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #c2410c;">Result Answer:</p>
                        <p style="margin: 0; font-size: 1.1rem;">"I <strong>have cooked</strong> pasta."</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ The pasta is ready! (Result)</p>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #4338ca;">Duration Answer:</p>
                        <p style="margin: 0; font-size: 1.1rem;">"I <strong>have been cooking</strong> for an hour."</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280;">→ That explains why you're tired! (Activity)</p>
                    </div>
                </div>

                <h3>More Examples Side by Side</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Situation</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; color: #c2410c;">Result</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #6366f1; color: #4338ca;">Duration</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Cleaning the house</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have cleaned</strong> the kitchen."<br><span style="font-size: 0.8rem; color: #6b7280;">→ The kitchen is clean now!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been cleaning</strong> all morning."<br><span style="font-size: 0.8rem; color: #6b7280;">→ That's why I'm exhausted!</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Writing emails</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have written</strong> 5 emails."<br><span style="font-size: 0.8rem; color: #6b7280;">→ 5 emails are done!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been writing</strong> emails for 2 hours."<br><span style="font-size: 0.8rem; color: #6b7280;">→ I've spent 2 hours on this!</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">Learning English</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have learned</strong> 500 new words."<br><span style="font-size: 0.8rem; color: #6b7280;">→ Look at my vocabulary!</span></td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">"I <strong>have been learning</strong> English for 2 years."<br><span style="font-size: 0.8rem; color: #6b7280;">→ It's been a long journey!</span></td>
                    </tr>
                </table>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Real-Life Tip:</p>
                    <p style="margin: 0.5rem 0 0 0;">Native speakers often use BOTH forms in the same conversation! For example: "I <strong>have been working</strong> on this project for 3 weeks, and I <strong>have completed</strong> 80% of it."</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-timeline-concept",
                    title: "Which Form Fits?",
                    instructions: "Match each sentence to the correct focus.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I have written 5 emails.\" - What's the focus?",
                            options: [
                                { value: "duration", label: "Duration: time spent emailing" },
                                { value: "result", label: "Result: 5 completed emails" },
                            ],
                            expectedAnswer: "result",
                        },
                        {
                            type: "radio",
                            label: "\"I have been writing emails all morning.\" - What's the focus?",
                            options: [
                                { value: "result", label: "Result: emails are done" },
                                { value: "duration", label: "Duration: the time spent" },
                            ],
                            expectedAnswer: "duration",
                        },
                        {
                            type: "radio",
                            label: "\"She has lost her keys.\" - What's the focus?",
                            options: [
                                { value: "result", label: "Result: keys are gone now" },
                                { value: "duration", label: "Duration: how long she's been looking" },
                            ],
                            expectedAnswer: "result",
                        },
                    ],
                },
                {
                    id: "ex-situation-match",
                    title: "Match the Situation",
                    instructions: "Which form would you use in each situation?",
                    items: [
                        {
                            type: "radio",
                            label: "Your hands are dirty. Someone asks why.",
                            options: [
                                { value: "simple", label: "I have gardened. (Shows result)" },
                                { value: "continuous", label: "I have been gardening. (Shows activity)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You want to show your friend the 10 photos you took.",
                            options: [
                                { value: "continuous", label: "I have been taking photos. (Shows activity)" },
                                { value: "simple", label: "I have taken 10 photos! (Shows count)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "You're sweating because you exercised.",
                            options: [
                                { value: "simple", label: "I have exercised. (Just states completion)" },
                                { value: "continuous", label: "I have been exercising. (Explains your condition)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You finished all your homework and want to tell your parent.",
                            options: [
                                { value: "simple", label: "I have finished my homework! (Result is ready)" },
                                { value: "continuous", label: "I have been finishing my homework. (Incorrect)" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. The Simple Side (Result - Positive)
        // -------------------------------------------------------------------------
        {
            id: "focus-result",
            title: "Focus on Result",
            icon: "✅",
            stepNumber: 2,
            explanation: `
                <h3>When "Done" Matters</h3>
                <p>Use <strong>The Present Perfect (Result)</strong> (have + <strong>past participle</strong>) when the most important thing is that the action is <strong>FINISHED</strong> or when you can <strong>COUNT</strong> how many times it happened.</p>

                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                     <h4 style="text-align: center; margin-top: 0; color: #d97706;">Timeline: The Completed Action</h4>
                     <div style="display: flex; align-items: center; justify-content: space-between; position: relative; margin: 2rem 0; padding: 0 1rem;">
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: #e5e7eb; transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Past point -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #f59e0b; margin: 0 auto;"></div>
                            <div style="margin-top: 0.5rem; font-size: 0.8rem; font-weight: 600; color: #d97706;">Action Done</div>
                        </div>

                         <!-- Arrow connecting -->
                        <div style="position: absolute; top: 50%; left: 20%; right: 20%; height: 0; border-top: 2px dashed #f59e0b; transform: translateY(-50%); z-index: 0;"></div>

                        <!-- Present Result -->
                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="background: #fffbeb; border: 2px solid #f59e0b; color: #b45309; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: bold; font-size: 0.9rem;">
                                NOW: Result
                            </div>
                        </div>
                     </div>
                     <p style="text-align: center; margin: 0;">"I <strong>have eaten</strong> lunch." → <span style="color: #64748b;">(Result: I am not hungry now.)</span></p>
                     <p style="text-align: center; margin-top: 0.5rem;">"She <strong>has written</strong> 5 emails." → <span style="color: #64748b;">(Result: 5 completed items.)</span></p>
                </div>

                <h3>Three Main Uses for the Result Form</h3>

                <div style="display: grid; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">1. Life Experience (ever/never)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Talking about experiences in your life up to now:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I <strong>have visited</strong> Japan twice." <span style="color: #6b7280;">(In my life)</span></li>
                            <li>"She <strong>has never eaten</strong> sushi." <span style="color: #6b7280;">(Not once in her life)</span></li>
                            <li>"<strong>Have</strong> you <strong>ever seen</strong> a whale?" <span style="color: #6b7280;">(At any time in your life?)</span></li>
                        </ul>
                    </div>

                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">2. Recent Completion (just/already/yet)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Something finished recently with a present result:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I <strong>have just finished</strong> my homework." <span style="color: #6b7280;">(I can play now!)</span></li>
                            <li>"She <strong>has already left</strong>." <span style="color: #6b7280;">(She's not here anymore.)</span></li>
                            <li>"<strong>Have</strong> you <strong>done</strong> your chores <strong>yet</strong>?" <span style="color: #6b7280;">(Is it complete?)</span></li>
                        </ul>
                    </div>

                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">3. Counting Results (numbers/how many)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">When you can count completed items:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I <strong>have written</strong> three reports today." <span style="color: #6b7280;">(Count: 3)</span></li>
                            <li>"He <strong>has called</strong> five times!" <span style="color: #6b7280;">(Count: 5)</span></li>
                            <li>"<strong>How many</strong> countries <strong>have</strong> you <strong>visited</strong>?" <span style="color: #6b7280;">(Asking for a number)</span></li>
                        </ul>
                    </div>
                </div>

                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border: 2px solid #10b981; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✓ Remember the Formula</h4>
                    <p style="margin: 0; font-size: 1.1rem; font-family: monospace; text-align: center;">
                        <strong>have/has</strong> + <strong>past participle</strong> (eaten, written, gone, done)
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; text-align: center;">
                        I/You/We/They <strong>have</strong> + verb³ | He/She/It <strong>has</strong> + verb³
                    </p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-simple-focus",
                    title: "Check: Is it a Result?",
                    instructions: "Choose the sentence that focuses on a COMPLETED result.",
                    items: [
                        {
                            type: "radio",
                            label: "Kitchen Situation",
                            options: [
                                { value: "continuous", label: "I have been cleaning the kitchen. (I'm tired/still working)" },
                                { value: "simple", label: "I have cleaned the kitchen. (It is clean now!)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Reading Books",
                            options: [
                                { value: "simple", label: "I have read 3 books this month. (Count: 3)" },
                                { value: "continuous", label: "I have been reading all month. (Activity)" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "The empty plate",
                            options: [
                                { value: "continuous", label: "I have been eating my sandwich." },
                                { value: "simple", label: "I have eaten my sandwich." },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // 3. The Continuous Side (Duration - Positive)
        // -------------------------------------------------------------------------
        {
            id: "focus-duration",
            title: "Focus on Duration",
            icon: "⏱️",
            stepNumber: 3,
            explanation: `
                <h3>When "Time" Matters</h3>
                <p>Use <strong>The Present Perfect (Duration)</strong> (have + <strong>been</strong> + <strong>-ing</strong>) when you want to show <strong>how long</strong> something has been happening...</p>

                <div style="background: white; border: 2px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #4338ca;">Timeline: The Ongoing Duration</h4>
                    <div style="position: relative; margin: 2rem auto; max-width: 500px; padding: 1rem 0;">
                        <!-- Duration bar -->
                        <div style="position: relative; height: 40px; background: linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.9)); border-radius: 25px; border: 2px solid #6366f1; display: flex; align-items: center; padding: 0 1.5rem;">
                            <!-- Start dot -->
                            <div style="position: absolute; left: 0; top: 50%; width: 12px; height: 12px; background: #6366f1; border-radius: 50%; transform: translate(-6px, -50%); border: 2px solid white;"></div>

                            <!-- Middle text -->
                            <span style="color: #312e81; font-weight: 600; font-size: 0.85rem; margin-left: 10px;">...working...working...</span>

                            <!-- NOW dot (pulsing) -->
                            <div style="position: absolute; right: 0; top: 50%; width: 16px; height: 16px; background: #f0b45a; border-radius: 50%; transform: translate(8px, -50%); border: 3px solid white; box-shadow: 0 0 0 4px rgba(240, 180, 90, 0.3);"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;">
                            <span>Started in Past</span>
                            <span>NOW</span>
                        </div>
                    </div>
                    <p style="text-align: center; margin: 0;">"I <strong>have been waiting</strong> for 20 minutes."</p>
                    <p style="text-align: center; margin-top: 0.5rem; font-size: 0.9em; color: #666;">(Focus is on the 20 minutes of waiting time)</p>
                </div>

                <h3>Three Main Uses for the Duration Form</h3>

                <div style="display: grid; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">1. Duration (for/since/how long)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Emphasizing how long an activity has been happening:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I <strong>have been studying</strong> English <strong>for 3 years</strong>." <span style="color: #6b7280;">(Duration emphasized)</span></li>
                            <li>"She <strong>has been working</strong> here <strong>since 2020</strong>." <span style="color: #6b7280;">(Starting point)</span></li>
                            <li>"<strong>How long have</strong> you <strong>been waiting</strong>?" <span style="color: #6b7280;">(Asking about duration)</span></li>
                        </ul>
                    </div>

                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">2. Visible Evidence (I can see the effects!)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">When you can see or feel the effects of recent activity:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"You're sweating! <strong>Have</strong> you <strong>been running</strong>?" <span style="color: #6b7280;">(I see evidence)</span></li>
                            <li>"Your eyes are red. <strong>Have</strong> you <strong>been crying</strong>?" <span style="color: #6b7280;">(I notice something)</span></li>
                            <li>"The ground is wet. It <strong>has been raining</strong>." <span style="color: #6b7280;">(Evidence of recent activity)</span></li>
                        </ul>
                    </div>

                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">3. Recent Activity (explains a situation)</h4>
                        <p style="margin: 0; font-size: 0.95rem;">Explaining why something is the way it is now:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I'm tired because I <strong>have been working</strong> all day." <span style="color: #6b7280;">(Explains tiredness)</span></li>
                            <li>"Sorry I'm late. I <strong>have been looking</strong> for parking." <span style="color: #6b7280;">(Explains delay)</span></li>
                            <li>"My hands are dirty. I <strong>have been gardening</strong>." <span style="color: #6b7280;">(Explains dirty hands)</span></li>
                        </ul>
                    </div>
                </div>

                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border: 2px solid #10b981; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✓ Remember the Formula</h4>
                    <p style="margin: 0; font-size: 1.1rem; font-family: monospace; text-align: center;">
                        <strong>have/has</strong> + <strong>been</strong> + <strong>verb-ing</strong>
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; text-align: center;">
                        I/You/We/They <strong>have been</strong> + -ing | He/She/It <strong>has been</strong> + -ing
                    </p>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Action May or May Not Be Finished!</p>
                    <p style="margin: 0.5rem 0 0 0;">With the duration form, the action might still be happening OR might have just stopped. The focus is on the activity itself, not whether it's complete.</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;"><em>"I have been reading this book..."</em> → Maybe still reading, maybe just stopped to rest.</p>
                </div>
            `,
            exercises: [
                 {
                    id: "ex-continuous-focus",
                    title: "Check: Is it Duration?",
                    instructions: "Choose the sentence that focuses on TIME or the ACTIVITY itself.",
                    items: [
                        {
                            type: "radio",
                            label: "Waiting for the bus",
                            options: [
                                { value: "simple", label: "I have waited. (Done)" },
                                { value: "continuous", label: "I have been waiting for an hour! (Stress on time)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Dirty Hands",
                            options: [
                                { value: "simple", label: "I have repaired the car." },
                                { value: "continuous", label: "I have been repairing the car. (That's why hands are dirty)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Out of breath",
                            options: [
                                { value: "continuous", label: "I have been running around all morning." },
                                { value: "simple", label: "I have run." },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ],
                },
            ]
        },

        // -------------------------------------------------------------------------
        // 4. NEGATIVES: The "Not" Logic
        // -------------------------------------------------------------------------
        {
            id: "family-negatives",
            title: "Negatives: 'Haven't' vs 'Haven't Been'",
            icon: "🚫",
            stepNumber: 4,
            explanation: `
                <h3>How to say "No"</h3>
                <p>The negative forms also have slightly different meanings. Understanding these will help you express exactly what you mean.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <!-- Result Negative -->
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">Result Negative</h4>
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">have NOT + Past Participle</div>
                        <p style="font-style: italic; color: #4b5563;">"I <strong>haven't finished</strong> yet."</p>
                        <ul style="font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 0;">
                            <li>It is incomplete.</li>
                            <li>The count is zero.</li>
                            <li>"I haven't seen that movie."</li>
                        </ul>
                    </div>

                    <!-- Duration Negative -->
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">Duration Negative</h4>
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">have NOT + BEEN + -ING</div>
                        <p style="font-style: italic; color: #4b5563;">"I <strong>haven't been sleeping</strong> well."</p>
                        <ul style="font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 0;">
                            <li>The activity has been absent lately.</li>
                            <li>"I haven't been practicing enough."</li>
                        </ul>
                    </div>
                </div>

                <h3>Understanding the Difference in Negatives</h3>
                <p>The negative forms carry different nuances. Look at these examples:</p>

                <div style="background: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Scenario: Your friend asks about your diet</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                            <div>
                                <p style="margin: 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>haven't eaten</strong> today."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ Zero meals. I'm hungry!</p>
                            </div>
                            <div>
                                <p style="margin: 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>haven't been eating</strong> well lately."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ My eating habits have been poor recently.</p>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Scenario: Talking about exercise</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                            <div>
                                <p style="margin: 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>haven't exercised</strong> this week."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ Zero exercise sessions this week.</p>
                            </div>
                            <div>
                                <p style="margin: 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>haven't been exercising</strong> lately."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ Exercise hasn't been part of my routine recently.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p style="margin: 0; font-weight: 600;">Scenario: Someone asks about your homework</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                            <div>
                                <p style="margin: 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>haven't done</strong> it yet."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ It's not complete (but I will do it).</p>
                            </div>
                            <div>
                                <p style="margin: 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>haven't been doing</strong> my homework."</p>
                                <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">→ I've been neglecting it as a regular habit.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Quick Guide:</p>
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem;">
                    <li><strong>Result negative</strong> = The action hasn't happened (zero times, incomplete)</li>
                    <li><strong>Duration negative</strong> = The activity hasn't been part of your life/routine lately</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "ex-negatives-mix",
                    title: "Negative Practice",
                    instructions: "Fill in the blank with the correct negative form.",
                    items: [
                        {
                            type: "text",
                            label: "I ___ (not / finish) my homework yet. Can I go out later?",
                            expectedAnswer: "haven't finished",
                            placeholder: "haven't finished"
                        },
                        {
                            type: "text",
                            label: "She looks tired. She ___ (not / sleep) well lately.",
                            expectedAnswer: "hasn't been sleeping",
                            placeholder: "hasn't been sleeping"
                        },
                        {
                            type: "text",
                            label: "We ___ (not / decide) where to go on vacation yet.",
                            expectedAnswer: "haven't decided",
                            placeholder: "haven't decided"
                        },
                        {
                            type: "text",
                            label: "You ___ (not / practice) the piano enough this week!",
                            expectedAnswer: "haven't been practicing",
                            placeholder: "haven't been practicing"
                        }
                    ]
                }
            ]
        },

        // -------------------------------------------------------------------------
        // 5. QUESTIONS: The Investigation
        // -------------------------------------------------------------------------
        {
            id: "family-questions",
            title: "Questions: 'How Much' vs 'How Long'",
            icon: "❓",
            stepNumber: 5,
            explanation: `
                <h3>Asking the Right Question</h3>
                <p>The question you ask depends on what answer you want. Choose the right form to get the information you need!</p>

                <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                        <th style="padding: 0.5rem; color: #4b5563;">If you want to know...</th>
                        <th style="padding: 0.5rem; color: #4b5563;">Use...</th>
                        <th style="padding: 0.5rem; color: #4b5563;">Question Word</th>
                    </tr>
                    <tr style="background-color: #fff7ed;">
                        <td style="padding: 0.75rem; font-weight: 500;">If it is DONE</td>
                        <td style="padding: 0.75rem;">Result</td>
                        <td style="padding: 0.75rem; color: #c2410c; font-weight: bold;">Have you finished...?</td>
                    </tr>
                    <tr style="background-color: #eef2ff;">
                        <td style="padding: 0.75rem; font-weight: 500;">The DURATION</td>
                        <td style="padding: 0.75rem;">Duration</td>
                        <td style="padding: 0.75rem; color: #4338ca; font-weight: bold;">How long...?</td>
                    </tr>
                    <tr style="background-color: #fff7ed;">
                        <td style="padding: 0.75rem; font-weight: 500;">The QUANTITY</td>
                        <td style="padding: 0.75rem;">Result</td>
                        <td style="padding: 0.75rem; color: #c2410c; font-weight: bold;">How many...?</td>
                    </tr>
                </table>

                <h3>Question Examples by Type</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #c2410c;">Result Questions (Done/Count)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li><strong>Have</strong> you <strong>finished</strong> your homework?</li>
                            <li><strong>Has</strong> she <strong>called</strong> you back yet?</li>
                            <li><strong>Have</strong> you ever <strong>been</strong> to Paris?</li>
                            <li><strong>How many</strong> books <strong>have</strong> you <strong>read</strong>?</li>
                            <li><strong>What</strong> <strong>have</strong> you <strong>done</strong> today?</li>
                        </ul>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #4338ca;">Duration Questions (Time/Activity)</h4>
                        <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li><strong>How long have</strong> you <strong>been waiting</strong>?</li>
                            <li><strong>What have</strong> you <strong>been doing</strong> all day?</li>
                            <li><strong>Have</strong> you <strong>been crying</strong>? (evidence)</li>
                            <li><strong>Have</strong> you <strong>been working</strong> hard?</li>
                            <li><strong>Where have</strong> you <strong>been living</strong>?</li>
                        </ul>
                    </div>
                </div>

                <h3>Same Topic, Different Questions</h3>
                <p>Notice how the form you choose changes what you're asking about:</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Topic: Reading</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result:</strong> "How many books <strong>have</strong> you <strong>read</strong>?" → Wants a number</p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration:</strong> "What <strong>have</strong> you <strong>been reading</strong>?" → Wants to know about the activity</p>
                    </div>

                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">Topic: Work</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result:</strong> "<strong>Have</strong> you <strong>finished</strong> the report?" → Is it done?</p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration:</strong> "How long <strong>have</strong> you <strong>been working</strong> on it?" → How much time?</p>
                    </div>

                    <div>
                        <p style="margin: 0; font-weight: 600;">Topic: Exercise (noticing sweat)</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result:</strong> "<strong>Have</strong> you <strong>exercised</strong> today?" → Did it happen?</p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration:</strong> "<strong>Have</strong> you <strong>been exercising</strong>?" → I see evidence of activity!</p>
                    </div>
                </div>

                <div style="background: #ecfdf5; padding: 1rem; border-radius: 0.5rem; border: 2px solid #10b981; margin-top: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #059669;">✓ Question Formation</h4>
                    <p style="margin: 0; font-size: 0.9rem;"><strong>Result:</strong> Have/Has + subject + past participle...?</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Duration:</strong> Have/Has + subject + been + verb-ing...?</p>
                </div>
            `,
             exercises: [
                {
                    id: "ex-questions-match",
                    title: "Match the Question to the Logic",
                    instructions: "Which question form is best?",
                    items: [
                        {
                            type: "radio",
                            label: "You see your friend sweating in gym clothes.",
                            options: [
                                { value: "simple", label: "Have you exercised? (Focus on result)" },
                                { value: "continuous", label: "Have you been exercising? (Focus on recent activity)" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "You want to know quantity.",
                            options: [
                                { value: "simple", label: "How many pages have you written?" },
                                { value: "continuous", label: "How many pages have you been writing?" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "You are waiting for someone.",
                            options: [
                                { value: "simple", label: "How long have you waited?" },
                                { value: "continuous", label: "How long have you been waiting?" },
                            ],
                            expectedAnswer: "continuous",
                        },
                    ]
                }
            ]
        },

        // -------------------------------------------------------------------------
        // 6. Side-by-Side Comparison
        // -------------------------------------------------------------------------
        {
            id: "family-comparison",
            title: "Comparison: Result vs Duration",
            stepNumber: 6,
            icon: "⚖️",
            explanation: `
                <h3>The Final Summary</h3>
                <p>The hardest part is choosing. Ask yourself: <strong>"Do I care about the result (count) or the time (activity)?"</strong></p>

                <h3>Side-by-Side: The Same Verb, Two Meanings</h3>
                <p>See how using the result form vs the duration form changes the meaning with the same verb:</p>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">PAINT 🎨</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>have painted</strong> two rooms." → <em>Two rooms are done!</em></p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>have been painting</strong> all day." → <em>That's why I'm tired/messy!</em></p>
                    </div>

                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">WRITE ✍️</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result form:</strong> "She <strong>has written</strong> 5 chapters." → <em>5 chapters are complete!</em></p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration form:</strong> "She <strong>has been writing</strong> since morning." → <em>Many hours of work!</em></p>
                    </div>

                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-weight: 600;">COOK 🍳</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>have cooked</strong> dinner." → <em>Dinner is ready!</em></p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>have been cooking</strong> for 2 hours." → <em>That's a lot of effort!</em></p>
                    </div>

                    <div>
                        <p style="margin: 0; font-weight: 600;">LEARN 📚</p>
                        <p style="margin: 0.25rem 0 0 0; color: #c2410c;"><strong>Result form:</strong> "I <strong>have learned</strong> 50 new words." → <em>My vocabulary grew by 50!</em></p>
                        <p style="margin: 0.25rem 0 0 0; color: #4338ca;"><strong>Duration form:</strong> "I <strong>have been learning</strong> Spanish for a year." → <em>One year of study!</em></p>
                    </div>
                </div>
            `,
            comparison: {
                title: "Result form vs duration form (Present Perfect)",
                leftLabel: "Result form (Result)",
                rightLabel: "Duration form (Activity)",
                rows: [
                    {
                        label: "Core Meaning",
                        left: "Completion (It is finished)",
                        right: "Process (It might not be finished)",
                    },
                    {
                        label: "Key Question",
                        left: "<strong>How many?</strong> (Quantity)",
                        right: "<strong>How long?</strong> (Duration)",
                    },
                    {
                        label: "Evidence",
                        left: "The finished product is ready.",
                        right: "Side effects (sweat, dirt, tiredness).",
                    },
                    {
                        label: "Example",
                        left: "I have written <strong>10 emails</strong>.",
                        right: "I have been writing emails <strong>for 2 hours</strong>.",
                    }
                ],
            },
            tipBox: {
                title: "💡 State Verbs Exception",
                content: "Remember: Verbs like 'know', 'like', 'believe', 'have (possession)' usually stay SIMPLE, even for duration! <br><br>Correct: 'I have known him for 10 years.'<br>Incorrect: 'I have been knowing him...'"
            },
        },

        // -------------------------------------------------------------------------
        // 7. Structure Practice
        // -------------------------------------------------------------------------
        {
            id: "structure-review",
            title: "Structure Check: Building Sentences",
            icon: "🏗️",
            explanation: `
                <h3>Master the Structures</h3>
                <p>Let's make sure you can build these sentences perfectly. Both forms have the same basic pattern but with different endings.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0; color: #c2410c; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">Result form</h4>
                        <div style="margin-bottom: 0.5rem;"><strong>+</strong> have + <span style="color: #c2410c;">past participle</span></div>
                        <div style="margin-bottom: 0.5rem;"><strong>-</strong> haven't + <span style="color: #c2410c;">past participle</span></div>
                        <div><strong>?</strong> Have you + <span style="color: #c2410c;">past participle</span>?</div>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0; color: #4338ca; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">Duration form</h4>
                        <div style="margin-bottom: 0.5rem;"><strong>+</strong> have <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span></div>
                        <div style="margin-bottom: 0.5rem;"><strong>-</strong> haven't <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span></div>
                        <div><strong>?</strong> Have you <span style="color: #6366f1;">been</span> + <span style="color: #6366f1;">-ing</span>?</div>
                    </div>
                </div>

                <h3>Full Example Sentences</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 0.5rem; text-align: left; width: 25%;">Form</th>
                            <th style="padding: 0.5rem; text-align: left; color: #c2410c;">Result form</th>
                            <th style="padding: 0.5rem; text-align: left; color: #4338ca;">Duration form</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 0.5rem; font-weight: 600;">Positive (+)</td>
                            <td style="padding: 0.5rem;">I <strong>have eaten</strong> lunch.</td>
                            <td style="padding: 0.5rem;">I <strong>have been eating</strong> lunch.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 0.5rem; font-weight: 600;">Negative (-)</td>
                            <td style="padding: 0.5rem;">She <strong>hasn't finished</strong> yet.</td>
                            <td style="padding: 0.5rem;">She <strong>hasn't been working</strong> hard.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 0.5rem; font-weight: 600;">Question (?)</td>
                            <td style="padding: 0.5rem;"><strong>Have</strong> you <strong>seen</strong> it?</td>
                            <td style="padding: 0.5rem;"><strong>Have</strong> you <strong>been waiting</strong> long?</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; font-weight: 600;">He/She/It</td>
                            <td style="padding: 0.5rem;">He <strong>has gone</strong> home.</td>
                            <td style="padding: 0.5rem;">He <strong>has been studying</strong>.</td>
                        </tr>
                    </table>
                </div>

                <h3>Subject-Verb Agreement</h3>
                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-weight: 600;">Remember: HAS is for He/She/It</p>
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                        <li>I/You/We/They <strong>have</strong> finished | <strong>have been</strong> working</li>
                        <li>He/She/It <strong>has</strong> finished | <strong>has been</strong> working</li>
                    </ul>
                </div>
            `,
            exercises: [
                 {
                    id: "ex-structure-mix",
                    title: "Build the Sentences",
                    instructions: "Fill in the missing parts based on the clues.",
                    items: [
                        {
                            type: "text",
                            label: "Result form: She ___ (write) three letters.",
                            expectedAnswer: "has written",
                            placeholder: "has written"
                        },
                        {
                            type: "text",
                            label: "Duration form: They ___ (play) soccer for 2 hours.",
                            expectedAnswer: "have been playing",
                            placeholder: "have been playing"
                        },
                        {
                            type: "text",
                            label: "Question: How long ___ you ___ (wait)?",
                            expectedAnswer: "have you been waiting",
                            placeholder: "have you been waiting"
                        },
                         {
                            type: "text",
                            label: "Negative: I ___ (not / see) him today.",
                            expectedAnswer: "haven't seen",
                            placeholder: "haven't seen"
                        },
                    ],
                },
            ]
        },

        // -------------------------------------------------------------------------
        // 8. Time Expressions
        // -------------------------------------------------------------------------
        {
            id: "time-expressions",
            title: "Time Expressions: For, Since & Signal Words",
            icon: "📅",
            stepNumber: 7,
            explanation: `
                <h3>Key Time Words for Both Forms</h3>
                <p>Both the result form and the duration form use <strong>for</strong> and <strong>since</strong>, but some words work better with one form. Learning these will help you sound more natural!</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #b45309;">FOR = Duration</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">How long? A period of time.</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>for 10 minutes</li>
                            <li>for 2 hours</li>
                            <li>for 3 weeks</li>
                            <li>for 5 years</li>
                        </ul>
                    </div>
                    <div style="background: #dbeafe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                        <h4 style="margin: 0 0 0.75rem 0; color: #1d4ed8;">SINCE = Starting Point</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #4b5563;">From when? A specific time.</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>since Monday</li>
                            <li>since 2019</li>
                            <li>since I moved here</li>
                            <li>since breakfast</li>
                        </ul>
                    </div>
                </div>

                <h3>FOR vs SINCE: Easy Way to Remember</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0;"><strong>FOR</strong> answers "How long?" → <em>for 3 hours, for 2 weeks, for a year</em></p>
                    <p style="margin: 0.5rem 0 0 0;"><strong>SINCE</strong> answers "From when?" → <em>since Monday, since 2020, since I was a child</em></p>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Example:</strong> "I have lived here <strong>for</strong> 5 years." = "I have lived here <strong>since</strong> 2020."</p>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">Both sentences mean the same thing, just expressed differently!</p>
                    </div>
                </div>

                <h4>Signal Words by Form</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <tr style="background: #fff7ed;">
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; color: #c2410c;">Result form (Result/Count)</th>
                        <th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #6366f1; color: #4338ca;">Duration form (Duration/Activity)</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; vertical-align: top;">
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">already</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">yet</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">just</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">ever</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">never</span>
                            <span style="background: #fff7ed; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">how many times</span>
                        </td>
                        <td style="padding: 0.5rem; vertical-align: top;">
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">all day/morning/week</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">lately</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">recently</span>
                            <span style="background: #eef2ff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0.25rem; display: inline-block;">how long</span>
                        </td>
                    </tr>
                </table>

                <h3>Signal Words in Action</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600; color: #c2410c;">Result form signal words:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I have <strong>already</strong> eaten."</li>
                            <li>"Have you finished <strong>yet</strong>?"</li>
                            <li>"She has <strong>just</strong> arrived."</li>
                            <li>"Have you <strong>ever</strong> been to Japan?"</li>
                            <li>"I have <strong>never</strong> seen snow."</li>
                        </ul>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; font-weight: 600; color: #4338ca;">Duration form signal words:</p>
                        <ul style="margin: 0.5rem 0 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                            <li>"I've been working <strong>all day</strong>."</li>
                            <li>"She's been feeling tired <strong>lately</strong>."</li>
                            <li>"What have you been doing <strong>recently</strong>?"</li>
                            <li>"<strong>How long</strong> have you been waiting?"</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Word Position Tip:</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;"><strong>Already/just/never/ever</strong> go BETWEEN have and the verb: "I have <strong>already</strong> finished."</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;"><strong>Yet</strong> goes at the END: "Have you finished <strong>yet</strong>?"</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-time-expressions",
                    title: "For or Since?",
                    instructions: "Choose the correct time expression.",
                    items: [
                        {
                            type: "select",
                            label: "I have been working here ___ 2018.",
                            options: ["for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "She has lived in Boston ___ five years.",
                            options: ["for", "since"],
                            expectedAnswer: "for",
                        },
                        {
                            type: "select",
                            label: "We have been waiting ___ the meeting started.",
                            options: ["for", "since"],
                            expectedAnswer: "since",
                        },
                        {
                            type: "select",
                            label: "They have been studying English ___ three months.",
                            options: ["for", "since"],
                            expectedAnswer: "for",
                        },
                    ],
                },
                {
                    id: "ex-signal-words",
                    title: "Which Form Fits?",
                    instructions: "Based on the signal word, choose result form or duration form.",
                    items: [
                        {
                            type: "radio",
                            label: "I have ___ finished my homework. (already)",
                            options: [
                                { value: "simple", label: "Result form: have already finished" },
                                { value: "continuous", label: "Duration form: have been already finishing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "She has been tired ___. (lately)",
                            options: [
                                { value: "simple", label: "Result form: has felt tired lately" },
                                { value: "continuous", label: "Duration form: has been feeling tired lately" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "Have you ___ been to Japan? (ever)",
                            options: [
                                { value: "simple", label: "Result form: Have you ever been" },
                                { value: "continuous", label: "Duration form: Have you ever been being" },
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
            title: "Common Mistakes & When NOT to Use",
            icon: "⚠️",
            stepNumber: 8,
            explanation: `
                <h3>Avoid These Errors!</h3>
                <p>Here are the most common mistakes students make with the Present Perfect Family. Understanding these will help you avoid them!</p>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 1: Using the duration form with state verbs</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I have been knowing him for years.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I have known him for years.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">State verbs (know, believe, like, love, want, need, have, own) don't use the duration form.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 2: Using the duration form for counted actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I have been reading 3 books this month.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I have read 3 books this month.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">When counting completed items, use the result form.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 3: Using the duration form with \"Finish\"</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I haven't been finishing my work yet.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I haven't finished my work yet.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">"Finish" describes completion - always use the result form.</p>
                </div>

                <div style="background: #fffafa; border: 1px solid #ef4444; border-left: 5px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #991b1b;">❌ Mistake 4: Using Present Perfect with Specific Past Time</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Wrong: <span style="font-weight: 400;">I have seen him yesterday.</span></p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0; color: #15803d; font-weight: 600;">Correct: <span style="font-weight: 400;">I saw him yesterday.</span></p>
                        </div>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #374151;">With specific past times (yesterday, last week, in 2020), use Past Simple, not Present Perfect.</p>
                </div>

                <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #e5e7eb;">
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #b91c1c; font-weight: 600;">❌ <span style="font-weight: 400;">"I have been wanting a new phone for months."</span></p>
                        <p style="margin: 0; color: #15803d; font-weight: 600;">✓ <span style="font-weight: 400;">"I have wanted a new phone for months."</span> <span style="font-size: 0.85rem; color: #4b5563;">(want = state verb)</span></p>
                    </div>
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #b91c1c; font-weight: 600;">❌ <span style="font-weight: 400;">"She has been visiting Paris twice."</span></p>
                        <p style="margin: 0; color: #15803d; font-weight: 600;">✓ <span style="font-weight: 400;">"She has visited Paris twice."</span> <span style="font-size: 0.85rem; color: #4b5563;">(twice = counting)</span></p>
                    </div>
                    <div style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #b91c1c; font-weight: 600;">❌ <span style="font-weight: 400;">"I have been losing my keys."</span></p>
                        <p style="margin: 0; color: #15803d; font-weight: 600;">✓ <span style="font-weight: 400;">"I have lost my keys."</span> <span style="font-size: 0.85rem; color: #4b5563;">(lose = single event with result)</span></p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #b91c1c; font-weight: 600;">❌ <span style="font-weight: 400;">"We have met at the party last Saturday."</span></p>
                        <p style="margin: 0; color: #15803d; font-weight: 600;">✓ <span style="font-weight: 400;">"We met at the party last Saturday."</span> <span style="font-size: 0.85rem; color: #4b5563;">(specific past time)</span></p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 1px solid #10b981; border-left: 5px solid #10b981; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #065f46;">✓ Quick Decision Guide</h4>
                    <ul style="margin: 0; padding-left: 1.2rem; color: #1f2937;">
                        <li><strong>Can you count it?</strong> → result form (3 emails, twice, never)</li>
                        <li><strong>Is it a state verb?</strong> → result form (know, believe, own)</li>
                        <li><strong>Is it about completion?</strong> → result form (finish, decide, arrive)</li>
                        <li><strong>Is it about duration/how long?</strong> → duration form (all day, for hours)</li>
                        <li><strong>Do you see evidence of activity?</strong> → duration form (sweating, dirty hands)</li>
                        <li><strong>Is there a specific past time?</strong> → Use Past Simple instead!</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 State Verbs List",
                content: "Common state verbs that DON'T use the duration form: <br><strong>Mental:</strong> know, believe, think, understand, remember <br><strong>Emotional:</strong> like, love, hate, want, need, prefer <br><strong>Possession:</strong> have, own, belong, possess"
            },
            exercises: [
                {
                    id: "ex-common-mistakes",
                    title: "Fix the Mistakes",
                    instructions: "Choose the CORRECT version of each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Duration with a state verb:",
                            options: [
                                { value: "wrong", label: "I have been owning this car for 5 years." },
                                { value: "correct", label: "I have owned this car for 5 years." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Counting completed items:",
                            options: [
                                { value: "correct", label: "She has visited Paris 4 times." },
                                { value: "wrong", label: "She has been visiting Paris 4 times." },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Talking about completion:",
                            options: [
                                { value: "wrong", label: "Have you been finishing your project yet?" },
                                { value: "correct", label: "Have you finished your project yet?" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Emphasizing duration:",
                            options: [
                                { value: "correct", label: "I have been waiting for 2 hours!" },
                                { value: "wrong", label: "I have waited for 2 hours!" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Evidence of recent activity (dirty hands):",
                            options: [
                                { value: "wrong", label: "Have you worked in the garden?" },
                                { value: "correct", label: "Have you been working in the garden?" },
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
            id: "family-mixed",
            title: "Mixed Practice: Real Life Scenarios",
            icon: "🧠",
            stepNumber: 9,
            explanation: `
                <h3>Put It All Together!</h3>
                <p>In real conversation, we switch back and forth between the result form and the duration form. Use your decision-making skills:</p>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li><strong>Result/Count/Completion?</strong> → result form</li>
                    <li><strong>Duration/Activity/Evidence?</strong> → duration form</li>
                    <li><strong>State verb?</strong> → result form (even for duration)</li>
                </ul>

                <h3>Real Conversation Examples</h3>
                <p>See how native speakers naturally mix both forms in conversation:</p>

                <div style="background: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #6366f1;">
                    <p style="margin: 0; font-weight: 600;">At the Office:</p>
                    <p style="margin: 0.5rem 0 0 0; font-style: italic;">
                        "I <strong style="color: #4338ca;">have been working</strong> on this report all morning <span style="color: #6b7280;">(duration)</span>,
                        and I <strong style="color: #c2410c;">have written</strong> 10 pages so far <span style="color: #6b7280;">(count)</span>.
                        I <strong style="color: #c2410c;">haven't finished</strong> yet <span style="color: #6b7280;">(completion)</span>,
                        but I <strong style="color: #4338ca;">have been making</strong> good progress <span style="color: #6b7280;">(ongoing activity)</span>."
                    </p>
                </div>

                <div style="background: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #f97316;">
                    <p style="margin: 0; font-weight: 600;">Meeting a Friend:</p>
                    <p style="margin: 0.5rem 0 0 0; font-style: italic;">
                        "Hey! I <strong style="color: #4338ca;">have been trying</strong> to call you all day <span style="color: #6b7280;">(duration)</span>!
                        Where <strong style="color: #4338ca;">have you been</strong> <span style="color: #6b7280;">(recent activity)</span>?
                        I <strong style="color: #c2410c;">have bought</strong> tickets for the concert <span style="color: #6b7280;">(result)</span>!"
                    </p>
                </div>

                <div style="background: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #22c55e;">
                    <p style="margin: 0; font-weight: 600;">At Home:</p>
                    <p style="margin: 0.5rem 0 0 0; font-style: italic;">
                        "You look exhausted! What <strong style="color: #4338ca;">have you been doing</strong> <span style="color: #6b7280;">(activity)</span>?"
                        <br>"I <strong style="color: #4338ca;">have been cleaning</strong> the house <span style="color: #6b7280;">(duration/evidence)</span>.
                        I <strong style="color: #c2410c;">have done</strong> the kitchen and bathroom <span style="color: #6b7280;">(completed items)</span>,
                        but I <strong style="color: #c2410c;">haven't started</strong> the bedrooms yet <span style="color: #6b7280;">(not complete)</span>."
                    </p>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
                    <p style="margin: 0; font-weight: 600;">💡 Notice the Pattern:</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">When telling a story, we often use <strong style="color: #4338ca;">the duration form</strong> to set the scene (what's been happening) and <strong style="color: #c2410c;">the result form</strong> to report specific results or facts.</p>
                </div>
            `,
            exercises: [
                {
                    id: "ex-mixed-scenarios",
                    title: "Real Life Scenarios",
                    instructions: "Choose the best form for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "You have paint on your shirt! ___ you ___ the bedroom?",
                            options: [
                                { value: "continuous", label: "Have / been painting" },
                                { value: "simple", label: "Have / painted" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "The bedroom looks great. I ___ it.",
                            options: [
                                { value: "continuous", label: "have been painting" },
                                { value: "simple", label: "have painted" },
                            ],
                            expectedAnswer: "simple",
                        },
                         {
                            type: "radio",
                            label: "I ___ this movie three times.",
                            options: [
                                { value: "simple", label: "have seen" },
                                { value: "continuous", label: "have been seeing" },
                            ],
                            expectedAnswer: "simple",
                        },
                        {
                            type: "radio",
                            label: "Sorry I'm late! ___ you ___ long?",
                            options: [
                                { value: "simple", label: "Have / waited" },
                                { value: "continuous", label: "Have / been waiting" },
                            ],
                            expectedAnswer: "continuous",
                        },
                        {
                            type: "radio",
                            label: "I ___ to Paris twice in my life.",
                            options: [
                                { value: "simple", label: "have been" },
                                { value: "continuous", label: "have been being" },
                            ],
                            expectedAnswer: "simple",
                        },
                    ],
                },
                {
                    id: "ex-mixed-fill",
                    title: "Complete the Conversations",
                    instructions: "Fill in the correct form based on context.",
                    items: [
                        {
                            type: "text",
                            label: "A: You look tired! B: I ___ (study) all night for my exam.",
                            expectedAnswer: "have been studying",
                            placeholder: "have been studying",
                        },
                        {
                            type: "text",
                            label: "A: How many apartments ___ you ___ (visit)? B: About 5 so far.",
                            expectedAnswer: "have you visited",
                            placeholder: "have you visited",
                        },
                        {
                            type: "text",
                            label: "A: I ___ (know) Maria since high school. (state verb)",
                            expectedAnswer: "have known",
                            placeholder: "have known",
                        },
                        {
                            type: "text",
                            label: "A: Why are your hands so dirty? B: I ___ (work) in the garden.",
                            expectedAnswer: "have been working",
                            placeholder: "have been working",
                        },
                    ],
                },
            ],
        },

        // -------------------------------------------------------------------------
        // Summary Section
        // -------------------------------------------------------------------------
        {
            id: "family-summary",
            title: "Summary: The Present Perfect Family",
            icon: "📋",
            stepNumber: 10,
            explanation: `
                <h3>What You've Learned</h3>
                <p>Congratulations! You now understand both members of the Present Perfect Family. Here's everything in one place:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #f97316;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #c2410c;">The Finisher (result form)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> have/has + past participle</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Result, completion, count</p>
                        <p style="margin: 0;"><strong>Key words:</strong> already, yet, just, ever, never, how many</p>
                    </div>
                    <div style="background: #eef2ff; padding: 1rem; border-radius: 0.5rem; border-top: 4px solid #6366f1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #4338ca;">The Worker (duration form)</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Formula:</strong> have/has been + verb-ing</p>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Focus:</strong> Duration, activity, evidence</p>
                        <p style="margin: 0;"><strong>Key words:</strong> for, since, all day, lately, how long</p>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #16a34a;">🎯 The Golden Question</h4>
                    <p style="margin: 0; font-size: 1.1rem;">Ask yourself: <strong>"Do I care about the RESULT (count/completion) or the DURATION (time/activity)?"</strong></p>
                </div>

                <h3>Quick Reference Chart</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #e2e8f0;">Use...</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #f97316; color: #c2410c;">Result form</th>
                        <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #6366f1; color: #4338ca;">Duration form</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Life experience</td>
                        <td style="padding: 0.5rem;">✓ Have you ever...?</td>
                        <td style="padding: 0.5rem;">-</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Counting items</td>
                        <td style="padding: 0.5rem;">✓ I've read 3 books</td>
                        <td style="padding: 0.5rem;">-</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Just completed</td>
                        <td style="padding: 0.5rem;">✓ I've just finished</td>
                        <td style="padding: 0.5rem;">-</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Duration (how long)</td>
                        <td style="padding: 0.5rem;">-</td>
                        <td style="padding: 0.5rem;">✓ I've been waiting for 2 hours</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Visible evidence</td>
                        <td style="padding: 0.5rem;">-</td>
                        <td style="padding: 0.5rem;">✓ You've been crying</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 0.5rem;">Recent activity</td>
                        <td style="padding: 0.5rem;">-</td>
                        <td style="padding: 0.5rem;">✓ What have you been doing?</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem;">State verbs</td>
                        <td style="padding: 0.5rem;">✓ I've known him for years</td>
                        <td style="padding: 0.5rem;">✗ Never use!</td>
                    </tr>
                </table>

                <h4>Remember:</h4>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>State verbs (know, believe, own) → Always result form, even for duration</li>
                    <li>Counting completed items → result form</li>
                    <li>Emphasizing how long/visible evidence → duration form</li>
                    <li>Both use <strong>for</strong> (duration) and <strong>since</strong> (starting point)</li>
                    <li>Don't use Present Perfect with specific past times (yesterday, last week, in 2020)</li>
                </ul>

                <h3>One Final Example</h3>
                <div style="background: linear-gradient(135deg, #fff7ed 0%, #eef2ff 100%); padding: 1.25rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="margin: 0; font-style: italic; font-size: 1.05rem; line-height: 1.7;">
                        "I <strong style="color: #4338ca;">have been learning</strong> English for 2 years <span style="color: #6b7280;">(duration)</span>.
                        I <strong style="color: #c2410c;">have taken</strong> 4 courses <span style="color: #6b7280;">(count)</span>,
                        and I <strong style="color: #c2410c;">have improved</strong> a lot <span style="color: #6b7280;">(result)</span>.
                        I <strong style="color: #c2410c;">have always wanted</strong> to speak fluently <span style="color: #6b7280;">(state verb)</span>,
                        and I <strong style="color: #4338ca;">have been practicing</strong> every day <span style="color: #6b7280;">(ongoing activity)</span>!"
                    </p>
                </div>
            `,
            tipBox: {
                title: "🚀 Keep Practicing!",
                content: "The more you practice choosing between the result form and the duration form, the more natural it becomes. Pay attention to how native speakers use these forms in movies, podcasts, and conversations!"
            },
        },
    ],
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Choose the sentence that focuses on a completed result.",
            options: [
                { value: "a", label: "I have been cleaning the kitchen all morning." },
                { value: "c", label: "I cleaned the kitchen yesterday." },
                { value: "b", label: "I have cleaned the kitchen." },
            ],
            correctAnswer: "b",
            explanation: "The result form (Present Perfect) focuses on a completed action with a result now.",
            skillTag: "result-completed-action",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which sentence correctly uses Present Perfect Continuous?",
            options: [
                { value: "b", label: "She has been working here since 2020." },
                { value: "a", label: "She has worked here since 2020." },
                { value: "c", label: "She worked here since 2020." },
            ],
            correctAnswer: "b",
            explanation: "The duration form (Present Perfect Continuous) emphasizes duration from the past to now.",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Fill in the blank: \"I ___ three emails this morning.\"",
            options: [
                { value: "a", label: "have been writing" },
                { value: "b", label: "have written" },
                { value: "c", label: "wrote" },
            ],
            correctAnswer: "b",
            explanation: "When you can count completed actions, use the result form.",
            skillTag: "result-count-how-many",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which sentence talks about life experience?",
            options: [
                { value: "a", label: "I have been traveling for two weeks." },
                { value: "c", label: "I traveled to Mexico last year." },
                { value: "b", label: "I have traveled to Mexico twice." },
            ],
            correctAnswer: "b",
            explanation: "Life experience uses the result form with ever/never or counts.",
            skillTag: "result-life-experience-ever-never",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Choose the correct sentence.",
            options: [
                { value: "b", label: "I have known her for years." },
                { value: "a", label: "I have been knowing her for years." },
                { value: "c", label: "I knew her for years." },
            ],
            correctAnswer: "b",
            explanation: "State verbs like 'know' do not use continuous forms.",
            skillTag: "error-stative-verb-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which sentence explains visible evidence?",
            options: [
                { value: "a", label: "I have cooked dinner." },
                { value: "b", label: "I have been cooking all afternoon." },
                { value: "c", label: "I cooked dinner at 6." },
            ],
            correctAnswer: "b",
            explanation: "The duration form explains current evidence or effects.",
            skillTag: "duration-recent-activity-evidence",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Fill in the blank: \"She ___ just finished her homework.\"",
            options: [
                { value: "a", label: "has been" },
                { value: "c", label: "is" },
                { value: "b", label: "has" },
            ],
            correctAnswer: "b",
            explanation: "Words like 'just' go with the result form.",
            skillTag: "result-recent-completion-just-already-yet",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Which sentence is incorrect?",
            options: [
                { value: "c", label: "I have been reading three books this month." },
                { value: "a", label: "I have been reading for two hours." },
                { value: "b", label: "I have read three books this month." },
            ],
            correctAnswer: "c",
            explanation: "Counting completed items requires the result form, not the duration form.",
            skillTag: "error-count-with-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Choose the sentence that emphasizes time, not result.",
            options: [
                { value: "a", label: "I have written the report." },
                { value: "b", label: "I have been writing the report all day." },
                { value: "c", label: "I wrote the report yesterday." },
            ],
            correctAnswer: "b",
            explanation: "The duration form focuses on duration or activity, not completion.",
            skillTag: "contrast-result-vs-duration",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Which sentence is NOT correct?",
            options: [
                { value: "b", label: "I saw her yesterday." },
                { value: "c", label: "I have seen her before." },
                { value: "a", label: "I have seen her yesterday." },
            ],
            correctAnswer: "a",
            explanation: "Specific past time expressions require Past Simple, not Present Perfect.",
            skillTag: "error-specific-past-time",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which question asks about duration?",
            options: [
                { value: "c", label: "How long have you been working?" },
                { value: "a", label: "How many emails have you written?" },
                { value: "b", label: "Have you finished your work?" },
            ],
            correctAnswer: "c",
            explanation: "How long signals duration and the duration form.",
            skillTag: "duration-for-since-how-long",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "Choose the better answer: \"Why are you tired?\"",
            options: [
                { value: "a", label: "I have finished my homework." },
                { value: "b", label: "I have been doing homework all night." },
                { value: "c", label: "I did homework." },
            ],
            correctAnswer: "b",
            explanation: "The duration form explains a current condition.",
            skillTag: "duration-ongoing-temporary",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Which sentence focuses on quantity?",
            options: [
                { value: "a", label: "She has been calling all morning." },
                { value: "c", label: "She called this morning." },
                { value: "b", label: "She has called five times." },
            ],
            correctAnswer: "b",
            explanation: "Counting actions uses the result form.",
            skillTag: "result-count-how-many",
            difficulty: "easy",
        },
        {
            id: "quiz-14",
            question: "Choose the sentence that sounds natural.",
            options: [
                { value: "b", label: "I have owned this car for years." },
                { value: "a", label: "I have been owning this car for years." },
                { value: "c", label: "I owned this car for years." },
            ],
            correctAnswer: "b",
            explanation: "State verbs like 'own' stay in the simple form.",
            skillTag: "result-state-verb-duration",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which sentence best explains the difference in meaning?",
            options: [
                { value: "b", label: "I wrote emails. / I have written emails." },
                { value: "a", label: "I have written emails. / I have been writing emails." },
                { value: "c", label: "I am writing emails. / I have written emails." },
            ],
            correctAnswer: "a",
            explanation: "Result form focuses on result; duration form focuses on activity or duration.",
            skillTag: "contrast-simple-vs-continuous-meaning",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Present Perfect Family Mini Quiz

    Result-focused issues:
    - result-completed-action
    - result-count-how-many
    - result-life-experience-ever-never
    - result-recent-completion-just-already-yet
    - result-state-verb-duration

    → If weak: review completion vs counting, and remind students that state verbs stay simple.

    Duration-focused issues:
    - duration-for-since-how-long
    - duration-recent-activity-evidence
    - duration-ongoing-temporary

    → If weak: revisit for/since, visible evidence, and explaining current conditions.

    Contrast issues:
    - contrast-result-vs-duration
    - contrast-simple-vs-continuous-meaning

    → If weak: re-teach the guiding question: “Do I care about the result or the time?”

    Common error patterns:
    - error-stative-verb-continuous
    - error-count-with-continuous
    - error-specific-past-time

    → If weak: do quick reset drills with stative verbs, counting phrases, and past time markers.
    */
};
