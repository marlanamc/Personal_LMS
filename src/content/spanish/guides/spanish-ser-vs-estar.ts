import type { InteractiveGuideContent } from "@/types/activity";

export const spanishSerVsEstarContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Ser vs Estar: The Most Important Spanish Distinction",
            icon: "🔀",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">English has one word "to be." Spanish has two. This is THE most important distinction in Spanish grammar, and mastering it will make you sound like a native speaker!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Using ser and estar incorrectly is one of the most common mistakes non-native speakers make. Once you understand the difference, you'll understand so much more of Spanish communication.</p>
            `,
            exercises: [
                {
                    id: "sve-intro-1",
                    title: "Quick Check: Ser or Estar?",
                    instructions: "Which verb would you use?",
                    items: [
                        {
                            type: "radio",
                            label: "How would you say 'I am a teacher'?",
                            options: [
                                { value: "ser", label: "Ser - Soy profesor/a" },
                                { value: "estar", label: "Estar - Estoy profesor/a" },
                            ],
                            expectedAnswer: "ser",
                        },
                        {
                            type: "radio",
                            label: "How would you say 'I am tired (right now)'?",
                            options: [
                                { value: "ser", label: "Ser - Soy cansado/a" },
                                { value: "estar", label: "Estar - Estoy cansado/a" },
                            ],
                            expectedAnswer: "estar",
                        },
                        {
                            type: "radio",
                            label: "How would you say 'Where are you?'",
                            options: [
                                { value: "ser", label: "Ser - ¿Dónde eres?" },
                                { value: "estar", label: "Estar - ¿Dónde estás?" },
                            ],
                            expectedAnswer: "estar",
                        },
                    ],
                },
            ],
        },

        // Ser in Detail
        {
            id: "ser-detailed",
            stepNumber: 1,
            title: "SER: Permanent & Identity",
            icon: "👤",
            explanation: `
                <h3>Use SER for:</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Who you are</strong> - Identity, profession, nationality</li>
                    <li><strong>Permanent characteristics</strong> - Color, size, material, personality</li>
                    <li><strong>Possession</strong> - What belongs to whom</li>
                    <li><strong>Time & dates</strong> - What time it is, what day it is</li>
                    <li><strong>Relationships</strong> - Family connections</li>
                </ul>
            `,
            usageMeanings: [
                {
                    title: "💼 Profession & Identity",
                    description: "What you do, who you are",
                    examples: [
                        {
                            sentence: "Yo <strong>soy</strong> profesor de matemáticas.",
                            explanation:
                                "I am a math teacher. This is your profession - a core part of who you are.",
                        },
                        {
                            sentence: "Mi hermana <strong>es</strong> ingeniera.",
                            explanation: "My sister is an engineer. Her profession defines her role.",
                        },
                        {
                            sentence: "¿Quién <strong>eres</strong> tú?",
                            explanation: "Who are you? Asking about identity.",
                        },
                    ],
                },
                {
                    title: "🌍 Nationality & Origin",
                    description: "Where you're from",
                    examples: [
                        {
                            sentence: "Yo <strong>soy</strong> de México.",
                            explanation: "I am from Mexico. Your origin is permanent.",
                        },
                        {
                            sentence: "Ella <strong>es</strong> colombiana.",
                            explanation: "She is Colombian. Nationality - a permanent characteristic.",
                        },
                    ],
                },
                {
                    title: "🎨 Permanent Physical Characteristics",
                    description: "Physical qualities that don't change",
                    examples: [
                        {
                            sentence: "Mi padre <strong>es</strong> alto y delgado.",
                            explanation:
                                "My father is tall and thin. These are permanent characteristics.",
                        },
                        {
                            sentence: "El cielo <strong>es</strong> azul.",
                            explanation: "The sky is blue. A characteristic of the object.",
                        },
                        {
                            sentence: "La mesa <strong>es</strong> de madera.",
                            explanation: "The table is made of wood. Material composition.",
                        },
                    ],
                },
                {
                    title: "⏰ Time & Dates",
                    description: "Telling time and talking about dates",
                    examples: [
                        {
                            sentence: "<strong>Son</strong> las tres de la tarde.",
                            explanation: "It is three in the afternoon. Always use ser for time.",
                        },
                        {
                            sentence: "Hoy <strong>es</strong> viernes.",
                            explanation: "Today is Friday. Use ser for days of the week.",
                        },
                        {
                            sentence: "<strong>Es</strong> el 20 de febrero de 2026.",
                            explanation: "It is February 20, 2026. Use ser for dates.",
                        },
                    ],
                },
                {
                    title: "👨‍👩‍👧 Family Relationships",
                    description: "Connections to family members",
                    examples: [
                        {
                            sentence: "Ella <strong>es</strong> mi madre.",
                            explanation: "She is my mother. Permanent family relationship.",
                        },
                        {
                            sentence: "¿Quién <strong>es</strong> ese señor? <strong>Es</strong> mi tío.",
                            explanation: "Who is that man? He is my uncle.",
                        },
                    ],
                },
                {
                    title: "💰 Ownership & Possession",
                    description: "What belongs to whom",
                    examples: [
                        {
                            sentence: "Este libro <strong>es</strong> mío.",
                            explanation: "This book is mine. Permanent ownership.",
                        },
                        {
                            sentence: "¿De quién <strong>es</strong> este teléfono? <strong>Es</strong> de mi hermano.",
                            explanation: "Whose phone is this? It is my brother's.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sve-ser-1",
                    title: "Why Use SER?",
                    instructions: "Identify why ser is used in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "Yo soy ingeniero.",
                            options: [
                                { value: "profession", label: "Profession" },
                                { value: "location", label: "Location" },
                                { value: "feeling", label: "Feeling" },
                            ],
                            expectedAnswer: "profession",
                        },
                        {
                            type: "radio",
                            label: "Mi coche es rojo.",
                            options: [
                                { value: "location", label: "Location" },
                                { value: "characteristic", label: "Permanent characteristic" },
                                { value: "condition", label: "Condition" },
                            ],
                            expectedAnswer: "characteristic",
                        },
                        {
                            type: "radio",
                            label: "Ella es de Cuba.",
                            options: [
                                { value: "origin", label: "Origin/Nationality" },
                                { value: "occupation", label: "Occupation" },
                                { value: "emotion", label: "Emotion" },
                            ],
                            expectedAnswer: "origin",
                        },
                    ],
                },
                {
                    id: "sve-ser-2",
                    title: "Fill in with SER",
                    instructions: "Complete the sentences using the correct form of ser.",
                    items: [
                        {
                            type: "text",
                            label: "Yo ______ estudiante.",
                            correctAnswer: "soy",
                            expectedAnswers: ["soy"],
                        },
                        {
                            type: "text",
                            label: "¿Qué hora ______? ______ las ocho.",
                            correctAnswer: "es, son",
                            expectedAnswers: ["es, son", "es Son", "es,son"],
                        },
                        {
                            type: "text",
                            label: "Mi hermana ______ inteligente y simpática.",
                            correctAnswer: "es",
                            expectedAnswers: ["es"],
                        },
                    ],
                },
            ],
        },

        // Estar in Detail
        {
            id: "estar-detailed",
            stepNumber: 2,
            title: "ESTAR: Location & Condition",
            icon: "📍",
            explanation: `
                <h3>Use ESTAR for:</h3>
                <ul style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Where something is</strong> - Physical location</li>
                    <li><strong>How you feel</strong> - Emotions, physical sensations</li>
                    <li><strong>Temporary conditions</strong> - Not permanent</li>
                    <li><strong>Marital status</strong> - Sometimes</li>
                    <li><strong>Civil/Social status</strong> - Usually temporary states</li>
                </ul>
            `,
            usageMeanings: [
                {
                    title: "📍 Physical Location",
                    description: "Where someone or something is",
                    examples: [
                        {
                            sentence: "¿Dónde <strong>estás</strong>? <strong>Estoy</strong> en la oficina.",
                            explanation:
                                "Where are you? I am in the office. This is a temporary location.",
                        },
                        {
                            sentence: "El gato <strong>está</strong> bajo la cama.",
                            explanation: "The cat is under the bed. Physical location.",
                        },
                        {
                            sentence: "Los libros <strong>están</strong> en la estantería.",
                            explanation: "The books are on the shelf. Where they physically are.",
                        },
                    ],
                },
                {
                    title: "😊 Emotions & Feelings",
                    description: "How you feel right now (temporary)",
                    examples: [
                        {
                            sentence: "Yo <strong>estoy</strong> muy feliz hoy.",
                            explanation:
                                "I am very happy today. This feeling is temporary (implied by 'today').",
                        },
                        {
                            sentence: "Mi hermano <strong>está</strong> nervioso por el examen.",
                            explanation: "My brother is nervous about the exam. A temporary emotional state.",
                        },
                        {
                            sentence: "¿Cómo <strong>estás</strong>? <strong>Estoy</strong> cansado.",
                            explanation:
                                "How are you? I am tired. Always ask 'How are you?' with estar.",
                        },
                    ],
                },
                {
                    title: "🌡️ Temporary Physical Conditions",
                    description: "How someone looks or feels right now",
                    examples: [
                        {
                            sentence: "La sopa <strong>está</strong> caliente.",
                            explanation: "The soup is hot. A temporary condition.",
                        },
                        {
                            sentence: "Yo <strong>estoy</strong> enfermo.",
                            explanation: "I am sick. A temporary condition (hopefully!).",
                        },
                        {
                            sentence: "Elle <strong>está</strong> guapa con ese vestido.",
                            explanation:
                                "She looks beautiful in that dress. How she appears right now.",
                        },
                    ],
                },
                {
                    title: "💍 Civil & Social Status",
                    description: "Sometimes you use estar for relationship status",
                    examples: [
                        {
                            sentence: "Yo <strong>estoy</strong> casado/a.",
                            explanation: "I am married. Sometimes estar is used for marital status.",
                        },
                        {
                            sentence: "Ella <strong>está</strong> divorciada.",
                            explanation: "She is divorced. A social status considered temporary.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sve-estar-1",
                    title: "Why Use ESTAR?",
                    instructions: "Identify why estar is used in each sentence.",
                    items: [
                        {
                            type: "radio",
                            label: "¿Dónde estás?",
                            options: [
                                { value: "location", label: "Physical location" },
                                { value: "feeling", label: "Feeling/Emotion" },
                                { value: "characteristic", label: "Characteristic" },
                            ],
                            expectedAnswer: "location",
                        },
                        {
                            type: "radio",
                            label: "Estoy muy cansado.",
                            options: [
                                { value: "location", label: "Location" },
                                { value: "feeling", label: "Feeling/Temporary condition" },
                                { value: "identity", label: "Identity" },
                            ],
                            expectedAnswer: "feeling",
                        },
                        {
                            type: "radio",
                            label: "La casa está limpia.",
                            options: [
                                { value: "possession", label: "Possession" },
                                { value: "characteristic", label: "Permanent characteristic" },
                                { value: "condition", label: "Temporary condition" },
                            ],
                            expectedAnswer: "condition",
                        },
                    ],
                },
                {
                    id: "sve-estar-2",
                    title: "Fill in with ESTAR",
                    instructions: "Complete the sentences using the correct form of estar.",
                    items: [
                        {
                            type: "text",
                            label: "¿Cómo ______? Yo ______ bien, gracias.",
                            correctAnswer: "estás, estoy",
                            expectedAnswers: ["estás, estoy", "estás,estoy", "estás, estoy"],
                        },
                        {
                            type: "text",
                            label: "El restaurante ______ en el centro de la ciudad.",
                            correctAnswer: "está",
                            expectedAnswers: ["está"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ contentos con los resultados.",
                            correctAnswer: "estamos",
                            expectedAnswers: ["estamos"],
                        },
                    ],
                },
            ],
        },

        // Side-by-Side Comparison
        {
            id: "comparison",
            stepNumber: 3,
            title: "Ser vs Estar: Direct Comparison",
            icon: "⚖️",
            explanation: `
                <h3>The Key Difference</h3>
                <p><strong>SER</strong> = Permanent, essential, defining characteristics</p>
                <p><strong>ESTAR</strong> = Temporary, changeable, location, condition</p>
            `,
            tipBox: {
                title: "Quick reference",
                content: "SER: identity, profession, nationality, origin, time & dates, permanent traits, possession, relationships. ESTAR: location, temporary conditions (tired, sick, hot/cold), emotions, ongoing results (the door is open).",
            },
            comparison: {
                title: "Ser vs Estar Examples",
                leftLabel: "SER (Permanent)",
                rightLabel: "ESTAR (Temporary)",
                rows: [
                    {
                        label: "Yo ____ profesora",
                        left: "Soy profesora (my profession)",
                        right: "Estoy profesora (doesn't make sense!)",
                    },
                    {
                        label: "Yo ____ cansada",
                        left: "Soy cansada (I'm a tired person - strange!)",
                        right: "Estoy cansada (I am tired today/now)",
                    },
                    {
                        label: "Yo ____ en la cocina",
                        left: "Soy en la cocina (doesn't work)",
                        right: "Estoy en la cocina (I am in the kitchen)",
                    },
                    {
                        label: "La casa ____ grande",
                        left: "La casa es grande (permanent size)",
                        right: "La casa está grande (seems bigger now?)",
                    },
                    {
                        label: "Él ____ ingeniero",
                        left: "Es ingeniero (his profession)",
                        right: "Está ingeniero (doesn't work)",
                    },
                    {
                        label: "¿Cómo ____?",
                        left: "¿Cómo eres? (Who are you?)",
                        right: "¿Cómo estás? (How are you feeling?)",
                    },
                ],
            },
            exercises: [
                {
                    id: "sve-comp-1",
                    title: "Choose SER or ESTAR",
                    instructions: "For each sentence, choose whether you would use ser or estar.",
                    items: [
                        {
                            type: "radio",
                            label: "Mi abuelo ______ médico.",
                            options: [
                                { value: "ser", label: "Ser" },
                                { value: "estar", label: "Estar" },
                            ],
                            expectedAnswer: "ser",
                        },
                        {
                            type: "radio",
                            label: "Hoy ______ nublado.",
                            options: [
                                { value: "ser", label: "Ser" },
                                { value: "estar", label: "Estar" },
                            ],
                            expectedAnswer: "estar",
                        },
                        {
                            type: "radio",
                            label: "Nosotros ______ de Argentina.",
                            options: [
                                { value: "ser", label: "Ser" },
                                { value: "estar", label: "Estar" },
                            ],
                            expectedAnswer: "ser",
                        },
                        {
                            type: "radio",
                            label: "La fiesta ______ mañana a las 8 de la noche.",
                            options: [
                                { value: "ser", label: "Ser" },
                                { value: "estar", label: "Estar" },
                            ],
                            expectedAnswer: "ser",
                        },
                        {
                            type: "radio",
                            label: "¿Dónde ______ mis llaves?",
                            options: [
                                { value: "ser", label: "Ser" },
                                { value: "estar", label: "Estar" },
                            ],
                            expectedAnswer: "estar",
                        },
                    ],
                },
                {
                    id: "sve-comp-2",
                    title: "Fill in the Correct Form",
                    instructions: "Use the correct form of ser or estar.",
                    items: [
                        {
                            type: "text",
                            label: "Mi jefe ______ muy inteligente.",
                            correctAnswer: "es",
                            expectedAnswers: ["es"],
                        },
                        {
                            type: "text",
                            label: "Los niños ______ en el parque.",
                            correctAnswer: "están",
                            expectedAnswers: ["están"],
                        },
                        {
                            type: "text",
                            label: "Nosotros ______ amigos desde hace 10 años.",
                            correctAnswer: "somos",
                            expectedAnswers: ["somos"],
                        },
                        {
                            type: "text",
                            label: "El café ______ muy caliente.",
                            correctAnswer: "está",
                            expectedAnswers: ["está"],
                        },
                    ],
                },
            ],
        },

        // Real-World Scenarios
        {
            id: "scenarios",
            stepNumber: 4,
            title: "Real-World Scenarios",
            icon: "🌍",
            explanation: `
                <h3>Common Situations</h3>
                <p>Let's look at practical examples from everyday Spanish conversation.</p>
            `,
            usageMeanings: [
                {
                    title: "👋 Meeting Someone New",
                    description: "Introducing yourself and asking about them",
                    examples: [
                        {
                            sentence: "Hola, <strong>soy</strong> María. ¿Quién <strong>eres</strong>?",
                            explanation:
                                "Hello, I am María (name). Who are you? Use ser for identity.",
                        },
                        {
                            sentence: "Yo <strong>soy</strong> de España. ¿De dónde <strong>eres</strong> tú?",
                            explanation: "I am from Spain. Where are you from? Use ser for origin.",
                        },
                        {
                            sentence: "<strong>Estoy</strong> muy contenta de conocerte.",
                            explanation: "I am very happy to meet you. Your emotion right now.",
                        },
                    ],
                },
                {
                    title: "☕ At a Coffee Shop",
                    description: "Ordering and chatting",
                    examples: [
                        {
                            sentence: "Hola, ¿cómo <strong>estás</strong> hoy?",
                            explanation: "Hi, how are you today? Always use estar for greetings.",
                        },
                        {
                            sentence: "Bien, pero <strong>estoy</strong> muy ocupada.",
                            explanation: "Good, but I am very busy (right now). Busy is temporary.",
                        },
                        {
                            sentence: "El café <strong>está</strong> delicioso.",
                            explanation: "The coffee is delicious. How it tastes right now.",
                        },
                    ],
                },
                {
                    title: "🏥 Doctor's Visit",
                    description: "Health conversations",
                    examples: [
                        {
                            sentence: "Yo <strong>estoy</strong> enfermo y tengo dolor de cabeza.",
                            explanation: "I am sick and have a headache. Temporary health conditions.",
                        },
                        {
                            sentence: "¿Cuánto tiempo <strong>estás</strong> así?",
                            explanation:
                                "How long have you been like this? Your condition is temporary.",
                        },
                        {
                            sentence: "Yo <strong>soy</strong> alérgico a la penicilina.",
                            explanation:
                                "I am allergic to penicillin. A permanent medical characteristic.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "sve-scenario-1",
                    title: "Complete the Conversations",
                    instructions: "Fill in the correct form of ser or estar.",
                    items: [
                        {
                            type: "text",
                            label: "A: ¿Cómo ______? B: ______ bien, gracias.",
                            correctAnswer: "estás, estoy",
                            expectedAnswers: ["estás, estoy", "estás,estoy"],
                        },
                        {
                            type: "text",
                            label: "A: ¿Quién ______? B: Yo ______ Carlos.",
                            correctAnswer: "eres, soy",
                            expectedAnswers: ["eres, soy", "eres,soy"],
                        },
                        {
                            type: "text",
                            label: "A: ¿Dónde ______ el hotel? B: ______ cerca del parque.",
                            correctAnswer: "está, está",
                            expectedAnswers: ["está, está", "está,está"],
                        },
                    ],
                },
            ],
        },

        // Mini Quiz
        {
            id: "final-quiz",
            title: "Final Review: Ser vs Estar",
            icon: "🎓",
            explanation: `
                <h3>You've Got This!</h3>
                <p>Test your mastery of ser and estar. Remember: permanence = ser, temporary = estar.</p>
            `,
            exercises: [
                {
                    id: "sve-final-1",
                    title: "Choose the Correct Verb",
                    instructions: "For each sentence, choose ser or estar.",
                    items: [
                        {
                            type: "radio",
                            label: "¿Cómo ______ el pastel? ______ delicioso.",
                            options: [
                                { value: "eres/soy", label: "Eres/Soy" },
                                { value: "estás/estoy", label: "Estás/Estoy" },
                            ],
                            expectedAnswer: "estás/estoy",
                        },
                        {
                            type: "radio",
                            label: "Mi padre ______ contador.",
                            options: [
                                { value: "ser", label: "Ser (es)" },
                                { value: "estar", label: "Estar (está)" },
                            ],
                            expectedAnswer: "ser",
                        },
                        {
                            type: "radio",
                            label: "Los estudiantes ______ cansados después del examen.",
                            options: [
                                { value: "ser", label: "Ser (son)" },
                                { value: "estar", label: "Estar (están)" },
                            ],
                            expectedAnswer: "estar",
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "Which verb (ser or estar) is used to describe permanent characteristics?",
            options: [
                { value: "a", label: "Ser" },
                { value: "b", label: "Estar" },
            ],
            correctAnswer: "a",
            explanation:
                "Ser is used for permanent characteristics. Yo soy inteligente. Yo soy profesor. Yo soy alto.",
        },
        {
            id: "q2",
            question: "Complete: '¿Cómo _____?' (How are you?)",
            options: [
                { value: "a", label: "¿Cómo eres?" },
                { value: "b", label: "¿Cómo estás?" },
            ],
            correctAnswer: "b",
            explanation:
                "Always use estar for asking how someone is feeling. ¿Cómo estás? The answer is: Estoy bien, gracias.",
        },
        {
            id: "q3",
            question: "Complete: 'Mi hermano _____ en la biblioteca.' (My brother is in the library.)",
            options: [
                { value: "a", label: "es" },
                { value: "b", label: "está" },
            ],
            correctAnswer: "b",
            explanation:
                "Use estar for location. Mi hermano está en la biblioteca. Location is a temporary condition.",
        },
        {
            id: "q4",
            question: "Complete: 'Yo _____ abogado.' (I am a lawyer.)",
            options: [
                { value: "a", label: "soy" },
                { value: "b", label: "estoy" },
            ],
            correctAnswer: "a",
            explanation:
                "Use ser for professions. Yo soy abogado. Your profession is a defining characteristic.",
        },
        {
            id: "q5",
            question: "Complete: 'La sopa _____ caliente.'",
            options: [
                { value: "a", label: "es" },
                { value: "b", label: "está" },
            ],
            correctAnswer: "b",
            explanation: "Use estar for temporary conditions like temperature: La sopa está caliente.",
        },
        {
            id: "q6",
            question: "Complete: 'Madrid _____ la capital de España.'",
            options: [
                { value: "a", label: "es" },
                { value: "b", label: "está" },
            ],
            correctAnswer: "a",
            explanation: "Use ser for definitions and identity facts: Madrid es la capital de España.",
        },
        {
            id: "q7",
            question: "Which sentence is correct for location?",
            options: [
                { value: "a", label: "Los libros están en la mesa." },
                { value: "b", label: "Los libros son en la mesa." },
            ],
            correctAnswer: "a",
            explanation: "Physical location uses estar: están en la mesa.",
        },
        {
            id: "q8",
            question: "Choose the best sentence for profession.",
            options: [
                { value: "a", label: "Ella es doctora." },
                { value: "b", label: "Ella está doctora." },
            ],
            correctAnswer: "a",
            explanation: "Professions use ser: Ella es doctora.",
        },
        {
            id: "q9",
            question: "Complete: 'Nosotros _____ cansados hoy.'",
            options: [
                { value: "a", label: "somos" },
                { value: "b", label: "estamos" },
            ],
            correctAnswer: "b",
            explanation: "Feelings and temporary states use estar: estamos cansados.",
        },
        {
            id: "q10",
            question: "Which pair is correct?",
            options: [
                { value: "a", label: "Soy de México y estoy en Boston." },
                { value: "b", label: "Estoy de México y soy en Boston." },
            ],
            correctAnswer: "a",
            explanation: "Origin uses ser (soy de...), and location uses estar (estoy en...).",
        },
        {
            id: "q11",
            question: "Which sentence has an error?",
            options: [
                { value: "a", label: "Son las dos de la tarde." },
                { value: "b", label: "Están las dos de la tarde." },
            ],
            correctAnswer: "b",
            explanation: "Time and dates always use ser: Son las dos. Never están for telling time.",
        },
        {
            id: "q12",
            question: "Choose the correct verb for a temporary feeling.",
            options: [
                { value: "a", label: "María está enferma hoy." },
                { value: "b", label: "María es enferma hoy." },
            ],
            correctAnswer: "a",
            explanation: "Illness and how you feel right now use estar: está enferma.",
        },
    ],
};
