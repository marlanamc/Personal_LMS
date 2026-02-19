import type { InteractiveGuideContent } from "@/types/activity";

export const articlesCommunityResourcesContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "intro",
            title: "Articles & References for Community Resources",
            icon: "🏘️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(248, 113, 113, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%); padding: 1.25rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                    <p style="margin-bottom: 0.5rem;">Articles (a/an/the) tell listeners whether you are naming something general or something specific. When you describe housing, jobs, or health services in East Boston, strong article choices keep your message sharp.</p>
                    <p style="margin: 0;">Think of articles as pointers: they guide the listener to the right person, place, or service.</p>
                </div>
                <ul style="margin-top: 0; padding-left: 1.2rem;">
                    <li>New housing leads to “a counselor” (any counselor) vs “the counselor” (the one you already met).</li>
                    <li>Job meetings may need “a resume” (any file) vs “the resume I finished” (specific).</li>
                    <li>Health clinics often use zero article (“We go to clinic events”).</li>
                </ul>
            `,
            tipBox: {
                title: "📌 Community Insight",
                content: "When you mention a service once, choose a/an. If you mention it again or everyone knows it, use the. Drop the article for plural/general words (community events, job fairs).",
            },
        },
        {
            id: "indefinite-vs-definite",
            stepNumber: 1,
            title: "Indefinite vs. Definite vs. Zero Articles",
            icon: "📌",
            explanation: `
                <h3 style="margin-top: 0;">Indefinite (a/an)</h3>
                <p>Use when you introduce something new or mean any example.</p>
                <h3>Definite (the)</h3>
                <p>Use when both people know the exact item.</p>
                <h3>Zero Article</h3>
                <p>Drop the article for plural/general nouns or abstract services.</p>
                <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
                    <li>“I visited <strong>a</strong> community center.”</li>
                    <li>“<strong>The</strong> center has free ESOL classes.”</li>
                    <li>“I love <strong>(no article)</strong> community events.”</li>
                </ul>
            `,
            exercises: [
                {
                    id: "articles-1",
                    title: "Select the Right Article",
                    instructions: "Choose a/an/the/zero to complete the sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I saw ___ counselor at the clinic yesterday.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We need ___ translator for the housing meeting.",
                            options: [
                                { value: "an", label: "an" },
                                { value: "zero", label: "(no article)" },
                                { value: "a", label: "a" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "proper-abstract",
            stepNumber: 2,
            title: "Proper Names, Abstract Nouns, and Zero Article",
            icon: "🗺️",
            explanation: `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #2563eb;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">The + unique place</p>
                        <p style="margin: 0;">"The East Boston Branch Library" is unique and needs the.</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #059669;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Zero + general service</p>
                        <p style="margin: 0;">"We look for work at community centers" (plural/general → no article).</p>
                    </div>
                    <div style="padding: 0.75rem; border-radius: 0.5rem; background: rgba(248, 113, 113, 0.08); border-left: 4px solid #ef4444;">
                        <p style="margin: 0 0 0.2rem; font-weight: 600;">Abstract nouns + the</p>
                        <p style="margin: 0;">"The safety of my family is a priority."</p>
                    </div>
                </div>
                <p style="margin-top: 0.75rem;">Use the article that matches whether you point to a specific landmark, a general service, or a known idea.</p>
            `,
            tipBox: {
                title: "💬 Try This",
                content: "Before you say it, ask: does the listener know which place/service I mean? If yes, use the; if not, start with a/an or nothing.",
            },
            exercises: [
                {
                    id: "proper-abstract-1",
                    title: "Choose Article Type",
                    instructions: "Select the correct article for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I go to ___ East Boston Branch Library.",
                            options: [
                                { value: "the", label: "the" },
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We look for work at ___ community centers.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "___ safety of my family is important.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "the",
                        },
                    ],
                },
            ],
        },
        {
            id: "practice",
            stepNumber: 3,
            title: "Practice with East Boston Contexts",
            icon: "📖",
            explanation: `
                <p>Think about whether you introduced the item before or if everyone knows which one you mean. Ask yourself: is it a specific service, a general type, or a mass idea?</p>
            `,
            exercises: [
                {
                    id: "articles-2",
                    title: "Choose the Article",
                    instructions: "Fill in the blanks with a/an/the/(no article).",
                    items: [
                        {
                            type: "radio",
                            label: "___ bus to Maverick leaves every 20 minutes.",
                            options: [
                                { value: "the", label: "the" },
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We joined ___ volunteer group after the class.",
                            options: [
                                { value: "an", label: "an" },
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "I want ___ job that lets me work from home.",
                            options: [
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                                { value: "a", label: "a" },
                            ],
                            expectedAnswer: "a",
                        },
                    ],
                },
            ],
        },
        {
            id: "mini-quiz",
            title: "📝 Mini Quiz: Articles Mastery",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin-top: 0; color: #059669;">Test Your Articles Knowledge!</h3>
                    <p style="margin-bottom: 0;">This quick quiz covers everything you learned about articles. Choose the best article (a/an/the/no article) for each sentence.</p>
                </div>
            `,
            exercises: [
                {
                    id: "articles-quiz",
                    title: "Mini Quiz: Articles in Community Contexts",
                    instructions: "Choose the best article (a/an/the/(no article)) for each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "I need to find ___ job that pays well.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "a",
                        },
                        {
                            type: "radio",
                            label: "___ manager I spoke to was very helpful.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We attend ___ community meetings every month.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "She is looking for ___ apartment near ___ T station.",
                            options: [
                                { value: "an-the", label: "an / the" },
                                { value: "a-the", label: "a / the" },
                                { value: "the-a", label: "the / a" },
                            ],
                            expectedAnswer: "an-the",
                        },
                        {
                            type: "radio",
                            label: "I went to ___ community center on Meridian Street. ___ center offers free childcare.",
                            options: [
                                { value: "the-the", label: "the / the" },
                                { value: "a-the", label: "a / the" },
                                { value: "zero-the", label: "(no article) / the" },
                            ],
                            expectedAnswer: "a-the",
                        },
                        {
                            type: "radio",
                            label: "___ housing office can help you with your application.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "zero", label: "(no article)" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "the",
                        },
                        {
                            type: "radio",
                            label: "We learned about ___ tenants' rights in class.",
                            options: [
                                { value: "zero", label: "(no article)" },
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                            ],
                            expectedAnswer: "zero",
                        },
                        {
                            type: "radio",
                            label: "I have an appointment at ___ East Boston Neighborhood Health Center.",
                            options: [
                                { value: "a", label: "a" },
                                { value: "the", label: "the" },
                                { value: "zero", label: "(no article)" },
                            ],
                            expectedAnswer: "the",
                        },
                    ],
                },
            ],
        },
        /*
        TEACHER DIAGNOSTIC NOTES – Articles & Community Resources Mini Quiz

        This mini quiz checks whether students can:
        - Choose a vs the vs zero for jobs, services, and community spaces.
        - Use first mention vs second mention correctly.
        - Recognize when a place is unique and needs the.

        Question focus:
        - Q1: "a job" → Indefinite article with singular, countable noun (any job, not specific).
        - Q2: "the manager" → Definite article for a specific person already identified by the phrase "I spoke to".
        - Q3: zero article with plural, general noun ("community meetings") for habits/routines.
        - Q4: "an apartment / the T station" → Indefinite for any apartment; definite for the specific, known T station.
        - Q5: "a community center / the center" → First mention = a; second mention = the (now specific and shared).
        - Q6: "the housing office" → Unique local service (the main housing office students already know about).
        - Q7: zero article with abstract/general concept ("tenants' rights") in a general statement.
        - Q8: "the East Boston Neighborhood Health Center" → Proper name of a unique place with the.

        How to use results:
        - If Q1 and Q2 are weak → Revisit the difference between a/an (new/any) and the (known/specific). Use simple job and counselor examples.
        - If Q3 and Q7 are weak → Practice zero article with plural/general nouns and abstract ideas (community events, health information, tenants' rights).
        - If Q4 and Q5 are weak → Do a short story drill: first line with a/an, second line with the for the same noun.
        - If Q6 and Q8 are weak → Review unique local places (the housing office, the East Boston Branch Library, the EBNHC) and why they take the.

        Suggested follow-up:
        - Have students write 3–4 sentences about real East Boston services using a/an, the, and zero, then underline the article choices and explain why.
        */
    ],
};
