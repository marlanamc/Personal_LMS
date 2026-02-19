import type { InteractiveGuideContent } from "@/types/activity";

export const usedToWouldRatherContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Used To & Would Rather: Talking About Past Habits and Preferences",
            icon: "🕰️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"I <span class='eg-helper'>used to</span> smoke, but I quit." "I'd rather walk than drive." These structures help you talk about how things were different in the past and what you prefer now. Essential for discussing health changes, work habits, and lifestyle improvements around East Boston.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>These structures are critical for:</p>
                    <ul>
                        <li><strong>Doctor visits:</strong> "I <span class='eg-helper'>used to</span> have headaches every day." "I'd rather try walking along the Harborwalk before medication."</li>
                        <li><strong>Job interviews:</strong> "I <span class='eg-helper'>used to</span> work night shifts." "I'd rather have flexible hours near Logan."</li>
                        <li><strong>Goal setting:</strong> "I <span class='eg-helper'>used to</span> skip breakfast, but now I eat oatmeal before class." "I'd rather save money than eat out."</li>
                    </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Describing work problems and solutions ("I used to have scheduling conflicts, but now...")</li>
                        <li>Talking about job history changes ("I used to work nights" "I'd rather have day shifts")</li>
                        <li>Practicing "used to / be used to / get used to" structures</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Describing your wellness journey and habit changes</strong> ("I <span class='eg-helper'>used to</span> eat fast food, but now I cook East Boston meals").</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🔄 These structures show growth and change - perfect for interviews and goal-setting!</p>
                </div>
            `,
            exercises: [
                {
                    id: "used-to-would-rather-intro-1",
                    title: "Practice: Understanding Used To and Would Rather",
                    instructions: "Identify what each structure is used for.",
                    items: [
                        {
                            type: "radio",
                            label: '"I <span class=\'eg-helper\'>used to</span> smoke near the shipyard, but I quit." What does "used to" describe?',
                            options: [
                                { value: "b", label: "Current habits" },
                                { value: "a", label: "Past habits that are no longer true" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"I\'d rather walk than drive across the Harborwalk." What does "would rather" express?',
                            options: [
                                { value: "b", label: "Past habits" },
                                { value: "c", label: "Future plans" },
                                { value: "a", label: "Preferences - what you prefer to do" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Where are these structures commonly used?",
                            options: [
                                { value: "a", label: "Doctor visits, job interviews, goal setting" },
                                { value: "b", label: "Only in formal writing" },
                                { value: "c", label: "Only in casual conversation" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "used-to-basics",
            stepNumber: 1,
            title: "Used To: Past Habits That Are No Longer True",
            icon: "⏮️",
            explanation: `
                <h3>What Is "Used To"?</h3>
                <p><strong>Used to</strong> describes habits or states that were true in the past but are NOT true now.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">Subject + used to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoke</span>. (I don't smoke now)</li>
                        <li>She <span class='eg-helper'>used to</span> <span class='eg-verb'>work</span> nights. (She doesn't work nights now)</li>
                        <li>We <span class='eg-helper'>used to</span> <span class='eg-verb'>live</span> in Mexico. (We don't live there now)</li>
                        <li>He <span class='eg-helper'>used to</span> <span class='eg-verb'>drink</span> soda every day. (He doesn't anymore)</li>
                    </ul>
                </div>

                <h3>Negative Form</h3>
                <p style="font-weight: bold; color: #d97757;">Subject + didn't use to + base verb</p>
                <p style="font-style: italic;">⚠️ Notice: "didn't <strong>use</strong> to" (no d!)</p>
                <ul>
                    <li>I <span class='eg-helper'>didn't use to</span> <span class='eg-verb'>exercise</span>. (Now I do)</li>
                    <li>She <span class='eg-helper'>didn't use to</span> <span class='eg-verb'>eat</span> vegetables. (Now she does)</li>
                </ul>

                <h3>Question Form</h3>
                <p style="font-weight: bold; color: #d97757;">Did + subject + use to + base verb?</p>
                <ul>
                    <li><span class='eg-helper'>Did you use to</span> <span class='eg-verb'>smoke</span>?</li>
                    <li><span class='eg-helper'>Did he use to</span> <span class='eg-verb'>work</span> here?</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Common Mistake",
                content: "DON'T say: \"I am used to exercise\" or \"I used to exercising.\" ✅ SAY: \"I used to exercise.\" (base verb, no -ing!)",
            },
            exercises: [
                {
                    id: "used-to-would-rather-used-to-1",
                    title: "Practice: Used To for Past Habits",
                    instructions: "Choose the correct form of 'used to' for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'used to' describe?",
                            options: [
                                { value: "b", label: "Habits that are still true now" },
                                { value: "a", label: "Habits or states that were true in the past but are NOT true now" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                {
                                    value: "a",
                                    label: "I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoke</span> near the freight yard.",
                                },
                                { value: "b", label: "I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoking</span>." },
                                { value: "c", label: "I <span class='eg-helper'>am used to</span> <span class='eg-verb'>smoke</span>." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the negative form?",
                            options: [
                                { value: "b", label: "I didn't used to exercise." },
                                { value: "c", label: "I don't use to exercise." },
                                { value: "a", label: "I didn't use to exercise." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'used to'?",
                            options: [
                                { value: "a", label: "She used to work nights." },
                                { value: "b", label: "She uses to work nights." },
                                { value: "c", label: "She is used to work nights." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "would-past-habits",
            stepNumber: 2,
            title: "Would: Repeated Past Actions",
            icon: "🔁",
            explanation: `
                <h3>Would for Past Habits</h3>
                <p><strong>Would</strong> can also describe repeated actions in the past. It's more formal and literary than "used to."</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">Subject + would + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Every morning, I <strong>would</strong> go for a run. (= I used to go for a run)</li>
                        <li>My grandmother <strong>would</strong> make us breakfast. (= She used to make us breakfast)</li>
                        <li>We <strong>would</strong> walk to work together. (= We used to walk to work)</li>
                    </ul>
                </div>

                <h3>Used To vs Would: What's the Difference?</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Used To</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Would</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Habits AND states</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Only repeated actions (NOT states)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I used to be shy."</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">❌ "I would be shy." (WRONG)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">More common in everyday speech</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">More formal/literary</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I used to smoke."</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">✅ "I would smoke a pack a day."</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Key Difference",
                content: "Use 'would' only for repeated ACTIONS. For states (be, have, live, know), use 'used to' only.",
            },
            exercises: [
                {
                    id: "used-to-would-rather-would-1",
                    title: "Practice: Would for Past Habits",
                    instructions: "Choose the correct use of 'would' for past habits.",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'would' describe when talking about the past?",
                            options: [
                                { value: "b", label: "States and conditions in the past" },
                                { value: "a", label: "Repeated actions in the past; more formal than 'used to'" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'would'?",
                            options: [
                                { value: "b", label: "I would be shy." },
                                { value: "c", label: "I would live in Mexico." },
                                { value: "a", label: "Every morning, I would go for a run." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the main difference between 'used to' and 'would'?",
                            options: [
                                { value: "a", label: "'Used to' can describe habits AND states; 'would' only describes repeated actions" },
                                { value: "b", label: "They mean exactly the same thing" },
                                { value: "c", label: "'Would' is more common in everyday speech" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I would be shy." },
                                { value: "a", label: "I used to be shy." },
                                { value: "c", label: "Both are correct" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "would-rather",
            stepNumber: 3,
            title: "Would Rather: Expressing Preferences",
            icon: "⚖️",
            explanation: `
                <h3>What Is "Would Rather"?</h3>
                <p><strong>Would rather</strong> = I prefer (one thing over another). This is about what you WANT, not what you did in the past.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d4a843;">Subject + would rather + base verb</p>
                    <p style="font-style: italic; margin-top: 0.5rem;">(Contraction: I'd rather, She'd rather, etc.)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>I <span class='eg-helper'>would rather</span> <span class='eg-verb'>walk</span> than drive across the Harborwalk. (= I prefer walking)</li>
                        <li>She <span class='eg-helper'>'d rather</span> <span class='eg-verb'>work</span> from home near the airport. (= She prefers working from home)</li>
                        <li>We <span class='eg-helper'>'d rather</span> <span class='eg-verb'>eat</span> healthy food from the East Boston farmers’ market. (= We prefer healthy food)</li>
                        <li>He <span class='eg-helper'>'d rather not</span> <span class='eg-verb'>smoke</span>. (= He prefers not to smoke)</li>
                    </ul>
                </div>

                <h3>Comparing Two Options</h3>
                <p>Use <strong>would rather... than...</strong> to compare preferences:</p>
                    <ul>
                        <li>I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>cook</span> at home than <span class='eg-verb'>eat</span> out near Maverick.</li>
                        <li>She'd <span class='eg-helper'>rather</span> <span class='eg-verb'>take</span> the stairs than <span class='eg-verb'>use</span> the elevator.</li>
                        <li>I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>have</span> flexible hours than <span class='eg-verb'>work</span> 9-5.</li>
                    </ul>

                <h3>Negative Form</h3>
                <p style="font-weight: bold; color: #d97757;">would rather not + base verb</p>
                <ul>
                    <li>I'd <strong>rather not</strong> work overtime.</li>
                    <li>She'd <strong>rather not</strong> take the bus.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "used-to-would-rather-would-rather-1",
                    title: "Practice: Would Rather for Preferences",
                    instructions: "Choose the correct form of 'would rather' for expressing preferences.",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'would rather' express?",
                            options: [
                                { value: "b", label: "Past habits that are no longer true" },
                                { value: "c", label: "Future plans" },
                                { value: "a", label: "Preferences: what you prefer or want, not past habits" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I'd rather walk than drive." },
                                { value: "b", label: "I'd rather walking than driving." },
                                { value: "c", label: "I'd rather to walk than to drive." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the negative form?",
                            options: [
                                { value: "b", label: "I'd not rather work overtime." },
                                { value: "a", label: "I'd rather not work overtime." },
                                { value: "c", label: "I wouldn't rather work overtime." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly compares two options?",
                            options: [
                                { value: "b", label: "I'd rather cook at home than eating out." },
                                { value: "c", label: "I'd rather to cook at home than to eat out." },
                                { value: "a", label: "I'd rather cook at home than eat out." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "real-world-contexts",
            stepNumber: 4,
            title: "Real-World Contexts: Health & Work",
            icon: "🏥",
            explanation: `
                <h3>Health & Wellness Contexts</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #7ba884;">Talking to Your Doctor</h4>
                    <p><strong>Used to:</strong></p>
                    <ul>
                        <li>"I <span class='eg-helper'>used to</span> have headaches every day from Myrtle Street, but now they're rare."</li>
                        <li>"I <span class='eg-helper'>didn't use to</span> <span class='eg-verb'>exercise</span>, but now I walk 30 minutes on the Harborwalk daily."</li>
                        <li>"I <span class='eg-helper'>used to</span> <span class='eg-verb'>eat</span> fast food for every meal."</li>
                    </ul>
                    <p><strong>Would rather (preferences):</strong></p>
                    <ul>
                        <li>"I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>try</span> physical therapy than take pills."</li>
                        <li>"I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>see</span> a specialist if possible."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d97757;">Work & Career Discussions</h4>
                    <p><strong>Used to:</strong></p>
                    <ul>
                        <li>"I <span class='eg-helper'>used to</span> <span class='eg-verb'>work</span> in construction."</li>
                        <li>"I <span class='eg-helper'>didn't use to</span> <span class='eg-verb'>have</span> benefits at my old job."</li>
                        <li>"I <span class='eg-helper'>used to</span> <span class='eg-verb'>commute</span> two hours each way."</li>
                    </ul>
                    <p><strong>Would rather (preferences):</strong></p>
                    <ul>
                        <li>"I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>work</span> day shifts than nights."</li>
                        <li>"I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>have</span> weekends off."</li>
                        <li>"I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>start</span> at $18/hour than accept $15."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d4a843;">Goal Setting & Progress</h4>
                    <p><strong>Contrasting then vs now:</strong></p>
                    <ul>
                        <li>"I <span class='eg-helper'>used to</span> <span class='eg-verb'>skip</span> breakfast, but now I eat oatmeal every morning."</li>
                        <li>"I <span class='eg-helper'>used to</span> <span class='eg-verb'>stay</span> up late, but now I sleep 8 hours."</li>
                        <li>"I <span class='eg-helper'>didn't use to</span> <span class='eg-verb'>save</span> money, but now I save $200/month."</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "used-to-would-rather-real-world-1",
                    title: "Practice: Real-World Contexts",
                    instructions: "Choose the correct form (used to or would rather) for different real-world situations.",
                    items: [
                        {
                            type: "radio",
                            label: "When talking to your doctor about past habits, which is correct?",
                            options: [
                                { value: "a", label: "I used to have headaches every day, but now they're rare." },
                                { value: "b", label: "I would have headaches every day." },
                                { value: "c", label: "I use to have headaches." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When expressing a preference about treatment, which is correct?",
                            options: [
                                { value: "b", label: "I used to try physical therapy." },
                                { value: "a", label: "I'd rather try physical therapy than take pills." },
                                { value: "c", label: "I would try physical therapy." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When talking about work preferences, which is correct?",
                            options: [
                                { value: "b", label: "I used to work day shifts." },
                                { value: "c", label: "I would work day shifts." },
                                { value: "a", label: "I'd rather work day shifts than nights." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When contrasting past habits with current situation, which is correct?",
                            options: [
                                { value: "a", label: "I used to skip breakfast, but now I eat oatmeal every morning." },
                                { value: "b", label: "I would skip breakfast, but now I eat oatmeal." },
                                { value: "c", label: "I'd rather skip breakfast." },
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
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Wrong Verb Form</h3>
                <ul>
                    <li>❌ "I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoking</span>." → ✅ "I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoke</span>."</li>
                    <li>❌ "I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>working</span> from home." → ✅ "I'd <span class='eg-helper'>rather</span> <span class='eg-verb'>work</span> from home."</li>
                </ul>

                <h3>Mistake #2: Using "d" in Negative</h3>
                <ul>
                    <li>❌ "I <span class='eg-helper'>didn't</span> <span class='eg-helper'>used</span> to <span class='eg-verb'>exercise</span>." → ✅ "I <span class='eg-helper'>didn't</span> <span class='eg-helper'>use</span> to <span class='eg-verb'>exercise</span>."</li>
                    <li>❌ "Did you <span class='eg-helper'>used</span> to <span class='eg-verb'>smoke</span>?" → ✅ "Did you <span class='eg-helper'>use</span> to <span class='eg-verb'>smoke</span>?"</li>
                </ul>

                <h3>Mistake #3: Using "Would" for States</h3>
                <ul>
                    <li>❌ "I <span class='eg-helper'>would</span> be shy." → ✅ "I <span class='eg-helper'>used to</span> be shy."</li>
                    <li>❌ "She <span class='eg-helper'>would</span> have long hair." → ✅ "She <span class='eg-helper'>used to</span> have long hair."</li>
                </ul>

                <h3>Mistake #4: Confusing "Used To" with "Be Used To"</h3>
                <ul>
                    <li><strong>Used to</strong> = past habit: "I <span class='eg-helper'>used to</span> <span class='eg-verb'>smoke</span>." (I smoked before, not now)</li>
                    <li><strong>Be used to</strong> = be accustomed to: "I <span class='eg-helper'>am used to</span> <span class='eg-verb'>waking</span> up early." (I'm comfortable with it)</li>
                </ul>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <p style="font-weight: bold; margin: 0;">These are DIFFERENT structures with DIFFERENT meanings!</p>
                </div>
            `,
            exercises: [
                {
                    id: "used-to-would-rather-common-mistakes-1",
                    title: "Practice: Common Mistakes with Used To and Would Rather",
                    instructions: "Identify and correct common mistakes.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Mistake #1?",
                            options: [
                                { value: "b", label: "Using wrong tense" },
                                { value: "a", label: "Wrong verb form after 'used to': use base verb, not -ing" },
                                { value: "c", label: "Missing the subject" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #2?",
                            options: [
                                { value: "b", label: "Using wrong verb" },
                                { value: "c", label: "Missing the negative" },
                                { value: "a", label: "Using 'd' in negatives/questions: use didn't use to, not didn't used to" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #3?",
                            options: [
                                { value: "a", label: "Using 'would' for states: use 'used to' for states" },
                                { value: "b", label: "Using 'used to' for actions" },
                                { value: "c", label: "Using wrong tense" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the difference between 'used to' and 'be used to'?",
                            options: [
                                { value: "b", label: "They mean the same thing" },
                                { value: "a", label: "'Used to' = past habit; 'be used to' = be accustomed to" },
                                { value: "c", label: "One is formal, one is informal" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "practice",
            title: "Practice Exercises",
            icon: "✏️",
            exercises: [
                {
                    id: "used-to-would-rather-ex-1",
                    title: "Exercise 1: Used To (Past Habit)",
                    instructions: "Choose the best completion.",
                    items: [
                        {
                            type: "select",
                            label: "I _____, but I quit 5 years ago.",
                            options: ["used to smoke", "am used to smoking", "use to smoke", "used to smoking"],
                            expectedAnswer: "used to smoke",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-2",
                    title: "Exercise 2: Would Rather",
                    instructions: "Choose the correct phrase.",
                    items: [
                        {
                            type: "select",
                            label: "I'd _____ than drive to work.",
                            options: ["rather walk", "used to walk", "would walking", "rather to walk"],
                            expectedAnswer: "rather walk",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-3",
                    title: "Exercise 3: Negative Used To",
                    instructions: "Choose the correct form.",
                    items: [
                        {
                            type: "select",
                            label: "She _____ before, but now she goes to the gym daily.",
                            options: ["didn't use to exercise", "doesn't use to exercise", "didn't used to exercise", "wouldn't exercise"],
                            expectedAnswer: "didn't use to exercise",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-4",
                    title: "Exercise 4: Would (Repeated Past Action)",
                    instructions: "Choose the best completion.",
                    items: [
                        {
                            type: "select",
                            label: "Every summer, we _____ to the beach.",
                            options: ["would go", "used to going", "would to go", "are used to go"],
                            expectedAnswer: "would go",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-5",
                    title: "Exercise 5: Two Blanks",
                    instructions: "Complete both blanks.",
                    items: [
                        {
                            type: "select",
                            label: "I'd rather _____ the bus than walk 2 hours.",
                            options: ["take", "taking", "to take", "took"],
                            expectedAnswer: "take",
                        },
                        {
                            type: "select",
                            label: "I'd rather take the bus than _____ 2 hours.",
                            options: ["walk", "walking", "to walk", "walked"],
                            expectedAnswer: "walk",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-6",
                    title: "Exercise 6: Fix the Error",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "I used to smoking a lot."',
                            options: [
                                { value: "b", label: "I used to smoking a lot." },
                                { value: "c", label: "I use to smoked a lot." },
                                { value: "a", label: "I used to smoke a lot." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-7",
                    title: "Exercise 7: Question Form",
                    instructions: "Complete both blanks.",
                    items: [
                        {
                            type: "select",
                            label: "_____ you _____ in Mexico?",
                            options: ["Did", "Do", "Were", "Are"],
                            expectedAnswer: "Did",
                        },
                        {
                            type: "select",
                            label: "Did you _____ in Mexico?",
                            options: ["use to live", "used to live", "to live", "living"],
                            expectedAnswer: "use to live",
                        },
                    ],
                },
                {
                    id: "used-to-would-rather-ex-8",
                    title: "Exercise 8: Negative Would Rather",
                    instructions: "Choose the correct completion.",
                    items: [
                        {
                            type: "select",
                            label: "He'd rather _____ overtime.",
                            options: ["not work", "don't work", "not to work", "doesn't work"],
                            expectedAnswer: "not work",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference Guide",
            icon: "📋",
            explanation: `
                <h3>Used To (Past Habits)</h3>
                <ul>
                    <li><strong>Positive:</strong> Subject + used to + base verb</li>
                    <li><strong>Negative:</strong> Subject + didn't use to + base verb</li>
                    <li><strong>Question:</strong> Did + subject + use to + base verb?</li>
                    <li><strong>Example:</strong> "I used to smoke." / "I didn't use to exercise." / "Did you use to work here?"</li>
                </ul>

                <h3>Would (Repeated Past Actions)</h3>
                <ul>
                    <li><strong>Formula:</strong> Subject + would + base verb</li>
                    <li><strong>Example:</strong> "Every morning, I would go for a run."</li>
                    <li><strong>Remember:</strong> Only for ACTIONS, not states!</li>
                </ul>

                <h3>Would Rather (Preferences)</h3>
                <ul>
                    <li><strong>Positive:</strong> Subject + would rather + base verb</li>
                    <li><strong>Comparison:</strong> would rather... than...</li>
                    <li><strong>Negative:</strong> would rather not + base verb</li>
                    <li><strong>Example:</strong> "I'd rather walk than drive." / "I'd rather not smoke."</li>
                </ul>

                <h3>Key Differences</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Structure</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Meaning</th>
                            <th style="padding: 0.75rem; border: 1px solid #ddd;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Used to</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Past habit (not now)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I used to smoke.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Would</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Repeated past action</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I would smoke after meals.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Would rather</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Preference (present/future)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I'd rather not smoke.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Used to = past (then). Would rather = preference (now). Don't confuse them!",
            },
            exercises: [
                {
                    id: "used-to-would-rather-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of 'used to' and 'would rather'.",
                    items: [
                        {
                            type: "radio",
                            label: "What does 'used to' describe?",
                            options: [
                                { value: "a", label: "Past habits that are no longer true" },
                                { value: "b", label: "Current preferences" },
                                { value: "c", label: "Future plans" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the negative form of 'used to'?",
                            options: [
                                { value: "b", label: "didn't used to" },
                                { value: "a", label: "didn't use to — no extra 'd' on use" },
                                { value: "c", label: "don't use to" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What does 'would rather' express?",
                            options: [
                                { value: "b", label: "Past habits" },
                                { value: "c", label: "Future plans" },
                                { value: "a", label: "Preferences - what you prefer to do" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What form comes after 'would rather'?",
                            options: [
                                { value: "a", label: "Base verb — no 'to' and no '-ing'" },
                                { value: "b", label: "Infinitive: to + verb" },
                                { value: "c", label: "Gerund: verb + -ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I'd rather to walk than drive." },
                                { value: "a", label: "I'd rather walk than drive." },
                                { value: "c", label: "I'd rather walking than driving." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (15 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Complete: I _____ eat fast food every day, but now I cook at home.",
            options: [
                { value: "a", label: "use to" },
                { value: "c", label: "would rather" },
                { value: "b", label: "used to" },
            ],
            correctAnswer: "b",
            explanation: "'Used to' describes a past habit that is no longer true.",
            skillTag: "used-to-past-habit-form-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which is correct for expressing a preference?",
            options: [
                { value: "a", label: "I'd rather walk than drive." },
                { value: "b", label: "I'd rather to walk than drive." },
                { value: "c", label: "I'd rather walking than driving." },
            ],
            correctAnswer: "a",
            explanation: "'Would rather' is followed by the base verb (no 'to', no '-ing').",
            skillTag: "would-rather-base-verb-preference",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Complete the negative: She _____ exercise, but now she does.",
            options: [
                { value: "a", label: "didn't used to" },
                { value: "b", label: "didn't use to" },
                { value: "c", label: "wouldn't" },
            ],
            correctAnswer: "b",
            explanation: "In negatives, use 'didn't use to' (no 'd' on 'use').",
            skillTag: "used-to-negative-didnt-use-to",
            difficulty: "medium",
        },
        {
            id: "quiz-4",
            question: "Which sentence is INCORRECT?",
            options: [
                { value: "a", label: "I used to be shy." },
                { value: "c", label: "I used to work nights." },
                { value: "b", label: "I would be shy." },
            ],
            correctAnswer: "b",
            explanation: "'Would' cannot be used for states like 'be'. Use 'used to' instead.",
            skillTag: "would-vs-used-to-states",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "Complete: Every morning, I _____ go for a run.",
            options: [
                { value: "c", label: "Both A and B are correct" },
                { value: "a", label: "used to" },
                { value: "b", label: "would" },
            ],
            correctAnswer: "c",
            explanation: "Both 'used to' and 'would' can describe repeated past actions.",
            skillTag: "used-to-vs-would-past-actions",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question: "What does 'I'd rather work from home' mean?",
            options: [
                { value: "a", label: "I worked from home in the past." },
                { value: "b", label: "I prefer to work from home." },
                { value: "c", label: "I will work from home." },
            ],
            correctAnswer: "b",
            explanation: "'Would rather' expresses a preference, not a past action or future plan.",
            skillTag: "would-rather-meaning-preference",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which sentence correctly uses 'be used to' for something that is normal for you now?",
            options: [
                { value: "b", label: "I used to waking up early for my class." },
                { value: "c", label: "I am used to wake up early for my class." },
                { value: "a", label: "I am used to waking up early for my class." },
            ],
            correctAnswer: "a",
            explanation: "Be used to is followed by a noun or -ing form and describes something that is normal or comfortable for you now.",
            skillTag: "be-used-to-ing-form",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "What is the correct question form with 'used to'?",
            options: [
                { value: "c", label: "Did you use to live in East Boston?" },
                { value: "a", label: "Did you used to live in East Boston?" },
                { value: "b", label: "Used you to live in East Boston?" },
            ],
            correctAnswer: "c",
            explanation: "The correct question form is Did + subject + use to + base verb. No extra 'd' on use.",
            skillTag: "used-to-question-did-you-use-to",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Choose the correct negative with 'would rather'.",
            options: [
                { value: "b", label: "I'd not rather work nights." },
                { value: "a", label: "I'd rather not work nights." },
                { value: "c", label: "I wouldn't rather work nights." },
            ],
            correctAnswer: "a",
            explanation: "Use would rather not + base verb to show a negative preference.",
            skillTag: "would-rather-negative-not-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-10",
            question: "Which sentence correctly compares two options with 'would rather... than... '?",
            options: [
                { value: "b", label: "I'd rather cook at home than eating out." },
                { value: "c", label: "I'd rather to cook at home than to eat out." },
                { value: "a", label: "I'd rather cook at home than eat out." },
            ],
            correctAnswer: "a",
            explanation: "Would rather is followed by the base verb, and we use than to compare two actions.",
            skillTag: "would-rather-than-comparison",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "You are talking about a past habit that is not true now. Which is best?",
            options: [
                { value: "a", label: "I used to drink soda every day." },
                { value: "b", label: "I'd rather drink soda every day." },
                { value: "c", label: "I am used to drink soda every day." },
            ],
            correctAnswer: "a",
            explanation: "Used to + base verb describes a past habit that is not true now.",
            skillTag: "used-to-past-habit-meaning",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "You want to talk about your preference now. Which is best?",
            options: [
                { value: "a", label: "I used to take the bus." },
                { value: "b", label: "I'd rather take the bus than drive." },
                { value: "c", label: "I would take the bus every day." },
            ],
            correctAnswer: "b",
            explanation: "Would rather + base verb describes what you prefer now.",
            skillTag: "used-to-vs-would-meaning",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Which sentence correctly contrasts a past habit and a current preference?",
            options: [
                { value: "b", label: "I would smoke, but now I used to drink tea." },
                { value: "c", label: "I am used to smoke, but now I'd rather drinking tea." },
                { value: "a", label: "I used to smoke, but now I'd rather drink tea." },
            ],
            correctAnswer: "a",
            explanation: "Used to shows the past habit, and would rather shows the new preference now.",
            skillTag: "used-to-plus-would-rather-contrast-then-now",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Which sentence is INCORRECT?",
            options: [
                { value: "c", label: "I would be tired all the time." },
                { value: "a", label: "I used to live near Logan Airport." },
                { value: "b", label: "Did you use to work night shifts?" },
            ],
            correctAnswer: "c",
            explanation: "Would should not be used for states like be in this structure. Use used to be tired all the time.",
            skillTag: "would-vs-used-to-states",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "In which sentence does 'would' show a repeated past action (not a future or conditional idea)?",
            options: [
                { value: "b", label: "I would rather walk along the Harborwalk." },
                { value: "a", label: "When I had days off, I would walk along the Harborwalk with my friends." },
                { value: "c", label: "I would work from home if I could." },
            ],
            correctAnswer: "a",
            explanation: "Here would + base verb describes a repeated past action with a clear past time reference.",
            skillTag: "would-past-habit-actions-only",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Used To, Would, and Would Rather Mini Quiz

    This mini quiz checks whether students can:
    - Use used to to describe past habits and states that are not true now.
    - Form negatives and questions with used to correctly (didn't use to / Did you use to... ?).
    - Distinguish used to (past habit) from be used to (accustomed to now).
    - Use would for repeated past actions only (not for states).
    - Use would rather + base verb (and would rather... than...) to express preferences, including negative preferences with would rather not.

    Skill tags:

    Used to – form and meaning
    - used-to-past-habit-form-base-verb
    - used-to-past-habit-meaning
    - used-to-negative-didnt-use-to
    - used-to-question-did-you-use-to
    - be-used-to-ing-form
    - would-vs-used-to-states
    - used-to-vs-would-past-actions
    - used-to-plus-would-rather-contrast-then-now

    Would for past habits
    - used-to-vs-would-past-actions
    - would-past-habit-actions-only
    - would-vs-used-to-states

    Would rather – preferences
    - would-rather-base-verb-preference
    - would-rather-meaning-preference
    - would-rather-negative-not-verb
    - would-rather-than-comparison
    - used-to-vs-would-meaning
    - used-to-plus-would-rather-contrast-then-now

    How to read the diagnostics:
    - If used to form/meaning tags are weak (used-to-past-habit-form-base-verb, used-to-past-habit-meaning, used-to-negative-didnt-use-to, used-to-question-did-you-use-to) →
      Rebuild the core pattern:
      • Positive: subject + used to + base verb → I used to smoke.
      • Negative: subject + didn't use to + base verb → I didn't use to exercise.
      • Question: Did + subject + use to + base verb? → Did you use to work nights?
      Use quick correction drills with common mistakes: use to / used to / didn't used to.

    - If be used to vs used to tags are weak (be-used-to-ing-form, used-to-plus-would-rather-contrast-then-now) →
      Contrast the meanings clearly:
      • used to + base verb = past habit (not now): I used to smoke.
      • be used to + noun/-ing = accustomed/comfortable now: I'm used to waking up early.
      Have students sort example sentences into two columns (past habit vs comfortable now), then write their own.

    - If would vs used to tags are weak (used-to-vs-would-past-actions, would-past-habit-actions-only, would-vs-used-to-states) →
      Focus on:
      • would + base verb = repeated past action with a clear time frame: On Sundays, we would visit my grandmother.
      • used to = habits and states: I used to be shy, I used to live in Mexico.
      Remind students: do not use would for states (be, have, live, know). Practice by giving base sentences and asking students to choose used to or would.

    - If would rather tags are weak (would-rather-base-verb-preference, would-rather-meaning-preference, would-rather-negative-not-verb, would-rather-than-comparison, used-to-vs-would-meaning) →
      Rebuild the pattern:
      • would rather + base verb → I'd rather walk.
      • would rather... than... → I'd rather walk than drive.
      • would rather not + base verb → I'd rather not work nights.
      Use real-life preference questions about work, transport, food, and schedules so students talk about their actual lives.

    Suggested use:
    - Use this mini quiz after students have:
      • Practiced used to / didn't use to / Did you use to...? for habits and states.
      • Learned be used to + -ing for things that feel normal now.
      • Practiced would for repeated past actions (with time phrases like every day, on weekends, when I was a child).
      • Practiced would rather for preferences (including would rather not and would rather... than...).
    - At the class level:
      • If used to is red, slow down and work on simple then vs now contrasts with timelines and personal examples.
      • If be used to is red, do more present-tense sentences about students’ current lives (what they are used to now).
      • If would vs used to is red, keep states with used to and actions with either used to or would, using color-coding or gesture.
      • If would rather is red, shift to speaking activities: students choose between two options (walk vs drive, nights vs days, cash vs card) and report their preferences using would rather.
    */
};
