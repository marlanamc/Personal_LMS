import type { InteractiveGuideContent } from "@/types/activity";

export const spanishCommandsPoliteRequestsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "commands-intro",
      title: "Commands and Polite Requests",
      icon: "🧭",
      explanation: `
        <h3>Give Instructions Clearly</h3>
        <p>In Spanish, commands change depending on who you are addressing.</p>
        <ul>
          <li><strong>Tú affirmative:</strong> Habla, come, escribe</li>
          <li><strong>Tú negative:</strong> No hables, no comas, no escribas</li>
          <li><strong>Usted:</strong> Hable, coma, escriba</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-cmd-1",
          title: "Identify the Command Type",
          instructions: "Choose the best category.",
          items: [
            {
              type: "radio",
              label: "No hables tan rápido.",
              options: [
                { value: "a", label: "tú affirmative" },
                { value: "b", label: "tú negative" },
                { value: "c", label: "usted" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Pase por aquí, por favor.",
              options: [
                { value: "a", label: "tú negative" },
                { value: "b", label: "tú affirmative" },
                { value: "c", label: "usted" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
      ],
    },
    {
      id: "tu-commands",
      stepNumber: 1,
      title: "Tú Commands: Affirmative and Negative",
      icon: "👥",
      explanation: `
        <h3>Core Pattern</h3>
        <p>Affirmative tú often uses the 3rd person singular present form.</p>
        <p>Negative tú uses <strong>no + present subjunctive</strong>.</p>
      `,
      verbTable: {
        title: "Tú Command Examples",
        headers: ["Infinitive", "Affirmative tú", "Negative tú"],
        rows: [
          ["hablar", "habla", "no hables"],
          ["comer", "come", "no comas"],
          ["escribir", "escribe", "no escribas"],
          ["hacer", "haz", "no hagas"],
          ["decir", "di", "no digas"],
        ],
      },
      exercises: [
        {
          id: "sp-cmd-2",
          title: "Build Tú Commands",
          instructions: "Complete each command form.",
          items: [
            {
              type: "text",
              label: "(hablar) ___ más despacio. (affirmative)",
              correctAnswer: "habla",
              expectedAnswers: ["habla"],
            },
            {
              type: "text",
              label: "No ___ tarde. (llegar, tú negative)",
              correctAnswer: "llegues",
              expectedAnswers: ["llegues"],
            },
            {
              type: "select",
              label: "(hacer) ___ la tarea ahora. (affirmative)",
              options: ["haz", "haces", "haga"],
              expectedAnswer: "haz",
            },
          ],
        },
      ],
    },
    {
      id: "usted-polite",
      stepNumber: 2,
      title: "Usted Commands for Polite Requests",
      icon: "🤝",
      explanation: `
        <h3>Polite and Professional Tone</h3>
        <p>Use usted commands in customer service, formal settings, and respectful requests.</p>
        <p>Examples: <em>Pase</em>, <em>Tome asiento</em>, <em>Espere un momento</em>.</p>
        <p>To express obligation softly, use <strong>tener que + infinitive</strong>: <em>Tiene que firmar aquí.</em> (You have to sign here.)</p>
      `,
      formula: [
        { text: "subject", type: "subject" },
        { text: "+", type: "other" },
        { text: "tener", type: "verb" },
        { text: "+", type: "other" },
        { text: "que", type: "other" },
        { text: "+", type: "other" },
        { text: "infinitive", type: "object" },
      ],
      usageMeanings: [
        {
          title: "Common Polite Frames",
          description: "Useful in real interactions.",
          examples: [
            {
              sentence: "Por favor, <strong>firme</strong> aquí.",
              explanation: "Please sign here.",
            },
            {
              sentence: "<strong>Dígame</strong> su nombre completo.",
              explanation: "Please tell me your full name.",
            },
            {
              sentence: "<strong>No se preocupe</strong>.",
              explanation: "Don't worry (polite form).",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-cmd-3",
          title: "Choose Tú or Usted",
          instructions: "Pick the form that fits the context.",
          items: [
            {
              type: "radio",
              label: "You are speaking to your teacher:",
              options: [
                { value: "a", label: "Escucha esto." },
                { value: "b", label: "Escuche esto." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You are speaking to your close friend:",
              options: [
                { value: "a", label: "Ven aquí." },
                { value: "b", label: "Venga aquí." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Complete politely: Por favor, ___ (pasar) por aquí.",
              correctAnswer: "pase",
              expectedAnswers: ["pase"],
            },
          ],
        },
      ],
    },
    {
      id: "commands-production",
      stepNumber: 3,
      title: "Production: Instruction Sequences",
      icon: "📝",
      explanation: `
        <h3>Give Multi-Step Instructions</h3>
        <p>Combine commands with sequence markers: <strong>primero, luego, después, finalmente</strong>.</p>
        <p><strong>Success criteria:</strong> Each step should be one clear command. Use affirmative tú for informal steps, negative tú for "don't" steps, usted for formal/polite steps. Example sequence: <em>Primero abre la puerta. Luego no corras. Después pase por aquí, por favor. Finalmente firme aquí.</em></p>
      `,
      exercises: [
        {
          id: "sp-cmd-4",
          title: "Write a 4-Step Instruction",
          instructions: "Write practical instructions (e.g., for a visitor or customer). Use: Step 1 = affirmative tú command, Step 2 = negative tú command, Step 3 = polite usted command, Step 4 = final instruction. One clear command per step.",
          answerExpectation: "full-sentence",
          items: [
            {
              type: "text",
              label: "Step 1 (affirmative tú command, e.g. Abre la puerta):",
              placeholder: "Ejemplo: Habla más despacio.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 2 (negative tú command, e.g. No corras):",
              placeholder: "Ejemplo: No llegues tarde.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 3 (polite usted command, e.g. Pase por aquí):",
              placeholder: "Ejemplo: Espere un momento, por favor.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 4 (final instruction, e.g. Firme aquí):",
              placeholder: "Ejemplo: Siéntese, por favor.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "quick-reference-cmd",
      stepNumber: 4,
      title: "Quick Reference: Command Forms",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Affirmative tú:</strong> use present él/ella form (habla, come). <strong>Negative tú:</strong> no + subjunctive (no hables, no comas). <strong>Usted/ustedes:</strong> subjunctive (hable, hablen). Irregulars: ten, ven, pon, haz, di, sal, sé.</p>
      `,
      exercises: [
        {
          id: "sp-cmd-quickref",
          title: "Recall",
          instructions: "Choose the correct type.",
          items: [
            { type: "radio", label: "Negative tú command uses ___ + subjunctive.", options: [{ value: "no", label: "no" }, { value: "si", label: "sí" }], expectedAnswer: "no" },
            { type: "radio", label: "Polite (usted) command uses ___ form.", options: [{ value: "subjunctive", label: "subjunctive" }, { value: "indicative", label: "indicative" }], expectedAnswer: "subjunctive" },
          ],
        },
      ],
    },
    {
      id: "common-mistakes-cmd",
      stepNumber: 5,
      title: "Common Mistakes",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <p>Using indicative for negative tú (say <strong>no hables</strong>, not no hablas). Forgetting irregular affirmative tú forms (di, haz, ten, etc.). Using tú form for usted.</p>
      `,
      exercises: [
        {
          id: "sp-cmd-mistakes",
          title: "Correct?",
          instructions: "Which is correct?",
          items: [
            { type: "radio", label: "Negative command for 'speak':", options: [{ value: "a", label: "No hables." }, { value: "b", label: "No hablas." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "cmd-q1",
      question: "Choose the affirmative tú command of hablar.",
      options: [
        { value: "a", label: "habla" },
        { value: "b", label: "hables" },
        { value: "c", label: "hable" },
      ],
      correctAnswer: "a",
      explanation: "Affirmative tú command is habla.",
    },
    {
      id: "cmd-q2",
      question: "Choose the negative tú command of comer.",
      options: [
        { value: "a", label: "no come" },
        { value: "b", label: "no comas" },
        { value: "c", label: "no coma" },
      ],
      correctAnswer: "b",
      explanation: "Negative tú command uses no + subjunctive: no comas.",
    },
    {
      id: "cmd-q3",
      question: "Which is a polite usted command?",
      options: [
        { value: "a", label: "Escucha" },
        { value: "b", label: "Escuche" },
        { value: "c", label: "Escuchas" },
      ],
      correctAnswer: "b",
      explanation: "Escuche is formal usted command.",
    },
    {
      id: "cmd-q4",
      question: "Choose the correct command: (hacer, tú affirmative)",
      options: [
        { value: "a", label: "haz" },
        { value: "b", label: "hace" },
        { value: "c", label: "haga" },
      ],
      correctAnswer: "a",
      explanation: "Haz is the irregular affirmative tú command.",
    },
    {
      id: "cmd-q5",
      question: "Pick the best sentence for speaking to a friend.",
      options: [
        { value: "a", label: "Abra la puerta." },
        { value: "b", label: "Abre la puerta." },
        { value: "c", label: "No abra la puerta." },
      ],
      correctAnswer: "b",
      explanation: "Use tú form with close friends in informal contexts.",
    },
    {
      id: "cmd-q6",
      question: "Complete: No ___ tarde. (llegar, tú negative)",
      options: [
        { value: "a", label: "llegas" },
        { value: "b", label: "llega" },
        { value: "c", label: "llegues" },
      ],
      correctAnswer: "c",
      explanation: "Negative tú command uses subjunctive: no llegues.",
    },
    {
      id: "cmd-q7",
      question: "Which command is most appropriate in customer service?",
      options: [
        { value: "a", label: "Siéntate aquí." },
        { value: "b", label: "Siéntese aquí." },
        { value: "c", label: "Te sientas aquí." },
      ],
      correctAnswer: "b",
      explanation: "Siéntese is formal/polite for customer-facing interactions.",
    },
    {
      id: "cmd-q8",
      question: "Choose the negative usted command of pasar.",
      options: [
        { value: "a", label: "no pase" },
        { value: "b", label: "no pasa" },
        { value: "c", label: "no pases" },
      ],
      correctAnswer: "a",
      explanation: "Usted negative command: no + subjunctive form (pase).",
    },
    {
      id: "cmd-q9",
      question: "Pick the best instruction sequence starter.",
      options: [
        { value: "a", label: "Primero, abre el archivo." },
        { value: "b", label: "Ayer, abre el archivo." },
        { value: "c", label: "Nunca, abre el archivo." },
      ],
      correctAnswer: "a",
      explanation: "Primero correctly introduces a step sequence.",
    },
    {
      id: "cmd-q10",
      question: "Which sentence correctly combines politeness and command form?",
      options: [
        { value: "a", label: "Por favor, firma aquí." },
        { value: "b", label: "Por favor, firme aquí." },
        { value: "c", label: "Por favor, firmas aquí." },
      ],
      correctAnswer: "b",
      explanation: "Firme is the formal usted command used in polite requests.",
    },
  ],
};
