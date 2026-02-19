import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsZeroFirstContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Zero & First Conditionals: The IF-THEN Machine",
            icon: "🔄",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(244, 211, 94, 0.1) 0%, rgba(123, 168, 132, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #f4d35e; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">English has TWO types of conditionals for <strong style="color: #f4d35e;">REAL situations</strong>: <strong>Zero Conditional</strong> for things that are always true (like science facts and habits), and <strong>First Conditional</strong> for real future possibilities and plans. Understanding which to use helps you talk about cause and effect clearly!</p>
                </div>

                <h3>The Big Difference</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e;">
                        <h4 style="color: #ca8a04; margin-top: 0;">Zero Conditional</h4>
                        <p><strong>Always true</strong> (facts, habits, natural laws)</p>
                        <p style="font-weight: bold; color: #ca8a04;">If + present, present</p>
                        <p style="margin: 0;">"If you heat water to 100°C, it <strong>boils</strong>."</p>
                    </div>
                    <div style="background: rgba(123, 168, 132, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <h4 style="color: #7ba884; margin-top: 0;">First Conditional</h4>
                        <p><strong>Future possibility</strong> (plans, predictions, promises)</p>
                        <p style="font-weight: bold; color: #7ba884;">If + present, will + verb</p>
                        <p style="margin: 0;">"If it rains tomorrow, I <strong>will bring</strong> an umbrella."</p>
                    </div>
                </div>

                <div style="background: rgba(123, 168, 132, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In daily life:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Explaining how things work (zero conditional)</li>
                        <li>Talking about your habits and routines (zero conditional)</li>
                        <li>Making weekend plans and promises (first conditional)</li>
                        <li>Predicting what will happen in the future (first conditional)</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Zero = always true facts. First = your future plans!</p>
                </div>
            `,
            exercises: [
                {
                    id: "conditionals-intro-1",
                    title: "Practice: Zero vs First - Can You Tell the Difference?",
                    instructions: "Is each sentence talking about something always true (zero) or a future possibility (first)?",
                    items: [
                        {
                            type: "radio",
                            label: '"If you heat water to 100°C, it boils."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (science fact)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If it rains tomorrow, I will bring an umbrella."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true" },
                                { value: "first", label: "First conditional - future possibility (specific plan)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I\'m tired, I drink coffee."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (my habit)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
            ],
        },

        {
            id: "zero-conditional",
            stepNumber: 1,
            title: "Zero Conditional: Always True Facts & Habits",
            icon: "📋",
            explanation: `
                <h3>When to Use Zero Conditional</h3>
                <p>Use zero conditional for things that are <strong>always true</strong>:</p>
                <ul>
                    <li><strong>Science facts:</strong> "If you heat ice, it melts."</li>
                    <li><strong>Natural laws:</strong> "If it rains, the ground gets wet."</li>
                    <li><strong>Your habits:</strong> "If I'm tired, I go to bed early."</li>
                    <li><strong>General truths:</strong> "If you don't eat, you get hungry."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #ca8a04;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #ca8a04; text-align: center; margin: 1rem 0;">If + present simple, present simple</p>
                    <p style="text-align: center; font-style: italic;">(Both clauses use present simple!)</p>
                </div>

                <h3>Examples from Everyday Life</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Science & Nature:</p>
                    <ul>
                        <li>If you <strong>heat</strong> water to 100°C, it <strong>boils</strong>.</li>
                        <li>If it <strong>rains</strong>, the ground <strong>gets</strong> wet.</li>
                        <li>If you <strong>freeze</strong> water, it <strong>turns</strong> into ice.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Your habits & routines:</p>
                    <ul>
                        <li>If I <strong>feel</strong> tired, I <strong>drink</strong> coffee.</li>
                        <li>If she <strong>has</strong> free time, she <strong>reads</strong> books.</li>
                        <li>If we <strong>finish</strong> dinner early, we <strong>watch</strong> a movie.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Cooking & Recipes:</p>
                    <ul>
                        <li>If you <strong>add</strong> salt, the food <strong>tastes</strong> better.</li>
                        <li>If you <strong>mix</strong> flour and water, you <strong>make</strong> dough.</li>
                        <li>If the oven <strong>isn't hot</strong> enough, the bread <strong>doesn't rise</strong>.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Traffic & Transportation:</p>
                    <ul>
                        <li>If the light <strong>turns</strong> red, you <strong>stop</strong>.</li>
                        <li>If you <strong>miss</strong> the bus, you <strong>have to</strong> wait 15 minutes.</li>
                        <li>If there <strong>is</strong> traffic, the trip <strong>takes</strong> longer.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Zero conditional uses present simple in BOTH clauses. No 'will'! This shows the result ALWAYS happens based on a fact or your habit.",
            },
            exercises: [
                {
                    id: "zero-conditional-1",
                    title: "Practice: Build Zero Conditional Sentences",
                    instructions: "Complete each zero conditional sentence with the correct present simple form.",
                    items: [
                        {
                            type: "text",
                            label: "If you heat ice, it _____ (melt).",
                            expectedAnswer: "melts",
                        },
                        {
                            type: "text",
                            label: "If I drink coffee at night, I _____ (not sleep) well.",
                            expectedAnswer: "don't sleep",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct zero conditional:",
                            options: [
                                { value: "b", label: "If it rains, the ground will get wet." },
                                { value: "a", label: "If it rains, the ground gets wet." },
                                { value: "c", label: "If it will rain, the ground gets wet." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "zero-conditional-2",
                    title: "Practice: Your Habits",
                    instructions: "Complete these sentences about general habits.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence describes a habit (always true)?",
                            options: [
                                { value: "b", label: "If I have free time, I will read books." },
                                { value: "c", label: "If I will have free time, I read books." },
                                { value: "a", label: "If I have free time, I read books." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete the sentence: If you don't water plants, they _____ (die).",
                            expectedAnswer: "die",
                        },
                    ],
                },
            ],
        },

        {
            id: "first-conditional",
            stepNumber: 2,
            title: "First Conditional: Future Plans & Possibilities",
            icon: "🎯",
            explanation: `
                <h3>When to Use First Conditional</h3>
                <p>Use first conditional for <strong>real future possibilities</strong>:</p>
                <ul>
                    <li><strong>Weekend plans:</strong> "If the weather is nice, I'll go to the park."</li>
                    <li><strong>Predictions:</strong> "If you study hard, you'll pass the exam."</li>
                    <li><strong>Promises:</strong> "If you help me, I'll help you tomorrow."</li>
                    <li><strong>Warnings:</strong> "If you don't hurry, we'll be late!"</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(123, 168, 132, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">If + present simple, will + base verb</p>
                    <p style="text-align: center; font-style: italic;">(IF clause = present, RESULT clause = will + verb)</p>
                </div>

                <h3>Examples from Your Life</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Weekend plans:</p>
                    <ul>
                        <li>If the weather <strong>is</strong> nice, I <strong>will go</strong> to the park.</li>
                        <li>If it <strong>rains</strong> tomorrow, we <strong>will stay</strong> home.</li>
                        <li>If I <strong>have</strong> time, I <strong>will call</strong> you this weekend.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">School & Learning:</p>
                    <ul>
                        <li>If I <strong>study</strong> hard, I <strong>will pass</strong> the exam.</li>
                        <li>If you <strong>practice</strong> every day, you <strong>will improve</strong> quickly.</li>
                        <li>If she <strong>finishes</strong> her homework, she <strong>will watch</strong> TV.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Shopping & Money:</p>
                    <ul>
                        <li>If I <strong>save</strong> $50 a month, I <strong>will have</strong> $600 by the end of the year.</li>
                        <li>If the price <strong>drops</strong>, I <strong>will buy</strong> a new phone.</li>
                        <li>If we <strong>don't find</strong> it on sale, we <strong>will wait</strong> until next month.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Travel & Transportation:</p>
                    <ul>
                        <li>If we <strong>leave</strong> early, we <strong>will avoid</strong> traffic.</li>
                        <li>If you <strong>take</strong> the highway, it <strong>will be</strong> faster.</li>
                        <li>If the train <strong>is</strong> late, I <strong>will text</strong> you.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "First conditional uses will + verb in the result clause (not present simple). This shows it's a FUTURE plan or possibility, not something that always happens.",
            },
            exercises: [
                {
                    id: "first-conditional-1",
                    title: "Practice: Build First Conditional Sentences",
                    instructions: "Complete each first conditional sentence with will + base verb.",
                    items: [
                        {
                            type: "select",
                            label: "If it rains tomorrow, I _____ home.",
                            options: ["stay", "will stay", "stayed", "am staying"],
                            expectedAnswer: "will stay",
                        },
                        {
                            type: "text",
                            label: "If you study hard, you _____ (will pass) the test.",
                            expectedAnswer: "will pass",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct first conditional:",
                            options: [
                                { value: "a", label: "If I have time, I will call you." },
                                { value: "b", label: "If I have time, I call you." },
                                { value: "c", label: "If I will have time, I will call you." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "first-conditional-2",
                    title: "Practice: Future Plans",
                    instructions: "Complete the sentences about future scenarios.",
                    items: [
                        {
                            type: "text",
                            label: "If the weather is nice, we _____ (will go) to the beach.",
                            expectedAnswer: "will go",
                        },
                        {
                            type: "select",
                            label: "If I save $50 a month, I _____ $600 by December.",
                            options: ["have", "will have", "had", "having"],
                            expectedAnswer: "will have",
                        },
                    ],
                },
            ],
        },

        {
            id: "modal-variations",
            stepNumber: 3,
            title: "Using Other Modals (Not Just 'Will')",
            icon: "🔧",
            explanation: `
                <h3>You Can Use Other Modals Instead of "Will"</h3>
                <p>While "will" is most common in first conditional, you can also use can, may, might, should, or imperatives in the result clause to express different meanings.</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Can (ability/possibility):</h4>
                    <ul>
                        <li>If you finish early, <strong>you can go</strong> home.</li>
                        <li>If I practice every day, <strong>I can improve</strong> my English.</li>
                        <li>If we leave now, <strong>we can catch</strong> the bus.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>May/Might (less certain):</h4>
                    <ul>
                        <li>If it rains, the party <strong>might be</strong> canceled. (less certain than "will")</li>
                        <li>If you ask nicely, she <strong>may lend</strong> you the book.</li>
                        <li>If we hurry, <strong>we might catch</strong> the train.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Should (advice/expectation):</h4>
                    <ul>
                        <li>If you feel sick, <strong>you should see</strong> a doctor.</li>
                        <li>If the package arrives, <strong>you should call</strong> me.</li>
                        <li>If it's too cold, <strong>we should stay</strong> inside.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Must (strong necessity):</h4>
                    <ul>
                        <li>If you want to drive, <strong>you must get</strong> a license.</li>
                        <li>If the fire alarm sounds, <strong>we must leave</strong> immediately.</li>
                        <li>If you borrow my book, <strong>you must return</strong> it next week.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Imperative (command/strong suggestion):</h4>
                    <ul>
                        <li>If you see a good deal, <strong>buy</strong> it!</li>
                        <li>If the light turns red, <strong>stop</strong>.</li>
                        <li>If you don't understand, <strong>ask</strong> questions.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "modals-1",
                    title: "Practice: Choose the Right Modal",
                    instructions: "Choose the best modal for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Complete: 'If I practice every day, I _____ speak English better.'",
                            options: [
                                { value: "b", label: "must speak (strong necessity)" },
                                { value: "a", label: "can speak (ability/possibility)" },
                                { value: "c", label: "speak (no modal needed)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If you feel sick, you _____ see a doctor.'",
                            options: [
                                { value: "b", label: "might see (uncertain)" },
                                { value: "c", label: "see (imperative)" },
                                { value: "a", label: "should see (advice)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If you see a good price, _____ it!'",
                            options: [
                                { value: "a", label: "buy (imperative - strong suggestion)" },
                                { value: "b", label: "you will buy" },
                                { value: "c", label: "you might buy" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 4,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using "will" in the IF clause</h3>
                <ul>
                    <li>❌ "If I <strong>will go</strong> to the store, I will buy milk." → ✅ "If I <strong>go</strong> to the store, I will buy milk."</li>
                    <li>❌ "If it <strong>will rain</strong>, I will bring an umbrella." → ✅ "If it <strong>rains</strong>, I will bring an umbrella."</li>
                </ul>

                <h3>Mistake #2: Forgetting the comma (when IF is first)</h3>
                <ul>
                    <li>❌ "If you heat water it boils." → ✅ "If you heat water<strong>,</strong> it boils."</li>
                    <li>❌ "If it rains I will stay home." → ✅ "If it rains<strong>,</strong> I will stay home."</li>
                </ul>

                <h3>Mistake #3: Confusing zero and first conditional</h3>
                <ul>
                    <li>❌ "If you mix flour and water, you <strong>will make</strong> dough." (This is always true - use zero!)</li>
                    <li>✅ "If you mix flour and water, you <strong>make</strong> dough." (Always true = zero conditional)</li>
                    <li>✅ "If you buy flour, we <strong>will make</strong> bread tonight." (Specific future = first conditional)</li>
                </ul>

                <h3>Mistake #4: Wrong tense in result clause</h3>
                <ul>
                    <li>❌ "If I go shopping, I <strong>bought</strong> milk." → ✅ "If I go shopping, I <strong>will buy</strong> milk."</li>
                    <li>❌ "If it rains, we <strong>stayed</strong> home." → ✅ "If it rains, we <strong>will stay</strong> home."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix Common Mistakes",
                    instructions: "Choose the correct sentence that fixes the mistake.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I will study hard, I will pass.'",
                            options: [
                                { value: "b", label: "If I will study hard, I pass." },
                                { value: "a", label: "If I study hard, I will pass." },
                                { value: "c", label: "If I studied hard, I will pass." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix the comma: 'If you heat ice it melts.'",
                            options: [
                                { value: "a", label: "If you heat ice, it melts." },
                                { value: "b", label: "It melts if you heat ice." },
                                { value: "c", label: "Both a and b are correct" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Which is correct for a science fact (always true)?",
                            options: [
                                { value: "b", label: "If you drop a ball, it will fall." },
                                { value: "a", label: "If you drop a ball, it falls." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "decision-flowchart",
            stepNumber: 5,
            title: "Decision Tool: Zero or First?",
            icon: "🎯",
            explanation: `
                <h3>How to Choose Between Zero and First Conditional</h3>
                <p>Ask yourself this question:</p>

                <div style="background: white; padding: 2rem; border-radius: 0.5rem; border: 2px solid rgba(244, 211, 94, 0.3); margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #f4d35e;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Is it a FACT, SCIENCE, or HABIT that's ALWAYS true?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>ZERO conditional</strong> (present + present)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If you heat water to 100°C, it boils." (Always happens)</p>
                    </div>

                    <p style="text-align: center; font-weight: bold; margin: 1rem 0;">↓ NO? Then ask...</p>

                    <div style="background: rgba(123, 168, 132, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Is it a REAL FUTURE PLAN or POSSIBILITY?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>FIRST conditional</strong> (present + will)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If it rains tomorrow, I will bring an umbrella." (Specific future plan)</p>
                    </div>
                </div>

                <h3>Quick Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(244, 211, 94, 0.15);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Situation</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Question</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Answer → Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Ice melting</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true fact?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Zero</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Going to the park tomorrow</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Future possibility?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → First</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Your coffee habit</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true habit?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Zero</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Calling a friend this weekend</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Future possibility?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → First</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "decision-1",
                    title: "Practice: Use the Decision Tool",
                    instructions: "Decide whether to use zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Scientific fact about water boiling:",
                            options: [
                                { value: "zero", label: "Zero (always true fact)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "Your plan to visit a friend next Saturday:",
                            options: [
                                { value: "zero", label: "Zero (always true rule)" },
                                { value: "first", label: "First (real future plan)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "Your habit of drinking tea in the morning:",
                            options: [
                                { value: "zero", label: "Zero (always happens - your habit)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
            ],
        },

        {
            id: "comparison",
            stepNumber: 6,
            title: "Zero vs First: Side-by-Side",
            icon: "🔄",
            explanation: `
                <h3>The Same Situation, Different Meanings</h3>
                <p>Sometimes you can use EITHER zero or first conditional for similar situations, but the meaning changes:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #ca8a04;">Zero (Always True Habit)</h4>
                        <p style="font-weight: bold;">"If I have free time, I read books."</p>
                        <p style="margin: 0;">Meaning: This is my general habit. Every time I have free time, I always do this.</p>
                    </div>
                    <div style="background: rgba(123, 168, 132, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884;">First (Your Specific Future Plan)</h4>
                        <p style="font-weight: bold;">"If I have free time this weekend, I will read a book."</p>
                        <p style="margin: 0;">Meaning: This is my specific plan for this weekend, not my general habit.</p>
                    </div>
                </div>

                <h3>More Everyday Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(244, 211, 94, 0.15);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Zero (Always True)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">First (Future Plan)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I'm tired, I go to bed early.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I'm tired tonight, I will go to bed early.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the weather is nice, we eat outside.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the weather is nice tomorrow, we will eat outside.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I save money, I feel happy.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I save $100 this month, I will buy a new phone.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat oil, it gets hot.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat the oil now, I will add the vegetables.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "comparison-1",
                    title: "Practice: Zero or First?",
                    instructions: "Choose which conditional is correct for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Your general habit: \"If I have money, I _____ it.\"",
                            options: [
                                { value: "will-save", label: "will save (First - specific future)" },
                                { value: "save", label: "save (Zero - my habit)" },
                            ],
                            expectedAnswer: "save",
                        },
                        {
                            type: "radio",
                            label: "Tomorrow's plan: \"If it rains tomorrow, I _____ home.\"",
                            options: [
                                { value: "will-stay", label: "will stay (First - tomorrow's plan)" },
                                { value: "stay", label: "stay (Zero - always true)" },
                            ],
                            expectedAnswer: "will-stay",
                        },
                        {
                            type: "radio",
                            label: "Science fact: \"If you mix blue and yellow, you _____ green.\"",
                            options: [
                                { value: "will-get", label: "will get (First - future possibility)" },
                                { value: "get", label: "get (Zero - always true fact)" },
                            ],
                            expectedAnswer: "get",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Summary: Key Points to Remember",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Zero Conditional:</strong> For things that are <strong>always true</strong> (facts, habits, natural laws)</li>
                    <li><strong>Zero Formula:</strong> if + present, present (both clauses use present simple)</li>
                    <li><strong>First Conditional:</strong> For <strong>real future possibilities</strong> (plans, predictions, promises)</li>
                    <li><strong>First Formula:</strong> if + present, will + base verb</li>
                    <li><strong>Never use "will" in the IF clause!</strong> ❌ "If I will go..." → ✅ "If I go..."</li>
                    <li><strong>Use a comma</strong> when the IF clause comes first: "If it rains, I will stay home."</li>
                    <li><strong>Modal variations in First Conditional:</strong> can, may, might, should, must, or imperative (not just will)</li>
                    <li><strong>Decision tip:</strong> Ask yourself: "Is it always true (zero) or a future plan (first)?"</li>
                </ul>

                <h3 style="margin-top: 2rem;">Quick Reference Table</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(244, 211, 94, 0.15);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);"></th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Zero Conditional</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">First Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Use for</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true facts, habits</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future possibilities</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Formula</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + present, present</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + present, will + verb</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Example</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat ice, it melts.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If it rains, I will stay home.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Any time (general truth)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Specific future time</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Final Reminder",
                content: "Ask yourself: 'Is it ALWAYS true (zero) or a FUTURE possibility (first)?' This one question will help you choose the right conditional every time!",
            },
            exercises: [
                {
                    id: "summary-practice",
                    title: "Final Practice: Build Your Own Sentences",
                    instructions: "Choose the correct conditional for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Science: When water reaches 0°C, it _____.",
                            options: [
                                { value: "freezes", label: "freezes (Zero - always true)" },
                                { value: "will-freeze", label: "will freeze (First - future)" },
                            ],
                            expectedAnswer: "freezes",
                        },
                        {
                            type: "radio",
                            label: "Plan: If I see John tomorrow, I _____ him about the party.",
                            options: [
                                { value: "tell", label: "tell (Zero)" },
                                { value: "will-tell", label: "will tell (First - tomorrow's plan)" },
                            ],
                            expectedAnswer: "will-tell",
                        },
                        {
                            type: "radio",
                            label: "Habit: If I drink coffee late, I _____ sleep well.",
                            options: [
                                { value: "dont-sleep", label: "don't sleep (Zero - my habit)" },
                                { value: "wont-sleep", label: "won't sleep (First)" },
                            ],
                            expectedAnswer: "dont-sleep",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "When do we use zero conditional?",
            options: [
                { value: "a", label: "For future plans and possibilities" },
                { value: "b", label: "For facts, habits, and things that are always true" },
                { value: "c", label: "For impossible or unreal situations" },
            ],
            correctAnswer: "b",
            explanation:
                "Zero conditional is used for things that are always true: science facts (If you heat water, it boils), habits (If I'm tired, I sleep), and general truths.",
            skillTag: "use-zero-conditional-facts-habits-truths",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "What is the formula for first conditional?",
            options: [
                { value: "a", label: "if + present, present" },
                { value: "c", label: "if + past, would + verb" },
                { value: "b", label: "if + present, will + verb" },
            ],
            correctAnswer: "b",
            explanation:
                "First conditional uses 'if + present simple, will + base verb' for real future possibilities.",
            skillTag: "form-first-conditional-structure",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which sentence is correct for first conditional?",
            options: [
                { value: "b", label: "If it rains, I will bring an umbrella." },
                { value: "a", label: "If it will rain, I will bring an umbrella." },
                { value: "c", label: "If it rain, I will bring an umbrella." },
            ],
            correctAnswer: "b",
            explanation:
                "Never use 'will' in the IF clause. Use present simple in the IF clause and 'will + verb' in the result clause.",
            skillTag: "error-will-in-if-clause-first-conditional",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which is an example of zero conditional?",
            options: [
                { value: "b", label: "If you heat ice, it will melt." },
                { value: "a", label: "If you heat ice, it melts." },
                { value: "c", label: "If you heated ice, it would melt." },
            ],
            correctAnswer: "a",
            explanation:
                "Zero conditional uses present simple in both clauses for facts that are always true. Ice always melts when you heat it.",
            skillTag: "form-zero-conditional-structure",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Can you use other modals instead of 'will' in first conditional?",
            options: [
                { value: "a", label: "No, you must always use 'will'" },
                { value: "c", label: "Only 'can' and 'may' are allowed" },
                { value: "b", label: "Yes, you can use can, may, might, should, must, or imperatives" },
            ],
            correctAnswer: "b",
            explanation:
                "Yes. You can use can (ability), may/might (possibility), should (advice), must (necessity), or even imperatives instead of 'will'.",
            skillTag: "modal-variations-first-conditional",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question: "Where does the comma go when the IF clause comes first? 'If you study hard _____ you will pass the test.'",
            options: [
                { value: "a", label: "After 'hard' (If you study hard, you will pass the test.)" },
                { value: "b", label: "After 'will' (If you study hard you will, pass the test.)" },
                { value: "c", label: "No comma needed" },
            ],
            correctAnswer: "a",
            explanation:
                "When the IF clause comes first, put a comma after it, before the result clause.",
            skillTag: "comma-after-if-clause-zero-first",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "What's the difference between 'If I'm tired, I sleep' and 'If I'm tired tonight, I will sleep early'?",
            options: [
                { value: "a", label: "No difference, they mean the same thing" },
                { value: "b", label: "First is a general habit (zero), second is a specific future plan (first)" },
                { value: "c", label: "First is wrong, second is correct" },
            ],
            correctAnswer: "b",
            explanation:
                "The first sentence (zero conditional) describes a general habit that is always true. The second (first conditional) is about a specific plan for tonight.",
            skillTag: "contrast-zero-vs-first-habit-vs-plan",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "Choose the best sentence for a future plan: tomorrow's weather.",
            options: [
                { value: "a", label: "If it rains tomorrow, we stay home." },
                { value: "c", label: "If it rains, we stay home, always." },
                { value: "b", label: "If it rains tomorrow, we will stay home." },
            ],
            correctAnswer: "b",
            explanation:
                "With 'tomorrow' (a specific future time), we use first conditional: If it rains tomorrow, we will stay home. Sentence C could describe a general habit but does not mention the specific future time.",
            skillTag: "contrast-zero-vs-first-with-time-expression",
            difficulty: "medium",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – Zero & First Conditionals Mini Quiz

    This mini quiz checks whether students can:
    - Decide when to use zero vs first conditional (habit/fact vs future plan).
    - Use the correct structures (form) for each type.
    - Avoid the most common zero/first conditional errors.
    - Understand how modals (can/may/might/should/must) change meaning.
    - Use commas correctly when the IF clause comes first.

    Skill tags:

    Use & meaning:
    - use-zero-conditional-facts-habits-truths
    - contrast-zero-vs-first-habit-vs-plan
    - contrast-zero-vs-first-with-time-expression

    Form:
    - form-first-conditional-structure
    - form-zero-conditional-structure

    Modal variations:
    - modal-variations-first-conditional

    Common error patterns:
    - error-will-in-if-clause-first-conditional
    - comma-after-if-clause-zero-first

    How to read the diagnostics:
    - If zero-conditional use tags are weak → Revisit the idea that zero is for facts, habits, and things that are always true. Use your science/habit examples (If you heat ice, it melts / If I'm tired, I drink coffee).
    - If first-conditional form tags are weak → Go back to the formula strip: IF + present / WILL + base verb. Have students build sentence halves and match IF clauses to result clauses.
    - If 'will in IF clause' error tags appear → Do a quick error-hunt using wrong sentences (If it will rain, I will...) and fix them to If it rains, I will....
    - If modal-variation tags are weak → Contrast would vs can vs may/might vs should in short conditional sentences and ask: Is this a plan, a possibility, advice, or a rule?
    - If comma-after-if-clause tags are weak → Have students add commas in a short paragraph where all commas are missing, focusing only on sentences where IF comes first.
    - If contrast-zero-vs-first tags are weak → Use pairs like: If I'm tired, I sleep (habit) vs If I'm tired tonight, I will sleep early (plan), and If it rains, we stay home (habit) vs If it rains tomorrow, we will stay home (this weekend's plan).

    Suggested use:
    - Use this mini quiz after students have practiced both zero and first conditionals in context.
    - If many students miss both zero and first conditional questions, teach them separately again (one day only facts/habits, another day only future plans with will and other modals).
    */
};
