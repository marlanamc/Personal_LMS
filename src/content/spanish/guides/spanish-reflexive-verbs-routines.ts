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
      title: "A2 Routine Speaking Template",
      icon: "🗣️",
      explanation: `
        <h3>Use This Speaking Frame</h3>
        <p><em>Primero me ____. Luego ____. Después ____. Finalmente ____.</em></p>
        <p>This frame helps you produce a full routine in 4 connected steps.</p>
      `,
      exercises: [
        {
          id: "sp-reflexive-4",
          title: "Write a 4-Step Routine",
          instructions: "Use at least two reflexive verbs.",
          items: [
            {
              type: "text",
              label: "Step 1 (primero):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 2 (luego):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 3 (después):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Step 4 (finalmente):",
              acceptAnyAttempt: true,
            },
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
  ],
};
