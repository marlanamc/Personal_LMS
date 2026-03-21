import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPresentTenseContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "introduce yourself and your routine",
    "use common present-tense verbs in practical conversation",
    "distinguish everyday habits from right-now actions",
  ],
  taskScenario: {
    title: "Introduce yourself and describe a normal day",
    summary:
      "You meet someone new and need to say who you are, what you do, and what your day normally looks like.",
    learnerRole: "Learner handling a basic first conversation.",
    outcome: "You can give a simple self-introduction with clear present-tense verbs.",
  },
  inputMaterials: [
    {
      id: "present-intro-dialogue",
      title: "First conversation",
      kind: "dialogue",
      content: `
        <p><strong>Leo:</strong> Hola, soy Leo. Trabajo en una escuela y estudio español por la noche.</p>
        <p><strong>Sara:</strong> Mucho gusto. Yo vivo en Boston y camino al trabajo cada día.</p>
      `,
    },
    {
      id: "present-profile-card",
      title: "Profile card",
      kind: "profile-card",
      content: `
        <ul>
          <li>Nombre: Marta</li>
          <li>Profesión: enfermera</li>
          <li>Rutina: trabaja de día, estudia por la noche</li>
        </ul>
      `,
    },
    {
      id: "present-day-schedule",
      title: "Normal weekday schedule",
      kind: "schedule",
      content: `
        <ul>
          <li>6:30 - corro en el parque</li>
          <li>8:00 - trabajo en la clínica</li>
          <li>19:00 - estudio español</li>
        </ul>
      `,
    },
  ],
  taskStages: [
    {
      id: "present-stage-routine",
      title: "Say what you normally do",
      goal: "Use present tense to describe habits and routines.",
      prompt: "Respond as if you are telling someone about your usual day.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
    },
    {
      id: "present-stage-regular",
      title: "Build regular present-tense forms",
      goal: "Choose the right endings for common regular verbs.",
      prompt: "Use the subject to select the present-tense form that sounds natural.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "present-stage-irregular",
      title: "Handle the most common irregulars",
      goal: "Use ser, estar, ir, tener, and hacer in everyday speech.",
      prompt: "Choose the irregular verb form that fits the context.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "present-stage-contrast",
      title: "Keep habits separate from right-now actions",
      goal: "Avoid using the simple present when the context calls for a progressive meaning and vice versa.",
      prompt: "Decide whether the speaker is talking about a routine or a current action.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "present-trigger-ending",
      stageId: "present-stage-regular",
      triggerType: "agreement",
      failureReasonTag: "present-ending-choice",
      detectedIssue: "The verb ending does not match the subject.",
      microExplanation:
        "The stem is not enough; the ending carries the person. Yo hablo, ella come, nosotros vivimos.",
      contrastExamples: ["Yo hablo.", "Nosotros vivimos."],
      repairPrompt: "Check the subject and choose the ending that agrees with it.",
    },
    {
      id: "present-trigger-irregular",
      stageId: "present-stage-irregular",
      triggerType: "word-choice",
      failureReasonTag: "common-irregular-choice",
      detectedIssue: "A high-frequency irregular form is being treated like a regular verb.",
      microExplanation:
        "Some of the most common verbs are irregular and need to be learned as everyday chunks: soy, estoy, voy, tengo, hago.",
      contrastExamples: ["yo soy", "yo estoy", "yo voy", "yo tengo", "yo hago"],
      repairPrompt: "Choose the form people actually say in daily conversation.",
    },
    {
      id: "present-trigger-habit-vs-now",
      stageId: "present-stage-contrast",
      triggerType: "tense-choice",
      failureReasonTag: "habit-vs-now",
      detectedIssue: "The answer mixes up a routine meaning and a right-now meaning.",
      microExplanation:
        "Simple present is for routine, schedule, or fact. If the context is literally right now, another form may be better.",
      contrastExamples: ["Trabajo cada día. = routine", "Estoy trabajando ahora. = right now"],
      repairPrompt: "Decide whether the speaker means a habit or a current action and revise the sentence.",
    },
  ],
  sections: [
    {
      id: "present-task-1",
      title: "Stage 1: Talk about your day",
      icon: "🎯",
      taskStageId: "present-stage-routine",
      inputMaterialIds: ["present-intro-dialogue"],
      explanation: `
        <h3>Start with communication, not conjugation charts</h3>
        <p>The present tense matters because it lets you describe your life immediately: work, study, live, walk, eat, want.</p>
      `,
      sceneCards: [
        {
          title: "First conversation at class",
          setting: "Introductions",
          goal: "Give two or three clear facts about your normal life.",
          details: [
            "Say where you live.",
            "Say where you work or study.",
            "Add one routine detail like caminar, cocinar, estudiar.",
          ],
          usefulPhrases: ["Vivo en Boston.", "Trabajo en una escuela.", "Estudio por la noche."],
        },
      ],
      phraseBank: {
        title: "Chunks for a natural self-introduction",
        groups: [
          {
            label: "Who you are",
            phrases: ["Soy Leo.", "Vivo en Boston.", "Trabajo en una escuela."],
          },
          {
            label: "Your routine",
            phrases: ["Camino al trabajo.", "Estudio por la noche.", "Desayuno temprano."],
          },
        ],
      },
      exercises: [
        {
          id: "present-stage-1",
          title: "Routine introduction",
          instructions: "Choose or complete the response that sounds like a real self-introduction.",
          items: [
            {
              type: "radio",
              label: "Best introduction:",
              options: [
                { value: "a", label: "Trabajo en una escuela y estudio español por la noche." },
                { value: "b", label: "Trabajar escuela español noche." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Complete: Yo ___ en Boston. (vivir)",
              correctAnswer: "vivo",
              expectedAnswers: ["vivo"],
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether a real person could understand your normal routine from the sentence alone.",
      },
    },
    {
      id: "present-task-2",
      stepNumber: 1,
      title: "Stage 2: Regular present-tense patterns",
      icon: "📝",
      taskStageId: "present-stage-regular",
      inputMaterialIds: ["present-profile-card"],
      focusOnFormTriggerIds: ["present-trigger-ending"],
      explanation: `
        <h3>Endings matter because they point to the subject</h3>
        <p>Once the situation is clear, the next support move is choosing the ending that matches the person.</p>
      `,
      microStories: [
        {
          title: "How one ending changes the speaker",
          lines: [
            { text: "Yo vivo en Boston.", callout: "The ending -o marks yo." },
            { text: "Tú vives en Boston.", callout: "The ending -es shifts the subject to tú." },
            { text: "Nosotros vivimos en Boston.", callout: "The ending -imos points to nosotros." },
          ],
        },
      ],
      repairStacks: [
        {
          title: "Match the ending to the subject",
          incorrect: "Nosotros vive en la ciudad.",
          corrected: "Nosotros vivimos en la ciudad.",
          whyItWorks: "The listener identifies the subject partly from the ending, so the person marker has to agree.",
        },
      ],
      verbTable: {
        title: "Core regular patterns",
        headers: ["Person", "-AR", "-ER", "-IR"],
        rows: [
          ["yo", "hablo", "como", "vivo"],
          ["tú", "hablas", "comes", "vives"],
          ["él/ella", "habla", "come", "vive"],
          ["nosotros", "hablamos", "comemos", "vivimos"],
          ["ellos", "hablan", "comen", "viven"],
        ],
      },
      exercises: [
        {
          id: "present-stage-2",
          title: "Match the subject and ending",
          instructions: "Choose the form that agrees with the subject.",
          items: [
            { type: "text", label: "Ella ___ una manzana cada día. (comer)", correctAnswer: "come", expectedAnswers: ["come"] },
            { type: "text", label: "Nosotros ___ en la ciudad. (vivir)", correctAnswer: "vivimos", expectedAnswers: ["vivimos"] },
            { type: "text", label: "Tú ___ español bien. (hablar)", correctAnswer: "hablas", expectedAnswers: ["hablas"] },
          ],
        },
      ],
    },
    {
      id: "present-task-3",
      stepNumber: 2,
      title: "Stage 3: Everyday irregular verbs",
      icon: "⚡",
      taskStageId: "present-stage-irregular",
      focusOnFormTriggerIds: ["present-trigger-irregular"],
      explanation: `
        <h3>These verbs appear everywhere</h3>
        <p>Identity, location, movement, possession, and action all depend on a small set of irregular verbs.</p>
      `,
      sceneCards: [
        {
          title: "Five verbs that keep a conversation alive",
          setting: "Everyday interaction",
          details: [
            "soy / estoy for identity and condition",
            "voy for movement and plans",
            "tengo for age, possession, obligations",
            "hago for daily actions",
          ],
          usefulPhrases: ["Soy estudiante.", "Estoy cansada.", "Voy al trabajo.", "Tengo dos clases.", "Hago ejercicio."],
        },
      ],
      verbTable: {
        title: "Essential irregulars",
        headers: ["Verb", "Yo", "Tú", "Él/Ella"],
        rows: [
          ["ser", "soy", "eres", "es"],
          ["estar", "estoy", "estás", "está"],
          ["ir", "voy", "vas", "va"],
          ["tener", "tengo", "tienes", "tiene"],
          ["hacer", "hago", "haces", "hace"],
        ],
      },
      exercises: [
        {
          id: "present-stage-3",
          title: "Choose the everyday form",
          instructions: "Pick the form people use in daily life.",
          items: [
            {
              type: "radio",
              label: "I am a teacher.",
              options: [
                { value: "soy", label: "Soy profesor/a." },
                { value: "estoy", label: "Estoy profesor/a." },
              ],
              expectedAnswer: "soy",
            },
            {
              type: "radio",
              label: "I have two classes today.",
              options: [
                { value: "tengo", label: "Tengo dos clases hoy." },
                { value: "teno", label: "Teno dos clases hoy." },
              ],
              expectedAnswer: "tengo",
            },
          ],
        },
      ],
    },
    {
      id: "present-task-4",
      stepNumber: 3,
      title: "Stage 4: Habit or right now?",
      icon: "↔️",
      taskStageId: "present-stage-contrast",
      focusOnFormTriggerIds: ["present-trigger-habit-vs-now"],
      explanation: `
        <h3>The present tense usually describes routine, not every current action</h3>
        <p>When learners overuse the present for “right now,” communication gets blurry.</p>
      `,
      decisionMap: {
        title: "Routine or happening now?",
        prompt: "Choose the sentence shape that fits the time meaning, not just the verb you know best.",
        options: [
          {
            label: "Routine",
            cue: "every day, usually, on Mondays, after work",
            outcome: "Use simple present to describe habits and repeated actions.",
            example: "Trabajo cada día. Desayuno a las siete.",
            color: "sky",
          },
          {
            label: "Right now",
            cue: "at this moment, currently, look, right now",
            outcome: "A progressive form may be clearer than simple present.",
            example: "Estoy trabajando ahora. Estoy desayunando.",
            color: "amber",
          },
        ],
      },
      microStories: [
        {
          title: "Same verb, different time meaning",
          lines: [
            { text: "Sara trabaja en una clínica.", callout: "This sounds like routine or a stable fact." },
            { text: "Ahora Sara está trabajando.", callout: "This zooms into the current moment." },
            { text: "Cada mañana desayuna a las siete.", callout: "Habit." },
            { text: "No puede hablar; está desayunando.", callout: "Right-now action." },
          ],
        },
      ],
      repairStacks: [
        {
          title: "Do not force a routine reading onto a right-now situation",
          incorrect: "Ahora trabajo, no puedo hablar. (when you need to stress the live action)",
          corrected: "Ahora estoy trabajando, no puedo hablar.",
          whyItWorks: "The context highlights an action in progress, so the repair makes the current-time meaning easier to hear.",
        },
      ],
      comparison: {
        title: "Routine vs right now",
        leftLabel: "Routine / habit",
        rightLabel: "Right now",
        rows: [
          { label: "work", left: "Trabajo cada día.", right: "Estoy trabajando ahora." },
          { label: "eat", left: "Desayuno a las siete.", right: "Estoy desayunando." },
        ],
      },
      exercises: [
        {
          id: "present-stage-4",
          title: "Choose the better sentence for the context",
          instructions: "Pick the sentence that matches routine or right-now meaning.",
          items: [
            {
              type: "radio",
              label: "You mean: I eat breakfast every day.",
              options: [
                { value: "simple", label: "Desayuno cada día." },
                { value: "prog", label: "Estoy desayunando cada día." },
              ],
              expectedAnswer: "simple",
            },
            {
              type: "radio",
              label: "You mean: right now I am studying.",
              options: [
                { value: "simple", label: "Estudio ahora." },
                { value: "prog", label: "Estoy estudiando ahora." },
              ],
              expectedAnswer: "prog",
            },
          ],
        },
      ],
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: describe your daily life clearly",
    questions: [
      {
        id: "present-cq1",
        question: "Best sentence for a daily routine:",
        options: [
          { value: "a", label: "Trabajo en una escuela." },
          { value: "b", label: "Trabajo una escuela." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-routine-description",
        failureReasonTag: "present-ending-choice",
      },
      {
        id: "present-cq2",
        question: "Correct yo form of vivir:",
        options: [
          { value: "a", label: "vivo" },
          { value: "b", label: "vive" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-self-intro",
        failureReasonTag: "present-ending-choice",
      },
      {
        id: "present-cq3",
        question: "Best form for identity:",
        options: [
          { value: "a", label: "Soy estudiante." },
          { value: "b", label: "Estoy estudiante." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-identity",
        failureReasonTag: "common-irregular-choice",
      },
      {
        id: "present-cq4",
        question: "Best form for possession:",
        options: [
          { value: "a", label: "Tengo dos trabajos." },
          { value: "b", label: "Teno dos trabajos." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-possession",
        failureReasonTag: "common-irregular-choice",
      },
      {
        id: "present-cq5",
        question: "Choose the sentence for a routine, not right now:",
        options: [
          { value: "a", label: "Camino al trabajo cada día." },
          { value: "b", label: "Estoy caminando al trabajo cada día." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-routine-vs-now",
        failureReasonTag: "habit-vs-now",
      },
      {
        id: "present-cq6",
        question: "Choose the sentence for right now:",
        options: [
          { value: "a", label: "Estoy estudiando ahora." },
          { value: "b", label: "Estudio ahora mismo cada día." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "present-routine-vs-now",
        failureReasonTag: "habit-vs-now",
      },
    ],
  },
};
