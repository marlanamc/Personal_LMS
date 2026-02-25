import type { InteractiveGuideContent } from "@/types/activity";

export const spanishImmediateFutureContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "future-pattern",
      title: "Immediate Future with ir + a + infinitive",
      icon: "🕒",
      explanation: `
        <h3>A2 Essential: Talk About Plans</h3>
        <p>Spanish commonly uses <strong>ir + a + infinitive</strong> to express near future plans and intentions.</p>
        <p>Pattern: <strong>subject + ir (conjugated) + a + infinitive</strong></p>
        <p>Example: <em>Voy a estudiar esta noche.</em> (I am going to study tonight.)</p>
      `,
      verbTable: {
        title: "Conjugation of ir (present)",
        headers: ["Subject", "Form", "Example"],
        rows: [
          ["yo", "voy", "Voy a cocinar."],
          ["tú", "vas", "Vas a trabajar."],
          ["él/ella/usted", "va", "Va a llamar."],
          ["nosotros/as", "vamos", "Vamos a salir."],
          ["ellos/ellas/ustedes", "van", "Van a viajar."],
        ],
      },
      exercises: [
        {
          id: "sp-future-1",
          title: "Build the Future Phrase",
          instructions: "Choose the correct form of ir.",
          items: [
            {
              type: "select",
              label: "Yo ___ a estudiar mañana.",
              options: ["voy", "va", "vamos"],
              expectedAnswer: "voy",
            },
            {
              type: "select",
              label: "Nosotros ___ a comer en casa.",
              options: ["vamos", "van", "vas"],
              expectedAnswer: "vamos",
            },
            {
              type: "select",
              label: "Ellas ___ a viajar en junio.",
              options: ["va", "van", "voy"],
              expectedAnswer: "van",
            },
          ],
        },
      ],
    },
    {
      id: "future-time-markers",
      stepNumber: 1,
      title: "Time Markers for Future Plans",
      icon: "📅",
      explanation: `
        <h3>Sound Natural with Time Expressions</h3>
        <p>Combine immediate future with clear time markers.</p>
      `,
      timeExpressions: [
        {
          word: "mañana",
          usage: "tomorrow",
          examples: ["Mañana voy a llamar a mi mamá."],
        },
        {
          word: "esta noche",
          usage: "tonight",
          examples: ["Esta noche vamos a ver una película."],
        },
        {
          word: "el próximo fin de semana",
          usage: "next weekend",
          examples: ["El próximo fin de semana van a descansar."],
        },
        {
          word: "más tarde",
          usage: "later",
          examples: ["Más tarde voy a terminar la tarea."],
        },
      ],
      exercises: [
        {
          id: "sp-future-2",
          title: "Choose the Best Time Marker",
          instructions: "Pick the phrase that fits each sentence.",
          items: [
            {
              type: "radio",
              label: "Voy a dormir ___ (tonight).",
              options: [
                { value: "esta-noche", label: "esta noche" },
                { value: "ayer", label: "ayer" },
              ],
              expectedAnswer: "esta-noche",
            },
            {
              type: "radio",
              label: "Vamos a visitar a Ana ___ (next weekend).",
              options: [
                { value: "proximo", label: "el próximo fin de semana" },
                { value: "anoche", label: "anoche" },
              ],
              expectedAnswer: "proximo",
            },
          ],
        },
      ],
    },
    {
      id: "future-vs-present",
      stepNumber: 2,
      title: "Present vs Immediate Future",
      icon: "↔️",
      explanation: `
        <h3>Which One Should You Use?</h3>
        <p>Both can talk about the future, but <strong>ir + a + infinitive</strong> sounds more explicit about intention.</p>
      `,
      comparison: {
        title: "Meaning Difference",
        leftLabel: "Present tense",
        rightLabel: "Immediate future",
        rows: [
          {
            label: "General future schedule",
            left: "Mañana trabajo.",
            right: "Mañana voy a trabajar.",
          },
          {
            label: "Plan/intention",
            left: "Esta tarde estudio.",
            right: "Esta tarde voy a estudiar.",
          },
          {
            label: "Group plan",
            left: "El sábado salimos.",
            right: "El sábado vamos a salir.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-future-3",
          title: "Rewrite with ir + a + infinitive",
          instructions: "Convert each sentence into immediate future.",
          items: [
            {
              type: "text",
              label: "Mañana estudio español.",
              correctAnswer: "Mañana voy a estudiar español.",
              expectedAnswers: ["Mañana voy a estudiar español.", "voy a estudiar español mañana", "Mañana voy a estudiar espanol."],
            },
            {
              type: "text",
              label: "Esta noche cocinamos en casa.",
              correctAnswer: "Esta noche vamos a cocinar en casa.",
              expectedAnswers: ["Esta noche vamos a cocinar en casa.", "vamos a cocinar en casa esta noche"],
            },
          ],
        },
      ],
    },
    {
      id: "future-speaking",
      stepNumber: 3,
      title: "Real-Life Planning Language",
      icon: "🗂️",
      explanation: `
        <h3>Useful A2 Planning Frames</h3>
        <ul>
          <li><strong>Voy a + infinitive</strong> (I am going to...)</li>
          <li><strong>No voy a + infinitive</strong> (I am not going to...)</li>
          <li><strong>¿Vas a + infinitive?</strong> (Are you going to...?)</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-future-4",
          title: "Planning Dialogue",
          instructions: "Fill with the best immediate future form.",
          items: [
            {
              type: "text",
              label: "¿Tú ______ (ir + estudiar) mañana?",
              correctAnswer: "vas a estudiar",
              expectedAnswers: ["vas a estudiar"],
            },
            {
              type: "text",
              label: "No ______ (ir + salir) hoy; estoy cansado.",
              correctAnswer: "voy a salir",
              expectedAnswers: ["voy a salir"],
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "future-q1",
      question: "What is the immediate future pattern?",
      options: [
        { value: "a", label: "ir + infinitive" },
        { value: "b", label: "ir + a + infinitive" },
        { value: "c", label: "estar + infinitive" },
      ],
      correctAnswer: "b",
      explanation: "Immediate future requires ir + a + infinitive.",
    },
    {
      id: "future-q2",
      question: "Choose the correct sentence for 'We are going to eat'.",
      options: [
        { value: "a", label: "Vamos a comer." },
        { value: "b", label: "Vamos comer." },
        { value: "c", label: "Va a comer." },
      ],
      correctAnswer: "a",
      explanation: "Need vamos + a + comer.",
    },
    {
      id: "future-q3",
      question: "Which form of ir goes with 'yo'?",
      options: [
        { value: "a", label: "va" },
        { value: "b", label: "voy" },
        { value: "c", label: "vas" },
      ],
      correctAnswer: "b",
      explanation: "Yo voy.",
    },
    {
      id: "future-q4",
      question: "How do you say 'They are not going to travel'?",
      options: [
        { value: "a", label: "No van a viajar." },
        { value: "b", label: "Van no a viajar." },
        { value: "c", label: "No va a viajar." },
      ],
      correctAnswer: "a",
      explanation: "No goes before conjugated verb: no van.",
    },
    {
      id: "future-q5",
      question: "Which time phrase means 'later'?",
      options: [
        { value: "a", label: "más tarde" },
        { value: "b", label: "ayer" },
        { value: "c", label: "anoche" },
      ],
      correctAnswer: "a",
      explanation: "Más tarde = later.",
    },
    {
      id: "future-q6",
      question: "Best translation: 'Are you going to call me tonight?'",
      options: [
        { value: "a", label: "¿Vas a llamarme esta noche?" },
        { value: "b", label: "¿Llamas me esta noche?" },
        { value: "c", label: "¿Vas llamarme esta noche?" },
      ],
      correctAnswer: "a",
      explanation: "Use vas a + infinitive for immediate future question.",
    },
  ],
};
