import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPresentProgressiveContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "progressive-overview",
      title: "Present Progressive: Actions Right Now",
      icon: "⏳",
      explanation: `
        <h3>Actions in Progress</h3>
        <p>The present progressive describes what is happening <strong>right now</strong>: <em>Estoy estudiando.</em> (I am studying.) It is formed with <strong>estar + gerundio</strong> (-ando / -iendo).</p>
        <p>Use it for actions in progress at the moment of speaking. For habits or general truths, use the simple present instead.</p>
      `,
      formula: [
        { text: "subject", type: "subject" },
        { text: "+", type: "other" },
        { text: "estar", type: "verb" },
        { text: "+", type: "other" },
        { text: "gerundio (-ando/-iendo)", type: "object" },
      ],
      tipBox: {
        title: "Quick rule",
        content: "estar (conjugated) + verb stem + -ando (-AR) or -iendo (-ER/-IR). Example: hablar → hablando, comer → comiendo, vivir → viviendo.",
      },
      verbTable: {
        title: "estar (present) + gerundio",
        headers: ["Subject", "estar", "Example"],
        rows: [
          ["yo", "estoy", "Estoy estudiando."],
          ["tú", "estás", "Estás comiendo."],
          ["él/ella/usted", "está", "Está hablando."],
          ["nosotros/as", "estamos", "Estamos trabajando."],
          ["ellos/ellas/ustedes", "están", "Están viviendo aquí."],
        ],
      },
      exercises: [
        {
          id: "sp-prog-1",
          title: "Recognize the Progressive",
          instructions: "Choose the sentence in present progressive.",
          items: [
            {
              type: "radio",
              label: "Which is present progressive?",
              options: [
                { value: "prog", label: "Estoy leyendo." },
                { value: "simple", label: "Leo todos los días." },
              ],
              expectedAnswer: "prog",
            },
            {
              type: "radio",
              label: "Which describes an action right now?",
              options: [
                { value: "prog", label: "Ella está cocinando." },
                { value: "simple", label: "Ella cocina muy bien." },
              ],
              expectedAnswer: "prog",
            },
          ],
        },
      ],
    },
    {
      id: "progressive-formation",
      stepNumber: 1,
      title: "Forming the Gerund",
      icon: "🛠️",
      explanation: `
        <h3>Regular Gerunds</h3>
        <p><strong>-AR verbs:</strong> drop -ar, add -ando (hablar → hablando)</p>
        <p><strong>-ER/-IR verbs:</strong> drop -er/-ir, add -iendo (comer → comiendo, vivir → viviendo)</p>
      `,
      verbTable: {
        title: "Regular gerunds",
        headers: ["Infinitive", "Gerund", "Example"],
        rows: [
          ["hablar", "hablando", "Estoy hablando."],
          ["comer", "comiendo", "Estás comiendo."],
          ["vivir", "viviendo", "Ella está viviendo aquí."],
          ["trabajar", "trabajando", "Estamos trabajando."],
          ["escribir", "escribiendo", "Ellos están escribiendo."],
        ],
      },
      exercises: [
        {
          id: "sp-prog-2",
          title: "Form the Gerund",
          instructions: "Choose the correct gerund form.",
          items: [
            { type: "select", label: "estudiar →", options: ["estudiendo", "estudiando", "estudir"], expectedAnswer: "estudiando" },
            { type: "select", label: "beber →", options: ["bebiendo", "bebando", "bebiendo"], expectedAnswer: "bebiendo" },
            { type: "select", label: "correr →", options: ["corriendo", "corriando", "corrindo"], expectedAnswer: "corriendo" },
          ],
        },
      ],
    },
    {
      id: "progressive-irregulars",
      stepNumber: 2,
      title: "Irregular Gerunds",
      icon: "⚡",
      explanation: `
        <h3>Common Irregulars</h3>
        <p>Some verbs change the stem vowel in the gerund:</p>
        <ul>
          <li><strong>e → i:</strong> pedir → pidiendo, decir → diciendo, venir → viniendo</li>
          <li><strong>o → u:</strong> dormir → durmiendo, morir → muriendo</li>
          <li><strong>i → y (before vowel):</strong> leer → leyendo, creer → creyendo, ir → yendo</li>
        </ul>
      `,
      verbTable: {
        title: "Irregular gerunds",
        headers: ["Infinitive", "Gerund"],
        rows: [
          ["pedir", "pidiendo"],
          ["dormir", "durmiendo"],
          ["leer", "leyendo"],
          ["ir", "yendo"],
          ["venir", "viniendo"],
        ],
      },
      exercises: [
        {
          id: "sp-prog-3",
          title: "Irregular Gerunds",
          instructions: "Choose the correct form.",
          items: [
            { type: "select", label: "Yo ___ (dormir) bien.", options: ["estoy dormiendo", "estoy durmiendo", "estoy dormir"], expectedAnswer: "estoy durmiendo" },
            { type: "select", label: "Ella ___ (leer).", options: ["está leyendo", "está leiendo", "está leer"], expectedAnswer: "está leyendo" },
            { type: "select", label: "Nosotros ___ (pedir) comida.", options: ["estamos pidiendo", "estamos pediendo", "estamos pedir"], expectedAnswer: "estamos pidiendo" },
          ],
        },
      ],
    },
    {
      id: "progressive-vs-simple",
      stepNumber: 3,
      title: "Progressive vs Simple Present",
      icon: "↔️",
      explanation: `
        <h3>When to Use Each</h3>
        <p>Use <strong>present progressive</strong> for actions happening right now. Use <strong>simple present</strong> for habits, facts, and general truths.</p>
      `,
      comparison: {
        title: "Progressive vs Simple Present",
        leftLabel: "Present Progressive (right now)",
        rightLabel: "Simple Present (habit/fact)",
        rows: [
          { label: "Action in progress", left: "Estoy estudiando.", right: "Estudio cada noche." },
          { label: "Right now vs always", left: "Está lloviendo.", right: "Llueve mucho en abril." },
          { label: "Temporary vs permanent", left: "Está trabajando aquí.", right: "Trabaja en un banco." },
        ],
      },
      exercises: [
        {
          id: "sp-prog-4",
          title: "Choose the Right Tense",
          instructions: "Pick progressive for right now; simple for habit/fact.",
          items: [
            { type: "radio", label: "'Right now I am eating.' →", options: [{ value: "prog", label: "Ahora estoy comiendo." }, { value: "simple", label: "Ahora como." }], expectedAnswer: "prog" },
            { type: "radio", label: "'I eat breakfast every day.' →", options: [{ value: "prog", label: "Estoy desayunando cada día." }, { value: "simple", label: "Desayuno cada día." }], expectedAnswer: "simple" },
          ],
        },
      ],
    },
    {
      id: "quick-reference-prog",
      stepNumber: 4,
      title: "Quick Reference",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Form:</strong> estar (present) + gerund (-ando/-iendo). <strong>Use:</strong> actions happening right now. <strong>Irregulars:</strong> pidiendo, durmiendo, leyendo, yendo.</p>
        <p>For habits, use simple present.</p>
      `,
      exercises: [
        {
          id: "sp-prog-quickref",
          title: "Recall",
          instructions: "Choose the correct answer.",
          items: [
            { type: "radio", label: "Present progressive uses ___ + gerund.", options: [{ value: "estar", label: "estar" }, { value: "ser", label: "ser" }], expectedAnswer: "estar" },
            { type: "radio", label: "hablar → gerund:", options: [{ value: "hablando", label: "hablando" }, { value: "habliendo", label: "habliendo" }], expectedAnswer: "hablando" },
          ],
        },
      ],
    },
    {
      id: "common-mistakes-prog",
      stepNumber: 5,
      title: "Common Mistakes",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <ul>
          <li><strong>Using ser instead of estar</strong> — Ser + gerund is wrong. Use estar.</li>
          <li><strong>Confusing gerund with infinitive</strong> — Estoy comiendo, not estoy comer.</li>
          <li><strong>Overusing progressive for habits</strong> — Use simple present for routines: Desayuno a las siete.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-prog-mistakes",
          title: "Spot the Error",
          instructions: "Which is correct?",
          items: [
            { type: "radio", label: "I am studying right now.", options: [{ value: "a", label: "Estoy estudiando." }, { value: "b", label: "Soy estudiando." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    { id: "prog-q1", question: "Present progressive uses ___ + gerund.", options: [{ value: "a", label: "estar" }, { value: "b", label: "ser" }, { value: "c", label: "ir" }], correctAnswer: "a", explanation: "estar + gerund for actions right now." },
    { id: "prog-q2", question: "hablar → gerund", options: [{ value: "a", label: "hablando" }, { value: "b", label: "habliendo" }, { value: "c", label: "hablando" }], correctAnswer: "a", explanation: "-AR verbs: -ando." },
    { id: "prog-q3", question: "comer → gerund", options: [{ value: "a", label: "comiendo" }, { value: "b", label: "comando" }, { value: "c", label: "comir" }], correctAnswer: "a", explanation: "-ER verbs: -iendo." },
    { id: "prog-q4", question: "dormir → gerund", options: [{ value: "a", label: "durmiendo" }, { value: "b", label: "dormiendo" }, { value: "c", label: "dormiendo" }], correctAnswer: "a", explanation: "o→u: durmiendo." },
    { id: "prog-q5", question: "leer → gerund", options: [{ value: "a", label: "leyendo" }, { value: "b", label: "leiendo" }, { value: "c", label: "leer" }], correctAnswer: "a", explanation: "i→y: leyendo." },
    { id: "prog-q6", question: "Which sentence is correct for 'right now'?", options: [{ value: "a", label: "Estoy leyendo." }, { value: "b", label: "Leo ahora." }], correctAnswer: "a", explanation: "Progressive for right now." },
    { id: "prog-q7", question: "Which sentence is correct for a habit?", options: [{ value: "a", label: "Estoy estudiando cada noche." }, { value: "b", label: "Estudio cada noche." }], correctAnswer: "b", explanation: "Simple present for habits." },
    { id: "prog-q8", question: "Yo form of estar + comiendo", options: [{ value: "a", label: "Estoy comiendo." }, { value: "b", label: "Estás comiendo." }], correctAnswer: "a", explanation: "yo estoy." },
    { id: "prog-q9", question: "No ___ (estar + trabajar) hoy.", options: [{ value: "a", label: "estoy trabajando" }, { value: "b", label: "estoy trabajar" }], correctAnswer: "a", explanation: "estar + gerund." },
    { id: "prog-q10", question: "pedir → gerund", options: [{ value: "a", label: "pidiendo" }, { value: "b", label: "pediendo" }], correctAnswer: "a", explanation: "e→i: pidiendo." },
  ],
};
