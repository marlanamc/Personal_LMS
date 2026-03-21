import type { InteractiveGuideContent } from "@/types/activity";

export const spanishReflexiveVerbsRoutinesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "describe a daily routine naturally",
    "choose the right reflexive pronoun for the subject",
    "sequence a routine in clear steps",
  ],
  taskScenario: {
    title: "Explain your day so another person can picture it",
    summary:
      "You are introducing your morning or evening routine to a classmate or language partner. The goal is not just to name verbs, but to make the sequence easy to follow.",
    learnerRole: "Learner describing real self-care and routine habits.",
    outcome: "You can narrate a short routine with reflexive verbs and sequence words.",
  },
  inputMaterials: [
    {
      id: "refl-message",
      title: "Voice-note transcript",
      kind: "audio-transcript",
      prompt: "Notice how the speaker uses reflexive verbs as part of a sequence.",
      content: `
        <p>Primero me despierto a las seis. Luego me ducho y me visto rápido. Después preparo café y salgo al trabajo.</p>
      `,
    },
    {
      id: "refl-schedule",
      title: "Mini routine card",
      kind: "notice",
      content: `
        <ul>
          <li>6:30 - me levanto</li>
          <li>6:45 - me ducho</li>
          <li>7:00 - me visto</li>
          <li>7:20 - salgo</li>
        </ul>
      `,
    },
  ],
  taskStages: [
    {
      id: "refl-stage-pronouns",
      title: "Match the person and the routine action",
      goal: "Use the correct reflexive pronoun with the subject.",
      prompt: "Choose or build the form that sounds right for each person.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "refl-stage-routine",
      title: "Build routine sentences",
      goal: "Produce complete routine phrases with reflexive forms.",
      prompt: "Describe what someone does in a normal morning or evening routine.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
    {
      id: "refl-stage-sequence",
      title: "Sequence the routine clearly",
      goal: "Connect actions in an order the listener can follow.",
      prompt: "Use primero, luego, después, and finalmente to organize the routine.",
      expectedOutput: "write",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "refl-trigger-pronoun",
      stageId: "refl-stage-pronouns",
      triggerType: "agreement",
      failureReasonTag: "reflexive-pronoun-choice",
      detectedIssue: "The reflexive pronoun does not match the subject.",
      microExplanation: "The pronoun changes with the subject: me, te, se, nos, se.",
      contrastExamples: ["Yo me levanto.", "Nosotros nos acostamos."],
      repairPrompt: "Try again and make the pronoun agree with the person.",
    },
    {
      id: "refl-trigger-complete-form",
      stageId: "refl-stage-routine",
      triggerType: "production",
      failureReasonTag: "incomplete-routine-form",
      detectedIssue: "The answer is missing part of the reflexive form.",
      microExplanation: "A full routine form needs pronoun + conjugated verb, not just the infinitive.",
      contrastExamples: ["Wrong: vestir", "Better: me visto"],
      repairPrompt: "Rewrite the answer as a complete reflexive form.",
    },
    {
      id: "refl-trigger-sequence",
      stageId: "refl-stage-sequence",
      triggerType: "repair",
      failureReasonTag: "routine-sequencing",
      detectedIssue: "The routine is understandable, but the order is unclear.",
      microExplanation: "Sequence words help the listener follow the day step by step.",
      contrastExamples: ["Primero me despierto. Luego me ducho. Después me visto."],
      repairPrompt: "Revise the routine so each step follows logically.",
    },
  ],
  sections: [
    {
      id: "reflexive-task-1",
      title: "Stage 1: Who is doing it to themselves?",
      icon: "🪞",
      taskStageId: "refl-stage-pronouns",
      inputMaterialIds: ["refl-message"],
      focusOnFormTriggerIds: ["refl-trigger-pronoun"],
      explanation: `
        <h3>Reflexive routines are about the subject and the action together</h3>
        <p>In a real routine, the first thing to control is the pronoun that matches the person.</p>
      `,
      verbTable: {
        title: "Core reflexive pattern",
        headers: ["Subject", "Pronoun", "Example"],
        rows: [
          ["yo", "me", "me levanto"],
          ["tú", "te", "te duchas"],
          ["él/ella", "se", "se viste"],
          ["nosotros/as", "nos", "nos acostamos"],
          ["ellos/ellas", "se", "se preparan"],
        ],
      },
      exercises: [
        {
          id: "refl-stage-1",
          title: "Pick the pronoun that fits",
          instructions: "Choose the reflexive pronoun that matches the subject.",
          items: [
            { type: "select", label: "Yo ___ levanto temprano.", options: ["me", "te", "se"], expectedAnswer: "me" },
            { type: "select", label: "Nosotros ___ acostamos tarde.", options: ["nos", "me", "se"], expectedAnswer: "nos" },
          ],
        },
      ],
    },
    {
      id: "reflexive-task-2",
      stepNumber: 1,
      title: "Stage 2: Build routine sentences",
      icon: "📋",
      taskStageId: "refl-stage-routine",
      inputMaterialIds: ["refl-schedule"],
      focusOnFormTriggerIds: ["refl-trigger-complete-form"],
      explanation: `
        <h3>Now say the action as a real sentence</h3>
        <p>The listener needs more than a vocabulary list. Give a complete form they could actually hear in conversation.</p>
      `,
      exercises: [
        {
          id: "refl-stage-2",
          title: "Complete the routine action",
          instructions: "Write the full reflexive form.",
          items: [
            { type: "text", label: "Tú ______ (ducharse) por la mañana.", correctAnswer: "te duchas", expectedAnswers: ["te duchas"] },
            { type: "text", label: "Yo ______ (vestirse) rápido.", correctAnswer: "me visto", expectedAnswers: ["me visto"] },
            { type: "text", label: "Ellos ______ (acostarse) tarde.", correctAnswer: "se acuestan", expectedAnswers: ["se acuestan"] },
          ],
        },
      ],
    },
    {
      id: "reflexive-task-3",
      stepNumber: 2,
      title: "Stage 3: Make the routine easy to follow",
      icon: "⏱️",
      taskStageId: "refl-stage-sequence",
      focusOnFormTriggerIds: ["refl-trigger-sequence"],
      explanation: `
        <h3>Routine language needs order</h3>
        <p>When you describe a day, the sequence words do part of the communication work.</p>
      `,
      exercises: [
        {
          id: "refl-stage-3",
          title: "Write a 4-step routine",
          instructions: "Write a short morning or evening routine in four steps. Use at least two reflexive verbs.",
          answerExpectation: "full-sentence",
          items: [
            { type: "text", label: "Step 1 (primero):", placeholder: "Ejemplo: Primero me despierto.", acceptAnyAttempt: true },
            { type: "text", label: "Step 2 (luego):", placeholder: "Ejemplo: Luego me ducho.", acceptAnyAttempt: true },
            { type: "text", label: "Step 3 (después):", placeholder: "Ejemplo: Después me visto.", acceptAnyAttempt: true },
            { type: "text", label: "Step 4 (finalmente):", placeholder: "Ejemplo: Finalmente salgo.", acceptAnyAttempt: true },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether the routine moves in a believable order and whether at least two steps use reflexive verbs.",
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: describe a routine naturally",
    questions: [
      {
        id: "refl-cq1",
        question: "Best sentence for “I get up at six”:",
        options: [
          { value: "a", label: "Me levanto a las seis." },
          { value: "b", label: "Levanto a las seis." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-self-description",
        failureReasonTag: "reflexive-pronoun-choice",
      },
      {
        id: "refl-cq2",
        question: "Which sentence matches nosotros?",
        options: [
          { value: "a", label: "Nos acostamos tarde." },
          { value: "b", label: "Se acostamos tarde." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-group-reference",
        failureReasonTag: "reflexive-pronoun-choice",
      },
      {
        id: "refl-cq3",
        question: "Best repair for “yo vestir rápido”:",
        options: [
          { value: "a", label: "me visto rápido" },
          { value: "b", label: "me vestir rápido" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-form-repair",
        failureReasonTag: "incomplete-routine-form",
      },
      {
        id: "refl-cq4",
        question: "Best sequence opener:",
        options: [
          { value: "a", label: "Primero me despierto." },
          { value: "b", label: "Nunca me despierto." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-sequencing",
        failureReasonTag: "routine-sequencing",
      },
      {
        id: "refl-cq5",
        question: "Choose the sentence that sounds like a real routine step.",
        options: [
          { value: "a", label: "Luego me ducho." },
          { value: "b", label: "Luego duchar." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-step-production",
        failureReasonTag: "incomplete-routine-form",
      },
      {
        id: "refl-cq6",
        question: "Best routine ending:",
        options: [
          { value: "a", label: "Finalmente me acuesto." },
          { value: "b", label: "Finalmente acostarse." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "routine-sequencing",
        failureReasonTag: "routine-sequencing",
      },
    ],
  },
};
