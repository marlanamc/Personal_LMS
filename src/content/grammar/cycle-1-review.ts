import type { InteractiveGuideContent } from "@/types/activity";

export const cycleOneReviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Cycle 1 Review: A gentle grammar check-in",
            icon: "🌱",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.12) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem; border-left: 5px solid #22c55e;">
                    <h3 style="margin-top: 0; color: #16a34a; font-size: 1.4rem;">Cycle 1: The Foundation</h3>
                    <p style="font-size: 1.1rem; line-height: 1.6;">
                        Cycle 1 asked you to notice how time and meaning play together in everyday routines. This is a quick review to see what you remember and what we need to practice more before we start Cycle 2.
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #22c55e; margin-top: 0;">🛠️ Simple</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Habits, Facts, Finished Stories.</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #3b82f6; margin-top: 0;">🌊 Continuous</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Actions in motion (Duration).</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <h4 style="color: #f59e0b; margin-top: 0;">🌉 Perfect</h4>
                            <p style="font-size: 0.85rem; color: #4b5563;">Connecting past to now (Result).</p>
                        </div>
                    </div>
                </div>
                <p>Think of each section as another layer on the same story. You already have the sentences; this guide simply names the pieces and lets you practice them together.</p>
            `,
            tipBox: {
                title: "✨ Reminder",
                content: "This guide is about noticing patterns. If a sentence already feels familiar, you are ready to move on to the next layer—no need to memorize every word."
            },
            exercises: [
                {
                    id: "cycle1-intro-tone",
                    title: "A quick mood check",
                    instructions: "Choose the tone that matches the kind of review we promised above.",
                    items: [
                        {
                            type: "radio",
                            label: "What feels like the best description?",
                            options: [
                                { value: "strict", label: "Strict list of rules and exceptions" },
                                { value: "warm", label: "Warm check-in that highlights meaning" },
                                { value: "silent", label: "Pure reference with no feeling" },
                            ],
                            expectedAnswer: "warm"
                        }
                    ]
                }
            ]
        },
        {
            id: "simple-tenses",
            title: "Simple Tenses and the words that pin them to time",
            icon: "🕰️",
            explanation: `
                <p>Simple tenses are the backbone of everyday stories. They each live in their own moment: present for habits, past for finished stories, and future for plans.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #22c55e; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #16a34a; display: flex; align-items: center; gap: 0.5rem;">☀️ Present Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Every day / Usually</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I take the bus."</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">📖 Past Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Yesterday / Last week</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I took the bus."</p>
                    </div>
                    <div style="background: #fffbeb; padding: 1.25rem; border-radius: 0.75rem; border-top: 4px solid #f59e0b; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #b45309; display: flex; align-items: center; gap: 0.5rem;">🎯 Future Simple</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Tomorrow / Soon</strong></p>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"I will take the bus."</p>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
                    <p style="margin: 0; font-size: 0.95rem;">Don’t forget how to make negatives and questions: <strong>don’t/doesn’t/didn’t</strong> flip the routine upside down, and <strong>do/does/did</strong> invite conversation.</p>
                </div>
            `,
            timeExpressions: [
                {
                    word: "today / every day",
                    usage: "Present Simple for habitual routines and facts",
                    examples: ["I eat breakfast at home every day.", "She takes the bus today."],
                },
                {
                    word: "yesterday / last night / in 2020",
                    usage: "Past Simple to talk about finished actions with a clear time",
                    examples: ["I visited the museum last night.", "We cleaned the kitchen in 2020."],
                },
                {
                    word: "tomorrow / next week / soon",
                    usage: "Future Simple to share quick plans or predictions",
                    examples: ["I will call you tomorrow.", "They will start the new class soon."],
                }
            ],
            usageMeanings: [
                {
                    title: "Present Simple: Habits and facts",
                    description: "Use this tense for routines, schedules, and truths you say without thinking.",
                    examples: [
                        { sentence: "I take a walk every morning.", explanation: "Daily habit" },
                        { sentence: "The library opens at 9 a.m.", explanation: "Schedule/fact" }
                    ]
                },
                {
                    title: "Past Simple: Stories with a timestamp",
                    description: "Close the story; the action finished at a specific time.",
                    examples: [
                        { sentence: "We met our mentors last week.", explanation: "Finished action" },
                        { sentence: "She cooked dinner yesterday.", explanation: "Clearly past" }
                    ]
                },
                {
                    title: "Future Simple: Promises and plans",
                    description: "Promise, plan, or quick decision for a moment that is still ahead.",
                    examples: [
                        { sentence: "I will bring the files tomorrow.", explanation: "Promise" },
                        { sentence: "He will help us next month.", explanation: "Near-future plan" }
                    ]
                }
            ],
            exercises: [
                {
                    id: "cycle1-simple-situations",
                    title: "Match the tense to the time cue",
                    instructions: "Read the cue and select the simple tense that sounds natural for that sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Every morning, I ___ coffee.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "future-simple", label: "Future Simple" },
                                { value: "present-simple", label: "Present Simple" },
                            ],
                            expectedAnswer: "present-simple"
                        },
                        {
                            type: "radio",
                            label: "\"Yesterday, we ___ the homework.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "present-simple", label: "Present Simple" },
                                { value: "future-simple", label: "Future Simple" },
                            ],
                            expectedAnswer: "past-simple"
                        },
                        {
                            type: "radio",
                            label: "\"Tomorrow, I ___ you.\"",
                            options: [
                                { value: "present-simple", label: "Present Simple" },
                                { value: "future-simple", label: "Future Simple" },
                                { value: "past-simple", label: "Past Simple" },
                            ],
                            expectedAnswer: "future-simple"
                        }
                    ]
                },
                {
                    id: "cycle1-simple-time-select",
                    title: "Pick the time anchor",
                    instructions: "Choose the time word that matches the tense in each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "\"She will finish the test.\"",
                            options: ["yesterday", "tomorrow", "today"],
                            expectedAnswer: "tomorrow"
                        },
                        {
                            type: "select",
                            label: "\"They talked about the trip ___.\"",
                            options: ["next week", "last night", "right now"],
                            expectedAnswer: "last night"
                        }
                    ]
                }
            ]
        },
        {
            id: "questions-negatives",
            title: "Questions & Negatives that keep you honest",
            icon: "❓",
            explanation: `
                <p>Every tense can be affirmative, negative, or a question. Helpers move the same way: do/does/did for simple forms, will for future, and be for continuous ones.</p>
                
                <div style="overflow-x: auto; margin: 1.5rem 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">If it is...</th>
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">Helper Verb (Negative)</th>
                                <th style="padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: left;">Helper Verb (Question)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Present Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">don't / doesn't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Do / Does...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Past Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">didn't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Did...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Future Simple</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">won't</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Will...?</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Continuous</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #dc2626;">am/is/are not</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9; color: #16a34a;">Am/Is/Are...?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Present Simple helpers",
                    description: "Use don't/doesn't for negatives and do/does for questions around habits.",
                    examples: [
                        { sentence: "I don't drink coffee after 5 p.m.", explanation: "Negative routine" },
                        { sentence: "Do you take the train every morning?", explanation: "Question about habit" }
                    ]
                },
                {
                    title: "Past Simple helpers",
                    description: "Past questions and negatives stay with did—it carries the past time at the front of the sentence.",
                    examples: [
                        { sentence: "He didn't finish the work yesterday.", explanation: "Negative past action" },
                        { sentence: "Did she call when the class ended?", explanation: "Past yes/no question" }
                    ]
                },
                {
                    title: "Future Simple helpers",
                    description: "Future negatives use won't; questions swap will to the front.",
                    examples: [
                        { sentence: "I won't forget to send the email.", explanation: "Future negative promise" },
                        { sentence: "Will you join the conversation tomorrow?", explanation: "Future invitation" }
                    ]
                },
                {
                    title: "Continuous helpers stay close",
                    description: "Continuous negatives/questions keep the be helper in place (am/is/are/was/were/will be).",
                    examples: [
                        { sentence: "She isn't sleeping; she's studying instead.", explanation: "Negative present continuous" },
                        { sentence: "Are they arriving while the class starts?", explanation: "Present continuous question" }
                    ]
                }
            ],
            tipBox: {
                title: "🧭 Helper check",
                content: "Ask yourself: 'What helper verb do I hear?' That helper tells you whether it's simple or continuous and whether you're in a negative or question mood."
            },
            exercises: [
                {
                    id: "cycle1-helper-identify",
                    title: "Helper hunt",
                    instructions: "Choose whether each sentence is affirmative, negative, or a question.",
                    items: [
                        {
                            type: "radio",
                            label: "\"Do you practice every week?\"",
                            options: [
                                { value: "negative", label: "Negative" },
                                { value: "positive", label: "Affirmative" },
                                { value: "question", label: "Question" },
                            ],
                            expectedAnswer: "question"
                        },
                        {
                            type: "radio",
                            label: "\"She doesn't come on Saturdays.\"",
                            options: [
                                { value: "negative", label: "Negative" },
                                { value: "question", label: "Question" },
                                { value: "positive", label: "Affirmative" },
                            ],
                            expectedAnswer: "negative"
                        },
                        {
                            type: "radio",
                            label: "\"We will not miss the train.\"",
                            options: [
                                { value: "question", label: "Question" },
                                { value: "negative", label: "Negative" },
                                { value: "positive", label: "Affirmative" }
                            ],
                            expectedAnswer: "negative"
                        }
                    ]
                },
                {
                    id: "cycle1-helper-rewrite",
                    title: "Shift the helper",
                    instructions: "Rewrite each sentence in the requested form.",
                    items: [
                        {
                            type: "text",
                            label: "Change to a question: 'You practiced yesterday.'",
                            expectedAnswer: "Did you practice yesterday?"
                        },
                        {
                            type: "text",
                            label: "Change to a negative: 'He is listening now.'",
                            expectedAnswer: "He isn't listening now."
                        },
                        {
                            type: "text",
                            label: "Change to a question: 'They are studying late.'",
                            expectedAnswer: "Are they studying late?"
                        }
                    ]
                }
            ]
        },
        {
            id: "continuous-tenses",
            title: "Continuous Tenses: the motion of a moment",
            icon: "🌊",
            explanation: `
                <p>Continuous tenses keep one foot on the ground and one foot moving. They use <strong>be + verb-ing</strong> to show actions that are in progress or ongoing.</p>
                
                <div style="background: white; border: 2px solid #3b82f6; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0; color: #1d4ed8;">Timeline: The Living Moment</h4>
                    <div style="position: relative; margin: 2rem auto; max-width: 500px; padding: 1rem 0;">
                        <!-- Highlighted bar -->
                        <div style="position: relative; height: 35px; background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 1)); border-radius: 17px; border: 2px solid #3b82f6; display: flex; align-items: center; padding: 0 1.5rem;">
                             <span style="color: #1e3a8a; font-weight: 600; font-size: 0.85rem;">...walking...talking...playing...</span>
                        </div>
                        <div style="display: flex; justify-content: center; margin-top: 0.75rem; font-size: 0.8rem; color: #64748b;">
                            <span>Focus: The Duration of the Action</span>
                        </div>
                    </div>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "Helping verb be (am/is/are/was/were/will be)", type: "verb" },
                { text: "Main verb + -ing", type: "other" }
            ],
            usageMeanings: [
                {
                    title: "Present Continuous: action in progress",
                    description: "This feels like something happening right as you tell it.",
                    examples: [
                        { sentence: "I am talking while I prepare the notes.", explanation: "Middle of the action" },
                        { sentence: "They are reading quietly now.", explanation: "Right now" }
                    ]
                },
                {
                    title: "Past Continuous: background or interrupted actions",
                    description: "Use this when another action happens in the middle of something else.",
                    examples: [
                        { sentence: "The bus was arriving when the rain started.", explanation: "Background action interrupted" },
                        { sentence: "She was teaching while the kids were drawing.", explanation: "Two actions in progress" }
                    ]
                },
                {
                    title: "Future Continuous: we imagine the future moment in motion",
                    description: "Shows that the action will be happening at a specific time ahead.",
                    examples: [
                        { sentence: "He will be working at 3 p.m. tomorrow.", explanation: "Future routine in progress" },
                        { sentence: "We will be practicing when the guests arrive.", explanation: "Future overlap" }
                    ]
                }
            ],
            tipBox: {
                title: "💡 Continuous key",
                content: "Keep the helper verb be in all continuous tenses. Only the form (am/is/are, was/were, will be) changes with the time you mean."
            },
            exercises: [
                {
                    id: "cycle1-continuous-feel",
                    title: "Why the continuous tense?",
                    instructions: "Match each sentence to the reason you hear a continuous tense.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I am listening while you explain.\"",
                            options: [
                                { value: "past", label: "Action that finished" },
                                { value: "future", label: "Plan for tomorrow" },
                                { value: "now", label: "Showing action happening right now" },
                            ],
                            expectedAnswer: "now"
                        },
                        {
                            type: "radio",
                            label: "\"They were cooking when the guests knocked.\"",
                            options: [
                                { value: "interrupt", label: "Background action interrupted" },
                                { value: "habit", label: "Regular routine" },
                                { value: "promise", label: "Future promise" }
                            ],
                            expectedAnswer: "interrupt"
                        },
                        {
                            type: "radio",
                            label: "\"We will be studying while the computers run practice tests.\"",
                            options: [
                                { value: "past", label: "Past routine" },
                                { value: "future-overlap", label: "Two future actions overlapping" },
                                { value: "simple", label: "Simple future" },
                            ],
                            expectedAnswer: "future-overlap"
                        }
                    ]
                },
                {
                    id: "cycle1-continuous-rewrite",
                    title: "Rewrite for ongoing action",
                    instructions: "Turn the sentence into a continuous form that feels like the action is unfolding now.",
                    items: [
                        {
                            type: "text",
                            label: "Right now, I eat lunch.",
                            expectedAnswer: "I am eating lunch."
                        }
                    ]
                }
            ]
        },
        {
            id: "present-perfect",
            title: "Present Perfect: your stories with a bridge to now",
            icon: "🌉",
            explanation: `
                <p>Present perfect connects the past to the present. Think of it as the <strong>"Result"</strong> tense—it's not about <em>when</em> it happened, but that it's <em>done</em> now.</p>
                
                <div style="background: #fffbeb; border-left: 5px solid #f59e0b; padding: 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0;">
                    <p style="margin: 0; font-size: 1.1rem; color: #92400e; font-weight: 600;">"I have finished."</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #b45309;">Result: The task is ready for me to show you!</p>
                </div>

                <p>We often see words like <strong>already</strong>, <strong>yet</strong>, <strong>for</strong>, and <strong>since</strong>.</p>

                <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 0.75rem; padding: 1.25rem; margin: 1.5rem 0;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #92400e;">⏰ "This week / This month / This year" = Present Perfect</h4>
                    <p style="margin: 0 0 0.75rem 0; font-size: 0.95rem; color: #78350f;">When the time period is <strong>not finished yet</strong>, use present perfect:</p>
                    <ul style="margin: 0; font-size: 0.9rem; color: #78350f;">
                        <li><em>This week, I <strong>have applied</strong> for three jobs.</em> (The week isn't over.)</li>
                        <li><em>This month, she <strong>has visited</strong> the library twice.</em> (The month continues.)</li>
                        <li><em>This year, we <strong>have learned</strong> a lot.</em> (The year is still going.)</li>
                    </ul>
                    <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #92400e;"><strong>Compare:</strong> <em>"Last week, I <strong>applied</strong> for three jobs."</em> (Past simple—the week is finished.)</p>
                </div>
            `,
            formula: [
                { text: "Subject", type: "subject" },
                { text: "have / has", type: "verb" },
                { text: "past participle", type: "other" }
            ],
            timeExpressions: [
                { word: "this week / month / year", usage: "Unfinished time periods", examples: ["I have studied a lot this week.", "She has traveled twice this year."] },
                { word: "already / yet", usage: "Recently finished actions", examples: ["I have already finished the task.", "Have you finished yet?"] },
                { word: "ever / never", usage: "Experiences up to now", examples: ["Have you ever tried falafel?", "I have never been to Boston."] },
                { word: "for / since", usage: "Actions that continue to the present", examples: ["She has lived here for five years.", "They have known each other since 2010."] }
            ],
            usageMeanings: [
                {
                    title: "Experiences with present perfect",
                    description: "Talk about things you have (or haven't) done before now.",
                    examples: [
                        { sentence: "I have traveled on the Green Line.", explanation: "Experience" },
                        { sentence: "She has never seen snow.", explanation: "Negative experience" }
                    ]
                },
                {
                    title: "Recent actions that still matter",
                    description: "Use this tense when the action finished recently but the moment is still connected to the present.",
                    examples: [
                        { sentence: "We have just cleaned the room.", explanation: "Result still visible" },
                        { sentence: "He has already started the meeting.", explanation: "Action finished, impact now" }
                    ]
                }
            ],
            tipBox: {
                title: "💡 Notice the difference",
                content: "Past simple likes clear time markers (yesterday, last week). Present perfect leaves the time open or uses words like for/since, yet, already."
            },
            exercises: [
                {
                    id: "cycle1-present-perfect-scramble",
                    title: "Reorder to make a present perfect sentence",
                    instructions: "Click the words in the correct order to make a present perfect sentence (something that just happened or is connected to now).",
                    items: [
                        {
                            type: "word-scramble",
                            label: "Words: have / just / I / eaten / lunch",
                            words: ["have", "just", "I", "eaten", "lunch"],
                            correctAnswer: "I have just eaten lunch.",
                            hint: "Start with the subject and the helper verb."
                        },
                        {
                            type: "word-scramble",
                            label: "Words: has / just / She / signed / the / forms",
                            words: ["has", "just", "She", "signed", "the", "forms"],
                            correctAnswer: "She has just signed the forms.",
                            hint: "Subject + has + just + past participle."
                        },
                        {
                            type: "word-scramble",
                            label: "Words: have / already / They / left / the / office",
                            words: ["have", "already", "They", "left", "the", "office"],
                            correctAnswer: "They have already left the office.",
                            hint: "Start with the subject (They), then the helper verb (have)."
                        },
                        {
                            type: "word-scramble",
                            label: "Words: has / He / just / finished / the / report",
                            words: ["has", "He", "just", "finished", "the", "report"],
                            correctAnswer: "He has just finished the report.",
                            hint: "Subject + has + just + past participle."
                        }
                    ]
                }
            ]
        },
        {
            id: "common-confusions",
            title: "Commonly confused moments: pause and notice",
            icon: "⚠️",
            explanation: `
                <p>Because the tenses share similar vocabulary, we sometimes use the wrong helping verb. This section pauses on a few crowded corners so you can feel the difference.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
                    <!-- Time Comparison -->
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="margin: 0 0 1rem 0; color: #475569; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.5rem;">Finished vs Open Time</h4>
                        <div style="margin-bottom: 1rem;">
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Past Simple (Finished)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I eaten yesterday." ❌</p>
                            <p style="margin: 0; font-size: 0.95rem;">"I <strong>ate</strong> yesterday." ✓</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Present Perfect (Open)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I have eaten today." ✓</p>
                        </div>
                    </div>

                    <!-- Motion Comparison -->
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
                        <h4 style="margin: 0 0 1rem 0; color: #475569; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.5rem;">Fact vs Motion</h4>
                        <div style="margin-bottom: 1rem;">
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Simple (Fact/Habit)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I work at 9."</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Continuous (In Motion)</p>
                            <p style="margin: 0.25rem 0; font-size: 0.95rem;">"I am working now."</p>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 0.75rem; padding: 1.25rem; margin: 1.5rem 0;">
                    <h4 style="margin: 0 0 1rem 0; color: #92400e;">🔑 Key Rule: "This week" vs "Last week"</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <p style="margin: 0; font-size: 0.8rem; color: #dc2626; font-weight: 600;">LAST week/month/year = FINISHED</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;"><em>Last week, I <strong>applied</strong> for a job.</em></p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #64748b;">→ Past Simple (the week is over)</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem;">
                            <p style="margin: 0; font-size: 0.8rem; color: #16a34a; font-weight: 600;">THIS week/month/year = STILL OPEN</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;"><em>This week, I <strong>have applied</strong> for a job.</em></p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #64748b;">→ Present Perfect (the week continues)</p>
                        </div>
                    </div>
                    <p style="margin: 1rem 0 0 0; font-size: 0.9rem; color: #78350f; text-align: center;"><strong>Ask yourself:</strong> Is the time period over? If yes → past simple. If no → present perfect.</p>
                </div>
            `,
            tipBox: {
                title: "🧭 Quick check",
                content: "Ask: 'Is the time finished?' and 'Is the action moving?' That helps you pair the tense with either past (specific) or present perfect (open) and simple vs continuous motion."
            },
            exercises: [
                {
                    id: "cycle1-confusions-radio",
                    title: "Which tense belongs?",
                    instructions: "Listen to the clue and choose the tense that fits the time/motion.",
                    items: [
                        {
                            type: "radio",
                            label: "\"I ___ the form yesterday.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "present-perfect", label: "Present Perfect" }
                            ],
                            expectedAnswer: "past-simple"
                        },
                        {
                            type: "radio",
                            label: "\"I ___ the form this week.\"",
                            options: [
                                { value: "past-simple", label: "Past Simple" },
                                { value: "present-perfect", label: "Present Perfect" }
                            ],
                            expectedAnswer: "present-perfect"
                        },
                        {
                            type: "radio",
                            label: "\"She ___ Spanish every Friday.\"",
                            options: [
                                { value: "simple", label: "Simple tense" },
                                { value: "continuous", label: "Continuous tense" }
                            ],
                            expectedAnswer: "simple"
                        },
                        {
                            type: "radio",
                            label: "\"She ___ Spanish right now.\"",
                            options: [
                                { value: "simple", label: "Simple tense" },
                                { value: "continuous", label: "Continuous tense" }
                            ],
                            expectedAnswer: "continuous"
                        },
                        {
                            type: "radio",
                            label: "\"This month, she ___ three books.\"",
                            options: [
                                { value: "present-perfect", label: "Present Perfect (has read)" },
                                { value: "past-simple", label: "Past Simple (read)" },
                            ],
                            expectedAnswer: "present-perfect"
                        },
                        {
                            type: "radio",
                            label: "\"Last month, she ___ three books.\"",
                            options: [
                                { value: "present-perfect", label: "Present Perfect (has read)" },
                                { value: "past-simple", label: "Past Simple (read)" },
                            ],
                            expectedAnswer: "past-simple"
                        }
                    ]
                },
                {
                    id: "cycle1-confusions-fill",
                    title: "Fix the confusion",
                    instructions: "Write only the verb in the correct tense (e.g., \"have finished\").",
                    items: [
                        {
                            type: "text",
                            label: "This week I ___ (finish) the report (present perfect).",
                            expectedAnswer: "have finished"
                        },
                        {
                            type: "text",
                            label: "Right now he ___ (talk) to the coach (present continuous).",
                            expectedAnswer: "is talking"
                        },
                        {
                            type: "text",
                            label: "This year we ___ (visit) the museum twice (present perfect).",
                            expectedAnswer: "have visited"
                        }
                    ]
                }
            ]
        },
        {
            id: "parts-of-speech",
            title: "Core parts of speech: the words that describe your tenses",
            icon: "🧱",
            explanation: `
                <p>Identify the building blocks of every sentence. When you know the parts, the grammar patterns become clear.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #fdf2f8; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #fbcfe8;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">👤</span>
                        <h4 style="margin: 0; color: #be185d;">Noun</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #9d174d;">Person, Place, Thing</p>
                    </div>
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #bbf7d0;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🏃</span>
                        <h4 style="margin: 0; color: #15803d;">Verb</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #166534;">Action or State</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #bfdbfe;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🎨</span>
                        <h4 style="margin: 0; color: #1d4ed8;">Adjective</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #1e40af;">Describes a Noun</p>
                    </div>
                    <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #e9d5ff;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">💨</span>
                        <h4 style="margin: 0; color: #7e22ce;">Adverb</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #6b21a8;">Describes a Verb</p>
                    </div>
                    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid #ffedd5;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">🔗</span>
                        <h4 style="margin: 0; color: #c2410c;">Preposition</h4>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #9a3412;">Connects Ideas</p>
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; margin-top: 1.5rem;">
                    <h4 style="margin-top: 0; color: #475569; font-size: 1.1rem;">How they work together:</h4>
                    <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #be185d;">
                            <p style="margin: 0; font-size: 0.95rem;"><strong style="color: #be185d;">Noun:</strong> The person, place, or thing doing or receiving the action. <em>"The <strong>student</strong> reads the <strong>book</strong>."</em></p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #15803d;">
                            <p style="margin: 0; font-size: 0.95rem;"><strong style="color: #15803d;">Verb:</strong> The action or state. This is what changes with tense. <em>"She <strong>walks</strong> to work."</em> (present) or <em>"She <strong>walked</strong> to work."</em> (past)</p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #1d4ed8;">
                            <p style="margin: 0; font-size: 0.95rem;"><strong style="color: #1d4ed8;">Adjective:</strong> Adds detail to nouns. <em>"The <strong>busy</strong> student finished the <strong>long</strong> assignment."</em></p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #7e22ce;">
                            <p style="margin: 0; font-size: 0.95rem;"><strong style="color: #7e22ce;">Adverb:</strong> Adds detail to verbs (how, when, where). <em>"She walks <strong>quickly</strong>."</em> or <em>"They practice <strong>every day</strong>."</em></p>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #c2410c;">
                            <p style="margin: 0; font-size: 0.95rem;"><strong style="color: #c2410c;">Preposition:</strong> Shows relationships (time, place, direction). <em>"We meet <strong>at</strong> the library <strong>before</strong> class."</em></p>
                        </div>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "cycle1-pos-queries",
                    title: "Name the modifiers and movers",
                    instructions: "Choose the word that matches the prompt (noun, verb, adjective, adverb, or preposition).",
                    items: [
                        {
                            type: "select",
                            label: "Which word is a noun (person/place/thing) in \"The busy student finished early\"?",
                            options: ["The", "busy", "student", "finished", "early"],
                            expectedAnswer: "student"
                        },
                        {
                            type: "select",
                            label: "Which word is the verb (action) in \"They practice daily\"?",
                            options: ["They", "practice", "daily"],
                            expectedAnswer: "practice"
                        },
                        {
                            type: "select",
                            label: "Which word is an adjective in \"Gentle lessons build confidence\"?",
                            options: ["Gentle", "lessons", "build", "confidence"],
                            expectedAnswer: "Gentle"
                        },
                        {
                            type: "select",
                            label: "Which word is a preposition in \"The book is on a table\"?",
                            options: ["The", "book", "is", "on", "a", "table"],
                            expectedAnswer: "on"
                        },
                        {
                            type: "select",
                            label: "Which word tells how (adverb) in \"He spoke quietly\"?",
                            options: ["He", "spoke", "quietly"],
                            expectedAnswer: "quietly"
                        },
                        {
                            type: "select",
                            label: "Which word is the noun (place) in \"We met at the library\"?",
                            options: ["We", "met", "at", "the", "library"],
                            expectedAnswer: "library"
                        },
                        {
                            type: "select",
                            label: "Which word is the verb in \"A teacher explains rules\"?",
                            options: ["A", "teacher", "explains", "rules"],
                            expectedAnswer: "explains"
                        },
                        {
                            type: "select",
                            label: "Which word describes \"scarf\" in \"She wore a red scarf\"?",
                            options: ["She", "wore", "a", "red", "scarf"],
                            expectedAnswer: "red"
                        },
                        {
                            type: "select",
                            label: "Which word shows direction (preposition) in \"We walked through the park\"?",
                            options: ["We", "walked", "through", "the", "park"],
                            expectedAnswer: "through"
                        },
                        {
                            type: "select",
                            label: "Which word tells how often (adverb of frequency) in \"She always arrives early\"?",
                            options: ["She", "always", "arrives", "early"],
                            expectedAnswer: "always"
                        }
                    ]
                }
            ]
        },
        {
            id: "frequency",
            title: "Adverbs of frequency: naming how often",
            icon: "🔁",
            explanation: `
                <p>Adverbs of frequency describe how steady a habit feels.</p>

                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 0.75rem; padding: 1.25rem; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="background: #be185d; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">100% Always</span>
                        <span style="background: #db2777; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">80% Usually</span>
                        <span style="background: #f472b6; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">50% Sometimes</span>
                        <span style="background: #94a3b8; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">0% Never</span>
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; color: #9d174d;"><strong>The Rule:</strong> Place them before the main verb, but <em>after</em> helping verbs (be/have).</p>
                </div>

                <h4 style="margin-top: 1.5rem;">With action verbs (go, eat, work, study...)</h4>
                <p>Frequency adverbs go <strong>before</strong> the main verb:</p>
                <ul style="margin: 0.5rem 0;">
                    <li><em>She <strong>always takes</strong> notes in class.</em></li>
                    <li><em>They <strong>usually eat</strong> lunch at noon.</em></li>
                    <li><em>I <strong>never forget</strong> my keys.</em></li>
                </ul>

                <h4 style="margin-top: 1.5rem;">With the verb BE</h4>
                <p>Frequency adverbs go <strong>after</strong> the verb <em>be</em>:</p>
                <ul style="margin: 0.5rem 0;">
                    <li><em>She <strong>is always</strong> late for class.</em></li>
                    <li><em>They <strong>are never</strong> tired in the morning.</em></li>
                    <li><em>He <strong>is usually</strong> happy to help.</em></li>
                </ul>

                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 0.75rem; padding: 1rem; margin: 1.5rem 0;">
                    <p style="margin: 0; font-size: 0.95rem; color: #065f46;"><strong>💡 Flexible adverbs:</strong> <em>Sometimes</em> and <em>usually</em> can also go at the <strong>beginning</strong> or <strong>end</strong> of a sentence:</p>
                    <ul style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #065f46;">
                        <li><em><strong>Sometimes</strong> I take the bus.</em> / <em>I take the bus <strong>sometimes</strong>.</em></li>
                        <li><em><strong>Usually</strong> we eat dinner at 7.</em> / <em>We eat dinner at 7 <strong>usually</strong>.</em></li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "📌 Placement tip",
                content: "Frequency adverbs usually sit before the main verb: 'She always takes notes.' With the verb BE, place the adverb after: 'She is always late.'"
            },
            exercises: [
                {
                    id: "cycle1-frequency-match",
                    title: "Which adverb fits best?",
                    instructions: "Choose the adverb that captures the habit.",
                    items: [
                        {
                            type: "radio",
                            label: "I ___ check the bus schedule before I leave.",
                            options: [
                                { value: "yesterday", label: "yesterday" },
                                { value: "now", label: "now" },
                                { value: "always", label: "always" },
                            ],
                            expectedAnswer: "always"
                        },
                        {
                            type: "radio",
                            label: "He ___ forgets his keys.",
                            options: [
                                { value: "never", label: "never" },
                                { value: "tomorrow", label: "tomorrow" },
                                { value: "right", label: "right" }
                            ],
                            expectedAnswer: "never"
                        },
                        {
                            type: "radio",
                            label: "She is _________ late to work.",
                            options: [
                                { value: "yesterday", label: "yesterday" },
                                { value: "always", label: "always" },
                                { value: "now", label: "now" },
                            ],
                            expectedAnswer: "always"
                        }
                    ]
                },
                {
                    id: "cycle1-frequency-placement",
                    title: "Where does it go?",
                    instructions: "Choose the correct placement for the adverb.",
                    items: [
                        {
                            type: "radio",
                            label: "Where does 'always' go? → He ___ ___ tired after work.",
                            options: [
                                { value: "always-is", label: "always is" },
                                { value: "tired-always", label: "tired always" },
                                { value: "is-always", label: "is always" },
                            ],
                            expectedAnswer: "is-always"
                        },
                        {
                            type: "radio",
                            label: "Where does 'never' go? → They ___ ___ homework on Fridays.",
                            options: [
                                { value: "never-have", label: "never have" },
                                { value: "have-never", label: "have never" },
                                { value: "homework-never", label: "homework never" }
                            ],
                            expectedAnswer: "never-have"
                        },
                        {
                            type: "radio",
                            label: "Where does 'usually' go? → ___ she ___ late?",
                            options: [
                                { value: "usually-is", label: "Usually is ..." },
                                { value: "is-usually", label: "Is ... usually" },
                                { value: "late-usually", label: "Is ... late usually" },
                            ],
                            expectedAnswer: "is-usually"
                        }
                    ]
                }
            ]
        },
        {
            id: "comparatives",
            title: "Comparatives: describe what is more or less",
            icon: "⚖️",
            explanation: `
                <p>Comparatives let you compare two things. Think of it as a <strong>Scale</strong> logic.</p>
                
                <div style="display: flex; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px; background: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0; color: #c2410c;">Short Adjectives</h4>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Add <strong>-er</strong> (fast → faster)</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; background: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="margin: 0; color: #c2410c;">Long Adjectives</h4>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Use <strong>more</strong> (more creative)</p>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Comparative shortcut",
                content: "Try the adjective out loud: if it sounds easy with -er, use that (taller). If it feels clunky, pair it with more (more careful)."
            },
            exercises: [
                {
                    id: "cycle1-comparatives",
                    title: "Which comparative belongs?",
                    instructions: "Choose the sentence that uses a correct comparative form.",
                    items: [
                        {
                            type: "radio",
                            label: "My new workplace is ___ than my old one.",
                            options: [
                                { value: "more-friendlier", label: "more friendlier" },
                                { value: "friendliest", label: "friendliest" },
                                { value: "friendlier", label: "friendlier" },
                            ],
                            expectedAnswer: "friendlier"
                        }
                    ]
                },
                {
                    id: "cycle1-comparatives-write",
                    title: "Fill the blank",
                    instructions: "Complete the sentence with a comparative that makes sense.",
                    items: [
                        {
                            type: "text",
                            label: "My mornings are ___ than my evenings (calm).",
                            expectedAnswer: "calmer"
                        }
                    ]
                }
            ]
        },
        {
            id: "superlatives",
            title: "Superlatives: The Most, The Best, The -est",
            icon: "🏆",
            explanation: `
                <p>Superlatives help you find the <strong>extreme</strong> in a group—the highest, lowest, best, worst. Use them when comparing <strong>three or more</strong> things.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #22c55e;">
                        <h4 style="margin: 0; color: #16a34a;">Short adjectives: -est</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">cheap → <strong>the cheapest</strong><br>old → <strong>the oldest</strong><br>busy → <strong>the busiest</strong></p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #3b82f6;">
                        <h4 style="margin: 0; color: #1d4ed8;">Long adjectives: most/least</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">expensive → <strong>the most expensive</strong><br>comfortable → <strong>the most comfortable</strong></p>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0;"><strong>Irregular forms:</strong> good → <strong>the best</strong> | bad → <strong>the worst</strong> | far → <strong>the farthest</strong></p>
                </div>
            `,
            tipBox: {
                title: "💡 Comparatives vs Superlatives",
                content: "Comparatives compare 2 things (cheaper than). Superlatives find the extreme in 3+ things (the cheapest of all)."
            },
            exercises: [
                {
                    id: "cycle1-superlatives",
                    title: "Form the superlative",
                    instructions: "Complete with the correct superlative form.",
                    items: [
                        {
                            type: "text",
                            label: "This is ___ (cheap) apartment in the building.",
                            expectedAnswer: "the cheapest"
                        },
                        {
                            type: "text",
                            label: "Monday is ___ (busy) day of the week.",
                            expectedAnswer: "the busiest"
                        },
                        {
                            type: "text",
                            label: "She's ___ (experienced) person on our team.",
                            expectedAnswer: "the most experienced"
                        }
                    ]
                }
            ]
        },
        {
            id: "quantifiers",
            title: "Quantifiers: How Much? How Many?",
            icon: "🔢",
            explanation: `
                <p>Quantifiers describe amounts. The key is knowing if the noun is <strong>countable</strong> (you can count it) or <strong>uncountable</strong> (you can't count it).</p>

                <div style="overflow-x: auto; margin: 1.5rem 0;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 400px;">
                        <thead>
                            <tr style="background: #f8fafc;">
                                <th style="padding: 0.75rem; border-bottom: 2px solid #e2e8f0; text-align: left;"></th>
                                <th style="padding: 0.75rem; border-bottom: 2px solid #22c55e; text-align: left; color: #16a34a;">Countable (hours, jobs)</th>
                                <th style="padding: 0.75rem; border-bottom: 2px solid #3b82f6; text-align: left; color: #1d4ed8;">Uncountable (time, money)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Large amount</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>many</strong> hours</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>much</strong> time</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Small amount</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>few</strong> options</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>little</strong> money</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>Comparing</strong></td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>fewer</strong> hours</td>
                                <td style="padding: 0.75rem; border-bottom: 1px solid #f1f5f9;"><strong>less</strong> time</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">⚠️ Common Mistakes</p>
                    <p style="margin: 0.5rem 0 0 0;">❌ "How <strong>much</strong> hours?" → ✓ "How <strong>many</strong> hours?" (hours are countable)</p>
                    <p style="margin: 0.25rem 0 0 0;">❌ "<strong>less</strong> employees" → ✓ "<strong>fewer</strong> employees" (employees are countable)</p>
                </div>
            `,
            tipBox: {
                title: "💡 Quick Test",
                content: "Can you put a number in front of it? '1 hour, 2 hours' = countable (use many/few/fewer). 'Money' (not 1 money) = uncountable (use much/little/less)."
            },
            exercises: [
                {
                    id: "cycle1-quantifiers-choice",
                    title: "Many or Much?",
                    instructions: "Choose the correct quantifier.",
                    items: [
                        {
                            type: "radio",
                            label: "How ___ vacation days do you get?",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "many"
                        },
                        {
                            type: "radio",
                            label: "I don't have ___ experience with computers.",
                            options: [
                                { value: "much", label: "much" },
                                { value: "many", label: "many" },
                            ],
                            expectedAnswer: "much"
                        }
                    ]
                },
                {
                    id: "cycle1-quantifiers-fewer-less",
                    title: "Fewer or Less?",
                    instructions: "Choose the correct word for comparing.",
                    items: [
                        {
                            type: "radio",
                            label: "This job has ___ hours than my last one.",
                            options: [
                                { value: "less", label: "less" },
                                { value: "fewer", label: "fewer" },
                            ],
                            expectedAnswer: "fewer"
                        },
                        {
                            type: "radio",
                            label: "I want a job with ___ stress.",
                            options: [
                                { value: "less", label: "less" },
                                { value: "fewer", label: "fewer" },
                            ],
                            expectedAnswer: "less"
                        }
                    ]
                }
            ]
        },
        {
            id: "connectors",
            title: "Connectors: glue time, actions, and meaning",
            icon: "🧵",
            explanation: `
                <p>Connectors keep your sentences flowing. They are the <strong>"Glue"</strong> of your story.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #22c55e;">
                        <h4 style="margin: 0; color: #16a34a;">Coordinators</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">And, But, Or, So</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; border-top: 3px solid #3b82f6;">
                        <h4 style="margin: 0; color: #1d4ed8;">Time Markers</h4>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem;">When, While, Before, After</p>
                    </div>
                </div>
            `,
            usageMeanings: [
                {
                    title: "Coordinators",
                    description: "Use and to add, but to contrast, or to choose, so to show a result.",
                    examples: [
                        { sentence: "I practice speaking, and I listen to stories.", explanation: "Addition" },
                        { sentence: "I studied hard, but I still had questions.", explanation: "Contrast" },
                        { sentence: "Would you like coffee or tea?", explanation: "Alternative" },
                        { sentence: "I woke up early, so I had time to review.", explanation: "Result" }
                    ]
                },
                {
                    title: "Time connectors",
                    description: "Use when/while/before/after to place actions on a timeline or describe overlaps.",
                    examples: [
                        { sentence: "When class ends, we stretch.", explanation: "Sequential" },
                        { sentence: "While I cook, my classmates clean up.", explanation: "Overlap" },
                        { sentence: "Before I leave, I double-check my bag.", explanation: "Earlier action" },
                        { sentence: "After homework, I relax with music.", explanation: "Later action" }
                    ]
                }
            ],
            tipBox: {
                title: "✳️ Smooth connections",
                content: "Listen for the feeling of the sentence: adding words is usually 'and', contrast is 'but', choices are 'or', results are 'so'. Then place time connectors close to the verbs they link."
            },
            exercises: [
                {
                    id: "cycle1-connectors-choice",
                    title: "Choose the connector",
                    instructions: "Pick the connector that keeps the meaning flowing.",
                    items: [
                        {
                            type: "radio",
                            label: "I want to rest, ___ I still have homework.",
                            options: [
                                { value: "and", label: "and" },
                                { value: "but", label: "but" },
                                { value: "or", label: "or" }
                            ],
                            expectedAnswer: "but"
                        },
                        {
                            type: "radio",
                            label: "Would you like tea ___ coffee?",
                            options: [
                                { value: "so", label: "so" },
                                { value: "when", label: "when" },
                                { value: "or", label: "or" },
                            ],
                            expectedAnswer: "or"
                        }
                    ]
                },
                {
                    id: "cycle1-connectors-order",
                    title: "Time connectors in place",
                    instructions: "Choose the time connector that connects the two phrases smoothly.",
                    items: [
                        {
                            type: "select",
                            label: "___ class begins, we check the board.",
                            options: ["when", "and", "but"],
                            expectedAnswer: "when"
                        },
                        {
                            type: "select",
                            label: "I start the project ___ the team gathers ideas.",
                            options: ["while", "so", "or"],
                            expectedAnswer: "while"
                        }
                    ]
                }
            ]
        },
        {
            id: "conditionals",
            title: "Conditionals: The IF-THEN Logic",
            icon: "🔀",
            explanation: `
                <p>Conditionals connect a condition (IF...) to a result (THEN...). English has two main conditionals for <strong>real situations</strong>:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #f4d35e;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #ca8a04;">Zero Conditional</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Always true</strong> (facts, habits, natural laws)</p>
                        <p style="margin: 0.75rem 0 0.5rem 0; font-weight: bold; color: #ca8a04; font-size: 0.95rem;">If + present, present</p>
                        <p style="margin: 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"If you heat water, it boils."</p>
                    </div>
                    <div style="background: rgba(123, 168, 132, 0.15); padding: 1.25rem; border-radius: 0.75rem; border-left: 4px solid #7ba884;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #7ba884;">First Conditional</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #374151;"><strong>Future possibility</strong> (plans, predictions, promises)</p>
                        <p style="margin: 0.75rem 0 0.5rem 0; font-weight: bold; color: #7ba884; font-size: 0.95rem;">If + present, will + verb</p>
                        <p style="margin: 0; font-size: 0.85rem; color: #6b7280; font-style: italic;">"If it rains tomorrow, I will bring an umbrella."</p>
                    </div>
                </div>

                <h4 style="margin-top: 1.5rem;">Zero Conditional Examples (Always True)</h4>
                <div style="background: #fffbeb; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li>If you <strong>heat</strong> ice, it <strong>melts</strong>. (science fact)</li>
                        <li>If I <strong>feel</strong> tired, I <strong>drink</strong> coffee. (my habit)</li>
                        <li>If the light <strong>turns</strong> red, you <strong>stop</strong>. (rule)</li>
                    </ul>
                </div>

                <h4>First Conditional Examples (Future Plans)</h4>
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <ul style="margin: 0; padding-left: 1.25rem;">
                        <li>If the weather <strong>is</strong> nice, I <strong>will go</strong> to the park. (weekend plan)</li>
                        <li>If you <strong>study</strong> hard, you <strong>will pass</strong> the exam. (prediction)</li>
                        <li>If we <strong>leave</strong> early, we <strong>will avoid</strong> traffic. (plan)</li>
                    </ul>
                </div>

                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; margin-top: 1.5rem;">
                    <p style="margin: 0; font-weight: 600; color: #dc2626;">Common Mistakes to Avoid</p>
                    <p style="margin: 0.5rem 0 0 0;">Never use "will" in the IF clause!</p>
                    <p style="margin: 0.25rem 0 0 0;">❌ "If I <strong>will go</strong>..." → ✓ "If I <strong>go</strong>..."</p>
                    <p style="margin: 0.25rem 0 0 0;">❌ "If it <strong>will rain</strong>..." → ✓ "If it <strong>rains</strong>..."</p>
                </div>
            `,
            tipBox: {
                title: "🎯 Quick Decision Rule",
                content: "Ask yourself: 'Is this ALWAYS true (a fact or habit)?' → Use Zero (present + present). 'Is this a FUTURE plan or possibility?' → Use First (present + will)."
            },
            exercises: [
                {
                    id: "cycle1-conditionals-identify",
                    title: "Zero or First?",
                    instructions: "Decide whether each sentence describes something always true (zero) or a future possibility (first).",
                    items: [
                        {
                            type: "radio",
                            label: "\"If you heat water to 100°C, it boils.\"",
                            options: [
                                { value: "first", label: "First (future possibility)" },
                                { value: "zero", label: "Zero (always true - science fact)" },
                            ],
                            expectedAnswer: "zero"
                        },
                        {
                            type: "radio",
                            label: "\"If it rains tomorrow, I will bring an umbrella.\"",
                            options: [
                                { value: "first", label: "First (future plan for tomorrow)" },
                                { value: "zero", label: "Zero (always true)" },
                            ],
                            expectedAnswer: "first"
                        },
                        {
                            type: "radio",
                            label: "\"If I'm tired, I go to bed early.\"",
                            options: [
                                { value: "first", label: "First (future possibility)" },
                                { value: "zero", label: "Zero (always true - my habit)" },
                            ],
                            expectedAnswer: "zero"
                        },
                        {
                            type: "radio",
                            label: "\"If you study hard, you will pass the test.\"",
                            options: [
                                { value: "first", label: "First (prediction about your future)" },
                                { value: "zero", label: "Zero (always true)" },
                            ],
                            expectedAnswer: "first"
                        }
                    ]
                },
                {
                    id: "cycle1-conditionals-complete",
                    title: "Complete the conditional",
                    instructions: "Fill in the blank with the correct form based on the conditional type.",
                    items: [
                        {
                            type: "text",
                            label: "Zero conditional: If you heat ice, it _____ (melt).",
                            expectedAnswer: "melts"
                        },
                        {
                            type: "text",
                            label: "First conditional: If the weather is nice, we _____ (will go) to the beach.",
                            expectedAnswer: "will go"
                        },
                        {
                            type: "select",
                            label: "Choose the correct form: If I have time tomorrow, I _____ you.",
                            options: ["call", "will call", "called"],
                            expectedAnswer: "will call"
                        }
                    ]
                }
            ]
        },
        {
            id: "summary",
            title: "Grammar Quick Reference Cheat Sheet",
            icon: "📋",
            explanation: `
                <div style="background: white; border: 2px solid #e2e8f0; border-radius: 1rem; padding: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <h2 style="margin-top: 0; text-align: center; color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 0.5rem;">Cycle 1 Grammar Reference</h2>

                    <h3 style="color: #2563eb; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">⏱️ Verb Tenses</h3>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="background: #f0fdf4; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Simple Present:</strong> I <strong>work</strong> daily.
                        </div>
                        <div style="background: #eff6ff; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Present Continuous:</strong> I <strong>am working</strong> now.
                        </div>
                        <div style="background: #f0fdf4; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Simple Past:</strong> I <strong>worked</strong> yesterday.
                        </div>
                        <div style="background: #eff6ff; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Past Continuous:</strong> I <strong>was working</strong> when...
                        </div>
                        <div style="background: #f0fdf4; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Simple Future:</strong> I <strong>will work</strong> soon.
                        </div>
                        <div style="background: #fffbeb; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
                            <strong>Present Perfect:</strong> I <strong>have worked</strong>.
                        </div>
                    </div>

                    <h3 style="color: #2563eb; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">📅 Time Expressions</h3>
                    <div style="background: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.9rem;">
                        <p style="margin: 0;"><strong>Past:</strong> yesterday, ago, last...</p>
                        <p style="margin: 0.4rem 0;"><strong>Present:</strong> now, today, these days</p>
                        <p style="margin: 0;"><strong>Future:</strong> tomorrow, soon, next...</p>
                    </div>

                    <h3 style="color: #db2777; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">🔁 Frequency</h3>
                    <p style="background: #fdf2f8; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.85rem; margin: 0;">
                        always → usually → sometimes → never
                    </p>

                    <h3 style="color: #d97706; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">⚖️ Comparatives</h3>
                    <div style="background: #fffbeb; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem;">
                        <p style="margin: 0;">Short: <strong>-er than</strong> (faster)</p>
                        <p style="margin: 0.3rem 0;">Long: <strong>more...than</strong> (more creative)</p>
                        <p style="margin: 0;">Irregular: <strong>better / worse</strong></p>
                    </div>

                    <h3 style="color: #b45309; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">🏆 Superlatives</h3>
                    <div style="background: #fff7ed; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem;">
                        <p style="margin: 0;">Short: <strong>the + -est</strong> (the cheapest)</p>
                        <p style="margin: 0.3rem 0;">Long: <strong>the most/least</strong> (the most expensive)</p>
                        <p style="margin: 0;">Irregular: <strong>the best / the worst</strong></p>
                    </div>

                    <h3 style="color: #7c3aed; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">🔢 Quantifiers</h3>
                    <div style="display: grid; gap: 0.4rem;">
                        <div style="background: #f0fdf4; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;">Countable: <strong>many / few / fewer</strong></div>
                        <div style="background: #eff6ff; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;">Uncountable: <strong>much / little / less</strong></div>
                    </div>

                    <h3 style="color: #059669; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">🧵 Connectors</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem;">
                        <div style="background: #ecfdf5; padding: 0.4rem 0.5rem; border-radius: 0.4rem; font-size: 0.8rem;"><strong>and:</strong> add</div>
                        <div style="background: #ecfdf5; padding: 0.4rem 0.5rem; border-radius: 0.4rem; font-size: 0.8rem;"><strong>but:</strong> contrast</div>
                        <div style="background: #ecfdf5; padding: 0.4rem 0.5rem; border-radius: 0.4rem; font-size: 0.8rem;"><strong>so:</strong> result</div>
                        <div style="background: #ecfdf5; padding: 0.4rem 0.5rem; border-radius: 0.4rem; font-size: 0.8rem;"><strong>or:</strong> choice</div>
                    </div>
                    <div style="background: #f0f9ff; padding: 0.4rem 0.5rem; border-radius: 0.4rem; font-size: 0.8rem; margin-top: 0.4rem;"><strong>when/while:</strong> time</div>

                    <h3 style="color: #ca8a04; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">🔀 Conditionals</h3>
                    <div style="display: grid; gap: 0.4rem;">
                        <div style="background: #fffbeb; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>Zero:</strong> if + present, present (facts)</div>
                        <div style="background: #f0fdf4; padding: 0.5rem; border-radius: 0.4rem; font-size: 0.85rem;"><strong>First:</strong> if + present, will + verb (future)</div>
                    </div>
                </div>
            `,
            tipBox: {
                title: "💡 Keep This Handy",
                content: "Print this page or bookmark it for quick reference during class, homework, or when you're writing. All the Cycle 1 grammar essentials in one place!"
            }
        }
    ],
    // ═══════════════════════════════════════════════════════════════════════════
    // CYCLE 1 MINI QUIZ - Diagnostic Assessment
    // ═══════════════════════════════════════════════════════════════════════════
    // Questions are organized by skill area with topic tags for teacher reports.
    // Skills tested: Time Expression Recognition, Tense Formation, Usage in Context,
    //                Spot the Error, and Production/Application
    // ═══════════════════════════════════════════════════════════════════════════
    miniQuiz: [
        {
            id: "cycle1-quiz-1",
            question: "Which tense sounds best? \"Every evening, I ___ dinner at home.\"",
            options: [
                { value: "present-continuous", label: "am cooking" },
                { value: "present-simple", label: "cook" },
                { value: "past-simple", label: "cooked" },
            ],
            correctAnswer: "present-simple",
            explanation:
                "For daily routines and habits, use present simple: Every evening, I cook dinner at home.",
            skillTag: "tense-choice-present-habit-simple-vs-continuous",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-2",
            question: "Which sentence matches the time word \"right now\"?",
            options: [
                { value: "present-simple", label: "She works on her homework right now." },
                { value: "past-simple", label: "She worked on her homework right now." },
                { value: "present-continuous", label: "She is working on her homework right now." },
            ],
            correctAnswer: "present-continuous",
            explanation:
                "\"Right now\" usually takes present continuous (be + verb-ing): She is working on her homework right now.",
            skillTag: "tense-choice-present-continuous-now",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-3",
            question: "Which option fits best? \"Yesterday, they ___ the apartment.\"",
            options: [
                { value: "past-simple", label: "cleaned" },
                { value: "present-simple", label: "clean" },
                { value: "present-perfect", label: "have cleaned" },
            ],
            correctAnswer: "past-simple",
            explanation:
                "With a finished, specific past time (yesterday, last week), we use past simple: They cleaned the apartment.",
            skillTag: "tense-choice-past-simple-specific-time",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-4",
            question: "Which sentence sounds most natural with \"this week\"?",
            options: [
                { value: "past-simple", label: "This week, I applied for three jobs." },
                { value: "present-perfect", label: "This week, I have applied for three jobs." },
                { value: "present-continuous", label: "This week, I am applying for three jobs right now." },
            ],
            correctAnswer: "present-perfect",
            explanation:
                "With \"this week\" (a time period that is not finished), we often use present perfect to connect past actions to now: I have applied for three jobs.",
            skillTag: "tense-choice-present-perfect-this-week",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-5",
            question: "Where does the adverb of frequency go? \"She ___ ___ to class on time.\"",
            options: [
                { value: "always-after-verb", label: "comes always" },
                { value: "always-end", label: "comes on time always" },
                { value: "always-before-verb", label: "always comes" },
            ],
            correctAnswer: "always-before-verb",
            explanation:
                "Most adverbs of frequency go before the main verb: She always comes to class on time.",
            skillTag: "frequency-adverb-placement-main-verb",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-6",
            question: "Choose the correct comparative: \"This class is ___ than my last one.\"",
            options: [
                { value: "easier", label: "easier" },
                { value: "more-easier", label: "more easier" },
                { value: "the-easiest", label: "the easiest" },
            ],
            correctAnswer: "easier",
            explanation:
                "For short adjectives like \"easy\", use -er for comparisons: This class is easier than my last one.",
            skillTag: "comparative-form-short-adjective",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-7",
            question: "Choose the correct superlative: \"He is ___ person in the office.\"",
            options: [
                { value: "the-more-friendly", label: "the more friendly" },
                { value: "the-friendliest", label: "the friendliest" },
                { value: "friendlier", label: "friendlier" },
            ],
            correctAnswer: "the-friendliest",
            explanation:
                "Superlatives with short adjectives take the + -est: He is the friendliest person in the office.",
            skillTag: "superlative-form-short-adjective",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-8",
            question: "Which quantifier is correct? \"There are ___ students on the waitlist.\"",
            options: [
                { value: "many", label: "many" },
                { value: "much", label: "much" },
            ],
            correctAnswer: "many",
            explanation:
                "Students are countable, so we use many: There are many students on the waitlist.",
            skillTag: "quantifier-many-vs-much-countable",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-9",
            question: "Which sentence is best? \"I have ___ free time this month than last month.\"",
            options: [
                { value: "fewer", label: "fewer" },
                { value: "less", label: "less" },
            ],
            correctAnswer: "less",
            explanation:
                "\"Free time\" is uncountable, so we use less, not fewer.",
            skillTag: "quantifier-fewer-vs-less-uncountable",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-10",
            question: "Choose the connector that fits: \"I was tired, ___ I finished my homework.\"",
            options: [
                { value: "and", label: "and" },
                { value: "but", label: "but" },
                { value: "so", label: "so" },
            ],
            correctAnswer: "but",
            explanation:
                "\"But\" shows contrast: even though I was tired, I finished my homework.",
            skillTag: "connector-meaning-contrast-but",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-11",
            question: "Which word is the adverb in this sentence? \"The busy student arrived early.\"",
            options: [
                { value: "busy", label: "busy" },
                { value: "student", label: "student" },
                { value: "early", label: "early" },
            ],
            correctAnswer: "early",
            explanation:
                "\"Early\" describes how the student arrived, so it is an adverb.",
            skillTag: "pos-adverb-identification",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-12",
            question: "Which sentence is FIRST conditional (future possibility)?",
            options: [
                { value: "first-future", label: "If I'm tired tonight, I will go to bed early." },
                { value: "zero-habit", label: "If I'm tired, I go to bed early." },
                { value: "present-perfect", label: "I have gone to bed early if I'm tired." },
            ],
            correctAnswer: "first-future",
            explanation:
                "First conditional is for real future possibilities: If + present, will + base verb. \"If I'm tired tonight, I will go to bed early.\"",
            skillTag: "contrast-zero-vs-first-conditional-cycle1",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-13",
            question: "Which tense fits best? \"This month, I ___ more vegetables.\"",
            options: [
                { value: "present-simple", label: "eat" },
                { value: "present-perfect", label: "have eaten" },
                { value: "past-simple", label: "ate" },
            ],
            correctAnswer: "present-perfect",
            explanation:
                "\"This month\" is an open time period that includes now, so present perfect is natural: I have eaten more vegetables.",
            skillTag: "tense-choice-present-perfect-this-month",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-14",
            question: "Where does the adverb go? \"She ___ ___ late to work.\"",
            options: [
                { value: "always-is-late", label: "always is" },
                { value: "is-late-always", label: "is late always" },
                { value: "is-always-late", label: "is always" },
            ],
            correctAnswer: "is-always-late",
            explanation:
                "With the verb be, frequency adverbs usually come after be: She is always late to work.",
            skillTag: "frequency-adverb-placement-be-verb",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-15",
            question: "Choose the correct comparative: \"My new schedule is ___ than my old one.\"",
            options: [
                { value: "more-comfortable", label: "more comfortable" },
                { value: "comfortabler", label: "comfortabler" },
                { value: "most-comfortable", label: "most comfortable" },
            ],
            correctAnswer: "more-comfortable",
            explanation:
                "Comfortable is a longer adjective, so we use more, not -er: more comfortable than my old one.",
            skillTag: "comparative-form-long-adjective",
            difficulty: "medium",
        },
        {
            id: "cycle1-quiz-16",
            question: "Choose the connector that shows a result: \"I was very tired, ___ I went to bed early.\"",
            options: [
                { value: "and", label: "and" },
                { value: "so", label: "so" },
                { value: "but", label: "but" },
            ],
            correctAnswer: "so",
            explanation:
                "\"So\" shows a result: I was very tired, so I went to bed early.",
            skillTag: "connector-meaning-result-so",
            difficulty: "easy",
        },
        {
            id: "cycle1-quiz-17",
            question: "Which quantifier is best? \"I have ___ time before class, so I can help you quickly.\"",
            options: [
                { value: "few", label: "few" },
                { value: "little", label: "little" },
            ],
            correctAnswer: "little",
            explanation:
                "\"Time\" is uncountable, so we say little time, not few time.",
            skillTag: "quantifier-little-vs-few-time",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Cycle 1 Review Mini Quiz

    This mini quiz checks foundational control of Cycle 1 grammar concepts across
    simple tenses, helpers, motion vs fact, and core sentence-building tools.
    Use skill-level diagnostics to decide whether students need:
    - form review
    - meaning clarification
    - contrast practice
    - or targeted error correction

    ────────────────────────
    TENSE CHOICE & TIME MEANING
    ────────────────────────
    Skill tags:
    - tense-choice-present-simple-habit
    - tense-choice-past-simple-finished
    - tense-choice-future-simple-plan
    - tense-choice-present-perfect-this-week
    - tense-choice-present-perfect-this-month

    If students struggle here:
    • Re-teach finished vs open time (yesterday vs this week/month)
    • Emphasize that present perfect connects past to now without a finished timestamp
    • Revisit signal words: yesterday, last ___, this week, this month

    ────────────────────────
    QUESTIONS & NEGATIVES (HELPER VERBS)
    ────────────────────────
    Skill tags:
    - helper-do-does-question
    - helper-did-question
    - helper-will-question
    - negative-form-simple
    - negative-form-continuous

    If students struggle here:
    • Review that helpers carry the tense, not the main verb
    • Practice hearing the helper first (do / did / will / be)
    • Contrast simple vs continuous negatives (don’t vs isn’t)

    ────────────────────────
    SIMPLE vs CONTINUOUS (FACT vs MOTION)
    ────────────────────────
    Skill tags:
    - contrast-simple-vs-continuous-now
    - contrast-simple-vs-continuous-habit
    - continuous-meaning-in-progress
    - past-continuous-background

    If students struggle here:
    • Re-anchor continuous as “action in motion”
    • Use timelines to show background vs finished actions
    • Reinforce that simple tense states facts or habits

    ────────────────────────
    ADVERBS OF FREQUENCY
    ────────────────────────
    Skill tags:
    - frequency-adverb-placement-main-verb
    - frequency-adverb-placement-be-verb

    If students struggle here:
    • Re-teach placement rule:
    – before main verbs (always take)
    – after be/have (is always, has always)
    • Practice with be-verbs separately from action verbs

    ────────────────────────
    COMPARATIVES
    ────────────────────────
    Skill tags:
    - comparative-form-short-adjective
    - comparative-form-long-adjective

    If students struggle here:
    • Reinforce the sound test:
    – short adjective → -er
    – long adjective → more
    • Watch for overgeneralization (*more friendlier*)

    ────────────────────────
    SUPERLATIVES
    ────────────────────────
    Skill tags:
    - superlative-form-short-adjective
    - superlative-form-long-adjective
    - superlative-irregular-forms

    If students struggle here:
    • Re-teach difference between comparing 2 (comparative) vs 3+ (superlative)
    • Review irregulars: best, worst, farthest

    ────────────────────────
    QUANTIFIERS
    ────────────────────────
    Skill tags:
    - quantifier-many-vs-much
    - quantifier-fewer-vs-less
    - quantifier-little-vs-few-time

    If students struggle here:
    • Revisit countable vs uncountable nouns
    • Use the “Can I count it?” test
    • Explicitly practice time/money as uncountable

    ────────────────────────
    CONNECTORS (MEANING LINKS)
    ────────────────────────
    Skill tags:
    - connector-meaning-addition-and
    - connector-meaning-contrast-but
    - connector-meaning-result-so
    - connector-time-when-while

    If students struggle here:
    • Focus on sentence meaning, not memorization
    • Ask: Am I adding, contrasting, choosing, or showing a result?
    • Reinforce so = result, not sequence

    ────────────────────────
    CONDITIONALS (ZERO vs FIRST)
    ────────────────────────
    Skill tags:
    - zero-conditional-form
    - first-conditional-form
    - conditional-time-logic

    If students struggle here:
    • Re-anchor zero conditional as “always true”
    • Reinforce rule: never use will in the IF clause
    • Contrast habits vs future plans clearly

    ────────────────────────
    SUGGESTED USE
    ────────────────────────
    • Use after all Cycle 1 grammar guides
    • Best for identifying weak areas before Cycle 2
    • Diagnostic patterns often point to:
    – time awareness issues
    – helper verb confusion
    – motion vs fact misunderstanding
    */
};
