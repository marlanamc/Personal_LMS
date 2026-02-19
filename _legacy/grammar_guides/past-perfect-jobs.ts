import type { InteractiveGuideContent } from "@/types/activity";

export const pastPerfectJobsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Past Perfect: Jobs - Experience & Timelines",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">Past Perfect helps you talk about your <strong>work history</strong> and explain the <strong>sequence of events</strong> in your career. It shows what experience you had BEFORE you got a job, what training you completed BEFORE a promotion, or what skills you gained BEFORE a career change.</p>
                </div>

                <h3>Why This Matters at Work</h3>
                <p>When you're interviewing, writing a resume, or talking about your career, you need to show the ORDER of events:</p>
                <ul>
                    <li>"Before I started this job, I <strong>had worked</strong> in retail for 5 years."</li>
                    <li>"When I got promoted, I <strong>had completed</strong> all the required training."</li>
                    <li>"I <strong>had never used</strong> a computer before I started my office job."</li>
                </ul>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">had + past participle</p>
                    <p style="text-align: center; font-style: italic;">(Shows the EARLIER action in a sequence)</p>
                </div>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>At work and in interviews:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Describing your work history and career timeline</li>
                        <li>Explaining job transitions and promotions</li>
                        <li>Talking about training and certifications you completed</li>
                        <li>Showing your experience before getting hired</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💡 Past Perfect = what happened FIRST in your career story!</p>
                </div>
            `,
            exercises: [
                {
                    id: "past-perfect-jobs-intro-1",
                    title: "Practice: Which Happened First?",
                    instructions: "In each career story, identify which action happened FIRST.",
                    items: [
                        {
                            type: "radio",
                            label: '"Before I started this job, I had worked in retail for 5 years."',
                            options: [
                                { value: "worked", label: "Worked in retail (FIRST)" },
                                { value: "started", label: "Started this job (SECOND)" },
                            ],
                            expectedAnswer: "worked",
                        },
                        {
                            type: "radio",
                            label: '"When I got promoted, I had completed all the training."',
                            options: [
                                { value: "completed", label: "Completed training (FIRST)" },
                                { value: "promoted", label: "Got promoted (SECOND)" },
                            ],
                            expectedAnswer: "completed",
                        },
                        {
                            type: "radio",
                            label: '"I had never used a computer before I started my office job."',
                            options: [
                                { value: "never-used", label: "Never used computer (FIRST)" },
                                { value: "started", label: "Started office job (SECOND)" },
                            ],
                            expectedAnswer: "never-used",
                        },
                    ],
                },
            ],
        },

        {
            id: "work-experience",
            stepNumber: 1,
            title: "Talking About Work Experience",
            icon: "📋",
            explanation: `
                <h3>Using Past Perfect to Describe Your Career History</h3>
                <p>Past Perfect is essential when you need to explain your work background and show the sequence of jobs and experiences.</p>

                <h3>Common Patterns for Work History</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Before + past simple, past perfect:</p>
                    <ul>
                        <li>Before I <strong>started</strong> this job, I <strong>had worked</strong> in customer service.</li>
                        <li>Before she <strong>became</strong> a manager, she <strong>had been</strong> a team leader.</li>
                        <li>Before they <strong>hired</strong> me, I <strong>had completed</strong> my certification.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">When + past simple, past perfect:</p>
                    <ul>
                        <li>When I <strong>applied</strong> for this position, I <strong>had gained</strong> 10 years of experience.</li>
                        <li>When the opportunity <strong>came</strong>, I <strong>had already prepared</strong> my resume.</li>
                        <li>When he <strong>got</strong> the promotion, he <strong>had worked</strong> there for 5 years.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">By the time + past simple, past perfect:</p>
                    <ul>
                        <li>By the time I <strong>left</strong> that job, I <strong>had learned</strong> all the systems.</li>
                        <li>By the time she <strong>retired</strong>, she <strong>had trained</strong> 50 employees.</li>
                        <li>By 2020, I <strong>had gained</strong> 15 years of experience in construction.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Past perfect + because + past simple (explaining reasons):</p>
                    <ul>
                        <li>I <strong>had worked</strong> in restaurants, so I <strong>understood</strong> customer service.</li>
                        <li>She <strong>had managed</strong> teams before, so she <strong>was</strong> ready for the supervisor role.</li>
                        <li>They <strong>had hired</strong> me because I <strong>had completed</strong> the forklift certification.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Key Point",
                content: "Use Past Perfect to show what work experience or skills you ALREADY HAD when you started a new job, got promoted, or made a career change.",
            },
            exercises: [
                {
                    id: "work-experience-1",
                    title: "Practice: Complete Career Statements",
                    instructions: "Complete each sentence with the past perfect form.",
                    items: [
                        {
                            type: "text",
                            label: "Before I started this job, I _____ (work) in retail for 5 years.",
                            expectedAnswer: "had worked",
                        },
                        {
                            type: "text",
                            label: "When I applied for the supervisor position, I _____ (complete) leadership training.",
                            expectedAnswer: "had completed",
                        },
                        {
                            type: "text",
                            label: "By the time I left my last job, I _____ (learn) three different software systems.",
                            expectedAnswer: "had learned",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct sentence:",
                            options: [
                                { value: "a", label: "She got the promotion because she had worked hard all year." },
                                { value: "b", label: "She got the promotion because she worked hard all year." },
                                { value: "c", label: "She had got the promotion because she worked hard all year." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "career-transitions",
            stepNumber: 2,
            title: "Career Transitions & Job Changes",
            icon: "🔄",
            explanation: `
                <h3>Explaining Career Changes and New Opportunities</h3>
                <p>When you change jobs or careers, Past Perfect helps explain what led to the change and what experience you brought with you.</p>

                <h3>Career Change Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Switching industries:</p>
                    <ul>
                        <li>I <strong>had worked</strong> in hospitality for 10 years before I <strong>transitioned</strong> to healthcare.</li>
                        <li>She <strong>had been</strong> a teacher before she <strong>became</strong> a corporate trainer.</li>
                        <li>He <strong>had never worked</strong> in construction before he <strong>started</strong> this apprenticeship.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Starting a new position:</p>
                    <ul>
                        <li>When I <strong>joined</strong> this company, I <strong>had already gained</strong> 5 years of management experience.</li>
                        <li>Before she <strong>accepted</strong> the offer, she <strong>had researched</strong> the company culture.</li>
                        <li>I <strong>felt</strong> confident because I <strong>had done</strong> similar work at my previous job.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Promotions and advancement:</p>
                    <ul>
                        <li>When I <strong>got promoted</strong> to supervisor, I <strong>had trained</strong> all the new employees.</li>
                        <li>She <strong>became</strong> a manager after she <strong>had completed</strong> the leadership program.</li>
                        <li>By the time they <strong>offered</strong> me the raise, I <strong>had proven</strong> my value to the team.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Leaving a job:</p>
                    <ul>
                        <li>I <strong>decided</strong> to leave because I <strong>had learned</strong> everything I could there.</li>
                        <li>She <strong>quit</strong> after she <strong>had found</strong> a better opportunity.</li>
                        <li>By the time I <strong>resigned</strong>, I <strong>had already secured</strong> my next position.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Interview Tip",
                content: "Using Past Perfect in interviews shows you can clearly explain your career progression and makes your experience sound more professional and organized.",
            },
            exercises: [
                {
                    id: "career-transitions-1",
                    title: "Practice: Career Changes",
                    instructions: "Complete these career transition statements.",
                    items: [
                        {
                            type: "text",
                            label: "I transitioned to healthcare after I _____ (work) in hospitality for 10 years.",
                            expectedAnswer: "had worked",
                        },
                        {
                            type: "text",
                            label: "When I joined this company, I _____ (already gain) management experience.",
                            expectedAnswer: "had already gained",
                        },
                        {
                            type: "select",
                            label: "She became a supervisor after she _____ the training program.",
                            options: ["complete", "completed", "had completed", "has completed"],
                            expectedAnswer: "had completed",
                        },
                        {
                            type: "text",
                            label: "By the time I resigned, I _____ (already secure) my next job.",
                            expectedAnswer: "had already secured",
                        },
                    ],
                },
            ],
        },

        {
            id: "training-certifications",
            stepNumber: 3,
            title: "Training, Certifications & Skills",
            icon: "🎓",
            explanation: `
                <h3>Describing Your Training and Skill Development</h3>
                <p>Past Perfect is perfect for talking about training you completed BEFORE getting a job or qualification you earned BEFORE a promotion.</p>

                <h3>Training & Certification Examples</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Certifications before employment:</p>
                    <ul>
                        <li>Before they <strong>hired</strong> me, I <strong>had completed</strong> my forklift certification.</li>
                        <li>I <strong>got</strong> the job because I <strong>had earned</strong> my CNA license.</li>
                        <li>She <strong>had passed</strong> the ServSafe exam before she <strong>applied</strong> for the chef position.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Training before promotions:</p>
                    <ul>
                        <li>When I <strong>became</strong> a team leader, I <strong>had completed</strong> all the required training modules.</li>
                        <li>She <strong>received</strong> the promotion after she <strong>had attended</strong> the management workshop.</li>
                        <li>By the time they <strong>promoted</strong> him, he <strong>had taken</strong> every available course.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Learning new skills:</p>
                    <ul>
                        <li>I <strong>had never used</strong> Excel before I <strong>started</strong> this office job.</li>
                        <li>Before she <strong>moved</strong> to the US, she <strong>had studied</strong> English for 2 years.</li>
                        <li>When I <strong>began</strong> working in customer service, I <strong>had already learned</strong> basic computer skills.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">On-the-job experience:</p>
                    <ul>
                        <li>By the end of my first year, I <strong>had mastered</strong> the cash register system.</li>
                        <li>When I <strong>left</strong> that position, I <strong>had gained</strong> valuable teamwork skills.</li>
                        <li>She <strong>felt</strong> ready for the interview because she <strong>had practiced</strong> her answers.</li>
                    </ul>
                </div>
            `,
            tipBox: {
                title: "💡 Resume Tip",
                content: "On your resume, use past perfect to show preparation: 'Had completed OSHA training before starting construction work' shows you were qualified from day one.",
            },
            exercises: [
                {
                    id: "training-certifications-1",
                    title: "Practice: Training & Skills",
                    instructions: "Complete these sentences about training and skills.",
                    items: [
                        {
                            type: "text",
                            label: "Before they hired me, I _____ (complete) my forklift certification.",
                            expectedAnswer: "had completed",
                        },
                        {
                            type: "text",
                            label: "I had never used Excel before I _____ (start) this office job.",
                            expectedAnswer: "started",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct sentence:",
                            options: [
                                { value: "a", label: "When I became a supervisor, I had attended leadership training." },
                                { value: "b", label: "When I had become a supervisor, I attended leadership training." },
                                { value: "c", label: "When I became a supervisor, I attended leadership training." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "By the end of my first year, I _____ (master) all the required systems.",
                            expectedAnswer: "had mastered",
                        },
                    ],
                },
            ],
        },

        {
            id: "interview-language",
            stepNumber: 4,
            title: "Using Past Perfect in Interviews",
            icon: "💬",
            explanation: `
                <h3>Professional Interview Responses</h3>
                <p>Past Perfect makes your interview answers sound more professional and helps you clearly explain your qualifications and experience.</p>

                <h3>Common Interview Questions with Past Perfect</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"Tell me about your previous experience."</p>
                    <ul>
                        <li>"Before I started my current role, I <strong>had worked</strong> in customer service for 6 years."</li>
                        <li>"When I joined that company, I <strong>had already gained</strong> experience in warehouse operations."</li>
                        <li>"By the time I left my last job, I <strong>had trained</strong> 15 new employees."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"What qualifications do you have?"</p>
                    <ul>
                        <li>"Before I applied, I <strong>had completed</strong> my OSHA safety certification."</li>
                        <li>"I <strong>had earned</strong> my CDL license before the position opened up."</li>
                        <li>"By the time of the interview, I <strong>had finished</strong> all required coursework."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"Why did you leave your last job?"</p>
                    <ul>
                        <li>"I decided to leave because I <strong>had learned</strong> everything I could in that role."</li>
                        <li>"By the time I left, I <strong>had accomplished</strong> all my goals there."</li>
                        <li>"I left after I <strong>had found</strong> an opportunity that better matched my skills."</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">"Describe a challenge you overcame."</p>
                    <ul>
                        <li>"I succeeded because I <strong>had prepared</strong> thoroughly before the project started."</li>
                        <li>"The situation was difficult, but I <strong>had dealt with</strong> similar issues before."</li>
                        <li>"I felt confident because I <strong>had practiced</strong> the procedure many times."</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin-top: 1.5rem;">
                    <h4 style="color: #d97757; margin-top: 0;">Compare These Answers:</h4>
                    <p><strong>Without Past Perfect (sounds less professional):</strong></p>
                    <p>"I worked in restaurants for 5 years. Then I started this job."</p>
                    <p><strong>With Past Perfect (sounds more professional):</strong></p>
                    <p>"Before I started this position, I <strong>had worked</strong> in restaurants for 5 years, so I brought strong customer service skills to the team."</p>
                </div>
            `,
            tipBox: {
                title: "💡 Interview Pro Tip",
                content: "Using Past Perfect shows you can organize your thoughts and speak professionally about your career progression—this impresses interviewers!",
            },
            exercises: [
                {
                    id: "interview-language-1",
                    title: "Practice: Interview Responses",
                    instructions: "Complete these interview-style responses with past perfect.",
                    items: [
                        {
                            type: "text",
                            label: "'Before I applied for this position, I _____ (work) in retail for 8 years.'",
                            expectedAnswer: "had worked",
                        },
                        {
                            type: "text",
                            label: "'By the time I left my last job, I _____ (train) over 20 new employees.'",
                            expectedAnswer: "had trained",
                        },
                        {
                            type: "radio",
                            label: "Which response sounds most professional?",
                            options: [
                                { value: "a", label: "'I had completed my certification before I applied for the job.'" },
                                { value: "b", label: "'I completed my certification. Then I applied for the job.'" },
                                { value: "c", label: "'I have completed my certification before I applied.'" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "'I felt ready for the promotion because I _____ (gain) leadership experience.'",
                            expectedAnswer: "had gained",
                        },
                    ],
                },
            ],
        },

        {
            id: "timeline-visualization",
            stepNumber: 5,
            title: "Career Timeline Visualization",
            icon: "⏰",
            explanation: `
                <h3>Understanding Your Career Timeline</h3>
                <p>Think of your work history as a timeline moving from left (earliest) to right (most recent).</p>

                <div style="background: white; border: 2px solid #d97757; border-radius: 0.75rem; padding: 1.5rem; margin: 1.5rem 0;">
                    <h4 style="text-align: center; margin-top: 0;">Example: Career Progression</h4>

                    <div style="display: flex; align-items: center; justify-content: space-around; position: relative; margin: 2rem 0;">
                        <div style="position: absolute; top: 50%; left: 5%; right: 5%; height: 4px; background: linear-gradient(to right, #d97757, #7ba884, #cbd5e1); transform: translateY(-50%); z-index: 0;"></div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #d97757; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(217, 119, 87, 0.3); margin: 0 auto;">
                                1st
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #d97757;">2015-2020</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Worked in retail</div>
                            <div style="font-size: 0.75rem; color: #d97757; font-weight: 600; margin-top: 0.25rem;">Past Perfect</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: #7ba884; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; border: 4px solid white; box-shadow: 0 4px 12px rgba(123, 168, 132, 0.3); margin: 0 auto;">
                                2nd
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #7ba884;">2020</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Started current job</div>
                            <div style="font-size: 0.75rem; color: #7ba884; font-weight: 600; margin-top: 0.25rem;">Past Simple</div>
                        </div>

                        <div style="position: relative; z-index: 1; text-align: center;">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; border: 4px solid white; margin: 0 auto;">
                                NOW
                            </div>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b;">2026</div>
                        </div>
                    </div>

                    <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                        <p style="margin: 0; text-align: center;"><strong>How to say it:</strong> "Before I <span style="color: #7ba884; font-weight: 600;">started</span> this job in 2020, I <span style="color: #d97757; font-weight: 600;">had worked</span> in retail for 5 years."</p>
                    </div>
                </div>

                <h3>More Career Timeline Examples</h3>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> Earned certification (1st) → Got hired (2nd) → NOW</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"I <span style="color: #d97757;">had earned</span> my CNA license before they <span style="color: #7ba884;">hired</span> me."</p>
                </div>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> Completed training (1st) → Got promoted (2nd) → NOW</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"When I <span style="color: #7ba884;">got promoted</span>, I <span style="color: #d97757;">had completed</span> all the leadership courses."</p>
                </div>

                <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem;">
                    <p style="margin: 0;"><strong>Timeline:</strong> Gained 10 years experience (1st) → Applied for supervisor (2nd) → NOW</p>
                    <p style="margin: 0.5rem 0 0 0; font-weight: 600;">"By the time I <span style="color: #7ba884;">applied</span> for supervisor, I <span style="color: #d97757;">had gained</span> 10 years of experience."</p>
                </div>
            `,
            exercises: [
                {
                    id: "timeline-1",
                    title: "Practice: Career Timeline Ordering",
                    instructions: "Put these career events in timeline order (1st to most recent).",
                    items: [
                        {
                            type: "radio",
                            label: "When I got promoted, I had completed the training program.",
                            options: [
                                { value: "correct", label: "1st: Completed training → 2nd: Got promoted" },
                                { value: "wrong", label: "1st: Got promoted → 2nd: Completed training" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Before I started this job, I had worked in construction for 8 years.",
                            options: [
                                { value: "correct", label: "1st: Worked in construction → 2nd: Started this job" },
                                { value: "wrong", label: "1st: Started this job → 2nd: Worked in construction" },
                            ],
                            expectedAnswer: "correct",
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
                <h3>Making Negatives with Past Perfect</h3>
                <p>Use <strong>hadn't</strong> (had not) + past participle to talk about things you HADN'T done before a certain point in your career.</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(244, 211, 94, 0.1); border-radius: 0.5rem; border: 2px solid #f4d35e;">
                    <h4 style="color: #d97757;">Negative Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757; text-align: center; margin: 1rem 0;">hadn't (had not) + past participle</p>
                </div>

                <h3>Negative Examples - Jobs & Experience</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Lack of experience:</p>
                    <ul>
                        <li>I <strong>hadn't worked</strong> in an office before I got this job.</li>
                        <li>She <strong>had never used</strong> a cash register before her first retail job.</li>
                        <li>Before he started welding, he <strong>hadn't completed</strong> any technical training.</li>
                    </ul>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <p style="font-weight: bold;">Missing qualifications:</p>
                    <ul>
                        <li>They didn't hire me because I <strong>hadn't finished</strong> my certification yet.</li>
                        <li>I <strong>hadn't gained</strong> enough experience before I applied for the manager role.</li>
                        <li>She <strong>hadn't updated</strong> her resume before the interview.</li>
                    </ul>
                </div>

                <h3>Making Questions with Past Perfect</h3>
                <p>To ask about someone's work history, use: <strong>Had + subject + past participle?</strong></p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(122, 143, 124, 0.1); border-radius: 0.5rem; border: 2px solid #7ba884;">
                    <h4 style="color: #7ba884;">Question Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #7ba884; text-align: center; margin: 1rem 0;">Had + subject + past participle?</p>
                </div>

                <h3>Question Examples - Interview & Work</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin: 1rem 0;">
                    <ul>
                        <li><strong>Had you worked</strong> in customer service before this job?</li>
                        <li><strong>Had she completed</strong> the training before she got promoted?</li>
                        <li><strong>Had they hired</strong> anyone else before they offered you the position?</li>
                        <li><strong>Had he gained</strong> management experience before becoming a supervisor?</li>
                    </ul>
                </div>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin-top: 1rem;">
                    <p style="margin: 0;"><strong>💡 Answering:</strong> "Yes, I had." / "No, I hadn't." / "Yes, I had worked in retail before."</p>
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
                            label: "I _____ (not work) in an office before I got this job.",
                            expectedAnswer: "hadn't worked",
                        },
                        {
                            type: "text",
                            label: "_____ you _____ (complete) your training before the promotion?",
                            expectedAnswer: "Had, completed|Had,completed",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct negative:",
                            options: [
                                { value: "a", label: "She hadn't gained enough experience before she applied." },
                                { value: "b", label: "She hasn't gained enough experience before she applied." },
                                { value: "c", label: "She didn't gain enough experience before she applied." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "text",
                            label: "_____ they _____ (work) together before they became partners?",
                            expectedAnswer: "Had, worked|Had,worked",
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
                <h3>Mistake #1: Using Present Perfect Instead of Past Perfect</h3>
                <ul>
                    <li>❌ "Before I started this job, I <strong>have worked</strong> in retail." → ✅ "Before I started this job, I <strong>had worked</strong> in retail."</li>
                    <li>❌ "When I got promoted, I <strong>have completed</strong> the training." → ✅ "When I got promoted, I <strong>had completed</strong> the training."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> Both actions are in the past, so use past perfect (had) for the earlier action, not present perfect (have).</p>

                <h3>Mistake #2: Using Past Perfect for Only ONE Action</h3>
                <ul>
                    <li>❌ "I <strong>had worked</strong> in retail last year." → ✅ "I <strong>worked</strong> in retail last year."</li>
                    <li>❌ "She <strong>had completed</strong> her training in 2020." → ✅ "She <strong>completed</strong> her training in 2020."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> Past perfect needs TWO past actions to show sequence. If there's only one action, use past simple.</p>

                <h3>Mistake #3: Using Both Verbs in Past Perfect</h3>
                <ul>
                    <li>❌ "Before I <strong>had started</strong> this job, I <strong>had worked</strong> in retail." → ✅ "Before I <strong>started</strong> this job, I <strong>had worked</strong> in retail."</li>
                    <li>❌ "When she <strong>had got promoted</strong>, she <strong>had completed</strong> training." → ✅ "When she <strong>got promoted</strong>, she <strong>had completed</strong> training."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> Only the FIRST (earlier) action uses past perfect. The second action uses past simple.</p>

                <h3>Mistake #4: Wrong Word Order in Questions</h3>
                <ul>
                    <li>❌ "You had worked in customer service before?" → ✅ "<strong>Had you worked</strong> in customer service before?"</li>
                    <li>❌ "She had completed the training?" → ✅ "<strong>Had she completed</strong> the training?"</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> In questions, 'Had' comes before the subject.</p>

                <h3>Mistake #5: Forgetting the Past Participle</h3>
                <ul>
                    <li>❌ "I had <strong>work</strong> there for 5 years." → ✅ "I had <strong>worked</strong> there for 5 years."</li>
                    <li>❌ "She had <strong>complete</strong> her certification." → ✅ "She had <strong>completed</strong> her certification."</li>
                </ul>
                <p style="color: #64748b; font-size: 0.9rem;">💡 <strong>Why?</strong> Past perfect requires the past participle form (worked, completed, done), not the base form.</p>
            `,
            exercises: [
                {
                    id: "mistakes-1",
                    title: "Practice: Fix the Mistakes",
                    instructions: "Choose the correct sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Fix: 'Before I started this job, I have worked in retail.'",
                            options: [
                                { value: "a", label: "Before I started this job, I had worked in retail." },
                                { value: "b", label: "Before I had started this job, I worked in retail." },
                                { value: "c", label: "Before I start this job, I had worked in retail." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'I had worked in construction last year.' (only ONE action)",
                            options: [
                                { value: "a", label: "I worked in construction last year." },
                                { value: "b", label: "I have worked in construction last year." },
                                { value: "c", label: "I had worked in construction last year." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Fix: 'You had completed the training before you got promoted?'",
                            options: [
                                { value: "a", label: "Had you completed the training before you got promoted?" },
                                { value: "b", label: "Have you completed the training before you got promoted?" },
                                { value: "c", label: "Did you had completed the training before you got promoted?" },
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
                    title: "Exercise 1: Complete Work History Statements",
                    instructions: "Complete these sentences with past perfect.",
                    items: [
                        {
                            type: "text",
                            label: "Before I moved to Boston, I _____ (work) in New York for 10 years.",
                            expectedAnswer: "had worked",
                        },
                        {
                            type: "text",
                            label: "When I applied for the manager position, I _____ (gain) 5 years of experience.",
                            expectedAnswer: "had gained",
                        },
                        {
                            type: "select",
                            label: "She got promoted after she _____ the leadership training.",
                            options: ["complete", "completed", "had completed", "has completed"],
                            expectedAnswer: "had completed",
                        },
                        {
                            type: "text",
                            label: "By the time I left that job, I _____ (learn) three new software systems.",
                            expectedAnswer: "had learned",
                        },
                    ],
                },
                {
                    id: "practice-ex-2",
                    title: "Exercise 2: Negative Statements",
                    instructions: "Complete with past perfect negative (hadn't).",
                    items: [
                        {
                            type: "text",
                            label: "I _____ (not work) in healthcare before I got this CNA position.",
                            expectedAnswer: "hadn't worked",
                        },
                        {
                            type: "text",
                            label: "She _____ (never use) a forklift before her warehouse job.",
                            expectedAnswer: "had never used",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct negative:",
                            options: [
                                { value: "a", label: "He hadn't completed his training before he started." },
                                { value: "b", label: "He hasn't completed his training before he started." },
                                { value: "c", label: "He didn't complete his training before he started." },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-3",
                    title: "Exercise 3: Interview Questions",
                    instructions: "Form questions with past perfect.",
                    items: [
                        {
                            type: "text",
                            label: "_____ you _____ (work) in customer service before?",
                            expectedAnswer: "Had, worked|Had,worked",
                        },
                        {
                            type: "text",
                            label: "_____ she _____ (complete) her certification before the interview?",
                            expectedAnswer: "Had, completed|Had,completed",
                        },
                        {
                            type: "radio",
                            label: "Choose the correct question:",
                            options: [
                                { value: "a", label: "Had they worked together before they started the business?" },
                                { value: "b", label: "Have they worked together before they started the business?" },
                                { value: "c", label: "Did they had worked together before they started the business?" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
                {
                    id: "practice-ex-4",
                    title: "Exercise 4: Timeline Ordering",
                    instructions: "Choose the sentence that shows correct timeline order.",
                    items: [
                        {
                            type: "radio",
                            label: "Which shows the correct order?",
                            options: [
                                { value: "a", label: "Before I started this job, I had worked in retail for 5 years." },
                                { value: "b", label: "Before I had started this job, I worked in retail for 5 years." },
                                { value: "c", label: "Before I start this job, I had worked in retail for 5 years." },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "a", label: "When I got promoted, I had completed all the training." },
                                { value: "b", label: "When I had got promoted, I completed all the training." },
                                { value: "c", label: "When I get promoted, I had completed all the training." },
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
                            label: "I felt confident in the interview because I _____ (practice) my answers.",
                            expectedAnswer: "had practiced",
                        },
                        {
                            type: "text",
                            label: "They hired me because I _____ (earn) my forklift certification.",
                            expectedAnswer: "had earned",
                        },
                        {
                            type: "select",
                            label: "By the time I resigned, I _____ another job.",
                            options: ["find", "found", "had found", "have found"],
                            expectedAnswer: "had found",
                        },
                        {
                            type: "text",
                            label: "She was nervous because she _____ (never have) a job interview in English before.",
                            expectedAnswer: "had never had",
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
                <h3>Past Perfect for Jobs & Experience - Summary</h3>

                <div style="background: rgba(244, 211, 94, 0.15); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f4d35e; margin: 1rem 0;">
                    <h4 style="margin-top: 0; color: #d97757;">Formula:</h4>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #d97757; margin: 0.5rem 0;">had + past participle</p>
                    <p style="margin: 0;">Shows what happened FIRST in your career timeline</p>
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
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Work history</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Before I started this job, I <strong>had worked</strong> in retail.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Training/Certs</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Before they hired me, I <strong>had completed</strong> my certification.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Promotions</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">When I got promoted, I <strong>had trained</strong> all new employees.</td>
                        </tr>
                        <tr style="background: rgba(0,0,0,0.02);">
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Career changes</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I transitioned to healthcare after I <strong>had worked</strong> in hospitality for 10 years.</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">Skills</td>
                            <td style="padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1);">I <strong>had never used</strong> Excel before I started this office job.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Forms</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(122, 143, 124, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">Positive</h4>
                        <p style="margin: 0; font-size: 0.9rem;">I/you/he/she/we/they <strong>had worked</strong></p>
                    </div>
                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #d97757; margin-top: 0;">Negative</h4>
                        <p style="margin: 0; font-size: 0.9rem;">I/you/he/she/we/they <strong>hadn't worked</strong></p>
                    </div>
                    <div style="background: rgba(244, 211, 94, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #b45309; margin-top: 0;">Question</h4>
                        <p style="margin: 0; font-size: 0.9rem;"><strong>Had</strong> I/you/he/she/we/they <strong>worked</strong>?</p>
                    </div>
                </div>

                <h3>Key Signal Words</h3>
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                    <ul style="columns: 2; margin: 0;">
                        <li><strong>before</strong></li>
                        <li><strong>after</strong></li>
                        <li><strong>when</strong></li>
                        <li><strong>by the time</strong></li>
                        <li><strong>already</strong></li>
                        <li><strong>never</strong></li>
                        <li><strong>by 2020</strong></li>
                        <li><strong>for X years</strong></li>
                    </ul>
                </div>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ Using present perfect (have) instead of past perfect (had)</li>
                    <li>❌ Using past perfect with only ONE action</li>
                    <li>❌ Using past perfect for BOTH verbs (only use it for the FIRST action)</li>
                    <li>❌ Wrong question word order (put 'Had' before subject)</li>
                </ul>
            `,
            tipBox: {
                title: "⚠️ Remember",
                content: "Past perfect needs TWO past actions to show which happened FIRST. The first/earlier action gets 'had + past participle.' The second/later action uses past simple.",
            },
        },
    ],

    miniQuiz: [
        {
            id: "quiz-1",
            question: "What is past perfect used for in work contexts?",
            options: [
                { value: "a", label: "To show which of TWO career events happened first" },
                { value: "b", label: "To talk about any past job" },
                { value: "c", label: "To describe current work" },
            ],
            correctAnswer: "a",
            explanation: "Past perfect shows the sequence of events in your career - which experience came before another event.",
        },
        {
            id: "quiz-2",
            question: "What is the past perfect formula?",
            options: [
                { value: "a", label: "have/has + past participle" },
                { value: "b", label: "had + past participle" },
                { value: "c", label: "was/were + verb-ing" },
            ],
            correctAnswer: "b",
            explanation: "Past perfect: had + past participle (everyone uses 'had')",
        },
        {
            id: "quiz-3",
            question: "Complete: 'Before I started this job, I _____ in retail for 5 years.'",
            options: [
                { value: "a", label: "worked" },
                { value: "b", label: "had worked" },
                { value: "c", label: "have worked" },
            ],
            correctAnswer: "b",
            explanation: "The earlier action (working in retail) uses past perfect: had worked.",
        },
        {
            id: "quiz-4",
            question: "Which sentence is WRONG? (Only one past action)",
            options: [
                { value: "a", label: "I worked in construction last year." },
                { value: "b", label: "I had worked in construction last year." },
                { value: "c", label: "Last year I worked in construction." },
            ],
            correctAnswer: "b",
            explanation: "Past perfect needs TWO actions. With only one action, use past simple: 'I worked in construction last year.'",
        },
        {
            id: "quiz-5",
            question: "What's the negative form of 'She had completed her training'?",
            options: [
                { value: "a", label: "She hadn't completed her training" },
                { value: "b", label: "She hasn't completed her training" },
                { value: "c", label: "She didn't complete her training" },
            ],
            correctAnswer: "a",
            explanation: "Past perfect negative: hadn't (had not) + past participle",
        },
        {
            id: "quiz-6",
            question: "How do you form a past perfect question?",
            options: [
                { value: "a", label: "Did + subject + verb" },
                { value: "b", label: "Have/Has + subject + past participle" },
                { value: "c", label: "Had + subject + past participle" },
            ],
            correctAnswer: "c",
            explanation: "Past perfect questions: Had + subject + past participle?",
        },
        {
            id: "quiz-7",
            question: "In 'When I got promoted, I had completed the training,' which happened first?",
            options: [
                { value: "a", label: "Got promoted" },
                { value: "b", label: "Completed training" },
                { value: "c", label: "Both at the same time" },
            ],
            correctAnswer: "b",
            explanation: "'Had completed' is past perfect, so it happened FIRST. Training came before promotion.",
        },
        {
            id: "quiz-8",
            question: "Which is correct?",
            options: [
                { value: "a", label: "Before I started this job, I have worked in retail." },
                { value: "b", label: "Before I started this job, I had worked in retail." },
                { value: "c", label: "Before I had started this job, I had worked in retail." },
            ],
            correctAnswer: "b",
            explanation: "First action (worked in retail) = past perfect. Second action (started this job) = past simple.",
        },
        {
            id: "quiz-9",
            question: "Complete: 'They hired me because I _____ my forklift certification.'",
            options: [
                { value: "a", label: "earned" },
                { value: "b", label: "had earned" },
                { value: "c", label: "have earned" },
            ],
            correctAnswer: "b",
            explanation: "Earning the certification happened BEFORE getting hired, so use past perfect: had earned.",
        },
        {
            id: "quiz-10",
            question: "Which shows incorrect use of BOTH verbs in past perfect?",
            options: [
                { value: "a", label: "Before I started this job, I had worked in retail." },
                { value: "b", label: "Before I had started this job, I had worked in retail." },
                { value: "c", label: "I had worked in retail before I started this job." },
            ],
            correctAnswer: "b",
            explanation: "Only the FIRST action uses past perfect. The second action should be past simple: 'Before I started...'",
        },
        {
            id: "quiz-11",
            question: "Complete the interview response: '_____ you worked in customer service before?'",
            options: [
                { value: "a", label: "Did" },
                { value: "b", label: "Have" },
                { value: "c", label: "Had" },
            ],
            correctAnswer: "c",
            explanation: "Past perfect question about experience before this moment: Had you worked...",
        },
        {
            id: "quiz-12",
            question: "Which sentence correctly uses past perfect for career timeline?",
            options: [
                { value: "a", label: "I worked in restaurants for 10 years. Then I started this job." },
                { value: "b", label: "Before I started this job, I had worked in restaurants for 10 years." },
                { value: "c", label: "I have worked in restaurants for 10 years before I started this job." },
            ],
            correctAnswer: "b",
            explanation: "Past perfect clearly shows the timeline: restaurant work (1st) happened before starting this job (2nd).",
        },
        {
            id: "quiz-13",
            question: "Complete: 'I _____ a computer before I started my office job.' (never)",
            options: [
                { value: "a", label: "have never used" },
                { value: "b", label: "had never used" },
                { value: "c", label: "never used" },
            ],
            correctAnswer: "b",
            explanation: "Shows what you HADN'T done before starting the job: had never used.",
        },
        {
            id: "quiz-14",
            question: "Which is the most professional way to describe your qualifications in an interview?",
            options: [
                { value: "a", label: "I completed my certification. Then I applied." },
                { value: "b", label: "I had completed my certification before I applied." },
                { value: "c", label: "I have completed my certification before I applied." },
            ],
            correctAnswer: "b",
            explanation: "Past perfect sounds more professional and clearly shows you were qualified when you applied.",
        },
        {
            id: "quiz-15",
            question: "Complete: 'By 2020, I _____ 10 years of experience in construction.'",
            options: [
                { value: "a", label: "gained" },
                { value: "b", label: "have gained" },
                { value: "c", label: "had gained" },
            ],
            correctAnswer: "c",
            explanation: "'By 2020' shows a point in the past. The experience was gained BEFORE 2020: had gained.",
        },
    ],
};
