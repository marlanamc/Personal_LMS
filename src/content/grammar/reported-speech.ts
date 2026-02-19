import type { InteractiveGuideContent } from "@/types/activity";

export const reportedSpeechContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Reported Speech: Communicating Messages",
            icon: "💬",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"The doctor said I need to rest." "The nurse told me to take this medicine twice a day." "They asked me to fast before the test." Reported speech helps you communicate what someone else said or asked you to do. This is essential for medical appointments, MyChart messages, and workplace communication.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Reported speech is critical for:</p>
                <ul>
                    <li><strong>Medical communication:</strong> "The doctor said my test results were normal."</li>
                    <li><strong>MyChart messages:</strong> "They told me to schedule a follow-up."</li>
                    <li><strong>Phone calls:</strong> "The receptionist said my appointment is on Friday."</li>
                    <li><strong>Workplace:</strong> "My boss told me to submit the report by Monday."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-intro-1",
                    title: "Practice: Understanding Reported Speech",
                    instructions: "Identify what reported speech is used for.",
                    items: [
                        {
                            type: "radio",
                            label: "What is reported speech?",
                            options: [
                                { value: "b", label: "Speaking directly to someone" },
                                { value: "a", label: "Telling someone what another person said or asked" },
                                { value: "c", label: "Asking questions" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses reported speech?",
                            options: [
                                { value: "b", label: "The doctor said, 'You need to rest.'" },
                                { value: "c", label: "Rest!" },
                                { value: "a", label: "The doctor said I need to rest." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Why is reported speech important?",
                            options: [
                                { value: "a", label: "It's used in medical communication, messages, phone calls, and workplace" },
                                { value: "b", label: "It's only used in formal writing" },
                                { value: "c", label: "It's rarely used" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "direct-vs-reported",
            stepNumber: 1,
            title: "Direct Speech vs Reported Speech",
            icon: "🔀",
            explanation: `
                <h3>What's the Difference?</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">Direct Speech</h4>
                    <p><strong>Exact words someone said</strong> (using quotation marks)</p>
                    <ul>
                        <li>The doctor said, <strong>"You need to rest."</strong></li>
                        <li>The nurse said, <strong>"Take this medicine twice a day."</strong></li>
                        <li>She said, <strong>"I will call you tomorrow."</strong></li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">Reported Speech (Indirect Speech)</h4>
                    <p><strong>Telling someone what was said</strong> (NO quotation marks, tenses change)</p>
                    <ul>
                        <li>The doctor said <strong>I needed to rest</strong>.</li>
                        <li>The nurse told me <strong>to take this medicine twice a day</strong>.</li>
                        <li>She said <strong>she would call me tomorrow</strong>.</li>
                    </ul>
                </div>

                <h3>Key Changes in Reported Speech</h3>
                <ol>
                    <li><strong>NO quotation marks</strong></li>
                    <li><strong>Tenses shift back</strong> (present → past, will → would, etc.)</li>
                    <li><strong>Pronouns change</strong> (I → he/she, you → I/me, etc.)</li>
                    <li><strong>Time words change</strong> (today → that day, tomorrow → the next day)</li>
                </ol>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Direct speech = exact quote. Reported speech = retelling what was said (tenses shift back in time).",
            },
            exercises: [
                {
                    id: "direct-vs-reported-1",
                    title: "Practice: Direct vs Reported Speech",
                    instructions: "Identify whether each sentence is direct speech or reported speech.",
                    items: [
                        {
                            type: "radio",
                            label: '"The doctor <span class=\'eg-verb\'>said</span>, \'You need to rest.\'"',
                            options: [
                                { value: "reported", label: "Reported speech - retelling without quotation marks" },
                                { value: "direct", label: "Direct speech - exact words with quotation marks" },
                            ],
                            expectedAnswer: "direct",
                        },
                        {
                            type: "radio",
                            label: '"The doctor <span class=\'eg-verb\'>said</span> I <span class=\'eg-verb\'>needed</span> to rest."',
                            options: [
                                { value: "reported", label: "Reported speech - retelling, tenses changed" },
                                { value: "direct", label: "Direct speech - exact words" },
                            ],
                            expectedAnswer: "reported",
                        },
                        {
                            type: "radio",
                            label: "What changes when converting direct to reported speech?",
                            options: [
                                { value: "a", label: "No quotation marks, tenses shift back, pronouns change, time words change" },
                                { value: "b", label: "Nothing changes" },
                                { value: "c", label: "Only punctuation changes" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "say-vs-tell",
            stepNumber: 2,
            title: "Say vs Tell",
            icon: "🗣️",
            explanation: `
                <h3>The Difference Between SAY and TELL</h3>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #7ba884;">SAY (no indirect object)</h4>
                    <p style="font-weight: bold;">Subject + said + (that) + statement</p>
                    <ul>
                        <li>The doctor <strong>said</strong> (that) I need to rest.</li>
                        <li>She <strong>said</strong> (that) she would call me.</li>
                        <li>They <strong>said</strong> (that) the test results were normal.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ DON'T use "to" after "said"</p>
                    <p>❌ "She said <strong>to me</strong> that..." → ✅ "She said that..." OR "She told me that..."</p>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4 style="color: #d97757;">TELL (requires indirect object)</h4>
                    <p style="font-weight: bold;">Subject + told + (me/you/him/her/us/them) + (that) + statement</p>
                    <ul>
                        <li>The doctor <strong>told me</strong> (that) I needed to rest.</li>
                        <li>She <strong>told me</strong> (that) she would call me.</li>
                        <li>They <strong>told us</strong> (that) the results were normal.</li>
                    </ul>
                    <p style="margin-top: 1rem; font-style: italic;">⚠️ You MUST say who was told</p>
                    <p>❌ "She told that..." → ✅ "She told <strong>me</strong> that..."</p>
                </div>

                <h3>Quick Comparison</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Say</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tell</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said (that) he was sick.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He told me (that) he was sick.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said (that) the test is ready.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She told us (that) the test was ready.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They said (that) I need to fast.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">They told me (that) I needed to fast.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "reported-speech-say-vs-tell-1",
                    title: "Practice: Say vs Tell",
                    instructions: "Choose the correct form (say or tell) for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "The doctor said to me that I need to rest." },
                                { value: "a", label: "The doctor said that I need to rest." },
                                { value: "c", label: "The doctor said me that I need to rest." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "She told that she would call." },
                                { value: "c", label: "She told to me that she would call." },
                                { value: "a", label: "She told me that she would call." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the main difference between 'say' and 'tell'?",
                            options: [
                                { value: "a", label: "'Say' doesn't need an indirect object; 'tell' requires one, like me/you/him/her/us/them." },
                                { value: "b", label: "'Say' is only for questions; 'tell' is for statements" },
                                { value: "c", label: "They mean the same thing and can be used interchangeably" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly uses 'say'?",
                            options: [
                                { value: "b", label: "They said me that the test results were normal." },
                                { value: "a", label: "They said that the test results were normal." },
                                { value: "c", label: "They said to us that the test results were normal." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "tense-backshifting",
            stepNumber: 3,
            title: "Tense Backshifting",
            icon: "⏮️",
            explanation: `
                <h3>How Tenses Change in Reported Speech</h3>
                <p>When reporting what someone said in the past, tenses "shift back" one step:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Direct Speech (Exact Quote)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Reported Speech</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>am</strong> tired." (present simple)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said she <strong>was</strong> tired. (past simple)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>have</strong> a headache." (present simple)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>had</strong> a headache. (past simple)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>am working</strong>." (present continuous)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>was working</strong>. (past continuous)</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>will</strong> call you." (future)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">She said she <strong>would</strong> call me. (conditional)</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"I <strong>can</strong> help." (modal)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">He said he <strong>could</strong> help.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">"You <strong>must</strong> rest." (modal)</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">The doctor said I <strong>had to</strong> rest.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Pronouns & Time Words Also Change</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Pronouns</h4>
                    <ul>
                        <li><strong>I</strong> → he/she</li>
                        <li><strong>you</strong> → I/me</li>
                        <li><strong>we</strong> → they</li>
                        <li><strong>my</strong> → his/her</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Example:</strong></p>
                    <p>Direct: The doctor said, "<strong>You</strong> need to take <strong>your</strong> medicine."</p>
                    <p>Reported: The doctor said <strong>I</strong> needed to take <strong>my</strong> medicine.</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Time Words</h4>
                    <ul>
                        <li><strong>today</strong> → that day</li>
                        <li><strong>tomorrow</strong> → the next day</li>
                        <li><strong>yesterday</strong> → the day before</li>
                        <li><strong>now</strong> → then</li>
                        <li><strong>next week</strong> → the following week</li>
                    </ul>
                    <p style="margin-top: 0.75rem;"><strong>Example:</strong></p>
                    <p>Direct: "Come back <strong>tomorrow</strong>."</p>
                    <p>Reported: She told me to come back <strong>the next day</strong>.</p>
                </div>
            `,
            tipBox: {
                title: "⚠️ Exception",
                content: "If something is still true NOW, you don't have to backshift: 'She said she lives in East Boston' (still true) vs 'She said she lived in East Boston' (past/not sure).",
            },
            exercises: [
                {
                    id: "reported-speech-tense-backshifting-1",
                    title: "Practice: Tense Backshifting",
                    instructions: "Choose the correct reported speech form with proper tense backshifting.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "I am on the late shift." Reported:',
                            options: [
                                { value: "b", label: "He said he is on the late shift." },
                                { value: "c", label: "He said he will be on the late shift." },
                                { value: "a", label: "He said he was on the late shift." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I will email you tomorrow." Reported:',
                            options: [
                                { value: "a", label: "She said she would email me the next day." },
                                { value: "b", label: "She said she will email me tomorrow." },
                                { value: "c", label: "She said she could email me the next day." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I can meet you now." Reported:',
                            options: [
                                { value: "b", label: "They said they can meet me now." },
                                { value: "a", label: "They said they could meet me then." },
                                { value: "c", label: "They said they would meet me then." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What happens to tenses in reported speech?",
                            options: [
                                { value: "b", label: "Tenses stay the same as in direct speech" },
                                { value: "c", label: "Tenses always become past perfect" },
                                { value: "a", label: "Tenses shift back one step, like present → past and will → would." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "reported-commands",
            stepNumber: 4,
            title: "Reported Commands & Requests",
            icon: "📋",
            explanation: `
                <h3>Reporting Commands, Instructions, and Requests</h3>
                <p>Use <strong>told/asked + person + to + verb</strong> to report commands and requests.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula for Commands:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">told + me/you/him/her + to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Direct: "Take this medicine twice a day."</li>
                        <li>Reported: The doctor <strong>told me to take</strong> this medicine twice a day.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Rest for a week."</li>
                        <li>Reported: The nurse <strong>told me to rest</strong> for a week.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Don't eat before the test."</li>
                        <li>Reported: They <strong>told me not to eat</strong> before the test.</li>
                    </ul>
                </div>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula for Requests:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">asked + me/you/him/her + to + base verb</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li>Direct: "Please fill out this form."</li>
                        <li>Reported: The receptionist <strong>asked me to fill out</strong> the form.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Can you call us back?"</li>
                        <li>Reported: They <strong>asked me to call</strong> them back.</li>
                    </ul>
                    <ul>
                        <li>Direct: "Please don't bring food."</li>
                        <li>Reported: The sign <strong>asked us not to bring</strong> food.</li>
                    </ul>
                </div>

                <h3>Negative Commands</h3>
                <p>Use <strong>told/asked + person + NOT to + verb</strong></p>
                <ul>
                    <li>Direct: "Don't drive after taking this medication."</li>
                    <li>Reported: The pharmacist <strong>told me not to drive</strong> after taking the medication.</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-commands-requests-1",
                    title: "Practice: Reported Commands & Requests",
                    instructions: "Choose the correct reported speech form for commands and requests.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "Please bring your ID." Reported:',
                            options: [
                                { value: "a", label: "The receptionist asked me to bring my ID." },
                                { value: "b", label: "The receptionist asked me bring my ID." },
                                { value: "c", label: "The receptionist said me to bring my ID." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Call us back after 3 PM." Reported:',
                            options: [
                                { value: "b", label: "They asked me call them back after 3 PM." },
                                { value: "a", label: "They asked me to call them back after 3 PM." },
                                { value: "c", label: "They said me to call them back after 3 PM." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Don\'t park in front of the driveway." Reported:',
                            options: [
                                { value: "b", label: "The building manager told us don't park in front of the driveway." },
                                { value: "c", label: "The building manager said us not to park in front of the driveway." },
                                { value: "a", label: "The building manager told us not to park in front of the driveway." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for reporting commands?",
                            options: [
                                { value: "a", label: "told/asked + person + to + base verb" },
                                { value: "b", label: "told/asked + to + base verb, no person needed" },
                                { value: "c", label: "said + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "medical-contexts",
            stepNumber: 5,
            title: "Medical Communication Contexts",
            icon: "🏥",
            explanation: `
                <h3>MyChart Messages</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">Sample MyChart Message:</p>
                    <p style="font-style: italic; background: rgba(110, 145, 118, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"Your test results are normal. Please schedule a follow-up appointment in 3 months."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>They said my test results <strong>were</strong> normal.</li>
                        <li>They told me <strong>to schedule</strong> a follow-up in 3 months.</li>
                    </ul>
                </div>

                <h3>Phone Calls from Clinic</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757; margin: 0 0 0.5rem 0;">Receptionist Says:</p>
                    <p style="font-style: italic; background: rgba(200, 107, 81, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"Your appointment is on Friday at 2pm. Please arrive 15 minutes early."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>She said my appointment <strong>was</strong> on Friday at 2pm.</li>
                        <li>She told me <strong>to arrive</strong> 15 minutes early.</li>
                    </ul>
                </div>

                <h3>Doctor's Instructions</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d4a843; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d4a843; margin: 0 0 0.5rem 0;">Doctor Says:</p>
                    <p style="font-style: italic; background: rgba(244, 211, 94, 0.1); padding: 0.75rem; border-radius: 0.25rem;">"You need to rest for one week. Don't lift anything heavy. Come back if you have any pain."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>The doctor said I <strong>needed to rest</strong> for one week.</li>
                        <li>She told me <strong>not to lift</strong> anything heavy.</li>
                        <li>She told me <strong>to come back</strong> if I had any pain.</li>
                    </ul>
                </div>

                <h3>Pharmacy Instructions</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; margin: 0 0 0.5rem 0;">Pharmacist Says:</p>
                    <p style="font-style: italic;">"Take this medication with food. You can't drink alcohol while taking it."</p>
                    <p style="margin-top: 0.75rem;"><strong>How to report this:</strong></p>
                    <ul style="margin: 0;">
                        <li>The pharmacist told me <strong>to take</strong> the medication with food.</li>
                        <li>She said I <strong>couldn't drink</strong> alcohol while taking it.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "reported-speech-medical-contexts-1",
                    title: "Practice: Medical Communication Contexts",
                    instructions: "Convert direct speech to reported speech in medical contexts.",
                    items: [
                        {
                            type: "radio",
                            label: 'MyChart message: "Your x-ray results are ready. Please schedule a call with the doctor next week." How do you report this?',
                            options: [
                                { value: "b", label: "They said my x-ray results are ready and told me schedule a call next week." },
                                { value: "a", label: "They said my x-ray results were ready and told me to schedule a call with the doctor the following week." },
                                { value: "c", label: "They said to me that my x-ray results were ready and told me to schedule a call." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Receptionist says: "Your appointment is on Tuesday at 9 AM. Please bring your insurance card." How do you report this?',
                            options: [
                                { value: "b", label: "She said my appointment is on Tuesday at 9 AM and told me bring my insurance card." },
                                { value: "c", label: "She told that my appointment was on Tuesday and told me to bring my insurance card." },
                                { value: "a", label: "She said my appointment was on Tuesday at 9 AM and told me to bring my insurance card." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Doctor says: "You must fast today. Come back tomorrow morning." How do you report this?',
                            options: [
                                { value: "a", label: "The doctor said I had to fast that day and told me to come back the next morning." },
                                { value: "b", label: "The doctor said I must fast today and told me come back tomorrow morning." },
                                { value: "c", label: "The doctor said to me that I had to fast and told me to come back." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Pharmacist says: "Take this medication at night. You can\'t drive after taking it." How do you report this?',
                            options: [
                                { value: "b", label: "The pharmacist told me take the medication at night and said I can't drive after taking it." },
                                { value: "a", label: "The pharmacist told me to take the medication at night and said I couldn't drive after taking it." },
                                { value: "c", label: "The pharmacist said to me to take the medication and said I can't drive." },
                            ],
                            expectedAnswer: "a",
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
                <h3>Mistake #1: Using "to" with "said"</h3>
                <ul>
                    <li>❌ "She said <strong>to me</strong> that..." → ✅ "She said that..." OR "She told me that..."</li>
                </ul>

                <h3>Mistake #2: Forgetting the object with "told"</h3>
                <ul>
                    <li>❌ "He told that he was sick." → ✅ "He told <strong>me</strong> that he was sick."</li>
                </ul>

                <h3>Mistake #3: Not backshifting tenses</h3>
                <ul>
                    <li>❌ "She said she <strong>is</strong> tired." → ✅ "She said she <strong>was</strong> tired."</li>
                    <li>❌ "He said he <strong>will</strong> call." → ✅ "He said he <strong>would</strong> call."</li>
                </ul>

                <h3>Mistake #4: Wrong structure for commands</h3>
                <ul>
                    <li>❌ "She told me <strong>that</strong> take the medicine." → ✅ "She told me <strong>to take</strong> the medicine."</li>
                    <li>❌ "They said me <strong>to</strong> come back." → ✅ "They told me <strong>to</strong> come back."</li>
                </ul>

                <h3>Mistake #5: Not changing pronouns</h3>
                <ul>
                    <li>❌ "The doctor said <strong>you</strong> need rest." → ✅ "The doctor said <strong>I</strong> needed rest."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "reported-speech-common-mistakes-1",
                    title: "Practice: Common Reported Speech Mistakes",
                    instructions: "Identify and correct common mistakes in reported speech.",
                    items: [
                        {
                            type: "radio",
                            label: "What is Mistake #1?",
                            options: [
                                { value: "b", label: "Using 'told' incorrectly" },
                                { value: "c", label: "Not using enough words" },
                                { value: "a", label: "Using 'to' with 'said' - 'She said to me that...' should be 'She said that...' or 'She told me that...'" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #2?",
                            options: [
                                { value: "a", label: "Forgetting the object with 'told' - 'He told that...' should be 'He told me that...'" },
                                { value: "b", label: "Using 'said' instead of 'told'" },
                                { value: "c", label: "Using too many words" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #3?",
                            options: [
                                { value: "b", label: "Using wrong pronouns" },
                                { value: "a", label: "Not backshifting tenses: 'She said she is tired' should be 'She said she was tired'." },
                                { value: "c", label: "Using active voice" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is Mistake #4?",
                            options: [
                                { value: "b", label: "Using 'said' instead of 'told'" },
                                { value: "c", label: "Not changing pronouns" },
                                { value: "a", label: "Wrong structure for commands: 'She told me that take...' should be 'She told me to take...'." },
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
                    id: "reported-speech-ex-1",
                    title: "Exercise 1: Report a Statement",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: My supervisor <span class=\'eg-verb\'>said</span>, "We <span class=\'eg-helper\'>are</span> short-staffed today."',
                            options: [
                                { value: "b", label: "My supervisor said we were short-staffed that day." },
                                { value: "a", label: "My supervisor said we are short-staffed today." },
                                { value: "c", label: "My supervisor told that we were short-staffed that day." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-2",
                    title: "Exercise 2: Report a Command (Tell + To)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: The front desk <span class=\'eg-verb\'>said</span>, "Please <span class=\'eg-verb\'>bring</span> your ID."',
                            options: [
                                { value: "b", label: "The front desk said me to bring my ID." },
                                { value: "a", label: "The front desk asked me to bring my ID." },
                                { value: "c", label: "The front desk told bring my ID." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-3",
                    title: "Exercise 3: Will → Would",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: She <span class=\'eg-verb\'>said</span>, "I <span class=\'eg-helper\'>will</span> email you tomorrow."',
                            options: [
                                { value: "a", label: "She said she will email me tomorrow." },
                                { value: "c", label: "She told me that I would email her tomorrow." },
                                { value: "b", label: "She said she would email me the next day." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-4",
                    title: "Exercise 4: Fix the Error",
                    instructions: 'Fix the sentence (no "to me" after "said").',
                    items: [
                        {
                            type: "radio",
                            label: 'Fix: "He said to me that the meeting was canceled."',
                            options: [
                                { value: "a", label: "He said that the meeting was canceled." },
                                { value: "b", label: "He said to me that the meeting was canceled." },
                                { value: "c", label: "He told that the meeting was canceled." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-5",
                    title: "Exercise 5: Negative Command",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: IT said, "Don\'t share your password."',
                            options: [
                                { value: "b", label: "IT said us not share our password." },
                                { value: "a", label: "IT told us not to share our password." },
                                { value: "c", label: "IT told us that don't share our password." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-6",
                    title: "Exercise 6: Present → Past (Backshift)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: The receptionist said, "Your badge is ready."',
                            options: [
                                { value: "a", label: "The receptionist said my badge is ready." },
                                { value: "c", label: "The receptionist told my badge was ready." },
                                { value: "b", label: "The receptionist said my badge was ready." },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-7",
                    title: "Exercise 7: Say vs Tell",
                    instructions: "Choose the correct answer.",
                    items: [
                        {
                            type: "radio",
                            label: 'Which are correct? A) "He said that he was late." B) "He told me that he was late." C) "He said me that he was late."',
                            options: [
                                { value: "a", label: "A only" },
                                { value: "d", label: "A and B" },
                                { value: "b", label: "B only" },
                                { value: "c", label: "C only" },
                            ],
                            expectedAnswer: "d",
                        },
                    ],
                },
                {
                    id: "reported-speech-ex-8",
                    title: "Exercise 8: Ask + To (Polite Request)",
                    instructions: "Choose the best reported speech sentence.",
                    items: [
                        {
                            type: "radio",
                            label: 'Direct: "Please sign this form."',
                            options: [
                                { value: "b", label: "The clerk said me to sign this form." },
                                { value: "a", label: "The clerk asked me to sign this form." },
                                { value: "c", label: "The clerk asked me that I sign this form." },
                            ],
                            expectedAnswer: "a",
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
                <h3>Say vs Tell</h3>
                <ul>
                    <li><strong>Say:</strong> said (that) + statement (no person)</li>
                    <li><strong>Tell:</strong> told + me/you/him/her + (that) + statement</li>
                </ul>

                <h3>Reporting Statements</h3>
                <p>Subject + said/told + (that) + statement with backshifted tense</p>
                <ul>
                    <li>Direct: "I am tired." → Reported: She said she <strong>was</strong> tired.</li>
                    <li>Direct: "I will call you." → Reported: He said he <strong>would</strong> call me.</li>
                </ul>

                <h3>Reporting Commands/Requests</h3>
                <p><strong>told/asked + person + to + base verb</strong></p>
                <ul>
                    <li>Direct: "Take this medicine." → Reported: She told me <strong>to take</strong> the medicine.</li>
                    <li>Direct: "Please wait." → Reported: She asked me <strong>to wait</strong>.</li>
                    <li>Direct: "Don't drive." → Reported: He told me <strong>not to drive</strong>.</li>
                </ul>

                <h3>Tense Backshifting</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Direct</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Reported</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">am/is/are</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">was/were</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">will</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">would</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">can</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">could</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">must</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">had to</td>
                        </tr>
                    </tbody>
                </table>
            `,
            tipBox: {
                title: "💡 Remember",
                content: "Say = no person needed. Tell = person required. Commands/requests = told/asked + person + to + verb.",
            },
            exercises: [
                {
                    id: "reported-speech-quick-reference-1",
                    title: "Practice: Quick Reference Review",
                    instructions: "Test your understanding of reported speech rules.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the correct structure for 'say'?",
                            options: [
                                { value: "b", label: "said + me + that + statement" },
                                { value: "c", label: "said to me + that + statement" },
                                { value: "a", label: "said that + statement; no person needed" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the correct structure for 'tell'?",
                            options: [
                                { value: "a", label: "told + me/you/him/her/us/them + that + statement; person required" },
                                { value: "b", label: "told that + statement" },
                                { value: "c", label: "told to me + that + statement" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for reporting commands?",
                            options: [
                                { value: "b", label: "told/asked + person + that + base verb" },
                                { value: "a", label: "told/asked + person + to + base verb" },
                                { value: "c", label: "said + person + to + base verb" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "I am on the late shift." Reported:',
                            options: [
                                { value: "b", label: "He said he is on the late shift." },
                                { value: "c", label: "He told that he was on the late shift." },
                                { value: "a", label: "He said he was on the late shift." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: 'Direct: "Please bring your ID." Reported:',
                            options: [
                                { value: "a", label: "The receptionist asked me to bring my ID." },
                                { value: "b", label: "The receptionist asked me bring my ID." },
                                { value: "c", label: "The receptionist said me to bring my ID." },
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
            question: "Which sentence correctly uses tell?",
            options: [
                { value: "a", label: "My supervisor told that the meeting was canceled." },
                { value: "b", label: "My supervisor told me that the meeting was canceled." },
                { value: "c", label: "My supervisor told to me that the meeting was canceled." },
            ],
            correctAnswer: "b",
            explanation: "'Tell' needs a person/object (me/you/us).",
            skillTag: "say-vs-tell-tell-with-object",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Which sentence correctly uses say?",
            options: [
                { value: "a", label: "She said me that the office was closed." },
                { value: "c", label: "She said to me that the office was closed." },
                { value: "b", label: "She said that the office was closed." },
            ],
            correctAnswer: "b",
            explanation: "'Say' does not take an indirect object in this pattern. Use 'said that...' or change to 'told me that...'.",
            skillTag: "say-vs-tell-say-with-that",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: 'Convert: "I am on the late shift." → He said _____.',
            options: [
                { value: "b", label: "he was on the late shift" },
                { value: "a", label: "he is on the late shift" },
                { value: "c", label: "I was on the late shift" },
            ],
            correctAnswer: "b",
            explanation: "Present am changes to past was in reported speech when we report from the past.",
            skillTag: "backshift-present-be-to-past",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: 'Convert: "I will email you tomorrow." → She said _____.',
            options: [
                { value: "a", label: "she will email me tomorrow" },
                { value: "b", label: "she would email me the next day" },
                { value: "c", label: "I would email you tomorrow" },
            ],
            correctAnswer: "b",
            explanation: "Will usually becomes would, and tomorrow becomes the next day in reported speech.",
            skillTag: "backshift-will-to-would-time-tomorrow-next-day",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question: 'Convert: "Please sign this form." → The clerk asked me _____.',
            options: [
                { value: "b", label: "that sign this form" },
                { value: "c", label: "sign this form" },
                { value: "a", label: "to sign this form" },
            ],
            correctAnswer: "a",
            explanation: "Commands and requests use asked/told + person + to + base verb.",
            skillTag: "reported-command-asked-person-to-verb",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: 'Convert: "Don\'t park here." → The manager told us _____.',
            options: [
                { value: "b", label: "not to park here" },
                { value: "a", label: "to not park here" },
                { value: "c", label: "don\'t park here" },
            ],
            correctAnswer: "b",
            explanation: "Negative commands use told/asked + person + not to + base verb.",
            skillTag: "reported-command-negative-not-to-verb",
            difficulty: "medium",
        },
        {
            id: "quiz-7",
            question: 'Convert: "I can help you." → She said _____.',
            options: [
                { value: "a", label: "she can help me" },
                { value: "b", label: "she could help me" },
                { value: "c", label: "she will help me" },
            ],
            correctAnswer: "b",
            explanation: "Can usually becomes could in reported speech when backshifting.",
            skillTag: "backshift-can-to-could",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: 'Convert: "You must bring your ID." → The receptionist said _____.',
            options: [
                { value: "a", label: "I must bring my ID" },
                { value: "c", label: "I have to bring my ID" },
                { value: "b", label: "I had to bring my ID" },
            ],
            correctAnswer: "b",
            explanation: "Must often changes to had to in reported speech.",
            skillTag: "backshift-must-to-had-to",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: 'Pronoun change: The teacher said, "You are late." → The teacher said _____.',
            options: [
                { value: "b", label: "I was late" },
                { value: "a", label: "you were late" },
                { value: "c", label: "she was late" },
            ],
            correctAnswer: "b",
            explanation: "When the speaker reports about themselves, you changes to I and the verb shifts to was.",
            skillTag: "pronoun-change-you-to-I",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: 'Time word change: "I can meet you today." → He said he could meet me _____.',
            options: [
                { value: "a", label: "today" },
                { value: "b", label: "that day" },
                { value: "c", label: "the next day" },
            ],
            correctAnswer: "b",
            explanation: "Today usually changes to that day in reported speech.",
            skillTag: "time-word-today-to-that-day",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: "Which sentence is incorrect?",
            options: [
                { value: "a", label: "He said that he was sick." },
                { value: "c", label: "He told me that he was sick." },
                { value: "b", label: "He said to me that he was sick." },
            ],
            correctAnswer: "b",
            explanation: "Avoid said to me that in this structure. Use said that or told me that.",
            skillTag: "avoid-said-to-me-that",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: 'Convert: "We are closed now." → They said _____.',
            options: [
                { value: "a", label: "we were closed then" },
                { value: "b", label: "they were closed now" },
                { value: "c", label: "we are closed then" },
            ],
            correctAnswer: "a",
            explanation: "If the same group reports the message, we can keep we. Now usually changes to then, and are changes to were.",
            skillTag: "backshift-present-to-past-with-now-then",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "If the information is still true now, which is best?",
            options: [
                { value: "a", label: "She said class started at 6 PM. (It is still true.)" },
                { value: "b", label: "She said class starts at 6 PM. (It is still true.)" },
                { value: "c", label: "She said class will start at 6 PM. (It is still true.)" },
            ],
            correctAnswer: "b",
            explanation: "If something is still true now, we can keep the present simple in reported speech.",
            skillTag: "no-backshift-still-true-exception",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: 'Message: "Your paperwork is incomplete. Please bring it tomorrow." Which is best?',
            options: [
                { value: "b", label: "They said my paperwork is incomplete and told me bring it tomorrow." },
                { value: "c", label: "They told that my paperwork was incomplete and said me to bring it the next day." },
                { value: "a", label: "They said my paperwork was incomplete and told me to bring it the next day." },
            ],
            correctAnswer: "a",
            explanation: "Is becomes was, tomorrow becomes the next day, and told needs a person plus to verb.",
            skillTag: "reported-speech-message-backshift-and-command",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: 'Convert: "I don\'t mind working late." → He said _____.',
            options: [
                { value: "b", label: "he didn\'t mind working late" },
                { value: "a", label: "he doesn\'t mind working late" },
                { value: "c", label: "he wouldn\'t mind to work late" },
            ],
            correctAnswer: "b",
            explanation: "Present simple does not mind becomes did not mind in reported speech, and mind is followed by a gerund: working.",
            skillTag: "backshift-present-simple-negative-to-past",
            difficulty: "medium",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – Reported Speech Mini Quiz

    This mini quiz checks whether students can:
    - Choose the correct structure with say and tell in reported speech.
    - Backshift tenses correctly when reporting from the past.
    - Report commands and requests with told/asked + person + to + verb and NOT to + verb.
    - Change pronouns and time words correctly.
    - Avoid common error patterns like said to me that and will or can staying in the present.
    - Apply these rules to real world messages from supervisors, clinics, receptionists, and clerks.

    Skill tags:

    Say vs tell
    - say-vs-tell-tell-with-object
    - say-vs-tell-say-with-that
    - avoid-said-to-me-that

    Backshifting tenses
    - backshift-present-be-to-past
    - backshift-will-to-would-time-tomorrow-next-day
    - backshift-can-to-could
    - backshift-must-to-had-to
    - backshift-present-to-past-with-now-then
    - backshift-present-simple-negative-to-past
    - no-backshift-still-true-exception

    Commands and requests
    - reported-command-asked-person-to-verb
    - reported-command-negative-not-to-verb
    - reported-speech-message-backshift-and-command

    Pronouns and time words
    - pronoun-change-you-to-I
    - time-word-today-to-that-day

    How to read the diagnostics:
    - If say vs tell tags are weak (say-vs-tell-tell-with-object, say-vs-tell-say-with-that, avoid-said-to-me-that) →
      Go back to the core contrast:
      • Say + that + statement, no person: She said that the office was closed.
      • Tell + person + that + statement: She told me that the office was closed.
      Use short correction drills with common mistakes:
      • She said me that... → She said that...
      • He told that... → He told me that...

    - If backshifting tags are weak (backshift-present-be-to-past, backshift-will-to-would-time-tomorrow-next-day, backshift-can-to-could, backshift-must-to-had-to, backshift-present-to-past-with-now-then, backshift-present-simple-negative-to-past) →
      Rebuild the mini chart from the guide:
      • am/is/are → was/were
      • will → would
      • can → could
      • must → had to
      • now → then, today → that day, tomorrow → the next day
      Have students work in pairs. One student says a direct sentence, the other reports it with the correct backshift. Then switch roles.

    - If the still true exception tag is weak (no-backshift-still-true-exception) →
      Practice with personal facts that are still true:
      • Direct: "Class starts at 6 PM."
      • Reported now: She said class starts at 6 PM.
      Contrast with information that is finished:
      • Direct: "We are short staffed today."
      • Reported later: She said they were short staffed that day.

    - If command and request tags are weak (reported-command-asked-person-to-verb, reported-command-negative-not-to-verb, reported-speech-message-backshift-and-command) →
      Reuse clinic and workplace examples:
      • Direct: "Please bring your ID." → Reported: She asked me to bring my ID.
      • Direct: "Do not eat before the test." → Reported: They told me not to eat before the test.
      Have students underline the person and the verb in each sentence and write their own real commands and requests from work or appointments.

    - If pronoun and time word tags are weak (pronoun-change-you-to-I, time-word-today-to-that-day) →
      Build two mini tables on the board:

      Pronouns:
      • I → he/she
      • you → I/me
      • we → they
      • my → his/her

      Time words:
      • today → that day
      • tomorrow → the next day
      • yesterday → the day before
      • now → then

      Have students transform short quotes and focus only on pronouns and time words first, then add tense changes later.

    Suggested use:
    - Use this mini quiz after students have worked through:
      • Direct vs reported speech.
      • Say vs tell.
      • Tense backshifting.
      • Reported commands and requests.
      • Pronoun and time word changes.
    - At the class level:
      • If say vs tell is red, slow down and practice with simple workplace and clinic sentences where students choose between said and told.
      • If backshifting is red, spend more time on the tense chart and oral drilling before long writing tasks.
      • If commands and requests are red, do more role plays with receptionists, doctors, supervisors, and family members using told/asked + person + to + verb.
      • If pronouns and time words are red, strip sentences down to just pronoun and time word changes until this feels automatic, then add the full reported sentences.
    */
};
