import type { InteractiveGuideContent } from "@/types/activity";

export const imperativesDeclarativesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "introduction",
      title: "Imperatives vs Declaratives: Understanding Tone in Instructions",
      icon: "🗣️",
      explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Take this medicine twice a day." vs "You should take this medicine twice a day." The difference is small, but the tone is completely different. One is a command (imperative), the other is advice (declarative). Understanding this difference is critical for medical instructions, workplace communication, and everyday interactions.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>These sentence types affect how you sound:</p>
                <ul>
                    <li><strong>Medical settings:</strong> Doctors use both: "Take this twice daily" (imperative) vs "You need to rest" (declarative)</li>
                    <li><strong>Professional communication:</strong> "Please submit the form" (polite imperative) vs "You should submit the form" (declarative)</li>
                    <li><strong>Politeness:</strong> Knowing when to use each shows cultural awareness and professionalism</li>
                </ul>
            `,
      exercises: [
        {
          id: "imperatives-declaratives-intro-1",
          title: "Practice: Understanding Tone",
          instructions:
            "Identify whether each sentence is an imperative (command) or declarative (statement/advice).",
          items: [
            {
              type: "radio",
              label:
                "\"<span class='eg-verb'>Take</span> this medicine twice a day.\"",
              options: [
                {
                  value: "imperative",
                  label: "Imperative - command/instruction",
                },
                {
                  value: "declarative",
                  label: "Declarative - statement/advice",
                },
              ],
              expectedAnswer: "imperative",
            },
            {
              type: "radio",
              label:
                "\"<span class='eg-helper'>You should</span> take this medicine twice a day.\"",
              options: [
                {
                  value: "imperative",
                  label: "Imperative - command/instruction",
                },
                {
                  value: "declarative",
                  label: "Declarative - statement/advice",
                },
              ],
              expectedAnswer: "declarative",
            },
            {
              type: "radio",
              label: "Why is understanding the difference important?",
              options: [
                {
                  value: "a",
                  label:
                    "It affects how you sound and shows cultural awareness",
                },
                { value: "b", label: "It doesn't matter which one you use" },
                { value: "c", label: "Only imperative is used in English" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    {
      id: "what-are-imperatives",
      stepNumber: 1,
      title: "Imperatives: Commands and Instructions",
      icon: "📢",
      explanation: `
                <h3>What Is an Imperative?</h3>
                <p>An <strong>imperative sentence</strong> gives a command, instruction, request, or advice. The subject (you) is understood but not stated.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">Base Verb + (object/details)</p>
                    <p style="font-style: italic; margin-top: 0.5rem;">(No subject! Start with the verb.)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li><strong>Take</strong> this medicine.</li>
                        <li><strong>Rest</strong> for 3 days.</li>
                        <li><strong>Drink</strong> plenty of water.</li>
                        <li><strong>Call</strong> the office if you have questions.</li>
                        <li><strong>Don't</strong> drive after taking this medication.</li>
                    </ul>
                </div>

                <h3>Types of Imperatives</h3>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d97757;">1. Direct Commands (Strong)</h4>
                    <p>Used by authority figures (doctors, bosses, parents):</p>
                    <ul>
                        <li><strong>Stop</strong> smoking.</li>
                        <li><strong>Take</strong> this twice a day.</li>
                        <li><strong>Come</strong> back in two weeks.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #7ba884;">2. Polite Requests ("Please")</h4>
                    <p>Softened with "please" to sound more polite:</p>
                    <ul>
                        <li><strong>Please</strong> fill out this form.</li>
                        <li><strong>Please</strong> wait here.</li>
                        <li><strong>Please</strong> call us if you need help.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4 style="color: #d4a843;">3. Negative Imperatives ("Don't")</h4>
                    <p>Tells someone NOT to do something:</p>
                    <ul>
                        <li><strong>Don't</strong> eat before the test.</li>
                        <li><strong>Don't</strong> take this on an empty stomach.</li>
                        <li><strong>Don't</strong> lift anything heavy.</li>
                    </ul>
                </div>
            `,
      tipBox: {
        title: "💡 Key Point",
        content:
          "Imperatives have NO subject (no 'you'). They start directly with the verb.",
      },
      exercises: [
        {
          id: "imperatives-1",
          title: "Practice: Identifying Imperatives",
          instructions: "Choose which sentences are imperatives.",
          items: [
            {
              type: "radio",
              label: "Which sentence is an imperative?",
              options: [
                { value: "b", label: "You take this medicine." },
                { value: "a", label: "Take this medicine." },
                { value: "c", label: "You should take this medicine." },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What makes a sentence an imperative?",
              options: [
                {
                  value: "a",
                  label:
                    "Starts with base verb, no subject (you is understood)",
                },
                { value: "b", label: "Has a subject and verb" },
                { value: "c", label: "Uses past tense" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is a negative imperative?",
              options: [
                { value: "b", label: "You don't eat before the test." },
                { value: "c", label: "You shouldn't eat before the test." },
                { value: "a", label: "Don't eat before the test." },
            ],
            expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    {
      id: "what-are-declaratives",
      stepNumber: 2,
      title: "Declaratives: Statements and Advice",
      icon: "💬",
      explanation: `
                <h3>What Is a Declarative?</h3>
                <p>A <strong>declarative sentence</strong> makes a statement. It has a subject and gives information, advice, or describes a situation.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">Subject + Verb + (object/details)</p>

                    <h4 style="margin-top: 1rem;">Examples:</h4>
                    <ul>
                        <li><strong>You need to</strong> take this medicine.</li>
                        <li><strong>You should</strong> rest for 3 days.</li>
                        <li><strong>I recommend</strong> drinking plenty of water.</li>
                        <li><strong>You have to</strong> call if you have questions.</li>
                        <li><strong>You shouldn't</strong> drive after taking this.</li>
                    </ul>
                </div>

                <h3>Common Patterns in Declaratives</h3>

                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Pattern</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Example</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Tone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You need to...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You need to rest.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Strong/Required</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You should...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You should exercise.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Advice/Suggestion</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I recommend...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I recommend this treatment.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Professional advice</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to fast before surgery.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Obligation/Necessary</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I will...</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">I will call you tomorrow.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Promise/Plan</td>
                        </tr>
                    </tbody>
                </table>
            `,
      exercises: [
        {
          id: "imperatives-declaratives-what-is-1",
          title: "Practice: Understanding Declaratives",
          instructions: "Identify declarative sentences and their patterns.",
          items: [
            {
              type: "radio",
              label: "What is a declarative sentence?",
              options: [
                {
                  value: "a",
                  label: "A sentence that makes a statement and has a subject",
                },
                {
                  value: "b",
                  label: "A sentence that gives a command without a subject",
                },
                { value: "c", label: "A sentence that asks a question" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: '"You should rest for 3 days." What pattern is this?',
              options: [
                {
                  value: "a",
                  label: "Declarative with 'should' (advice/suggestion)",
                },
                { value: "b", label: "Imperative command" },
                { value: "c", label: "Question" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label:
                '"You need to take this medicine." What tone does this express?',
              options: [
                { value: "a", label: "Strong/Required - something necessary" },
                { value: "b", label: "Polite suggestion" },
                { value: "c", label: "Optional advice" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence is a declarative?",
              options: [
                {
                  value: "a",
                  label:
                    "You have to call if you have questions. (declarative with subject)",
                },
                {
                  value: "b",
                  label: "Call if you have questions. (imperative, no subject)",
                },
                { value: "c", label: "Do you have questions? (question)" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    {
      id: "comparison",
      stepNumber: 3,
      title: "Imperatives vs Declaratives: Side by Side",
      icon: "⚖️",
      explanation: `
                <h3>Same Meaning, Different Tone</h3>
                <p>You can express the same idea with either an imperative or a declarative, but the tone changes:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Imperative (Direct)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Declarative (Indirect)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Take</strong> this twice a day.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You need to take</strong> this twice a day.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Rest</strong> for a week.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You should rest</strong> for a week.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Don't</strong> lift anything heavy.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You shouldn't</strong> lift anything heavy.</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Call</strong> if you have pain.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You should call</strong> if you have pain.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Come back</strong> in two weeks.</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>You need to come back</strong> in two weeks.</td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h4 style="color: #d4a843;">Which Should You Use?</h4>
                    <ul>
                        <li><strong>Imperatives:</strong> More common in medical instructions (prescriptions, clinic signs, doctor's orders)</li>
                        <li><strong>Declaratives:</strong> Sound more polite and less bossy in conversations</li>
                        <li><strong>In writing:</strong> Imperatives are standard (medication labels, instructions)</li>
                        <li><strong>In speaking:</strong> Declaratives sound friendlier</li>
                    </ul>
                </div>
            `,
      exercises: [
        {
          id: "imperatives-declaratives-comparison-1",
          title: "Practice: Imperatives vs Declaratives",
          instructions:
            "Identify whether each sentence is imperative or declarative, and choose the best form for different contexts.",
          items: [
            {
              type: "radio",
              label: '"Take this twice a day." What type of sentence is this?',
              options: [
                {
                  value: "a",
                  label: "Imperative - direct command/instruction",
                },
                { value: "b", label: "Declarative - statement with subject" },
                { value: "c", label: "Question" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label:
                '"You need to take this twice a day." What type of sentence is this?',
              options: [
                {
                  value: "a",
                  label: "Declarative - statement with subject 'you'",
                },
                { value: "b", label: "Imperative - command without subject" },
                { value: "c", label: "Question" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "When should you use imperatives?",
              options: [
                {
                  value: "a",
                  label:
                    "In medical instructions, prescriptions, and written instructions",
                },
                { value: "b", label: "Only in casual conversations" },
                { value: "c", label: "Never, they're too direct" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "When should you use declaratives?",
              options: [
                {
                  value: "a",
                  label:
                    "When you want to sound more polite and less bossy in conversations",
                },
                { value: "b", label: "Only in formal writing" },
                { value: "c", label: "Never, they're too indirect" },
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
      title: "Real-World Medical Contexts",
      icon: "🏥",
      explanation: `
                <h3>Prescription Labels (Imperatives)</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757; margin: 0 0 0.5rem 0;">MEDICATION INSTRUCTIONS:</p>
                    <ul style="margin: 0;">
                        <li><strong>Take</strong> 1 tablet by mouth twice daily with food.</li>
                        <li><strong>Avoid</strong> alcohol while taking this medication.</li>
                        <li><strong>Do not</strong> drive or operate heavy machinery.</li>
                        <li><strong>Finish</strong> all medication even if you feel better.</li>
                    </ul>
                </div>

                <h3>Doctor's Advice (Declaratives)</h3>
                <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">DOCTOR SPEAKING TO PATIENT:</p>
                    <ul style="margin: 0;">
                        <li>"<strong>You should</strong> take 1 tablet twice a day with food."</li>
                        <li>"<strong>I recommend</strong> avoiding alcohol while on this medication."</li>
                        <li>"<strong>You shouldn't</strong> drive after taking this."</li>
                        <li>"<strong>You need to</strong> finish all the pills, even if you feel better."</li>
                    </ul>
                </div>

                <h3>Clinic Signs (Imperatives)</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li><strong>Please</strong> check in at the front desk.</li>
                        <li><strong>Turn off</strong> your cell phone.</li>
                        <li><strong>Wash</strong> your hands before entering.</li>
                        <li><strong>Do not</strong> bring food or drinks into the exam room.</li>
                    </ul>
                </div>

                <h3>Patient to Doctor (Declaratives)</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-style: italic;">Patients usually use declaratives when speaking to doctors:</p>
                    <ul>
                        <li>"<strong>I will</strong> take it twice a day."</li>
                        <li>"<strong>I'll try to</strong> rest more."</li>
                        <li>"<strong>I need to</strong> ask about the side effects."</li>
                    </ul>
                    <p style="margin-top: 1rem; font-weight: bold;">❌ Patients DON'T usually use imperatives with doctors (too direct/rude).</p>
                </div>
            `,
      tipBox: {
        title: "💡 Cultural Note",
        content:
          "In American medical settings, doctors can use imperatives (they're the authority), but patients should use declaratives when speaking to doctors to show respect.",
      },
      exercises: [
        {
          id: "imperatives-declaratives-medical-contexts-1",
          title: "Practice: Imperatives vs Declaratives in Medical Contexts",
          instructions:
            "Identify when to use imperatives vs declaratives in medical settings.",
          items: [
            {
              type: "radio",
              label:
                '"Take 1 tablet twice daily." What type of sentence is this and where is it used?',
              options: [
                {
                  value: "a",
                  label:
                    "Imperative - used on prescription labels and medication instructions",
                },
                {
                  value: "b",
                  label: "Declarative - used when doctors speak to patients",
                },
                {
                  value: "c",
                  label: "Question - used to ask about medication",
                },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label:
                '"You should take 1 tablet twice a day." What type of sentence is this and where is it used?',
              options: [
                {
                  value: "a",
                  label:
                    "Declarative - used when doctors speak to patients (more polite)",
                },
                {
                  value: "b",
                  label: "Imperative - used on prescription labels",
                },
                {
                  value: "c",
                  label: "Question - used to ask about medication",
                },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What should patients use when speaking to doctors?",
              options: [
                {
                  value: "a",
                  label:
                    "Declaratives (to show respect) - 'I will take it twice a day'",
                },
                {
                  value: "b",
                  label: "Imperatives (to be direct) - 'Take this medicine'",
                },
                { value: "c", label: "Questions only" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Why do prescription labels use imperatives?",
              options: [
                {
                  value: "a",
                  label:
                    "They are direct instructions that need to be clear and authoritative",
                },
                { value: "b", label: "To be polite to patients" },
                { value: "c", label: "To ask questions" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    {
      id: "workplace-contexts",
      stepNumber: 5,
      title: "Workplace Communication",
      icon: "💼",
      explanation: `
                <h3>Boss to Employee (Can Use Both)</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p><strong>Imperative (more direct):</strong></p>
                    <ul>
                        <li>"<strong>Please submit</strong> your timesheet by Friday."</li>
                        <li>"<strong>Turn in</strong> the report tomorrow."</li>
                    </ul>
                    <p style="margin-top: 1rem;"><strong>Declarative (softer):</strong></p>
                    <ul>
                        <li>"<strong>You need to submit</strong> your timesheet by Friday."</li>
                        <li>"<strong>I need you to turn in</strong> the report tomorrow."</li>
                    </ul>
                </div>

                <h3>Employee to Boss (Use Declaratives)</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p>✅ <strong>Use declaratives</strong> to sound respectful:</p>
                    <ul>
                        <li>"<strong>I will submit</strong> it by Friday."</li>
                        <li>"<strong>I can turn in</strong> the report tomorrow."</li>
                        <li>"<strong>I'd like to</strong> request time off."</li>
                    </ul>
                    <p style="margin-top: 1rem;">❌ <strong>DON'T use imperatives</strong> with your boss (too direct/disrespectful):</p>
                    <ul>
                        <li>❌ "Give me more time." → ✅ "Could I have more time?"</li>
                        <li>❌ "Approve my request." → ✅ "Could you please approve my request?"</li>
                    </ul>
                </div>

                <h3>Coworker to Coworker (Polite Imperatives OK)</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p>With equals, polite imperatives are fine:</p>
                    <ul>
                        <li>"<strong>Please</strong> send me that file."</li>
                        <li>"<strong>Let me know</strong> if you need help."</li>
                        <li>"<strong>Check</strong> your email when you get a chance."</li>
                    </ul>
                </div>
            `,
      exercises: [
        {
          id: "imperatives-declaratives-workplace-1",
          title: "Practice: Workplace Communication",
          instructions:
            "Choose the appropriate form (imperative or declarative) for different workplace situations.",
          items: [
            {
              type: "radio",
              label: "What should an employee use when speaking to their boss?",
              options: [
                {
                  value: "a",
                  label:
                    "Declaratives - 'I will submit it by Friday' (to show respect)",
                },
                {
                  value: "b",
                  label: "Imperatives - 'Submit it by Friday' (to be direct)",
                },
                { value: "c", label: "Either is fine" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What can a boss use when speaking to an employee?",
              options: [
                {
                  value: "a",
                  label:
                    "Both imperatives and declaratives - 'Please submit your timesheet' or 'You need to submit your timesheet'",
                },
                { value: "b", label: "Only imperatives" },
                { value: "c", label: "Only declaratives" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What can coworkers use when speaking to each other?",
              options: [
                {
                  value: "a",
                  label:
                    "Polite imperatives are fine - 'Please send me that file'",
                },
                { value: "b", label: "Only declaratives" },
                { value: "c", label: "Only direct commands" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Why shouldn't employees use imperatives with their boss?",
              options: [
                { value: "b", label: "It's grammatically incorrect" },
                { value: "a", label: "It sounds too direct and disrespectful" },
                { value: "c", label: "Bosses don't understand imperatives" },
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
          id: "imperatives-declaratives-ex-1",
          title: "Exercise 1: Imperative → Declarative",
          instructions: "Choose the best declarative sentence.",
          items: [
            {
              type: "radio",
              label: "Convert: Take this medicine twice a day.",
              options: [
                {
                  value: "a",
                  label: "You need to take this medicine twice a day.",
                },
                { value: "b", label: "Need take this medicine twice a day." },
                { value: "c", label: "Take you this medicine twice a day." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-2",
          title: "Exercise 2: Declarative → Polite Imperative",
          instructions: "Choose the best polite imperative.",
          items: [
            {
              type: "radio",
              label: "Convert: You should rest for a week.",
              options: [
                { value: "b", label: "You rest for a week." },
                { value: "c", label: "Resting for a week." },
                { value: "a", label: "Please rest for a week." },
            ],
            expectedAnswer: "a",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-3",
          title: "Exercise 3: Politeness in a Medical Setting",
          instructions: "Choose the more appropriate sentence.",
          items: [
            {
              type: "radio",
              label: "Patient to doctor:",
              options: [
                { value: "a", label: "Give me stronger medication." },
                { value: "b", label: "Could I have stronger medication?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-4",
          title: "Exercise 4: Make It Polite",
          instructions: "Choose the best polite email version.",
          items: [
            {
              type: "radio",
              label: "Convert: Send me the report.",
              options: [
                { value: "a", label: "Send me the report." },
                { value: "b", label: "Could you please send me the report?" },
                { value: "c", label: "You send me the report." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-5",
          title: "Exercise 5: Identify the Sentence Type",
          instructions: "Choose the correct label.",
          items: [
            {
              type: "select",
              label: "Don't lift anything heavy.",
              options: ["imperative", "declarative"],
              expectedAnswer: "imperative",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-6",
          title: "Exercise 6: Advice Modal",
          instructions: "Choose the best modal for advice.",
          items: [
            {
              type: "select",
              label: "You _____ drink plenty of water.",
              options: ["should", "are", "did", "to"],
              expectedAnswer: "should",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-7",
          title: "Exercise 7: Negative Imperative",
          instructions: "Choose the correct negative imperative.",
          items: [
            {
              type: "radio",
              label: "Convert: You shouldn't eat before the test.",
              options: [
                { value: "b", label: "No eat before the test." },
                { value: "c", label: "You don't eat before the test." },
                { value: "a", label: "Don't eat before the test." },
            ],
            expectedAnswer: "a",
            },
          ],
        },
        {
          id: "imperatives-declaratives-ex-8",
          title: "Exercise 8: Which Sounds More Polite?",
          instructions: "Choose the more polite sentence.",
          items: [
            {
              type: "radio",
              label: "Which sounds more polite?",
              options: [
                { value: "b", label: "Please submit your timesheet." },
                { value: "a", label: "Submit your timesheet." },
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
                <h3>Imperatives</h3>
                <ul>
                    <li><strong>Structure:</strong> Base verb (no subject)</li>
                    <li><strong>Purpose:</strong> Commands, instructions, requests</li>
                    <li><strong>Examples:</strong> Take this. Don't drive. Please wait.</li>
                    <li><strong>Tone:</strong> Direct, authoritative</li>
                    <li><strong>When to use:</strong> Instructions, signs, recipes, authority speaking to subordinate</li>
                </ul>

                <h3>Declaratives</h3>
                <ul>
                    <li><strong>Structure:</strong> Subject + verb</li>
                    <li><strong>Purpose:</strong> Statements, advice, information</li>
                    <li><strong>Examples:</strong> You should take this. You need to rest. I will call you.</li>
                    <li><strong>Tone:</strong> Indirect, polite, conversational</li>
                    <li><strong>When to use:</strong> Advice, conversation, speaking to authority</li>
                </ul>

                <h3>Politeness Guidelines</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(110, 145, 118, 0.2);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Situation</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Best Choice</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to boss</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Declaratives only</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to doctor</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Declaratives only</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Speaking to coworker</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Polite imperatives OK</td>
                        </tr>
                        <tr style="background: rgba(0, 0, 0, 0.02);">
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Written instructions</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Imperatives standard</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Doctor/boss to you</td>
                            <td style="padding: 0.75rem; border: 1px solid #ddd;">Either (they choose)</td>
                        </tr>
                    </tbody>
                </table>
            `,
      tipBox: {
        title: "💡 Remember",
        content:
          "Imperatives = direct/bossy. Declaratives = polite/indirect. When in doubt with authority, use declaratives.",
      },
      exercises: [
        {
          id: "imperatives-declaratives-quick-reference-1",
          title: "Practice: Quick Reference Review",
          instructions:
            "Test your understanding of imperatives vs declaratives.",
          items: [
            {
              type: "radio",
              label: "What is the structure of an imperative?",
              options: [
                {
                  value: "a",
                  label: "Base verb (no subject - 'you' is understood)",
                },
                { value: "b", label: "Subject + verb" },
                { value: "c", label: "Modal + verb" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What is the structure of a declarative?",
              options: [
                {
                  value: "a",
                  label:
                    "Subject + verb (e.g., 'You should...', 'You need to...')",
                },
                { value: "b", label: "Base verb only" },
                { value: "c", label: "No subject needed" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "When should patients use declaratives with doctors?",
              options: [
                { value: "b", label: "Never - imperatives are better" },
                { value: "a", label: "Always - to show respect" },
                { value: "c", label: "Only in writing" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Where are imperatives commonly used?",
              options: [
                {
                  value: "a",
                  label: "Prescription labels, written instructions, signs",
                },
                { value: "b", label: "Only in casual conversation" },
                { value: "c", label: "Only when speaking to bosses" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence is an imperative?",
              options: [
                {
                  value: "a",
                  label:
                    "Take this medicine twice a day. (no subject, starts with verb)",
                },
                {
                  value: "b",
                  label:
                    "You should take this medicine twice a day. (has subject 'you')",
                },
                {
                  value: "c",
                  label:
                    "I will take this medicine twice a day. (has subject 'I')",
                },
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
      question: "Which is an imperative sentence?",
      options: [
        { value: "a", label: "You should rest." },
        { value: "c", label: "I recommend resting." },
        { value: "b", label: "Rest for a week." },
    ],
    correctAnswer: "b",
      explanation:
        "Imperatives start with the base verb and have no subject. 'Rest for a week' is an imperative command, the subject 'you' is understood.",
      skillTag: "sentence-type-identification-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-2",
      question: "Which sentence is a declarative?",
      options: [
        { value: "c", label: "You need to fast before the test." },
        { value: "a", label: "Don't eat before the test." },
        { value: "b", label: "Please wait here." },
    ],
    correctAnswer: "c",
      explanation:
        "Declaratives have a subject + verb. 'You need to fast before the test' includes the subject 'you' and gives information/advice.",
      skillTag: "sentence-type-identification-declarative",
      difficulty: "easy",
    },
    {
      id: "quiz-3",
      question: "Convert to imperative: 'You should take this twice a day.'",
      options: [
        { value: "a", label: "You take this twice a day." },
        { value: "b", label: "Take this twice a day." },
        { value: "c", label: "Taking this twice a day." },
      ],
      correctAnswer: "b",
      explanation:
        "To form an imperative, remove the subject and start with the base verb: 'Take this twice a day.' This is the standard form on prescription labels.",
      skillTag: "transformation-declarative-to-imperative",
      difficulty: "medium",
    },
    {
      id: "quiz-4",
      question: "Convert to declarative: 'Call the office if you have questions.'",
      options: [
        {
          value: "a",
          label: "You should call the office if you have questions.",
        },
        { value: "b", label: "Calling the office if you have questions." },
        { value: "c", label: "Call you the office if you have questions." },
      ],
      correctAnswer: "a",
      explanation:
        "To convert an imperative to a declarative, add a subject ('you') and often a modal like 'should': 'You should call the office if you have questions.'",
      skillTag: "transformation-imperative-to-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-5",
      question: "What makes 'Don't lift anything heavy' an imperative?",
      options: [
        {
          value: "a",
          label: "It starts with 'Don't' + base verb and has no subject",
        },
        { value: "b", label: "It has a subject 'you' written" },
        { value: "c", label: "It uses a past tense verb" },
      ],
      correctAnswer: "a",
      explanation:
        "Negative imperatives use 'Don't' + base verb. The subject 'you' is understood but not written.",
      skillTag: "form-negative-imperative-dont",
      difficulty: "easy",
    },
    {
      id: "quiz-6",
      question: "How can you make an imperative more polite?",
      options: [
        { value: "b", label: "Add an exclamation mark" },
        { value: "c", label: "Make it louder" },
        { value: "a", label: "Add 'please' to the sentence" },
    ],
    correctAnswer: "a",
      explanation:
        "Adding 'please' softens the tone of an imperative: 'Please wait here' sounds more polite than 'Wait here.'",
      skillTag: "form-polite-imperative-please",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Which sentence would you see on a prescription label?",
      options: [
        { value: "b", label: "Take one tablet daily with food." },
        { value: "a", label: "You should take one tablet daily." },
        { value: "c", label: "I recommend taking one tablet daily." },
    ],
    correctAnswer: "b",
      explanation:
        "Prescription labels use imperatives for clarity and authority. 'Take one tablet daily with food' is direct and standard.",
      skillTag: "context-prescription-label-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question:
        "Which is most appropriate for a patient speaking to a doctor?",
      options: [
        { value: "a", label: "Give me a referral." },
        { value: "b", label: "I need a referral." },
        { value: "c", label: "Refer me to a specialist." },
      ],
      correctAnswer: "b",
      explanation:
        "Patients should use declaratives with doctors to show respect. 'I need a referral' is polite and appropriate.",
      skillTag: "register-patient-to-doctor-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-9",
      question: "Which is better for an employee emailing their boss?",
      options: [
        { value: "a", label: "Approve my time off request." },
        { value: "c", label: "Give me Friday off." },
        { value: "b", label: "I'd like to request time off." },
    ],
    correctAnswer: "b",
      explanation:
        "When speaking to a boss, employees should use polite declaratives. 'I'd like to request time off' sounds respectful and professional.",
      skillTag: "register-employee-to-boss-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-10",
      question:
        "Which sentence is a good polite imperative between coworkers?",
      options: [
        { value: "b", label: "Please send me that file when you can." },
        { value: "a", label: "Send me that file now." },
        { value: "c", label: "You send me that file." },
    ],
    correctAnswer: "b",
      explanation:
        "With coworkers, polite imperatives are fine. 'Please send me that file when you can' is direct but respectful.",
      skillTag: "register-coworker-polite-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-11",
      question:
        "Why do doctors sometimes use imperatives with patients?",
      options: [
        {
          value: "a",
          label:
            "Because they are the authority and instructions need to be clear",
        },
        { value: "b", label: "Because patients prefer commands" },
        {
          value: "c",
          label: "Because declaratives are incorrect in medical settings",
        },
      ],
      correctAnswer: "a",
      explanation:
        "Doctors use imperatives for clear, authoritative instructions: 'Take this twice a day' is short and easy to follow.",
      skillTag: "context-doctor-to-patient-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-12",
      question:
        "When writing a workplace manual or instruction sheet, which form is standard?",
      options: [
        {
          value: "a",
          label: "Imperatives – 'Press the green button to start.'",
        },
        {
          value: "b",
          label: "Declaratives – 'You should press the green button.'",
        },
        {
          value: "c",
          label: "Questions – 'Would you press the green button?'",
        },
      ],
      correctAnswer: "a",
      explanation:
        "Written instructions (manuals, recipes, procedures) usually use imperatives: 'Press the green button to start.'",
      skillTag: "context-workplace-instructions-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-13",
      question:
        "Which sentence is the MOST direct way to give an instruction?",
      options: [
        { value: "a", label: "You might want to stop smoking." },
        { value: "c", label: "Stop smoking." },
        { value: "b", label: "I recommend that you stop smoking." },
    ],
    correctAnswer: "c",
      explanation:
        "'Stop smoking' is a bare imperative with no softening. It is more direct than the advice-style declaratives in A and B.",
      skillTag: "tone-directness-imperative-vs-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question:
        "'You shouldn't drive after taking this medication.' What type is this?",
      options: [
        {
          value: "a",
          label: "Declarative – it has subject 'you' and gives advice",
        },
        {
          value: "b",
          label: "Imperative – it tells someone not to do something",
        },
        { value: "c", label: "Question – it's asking about driving" },
      ],
      correctAnswer: "a",
      explanation:
        "This is a declarative because it has a subject ('you') and a modal ('shouldn't'). The imperative version would be 'Don't drive after taking this.'",
      skillTag: "sentence-type-identification-declarative-negative",
      difficulty: "easy",
    },
    {
      id: "quiz-15",
      question:
        "Which sentence correctly uses a polite imperative on a clinic sign?",
      options: [
        { value: "a", label: "Turn off your phone." },
        { value: "c", label: "You turn off your phone." },
        { value: "b", label: "Please turn off your phone." },
    ],
    correctAnswer: "b",
      explanation:
        "Clinic signs often use polite imperatives with 'please' to sound respectful: 'Please turn off your phone.'",
      skillTag: "context-clinic-sign-polite-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-16",
      question:
        "As a patient, why is it better to say 'Could you explain that again?' instead of 'Explain that again.'?",
      options: [
        {
          value: "a",
          label: "Because questions and declaratives sound more polite to authority",
        },
        { value: "b", label: "Because imperatives are always grammatically wrong" },
        { value: "c", label: "Because doctors do not understand imperatives" },
      ],
      correctAnswer: "a",
      explanation:
        "With authority figures like doctors, using questions and declaratives ('Could you…?') sounds respectful. Bare imperatives from patients can sound rude or bossy.",
      skillTag: "politeness-choice-patient-questions-vs-imperatives",
      difficulty: "medium",
    },
  ],
  /*
  TEACHER DIAGNOSTIC NOTES – Imperatives vs Declaratives Mini Quiz

  This mini quiz checks whether students can:
  - Recognize imperatives vs declaratives by structure (subject/no subject).
  - Form basic and negative imperatives correctly.
  - Choose polite forms (please, modals, questions) based on power and context.
  - Distinguish typical contexts: prescription labels, clinic signs, workplace manuals, emails.
  - Adjust tone when speaking to doctors, bosses, coworkers, and patients.

  Skill tags:

  Sentence type:
  - sentence-type-identification-imperative
  - sentence-type-identification-declarative
  - sentence-type-identification-declarative-negative

  Form of imperatives:
  - form-negative-imperative-dont
  - form-polite-imperative-please
  - transformation-declarative-to-imperative
  - transformation-imperative-to-declarative

  Tone and register:
  - tone-directness-imperative-vs-declarative
  - register-patient-to-doctor-declarative
  - register-employee-to-boss-declarative
  - register-coworker-polite-imperative
  - politeness-choice-patient-questions-vs-imperatives

  Context patterns:
  - context-prescription-label-imperative
  - context-doctor-to-patient-imperative
  - context-workplace-instructions-imperative
  - context-clinic-sign-polite-imperative

  How to read the diagnostics:
  - If sentence-type tags are weak → Revisit the basic formulas:
    • Imperatives: base verb (no subject) → 'Take this.', 'Don't eat.'
    • Declaratives: subject + verb → 'You should take this.', 'I will call you.'
    Use side-by-side tables from this guide and have students label each sentence as IMP or DEC.
  - If form-of-imperative tags are weak → Practice building commands from declaratives:
    • You should rest. → Rest.
    • You shouldn't drive. → Don't drive.
    Then add 'please' to soften: 'Please rest.', 'Please don't drive.'
  - If tone/register tags are weak → Re-teach the hierarchy:
    • To doctors/bosses → use declaratives/questions ('I need…', 'Could you…?').
    • To patients/employees → imperatives are expected ('Take…', 'Sign…').
    • To coworkers → polite imperatives or soft questions.
    Role‑play short dialogues where students choose between an imperative, a declarative, or a question.
  - If context tags are weak → Sort example sentences into groups:
    • Prescription label / clinic sign / workplace manual / email to boss.
    Ask: Where would you see this sentence? Who is speaking to whom?

  Suggested use:
  - Use this mini quiz after students have completed the main sections (medical contexts, workplace contexts, practice).
  - Use class‑level skillTag results to decide focus:
    • Many errors in sentence-type tags → slow down and do more form work (structure).
    • Many errors in tone/register tags → spend a day on role‑plays and politeness choices.
    • Many errors in context tags → revisit the tables and signs from the guide and re-sort sentences by situation.
  */
};
