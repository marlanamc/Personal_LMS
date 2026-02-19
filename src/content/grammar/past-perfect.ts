import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Past Perfect: When Time Goes Backward",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #f59e0b; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Past Perfect is your <strong style="color: #f59e0b;">time machine for TWO past actions</strong>: it shows which one happened FIRST when you're telling a story about the past.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Imagine you're explaining why you missed the bus. You can't just say "The bus left"—you need to explain the sequence: <span style="color: #f59e0b; font-weight: 600;">"The bus had already left"</span> (FIRST) when <span style="color: #14b8a6; font-weight: 600;">"I arrived"</span> (SECOND).</p>

                <h3>The Golden Rule</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">✓ <strong>Almost ALWAYS uses TWO verbs</strong></li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f0fdfa; border-left: 4px solid #14b8a6; border-radius: 0.25rem;">✓ <strong>Shows which action happened FIRST</strong></li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">✓ <strong>Formula: had + past participle</strong></li>
                </ul>

	                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
	                    <p style="margin: 0; font-weight: 600;">📝 Quick Preview:<br/><span style="color: #f59e0b;">had + past participle</span> (FIRST action) → <span style="color: #14b8a6;">past simple</span> (SECOND action)</p>
	                </div>
	            `,
            exercises: [
                {
                    id: "past-perfect-intro-1",
                    title: "Quick Check: Which Happened First?",
                    instructions: "Choose the sentence that correctly shows the FIRST action.",
                    items: [
                        {
                            type: "radio",
                            label: "I arrived at the bus stop. The bus was already gone.",
                            options: [
                                { value: "b", label: "The bus left when I had arrived." },
                                { value: "a", label: "The bus had already left when I arrived." },
                                { value: "c", label: "The bus has left when I arrived." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        // The TWO-VERB RULE Section (CRITICAL)
        {
            id: "two-verb-rule",
            stepNumber: 1,
            title: "The TWO-VERB Rule: Most Important Concept!",
            icon: "🎯",
            explanation: `
                <h3 style="color: #f59e0b;">This is THE Most Important Part!</h3>
                <p>Past Perfect is <strong>almost never used alone</strong>. It needs a partner—another past action—to make sense.</p>

                <div style="margin: 1.5rem 0;">
                    <h4 style="color: #1e293b; margin-bottom: 1rem;">📌 How to Identify Which Verb Comes First:</h4>

                    <div style="border-left: 4px solid #f59e0b; padding-left: 1rem; margin-bottom: 1.5rem; background: rgba(245, 158, 11, 0.05); padding: 1rem;">
                        <h4 style="color: #f59e0b; margin-top: 0;">Past Perfect = FIRST Action (Earlier)</h4>
                        <p>When I <span style="background: rgba(20, 184, 166, 0.2); color: #14b8a6; font-weight: 600; padding: 2px 6px; border-radius: 3px;">arrived</span>, she <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; font-weight: 600; padding: 2px 6px; border-radius: 3px;">had already left</span>.</p>
                        <p style="font-size: 0.875rem; color: #64748b;">💡 "had left" = FIRST action (she left before I arrived)</p>
                    </div>

                    <div style="border-left: 4px solid #14b8a6; padding-left: 1rem; background: rgba(20, 184, 166, 0.05); padding: 1rem;">
                        <h4 style="color: #14b8a6; margin-top: 0;">Past Simple = SECOND Action (Later)</h4>
                        <p>When I <span style="background: rgba(20, 184, 166, 0.2); color: #14b8a6; font-weight: 600; padding: 2px 6px; border-radius: 3px;">arrived</span>, she had already left.</p>
                        <p style="font-size: 0.875rem; color: #64748b;">💡 "arrived" = SECOND action (I arrived after she left)</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "📝 Pattern 1: When + Past Simple, Past Perfect",
                    description: "The 'when' action happened SECOND",
                    examples: [
                        {
                            sentence: "When I <span style='color: #14b8a6; font-weight: 600;'>got</span> home, my sister <span style='color: #f59e0b; font-weight: 600;'>had already cooked</span> dinner.",
                            explanation: "FIRST: cooked dinner. SECOND: got home.",
                        },
                        {
                            sentence: "When we <span style='color: #14b8a6; font-weight: 600;'>arrived</span>, the movie <span style='color: #f59e0b; font-weight: 600;'>had already started</span>.",
                            explanation: "FIRST: movie started. SECOND: we arrived.",
                        },
                        {
                            sentence: "When the teacher <span style='color: #14b8a6; font-weight: 600;'>came</span> in, the students <span style='color: #f59e0b; font-weight: 600;'>had finished</span> the test.",
                            explanation: "FIRST: students finished. SECOND: teacher came.",
                        },
                    ],
                },
                {
                    title: "📝 Pattern 2: Past Perfect + before + Past Simple",
                    description: "'Before' shows the sequence clearly",
                    examples: [
                        {
                            sentence: "She <span style='color: #f59e0b; font-weight: 600;'>had finished</span> her homework before she <span style='color: #14b8a6; font-weight: 600;'>went</span> to bed.",
                            explanation: "FIRST: finished homework. SECOND: went to bed.",
                        },
                        {
                            sentence: "They <span style='color: #f59e0b; font-weight: 600;'>had eaten</span> breakfast before they <span style='color: #14b8a6; font-weight: 600;'>left</span> the house.",
                            explanation: "FIRST: ate breakfast. SECOND: left house.",
                        },
                    ],
                },
                {
                    title: "📝 Pattern 3: After + Past Perfect, Past Simple",
                    description: "'After' signals the first action completed",
                    examples: [
                        {
                            sentence: "After he <span style='color: #f59e0b; font-weight: 600;'>had studied</span> for hours, he <span style='color: #14b8a6; font-weight: 600;'>took</span> a break.",
                            explanation: "FIRST: studied. SECOND: took a break.",
                        },
                        {
                            sentence: "After we <span style='color: #f59e0b; font-weight: 600;'>had saved</span> enough money, we <span style='color: #14b8a6; font-weight: 600;'>bought</span> a car.",
                            explanation: "FIRST: saved money. SECOND: bought car.",
                        },
                    ],
                },
                {
                    title: "📝 Pattern 4: By the time + Past Simple, Past Perfect",
                    description: "'By the time' shows the second action was too late",
                    examples: [
                        {
                            sentence: "By the time we <span style='color: #14b8a6; font-weight: 600;'>arrived</span>, the train <span style='color: #f59e0b; font-weight: 600;'>had already left</span>.",
                            explanation: "FIRST: train left. SECOND: we arrived (too late!).",
                        },
                        {
                            sentence: "By the time the fire department <span style='color: #14b8a6; font-weight: 600;'>came</span>, the fire <span style='color: #f59e0b; font-weight: 600;'>had destroyed</span> the building.",
                            explanation: "FIRST: fire destroyed building. SECOND: fire dept came.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Quick Test",
                content: "Ask yourself: 'Which action happened FIRST?' The FIRST action → Past Perfect (had + past participle). The SECOND action → Past Simple (regular past tense).",
            },
            exercises: [
                {
                    id: "ex-two-verb-1",
                    title: "Practice: Identify the First Action",
                    instructions: "In each sentence, which action happened FIRST?",
                    items: [
                        {
                            type: "radio",
                            label: "When I arrived at the party, everyone had left.",
                            options: [
                                { value: "arrived", label: "I arrived" },
                                { value: "left", label: "Everyone left" },
                            ],
                            expectedAnswer: "left",
                        },
                        {
                            type: "radio",
                            label: "She had finished her work before she went home.",
                            options: [
                                { value: "finished", label: "She finished her work" },
                                { value: "went", label: "She went home" },
                            ],
                            expectedAnswer: "finished",
                        },
                        {
                            type: "radio",
                            label: "After they had eaten dinner, they watched a movie.",
                            options: [
                                { value: "watched", label: "They watched a movie" },
                                { value: "eaten", label: "They ate dinner" },
                            ],
                            expectedAnswer: "eaten",
                        },
                        {
                            type: "radio",
                            label: "By the time the ambulance arrived, the patient had died.",
                            options: [
                                { value: "died", label: "The patient died" },
                                { value: "arrived", label: "The ambulance arrived" },
                            ],
                            expectedAnswer: "died",
                        },
                        {
                            type: "radio",
                            label: "When the bell rang, the students had already finished the exam.",
                            options: [
                                { value: "rang", label: "The bell rang" },
                                { value: "finished", label: "The students finished" },
                            ],
                            expectedAnswer: "finished",
                        },
                        {
                            type: "radio",
                            label: "He had locked the door before he left the house.",
                            options: [
                                { value: "locked", label: "He locked the door" },
                                { value: "left", label: "He left the house" },
                            ],
                            expectedAnswer: "locked",
                        },
                        {
                            type: "radio",
                            label: "After I had brushed my teeth, I went to bed.",
                            options: [
                                { value: "went", label: "I went to bed" },
                                { value: "brushed", label: "I brushed my teeth" },
                            ],
                            expectedAnswer: "brushed",
                        },
                        {
                            type: "radio",
                            label: "When we got to the cinema, the film had started.",
                            options: [
                                { value: "started", label: "The film started" },
                                { value: "got", label: "We got to the cinema" },
                            ],
                            expectedAnswer: "started",
                        },
                        {
                            type: "radio",
                            label: "By the time she called me back, I had already found the answer.",
                            options: [
                                { value: "called", label: "She called me back" },
                                { value: "found", label: "I found the answer" },
                            ],
                            expectedAnswer: "found",
                        },
                        {
                            type: "radio",
                            label: "The concert had ended when we arrived at the venue.",
                            options: [
                                { value: "ended", label: "The concert ended" },
                                { value: "arrived", label: "We arrived" },
                            ],
                            expectedAnswer: "ended",
                        },
                    ],
                },
                {
                    id: "ex-two-verb-2",
                    title: "Practice: Identify the Pattern",
                    instructions: "Which sentence pattern is used in each example?",
                    items: [
                        {
                            type: "radio",
                            label: "When I woke up, it had stopped raining.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern1",
                        },
                        {
                            type: "radio",
                            label: "She had saved money before she bought the laptop.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern2",
                        },
                        {
                            type: "radio",
                            label: "After I had read the book, I watched the movie.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern3",
                        },
                        {
                            type: "radio",
                            label: "By the time I got there, everyone had gone home.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern4",
                        },
                        {
                            type: "radio",
                            label: "When the guests arrived, we had prepared everything.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern1",
                        },
                        {
                            type: "radio",
                            label: "After she had finished cooking, she called everyone for dinner.",
                            options: [
                                { value: "pattern1", label: "Pattern 1: When + Past Simple, Past Perfect" },
                                { value: "pattern3", label: "Pattern 3: After + Past Perfect, Past Simple" },
                                { value: "pattern2", label: "Pattern 2: Past Perfect + before + Past Simple" },
                                { value: "pattern4", label: "Pattern 4: By the time + Past Simple, Past Perfect" },
                            ],
                            expectedAnswer: "pattern3",
                        },
                    ],
                },
            ],
        },

        // Timeline Visualization Section
        {
            id: "timeline",
            stepNumber: 2,
            title: "Seeing Time: Visual Timeline",
            icon: "⏰",
            explanation: `
                <h3>Understanding the Sequence Visually</h3>
                <p>Past Perfect is all about sequence. Let's see it on a timeline:</p>

                <div style="background: white; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Timeline: Two Past Actions</h4>

                    <div style="display: flex; align-items: center; justify-content: space-around; position: relative; margin: 2rem 0;">
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 4px; background: linear-gradient(to right, #f59e0b, #14b8a6, #cbd5e1); transform: translateY(-50%); z-index: 0;"></div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #f59e0b; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); margin: 0 auto;">
                                1st
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #f59e0b;">Earlier</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Past Perfect</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #14b8a6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3); margin: 0 auto;">
                                2nd
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #14b8a6;">Later</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Past Simple</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; border: 4px solid white; margin: 0 auto;">
                                NOW
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">Present</div>
                        </div>
                    </div>

                    <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> She <span style="color: #f59e0b; font-weight: 600;">had finished</span> homework (1st) before she <span style="color: #14b8a6; font-weight: 600;">went</span> to bed (2nd).</p>
                    </div>
                </div>

                <h3>More Visual Examples</h3>
                <div style="margin: 1rem 0;">
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                        <p style="margin: 0;"><strong>Example 1:</strong> When I <span style="color: #14b8a6; font-weight: 600;">arrived</span> at the station, the train <span style="color: #f59e0b; font-weight: 600;">had left</span>.</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;"> Timeline: Train left (1st) ← I arrived (2nd) ← NOW</p>
                    </div>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0;"><strong>Example 2:</strong> After he <span style="color: #f59e0b; font-weight: 600;">had eaten</span> dinner, he <span style="color: #14b8a6; font-weight: 600;">watched</span> TV.</p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Timeline: Ate dinner (1st) ← Watched TV (2nd) ← NOW</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "The timeline always flows from left (earliest) to right (most recent). Past Perfect = further left. Past Simple = closer to NOW.",
            },
            exercises: [
                {
                    id: "ex-timeline-1",
                    title: "Practice: Understanding Timeline Order",
                    instructions: "Based on each sentence, which event happened first on the timeline?",
                    items: [
                        {
                            type: "radio",
                            label: "When I got home, my roommate had cooked dinner.",
                            options: [
                                { value: "got", label: "I got home (2nd on timeline)" },
                                { value: "cooked", label: "My roommate cooked dinner (1st on timeline)" },
                            ],
                            expectedAnswer: "cooked",
                        },
                        {
                            type: "radio",
                            label: "After the show had ended, we left the theater.",
                            options: [
                                { value: "ended", label: "The show ended (1st on timeline)" },
                                { value: "left", label: "We left the theater (2nd on timeline)" },
                            ],
                            expectedAnswer: "ended",
                        },
                        {
                            type: "radio",
                            label: "By the time I woke up, my family had eaten breakfast.",
                            options: [
                                { value: "woke", label: "I woke up (2nd on timeline)" },
                                { value: "eaten", label: "My family ate breakfast (1st on timeline)" },
                            ],
                            expectedAnswer: "eaten",
                        },
                        {
                            type: "radio",
                            label: "She had already left when I called her.",
                            options: [
                                { value: "left", label: "She left (1st on timeline)" },
                                { value: "called", label: "I called her (2nd on timeline)" },
                            ],
                            expectedAnswer: "left",
                        },
                        {
                            type: "radio",
                            label: "The game had started before we arrived at the stadium.",
                            options: [
                                { value: "arrived", label: "We arrived (2nd on timeline)" },
                                { value: "started", label: "The game started (1st on timeline)" },
                            ],
                            expectedAnswer: "started",
                        },
                        {
                            type: "radio",
                            label: "When the police arrived, the thief had escaped.",
                            options: [
                                { value: "escaped", label: "The thief escaped (1st on timeline)" },
                                { value: "arrived", label: "The police arrived (2nd on timeline)" },
                            ],
                            expectedAnswer: "escaped",
                        },
                    ],
                },
            ],
        },

        // Positive Form Section
        {
            id: "positive-form",
            stepNumber: 3,
            title: "How to Form Past Perfect (Positive)",
            icon: "✓",
            explanation: `
                <h3>The Formula</h3>
                <p>Past Perfect is simple to form: <strong>had + past participle</strong></p>
                <p>Remember: EVERYONE uses 'had' (I had, you had, he had, she had, we had, they had)</p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(245, 158, 11, 0.3);">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #fef3c7; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">had</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #fed7aa; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            When I <span style="color: #14b8a6; font-weight: 600;">arrived</span>, they <span style="color: #f59e0b; font-weight: 600;">had finished</span> dinner.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">had left</span> before the meeting <span style="color: #14b8a6; font-weight: 600;">started</span>.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            By 2020, we <span style="color: #f59e0b; font-weight: 600;">had lived</span> in Boston for 10 years.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            The students <span style="color: #f59e0b; font-weight: 600;">had studied</span> hard before they <span style="color: #14b8a6; font-weight: 600;">took</span> the exam.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            He <span style="color: #f59e0b; font-weight: 600;">had never seen</span> snow before he <span style="color: #14b8a6; font-weight: 600;">moved</span> to Canada.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "had", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Remember",
                content:
                    "Everyone uses 'had'—no need to change it for he/she/it like with 'has' in Present Perfect! And don't forget: almost always TWO verbs in context.",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise: Complete with Past Perfect",
                    instructions:
                        "Complete each sentence with the correct Past Perfect form (had + past participle). Remember: these sentences show TWO actions!",
                    items: [
                        {
                            type: "text",
                            label: "When I got to the party, everyone ___ (leave) already.",
                            expectedAnswer: "had left",
                        },
                        {
                            type: "text",
                            label: "She was tired because she ___ (work) all day.",
                            expectedAnswer: "had worked",
                        },
                        {
                            type: "text",
                            label: "Before they moved here, they ___ (live) in Tokyo.",
                            expectedAnswer: "had lived",
                        },
                        {
                            type: "text",
                            label: "By the time the ambulance arrived, the patient ___ (die).",
                            expectedAnswer: "had died",
                        },
                        {
                            type: "text",
                            label: "I wasn't hungry because I ___ (eat) lunch earlier.",
                            expectedAnswer: "had eaten",
                        },
                        {
                            type: "text",
                            label: "When we got to the cinema, the movie ___ (start).",
                            expectedAnswer: "had started",
                        },
                        {
                            type: "text",
                            label: "She knew the city well because she ___ (visit) it many times before.",
                            expectedAnswer: "had visited",
                        },
                        {
                            type: "text",
                            label: "After they ___ (finish) their homework, they played video games.",
                            expectedAnswer: "had finished",
                        },
                        {
                            type: "text",
                            label: "He couldn't get in because he ___ (lose) his keys.",
                            expectedAnswer: "had lost",
                        },
                        {
                            type: "text",
                            label: "By the time I woke up, my family ___ (go) to church.",
                            expectedAnswer: "had gone",
                        },
                    ],
                },
            ],
        },

        // Negative Form Section
        {
            id: "negative-form",
            stepNumber: 4,
            title: "Negative Form",
            icon: "✗",
            explanation: `
                <h3>Making Negatives</h3>
                <p>Add <strong>'not'</strong> after 'had': <strong>had not = hadn't</strong></p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(245, 158, 11, 0.3);">
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #fef3c7; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">had not / hadn't</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #fed7aa; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            When I <span style="color: #14b8a6; font-weight: 600;">called</span>, they <span style="color: #f59e0b; font-weight: 600;">hadn't finished</span> dinner yet.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            She <span style="color: #f59e0b; font-weight: 600;">hadn't seen</span> him before that day.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            I <span style="color: #f59e0b; font-weight: 600;">hadn't studied</span> enough before the test <span style="color: #14b8a6; font-weight: 600;">started</span>.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            We <span style="color: #f59e0b; font-weight: 600;">hadn't met</span> before the conference.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "had not / hadn't", type: "verb" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
            ],
            tipBox: {
                title: "💡 Short Form",
                content:
                    "We usually use the contraction: hadn't = had not. It sounds more natural in conversation!",
            },
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise: Make Negative Sentences",
                    instructions: "Complete these sentences with the negative form (hadn't + past participle).",
                    items: [
                        {
                            type: "text",
                            label: "When I arrived, they ___ (not finish) eating.",
                            expectedAnswer: "hadn't finished",
                        },
                        {
                            type: "text",
                            label: "She was nervous because she ___ (not fly) before.",
                            expectedAnswer: "hadn't flown",
                        },
                        {
                            type: "text",
                            label: "I ___ (not see) him before we met at the party.",
                            expectedAnswer: "hadn't seen",
                        },
                        {
                            type: "text",
                            label: "They failed the test because they ___ (not study).",
                            expectedAnswer: "hadn't studied",
                        },
                        {
                            type: "text",
                            label: "We were surprised because we ___ (not hear) the news.",
                            expectedAnswer: "hadn't heard",
                        },
                        {
                            type: "text",
                            label: "He couldn't play because he ___ (not practice).",
                            expectedAnswer: "hadn't practiced",
                        },
                        {
                            type: "text",
                            label: "By 2020, I ___ (not visit) Europe yet.",
                            expectedAnswer: "hadn't visited",
                        },
                        {
                            type: "text",
                            label: "When the rain started, we ___ (not bring) umbrellas.",
                            expectedAnswer: "hadn't brought",
                        },
                    ],
                },
            ],
        },

        // Question Form Section
        {
            id: "question-form",
            stepNumber: 5,
            title: "Question Form",
            icon: "❓",
            explanation: `
                <h3>Making Questions</h3>
                <p>Put <strong>'Had'</strong> before the subject:</p>

                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; padding: 1.5rem; margin: 1.5rem 0; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); border-radius: 0.75rem; border: 2px solid rgba(245, 158, 11, 0.3);">
                    <span style="background: #fef3c7; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">Had</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #e0f2fe; color: #0369a1; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">subject</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">+</span>
                    <span style="background: #fed7aa; color: #b45309; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 1.125rem;">past participle</span>
                    <span style="font-size: 1.5rem; color: #64748b; font-weight: 600;">?</span>
                </div>

                <div style="margin-top: 1.5rem; background: rgba(139, 92, 246, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(139, 92, 246, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> you <span style="color: #f59e0b; font-weight: 600;">finished</span> your homework before dinner?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> she <span style="color: #f59e0b; font-weight: 600;">left</span> when you <span style="color: #14b8a6; font-weight: 600;">arrived</span>?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> they <span style="color: #f59e0b; font-weight: 600;">eaten</span> lunch before the meeting?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(139, 92, 246, 0.1);">
                            <span style="color: #f59e0b; font-weight: 600;">Had</span> he <span style="color: #f59e0b; font-weight: 600;">seen</span> the movie before?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Had", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "past participle", type: "verb" },
                { text: "?", type: "other" },
            ],
            tipBox: {
                title: "💡 Answering Yes/No Questions",
                content:
                    "Yes, I had. / No, I hadn't. Keep it simple and natural!",
            },
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise: Form Questions",
                    instructions:
                        "Write questions in Past Perfect. Start with 'Had' and use the past participle.",
                    items: [
                        {
                            type: "text",
                            label: "___ you (see) that movie before?",
                            expectedAnswer: "Had you seen",
                        },
                        {
                            type: "text",
                            label: "___ she (finish) her work before she left?",
                            expectedAnswer: "Had she finished",
                        },
                        {
                            type: "text",
                            label: "___ they (meet) before the wedding?",
                            expectedAnswer: "Had they met",
                        },
                        {
                            type: "text",
                            label: "___ he (study) English before moving to the US?",
                            expectedAnswer: "Had he studied",
                        },
                        {
                            type: "text",
                            label: "___ we (visit) this restaurant before?",
                            expectedAnswer: "Had we visited",
                        },
                        {
                            type: "text",
                            label: "___ the train (leave) when you got to the station?",
                            expectedAnswer: "Had the train left",
                        },
                        {
                            type: "text",
                            label: "___ it (stop) raining before you went outside?",
                            expectedAnswer: "Had it stopped",
                        },
                        {
                            type: "text",
                            label: "___ you ever (eat) sushi before you moved to Japan?",
                            expectedAnswer: "Had you ever eaten",
                        },
                    ],
                },
            ],
        },

        // Past Perfect vs Past Simple Comparison
        {
            id: "comparison",
            stepNumber: 6,
            title: "Past Perfect vs. Past Simple",
            icon: "⚖️",
            explanation: `
                <h3>What's the Difference?</h3>
                <p>Both are past tenses, but they have different jobs!</p>
            `,
            comparison: {
                title: "Side-by-Side Comparison",
                leftLabel: "Past Perfect",
                rightLabel: "Past Simple",
                rows: [
                    {
                        label: "Purpose",
                        left: "Shows which of TWO past actions happened FIRST",
                        right: "Describes a completed past action (can be alone or second in sequence)",
                    },
                    {
                        label: "Formula",
                        left: "had + past participle",
                        right: "verb + -ed (regular) or irregular past",
                    },
                    {
                        label: "Context",
                        left: "Almost ALWAYS used with another past action",
                        right: "Can stand alone or be the second action",
                    },
                    {
                        label: "Time Words",
                        left: "before, after, when, by the time, already",
                        right: "yesterday, last week, ago, in 2020",
                    },
                    {
                        label: "Example",
                        left: "When I arrived, she had already left. (She left FIRST)",
                        right: "I arrived at 3pm. (Single action, no sequence needed)",
                    },
                    {
                        label: "Example",
                        left: "After he had eaten, he went to bed. (Ate first, then bed)",
                        right: "He ate dinner at 7pm. (Single action)",
                    },
                    {
                        label: "Common Mistake",
                        left: "❌ Using Past Perfect with only ONE action: 'I had eaten lunch yesterday.'",
                        right: "❌ Using Past Simple when sequence matters: 'When I arrived, she left.' (confusing!)",
                    },
                ],
            },
            tipBox: {
                title: "⚠️ Common Mistake Alert",
                content: "Don't use Past Perfect if there's only ONE past action! ❌ 'I had eaten lunch yesterday.' → ✓ 'I ate lunch yesterday.' OR ✓ 'I had eaten lunch before the meeting started.' (TWO actions!)",
            },
            exercises: [
                {
                    id: "ex-comparison-1",
                    title: "Practice: Choose the Correct Tense",
                    instructions: "Choose between Past Perfect or Past Simple based on the context.",
                    items: [
                        {
                            type: "radio",
                            label: "I ___ dinner at 7pm last night.",
                            options: [
                                { value: "had-eaten", label: "had eaten (Past Perfect)" },
                                { value: "ate", label: "ate (Past Simple)" },
                            ],
                            expectedAnswer: "ate",
                        },
                        {
                            type: "radio",
                            label: "When I got home, my sister ___ dinner already.",
                            options: [
                                { value: "had-cooked", label: "had cooked (Past Perfect)" },
                                { value: "cooked", label: "cooked (Past Simple)" },
                            ],
                            expectedAnswer: "had-cooked",
                        },
                        {
                            type: "radio",
                            label: "I ___ to Paris in 2019.",
                            options: [
                                { value: "had-been", label: "had been (Past Perfect)" },
                                { value: "went", label: "went (Past Simple)" },
                            ],
                            expectedAnswer: "went",
                        },
                        {
                            type: "radio",
                            label: "Before I moved to East Boston, I ___ in Chelsea.",
                            options: [
                                { value: "had-lived", label: "had lived (Past Perfect)" },
                                { value: "lived", label: "lived (Past Simple)" },
                            ],
                            expectedAnswer: "had-lived",
                        },
                        {
                            type: "radio",
                            label: "She ___ the movie last night.",
                            options: [
                                { value: "had-watched", label: "had watched (Past Perfect)" },
                                { value: "watched", label: "watched (Past Simple)" },
                            ],
                            expectedAnswer: "watched",
                        },
                        {
                            type: "radio",
                            label: "When the movie started, I ___ the book.",
                            options: [
                                { value: "had-read", label: "had already read (Past Perfect)" },
                                { value: "read", label: "read (Past Simple)" },
                            ],
                            expectedAnswer: "had-read",
                        },
                        {
                            type: "radio",
                            label: "He was tired because he ___ all day.",
                            options: [
                                { value: "worked", label: "worked (Past Simple)" },
                                { value: "had-worked", label: "had worked (Past Perfect)" },
                            ],
                            expectedAnswer: "had-worked",
                        },
                        {
                            type: "radio",
                            label: "They ___ in Los Angeles last year.",
                            options: [
                                { value: "lived", label: "lived (Past Simple)" },
                                { value: "had-lived", label: "had lived (Past Perfect)" },
                            ],
                            expectedAnswer: "lived",
                        },
                        {
                            type: "radio",
                            label: "By the time I arrived, the bus ___.",
                            options: [
                                { value: "left", label: "left (Past Simple)" },
                                { value: "had-left", label: "had left (Past Perfect)" },
                            ],
                            expectedAnswer: "had-left",
                        },
                        {
                            type: "radio",
                            label: "We ___ pizza for dinner yesterday.",
                            options: [
                                { value: "ordered", label: "ordered (Past Simple)" },
                                { value: "had-ordered", label: "had ordered (Past Perfect)" },
                            ],
                            expectedAnswer: "ordered",
                        },
                        {
                            type: "radio",
                            label: "After we ___ our homework, we played video games.",
                            options: [
                                { value: "finished", label: "finished (Past Simple)" },
                                { value: "had-finished", label: "had finished (Past Perfect)" },
                            ],
                            expectedAnswer: "had-finished",
                        },
                        {
                            type: "radio",
                            label: "I ___ my keys this morning.",
                            options: [
                                { value: "lost", label: "lost (Past Simple)" },
                                { value: "had-lost", label: "had lost (Past Perfect)" },
                            ],
                            expectedAnswer: "lost",
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
                    <li><strong>The Golden Rule:</strong> Past Perfect is used with <strong>TWO verbs</strong> to show which action happened FIRST</li>
                    <li><strong>Formula:</strong> had + past participle (everyone uses 'had')</li>
                    <li><strong>Purpose:</strong> Show sequence and temporal order in the past</li>
                    <li><strong>Four Key Patterns:</strong>
                        <ol class="list-decimal pl-6 mt-2">
                            <li><strong>When</strong> + Past Simple, Past Perfect</li>
                            <li>Past Perfect + <strong>before</strong> + Past Simple</li>
                            <li><strong>After</strong> + Past Perfect, Past Simple</li>
                            <li><strong>By the time</strong> + Past Simple, Past Perfect</li>
                        </ol>
                    </li>
                    <li><strong>Time Words:</strong> before, after, when, by the time, already</li>
                    <li><strong>Negative:</strong> hadn't + past participle</li>
                    <li><strong>Questions:</strong> Had + subject + past participle?</li>
                    <li><strong>vs Past Simple:</strong> Past Perfect = FIRST action in sequence. Past Simple = standalone action or SECOND action in sequence</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Final Reminder",
                content: "Two questions to always ask: (1) Are there TWO past actions? (2) Which one happened FIRST? If you can answer both → you're ready for Past Perfect!",
            },
            exercises: [
                {
                    id: "ex-summary-scramble",
                    title: "Final Practice: Word Scrambles",
                    instructions: "Put the words in the correct order to make Past Perfect sentences.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["When", "I", "arrived", ",", "they", "had", "left"],
                            correctAnswer: "When I arrived, they had left",
                            hint: "Pattern 1: When + Past Simple, Past Perfect",
                        },
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["She", "had", "finished", "her", "work", "before", "she", "went", "home"],
                            correctAnswer: "She had finished her work before she went home",
                            hint: "Pattern 2: Past Perfect + before + Past Simple",
                        },
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["After", "he", "had", "eaten", ",", "he", "watched", "TV"],
                            correctAnswer: "After he had eaten, he watched TV",
                            hint: "Pattern 3: After + Past Perfect, Past Simple",
                        },
                        {
                            type: "word-scramble",
                            label: "Make a sentence:",
                            words: ["By", "the", "time", "we", "got", "there", ",", "the", "movie", "had", "started"],
                            correctAnswer: "By the time we got there, the movie had started",
                            hint: "Pattern 4: By the time + Past Simple, Past Perfect",
                        },
                    ],
                },
            ],
        },

        // Housing Context Section
        {
            id: "housing-context",
            stepNumber: 8,
            title: "🏠 Housing & Home Context",
            icon: "🏠",
            explanation: `
                <h3>Past Perfect in Housing Situations</h3>
                <p>When talking about apartments, landlords, and moving, Past Perfect helps explain the sequence of events clearly.</p>

                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h4 style="margin-top: 0; color: #f59e0b;">🎯 Real Housing Examples</h4>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #f59e0b;">
                            <strong>Before I signed the lease, I <span style="color: #f59e0b;">had checked</span> the apartment carefully.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">FIRST: checked apartment → SECOND: signed lease</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #f59e0b;">
                            <strong>When I met the landlord, I <span style="color: #f59e0b;">had already researched</span> tenant rights.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">FIRST: researched rights → SECOND: met landlord</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #f59e0b;">
                            <strong>The water heater broke because the owner <span style="color: #f59e0b;">hadn't maintained</span> it properly.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">FIRST: didn't maintain → SECOND: broke</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid #f59e0b;">
                            <strong>By the time I called maintenance, the leak <span style="color: #f59e0b;">had already damaged</span> the floor.</strong>
                            <br><span style="font-size: 0.875rem; color: #64748b;">FIRST: damaged floor → SECOND: called maintenance</span>
                        </div>
                    </div>
                </div>

                <h4>Common Housing Scenarios</h4>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>Moving:</strong> "Before I moved in, I <strong>had packed</strong> all my boxes."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>Problems:</strong> "When I discovered the mold, I <strong>had already paid</strong> the security deposit."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>History:</strong> "I <strong>had lived</strong> with roommates for three years before I got my own place."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>Housing History:</strong> "They <strong>had rented</strong> in that neighborhood for ten years before they bought a house."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>Before Moving:</strong> "She <strong>had saved</strong> $2,000 before she started looking for apartments."
                    </li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0.25rem;">
                        ✅ <strong>Relief:</strong> "I felt relieved because I <strong>had taken</strong> photos of the apartment condition."
                    </li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #f59e0b;">💬 Speaking Practice</h4>
                    <p style="margin-bottom: 0.75rem; font-weight: 600;">Use these prompts to practice past perfect:</p>
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li style="margin-bottom: 0.5rem;">"Tell me about a time you had a problem with your apartment. What had happened before you discovered it?"</li>
                        <li style="margin-bottom: 0.5rem;">"Describe your last move. What had you done before moving day?"</li>
                        <li style="margin-bottom: 0.5rem;">"Talk about finding your current home. What research had you completed?"</li>
                    </ul>
                </div>

                <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #14b8a6; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #14b8a6;">📌 Key Signal Words for Housing Context</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem;">
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">before</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">after</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">by the time</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">when</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">already</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">just</span>
                        <span style="background: white; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-weight: 600; color: #f59e0b;">never</span>
                    </div>
                </div>

                <div style="background: #fee2e2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #ef4444;">❌ Common Mistakes to Avoid</h4>
                    <div style="margin-top: 0.75rem;">
                        <div style="background: white; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 0.75rem;">
                            <p style="margin: 0; color: #ef4444; font-weight: 600;">❌ "I have checked the apartment before I signed the lease."</p>
                            <p style="margin: 0.5rem 0 0 0; color: #059669; font-weight: 600;">✅ "I <strong>had checked</strong> the apartment before I signed the lease."</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">Use past perfect (had + past participle) for the earlier action, not present perfect.</p>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 0.25rem;">
                            <p style="margin: 0; color: #ef4444; font-weight: 600;">❌ "She didn't signed the lease because she found something better."</p>
                            <p style="margin: 0.5rem 0 0 0; color: #059669; font-weight: 600;">✅ "She didn't sign the lease because she <strong>had found</strong> something better."</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">The action of finding came first, so it needs past perfect.</p>
                        </div>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "ex-housing-1",
                    title: "Practice: Housing Context",
                    instructions: "Complete these housing-related sentences with Past Perfect.",
                    items: [
                        {
                            type: "text",
                            label: "Before she signed the lease, she ___ (check) the apartment three times.",
                            expectedAnswer: "had checked",
                        },
                        {
                            type: "text",
                            label: "When the inspector arrived, the tenants ___ (already clean) everything.",
                            expectedAnswer: "had already cleaned",
                        },
                        {
                            type: "text",
                            label: "He couldn't get his deposit back because he ___ (not follow) the move-out instructions.",
                            expectedAnswer: "hadn't followed",
                        },
                        {
                            type: "text",
                            label: "By the time I found a better apartment, I ___ (already sign) a one-year lease.",
                            expectedAnswer: "had already signed",
                        },
                        {
                            type: "text",
                            label: "The landlord was surprised because I ___ (research) tenant rights before our meeting.",
                            expectedAnswer: "had researched",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz for comprehension
    miniQuiz: [
        // 1. Sequence meaning
        {
            id: "quiz-1",
            skillTag: "past-perfect-two-past-actions-sequence",
            difficulty: "easy",
            question: "Which sentence clearly shows which action happened first?",
            options: [
                { value: "a", label: "When I arrived, they had finished dinner." },
                { value: "b", label: "When I arrived, they finish dinner." },
                { value: "c", label: "When I had arrived, they finished dinner." },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect ('had finished') shows the first action. They finished dinner before I arrived.",
        },
        // 2. First action identification
        {
            id: "quiz-2",
            skillTag: "past-perfect-first-action-identification",
            difficulty: "easy",
            question: "In the sentence 'After the bell had rung, the students left the classroom,' which happened first?",
            options: [
                { value: "b", label: "The bell rang" },
                { value: "a", label: "The students left the classroom" },
            ],
            correctAnswer: "b",
            explanation: "The bell rang (Past Perfect) first, then the students left.",
        },
        // 3. Cause-effect
        {
            id: "quiz-3",
            skillTag: "past-perfect-cause-effect",
            difficulty: "medium",
            question: "Why was Maria tired? She was tired because she had worked all night.",
            options: [
                { value: "a", label: "She worked after she was tired." },
                { value: "b", label: "She worked before she was tired." },
            ],
            correctAnswer: "b",
            explanation: "The Past Perfect ('had worked') shows the cause happened first.",
        },
        // 4. Positive form
        {
            id: "quiz-4",
            skillTag: "form-past-perfect-positive",
            difficulty: "easy",
            question: "Choose the correct Past Perfect form:",
            options: [
                { value: "b", label: "She had eaten breakfast before school." },
                { value: "a", label: "She had ate breakfast before school." },
                { value: "c", label: "She have eaten breakfast before school." },
            ],
            correctAnswer: "b",
            explanation: "'Had + past participle' = 'had eaten'.",
        },
        // 5. Negative form
        {
            id: "quiz-5",
            skillTag: "form-past-perfect-negative",
            difficulty: "easy",
            question: "Complete the sentence: When I arrived, they ___ (not leave) yet.",
            options: [
                { value: "b", label: "haven't left" },
                { value: "a", label: "hadn't left" },
                { value: "c", label: "didn't left" },
            ],
            correctAnswer: "a",
            explanation: "Negative Past Perfect: hadn't + past participle.",
        },
        // 6. Question form
        {
            id: "quiz-6",
            skillTag: "form-past-perfect-question",
            difficulty: "easy",
            question: "Which is a correct Past Perfect question?",
            options: [
                { value: "b", label: "Did you had finished your homework before dinner?" },
                { value: "c", label: "Have you finished your homework before dinner?" },
                { value: "a", label: "Had you finished your homework before dinner?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Had + subject + past participle.",
        },
        // 7. Pattern: when
        {
            id: "quiz-7",
            skillTag: "pattern-when-past-perfect",
            difficulty: "easy",
            question: "Which sentence uses 'when' with Past Perfect correctly?",
            options: [
                { value: "a", label: "When I had finished, I went home." },
                { value: "b", label: "When I finished, I had went home." },
                { value: "c", label: "When I had finish, I go home." },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect: had finished (first), Past Simple: went (second).",
        },
        // 8. Pattern: before
        {
            id: "quiz-8",
            skillTag: "pattern-before-past-perfect",
            difficulty: "easy",
            question: "Fill in the blank: She ___ (already eat) before she left for work.",
            options: [
                { value: "b", label: "already had ate" },
                { value: "a", label: "had already eaten" },
                { value: "c", label: "already ate" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect: had already eaten.",
        },
        // 9. Pattern: after
        {
            id: "quiz-9",
            skillTag: "pattern-after-past-perfect",
            difficulty: "easy",
            question: "Choose the correct sentence:",
            options: [
                { value: "b", label: "After they leave, we had locked the door." },
                { value: "c", label: "After they had leave, we locked the door." },
                { value: "a", label: "After they had left, we locked the door." },
            ],
            correctAnswer: "a",
            explanation: "After + Past Perfect (had left), then Past Simple (locked).",
        },
        // 10. Pattern: by the time
        {
            id: "quiz-10",
            skillTag: "pattern-by-the-time-past-perfect",
            difficulty: "easy",
            question: "By the time I got to the station, the train ___ (already/leave).",
            options: [
                { value: "b", label: "had already left" },
                { value: "a", label: "already left" },
                { value: "c", label: "has already left" },
            ],
            correctAnswer: "b",
            explanation: "By the time + Past Simple, Past Perfect for the earlier action.",
        },
        // 11. Error: overuse
        {
            id: "quiz-11",
            skillTag: "error-past-perfect-overuse",
            difficulty: "medium",
            question: "Is this sentence correct? 'I had visited New York last year.'",
            options: [
                { value: "a", label: "Yes, it's correct" },
                { value: "b", label: "No, Past Perfect is not needed for one action" },
            ],
            correctAnswer: "b",
            explanation: "Past Perfect is for TWO past actions. Use Past Simple: 'I visited New York last year.'",
        },
        // 12. Error: Past Simple instead of Past Perfect
        {
            id: "quiz-12",
            skillTag: "error-past-simple-instead-of-past-perfect",
            difficulty: "medium",
            question: "Find the error: 'When I arrived at the airport, the plane left.'",
            options: [
                { value: "a", label: "The first action should be Past Perfect: 'the plane had left.'" },
                { value: "b", label: "No error; the sentence is fine." },
            ],
            correctAnswer: "a",
            explanation: "The plane left before I arrived, so use Past Perfect for the first action.",
        },
        // 13. Error: double Past Perfect
        {
            id: "quiz-13",
            skillTag: "error-double-past-perfect",
            difficulty: "medium",
            question: "Which sentence is correct?",
            options: [
                { value: "a", label: "After she had finished her homework, she had gone to bed." },
                { value: "b", label: "After she had finished her homework, she went to bed." },
            ],
            correctAnswer: "b",
            explanation: "Only the first action uses Past Perfect; the second uses Past Simple.",
        },
        // 14. Contrast: Past Perfect vs Past Simple
        {
            id: "quiz-14",
            skillTag: "contrast-past-perfect-vs-past-simple",
            difficulty: "medium",
            question: "Choose the best option: 'Before I moved to Boston, I ___ in Chicago.'",
            options: [
                { value: "a", label: "had lived" },
                { value: "b", label: "lived" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect ('had lived') shows the action happened before the move.",
        },
        // 15. Meaning choice (sequence)
        {
            id: "quiz-15",
            skillTag: "past-perfect-two-past-actions-sequence",
            difficulty: "medium",
            question: "Which sentence clearly explains the timeline?",
            options: [
                { value: "b", label: "He ate dinner before he had watched TV." },
                { value: "c", label: "He was eating dinner before he watched TV." },
                { value: "a", label: "He had eaten dinner before he watched TV." },
            ],
            correctAnswer: "a",
            explanation: "The Past Perfect shows he finished eating before watching TV.",
        },
    ],

/*
TEACHER DIAGNOSTIC NOTES – Past Perfect Mini Quiz

Meaning gaps:
- past-perfect-two-past-actions-sequence
- past-perfect-first-action-identification
- past-perfect-cause-effect

Form issues:
- form-past-perfect-positive
- form-past-perfect-negative
- form-past-perfect-question

Pattern confusion:
- pattern-when-past-perfect
- pattern-before-past-perfect
- pattern-after-past-perfect
- pattern-by-the-time-past-perfect

Common errors:
- error-past-perfect-overuse
- error-past-simple-instead-of-past-perfect
- error-double-past-perfect

Contrast issues:
- contrast-past-perfect-vs-past-simple

Reteaching guidance:
- If meaning tags are weak → re-teach the TWO-VERB RULE and force students to label FIRST vs SECOND actions.
- If form tags are weak → drill had + past participle in positive, negative, and question forms.
- If pattern tags are weak → practice sentence frames with when / before / after / by the time.
- If overuse errors appear → reset rule: ONE past action = Past Simple.
- If contrast is weak → timeline drills comparing single past events vs past sequences.
*/
};
