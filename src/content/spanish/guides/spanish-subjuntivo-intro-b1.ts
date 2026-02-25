import type { InteractiveGuideContent } from "@/types/activity";

export const spanishSubjuntivoIntroB1Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "subj-intro",
      title: "Subjuntivo presente: introducción (B1)",
      icon: "🌱",
      explanation: `
        <h3>¿Para qué sirve?</h3>
        <p>El subjuntivo expresa deseo, recomendación, duda, emoción y valoración.</p>
        <p>Normalmente aparece en oraciones con dos partes: una principal y una subordinada con <strong>que</strong>.</p>
        <p>Ejemplo: <em>Quiero que estudies más.</em></p>
      `,
      exercises: [
        {
          id: "sp-subj-1",
          title: "Reconocimiento",
          instructions: "Identifica la oración con subjuntivo.",
          items: [
            {
              type: "radio",
              label: "¿Cuál contiene subjuntivo?",
              options: [
                { value: "a", label: "Sé que ella trabaja aquí." },
                { value: "b", label: "Dudo que ella trabaje aquí." },
                { value: "c", label: "Ella trabaja aquí todos los días." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "subj-forma",
      stepNumber: 1,
      title: "Forma básica del presente de subjuntivo",
      icon: "🧱",
      explanation: `
        <h3>Regla base</h3>
        <p>Partimos de la forma <strong>yo</strong> del presente de indicativo y cambiamos terminaciones:</p>
        <ul>
          <li>Verbos -ar: <strong>e, es, e, emos, en</strong></li>
          <li>Verbos -er/-ir: <strong>a, as, a, amos, an</strong></li>
        </ul>
      `,
      verbTable: {
        title: "Ejemplos de formación",
        headers: ["Infinitivo", "Yo indicativo", "Tú subjuntivo", "Nosotros subjuntivo"],
        rows: [
          ["hablar", "hablo", "hables", "hablemos"],
          ["comer", "como", "comas", "comamos"],
          ["vivir", "vivo", "vivas", "vivamos"],
          ["tener", "tengo", "tengas", "tengamos"],
        ],
      },
      exercises: [
        {
          id: "sp-subj-2",
          title: "Completa con subjuntivo",
          instructions: "Escribe la forma correcta del verbo.",
          items: [
            {
              type: "text",
              label: "Espero que tú ___ (llegar) temprano.",
              correctAnswer: "llegues",
              expectedAnswers: ["llegues"],
            },
            {
              type: "text",
              label: "Es importante que nosotros ___ (estudiar) hoy.",
              correctAnswer: "estudiemos",
              expectedAnswers: ["estudiemos"],
            },
            {
              type: "select",
              label: "Quieren que yo ___ más agua.",
              options: ["bebo", "beba", "beber"],
              expectedAnswer: "beba",
            },
          ],
        },
      ],
    },
    {
      id: "subj-desencadenantes",
      stepNumber: 2,
      title: "Desencadenantes frecuentes",
      icon: "🔑",
      explanation: `
        <h3>Expresiones que suelen activar subjuntivo</h3>
        <ul>
          <li><strong>Deseo y voluntad:</strong> querer que, esperar que, preferir que</li>
          <li><strong>Recomendación:</strong> aconsejar que, sugerir que, pedir que</li>
          <li><strong>Duda/negación:</strong> dudar que, no creer que</li>
          <li><strong>Valoración:</strong> es importante que, es mejor que</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-subj-3",
          title: "Indicativo o subjuntivo",
          instructions: "Elige la opción más natural según el contexto.",
          items: [
            {
              type: "radio",
              label: "No creo que él ___ hoy.",
              options: [
                { value: "a", label: "viene" },
                { value: "b", label: "venga" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Sé que él ___ hoy.",
              options: [
                { value: "a", label: "viene" },
                { value: "b", label: "venga" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Es mejor que ustedes ___ (descansar).",
              correctAnswer: "descansen",
              expectedAnswers: ["descansen"],
            },
          ],
        },
      ],
    },
    {
      id: "subj-produccion",
      stepNumber: 3,
      title: "Producción B1",
      icon: "🗣️",
      explanation: `
        <h3>Expresar postura y recomendación</h3>
        <p>Construye respuestas completas con esta estructura:</p>
        <p><em>Creo/No creo que..., Es importante que..., Te recomiendo que...</em></p>
      `,
      exercises: [
        {
          id: "sp-subj-4",
          title: "Escribe con intención",
          instructions: "Escribe oraciones completas usando subjuntivo.",
          items: [
            {
              type: "text",
              label: "Da una recomendación a un compañero para estudiar mejor.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Expresa una duda sobre un plan para mañana.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Escribe una valoración con 'Es importante que...'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "subj-q1",
      question: "¿Qué estructura suele introducir subjuntivo?",
      options: [
        { value: "a", label: "Quiero que + verbo" },
        { value: "b", label: "Ayer + verbo" },
        { value: "c", label: "Mañana + infinitivo" },
      ],
      correctAnswer: "a",
      explanation: "Quiero que normalmente activa subjuntivo en la subordinada.",
    },
    {
      id: "subj-q2",
      question: "Elige la forma correcta: 'Espero que tú ___'.",
      options: [
        { value: "a", label: "vienes" },
        { value: "b", label: "vengas" },
        { value: "c", label: "venir" },
      ],
      correctAnswer: "b",
      explanation: "Con 'espero que' usamos subjuntivo.",
    },
    {
      id: "subj-q3",
      question: "Completa: 'Es necesario que nosotros ___'.",
      options: [
        { value: "a", label: "estudiamos" },
        { value: "b", label: "estudiemos" },
        { value: "c", label: "estudiar" },
      ],
      correctAnswer: "b",
      explanation: "La valoración impersonal activa subjuntivo.",
    },
    {
      id: "subj-q4",
      question: "¿Cuál expresa duda?",
      options: [
        { value: "a", label: "Sé que llega." },
        { value: "b", label: "Dudo que llegue." },
        { value: "c", label: "Llega a las ocho." },
      ],
      correctAnswer: "b",
      explanation: "Dudar que introduce incertidumbre y subjuntivo.",
    },
    {
      id: "subj-q5",
      question: "Elige la oración correcta.",
      options: [
        { value: "a", label: "No creo que él tiene tiempo." },
        { value: "b", label: "No creo que él tenga tiempo." },
        { value: "c", label: "No creo que él tener tiempo." },
      ],
      correctAnswer: "b",
      explanation: "Después de no creer que, usamos subjuntivo.",
    },
    {
      id: "subj-q6",
      question: "Completa: 'Te recomiendo que ___ más temprano.'",
      options: [
        { value: "a", label: "duermes" },
        { value: "b", label: "duermas" },
        { value: "c", label: "dormir" },
      ],
      correctAnswer: "b",
      explanation: "Recomendación + que + subjuntivo.",
    },
    {
      id: "subj-q7",
      question: "¿Cuál NO activa subjuntivo normalmente?",
      options: [
        { value: "a", label: "Sé que" },
        { value: "b", label: "Es mejor que" },
        { value: "c", label: "Quiero que" },
      ],
      correctAnswer: "a",
      explanation: "Con certeza afirmativa suele usarse indicativo.",
    },
    {
      id: "subj-q8",
      question: "Forma correcta de 'tener' (nosotros, subjuntivo):",
      options: [
        { value: "a", label: "tenemos" },
        { value: "b", label: "tengamos" },
        { value: "c", label: "tuvimos" },
      ],
      correctAnswer: "b",
      explanation: "Subjuntivo presente de nosotros: tengamos.",
    },
    {
      id: "subj-q9",
      question: "Completa: 'Es posible que ellos ___ tarde.'",
      options: [
        { value: "a", label: "llegan" },
        { value: "b", label: "lleguen" },
        { value: "c", label: "llegar" },
      ],
      correctAnswer: "b",
      explanation: "Posibilidad con 'es posible que' requiere subjuntivo.",
    },
    {
      id: "subj-q10",
      question: "Elige la mejor opción para expresar voluntad.",
      options: [
        { value: "a", label: "Quiero que me ayudas." },
        { value: "b", label: "Quiero que me ayudes." },
        { value: "c", label: "Quiero que me ayudar." },
      ],
      correctAnswer: "b",
      explanation: "Después de 'quiero que', la forma correcta es subjuntivo.",
    },
  ],
};
