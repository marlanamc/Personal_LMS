import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPresentTenseContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Spanish Present Tense: Hablar del Ahora",
            icon: "🎯",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">¡Bienvenido! The present tense is essential Spanish. Whether you're talking about your daily routine, current situations, or general truths, you'll use the present tense constantly. Let's master it together!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>The present tense in Spanish allows you to describe what you do every day, what's happening right now, and facts about your life. It's the foundation of everyday communication.</p>
            `,
            exercises: [
                {
                    id: "sp-intro-1",
                    title: "Quick Check: Present or Not?",
                    instructions: "Which sentence uses the present tense?",
                    items: [
                        {
                            type: "radio",
                            label: "Choose the present tense sentence:",
                            options: [
                                { value: "present", label: "Yo hablo español" },
                                { value: "past", label: "Yo hablé español" },
                            ],
                            expectedAnswer: "present",
                        },
                        {
                            type: "radio",
                            label: "Which describes a current action?",
                            options: [
                                { value: "present", label: "Estoy estudiando" },
                                { value: "past", label: "Estuve estudiando" },
                            ],
                            expectedAnswer: "present",
                        },
                    ],
                },
            ],
        },

        // Regular Verbs Section
        {
            id: "regular-verbs",
            stepNumber: 1,
            title: "Regular Present Tense Verbs",
            icon: "📝",
            explanation: `
                <h3>Three Main Types of Regular Verbs</h3>
                <p>Spanish regular verbs fall into three categories based on their infinitive ending: <strong>-AR</strong>, <strong>-ER</strong>, and <strong>-IR</strong>. Each group follows its own pattern.</p>
            `,
            verbTable: {
                title: "Regular Present Tense Conjugations",
                headers: ["Person", "-AR (hablar)", "-ER (comer)", "-IR (vivir)"],
                rows: [
                    ["yo", "hablo", "como", "vivo"],
                    ["tú", "hablas", "comes", "vives"],
                    ["él/ella/usted", "habla", "come", "vive"],
                    ["nosotros/as", "hablamos", "comemos", "vivimos"],
                    ["vosotros/as", "habláis", "coméis", "vivís"],
                    ["ellos/ellas/ustedes", "hablan", "comen", "viven"],
                ],
            },
            usageMeanings: [
                {
                    title: "🗣️ -AR Verbs (Most Common)",
                    description: "The most common type of Spanish verb",
                    examples: [
                        {
                            sentence: "Yo <strong>hablo</strong> español en clase.",
                            explanation:
                                "I speak Spanish in class. Hablar = to speak (infinitive), hablo = I speak (present)",
                        },
                        {
                            sentence: "Mi hermana <strong>trabaja</strong> en un restaurante.",
                            explanation:
                                "My sister works in a restaurant. Notice the -a ending for third person singular.",
                        },
                        {
                            sentence: "Nosotros <strong>caminamos</strong> al parque cada día.",
                            explanation:
                                "We walk to the park every day. Nosotros always adds -amos.",
                        },
                    ],
                },
                {
                    title: "🍴 -ER Verbs (Action Verbs)",
                    description: "Verbs that often describe actions or consumption",
                    examples: [
                        {
                            sentence: "¿Qué <strong>comes</strong> para el desayuno?",
                            explanation:
                                "What do you eat for breakfast? Comer = to eat, comes = you eat",
                        },
                        {
                            sentence: "Ellos <strong>beben</strong> café después de trabajar.",
                            explanation:
                                "They drink coffee after working. Note the -en ending for third person plural.",
                        },
                        {
                            sentence: "Yo <strong>comprendo</strong> la lección.",
                            explanation:
                                "I understand the lesson. Comprender = to understand, comprendo = I understand",
                        },
                    ],
                },
                {
                    title: "🏠 -IR Verbs (Specific Actions)",
                    description: "Verbs describing motion or specific actions",
                    examples: [
                        {
                            sentence: "¿Dónde <strong>vives</strong>?",
                            explanation:
                                "Where do you live? Vivir = to live, vives = you live",
                        },
                        {
                            sentence: "<strong>Abro</strong> la puerta cada mañana.",
                            explanation:
                                "I open the door every morning. Abrir = to open, abro = I open",
                        },
                        {
                            sentence: "Nosotros <strong>escribimos</strong> muchos emails.",
                            explanation:
                                "We write many emails. Escribir = to write, escribimos = we write",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sp-regular-1",
                    title: "Conjugate Regular Verbs",
                    instructions: "Fill in the correct present tense conjugation for the verb in parentheses.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ (hablar) español bien.",
                            correctAnswer: "hablo",
                            expectedAnswers: ["hablo"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (comer) una manzana cada día.",
                            correctAnswer: "come",
                            expectedAnswers: ["come"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (vivir) en la ciudad.",
                            correctAnswer: "vivimos",
                            expectedAnswers: ["vivimos"],
                        },
                        {
                            type: "text",
                            label: "¿Tú ______ (trabajar) mañana?",
                            correctAnswer: "trabajas",
                            expectedAnswers: ["trabajas"],
                        },
                    ],
                },
                {
                    id: "sp-regular-2",
                    title: "Identify the Verb Type",
                    instructions: "Identify whether each infinitive is -AR, -ER, or -IR.",
                    items: [
                        {
                            type: "radio",
                            label: "Estudiar",
                            options: [
                                { value: "ar", label: "-AR" },
                                { value: "er", label: "-ER" },
                                { value: "ir", label: "-IR" },
                            ],
                            expectedAnswer: "ar",
                        },
                        {
                            type: "radio",
                            label: "Aprender",
                            options: [
                                { value: "ar", label: "-AR" },
                                { value: "er", label: "-ER" },
                                { value: "ir", label: "-IR" },
                            ],
                            expectedAnswer: "er",
                        },
                        {
                            type: "radio",
                            label: "Partir",
                            options: [
                                { value: "ar", label: "-AR" },
                                { value: "er", label: "-ER" },
                                { value: "ir", label: "-IR" },
                            ],
                            expectedAnswer: "ir",
                        },
                    ],
                },
            ],
        },

        // Common Irregular Verbs
        {
            id: "irregular-verbs",
            stepNumber: 2,
            title: "Common Irregular Present Tense Verbs",
            icon: "⚡",
            explanation: `
                <h3>Spanish Loves Exceptions</h3>
                <p>Some of the most common Spanish verbs don't follow the regular patterns. But the good news? You only need to memorize a few essential ones to speak fluently.</p>
            `,
            verbTable: {
                title: "Essential Irregular Verbs",
                headers: ["Person", "Ser (to be)", "Estar (to be)", "Ir (to go)", "Tener (to have)", "Hacer (to do/make)"],
                rows: [
                    ["yo", "soy", "estoy", "voy", "tengo", "hago"],
                    ["tú", "eres", "estás", "vas", "tienes", "haces"],
                    ["él/ella/usted", "es", "está", "va", "tiene", "hace"],
                    ["nosotros/as", "somos", "estamos", "vamos", "tenemos", "hacemos"],
                    ["vosotros/as", "sois", "estáis", "vais", "tenéis", "hacéis"],
                    ["ellos/ellas/ustedes", "son", "están", "van", "tienen", "hacen"],
                ],
            },
            usageMeanings: [
                {
                    title: "🎭 Ser (Permanent Identity)",
                    description: "Who you are, what you do for work, permanent characteristics",
                    examples: [
                        {
                            sentence: "Yo <strong>soy</strong> ingeniero.",
                            explanation: "I am an engineer. Ser for profession.",
                        },
                        {
                            sentence: "Ella <strong>es</strong> inteligente.",
                            explanation: "She is intelligent. Ser for permanent qualities.",
                        },
                    ],
                },
                {
                    title: "📍 Estar (Location & Condition)",
                    description: "Where something is, how you feel right now",
                    examples: [
                        {
                            sentence: "¿Dónde <strong>estás</strong>?",
                            explanation: "Where are you? Estar for location.",
                        },
                        {
                            sentence: "Yo <strong>estoy</strong> cansado hoy.",
                            explanation: "I am tired today. Estar for temporary conditions.",
                        },
                    ],
                },
                {
                    title: "🚀 Ir (Movement)",
                    description: "Going somewhere",
                    examples: [
                        {
                            sentence: "¿Adónde <strong>vas</strong>?",
                            explanation: "Where are you going?",
                        },
                        {
                            sentence: "Nosotros <strong>vamos</strong> al cine.",
                            explanation: "We are going to the cinema.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sp-irregular-1",
                    title: "Conjugate Irregular Verbs",
                    instructions: "Fill in the correct conjugation for the irregular verb.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ (ser) profesor.",
                            correctAnswer: "soy",
                            expectedAnswers: ["soy"],
                        },
                        {
                            type: "text",
                            label: "Ella ______ (estar) en casa.",
                            correctAnswer: "está",
                            expectedAnswers: ["está"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ (ir) a la playa.",
                            correctAnswer: "vamos",
                            expectedAnswers: ["vamos"],
                        },
                        {
                            type: "text",
                            label: "¿Tú ______ (tener) dinero?",
                            correctAnswer: "tienes",
                            expectedAnswers: ["tienes"],
                        },
                    ],
                },
            ],
        },

        // Usage & Context
        {
            id: "usage-context",
            stepNumber: 3,
            title: "When to Use the Present Tense",
            icon: "⏰",
            explanation: `
                <h3>Understanding Context</h3>
                <p>The present tense has multiple uses in Spanish. Understanding when to use it is key to sounding natural.</p>
            `,
            usageMeanings: [
                {
                    title: "🔄 Habitual Actions (Daily Routines)",
                    description: "Things you do regularly or every day",
                    examples: [
                        {
                            sentence: "Cada mañana me <strong>despiertas</strong> a las 6 y <strong>tomo</strong> café.",
                            explanation:
                                "Every morning I wake up at 6 and drink coffee. These are regular habits.",
                        },
                        {
                            sentence: "Mi familia <strong>cena</strong> juntos los viernes.",
                            explanation: "My family dines together on Fridays. A regular weekly habit.",
                        },
                    ],
                },
                {
                    title: "🎯 Present Facts & Truths",
                    description: "General truths or facts that are currently true",
                    examples: [
                        {
                            sentence: "El español <strong>es</strong> una lengua hermosa.",
                            explanation: "Spanish is a beautiful language. A general truth.",
                        },
                        {
                            sentence: "La Tierra <strong>gira</strong> alrededor del sol.",
                            explanation: "The Earth revolves around the sun. A scientific fact.",
                        },
                    ],
                },
                {
                    title: "📖 Narrative Present (Storytelling)",
                    description: "Used when telling a story as if it's happening now",
                    examples: [
                        {
                            sentence: "Pedro <strong>entra</strong> al café y <strong>ve</strong> a su amigo Miguel.",
                            explanation:
                                "Pedro enters the café and sees his friend Miguel. Used for dramatic effect in stories.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sp-usage-1",
                    title: "Choose the Correct Present Tense Verb",
                    instructions: "Select the correct present tense form.",
                    items: [
                        {
                            type: "select",
                            label: "Yo ______ al trabajo cada mañana.",
                            options: ["voy", "iba", "iré"],
                            expectedAnswer: "voy",
                        },
                        {
                            type: "select",
                            label: "Ella ______ tres hijos.",
                            options: ["tiene", "tenía", "tendrá"],
                            expectedAnswer: "tiene",
                        },
                        {
                            type: "select",
                            label: "Nosotros ______ en un apartamento céntrico.",
                            options: ["vivimos", "vivíamos", "viviremos"],
                            expectedAnswer: "vivimos",
                        },
                    ],
                },
            ],
        },

        // Mini Quiz
        {
            id: "mini-quiz",
            title: "Review: Present Tense Mastery",
            icon: "🎓",
            explanation: `
                <h3>Let's Test Your Knowledge</h3>
                <p>Try these sentences to see how well you've mastered the present tense!</p>
            `,
            exercises: [
                {
                    id: "sp-review-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in the correct present tense verb.",
                    items: [
                        {
                            type: "text",
                            label: "Nosotros ______ (trabajar) en una oficina grande.",
                            correctAnswer: "trabajamos",
                            expectedAnswers: ["trabajamos"],
                        },
                        {
                            type: "text",
                            label: "¿Cuántos años ______ (tener) tu hermana?",
                            correctAnswer: "tiene",
                            expectedAnswers: ["tiene"],
                        },
                        {
                            type: "text",
                            label: "Los niños ______ (jugar) en el parque.",
                            correctAnswer: "juegan",
                            expectedAnswers: ["juegan"],
                        },
                        {
                            type: "text",
                            label: "Yo ______ (entender) perfectamente.",
                            correctAnswer: "entiendo",
                            expectedAnswers: ["entiendo"],
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "Which verb ending do -AR verbs use for 'yo' in the present tense?",
            options: [
                { value: "a", label: "-o" },
                { value: "b", label: "-a" },
                { value: "c", label: "-e" },
            ],
            correctAnswer: "a",
            explanation: "Regular -AR verbs use -o for the 'yo' form. Yo hablo, yo trabajo, yo camino.",
        },
        {
            id: "q2",
            question: "What is the present tense 'nosotros' form of hablar?",
            options: [
                { value: "a", label: "hablamos" },
                { value: "b", label: "hablan" },
                { value: "c", label: "hablas" },
            ],
            correctAnswer: "a",
            explanation: "Nosotros hablamos. The -mos ending is used for all regular verbs with nosotros.",
        },
        {
            id: "q3",
            question: "The verb 'ser' is irregular. What is the 'yo' form?",
            options: [
                { value: "a", label: "soy" },
                { value: "b", label: "seré" },
                { value: "c", label: "era" },
            ],
            correctAnswer: "a",
            explanation: "Yo soy. This is one of the most important irregular verbs in Spanish.",
        },
        {
            id: "q4",
            question: "What is the present tense 'tú' form of comer?",
            options: [
                { value: "a", label: "comes" },
                { value: "b", label: "come" },
                { value: "c", label: "comen" },
            ],
            correctAnswer: "a",
            explanation: "For regular -ER verbs, tú ends in -es. Example: tú comes.",
        },
        {
            id: "q5",
            question: "Which is correct for 'they live' (vivir)?",
            options: [
                { value: "a", label: "viven" },
                { value: "b", label: "vivimos" },
                { value: "c", label: "vivo" },
            ],
            correctAnswer: "a",
            explanation: "Ellos/Ellas/Ustedes use the -en ending with -IR verbs: viven.",
        },
        {
            id: "q6",
            question: "Complete: 'Nosotros ___ en Boston.' (hablar)",
            options: [
                { value: "a", label: "hablamos" },
                { value: "b", label: "hablan" },
                { value: "c", label: "hablas" },
            ],
            correctAnswer: "a",
            explanation: "Nosotros takes -amos with regular -AR verbs in present tense.",
        },
        {
            id: "q7",
            question: "Which sentence uses an irregular 'tener' form correctly?",
            options: [
                { value: "a", label: "Yo tengo dos hermanos." },
                { value: "b", label: "Yo teno dos hermanos." },
                { value: "c", label: "Yo tiene dos hermanos." },
            ],
            correctAnswer: "a",
            explanation: "'Tener' is irregular in yo form: yo tengo.",
        },
        {
            id: "q8",
            question: "Choose the correct question form.",
            options: [
                { value: "a", label: "¿Dónde vives?" },
                { value: "b", label: "¿Dónde vive tú?" },
                { value: "c", label: "¿Dónde vivir tú?" },
            ],
            correctAnswer: "a",
            explanation: "Use the conjugated verb form directly with tú: ¿Dónde vives?",
        },
        {
            id: "q9",
            question: "What is the present tense 'yo' form of estar?",
            options: [
                { value: "a", label: "estoy" },
                { value: "b", label: "esta" },
                { value: "c", label: "estaba" },
            ],
            correctAnswer: "a",
            explanation: "Estar is irregular: yo estoy.",
        },
        {
            id: "q10",
            question: "Which sentence best shows a present-time routine?",
            options: [
                { value: "a", label: "Cada semana estudiamos español." },
                { value: "b", label: "Ayer estudiamos español." },
                { value: "c", label: "Mañana estudiaremos español." },
            ],
            correctAnswer: "a",
            explanation: "Present tense describes current routines and repeated habits.",
        },
    ],
};
