import type { InteractiveGuideContent } from "@/types/activity";

export const spanishForEsolTeachersContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "esol-intro",
      title: "Spanish for ESOL Teachers: A Contrastive View",
      icon: "👩‍🏫",
      explanation: `
        <h3>Objective</h3>
        <p>This guide is for ESOL teachers who want to use their teaching experience to speed up their own Spanish learning.</p>
        <p>We’ll use a contrastive lens: how meaning, form, and use work in English vs. Spanish, and how to avoid transfer that causes errors.</p>
      `,
      exercises: [
        {
          id: "sp-esol-1",
          title: "Your teaching profile",
          instructions: "Identify your strengths for positive transfer.",
          items: [
            {
              type: "text",
              label: "Name two areas of your teaching practice that can help you in Spanish.",
              acceptAnyAttempt: true,
            },
            {
              type: "radio",
              label: "For you, what’s the biggest initial challenge?",
              options: [
                { value: "a", label: "agreement and gender" },
                { value: "b", label: "how discourse is organized" },
                { value: "c", label: "pragmatic register (tone, formality)" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "esol-transferencia",
      stepNumber: 1,
      title: "Useful transfer vs interference",
      icon: "🔁",
      explanation: `
        <h3>Key idea for teachers</h3>
        <p>Not every cross-linguistic comparison helps the same way: some speed up learning, others create persistent errors.</p>
        <ul>
          <li><strong>Useful transfer:</strong> organizing sentences by communicative function.</li>
          <li><strong>Interference:</strong> copying morphosyntactic patterns directly from English.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-esol-2",
          title: "Classify the case",
          instructions: "Say whether each case is useful transfer or interference.",
          items: [
            {
              type: "radio",
              label: "Using a 'function + form + use' framework to plan speaking practice.",
              options: [
                { value: "a", label: "useful transfer" },
                { value: "b", label: "interference" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Dropping noun–adjective agreement because English doesn’t mark it the same way.",
              options: [
                { value: "a", label: "useful transfer" },
                { value: "b", label: "interference" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Describe one interference you notice in your own Spanish.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "esol-diferencias",
      stepNumber: 2,
      title: "High-impact structural differences",
      icon: "🧩",
      explanation: `
        <h3>Critical areas for English-speaking teachers</h3>
        <ul>
          <li><strong>Agreement:</strong> article + noun + adjective (gender and number).</li>
          <li><strong>Verb system:</strong> aspect and tense are more context-sensitive than in English.</li>
          <li><strong>Object pronouns:</strong> position and discourse function differ from English.</li>
          <li><strong>Register:</strong> choosing tú vs usted and mitigation strategies.</li>
        </ul>
      `,
      comparison: {
        title: "Areas of contrast",
        leftLabel: "Typical pitfall",
        rightLabel: "Strategy: apply your teaching lens to your own learning",
        rows: [
          {
            label: "Agreement",
            left: "Underusing gender and number because of English transfer.",
            right: "Build routines that check the whole noun phrase (article–noun–adjective).",
          },
          {
            label: "Tense and mood",
            left: "Choosing tense by literal translation from English.",
            right: "Choose form by communicative intent and time frame.",
          },
          {
            label: "Pragmatics",
            left: "Using the same tone with everyone.",
            right: "Consider audience, distance, and purpose before you speak or write.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-esol-3",
          title: "Apply a teaching decision",
          instructions: "Choose the most effective strategy for each difficulty.",
          items: [
            {
              type: "select",
              label: "Difficulty: repeated agreement errors in writing.",
              options: [
                "Write longer texts without focused feedback",
                "Use a noun-phrase checklist on every draft",
                "Avoid adjectives to reduce errors",
              ],
              expectedAnswer: "Use a noun-phrase checklist on every draft",
            },
            {
              type: "select",
              label: "Difficulty: shaky choice between indicative and subjunctive.",
              options: [
                "Memorize lists without context",
                "Group triggers by meaning and practice with real scenarios",
                "Avoid subordinate clauses",
              ],
              expectedAnswer: "Group triggers by meaning and practice with real scenarios",
            },
            {
              type: "text",
              label: "Outline a 3-step mini-sequence to fix one of your own interferences.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "esol-produccion",
      stepNumber: 3,
      title: "Applying metalinguistic reflection",
      icon: "📝",
      explanation: `
        <h3>Final task</h3>
        <p>Write a short reflection (160–220 words) on how your ESOL experience can improve your Spanish learning and what concrete changes you’ll make.</p>
      `,
      exercises: [
        {
          id: "sp-esol-4",
          title: "Teacher–learner plan",
          instructions: "Write a short plan with diagnosis, strategy, and a progress check.",
          items: [
            {
              type: "text",
              label: "Diagnosis: two priority interferences for you:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "One teaching strategy you’ll transfer to your own learning:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "One way you’ll measure progress in the next four weeks:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Final reflection (160–220 words):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "esol-q1",
      question: "What best describes a contrastive approach for ESOL teachers?",
      options: [
        { value: "a", label: "Word-for-word translation" },
        { value: "b", label: "Comparing how the languages work to choose form and use" },
        { value: "c", label: "Avoiding any reference to English" },
      ],
      correctAnswer: "b",
      explanation: "Useful comparison guides communicative choices and reduces interference.",
    },
    {
      id: "esol-q2",
      question: "Which is interference?",
      options: [
        { value: "a", label: "Using communicative function as a framework" },
        { value: "b", label: "Ignoring noun–adjective agreement because of English" },
        { value: "c", label: "Planning contextual practice" },
      ],
      correctAnswer: "b",
      explanation: "That kind of transfer creates systematic error.",
    },
    {
      id: "esol-q3",
      question: "Which strategy improves verb accuracy most?",
      options: [
        { value: "a", label: "Choosing tense by literal translation" },
        { value: "b", label: "Linking tense and mood to intent and time frame" },
        { value: "c", label: "Avoiding subordinate clauses" },
      ],
      correctAnswer: "b",
      explanation: "It aligns form with real discourse function.",
    },
    {
      id: "esol-q4",
      question: "What does a noun-phrase checklist help with?",
      options: [
        { value: "a", label: "Reduces focus on form" },
        { value: "b", label: "Makes you check agreement systematically" },
        { value: "c", label: "Makes feedback unnecessary" },
      ],
      correctAnswer: "b",
      explanation: "It supports consistent monitoring of article–noun–adjective.",
    },
    {
      id: "esol-q5",
      question: "In pragmatics, what matters most?",
      options: [
        { value: "a", label: "Keeping the same tone everywhere" },
        { value: "b", label: "Adjusting register for audience and purpose" },
        { value: "c", label: "Avoiding mitigation" },
      ],
      correctAnswer: "b",
      explanation: "Pragmatic appropriateness is central to effective communication.",
    },
    {
      id: "esol-q6",
      question: "What counts as useful transfer for an ESOL teacher?",
      options: [
        { value: "a", label: "Applying teaching sequencing to your own learning" },
        { value: "b", label: "Copying English structures into Spanish" },
        { value: "c", label: "Ignoring cross-linguistic contrast" },
      ],
      correctAnswer: "a",
      explanation: "Your teaching expertise can transfer in positive ways.",
    },
    {
      id: "esol-q7",
      question: "What supports sustained improvement?",
      options: [
        { value: "a", label: "Correcting everything with no priorities" },
        { value: "b", label: "Focusing on high-impact interferences and tracking progress" },
        { value: "c", label: "Ignoring recurring errors" },
      ],
      correctAnswer: "b",
      explanation: "Prioritizing makes practice more efficient and measurable.",
    },
    {
      id: "esol-q8",
      question: "What helps you learn more independently?",
      options: [
        { value: "a", label: "Tracking simple weekly indicators" },
        { value: "b", label: "Studying with no clear progress criteria" },
        { value: "c", label: "Avoiding self-assessment" },
      ],
      correctAnswer: "a",
      explanation: "It lets you adjust your strategy with evidence.",
    },
    {
      id: "esol-q9",
      question: "What’s a realistic 4-week goal?",
      options: [
        { value: "a", label: "Perfect control of everything" },
        { value: "b", label: "Reducing one interference pattern with a clear measure" },
        { value: "c", label: "Not reviewing your output" },
      ],
      correctAnswer: "b",
      explanation: "Small, measurable goals support real progress.",
    },
    {
      id: "esol-q10",
      question: "What best shows you’ve used this guide?",
      options: [
        { value: "a", label: "A general description with no plan" },
        { value: "b", label: "Diagnosis + a strategy you transferred + a way to track it" },
        { value: "c", label: "Only a list of errors" },
      ],
      correctAnswer: "b",
      explanation: "It combines reflection with concrete teaching-style action.",
    },
  ],
};
