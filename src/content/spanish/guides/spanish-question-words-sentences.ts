import type { InteractiveGuideContent } from "@/types/activity";

export const spanishQuestionWordsSentencesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "ask basic information questions",
    "form simple follow-up questions in conversation",
    "keep a short exchange going with clear question words",
  ],
  taskScenario: {
    title: "Meet someone new and keep the conversation moving",
    summary:
      "You are meeting a new classmate or neighbor. You need to ask for real information, react, and ask one follow-up so the exchange does not die after one sentence.",
    learnerRole: "Learner starting a basic conversation.",
    outcome: "You can ask useful questions and build a short exchange.",
  },
  inputMaterials: [
    {
      id: "qw-dialogue",
      title: "Short first meeting",
      kind: "dialogue",
      content: `
        <p><strong>Ana:</strong> Hola. ¿Cómo te llamas?</p>
        <p><strong>Luis:</strong> Me llamo Luis.</p>
        <p><strong>Ana:</strong> ¿De dónde eres?</p>
        <p><strong>Luis:</strong> Soy de Boston. ¿Y tú?</p>
      `,
    },
  ],
  taskStages: [
    {
      id: "qw-stage-match",
      title: "Choose the question word that gets the right information",
      goal: "Match the question word to meaning and communicative goal.",
      prompt: "Ask for place, time, reason, identity, and quantity accurately.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "qw-stage-build",
      title: "Build complete questions",
      goal: "Turn prompts into actual Spanish questions a person could ask.",
      prompt: "Write the question, not just the isolated word.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
    {
      id: "qw-stage-followup",
      title: "Keep the exchange going",
      goal: "Use one question and one follow-up to sustain conversation.",
      prompt: "Create a short two-line exchange with a clear information question and reaction.",
      expectedOutput: "write",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "qw-trigger-word-choice",
      stageId: "qw-stage-match",
      triggerType: "word-choice",
      failureReasonTag: "question-word-choice",
      detectedIssue: "The question word does not match the information needed.",
      microExplanation:
        "Ask yourself what information the speaker needs: place, time, reason, person, or quantity.",
      contrastExamples: ["¿Dónde vives? = place", "¿Cuándo estudias? = time"],
      repairPrompt: "Choose the question word that gets the missing information directly.",
    },
    {
      id: "qw-trigger-question-form",
      stageId: "qw-stage-build",
      triggerType: "production",
      failureReasonTag: "question-formation",
      detectedIssue: "The answer names the meaning, but not a full question.",
      microExplanation: "A conversation needs a complete question, not just dónde or cuándo by itself.",
      contrastExamples: ["Word only: Dónde", "Question: ¿Dónde vives?"],
      repairPrompt: "Rewrite the prompt as a full Spanish question.",
    },
    {
      id: "qw-trigger-followup",
      stageId: "qw-stage-followup",
      triggerType: "repair",
      failureReasonTag: "follow-up-conversation",
      detectedIssue: "The exchange stops after one question and one answer.",
      microExplanation: "A simple follow-up like ¿y tú?, ¿por qué?, or another question word keeps the conversation alive.",
      contrastExamples: ["¿Cómo te llamas? Me llamo Ana. ¿Y tú?"],
      repairPrompt: "Add a follow-up that invites the other person to keep speaking.",
    },
  ],
  sections: [
    {
      id: "qw-task-1",
      title: "Stage 1: Ask for the right information",
      icon: "❓",
      taskStageId: "qw-stage-match",
      inputMaterialIds: ["qw-dialogue"],
      focusOnFormTriggerIds: ["qw-trigger-word-choice"],
      explanation: `
        <h3>Question words are conversation tools</h3>
        <p>Choose them based on what you need to know, not just on English translation lists.</p>
      `,
      verbTable: {
        title: "Core question words",
        headers: ["Word", "Meaning", "Use"],
        rows: [
          ["¿qué?", "what", "¿Qué haces?"],
          ["¿quién?", "who", "¿Quién es ella?"],
          ["¿dónde?", "where", "¿Dónde vives?"],
          ["¿cuándo?", "when", "¿Cuándo estudias?"],
          ["¿por qué?", "why", "¿Por qué aprendes español?"],
          ["¿cómo?", "how", "¿Cómo estás?"],
          ["¿cuánto/a/os/as?", "how much / many", "¿Cuántos años tienes?"],
        ],
      },
      exercises: [
        {
          id: "qw-stage-1",
          title: "Pick the best question word",
          instructions: "Choose the word that gets the information you want.",
          items: [
            { type: "select", label: "___ vives? (where)", options: ["Qué", "Dónde", "Quién"], expectedAnswer: "Dónde" },
            { type: "select", label: "___ estudias español? (why)", options: ["Por qué", "Cómo", "Cuándo"], expectedAnswer: "Por qué" },
            { type: "select", label: "___ años tienes? (how many)", options: ["Qué", "Cuántos", "Quién"], expectedAnswer: "Cuántos" },
          ],
        },
      ],
    },
    {
      id: "qw-task-2",
      stepNumber: 1,
      title: "Stage 2: Turn ideas into real questions",
      icon: "🧱",
      taskStageId: "qw-stage-build",
      focusOnFormTriggerIds: ["qw-trigger-question-form"],
      explanation: `
        <h3>A full question is what moves the conversation</h3>
        <p>Use the word, the verb, and the punctuation together.</p>
      `,
      exercises: [
        {
          id: "qw-stage-2",
          title: "Build the full question",
          instructions: "Rewrite each prompt as a Spanish question.",
          items: [
            {
              type: "text",
              label: "Ask: where do you live?",
              correctAnswer: "¿Dónde vives?",
              expectedAnswers: ["¿Dónde vives?", "Dónde vives"],
            },
            {
              type: "text",
              label: "Ask: when does she study?",
              correctAnswer: "¿Cuándo estudia?",
              expectedAnswers: ["¿Cuándo estudia?", "Cuándo estudia"],
            },
          ],
        },
      ],
    },
    {
      id: "qw-task-3",
      stepNumber: 2,
      title: "Stage 3: Keep the exchange going",
      icon: "💬",
      taskStageId: "qw-stage-followup",
      focusOnFormTriggerIds: ["qw-trigger-followup"],
      explanation: `
        <h3>One good question is a start, not the whole conversation</h3>
        <p>Add a short answer and a follow-up so the exchange sounds human.</p>
      `,
      exercises: [
        {
          id: "qw-stage-3",
          title: "Write a mini exchange",
          instructions: "Write one question and one answer/follow-up line.",
          answerExpectation: "full-sentence",
          items: [
            { type: "text", label: "Line 1: ask a question with ¿dónde?, ¿cómo?, or ¿cuándo?", placeholder: "Ejemplo: ¿Dónde trabajas?", acceptAnyAttempt: true },
            { type: "text", label: "Line 2: answer and add a follow-up or reaction.", placeholder: "Ejemplo: Trabajo en una escuela. ¿Y tú?", acceptAnyAttempt: true },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether the exchange sounds like something two people could really say out loud.",
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: basic information exchange",
    questions: [
      {
        id: "qw-cq1",
        question: "You want to ask for a place. Best option:",
        options: [
          { value: "a", label: "¿Dónde vives?" },
          { value: "b", label: "¿Cuándo vives?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "basic-info-question",
        failureReasonTag: "question-word-choice",
      },
      {
        id: "qw-cq2",
        question: "Best full question for “when does she study?”",
        options: [
          { value: "a", label: "¿Cuándo estudia?" },
          { value: "b", label: "¿Cuándo?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "question-building",
        failureReasonTag: "question-formation",
      },
      {
        id: "qw-cq3",
        question: "You want to know why someone learns Spanish:",
        options: [
          { value: "a", label: "¿Por qué aprendes español?" },
          { value: "b", label: "¿Quién aprendes español?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "reason-question",
        failureReasonTag: "question-word-choice",
      },
      {
        id: "qw-cq4",
        question: "Which follow-up keeps the exchange going?",
        options: [
          { value: "a", label: "¿Y tú?" },
          { value: "b", label: "Qué." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "follow-up-conversation",
        failureReasonTag: "follow-up-conversation",
      },
      {
        id: "qw-cq5",
        question: "Best question for quantity:",
        options: [
          { value: "a", label: "¿Cuántos años tienes?" },
          { value: "b", label: "¿Quién años tienes?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "quantity-question",
        failureReasonTag: "question-word-choice",
      },
      {
        id: "qw-cq6",
        question: "Best repair for a one-word answer “Dónde” when the task asks for a full question:",
        options: [
          { value: "a", label: "¿Dónde trabajas?" },
          { value: "b", label: "Dónde." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "question-repair",
        failureReasonTag: "question-formation",
      },
    ],
  },
};
