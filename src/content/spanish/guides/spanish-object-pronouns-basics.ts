import type { InteractiveGuideContent } from "@/types/activity";

export const spanishObjectPronounsBasicsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "dop-iop-intro",
      title: "Direct and Indirect Object Pronouns (A2)",
      icon: "🎯",
      explanation: `
        <h3>Say It More Naturally</h3>
        <p>Object pronouns help you avoid repetition and sound fluent.</p>
        <ul>
          <li><strong>Direct object</strong>: lo, la, los, las</li>
          <li><strong>Indirect object</strong>: me, te, le, nos, les</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-pro-1",
          title: "Identify Direct vs Indirect",
          instructions: "Choose the role of each pronoun.",
          items: [
            {
              type: "radio",
              label: "Le doy un libro.",
              options: [
                { value: "a", label: "direct object pronoun" },
                { value: "b", label: "indirect object pronoun" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Lo compré ayer.",
              options: [
                { value: "a", label: "direct object pronoun" },
                { value: "b", label: "indirect object pronoun" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "direct-pronouns",
      stepNumber: 1,
      title: "Direct Object Pronouns: lo/la/los/las",
      icon: "📦",
      explanation: `
        <h3>Replace the Thing</h3>
        <p>Direct object answers: what or whom is directly affected.</p>
        <p>Example: <em>Compro el pan</em> → <em>Lo compro</em>.</p>
      `,
      verbTable: {
        title: "Direct Object Mapping",
        headers: ["Noun", "Pronoun", "Example"],
        rows: [
          ["el libro", "lo", "Lo leo."],
          ["la carta", "la", "La escribo."],
          ["los boletos", "los", "Los compro hoy."],
          ["las llaves", "las", "Las busco."],
        ],
      },
      exercises: [
        {
          id: "sp-pro-2",
          title: "Replace with Direct Pronouns",
          instructions: "Rewrite each using lo/la/los/las.",
          items: [
            {
              type: "text",
              label: "Compro la camisa. → ___ compro.",
              correctAnswer: "La",
              expectedAnswers: ["La", "la"],
            },
            {
              type: "text",
              label: "Veo los perros. → ___ veo.",
              correctAnswer: "Los",
              expectedAnswers: ["Los", "los"],
            },
            {
              type: "select",
              label: "Escribo el correo. → ___ escribo.",
              options: ["Lo", "Le", "La"],
              expectedAnswer: "Lo",
            },
          ],
        },
      ],
    },
    {
      id: "indirect-pronouns",
      stepNumber: 2,
      title: "Indirect Object Pronouns: me/te/le/nos/les",
      icon: "📨",
      explanation: `
        <h3>Replace the Receiver</h3>
        <p>Indirect object answers: to whom or for whom something happens.</p>
        <p>Example: <em>Doy el libro a Ana</em> → <em>Le doy el libro</em>.</p>
      `,
      exercises: [
        {
          id: "sp-pro-3",
          title: "Choose the Correct Indirect Pronoun",
          instructions: "Pick the pronoun that matches the receiver.",
          items: [
            {
              type: "select",
              label: "(a mí) ___ explican la tarea.",
              options: ["me", "te", "le"],
              expectedAnswer: "me",
            },
            {
              type: "select",
              label: "(a nosotros) ___ dan instrucciones.",
              options: ["nos", "les", "lo"],
              expectedAnswer: "nos",
            },
            {
              type: "text",
              label: "(a ella) ___ enviamos un mensaje.",
              correctAnswer: "le",
              expectedAnswers: ["le"],
            },
          ],
        },
      ],
    },
    {
      id: "pronoun-order",
      stepNumber: 3,
      title: "A2 Production: Pronoun Position and Clarity",
      icon: "🧱",
      explanation: `
        <h3>Where Pronouns Go</h3>
        <ul>
          <li>Before conjugated verbs: <em>Lo necesito.</em></li>
          <li>Attached to infinitives: <em>Voy a comprarlo.</em></li>
        </ul>
        <p>At A2, focus on accurate form and clear meaning first.</p>
      `,
      exercises: [
        {
          id: "sp-pro-4",
          title: "Write with Pronouns",
          instructions: "Rewrite with pronouns and keep the meaning.",
          items: [
            {
              type: "text",
              label: "Necesito el documento hoy.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Voy a enviar el correo a mi profesora.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Compramos las entradas para ellos.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "pro-q1",
      question: "Which is a direct object pronoun?",
      options: [
        { value: "a", label: "le" },
        { value: "b", label: "lo" },
        { value: "c", label: "nos" },
      ],
      correctAnswer: "b",
      explanation: "Lo is direct object pronoun.",
    },
    {
      id: "pro-q2",
      question: "Which is an indirect object pronoun?",
      options: [
        { value: "a", label: "la" },
        { value: "b", label: "los" },
        { value: "c", label: "te" },
      ],
      correctAnswer: "c",
      explanation: "Te is indirect object pronoun.",
    },
    {
      id: "pro-q3",
      question: "Replace: 'Veo la película.'",
      options: [
        { value: "a", label: "Le veo." },
        { value: "b", label: "La veo." },
        { value: "c", label: "Me veo." },
      ],
      correctAnswer: "b",
      explanation: "Película is direct object feminine singular: la.",
    },
    {
      id: "pro-q4",
      question: "Choose the best replacement: 'Doy un regalo a Juan.'",
      options: [
        { value: "a", label: "Lo doy un regalo." },
        { value: "b", label: "Le doy un regalo." },
        { value: "c", label: "La doy un regalo." },
      ],
      correctAnswer: "b",
      explanation: "Juan is receiver, so indirect pronoun le.",
    },
    {
      id: "pro-q5",
      question: "Pick the correct sentence for 'We write them (the letters).'",
      options: [
        { value: "a", label: "Nos escribimos." },
        { value: "b", label: "Los escribimos." },
        { value: "c", label: "Las escribimos." },
      ],
      correctAnswer: "c",
      explanation: "Cartas (letters) is feminine plural, so las.",
    },
    {
      id: "pro-q6",
      question: "Complete: '(a mí) ___ explican la lección.'",
      options: [
        { value: "a", label: "me" },
        { value: "b", label: "lo" },
        { value: "c", label: "la" },
      ],
      correctAnswer: "a",
      explanation: "A mí corresponds to me.",
    },
    {
      id: "pro-q7",
      question: "Where do object pronouns usually go with a conjugated verb?",
      options: [
        { value: "a", label: "Before the verb" },
        { value: "b", label: "After the verb" },
        { value: "c", label: "At the end of sentence" },
      ],
      correctAnswer: "a",
      explanation: "Standard A2 placement is before conjugated verbs.",
    },
    {
      id: "pro-q8",
      question: "Choose the correct infinitive attachment:",
      options: [
        { value: "a", label: "Voy a lo comprar." },
        { value: "b", label: "Voy a comprarlo." },
        { value: "c", label: "Voy lo a comprar." },
      ],
      correctAnswer: "b",
      explanation: "Pronouns can attach to infinitives: comprarlo.",
    },
    {
      id: "pro-q9",
      question: "Identify the pronoun type in 'Les enviamos un correo.'",
      options: [
        { value: "a", label: "direct object" },
        { value: "b", label: "indirect object" },
        { value: "c", label: "reflexive" },
      ],
      correctAnswer: "b",
      explanation: "Les marks the receiver (to them), so indirect object.",
    },
    {
      id: "pro-q10",
      question: "Best replacement: 'Busco las llaves.'",
      options: [
        { value: "a", label: "Las busco." },
        { value: "b", label: "Les busco." },
        { value: "c", label: "Lo busco." },
      ],
      correctAnswer: "a",
      explanation: "Las llaves is direct feminine plural: las.",
    },
  ],
};
