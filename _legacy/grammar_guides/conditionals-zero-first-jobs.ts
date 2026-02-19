import type { InteractiveGuideContent } from "@/types/activity";

export const conditionalsZeroFirstJobsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Zero & First Conditionals: Jobs - Rules & Expectations",
            icon: "🏢",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">English has TWO types of conditionals for REAL situations at work: <strong>Zero Conditional</strong> for workplace policies and rules that are always true, and <strong>First Conditional</strong> for real future job scenarios and plans. Knowing which to use helps you sound professional and confident!</p>
                </div>

                <h3>The Big Difference</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e;">
                        <h4 style="color: #d97757; margin-top: 0;">Zero Conditional</h4>
                        <p><strong>Always true</strong> (policies, rules, procedures)</p>
                        <p style="font-weight: bold; color: #7ba884;">If + present, present</p>
                        <p style="margin: 0;">"If you clock in after 9:05 AM, the system <strong>marks</strong> you tardy."</p>
                    </div>
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <h4 style="color: #7ba884; margin-top: 0;">First Conditional</h4>
                        <p><strong>Future possibility</strong> (plans, predictions, requests)</p>
                        <p style="font-weight: bold; color: #7ba884;">If + present, will + verb</p>
                        <p style="margin: 0;">"If I finish my training next week, I <strong>will get</strong> a raise."</p>
                    </div>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>At work:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Understanding workplace policies and procedures (zero conditional)</li>
                        <li>Making job plans and future goals (first conditional)</li>
                        <li>Discussing safety rules and automatic processes</li>
                        <li>Planning for certifications, promotions, and schedule changes</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Zero = company rules. First = your future job plans!</p>
                </div>
            `,
            exercises: [
                {
                    id: "conditionals-intro-1",
                    title: "Practice: Zero vs First - Can You Tell the Difference?",
                    instructions: "Is each sentence talking about something always true (zero) or a future possibility (first)?",
                    items: [
                        {
                            type: "radio",
                            label: '"If you <span class=\'eg-verb\'>clock in</span> after 9:05 AM, the system <span class=\'eg-verb\'>marks</span> you tardy."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (company policy)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: '"If I <span class=\'eg-verb\'>finish</span> my training next week, I <span class=\'eg-helper\'>will</span> <span class=\'eg-verb\'>get</span> a raise."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true" },
                                { value: "first", label: "First conditional - future possibility (specific job plan)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: '"If inventory <span class=\'eg-verb\'>drops</span> below 50 units, the system <span class=\'eg-verb\'>sends</span> an alert."',
                            options: [
                                { value: "zero", label: "Zero conditional - always true (automatic process)" },
                                { value: "first", label: "First conditional - future possibility" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
            ],
        },

        {
            id: "zero-conditional",
            stepNumber: 1,
            title: "Zero Conditional: Workplace Rules & Policies",
            icon: "📋",
            explanation: `
                <h3>When to Use Zero Conditional at Work</h3>
                <p>Use zero conditional for things that are <strong>always true</strong> at your workplace:</p>
                <ul>
                    <li><strong>Company policies:</strong> "If you miss 3 shifts without notice, you receive a written warning."</li>
                    <li><strong>Safety procedures:</strong> "If you don't wear safety gear, you can't enter the warehouse."</li>
                    <li><strong>Automatic processes:</strong> "If inventory runs low, the system sends an alert."</li>
                    <li><strong>General rules:</strong> "If employees submit timesheets late, payroll processes them next cycle."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">If + present simple, present simple</p>
                    <p style="text-align: center; font-style: italic;">(Both clauses use present simple!)</p>
                </div>

                <h3>Examples from the Workplace</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Company policies:</p>
                    <ul>
                        <li>If you <strong>clock in</strong> after 9:05 AM, the system <strong>marks</strong> you tardy.</li>
                        <li>If an employee <strong>calls in</strong> sick, they <strong>provide</strong> a doctor's note.</li>
                        <li>If you <strong>miss</strong> 3 shifts without notice, you <strong>receive</strong> a warning.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Safety procedures:</p>
                    <ul>
                        <li>If you <strong>don't wear</strong> safety gear, you <strong>can't enter</strong> the warehouse.</li>
                        <li>If the fire alarm <strong>sounds</strong>, everyone <strong>exits</strong> through the nearest door.</li>
                        <li>If equipment <strong>malfunctions</strong>, workers <strong>report</strong> it immediately.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Automatic systems & processes:</p>
                    <ul>
                        <li>If inventory <strong>drops</strong> below 50 units, the system <strong>sends</strong> a restock alert.</li>
                        <li>If you <strong>submit</strong> your timesheet late, payroll <strong>processes</strong> it next cycle.</li>
                        <li>If the cash register <strong>doesn't balance</strong>, the manager <strong>investigates</strong>.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Customer service policies:</p>
                    <ul>
                        <li>If a customer <strong>returns</strong> an item without a receipt, they <strong>get</strong> store credit.</li>
                        <li>If someone <strong>has</strong> a complaint, we <strong>escalate</strong> it to a supervisor.</li>
                        <li>If the order <strong>isn't ready</strong>, we <strong>call</strong> the customer to notify them.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Zero conditional uses present simple in BOTH clauses. No 'will'! This shows the result ALWAYS happens based on company policy or procedure.",
            },
            exercises: [
                {
                    id: "zero-conditional-1",
                    title: "Practice: Build Zero Conditional Sentences",
                    instructions: "Complete each zero conditional sentence with the correct present simple form.",
                    items: [
                        {
                            type: "text",
                            label: "If you arrive late three times in one month, you _____ (receive) a written warning.",
                            expectedAnswer: "receive",
                        },
                        {
                            type: "text",
                            label: "If inventory drops below 50 units, the system _____ (send) an alert.",
                            expectedAnswer: "sends",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct zero conditional:",
                            options: [
                                { value: "a", label: "If employees don't wear uniforms, they can't work the floor." },
                                { value: "b", label: "If employees don't wear uniforms, they won't work the floor." },
                                { value: "c", label: "If employees won't wear uniforms, they can't work the floor." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "zero-conditional-2",
                    title: "Practice: Workplace Policies",
                    instructions: "Identify the zero conditional workplace rules.",
                    items: [
                        {
                            type: "radio",
                            label: "Which sentence describes a company policy (always true)?",
                            options: [
                                { value: "a", label: "If you submit your timesheet by Friday, payroll processes it on Monday." },
                                { value: "b", label: "If you submit your timesheet by Friday, payroll will process it on Monday." },
                                { value: "c", label: "If you will submit your timesheet by Friday, payroll processes it on Monday." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Complete the safety rule: If equipment malfunctions, workers _____ (report) it immediately.",
                            expectedAnswer: "report",
                        },
                    ],
                },
            ],
        },

        {
            id: "first-conditional",
            stepNumber: 2,
            title: "First Conditional: Future Job Scenarios",
            icon: "🎯",
            explanation: `
                <h3>When to Use First Conditional at Work</h3>
                <p>Use first conditional for <strong>real future possibilities</strong> in your job:</p>
                <ul>
                    <li><strong>Job plans:</strong> "If I apply for the supervisor position, I will get an interview."</li>
                    <li><strong>Project deadlines:</strong> "If the schedule changes, I will notify my team."</li>
                    <li><strong>Training & certifications:</strong> "If I complete the training, I will qualify for a promotion."</li>
                    <li><strong>Schedule requests:</strong> "If I request Friday off, my boss will approve it."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(110, 145, 118, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">If + present simple, will + base verb</p>
                    <p style="text-align: center; font-style: italic;">(IF clause = present, RESULT clause = will + verb)</p>
                </div>

                <h3>Examples from Your Job</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Job applications & interviews:</p>
                    <ul>
                        <li>If I <strong>apply</strong> for the supervisor position, I <strong>will get</strong> an interview.</li>
                        <li>If she <strong>updates</strong> her resume, she <strong>will have</strong> better chances.</li>
                        <li>If we <strong>ask</strong> for references, they <strong>will provide</strong> them.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Project deadlines & deliverables:</p>
                    <ul>
                        <li>If the project <strong>finishes</strong> on time, we <strong>will meet</strong> our deadline.</li>
                        <li>If I <strong>work</strong> overtime this week, I <strong>will complete</strong> the order.</li>
                        <li>If the client <strong>approves</strong> the proposal, we <strong>will start</strong> Monday.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Training & promotions:</p>
                    <ul>
                        <li>If I <strong>finish</strong> my training next week, I <strong>will get</strong> a $2 raise.</li>
                        <li>If you <strong>complete</strong> the certification, you <strong>will qualify</strong> for the promotion.</li>
                        <li>If he <strong>passes</strong> the forklift test, he <strong>will work</strong> in the warehouse.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Schedule changes & requests:</p>
                    <ul>
                        <li>If the schedule <strong>changes</strong>, I <strong>will notify</strong> my team immediately.</li>
                        <li>If I <strong>request</strong> Friday off, my boss <strong>will probably approve</strong> it.</li>
                        <li>If we <strong>don't get</strong> enough staff, I <strong>will work</strong> a double shift.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "First conditional uses will + verb in the result clause (not present simple). This shows it's a FUTURE job plan or possibility, not a rule that always happens.",
            },
            exercises: [
                {
                    id: "first-conditional-1",
                    title: "Practice: Build First Conditional Sentences",
                    instructions: "Complete each first conditional sentence with will + base verb.",
                    items: [
                        {
                            type: "select",
                            label: "If I apply for the supervisor position, I _____ an interview.",
                            options: ["get", "will get", "got", "am getting"],
                            expectedAnswer: "will get",
                        },
                        {
                            type: "text",
                            label: "If the schedule changes tomorrow, I _____ (will notify) my team.",
                            expectedAnswer: "will notify",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct first conditional:",
                            options: [
                                { value: "a", label: "If I complete the training, I will qualify for the promotion." },
                                { value: "b", label: "If I complete the training, I qualify for the promotion." },
                                { value: "c", label: "If I will complete the training, I will qualify for the promotion." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "first-conditional-2",
                    title: "Practice: Future Job Plans",
                    instructions: "Complete the sentences about future work scenarios.",
                    items: [
                        {
                            type: "text",
                            label: "If the client approves the proposal, we _____ (will start) the project Monday.",
                            expectedAnswer: "will start",
                        },
                        {
                            type: "select",
                            label: "If I finish my certification, I _____ a raise.",
                            options: ["get", "will get", "got", "getting"],
                            expectedAnswer: "will get",
                        },
                    ],
                },
            ],
        },

        {
            id: "modal-variations",
            stepNumber: 3,
            title: "Using Other Modals (Not Just 'Will')",
            icon: "🔧",
            explanation: `
                <h3>You Can Use Other Modals Instead of "Will"</h3>
                <p>While "will" is most common in first conditional, you can also use can, may, might, should, or imperatives in the result clause to express different meanings.</p>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Can (ability/possibility):</h4>
                    <ul>
                        <li>If I improve my English skills, <strong>I can apply</strong> for management positions.</li>
                        <li>If you finish early, <strong>you can leave</strong> at 4pm.</li>
                        <li>If we meet our sales goal, <strong>we can earn</strong> a bonus.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>May/Might (less certain):</h4>
                    <ul>
                        <li>If I ask for flexible hours, my boss <strong>might approve</strong> it. (less certain than "will")</li>
                        <li>If you apply for the position, you <strong>may get</strong> an interview.</li>
                        <li>If the project finishes early, <strong>we might have</strong> extra budget.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Should (advice/expectation):</h4>
                    <ul>
                        <li>If you have a workplace injury, <strong>you should report</strong> it immediately.</li>
                        <li>If the machine breaks again, <strong>we should call</strong> maintenance.</li>
                        <li>If I'm running late, <strong>I should text</strong> my supervisor.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Must (strong necessity):</h4>
                    <ul>
                        <li>If you work with chemicals, <strong>you must wear</strong> protective gloves.</li>
                        <li>If the deadline is Friday, <strong>we must finish</strong> by Thursday.</li>
                        <li>If they promote you to supervisor, <strong>you must complete</strong> management training.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <h4>Imperative (command/strong suggestion):</h4>
                    <ul>
                        <li>If the fire alarm sounds, <strong>exit</strong> through the nearest door.</li>
                        <li>If you see a safety hazard, <strong>report</strong> it to your manager.</li>
                        <li>If the customer is upset, <strong>call</strong> a supervisor immediately.</li>
                    </ul>
                </div>
            `,
            exercises: [
                {
                    id: "modals-1",
                    title: "Practice: Choose the Right Modal",
                    instructions: "Choose the best modal for each workplace situation.",
                    items: [
                        {
                            type: "radio",
                            label: "Complete: 'If I improve my computer skills, I _____ apply for office jobs.'",
                            options: [
                                { value: "a", label: "can apply (ability/possibility)" },
                                { value: "b", label: "must apply (strong necessity)" },
                                { value: "c", label: "apply (no modal needed)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If you have a workplace injury, you _____ report it immediately.'",
                            options: [
                                { value: "a", label: "should report (advice/strong expectation)" },
                                { value: "b", label: "might report (uncertain)" },
                                { value: "c", label: "report (imperative)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Complete: 'If the fire alarm sounds, _____ through the nearest exit.'",
                            options: [
                                { value: "a", label: "exit (imperative - strong command)" },
                                { value: "b", label: "you will exit" },
                                { value: "c", label: "you might exit" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 4,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using "will" in the IF clause</h3>
                <ul>
                    <li>❌ "If I <strong>will apply</strong> for the job, I will get an interview." → ✅ "If I <strong>apply</strong> for the job, I will get an interview."</li>
                    <li>❌ "If the schedule <strong>will change</strong>, I will notify my team." → ✅ "If the schedule <strong>changes</strong>, I will notify my team."</li>
                </ul>

                <h3>Mistake #2: Forgetting the comma (when IF is first)</h3>
                <ul>
                    <li>❌ "If I finish training I will get a raise." → ✅ "If I finish training<strong>,</strong> I will get a raise."</li>
                    <li>❌ "If you clock in late the system marks you tardy." → ✅ "If you clock in late<strong>,</strong> the system marks you tardy."</li>
                </ul>

                <h3>Mistake #3: Confusing zero and first conditional</h3>
                <ul>
                    <li>❌ "If you submit timesheets late, payroll <strong>will process</strong> them next cycle." (This is a policy - use zero!)</li>
                    <li>✅ "If you submit timesheets late, payroll <strong>processes</strong> them next cycle." (Always true = zero conditional)</li>
                    <li>✅ "If you submit your timesheet late this week, payroll <strong>will process</strong> it next cycle." (Specific future = first conditional)</li>
                </ul>

                <h3>Mistake #4: Wrong tense in result clause</h3>
                <ul>
                    <li>❌ "If I apply for the job, I <strong>applied</strong>..." → ✅ "If I apply for the job, I <strong>will get</strong> an interview."</li>
                    <li>❌ "If the project finishes, we <strong>met</strong> the deadline." → ✅ "If the project finishes, we <strong>will meet</strong> the deadline."</li>
                </ul>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix Common Mistakes",
                    instructions: "Choose the correct sentence that fixes the mistake.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I will complete the training, I will get promoted.'",
                            options: [
                                { value: "a", label: "If I complete the training, I will get promoted." },
                                { value: "b", label: "If I will complete the training, I get promoted." },
                                { value: "c", label: "If I completed the training, I will get promoted." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix the comma: 'If you arrive late three times you receive a warning.'",
                            options: [
                                { value: "a", label: "If you arrive late three times, you receive a warning." },
                                { value: "b", label: "You receive a warning if you arrive late three times." },
                                { value: "c", label: "Both a and b are correct" },
                            ],
                            expectedAnswer: "c",
                        },
                        {
                            type: "radio",
                            label: "Which is correct for a company policy (always true)?",
                            options: [
                                { value: "a", label: "If inventory drops below 50, the system sends an alert." },
                                { value: "b", label: "If inventory drops below 50, the system will send an alert." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "decision-flowchart",
            stepNumber: 5,
            title: "Decision Tool: Zero or First?",
            icon: "🎯",
            explanation: `
                <h3>How to Choose Between Zero and First Conditional</h3>
                <p>Ask yourself this question:</p>

                <div style="background: white; padding: 2rem; border-radius: 0.5rem; border: 2px solid rgba(200, 107, 81, 0.3); margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #f4d35e;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Is it a COMPANY POLICY or RULE that's ALWAYS true?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>ZERO conditional</strong> (present + present)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If you clock in late, the system marks you tardy." (Always happens)</p>
                    </div>

                    <p style="text-align: center; font-weight: bold; margin: 1rem 0;">↓ NO? Then ask...</p>

                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #7ba884;">
                        <p style="font-weight: bold; margin-bottom: 0.5rem;">Is it a REAL FUTURE PLAN or POSSIBILITY at work?</p>
                        <p style="margin: 0;">✓ YES → Use <strong>FIRST conditional</strong> (present + will)</p>
                        <p style="margin: 0.5rem 0 0 1rem; font-style: italic;">Example: "If I finish training next week, I will get a raise." (Specific future plan)</p>
                    </div>
                </div>

                <h3>Quick Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Situation</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Question</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Answer → Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Tardiness policy</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true rule?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Zero</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Planning to apply for a job</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Future possibility?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → First</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Safety procedure</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Always true rule?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → Zero</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Requesting time off next week</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Future possibility?</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">YES → First</td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "decision-1",
                    title: "Practice: Use the Decision Tool",
                    instructions: "Decide whether to use zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "Company dress code policy (always enforced):",
                            options: [
                                { value: "zero", label: "Zero (always true rule)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "Your plan to ask for a raise next month:",
                            options: [
                                { value: "zero", label: "Zero (always true rule)" },
                                { value: "first", label: "First (real future plan)" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "Automatic inventory alert system:",
                            options: [
                                { value: "zero", label: "Zero (always happens automatically)" },
                                { value: "first", label: "First (future possibility)" },
                            ],
                            expectedAnswer: "zero",
                        },
                    ],
                },
            ],
        },

        {
            id: "comparison",
            stepNumber: 6,
            title: "Zero vs First: Side-by-Side",
            icon: "🔄",
            explanation: `
                <h3>The Same Situation, Different Meanings</h3>
                <p>Sometimes you can use EITHER zero or first conditional for similar work situations, but the meaning changes:</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #d97757;">Zero (Always True Policy)</h4>
                        <p style="font-weight: bold;">"If you submit timesheets late, payroll processes them next cycle."</p>
                        <p style="margin: 0;">Meaning: This is the company policy. Every time anyone submits late, this always happens.</p>
                    </div>
                    <div style="background: rgba(122, 143, 124, 0.15); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884;">First (Your Specific Future Plan)</h4>
                        <p style="font-weight: bold;">"If I submit my timesheet late this week, payroll will process it next cycle."</p>
                        <p style="margin: 0;">Meaning: This is about me specifically this week. I'm predicting what will happen to my timesheet.</p>
                    </div>
                </div>

                <h3>More Job Examples</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">Zero (Policy/Always)</th>
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid rgba(0,0,0,0.1);">First (Your Future Plan)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If employees arrive late, they <strong>clock in</strong> through the manager's system.<br/><em>(company policy)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I arrive late tomorrow, I <strong>will clock in</strong> through the manager's system.<br/><em>(my specific plan for tomorrow)</em></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you pass the certification test, you <strong>get</strong> a raise.<br/><em>(company policy - always happens)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I pass the certification test next month, I <strong>will get</strong> a raise.<br/><em>(my specific future goal)</em></td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the register doesn't balance, the manager <strong>investigates</strong>.<br/><em>(standard procedure)</em></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If the register doesn't balance tonight, the manager <strong>will investigate</strong>.<br/><em>(prediction for tonight)</em></td>
                        </tr>
                    </tbody>
                </table>
            `,
            exercises: [
                {
                    id: "comparison-1",
                    title: "Practice: Choose the Right Meaning",
                    instructions: "Based on what you want to express, choose zero or first conditional.",
                    items: [
                        {
                            type: "radio",
                            label: "You want to state a company policy that's always true:",
                            options: [
                                { value: "zero", label: "Zero: 'If employees miss 3 shifts, they receive a warning.'" },
                                { value: "first", label: "First: 'If employees miss 3 shifts, they will receive a warning.'" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "You're making a specific plan for next week:",
                            options: [
                                { value: "zero", label: "Zero: 'If I apply for the job next week, I get an interview.'" },
                                { value: "first", label: "First: 'If I apply for the job next week, I will get an interview.'" },
                            ],
                            expectedAnswer: "first",
                        },
                        {
                            type: "radio",
                            label: "You're describing an automatic system process:",
                            options: [
                                { value: "zero", label: "Zero: 'If inventory drops below 50, the system sends an alert.'" },
                                { value: "first", label: "First: 'If inventory drops below 50, the system will send an alert.'" },
                            ],
                            expectedAnswer: "zero",
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
                    title: "Exercise 1: Complete Zero Conditional",
                    instructions: "Use present simple in both clauses for workplace policies.",
                    items: [
                        {
                            type: "text",
                            label: "If you _____ (work) overtime, you _____ (receive) time-and-a-half pay.",
                            expectedAnswer: "work, receive|work,receive",
                        },
                        {
                            type: "select",
                            label: "If the fire alarm goes off, everyone _____ immediately.",
                            options: ["exits", "will exit", "exited", "exit"],
                            expectedAnswer: "exits",
                        },
                    ],
                },
                {
                    id: "practice-ex-2",
                    title: "Exercise 2: Complete First Conditional",
                    instructions: "Use will + base verb for future job plans.",
                    items: [
                        {
                            type: "select",
                            label: "If I complete the training program, I _____ for a promotion.",
                            options: ["qualify", "will qualify", "qualified", "am qualifying"],
                            expectedAnswer: "will qualify",
                        },
                        {
                            type: "text",
                            label: "If the client approves the proposal, we _____ (will start) the project Monday.",
                            expectedAnswer: "will start",
                        },
                    ],
                },
                {
                    id: "practice-ex-3",
                    title: "Exercise 3: Zero or First?",
                    instructions: "Decide which conditional type to use.",
                    items: [
                        {
                            type: "radio",
                            label: "Company policy about uniforms:",
                            options: [
                                { value: "zero", label: "If you don't wear a uniform, you can't work the floor. (zero)" },
                                { value: "first", label: "If you don't wear a uniform, you won't work the floor. (first)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "Your plan to request time off:",
                            options: [
                                { value: "zero", label: "If I request Friday off, my boss approves it. (zero)" },
                                { value: "first", label: "If I request Friday off, my boss will approve it. (first)" },
                            ],
                            expectedAnswer: "first",
                        },
                    ],
                },
                {
                    id: "practice-ex-4",
                    title: "Exercise 4: Fix the Mistakes",
                    instructions: "Choose the correct version.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'If I will finish the project, I will get a bonus.'",
                            options: [
                                { value: "a", label: "If I finish the project, I will get a bonus." },
                                { value: "b", label: "If I finish the project, I get a bonus." },
                                { value: "c", label: "If I finished the project, I will get a bonus." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which shows a company policy (always true)?",
                            options: [
                                { value: "a", label: "If you clock in late, the system marks you tardy." },
                                { value: "b", label: "If you clock in late, the system will mark you tardy." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-5",
                    title: "Exercise 5: Modal Variations",
                    instructions: "Choose the best modal for the workplace situation.",
                    items: [
                        {
                            type: "select",
                            label: "If I improve my skills, I _____ apply for better positions.",
                            options: ["will", "can", "must", "should"],
                            expectedAnswer: "can",
                        },
                        {
                            type: "radio",
                            label: "Safety rule (strong command):",
                            options: [
                                { value: "a", label: "If you see a hazard, report it immediately." },
                                { value: "b", label: "If you see a hazard, you will report it immediately." },
                                { value: "c", label: "If you see a hazard, you might report it immediately." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-6",
                    title: "Exercise 6: Word Order & Commas",
                    instructions: "Choose the sentence with correct punctuation.",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correctly punctuated (IF first)?",
                            options: [
                                { value: "a", label: "If I apply for the job, I will get an interview." },
                                { value: "b", label: "If I apply for the job I will get an interview." },
                                { value: "c", label: "If I apply for the job. I will get an interview." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which is correctly punctuated (result first)?",
                            options: [
                                { value: "a", label: "I will get an interview, if I apply for the job." },
                                { value: "b", label: "I will get an interview if I apply for the job." },
                                { value: "c", label: "I will get an interview. If I apply for the job." },
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
                <h3>Side-by-Side Comparison</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);"></th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);">Zero Conditional</th>
                            <th style="padding: 1rem; border: 1px solid rgba(0,0,0,0.1);">First Conditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Formula</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + present, <strong>present</strong></td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If + present, <strong>will + verb</strong></td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">When</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Company policies, rules, procedures</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Real future job plans</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Example</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If you clock in late, the system <strong>marks</strong> you tardy.</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">If I finish training, I <strong>will get</strong> a raise.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); font-weight: bold;">Time</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Any time / always</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Specific future time</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Common Uses at Work</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div>
                        <h4 style="color: #d97757;">Zero Conditional For:</h4>
                        <ul>
                            <li>Company policies</li>
                            <li>Safety procedures</li>
                            <li>Automatic systems</li>
                            <li>Performance standards</li>
                            <li>Customer service rules</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color: #7ba884;">First Conditional For:</h4>
                        <ul>
                            <li>Job applications</li>
                            <li>Training & certifications</li>
                            <li>Promotions & raises</li>
                            <li>Project deadlines</li>
                            <li>Schedule requests</li>
                        </ul>
                    </div>
                </div>

                <h3>Other Modals You Can Use (Instead of Will)</h3>
                <ul>
                    <li><strong>Can:</strong> If I improve my skills, I <strong>can</strong> apply for better jobs.</li>
                    <li><strong>May/Might:</strong> If I ask for time off, my boss <strong>might</strong> approve it.</li>
                    <li><strong>Should:</strong> If you're injured, you <strong>should</strong> report it immediately.</li>
                    <li><strong>Must:</strong> If you handle chemicals, you <strong>must</strong> wear gloves.</li>
                    <li><strong>Imperative:</strong> If the alarm sounds, <strong>exit</strong> immediately.</li>
                </ul>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ Using 'will' in IF clause → ✅ Use present simple in IF clause</li>
                    <li>❌ Forgetting comma when IF comes first → ✅ Always use comma after IF clause</li>
                    <li>❌ Using 'will' for policies → ✅ Use present simple for always-true rules</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Both use present simple in the IF clause! The difference is in the result clause: present simple (zero) for policies vs will + verb (first) for future plans.",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is the formula for zero conditional?",
            options: [
                { value: "a", label: "If + present, present" },
                { value: "b", label: "If + present, will + verb" },
                { value: "c", label: "If + past, would + verb" },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional uses present simple in both clauses for workplace policies and rules that are always true.",
        },
        {
            id: "quiz-2",
            question: "What is the formula for first conditional?",
            options: [
                { value: "a", label: "If + present, present" },
                { value: "b", label: "If + present, will + verb" },
                { value: "c", label: "If + past, would + verb" },
            ],
            correctAnswer: "b",
            explanation: "First conditional uses present simple in the IF clause and will + base verb in the result clause for future job plans.",
        },
        {
            id: "quiz-3",
            question: "Which sentence describes a company policy (zero conditional)?",
            options: [
                { value: "a", label: "If you clock in late, the system marks you tardy." },
                { value: "b", label: "If I clock in late tomorrow, the system will mark me tardy." },
                { value: "c", label: "If you clocked in late, the system would mark you tardy." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional (present + present) describes company policies that are always true.",
        },
        {
            id: "quiz-4",
            question: "Which sentence is correct first conditional?",
            options: [
                { value: "a", label: "If I finish training next week, I will get a raise." },
                { value: "b", label: "If I will finish training next week, I will get a raise." },
                { value: "c", label: "If I finish training next week, I get a raise." },
            ],
            correctAnswer: "a",
            explanation: "First conditional: IF clause uses present simple (finish), result uses will + verb (will get).",
        },
        {
            id: "quiz-5",
            question: "Which sentence is wrong because it uses 'will' in the IF clause?",
            options: [
                { value: "a", label: "If the project finishes on time, we will meet the deadline." },
                { value: "b", label: "If the project will finish on time, we will meet the deadline." },
                { value: "c", label: "If the project finishes on time, we meet the deadline." },
            ],
            correctAnswer: "b",
            explanation: "Never use 'will' in the IF clause. Use present simple: If the project finishes...",
        },
        {
            id: "quiz-6",
            question: "Complete: 'If you don't wear safety gear, you _____ enter the warehouse.'",
            options: [
                { value: "a", label: "can't" },
                { value: "b", label: "won't" },
                { value: "c", label: "didn't" },
            ],
            correctAnswer: "a",
            explanation: "This is a safety rule (zero conditional). Use present simple: can't enter.",
        },
        {
            id: "quiz-7",
            question: "Complete: 'If inventory drops below 50 units, the system _____ an alert.'",
            options: [
                { value: "a", label: "sends" },
                { value: "b", label: "will send" },
                { value: "c", label: "sent" },
            ],
            correctAnswer: "a",
            explanation: "This is an automatic process (zero conditional). Use present simple: sends.",
        },
        {
            id: "quiz-8",
            question: "What's the main difference between 'If you submit late, payroll processes it next cycle' and 'If I submit late this week, payroll will process it next cycle'?",
            options: [
                { value: "a", label: "No difference" },
                { value: "b", label: "First = policy (always); Second = specific future plan" },
                { value: "c", label: "First = policy (always); Second = impossible" },
            ],
            correctAnswer: "b",
            explanation: "Zero conditional (first sentence) describes a policy. First conditional (second sentence) is a specific future plan.",
        },
        {
            id: "quiz-9",
            question: "Which describes an always-true workplace rule?",
            options: [
                { value: "a", label: "If employees miss 3 shifts, they receive a warning." },
                { value: "b", label: "If I miss 3 shifts this month, I will receive a warning." },
                { value: "c", label: "If employees missed 3 shifts, they would receive a warning." },
            ],
            correctAnswer: "a",
            explanation: "Zero conditional describes workplace rules that are always true.",
        },
        {
            id: "quiz-10",
            question: "Which is correct first conditional for a future job plan?",
            options: [
                { value: "a", label: "If I apply for the job, I will get an interview." },
                { value: "b", label: "If I apply for the job, I get an interview." },
                { value: "c", label: "If I will apply for the job, I will get an interview." },
            ],
            correctAnswer: "a",
            explanation: "First conditional for future plans: If + present, will + verb.",
        },
        {
            id: "quiz-11",
            question: "Which modal is best for ability/possibility?",
            options: [
                { value: "a", label: "If I improve my skills, I can apply for better jobs." },
                { value: "b", label: "If I improve my skills, I must apply for better jobs." },
                { value: "c", label: "If I improve my skills, I should apply for better jobs." },
            ],
            correctAnswer: "a",
            explanation: "Use 'can' in the result clause for ability or possibility.",
        },
        {
            id: "quiz-12",
            question: "Where should the comma go when IF comes first?",
            options: [
                { value: "a", label: "After the IF clause: 'If I finish training, I will get a raise.'" },
                { value: "b", label: "No comma needed" },
                { value: "c", label: "After 'will'" },
            ],
            correctAnswer: "a",
            explanation: "When IF comes first, use a comma after the IF clause.",
        },
        {
            id: "quiz-13",
            question: "Which is correct for a safety command?",
            options: [
                { value: "a", label: "If the alarm sounds, exit immediately." },
                { value: "b", label: "If the alarm sounds, you will exit immediately." },
                { value: "c", label: "If the alarm sounds, you should exit immediately." },
            ],
            correctAnswer: "a",
            explanation: "Use imperative (command form) for strong safety instructions.",
        },
        {
            id: "quiz-14",
            question: "Which conditional do you use for company policies?",
            options: [
                { value: "a", label: "Zero conditional (present + present)" },
                { value: "b", label: "First conditional (present + will)" },
                { value: "c", label: "Second conditional (past + would)" },
            ],
            correctAnswer: "a",
            explanation: "Company policies that are always true use zero conditional.",
        },
        {
            id: "quiz-15",
            question: "Complete: 'If I complete the certification, I _____ for the promotion.'",
            options: [
                { value: "a", label: "will qualify" },
                { value: "b", label: "qualify" },
                { value: "c", label: "qualified" },
            ],
            correctAnswer: "a",
            explanation: "For a future job plan, use first conditional: will qualify.",
        },
    ],
};
