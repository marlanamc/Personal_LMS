import type { InteractiveGuideContent } from "@/types/activity";

export const workplacePhrasalVerbsContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "introduction",
            title: "Workplace Phrasal Verbs: The Secret Language of Work",
            icon: "💼",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">"Clock in before your shift." "Fill out this form." "Call back if you can't make it." Phrasal verbs are everywhere at work - and if you don't know them, you'll be lost. These two-word (or three-word) combinations have special meanings you can't guess from the individual words.</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Phrasal verbs are the #1 thing that makes English sound natural at work:</p>
                <ul>
                    <li><strong>Your boss uses them:</strong> "Fill in for Sarah" "Turn in your timesheet"</li>
                    <li><strong>Policies mention them:</strong> "Clock in/out" "Call out sick"</li>
                    <li><strong>Coworkers expect you to know:</strong> "Can you cover for me?" "I'll get back to you"</li>
                </ul>

                <div style="background: rgba(122, 143, 124, 0.15); border-left: 4px solid #7ba884; padding: 1rem 1.25rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <h3 style="color: #7ba884; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.1rem;">🗣️ When You'll Use This Grammar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>In class:</strong></p>
                    <ul style="margin: 0.5rem 0 0 0;">
                        <li>Making workplace small talk ("How's the new schedule working out?")</li>
                        <li>Understanding workplace policies ("You need to clock in before your shift" "Fill out this form")</li>
                        <li>Following instructions ("Turn in your timesheet" "Call back if you can't make it")</li>
                        <li>Role-playing common workplace situations</li>
                    </ul>
                    <p style="margin-top: 0.75rem; font-style: italic; color: #3a3a3a;">💼 Phrasal verbs make you sound like you belong at work - not knowing them makes you stand out!</p>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-intro-1",
                    title: "Quick Check: Pick the Best Phrase",
                    instructions: "Choose the best phrase for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "Your shift starts at 9:00. You need to _____.",
                            options: ["clock in", "clock out", "get back", "turn in"],
                            expectedAnswer: "clock in",
                        },
                        {
                            type: "select",
                            label: "You completed your onboarding paperwork. Now you should _____.",
                            options: ["turn it in", "call it out", "clock it in", "show it up"],
                            expectedAnswer: "turn it in",
                        },
                    ],
                },
            ],
        },

        {
            id: "what-are-phrasal-verbs",
            stepNumber: 1,
            title: "What Are Phrasal Verbs?",
            icon: "🔤",
            explanation: `
                <h3>Verb + Particle = New Meaning</h3>
                <p>A phrasal verb = a verb + a particle (preposition or adverb) that creates a completely new meaning:</p>

                <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(200, 107, 81, 0.1); border-radius: 0.5rem;">
                    <h4>Examples:</h4>
                    <ul>
                        <li><strong>turn on</strong> ≠ turn + on → means "start/activate"</li>
                        <li><strong>fill out</strong> ≠ fill + out → means "complete a form"</li>
                        <li><strong>call back</strong> ≠ call + back → means "return a phone call"</li>
                    </ul>
                </div>

                <p>The meaning is NOT literal! You can't guess it from the words.</p>
            `,
            exercises: [
                {
                    id: "workplace-pv-what-1",
                    title: "Quick Check: What Does It Mean?",
                    instructions: "Choose the meaning of the phrasal verb.",
                    items: [
                        {
                            type: "radio",
                            label: "Please <span class='eg-verb'>fill out</span> the emergency contact form.",
                            options: [
                                { value: "b", label: "Make the form bigger" },
                                { value: "a", label: "Complete the form" },
                                { value: "c", label: "Throw the form away" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I'll <span class='eg-verb'>call you back</span> after my shift ends.",
                            options: [
                                { value: "b", label: "Meet you in person" },
                                { value: "c", label: "Text you right now" },
                                { value: "a", label: "Call you again later" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Can you <span class='eg-verb'>look over</span> the new shift schedule?",
                            options: [
                                { value: "a", label: "Review/check it" },
                                { value: "b", label: "Look above it" },
                                { value: "c", label: "Memorize it forever" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "💡 Good News",
                content: "There are thousands of phrasal verbs in English, but you only need about 50 common ones for everyday work life. Focus on the most common, and you'll sound natural!",
            },
        },

        {
            id: "phrasal-verb-forms",
            stepNumber: 2,
            title: "Phrasal Verb Forms: V1, V1-3rd, V1-ing, V2, V3",
            icon: "🔁",
            explanation: `
                <h3>Key Rule: Change the Verb, Keep the Particle</h3>
                <p>With phrasal verbs, only the first word changes form. The particle/preposition stays the same.</p>

                <div style="margin: 1rem 0; padding: 1rem; background: rgba(59, 130, 246, 0.08); border-radius: 0.5rem;">
                    <ul style="margin: 0;">
                        <li><strong>call out</strong> → calls out (V1-3rd), calling out (V1-ing), called out (V2), called out (V3)</li>
                        <li><strong>clock in</strong> → clocks in (V1-3rd), clocking in (V1-ing), clocked in (V2), clocked in (V3)</li>
                        <li><strong>fill out</strong> → fills out (V1-3rd), filling out (V1-ing), filled out (V2), filled out (V3)</li>
                        <li><strong>turn in</strong> → turns in (V1-3rd), turning in (V1-ing), turned in (V2), turned in (V3)</li>
                    </ul>
                </div>

                <h4>How You Hear These Forms at Work</h4>
                <ul>
                    <li><strong>V1-3rd (simple present):</strong> "She <strong>calls out</strong> only when she is very sick."</li>
                    <li><strong>V1-ing (continuous):</strong> "I am <strong>filling out</strong> the incident form now."</li>
                    <li><strong>V2 (past):</strong> "I <strong>called out</strong> yesterday."</li>
                    <li><strong>V3 (perfect):</strong> "She has <strong>turned in</strong> her timesheet."</li>
                </ul>

                <p style="margin-top: 0.75rem;"><strong>Tip:</strong> Most workplace phrasal verbs in this lesson are regular, so V2 and V3 are usually the same (called, clocked, filled, turned).</p>
            `,
            exercises: [
                {
                    id: "workplace-pv-forms-0",
                    title: "Practice: Verb Forms",
                    instructions: "Choose the form that fits each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "Right now, I am _____ the onboarding paperwork.",
                            options: ["filling out", "filled out", "fill out", "turned in"],
                            expectedAnswer: "filling out",
                        },
                        {
                            type: "select",
                            label: "Yesterday, Jamal _____ because he had a fever.",
                            options: ["called out", "calling out", "call out", "has called out"],
                            expectedAnswer: "called out",
                        },
                        {
                            type: "select",
                            label: "Every Monday, he _____ right at 8:00 a.m.",
                            options: ["clocks in", "clock in", "clocking in", "clocked in"],
                            expectedAnswer: "clocks in",
                        },
                        {
                            type: "select",
                            label: "By 9:05, everyone has _____ and started work.",
                            options: ["clocked in", "clocking in", "clock in", "calls in"],
                            expectedAnswer: "clocked in",
                        },
                        {
                            type: "select",
                            label: "Please check if Ana has _____ her timesheet yet.",
                            options: ["turned in", "turning in", "turn in", "turns in"],
                            expectedAnswer: "turned in",
                        },
                    ],
                },
            ],
        },

        {
            id: "clock-verbs",
            stepNumber: 3,
            title: "Clock In/Out: Time & Attendance",
            icon: "⏰",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">clock in / punch in</h4>
                        <p style="margin: 0;">= record your arrival at work</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Don't forget to <strong>clock in</strong> when you arrive."</p>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #d97757; margin-top: 0;">clock out / punch out</h4>
                        <p style="margin: 0;">= record your departure from work</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Remember to <strong>clock out</strong> before you leave."</p>
                    </div>

                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">call out / call in sick</h4>
                        <p style="margin: 0;">= notify work that you can't come in</p>
                        <ul style="margin: 0.5rem 0 0 1.25rem; padding: 0;">
                            <li><strong>call out</strong>: very common in shift-based jobs (retail, restaurants, warehouses); often used for any urgent absence</li>
                            <li><strong>call in sick</strong>: very common in office/HR language; specifically illness</li>
                        </ul>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"I need to <strong>call in sick</strong> today."</p>
                        <p style="margin: 0.35rem 0 0 0; font-style: italic;">"I had to <strong>call out</strong> for tonight's shift."</p>
                        <p style="margin: 0.6rem 0 0 0;"><strong>Important:</strong> Outside workplace attendance, <strong>call out</strong> can also mean criticize someone publicly.</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-clock-1",
                    title: "Practice: Time & Attendance",
                    instructions: "Choose the best phrasal verb for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "You arrive at work and your shift is starting. You need to _____.",
                            options: ["clock in", "clock out", "call back", "turn in"],
                            expectedAnswer: "clock in",
                        },
                        {
                            type: "select",
                            label: "Your shift ends at 5:00 and you are leaving. You should _____.",
                            options: ["clock out", "clock in", "fill out", "get back to"],
                            expectedAnswer: "clock out",
                        },
                        {
                            type: "select",
                            label: "You email HR: 'I have a fever, so I need to _____ today.'",
                            options: ["call in sick", "call back", "show up", "look over"],
                            expectedAnswer: "call in sick",
                        },
                        {
                            type: "select",
                            label: "Your restaurant manager says: 'If you can't work, please _____ before your shift starts.'",
                            options: ["call out", "clock in", "turn in", "follow up"],
                            expectedAnswer: "call out",
                        },
                    ],
                },
            ],
        },

        {
            id: "forms-paperwork",
            stepNumber: 4,
            title: "Fill Out/In, Turn In: Forms & Paperwork",
            icon: "📝",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #a855f7; margin-top: 0;">fill out / fill in</h4>
                        <p style="margin: 0;">= complete a form by writing information</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Please <strong>fill out</strong> this application form."</p>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #22c55e; margin-top: 0;">turn in / hand in</h4>
                        <p style="margin: 0;">= submit, give to someone (paperwork, assignments)</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"<strong>Turn in</strong> your timesheet by Friday."</p>
                    </div>

                    <div style="background: rgba(249, 115, 22, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #f97316; margin-top: 0;">look over / go over</h4>
                        <p style="margin: 0;">= review, check carefully</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Can you <strong>look over</strong> this report before I send it?"</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-forms-1",
                    title: "Practice: Forms & Paperwork",
                    instructions: "Choose the best phrasal verb for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "Please _____ this direct deposit form before Friday.",
                            options: ["fill out", "clock in", "call out", "show up"],
                            expectedAnswer: "fill out",
                        },
                        {
                            type: "select",
                            label: "Please _____ your timesheet by 5 p.m. on Friday.",
                            options: ["turn in", "turn on", "fill in for", "get back"],
                            expectedAnswer: "turn in",
                        },
                        {
                            type: "select",
                            label: "Can you _____ this incident report and check for mistakes?",
                            options: ["look over", "call back", "clock out", "follow up"],
                            expectedAnswer: "look over",
                        },
                    ],
                },
            ],
        },

        {
            id: "communication",
            stepNumber: 5,
            title: "Call Back, Get Back, Follow Up: Communication",
            icon: "📞",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 1rem;">
                        <h4>call back</h4>
                        <p style="margin: 0;">= return a phone call</p>
                        <p style="font-style: italic;">"I'll <strong>call you back</strong> in 10 minutes."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 1rem;">
                        <h4>get back to (someone)</h4>
                        <p style="margin: 0;">= respond later (phone, email, with information)</p>
                        <p style="font-style: italic;">"I'll <strong>get back to you</strong> about the schedule tomorrow."</p>
                    </div>

                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.1);">
                        <h4>follow up (on)</h4>
                        <p style="margin: 0;">= check on progress, send a reminder</p>
                        <p style="font-style: italic;">"I need to <strong>follow up on</strong> that order."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-comm-1",
                    title: "Practice: Communication",
                    instructions: "Choose the best meaning.",
                    items: [
                        {
                            type: "radio",
                            label: "I'll <span class='eg-verb'>get back to you</span> after I talk to the supervisor.",
                            options: [
                                { value: "b", label: "I'll return to the building" },
                                { value: "a", label: "I'll respond later" },
                                { value: "c", label: "I'll give you money back" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "Please <span class='eg-verb'>call me back</span> when you have a minute.",
                            options: [
                                { value: "b", label: "Come back to work" },
                                { value: "c", label: "Call my mother" },
                                { value: "a", label: "Return my phone call" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I'm going to <span class='eg-verb'>follow up</span> tomorrow about the supply order.",
                            options: [
                                { value: "a", label: "Check again / ask for an update" },
                                { value: "b", label: "Walk behind you" },
                                { value: "c", label: "Finish my shift early" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },

        {
            id: "coverage-substitution",
            stepNumber: 6,
            title: "Cover For, Fill In For: Coverage & Substitution",
            icon: "🔄",
            explanation: `
                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4>cover for (someone)</h4>
                        <p style="margin: 0;">= do someone's job temporarily</p>
                        <p style="font-style: italic;">"Can you <strong>cover for me</strong> tomorrow? I have an appointment."</p>
                    </div>

                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4>fill in for (someone)</h4>
                        <p style="margin: 0;">= substitute for someone, do their work</p>
                        <p style="font-style: italic;">"Maria is <strong>filling in for</strong> the manager this week."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-cover-1",
                    title: "Practice: Coverage",
                    instructions: "Choose the best phrasal verb for each sentence.",
                    items: [
                        {
                            type: "select",
                            label: "I'm running late. Can you _____ me at the front desk for 10 minutes?",
                            options: ["cover for", "fill out", "call back", "clock out"],
                            expectedAnswer: "cover for",
                        },
                        {
                            type: "select",
                            label: "Carlos is out this week, so I'm going to _____ him on the morning shift.",
                            options: ["fill in for", "turn in", "call out", "show up"],
                            expectedAnswer: "fill in for",
                        },
                        {
                            type: "select",
                            label: "We're short-staffed today. Can you _____ for an hour?",
                            options: ["help out", "look over", "get back", "clock in"],
                            expectedAnswer: "help out",
                        },
                    ],
                },
            ],
        },

        {
            id: "more-phrasal-verbs",
            stepNumber: 7,
            title: "More Workplace Phrasal Verbs",
            icon: "📚",
            explanation: `
                <p>Here are six more phrasal verbs you'll hear constantly at work:</p>

                <div style="margin: 1.5rem 0;">
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #3b82f6; margin-top: 0;">take on</h4>
                        <p style="margin: 0;">= accept responsibility or extra work</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"I can <strong>take on</strong> that project if you need help."</p>
                    </div>

                    <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #a855f7; margin-top: 0;">deal with</h4>
                        <p style="margin: 0;">= handle a situation or problem</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"HR will <strong>deal with</strong> the complaint."</p>
                    </div>

                    <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #22c55e; margin-top: 0;">set up</h4>
                        <p style="margin: 0;">= arrange, organize, or prepare something</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Can you <strong>set up</strong> the meeting room for the training?"</p>
                    </div>

                    <div style="background: rgba(249, 115, 22, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #f97316; margin-top: 0;">put off</h4>
                        <p style="margin: 0;">= postpone, delay until later</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"We need to <strong>put off</strong> the meeting until next week."</p>
                    </div>

                    <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                        <h4 style="color: #d97757; margin-top: 0;">work out</h4>
                        <p style="margin: 0;">= solve, figure out, or find a solution</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Let's <strong>work out</strong> a schedule that works for everyone."</p>
                    </div>

                    <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <h4 style="color: #7ba884; margin-top: 0;">wrap up</h4>
                        <p style="margin: 0;">= finish, complete, bring to an end</p>
                        <p style="margin: 0.5rem 0 0 0; font-style: italic;">"Let's <strong>wrap up</strong> this meeting - we're out of time."</p>
                    </div>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-more-1",
                    title: "Practice: More Phrasal Verbs",
                    instructions: "Choose the best phrasal verb for each situation.",
                    items: [
                        {
                            type: "select",
                            label: "The team is busy, but Maria agreed to _____ the extra project.",
                            options: ["take on", "put off", "clock in", "call out"],
                            expectedAnswer: "take on",
                        },
                        {
                            type: "select",
                            label: "We can't meet today. Let's _____ the meeting until Friday.",
                            options: ["put off", "wrap up", "fill out", "turn in"],
                            expectedAnswer: "put off",
                        },
                        {
                            type: "select",
                            label: "Can you _____ the conference room before the clients arrive?",
                            options: ["set up", "call back", "look over", "cover for"],
                            expectedAnswer: "set up",
                        },
                        {
                            type: "select",
                            label: "It's almost 5:00. Let's _____ so everyone can go home.",
                            options: ["wrap up", "take on", "deal with", "show up"],
                            expectedAnswer: "wrap up",
                        },
                    ],
                },
            ],
        },

        {
            id: "email-writing",
            stepNumber: 8,
            title: "Professional Email Writing",
            icon: "✉️",
            explanation: `
                <p>Phrasal verbs are everywhere in workplace emails! Learning the right phrases will make your emails sound professional and natural.</p>

                <h3>Common Email Phrases</h3>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <h4 style="color: #3b82f6; margin-top: 0;">Opening an Email</h4>
                    <ul style="margin-bottom: 0;">
                        <li>"I'm <strong>following up on</strong> our conversation yesterday..."</li>
                        <li>"I wanted to <strong>get back to you</strong> about the schedule..."</li>
                        <li>"I'm <strong>reaching out</strong> to ask about..."</li>
                    </ul>
                </div>

                <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <h4 style="color: #22c55e; margin-top: 0;">Making Requests</h4>
                    <ul style="margin-bottom: 0;">
                        <li>"Could you please <strong>fill out</strong> the attached form?"</li>
                        <li>"Please <strong>look over</strong> the report and let me know..."</li>
                        <li>"Can you <strong>set up</strong> a meeting for next week?"</li>
                    </ul>
                </div>

                <div style="background: rgba(168, 85, 247, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h4 style="color: #a855f7; margin-top: 0;">Closing an Email</h4>
                    <ul style="margin-bottom: 0;">
                        <li>"I'll <strong>get back to you</strong> by Friday."</li>
                        <li>"Please <strong>follow up</strong> with me if you have questions."</li>
                        <li>"Let me know if we need to <strong>work out</strong> a different time."</li>
                    </ul>
                </div>

                <h3>Example Email 1: Following Up</h3>
                <div style="background: white; border: 1px solid #ddd; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; font-family: monospace; font-size: 0.9rem;">
                    <p style="margin: 0;"><strong>Subject:</strong> Following up on supply order</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 0.5rem 0;">
                    <p style="margin: 0.5rem 0;">Hi Maria,</p>
                    <p style="margin: 0.5rem 0;">I'm <strong>following up on</strong> the supply order from last week. Have you had a chance to <strong>look over</strong> the list?</p>
                    <p style="margin: 0.5rem 0;">Please <strong>get back to me</strong> by Thursday so I can <strong>set up</strong> the delivery.</p>
                    <p style="margin: 0.5rem 0;">Thanks,<br>Carlos</p>
                </div>

                <h3>Example Email 2: Requesting Time Off</h3>
                <div style="background: white; border: 1px solid #ddd; border-radius: 0.5rem; padding: 1rem; font-family: monospace; font-size: 0.9rem;">
                    <p style="margin: 0;"><strong>Subject:</strong> Time off request - Friday</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 0.5rem 0;">
                    <p style="margin: 0.5rem 0;">Hi Ms. Johnson,</p>
                    <p style="margin: 0.5rem 0;">I need to request time off on Friday for a doctor's appointment. I've already asked Ana, and she can <strong>cover for</strong> me during the morning shift.</p>
                    <p style="margin: 0.5rem 0;">Please let me know if I need to <strong>fill out</strong> any forms. I'll <strong>get back to you</strong> if anything changes.</p>
                    <p style="margin: 0.5rem 0;">Thank you,<br>David</p>
                </div>
            `,
            tipBox: {
                title: "💡 Email Tip",
                content: "In professional emails, phrasal verbs are perfectly acceptable! They sound natural and friendly. Using them correctly shows you understand workplace communication.",
            },
            exercises: [
                {
                    id: "workplace-pv-email-1",
                    title: "Practice: Email Phrases",
                    instructions: "Choose the best phrasal verb for each email sentence.",
                    items: [
                        {
                            type: "select",
                            label: "I'm _____ our conversation from Monday about the schedule change.",
                            options: ["following up on", "clocking in", "calling out", "turning in"],
                            expectedAnswer: "following up on",
                        },
                        {
                            type: "select",
                            label: "Could you please _____ the attached timesheet and submit it by Friday?",
                            options: ["fill out", "call back", "show up", "wrap up"],
                            expectedAnswer: "fill out",
                        },
                        {
                            type: "select",
                            label: "I'll _____ you tomorrow with more information about the training.",
                            options: ["get back to", "cover for", "deal with", "take on"],
                            expectedAnswer: "get back to",
                        },
                        {
                            type: "select",
                            label: "Please _____ the safety report before sending it to the manager.",
                            options: ["look over", "clock out", "call out", "help out"],
                            expectedAnswer: "look over",
                        },
                    ],
                },
                {
                    id: "workplace-pv-email-compose",
                    title: "✉️ Write Your Own Email",
                    instructions: "Complete this email to your manager. You need to request next Monday off and explain that a coworker will cover for you. Use the phrasal verbs you learned!",
                    items: [
                        {
                            type: "select",
                            label: "<div style='background: #f6f8fc; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; max-width: 500px; border: 1px solid #dadce0;'><div style='background: #fff; padding: 12px 16px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; gap: 8px;'><span style='color: #c5221f; font-weight: bold; font-size: 20px;'>✉️</span><span style='color: #202124; font-weight: 500;'>New Message</span></div><div style='padding: 12px 16px; border-bottom: 1px solid #ebebeb;'><span style='color: #5f6368; font-size: 13px;'>To:</span> <span style='color: #202124;'>manager@company.com</span></div><div style='padding: 12px 16px; border-bottom: 1px solid #ebebeb;'><span style='color: #5f6368; font-size: 13px;'>Subject:</span> <span style='color: #202124;'>Time off request - Monday</span></div><div style='padding: 16px; background: #fff; min-height: 120px;'><p style='margin: 0 0 12px 0; color: #202124;'>Hi Ms. Chen,</p><p style='margin: 0 0 12px 0; color: #202124;'>I'm <strong>_____</strong> to request next Monday off for a family event.</p></div></div>",
                            options: ["reaching out", "clocking in", "showing up", "wrapping up"],
                            expectedAnswer: "reaching out",
                        },
                        {
                            type: "select",
                            label: "<div style='background: #fff; padding: 0 16px; font-family: Arial, sans-serif; max-width: 500px; border-left: 1px solid #dadce0; border-right: 1px solid #dadce0;'><p style='margin: 0 0 12px 0; color: #202124;'>I've already talked to James, and he said he can <strong>_____</strong> me that day.</p></div>",
                            options: ["cover for", "call out", "clock in", "turn in"],
                            expectedAnswer: "cover for",
                        },
                        {
                            type: "select",
                            label: "<div style='background: #fff; padding: 0 16px; font-family: Arial, sans-serif; max-width: 500px; border-left: 1px solid #dadce0; border-right: 1px solid #dadce0;'><p style='margin: 0 0 12px 0; color: #202124;'>Please let me know if I need to <strong>_____</strong> any paperwork.</p></div>",
                            options: ["fill out", "look out", "help out", "work out"],
                            expectedAnswer: "fill out",
                        },
                        {
                            type: "select",
                            label: "<div style='background: #fff; padding: 0 16px 16px 16px; font-family: Arial, sans-serif; max-width: 500px; border-left: 1px solid #dadce0; border-right: 1px solid #dadce0; border-bottom: 1px solid #dadce0; border-radius: 0 0 8px 8px;'><p style='margin: 0 0 12px 0; color: #202124;'>I'll <strong>_____</strong> you if anything changes.</p><p style='margin: 16px 0 0 0; color: #202124;'>Thank you,<br>Sofia</p><div style='margin-top: 16px; padding-top: 12px; border-top: 1px solid #ebebeb;'><button style='background: #1a73e8; color: white; border: none; padding: 8px 24px; border-radius: 4px; font-weight: 500; cursor: pointer;'>Send</button></div></div>",
                            options: ["get back to", "deal with", "take on", "set up"],
                            expectedAnswer: "get back to",
                        },
                    ],
                },
            ],
        },

        {
            id: "workplace-dialogues",
            stepNumber: 9,
            title: "Workplace Dialogues",
            icon: "💬",
            explanation: `
                <p>Read these real workplace conversations and notice how phrasal verbs are used naturally.</p>

                <h3>Dialogue 1: Calling In Sick</h3>
                <div style="background: rgba(200, 107, 81, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager (on phone):</strong> Good morning, this is Sarah.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 David:</strong> Hi Sarah, this is David. I'm sorry, but I need to <strong>call in sick</strong> today. I have a bad cold.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> I'm sorry to hear that. Can anyone <strong>cover for</strong> you?</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 David:</strong> I already texted Maria. She said she can <strong>fill in for</strong> me on the morning shift.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> Great, thanks for <strong>working that out</strong>. Feel better! I'll <strong>get back to you</strong> if I have any questions.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 David:</strong> Thanks, Sarah. I'll <strong>follow up</strong> later today about tomorrow's shift.</p>
                </div>

                <h3>Dialogue 2: Asking a Coworker for Help</h3>
                <div style="background: rgba(110, 145, 118, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="margin: 0.25rem 0;"><strong>🔵 Ana:</strong> Hey Carlos, can I ask you something?</p>
                    <p style="margin: 0.25rem 0;"><strong>🟢 Carlos:</strong> Sure, what's up?</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 Ana:</strong> I have a doctor's appointment next Thursday. Could you <strong>cover for</strong> me for a couple hours?</p>
                    <p style="margin: 0.25rem 0;"><strong>🟢 Carlos:</strong> What time? I might be able to <strong>help out</strong>.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 Ana:</strong> From 2 to 4. I can <strong>take on</strong> your Saturday morning shift in exchange.</p>
                    <p style="margin: 0.25rem 0;"><strong>🟢 Carlos:</strong> That works! Let's <strong>work out</strong> the details later. I need to <strong>wrap up</strong> this report first.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔵 Ana:</strong> Thanks so much! I'll <strong>follow up</strong> with you at lunch.</p>
                </div>

                <h3>Dialogue 3: Manager Checking on a Project</h3>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem;">
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> Hi Nina, I'm <strong>following up on</strong> the inventory report. How's it going?</p>
                    <p style="margin: 0.25rem 0;"><strong>🟣 Nina:</strong> I'm almost done. I just need to <strong>look over</strong> the final numbers.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> Great. When do you think you can <strong>turn it in</strong>?</p>
                    <p style="margin: 0.25rem 0;"><strong>🟣 Nina:</strong> I should be able to <strong>wrap it up</strong> by 3:00.</p>
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> Perfect. Oh, and there was an issue with a vendor. Can you <strong>deal with</strong> that after?</p>
                    <p style="margin: 0.25rem 0;"><strong>🟣 Nina:</strong> Sure, I can <strong>take that on</strong>. Should I <strong>get back to you</strong> when it's resolved?</p>
                    <p style="margin: 0.25rem 0;"><strong>🔴 Manager:</strong> Yes, please. Thanks, Nina!</p>
                </div>
            `,
            exercises: [
                {
                    id: "workplace-pv-dialogue-1",
                    title: "Dialogue Comprehension",
                    instructions: "Answer based on the dialogues above.",
                    items: [
                        {
                            type: "radio",
                            label: "In Dialogue 1, who will 'fill in for' David?",
                            options: [
                                { value: "a", label: "Sarah (the manager)" },
                                { value: "b", label: "Maria" },
                                { value: "c", label: "No one" },
                            ],
                            expectedAnswer: "b",
                        },
                        {
                            type: "radio",
                            label: "In Dialogue 2, what does Ana offer to do in exchange for coverage?",
                            options: [
                                { value: "b", label: "Fill out his timesheet" },
                                { value: "c", label: "Call in sick for him" },
                                { value: "a", label: "Take on Carlos's Saturday shift" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "In Dialogue 3, when will Nina 'wrap up' the report?",
                            options: [
                                { value: "b", label: "By 3:00 today" },
                                { value: "a", label: "Tomorrow morning" },
                                { value: "c", label: "Next week" },
                            ],
                            expectedAnswer: "b",
                        },
                    ],
                },
            ],
        },

        {
            id: "summary",
            title: "Quick Reference: Essential Workplace Phrasal Verbs",
            icon: "📋",
            explanation: `
                <h3>Time & Attendance</h3>
                <ul>
                    <li><strong>clock in/out</strong> - record arrival/departure</li>
                    <li><strong>call out</strong> - notify you can't work (sick)</li>
                    <li><strong>show up</strong> - arrive, appear</li>
                </ul>

                <h3>Forms & Paperwork</h3>
                <ul>
                    <li><strong>fill out/in</strong> - complete a form</li>
                    <li><strong>turn in</strong> - submit, hand in</li>
                    <li><strong>look over</strong> - review, check</li>
                </ul>

                <h3>Communication</h3>
                <ul>
                    <li><strong>call back</strong> - return a phone call</li>
                    <li><strong>get back to</strong> - respond later</li>
                    <li><strong>follow up</strong> - check on progress</li>
                </ul>

                <h3>Coverage & Help</h3>
                <ul>
                    <li><strong>cover for</strong> - do someone's job temporarily</li>
                    <li><strong>fill in for</strong> - substitute for someone</li>
                    <li><strong>help out</strong> - assist</li>
                </ul>

                <h3>Tasks & Projects</h3>
                <ul>
                    <li><strong>take on</strong> - accept responsibility/work</li>
                    <li><strong>deal with</strong> - handle a situation</li>
                    <li><strong>set up</strong> - arrange, organize, prepare</li>
                    <li><strong>put off</strong> - postpone, delay</li>
                    <li><strong>work out</strong> - solve, figure out</li>
                    <li><strong>wrap up</strong> - finish, complete</li>
                </ul>

                <h3>Form Pattern (V1, V1-3rd, V1-ing, V2, V3)</h3>
                <ul>
                    <li><strong>call out</strong> → call out / calls out / calling out / called out / called out</li>
                    <li><strong>clock in</strong> → clock in / clocks in / clocking in / clocked in / clocked in</li>
                    <li><strong>fill out</strong> → fill out / fills out / filling out / filled out / filled out</li>
                    <li><strong>turn in</strong> → turn in / turns in / turning in / turned in / turned in</li>
                </ul>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>❌ "Fill the form" → ✅ "Fill out the form"</li>
                    <li>❌ "I will call you again" → ✅ "I'll call you back"</li>
                    <li>❌ "Clock yourself" → ✅ "Clock in/out"</li>
                    <li>❌ "Let's finish up" → ✅ "Let's wrap up"</li>
                    <li>❌ "I'll respond you" → ✅ "I'll get back to you"</li>
                    <li>❌ "I have call out sick" → ✅ "I have called out sick"</li>
                </ul>
            `,
            tipBox: {
                title: "💡 Learning Tip",
                content: "Don't try to translate phrasal verbs word-by-word! Learn them as complete phrases. Practice using them in sentences until they feel natural.",
            },
            exercises: [
                {
                    id: "workplace-pv-summary-1",
                    title: "Quick Review",
                    instructions: "Choose the best phrasal verb.",
                    items: [
                        {
                            type: "select",
                            label: "You need to respond later: I'll _____ you tomorrow.",
                            options: ["get back to", "fill out", "clock out", "turn in"],
                            expectedAnswer: "get back to",
                        },
                        {
                            type: "select",
                            label: "You missed a call: Please _____ when you can.",
                            options: ["call back", "call out", "look over", "show up"],
                            expectedAnswer: "call back",
                        },
                        {
                            type: "select",
                            label: "Choose the correct V3 form: 'I have already _____ my report.'",
                            options: ["turned in", "turning in", "turn in", "turns in"],
                            expectedAnswer: "turned in",
                        },
                    ],
                },
            ],
        },
    ],

    // Mini Quiz (20 questions)
    miniQuiz: [
        {
            id: "quiz-1",
            question: "What does 'clock in' mean?",
            options: [
                { value: "a", label: "Check the time" },
                { value: "b", label: "Record your arrival at work" },
                { value: "c", label: "Fix a clock" },
            ],
            correctAnswer: "b",
            explanation:
                "'Clock in' (or 'punch in') means to record your arrival time at work, usually using a time clock or computer system.",
            skillTag: "pv-clock-in-record-arrival",
            difficulty: "easy",
        },
        {
            id: "quiz-2",
            question: "Complete: 'I have already ___ this onboarding form.'",
            options: [
                { value: "a", label: "fill out" },
                { value: "c", label: "filling out" },
                { value: "b", label: "filled out" },
            ],
            correctAnswer: "b",
            explanation:
                "After 'have', use the V3 form: 'filled out.' The base phrasal verb is 'fill out.'",
            skillTag: "pv-fill-out-complete-form",
            difficulty: "easy",
        },
        {
            id: "quiz-3",
            question: "If you 'cover for' someone, you:",
            options: [
                { value: "b", label: "Do their job temporarily" },
                { value: "a", label: "Hide them" },
                { value: "c", label: "Pay for them" },
            ],
            correctAnswer: "b",
            explanation: "'Cover for someone' means to do their work or take their shift while they're absent.",
            skillTag: "pv-cover-for-substitute",
            difficulty: "easy",
        },
        {
            id: "quiz-4",
            question: "In many office/HR policies, which phrase is most specific to illness?",
            options: [
                { value: "a", label: "Call out" },
                { value: "b", label: "Call in sick" },
                { value: "c", label: "Call back" },
            ],
            correctAnswer: "b",
            explanation:
                "'Call in sick' explicitly means illness. 'Call out' is very common in shift-based industries and can mean reporting any urgent absence. Outside attendance contexts, 'call out' can also mean criticize publicly.",
            skillTag: "pv-call-out-call-in-sick",
            difficulty: "medium",
        },
        {
            id: "quiz-5",
            question: "Complete: 'Before you leave, make sure you ___.'",
            options: [
                { value: "a", label: "clock in" },
                { value: "c", label: "call out" },
                { value: "b", label: "clock out" },
            ],
            correctAnswer: "b",
            explanation: "'Clock out' (or 'punch out') means to record the time you leave work.",
            skillTag: "pv-clock-out-record-departure",
            difficulty: "easy",
        },
        {
            id: "quiz-6",
            question: "What does 'turn in' mean in 'Turn in your timesheet'?",
            options: [
                { value: "a", label: "Submit it to the right person/system" },
                { value: "b", label: "Turn it over on the table" },
                { value: "c", label: "Throw it away" },
            ],
            correctAnswer: "a",
            explanation: "'Turn in' means to submit something (a form, a timesheet, a document).",
            skillTag: "pv-turn-in-submit",
            difficulty: "easy",
        },
        {
            id: "quiz-7",
            question: "Complete: 'Can you ___ this email before I send it to HR?'",
            options: [
                { value: "b", label: "look up" },
                { value: "a", label: "look over" },
                { value: "c", label: "look out" },
            ],
            correctAnswer: "a",
            explanation: "'Look over' means to review something carefully for mistakes or details.",
            skillTag: "pv-look-over-review",
            difficulty: "medium",
        },
        {
            id: "quiz-8",
            question: "If you missed a call, you can say: 'I'll ___ in a few minutes.'",
            options: [
                { value: "a", label: "call out" },
                { value: "c", label: "call in sick" },
                { value: "b", label: "call back" },
            ],
            correctAnswer: "b",
            explanation: "'Call back' means to return a phone call.",
            skillTag: "pv-call-back-return-call",
            difficulty: "easy",
        },
        {
            id: "quiz-9",
            question: "What does 'follow up on' mean?",
            options: [
                { value: "a", label: "Check again / ask for an update" },
                { value: "b", label: "Walk behind someone" },
                { value: "c", label: "Leave work early" },
            ],
            correctAnswer: "a",
            explanation:
                "'Follow up on' means to check the status (a request, an order, an email) and ask what happened.",
            skillTag: "pv-follow-up-check-status",
            difficulty: "medium",
        },
        {
            id: "quiz-10",
            question: "Complete: 'Sorry I'm late. Thanks for ___ me.'",
            options: [
                { value: "b", label: "filling out" },
                { value: "a", label: "covering for" },
                { value: "c", label: "turning in" },
            ],
            correctAnswer: "a",
            explanation:
                "'Cover for' means to do someone's job temporarily while they are away (for example, answer the phone or help customers).",
            skillTag: "pv-cover-for-substitute",
            difficulty: "easy",
        },
        {
            id: "quiz-11",
            question: "Complete: 'Nina is ___ the manager this week.'",
            options: [
                { value: "b", label: "turning in" },
                { value: "c", label: "calling back" },
                { value: "a", label: "filling in for" },
            ],
            correctAnswer: "a",
            explanation:
                "'Fill in for someone' means to substitute for them (often for a longer shift or several days).",
            skillTag: "pv-fill-in-for-substitute",
            difficulty: "medium",
        },
        {
            id: "quiz-12",
            question: "What does 'help out' mean?",
            options: [
                { value: "a", label: "Assist, especially when things are busy" },
                { value: "b", label: "Quit your job" },
                { value: "c", label: "Get paid extra automatically" },
            ],
            correctAnswer: "a",
            explanation: "'Help out' means to assist, especially when a place is busy or short-staffed.",
            skillTag: "pv-help-out-assist",
            difficulty: "easy",
        },
        {
            id: "quiz-13",
            question: "Complete: 'I don't know yet, but I'll ___ you by the end of the day.'",
            options: [
                { value: "b", label: "get back" },
                { value: "a", label: "get back to" },
                { value: "c", label: "get up" },
            ],
            correctAnswer: "a",
            explanation:
                "Use 'get back to + person' when you will reply later: 'I'll get back to you.'",
            skillTag: "pv-get-back-to-respond-later",
            difficulty: "medium",
        },
        {
            id: "quiz-14",
            question: "Complete: 'I'm sick, so I can't ___ for my shift today.'",
            options: [
                { value: "b", label: "fill out" },
                { value: "c", label: "turn in" },
                { value: "a", label: "show up" },
            ],
            correctAnswer: "a",
            explanation: "'Show up' means to arrive. If you're sick, you can't show up for your shift.",
            skillTag: "pv-show-up-arrive",
            difficulty: "easy",
        },
        {
            id: "quiz-15",
            question: "What does 'take on' mean in 'Can you take on this project?'",
            options: [
                { value: "b", label: "Accept responsibility for it" },
                { value: "a", label: "Fight against it" },
                { value: "c", label: "Put it somewhere" },
            ],
            correctAnswer: "b",
            explanation: "'Take on' means to accept responsibility or additional work.",
            skillTag: "pv-take-on-accept-work",
            difficulty: "medium",
        },
        {
            id: "quiz-16",
            question: "Complete: 'We can't meet today. Let's ___ the meeting until next week.'",
            options: [
                { value: "b", label: "put in" },
                { value: "a", label: "put off" },
                { value: "c", label: "put up" },
            ],
            correctAnswer: "a",
            explanation: "'Put off' means to postpone or delay something until later.",
            skillTag: "pv-put-off-postpone",
            difficulty: "medium",
        },
        {
            id: "quiz-17",
            question: "What does 'set up' mean in 'Can you set up the meeting room?'",
            options: [
                { value: "a", label: "Clean it" },
                { value: "c", label: "Lock it" },
                { value: "b", label: "Arrange and prepare it" },
            ],
            correctAnswer: "b",
            explanation:
                "'Set up' means to arrange, organize, or prepare something (a room, a meeting, equipment).",
            skillTag: "pv-set-up-arrange",
            difficulty: "medium",
        },
        {
            id: "quiz-18",
            question: "Complete: 'It's almost 5:00. Let's ___ so everyone can leave on time.'",
            options: [
                { value: "a", label: "wrap up" },
                { value: "b", label: "wrap in" },
                { value: "c", label: "work in" },
            ],
            correctAnswer: "a",
            explanation:
                "'Wrap up' means to finish or complete something, often used for meetings or tasks.",
            skillTag: "pv-wrap-up-finish",
            difficulty: "easy",
        },
        {
            id: "quiz-19",
            question: "What does 'deal with' mean in 'HR will deal with the complaint'?",
            options: [
                { value: "a", label: "Ignore it" },
                { value: "b", label: "Handle it / take care of it" },
                { value: "c", label: "Create it" },
            ],
            correctAnswer: "b",
            explanation:
                "'Deal with' means to handle a situation, problem, or person (for example, a complaint or conflict).",
            skillTag: "pv-deal-with-handle-problem",
            difficulty: "medium",
        },
        {
            id: "quiz-20",
            question: "Complete: 'Let's ___ a schedule that works for everyone.'",
            options: [
                { value: "b", label: "work in" },
                { value: "c", label: "work up" },
                { value: "a", label: "work out" },
            ],
            correctAnswer: "a",
            explanation:
                "'Work out' means to solve, figure out, or find a solution that works for everyone.",
            skillTag: "pv-work-out-solve-plan",
            difficulty: "medium",
        },
    ],
    /*
    TEACHER DIAGNOSTIC NOTES – Workplace Phrasal Verbs Mini Quiz

    This mini quiz checks whether students can:
    - Understand core workplace phrasal verbs for time and attendance (clock in/out, call out, show up).
    - Use common phrasal verbs for forms and paperwork (fill out, turn in, look over).
    - Understand key communication phrasal verbs (call back, get back to, follow up on).
    - Recognize coverage and help verbs (cover for, fill in for, help out).
    - Understand project and task verbs (take on, put off, set up, wrap up, deal with, work out).

    Skill tags:

    Time & attendance
    - pv-clock-in-record-arrival
    - pv-clock-out-record-departure
    - pv-call-out-call-in-sick
    - pv-show-up-arrive

    Forms & paperwork
    - pv-fill-out-complete-form
    - pv-turn-in-submit
    - pv-look-over-review

    Communication
    - pv-call-back-return-call
    - pv-get-back-to-respond-later
    - pv-follow-up-check-status

    Coverage & help
    - pv-cover-for-substitute
    - pv-fill-in-for-substitute
    - pv-help-out-assist

    Tasks & projects
    - pv-take-on-accept-work
    - pv-put-off-postpone
    - pv-set-up-arrange
    - pv-wrap-up-finish
    - pv-deal-with-handle-problem
    - pv-work-out-solve-plan

    How to read the diagnostics:
    - If time & attendance tags are weak (pv-clock-in-record-arrival, pv-clock-out-record-departure, pv-call-out-call-in-sick, pv-show-up-arrive) →
      Rebuild the core phrases with real workplace routines:
      • clock in / clock out with a simple daily schedule (What time do you clock in? What time do you clock out?).
      • call out / call in sick with phone-call role plays.
      • show up for + shift / meeting (show up late, show up early).
      Use short dialogues and simple policy sentences from students' real jobs.

    - If forms & paperwork tags are weak (pv-fill-out-complete-form, pv-turn-in-submit, pv-look-over-review) →
      Practice the full phrases, not single words:
      • fill out / fill in + application, form, timesheet.
      • turn in + timesheet, report, homework.
      • look over + form, report, email.
      Give students sample forms to fill out, then turn in, then look over for mistakes in pairs.

    - If communication tags are weak (pv-call-back-return-call, pv-get-back-to-respond-later, pv-follow-up-check-status) →
      Build a mini email and phone script bank:
      • I'll call you back in 10 minutes.
      • I'll get back to you tomorrow.
      • I'm following up on the schedule / order / email.
      Have students match sentences to meanings, then rewrite real messages from their jobs using these phrases.

    - If coverage & help tags are weak (pv-cover-for-substitute, pv-fill-in-for-substitute, pv-help-out-assist) →
      Focus on schedules and coverage conversations:
      • Can you cover for me on Friday?
      • Maria is filling in for the manager this week.
      • Can you help out for an hour? We're very busy.
      Use shift charts and have students practice asking and answering about coverage.

    - If tasks & projects tags are weak (pv-take-on-accept-work, pv-put-off-postpone, pv-set-up-arrange, pv-wrap-up-finish, pv-deal-with-handle-problem, pv-work-out-solve-plan) →
      Connect phrasal verbs to real work tasks:
      • take on a project / extra shift.
      • put off a meeting until next week.
      • set up a room / call / Zoom meeting.
      • wrap up a meeting / shift / report.
      • deal with a complaint / problem / customer.
      • work out a schedule / solution / plan.
      Have students sort example sentences into categories (schedule, meetings, customer problems, projects) and then write their own.

    Suggested use:
    - Use this mini quiz after students have:
      • Met the phrasal verbs in dialogues, policies, and email examples.
      • Practiced them in controlled exercises (select, match, fill-in).
      • Tried them in role-plays for calling in sick, asking for coverage, and talking to managers.
    - At the class level:
      • If time & attendance is red, spend more time on real company rules (clock in/out times, call-out procedures).
      • If forms & paperwork is red, bring real or sample forms and walk through fill out → look over → turn in as a three-step routine.
      • If communication is red, assign short email and phone scripts that recycle call back, get back to, follow up.
      • If coverage & help is red, run partner activities where students negotiate coverage and help out for different shifts.
      • If tasks & projects is red, use weekly-planning activities where students choose which tasks to take on, put off, set up, and wrap up, then share their plans using the target verbs.
    */
};
