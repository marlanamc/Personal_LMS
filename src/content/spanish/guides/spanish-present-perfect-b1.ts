import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPresentPerfectB1Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "pp-intro",
      title: "Presente perfecto: visión general (B1)",
      icon: "🕰️",
      explanation: `
        <h3>Conectar pasado y presente</h3>
        <p>Usamos el presente perfecto para hablar de acciones pasadas con relevancia en el presente.</p>
        <p>Estructura básica: <strong>haber (presente) + participio</strong>.</p>
        <p>Ejemplo: <em>He terminado la tarea.</em></p>
      `,
      exercises: [
        {
          id: "sp-pp-1",
          title: "Reconocimiento rápido",
          instructions: "Selecciona la oración en presente perfecto.",
          items: [
            {
              type: "radio",
              label: "¿Cuál está en presente perfecto?",
              options: [
                { value: "a", label: "Ayer terminé la tarea." },
                { value: "b", label: "He terminado la tarea." },
                { value: "c", label: "Terminaré la tarea mañana." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "pp-forma",
      stepNumber: 1,
      title: "Forma: haber + participio",
      icon: "🧱",
      explanation: `
        <h3>Conjugación de haber</h3>
        <ul>
          <li>yo <strong>he</strong></li>
          <li>tú <strong>has</strong></li>
          <li>él/ella/usted <strong>ha</strong></li>
          <li>nosotros/as <strong>hemos</strong></li>
          <li>ellos/ellas/ustedes <strong>han</strong></li>
        </ul>
        <p>Participios regulares: <strong>-ado</strong>, <strong>-ido</strong>.</p>
      `,
      verbTable: {
        title: "Participios frecuentes",
        headers: ["Infinitivo", "Participio", "Ejemplo"],
        rows: [
          ["hablar", "hablado", "He hablado con Ana."],
          ["comer", "comido", "Hemos comido temprano."],
          ["vivir", "vivido", "Han vivido aquí diez años."],
          ["hacer", "hecho", "He hecho la reserva."],
          ["ver", "visto", "¿Has visto este video?"],
        ],
      },
      exercises: [
        {
          id: "sp-pp-2",
          title: "Completa con haber",
          instructions: "Elige la forma correcta de haber.",
          items: [
            {
              type: "select",
              label: "Nosotros ___ estudiado mucho.",
              options: ["han", "hemos", "ha"],
              expectedAnswer: "hemos",
            },
            {
              type: "select",
              label: "Ella ___ comido en casa.",
              options: ["ha", "has", "he"],
              expectedAnswer: "ha",
            },
            {
              type: "text",
              label: "Yo ___ terminado el informe.",
              correctAnswer: "he",
              expectedAnswers: ["he"],
            },
          ],
        },
      ],
    },
    {
      id: "pp-usos",
      stepNumber: 2,
      title: "Usos principales",
      icon: "🎯",
      explanation: `
        <h3>¿Cuándo lo usamos?</h3>
        <ul>
          <li>Experiencia de vida: <em>He viajado a Perú.</em></li>
          <li>Acción reciente: <em>Acabo de llegar y he comido algo rápido.</em></li>
          <li>Periodo no terminado: <em>Esta semana hemos trabajado mucho.</em></li>
        </ul>
      `,
      timeExpressions: [
        {
          word: "hoy",
          usage: "periodo aún abierto",
          examples: ["Hoy he tenido tres reuniones."],
        },
        {
          word: "esta semana",
          usage: "periodo no terminado",
          examples: ["Esta semana hemos avanzado bastante."],
        },
        {
          word: "ya / todavía no",
          usage: "estado de una acción",
          examples: ["Ya he enviado el correo.", "Todavía no he llamado."],
        },
      ],
      exercises: [
        {
          id: "sp-pp-3",
          title: "Selecciona el uso",
          instructions: "Relaciona cada oración con su uso.",
          items: [
            {
              type: "radio",
              label: "Nunca he probado ese plato.",
              options: [
                { value: "a", label: "experiencia" },
                { value: "b", label: "acción futura" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Este mes hemos tenido muchas clases.",
              options: [
                { value: "a", label: "periodo no terminado" },
                { value: "b", label: "evento cerrado con fecha exacta" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "pp-contraste",
      stepNumber: 3,
      title: "Contraste con pretérito",
      icon: "↔️",
      explanation: `
        <h3>Presente perfecto vs pretérito</h3>
        <p>En muchos contextos, el presente perfecto se usa con periodos conectados al presente; el pretérito suele marcar acciones cerradas en un tiempo específico.</p>
      `,
      comparison: {
        title: "Presente perfecto vs pretérito",
        leftLabel: "Presente perfecto",
        rightLabel: "Pretérito",
        rows: [
          { label: "Periodo abierto", left: "Hoy he hablado con Marta.", right: "Ayer hablé con Marta." },
          { label: "Experiencia vs evento", left: "He viajado a Perú.", right: "Viajé a Perú en 2019." },
          { label: "Esta semana vs fecha exacta", left: "Esta semana hemos trabajado mucho.", right: "El lunes trabajamos diez horas." },
        ],
      },
      exercises: [
        {
          id: "sp-pp-4",
          title: "Elige el tiempo adecuado",
          instructions: "Escoge presente perfecto o pretérito según el marcador temporal.",
          items: [
            {
              type: "select",
              label: "Ayer ___ (terminar) el proyecto.",
              options: ["he terminado", "terminé"],
              expectedAnswer: "terminé",
            },
            {
              type: "select",
              label: "Esta mañana ___ (enviar) tres mensajes.",
              options: ["he enviado", "envié"],
              expectedAnswer: "he enviado",
            },
            {
              type: "text",
              label: "Completa: Todavía no ___ (hacer) la tarea.",
              correctAnswer: "he hecho",
              expectedAnswers: ["he hecho"],
            },
          ],
        },
      ],
    },
    {
      id: "quick-reference-pp",
      stepNumber: 4,
      title: "Quick Reference: Present Perfect",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Form:</strong> haber (present) + past participle (he hablado, has comido). <strong>Use:</strong> recent past, life experience, unfinished time (hoy, esta semana). Participle agrees with object when using lo/la/los/las.</p>
      `,
      exercises: [
        {
          id: "sp-pp-quickref",
          title: "Recall",
          instructions: "Choose the correct form.",
          items: [
            { type: "radio", label: "Present perfect uses ___ + past participle.", options: [{ value: "haber", label: "haber (conjugated)" }, { value: "tener", label: "tener" }], expectedAnswer: "haber" },
            { type: "radio", label: "Yo form: He ___.", options: [{ value: "hablado", label: "hablado" }, { value: "hablando", label: "hablando" }], expectedAnswer: "hablado" },
          ],
        },
      ],
    },
    {
      id: "common-mistakes-pp",
      stepNumber: 5,
      title: "Common Mistakes",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <p>Using tener instead of haber (correct: he comido). Using -ando/-iendo instead of -ado/-ido (past participle). Using present perfect for specific finished past (use preterite: ayer llegué).</p>
      `,
      exercises: [
        {
          id: "sp-pp-mistakes",
          title: "Correct?",
          instructions: "Which is correct?",
          items: [
            { type: "radio", label: "I have eaten:", options: [{ value: "a", label: "He comido." }, { value: "b", label: "Tengo comido." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "pp-q1",
      question: "¿Cuál es la estructura correcta del presente perfecto?",
      options: [
        { value: "a", label: "ser + gerundio" },
        { value: "b", label: "haber + participio" },
        { value: "c", label: "ir + a + infinitivo" },
      ],
      correctAnswer: "b",
      explanation: "La forma base es haber en presente + participio.",
    },
    {
      id: "pp-q2",
      question: "Selecciona la forma correcta con nosotros:",
      options: [
        { value: "a", label: "Nosotros han llegado." },
        { value: "b", label: "Nosotros hemos llegado." },
        { value: "c", label: "Nosotros ha llegado." },
      ],
      correctAnswer: "b",
      explanation: "Con nosotros usamos hemos.",
    },
    {
      id: "pp-q3",
      question: "¿Cuál es el participio de hacer?",
      options: [
        { value: "a", label: "hacido" },
        { value: "b", label: "hecho" },
        { value: "c", label: "hizo" },
      ],
      correctAnswer: "b",
      explanation: "Hecho es participio irregular.",
    },
    {
      id: "pp-q4",
      question: "Completa: 'Ella ___ visto la película.'",
      options: [
        { value: "a", label: "ha" },
        { value: "b", label: "han" },
        { value: "c", label: "he" },
      ],
      correctAnswer: "a",
      explanation: "Con ella usamos ha.",
    },
    {
      id: "pp-q5",
      question: "¿Qué marcador suele acompañar el presente perfecto?",
      options: [
        { value: "a", label: "ayer" },
        { value: "b", label: "hoy" },
        { value: "c", label: "el año pasado" },
      ],
      correctAnswer: "b",
      explanation: "Hoy suele indicar conexión con el presente.",
    },
    {
      id: "pp-q6",
      question: "Elige la opción más natural:",
      options: [
        { value: "a", label: "Esta semana terminé tres proyectos." },
        { value: "b", label: "Esta semana he terminado tres proyectos." },
        { value: "c", label: "Esta semana termino tres proyectos." },
      ],
      correctAnswer: "b",
      explanation: "Con periodo no terminado, presente perfecto es muy frecuente.",
    },
    {
      id: "pp-q7",
      question: "Completa: 'Todavía no ___ hablado con ellos.'",
      options: [
        { value: "a", label: "he" },
        { value: "b", label: "ha" },
        { value: "c", label: "han" },
      ],
      correctAnswer: "a",
      explanation: "Con yo se usa he.",
    },
    {
      id: "pp-q8",
      question: "¿Cuál expresa experiencia de vida?",
      options: [
        { value: "a", label: "He vivido en tres países." },
        { value: "b", label: "Mañana viviré en Madrid." },
        { value: "c", label: "Vivo en Madrid ahora." },
      ],
      correctAnswer: "a",
      explanation: "He vivido... presenta experiencia acumulada.",
    },
    {
      id: "pp-q9",
      question: "Elige la oración correcta con ya:",
      options: [
        { value: "a", label: "Ya he enviado el archivo." },
        { value: "b", label: "Ya envié he el archivo." },
        { value: "c", label: "Ya he enviando el archivo." },
      ],
      correctAnswer: "a",
      explanation: "Se usa haber + participio: he enviado.",
    },
    {
      id: "pp-q10",
      question: "¿Qué opción contrasta mejor con 'Ayer llamé a Julia'?",
      options: [
        { value: "a", label: "Hoy he llamado a Julia." },
        { value: "b", label: "Hoy llamo a Julia mañana." },
        { value: "c", label: "Hoy llamaré a Julia ayer." },
      ],
      correctAnswer: "a",
      explanation: "Ayer (cerrado) contrasta bien con hoy (conectado al presente).",
    },
  ],
};
