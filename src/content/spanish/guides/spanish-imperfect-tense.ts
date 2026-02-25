import type { InteractiveGuideContent } from "@/types/activity";

export const spanishImperfectTenseContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "imperfect-overview",
      title: "Spanish Imperfect Tense (A2 Foundation)",
      icon: "🌙",
      explanation: `
        <h3>Past Habits and Background</h3>
        <p>The imperfect describes ongoing or repeated past situations:</p>
        <ul>
          <li>past habits: <em>Cuando era niño, jugaba fútbol.</em></li>
          <li>background descriptions: <em>La casa era grande.</em></li>
          <li>time/weather in the past: <em>Hacía frío y llovía.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-imp-1",
          title: "Identify Imperfect Meaning",
          instructions: "Choose what the imperfect is expressing.",
          items: [
            {
              type: "radio",
              label: "'De niño, vivía en México.' expresses...",
              options: [
                { value: "habit", label: "a past habit/background period" },
                { value: "single", label: "a single completed event" },
              ],
              expectedAnswer: "habit",
            },
            {
              type: "radio",
              label: "'Eran las ocho.' expresses...",
              options: [
                { value: "description", label: "time/background" },
                { value: "future", label: "a future plan" },
              ],
              expectedAnswer: "description",
            },
          ],
        },
      ],
    },
    {
      id: "imperfect-formation",
      stepNumber: 1,
      title: "How to Form the Imperfect",
      icon: "🛠️",
      explanation: `
        <h3>Regular Endings</h3>
        <p><strong>-AR endings:</strong> aba, abas, aba, ábamos, aban</p>
        <p><strong>-ER/-IR endings:</strong> ía, ías, ía, íamos, ían</p>
      `,
      verbTable: {
        title: "Imperfect Conjugation Samples",
        headers: ["Subject", "hablar", "comer", "vivir"],
        rows: [
          ["yo", "hablaba", "comía", "vivía"],
          ["tú", "hablabas", "comías", "vivías"],
          ["él/ella/usted", "hablaba", "comía", "vivía"],
          ["nosotros/as", "hablábamos", "comíamos", "vivíamos"],
          ["ellos/ellas/ustedes", "hablaban", "comían", "vivían"],
        ],
      },
      exercises: [
        {
          id: "sp-imp-2",
          title: "Conjugate in Imperfect",
          instructions: "Write the correct imperfect form.",
          items: [
            {
              type: "text",
              label: "Yo ______ (estudiar) cada tarde.",
              correctAnswer: "estudiaba",
              expectedAnswers: ["estudiaba"],
            },
            {
              type: "text",
              label: "Nosotros ______ (comer) en casa.",
              correctAnswer: "comíamos",
              expectedAnswers: ["comíamos", "comiamos"],
            },
            {
              type: "text",
              label: "Ellas ______ (vivir) cerca de aquí.",
              correctAnswer: "vivían",
              expectedAnswers: ["vivían", "vivian"],
            },
          ],
        },
      ],
    },
    {
      id: "imperfect-irregulars",
      stepNumber: 2,
      title: "Only Three Irregular Imperfect Verbs",
      icon: "⚡",
      explanation: `
        <h3>Good News: Just 3 Irregulars</h3>
        <ul>
          <li><strong>ser</strong>: era, eras, era, éramos, eran</li>
          <li><strong>ir</strong>: iba, ibas, iba, íbamos, iban</li>
          <li><strong>ver</strong>: veía, veías, veía, veíamos, veían</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-imp-3",
          title: "Irregular Drill",
          instructions: "Select the correct imperfect form.",
          items: [
            {
              type: "select",
              label: "Cuando era joven, yo ___ muy tímido. (ser)",
              options: ["fui", "era", "seré"],
              expectedAnswer: "era",
            },
            {
              type: "select",
              label: "Antes, nosotros ___ al parque cada domingo. (ir)",
              options: ["íbamos", "fuimos", "vamos"],
              expectedAnswer: "íbamos",
            },
            {
              type: "select",
              label: "De niña, ella ___ muchos dibujos animados. (ver)",
              options: ["vio", "veía", "ve"],
              expectedAnswer: "veía",
            },
          ],
        },
      ],
    },
    {
      id: "imperfect-vs-preterite",
      stepNumber: 3,
      title: "Imperfect vs Preterite (A2 Contrast)",
      icon: "↔️",
      explanation: `
        <h3>Core Contrast</h3>
        <p>Use <strong>imperfect</strong> for background/habit and <strong>preterite</strong> for specific completed events.</p>
      `,
      comparison: {
        title: "Meaning Contrast",
        leftLabel: "Imperfect",
        rightLabel: "Preterite",
        rows: [
          {
            label: "Habit vs one event",
            left: "Siempre estudiaba por la noche.",
            right: "Anoche estudié dos horas.",
          },
          {
            label: "Background vs action",
            left: "Llovía cuando salí.",
            right: "Salí a las ocho.",
          },
          {
            label: "Description vs change",
            left: "Era un día tranquilo.",
            right: "De repente empezó el ruido.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-imp-4",
          title: "Choose Imperfect or Preterite",
          instructions: "Pick the best tense for each clue.",
          items: [
            {
              type: "radio",
              label: "Repeated action in the past:",
              options: [
                { value: "imperfect", label: "imperfect" },
                { value: "preterite", label: "preterite" },
              ],
              expectedAnswer: "imperfect",
            },
            {
              type: "radio",
              label: "Single completed action yesterday:",
              options: [
                { value: "imperfect", label: "imperfect" },
                { value: "preterite", label: "preterite" },
              ],
              expectedAnswer: "preterite",
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "imp-q1",
      question: "The imperfect is most often used for...",
      options: [
        { value: "a", label: "past habits and descriptions" },
        { value: "b", label: "future plans" },
        { value: "c", label: "commands" },
      ],
      correctAnswer: "a",
      explanation: "Imperfect gives background and repeated past actions.",
    },
    {
      id: "imp-q2",
      question: "Which is the yo imperfect of comer?",
      options: [
        { value: "a", label: "comía" },
        { value: "b", label: "comí" },
        { value: "c", label: "como" },
      ],
      correctAnswer: "a",
      explanation: "Yo comía is imperfect.",
    },
    {
      id: "imp-q3",
      question: "How many irregular imperfect verbs are there (high-frequency)?",
      options: [
        { value: "a", label: "3" },
        { value: "b", label: "12" },
        { value: "c", label: "0" },
      ],
      correctAnswer: "a",
      explanation: "Only ser, ir, and ver are irregular in imperfect.",
    },
    {
      id: "imp-q4",
      question: "Choose the imperfect form of ir for nosotros:",
      options: [
        { value: "a", label: "íbamos" },
        { value: "b", label: "fuimos" },
        { value: "c", label: "vamos" },
      ],
      correctAnswer: "a",
      explanation: "Nosotros íbamos is imperfect.",
    },
    {
      id: "imp-q5",
      question: "'Llovía cuando llegué' uses imperfect for...",
      options: [
        { value: "a", label: "background condition" },
        { value: "b", label: "single event" },
        { value: "c", label: "future intention" },
      ],
      correctAnswer: "a",
      explanation: "Llovía describes the background scene.",
    },
    {
      id: "imp-q6",
      question: "Which sentence is a typical imperfect habit sentence?",
      options: [
        { value: "a", label: "Ayer estudié dos horas." },
        { value: "b", label: "Cuando era niño, jugaba afuera todos los días." },
        { value: "c", label: "Mañana voy a estudiar." },
      ],
      correctAnswer: "b",
      explanation: "Repeated past habit with era/jugaba uses imperfect.",
    },
    {
      id: "imp-q7",
      question: "Choose the correct imperfect form for 'nosotros hablar'.",
      options: [
        { value: "a", label: "hablábamos" },
        { value: "b", label: "hablamos" },
        { value: "c", label: "hablaremos" },
      ],
      correctAnswer: "a",
      explanation: "Nosotros hablábamos is imperfect.",
    },
    {
      id: "imp-q8",
      question: "Which verb has an irregular imperfect form?",
      options: [
        { value: "a", label: "comer" },
        { value: "b", label: "ver" },
        { value: "c", label: "hablar" },
      ],
      correctAnswer: "b",
      explanation: "Ver is one of the core irregular imperfect verbs.",
    },
    {
      id: "imp-q9",
      question: "Which sentence best sets a background scene?",
      options: [
        { value: "a", label: "A las ocho abrí la puerta." },
        { value: "b", label: "Hacía frío y llovía." },
        { value: "c", label: "Mañana va a llover." },
      ],
      correctAnswer: "b",
      explanation: "Background weather descriptions typically use imperfect.",
    },
    {
      id: "imp-q10",
      question: "Pick the best contrast pair.",
      options: [
        { value: "a", label: "De niño jugaba fútbol, pero ayer no jugué." },
        { value: "b", label: "De niño jugué fútbol, pero ayer jugaba." },
        { value: "c", label: "De niño jugaré fútbol, pero ayer juego." },
      ],
      correctAnswer: "a",
      explanation: "Imperfect for repeated past habit, preterite for completed single event.",
    },
  ],
};
