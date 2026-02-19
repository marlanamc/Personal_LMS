import type { InteractiveGuideContent } from "@/types/activity";

export const passiveVoiceContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Passive Voice: Understanding Medical Instructions",
            icon: "🔄",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Your blood will be drawn." "The test is performed on an empty stomach." "You will be called when results are ready." Passive voice is EVERYWHERE in medical settings. If you don't understand it, you'll be confused about what's happening at the clinic or hospital.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Passive voice is critical in healthcare because:</p>
                <ul>
                    <li><strong>Medical instructions:</strong> "The medication should be taken twice daily."</li>
                    <li><strong>Procedures:</strong> "Your blood pressure will be checked first."</li>
                    <li><strong>Forms and documents:</strong> "This form must be completed before your appointment."</li>
                    <li><strong>Results:</strong> "Your test results were sent to your doctor."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "passive-intro-1",
                    title: "Practice: Understanding Passive Voice",
                    instructions: "Read each sentence and identify whether it's active or passive voice.",
                    items: [
                        {
                            type: "radio",
                            label: '"Your blood <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>be drawn</span>."',
                            options: [
                                { value: "active", label: "Active voice - subject does the action" },
                                { value: "passive", label: "Passive voice - subject receives the action" },
                                { value: "neither", label: "Neither active nor passive" },
                            ],
                            expectedAnswer: "passive",
                        },
                        {
                            type: "radio",
                            label: '"The nurse <span class=\'eg-verb\'>takes</span> your blood pressure."',
                            options: [
                                { value: "passive", label: "Passive voice - subject receives the action" },
                                { value: "neither", label: "Neither active nor passive" },
                                { value: "active", label: "Active voice - subject does the action" },
                            ],
                            expectedAnswer: "active",
                        },
                        {
                            type: "radio",
                            label: "Why is passive voice important in medical settings?",
                            options: [
                                { value: "a", label: "It's used in medical instructions, procedures, forms, and results" },
                                { value: "b", label: "It's only used in casual conversation" },
                                { value: "c", label: "It's never used in medical settings" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "active-vs-passive",
            stepNumber: 1,
            title: "Active vs Passive Voice",
            icon: "🔀",
            explanation: `
                <h3>What's the Difference?</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">Active Voice</h4>
                    <p><strong>The subject DOES the action.</strong></p>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject (doer) → Verb → Object</p>
                    <ul>
                        <li><strong>The nurse</strong> takes your blood pressure. (nurse = subject/doer)</li>
                        <li><strong>The doctor</strong> ordered the test. (doctor = subject/doer)</li>
                        <li><strong>They</strong> will call you tomorrow. (they = subject/doer)</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">Passive Voice</h4>
                    <p><strong>The subject RECEIVES the action.</strong></p>
                    <p style="font-size: 1.125rem; font-weight: bold;">Subject (receiver) → be + past participle (+ by doer)</p>
                    <ul>
                        <li><strong>Your blood pressure</strong> is taken (by the nurse). (blood pressure = subject/receiver)</li>
                        <li><strong>The test</strong> was ordered (by the doctor). (test = subject/receiver)</li>
                        <li><strong>You</strong> will be called tomorrow. (you = subject/receiver)</li>
                    </ul>
                </div>

                <h3>Same Meaning, Different Focus</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active (Who does it)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive (What happens)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The nurse drew my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood was drawn.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor will call you.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You will be called.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Someone sterilized the equipment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The equipment was sterilized.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Active = who did it matters. Passive = what happened matters (who did it is less important or unknown).",
            },
            exercises: [
                {
                    id: "active-vs-passive-1",
                    title: "Practice: Active or Passive?",
                    instructions: "Identify whether each sentence is active or passive voice.",
                    items: [
                        {
                            type: "radio",
                            label: '"The nurse <span class=\'eg-verb\'>drew</span> my blood."',
                            options: [
                                { value: "passive", label: "Passive - Subject receives the action" },
                                { value: "active", label: "Active - The nurse (subject) does the action" },
                            ],
                            expectedAnswer: "active",
                        },
                        {
                            type: "radio",
                            label: '"My blood <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>drawn</span>."',
                            options: [
                                { value: "passive", label: "Passive - My blood (subject) receives the action" },
                                { value: "active", label: "Active - Subject does the action" },
                            ],
                            expectedAnswer: "passive",
                        },
                        {
                            type: "radio",
                            label: "What's the key difference between active and passive?",
                            options: [
                                { value: "a", label: "Active: subject does action | Passive: subject receives action" },
                                { value: "b", label: "Active: uses past tense | Passive: uses present tense" },
                                { value: "c", label: "There's no difference" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "forming-passive",
            stepNumber: 2,
            title: "How to Form Passive Voice",
            icon: "🔨",
            explanation: `
                <h3>The Passive Formula</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #d4a843;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d4a843; text-align: center;">be + Past Participle</p>
                    <p style="text-align: center; margin-top: 0.5rem; font-style: italic;">(The form of "be" changes based on tense)</p>
                </div>

                <h3>Present Simple Passive</h3>
                <p style="font-weight: bold;">am/is/are + past participle</p>
                <ul>
                    <li>The test <strong>is performed</strong> on an empty stomach.</li>
                    <li>Appointments <strong>are scheduled</strong> online.</li>
                    <li>I <strong>am called</strong> for my appointment.</li>
                </ul>

                <h3>Past Simple Passive</h3>
                <p style="font-weight: bold;">was/were + past participle</p>
                <ul>
                    <li>My blood <strong>was drawn</strong> yesterday.</li>
                    <li>The results <strong>were sent</strong> to my doctor.</li>
                    <li>I <strong>was told</strong> to fast before the test.</li>
                </ul>

                <h3>Future Passive</h3>
                <p style="font-weight: bold;">will be + past participle</p>
                <ul>
                    <li>You <strong>will be called</strong> when the doctor is ready.</li>
                    <li>The medicine <strong>will be prescribed</strong> after your exam.</li>
                    <li>Your test <strong>will be scheduled</strong> for next week.</li>
                </ul>

                <h3>Modal Passive</h3>
                <p style="font-weight: bold;">modal + be + past participle</p>
                <ul>
                    <li>This form <strong>must be completed</strong> before your visit.</li>
                    <li>The medication <strong>should be taken</strong> with food.</li>
                    <li>Results <strong>can be viewed</strong> on your patient portal.</li>
                </ul>

                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4>Common Irregular Past Participles in Medical Settings:</h4>
                    <ul>
                        <li>take → <strong>taken</strong></li>
                        <li>give → <strong>given</strong></li>
                        <li>write → <strong>written</strong></li>
                        <li>send → <strong>sent</strong></li>
                        <li>tell → <strong>told</strong></li>
                        <li>draw (blood) → <strong>drawn</strong></li>
                        <li>prescribe → <strong>prescribed</strong></li>
                        <li>perform → <strong>performed</strong></li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "forming-passive-1",
                    title: "Practice: Forming Passive Voice",
                    instructions: "Choose the correct passive form for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for passive voice?",
                            options: [
                                { value: "b", label: "have + Past Participle" },
                                { value: "a", label: "be + Past Participle (form of 'be' changes based on tense)" },
                                { value: "c", label: "will + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"The test <span class=\'eg-helper\'>is</span> <span class=\'eg-verb\'>performed</span> on an empty stomach." What tense is this?',
                            options: [
                                { value: "b", label: "Past Simple Passive" },
                                { value: "c", label: "Future Passive" },
                                { value: "a", label: "Present Simple Passive (is + past participle)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"My blood <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>drawn</span> yesterday." What tense is this?',
                            options: [
                                { value: "b", label: "Past Simple Passive (was + past participle)" },
                                { value: "a", label: "Present Simple Passive" },
                                { value: "c", label: "Future Passive" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "when-to-use-passive",
            stepNumber: 3,
            title: "When to Use Passive Voice",
            icon: "❓",
            explanation: `
                <h3>Reason #1: The Doer Is Unknown or Unimportant</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>When we don't know who did the action, or it doesn't matter:</p>
                    <ul>
                        <li>"My car <strong>was stolen</strong>." (We don't know who stole it)</li>
                        <li>"The clinic <strong>was built</strong> in 1995." (Builder doesn't matter)</li>
                        <li>"Your prescription <strong>was sent</strong> to the pharmacy." (Who sent it? Doesn't matter)</li>
                    </ul>
                </div>

                <h3>Reason #2: Focus on the Action, Not the Person</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>Medical instructions focus on WHAT happens to you, not WHO does it:</p>
                    <ul>
                        <li>"Your blood pressure <strong>will be checked</strong>." (The action is what matters)</li>
                        <li>"The test <strong>is performed</strong> in the lab." (How it's done is what matters)</li>
                        <li>"You <strong>will be contacted</strong> with results." (What happens to you matters)</li>
                    </ul>
                </div>

                <h3>Reason #3: Scientific/Formal Writing</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p>Passive is common in formal instructions, signs, and procedures:</p>
                    <ul>
                        <li>"This medication <strong>should be taken</strong> with food." (medication label)</li>
                        <li>"Patients <strong>must be registered</strong> before their appointment." (clinic sign)</li>
                        <li>"The area <strong>was cleaned</strong> and sterilized." (procedure report)</li>
                    </ul>
                </div>

                <h3>When NOT to Use Passive</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p><strong>Use active voice when the doer IS important:</strong></p>
                    <ul>
                        <li>✅ ACTIVE: "<strong>Dr. Smith</strong> prescribed this medication." (specific doctor matters)</li>
                        <li>❌ PASSIVE: "This medication was prescribed." (too vague if you need to know who)</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "passive-voice-when-to-use-1",
                    title: "Practice: When to Use Passive Voice",
                    instructions: "Identify when passive voice is appropriate.",
                    items: [
                        {
                            type: "radio",
                            label: "When should you use passive voice?",
                            options: [
                                { value: "b", label: "Always, because it sounds more formal" },
                                { value: "a", label: "When the doer is unknown, unimportant, or you want to focus on the action" },
                                { value: "c", label: "Never, active voice is always better" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"My car <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>stolen</span>." Why is passive voice used here?',
                            options: [
                                { value: "b", label: "The car is more important than the thief" },
                                { value: "c", label: "Active voice would be incorrect" },
                                { value: "a", label: "The doer (thief) is unknown" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"Your blood pressure <span class=\'eg-helper\'>will</span> <span class=\'eg-helper\'>be</span> <span class=\'eg-verb\'>checked</span>." Why is passive used?',
                            options: [
                                { value: "a", label: "Focus is on what happens to you, not who does it" },
                                { value: "b", label: "We don't know who will check it" },
                                { value: "c", label: "It's more polite than active voice" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When should you NOT use passive voice?",
                            options: [
                                { value: "b", label: "When writing formal documents" },
                                { value: "a", label: "When the doer is important and you need to mention who did it" },
                                { value: "c", label: "When the action is more important than the person" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "medical-contexts",
            stepNumber: 4,
            title: "Medical Contexts: Real Examples",
            icon: "🏥",
            explanation: `
                <h3>Clinic Signs & Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Patients <strong>must be checked in</strong> 15 minutes before appointment."</li>
                        <li>"Insurance cards <strong>should be presented</strong> at check-in."</li>
                        <li>"Co-pays <strong>are collected</strong> at the front desk."</li>
                        <li>"Masks <strong>are required</strong> in the building."</li>
                    </ul>
                </div>

                <h3>Medication Labels</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"This medication <strong>should be taken</strong> twice daily with food."</li>
                        <li>"Tablets <strong>should not be crushed</strong> or chewed."</li>
                        <li>"The bottle <strong>must be stored</strong> in a cool, dry place."</li>
                        <li>"If symptoms persist, a doctor <strong>should be consulted</strong>."</li>
                    </ul>
                </div>

                <h3>Test & Procedure Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d4a843; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Your blood <strong>will be drawn</strong> in the lab on the 2nd floor."</li>
                        <li>"The test <strong>is performed</strong> on an empty stomach."</li>
                        <li>"You <strong>will be called</strong> when the doctor is ready."</li>
                        <li>"Results <strong>will be sent</strong> to your primary care doctor."</li>
                    </ul>
                </div>

                <h3>Phone Messages & Emails from Clinic</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>"Your appointment <strong>has been scheduled</strong> for May 15th."</li>
                        <li>"A reminder <strong>will be sent</strong> 24 hours before your visit."</li>
                        <li>"Your prescription <strong>was refilled</strong> and sent to CVS Pharmacy."</li>
                        <li>"Your lab results <strong>have been posted</strong> to your patient portal."</li>
                    </ul>
                </div>

                <h3>Converting Active to Passive (Medical Examples)</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The nurse will check your vitals.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Your vitals will be checked.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The lab performs the test.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The test is performed by the lab.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Someone sterilized the equipment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The equipment was sterilized.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor prescribed antibiotics.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Antibiotics were prescribed.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Patient Portal Tip",
                content: "Patient portals use LOTS of passive voice: 'Your results have been posted.' 'A message was sent.' 'Your appointment was confirmed.'",
            },
            exercises: [
                {
                    id: "passive-voice-medical-contexts-1",
                    title: "Practice: Passive Voice in Medical Contexts",
                    instructions: "Identify passive voice in medical contexts and understand why it's used.",
                    items: [
                        {
                            type: "radio",
                            label: '"Patients <span class=\'eg-helper\'>must</span> <span class=\'eg-helper\'>be</span> <span class=\'eg-verb\'>checked</span> in 15 minutes before appointment." Why is passive voice used here?',
                            options: [
                                { value: "b", label: "To make the sentence shorter" },
                                { value: "c", label: "To confuse patients" },
                                { value: "a", label: "Focus is on what happens to patients, not who checks them in" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"This medication <span class=\'eg-helper\'>should</span> <span class=\'eg-helper\'>be</span> <span class=\'eg-verb\'>taken</span> twice daily." What is the active voice version?',
                            options: [
                                { value: "a", label: "You should take this medication twice daily." },
                                { value: "b", label: "The medication takes itself twice daily." },
                                { value: "c", label: "This medication takes twice daily." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"Your blood <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>be drawn</span> in the lab." Why is passive voice appropriate here?',
                            options: [
                                { value: "b", label: "To hide who draws the blood" },
                                { value: "a", label: "Focus is on what happens to you (the patient), not who draws the blood" },
                                { value: "c", label: "To make it sound more formal" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why do patient portals use so much passive voice?",
                            options: [
                                { value: "b", label: "To make messages longer" },
                                { value: "c", label: "To confuse patients" },
                                { value: "a", label: "To focus on what happens to the patient and what they need to know" },
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
                <h3>Mistake #1: Forgetting "be"</h3>
                <ul>
                    <li>❌ "The test <strong>performed</strong> yesterday." → ✅ "The test <strong>was performed</strong> yesterday."</li>
                    <li>❌ "You <strong>called</strong> tomorrow." → ✅ "You <strong>will be called</strong> tomorrow."</li>
                </ul>

                <h3>Mistake #2: Wrong Tense of "be"</h3>
                <ul>
                    <li>❌ "The medicine <strong>is taken</strong> yesterday." → ✅ "The medicine <strong>was taken</strong> yesterday."</li>
                    <li>❌ "Results <strong>were sent</strong> tomorrow." → ✅ "Results <strong>will be sent</strong> tomorrow."</li>
                </ul>

                <h3>Mistake #3: Using Wrong Past Participle</h3>
                <ul>
                    <li>❌ "My blood was <strong>drew</strong>." → ✅ "My blood was <strong>drawn</strong>."</li>
                    <li>❌ "I was <strong>gave</strong> medication." → ✅ "I was <strong>given</strong> medication."</li>
                    <li>❌ "The form was <strong>wrote</strong>." → ✅ "The form was <strong>written</strong>."</li>
                </ul>

                <h3>Mistake #4: Overusing Passive</h3>
                <ul>
                    <li>❌ PASSIVE: "A prescription was given to me by Dr. Smith." (too wordy)</li>
                    <li>✅ ACTIVE: "Dr. Smith gave me a prescription." (clearer, simpler)</li>
                </ul>
                <p style="margin-top: 1rem;"><strong>Use passive when the doer is unimportant. Use active when the doer matters.</strong></p>
            `,
            exercises: [
                {
                    id: "passive-voice-common-mistakes-1",
                    title: "Practice: Common Passive Voice Mistakes",
                    instructions: "Identify and correct common mistakes in passive voice.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Mistake #1?",
                            options: [
                                { value: "a", label: "Forgetting 'be' - 'The test performed yesterday' should be 'The test was performed yesterday'" },
                                { value: "b", label: "Using too many words" },
                                { value: "c", label: "Using active voice" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #2?",
                            options: [
                                { value: "b", label: "Missing the subject" },
                                { value: "a", label: "Wrong tense of 'be' - 'The medicine is taken yesterday' should be 'was taken' (past)" },
                                { value: "c", label: "Using too many verbs" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #3?",
                            options: [
                                { value: "b", label: "Using present tense" },
                                { value: "c", label: "Missing the object" },
                                { value: "a", label: "Using wrong past participle - 'My blood was drew' should be 'was drawn'" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When should you use active voice instead of passive?",
                            options: [
                                { value: "a", label: "When the doer is important - 'Dr. Smith gave me a prescription' is clearer than passive" },
                                { value: "b", label: "Always use passive voice" },
                                { value: "c", label: "Never use active voice" },
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
                    id: "passive-voice-ex-1",
                    title: "Exercise 1: Past Passive",
                    instructions: "Complete the passive form.",
                    items: [
                        {
                            type: "text",
                            label: "The receptionist scheduled my appointment. → My appointment _____.",
                            expectedAnswer: "was scheduled",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-2",
                    title: "Exercise 2: Present Passive",
                    instructions: "Choose the correct present passive form.",
                    items: [
                        {
                            type: "select",
                            label: "This form _____ before your appointment.",
                            options: ["completes", "is completed", "was completed", "will complete"],
                            expectedAnswer: "is completed",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-3",
                    title: "Exercise 3: Future Passive",
                    instructions: "Choose the correct future passive form.",
                    items: [
                        {
                            type: "select",
                            label: "The clinic will text you a reminder. → You _____ a reminder.",
                            options: ["will text", "will be texted", "are texted", "were texted"],
                            expectedAnswer: "will be texted",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-4",
                    title: "Exercise 4: Modal Passive",
                    instructions: "Choose the correct modal passive form.",
                    items: [
                        {
                            type: "select",
                            label: "This form must _____ before check-in.",
                            options: ["complete", "be completed", "to be completed", "completing"],
                            expectedAnswer: "be completed",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-5",
                    title: "Exercise 5: Irregular Past Participle",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "My blood was drew yesterday."',
                            options: [
                                { value: "b", label: "My blood was drew yesterday." },
                                { value: "a", label: "My blood <span class=\'eg-helper\'>was</span> <span class=\'eg-verb\'>drawn</span> yesterday." },
                                { value: "c", label: "My blood is drew yesterday." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-6",
                    title: "Exercise 6: Passive (Unknown Doer)",
                    instructions: "Complete the sentence in passive voice.",
                    items: [
                        {
                            type: "select",
                            label: "Someone emailed the results to me. → The results _____ to me.",
                            options: ["emailed", "were emailed", "are emailed", "will email"],
                            expectedAnswer: "were emailed",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-7",
                    title: "Exercise 7: Present Passive Plural",
                    instructions: "Choose the correct present passive form.",
                    items: [
                        {
                            type: "select",
                            label: "Referrals _____ by fax.",
                            options: ["send", "are sent", "is sent", "sent"],
                            expectedAnswer: "are sent",
                        },
                    ],
                },
                {
                    id: "passive-voice-ex-8",
                    title: "Exercise 8: When Passive Sounds Better",
                    instructions: "Choose the better sentence for a medication label.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is better for a medication label?",
                            options: [
                                { value: "b", label: "This should be taken with food." },
                                { value: "a", label: "You should take this with food." },
                            ],
                            expectedAnswer: "b",
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
                <h3>Passive Voice Formula</h3>
                <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">be + Past Participle</p>

                <h3>Tense Chart</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tense</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Active</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Passive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Present Simple</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They take my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood is taken.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Past Simple</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They drew my blood.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">My blood was drawn.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Future</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They will call you.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You will be called.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Modal</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You must take this.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">This must be taken.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Irregular Past Participles</h3>
                <ul>
                    <li>take → <strong>taken</strong></li>
                    <li>give → <strong>given</strong></li>
                    <li>write → <strong>written</strong></li>
                    <li>send → <strong>sent</strong></li>
                    <li>tell → <strong>told</strong></li>
                    <li>draw → <strong>drawn</strong></li>
                    <li>do → <strong>done</strong></li>
                    <li>prescribe → <strong>prescribed</strong></li>
                </ul>

                <h3>When to Use Passive</h3>
                <ul>
                    <li>✅ Doer is unknown: "My car was stolen."</li>
                    <li>✅ Doer is unimportant: "The test is performed in the lab."</li>
                    <li>✅ Focus on action/receiver: "You will be called."</li>
                    <li>✅ Formal instructions: "This must be completed."</li>
                    <li>❌ Doer is important: Use active instead!</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Passive = be + past participle. Medical settings LOVE passive voice for instructions and procedures!",
            },
            exercises: [
                {
                    id: "passive-voice-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of passive voice.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for passive voice?",
                            options: [
                                { value: "a", label: "be + Past Participle (form of 'be' changes based on tense)" },
                                { value: "b", label: "have + Past Participle" },
                                { value: "c", label: "will + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the difference between active and passive voice?",
                            options: [
                                { value: "b", label: "Active: uses past tense | Passive: uses present tense" },
                                { value: "a", label: "Active: subject does action | Passive: subject receives action" },
                                { value: "c", label: "There's no difference" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When should you use passive voice?",
                            options: [
                                { value: "b", label: "Always, because it sounds more formal" },
                                { value: "c", label: "Never, active voice is always better" },
                                { value: "a", label: "When the doer is unknown, unimportant, or you want to focus on the action" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"The test is performed on an empty stomach." What tense is this?',
                            options: [
                                { value: "a", label: "Present Simple Passive (is + past participle)" },
                                { value: "b", label: "Past Simple Passive" },
                                { value: "c", label: "Future Passive" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the past participle of 'draw'?",
                            options: [
                                { value: "b", label: "drew" },
                                { value: "a", label: "drawn" },
                                { value: "c", label: "drawed" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (16 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which sentence is passive voice?",
            options: [
                { value: "a", label: "The nurse explained the instructions." },
                { value: "c", label: "The nurse will explain the instructions." },
                { value: "b", label: "The instructions were explained." },
            ],
            correctAnswer: "b",
            explanation:
                "In passive voice the subject receives the action. 'The instructions' receive the action 'were explained' (be + past participle).",
            skillTag: "identify-passive-basic",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Complete: 'Forms _____ at the front desk.'",
            options: [
                { value: "b", label: "are checked" },
                { value: "a", label: "check" },
                { value: "c", label: "checked" },
            ],
            correctAnswer: "b",
            explanation:
                "Present simple passive (plural) uses are + past participle: forms are checked.",
            skillTag: "form-present-simple-passive-medical",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "Complete: 'My ID _____ at check-in yesterday.'",
            options: [
                { value: "a", label: "is checked" },
                { value: "b", label: "was checked" },
                { value: "c", label: "will be checked" },
            ],
            correctAnswer: "b",
            explanation:
                "The time word 'yesterday' calls for past simple passive: was checked.",
            skillTag: "form-past-simple-passive-medical",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Complete: 'You _____ when the doctor is ready.'",
            options: [
                { value: "a", label: "call" },
                { value: "c", label: "are calling" },
                { value: "b", label: "will be called" },
            ],
            correctAnswer: "b",
            explanation:
                "Future passive uses will be + past participle: you will be called.",
            skillTag: "form-future-passive-medical",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: "Complete: 'This medication should _____ with food.'",
            options: [
                { value: "b", label: "be taken" },
                { value: "a", label: "take" },
                { value: "c", label: "be took" },
            ],
            correctAnswer: "b",
            explanation:
                "Modal passive uses modal + be + past participle: should be taken.",
            skillTag: "form-modal-passive-medical",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which sentence is INCORRECT passive voice?",
            options: [
                { value: "a", label: "My blood was drawn yesterday." },
                { value: "c", label: "I was gave medication." },
                { value: "b", label: "The results were sent to my doctor." },
            ],
            correctAnswer: "c",
            explanation:
                "'Gave' is simple past, not past participle. Correct passive is 'I was given medication.'",
            skillTag: "avoid-wrong-past-participle",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: "Convert to passive: 'The clinic emailed the results.'",
            options: [
                { value: "b", label: "The results were email." },
                { value: "c", label: "The results are emailing." },
                { value: "a", label: "The results were emailed." },
            ],
            correctAnswer: "a",
            explanation:
                "Past passive uses were + past participle: the results were emailed.",
            skillTag: "convert-active-to-passive-medical",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "Complete: 'The prescription was written _____ Dr. Lee.'",
            options: [
                { value: "b", label: "by" },
                { value: "a", label: "for" },
                { value: "c", label: "to" },
            ],
            correctAnswer: "b",
            explanation:
                "Use by + person to show the agent (doer) in passive sentences: written by Dr. Lee.",
            skillTag: "form-passive-with-by-agent",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question:
                "You need to say exactly who did the action. Which sentence is better?",
            options: [
                { value: "a", label: "The medication was prescribed." },
                { value: "b", label: "Dr. Patel prescribed the medication." },
                { value: "c", label: "The medication prescribed." },
            ],
            correctAnswer: "b",
            explanation:
                "When the doer matters, active voice is clearer: 'Dr. Patel prescribed the medication.'",
            skillTag: "choose-active-when-doer-important",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question:
                'What tense is this passive sentence? "Your appointment has been scheduled."',
            options: [
                { value: "a", label: "Present Simple Passive" },
                { value: "c", label: "Past Simple Passive" },
                { value: "b", label: "Present Perfect Passive" },
            ],
            correctAnswer: "b",
            explanation:
                "'Has been scheduled' is present perfect passive (has/have been + past participle).",
            skillTag: "identify-present-perfect-passive",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "What is the past participle of 'write'?",
            options: [
                { value: "b", label: "written" },
                { value: "a", label: "wrote" },
                { value: "c", label: "writed" },
            ],
            correctAnswer: "b",
            explanation:
                "Write → wrote → written. 'Written' is the past participle used in passive voice.",
            skillTag: "irregular-past-participle-write",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question:
                "Complete the question: '_____ your insurance card checked at the front desk?'",
            options: [
                { value: "b", label: "Did" },
                { value: "a", label: "Was" },
                { value: "c", label: "Is" },
            ],
            correctAnswer: "a",
            explanation:
                "Past passive question uses was/were + subject + past participle: Was your insurance card checked?",
            skillTag: "question-form-past-passive",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Complete: 'The referral _____ sent yet.'",
            options: [
                { value: "b", label: "didn't" },
                { value: "c", label: "isn't" },
                { value: "a", label: "hasn't been" },
            ],
            correctAnswer: "a",
            explanation:
                "Present perfect passive negative: hasn't been + past participle → hasn't been sent yet.",
            skillTag: "negative-present-perfect-passive",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question:
                'Why is passive voice used here? "Your temperature will be taken."',
            options: [
                {
                    value: "a",
                    label:
                        "To focus on what happens to the patient, not who does it",
                },
                { value: "b", label: "Because passive is always more correct" },
                { value: "c", label: "To hide information from patients" },
            ],
            correctAnswer: "a",
            explanation:
                "In medical instructions, the action (what happens to you) is more important than the person doing it.",
            skillTag: "reason-use-passive-medical-context",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "Which sentence is correct passive voice?",
            options: [
                { value: "b", label: "The test was performed yesterday." },
                { value: "a", label: "The test performed yesterday." },
                { value: "c", label: "The test was perform yesterday." },
            ],
            correctAnswer: "b",
            explanation:
                "Passive needs be + past participle: was performed (not perform).",
            skillTag: "avoid-missing-be-or-base-form",
            difficulty: "easy",
        },
        {
            id: "quiz-16",
            question:
                "Which sentence is a good example of passive voice in a clinic sign?",
            options: [
                {
                    value: "a",
                    label: "Patients must arrive early.",
                },
                {
                    value: "b",
                    label: "Patients must be checked in 15 minutes before appointment.",
                },
                {
                    value: "c",
                    label: "The front desk checks in patients.",
                },
            ],
            correctAnswer: "b",
            explanation:
                "Sentence b uses must be + past participle and focuses on what happens to patients, which is typical for clinic signs.",
            skillTag: "identify-passive-medical-signs",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Passive Voice Mini Quiz

    This mini quiz checks whether students can:
    - Recognize passive voice in medical sentences and clinic language.
    - Form present, past, future, and modal passive correctly (be + past participle).
    - Use irregular past participles correctly in passive (drawn, given, written, etc.).
    - Understand when passive is appropriate (focus on action/receiver) and when active is better (doer is important).
    - Avoid common errors: missing "be", wrong tense of "be", wrong past participle, or unnatural overuse of passive.

    Skill tags:

    Identifying passive vs active
    - identify-passive-basic
    - identify-passive-medical-signs
    - choose-active-when-doer-important
    - reason-use-passive-medical-context

    Forming passive in different tenses
    - form-present-simple-passive-medical
    - form-past-simple-passive-medical
    - form-future-passive-medical
    - form-modal-passive-medical
    - convert-active-to-passive-medical
    - form-passive-with-by-agent

    Irregular past participles and aspect
    - irregular-past-participle-write
    - identify-present-perfect-passive
    - negative-present-perfect-passive
    - question-form-past-passive

    Common error patterns
    - avoid-wrong-past-participle
    - avoid-missing-be-or-base-form

    How to read the diagnostics:
    - If basic identification tags are weak (identify-passive-basic, identify-passive-medical-signs, reason-use-passive-medical-context) →
      Revisit the core contrast:
      • Active: subject does the action (The nurse drew my blood).
      • Passive: subject receives the action (My blood was drawn).
      Highlight subject, verb, and object in pairs of sentences and ask: Who does the action? Who receives it?

    - If tense/form tags are weak (form-present-simple-passive-medical, form-past-simple-passive-medical, form-future-passive-medical, form-modal-passive-medical, convert-active-to-passive-medical, form-passive-with-by-agent) →
      Build a passive mini-chart on the board using medical examples:
      • Present: is/are + past participle (Forms are checked).
      • Past: was/were + past participle (My ID was checked).
      • Future: will be + past participle (You will be called).
      • Modal: must/should/can + be + past participle (This form must be completed).
      Then do quick transformations: give an active sentence and have students say the passive version aloud before writing.

    - If irregular participle and aspect tags are weak (irregular-past-participle-write, identify-present-perfect-passive, negative-present-perfect-passive, question-form-past-passive) →
      Focus on a small irregular list that actually appears in medical English:
      • draw → drawn, give → given, write → written, send → sent, tell → told.
      Practice short substitution drills:
      • My blood was ____ yesterday. (drawn)
      • The note has been ____ for you. (written)
      • The results have not been ____ yet. (sent)

    - If error-pattern tags are weak (avoid-wrong-past-participle, avoid-missing-be-or-base-form) →
      Use "fix the sentence" activities:
      • The test performed yesterday. → The test was performed yesterday.
      • I was gave medication. → I was given medication.
      Ask students to circle the form of "be" and underline the past participle in each corrected sentence.

    - If "choose-active-when-doer-important" is weak →
      Contrast pairs:
      • Passive: The medication was prescribed. (Who?)
      • Active: Dr. Patel prescribed the medication. (Clear doer.)
      Have students decide: clinic sign or conversation with the doctor? Then choose active or passive.

    Suggested use:
    - Use this mini quiz after students have worked through:
      • Active vs passive section.
      • Forming passive in different tenses.
      • Medical context examples and common mistakes.
    - At the class level:
      • If identification is red but form is green → spend more time reading and noticing passive in real patient portal messages, signs, and labels.
      • If form is red (especially modals and future) → slow down and do more controlled transformation drills before freer production.
      • If error tags are red → integrate quick warm-ups where students correct 3–4 passive mistakes at the start of class using real medical-style sentences.
    */
};
