import type { InteractiveGuideContent } from "@/types/activity";

export const futureContinuousContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Continuous: What You'll Be Doing",
            icon: "📚",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(255, 165, 94, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 1.25rem;">🎯 The Big Idea</h3>
                    <p style="font-size: 1.05rem; margin-bottom: 0;">Future Continuous helps you describe the <strong style="color: #c86b51;">middle of a future action</strong>. You are not just saying something will happen, but that it will already be in progress at a future moment.</p>
                </div>

                <h3>Real-Life Uses</h3>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Availability</strong>: "I'll be working that day, unfortunately."</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Polite inquiry</strong>: "Will you be bringing someone with you?"</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 0.25rem;">✓ <strong>Travel timeline</strong>: "This time next week, I'll be flying to visit my family."</li>
                </ul>

                <div style="background: #fff9e6; padding: 1rem; border-radius: 0.5rem; border: 2px solid #f59e0b; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600;">📝 Formula: <span style="color: #06b6d4; font-size: 1.125rem;">will be + verb-ing</span></p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Describing what will be happening at a specific future time</li>
                        <li>Asking polite questions about other people's plans</li>
                        <li>Comparing future forms (will / going to / present continuous)</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>You'll also use this when:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Scheduling conflicts</strong>: "I'll be driving, so I can't answer calls."</li>
                        <li><strong>Appointments</strong>: "Will you be using an interpreter at the visit?"</li>
                        <li><strong>Work handoffs</strong>: "I'll be leaving at 5, so Maria will be covering."</li>
                        <li><strong>Travel/visa talk</strong>: "I'll be staying with my cousins in Chicago."</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">⏱️ Future Continuous = action in progress at a future point.</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-continuous-intro-1",
                    title: "Practice: Understanding Future Continuous",
                    instructions: "Identify what Future Continuous describes.",
                    items: [
                        {
                            type: "radio",
                            label: "What does Future Continuous describe?",
                            options: [
                                { value: "b", label: "Completed past actions" },
                                { value: "a", label: "Actions that will be in progress at a specific future moment" },
                                { value: "c", label: "Current habits" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: '"At 9 PM, I\'ll be watching my favorite show." What does this describe?',
                            options: [
                                { value: "b", label: "A completed action" },
                                { value: "c", label: "A habit" },
                                { value: "a", label: "An action in progress at a specific future time" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do we use Future Continuous?",
                            options: [
                                { value: "a", label: "To describe actions that will be happening at a specific future moment" },
                                { value: "b", label: "To describe past actions" },
                                { value: "c", label: "To describe current habits" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "meaning-usage",
            stepNumber: 1,
            title: "When Real Life Needs Future Continuous",
            icon: "⭐",
            explanation: `
                <h3>Think of Future Continuous as a "future snapshot"</h3>
                <p>You zoom in to a time tomorrow/next week and describe what will already be happening in that moment.</p>
            `,
            usageMeanings: [
                {
                    title: "⏩ 1. Action In Progress at a Future Time",
                    description: "Describe what will be happening at a set time",
                    examples: [
                        { sentence: "I <strong>will be sleeping</strong> at midnight.", explanation: "✓ Ongoing at a future clock time" },
                        { sentence: "She <strong>will be cooking</strong> when you arrive.", explanation: "✓ In progress during another future action" },
                        { sentence: "They <strong>will be playing</strong> soccer this afternoon.", explanation: "✓ Activity in progress in a future period" },
                    ],
                },
                {
                    title: "🙏 2. Polite Inquiries",
                    description: "Ask questions that sound respectful, not demanding",
                    examples: [
                        { sentence: "<strong>Will you be using</strong> the car tomorrow morning?", explanation: "✓ Softer than 'Will you use...'" },
                        { sentence: "<strong>Will you be bringing</strong> your documents to the appointment?", explanation: "✓ Polite planning question" },
                    ],
                },
                {
                    title: "📅 3. Expected or Routine Future Actions",
                    description: "Things that will naturally happen as part of plans",
                    examples: [
                        { sentence: "I'll <strong>be seeing</strong> her at work anyway.", explanation: "✓ Expected action in normal future flow" },
                        { sentence: "The team <strong>will be meeting</strong> every Friday this month.", explanation: "✓ Planned routine over a period" },
                    ],
                },
                {
                    title: "🕰️ 4. Predictions About 'Right Now' (by now)",
                    description: "Guess what is probably happening at this moment",
                    examples: [
                        { sentence: "It's 2 AM in Tokyo. She'll <strong>be sleeping</strong> by now.", explanation: "✓ Logical guess about current state" },
                        { sentence: "Don't call him at 6:30. He'll <strong>be commuting</strong> home then.", explanation: "✓ Prediction based on routine" },
                    ],
                },
                {
                    title: "🔁 5. Parallel Future Actions",
                    description: "Two actions happening at the same future period",
                    examples: [
                        { sentence: "While I'm working, you'll <strong>be relaxing</strong> at the beach.", explanation: "✓ Simultaneous future actions" },
                        { sentence: "At 10 tomorrow, I <strong>will be presenting</strong> and my manager <strong>will be taking</strong> notes.", explanation: "✓ Two ongoing future actions" },
                    ],
                },
                {
                    title: "🎢 6. Polite Availability and Scheduling",
                    description: "Explain availability without sounding abrupt",
                    examples: [
                        { sentence: "I <strong>will be visiting</strong> family then, so can we reschedule?", explanation: "✓ Soft way to decline" },
                        { sentence: "We <strong>will be on vacation</strong> next week.", explanation: "✓ Gives context for future availability" },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Remember",
                content: "Future Continuous = action in progress at a future moment. Future Simple = one-off decision or promise. Present Continuous (future) = arranged appointments.",
            },
            exercises: [
                {
                    id: "ex-usage-fc-1",
                    title: "Will It Be In Progress?",
                    instructions: "Choose when Future Continuous is the best choice.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I<span class='eg-helper'>'ll be</span> <span class='eg-verb'>sleeping</span> at midnight.\"",
                            options: [
                                { value: "promise", label: "Promise" },
                                { value: "in-progress-future", label: "In progress at a future time" },
                                { value: "habit", label: "Habit" },
                            ],
                            expectedAnswer: "in-progress-future",
                        },
                        {
                            type: "radio",
                            label: "\"She<span class='eg-helper'>'ll be</span> <span class='eg-verb'>cooking</span> when you arrive.\"",
                            options: [
                                { value: "decision-now", label: "Decision made now" },
                                { value: "finished", label: "Finished action" },
                                { value: "overlap", label: "Overlapping future action" },
                            ],
                            expectedAnswer: "overlap",
                        },
                        {
                            type: "radio",
                            label: "\"We'll be on vacation next week.\"",
                            options: [
                                { value: "availability", label: "Setting future availability/context" },
                                { value: "habit", label: "Routine" },
                                { value: "past", label: "Past action" },
                            ],
                            expectedAnswer: "availability",
                        },
                        {
                            type: "radio",
                            label: "\"Will you be using the printer at 2 PM?\"",
                            options: [
                                { value: "spontaneous", label: "Spontaneous decision right now" },
                                { value: "polite", label: "Polite inquiry about plans" },
                                { value: "past", label: "Past interruption" },
                            ],
                            expectedAnswer: "polite",
                        },
                        {
                            type: "radio",
                            label: "\"She'll be sleeping by now.\"",
                            options: [
                                { value: "promise", label: "Promise to do something" },
                                { value: "command", label: "Instruction" },
                                { value: "prediction", label: "Prediction about what is likely happening now" },
                            ],
                            expectedAnswer: "prediction",
                        },
                    ],
                },
            ],
        },
        {
            id: "timeline-visualization",
            stepNumber: 2,
            title: "Timeline: Action in Progress in the Future",
            icon: "⏰",
            explanation: `
                <h3>Future Continuous shows the middle of a future action</h3>
                <p>You choose a future point and describe what is already happening at that point.</p>

                <div style="background: white; border: 2px solid #06b6d4; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #06b6d4;">Future Timeline Snapshot</h4>

                    <div style="position: relative; margin: 2rem auto 1.25rem auto; max-width: 680px; height: 180px;">
                        <div style="position: absolute; top: 50%; left: 8%; right: 8%; height: 4px; background: linear-gradient(to right, #e2e8f0, #06b6d4 40%, #06b6d4 60%, #e2e8f0); transform: translateY(-50%);"></div>

                        <div style="position: absolute; top: calc(50% - 18px); left: 31%; right: 16%; height: 36px; background: linear-gradient(90deg, rgba(8, 145, 178, 0.38), rgba(14, 116, 144, 0.96)); border-radius: 18px; display: flex; align-items: center; justify-content: flex-start; padding-left: 0.9rem; padding-right: 6rem; box-shadow: 0 4px 14px rgba(14, 116, 144, 0.32); overflow: hidden;">
                            <span style="display: inline-block; background: rgba(8, 47, 73, 0.76); color: #ffffff; font-weight: 800; font-size: 0.93rem; line-height: 1; letter-spacing: 0.01em; white-space: nowrap; padding: 0.42rem 0.72rem; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.5); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);">
                                will be driving...
                            </span>
                        </div>

                        <div style="position: absolute; top: calc(50% - 52px); left: calc(62% - 35px); text-align: center;">
                            <div style="width: 70px; height: 70px; border-radius: 50%; background: #06b6d4; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);">
                                8 PM
                            </div>
                        </div>

                        <div style="position: absolute; top: calc(50% + 34px); left: 18%; font-size: 0.78rem; color: #64748b;">starts before 8 PM</div>
                        <div style="position: absolute; top: calc(50% + 34px); right: 14%; font-size: 0.78rem; color: #64748b;">continues after 8 PM</div>
                    </div>

                    <div style="margin-top: 2rem; background: #ecfeff; border-left: 4px solid #06b6d4; padding: 1rem; border-radius: 0.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> "At 8 PM, I <span style="color: #0891b2; font-weight: 700;">will be driving</span> home."</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Timeline Check",
                content: "If you can point to a future clock time and imagine being in the middle of the action, Future Continuous is often the right choice.",
            },
            exercises: [
                {
                    id: "ex-future-timeline-1",
                    title: "Timeline Practice: What Will Be Happening?",
                    instructions: "Choose the best Future Continuous sentence for each future time point.",
                    items: [
                        {
                            type: "radio",
                            label: "At 6 PM tomorrow, during my commute:",
                            options: [
                                { value: "a", label: "I will be driving home." },
                                { value: "b", label: "I drive home." },
                                { value: "c", label: "I drove home." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "This time next week, during your flight:",
                            options: [
                                { value: "a", label: "You are flying to Miami." },
                                { value: "b", label: "You will be flying to Miami." },
                                { value: "c", label: "You flew to Miami." },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "At 9:30 tonight, during the meeting:",
                            options: [
                                { value: "b", label: "We discussed the budget." },
                                { value: "c", label: "We discuss the budget." },
                                { value: "a", label: "We will be discussing the budget." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "future-forms-comparison",
            stepNumber: 3,
            title: "Future Choices: Present Continuous, Going To, Will, or Future Continuous?",
            icon: "🧭",
            explanation: `
                <h3>Do not overthink it: use clue words + decision timing.</h3>
                <p>Start with one question: <strong>When was the decision made?</strong> Then check if you are describing an <strong>action in progress at a future time</strong>.</p>

            `,
            futureChoiceFlow: {
                title: "Future Choice Flow",
                description: "Start with one question: When was the decision made?",
                options: [
                    {
                        trigger: "Is it a fixed arrangement on your calendar?",
                        form: "present-continuous",
                        example: "I'm meeting my advisor at 3 PM.",
                        color: "violet"
                    },
                    {
                        trigger: "Did you decide before speaking, or do you see evidence now?",
                        form: "going-to",
                        example: "I'm going to apply tonight. / It's going to rain.",
                        color: "green"
                    },
                    {
                        trigger: "Are you deciding now, offering, or promising?",
                        form: "will",
                        example: "Don't worry, I'll help.",
                        color: "cyan"
                    },
                    {
                        trigger: "Are you describing the middle of an action at a future time?",
                        form: "future-continuous",
                        example: "At 8 PM, I'll be driving home.",
                        color: "teal"
                    }
                ]
            },
            postExplanation: `
                <h3>Indicator Clues You Can Trust</h3>
                <div style="overflow-x: auto; margin-top: 0.75rem;">
                    <table style="width: 100%; min-width: 760px; border-collapse: collapse; border: 1px solid #dbeafe; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background: #ecfeff;">
                                <th style="padding: 0.75rem; border: 1px solid #dbeafe; text-align: left;">Form</th>
                                <th style="padding: 0.75rem; border: 1px solid #dbeafe; text-align: left;">Common Clues</th>
                                <th style="padding: 0.75rem; border: 1px solid #dbeafe; text-align: left;">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe; font-weight: 600;">Present Continuous (future)</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">arranged meeting, calendar time, fixed appointment</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">I'm meeting HR at 2 PM.</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe; font-weight: 600;">Going to</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">plan before speaking, visible evidence</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">Look at those clouds. It's going to rain.</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe; font-weight: 600;">Will</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">instant decision, promise, offer, no-evidence prediction</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">The phone is ringing. I'll answer it.</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe; font-weight: 600;">Future Continuous</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">at 8 PM tomorrow, this time next week, when you arrive, during</td>
                                <td style="padding: 0.75rem; border: 1px solid #dbeafe;">At 8 PM tomorrow, I'll be studying.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            tipBox: {
                title: "💡 Fast Rule",
                content: "Calendar = Present Continuous. Plan/evidence = going to. Instant reaction/promise = will. Middle of future action = Future Continuous.",
            },
            exercises: [
                {
                    id: "ex-future-choice-flow-fc-1",
                    title: "Clue Hunt: Pick the Best Future Form",
                    instructions: "Use the clue words and context to choose the best answer.",
                    items: [
                        {
                            type: "radio",
                            label: "You hear a loud knock and react immediately:",
                            options: [
                                { value: "will", label: "I'll answer it." },
                                { value: "future-cont", label: "I'll be answering it." },
                                { value: "going-to", label: "I'm going to answer it." },
                                { value: "present-cont-future", label: "I'm answering it at 3 PM." },
                            ],
                            expectedAnswer: "will",
                        },
                        {
                            type: "radio",
                            label: "Look at the black clouds:",
                            options: [
                                { value: "going-to", label: "It's going to rain." },
                                { value: "will", label: "It's raining now." },
                                { value: "future-cont", label: "It will be rain." },
                                { value: "present-cont-future", label: "It is raining tomorrow." },
                            ],
                            expectedAnswer: "going-to",
                        },
                        {
                            type: "radio",
                            label: "At 9 PM tomorrow, during the flight:",
                            options: [
                                { value: "will", label: "I'll fly to Dallas." },
                                { value: "present-cont-future", label: "I'm flying to Dallas at some point." },
                                { value: "future-cont", label: "I'll be flying to Dallas." },
                                { value: "going-to", label: "I'm going to flying to Dallas." },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "It is already on your calendar for Friday at 2 PM:",
                            options: [
                                { value: "present-cont-future", label: "I'm meeting my lawyer at 2 PM Friday." },
                                { value: "will", label: "I'll meet my lawyer at 2 PM Friday." },
                                { value: "going-to", label: "I'm going to meet my lawyer at 2 PM Friday, maybe." },
                                { value: "future-cont", label: "I'll be meeting my lawyer now." },
                            ],
                            expectedAnswer: "present-cont-future",
                        },
                    ],
                },
                {
                    id: "ex-future-choice-signal-fc-1",
                    title: "Signal Sprint: Which Form Does the Clue Suggest?",
                    instructions: "Choose the form that best matches each signal phrase.",
                    items: [
                        {
                            type: "radio",
                            label: "Signal: this time next week",
                            options: [
                                { value: "future-cont", label: "Future Continuous" },
                                { value: "going-to", label: "Going to" },
                                { value: "will", label: "Will" },
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                            ],
                            expectedAnswer: "future-cont",
                        },
                        {
                            type: "radio",
                            label: "Signal: Oh no! (instant reaction)",
                            options: [
                                { value: "will", label: "Will" },
                                { value: "future-cont", label: "Future Continuous" },
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                                { value: "going-to", label: "Going to" },
                            ],
                            expectedAnswer: "will",
                        },
                        {
                            type: "radio",
                            label: "Signal: fixed appointment at 4 PM",
                            options: [
                                { value: "present-cont-future", label: "Present Continuous (future)" },
                                { value: "will", label: "Will" },
                                { value: "future-cont", label: "Future Continuous" },
                                { value: "going-to", label: "Going to" },
                            ],
                            expectedAnswer: "present-cont-future",
                        },
                    ],
                },
            ],
        },
        {
            id: "common-mistakes",
            stepNumber: 4,
            title: "Common Mistakes with Future Continuous",
            icon: "⚠️",
            explanation: `
                <h3>Common Errors to Fix Early</h3>
                <ul style="margin: 0.75rem 0 0 0;">
                    <li>Missing <strong>be</strong>: "I will working" ❌</li>
                    <li>Wrong form after <strong>will be</strong>: "will be work" ❌</li>
                    <li>Confusing <strong>will be + -ing</strong> and <strong>going to be + -ing</strong></li>
                    <li>Using Future Continuous where Future Simple is better</li>
                </ul>
            `,
            usageMeanings: [
                {
                    title: "❌ Error 1: Missing 'be'",
                    description: "Future Continuous always needs 'will be'",
                    examples: [
                        {
                            sentence: "❌ I <span style=\"color: #ef4444;\">will working</span> late tomorrow.",
                            explanation: "✓ I <strong>will be working</strong> late tomorrow.",
                        },
                    ],
                },
                {
                    title: "❌ Error 2: Wrong Verb Form After 'will be'",
                    description: "Use verb-ing, not base verb",
                    examples: [
                        {
                            sentence: "❌ She will be <span style=\"color: #ef4444;\">work</span> from home.",
                            explanation: "✓ She will be <strong>working</strong> from home.",
                        },
                    ],
                },
                {
                    title: "❌ Error 3: Overusing Future Continuous",
                    description: "Use Future Simple for instant decisions/promises",
                    examples: [
                        {
                            sentence: "Someone's at the door. ❌ I'll be opening it.",
                            explanation: "✓ I'll <strong>open</strong> it. (spontaneous decision)",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Polite Inquiry Transformation",
                content: "Direct: 'Will you use the car tomorrow?' Softer: 'Will you be using the car tomorrow?'",
            },
            exercises: [
                {
                    id: "ex-polite-transformation-fc-1",
                    title: "Make It More Diplomatic",
                    instructions: "Change each direct question to a polite Future Continuous question.",
                    items: [
                        { type: "text", label: "Will you bring your passport tomorrow?", expectedAnswer: "Will you be bringing your passport tomorrow" },
                        { type: "text", label: "Will you use the conference room at 2?", expectedAnswer: "Will you be using the conference room at 2" },
                        { type: "text", label: "Will you stay late tonight?", expectedAnswer: "Will you be staying late tonight" },
                    ],
                },
                {
                    id: "ex-common-errors-fc-1",
                    title: "Fix the Error",
                    instructions: "Correct each future sentence.",
                    items: [
                        { type: "text", label: "I will working during the event.", expectedAnswer: "I will be working during the event" },
                        { type: "text", label: "They won't be attend the meeting.", expectedAnswer: "They won't be attending the meeting" },
                        { type: "text", label: "Will she be drive at 7 PM?", expectedAnswer: "Will she be driving at 7 PM" },
                        { type: "text", label: "I will be not available at 4 PM.", expectedAnswer: "I won't be available at 4 PM" },
                    ],
                },
                {
                    id: "ex-word-scramble-fc-1",
                    title: "Word Scramble",
                    instructions: "Reorder the words to form correct Future Continuous sentences.",
                    items: [
                        {
                            type: "word-scramble",
                            label: "be / this / flying / week / next / I / will / time",
                            words: ["be", "this", "flying", "week", "next", "I", "will", "time"],
                            correctAnswer: "I will be flying this time next week",
                        },
                        {
                            type: "word-scramble",
                            label: "you / using / be / will / tomorrow / the / car",
                            words: ["you", "using", "be", "will", "tomorrow", "the", "car"],
                            correctAnswer: "Will you be using the car tomorrow",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-positive",
            stepNumber: 5,
            title: "Positive Form",
            explanation: `
                <p>Formula: <strong>will be + verb-ing</strong>. Same for every subject.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">will be sleeping</span> at 10 PM.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            She <span style="color: #06b6d4; font-weight: 600;">will be driving</span> when you call.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">will be watching</span> the game tonight.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "will be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [{
                id: "ex-1",
                title: "Exercise 1: Picture the Future",
                instructions: "Complete with will be + verb-ing.",
                items: [
                    { type: "text", label: "The volunteers ___ (serve) meals at the shelter all day Saturday.", expectedAnswer: "will be serving" },
                    { type: "text", label: "My sister ___ (perform) in the theater production this time tomorrow.", expectedAnswer: "will be performing" },
                ],
            }],
        },
        {
            id: "step-negative",
            stepNumber: 6,
            title: "Negative Form",
            explanation: `
                <p>Use <strong>won't be + verb-ing</strong> to show what will NOT be happening.</p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            I <span style="color: #06b6d4; font-weight: 600;">won't be answering</span> my phone during the movie.
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            They <span style="color: #06b6d4; font-weight: 600;">won't be staying</span> home this weekend.
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "won't be", type: "verb" },
                { text: "+", type: "other" },
                { text: "verb-ing", type: "verb" },
            ],
            exercises: [
                {
                    id: "future-continuous-negative-1",
                    title: "Practice: Future Continuous Negative Form",
                    instructions: "Choose the correct negative form of future continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the negative form of future continuous?",
                            options: [
                                { value: "a", label: "won't be + verb-ing" },
                                { value: "b", label: "will not + verb" },
                                { value: "c", label: "won't + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "b", label: "I won't answer my phone during the movie." },
                                { value: "a", label: "I won't be answering my phone during the movie." },
                                { value: "c", label: "I won't be answer my phone during the movie." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence correctly shows what will NOT be happening?",
                            options: [
                                { value: "b", label: "They won't home this weekend." },
                                { value: "c", label: "They will not home this weekend." },
                                { value: "a", label: "They won't be staying home this weekend." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "step-questions",
            stepNumber: 7,
            title: "Question Form",
            explanation: `
                <p>Flip 'Will' to the front: <strong>Will + subject + be + verb-ing?</strong></p>

                <div style="margin-top: 1.5rem; background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid rgba(6, 182, 212, 0.3);">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem;">📋</span>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Examples</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> you <span style="color: #06b6d4; font-weight: 600;">be coming</span> to dinner tomorrow?
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid rgba(6, 182, 212, 0.1);">
                            <span style="color: #06b6d4; font-weight: 600;">Will</span> she <span style="color: #06b6d4; font-weight: 600;">be sleeping</span> at midnight?
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Will", type: "verb" },
                { text: "+", type: "other" },
                { text: "subject", type: "subject" },
                { text: "+", type: "other" },
                { text: "be + verb-ing", type: "verb" },
                { text: "?", type: "other" },
            ],
            exercises: [
                {
                    id: "ex-conjugation-1",
                    title: "Exercise 1: Conjugation Practice",
                    instructions: "Complete the conjugation chart for the verb 'work' with the subject 'I'.",
                    items: [
                        { type: "text", label: "Affirmative: I ___ be working", expectedAnswer: "will" },
                        { type: "text", label: "Negative: I ___ be working", expectedAnswer: "won't" },
                        { type: "text", label: "Question: ___ I be working?", expectedAnswer: "Will" },
                    ],
                },
                {
                    id: "ex-practice-1",
                    title: "Exercise 2: Future Actions in Progress",
                    instructions: "Complete the sentences with Future Continuous.",
                    items: [
                        { type: "text", label: "At 9 PM tonight, I ___ (watch) my favorite show.", expectedAnswer: "will be watching" },
                        { type: "text", label: "This time tomorrow, she ___ (fly) to Paris.", expectedAnswer: "will be flying" },
                        { type: "text", label: "They ___ (not work) during the holidays.", expectedAnswer: "won't be working" },
                    ],
                },
                {
                    id: "ex-error-correction-1",
                    title: "Exercise 3: Error Correction",
                    instructions: "Each sentence has ONE mistake. Find it and write the corrected version.",
                    items: [
                        { type: "text", label: "I will be sleep at midnight.", expectedAnswer: "I will be sleeping at midnight" },
                        { type: "text", label: "She won't be come to the party.", expectedAnswer: "She won't be coming to the party" },
                        { type: "text", label: "Will you be work tomorrow at 5 PM?", expectedAnswer: "Will you be working tomorrow at 5 PM" },
                    ],
                },
            ],
        },
        {
            id: "real-life-scenarios",
            stepNumber: 8,
            title: "Real-Life ESOL Scenarios",
            icon: "🧩",
            explanation: `
                <h3>Use Future Continuous in Practical Communication</h3>
                <p>These are common situations where Future Continuous sounds natural and professional.</p>
            `,
            usageMeanings: [
                {
                    title: "📅 Scheduling Conflicts",
                    description: "Explain unavailability with context",
                    examples: [
                        { sentence: "I'll <strong>be working</strong> that day, unfortunately.", explanation: "Softly explains why you cannot attend" },
                        { sentence: "I'll <strong>be driving</strong> at 6 PM, so I may miss your call.", explanation: "Sets expectations clearly" },
                    ],
                },
                {
                    title: "📞 Appointment Confirmations",
                    description: "Ask polite logistical questions",
                    examples: [
                        { sentence: "<strong>Will you be bringing</strong> someone with you to the interview?", explanation: "Polite inquiry about plans" },
                        { sentence: "<strong>Will you be needing</strong> language support during the appointment?", explanation: "Professional and respectful tone" },
                    ],
                },
                {
                    title: "✈️ Travel Planning",
                    description: "Describe where you'll be in the middle of future travel",
                    examples: [
                        { sentence: "This time next week, I'll <strong>be flying</strong> to visit my family.", explanation: "Future action in progress at a future moment" },
                        { sentence: "At 3 PM tomorrow, we <strong>will be checking in</strong> at the hotel.", explanation: "Precise time + ongoing activity" },
                    ],
                },
                {
                    title: "🤝 Workplace Handoffs",
                    description: "Coordinate coverage and transitions",
                    examples: [
                        { sentence: "I'll <strong>be leaving</strong> at 5, so Maria will cover the front desk.", explanation: "Clarifies schedule and responsibility" },
                        { sentence: "During lunch, I <strong>will be training</strong> the new staff member.", explanation: "Defines who is doing what and when" },
                    ],
                },
            ],
            exercises: [
                {
                    id: "ex-scenarios-future-cont-1",
                    title: "Scenario Match",
                    instructions: "Choose the sentence that best fits each real-life context.",
                    items: [
                        {
                            type: "radio",
                            label: "You need to decline a meeting because you're busy at that time:",
                            options: [
                                { value: "a", label: "I'll be working then, so I can't attend." },
                                { value: "b", label: "I work then yesterday." },
                                { value: "c", label: "I'm worked then." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You want to politely ask about transportation plans:",
                            options: [
                                { value: "b", label: "You will drive?" },
                                { value: "a", label: "Will you be driving to the appointment?" },
                                { value: "c", label: "Did you drive tomorrow?" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "You describe what will be happening at a specific travel time:",
                            options: [
                                { value: "b", label: "At 9 tomorrow, we boarded the plane." },
                                { value: "c", label: "At 9 tomorrow, we board plane now." },
                                { value: "a", label: "At 9 tomorrow, we'll be boarding the plane." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "summary",
            title: "Summary",
            icon: "✓",
            explanation: `<ul class="list-disc pl-6 space-y-1"><li><strong>Use:</strong> Actions in progress at a specific future time; polite availability notes; expected ongoing events</li><li><strong>Form:</strong> will be + verb-ing (or won't be + verb-ing for negatives)</li><li><strong>Signal words:</strong> at 8pm tomorrow, this time next week, when you join, during</li><li><strong>Need full tense comparison?</strong> Review <em>Continuous Tenses Review</em> for cross-tense decisions.</li></ul>`,
            exercises: [
                {
                    id: "future-continuous-summary-1",
                    title: "Practice: Future Continuous Review",
                    instructions: "Test your understanding of future continuous.",
                    items: [
                        {
                            type: "radio",
                            label: "What is the formula for Future Continuous?",
                            options: [
                                { value: "a", label: "will be + verb-ing" },
                                { value: "b", label: "am/is/are + verb-ing" },
                                { value: "c", label: "was/were + verb-ing" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "When do you use Future Continuous?",
                            options: [
                                { value: "b", label: "Actions happening right now" },
                                { value: "a", label: "Actions in progress at a specific future time; polite availability notes" },
                                { value: "c", label: "Past actions in progress" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "What are signal words for Future Continuous?",
                            options: [
                                { value: "b", label: "yesterday, last week, ago" },
                                { value: "c", label: "now, at the moment" },
                                { value: "a", label: "at 8pm tomorrow, this time next week, when you join, during" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "a", label: "I will be studying at 8pm tomorrow." },
                                { value: "b", label: "I will study at 8pm tomorrow." },
                                { value: "c", label: "I am studying at 8pm tomorrow." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which sentence uses Future Continuous for polite availability?",
                            options: [
                                { value: "b", label: "I visit family tomorrow." },
                                { value: "a", label: "I'll be visiting family tomorrow, so I can't meet." },
                                { value: "c", label: "I'll visit family tomorrow." },
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
            question: "Which sentence uses Future Continuous correctly?",
            options: [
                { value: "a", label: "I will be study at 8pm." },
                { value: "c", label: "I am studying at 8pm tomorrow." },
                { value: "b", label: "I will be studying at 8pm." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous: will be + verb-ing. The -ing form is required after 'will be'.",
            skillTag: "form-future-cont-will-be-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Pick the best use of Future Continuous vs Future Simple.",
            options: [
                { value: "b", label: "She will be cooking when you arrive." },
                { value: "a", label: "She will cook when you arrive." },
                { value: "c", label: "She cooks when you arrive." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous shows an ongoing action overlapping another future event. She starts cooking before you arrive.",
            skillTag: "meaning-future-overlap-when",
            difficulty: "medium",
        },
        {
            id: "quiz-3",
            question: "Which question is correct?",
            options: [
                { value: "b", label: "Will you sleeping at midnight?" },
                { value: "a", label: "Will you be sleeping at midnight?" },
                { value: "c", label: "You will be sleeping at midnight?" },
            ],
            correctAnswer: "a",
            explanation: "Question form: Will + subject + be + verb-ing? All three parts (will, be, -ing) are needed.",
            skillTag: "form-future-cont-question-will-subject-be-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "Choose the sentence that politely sets future availability.",
            options: [
                { value: "a", label: "I visit family when you call tomorrow." },
                { value: "b", label: "I'll visit family when you call tomorrow." },
                { value: "c", label: "I'll be visiting family tomorrow, so I can't meet." },
            ],
            correctAnswer: "c",
            explanation: "Future Continuous is often used to set expectations/availability politely. It sounds softer than a direct 'I can't'.",
            skillTag: "meaning-future-cont-polite-availability",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "What is the negative form of 'I will be working'?",
            options: [
                { value: "a", label: "I won't be working" },
                { value: "b", label: "I will not working" },
                { value: "c", label: "I won't working" },
            ],
            correctAnswer: "a",
            explanation: "Negative: won't be + verb-ing. 'Be' is required in the negative form too.",
            skillTag: "form-future-cont-negative-wont-be-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "Which time expression fits Future Continuous?",
            options: [
                { value: "b", label: "yesterday at noon" },
                { value: "a", label: "at 8 PM tomorrow" },
                { value: "c", label: "right now" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous uses future time expressions like 'at 8 PM tomorrow' or 'this time next week'.",
            skillTag: "time-expressions-future-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Fill in: 'This time next week, I ___ (travel) to Spain.'",
            options: [
                { value: "b", label: "was traveling" },
                { value: "c", label: "am traveling" },
                { value: "a", label: "will be traveling" },
            ],
            correctAnswer: "a",
            explanation: "'This time next week' signals a future point in time. Use Future Continuous for an ongoing action then.",
            skillTag: "meaning-future-in-progress-specific-time",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "What's the formula for Future Continuous?",
            options: [
                { value: "a", label: "will be + verb-ing" },
                { value: "b", label: "will + verb" },
                { value: "c", label: "be going to + verb" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous = will be + verb-ing. It's the same for all subjects (I/you/he/she/we/they).",
            skillTag: "form-future-cont-will-be-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "Which sentence shows two overlapping future actions?",
            options: [
                { value: "a", label: "I'll call you at 6 PM." },
                { value: "b", label: "I'll be driving when you call." },
                { value: "c", label: "I drive to work every day." },
            ],
            correctAnswer: "b",
            explanation: "'I'll be driving when you call' shows driving (ongoing) overlapping with your call (a point in time).",
            skillTag: "meaning-future-overlap-when",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Fix the error: 'She will be work late tonight.'",
            options: [
                { value: "b", label: "She will work late tonight." },
                { value: "c", label: "She is working late tonight." },
                { value: "a", label: "She will be working late tonight." },
            ],
            correctAnswer: "a",
            explanation: "After 'will be', you must use the -ing form: 'will be working', not 'will be work'.",
            skillTag: "error-future-cont-missing-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Which question asks about an ongoing future action?",
            options: [
                { value: "a", label: "Will you be studying at 9 PM?" },
                { value: "b", label: "Did you study for the test?" },
                { value: "c", label: "Do you study every day?" },
            ],
            correctAnswer: "a",
            explanation: "'Will you be studying' asks about an action in progress at a specific future time (9 PM).",
            skillTag: "form-future-cont-question-will-subject-be-verb-ing",
            difficulty: "easy",
        },
        {
            id: "quiz-12",
            question: "When do you use Future Continuous instead of Future Simple?",
            options: [
                { value: "b", label: "To describe a quick decision made now" },
                { value: "a", label: "To emphasize the action will be in progress at a specific future time" },
                { value: "c", label: "To describe a completed action" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous = action in progress. Future Simple = one-off event or decision.",
            skillTag: "contrast-future-cont-vs-future-simple",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Complete: 'At midnight, the whole family ___ (sleep).'",
            options: [
                { value: "b", label: "will sleep" },
                { value: "c", label: "sleeps" },
                { value: "a", label: "will be sleeping" },
            ],
            correctAnswer: "a",
            explanation: "'At midnight' specifies a future point when the action will be in progress—use Future Continuous.",
            skillTag: "meaning-future-in-progress-specific-time",
            difficulty: "easy",
        },
        {
            id: "quiz-14",
            question: "Which is a polite way to decline an invitation?",
            options: [
                { value: "b", label: "I'll be working that day, unfortunately." },
                { value: "a", label: "I can't come." },
                { value: "c", label: "I won't come." },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous ('I'll be working') sounds softer and more polite than a flat refusal.",
            skillTag: "meaning-future-cont-polite-availability",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "How is Future Continuous different from Present Continuous for future?",
            options: [
                { value: "b", label: "They are exactly the same" },
                { value: "a", label: "Future Continuous uses 'will be', Present Continuous uses 'am/is/are'" },
                { value: "c", label: "Future Continuous uses 'was/were'" },
            ],
            correctAnswer: "a",
            explanation: "Both can express future actions, but Future Continuous uses 'will be + -ing' while Present Continuous uses 'am/is/are + -ing'.",
            skillTag: "form-vs-present-continuous-future",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question: "Which sentence is the best polite inquiry?",
            options: [
                { value: "a", label: "Will you use the printer?" },
                { value: "c", label: "You will use the printer?" },
                { value: "b", label: "Will you be using the printer this afternoon?" },
            ],
            correctAnswer: "b",
            explanation: "Future Continuous often sounds more diplomatic for availability questions.",
            skillTag: "meaning-future-cont-polite-inquiry",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "Choose the best prediction about now: 'It's midnight in Seoul...'",
            options: [
                { value: "a", label: "She'll be sleeping by now." },
                { value: "b", label: "She'll sleep by now." },
                { value: "c", label: "She slept by now." },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous can express a likely current situation from another time perspective.",
            skillTag: "meaning-future-cont-prediction-by-now",
            difficulty: "medium",
        },
        {
            id: "quiz-18",
            question: "Which sentence shows parallel future actions?",
            options: [
                { value: "b", label: "While I worked, you'll relax." },
                { value: "a", label: "While I'm working, you'll be relaxing." },
                { value: "c", label: "While I am working, you relaxed." },
            ],
            correctAnswer: "a",
            explanation: "Two actions can be in progress at the same future time using continuous forms.",
            skillTag: "meaning-parallel-future-actions",
            difficulty: "medium",
        },
        {
            id: "quiz-19",
            question: "You see dark clouds. Which sentence is best?",
            options: [
                { value: "a", label: "It's going to rain." },
                { value: "b", label: "I'll be raining." },
                { value: "c", label: "I'm raining at 3 PM." },
            ],
            correctAnswer: "a",
            explanation: "Visible evidence usually points to going to: 'It's going to rain.'",
            skillTag: "contrast-going-to-evidence-vs-will",
            difficulty: "medium",
        },
        {
            id: "quiz-20",
            question: "Which clue strongly signals Future Continuous?",
            options: [
                { value: "b", label: "at 8 PM tomorrow" },
                { value: "a", label: "Oh! I forgot!" },
                { value: "c", label: "I promise." },
            ],
            correctAnswer: "b",
            explanation: "A specific future time point ('at 8 PM tomorrow') often signals Future Continuous.",
            skillTag: "meaning-indicator-future-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-21",
            question: "Which sentence best matches a fixed appointment?",
            options: [
                { value: "a", label: "I'm meeting the nurse at 2 PM." },
                { value: "b", label: "I'll meet the nurse at 2 PM right now." },
                { value: "c", label: "I'm going to be meeting the nurse now." },
            ],
            correctAnswer: "a",
            explanation: "For a scheduled appointment, Present Continuous is natural: 'I'm meeting...'.",
            skillTag: "contrast-future-form-arranged-present-cont",
            difficulty: "medium",
        },
    ],

    // Teacher Diagnostic Notes (for reference, not shown to students)
    // -------------------------------------------------------------
    // These notes help teachers interpret student performance on the miniQuiz.
    // - Questions tagged 'form-future-cont-will-be-verb-ing', 'form-future-cont-question-will-subject-be-verb-ing', etc. reveal issues with structure and accuracy.
    // - Questions tagged 'meaning-future-overlap-when', 'meaning-future-in-progress-specific-time', etc. show if students grasp the concept of ongoing/overlapping future actions.
    // - Items with skillTag 'meaning-future-cont-polite-availability' indicate students' pragmatic awareness (polite refusals, setting context).
    // - Difficulty: 'easy' = checks basic formula or recognition; 'medium' = requires contrast/meaning or subtle pragmatic use.
    // - If students miss 'easy' form questions, review the formula and drill the structure.
    // - If students miss 'medium' meaning/pragmatic questions, use more real-life scenarios and contrast with Future Simple/Present Continuous.
    // - Use the skillTag to target follow-up activities and group students for extra practice as needed.
};
