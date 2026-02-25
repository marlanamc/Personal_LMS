import type { InteractiveGuideContent } from "@/types/activity";

export const spanishComparativesSuperlativesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "comparatives-core",
      title: "Comparatives in Spanish (A2 Bridge)",
      icon: "⚖️",
      explanation: `
        <h3>Compare Clearly and Naturally</h3>
        <p>Comparatives help you describe differences between people, places, ideas, and routines.</p>
        <p>Core patterns:</p>
        <ul>
          <li><strong>más ... que</strong> = more ... than</li>
          <li><strong>menos ... que</strong> = less ... than</li>
          <li><strong>tan ... como</strong> = as ... as</li>
        </ul>
      `,
      comparison: {
        title: "Core Comparison Patterns",
        leftLabel: "Pattern",
        rightLabel: "Example",
        rows: [
          { label: "More than", left: "más + adjective + que", right: "Ana es más alta que Luis." },
          { label: "Less than", left: "menos + noun + que", right: "Tengo menos tiempo que ayer." },
          { label: "As ... as", left: "tan + adjective + como", right: "Mi casa es tan grande como la tuya." },
        ],
      },
      exercises: [
        {
          id: "sp-comp-1",
          title: "Choose the Correct Comparative",
          instructions: "Pick the best option for each sentence.",
          items: [
            {
              type: "select",
              label: "Mi hermano es ___ alto que yo.",
              options: ["más", "menos", "tan"],
              expectedAnswer: "más",
            },
            {
              type: "select",
              label: "Este examen es ___ difícil que el otro.",
              options: ["menos", "más", "tan"],
              expectedAnswer: "menos",
            },
            {
              type: "select",
              label: "La sopa está ___ caliente como ayer.",
              options: ["tan", "más", "menos"],
              expectedAnswer: "tan",
            },
          ],
        },
      ],
    },
    {
      id: "superlatives-core",
      stepNumber: 1,
      title: "Superlatives: el/la/los/las más",
      icon: "🏆",
      explanation: `
        <h3>Say "the most" and "the least"</h3>
        <p>Use <strong>el/la/los/las + más/menos + adjective</strong> for relative superlatives.</p>
        <p>Examples:</p>
        <ul>
          <li><em>Ella es la más organizada del grupo.</em></li>
          <li><em>Este es el menos caro de los tres.</em></li>
        </ul>
      `,
      verbTable: {
        title: "Relative Superlative Agreement",
        headers: ["Gender/Number", "Pattern", "Example"],
        rows: [
          ["Masculine singular", "el más + adjective", "el más rápido"],
          ["Feminine singular", "la más + adjective", "la más rápida"],
          ["Masculine plural", "los más + adjective", "los más rápidos"],
          ["Feminine plural", "las más + adjective", "las más rápidas"],
        ],
      },
      exercises: [
        {
          id: "sp-comp-2",
          title: "Build the Superlative",
          instructions: "Select the correct article + form.",
          items: [
            {
              type: "radio",
              label: "___ estudiante más responsable de la clase (female)",
              options: [
                { value: "a", label: "El" },
                { value: "b", label: "La" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "___ libros más interesantes (masculine plural)",
              options: [
                { value: "a", label: "Los" },
                { value: "b", label: "Las" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Complete: Esta tienda es la ___ barata de la zona.",
              correctAnswer: "más",
              expectedAnswers: ["más", "mas"],
            },
          ],
        },
      ],
    },
    {
      id: "que-vs-de",
      stepNumber: 2,
      title: "Más que vs más de",
      icon: "🧩",
      explanation: `
        <h3>A2 Accuracy Point</h3>
        <p>Use <strong>más/menos + que</strong> when comparing two things directly.</p>
        <p>Use <strong>más/menos + de</strong> before numbers or quantities.</p>
        <ul>
          <li><em>Trabajo más que mi compañero.</em></li>
          <li><em>Trabajo más de ocho horas.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-comp-3",
          title: "Que or De?",
          instructions: "Choose the right connector.",
          items: [
            {
              type: "select",
              label: "Tengo más libros ___ tú.",
              options: ["que", "de"],
              expectedAnswer: "que",
            },
            {
              type: "select",
              label: "Necesitamos más ___ veinte sillas.",
              options: ["que", "de"],
              expectedAnswer: "de",
            },
            {
              type: "text",
              label: "Completa: Corro menos ___ antes.",
              correctAnswer: "que",
              expectedAnswers: ["que"],
            },
          ],
        },
      ],
    },
    {
      id: "a2-production",
      stepNumber: 3,
      title: "A2 Production: Compare and Defend",
      icon: "🗣️",
      explanation: `
        <h3>Use Comparatives in Real Context</h3>
        <p>Produce complete ideas, not isolated phrases. Use reasons with <strong>porque</strong>.</p>
        <p>Frame:</p>
        <p><em>X es más/menos/tan... que Y porque...</em></p>
      `,
      exercises: [
        {
          id: "sp-comp-4",
          title: "Write Comparative Statements",
          instructions: "Write complete sentences with clear comparison and reason.",
          items: [
            {
              type: "text",
              label: "Compare two cities you know (más ... que).",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Write one sentence with tan ... como.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Write one superlative sentence (el/la más...).",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "comp-q1",
      question: "Choose the correct comparative: 'María is taller than Ana.'",
      options: [
        { value: "a", label: "María es más alta que Ana." },
        { value: "b", label: "María es tan alta de Ana." },
        { value: "c", label: "María es menos alta que Ana." },
      ],
      correctAnswer: "a",
      explanation: "Use más + adjective + que for 'more ... than'.",
    },
    {
      id: "comp-q2",
      question: "Which pattern means 'as ... as'?",
      options: [
        { value: "a", label: "más ... que" },
        { value: "b", label: "tan ... como" },
        { value: "c", label: "menos ... de" },
      ],
      correctAnswer: "b",
      explanation: "Tan ... como expresses equality.",
    },
    {
      id: "comp-q3",
      question: "Pick the best sentence: 'This car is less expensive than that one.'",
      options: [
        { value: "a", label: "Este carro es menos caro que ese." },
        { value: "b", label: "Este carro es menos caro de ese." },
        { value: "c", label: "Este carro es tan caro que ese." },
      ],
      correctAnswer: "a",
      explanation: "Comparisons between two things use que.",
    },
    {
      id: "comp-q4",
      question: "Complete: 'Necesito más ___ diez minutos.'",
      options: [
        { value: "a", label: "que" },
        { value: "b", label: "de" },
        { value: "c", label: "como" },
      ],
      correctAnswer: "b",
      explanation: "Before numbers/quantities, use más de.",
    },
    {
      id: "comp-q5",
      question: "Which is the feminine singular superlative article?",
      options: [
        { value: "a", label: "el" },
        { value: "b", label: "los" },
        { value: "c", label: "la" },
      ],
      correctAnswer: "c",
      explanation: "Feminine singular uses la.",
    },
    {
      id: "comp-q6",
      question: "Choose the correct sentence: 'They are the most prepared students.'",
      options: [
        { value: "a", label: "Son las más preparadas estudiantes." },
        { value: "b", label: "Son los estudiantes más preparados." },
        { value: "c", label: "Son el estudiantes más preparados." },
      ],
      correctAnswer: "b",
      explanation: "This is the natural superlative structure with masculine plural noun phrase.",
    },
    {
      id: "comp-q7",
      question: "Which sentence expresses equality?",
      options: [
        { value: "a", label: "Mi casa es más grande que la tuya." },
        { value: "b", label: "Mi casa es tan grande como la tuya." },
        { value: "c", label: "Mi casa es menos grande que la tuya." },
      ],
      correctAnswer: "b",
      explanation: "Tan ... como indicates equal degree.",
    },
    {
      id: "comp-q8",
      question: "Pick the correct contrast:",
      options: [
        { value: "a", label: "Trabajo más que ocho horas." },
        { value: "b", label: "Trabajo más de ocho horas." },
        { value: "c", label: "Trabajo tan de ocho horas." },
      ],
      correctAnswer: "b",
      explanation: "Quantities with numbers require de.",
    },
    {
      id: "comp-q9",
      question: "Choose the best superlative sentence for a feminine plural group.",
      options: [
        { value: "a", label: "Las más rápidas corredoras ganaron." },
        { value: "b", label: "Los más rápidas corredoras ganaron." },
        { value: "c", label: "La más rápidas corredoras ganaron." },
      ],
      correctAnswer: "a",
      explanation: "Article and adjective must agree with feminine plural noun.",
    },
    {
      id: "comp-q10",
      question: "What is the best completion: 'Este restaurante es el ___ barato del barrio.'",
      options: [
        { value: "a", label: "más" },
        { value: "b", label: "menos" },
        { value: "c", label: "tan" },
      ],
      correctAnswer: "a",
      explanation: "El más barato = the cheapest in this context.",
    },
  ],
};
