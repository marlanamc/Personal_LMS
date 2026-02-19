import type { InteractiveGuideContent } from "@/types/activity";

export const futureSimpleContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Simple: Making Plans & Promises",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(133, 196, 255, 0.12) 0%, rgba(255, 189, 118, 0.12) 100%); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem;">
                    <p style="margin: 0; font-size: 1.05rem;">Future Simple is your crystal ball for quick decisions, promises, and predictions. "I'll call you later." "She'll help you." "It'll rain tomorrow."</p>
                </div>
            `,
            exercises: [
                {
                    id: "fs-intro-1",
                    title: "Quick Check: Choose the Best Use",
                    instructions: "Why do we use 'will' here?",
                    items: [
                        {
                            type: "radio",
                            label: "The phone is ringing — <span class=\'eg-helper\'>I\'ll</span> <span class=\'eg-verb\'>answer</span> it.",
                            options: [
                                { value: "past", label: "Finished past action" },
                                { value: "decision", label: "Spontaneous decision, right now" },
                                { value: "habit", label: "Daily routine/habit" },
                            ],
                            expectedAnswer: "decision",
                        },
                    ],
                },
            ],
        },

        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Simple",
            icon: "⭐",
            explanation: `
                <p>Use <strong>will</strong> when the future decision is happening in your head right now, when you are promising or offering, or when you are making a general prediction.</p>
                <p><strong>Quick practice:</strong> Use mini-problems ("I dropped my books", "I forgot my key") and react immediately with <em>I'll...</em>.</p>
            `,
            usageMeanings: [
                {
                    title: "⚡ 1. Spontaneous Decisions (Right Now)",
                    description: "A quick reaction in the moment, often after a trigger phrase",
                    examples: [
                        {
                            sentence: "Oh! I <strong>forgot</strong> my wallet. I <strong>will run</strong> back for it.",
                            explanation: "✓ decision made while speaking",
                        },
                        {
                            sentence: "Wait, the phone is ringing. I <strong>will answer</strong> it.",
                            explanation: "✓ immediate response",
                        },
                        {
                            sentence: "Don't worry. I <strong>will drive</strong> you home.",
                            explanation: "✓ instant decision to help",
                        },
                    ],
                },
                {
                    title: "🤝 2. Promises",
                    description: "Personal commitments with emotional weight",
                    examples: [
                        {
                            sentence: "I <strong>promise I will call</strong> when I arrive.",
                            explanation: "✓ clear commitment",
                        },
                        {
                            sentence: "I <strong>won't forget</strong> your appointment.",
                            explanation: "✓ negative promise",
                        },
                        {
                            sentence: "I <strong>will help</strong> you study tonight.",
                            explanation: "✓ promise of support",
                        },
                    ],
                },
                {
                    title: "🙋 3. Offers (Volunteering)",
                    description: "You offer to do something for someone",
                    examples: [
                        {
                            sentence: "I <strong>will carry</strong> that box for you.",
                            explanation: "✓ volunteering",
                        },
                        {
                            sentence: "I <strong>will open</strong> the window.",
                            explanation: "✓ practical offer",
                        },
                        {
                            sentence: "I <strong>will pay</strong> for coffee this time.",
                            explanation: "✓ social offer",
                        },
                    ],
                },
                {
                    title: "🔮 4. Predictions (No Clear Evidence)",
                    description: "Personal opinion or belief about the future",
                    examples: [
                        {
                            sentence: "I think she <strong>will win</strong>.",
                            explanation: "✓ opinion prediction",
                        },
                        {
                            sentence: "Maybe we <strong>will see</strong> him later.",
                            explanation: "✓ uncertain prediction",
                        },
                        {
                            sentence: "It <strong>will be</strong> expensive, probably.",
                            explanation: "✓ general belief",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Gold Contrast",
                content:
                    "Use will for no-evidence predictions (I think it will rain). Use going to when you see evidence (Look at the sky. It's going to rain).",
            },
            exercises: [
                {
                    id: "ex-usage-fs-1",
                    title: "Practice: Choose the Use of 'Will'",
                    instructions: "Identify whether each sentence is a decision, promise, offer, or prediction.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Don't worry, <span class='eg-helper'>I'll</span> <span class='eg-verb'>text</span> you when I arrive.\"",
                            options: [
                                { value: "decision", label: "Spontaneous decision" },
                                { value: "promise", label: "Promise" },
                                { value: "prediction", label: "Prediction" },
                            ],
                            expectedAnswer: "promise",
                        },
                        {
                            type: "radio",
                            label: "\"Wait! The doorbell is ringing. <span class='eg-helper'>I'll</span> <span class='eg-verb'>get</span> it.\"",
                            options: [
                                { value: "decision", label: "Decision right now" },
                                { value: "offer", label: "Offer" },
                                { value: "plan", label: "Pre-made plan" },
                            ],
                            expectedAnswer: "decision",
                        },
                        {
                            type: "radio",
                            label: "\"I think our team <span class='eg-helper'>will</span> <span class='eg-verb'>win</span> tonight.\"",
                            options: [
                                { value: "offer", label: "Offer" },
                                { value: "prediction", label: "Prediction (no evidence)" },
                                { value: "promise", label: "Promise" },
                            ],
                            expectedAnswer: "prediction",
                        },
                        {
                            type: "radio",
                            label: "\"<span class='eg-helper'>I'll</span> <span class='eg-verb'>carry</span> that bag for you.\"",
                            options: [
                                { value: "offer", label: "Offer" },
                                { value: "prediction", label: "Prediction" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "offer",
                        },
                    ],
                },
            ],
        },

        {
            id: "future-visual-map",
            stepNumber: 2,
            title: "Future Decision Map: Will vs Going To vs Present Continuous",
            icon: "🧭",
            explanation: `
                <h3>Choose the right future form on purpose</h3>
                <p>Future Simple is strongest when you need a quick decision, promise, or general prediction. Use this map to avoid the most common tense-mixing errors.</p>

                <div style="background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.5rem; padding: 0.9rem; margin: 0.9rem 0;">
                    <p style="margin: 0 0 0.45rem 0;"><strong>Common trigger language for will:</strong> Oh!, I forgot!, Wait!, That's okay., Don't worry.</p>
                    <p style="margin: 0;"><strong>Prediction language:</strong> I think..., I believe..., Maybe..., Probably..., I'm sure...</p>
                </div>
            `,
            futureChoiceFlow: {
                title: "Future Form Decision Flow",
                options: [
                    {
                        trigger: "Decision made now?",
                        form: "will",
                        example: "The phone is ringing. I'll answer it.",
                        color: "cyan"
                    },
                    {
                        trigger: "Plan already decided before now?",
                        form: "going-to",
                        example: "I'm going to apply for that job tonight.",
                        color: "green"
                    },
                    {
                        trigger: "Arranged appointment?",
                        form: "present-continuous",
                        example: "I'm meeting HR at 2 PM.",
                        color: "violet"
                    }
                ]
            },
            postExplanation: `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; min-width: 700px; border-collapse: collapse; border: 1px solid #dbeafe;">
                        <thead>
                            <tr style="background: #ecfeff;">
                                <th style="padding: 0.7rem; border: 1px solid #dbeafe; text-align: left;">Use</th>
                                <th style="padding: 0.7rem; border: 1px solid #dbeafe; text-align: left;">Best Form</th>
                                <th style="padding: 0.7rem; border: 1px solid #dbeafe; text-align: left;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">Spontaneous help/offer</td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;"><strong>will</strong></td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">"I'll carry that bag for you."</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">Intentions decided earlier</td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;"><strong>going to</strong></td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">"I'm going to renew my license this week."</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">Calendar commitment</td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;"><strong>Present Continuous</strong></td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">"I'm seeing my doctor on Thursday."</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">General prediction</td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;"><strong>will</strong></td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">"The traffic will be heavy tonight."</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">Prediction with visible evidence</td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;"><strong>going to</strong></td>
                                <td style="padding: 0.7rem; border: 1px solid #dbeafe;">"Look at those clouds. It's going to rain."</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 style="margin-top: 1.25rem;">Real-world use cases for Future Simple</h3>
                <ul>
                    <li><strong>Work communication:</strong> "I'll send the updated file before lunch."</li>
                    <li><strong>Customer service:</strong> "We will call you when your order is ready."</li>
                    <li><strong>Healthcare:</strong> "I won't miss my follow-up appointment."</li>
                    <li><strong>Family logistics:</strong> "I'll pick up the kids after practice."</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Quick Rule",
                content:
                    "If your brain says, 'I decided this now,' use will. If the plan existed before this moment, use going to or Present Continuous.",
            },
            exercises: [
                {
                    id: "ex-future-map-1",
                    title: "Practice: Choose the Best Future Form",
                    instructions: "Pick the form that best fits the context.",
                    items: [
                        {
                            type: "radio",
                            label: "Your friend drops books. You react immediately:",
                            options: [
                                { value: "a", label: "I'll help you pick those up." },
                                { value: "b", label: "I'm going to help you pick those up." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You planned this yesterday:",
                            options: [
                                { value: "a", label: "I'm going to visit the RMV tomorrow." },
                                { value: "b", label: "I'll visit the RMV tomorrow. (decision now)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "It is already on your calendar:",
                            options: [
                                { value: "a", label: "I'm meeting my case manager at 3 PM." },
                                { value: "b", label: "I'll meet my case manager at 3 PM. (appointment arranged)" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "contractions-pronunciation",
            stepNumber: 3,
            title: "Contracted Forms & Pronunciation Rhythm",
            icon: "🎙️",
            explanation: `
                <h3>Students need spoken Future Simple, not just written Future Simple</h3>
                <p>In natural conversation, full forms are less common. Practice contractions early so you can understand native speed and sound more confident.</p>

                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; margin: 1rem 0;">
                    <div style="background: #ecfeff; border-left: 4px solid #06b6d4; padding: 0.75rem; border-radius: 0.45rem;">
                        <strong>I'll</strong>, <strong>you'll</strong>, <strong>he'll</strong>, <strong>she'll</strong>
                    </div>
                    <div style="background: #ecfeff; border-left: 4px solid #06b6d4; padding: 0.75rem; border-radius: 0.45rem;">
                        <strong>it'll</strong>, <strong>we'll</strong>, <strong>they'll</strong>, <strong>won't</strong>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.9rem;">
                    <p style="margin: 0 0 0.35rem 0;"><strong>Pronunciation target:</strong> <em>won't</em> (not "willn't").</p>
                    <p style="margin: 0;"><strong>Rhythm drill lines:</strong> "I'll call you later." / "It'll be fine." / "We'll see."</p>
                </div>
            `,
            tipBox: {
                title: "💡 Speaking Drill",
                content:
                    "Use choral repetition with increasing speed: full form first, then contraction. Example: I will call -> I'll call.",
            },
            exercises: [
                {
                    id: "ex-contractions-1",
                    title: "Practice: Match Full Form to Contraction",
                    instructions: "Choose the correct contraction.",
                    items: [
                        {
                            type: "radio",
                            label: "I will text you later.",
                            options: [
                                { value: "a", label: "I'll text you later." },
                                { value: "b", label: "I' ll text you later." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "They will arrive soon.",
                            options: [
                                { value: "a", label: "They'll arrive soon." },
                                { value: "b", label: "Theyll arrive soon." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which negative contraction is correct?",
                            options: [
                                { value: "a", label: "won't" },
                                { value: "b", label: "willn't" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-positive",
            stepNumber: 4,
            title: "Positive Form",
            explanation: `
                <h3>How to Form Future Simple (Positive)</h3>
                <p>Formula: <strong>will + base verb</strong>. Same for every subject—no extra endings.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">will finish</span> my homework before dinner.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            You <span style="color: #06b6d4; font-weight: 600;">will love</span> this movie—it's so good.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            He <span style="color: #06b6d4; font-weight: 600;">will call</span> you when he gets home.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">will bring</span> the cake to the party.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            It <span style="color: #06b6d4; font-weight: 600;">will take</span> longer if the traffic is bad.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            We <span style="color: #06b6d4; font-weight: 600;">will meet</span> at the park tomorrow.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">will visit</span> us next month.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            tipBox: {
                title: "✏️ Contractions",
                content: "We often use contractions: I'll, you'll, he'll, she'll, it'll, we'll, they'll",
            },
            exercises: [
                {
                    id: "ex-positive-1",
                    title: "Exercise 1: Say What You'll Do",
                    instructions: "Complete with will + base verb (everyday plans).",
                    items: [
                        {
                            type: "text",
                            label: "The museum ___ (open) a new exhibit about local history next month.",
                            expectedAnswer: "will open",
                        },
                        {
                            type: "text",
                            label: "My parents ___ (celebrate) their 30th anniversary with a family dinner.",
                            expectedAnswer: "will celebrate",
                        },
                        {
                            type: "text",
                            label: "The doctor ___ (see) you in about 15 minutes.",
                            expectedAnswer: "will see",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-negative",
            stepNumber: 5,
            title: "Negative Form",
            explanation: `
                <h3>How to Make Negative Sentences</h3>
                <p>Use <strong>will not (won't)</strong> + base verb.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">won't eat</span> sugar this week—I'm trying to be healthier.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">won't go</span> to the party tonight.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">won't leave</span> before 9 PM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            It <span style="color: #06b6d4; font-weight: 600;">won't rain</span> tomorrow, according to the weather.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't", type: "verb" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
            ],
            exercises: [
                {
                    id: "ex-negative-1",
                    title: "Exercise 2: Say What Won't Happen",
                    instructions: "Use won't + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "The library ___ (not accept) donations of old magazines anymore.",
                            expectedAnswer: "won't accept",
                        },
                        {
                            type: "text",
                            label: "My brother ___ (not lend) me his car after what happened last time.",
                            expectedAnswer: "won't lend",
                        },
                        {
                            type: "text",
                            label: "The flowers ___ (not survive) if we don't water them soon.",
                            expectedAnswer: "won't survive",
                        },
                    ],
                },
            ],
        },

        {
            id: "step-questions",
            stepNumber: 6,
            title: "Question Form",
            explanation: `
                <h3>How to Make Questions</h3>
                <p>Put <strong>Will</strong> at the beginning.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> you <span style="color: #06b6d4; font-weight: 600;">come</span> to dinner tonight?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">bring</span> her kids to the party?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> it <span style="color: #06b6d4; font-weight: 600;">be</span> cold tomorrow?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> they <span style="color: #06b6d4; font-weight: 600;">visit</span> us next week?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "base verb", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-questions-1",
                    title: "Exercise 3: Ask About the Future",
                    instructions: "Make questions with Will + subject + base verb.",
                    items: [
                        {
                            type: "text",
                            label: "___ the store ___ (have) that toy in stock by Christmas?",
                            expectedAnswer: "Will the store have",
                        },
                        {
                            type: "text",
                            label: "___ your daughter ___ (study) online next term?",
                            expectedAnswer: "Will your daughter study",
                        },
                        {
                            type: "text",
                            label: "___ the neighbors ___ (adopt) another rescue dog?",
                            expectedAnswer: "Will the neighbors adopt",
                        },
                    ],
                },
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 4: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'help' with the subject 'she'.",
                    items: [
                        { type: "text", label: "Affirmative: She ___ help", expectedAnswer: "will" },
                        { type: "text", label: "Negative: She ___ help", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ she help?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 5: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "She will going to the party tomorrow.", expectedAnswer: "She will go to the party tomorrow" },
                        { type: "text", label: "They won't comes to the meeting.", expectedAnswer: "They won't come to the meeting" },
                        { type: "text", label: "Will you helps me with this project?", expectedAnswer: "Will you help me with this project" },
                        { type: "text", label: "I will to call you later.", expectedAnswer: "I will call you later" },
                        { type: "text", label: "He don't will arrive until midnight.", expectedAnswer: "He won't arrive until midnight" },
                    ],
                },
                {
                    id: "ex-transformation-1",
                    title: "Exercise 6: Transformation Practice",
                    instructions: "Change each sentence as instructed. Keep the same meaning!",
                    items: [
                        { type: "text", label: "Make negative: I will attend the conference next month.", expectedAnswer: "I won't attend the conference next month" },
                        { type: "text", label: "Make a question: She will finish the report by Friday.", expectedAnswer: "Will she finish the report by Friday" },
                        { type: "text", label: "Make affirmative: They won't attend the meeting.", expectedAnswer: "They will attend the meeting" },
                        { type: "text", label: "Make negative: The weather will be sunny tomorrow.", expectedAnswer: "The weather won't be sunny tomorrow" },
                    ],
                },
                {
                    id: "ex-contextual-1",
                    title: "Exercise 7: Making Predictions",
                    instructions: "Complete these predictions about the future. Use Future Simple!",
                    items: [
                        { type: "text", label: "I think it ___ (rain) later tonight.", expectedAnswer: "will rain" },
                        { type: "text", label: "The team ___ (not win) without their star player.", expectedAnswer: "won't win" },
                        { type: "text", label: "___ the price of gas ___ (go) up next month?", expectedAnswer: "Will the price of gas go" },
                        { type: "text", label: "My parents ___ (visit) us during the holidays.", expectedAnswer: "will visit" },
                        { type: "text", label: "I'm sure you ___ (love) this restaurant!", expectedAnswer: "will love" },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Summary: Key Points",
            icon: "✓",
            explanation: `
                <h3>What You've Learned</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>When to Use:</strong> Predictions, promises/offers, spontaneous decisions</li>
                    <li><strong>Positive:</strong> Subject + will + base verb</li>
                    <li><strong>Negative:</strong> Subject + won't + base verb</li>
                    <li><strong>Questions:</strong> Will + subject + base verb?</li>
                    <li><strong>Contractions:</strong> I'll, you'll, he'll, she'll, won't</li>
                    <li><strong>Time Words:</strong> tomorrow, next week, soon, tonight, in an hour</li>
                </ul>
            `,
            tipBox: {
                title: "🎯 Remember",
                content: "Will = same form for all subjects. Very easy to use!",
            },
            exercises: [
                {
                    id: "fs-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "b", label: "She will come tomorrow." },
                                { value: "a", label: "She will comes tomorrow." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "Which negative is correct?",
                            options: [
                                { value: "b", label: "They won't to go tonight." },
                                { value: "a", label: "They won't go tonight." },
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
            question: "Which sentence correctly uses 'will' + base verb?",
            options: [
                { value: "a", label: "I will to call you later." },
                { value: "b", label: "I will call you later." },
                { value: "c", label: "I will calling you later." },
            ],
            correctAnswer: "b",
            explanation: "Future Simple uses will + base verb: will call.",
            skillTag: "form-will-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which negative is correct?",
            options: [
                { value: "a", label: "She won't comes." },
                { value: "c", label: "She will not comes." },
                { value: "b", label: "She won't come." },
            ],
            correctAnswer: "b",
            explanation: "Won't is followed by the base verb: won't come.",
            skillTag: "form-negative-wont-base-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "Will you help me?" },
                { value: "a", label: "Will you helps me?" },
                { value: "c", label: "You will help me?" },
            ],
            correctAnswer: "b",
            explanation: "Question form: Will + subject + base verb.",
            skillTag: "form-question-will-subject-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Which sentence is a spontaneous decision (made now)?",
            options: [
                { value: "a", label: "I'm meeting my friend at 3 PM." },
                { value: "b", label: "I'll answer the door—someone's knocking." },
                { value: "c", label: "The bus leaves at 7:10 AM." },
            ],
            correctAnswer: "b",
            explanation: "A decision made right now often uses will: I'll answer.",
            skillTag: "meaning-spontaneous-decision",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "Which sentence is clearly a promise?",
            options: [
                { value: "a", label: "I promise I'll call you after the interview." },
                { value: "b", label: "I'm going to call you after the interview. (already planned)" },
                { value: "c", label: "I called you after the interview." },
            ],
            correctAnswer: "a",
            explanation: "Promises are commitments you make to someone. 'I promise I'll...' is the clearest signal.",
            skillTag: "meaning-promise",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which sentence is an offer (volunteering)?",
            options: [
                { value: "a", label: "I'll carry those boxes for you." },
                { value: "b", label: "I think it will rain later today." },
                { value: "c", label: "I'm going to carry boxes tomorrow because it's my task." },
            ],
            correctAnswer: "a",
            explanation: "Offers use will to volunteer help in the moment: 'I'll carry...'",
            skillTag: "meaning-offer-volunteering",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Which contraction sentence is written correctly?",
            options: [
                { value: "a", label: "It' ll be fine." },
                { value: "b", label: "It'll be fine." },
                { value: "c", label: "Itll be fine." },
            ],
            correctAnswer: "b",
            explanation: "Contractions need the apostrophe in the right place: it'll = it will.",
            skillTag: "form-contractions-will",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: "Choose 'will' or 'going to': The plan is already arranged.",
            options: [
                { value: "b", label: "I'll renew my ID tomorrow (I planned it last week)." },
                { value: "c", label: "I renew my ID tomorrow." },
                { value: "a", label: "I'm going to renew my ID tomorrow." },
            ],
            correctAnswer: "a",
            explanation: "A plan made before now is often expressed with going to (or Present Continuous for an appointment).",
            skillTag: "contrast-will-going-to-plan",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: "Choose 'will' or Present Continuous: It's an arranged appointment.",
            options: [
                { value: "a", label: "I'm meeting the doctor at 2 PM." },
                { value: "b", label: "I'll meet the doctor at 2 PM (appointment already set)." },
                { value: "c", label: "I meet the doctor at 2 PM." },
            ],
            correctAnswer: "a",
            explanation: "We often use Present Continuous for arranged appointments: I'm meeting…",
            skillTag: "contrast-will-present-continuous-appointment",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Choose the best spontaneous response to this trigger: 'Oh no, I forgot my charger.'",
            options: [
                { value: "a", label: "I'll go back and get it now." },
                { value: "b", label: "I'm going to get it next week." },
                { value: "c", label: "I got it yesterday." },
            ],
            correctAnswer: "a",
            explanation: "Trigger phrases like 'Oh no!' and 'I forgot!' often lead to immediate will-decisions.",
            skillTag: "meaning-trigger-language-spontaneous",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Choose the best contrast between plan and promise.",
            options: [
                { value: "a", label: "Plan: I'm going to study tonight. Promise: I'll study tonight, I promise." },
                { value: "b", label: "Plan: I'll study tonight. Promise: I'm going to study tonight, I promise." },
                { value: "c", label: "Plan: I studied tonight. Promise: I will studying tonight." },
            ],
            correctAnswer: "a",
            explanation: "Going to usually marks a prior plan; will is common for promises made to someone.",
            skillTag: "contrast-promise-vs-plan",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "Which is the correct negative contraction form?",
            options: [
                { value: "a", label: "won't" },
                { value: "b", label: "willn't" },
                { value: "c", label: "woun't" },
            ],
            correctAnswer: "a",
            explanation: "The correct contraction is won't. Learners often incorrectly create 'willn't.'",
            skillTag: "pronunciation-wont-not-willnt",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Which sentence is a no-evidence prediction using a marker phrase?",
            options: [
                { value: "a", label: "I think she'll pass the exam." },
                { value: "b", label: "Look at those clouds—it's going to rain." },
                { value: "c", label: "I'm meeting her at 4 PM." },
            ],
            correctAnswer: "a",
            explanation: "Marker phrases like 'I think' and 'probably' often signal no-evidence predictions with will.",
            skillTag: "meaning-prediction-general-markers",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Which sentence is a prediction based on visible evidence?",
            options: [
                { value: "a", label: "Look at those dark clouds—it's going to rain." },
                { value: "b", label: "I think she'll call me later." },
                { value: "c", label: "I'll open the door." },
            ],
            correctAnswer: "a",
            explanation: "Visible evidence usually pushes us to going to rather than will.",
            skillTag: "meaning-prediction-based-evidence-going-to",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "Which sentence uses won't to show refusal/failure?",
            options: [
                { value: "a", label: "My laptop won't start." },
                { value: "b", label: "My laptop doesn't starts." },
                { value: "c", label: "My laptop is going to not start." },
            ],
            correctAnswer: "a",
            explanation: "Won't can express refusal/failure with machines and systems: 'It won't start.'",
            skillTag: "meaning-refusal-wont",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Future Simple

    Skill map by skillTag:
    - form-will-base-verb: question 1
    - form-negative-wont-base-verb: question 2
    - form-question-will-subject-verb: question 3
    - form-contractions-will: question 7
    - meaning-spontaneous-decision: question 4
    - meaning-promise: question 5
    - meaning-offer-volunteering: question 6
    - meaning-trigger-language-spontaneous: question 10
    - contrast-promise-vs-plan: question 11
    - pronunciation-wont-not-willnt: question 12
    - meaning-prediction-general-markers: question 13
    - meaning-prediction-based-evidence-going-to: question 14
    - meaning-refusal-wont: question 15
    - contrast-will-going-to-plan: question 8
    - contrast-will-present-continuous-appointment: question 9

    How to use this data:
    - If many students miss questions with skillTag "form-will-base-verb" or "form-negative-wont-base-verb",
      review the basic form: will/won't + base verb, and correct errors like "will to call" or "won't comes".
    - If scores are low on "form-question-will-subject-verb", practice question order (Will + subject + base verb)
      with speaking drills and substitution exercises.
    - If students struggle with "meaning-spontaneous-decision" or "meaning-trigger-language-spontaneous", use trigger cards
      (Oh!, Wait!, I forgot!, Don't worry!) and force immediate I will / I'll reactions.
    - If students struggle with "meaning-promise" and "contrast-promise-vs-plan", contrast will with going to
      and Present Continuous using real classroom examples (decisions made now vs plans made before class).
    - Weak performance on "contrast-will-going-to-plan" or "contrast-will-present-continuous-appointment"
      suggests you should revisit the section on will vs going to vs Present Continuous for future.
    - If "meaning-prediction-general-markers" or "meaning-prediction-based-evidence-going-to" is low, highlight the difference
      between no-evidence predictions (I think..., probably..., will) and evidence-based predictions (look..., going to).
    - If "pronunciation-wont-not-willnt" is weak, drill contractions in rhythm lines: "I'll call you later," "It'll be fine," "We'll see."
    - If "meaning-refusal-wont" is weak, show more examples of won't for refusal/failure ("The car won't start").
    */
};
