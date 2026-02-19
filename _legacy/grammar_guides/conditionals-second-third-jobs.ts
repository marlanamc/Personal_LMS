import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsSecondThirdJobsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Second & Third Conditionals: Jobs - Advice, Risk & Reflection",
            icon: "💭",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">These conditionals help you talk about career advice, hypothetical job scenarios, and learning from past work experiences. <strong>Second conditional</strong> is for giving advice and dreaming about unlikely career situations. <strong>Third conditional</strong> is for reflecting on past job decisions and lessons learned.</p>
                </div>

                <h3>The Two Types</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">Second Conditional</h4>
                        <p><strong>Present/Future hypothetical</strong></p>
                        <p style="font-weight: bold; color: #a855f7;">If + past, would + verb</p>
                        <p style="margin: 0;">"If I were you, I would ask for a reference letter."</p>
                    </div>
                    <div style="background: rgba(14, 165, 233, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
                        <h4 style="color: #0ea5e9; margin-top: 0;">Third Conditional</h4>
                        <p><strong>Past reflection</strong></p>
                        <p style="font-weight: bold; color: #0ea5e9;">If + past perfect, would have + verb</p>
                        <p style="margin: 0;">"If I had asked about benefits, I would have known about the 401k."</p>
                    </div>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>At work:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Giving career advice to coworkers (second conditional)</li>
                        <li>Discussing hypothetical job choices and dream careers</li>
                        <li>Reflecting on past interviews and job decisions (third conditional)</li>
                        <li>Learning from workplace mistakes and experiences</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Second = imagining & advice. Third = learning from the past!</p>
                </div>
            `,
            exercises: [
                {
                    id: "intro-1",
                    title: "Practice: Second vs Third - Can You Tell?",
                    instructions: "Is each sentence about an imaginary present/future situation (second) or reflecting on the past (third)?",
                    items: [
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>were</span> you, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>ask</span> for a reference letter."',
                            options: [
                                { value: "second", label: "Second - giving advice about present/future" },
                                { value: "third", label: "Third - reflecting on the past" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>had asked</span> about the benefits earlier, I <span class=\'eg-helper\'>would have</span> <span class=\'eg-verb\'>known</span> about the 401k."',
                            options: [
                                { value: "second", label: "Second - giving advice" },
                                { value: "third", label: "Third - reflecting on a past mistake" },
                            ],
                            expectedAnswer: "third",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>spoke</span> Spanish, I <span class=\'eg-helper\'>would</span> <span class=\'eg-verb\'>apply</span> for that position."',
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
            title: "Second Conditional: Career Advice & Hypothetical Scenarios",
            icon: "🎯",
            explanation: `
                <h3>What Is Second Conditional?</h3>
                <p>Second conditional is for <strong>unreal or hypothetical situations</strong> in the present or future:</p>
                <ul>
                    <li><strong>Giving career advice:</strong> "If I were you, I would ask for a raise."</li>
                    <li><strong>Unlikely job scenarios:</strong> "If I got promoted to manager..." (probably won't happen)</li>
                    <li><strong>Imaginary situations:</strong> "If I were the CEO..." (I'm not the CEO)</li>
                    <li><strong>Dream careers:</strong> "If I spoke fluent English, I would apply for management."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border: 2px solid #a855f7;">
                    <h4 style="color: #a855f7;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #a855f7; text-align: center; margin: 1rem 0;">If + past simple, would + base verb</p>
                    <p style="text-align: center; font-style: italic;">(past form BUT present/future meaning!)</p>
                </div>

                <h3>Career Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Giving career advice:</p>
                    <ul>
                        <li>If I <strong>were</strong> you, I <strong>would ask</strong> for a reference letter before leaving.</li>
                        <li>If I <strong>were</strong> you, I <strong>would negotiate</strong> the salary offer.</li>
                        <li>If I <strong>were</strong> you, I <strong>would apply</strong> - you're qualified!</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Hypothetical job scenarios:</p>
                    <ul>
                        <li>If I <strong>spoke</strong> Spanish fluently, I <strong>would apply</strong> for that translator position.</li>
                        <li>If the company <strong>offered</strong> remote work, I <strong>would save</strong> commute time.</li>
                        <li>If I <strong>had</strong> better computer skills, I <strong>would get</strong> an office job.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Dream careers:</p>
                    <ul>
                        <li>If I <strong>were</strong> the manager, I <strong>would change</strong> the schedule.</li>
                        <li>If I <strong>got</strong> promoted to supervisor, I <strong>would help</strong> train new employees.</li>
                        <li>If they <strong>gave</strong> me more hours, I <strong>would earn</strong> enough to save money.</li>
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
                    instructions: "Complete each second conditional sentence with career examples.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (speak) Spanish, I would apply for that position.",
                            expectedAnswer: "spoke",
                        },
                        {
                            type: "select",
                            label: "If the company offered remote work, I _____ commute time.",
                            options: ["save", "will save", "would save", "saved"],
                            expectedAnswer: "would save",
                        },
                        {
                            type: "radio",
                            label: "Which is correct second conditional?",
                            options: [
                                { value: "a", label: "If I had better skills, I would get promoted." },
                                { value: "b", label: "If I have better skills, I will get promoted." },
                                { value: "c", label: "If I would have better skills, I would get promoted." },
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
            title: "Special Form: 'If I Were You' - Giving Career Advice",
            icon: "💼",
            explanation: `
                <h3>Using "Were" for All Subjects</h3>
                <p>In second conditional with the verb "to be", we use <strong>WERE for all subjects</strong> (not "was"), especially in professional contexts:</p>

                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <h4>Professional/Formal (Always Use This)</h4>
                    <ul>
                        <li>If I <strong>were</strong> you, I would ask for a reference letter.</li>
                        <li>If she <strong>were</strong> the supervisor, she would change the policy.</li>
                        <li>If he <strong>were</strong> more confident in interviews, he would get hired.</li>
                        <li>If it <strong>were</strong> up to me, I would give everyone a raise.</li>
                    </ul>
                </div>

                <h3>Common Career Advice Patterns</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Interview preparation:</p>
                    <ul>
                        <li>If I were you, I <strong>would research</strong> the company before the interview.</li>
                        <li>If I were you, I <strong>would prepare</strong> questions to ask the interviewer.</li>
                        <li>If I were you, I <strong>would practice</strong> answering common interview questions.</li>
                        <li>If I were you, I <strong>would dress</strong> professionally.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Workplace situations:</p>
                    <ul>
                        <li>If I were you, I <strong>would talk</strong> to HR about that problem.</li>
                        <li>If I were you, I <strong>would ask</strong> for overtime pay.</li>
                        <li>If I were you, I <strong>would request</strong> flexible hours.</li>
                        <li>If I were you, I <strong>would get</strong> that certification.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Career growth:</p>
                    <ul>
                        <li>If I were you, I <strong>would apply</strong> for the promotion - you're qualified!</li>
                        <li>If I were you, I <strong>would ask</strong> your manager about advancement opportunities.</li>
                        <li>If I were you, I <strong>would take</strong> that training course.</li>
                        <li>If I were the boss, I <strong>would give</strong> you a raise.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Professional Tip",
                content: "Always use 'were' (not 'was') in professional contexts: 'If I were you', 'If he were here', 'If she were the manager'. This sounds more professional and educated.",
            },
            exercises: [
                {
                    id: "if-i-were-1",
                    title: "Practice: Career Advice with 'If I Were You'",
                    instructions: "Complete each advice sentence correctly.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct professional advice?",
                            options: [
                                { value: "a", label: "If I were you, I would negotiate the salary." },
                                { value: "b", label: "If I was you, I would negotiate the salary." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "If I _____ (be) the manager, I would change the schedule.",
                            expectedAnswer: "were",
                        },
                        {
                            type: "select",
                            label: "If she _____ more experienced, she would get the promotion.",
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
            title: "Third Conditional: Past Job Reflections & Lessons Learned",
            icon: "🔙",
            explanation: `
                <h3>What Is Third Conditional?</h3>
                <p>Third conditional is for <strong>reflecting on the past</strong> - things that didn't happen and their imagined results:</p>
                <ul>
                    <li><strong>Past job mistakes:</strong> "If I had read the email carefully, I wouldn't have made that error."</li>
                    <li><strong>Missed opportunities:</strong> "If I had attended the workshop, I would have learned new skills."</li>
                    <li><strong>Interview reflection:</strong> "If I had researched the company, I would have asked better questions."</li>
                    <li><strong>Career decisions:</strong> "If I had taken that job, I would have moved to Boston."</li>
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
                        <li>If I <strong>had asked</strong> about the benefits</li>
                        <li>If she <strong>had arrived</strong> on time</li>
                        <li>If we <strong>had checked</strong> the equipment</li>
                        <li>If they <strong>had trained</strong> me properly</li>
                    </ul>
                    <p style="font-style: italic; margin-top: 0.5rem;">Formula: had + past participle (asked, arrived, checked, trained)</p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold; color: #d97757;">WOULD HAVE clause (result):</p>
                    <ul>
                        <li>I <strong>would have known</strong> about the 401k</li>
                        <li>she <strong>wouldn't have missed</strong> the meeting</li>
                        <li>we <strong>would have found</strong> the problem</li>
                        <li>I <strong>would have understood</strong> my duties</li>
                    </ul>
                    <p style="font-style: italic; margin-top: 0.5rem;">Formula: would have + past participle</p>
                </div>

                <h3>Complete Examples from Work</h3>
                <ul>
                    <li><strong>If I had asked about the benefits earlier</strong>, <strong>I would have known about the 401k match</strong>.</li>
                    <li><strong>If she had arrived on time</strong>, <strong>she wouldn't have missed the safety meeting</strong>.</li>
                    <li><strong>If we had checked the equipment yesterday</strong>, <strong>we would have caught the problem</strong>.</li>
                    <li><strong>If I had taken that job offer</strong>, <strong>I would have moved to a different city</strong>.</li>
                </ul>

                <div style="background: rgba(234, 179, 8, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #eab308;">⚠️ Important!</h4>
                    <p>Third conditional is all about the PAST. You're reflecting on something that DIDN'T happen and imagining what the result WOULD HAVE BEEN.</p>
                    <ul>
                        <li>Reality: I didn't ask → I didn't know</li>
                        <li>Third conditional: "If I had asked, I would have known" (but I didn't)</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Third conditional is for learning from the past. Use it to reflect on missed opportunities, mistakes, and 'what could have been' scenarios at work.",
            },
            exercises: [
                {
                    id: "third-structure-1",
                    title: "Practice: Build Third Conditional Sentences",
                    instructions: "Complete each third conditional sentence about past work situations.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (had/ask) about the schedule earlier, I would have planned better.",
                            expectedAnswer: "had asked",
                        },
                        {
                            type: "select",
                            label: "If she had researched the company, she _____ better questions in the interview.",
                            options: ["asked", "would ask", "would have asked", "had asked"],
                            expectedAnswer: "would have asked",
                        },
                        {
                            type: "radio",
                            label: "Which is correct third conditional?",
                            options: [
                                { value: "a", label: "If I had read the email, I wouldn't have made that mistake." },
                                { value: "b", label: "If I read the email, I wouldn't make that mistake." },
                                { value: "c", label: "If I would have read the email, I wouldn't have made that mistake." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "third-conditional-lessons",
            stepNumber: 4,
            title: "Lessons Learned: Reflecting on Past Work Experiences",
            icon: "📚",
            explanation: `
                <h3>Using Third Conditional to Learn from the Past</h3>
                <p>Third conditional helps you reflect on past work situations and identify lessons learned:</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Interview preparation lessons:</p>
                    <ul>
                        <li>If I <strong>had researched</strong> the company, I <strong>would have asked</strong> better questions.</li>
                        <li>If I <strong>had practiced</strong> my answers, I <strong>wouldn't have been</strong> so nervous.</li>
                        <li>If I <strong>had brought</strong> extra copies of my resume, I <strong>would have been</strong> more prepared.</li>
                        <li>If I <strong>had dressed</strong> more professionally, I <strong>would have made</strong> a better first impression.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Training & skill development:</p>
                    <ul>
                        <li>If I <strong>had attended</strong> the workshop, I <strong>would have learned</strong> new computer skills.</li>
                        <li>If I <strong>had taken</strong> the Spanish class, I <strong>could have applied</strong> for the bilingual position.</li>
                        <li>If I <strong>had asked</strong> for help sooner, I <strong>wouldn't have struggled</strong> so much.</li>
                        <li>If I <strong>had completed</strong> the certification last year, I <strong>would have gotten</strong> promoted already.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Workplace mistakes & learning:</p>
                    <ul>
                        <li>If I <strong>had read</strong> the instructions carefully, I <strong>wouldn't have made</strong> that error.</li>
                        <li>If I <strong>had asked</strong> for clarification, I <strong>would have understood</strong> the task.</li>
                        <li>If I <strong>had double-checked</strong> my work, I <strong>would have caught</strong> the mistake.</li>
                        <li>If I <strong>had spoken up</strong> in the meeting, I <strong>would have gotten</strong> credit for my idea.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Career decisions & paths:</p>
                    <ul>
                        <li>If I <strong>had stayed</strong> at my previous job, I <strong>wouldn't have</strong> this experience.</li>
                        <li>If I <strong>had taken</strong> that position in Boston, I <strong>would have moved</strong> away from family.</li>
                        <li>If I <strong>had negotiated</strong> the salary, I <strong>would have earned</strong> $2 more per hour.</li>
                        <li>If I <strong>had asked</strong> about growth opportunities, I <strong>would have known</strong> there weren't any.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "lessons-1",
                    title: "Practice: Learning from Past Work Experiences",
                    instructions: "Complete each reflection sentence using third conditional.",
                    items: [
                        {
                            type: "text",
                            label: "If I had asked for help sooner, I _____ (wouldn't have/struggle) so much.",
                            expectedAnswer: "wouldn't have struggled",
                        },
                        {
                            type: "select",
                            label: "If I _____ the company benefits guide, I would have known about the 401k.",
                            options: ["read", "had read", "would read", "would have read"],
                            expectedAnswer: "had read",
                        },
                        {
                            type: "radio",
                            label: "Reflection on a past interview:",
                            options: [
                                { value: "a", label: "If I had practiced my answers, I would have been more confident." },
                                { value: "b", label: "If I practice my answers, I will be more confident." },
                                { value: "c", label: "If I practiced my answers, I would be more confident." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "second-vs-third",
            stepNumber: 5,
            title: "Second vs Third: Present Wishes vs Past Regrets",
            icon: "⚖️",
            explanation: `
                <h3>The Key Difference: Present Hypothetical vs Past Reflection</h3>
                <p>Understanding when to use second vs third conditional is crucial:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #a855f7;">
                        <h4 style="color: #a855f7; margin-top: 0;">Second (Present/Future Wish)</h4>
                        <p style="font-weight: bold;">"If I spoke Spanish, I would apply for that job."</p>
                        <p style="margin: 0;">Meaning: I don't speak Spanish NOW, so I can't apply. This is about the present situation.</p>
                    </div>
                    <div style="background: rgba(14, 165, 233, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
                        <h4 style="color: #0ea5e9; margin-top: 0;">Third (Past Regret)</h4>
                        <p style="font-weight: bold;">"If I had spoken up in the meeting, I would have gotten credit."</p>
                        <p style="margin: 0;">Meaning: I didn't speak up in that PAST meeting. Now I regret it. I'm reflecting on what happened.</p>
                    </div>
                </div>

                <h3>More Career Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Second (Present Wish)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Third (Past Regret)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>had</strong> better skills, I <strong>would get</strong> promoted.<br/><em>(wish about now - I don't have skills)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>had taken</strong> the training, I <strong>would have gotten</strong> promoted.<br/><em>(regret about past - I didn't take it)</em></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>spoke</strong> English fluently, I <strong>would apply</strong> for management.<br/><em>(present situation - I don't speak fluently now)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>had applied</strong> last month, I <strong>would have gotten</strong> an interview.<br/><em>(past opportunity - I didn't apply)</em></td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the company <strong>offered</strong> remote work, I <strong>would save</strong> commute time.<br/><em>(wish - they don't offer it now)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I <strong>had left</strong> earlier, I <strong>wouldn't have been</strong> late.<br/><em>(past mistake - I left too late)</em></td>
                        </tr>
                    </tbody>
                </table>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h4 style="color: #3b82f6;">Quick Decision Tool</h4>
                    <p><strong>Ask yourself:</strong> Am I imagining NOW/FUTURE or reflecting on the PAST?</p>
                    <ul>
                        <li><strong>Present/Future hypothetical →</strong> Second conditional (past, would)</li>
                        <li><strong>Past reflection/regret →</strong> Third conditional (past perfect, would have)</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "second-vs-third-1",
                    title: "Practice: Choose Second or Third",
                    instructions: "Decide whether each situation is about present/future (second) or past (third).",
                    items: [
                        {
                            type: "radio",
                            label: "You're wishing you had a skill NOW:",
                            options: [
                                { value: "second", label: "Second: 'If I spoke Spanish, I would get better jobs.'" },
                                { value: "third", label: "Third: 'If I had spoken Spanish, I would have gotten that job.'" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: "You're reflecting on a past interview mistake:",
                            options: [
                                { value: "second", label: "Second: 'If I researched the company, I would ask better questions.'" },
                                { value: "third", label: "Third: 'If I had researched the company, I would have asked better questions.'" },
                            ],
                            expectedAnswer: "third",
                        },
                        {
                            type: "radio",
                            label: "You're giving advice about a present situation:",
                            options: [
                                { value: "second", label: "Second: 'If I were you, I would negotiate the salary.'" },
                                { value: "third", label: "Third: 'If I had been you, I would have negotiated the salary.'" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "decision-flowchart",
            stepNumber: 6,
            title: "Decision Tool: Which Conditional?",
            icon: "🎯",
            explanation: `
                <h3>How to Choose Between Second and Third Conditional</h3>
                <p>Ask yourself these questions:</p>

                <div style="background: white; padding: 2rem; border-radius: 0.5rem; border: 2px solid rgba(200, 107, 81, 0.3); margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #a855f7;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Am I imagining a PRESENT/FUTURE situation that's not real?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>SECOND conditional</strong> (past + would)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If I spoke Spanish, I would apply for that job." (I don't speak Spanish NOW)</p>
                    </div>

                    <p style="text-align: center; font-weight: bold; margin: 1rem 0;">↓ NO? Then ask...</p>

                    <div style="background: rgba(14, 165, 233, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Am I reflecting on a PAST situation that didn't happen?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>THIRD conditional</strong> (past perfect + would have)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If I had spoken up, I would have gotten credit." (I didn't speak up in that PAST meeting)</p>
                    </div>
                </div>

                <h3>Quick Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Situation</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Time</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Giving career advice now</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Present</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Second</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Wishing you had a skill now</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Present</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Second</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Reflecting on a past interview</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Past</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Third</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Regretting a missed opportunity</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Past</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Third</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "decision-1",
                    title: "Practice: Use the Decision Tool",
                    instructions: "Use the flowchart to choose second or third conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Wishing for a skill you don't have NOW:",
                            options: [
                                { value: "second", label: "Second (present hypothetical)" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: "Reflecting on not applying for a job last month:",
                            options: [
                                { value: "second", label: "Second (present hypothetical)" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "third",
                        },
                        {
                            type: "radio",
                            label: "Giving advice to a coworker about their current situation:",
                            options: [
                                { value: "second", label: "Second (present advice)" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "second",
                        },
                    ],
                },
            ],
        },

        {
            id: "modal-variations",
            stepNumber: 7,
            title: "Mixed Modal Variations",
            icon: "🔧",
            explanation: `
                <h3>Using Other Modals Besides 'Would'</h3>
                <p>You can use could and might in both second and third conditional:</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Second Conditional with Could/Might:</h4>
                    <ul>
                        <li>If I <strong>had</strong> a car, I <strong>could drive</strong> to work. (ability)</li>
                        <li>If I <strong>asked</strong> for a raise, my boss <strong>might approve</strong> it. (possibility)</li>
                        <li>If I <strong>spoke</strong> Spanish, I <strong>could work</strong> as a translator. (ability)</li>
                        <li>If the company <strong>offered</strong> training, I <strong>might take</strong> it. (possibility)</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Third Conditional with Could Have/Might Have:</h4>
                    <ul>
                        <li>If I <strong>had left</strong> earlier, I <strong>could have caught</strong> the bus. (ability)</li>
                        <li>If she <strong>had applied</strong>, she <strong>might have gotten</strong> the position. (possibility)</li>
                        <li>If I <strong>had known</strong> about the opening, I <strong>could have applied</strong>. (ability)</li>
                        <li>If we <strong>had asked</strong> sooner, they <strong>might have given</strong> us the promotion. (possibility)</li>
                    </ul>
                </div>

                <h3>When to Use Could vs Would</h3>
                <ul>
                    <li><strong>Would:</strong> More certain, definite result</li>
                    <li><strong>Could:</strong> Ability or possibility (less certain)</li>
                    <li><strong>Might:</strong> Even less certain possibility</li>
                </ul>
            `,
            exercises: [
                {
                    id: "modals-1",
                    title: "Practice: Modal Selection",
                    instructions: "Choose the best modal for each workplace situation.",
                    items: [
                        {
                            type: "radio",
                            label: "If I had a car, I _____ drive to work. (ability)",
                            options: [
                                { value: "a", label: "could drive" },
                                { value: "b", label: "would drive" },
                                { value: "c", label: "might drive" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "If I had asked for time off, my boss _____ approved it. (possibility - uncertain)",
                            options: [
                                { value: "a", label: "would have approved" },
                                { value: "b", label: "might have approved" },
                                { value: "c", label: "could have approved" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 8,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Second Conditional Mistakes</h3>
                <ul>
                    <li>❌ "If I <strong>would have</strong> a car, I would drive to work." → ✅ "If I <strong>had</strong> a car, I would drive to work."</li>
                    <li>❌ "If I <strong>was</strong> you, I would apply." → ✅ "If I <strong>were</strong> you, I would apply."</li>
                    <li>❌ "If I speak Spanish, I <strong>would apply</strong>." → ✅ "If I <strong>spoke</strong> Spanish, I would apply."</li>
                </ul>

                <h3>Third Conditional Mistakes</h3>
                <ul>
                    <li>❌ "If I <strong>asked</strong> earlier, I would have known." → ✅ "If I <strong>had asked</strong> earlier, I would have known."</li>
                    <li>❌ "If I had asked, I <strong>would know</strong>." → ✅ "If I had asked, I <strong>would have known</strong>."</li>
                    <li>❌ "If I <strong>would have known</strong>, I would have come." → ✅ "If I <strong>had known</strong>, I would have come."</li>
                </ul>

                <h3>Mixing Second and Third</h3>
                <ul>
                    <li>❌ "If I <strong>had</strong> a car NOW, I <strong>would have driven</strong> to work YESTERDAY." → Use consistent timeframes!</li>
                    <li>✅ Present: "If I had a car, I would drive to work."</li>
                    <li>✅ Past: "If I had had a car yesterday, I would have driven to work."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix the Mistakes",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I would have more experience, I would get promoted.'",
                            options: [
                                { value: "a", label: "If I had more experience, I would get promoted." },
                                { value: "b", label: "If I would have more experience, I will get promoted." },
                                { value: "c", label: "If I have more experience, I would get promoted." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'If I was you, I would ask for a raise.'",
                            options: [
                                { value: "a", label: "If I were you, I would ask for a raise." },
                                { value: "b", label: "If I am you, I would ask for a raise." },
                                { value: "c", label: "If I was you, I will ask for a raise." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'If I asked earlier, I would have known about the 401k.'",
                            options: [
                                { value: "a", label: "If I had asked earlier, I would have known about the 401k." },
                                { value: "b", label: "If I asked earlier, I would know about the 401k." },
                                { value: "c", label: "If I would have asked earlier, I would have known about the 401k." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "all-four-conditionals",
            stepNumber: 9,
            title: "All Four Conditionals Compared",
            icon: "📊",
            explanation: `
                <h3>Master Comparison: All Four Types</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.15);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Type</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Formula</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">When</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Job Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: rgba(244, 211, 94, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Zero</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">present + present</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true (policy)</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you clock in late, the system marks you tardy.</td>
                        </tr>
                        <tr style="background: rgba(122, 143, 124, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">present + will</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future plan</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I finish training, I will get a raise.</td>
                        </tr>
                        <tr style="background: rgba(168, 85, 247, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">past + would</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Present hypothetical</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I spoke Spanish, I would apply for that job.</td>
                        </tr>
                        <tr style="background: rgba(14, 165, 233, 0.08);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Third</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">past perfect + would have</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Past regret/reflection</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had asked, I would have known about the 401k.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Same Situation, All Four Types</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Type</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Sentence</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Zero</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If employees arrive late, they clock in through the manager.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Company policy (always true)</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I arrive late tomorrow, I will clock in through the manager.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">My specific future plan</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I were the manager, I would change the policy.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Imagining (I'm not the manager)</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Third</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had arrived on time, I wouldn't have been marked late.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Past regret (I was late yesterday)</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "all-four-1",
                    title: "Practice: Identify All Four Types",
                    instructions: "Identify which conditional each sentence uses.",
                    items: [
                        {
                            type: "radio",
                            label: '"If you don\'t wear a uniform, you can\'t work."',
                            options: [
                                { value: "zero", label: "Zero (company policy)" },
                                { value: "first", label: "First (future plan)" },
                                { value: "second", label: "Second (hypothetical)" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If I apply next week, I will get an interview."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First (real future plan)" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I were you, I would negotiate."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second (advice)" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: '"If I had researched the company, I would have been prepared."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "third",
                        },
                    ],
                },
            ],
        },

        {
            id: "advice-vs-regret",
            stepNumber: 10,
            title: "Advice vs Regret Patterns",
            icon: "💬",
            explanation: `
                <h3>Common Patterns for Giving Advice (Second Conditional)</h3>
                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If I were you, I would...</li>
                        <li>If I were in your position, I would...</li>
                        <li>If you wanted my opinion, I would suggest...</li>
                        <li>If I were the hiring manager, I would...</li>
                    </ul>
                </div>

                <h3>Common Patterns for Expressing Regret (Third Conditional)</h3>
                <div style="background: rgba(14, 165, 233, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <ul>
                        <li>If only I had... (then I would have...)</li>
                        <li>I wish I had... (it would have...)</li>
                        <li>If I had known... I would have...</li>
                        <li>Looking back, if I had... I would have...</li>
                    </ul>
                </div>

                <h3>Real Examples from Work</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Advice (Second)</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Regret (Third)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I were you, I would ask for flexible hours.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had asked for flexible hours, I would have better work-life balance now.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I were in your position, I would get that certification.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had gotten that certification, I would have been promoted already.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I were you, I would negotiate the salary offer.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I had negotiated the salary, I would be earning more now.</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "advice-regret-1",
                    title: "Practice: Advice vs Regret",
                    instructions: "Choose whether each sentence is giving advice (second) or expressing regret (third).",
                    items: [
                        {
                            type: "radio",
                            label: '"If I were you, I would ask for a reference letter."',
                            options: [
                                { value: "advice", label: "Advice (second conditional)" },
                                { value: "regret", label: "Regret (third conditional)" },
                            ],
                            expectedAnswer: "advice",
                        },
                        {
                            type: "radio",
                            label: '"If I had asked for a reference letter, I would have it now."',
                            options: [
                                { value: "advice", label: "Advice (second conditional)" },
                                { value: "regret", label: "Regret (third conditional)" },
                            ],
                            expectedAnswer: "regret",
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
                    id: "practice-ex-1",
                    title: "Exercise 1: Second Conditional - Career Advice",
                    instructions: "Complete with past simple + would.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (be) you, I would ask for a raise.",
                            expectedAnswer: "were",
                        },
                        {
                            type: "select",
                            label: "If you had better English skills, you _____ for management.",
                            options: ["apply", "will apply", "would apply", "applied"],
                            expectedAnswer: "would apply",
                        },
                    ],
                },
                {
                    id: "practice-ex-2",
                    title: "Exercise 2: Third Conditional - Past Reflections",
                    instructions: "Complete with past perfect + would have.",
                    items: [
                        {
                            type: "text",
                            label: "If I _____ (had/research) the company, I would have been more prepared.",
                            expectedAnswer: "had researched",
                        },
                        {
                            type: "select",
                            label: "If she had applied last month, she _____ an interview.",
                            options: ["gets", "will get", "would get", "would have gotten"],
                            expectedAnswer: "would have gotten",
                        },
                    ],
                },
                {
                    id: "practice-ex-3",
                    title: "Exercise 3: Second or Third?",
                    instructions: "Choose the right conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Present advice:",
                            options: [
                                { value: "second", label: "If I were you, I would negotiate." },
                                { value: "third", label: "If I had been you, I would have negotiated." },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: "Past regret:",
                            options: [
                                { value: "second", label: "If I asked for help, I would understand." },
                                { value: "third", label: "If I had asked for help, I would have understood." },
                            ],
                            expectedAnswer: "third",
                        },
                    ],
                },
                {
                    id: "practice-ex-4",
                    title: "Exercise 4: All Four Conditionals",
                    instructions: "Identify the type.",
                    items: [
                        {
                            type: "radio",
                            label: '"If employees miss 3 shifts, they receive a warning."',
                            options: [
                                { value: "zero", label: "Zero (policy)" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If I finish training, I will get promoted."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First (real plan)" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If I spoke Spanish, I would apply."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second (hypothetical)" },
                                { value: "third", label: "Third" },
                            ],
                            expectedAnswer: "second",
                        },
                        {
                            type: "radio",
                            label: '"If I had known, I would have applied."',
                            options: [
                                { value: "zero", label: "Zero" },
                                { value: "first", label: "First" },
                                { value: "second", label: "Second" },
                                { value: "third", label: "Third (past regret)" },
                            ],
                            expectedAnswer: "third",
                        },
                    ],
                },
                {
                    id: "practice-ex-5",
                    title: "Exercise 5: Fix the Mistakes",
                    instructions: "Choose the correct version.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I was you, I would apply.'",
                            options: [
                                { value: "a", label: "If I were you, I would apply." },
                                { value: "b", label: "If I am you, I would apply." },
                                { value: "c", label: "If I were you, I will apply." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'If I asked earlier, I would have known.'",
                            options: [
                                { value: "a", label: "If I had asked earlier, I would have known." },
                                { value: "b", label: "If I would have asked earlier, I would have known." },
                                { value: "c", label: "If I asked earlier, I would know." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-6",
                    title: "Exercise 6: Modal Variations",
                    instructions: "Choose could, might, or would.",
                    items: [
                        {
                            type: "select",
                            label: "If I had a car, I _____ drive to work. (ability)",
                            options: ["would", "could", "might", "should"],
                            expectedAnswer: "could",
                        },
                        {
                            type: "select",
                            label: "If I had left earlier, I _____ caught the bus. (ability in past)",
                            options: ["would have", "could have", "might have", "should have"],
                            expectedAnswer: "could have",
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
                <h3>Second & Third Conditionals Summary</h3>

                <div style="background: rgba(168, 85, 247, 0.15); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #a855f7;">
                    <h4 style="color: #a855f7; margin-top: 0;">Second Conditional (Present/Future Hypothetical)</h4>
                    <p><strong>Formula:</strong> If + past simple, would + base verb</p>
                    <p><strong>Use for:</strong> Career advice, hypothetical job situations, dreams</p>
                    <p><strong>Special:</strong> Use 'were' for all subjects (If I were you...)</p>
                    <p><strong>Example:</strong> If I spoke Spanish, I would apply for that job.</p>
                </div>

                <div style="background: rgba(14, 165, 233, 0.15); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 4px solid #0ea5e9;">
                    <h4 style="color: #0ea5e9; margin-top: 0;">Third Conditional (Past Reflection)</h4>
                    <p><strong>Formula:</strong> If + past perfect, would have + past participle</p>
                    <p><strong>Use for:</strong> Past regrets, lessons learned, missed opportunities</p>
                    <p><strong>Structure:</strong> had + past participle → would have + past participle</p>
                    <p><strong>Example:</strong> If I had asked about benefits, I would have known about the 401k.</p>
                </div>

                <h3>Quick Decision Guide</h3>
                <ul>
                    <li><strong>Present/Future imaginary?</strong> → Second (past + would)</li>
                    <li><strong>Past reflection/regret?</strong> → Third (past perfect + would have)</li>
                    <li><strong>Giving advice now?</strong> → Second (If I were you...)</li>
                    <li><strong>Learning from past?</strong> → Third (If I had known...)</li>
                </ul>

                <h3>All Four Conditionals at a Glance</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Type</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Formula</th>
                            <th style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Use</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Zero</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">present + present</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Policies, rules</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">First</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">present + will</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Real future plans</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Second</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">past + would</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Present hypothetical, advice</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Third</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">past perfect + would have</td>
                            <td style="padding: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">Past regrets, lessons</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ Using 'would' in IF clause → ✅ Use past simple or past perfect</li>
                    <li>❌ Using 'was' instead of 'were' → ✅ Always use 'were' in second conditional</li>
                    <li>❌ Mixing timeframes → ✅ Keep consistent (present OR past)</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Second = imagining NOW/FUTURE (past form, would). Third = reflecting on PAST (past perfect, would have). Don't mix them!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is the formula for second conditional?",
            options: [
                { value: "a", label: "If + past simple, would + base verb" },
                { value: "b", label: "If + present, will + base verb" },
                { value: "c", label: "If + past perfect, would have + verb" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional uses: If + past simple, would + base verb for present/future hypothetical situations.",
        },
        {
            id: "quiz-2",
            question: "What is the formula for third conditional?",
            options: [
                { value: "a", label: "If + past simple, would + verb" },
                { value: "b", label: "If + past perfect, would have + past participle" },
                { value: "c", label: "If + present, will + verb" },
            ],
            correctAnswer: "b",
            explanation: "Third conditional uses: If + past perfect, would have + past participle for past reflections.",
        },
        {
            id: "quiz-3",
            question: "Which form is correct for giving advice?",
            options: [
                { value: "a", label: "If I were you, I would ask for a raise." },
                { value: "b", label: "If I was you, I would ask for a raise." },
                { value: "c", label: "If I am you, I would ask for a raise." },
            ],
            correctAnswer: "a",
            explanation: "Always use 'were' (not 'was') in second conditional: If I were you...",
        },
        {
            id: "quiz-4",
            question: "Complete: 'If I _____ Spanish, I would apply for that position.'",
            options: [
                { value: "a", label: "speak" },
                { value: "b", label: "spoke" },
                { value: "c", label: "had spoken" },
            ],
            correctAnswer: "b",
            explanation: "Second conditional uses past simple in IF clause: If I spoke...",
        },
        {
            id: "quiz-5",
            question: "Complete: 'If I _____ about the benefits, I would have known about the 401k.'",
            options: [
                { value: "a", label: "asked" },
                { value: "b", label: "had asked" },
                { value: "c", label: "would have asked" },
            ],
            correctAnswer: "b",
            explanation: "Third conditional uses past perfect in IF clause: If I had asked...",
        },
        {
            id: "quiz-6",
            question: "Which sentence is second conditional (present/future hypothetical)?",
            options: [
                { value: "a", label: "If I had better skills, I would get promoted." },
                { value: "b", label: "If I have better skills, I will get promoted." },
                { value: "c", label: "If I had had better skills, I would have gotten promoted." },
            ],
            correctAnswer: "a",
            explanation: "Second conditional: If + past (had), would + verb (would get).",
        },
        {
            id: "quiz-7",
            question: "Which sentence is third conditional (past reflection)?",
            options: [
                { value: "a", label: "If I researched the company, I would ask better questions." },
                { value: "b", label: "If I had researched the company, I would have asked better questions." },
                { value: "c", label: "If I research the company, I will ask better questions." },
            ],
            correctAnswer: "b",
            explanation: "Third conditional: If + past perfect (had researched), would have + past participle (would have asked).",
        },
        {
            id: "quiz-8",
            question: "When do you use second conditional?",
            options: [
                { value: "a", label: "For present/future hypothetical situations and advice" },
                { value: "b", label: "For past regrets and reflections" },
                { value: "c", label: "For real future possibilities" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional is for present/future hypothetical situations, advice, and dreams.",
        },
        {
            id: "quiz-9",
            question: "When do you use third conditional?",
            options: [
                { value: "a", label: "For giving advice now" },
                { value: "b", label: "For past regrets, lessons learned, and 'what could have been'" },
                { value: "c", label: "For company policies" },
            ],
            correctAnswer: "b",
            explanation: "Third conditional is for reflecting on the past - regrets, lessons learned, missed opportunities.",
        },
        {
            id: "quiz-10",
            question: "Complete: 'If I had left earlier, I _____ the bus.'",
            options: [
                { value: "a", label: "would catch" },
                { value: "b", label: "would have caught" },
                { value: "c", label: "will catch" },
            ],
            correctAnswer: "b",
            explanation: "Third conditional result clause uses would have + past participle: would have caught.",
        },
        {
            id: "quiz-11",
            question: "Which sentence is wrong because it uses 'would' in the IF clause?",
            options: [
                { value: "a", label: "If I had better skills, I would get promoted." },
                { value: "b", label: "If I would have better skills, I would get promoted." },
                { value: "c", label: "If I were you, I would ask for a raise." },
            ],
            correctAnswer: "b",
            explanation: "Never use 'would' in the IF clause. Use past simple: If I had...",
        },
        {
            id: "quiz-12",
            question: "Choose the correct sentence with 'were'.",
            options: [
                { value: "a", label: "If she were the manager, she would change things." },
                { value: "b", label: "If she was the manager, she would change things." },
                { value: "c", label: "If she is the manager, she would change things." },
            ],
            correctAnswer: "a",
            explanation: "Use 'were' for all subjects in second conditional: If she were...",
        },
        {
            id: "quiz-13",
            question: "Complete: 'If I _____ you, I would negotiate the salary.'",
            options: [
                { value: "a", label: "am" },
                { value: "b", label: "was" },
                { value: "c", label: "were" },
            ],
            correctAnswer: "c",
            explanation: "Professional advice pattern uses 'were': If I were you...",
        },
        {
            id: "quiz-14",
            question: "What's the difference between 'If I spoke Spanish' and 'If I had spoken Spanish'?",
            options: [
                { value: "a", label: "First = present wish; Second = past regret" },
                { value: "b", label: "No difference - they mean the same" },
                { value: "c", label: "First = future; Second = present" },
            ],
            correctAnswer: "a",
            explanation: "Second conditional (spoke) is present wish. Third conditional (had spoken) is past regret.",
        },
        {
            id: "quiz-15",
            question: "Which sentence correctly reflects on a past job mistake?",
            options: [
                { value: "a", label: "If I read the email carefully, I wouldn't make that error." },
                { value: "b", label: "If I had read the email carefully, I wouldn't have made that error." },
                { value: "c", label: "If I would have read the email carefully, I wouldn't have made that error." },
            ],
            correctAnswer: "b",
            explanation: "Third conditional for past reflection: If + past perfect, would have + past participle.",
        },
    ],
};
