import type { InteractiveGuideContent } from "@/types/activity";

export const spanishReflexiveVerbsRoutinesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "reflexive-basics",
      title: "Reflexive Verbs for Daily Routines",
      icon: "🪞",
      explanation: `
        <h3>A2 Routine Language</h3>
        <p>Reflexive verbs show actions you do to yourself: <em>me levanto</em> (I get up), <em>se acuesta</em> (he/she goes to bed).</p>
        <p>Pronouns: <strong>me, te, se, nos, os, se</strong></p>
      `,
      verbTable: {
        title: "Reflexive Pronoun + Verb Pattern",
        headers: ["Subject", "Pronoun", "Example"],
        rows: [
          ["yo", "me", "me levanto"],
          ["tú", "te", "te duchas"],
          ["él/ella/usted", "se", "se viste"],
          ["nosotros/as", "nos", "nos acostamos"],
          ["ellos/ellas/ustedes", "se", "se despiertan"],
        ],
      },
      exercises: [
        {
          id: "sp-reflexive-1",
          title: "Choose the Correct Pronoun",
          instructions: "Match the subject and reflexive pronoun.",
          items: [
            {
              type: "select",
              label: "Yo ___ levanto a las 6.",
              options: ["me", "te", "se"],
              expectedAnswer: "me",
            },
            {
              type: "select",
              label: "Nosotros ___ acostamos tarde.",
              options: ["nos", "se", "me"],
              expectedAnswer: "nos",
            },
            {
              type: "select",
              label: "Ella ___ prepara para el trabajo.",
              options: ["te", "se", "nos"],
              expectedAnswer: "se",
            },
          ],
        },
      ],
    },
    {
      id: "common-routine-verbs",
      stepNumber: 1,
      title: "Most Useful Reflexive Routine Verbs",
      icon: "📋",
      explanation: `
        <h3>High-Frequency A2 Verbs</h3>
        <ul>
          <li><strong>despertarse</strong> = to wake up</li>
          <li><strong>levantarse</strong> = to get up</li>
          <li><strong>ducharse</strong> = to shower</li>
          <li><strong>vestirse</strong> = to get dressed</li>
          <li><strong>acostarse</strong> = to go to bed</li>
        </ul>
      `,
      usageMeanings: [
        {
          title: "Sample Routine",
          description: "Use sequence markers to sound natural.",
          examples: [
            {
              sentence: "Primero me despierto, luego me ducho y después me visto.",
              explanation: "first, then, after that",
            },
            {
              sentence: "Nos acostamos a las once porque trabajamos temprano.",
              explanation: "Use reflexive form with nosotros.",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-reflexive-2",
          title: "Complete with the Correct Form",
          instructions: "Write the best reflexive form.",
          items: [
            {
              type: "text",
              label: "Tú ______ (ducharse) por la mañana.",
              correctAnswer: "te duchas",
              expectedAnswers: ["te duchas"],
            },
            {
              type: "text",
              label: "Yo ______ (vestirse) rápido.",
              correctAnswer: "me visto",
              expectedAnswers: ["me visto"],
            },
            {
              type: "text",
              label: "Ellos ______ (acostarse) tarde.",
              correctAnswer: "se acuestan",
              expectedAnswers: ["se acuestan"],
            },
          ],
        },
      ],
    },
    {
      id: "routine-time-and-order",
      stepNumber: 2,
      title: "Sequencing Your Routine",
      icon: "⏱️",
      explanation: `
        <h3>Connect Actions in Order</h3>
        <p>Use simple connectors:</p>
        <ul>
          <li><strong>primero</strong> (first)</li>
          <li><strong>luego</strong> (then)</li>
          <li><strong>después</strong> (afterwards)</li>
          <li><strong>finalmente</strong> (finally)</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-reflexive-3",
          title: "Order the Routine",
          instructions: "Pick the best sequence.",
          items: [
            {
              type: "radio",
              label: "Logical order:",
              options: [
                {
                  value: "a",
                  label: "Primero me acuesto, luego me despierto, después desayuno.",
                },
                {
                  value: "b",
                  label: "Primero me despierto, luego me visto, finalmente salgo.",
                },
              ],
              expectedAnswer: "b",
            },
            {
              type: "select",
              label: "___ me preparo y salgo al trabajo.",
              options: ["Después", "Ayer", "Nunca"],
              expectedAnswer: "Después",
            },
          ],
        },
      ],
    },
    {
      id: "daily-routine-speaking",
      stepNumber: 3,
      title: "Routine Speaking Template",
      icon: "🗣️",
      explanation: `
        <h3>Use This Speaking Frame</h3>
        <p><em>Primero me ____. Luego ____. Después ____. Finalmente ____.</em></p>
        <p>This frame helps you produce a full routine in 4 connected steps. <strong>Success criteria:</strong> Use at least two reflexive verbs (e.g. levantarse, ducharse, vestirse, acostarse). One action per step. Example: <em>Primero me levanto. Luego me ducho. Después me visto. Finalmente desayuno.</em></p>
      `,
      exercises: [
        {
          id: "sp-reflexive-4",
          title: "Write a 4-Step Routine",
          instructions: "Write your morning or evening routine in 4 steps. Use at least two reflexive verbs. One complete sentence per step. Sequence: primero → luego → después → finalmente.",
          answerExpectation: "full-sentence",
          items: [
            {
              type: "text",
              label: "Step 1 (primero, e.g. Primero me levanto):",
              placeholder: "Ejemplo: Primero me levanto a las siete.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 2 (luego, e.g. Luego me ducho):",
              placeholder: "Ejemplo: Luego me ducho.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 3 (después, e.g. Después me visto):",
              placeholder: "Ejemplo: Después me visto.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 4 (finalmente, e.g. Finalmente desayuno):",
              placeholder: "Ejemplo: Finalmente desayuno.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "quick-reference-refl",
      stepNumber: 4,
      title: "Quick Reference: Reflexive Pronouns",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Pronouns:</strong> me, te, se, nos, os, se (match the subject). Common reflexive verbs: levantarse, ducharse, vestirse, acostarse. Pronoun goes before conjugated verb or attached to infinitive (voy a levantarme).</p>
      `,
      exercises: [
        {
          id: "sp-refl-quickref",
          title: "Recall",
          instructions: "Choose the correct form.",
          items: [
            { type: "radio", label: "With 'yo' the reflexive pronoun is ___.", options: [{ value: "me", label: "me" }, { value: "te", label: "te" }], expectedAnswer: "me" },
            { type: "radio", label: "With 'él/ella' the reflexive pronoun is ___.", options: [{ value: "se", label: "se" }, { value: "le", label: "le" }], expectedAnswer: "se" },
          ],
        },
      ],
    },
    {
      id: "common-mistakes-refl",
      stepNumber: 5,
      title: "Common Mistakes",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <p>Using the wrong pronoun for the subject (yo me levanto, not yo te levanto). Forgetting the pronoun (me ducho, not ducho). Putting the pronoun in the wrong place with two verbs (debo levantarme early, or me debo levantar).</p>
      `,
      exercises: [
        {
          id: "sp-refl-mistakes",
          title: "Correct?",
          instructions: "Which is correct?",
          items: [
            { type: "radio", label: "I wake up:", options: [{ value: "a", label: "Me despierto." }, { value: "b", label: "Despierto." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "refl-q1",
      question: "Which reflexive pronoun goes with 'yo'?",
      options: [
        { value: "a", label: "me" },
        { value: "b", label: "te" },
        { value: "c", label: "se" },
      ],
      correctAnswer: "a",
      explanation: "Yo uses me.",
    },
    {
      id: "refl-q2",
      question: "Choose the correct sentence:",
      options: [
        { value: "a", label: "Yo levanto a las seis." },
        { value: "b", label: "Yo me levanto a las seis." },
        { value: "c", label: "Yo te levanto a las seis." },
      ],
      correctAnswer: "b",
      explanation: "Routine action to yourself requires reflexive pronoun.",
    },
    {
      id: "refl-q3",
      question: "What is 'we go to bed' with acostarse?",
      options: [
        { value: "a", label: "nos acostamos" },
        { value: "b", label: "se acostamos" },
        { value: "c", label: "me acuesto" },
      ],
      correctAnswer: "a",
      explanation: "Nosotros takes nos: nos acostamos.",
    },
    {
      id: "refl-q4",
      question: "Which connector means 'then'?",
      options: [
        { value: "a", label: "luego" },
        { value: "b", label: "nunca" },
        { value: "c", label: "ayer" },
      ],
      correctAnswer: "a",
      explanation: "Luego means then.",
    },
    {
      id: "refl-q5",
      question: "Which is best for 'she gets dressed'?",
      options: [
        { value: "a", label: "se viste" },
        { value: "b", label: "me visto" },
        { value: "c", label: "te vistes" },
      ],
      correctAnswer: "a",
      explanation: "Ella uses se: se viste.",
    },
    {
      id: "refl-q6",
      question: "Reflexive verbs are common for...",
      options: [
        { value: "a", label: "daily routines and personal actions" },
        { value: "b", label: "only weather reports" },
        { value: "c", label: "only commands" },
      ],
      correctAnswer: "a",
      explanation: "They are very common when describing personal routines.",
    },
    {
      id: "refl-q7",
      question: "Choose the correct pronoun for 'tú'.",
      options: [
        { value: "a", label: "me" },
        { value: "b", label: "te" },
        { value: "c", label: "nos" },
      ],
      correctAnswer: "b",
      explanation: "Tú uses te.",
    },
    {
      id: "refl-q8",
      question: "Which is correct for 'ellos se despiertan'?",
      options: [
        { value: "a", label: "They wake up" },
        { value: "b", label: "They go to bed" },
        { value: "c", label: "They get dressed" },
      ],
      correctAnswer: "a",
      explanation: "Despertarse means to wake up.",
    },
    {
      id: "refl-q9",
      question: "Pick the best ordered routine sequence.",
      options: [
        { value: "a", label: "Finalmente, luego, primero, después" },
        { value: "b", label: "Primero, luego, después, finalmente" },
        { value: "c", label: "Después, ayer, luego, finalmente" },
      ],
      correctAnswer: "b",
      explanation: "This sequence is the expected narrative order for routines.",
    },
    {
      id: "refl-q10",
      question: "Which sentence is reflexive and correctly conjugated?",
      options: [
        { value: "a", label: "Nosotros nos acostamos temprano." },
        { value: "b", label: "Nosotros me acostamos temprano." },
        { value: "c", label: "Nosotros acostamos temprano." },
      ],
      correctAnswer: "a",
      explanation: "Nosotros takes nos and the conjugated verb form acostamos.",
    },
  ],
};
