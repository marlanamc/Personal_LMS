import type { InteractiveGuideContent, ExerciseItem } from "@/types/activity";

export const medicalInstructionsCompleteContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // Section 1: Introduction
    {
      id: "introduction",
      title: "Medical Instructions: Modals, Imperatives & Declaratives",
      icon: "🗣️",
      explanation: `
        <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <p style="font-size: 1.125rem; margin-bottom: 0;">"<strong>Take</strong> this medicine twice a day." vs "<strong>You should</strong> take this medicine twice a day." vs "<strong>You must</strong> take this medicine twice a day." — The difference is small, but the meaning and tone are completely different!</p>
        </div>

        <h3>What You'll Learn</h3>
        <p>This guide teaches three essential grammar concepts for healthcare and workplace communication:</p>

        <div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #d97757;">
            <h4 style="margin: 0 0 0.5rem 0; color: #d97757;">1. Imperatives (Commands)</h4>
            <p style="margin: 0;"><strong>Take</strong> this medicine. <strong>Don't</strong> drive after taking this.</p>
          </div>

          <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
            <h4 style="margin: 0 0 0.5rem 0; color: #7ba884;">2. Declaratives (Statements)</h4>
            <p style="margin: 0;"><strong>You need to</strong> take this medicine. <strong>I recommend</strong> resting.</p>
          </div>

          <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6;">3. Modals (Meaning Changers)</h4>
            <p style="margin: 0;"><strong>You should</strong> rest (advice). <strong>You must</strong> finish (required). <strong>You can</strong> ask (permission).</p>
          </div>
        </div>

        <h3>Why This Matters</h3>
        <ul>
          <li><strong>Medical settings:</strong> Understanding prescription labels, doctor's advice, and patient rights</li>
          <li><strong>Workplace:</strong> Knowing how to communicate with bosses, coworkers, and customers</li>
          <li><strong>Politeness:</strong> Using the right tone shows cultural awareness and professionalism</li>
        </ul>
      `,
      exercises: [
        {
          id: "intro-diagnostic-1",
          title: "Quick Check: What Type of Sentence?",
          instructions: "Identify the sentence type.",
          items: [
            {
              type: "radio",
              label: "\"<span class='eg-verb'>Take</span> this medicine twice a day.\"",
              options: [
                { value: "imperative", label: "Imperative (command)" },
                { value: "declarative", label: "Declarative (statement)" },
              ],
              expectedAnswer: "imperative",
            },
            {
              type: "radio",
              label: "\"<span class='eg-helper'>You should</span> take this medicine twice a day.\"",
              options: [
                { value: "imperative", label: "Imperative (command)" },
                { value: "declarative", label: "Declarative (statement with modal)" },
              ],
              expectedAnswer: "declarative",
            },
            {
              type: "radio",
              label: "\"You <span class='eg-helper'>must not</span> drink alcohol while taking this.\"",
              options: [
                { value: "caution", label: "Caution (required/dangerous)" },
                { value: "advice", label: "Advice (recommended)" },
                { value: "permission", label: "Permission (allowed)" },
            ],
            expectedAnswer: "caution",
            },
          ],
        },
      ],
    },

    // Section 2: Imperatives
    {
      id: "imperatives",
      stepNumber: 1,
      title: "Imperatives: Commands and Instructions",
      icon: "📢",
      explanation: `
        <h3>What Is an Imperative?</h3>
        <p>An <strong>imperative sentence</strong> gives a command, instruction, or request. The subject (you) is understood but not stated.</p>

        <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
          <h4>Formula:</h4>
          <p style="font-size: 1.25rem; font-weight: bold; color: #d97757;">Base Verb + (object/details)</p>
          <p style="font-style: italic; margin-top: 0.5rem;">(No subject! Start with the verb.)</p>

          <h4 style="margin-top: 1rem;">Examples:</h4>
          <ul>
            <li><strong>Take</strong> this medicine.</li>
            <li><strong>Rest</strong> for 3 days.</li>
            <li><strong>Don't</strong> drive after taking this medication.</li>
          </ul>
        </div>

        <h3>Three Types of Imperatives</h3>

        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
          <h4 style="color: #d97757;">1. Direct Commands (Strong)</h4>
          <ul>
            <li><strong>Stop</strong> smoking.</li>
            <li><strong>Take</strong> this twice a day.</li>
          </ul>
        </div>

        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
          <h4 style="color: #7ba884;">2. Polite Requests ("Please")</h4>
          <ul>
            <li><strong>Please</strong> fill out this form.</li>
            <li><strong>Please</strong> wait here.</li>
          </ul>
        </div>

        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
          <h4 style="color: #dc2626;">3. Negative Imperatives ("Don't")</h4>
          <ul>
            <li><strong>Don't</strong> eat before the test.</li>
            <li><strong>Don't</strong> take this on an empty stomach.</li>
          </ul>
        </div>
      `,
      tipBox: {
        title: "💡 Key Point",
        content: "Imperatives have NO subject (no 'you'). They start directly with the verb.",
      },
      exercises: [
        {
          id: "imperatives-ex-1",
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
                { value: "b", label: "Has a subject and verb" },
                { value: "c", label: "Uses past tense" },
                { value: "a", label: "Starts with base verb, no subject (you is understood)" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is a negative imperative?",
              options: [
                { value: "a", label: "Don't eat before the test." },
                { value: "b", label: "You don't eat before the test." },
                { value: "c", label: "You shouldn't eat before the test." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    // Section 3: Declaratives
    {
      id: "declaratives",
      stepNumber: 2,
      title: "Declaratives: Statements and Advice",
      icon: "💬",
      explanation: `
        <h3>What Is a Declarative?</h3>
        <p>A <strong>declarative sentence</strong> makes a statement. It has a subject and gives information or advice.</p>

        <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
          <h4>Formula:</h4>
          <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884;">Subject + Verb + (object/details)</p>

          <h4 style="margin-top: 1rem;">Examples:</h4>
          <ul>
            <li><strong>You need to</strong> take this medicine.</li>
            <li><strong>You should</strong> rest for 3 days.</li>
            <li><strong>I recommend</strong> drinking plenty of water.</li>
          </ul>
        </div>

        <h3>Common Declarative Patterns</h3>
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
              <td style="padding: 0.75rem; border: 1px solid #ddd;">I recommend this.</td>
              <td style="padding: 0.75rem; border: 1px solid #ddd;">Professional advice</td>
            </tr>
            <tr style="background: rgba(0, 0, 0, 0.02);">
              <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to...</td>
              <td style="padding: 0.75rem; border: 1px solid #ddd;">You have to fast.</td>
              <td style="padding: 0.75rem; border: 1px solid #ddd;">Obligation</td>
            </tr>
          </tbody>
        </table>
      `,
      exercises: [
        {
          id: "declaratives-ex-1",
          title: "Practice: Understanding Declaratives",
          instructions: "Identify declarative sentences and their patterns.",
          items: [
            {
              type: "radio",
              label: "What is a declarative sentence?",
              options: [
                { value: "b", label: "A sentence that gives a command without a subject" },
                { value: "a", label: "A sentence that makes a statement and has a subject" },
                { value: "c", label: "A sentence that asks a question" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"You should rest for 3 days.\" What pattern is this?",
              options: [
                { value: "b", label: "Imperative command" },
                { value: "c", label: "Question" },
                { value: "a", label: "Declarative with 'should' (advice/suggestion)" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence is a declarative?",
              options: [
                { value: "a", label: "You have to call if you have questions." },
                { value: "b", label: "Call if you have questions." },
                { value: "c", label: "Do you have questions?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    // Section 4: Comparison
    {
      id: "comparison",
      stepNumber: 3,
      title: "Side by Side: Same Meaning, Different Tone",
      icon: "⚖️",
      explanation: `
        <h3>Imperatives vs Declaratives</h3>
        <p>You can express the same idea with either form, but the tone changes:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
          <thead>
            <tr style="background: rgba(200, 107, 81, 0.2);">
              <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Imperative (Direct)</th>
              <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Declarative (Indirect/Polite)</th>
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
          </tbody>
        </table>

        <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
          <h4 style="color: #d4a843;">Which Should You Use?</h4>
          <ul>
            <li><strong>Imperatives:</strong> Common in medical instructions (prescriptions, clinic signs)</li>
            <li><strong>Declaratives:</strong> Sound more polite in conversations</li>
            <li><strong>In writing:</strong> Imperatives are standard (medication labels)</li>
            <li><strong>In speaking:</strong> Declaratives sound friendlier</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "comparison-ex-1",
          title: "Practice: Comparing Forms",
          instructions: "Identify the sentence type and when to use each.",
          items: [
            {
              type: "radio",
              label: "\"Take this twice a day.\" What type is this?",
              options: [
                { value: "b", label: "Declarative - statement with subject" },
                { value: "a", label: "Imperative - direct command/instruction" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"You need to take this twice a day.\" What type is this?",
              options: [
                { value: "a", label: "Declarative - statement with subject 'you'" },
                { value: "b", label: "Imperative - command without subject" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "When should you use declaratives?",
              options: [
                { value: "a", label: "When you want to sound more polite in conversations" },
                { value: "b", label: "On prescription labels" },
                { value: "c", label: "Never, they're too indirect" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    // Section 5: Modals Review
    {
      id: "modals-review",
      stepNumber: 4,
      title: "Modals Review: Changing Meaning",
      icon: "🔑",
      explanation: `
        <h3>Quick Modals Review</h3>
        <p>Remember, <strong>modals</strong> are special verbs that change the meaning of a sentence. They express advice, requirement, permission, or necessity.</p>

        <div style="margin: 1.5rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 2px solid #7ba884;">
          <h4>Modal Formula:</h4>
          <p style="font-size: 1.25rem; text-align: center; margin: 0;">
            <span style="color: #3b82f6;">Subject</span> +
            <span style="color: #d97757; font-weight: 600;"> Modal </span> +
            <span style="color: #22c55e;">Base Verb</span>
          </p>
          <p style="margin: 0.5rem 0 0 0; text-align: center; font-style: italic;">
            You <strong style="color: #d97757;">should</strong> rest. You <strong style="color: #d97757;">must</strong> take it. You <strong style="color: #d97757;">can</strong> ask.
          </p>
        </div>

        <h3>Three Categories of Modals in Healthcare</h3>

        <div style="margin-top: 1.5rem; background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #22c55e;">
          <h4 style="color: #22c55e; margin-top: 0;">💡 ADVICE (should/shouldn't)</h4>
          <p style="margin: 0;">Recommendations - good for you, but not required</p>
        </div>

        <div style="margin-top: 1rem; background: rgba(220, 38, 38, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #dc2626;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ CAUTION (must/must not)</h4>
          <p style="margin: 0;">Required for safety or dangerous/forbidden</p>
        </div>

        <div style="margin-top: 1rem; background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
          <h4 style="color: #3b82f6; margin-top: 0;">✅ CONSENT (can/may/are allowed to)</h4>
          <p style="margin: 0;">What you're permitted to do or request</p>
        </div>
      `,
      tipBox: {
        title: "💡 Grammar Rule",
        content: "Modals don't change form! No -s, no -ed, no -ing. 'She shoulds'? NO. 'You musted'? NO. Just: You should, She must, I can.",
      },
      exercises: [
        {
          id: "modals-intro-ex-1",
          title: "Practice: Modal + Base Verb",
          instructions: "Choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "Which is grammatically correct?",
              options: [
                { value: "b", label: "You should takes this medicine with food." },
                { value: "a", label: "You should take this medicine with food." },
                { value: "c", label: "You should to take this medicine with food." },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is grammatically correct?",
              options: [
                { value: "a", label: "You must not to drive after taking this." },
                { value: "c", label: "You must not driving after taking this." },
                { value: "b", label: "You must not drive after taking this." },
            ],
            expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // Section 6: Advice & Caution (should/must)
    {
      id: "modals-advice-caution",
      stepNumber: 5,
      title: "Advice & Caution: should/must",
      icon: "⚠️",
      explanation: `
        <h3>Should/Shouldn't = Health Advice</h3>
        <p><strong>Should</strong> gives advice - things that are good for you, but you have a choice:</p>

        <div style="margin: 1rem 0; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem; border-left: 4px solid #22c55e;">
          <ul style="margin: 0;">
            <li>You <strong>should</strong> drink plenty of water.</li>
            <li>You <strong>should</strong> take this medicine with food.</li>
            <li>You <strong>shouldn't</strong> skip doses of your medication.</li>
          </ul>
        </div>

        <h3>Must/Must Not = Safety Caution</h3>
        <p><strong>Must</strong> expresses strong requirements. <strong>Must not</strong> means dangerous/forbidden:</p>

        <div style="margin: 1rem 0; padding: 1rem; background: rgba(220, 38, 38, 0.1); border-radius: 0.5rem; border-left: 4px solid #dc2626;">
          <ul style="margin: 0;">
            <li>You <strong>must</strong> finish all the antibiotics.</li>
            <li>You <strong>must not</strong> drink alcohol while taking this medication.</li>
            <li>You <strong>must not</strong> drive after taking this medicine.</li>
          </ul>
        </div>

        <h3>Should vs Must: What's the Difference?</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);"><strong>Should</strong></td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Recommended (good idea, but optional)</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>should</strong> take it with food.</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Must</strong></td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Required (necessary, no choice)</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>must</strong> take it twice daily.</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);"><strong>Must Not</strong></td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Forbidden (dangerous)</td>
            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">You <strong>must not</strong> drink alcohol.</td>
          </tr>
        </table>
      `,
      tipBox: {
        title: "⚠️ Safety First",
        content: "When you see 'must not' on medication labels or from your doctor, take it seriously. It's not just advice - it's a warning about something dangerous!",
      },
      exercises: [
        {
          id: "advice-caution-ex-1",
          title: "Practice: Should vs Must",
          instructions: "Choose the correct modal for each situation.",
          items: [
            {
              type: "text",
              label: "You ___ drink plenty of water when you're sick. (advice)",
              expectedAnswer: "should",
            },
            {
              type: "text",
              label: "You ___ finish all the antibiotics, even if you feel better. (required)",
              expectedAnswer: "must",
            },
            {
              type: "radio",
              label: "Warning: 'You ___ drive after taking this medication.' (dangerous)",
              options: [
                { value: "must not", label: "must not" },
                { value: "don't have to", label: "don't have to" },
                { value: "should not", label: "should not" },
              ],
              expectedAnswer: "must not",
            },
            {
              type: "radio",
              label: "The label says it's recommended: 'You ___ take this with food.'",
              options: [
                { value: "must", label: "must (required)" },
                { value: "should", label: "should (advice)" },
                { value: "can", label: "can (permission)" },
              ],
              expectedAnswer: "should",
            },
          ],
        },
      ],
    },

    // Section 7: Permission & Necessity
    {
      id: "modals-permission-necessity",
      stepNumber: 6,
      title: "Permission & Necessity: can/may/need to",
      icon: "✅",
      explanation: `
        <h3>Can/May/Are Allowed To = Permission & Rights</h3>
        <p>In healthcare, you have rights. These modals show what you're allowed to do:</p>

        <div style="margin: 1rem 0; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.5rem; border-left: 4px solid #22c55e;">
          <h4 style="color: #22c55e; margin-top: 0;">CAN = Informal Permission</h4>
          <ul style="margin: 0.5rem 0 0 0;">
            <li><strong>Can I</strong> ask you a question about my prescription?</li>
            <li><strong>Can I</strong> bring someone with me to the appointment?</li>
          </ul>
        </div>

        <div style="margin: 1rem 0; padding: 1rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 4px solid #a855f7;">
          <h4 style="color: #a855f7; margin-top: 0;">MAY = Formal Permission</h4>
          <ul style="margin: 0.5rem 0 0 0;">
            <li><strong>May I</strong> request a copy of my medical records?</li>
            <li><strong>May I</strong> have a translator for my appointment?</li>
          </ul>
        </div>

        <div style="margin: 1rem 0; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
          <h4 style="color: #3b82f6; margin-top: 0;">ARE ALLOWED TO = Your Rights</h4>
          <ul style="margin: 0.5rem 0 0 0;">
            <li>You <strong>are allowed to</strong> request a second opinion.</li>
            <li>You <strong>are allowed to</strong> access your health records.</li>
          </ul>
        </div>

        <h3>Need To = Necessity</h3>
        <p><strong>Need to</strong> expresses something required for your health (similar to must, but more natural in conversation):</p>
        <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
          <ul style="margin: 0;">
            <li>You <strong>need to</strong> fast for 12 hours before the blood test.</li>
            <li>Do I <strong>need to</strong> make an appointment?</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "permission-necessity-ex-1",
          title: "Practice: Permission & Necessity",
          instructions: "Choose the best modal for each situation.",
          items: [
            {
              type: "radio",
              label: "Asking your doctor a quick question:",
              options: [
                { value: "may", label: "May I ask you a question?" },
                { value: "must", label: "Must I ask you something?" },
                { value: "can", label: "Can I ask you something?" },
            ],
            expectedAnswer: "can",
            },
            {
              type: "radio",
              label: "Asking the receptionist about your legal right to records:",
              options: [
                { value: "allowed", label: "I am allowed to access my medical records." },
                { value: "can", label: "I can see my records." },
                { value: "should", label: "I should see my records." },
            ],
            expectedAnswer: "allowed",
            },
            {
              type: "text",
              label: "You ___ fast for 12 hours before this blood test. (required)",
              expectedAnswer: "need to",
            },
            {
              type: "text",
              label: "You ___ bring anything special for a routine checkup. (not required)",
              expectedAnswers: ["don't need to", "do not need to"],
            } as ExerciseItem,
          ],
        },
      ],
    },

    // Section 8: Medical Contexts
    {
      id: "medical-contexts",
      stepNumber: 7,
      title: "Real-World Medical Contexts",
      icon: "🏥",
      explanation: `
        <h3>Prescription Labels (Imperatives)</h3>
        <div style="background: white; padding: 1rem; border: 2px solid #d97757; border-radius: 0.5rem; margin: 1rem 0;">
          <p style="font-weight: bold; color: #d97757; margin: 0 0 0.5rem 0;">MEDICATION INSTRUCTIONS:</p>
          <ul style="margin: 0;">
            <li><strong>Take</strong> 1 tablet twice daily with food.</li>
            <li><strong>Avoid</strong> alcohol while taking this medication.</li>
            <li><strong>Do not</strong> drive or operate heavy machinery.</li>
          </ul>
        </div>

        <h3>Doctor's Advice (Declaratives with Modals)</h3>
        <div style="background: white; padding: 1rem; border: 2px solid #7ba884; border-radius: 0.5rem; margin: 1rem 0;">
          <p style="font-weight: bold; color: #7ba884; margin: 0 0 0.5rem 0;">DOCTOR SPEAKING TO PATIENT:</p>
          <ul style="margin: 0;">
            <li>"<strong>You should</strong> take 1 tablet twice a day with food."</li>
            <li>"<strong>You must not</strong> drink alcohol while on this medication."</li>
            <li>"<strong>You can</strong> call if you have any questions."</li>
          </ul>
        </div>

        <h3>Clinic Signs (Imperatives)</h3>
        <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
          <ul style="margin: 0;">
            <li><strong>Please</strong> check in at the front desk.</li>
            <li><strong>Wash</strong> your hands before entering.</li>
            <li><strong>Do not</strong> bring food into the exam room.</li>
          </ul>
        </div>

        <h3>Patient to Doctor (Use Declaratives!)</h3>
        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
          <p style="font-weight: bold;">✅ Patients should use declaratives:</p>
          <ul>
            <li>"<strong>I will</strong> take it twice a day."</li>
            <li>"<strong>I need to</strong> ask about the side effects."</li>
            <li>"<strong>Can I</strong> have a referral?"</li>
          </ul>
          <p style="margin-top: 1rem;"><strong>❌ DON'T use imperatives with doctors</strong> (too direct/rude)</p>
        </div>
      `,
      tipBox: {
        title: "💡 Cultural Note",
        content: "In American medical settings, doctors can use imperatives (they're the authority), but patients should use declaratives to show respect.",
      },
      exercises: [
        {
          id: "medical-contexts-ex-1",
          title: "Practice: Medical Communication",
          instructions: "Choose the best option for each medical situation.",
          items: [
            {
              type: "radio",
              label: "The medication label says: 'Take with food to avoid stomach upset.'",
              options: [
                { value: "must", label: "You must take this with food. (required)" },
                { value: "should", label: "You should take this with food. (advice)" },
                { value: "can", label: "You can take this with food. (permission)" },
            ],
            expectedAnswer: "should",
            },
            {
              type: "radio",
              label: "The warning says: 'Do not operate machinery after taking.'",
              options: [
                { value: "should not", label: "You should not drive. (advice)" },
                { value: "don't need to", label: "You don't need to drive. (not required)" },
                { value: "must not", label: "You must not drive. (dangerous)" },
            ],
            expectedAnswer: "must not",
            },
            {
              type: "radio",
              label: "What should patients use when speaking to doctors?",
              options: [
                { value: "a", label: "Declaratives - 'I will take it twice a day'" },
                { value: "b", label: "Imperatives - 'Give me stronger medication'" },
                { value: "c", label: "Either is fine" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    // Section 9: Workplace Communication
    {
      id: "workplace",
      stepNumber: 8,
      title: "Workplace Communication",
      icon: "💼",
      explanation: `
        <h3>Boss to Employee (Can Use Both)</h3>
        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
          <p><strong>Imperative:</strong> "Please submit your timesheet by Friday."</p>
          <p><strong>Declarative:</strong> "You need to submit your timesheet by Friday."</p>
        </div>

        <h3>Employee to Boss (Use Declaratives!)</h3>
        <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
          <p>✅ <strong>Use declaratives</strong> to sound respectful:</p>
          <ul>
            <li>"<strong>I will submit</strong> it by Friday."</li>
            <li>"<strong>I'd like to</strong> request time off."</li>
            <li>"<strong>Could I</strong> have more time?"</li>
          </ul>
          <p style="margin-top: 1rem;">❌ <strong>DON'T use imperatives</strong> with your boss:</p>
          <ul>
            <li>❌ "Give me more time." → ✅ "Could I have more time?"</li>
            <li>❌ "Approve my request." → ✅ "Could you please approve my request?"</li>
          </ul>
        </div>

        <h3>Coworker to Coworker (Polite Imperatives OK)</h3>
        <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
          <ul>
            <li>"<strong>Please</strong> send me that file."</li>
            <li>"<strong>Let me know</strong> if you need help."</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "workplace-ex-1",
          title: "Practice: Workplace Communication",
          instructions: "Choose the appropriate form for workplace situations.",
          items: [
            {
              type: "radio",
              label: "What should an employee use when speaking to their boss?",
              options: [
                { value: "b", label: "Imperatives - 'Submit it by Friday'" },
                { value: "a", label: "Declaratives - 'I will submit it by Friday'" },
                { value: "c", label: "Either is fine" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "What can a boss use when speaking to an employee?",
              options: [
                { value: "b", label: "Only imperatives" },
                { value: "c", label: "Only declaratives" },
                { value: "a", label: "Both imperatives and declaratives" },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which is better for an employee emailing their boss?",
              options: [
                { value: "b", label: "I'd like to request time off." },
                { value: "a", label: "Approve my time off request." },
                { value: "c", label: "Give me Friday off." },
            ],
            expectedAnswer: "b",
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

    // Section 10: Summary
    {
      id: "summary",
      title: "Quick Reference Summary",
      icon: "📋",
      explanation: `
        <h3>Imperatives</h3>
        <ul>
          <li><strong>Structure:</strong> Base verb (no subject)</li>
          <li><strong>Examples:</strong> Take this. Don't drive. Please wait.</li>
          <li><strong>Use:</strong> Instructions, signs, prescriptions, authority to subordinate</li>
        </ul>

        <h3>Declaratives</h3>
        <ul>
          <li><strong>Structure:</strong> Subject + verb</li>
          <li><strong>Examples:</strong> You should rest. You need to take this. I will call.</li>
          <li><strong>Use:</strong> Advice, conversation, speaking to authority</li>
        </ul>

        <h3>Modals Cheat Sheet</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem;">
          <thead>
            <tr style="background: rgba(200, 107, 81, 0.1);">
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Type</th>
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Modal</th>
              <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(34, 197, 94, 0.1);">Advice</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">should/shouldn't</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Recommended</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(220, 38, 38, 0.1);">Caution</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">must/must not</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Required/Forbidden</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(59, 130, 246, 0.1);">Consent</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">can/may</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Permission</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); background: rgba(251, 191, 36, 0.1);">Necessity</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">need to</td>
              <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Required</td>
            </tr>
          </tbody>
        </table>

        <h3>Politeness Guidelines</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>Speaking to boss/doctor</strong></td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">Declaratives only</td>
          </tr>
          <tr style="background: rgba(0,0,0,0.02);">
            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>Speaking to coworker</strong></td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">Polite imperatives OK</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>Written instructions</strong></td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">Imperatives standard</td>
          </tr>
        </table>
      `,
      tipBox: {
        title: "💡 Remember",
        content: "Imperatives = direct/bossy. Declaratives = polite/indirect. When in doubt with authority, use declaratives!",
      },
      exercises: [
        {
          id: "summary-ex-1",
          title: "Final Review",
          instructions: "Test your understanding of all concepts.",
          items: [
            {
              type: "radio",
              label: "Which is an imperative?",
              options: [
                { value: "b", label: "You should take this medicine twice a day." },
                { value: "c", label: "I will take this medicine twice a day." },
                { value: "a", label: "Take this medicine twice a day." },
            ],
            expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which modal expresses advice (recommended but not required)?",
              options: [
                { value: "should", label: "should" },
                { value: "must", label: "must" },
                { value: "can", label: "can" },
              ],
              expectedAnswer: "should",
            },
            {
              type: "radio",
              label: "Which modal expresses a safety warning (dangerous/forbidden)?",
              options: [
                { value: "should not", label: "should not" },
                { value: "must not", label: "must not" },
                { value: "don't need to", label: "don't need to" },
              ],
              expectedAnswer: "must not",
            },
            {
              type: "radio",
              label: "What should patients use when speaking to doctors?",
              options: [
                { value: "a", label: "Declaratives (to show respect)" },
                { value: "b", label: "Imperatives (to be direct)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Where would you see imperatives most often?",
              options: [
                { value: "a", label: "Prescription labels and clinic signs" },
                { value: "b", label: "Patient-to-doctor conversations" },
                { value: "c", label: "Emails to your boss" },
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
      question: "Which is an imperative sentence?",
      options: [
        { value: "a", label: "You should rest." },
        { value: "b", label: "Rest for a week." },
        { value: "c", label: "I recommend resting." },
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
        { value: "a", label: "Don't eat before the test." },
        { value: "b", label: "Please wait here." },
        { value: "c", label: "You need to fast before the test." },
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
        { value: "b", label: "Take this twice a day." },
        { value: "a", label: "You take this twice a day." },
        { value: "c", label: "Taking this twice a day." },
    ],
    correctAnswer: "b",
      explanation:
        "To form an imperative, remove the subject and start with the base verb: 'Take this twice a day.'",
      skillTag: "transformation-declarative-to-imperative",
      difficulty: "medium",
    },
    {
      id: "quiz-4",
      question: "Convert to declarative: 'Don't drive after taking this medication.'",
      options: [
        {
          value: "a",
          label: "You must drive after taking this medication.",
        },
        {
          value: "b",
          label: "You shouldn't drive after taking this medication.",
        },
        {
          value: "c",
          label: "You will drive after taking this medication.",
        },
      ],
      correctAnswer: "b",
      explanation:
        "A matching declarative uses a subject and modal: 'You shouldn't drive after taking this medication.'",
      skillTag: "transformation-imperative-to-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-5",
      question: "Which sentence would you see on a prescription label?",
      options: [
        { value: "a", label: "You should take one tablet daily." },
        { value: "b", label: "Take one tablet daily with food." },
        { value: "c", label: "I recommend taking one tablet daily." },
      ],
      correctAnswer: "b",
      explanation:
        "Prescription labels use imperatives for clarity and brevity: 'Take one tablet daily with food.'",
      skillTag: "context-prescription-label-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-6",
      question: "Which sentence expresses health advice (recommended but not required)?",
      options: [
        { value: "a", label: "You must take this medicine twice daily." },
        { value: "c", label: "You can take this medicine with food." },
        { value: "b", label: "You should take this medicine with food." },
    ],
    correctAnswer: "b",
      explanation:
        "'Should' expresses advice or recommendation. 'Must' is required/necessary. 'Can' is permission.",
      skillTag: "modals-should-vs-must-vs-can-advice",
      difficulty: "easy",
    },
    {
      id: "quiz-7",
      question: "Which is a safety warning (dangerous/forbidden)?",
      options: [
        { value: "b", label: "You must not drink alcohol while taking this." },
        { value: "a", label: "You should not drink alcohol." },
        { value: "c", label: "You don't need to drink alcohol." },
    ],
    correctAnswer: "b",
      explanation:
        "'Must not' is used for strong safety warnings: something is dangerous or forbidden.",
      skillTag: "modals-must-not-safety-warning",
      difficulty: "easy",
    },
    {
      id: "quiz-8",
      question: "What is the difference between 'You should rest' and 'You must rest'?",
      options: [
        { value: "a", label: "They mean the same thing." },
        { value: "b", label: "First = advice. Second = required." },
        { value: "c", label: "First = required. Second = advice." },
      ],
      correctAnswer: "b",
      explanation:
        "'Should' is advice (good idea but optional). 'Must' is required (necessary, no choice).",
      skillTag: "modals-should-vs-must-contrast",
      difficulty: "easy",
    },
    {
      id: "quiz-9",
      question: "Which is most appropriate for a patient speaking to a doctor?",
      options: [
        { value: "a", label: "Give me a referral." },
        { value: "c", label: "Refer me to a specialist." },
        { value: "b", label: "I need a referral." },
    ],
    correctAnswer: "b",
      explanation:
        "Patients should use declaratives with doctors to sound respectful: 'I need a referral.'",
      skillTag: "politeness-patient-to-doctor-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-10",
      question: "Which is the most polite way to ask for permission?",
      options: [
        { value: "b", label: "May I ask you a question?" },
        { value: "a", label: "Can I ask you a question?" },
        { value: "c", label: "I must ask you a question." },
    ],
    correctAnswer: "b",
      explanation:
        "'May I' is more formal and polite than 'Can I' when asking for permission in medical or workplace settings.",
      skillTag: "permission-can-vs-may-polite",
      difficulty: "medium",
    },
    {
      id: "quiz-11",
      question: "Which sentence talks about a patient right?",
      options: [
        { value: "a", label: "I can see my records." },
        {
          value: "b",
          label: "I am allowed to access my medical records.",
        },
        { value: "c", label: "I should see my records." },
      ],
      correctAnswer: "b",
      explanation:
        "'Are allowed to' clearly expresses a legal right or official permission.",
      skillTag: "rights-are-allowed-to-medical-records",
      difficulty: "medium",
    },
    {
      id: "quiz-12",
      question: "Complete the sentence: 'You ___ fast for 12 hours before this blood test.' (required)",
      options: [
        { value: "a", label: "should" },
        { value: "b", label: "need to" },
        { value: "c", label: "can" },
      ],
      correctAnswer: "b",
      explanation:
        "'Need to' shows necessity in conversation, similar to 'must', but more natural with patients.",
      skillTag: "necessity-need-to-vs-should",
      difficulty: "medium",
    },
    {
      id: "quiz-13",
      question:
        "Complete the sentence: 'You ___ bring anything special for a routine checkup.' (not required)",
      options: [
        { value: "b", label: "must not" },
        { value: "c", label: "should" },
        { value: "a", label: "don't need to" },
    ],
    correctAnswer: "a",
      explanation:
        "'Don't need to' means something is not necessary, which matches 'not required'.",
      skillTag: "necessity-dont-need-to-not-required",
      difficulty: "medium",
    },
    {
      id: "quiz-14",
      question: "Which is better for an employee emailing their boss?",
      options: [
        { value: "b", label: "I'd like to request time off." },
        { value: "a", label: "Approve my time off request." },
        { value: "c", label: "Give me Friday off." },
    ],
    correctAnswer: "b",
      explanation:
        "Employees should use polite declaratives with bosses: 'I'd like to request time off.'",
      skillTag: "register-employee-to-boss-declarative",
      difficulty: "medium",
    },
    {
      id: "quiz-15",
      question: "Which is a polite imperative between coworkers?",
      options: [
        { value: "a", label: "Send me that file now." },
        { value: "b", label: "Please send me that file when you can." },
        { value: "c", label: "You send me that file." },
      ],
      correctAnswer: "b",
      explanation:
        "With coworkers, polite imperatives are fine. 'Please send me that file when you can' is direct but respectful.",
      skillTag: "register-coworker-polite-imperative",
      difficulty: "easy",
    },
    {
      id: "quiz-16",
      question: "Which sentence is most appropriate for a clinic sign?",
      options: [
        { value: "a", label: "You should turn off your phone." },
        { value: "c", label: "I recommend turning off your phone." },
        { value: "b", label: "Please turn off your phone." },
    ],
    correctAnswer: "b",
      explanation:
        "Clinic signs typically use polite imperatives: 'Please turn off your phone.'",
      skillTag: "context-clinic-sign-polite-imperative",
      difficulty: "easy",
    },
  ],

  /*
  TEACHER DIAGNOSTIC NOTES – Medical Instructions Mini Quiz

  This mini quiz checks whether students can:
  - Recognize imperatives vs declaratives by structure (subject/no subject).
  - Transform between imperatives and declaratives with matching meaning.
  - Use modals (should/must/can/need to/don't need to) accurately for advice, requirements, safety, and permission.
  - Choose respectful language when speaking to doctors and bosses.
  - Recognize typical contexts: prescription labels, clinic signs, workplace emails, patient rights.

  Skill tags:

  Sentence type:
  - sentence-type-identification-imperative
  - sentence-type-identification-declarative

  Transformations:
  - transformation-declarative-to-imperative
  - transformation-imperative-to-declarative

  Modals: advice, safety, necessity, permission:
  - modals-should-vs-must-vs-can-advice
  - modals-must-not-safety-warning
  - modals-should-vs-must-contrast
  - necessity-need-to-vs-should
  - necessity-dont-need-to-not-required
  - permission-can-vs-may-polite

  Rights and register:
  - rights-are-allowed-to-medical-records
  - politeness-patient-to-doctor-declarative
  - register-employee-to-boss-declarative
  - register-coworker-polite-imperative

  Context patterns:
  - context-prescription-label-imperative
  - context-clinic-sign-polite-imperative

  How to read the diagnostics:
  - If sentence-type tags are weak →
    Revisit the basic formulas:
    • Imperative: base verb (no subject) → 'Take this.', 'Don't drive.'
    • Declarative: subject + verb → 'You should take this.', 'You must not drive.'
    Use side‑by‑side tables from this guide and have students label each sentence as IMP or DEC.

  - If transformation tags are weak →
    Practice converting in both directions:
    • You should rest. → Rest.
    • You must not drink alcohol. → Don't drink alcohol.
    • Don't drive after taking this. → You shouldn't drive after taking this.
    Emphasize keeping the same meaning (advice vs requirement vs danger).

  - If modal tags (should/must/can/need to/don't need to) are weak →
    Build a three‑column chart on the board:
    • ADVICE (should/shouldn't) → good idea
    • SAFETY (must/must not) → dangerous/required
    • NECESSITY (need to/don't need to) → required/not required
    Sort real sentences from the guide into the chart and ask students to explain why.

  - If permission and rights tags are weak →
    Contrast informal vs formal permission and rights:
    • Can I…? (informal question)
    • May I…? (formal question, respectful)
    • I am allowed to… (right/legal permission)
    Practice short role‑plays: patient with doctor, patient with receptionist, employee with HR.

  - If politeness/register tags are weak →
    Re‑teach the power relationships:
    • Doctor/Boss → use declaratives and polite questions ('I need…', 'Could I…?').
    • Patient/Employee giving instructions → usually not appropriate.
    • Coworkers → polite imperatives with 'please' are okay.
    Have students rewrite too‑direct imperatives as polite declaratives/questions.

  - If context tags (labels/signs/emails) are weak →
    Sort sentences by context:
    • Prescription labels and clinic signs → mostly imperatives.
    • Patient‑to‑doctor and employee‑to‑boss → declaratives/questions.
    • Workplace emails → polite declaratives and indirect questions.
    Ask: Where would you see this sentence? Who is speaking to whom?

  Suggested use:
  - Use this mini quiz after students complete the main sections on imperatives, declaratives, and modals in medical/workplace contexts.
  - At the class level:
    • If sentence‑type and transformation tags are red → slow down and do more structural practice and sentence‑rewriting.
    • If modal and safety tags are red → spend time on ADVICE vs MUST vs MUST NOT with real medication examples.
    • If politeness/register and rights tags are red → focus on role‑plays (doctor visits, clinic front desk, workplace conversations).
  */
};
