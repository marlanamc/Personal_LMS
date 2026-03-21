import type { InteractiveGuideContent } from "@/types/activity";

export const spanishObligationNecessityContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "say what you have to do today",
    "distinguish between have to, should, and need to",
    "explain when something is optional or not recommended",
  ],
  taskScenario: {
    title: "You are organizing a busy day",
    summary:
      "You need to explain obligations, advice, and personal needs during a day full of errands, classes, and work.",
    learnerRole: "Adult learner coordinating practical responsibilities.",
    outcome: "You can tell someone what must happen, what should happen, and what is optional.",
    successCriteria: [
      "Choose the right obligation pattern for the situation.",
      "Keep the meaning clear when negating obligation.",
      "Use the structure in a short real-life plan.",
    ],
  },
  inputMaterials: [
    {
      id: "obl-text-reminder",
      title: "Morning text",
      kind: "message",
      prompt: "Read the message and notice how obligations and needs are mixed.",
      content: `
        <p><strong>Mamá:</strong> Hoy tienes que llamar al médico. También debes recoger la medicina.</p>
        <p><strong>Tú:</strong> Vale. Primero necesito terminar el trabajo y después voy.</p>
      `,
    },
    {
      id: "obl-work-note",
      title: "Note from work",
      kind: "notice",
      prompt: "Some actions are required; others are advice.",
      content: `
        <ul>
          <li>Los visitantes <strong>tienen que</strong> firmar aquí.</li>
          <li>No <strong>deben</strong> usar el ascensor de servicio.</li>
          <li>Si necesitas ayuda, <strong>debes</strong> hablar con recepción.</li>
        </ul>
      `,
    },
  ],
  taskStages: [
    {
      id: "obligation-stage-core",
      title: "Explain what must happen",
      goal: "Use a clear obligation pattern for real responsibilities.",
      prompt: "Respond to a practical situation where you need to tell someone what they have to do.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
    },
    {
      id: "obligation-stage-contrast",
      title: "Choose between have to, should, and need to",
      goal: "Match the pattern to the meaning, not just the translation.",
      prompt: "Pick the form that best fits obligation, advice, or necessity.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "obligation-stage-negative",
      title: "Clarify what is optional or not recommended",
      goal: "Avoid confusing don't have to with shouldn't.",
      prompt: "Interpret and produce negative obligation clearly.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
    {
      id: "obligation-stage-production",
      title: "Build a realistic action plan",
      goal: "Combine obligations and needs in a short routine.",
      prompt: "Write a 3-step plan for a busy day using at least two different obligation patterns.",
      expectedOutput: "write",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "obl-trigger-tener-que",
      stageId: "obligation-stage-core",
      triggerType: "production",
      detectedIssue: "The learner dropped que after tener.",
      failureReasonTag: "structure-omission",
      microExplanation:
        "Tener que is a fixed pattern. If que disappears, the sentence sounds unfinished.",
      contrastExamples: ["Wrong: Tengo estudiar.", "Better: Tengo que estudiar."],
      repairPrompt: "Try again with tener + que + infinitive.",
    },
    {
      id: "obl-trigger-contrast",
      stageId: "obligation-stage-contrast",
      triggerType: "word-choice",
      failureReasonTag: "obligation-contrast",
      detectedIssue: "The meaning of have to / should / need to is mixed up.",
      microExplanation:
        "Tener que usually signals a concrete obligation. Deber often sounds like advice or a recommendation. Necesitar highlights personal need.",
      contrastExamples: [
        "Tengo que firmar aquí. = I have to sign here.",
        "Debes descansar. = You should rest.",
        "Necesito dormir. = I need to sleep.",
      ],
      repairPrompt: "Rechoose the form based on the speaker's intention, not just the English gloss.",
    },
    {
      id: "obl-trigger-negative",
      stageId: "obligation-stage-negative",
      triggerType: "repair",
      failureReasonTag: "negative-obligation",
      detectedIssue: "The sentence confuses don't have to with shouldn't.",
      microExplanation:
        "No tener que means there is no obligation. No deber means the action is not recommended.",
      contrastExamples: [
        "No tengo que ir. = I don't have to go.",
        "No debo fumar. = I shouldn't smoke.",
      ],
      repairPrompt: "Rewrite the sentence so the listener knows whether the action is optional or bad advice.",
    },
  ],
  sections: [
    {
      id: "obligation-task-1",
      title: "Stage 1: What do you have to do?",
      icon: "📌",
      taskStageId: "obligation-stage-core",
      inputMaterialIds: ["obl-text-reminder"],
      focusOnFormTriggerIds: ["obl-trigger-tener-que"],
      explanation: `
        <h3>Start with the responsibility</h3>
        <p>When the job is concrete and practical, <strong>tener que + infinitive</strong> is often the fastest, clearest choice.</p>
      `,
      formula: [
        { text: "subject", type: "subject" },
        { text: "+", type: "other" },
        { text: "tener", type: "verb" },
        { text: "+ que +", type: "other" },
        { text: "infinitive", type: "object" },
      ],
      exercises: [
        {
          id: "obl-stage-1",
          title: "Immediate obligation",
          instructions: "Pick or build the form that solves the situation.",
          items: [
            {
              type: "select",
              label: "Yo ___ llamar al médico hoy.",
              options: ["tengo que", "debo que", "necesito que"],
              expectedAnswer: "tengo que",
            },
            {
              type: "text",
              label: "Complete: Nosotros ___ salir temprano.",
              correctAnswer: "tenemos que",
              expectedAnswers: ["tenemos que"],
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether the listener can tell exactly what has to happen next.",
      },
    },
    {
      id: "obligation-task-2",
      stepNumber: 1,
      title: "Stage 2: Have to, should, or need to?",
      icon: "🔑",
      taskStageId: "obligation-stage-contrast",
      inputMaterialIds: ["obl-work-note"],
      focusOnFormTriggerIds: ["obl-trigger-contrast"],
      explanation: `
        <h3>Meaning matters more than memorization</h3>
        <p>These patterns overlap in English, but in a real exchange the tone and force are different.</p>
      `,
      repairStacks: [
        {
          title: "Advice is not the same as obligation",
          incorrect: "Tienes que descansar. (when the doctor is giving soft advice)",
          corrected: "Debes descansar.",
          whyItWorks: "The repair lowers the force from external obligation to recommendation, which matches the intended meaning.",
        },
      ],
      comparison: {
        title: "Obligation contrast",
        leftLabel: "Pattern",
        rightLabel: "Typical meaning",
        rows: [
          { label: "tener que", left: "external obligation", right: "have to / must" },
          { label: "deber", left: "advice / recommendation", right: "should" },
          { label: "necesitar", left: "personal necessity", right: "need to" },
        ],
      },
      exercises: [
        {
          id: "obl-stage-2",
          title: "Choose the intention",
          instructions: "Pick the pattern that fits the speaker's goal.",
          items: [
            {
              type: "radio",
              label: "A doctor gives advice: “You should rest.”",
              options: [
                { value: "deber", label: "Debes descansar." },
                { value: "tener", label: "Tienes que descansar." },
              ],
              expectedAnswer: "deber",
            },
            {
              type: "radio",
              label: "You personally need sleep.",
              options: [
                { value: "necesitar", label: "Necesito dormir." },
                { value: "tener", label: "Tengo que dormir." },
              ],
              expectedAnswer: "necesitar",
            },
          ],
        },
      ],
    },
    {
      id: "obligation-task-3",
      stepNumber: 2,
      title: "Stage 3: Optional or not recommended?",
      icon: "🚫",
      taskStageId: "obligation-stage-negative",
      focusOnFormTriggerIds: ["obl-trigger-negative"],
      explanation: `
        <h3>Negatives change the message a lot</h3>
        <p>In real conversation, mixing up <em>don't have to</em> and <em>shouldn't</em> creates confusion quickly.</p>
      `,
      usageMeanings: [
        {
          title: "Two different messages",
          description: "Both are negative, but they do not mean the same thing.",
          examples: [
            { sentence: "No tengo que ir.", explanation: "There is no obligation." },
            { sentence: "No debo ir.", explanation: "Going is a bad idea / not recommended." },
          ],
        },
      ],
      exercises: [
        {
          id: "obl-stage-3",
          title: "Negative meaning check",
          instructions: "Choose the meaning that matches the sentence.",
          items: [
            {
              type: "radio",
              label: "No tengo que trabajar hoy.",
              options: [
                { value: "optional", label: "I don't have to work today." },
                { value: "forbidden", label: "I must not work today." },
              ],
              expectedAnswer: "optional",
            },
            {
              type: "radio",
              label: "No debes fumar aquí.",
              options: [
                { value: "optional", label: "You don't have to smoke here." },
                { value: "advice", label: "You shouldn't smoke here." },
              ],
              expectedAnswer: "advice",
            },
          ],
        },
      ],
    },
    {
      id: "obligation-task-4",
      stepNumber: 3,
      title: "Stage 4: Build a real plan",
      icon: "📝",
      taskStageId: "obligation-stage-production",
      explanation: `
        <h3>Now make it useful</h3>
        <p>Use obligation language to organize a real day, not isolated examples.</p>
      `,
      exercises: [
        {
          id: "obl-stage-4",
          title: "Busy-day plan",
          instructions: "Write three short steps for a busy day. Use at least one tener que sentence and one deber or necesitar sentence.",
          answerExpectation: "full-sentence",
          items: [
            { type: "text", label: "Step 1:", placeholder: "Ejemplo: Tengo que llamar al banco.", acceptAnyAttempt: true },
            { type: "text", label: "Step 2:", placeholder: "Ejemplo: Debo salir temprano.", acceptAnyAttempt: true },
            { type: "text", label: "Step 3:", placeholder: "Ejemplo: Necesito descansar después.", acceptAnyAttempt: true },
          ],
        },
      ],
      postTaskReflection: {
        title: "Revise for meaning",
        prompt: "Check whether each sentence expresses obligation, advice, or personal need clearly.",
        checklist: ["At least one tener que sentence", "At least one deber or necesitar sentence", "Clear real-life meaning"],
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: obligations in real situations",
    questions: [
      {
        id: "obl-cq1",
        question: "You must sign at reception. Best option:",
        options: [
          { value: "a", label: "Tiene que firmar aquí." },
          { value: "b", label: "Tiene firmar aquí." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-service-task",
        failureReasonTag: "structure-omission",
      },
      {
        id: "obl-cq2",
        question: "A friend needs advice: “You should rest.”",
        options: [
          { value: "a", label: "Debes descansar." },
          { value: "b", label: "Tienes que descansar." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-advice",
        failureReasonTag: "obligation-contrast",
      },
      {
        id: "obl-cq3",
        question: "Which means there is no obligation?",
        options: [
          { value: "a", label: "No tengo que ir." },
          { value: "b", label: "No debo ir." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-negative-clarity",
        failureReasonTag: "negative-obligation",
      },
      {
        id: "obl-cq4",
        question: "Choose the best personal-need sentence.",
        options: [
          { value: "a", label: "Necesito dormir." },
          { value: "b", label: "Debo dormir." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-personal-need",
        failureReasonTag: "obligation-contrast",
      },
      {
        id: "obl-cq5",
        question: "Best repair for “Tengo estudiar.”",
        options: [
          { value: "a", label: "Tengo que estudiar." },
          { value: "b", label: "Debo que estudiar." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-repair",
        failureReasonTag: "structure-omission",
      },
      {
        id: "obl-cq6",
        question: "Which sentence sounds like advice against something?",
        options: [
          { value: "a", label: "No debes fumar aquí." },
          { value: "b", label: "No tienes que fumar aquí." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "obligation-negative-advice",
        failureReasonTag: "negative-obligation",
      },
    ],
  },
};
