import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsSecondThirdContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Second & Third Conditionals: The Dream & Time Machine",
            icon: "💭",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #a855f7; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">These conditionals are for <strong style="color: #a855f7;">IMAGINARY situations</strong>. <strong>Second conditional</strong> is your dream machine for present/future wishes that probably won't happen. <strong>Third conditional</strong> is your time machine for past regrets and "what if" moments.</p>
                </div>

                <h3>The Two Types</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">Second Conditional</h4>
                        <p><strong>Present/Future dreams & wishes</strong></p>
                        <p style="font-weight: bold; color: #a855f7;">If + past, would + verb</p>
                        <p style="margin: 0;">"If I won the lottery, I would travel the world."</p>
                    </div>
                    <div style="background: rgba(14, 165, 233, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
                        <h4 style="color: #0ea5e9; margin-top: 0;">Third Conditional</h4>
                        <p><strong>Past regrets & reflections</strong></p>
                        <p style="font-weight: bold; color: #0ea5e9;">If + past perfect, would have + verb</p>
                        <p style="margin: 0;">"If I had studied harder, I would have passed the test."</p>
                    </div>
                </div>

                <div style="background: rgba(168, 85, 247, 0.1); border-left: 4px solid #a855f7; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #a855f7; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In daily life:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Talking about dreams and wishes (second conditional)</li>
                        <li>Giving advice to friends (second conditional: "If I were you...")</li>
                        <li>Expressing regrets about the past (third conditional)</li>
                        <li>Learning from mistakes and "what if" moments (third conditional)</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Second = imagining & dreaming. Third = reflecting & learning!</p>
                </div>
            `,
            exercises: [
                {
                    id: "intro-1",
                    title: "Practice: Second vs Third - Can You Tell?",
                    instructions: "Is each sentence about an imaginary present/future (second) or reflecting on the past (third)?",
                    items: [
                        {
                            type: "radio",
                            label: '"If I won the lottery, I would buy a house."',
                            options: [
                                { value: "second", label: "Second - imaginary present/future dream" },
                                { value: "third", label: "Third - reflecting on the past" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: '"If I had known about the test, I would have studied."',
                            options: [
                                { value: "second", label: "Second - giving advice" },
                                { value: "third", label: "Third - reflecting on a past mistake" },
                            ],
                            expectedAnswer: "third",
                        },
                        {
                            type: "radio",
                            label: '"If I spoke Chinese, I would move to Beijing."',
                            options: [
                                { value: "second", label: "Second - hypothetical present/future situation" },
                                { value: "third", label: "Third - past regret" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "second-conditional-structure",
            stepNumber: 1,
            title: "Second Conditional: Dreams, Wishes & Hypotheticals",
            icon: "🌟",
            explanation: `
                <h3>What Is Second Conditional?</h3>
                <p>Second conditional is for <strong>unreal or unlikely situations</strong> in the present or future:</p>
                <ul>
                    <li><strong>Dreams & wishes:</strong> "If I had a million dollars, I would travel the world."</li>
                    <li><strong>Unlikely scenarios:</strong> "If I lived in Paris..." (but I don't)</li>
                    <li><strong>Imaginary situations:</strong> "If I were the president..." (I'm not)</li>
                    <li><strong>Giving advice:</strong> "If I were you, I would apologize."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border: 2px solid #a855f7;">
                    <h4 style="color: #a855f7;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #a855f7; text-align: center; margin: 1rem 0;">If + past simple, would + base verb</p>
                    <p style="text-align: center; font-style: italic;">(past form BUT present/future meaning!)</p>
                </div>

                <h3>Everyday Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Dreams & Wishes:</p>
                    <ul>
                        <li>If I <strong>won</strong> the lottery, I <strong>would buy</strong> a house.</li>
                        <li>If I <strong>had</strong> more time, I <strong>would learn</strong> to play guitar.</li>
                        <li>If we <strong>lived</strong> near the beach, we <strong>would swim</strong> every day.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Unlikely scenarios:</p>
                    <ul>
                        <li>If I <strong>spoke</strong> perfect English, I <strong>would feel</strong> more confident.</li>
                        <li>If the rent <strong>were</strong> cheaper, I <strong>would get</strong> a bigger apartment.</li>
                        <li>If I <strong>knew</strong> how to cook, I <strong>would save</strong> money.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Imaginary situations:</p>
                    <ul>
                        <li>If I <strong>were</strong> taller, I <strong>could reach</strong> the top shelf.</li>
                        <li>If I <strong>lived</strong> in Paris, I <strong>would visit</strong> the Eiffel Tower every weekend.</li>
                        <li>If we <strong>had</strong> a car, we <strong>would drive</strong> to the mountains.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Past simple in the IF clause doesn't mean past time! It shows the situation is UNREAL or UNLIKELY right now or in the future. Would shows what WOULD happen (but probably won't).",
            },
            exercises: [
                {
                    id: "second-structure-1",
                    title: "Practice: Build Second Conditional Sentences",
                    instructions: "Complete each second conditional sentence.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (have) more money, I would travel more.",
                            expectedAnswer: "had",
                        },
                        {
                            type: "select",
                            label: "If I lived near the beach, I _____ every day.",
                            options: ["swim", "will swim", "would swim", "swam"],
                            expectedAnswer: "would swim",
                        },
                        {
                            type: "radio",
                            label: "Which is correct second conditional?",
                            options: [
                                { value: "b", label: "If I speak Spanish, I will move to Spain." },
                                { value: "a", label: "If I spoke Spanish, I would move to Spain." },
                                { value: "c", label: "If I would speak Spanish, I would move to Spain." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "if-i-were-you",
            stepNumber: 2,
            title: "Special Form: 'If I Were You' - Giving Advice",
            icon: "💡",
            explanation: `
                <h3>Using "Were" for All Subjects</h3>
                <p>In second conditional with the verb "to be", we use <strong>WERE for all subjects</strong> (not "was"):</p>

                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>Correct Form (Use This)</h4>
                    <ul>
                        <li>If I <strong>were</strong> you, I would apologize.</li>
                        <li>If she <strong>were</strong> taller, she could reach the shelf.</li>
                        <li>If he <strong>were</strong> here, he would help us.</li>
                        <li>If it <strong>were</strong> warmer, we could go swimming.</li>
                    </ul>
                </div>

                <h3>Common Advice Patterns with "If I Were You"</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Giving friendly advice:</p>
                    <ul>
                        <li>If I were you, I <strong>would call</strong> the doctor.</li>
                        <li>If I were you, I <strong>would apologize</strong> to your friend.</li>
                        <li>If I were you, I <strong>would save</strong> some money each month.</li>
                        <li>If I were you, I <strong>would talk</strong> to your landlord about the problem.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Problem-solving:</p>
                    <ul>
                        <li>If I were you, I <strong>would try</strong> calling again.</li>
                        <li>If I were you, I <strong>would check</strong> the instructions carefully.</li>
                        <li>If I were you, I <strong>would ask</strong> someone for help.</li>
                        <li>If I were you, I <strong>wouldn't worry</strong> about it.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Making suggestions:</p>
                    <ul>
                        <li>If I were you, I <strong>would take</strong> that English class.</li>
                        <li>If I were you, I <strong>would visit</strong> the museum this weekend.</li>
                        <li>If I were you, I <strong>would try</strong> the new restaurant downtown.</li>
                        <li>If I were you, I <strong>would go</strong> for a walk - it's beautiful outside!</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Always use 'were' (not 'was') for all subjects in second conditional: 'If I were you', 'If he were here', 'If she were taller'. This is standard English.",
            },
            exercises: [
                {
                    id: "if-i-were-1",
                    title: "Practice: Giving Advice with 'If I Were You'",
                    instructions: "Complete each advice sentence correctly.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "If I were you, I would see a doctor." },
                                { value: "b", label: "If I was you, I would see a doctor." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "If I _____ (be) taller, I could play basketball.",
                            expectedAnswer: "were",
                        },
                        {
                            type: "select",
                            label: "If she _____ more confident, she would speak in public.",
                            options: ["is", "was", "were", "would be"],
                            expectedAnswer: "were",
                        },
                    ],
                },
            ],
        },

        {
            id: "third-conditional-structure",
            stepNumber: 3,
            title: "Third Conditional: Past Regrets & Reflections",
            icon: "🔙",
            explanation: `
                <h3>What Is Third Conditional?</h3>
                <p>Third conditional is for <strong>reflecting on the past</strong> - things that didn't happen and their imagined results:</p>
                <ul>
                    <li><strong>Past mistakes:</strong> "If I had studied harder, I would have passed the test."</li>
                    <li><strong>Missed opportunities:</strong> "If I had gone to the party, I would have met her."</li>
                    <li><strong>Regrets:</strong> "If I had saved money, I would have been able to buy a car."</li>
                    <li><strong>Different outcomes:</strong> "If we had left earlier, we wouldn't have missed the train."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(14, 165, 233, 0.1); border-radius: 0.5rem; border: 2px solid #0ea5e9;">
                    <h4 style="color: #0ea5e9;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #0ea5e9; text-align: center; margin: 1rem 0;">If + past perfect, would have + past participle</p>
                    <p style="text-align: center; font-style: italic;">(Both parts refer to the past!)</p>
                </div>

                <h3>Breaking It Down</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #0ea5e9;">IF clause (use past perfect):</p>
                    <ul>
                        <li>If I <strong>had studied</strong> harder</li>
                        <li>If she <strong>had known</strong> about the party</li>
                        <li>If we <strong>had left</strong> earlier</li>
                        <li>If they <strong>had called</strong> me</li>
                    </ul>
                    <p style="font-style: italic; margin-top: 0.5rem;">Formula: had + past participle</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #a855f7;">WOULD HAVE clause (result):</p>
                    <ul>
                        <li>I <strong>would have passed</strong> the test</li>
                        <li>she <strong>would have come</strong></li>
                        <li>we <strong>wouldn't have missed</strong> the train</li>
                        <li>I <strong>would have answered</strong></li>
                    </ul>
                    <p style="font-style: italic; margin-top: 0.5rem;">Formula: would have + past participle</p>
                </div>

                <h3>Complete Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">School & Learning:</p>
                    <ul>
                        <li>If I <strong>had studied</strong> harder, I <strong>would have passed</strong> the exam.</li>
                        <li>If she <strong>had practiced</strong> more, she <strong>would have improved</strong> faster.</li>
                        <li>If we <strong>had known</strong> about the quiz, we <strong>would have prepared</strong>.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Daily Life:</p>
                    <ul>
                        <li>If I <strong>had set</strong> an alarm, I <strong>wouldn't have overslept</strong>.</li>
                        <li>If we <strong>had checked</strong> the weather, we <strong>would have brought</strong> umbrellas.</li>
                        <li>If I <strong>had known</strong> you were coming, I <strong>would have cooked</strong> dinner.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Relationships & Social:</p>
                    <ul>
                        <li>If I <strong>had gone</strong> to the party, I <strong>would have met</strong> her.</li>
                        <li>If he <strong>had told</strong> me the truth, I <strong>wouldn't have been</strong> angry.</li>
                        <li>If they <strong>had invited</strong> us, we <strong>would have attended</strong>.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Third conditional is ONLY about the past. The situation already happened (or didn't happen), and you're imagining how it could have been different.",
            },
            exercises: [
                {
                    id: "third-structure-1",
                    title: "Practice: Build Third Conditional Sentences",
                    instructions: "Complete each third conditional sentence about past situations.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (study) harder, I would have passed the test.",
                            expectedAnswer: "had studied",
                        },
                        {
                            type: "select",
                            label: "If we had left earlier, we _____ the train.",
                            options: ["catch", "caught", "would catch", "would have caught"],
                            expectedAnswer: "would have caught",
                        },
                        {
                            type: "radio",
                            label: "Which is correct third conditional?",
                            options: [
                                { value: "a", label: "If I had known, I would have called you." },
                                { value: "b", label: "If I knew, I would have called you." },
                                { value: "c", label: "If I had known, I would call you." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "modal-variations",
            stepNumber: 4,
            title: "Modal Variations: Could, Might Instead of Would",
            icon: "🔧",
            explanation: `
                <h3>You Can Use Other Modals</h3>
                <p>Instead of "would", you can use <strong>could</strong> (ability/possibility) or <strong>might</strong> (less certain) in both conditionals:</p>

                <h4>Second Conditional with Could/Might</h4>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <ul>
                        <li>If I won the lottery, I <strong>could buy</strong> a house. (ability/possibility)</li>
                        <li>If I had more time, I <strong>might learn</strong> guitar. (less certain than "would")</li>
                        <li>If we lived near the beach, we <strong>could swim</strong> every day.</li>
                    </ul>
                </div>

                <h4>Third Conditional with Could Have/Might Have</h4>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <ul>
                        <li>If I had studied harder, I <strong>could have passed</strong>. (it was possible)</li>
                        <li>If we had left earlier, we <strong>might have caught</strong> the train. (maybe, less certain)</li>
                        <li>If she had known, she <strong>could have helped</strong> us.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 When to Use Which",
                content: "Would = most likely result. Could = ability/possibility. Might = less certain, maybe it would have happened."
            },
            exercises: [
                {
                    id: "modals-1",
                    title: "Practice: Choose the Right Modal",
                    instructions: "Choose the best modal for each situation.",
                    items: [
                        {
                            type: "radio",
                            label: "If I had more money, I _____ travel more. (ability/possibility)",
                            options: [
                                { value: "could", label: "could travel (ability)" },
                                { value: "would", label: "would travel" },
                            ],
                            expectedAnswer: "could",
                        },
                        {
                            type: "radio",
                            label: "If I had known about the party, I _____ gone. (less certain)",
                            options: [
                                { value: "would-have", label: "would have gone" },
                                { value: "might-have", label: "might have gone (less certain)" },
                            ],
                            expectedAnswer: "might-have",
                        },
                    ],
                },
            ],
        },

        {
            id: "all-four-conditionals",
            stepNumber: 5,
            title: "All Four Conditionals: Complete Comparison",
            icon: "🔄",
            explanation: `
                <h3>Comparing All Four Types</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(168, 85, 247, 0.15);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Type</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Use</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Formula</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Zero</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true facts</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + present, present</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you heat water, it boils.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future possibility</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + present, will + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If it rains, I will stay home.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #a855f7;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal present/future</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + past, would + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I won the lottery, I would travel.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: #0ea5e9;">Third</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Unreal past</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">if + past perfect, would have + verb</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had studied, I would have passed.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "all-four-1",
                    title: "Practice: Choose the Right Conditional",
                    instructions: "Identify which conditional type each sentence uses.",
                    items: [
                        {
                            type: "radio",
                            label: '"If you heat ice, it melts."',
                            options: [
                                { value: "first", label: "First (real future)" },
                                { value: "zero", label: "Zero (always true)" },
                                { value: "second", label: "Second (unreal present)" },
                                { value: "third", label: "Third (unreal past)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If I had more time, I would exercise every day."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second (unreal present - I don't have time)" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: '"If I had known about the meeting, I would have attended."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third (past regret - I didn't know)" },
                            ],
                            expectedAnswer: "third",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 6,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using "would" in the IF clause</h3>
                <ul>
                    <li>❌ "If I <strong>would have</strong> more money, I would travel." → ✅ "If I <strong>had</strong> more money, I would travel."</li>
                    <li>❌ "If I <strong>would have known</strong>, I would have called." → ✅ "If I <strong>had known</strong>, I would have called."</li>
                </ul>

                <h3>Mistake #2: Mixing up second and third conditional</h3>
                <ul>
                    <li>❌ "If I had more time, I would have studied." (mixing tenses!)</li>
                    <li>✅ "If I had more time, I would study." (second - present/future hypothetical)</li>
                    <li>✅ "If I had had more time, I would have studied." (third - past regret)</li>
                </ul>

                <h3>Mistake #3: Using "was" instead of "were"</h3>
                <ul>
                    <li>❌ "If I <strong>was</strong> you, I would apologize."</li>
                    <li>✅ "If I <strong>were</strong> you, I would apologize."</li>
                </ul>

                <h3>Mistake #4: Forgetting "have" in third conditional</h3>
                <ul>
                    <li>❌ "If I had studied, I would passed." (missing "have"!)</li>
                    <li>✅ "If I had studied, I <strong>would have passed</strong>."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix Common Mistakes",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I would have more money, I would buy a car.'",
                            options: [
                                { value: "a", label: "If I had more money, I would buy a car." },
                                { value: "b", label: "If I would have more money, I will buy a car." },
                                { value: "c", label: "If I have more money, I would buy a car." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'If I was you, I would study harder.'",
                            options: [
                                { value: "a", label: "If I were you, I would study harder." },
                                { value: "b", label: "If I am you, I would study harder." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'If I had known, I would called you.'",
                            options: [
                                { value: "b", label: "If I knew, I would have called you." },
                                { value: "a", label: "If I had known, I would have called you." },
                            ],
                            expectedAnswer: "a",
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
                    <li><strong>Second Conditional:</strong> For unreal or unlikely present/future situations</li>
                    <li><strong>Second Formula:</strong> if + past simple, would + base verb</li>
                    <li><strong>Third Conditional:</strong> For reflecting on the past and imagining different outcomes</li>
                    <li><strong>Third Formula:</strong> if + past perfect, would have + past participle</li>
                    <li><strong>Always use "were"</strong> (not "was") in second conditional: "If I were you"</li>
                    <li><strong>Never use "would" in the IF clause!</strong></li>
                    <li><strong>Modal variations:</strong> could, might instead of would for different meanings</li>
                    <li><strong>All four conditionals:</strong> Zero (always true), First (real future), Second (unreal present), Third (unreal past)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Final Reminder",
                content: "Second = dreams and advice (If I won the lottery..., If I were you...). Third = past regrets (If I had studied harder...). Never mix them up!"
            },
        },

        {
            id: "career-advice-context",
            stepNumber: 9,
            title: "💼 Career Advice & Job Interviews (Supplementary)",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #a855f7;">💼 Real-World Application: Career & Professional Context</h3>
                    <p>Second and third conditionals are ESSENTIAL for professional communication. "If I were you" is THE pattern for giving career advice, and third conditional helps you learn from workplace experiences.</p>
                </div>

                <h3>Second Conditional in Job Interviews & Career Advice</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Interview Preparation Advice:</p>
                    <ul>
                        <li>If I were you, I <strong>would research</strong> the company before the interview.</li>
                        <li>If I were you, I <strong>would prepare</strong> questions to ask the interviewer.</li>
                        <li>If I were you, I <strong>would practice</strong> answering common interview questions.</li>
                        <li>If I were you, I <strong>would arrive</strong> 10 minutes early.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Career Growth Advice:</p>
                    <ul>
                        <li>If I were you, I <strong>would ask</strong> for a reference letter before leaving your job.</li>
                        <li>If I were you, I <strong>would negotiate</strong> the salary - you deserve it!</li>
                        <li>If I were you, I <strong>would take</strong> that certification course.</li>
                        <li>If I were you, I <strong>would apply</strong> - you're qualified!</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Hypothetical Job Scenarios:</p>
                    <ul>
                        <li>If I <strong>spoke</strong> Spanish fluently, I <strong>would apply</strong> for that translator position.</li>
                        <li>If the company <strong>offered</strong> remote work, I <strong>would save</strong> commute time.</li>
                        <li>If I <strong>had</strong> better computer skills, I <strong>would get</strong> an office job.</li>
                        <li>If I <strong>were</strong> the manager, I <strong>would improve</strong> the training program.</li>
                    </ul>
                </div>

                <h3 style="margin-top: 2rem;">Third Conditional: Learning from Work Experiences</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Reflecting on Past Interviews:</p>
                    <ul>
                        <li>If I <strong>had researched</strong> the company better, I <strong>would have asked</strong> better questions.</li>
                        <li>If I <strong>had practiced</strong> my answers, I <strong>would have felt</strong> more confident.</li>
                        <li>If I <strong>had asked</strong> about the salary earlier, I <strong>would have known</strong> if it was a good fit.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Learning from Workplace Mistakes:</p>
                    <ul>
                        <li>If I <strong>had asked</strong> for help earlier, I <strong>wouldn't have made</strong> that error.</li>
                        <li>If I <strong>had read</strong> the email carefully, I <strong>would have understood</strong> the instructions.</li>
                        <li>If I <strong>had checked</strong> my work, I <strong>would have caught</strong> the mistake.</li>
                        <li>If they <strong>had trained</strong> me properly, I <strong>would have known</strong> the procedure.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Career Decisions & Reflection:</p>
                    <ul>
                        <li>If I <strong>had asked</strong> about the benefits earlier, I <strong>would have known</strong> about the 401k.</li>
                        <li>If I <strong>had negotiated</strong> the salary, I <strong>would have earned</strong> more.</li>
                        <li>If I <strong>had taken</strong> that job, I <strong>would have moved</strong> to Boston.</li>
                        <li>If I <strong>had gotten</strong> that certification, I <strong>could have been</strong> promoted.</li>
                    </ul>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #f4d35e; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #ca8a04;">💡 Interview Success Tips</h4>
                    <p style="margin-bottom: 0.5rem;"><strong>Use second conditional to show professionalism:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>"If I got this position, I would bring strong communication skills."</li>
                        <li>"If I were part of your team, I would contribute my technical experience."</li>
                        <li>"If given the opportunity, I would be eager to learn from your experienced staff."</li>
                    </ul>
                </div>

                <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #0ea5e9;">💬 Speaking Practice: Career Scenarios</h4>
                    <p style="margin-bottom: 0.75rem; font-weight: 600;">Practice using these prompts:</p>
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li style="margin-bottom: 0.5rem;">"Give advice to someone preparing for a job interview using 'If I were you...'"</li>
                        <li style="margin-bottom: 0.5rem;">"Reflect on a past job interview. What would you have done differently? (Use third conditional)"</li>
                        <li style="margin-bottom: 0.5rem;">"Talk about a dream job. What would you do if you got it? (Use second conditional)"</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "career-practice-1",
                    title: "Practice: Career Advice & Reflection",
                    instructions: "Complete these professional context sentences.",
                    items: [
                        {
                            type: "text",
                            label: "If I were you, I _____ (negotiate) the salary offer.",
                            expectedAnswer: "would negotiate",
                        },
                        {
                            type: "text",
                            label: "If I _____ (research) the company better, I would have asked better questions in the interview.",
                            expectedAnswer: "had researched",
                        },
                        {
                            type: "select",
                            label: "If I spoke Spanish fluently, I _____ for that translator position.",
                            options: ["apply", "will apply", "would apply", "would have applied"],
                            expectedAnswer: "would apply",
                        },
                        {
                            type: "select",
                            label: "If I had asked about benefits earlier, I _____ about the 401k.",
                            options: ["know", "knew", "would know", "would have known"],
                            expectedAnswer: "would have known",
                        },
                    ],
                },
            ],
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "When do we use second conditional?",
            options: [
                { value: "b", label: "For unreal or unlikely present/future situations" },
                { value: "a", label: "For real future possibilities" },
                { value: "c", label: "For reflecting on the past" },
            ],
            correctAnswer: "b",
            explanation:
                "Second conditional is for unreal or unlikely situations in the present or future: dreams, wishes, hypotheticals, and advice (If I won the lottery..., If I were you...).",
            skillTag: "use-second-conditional-unreal-present-future",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "What is the formula for third conditional?",
            options: [
                { value: "a", label: "if + past, would + verb" },
                { value: "b", label: "if + past perfect, would have + past participle" },
                { value: "c", label: "if + present, will + verb" },
            ],
            correctAnswer: "b",
            explanation:
                "Third conditional uses 'if + past perfect' and 'would have + past participle' to talk about unreal past situations and their imagined results.",
            skillTag: "form-third-conditional-structure",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which is correct for giving advice?",
            options: [
                { value: "a", label: "If I was you, I would study harder." },
                { value: "c", label: "If I am you, I would study harder." },
                { value: "b", label: "If I were you, I would study harder." },
            ],
            correctAnswer: "b",
            explanation:
                "In second conditional with 'be', we usually use 'were' for all subjects: If I were you, If he were here, If she were taller.",
            skillTag: "form-second-conditional-were-not-was",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which sentence is third conditional (past reflection)?",
            options: [
                { value: "b", label: "If I had had more money, I would have traveled." },
                { value: "a", label: "If I had more money, I would travel." },
                { value: "c", label: "If I have more money, I will travel." },
            ],
            correctAnswer: "b",
            explanation:
                "Third conditional = if + past perfect (had had), would have + past participle (would have traveled). It is about an unreal past and its imagined result.",
            skillTag: "tense-id-third-conditional",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "Can you use 'could' or 'might' instead of 'would' in conditionals?",
            options: [
                { value: "a", label: "No, you must always use 'would'" },
                { value: "b", label: "Yes, 'could' shows ability/possibility, 'might' shows less certainty" },
                { value: "c", label: "Only in third conditional" },
            ],
            correctAnswer: "b",
            explanation:
                "Yes. In second and third conditionals, 'could' shows ability/possibility and 'might' shows a less certain, maybe result.",
            skillTag: "modal-variations-second-third-conditionals",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question: "Which is the correct second conditional?",
            options: [
                { value: "a", label: "If I would have more time, I would exercise." },
                { value: "c", label: "If I have more time, I would exercise." },
                { value: "b", label: "If I had more time, I would exercise." },
            ],
            correctAnswer: "b",
            explanation:
                "Never use 'would' in the IF clause. Second conditional = if + past simple, would + base verb.",
            skillTag: "error-would-in-if-clause-second",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "What's wrong with this sentence? 'If I had studied, I would passed.'",
            options: [
                { value: "b", label: "Missing 'have' - it should be 'would have passed'" },
                { value: "a", label: "Nothing, it's correct" },
                { value: "c", label: "Should use 'will' instead of 'would'" },
            ],
            correctAnswer: "b",
            explanation:
                "Third conditional result clauses need 'would have + past participle': If I had studied, I would have passed.",
            skillTag: "error-missing-have-third-conditional",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "Which conditional is this? 'If it rains tomorrow, I will stay home.'",
            options: [
                { value: "b", label: "Second conditional (unreal present/future)" },
                { value: "a", label: "First conditional (real future possibility)" },
                { value: "c", label: "Third conditional (unreal past)" },
            ],
            correctAnswer: "a",
            explanation:
                "This is FIRST conditional: real future possibility with 'if + present, will + verb'. Second would be 'If it rained, I would stay home' (unreal). Third would be 'If it had rained, I would have stayed home' (past reflection).",
            skillTag: "contrast-first-vs-second-vs-third-conditional",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Second & Third Conditionals Mini Quiz

    This mini quiz checks whether students can:
    - Distinguish when to use second vs third conditional.
    - Use the correct structures (form) for each type.
    - Avoid the most common conditional errors.
    - Recognize how modals (could/might) change meaning.
    - Tell the difference between first, second, and third conditional.

    Skill tags:

    Use & meaning:
    - use-second-conditional-unreal-present-future
    - tense-id-third-conditional
    - contrast-first-vs-second-vs-third-conditional

    Form:
    - form-third-conditional-structure
    - form-second-conditional-were-not-was

    Modal variations:
    - modal-variations-second-third-conditionals

    Common error patterns:
    - error-would-in-if-clause-second
    - error-missing-have-third-conditional

    How to read the diagnostics:
    - If second-conditional use tags are weak → Revisit the idea that second conditional is UNREAL or UNLIKELY now / in the future. Contrast real future (first: If it rains, I will…) with unreal (second: If it rained, I would…).
    - If third-conditional structure tags are weak → Go back to the formula strip: IF + had + past participle / WOULD HAVE + past participle. Build color-coded sentence halves and have students match beginnings and endings.
    - If 'were' form tags are weak → Drill "If I were you…" and a few other examples. Have students correct sentences with "If I was you" into "If I were you".
    - If modal-variation tags are weak → Show parallel sentences with would / could / might and ask: Is this certain, possible, or less certain? (would = likely, could = ability/possibility, might = maybe).
    - If 'would in IF clause' error tags appear → Do a quick error-hunt activity using wrong sentences (If I would have more time…) and fix them to If I had more time….
    - If 'missing have' error tags appear → Focus on the result clause only: would have + past participle. Practice swapping verbs into the frame: would have passed, would have called, would have helped.

    Suggested use:
    - Use this mini quiz after students have seen both second and third conditionals with examples.
    - If many students miss both second- and third-conditional questions, teach one at a time again (for example, review only second conditional with advice and dreams, then come back to third conditional with past regrets).
    */
};
