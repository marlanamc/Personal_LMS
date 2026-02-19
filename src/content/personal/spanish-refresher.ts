import type { InteractiveGuideContent } from "@/types/activity";

export const spanishRefresherContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        {
            id: "greetings",
            title: "¡Hola! Greetings & Basics",
            icon: "👋",
            explanation: `
                <h3>Start with the Basics</h3>
                <p>Spanish greetings vary by time of day. Here's a quick refresher:</p>
                <ul>
                    <li><strong>¡Hola!</strong> - Hello</li>
                    <li><strong>Buenos días</strong> - Good morning</li>
                    <li><strong>Buenas tardes</strong> - Good afternoon</li>
                    <li><strong>Buenas noches</strong> - Good evening/night</li>
                </ul>
            `,
            exercises: [
                {
                    id: "spanish-greet-1",
                    title: "Quick Match",
                    instructions: "How do you say 'Good morning' in Spanish?",
                    items: [
                        {
                            type: "radio",
                            label: "Good morning is...",
                            options: [
                                { value: "hola", label: "¡Hola!" },
                                { value: "buenos-dias", label: "Buenos días" },
                                { value: "buenas-noches", label: "Buenas noches" },
                            ],
                            expectedAnswer: "buenos-dias",
                        },
                    ],
                },
            ],
        },
        {
            id: "core-verbs",
            title: "Core Verbs (Present Tense)",
            icon: "✍️",
            explanation: `
                <h3>Common -AR Verbs</h3>
                <p>Recall the basic conjugation for -AR verbs like <strong>Hablar</strong> (to speak):</p>
                <ul>
                    <li>(Yo) <strong>hablo</strong></li>
                    <li>(Tú) <strong>hablas</strong></li>
                    <li>(Él/Ella/Usted) <strong>habla</strong></li>
                    <li>(Nosotros) <strong>hablamos</strong></li>
                    <li>(Ellos/Ellas/Ustedes) <strong>hablan</strong></li>
                </ul>
            `,
            exercises: [
                {
                    id: "spanish-verb-1",
                    title: "Fill in the Blank",
                    instructions: "Conjugate 'Hablar' for 'Yo'.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ___ español un poco.",
                            expectedAnswer: "hablo",
                        },
                    ],
                },
            ],
        },
    ],
};
