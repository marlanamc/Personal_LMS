import type { InteractiveGuideContent } from "@/types/activity";

export const spanishAdjectiveAgreementContent: InteractiveGuideContent = {
    type: "interactive-guide",
    tableOfContents: true,
    sections: [
        // Introduction Section
        {
            id: "introduction",
            title: "Spanish Adjective Agreement: Making Words Match",
            icon: "🎨",
            explanation: `
                <div style="background: linear-gradient(135deg, rgba(200, 107, 81, 0.1) 0%, rgba(110, 145, 118, 0.1) 100%); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.125rem; margin-bottom: 0;">In Spanish, adjectives have to "agree" with the nouns they describe. A masculine noun needs a masculine adjective. A plural noun needs a plural adjective. Master this pattern and you'll immediately sound more natural!</p>
                </div>

                <h3>Why This Matters</h3>
                <p>Adjective agreement is one of the biggest differences between Spanish and English. Once you understand how it works, you'll be able to build grammatically correct sentences with ease.</p>
            `,
            exercises: [
                {
                    id: "saa-intro-1",
                    title: "Quick Check: Adjective Agreement",
                    instructions: "Which sentence uses adjectives correctly?",
                    items: [
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "correct", label: "Un libro rojo" },
                                { value: "incorrect", label: "Un libro roja" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Which is correct?",
                            options: [
                                { value: "correct", label: "Dos niñas inteligentes" },
                                { value: "incorrect", label: "Dos niñas inteligente" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
            ],
        },

        // Gender Agreement
        {
            id: "gender-agreement",
            stepNumber: 1,
            title: "Gender Agreement: Masculine & Feminine",
            icon: "♀️♂️",
            explanation: `
                <h3>Nouns Have Gender in Spanish</h3>
                <p>Every Spanish noun is either masculine (el) or feminine (la). Adjectives must match the gender of the noun they describe.</p>
            `,
            usageMeanings: [
                {
                    title: "♂️ Masculine Nouns & Adjectives",
                    description: "Nouns that use 'el' (singular) or 'los' (plural)",
                    examples: [
                        {
                            sentence: "Un libro <strong>rojo</strong>",
                            explanation:
                                "A red book. Libro is masculine, so the adjective rojo is masculine (ends in -o).",
                        },
                        {
                            sentence: "El gato <strong>negro</strong>",
                            explanation:
                                "The black cat. Gato is masculine, so negro matches in masculine form.",
                        },
                        {
                            sentence: "Unos perros <strong>grandes</strong>",
                            explanation:
                                "Some big dogs. Perros is masculine plural, so grandes is masculine plural.",
                        },
                    ],
                },
                {
                    title: "♀️ Feminine Nouns & Adjectives",
                    description: "Nouns that use 'la' (singular) or 'las' (plural)",
                    examples: [
                        {
                            sentence: "Una casa <strong>blanca</strong>",
                            explanation:
                                "A white house. Casa is feminine, so blanca ends in -a to match.",
                        },
                        {
                            sentence: "La mesa <strong>pequeña</strong>",
                            explanation:
                                "The small table. Mesa is feminine, so pequeña is feminine form.",
                        },
                        {
                            sentence: "Unas flores <strong>hermosas</strong>",
                            explanation:
                                "Some beautiful flowers. Flores is feminine plural, so hermosas is feminine plural.",
                        },
                    ],
                },
            ],
            tipBox: {
                title: "📌 How to Know if a Noun is Masculine or Feminine",
                content:
                    "Most nouns ending in -o are masculine (libro, perro, gato). Most nouns ending in -a are feminine (casa, mesa, niña). But remember: it's tied to the article (el/la), not just the ending. Learn articles with the noun!",
            },
            exercises: [
                {
                    id: "saa-gender-1",
                    title: "Match Adjectives to Nouns",
                    instructions: "Choose the correct gender form of the adjective.",
                    items: [
                        {
                            type: "select",
                            label: "El carro ______",
                            options: ["nuevo", "nueva"],
                            expectedAnswer: "nuevo",
                        },
                        {
                            type: "select",
                            label: "La puerta ______",
                            options: ["abierto", "abierta"],
                            expectedAnswer: "abierta",
                        },
                        {
                            type: "select",
                            label: "El pantalón ______",
                            options: ["azul", "azula"],
                            expectedAnswer: "azul",
                        },
                        {
                            type: "select",
                            label: "La blusa ______",
                            options: ["rojo", "roja"],
                            expectedAnswer: "roja",
                        },
                    ],
                },
                {
                    id: "saa-gender-2",
                    title: "Complete with Correct Adjective Forms",
                    instructions: "Fill in the adjective in the correct gender form.",
                    items: [
                        {
                            type: "text",
                            label: "Un coche ______ (rojo)",
                            correctAnswer: "rojo",
                            expectedAnswers: ["rojo"],
                        },
                        {
                            type: "text",
                            label: "Una niña ______ (bonito)",
                            correctAnswer: "bonita",
                            expectedAnswers: ["bonita"],
                        },
                        {
                            type: "text",
                            label: "El día ______ (soleado)",
                            correctAnswer: "soleado",
                            expectedAnswers: ["soleado"],
                        },
                        {
                            type: "text",
                            label: "La noche ______ (oscuro)",
                            correctAnswer: "oscura",
                            expectedAnswers: ["oscura"],
                        },
                    ],
                },
            ],
        },

        // Number Agreement
        {
            id: "number-agreement",
            stepNumber: 2,
            title: "Number Agreement: Singular & Plural",
            icon: "📊",
            explanation: `
                <h3>Singular vs Plural</h3>
                <p>Just like nouns, adjectives change when you go from one item to multiple items. This is called number agreement.</p>
            `,
            comparison: {
                title: "Singular vs Plural Adjectives",
                leftLabel: "Singular",
                rightLabel: "Plural",
                rows: [
                    {
                        label: "Red:",
                        left: "un carro rojo (one red car)",
                        right: "dos carros rojos (two red cars)",
                    },
                    {
                        label: "Small:",
                        left: "una casa pequeña (one small house)",
                        right: "tres casas pequeñas (three small houses)",
                    },
                    {
                        label: "Blue:",
                        left: "el cielo azul (the blue sky)",
                        right: "los cielos azules (the blue skies)",
                    },
                    {
                        label: "Happy:",
                        left: "un niño feliz (one happy boy)",
                        right: "unos niños felices (some happy boys)",
                    },
                ],
            },
            usageMeanings: [
                {
                    title: "1️⃣ Singular Adjectives",
                    description: "Describing one item",
                    examples: [
                        {
                            sentence: "Un gato <strong>negro</strong>",
                            explanation: "A black cat (singular masculine)",
                        },
                        {
                            sentence: "Una casa <strong>grande</strong>",
                            explanation: "A big house (singular feminine)",
                        },
                    ],
                },
                {
                    title: "2️⃣ Plural Adjectives",
                    description: "Describing multiple items",
                    examples: [
                        {
                            sentence: "Dos gatos <strong>negros</strong>",
                            explanation:
                                "Two black cats (plural masculine). Notice the -s at the end.",
                        },
                        {
                            sentence: "Tres casas <strong>grandes</strong>",
                            explanation:
                                "Three big houses (plural feminine). Plural adjectives add -s.",
                        },
                        {
                            sentence: "Unos niños <strong>felices</strong>",
                            explanation:
                                "Some happy boys (plural masculine). Adjectives ending in -z change to -ces in plural.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "saa-number-1",
                    title: "Singular to Plural",
                    instructions: "Change these adjective phrases to plural.",
                    items: [
                        {
                            type: "text",
                            label: "un libro rojo → dos libros ______",
                            correctAnswer: "rojos",
                            expectedAnswers: ["rojos"],
                        },
                        {
                            type: "text",
                            label: "una mesa blanca → cuatro mesas ______",
                            correctAnswer: "blancas",
                            expectedAnswers: ["blancas"],
                        },
                        {
                            type: "text",
                            label: "un niño inteligente → cinco niños ______",
                            correctAnswer: "inteligentes",
                            expectedAnswers: ["inteligentes"],
                        },
                        {
                            type: "text",
                            label: "un hombre feliz → tres hombres ______",
                            correctAnswer: "felices",
                            expectedAnswers: ["felices"],
                        },
                    ],
                },
                {
                    id: "saa-number-2",
                    title: "Identify Singular or Plural",
                    instructions: "Is the adjective singular or plural?",
                    items: [
                        {
                            type: "radio",
                            label: "rojos",
                            options: [
                                { value: "singular", label: "Singular" },
                                { value: "plural", label: "Plural" },
                            ],
                            expectedAnswer: "plural",
                        },
                        {
                            type: "radio",
                            label: "pequeña",
                            options: [
                                { value: "singular", label: "Singular" },
                                { value: "plural", label: "Plural" },
                            ],
                            expectedAnswer: "singular",
                        },
                        {
                            type: "radio",
                            label: "hermosas",
                            options: [
                                { value: "singular", label: "Singular" },
                                { value: "plural", label: "Plural" },
                            ],
                            expectedAnswer: "plural",
                        },
                    ],
                },
            ],
        },

        // Adjectives That Don't Change
        {
            id: "invariable-adjectives",
            stepNumber: 3,
            title: "Adjectives That Don't Change (Much)",
            icon: "🔒",
            explanation: `
                <h3>Some Adjectives Are "Invariable"</h3>
                <p>Some Spanish adjectives don't follow typical gender/number endings. Learn to recognize them!</p>
            `,
            usageMeanings: [
                {
                    title: "🌈 Adjectives Ending in -E",
                    description: "These work for masculine and feminine",
                    examples: [
                        {
                            sentence: "Un libro <strong>interesante</strong> / Una película <strong>interesante</strong>",
                            explanation:
                                "An interesting book / An interesting movie. Same form for masculine and feminine.",
                        },
                        {
                            sentence: "Un tema <strong>importante</strong> / Una idea <strong>importante</strong>",
                            explanation:
                                "An important topic / An important idea. -E adjectives don't change for gender.",
                        },
                    ],
                },
                {
                    title: "🎨 Colors & Other Invariable Adjectives",
                    description: "Some colors and special adjectives don't change for gender",
                    examples: [
                        {
                            sentence: "Un coche <strong>azul</strong> / Una casa <strong>azul</strong>",
                            explanation:
                                "A blue car / A blue house. Colors ending in consonants (azul, gris, verde) don't change for gender.",
                        },
                        {
                            sentence: "Una idea <strong>clave</strong> / Un concepto <strong>clave</strong>",
                            explanation: "A key idea / A key concept. Clave doesn't change for gender.",
                        },
                    ],
                },
                {
                    title: "📌 Remember: Plural Still Applies",
                    description: "Even invariable adjectives get plural -s",
                    examples: [
                        {
                            sentence: "Dos libros <strong>interesantes</strong>",
                            explanation:
                                "Two interesting books. Even -e adjectives add -s for plural.",
                        },
                        {
                            sentence: "Tres casas <strong>azules</strong>",
                            explanation:
                                "Three blue houses. Azul becomes azules in plural (azul + es).",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "saa-invariable-1",
                    title: "Complete with Invariable Adjectives",
                    instructions: "Fill in the correct form of the invariable adjective.",
                    items: [
                        {
                            type: "text",
                            label: "Un día ______ (importante)",
                            correctAnswer: "importante",
                            expectedAnswers: ["importante"],
                        },
                        {
                            type: "text",
                            label: "Una persona ______ (inteligente)",
                            correctAnswer: "inteligente",
                            expectedAnswers: ["inteligente"],
                        },
                        {
                            type: "text",
                            label: "Dos objetos ________ (interesante)",
                            correctAnswer: "interesantes",
                            expectedAnswers: ["interesantes"],
                        },
                        {
                            type: "text",
                            label: "Una camisa ______ (azul)",
                            correctAnswer: "azul",
                            expectedAnswers: ["azul"],
                        },
                    ],
                },
            ],
        },

        // Adjective Endings Overview
        {
            id: "endings-overview",
            stepNumber: 4,
            title: "Adjective Ending Patterns",
            icon: "🔤",
            explanation: `
                <h3>Common Ending Patterns</h3>
                <p>Understanding adjective endings helps you predict how they'll agree.</p>
            `,
            verbTable: {
                title: "Common Adjective Patterns",
                headers: ["Ending", "Masculine Sing.", "Masculine Plur.", "Feminine Sing.", "Feminine Plur.", "Example"],
                rows: [
                    ["-O/-A", "rojo", "rojos", "roja", "rojas", "red car/car"],
                    ["-O/-A (color)", "blanco", "blancos", "blanca", "blancas", "white horse/house"],
                    ["-E", "interesante", "interesantes", "interesante", "interesantes", "interesting"],
                    ["-L, -R, -Z", "azul", "azules", "azul", "azules", "blue"],
                    ["-Z → -C-", "feliz", "felices", "feliz", "felices", "happy"],
                ],
            },
            usageMeanings: [
                {
                    title: "🎨 The -O/-A Pattern (Most Common)",
                    description: "Regular adjectives that change for gender",
                    examples: [
                        {
                            sentence: "rojo, roja, rojos, rojas",
                            explanation: "The most common pattern. Changes for both gender and number.",
                        },
                        {
                            sentence: "pequeño, pequeña, pequeños, pequeñas",
                            explanation:
                                "Small. Another common -o/-a adjective.",
                        },
                    ],
                },
                {
                    title: "🔒 The -E Pattern (Gender-Invariable)",
                    description: "Same form for masculine and feminine, but changes for number",
                    examples: [
                        {
                            sentence: "interesante, interesantes",
                            explanation:
                                "Only 2 forms: singular and plural. Same for masculine and feminine.",
                        },
                        {
                            sentence: "importante, importantes",
                            explanation: "Another common -e adjective with only 2 forms.",
                        },
                    ],
                },
                {
                    title: "🌈 Color Adjectives",
                    description: "How colors typically agree",
                    examples: [
                        {
                            sentence: "Rojo/Roja (changes) vs Azul (doesn't change for gender)",
                            explanation:
                                "Some colors are regular (-o/-a), some are invariable for gender.",
                        },
                        {
                            sentence: "Una camiseta roja, un pantalón azul",
                            explanation:
                                "Roja agrees, azul stays the same even though the nouns have different genders.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "saa-endings-1",
                    title: "Predict Plural Forms",
                    instructions: "Based on the singular, give the plural form.",
                    items: [
                        {
                            type: "text",
                            label: "bonito → ______",
                            correctAnswer: "bonitos",
                            expectedAnswers: ["bonitos"],
                        },
                        {
                            type: "text",
                            label: "grande → ______",
                            correctAnswer: "grandes",
                            expectedAnswers: ["grandes"],
                        },
                        {
                            type: "text",
                            label: "feliz → ______",
                            correctAnswer: "felices",
                            expectedAnswers: ["felices"],
                        },
                        {
                            type: "text",
                            label: "azul → ______",
                            correctAnswer: "azules",
                            expectedAnswers: ["azules"],
                        },
                    ],
                },
            ],
        },

        // Common Mistakes
        {
            id: "common-mistakes",
            stepNumber: 5,
            title: "Common Agreement Mistakes",
            icon: "⚠️",
            explanation: `
                <h3>What NOT to Do</h3>
                <p>Watch out for these common mistakes when using adjectives!</p>
            `,
            usageMeanings: [
                {
                    title: "❌ Forgetting Gender Agreement",
                    description: "Using wrong gender",
                    examples: [
                        {
                            sentence: "❌ Una casa rojo ✓ Una casa roja",
                            explanation:
                                "WRONG: 'rojo' is masculine. CORRECT: Use 'roja' to match feminine 'casa'.",
                        },
                        {
                            sentence: "❌ Un libro blanca ✓ Un libro blanco",
                            explanation: "WRONG: 'blanca' is feminine. CORRECT: Use 'blanco' for masculine 'libro'.",
                        },
                    ],
                },
                {
                    title: "❌ Forgetting Plural -S",
                    description: "Not making adjectives plural",
                    examples: [
                        {
                            sentence: "❌ Dos gatos negro ✓ Dos gatos negros",
                            explanation: "WRONG: Missing the -s. CORRECT: Add -s for plural.",
                        },
                        {
                            sentence: "❌ Tres niñas inteligente ✓ Tres niñas inteligentes",
                            explanation:
                                "WRONG: Even -e adjectives need plural -s. CORRECT: inteligentes.",
                        },
                    ],
                },
                {
                    title: "❌ Confusing Invariable Adjectives",
                    description: "Treating invariable adjectives as regular",
                    examples: [
                        {
                            sentence: "❌ Una camiseta azula ✓ Una camiseta azul",
                            explanation:
                                "WRONG: Azul doesn't change for gender. CORRECT: Still use 'azul'.",
                        },
                        {
                            sentence: "❌ Un tema importanta ✓ Un tema importante",
                            explanation:
                                "WRONG: Importante doesn't change for gender. CORRECT: Same form for both.",
                        },
                    ],
                },
            ],
            exercises: [
                {
                    id: "saa-mistakes-1",
                    title: "Identify and Fix Errors",
                    instructions: "Is the adjective agreement correct or incorrect?",
                    items: [
                        {
                            type: "radio",
                            label: "Un coche roja",
                            options: [
                                { value: "correct", label: "Correct" },
                                { value: "incorrect", label: "Incorrect (should be 'rojo')" },
                            ],
                            expectedAnswer: "incorrect",
                        },
                        {
                            type: "radio",
                            label: "Dos libros interesantes",
                            options: [
                                { value: "correct", label: "Correct" },
                                { value: "incorrect", label: "Incorrect" },
                            ],
                            expectedAnswer: "correct",
                        },
                        {
                            type: "radio",
                            label: "Una falda azula",
                            options: [
                                { value: "correct", label: "Correct" },
                                { value: "incorrect", label: "Incorrect (should be 'azul')" },
                            ],
                            expectedAnswer: "incorrect",
                        },
                        {
                            type: "radio",
                            label: "Tres gatitos pequeños",
                            options: [
                                { value: "correct", label: "Correct" },
                                { value: "incorrect", label: "Incorrect" },
                            ],
                            expectedAnswer: "correct",
                        },
                    ],
                },
                {
                    id: "saa-mistakes-2",
                    title: "Correct the Sentences",
                    instructions: "Fix the adjective agreement errors.",
                    items: [
                        {
                            type: "text",
                            label: "Corrija: Un libro blanca",
                            correctAnswer: "blanco",
                            expectedAnswers: ["blanco"],
                        },
                        {
                            type: "text",
                            label: "Corrija: Dos niñas feliz",
                            correctAnswer: "felices",
                            expectedAnswers: ["felices"],
                        },
                        {
                            type: "text",
                            label: "Corrija: Una situación complicado",
                            correctAnswer: "complicada",
                            expectedAnswers: ["complicada"],
                        },
                    ],
                },
            ],
        },

        // Practical Summary
        {
            id: "practical-summary",
            stepNumber: 6,
            title: "Adjective Agreement in Practice",
            icon: "🎓",
            explanation: `
                <h3>Quick Reference</h3>
                <p>Here's how to check if your adjective agreement is correct:</p>
                <ol style="font-size: 1.05rem; line-height: 1.8;">
                    <li><strong>Look at the noun:</strong> Is it masculine or feminine? Singular or plural?</li>
                    <li><strong>Match the adjective:</strong> Make sure the adjective has the same gender and number.</li>
                    <li><strong>Check for exceptions:</strong> Are you using an invariable adjective like 'azul' or 'interesante'?</li>
                    <li><strong>When in doubt:</strong> Look up the adjective! Not all adjectives follow standard patterns.</li>
                </ol>
            `,
            exercises: [
                {
                    id: "saa-practical-1",
                    title: "Complete the Sentences",
                    instructions: "Fill in adjectives that agree with the nouns.",
                    items: [
                        {
                            type: "text",
                            label: "Mi hermano es ______ (alto).",
                            correctAnswer: "alto",
                            expectedAnswers: ["alto"],
                        },
                        {
                            type: "text",
                            label: "Sus hermanas son ______ (alta).",
                            correctAnswer: "altas",
                            expectedAnswers: ["altas"],
                        },
                        {
                            type: "text",
                            label: "El cielo está ______ (nublado).",
                            correctAnswer: "nublado",
                            expectedAnswers: ["nublado"],
                        },
                        {
                            type: "text",
                            label: "Las flores son ______ (hermoso).",
                            correctAnswer: "hermosas",
                            expectedAnswers: ["hermosas"],
                        },
                        {
                            type: "text",
                            label: "Ese problema es muy ______ (complicado).",
                            correctAnswer: "complicado",
                            expectedAnswers: ["complicado"],
                        },
                    ],
                },
                {
                    id: "saa-practical-2",
                    title: "Mixed Review",
                    instructions: "Make all necessary agreements in these sentences.",
                    items: [
                        {
                            type: "text",
                            label: "Una casa ______ (grande) con jardines _______ (hermoso)",
                            correctAnswer: "grande, hermosos",
                            expectedAnswers: ["grande, hermosos", "grande,hermosos"],
                        },
                        {
                            type: "text",
                            label: "Los gatos ______ (negro) están ______ (dormido).",
                            correctAnswer: "negros, dormidos",
                            expectedAnswers: ["negros, dormidos", "negros,dormidos"],
                        },
                    ],
                },
            ],
        },
    ],
    miniQuiz: [
        {
            id: "q1",
            question: "What should the adjective be? 'Una casa _______' (big)",
            options: [
                { value: "a", label: "grande" },
                { value: "b", label: "grandefeminino" },
                { value: "c", label: "grafica" },
            ],
            correctAnswer: "a",
            explanation:
                "Grande doesn't change for gender. Use 'grande' for both 'un libro grande' and 'una casa grande'.",
        },
        {
            id: "q2",
            question: "What is the plural of 'gato negro'?",
            options: [
                { value: "a", label: "gatos negro" },
                { value: "b", label: "gatos negros" },
                { value: "c", label: "gato negros" },
            ],
            correctAnswer: "b",
            explanation:
                "Both the noun and adjective must be plural. Gatos negros. The -o ending changes to -os.",
        },
        {
            id: "q3",
            question: "Which is correct?",
            options: [
                { value: "a", label: "Un libro azul" },
                { value: "b", label: "Un libro azula" },
                { value: "c", label: "Un libro azules" },
            ],
            correctAnswer: "a",
            explanation:
                "Azul doesn't change for gender or for singular. It stays 'azul'. Use 'azules' only in plural.",
        },
        {
            id: "q4",
            question: "How do you make 'feliz' plural?",
            options: [
                { value: "a", label: "felizes" },
                { value: "b", label: "felices" },
                { value: "c", label: "feliz" },
            ],
            correctAnswer: "b",
            explanation:
                "Adjectives ending in -z change to -ces in plural. So 'feliz' becomes 'felices' in plural.",
        },
        {
            id: "q5",
            question: "Choose the correct phrase:",
            options: [
                { value: "a", label: "las casas blancas" },
                { value: "b", label: "las casas blanco" },
                { value: "c", label: "las casa blancas" },
            ],
            correctAnswer: "a",
            explanation: "Both noun and adjective must match feminine plural: casas blancas.",
        },
        {
            id: "q6",
            question: "What is correct for masculine plural?",
            options: [
                { value: "a", label: "los estudiantes inteligentes" },
                { value: "b", label: "los estudiantes inteligente" },
                { value: "c", label: "los estudiante inteligentes" },
            ],
            correctAnswer: "a",
            explanation: "Plural noun and adjective both need plural agreement: estudiantes inteligentes.",
        },
        {
            id: "q7",
            question: "Complete: 'Una niña ___ (pequeño)'",
            options: [
                { value: "a", label: "pequeño" },
                { value: "b", label: "pequeña" },
                { value: "c", label: "pequeños" },
            ],
            correctAnswer: "b",
            explanation: "Niña is feminine singular, so adjective must be feminine singular: pequeña.",
        },
        {
            id: "q8",
            question: "Which sentence has correct agreement?",
            options: [
                { value: "a", label: "Los libros son interesantes." },
                { value: "b", label: "Los libros son interesante." },
                { value: "c", label: "Los libro son interesantes." },
            ],
            correctAnswer: "a",
            explanation: "Plural masculine noun libros requires plural adjective: interesantes.",
        },
        {
            id: "q9",
            question: "What is the correct feminine plural form of 'bonito'?",
            options: [
                { value: "a", label: "bonitas" },
                { value: "b", label: "bonitos" },
                { value: "c", label: "bonita" },
            ],
            correctAnswer: "a",
            explanation: "For feminine plural nouns, adjectives ending in -o become -as: bonitas.",
        },
        {
            id: "q10",
            question: "Choose the best sentence:",
            options: [
                { value: "a", label: "El carro rojo está afuera." },
                { value: "b", label: "El carro roja está afuera." },
                { value: "c", label: "El carros rojo está afuera." },
            ],
            correctAnswer: "a",
            explanation: "Carro is masculine singular, so adjective must be masculine singular: rojo.",
        },
    ],
};
