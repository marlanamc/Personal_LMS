import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPreteriteTenseContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Spanish Preterite Tense: Talking About the Past",
            icon: "⏱️",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">The preterite is how you tell stories about the past. "Ayer fui al cine." "Comí pizza para almuerzo." "¿Qué hiciste el fin de semana?" These are the conversations you'll have with Spanish speakers!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>The preterite tense is essential for talking about completed past actions. Once you master this tense, you can tell stories, share experiences, and talk about your day in Spanish.</p>
            `,
            exercises: [
                {
                    id: "spr-intro-1",
                    title: "Quick Check: Preterite Recognition",
                    instructions: "Which sentence is in the preterite tense?",
                    items: [
                        {
                            type: "radio",
                            label: "Which is preterite?",
                            options: [
                                { value: "preterite", label: "Ayer comí pizza" },
                                { value: "present", label: "Hoy como pizza" },
                            ],
                            expectedAnswer: "preterite",
                        },
                        {
                            type: "radio",
                            label: "Which is preterite?",
                            options: [
                                { value: "present", label: "Ella habla español" },
                                { value: "preterite", label: "Ella habló español" },
                            ],
                            expectedAnswer: "preterite",
                        },
                    ],
                },
            ],
        },

        // Regular -AR Verbs
        {
            id: "ar-verbs",
            stepNumber: 1,
            title: "Regular Preterite: -AR Verbs",
            icon: "📖",
            explanation: `
                <h3>Regular -AR Verbs in the Preterite</h3>
                <p>Regular -AR verbs follow a predictable pattern. The good news: they're the most common type!</p>
            `,
            verbTable: {
                title: "Hablar (to speak) - Preterite",
                headers: ["Person", "Preterite Form"],
                rows: [
                    ["yo", "hablé"],
                    ["tú", "hablaste"],
                    ["él/ella/usted", "habló"],
                    ["nosotros/as", "hablamos"],
                    ["ellos/ellas/ustedes", "hablaron"],
                ],
            },
            usageMeanings: [
                {
                    title: "📞 Speaking - Hablar",
                    description: "A complete conversation in the past",
                    examples: [
                        {
                            sentence: "Ayer <strong>hablé</strong> con mi madre por teléfono.",
                            explanation:
                                "Yesterday I spoke with my mother on the phone. A completed action in the past.",
                        },
                        {
                            sentence: "¿Con quién <strong>hablaste</strong> anoche?",
                            explanation: "Who did you speak with last night?",
                        },
                        {
                            sentence: "Nosotros <strong>hablamos</strong> sobre el proyecto.",
                            explanation: "We spoke about the project. A completed conversation.",
                        },
                    ],
                },
                {
                    title: "🚶 Other -AR Verbs",
                    description: "More examples of regular -AR preterite",
                    examples: [
                        {
                            sentence: "Esta mañana <strong>caminé</strong> al trabajo.",
                            explanation: "This morning I walked to work. A completed action.",
                        },
                        {
                            sentence: "Ellas <strong>trabajaron</strong> todo el día.",
                            explanation: "They worked all day. A specific past action.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "spr-ar-1",
                    title: "Conjugate -AR Verbs in Preterite",
                    instructions: "Fill in the correct preterite form for -AR verbs.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ (hablar) con el profesor.",
                            correctAnswer: "hablé",
                            expectedAnswers: ["hablé"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (trabajar) en la oficina ayer.",
                            correctAnswer: "trabajó",
                            expectedAnswers: ["trabajó"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (estudiar) toda la noche.",
                            correctAnswer: "estudiamos",
                            expectedAnswers: ["estudiamos"],
                        },
                        {
                            type: "text",
                            label: "¿Ustedes ______ (caminar) al parque?",
                            correctAnswer: "caminaron",
                            expectedAnswers: ["caminaron"],
                        },
                    ],
                },
            ],
        },

        // Regular -ER and -IR Verbs
        {
            id: "er-ir-verbs",
            stepNumber: 2,
            title: "Regular Preterite: -ER and -IR Verbs",
            icon: "🍽️",
            explanation: `
                <h3>Good News: -ER and -IR Are Identical in Preterite</h3>
                <p>Unlike the present tense, -ER and -IR verbs use the same preterite endings. This makes them easier to learn!</p>
            `,
            verbTable: {
                title: "-ER and -IR Verbs in Preterite",
                headers: ["Person", "-ER (comer)", "-IR (vivir)"],
                rows: [
                    ["yo", "comí", "viví"],
                    ["tú", "comiste", "viviste"],
                    ["él/ella/usted", "comió", "vivió"],
                    ["nosotros/as", "comimos", "vivimos"],
                    ["ellos/ellas/ustedes", "comieron", "vivieron"],
                ],
            },
            usageMeanings: [
                {
                    title: "🍴 -ER Verbs (Comer - to eat)",
                    description: "Past actions with -ER verbs",
                    examples: [
                        {
                            sentence: "Ayer <strong>comí</strong> tacos para la cena.",
                            explanation: "Yesterday I ate tacos for dinner.",
                        },
                        {
                            sentence: "¿Qué <strong>comieron</strong> ustedes al almuerzo?",
                            explanation: "What did you all eat for lunch?",
                        },
                        {
                            sentence: "Nosotros <strong>bebimos</strong> café esta mañana.",
                            explanation: "We drank coffee this morning.",
                        },
                    ],
                },
                {
                    title: "🏠 -IR Verbs (Vivir - to live)",
                    description: "Past actions with -IR verbs",
                    examples: [
                        {
                            sentence: "Yo <strong>viví</strong> en Madrid durante cinco años.",
                            explanation: "I lived in Madrid for five years.",
                        },
                        {
                            sentence: "¿Dónde <strong>viviste</strong> cuando eras niño?",
                            explanation: "Where did you live when you were a child?",
                        },
                        {
                            sentence: "Ellos <strong>salieron</strong> del cine a las 9.",
                            explanation: "They left the cinema at 9.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "spr-er-ir-1",
                    title: "Conjugate -ER and -IR Verbs in Preterite",
                    instructions: "Fill in the correct preterite form.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ (comer) pizza ayer.",
                            correctAnswer: "comí",
                            expectedAnswers: ["comí"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (vivir) en Barcelona.",
                            correctAnswer: "vivió",
                            expectedAnswers: ["vivió"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (beber) agua.",
                            correctAnswer: "bebimos",
                            expectedAnswers: ["bebimos"],
                        },
                        {
                            type: "text",
                            label: "¿Ustedes ______ (abrir) la puerta?",
                            correctAnswer: "abrieron",
                            expectedAnswers: ["abrieron"],
                        },
                    ],
                },
            ],
        },

        // Common Irregular Verbs
        {
            id: "irregular-verbs",
            stepNumber: 3,
            title: "Common Irregular Preterite Verbs",
            icon: "⚡",
            explanation: `
                <h3>The Most Important Irregular Verbs</h3>
                <p>Spanish has many irregular preterite verbs, but focus on these most common ones first. You'll see them constantly in conversation.</p>
            `,
            verbTable: {
                title: "Essential Irregular Verbs in Preterite",
                headers: ["Infinitive", "yo", "él/ella", "nosotros", "ellos"],
                rows: [
                    ["ser/ir", "fui", "fue", "fuimos", "fueron"],
                    ["tener", "tuve", "tuvo", "tuvimos", "tuvieron"],
                    ["hacer", "hice", "hizo", "hicimos", "hicieron"],
                    ["venir", "vine", "vino", "vinimos", "vinieron"],
                    ["estar", "estuve", "estuvo", "estuvimos", "estuvieron"],
                    ["poder", "pude", "pudo", "pudimos", "pudieron"],
                    ["decir", "dije", "dijo", "dijimos", "dijeron"],
                    ["ver", "vi", "vio", "vimos", "vieron"],
                ],
            },
            usageMeanings: [
                {
                    title: "🚀 Ser/Ir (was/went - same in preterite!)",
                    description: "These two verbs are identical in preterite form",
                    examples: [
                        {
                            sentence: "Ayer <strong>fui</strong> al cine.",
                            explanation:
                                "Yesterday I went to the cinema. Ir = to go.",
                        },
                        {
                            sentence: "La película <strong>fue</strong> excelente.",
                            explanation:
                                "The movie was excellent. Ser = to be.",
                        },
                        {
                            sentence: "¿Adónde <strong>fueron</strong> ustedes?",
                            explanation: "Where did you go? Preterite of ir.",
                        },
                    ],
                },
                {
                    title: "💪 Tener (had)",
                    description: "Having something in the past",
                    examples: [
                        {
                            sentence: "Yo <strong>tuve</strong> un accidente ayer.",
                            explanation: "I had an accident yesterday.",
                        },
                        {
                            sentence: "¿Qué <strong>tuviste</strong> para desayunar?",
                            explanation: "What did you have for breakfast?",
                        },
                        {
                            sentence: "Ellos <strong>tuvieron</strong> suerte.",
                            explanation: "They had luck (were lucky).",
                        },
                    ],
                },
                {
                    title: "🎯 Hacer (did/made)",
                    description: "Doing or making something",
                    examples: [
                        {
                            sentence: "¿Qué <strong>hiciste</strong> el fin de semana?",
                            explanation: "What did you do on the weekend?",
                        },
                        {
                            sentence: "Yo <strong>hice</strong> la tarea.",
                            explanation: "I did the homework.",
                        },
                        {
                            sentence: "Ella <strong>hizo</strong> un pastel delicioso.",
                            explanation: "She made a delicious cake.",
                        },
                    ],
                },
                {
                    title: "👀 Ver (saw)",
                    description: "Seeing something in the past",
                    examples: [
                        {
                            sentence: "Yo <strong>vi</strong> a tu hermano en el parque.",
                            explanation: "I saw your brother in the park.",
                        },
                        {
                            sentence: "¿<strong>Viste</strong> la película nueva?",
                            explanation: "Did you see the new movie?",
                        },
                        {
                            sentence: "Nosotros <strong>vimos</strong> un accidente.",
                            explanation: "We saw an accident.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "spr-irreg-1",
                    title: "Conjugate Irregular Preterite Verbs",
                    instructions: "Fill in the correct irregular preterite form.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ (ir) al mercado.",
                            correctAnswer: "fui",
                            expectedAnswers: ["fui"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (tener) un examen.",
                            correctAnswer: "tuvo",
                            expectedAnswers: ["tuvo"],
                        },
                        {
                            type: "text",
                            label: "¿Qué ______ (hacer) ustedes?",
                            correctAnswer: "hicieron",
                            expectedAnswers: ["hicieron"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (ver) una película.",
                            correctAnswer: "vimos",
                            expectedAnswers: ["vimos"],
                        },
                        {
                            type: "text",
                            label: "Él ______ (venir) temprano.",
                            correctAnswer: "vino",
                            expectedAnswers: ["vino"],
                        },
                    ],
                },
            ],
        },

        // Usage & Context
        {
            id: "usage-context",
            stepNumber: 4,
            title: "When to Use the Preterite",
            icon: "📖",
            explanation: `
                <h3>Completed Actions in the Past</h3>
                <p>The preterite is used for actions that are completely finished. If it's done, it's preterite!</p>
            `,
            usageMeanings: [
                {
                    title: "✅ Completed Specific Actions",
                    description: "One-time actions that are fully finished",
                    examples: [
                        {
                            sentence: "Ayer <strong>limpié</strong> la casa.",
                            explanation:
                                "Yesterday I cleaned the house (it's done). A completed action.",
                        },
                        {
                            sentence: "El mes pasado <strong>cambié</strong> de trabajo.",
                            explanation: "Last month I changed jobs. A finished event.",
                        },
                    ],
                },
                {
                    title: "📅 Specific Time Markers",
                    description: "With expressions like ayer, la semana pasada, hace dos días",
                    examples: [
                        {
                            sentence: "<strong>Ayer</strong> <strong>comí</strong> pizza.",
                            explanation: "Yesterday I ate pizza. Ayer requires preterite.",
                        },
                        {
                            sentence: "<strong>La semana pasada</strong> <strong>visitamos</strong> Madrid.",
                            explanation:
                                "Last week we visited Madrid. Specific past time = preterite.",
                        },
                    ],
                },
                {
                    title: "🎬 Narrative/Storytelling",
                    description: "Telling what happened in sequence",
                    examples: [
                        {
                            sentence: "<strong>Llegué</strong> a casa, <strong>abrí</strong> la puerta, y <strong>encontré</strong> un regalo.",
                            explanation:
                                "I arrived home, opened the door, and found a gift. A sequence of completed actions.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "spr-usage-1",
                    title: "Preterite or Not?",
                    instructions: "Identify which sentences use the preterite correctly.",
                    items: [
                        {
                            type: "radio",
                            label: "Which uses preterite correctly?",
                            options: [
                                { value: "yes", label: "Ayer compré un coche" },
                                { value: "no", label: "Siempre compré un coche" },
                            ],
                            expectedAnswer: "yes",
                        },
                        {
                            type: "radio",
                            label: "Which sentence is correct?",
                            options: [
                                { value: "yes", label: "La semana pasada fui a la playa" },
                                { value: "no", label: "Mañana fui a la playa" },
                            ],
                            expectedAnswer: "yes",
                        },
                    ],
                },
                {
                    id: "spr-usage-2",
                    title: "Tell a Simple Story",
                    instructions: "Fill in the blanks with preterite verbs to tell a story.",
                    items: [
                        {
                            type: "text",
                            label: "Ayer ______ (despertar) temprano, ______ (desayunar) rápido, y ______ (ir) al trabajo.",
                            correctAnswer: "desperté, desayuné, fui",
                            expectedAnswers: ["desperté, desayuné, fui", "desperté,desayuné,fui"],
                        },
                    ],
                },
            ],
        },

        // Summary & Review
        {
            id: "summary",
            stepNumber: 5,
            title: "Preterite Summary",
            icon: "🎓",
            explanation: `
                <h3>Key Points to Remember</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Regular -AR:</strong> -é, -aste, -ó, -amos, -aron</li>
                    <li><strong>Regular -ER/-IR:</strong> -í, -iste, -ió, -imos, -ieron</li>
                    <li><strong>Use for:</strong> Completed past actions, specific time markers</li>
                    <li><strong>Irregular verbs:</strong> Learn the most common ones (ir/ser, tener, hacer, ver, venir, estar, poder, decir)</li>
                </ul>
            `,
            exercises: [
                {
                    id: "spr-summary-1",
                    title: "Mixed Review",
                    instructions: "Fill in the correct preterite form.",
                    items: [
                        {
                            type: "text",
                            label: "Ayer ______ (hablar) con mis amigos.",
                            correctAnswer: "hablé",
                            expectedAnswers: ["hablé"],
                        },
                        {
                            type: "text",
                            label: "El fin de semana ______ (ver) una película.",
                            correctAnswer: "vi",
                            expectedAnswers: ["vi"],
                        },
                        {
                            type: "text",
                            label: "¿Qué ______ (hacer) tú ayer?",
                            correctAnswer: "hiciste",
                            expectedAnswers: ["hiciste"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (ir) al restaurante.",
                            correctAnswer: "fuimos",
                            expectedAnswers: ["fuimos"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (tener) un problema.",
                            correctAnswer: "tuvo",
                            expectedAnswers: ["tuvo"],
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What is the preterite 'yo' form for regular -AR verbs like 'hablar'?",
            options: [
                { value: "a", label: "hablo" },
                { value: "b", label: "hablé" },
                { value: "c", label: "hablaré" },
            ],
            correctAnswer: "b",
            explanation: "Regular -AR verbs use -é for yo in preterite. Yo hablé, yo trabajé, yo caminé.",
        },
        {
            id: "q2",
            question: "What is the preterite 'nosotros' form for 'comer'?",
            options: [
                { value: "a", label: "comemos" },
                { value: "b", label: "comimos" },
                { value: "c", label: "comeremos" },
            ],
            correctAnswer: "b",
            explanation: "Nosotros uses -imos for -ER verbs in preterite. Nosotros comimos.",
        },
        {
            id: "q3",
            question: "What is the preterite form of 'ir' for 'yo'?",
            options: [
                { value: "a", label: "voy" },
                { value: "b", label: "fui" },
                { value: "c", label: "iré" },
            ],
            correctAnswer: "b",
            explanation: "Ir is highly irregular. Yo fui. (Fun fact: ser uses the same forms!)",
        },
        {
            id: "q4",
            question: "Which time expression requires the preterite?",
            options: [
                { value: "a", label: "Siempre" },
                { value: "b", label: "Ayer" },
                { value: "c", label: "Generalmente" },
            ],
            correctAnswer: "b",
            explanation: "Ayer (yesterday) indicates a completed past action, requiring preterite.",
        },
        {
            id: "q5",
            question: "Choose the correct yo preterite form of 'comer'.",
            options: [
                { value: "a", label: "comí" },
                { value: "b", label: "como" },
                { value: "c", label: "comía" },
            ],
            correctAnswer: "a",
            explanation: "Regular -ER/-IR yo preterite ending is -í: yo comí.",
        },
        {
            id: "q6",
            question: "What is the preterite tú form of 'hablar'?",
            options: [
                { value: "a", label: "hablaste" },
                { value: "b", label: "habló" },
                { value: "c", label: "hablabas" },
            ],
            correctAnswer: "a",
            explanation: "Regular -AR tú preterite ending is -aste: tú hablaste.",
        },
        {
            id: "q7",
            question: "Which sentence uses preterite correctly?",
            options: [
                { value: "a", label: "Anoche vimos una película." },
                { value: "b", label: "Anoche vemos una película." },
                { value: "c", label: "Anoche ver una película." },
            ],
            correctAnswer: "a",
            explanation: "Anoche signals a completed past event, so preterite (vimos) is correct.",
        },
        {
            id: "q8",
            question: "What is the preterite yo form of 'tener'?",
            options: [
                { value: "a", label: "tuve" },
                { value: "b", label: "tenía" },
                { value: "c", label: "tengo" },
            ],
            correctAnswer: "a",
            explanation: "Tener is irregular in preterite: yo tuve.",
        },
        {
            id: "q9",
            question: "Complete: 'Nosotros ___ al mercado ayer.' (ir)",
            options: [
                { value: "a", label: "fuimos" },
                { value: "b", label: "vamos" },
                { value: "c", label: "íbamos" },
            ],
            correctAnswer: "a",
            explanation: "Ayer signals preterite. Nosotros fuimos is the correct preterite form of ir.",
        },
        {
            id: "q10",
            question: "Which option is an irregular preterite verb form?",
            options: [
                { value: "a", label: "hice" },
                { value: "b", label: "hablé" },
                { value: "c", label: "comimos" },
            ],
            correctAnswer: "a",
            explanation: "'Hice' (from hacer) is irregular in preterite, unlike hablé/comimos.",
        },
    ],
};
