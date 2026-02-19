import type { InteractiveGuideContent } from "@/types/activity";

export const allVerbTensesOverviewContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "All 12 Verb Tenses: Your Complete Timeline",
            icon: "🕐",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">English has 12 verb tenses - but don't worry! You already know most of them. This guide shows you ALL 12 tenses on a timeline, which ones you'll use most, and which ones you just need to recognize.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Understanding all 12 tenses helps you:</p>
                <ul>
                    <li><strong>Tell complete stories</strong> - Mix past, present, and future smoothly</li>
                    <li><strong>Understand native speakers</strong> - Recognize tenses even if you don't use them often</li>
                    <li><strong>Sound natural</strong> - Use the right tense for the right situation</li>
                    <li><strong>See the big picture</strong> - How all the grammar you've learned fits together</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0;">
                        <li>Reviewing your entire course's learning journey</li>
                        <li>Preparing for Year-in-Review presentations (tell your complete story)</li>
                        <li>Seeing how ALL the grammar pieces fit together on one timeline</li>
                        <li>Practicing switching between tenses smoothly</li>
                    </ul>
                    <p style="margin: 1rem 0 0.5rem 0;"><strong>This helps you with:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li><strong>Final presentations:</strong> Combine all tenses to tell your complete wellness/career/housing journey</li>
                        <li><strong>Real-life conversations:</strong> Switch naturally between past, present, and future</li>
                        <li><strong>Job interviews:</strong> Talk about your past experience, current skills, and future goals</li>
                        <li><strong>Confidence:</strong> You'll realize how much grammar you actually know!</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">🎓 This is your victory lap - you've learned all of these!</p>
                </div>
            `,
            exercises: [
                {
                    id: "tenses-intro-1",
                    title: "Quick Check: What Do You Already Know?",
                    instructions: "Which tenses have you studied this course?",
                    items: [
                        {
                            type: "radio",
                            label: "How many verb tenses exist in English?",
                            options: [
                                { value: "a", label: "6" },
                                { value: "b", label: "12" },
                                { value: "c", label: "24" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "timeline-overview",
            stepNumber: 1,
            title: "The Complete Tense Timeline",
            icon: "📊",
            explanation: `
                <h3>All 12 Tenses on One Timeline</h3>
                <p>Every tense in English answers two questions: <strong>(1) WHEN?</strong> (past, present, future) and <strong>(2) WHAT TYPE?</strong> (simple, continuous, perfect, perfect continuous)</p>

                <div style="margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, rgba(200, 107, 81, 0.05) 0%, rgba(110, 145, 118, 0.05) 100%); border-radius: 0.5rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: rgba(110, 145, 118, 0.2);">
                                <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: left;">Type</th>
                                <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">PAST ⬅</th>
                                <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: center; background: rgba(122, 143, 124, 0.3);">PRESENT</th>
                                <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: center;">➡ FUTURE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; font-weight: 600;">Simple<br/><small>(one-time/fact)</small></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Past Simple</strong><br/>I worked<br/><span style="color: #7ba884;">✅ Use often</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.1);"><strong>Present Simple</strong><br/>I work<br/><span style="color: #7ba884;">✅ Use often</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Future Simple</strong><br/>I will work<br/><span style="color: #7ba884;">✅ Use often</span></td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.75rem; border: 1px solid #ddd; font-weight: 600;">Continuous<br/><small>(ongoing)</small></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Past Continuous</strong><br/>I was working<br/><span style="color: #7ba884;">✅ Use often</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.1);"><strong>Present Continuous</strong><br/>I am working<br/><span style="color: #7ba884;">✅ Use often</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Future Continuous</strong><br/>I will be working<br/><span style="color: #f59e0b;">⚠️ Recognize</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; font-weight: 600;">Perfect<br/><small>(completed)</small></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Past Perfect</strong><br/>I had worked<br/><span style="color: #7ba884;">✅ Use sometimes</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.1);"><strong>Present Perfect</strong><br/>I have worked<br/><span style="color: #7ba884;">✅ Use often</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Future Perfect</strong><br/>I will have worked<br/><span style="color: #f59e0b;">⚠️ Recognize</span></td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.75rem; border: 1px solid #ddd; font-weight: 600;">Perfect Continuous<br/><small>(duration)</small></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Past Perfect Continuous</strong><br/>I had been working<br/><span style="color: #f59e0b;">⚠️ Recognize</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.1);"><strong>Present Perfect Continuous</strong><br/>I have been working<br/><span style="color: #7ba884;">✅ Use sometimes</span></td>
                                <td style="padding: 0.75rem; border: 1px solid #ddd;"><strong>Future Perfect Continuous</strong><br/>I will have been working<br/><span style="color: #f59e0b;">⚠️ Recognize</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4>The Key:</h4>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; border-radius: 0.25rem;"><span style="color: #7ba884; font-weight: 600;">✅ Use often</span> - These are your everyday tenses (7 out of 12!)</li>
                    <li style="padding: 0.5rem; margin: 0.35rem 0; background: rgba(245, 158, 11, 0.15); border-left: 4px solid #f59e0b; border-radius: 0.25rem;"><span style="color: #f59e0b; font-weight: 600;">⚠️ Recognize</span> - You don't need to use these often, but understand them when you hear them (5 out of 12)</li>
                </ul>
            `,
            tipBox: {
                title: "💡 The Pattern",
                content:
                    "Notice the pattern! Present tenses are the most useful (you use 3 out of 4 regularly). Past tenses are next (you use 2-3 out of 4). Future tenses are least common (you mainly use simple future).",
            },
        },

        {
            id: "simple-tenses",
            stepNumber: 2,
            title: "Simple Tenses: Facts, Habits, One-Time Events",
            icon: "1️⃣",
            explanation: `
                <h3>The Simple Tenses (Most Common!)</h3>
                <p>Simple tenses describe <strong>facts, habits, or one-time events</strong>. No duration, no ongoing action - just the basic event.</p>
            `,
            usageMeanings: [
                {
                    title: "Past Simple",
                    description: "✅ Use this OFTEN - Completed actions in the past",
                    examples: [
                        {
                            sentence: "I <strong>worked</strong> at a restaurant for 3 years.",
                            explanation: "✓ Completed past experience (Week 4, 9, 14)"
                        },
                        {
                            sentence: "Last week, I <strong>called</strong> my landlord about the heat.",
                            explanation: "✓ One-time past event (Week 4, 5)"
                        },
                    ],
                },
                {
                    title: "Present Simple",
                    description: "✅ Use this OFTEN - Current facts, habits, routines",
                    examples: [
                        {
                            sentence: "I <strong>work</strong> at the hospital.",
                            explanation: "✓ Current fact (Week 1, 2, 20)"
                        },
                        {
                            sentence: "She <strong>takes</strong> the bus every day.",
                            explanation: "✓ Regular habit (Week 1, 20)"
                        },
                    ],
                },
                {
                    title: "Future Simple",
                    description: "✅ Use this OFTEN - Future plans, predictions",
                    examples: [
                        {
                            sentence: "I <strong>will start</strong> my new job next month.",
                            explanation: "✓ Future plan (Week 18, 21)"
                        },
                        {
                            sentence: "If I exercise, I <strong>will feel</strong> better.",
                            explanation: "✓ Future conditional (Week 18)"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 When to Use Simple Tenses",
                content:
                    "Use simple tenses when you DON'T need to show duration or ongoing action. Just state the fact: I worked there. I work here. I will work tomorrow.",
            },
        },

        {
            id: "continuous-tenses",
            stepNumber: 3,
            title: "Continuous Tenses: Ongoing Actions",
            icon: "⏳",
            explanation: `
                <h3>The Continuous Tenses (Showing Duration)</h3>
                <p>Continuous tenses (also called "progressive") show <strong>actions in progress</strong> at a specific moment. Formula: be + verb-ing</p>
            `,
            usageMeanings: [
                {
                    title: "Past Continuous",
                    description: "✅ Use this OFTEN - Action in progress in the past",
                    examples: [
                        {
                            sentence: "I <strong>was sleeping</strong> when the phone rang.",
                            explanation: "✓ Background action in a story (Week 5)"
                        },
                        {
                            sentence: "While I <strong>was cooking</strong>, the fire alarm went off.",
                            explanation: "✓ Ongoing past action interrupted (Week 5)"
                        },
                    ],
                },
                {
                    title: "Present Continuous",
                    description: "✅ Use this OFTEN - Action happening right now or temporary situation",
                    examples: [
                        {
                            sentence: "I <strong>am working</strong> on my resume right now.",
                            explanation: "✓ Action happening now (Week 1, 8, 9)"
                        },
                        {
                            sentence: "She <strong>is living</strong> with her sister temporarily.",
                            explanation: "✓ Temporary situation (Week 2, 6)"
                        },
                    ],
                },
                {
                    title: "Future Continuous",
                    description: "⚠️ RECOGNIZE - Action that will be in progress at a future time",
                    examples: [
                        {
                            sentence: "At 3pm tomorrow, I <strong>will be meeting</strong> with my supervisor.",
                            explanation: "⚠️ Less common, but useful for scheduling"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 When to Use Continuous",
                content:
                    "Use continuous when the action is ongoing/in progress. NOT for states (❌ 'I am knowing' ✅ 'I know') or habits (❌ 'I am working every day' ✅ 'I work every day').",
            },
        },

        {
            id: "perfect-tenses",
            stepNumber: 4,
            title: "Perfect Tenses: Connecting Two Time Points",
            icon: "🔗",
            explanation: `
                <h3>The Perfect Tenses (Showing Connection)</h3>
                <p>Perfect tenses connect <strong>two points in time</strong>. They show that something happened BEFORE another point. Formula: have/has/had + past participle</p>
            `,
            usageMeanings: [
                {
                    title: "Past Perfect",
                    description: "✅ Use this SOMETIMES - Something happened before another past event",
                    examples: [
                        {
                            sentence: "I <strong>had lived</strong> there for 5 years before I bought a house.",
                            explanation: "✓ First action happened before second action (Week 6)"
                        },
                        {
                            sentence: "She <strong>had called</strong> three times before he finally answered.",
                            explanation: "✓ Shows sequence of past events (Week 10)"
                        },
                    ],
                },
                {
                    title: "Present Perfect",
                    description: "✅ Use this OFTEN - Past action with present relevance",
                    examples: [
                        {
                            sentence: "I <strong>have lived</strong> here for 3 years. (I still live here now)",
                            explanation: "✓ Duration up to now (Week 6, 10, 15, 21)"
                        },
                        {
                            sentence: "She <strong>has worked</strong> there since January.",
                            explanation: "✓ Started in past, continues now (Week 9, 10)"
                        },
                    ],
                },
                {
                    title: "Future Perfect",
                    description: "⚠️ RECOGNIZE - Something will be completed by a future point",
                    examples: [
                        {
                            sentence: "By June, I <strong>will have completed</strong> this class.",
                            explanation: "⚠️ Useful for milestones and achievements"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Perfect = Connection",
                content:
                    "Think of perfect tenses as bridges between two time points. Present Perfect bridges past→now. Past Perfect bridges earlier past→later past. Future Perfect bridges now→future point.",
            },
        },

        {
            id: "perfect-continuous",
            stepNumber: 5,
            title: "Perfect Continuous: Duration Before a Point",
            icon: "⏱️",
            explanation: `
                <h3>The Perfect Continuous Tenses (Showing Duration + Connection)</h3>
                <p>Perfect continuous combines <strong>perfect (connection)</strong> with <strong>continuous (duration)</strong>. It shows how long something had been/has been/will have been happening. Formula: have/has/had + been + verb-ing</p>
            `,
            usageMeanings: [
                {
                    title: "Past Perfect Continuous",
                    description: "⚠️ RECOGNIZE - Duration before a past event",
                    examples: [
                        {
                            sentence: "I <strong>had been waiting</strong> for 2 hours when the bus finally came.",
                            explanation: "⚠️ Shows how long before past event (rare, but understandable)"
                        },
                    ],
                },
                {
                    title: "Present Perfect Continuous",
                    description: "✅ Use this SOMETIMES - Duration from past until now",
                    examples: [
                        {
                            sentence: "I <strong>have been working</strong> here for 5 years.",
                            explanation: "✓ Emphasizes the duration (Week 9, 10)"
                        },
                        {
                            sentence: "She <strong>has been studying</strong> English since January.",
                            explanation: "✓ Started in past, still continuing (Week 9)"
                        },
                    ],
                },
                {
                    title: "Future Perfect Continuous",
                    description: "⚠️ RECOGNIZE - Duration by a future point",
                    examples: [
                        {
                            sentence: "By December, I <strong>will have been living</strong> here for 10 years.",
                            explanation: "⚠️ Very rare, but good for work anniversaries"
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Perfect Continuous = Duration + Connection",
                content:
                    "Use perfect continuous when you want to emphasize HOW LONG something has been happening up to a certain point. 'I've worked here 5 years' (fact) vs 'I've been working here 5 years' (emphasizes the ongoing effort).",
            },
        },

        {
            id: "putting-it-together",
            stepNumber: 6,
            title: "Putting It All Together: Telling Your Story",
            icon: "📖",
            explanation: `
                <h3>Using Multiple Tenses in One Conversation</h3>
                <p>In real life, you mix tenses to tell a complete story. Here's how all the tenses work together:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem;">
                    <h4>Example: Your Wellness Journey (like Week 21 presentations)</h4>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #d97757;">Past (How it started):</p>
                        <p style="margin: 0;">"Three years ago, I <strong>used to eat</strong> a lot of fast food. I <strong>didn't exercise</strong> at all. I <strong>was feeling</strong> tired all the time."</p>
                        <small style="color: #666;">Uses: Past Simple, Past Continuous, Used To</small>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #7ba884;">Present (Where you are now):</p>
                        <p style="margin: 0;">"Now I <strong>work out</strong> three times a week. I <strong>have been eating</strong> healthier for six months. I <strong>feel</strong> much better and <strong>have more</strong> energy."</p>
                        <small style="color: #666;">Uses: Present Simple, Present Perfect Continuous, Present Simple</small>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #3b82f6;">Future (Your goals):</p>
                        <p style="margin: 0;">"Next month, I <strong>will start</strong> a cooking class. If I <strong>keep exercising</strong>, I <strong>will lose</strong> 10 more pounds. By summer, I <strong>will have been</strong> smoke-free for one year."</p>
                        <small style="color: #666;">Uses: Future Simple, Present Simple (in if-clause), Future Perfect</small>
                    </div>
                </div>

                <h4>Why Mixing Tenses Matters:</h4>
                <ul>
                    <li><strong>Shows progress</strong> - People can see your journey from past to present to future</li>
                    <li><strong>Sounds natural</strong> - Native speakers switch tenses constantly</li>
                    <li><strong>Tells complete stories</strong> - Not just facts, but a narrative with context</li>
                    <li><strong>Demonstrates mastery</strong> - Job interviewers, teachers, and doctors notice when you can do this!</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Practice This!",
                content:
                    "For your final presentation, practice telling your story with at least 6 different tenses. Start with past simple (where you began), move to present perfect (what you've achieved), and end with future goals.",
            },
            exercises: [
	                {
	                    id: "ex-mixing-1",
	                    title: "Practice: Identify the Tenses",
	                    instructions:
	                        "Read this paragraph and identify how many different tenses are used.",
	                    items: [
	                        {
	                            type: "radio",
	                            label: '"I <span class=\'eg-verb\'>moved</span> to East Boston three years ago. I <span class=\'eg-helper\'>have</span> <span class=\'eg-helper\'>been</span> <span class=\'eg-verb\'>working</span> at a clinic since then. Now I <span class=\'eg-helper\'>am</span> <span class=\'eg-verb\'>studying</span> for my nursing degree. If I <span class=\'eg-verb\'>pass</span> the exam, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>become</span> a registered nurse. By next year, I <span class=\'eg-helper\'>will</span> <span class=\'eg-helper\'>have</span> <span class=\'eg-helper\'>been</span> in this program for two years."',
	                            options: [
	                                { value: "a", label: "3 different tenses" },
	                                { value: "b", label: "5 different tenses" },
	                                { value: "c", label: "6 different tenses" },
	                            ],
	                            expectedAnswer: "c",
	                        },
	                    ],
	                },
            ],
        },

        {
            id: "quick-reference",
            stepNumber: 7,
            title: "Quick Reference Chart",
            icon: "📋",
            explanation: `
                <h3>Your Quick Reference: All 12 Tenses</h3>

                <div style="margin: 1.5rem 0;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: rgba(110, 145, 118, 0.2);">
                                <th style="padding: 0.5rem; border: 1px solid #ddd;">Tense</th>
                                <th style="padding: 0.5rem; border: 1px solid #ddd;">Formula</th>
                                <th style="padding: 0.5rem; border: 1px solid #ddd;">Example</th>
                                <th style="padding: 0.5rem; border: 1px solid #ddd;">Use It?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Past Simple</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">verb-ed</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I worked</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Present Simple</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">verb / verb-s</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I work / She works</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Future Simple</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">will + verb</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I will work</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Past Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">was/were + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I was working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Present Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">am/is/are + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I am working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Future Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">will be + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I will be working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(245, 158, 11, 0.15);">⚠️ Recognize</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Past Perfect</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">had + past participle</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I had worked</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Sometimes</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Present Perfect</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">have/has + past participle</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I have worked</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Often</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Future Perfect</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">will have + past participle</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I will have worked</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(245, 158, 11, 0.15);">⚠️ Recognize</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Past Perfect Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">had been + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I had been working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(245, 158, 11, 0.15);">⚠️ Recognize</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Present Perfect Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">have/has been + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I have been working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(122, 143, 124, 0.15);">✅ Sometimes</td>
                            </tr>
                            <tr style="background: rgba(0, 0, 0, 0.02);">
                                <td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: 600;">Future Perfect Continuous</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">will have been + verb-ing</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd;">I will have been working</td>
                                <td style="padding: 0.5rem; border: 1px solid #ddd; background: rgba(245, 158, 11, 0.15);">⚠️ Recognize</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(122, 143, 124, 0.1); border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                    <h4 style="margin-top: 0;">🎓 You Did It!</h4>
                    <p style="margin-bottom: 0;">You've studied <strong>7 of the 12 tenses</strong> in depth this course. You can recognize all 12. That's HUGE! Most native speakers don't even know they're using all these tenses - but you understand the system. Be proud!</p>
                </div>
            `,
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "Which tense do you use MOST often in everyday conversation?",
            options: [
                { value: "b", label: "Present Simple" },
                { value: "a", label: "Future Perfect Continuous" },
                { value: "c", label: "Past Perfect Continuous" },
            ],
            correctAnswer: "b",
            explanation: "Present Simple is the most common tense for everyday facts, habits, and routines.",
            skillTag: "meta-tense-frequency-present-simple",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: 'What tense is this: "I have been working at this clinic for 5 years"?',
            options: [
                { value: "a", label: "Present Perfect" },
                { value: "b", label: "Present Perfect Continuous" },
                { value: "c", label: "Past Perfect Continuous" },
            ],
            correctAnswer: "b",
            explanation: "Present Perfect Continuous: have/has been + verb-ing. It emphasizes the duration from past until now.",
            skillTag: "tense-id-present-perfect-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: 'What tense is this: "I was sleeping when the phone rang"?',
            options: [
                { value: "a", label: "Past Simple" },
                { value: "c", label: "Past Perfect" },
                { value: "b", label: "Past Continuous" },
            ],
            correctAnswer: "b",
            explanation: "Past Continuous (was/were + verb-ing) shows an ongoing action interrupted by a past simple event.",
            skillTag: "tense-id-past-continuous",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "How many verb tenses should you be able to USE confidently for ESOL Level 3?",
            options: [
                { value: "b", label: "7–8 tenses (simple, continuous, and perfect)" },
                { value: "a", label: "All 12 tenses" },
                { value: "c", label: "Only 3 tenses (past, present, future simple)" },
            ],
            correctAnswer: "b",
            explanation: "At this level, you use simple, continuous, and perfect tenses confidently and just recognize the rest.",
            skillTag: "meta-esol-level-3-tense-expectation",
            difficulty: "easy",
        },
        {
            id: "quiz-5",
            question:
                'In this story, how many different tenses are used? "I moved to East Boston three years ago. I have been working at a clinic since then. Next year, I will apply for nursing school."',
            options: [
                { value: "a", label: "2 tenses" },
                { value: "b", label: "3 tenses" },
                { value: "c", label: "4 tenses" },
            ],
            correctAnswer: "b",
            explanation:
                "There are 3 tenses: Past Simple (moved), Present Perfect Continuous (have been working), and Future Simple (will apply).",
            skillTag: "timeline-mixed-tenses-identification",
            difficulty: "medium",
        },
        {
            id: "quiz-6",
            question: 'What tense is this: "She takes the subway to work every morning"?',
            options: [
                { value: "b", label: "Present Continuous" },
                { value: "c", label: "Past Simple" },
                { value: "a", label: "Present Simple" },
            ],
            correctAnswer: "a",
            explanation: "Present Simple describes habits and routines (every morning).",
            skillTag: "tense-id-present-simple",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Complete: \"Right now, we ___ for the bus.\"",
            options: [
                { value: "b", label: "are waiting" },
                { value: "a", label: "wait" },
                { value: "c", label: "waited" },
            ],
            correctAnswer: "b",
            explanation: "Use Present Continuous (am/is/are + verb-ing) for actions happening right now.",
            skillTag: "tense-choice-present-continuous-now",
            difficulty: "easy",
        },
        {
            id: "quiz-8",
            question: 'What tense is this: "I am meeting my caseworker tomorrow"?',
            options: [
                { value: "b", label: "Future Perfect" },
                { value: "a", label: "Present Continuous (future plan)" },
                { value: "c", label: "Past Continuous" },
            ],
            correctAnswer: "a",
            explanation: "Present Continuous can describe a scheduled future plan when you add a future time word.",
            skillTag: "future-forms-present-continuous-schedule",
            difficulty: "medium",
        },
        {
            id: "quiz-9",
            question: 'What tense is this: "I have lived in this apartment since 2021"?',
            options: [
                { value: "b", label: "Past Simple" },
                { value: "c", label: "Future Simple" },
                { value: "a", label: "Present Perfect" },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect (have/has + past participle) connects the past (since 2021) to now.",
            skillTag: "tense-id-present-perfect",
            difficulty: "easy",
        },
        {
            id: "quiz-10",
            question: 'What tense is this: "When I got home, my roommate had already cooked dinner"?',
            options: [
                { value: "a", label: "Past Perfect" },
                { value: "b", label: "Past Continuous" },
                { value: "c", label: "Present Perfect" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect (had + past participle) shows one past action happened before another past action.",
            skillTag: "tense-id-past-perfect",
            difficulty: "medium",
        },
        {
            id: "quiz-11",
            question: 'What tense is this: "I had been waiting for two hours when they called my name"?',
            options: [
                { value: "b", label: "Present Perfect Continuous" },
                { value: "a", label: "Past Perfect Continuous" },
                { value: "c", label: "Future Continuous" },
            ],
            correctAnswer: "a",
            explanation: "Past Perfect Continuous (had been + verb-ing) emphasizes duration before a past moment.",
            skillTag: "tense-id-past-perfect-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "Complete: \"By next summer, I ___ here for two years.\"",
            options: [
                { value: "a", label: "will live" },
                { value: "c", label: "have lived" },
                { value: "b", label: "will have lived" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect (will have + past participle) shows something will be completed by a future time.",
            skillTag: "form-future-perfect",
            difficulty: "medium",
        },
        {
            id: "quiz-13",
            question: "Complete: \"At 3 p.m. tomorrow, I ___ in class.\"",
            options: [
                { value: "a", label: "will be sitting" },
                { value: "b", label: "am sitting" },
                { value: "c", label: "sat" },
            ],
            correctAnswer: "a",
            explanation: "Future Continuous (will be + verb-ing) describes an action in progress at a future time.",
            skillTag: "form-future-continuous",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Complete: \"If I ___ early, I will catch the train.\"",
            options: [
                { value: "b", label: "will leave" },
                { value: "a", label: "leave" },
                { value: "c", label: "left" },
            ],
            correctAnswer: "a",
            explanation: "In a real future conditional, the if-clause uses Present Simple, and the result clause uses will + verb.",
            skillTag: "conditional-first-if-clause-form",
            difficulty: "medium",
        },
        {
            id: "quiz-15",
            question: "Which formula is correct for Present Perfect?",
            options: [
                { value: "b", label: "was/were + verb-ing" },
                { value: "c", label: "will have been + verb-ing" },
                { value: "a", label: "have/has + past participle" },
            ],
            correctAnswer: "a",
            explanation: "Present Perfect uses have/has + past participle (for example, 'I have finished').",
            skillTag: "form-present-perfect",
            difficulty: "easy",
        },
    ],

    /*
    TEACHER DIAGNOSTIC NOTES – All Verb Tenses Overview Mini Quiz

    This mini quiz checks big-picture understanding of the tense system, not just one tense.

    Skills and tags:

    Meta / overview:
    - meta-tense-frequency-present-simple
    - meta-esol-level-3-tense-expectation

    Tense identification:
    - tense-id-present-simple
    - tense-id-past-continuous
    - tense-id-present-perfect
    - tense-id-present-perfect-continuous
    - tense-id-past-perfect
    - tense-id-past-perfect-continuous

    Timeline and mixing:
    - timeline-mixed-tenses-identification
    - future-forms-present-continuous-schedule

    Form knowledge:
    - form-present-perfect
    - form-future-perfect
    - form-future-continuous

    Conditional control:
    - conditional-first-if-clause-form

    Reteaching guidance:
    - If tense-ID tags are weak → go back to the timeline table near the top of the guide and practice matching example sentences to the 12 boxes.
    - If timeline-mixed-tenses-identification is weak → have students color-code past, present, and future verbs in short stories and label the tenses.
    - If future form tags are weak → contrast "will" (decision/prediction) with Present Continuous for scheduled plans and Future Perfect/Continuous for milestones.
    - If form tags are weak → build a one-page formula chart (tense, formula, example) and use it as a reference during speaking and writing.
    - If conditional-first-if-clause-form is weak → drill short patterns: "If I leave early, I will..." / "If it rains, we will..." and highlight Present Simple in the if-clause.

    Suggested use:
    - Use this mini quiz at the end of the course as a quick diagnostic of overall tense awareness.
    - If multiple tags show low performance, choose ONE focus area (for example, tense identification, future forms, or conditionals) for a short review lesson before presentations.
    */
};
