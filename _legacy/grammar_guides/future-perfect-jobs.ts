import type { InteractiveGuideContent } from "@/types/activity";

export const futurePerfectJobsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Future Perfect: Jobs - Goals & Planning",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Future Perfect helps you talk about your <strong>career goals</strong> and <strong>professional plans</strong>. It shows what you will have accomplished by a specific future date—perfect for job interviews, performance reviews, and career planning.</p>
                </div>

                <h3>Why This Matters at Work</h3>
                <p>When you're setting career goals, planning professional development, or interviewing for jobs, you need to talk about future accomplishments:</p>
                <ul>
                    <li>"By next year, I <strong>will have completed</strong> my certification."</li>
                    <li>"By the end of this month, I <strong>will have trained</strong> all new employees."</li>
                    <li>"Before my review, I <strong>will have finished</strong> the project."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">will have + past participle</p>
                    <p style="text-align: center; font-style: italic;">(Shows what will be COMPLETE by a future deadline)</p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>At work and in career planning:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Setting career milestones and professional goals</li>
                        <li>Planning training and certification completion</li>
                        <li>Discussing project deadlines and deliverables</li>
                        <li>Talking about work achievements in interviews</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Future Perfect = what you will have accomplished by then!</p>
                </div>
            `,
            exercises: [
                {
                    id: "future-perfect-jobs-intro-1",
                    title: "Practice: Understanding Career Goals",
                    instructions: "Identify what Future Perfect describes in career contexts.",
                    items: [
                        {
                            type: "radio",
                            label: '"By next year, I will have completed my certification."',
                            options: [
                                { value: "deadline", label: "Goal complete before a deadline (next year)" },
                                { value: "now", label: "Currently working on it" },
                                { value: "past", label: "Already finished" },
                            ],
                            expectedAnswer: "deadline",
                        },
                        {
                            type: "radio",
                            label: '"Before my performance review, I will have finished the project."',
                            options: [
                                { value: "complete", label: "Project done before the review" },
                                { value: "during", label: "Project happening during review" },
                                { value: "after", label: "Project done after review" },
                            ],
                            expectedAnswer: "complete",
                        },
                        {
                            type: "radio",
                            label: "What is the formula for Future Perfect?",
                            options: [
                                { value: "a", label: "will have + past participle" },
                                { value: "b", label: "have/has + past participle" },
                                { value: "c", label: "had + past participle" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "career-goals",
            stepNumber: 1,
            title: "Setting Career Goals & Milestones",
            icon: "🎯",
            explanation: `
                <h3>Using Future Perfect for Professional Goals</h3>
                <p>Future Perfect is essential when setting specific career goals with deadlines. It helps you communicate clear, measurable objectives.</p>

                <h3>Common Career Goal Patterns</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">By + future time, will have + past participle:</p>
                    <ul>
                        <li>By next June, I <strong>will have completed</strong> my forklift certification.</li>
                        <li>By the end of Q2, she <strong>will have finished</strong> the leadership training.</li>
                        <li>By 2027, they <strong>will have opened</strong> three new locations.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Before + event, will have + past participle:</p>
                    <ul>
                        <li>Before my review, I <strong>will have completed</strong> all my quarterly goals.</li>
                        <li>Before the new manager starts, we <strong>will have trained</strong> the entire team.</li>
                        <li>Before I apply for promotion, I <strong>will have gained</strong> two years of experience.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">By the time + event, will have + past participle:</p>
                    <ul>
                        <li>By the time I retire, I <strong>will have worked</strong> in healthcare for 30 years.</li>
                        <li>By the time the project ends, we <strong>will have trained</strong> 50 employees.</li>
                        <li>By the time she applies, she <strong>will have gained</strong> all required certifications.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Use Future Perfect to set clear, deadline-driven career goals. This shows employers you're organized and goal-oriented!",
            },
            exercises: [
                {
                    id: "career-goals-1",
                    title: "Practice: Career Goal Statements",
                    instructions: "Complete each career goal with future perfect form.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I _____ (complete) my CNA certification.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "Before my annual review, I _____ (finish) all my training modules.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "By the time I apply for supervisor, I _____ (gain) five years of experience.",
                            expectedAnswer: "will have gained",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct sentence:",
                            options: [
                                { value: "a", label: "By 2027, I will have earned my bachelor's degree." },
                                { value: "b", label: "By 2027, I will earn my bachelor's degree." },
                                { value: "c", label: "By 2027, I have earned my bachelor's degree." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "training-development",
            stepNumber: 2,
            title: "Training & Professional Development",
            icon: "📚",
            explanation: `
                <h3>Planning Training and Skill Development</h3>
                <p>Use Future Perfect to talk about training programs, certifications, and professional development you plan to complete by specific dates.</p>

                <h3>Training & Development Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Certifications and licenses:</p>
                    <ul>
                        <li>By next month, I <strong>will have completed</strong> my OSHA safety certification.</li>
                        <li>Before summer, she <strong>will have earned</strong> her CDL license.</li>
                        <li>By December, they <strong>will have finished</strong> the ServSafe training program.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Skills development:</p>
                    <ul>
                        <li>By the end of this quarter, I <strong>will have learned</strong> the new software system.</li>
                        <li>Before the busy season, we <strong>will have trained</strong> all seasonal staff.</li>
                        <li>By next year, he <strong>will have mastered</strong> three different production machines.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Professional courses:</p>
                    <ul>
                        <li>By graduation, I <strong>will have completed</strong> all my required nursing courses.</li>
                        <li>Before my promotion interview, I <strong>will have attended</strong> the leadership workshop.</li>
                        <li>By June, she <strong>will have taken</strong> every available management training class.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Professional Development Tip",
                content: "On your resume or in interviews, use Future Perfect to show your commitment to continuous learning and professional growth.",
            },
            exercises: [
                {
                    id: "training-development-1",
                    title: "Practice: Training Plans",
                    instructions: "Complete these training and development statements.",
                    items: [
                        {
                            type: "text",
                            label: "By next month, I _____ (complete) my forklift certification.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "Before the new system launches, all staff _____ (learn) how to use it.",
                            expectedAnswer: "will have learned",
                        },
                        {
                            type: "select",
                            label: "By graduation, she _____ all her required courses.",
                            options: ["complete", "will complete", "will have completed", "has completed"],
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "By the end of the year, I _____ (attend) five professional development workshops.",
                            expectedAnswer: "will have attended",
                        },
                    ],
                },
            ],
        },

        {
            id: "project-deadlines",
            stepNumber: 3,
            title: "Project Deadlines & Work Tasks",
            icon: "📋",
            explanation: `
                <h3>Managing Work Projects and Deadlines</h3>
                <p>Future Perfect helps you communicate about project completion and work tasks that will be finished by specific deadlines.</p>

                <h3>Project & Task Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Daily work tasks:</p>
                    <ul>
                        <li>By the end of my shift, I <strong>will have completed</strong> all my assigned orders.</li>
                        <li>Before the manager arrives, we <strong>will have cleaned</strong> the entire workspace.</li>
                        <li>By closing time, they <strong>will have restocked</strong> all the shelves.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Project milestones:</p>
                    <ul>
                        <li>By next Friday, the team <strong>will have finished</strong> the first phase of the project.</li>
                        <li>Before the inspection, we <strong>will have fixed</strong> all safety issues.</li>
                        <li>By the deadline, I <strong>will have submitted</strong> the complete report.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Long-term projects:</p>
                    <ul>
                        <li>By the end of Q4, we <strong>will have launched</strong> the new product line.</li>
                        <li>Before the grand opening, they <strong>will have hired</strong> and trained 20 employees.</li>
                        <li>By next year, the company <strong>will have expanded</strong> to five new cities.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Workplace Communication",
                content: "Using Future Perfect in work emails and meetings shows you understand deadlines and can plan effectively.",
            },
            exercises: [
                {
                    id: "project-deadlines-1",
                    title: "Practice: Work Deadlines",
                    instructions: "Complete these work-related deadline statements.",
                    items: [
                        {
                            type: "text",
                            label: "By 5 PM today, I _____ (finish) all customer orders.",
                            expectedAnswer: "will have finished",
                        },
                        {
                            type: "text",
                            label: "Before the meeting starts, we _____ (prepare) all the materials.",
                            expectedAnswer: "will have prepared",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct sentence:",
                            options: [
                                { value: "a", label: "By next month, the team will have completed the project." },
                                { value: "b", label: "By next month, the team will complete the project." },
                                { value: "c", label: "By next month, the team has completed the project." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "By the deadline, she _____ (submit) the quarterly report.",
                            expectedAnswer: "will have submitted",
                        },
                    ],
                },
            ],
        },

        {
            id: "interview-language",
            stepNumber: 4,
            title: "Using Future Perfect in Job Interviews",
            icon: "💬",
            explanation: `
                <h3>Professional Interview & Goal-Setting Language</h3>
                <p>Future Perfect makes you sound professional and goal-oriented in interviews. Use it to discuss your career plans and commitment to the role.</p>

                <h3>Common Interview Questions with Future Perfect</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"Where do you see yourself in one year?"</p>
                    <ul>
                        <li>"By next year, I <strong>will have mastered</strong> all aspects of this role."</li>
                        <li>"By then, I <strong>will have completed</strong> any required certifications for advancement."</li>
                        <li>"By my one-year anniversary, I <strong>will have become</strong> a valuable team member."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"What are your professional development goals?"</p>
                    <ul>
                        <li>"By the end of this year, I <strong>will have earned</strong> my CNA license."</li>
                        <li>"Before next summer, I <strong>will have completed</strong> the leadership training program."</li>
                        <li>"By 2027, I <strong>will have gained</strong> enough experience to move into management."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"Why should we hire you?"</p>
                    <ul>
                        <li>"By the end of my training period, I <strong>will have learned</strong> all your systems."</li>
                        <li>"Within six months, I <strong>will have proven</strong> my value to the team."</li>
                        <li>"By my first review, you <strong>will have seen</strong> consistent, quality work from me."</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin-top: 1.5rem;">
                    <h4 style="color: #d97757; margin-top: 0;">Compare These Answers:</h4>
                    <p><strong>Without Future Perfect (sounds vague):</strong></p>
                    <p>"I want to complete my certification. I hope to learn the systems."</p>
                    <p><strong>With Future Perfect (sounds professional and goal-oriented):</strong></p>
                    <p>"By next June, I <strong>will have completed</strong> my certification. By the end of my first month, I <strong>will have learned</strong> all your systems."</p>
                </div>
            `,
            tipBox: {
                title: "💡 Interview Pro Tip",
                content: "Using Future Perfect shows employers you're a planner who sets clear goals and meets deadlines—exactly what they want to hear!",
            },
            exercises: [
                {
                    id: "interview-language-1",
                    title: "Practice: Interview Responses",
                    instructions: "Complete these professional interview-style responses.",
                    items: [
                        {
                            type: "text",
                            label: "'By next year, I _____ (master) all aspects of this position.'",
                            expectedAnswer: "will have mastered",
                        },
                        {
                            type: "text",
                            label: "'Before my six-month review, I _____ (prove) my value to the team.'",
                            expectedAnswer: "will have proven",
                        },
                        {
                            type: "radio",
                            label: "Which response sounds most professional?",
                            options: [
                                { value: "a", label: "'By December, I will have completed my forklift certification.'" },
                                { value: "b", label: "'I want to complete my forklift certification soon.'" },
                                { value: "c", label: "'I might complete my forklift certification.'" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "'By the end of my training period, I _____ (learn) all your procedures.'",
                            expectedAnswer: "will have learned",
                        },
                    ],
                },
            ],
        },

        {
            id: "timeline-visualization",
            stepNumber: 5,
            title: "Career Timeline: Looking Ahead",
            icon: "⏰",
            explanation: `
                <h3>Understanding Your Career Timeline</h3>
                <p>Think of your career goals on a timeline moving from now (present) to future accomplishments.</p>

                <div style="background: white; border: 2px solid #d97757; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Example: Career Goal Timeline</h4>

                    <div style="display: flex; align-items: center; justify-content: space-around; position: relative; margin: 2rem 0;">
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 4px; background: linear-gradient(to right, #cbd5e1, #d97757, #7ba884); transform: translateY(-50%); z-index: 0;"></div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 70px; height: 70px; border-radius: 50%; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; border: 4px solid white; margin: 0 auto;">
                                NOW
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">Today</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #d97757; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(217, 119, 87, 0.3); margin: 0 auto; text-align: center; padding: 0.25rem;">
                                GOAL<br/>DONE
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #d97757; font-weight: 600;">Completed</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 90px; height: 90px; border-radius: 50%; background: #7ba884; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(123, 168, 132, 0.3); margin: 0 auto; text-align: center; padding: 0.25rem;">
                                BY<br/>THEN
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #7ba884; font-weight: 600;">Deadline</div>
                        </div>
                    </div>

                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>Example:</strong> I <span style="color: #d97757; font-weight: 600;">will have completed</span> my certification <span style="color: #7ba884; font-weight: 600;">by next June</span>.</p>
                    </div>
                </div>

                <h3>More Career Timeline Examples</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> NOW → Complete training → BY December (deadline)</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"By December, I <span style="color: #d97757;">will have finished</span> all my safety training."</p>
                </div>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> NOW → Gain experience → BY 2027 (deadline)</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"By 2027, I <span style="color: #d97757;">will have gained</span> five years of management experience."</p>
                </div>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> NOW → Complete project → BEFORE review (deadline)</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"Before my review, I <span style="color: #d97757;">will have completed</span> all my quarterly goals."</p>
                </div>
            `,
            tipBox: {
                title: "💡 The Key Difference",
                content: "Future Simple (will complete) = you'll do it at that time. Future Perfect (will have completed) = it'll be DONE BEFORE that time.",
            },
            exercises: [
                {
                    id: "timeline-1",
                    title: "Practice: Career Timeline",
                    instructions: "Use Future Perfect for goals with deadlines.",
                    items: [
                        {
                            type: "text",
                            label: "By next month, I _____ (complete) my forklift training.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "radio",
                            label: 'Which matches "finished before the deadline"?',
                            options: [
                                { value: "a", label: "By Friday, I will have finished the project." },
                                { value: "b", label: "On Friday, I will finish the project." },
                                { value: "c", label: "I finished the project on Friday." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "Before my interview, I _____ (practice) my answers.",
                            expectedAnswer: "will have practiced",
                        },
                    ],
                },
            ],
        },

        {
            id: "negative-questions",
            stepNumber: 6,
            title: "Negative Statements & Questions",
            icon: "❓",
            explanation: `
                <h3>Making Negatives with Future Perfect</h3>
                <p>Use <strong>won't have</strong> (will not have) + past participle to talk about goals you won't achieve by a certain deadline.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Negative Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">won't have (will not have) + past participle</p>
                </div>

                <h3>Negative Examples - Jobs & Career</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Realistic timelines:</p>
                    <ul>
                        <li>I <strong>won't have completed</strong> the certification by next month—it takes six months.</li>
                        <li>She <strong>won't have finished</strong> her training before the busy season starts.</li>
                        <li>They <strong>won't have hired</strong> all the positions by opening day.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Setting realistic expectations:</p>
                    <ul>
                        <li>We <strong>won't have launched</strong> the new system by Q1—we need more time for testing.</li>
                        <li>I <strong>won't have gained</strong> enough experience by then to apply for the manager position.</li>
                        <li>The team <strong>won't have finished</strong> the project by the original deadline.</li>
                    </ul>
                </div>

                <h3>Making Questions with Future Perfect</h3>
                <p>To ask about career goals and deadlines, use: <strong>Will + subject + have + past participle?</strong></p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(122, 143, 124, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Question Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">Will + subject + have + past participle?</p>
                </div>

                <h3>Question Examples - Work & Career</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <ul>
                        <li><strong>Will you have completed</strong> your training by next month?</li>
                        <li><strong>Will she have finished</strong> the project before her vacation?</li>
                        <li><strong>Will they have hired</strong> all the new staff by opening day?</li>
                        <li><strong>Will you have earned</strong> your certification by the end of the year?</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin-top: 1rem;">
                    <p style="margin: 0;"><strong>💡 Answering:</strong> "Yes, I will have." / "No, I won't have." / "Yes, I will have completed it by then."</p>
                </div>
            `,
            exercises: [
                {
                    id: "negative-questions-1",
                    title: "Practice: Negatives and Questions",
                    instructions: "Complete these negative statements and questions.",
                    items: [
                        {
                            type: "text",
                            label: "I _____ (not complete) my training by next month—it takes longer.",
                            expectedAnswer: "won't have completed",
                        },
                        {
                            type: "text",
                            label: "_____ you _____ (finish) the project before the deadline?",
                            expectedAnswer: "Will, have finished|Will,have finished",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct negative:",
                            options: [
                                { value: "a", label: "She won't have earned her license by summer." },
                                { value: "b", label: "She will haven't earned her license by summer." },
                                { value: "c", label: "She won't has earned her license by summer." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "_____ they _____ (hire) all positions by opening day?",
                            expectedAnswer: "Will, have hired|Will,have hired",
                        },
                    ],
                },
            ],
        },

        {
            id: "common-mistakes",
            stepNumber: 7,
            title: "Common Mistakes to Avoid",
            icon: "⚠️",
            explanation: `
                <h3>Mistake #1: Using Future Simple Instead of Future Perfect</h3>
                <ul>
                    <li>❌ "By next year, I <strong>will complete</strong> my certification." → ✅ "By next year, I <strong>will have completed</strong> my certification."</li>
                    <li>❌ "Before my review, I <strong>will finish</strong> the project." → ✅ "Before my review, I <strong>will have finished</strong> the project."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> "By" and "before" signal deadlines. Use Future Perfect to show completion before that deadline.</p>

                <h3>Mistake #2: Forgetting "Have" in Future Perfect</h3>
                <ul>
                    <li>❌ "I <strong>will completed</strong> my training by June." → ✅ "I <strong>will have completed</strong> my training by June."</li>
                    <li>❌ "She <strong>will earned</strong> her license by summer." → ✅ "She <strong>will have earned</strong> her license by summer."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> Future Perfect requires "will have," not just "will."</p>

                <h3>Mistake #3: Using Wrong Past Participle Form</h3>
                <ul>
                    <li>❌ "They will have <strong>finish</strong> the project." → ✅ "They will have <strong>finished</strong> the project."</li>
                    <li>❌ "I will have <strong>complete</strong> my certification." → ✅ "I will have <strong>completed</strong> my certification."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> After "will have," you need the past participle (finished, completed, earned), not the base form.</p>

                <h3>Mistake #4: Wrong Word Order in Questions</h3>
                <ul>
                    <li>❌ "You will have finished by Friday?" → ✅ "<strong>Will you have finished</strong> by Friday?"</li>
                    <li>❌ "She will have completed the training?" → ✅ "<strong>Will she have completed</strong> the training?"</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> In questions, 'Will' comes before the subject.</p>

                <h3>Mistake #5: Using Present Perfect Instead</h3>
                <ul>
                    <li>❌ "By next year, I <strong>have completed</strong> my degree." → ✅ "By next year, I <strong>will have completed</strong> my degree."</li>
                    <li>❌ "Before graduation, she <strong>has earned</strong> her license." → ✅ "Before graduation, she <strong>will have earned</strong> her license."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> For future goals with deadlines, use Future Perfect (will have), not Present Perfect (have/has).</p>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix the Mistakes",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'By next month, I will complete my training.'",
                            options: [
                                { value: "a", label: "By next month, I will have completed my training." },
                                { value: "b", label: "By next month, I will completing my training." },
                                { value: "c", label: "By next month, I have completed my training." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'She will have earn her certification by June.'",
                            options: [
                                { value: "a", label: "She will have earned her certification by June." },
                                { value: "b", label: "She will earned her certification by June." },
                                { value: "c", label: "She will have earn her certification by June." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'You will have finished the project by Friday?'",
                            options: [
                                { value: "a", label: "Will you have finished the project by Friday?" },
                                { value: "b", label: "You have will finished the project by Friday?" },
                                { value: "c", label: "Have you will finished the project by Friday?" },
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
                    id: "practice-ex-1",
                    title: "Exercise 1: Complete Career Goal Statements",
                    instructions: "Complete these sentences with future perfect.",
                    items: [
                        {
                            type: "text",
                            label: "By next year, I _____ (complete) my nursing degree.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "Before the busy season, we _____ (train) all new staff.",
                            expectedAnswer: "will have trained",
                        },
                        {
                            type: "select",
                            label: "By graduation, she _____ all her required courses.",
                            options: ["complete", "completed", "will have completed", "has completed"],
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "By December, I _____ (earn) my forklift certification.",
                            expectedAnswer: "will have earned",
                        },
                    ],
                },
                {
                    id: "practice-ex-2",
                    title: "Exercise 2: Negative Statements",
                    instructions: "Complete with future perfect negative (won't have).",
                    items: [
                        {
                            type: "text",
                            label: "I _____ (not finish) my training by next month—it takes six months.",
                            expectedAnswer: "won't have finished",
                        },
                        {
                            type: "text",
                            label: "She _____ (not gain) enough experience by then to apply for manager.",
                            expectedAnswer: "won't have gained",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct negative:",
                            options: [
                                { value: "a", label: "They won't have hired all positions by opening day." },
                                { value: "b", label: "They will haven't hired all positions by opening day." },
                                { value: "c", label: "They won't has hired all positions by opening day." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-3",
                    title: "Exercise 3: Career Planning Questions",
                    instructions: "Form questions with future perfect.",
                    items: [
                        {
                            type: "text",
                            label: "_____ you _____ (complete) your certification by June?",
                            expectedAnswer: "Will, have completed|Will,have completed",
                        },
                        {
                            type: "text",
                            label: "_____ she _____ (finish) the project before the deadline?",
                            expectedAnswer: "Will, have finished|Will,have finished",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question:",
                            options: [
                                { value: "a", label: "Will they have hired all staff by opening day?" },
                                { value: "b", label: "They will have hired all staff by opening day?" },
                                { value: "c", label: "Have they will hired all staff by opening day?" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-4",
                    title: "Exercise 4: Interview Responses",
                    instructions: "Complete these professional interview responses.",
                    items: [
                        {
                            type: "text",
                            label: "'By my six-month review, I _____ (prove) my value to the team.'",
                            expectedAnswer: "will have proven",
                        },
                        {
                            type: "text",
                            label: "'Before summer, I _____ (earn) my CDL license.'",
                            expectedAnswer: "will have earned",
                        },
                        {
                            type: "radio",
                            label: "Which response sounds most professional?",
                            options: [
                                { value: "a", label: "'By next year, I will have mastered all aspects of this role.'" },
                                { value: "b", label: "'Next year I will master all aspects of this role.'" },
                                { value: "c", label: "'I hope to master all aspects of this role next year.'" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-5",
                    title: "Exercise 5: Real Job Scenarios",
                    instructions: "Complete these realistic work situations.",
                    items: [
                        {
                            type: "text",
                            label: "By the end of my shift, I _____ (complete) all assigned tasks.",
                            expectedAnswer: "will have completed",
                        },
                        {
                            type: "text",
                            label: "Before the inspection, we _____ (fix) all safety issues.",
                            expectedAnswer: "will have fixed",
                        },
                        {
                            type: "select",
                            label: "By next quarter, the company _____ to five new locations.",
                            options: ["expand", "expanded", "will have expanded", "has expanded"],
                            expectedAnswer: "will have expanded",
                        },
                        {
                            type: "text",
                            label: "Before the grand opening, they _____ (hire) and _____ (train) 20 employees.",
                            expectedAnswer: "will have hired, will have trained|will have hired,will have trained",
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
                <h3>Future Perfect for Jobs & Career Goals - Summary</h3>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin: 1rem 0;">
                    <h4 style="margin-top: 0; color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757; margin: 0.5rem 0;">will have + past participle</p>
                    <p style="margin: 0;">Shows what career goals will be COMPLETE by a future deadline</p>
                </div>

                <h3>Common Uses at Work</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
                    <thead>
                        <tr style="background: rgba(200, 107, 81, 0.1);">
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Situation</th>
                            <th style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); text-align: left;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Career goals</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">By next year, I <strong>will have completed</strong> my certification.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Training plans</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Before summer, I <strong>will have finished</strong> the safety training.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Project deadlines</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">By Friday, we <strong>will have completed</strong> the project.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Interviews</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">By my first review, I <strong>will have proven</strong> my value.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Milestones</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">By 2027, I <strong>will have gained</strong> 10 years of experience.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Forms</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(122, 143, 124, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">Positive</h4>
                        <p style="margin: 0; font-size: 0.9rem;">I/you/he/she/we/they <strong>will have worked</strong></p>
                    </div>
                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #d97757; margin-top: 0;">Negative</h4>
                        <p style="margin: 0; font-size: 0.9rem;">I/you/he/she/we/they <strong>won't have worked</strong></p>
                    </div>
                    <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #b45309; margin-top: 0;">Question</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Will</strong> I/you/he/she/we/they <strong>have worked</strong>?</p>
                    </div>
                </div>

                <h3>Key Signal Words</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <ul style="columns: 2; margin: 0;">
                        <li><strong>by next year</strong></li>
                        <li><strong>before (deadline)</strong></li>
                        <li><strong>by the time</strong></li>
                        <li><strong>by then</strong></li>
                        <li><strong>by (date)</strong></li>
                        <li><strong>by my review</strong></li>
                        <li><strong>before graduation</strong></li>
                        <li><strong>by opening day</strong></li>
                    </ul>
                </div>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ Using future simple (will complete) instead of future perfect (will have completed) with "by" deadlines</li>
                    <li>❌ Forgetting "have" (will completed → will have completed)</li>
                    <li>❌ Using wrong past participle form (will have finish → will have finished)</li>
                    <li>❌ Wrong question word order (put 'Will' before subject)</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Future Perfect shows goals that will be COMPLETE by a deadline. Use it to show you're organized, goal-oriented, and deadline-aware!",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is future perfect used for in career contexts?",
            options: [
                { value: "a", label: "To show goals complete BEFORE a future deadline" },
                { value: "b", label: "To talk about current work" },
                { value: "c", label: "To describe past jobs" },
            ],
            correctAnswer: "a",
            explanation: "Future perfect shows career goals and accomplishments that will be complete by a specific future date.",
        },
        {
            id: "quiz-2",
            question: "What is the future perfect formula?",
            options: [
                { value: "a", label: "will + base verb" },
                { value: "b", label: "will have + past participle" },
                { value: "c", label: "have/has + past participle" },
            ],
            correctAnswer: "b",
            explanation: "Future perfect: will have + past participle (everyone uses 'will have')",
        },
        {
            id: "quiz-3",
            question: "Complete: 'By next year, I _____ my certification.'",
            options: [
                { value: "a", label: "will complete" },
                { value: "b", label: "will have completed" },
                { value: "c", label: "have completed" },
            ],
            correctAnswer: "b",
            explanation: "'By next year' signals a deadline. Use future perfect: will have completed.",
        },
        {
            id: "quiz-4",
            question: "Which word strongly signals Future Perfect?",
            options: [
                { value: "a", label: "every day" },
                { value: "b", label: "by (by next year, by June)" },
                { value: "c", label: "yesterday" },
            ],
            correctAnswer: "b",
            explanation: "'By' + future time signals a deadline—perfect for Future Perfect!",
        },
        {
            id: "quiz-5",
            question: "What's the negative form of 'I will have finished'?",
            options: [
                { value: "a", label: "I won't have finished" },
                { value: "b", label: "I will haven't finished" },
                { value: "c", label: "I won't has finished" },
            ],
            correctAnswer: "a",
            explanation: "Future perfect negative: won't have (will not have) + past participle",
        },
        {
            id: "quiz-6",
            question: "How do you form a future perfect question?",
            options: [
                { value: "a", label: "Will + subject + have + past participle" },
                { value: "b", label: "Have + subject + past participle" },
                { value: "c", label: "Subject + will have + past participle" },
            ],
            correctAnswer: "a",
            explanation: "Future perfect questions: Will + subject + have + past participle?",
        },
        {
            id: "quiz-7",
            question: "Complete: 'Before my interview, I _____ (practice) my answers.'",
            options: [
                { value: "a", label: "will practice" },
                { value: "b", label: "will have practiced" },
                { value: "c", label: "have practiced" },
            ],
            correctAnswer: "b",
            explanation: "'Before my interview' = deadline. Practice will be DONE before that point.",
        },
        {
            id: "quiz-8",
            question: "Which is correct?",
            options: [
                { value: "a", label: "By December, I will earn my license." },
                { value: "b", label: "By December, I will have earned my license." },
                { value: "c", label: "By December, I have earned my license." },
            ],
            correctAnswer: "b",
            explanation: "'By December' = deadline. Future Perfect shows license will be earned BEFORE December.",
        },
        {
            id: "quiz-9",
            question: "Fix the error: 'She will have complete her training by June.'",
            options: [
                { value: "a", label: "She will have completed her training by June." },
                { value: "b", label: "She will completed her training by June." },
                { value: "c", label: "She will have complete her training by June." },
            ],
            correctAnswer: "a",
            explanation: "After 'will have', use past participle: 'completed' not 'complete'.",
        },
        {
            id: "quiz-10",
            question: "Which sentence is best for a job interview?",
            options: [
                { value: "a", label: "'I will complete my certification soon.'" },
                { value: "b", label: "'By next June, I will have completed my certification.'" },
                { value: "c", label: "'I might complete my certification.'" },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect with a specific deadline shows you're organized and goal-oriented—perfect for interviews!",
        },
        {
            id: "quiz-11",
            question: "Complete: '_____ you _____ (finish) the project by Friday?'",
            options: [
                { value: "a", label: "Will, have finished" },
                { value: "b", label: "Have, finished" },
                { value: "c", label: "Did, finish" },
            ],
            correctAnswer: "a",
            explanation: "Future perfect question about deadline: Will + subject + have + past participle?",
        },
        {
            id: "quiz-12",
            question: "Which shows a career milestone?",
            options: [
                { value: "a", label: "I work here for 5 years." },
                { value: "b", label: "By next month, I will have worked here for 5 years." },
                { value: "c", label: "I worked here for 5 years last year." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect shows milestones: duration UP TO a future point.",
        },
        {
            id: "quiz-13",
            question: "Complete: 'By the end of my shift, I _____ (complete) all tasks.'",
            options: [
                { value: "a", label: "will complete" },
                { value: "b", label: "will have completed" },
                { value: "c", label: "completed" },
            ],
            correctAnswer: "b",
            explanation: "'By the end of my shift' = work deadline. Tasks will be DONE before shift ends.",
        },
        {
            id: "quiz-14",
            question: "What's the difference: 'I will finish AT 5' vs 'I will have finished BY 5'?",
            options: [
                { value: "a", label: "AT 5 = happens at that time; BY 5 = complete before that time" },
                { value: "b", label: "They mean the same thing" },
                { value: "c", label: "BY 5 is past tense" },
            ],
            correctAnswer: "a",
            explanation: "AT = when it happens. BY = when it's already done. Key difference for deadlines!",
        },
        {
            id: "quiz-15",
            question: "Which is correct for career planning?",
            options: [
                { value: "a", label: "By 2027, I will gain management experience." },
                { value: "b", label: "By 2027, I will have gained management experience." },
                { value: "c", label: "By 2027, I have gained management experience." },
            ],
            correctAnswer: "b",
            explanation: "Future Perfect for career goals with deadlines: will have gained (complete by 2027).",
        },
    ],
};
