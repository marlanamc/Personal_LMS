import type { InteractiveGuideContent } from "@/types/activity";

export const spanishSerVsEstarContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "describe identity and profession",
    "say where someone is",
    "talk about temporary conditions and feelings",
  ],
  taskScenario: {
    title: "You need to introduce people and explain where/how they are",
    summary:
      "You are meeting new people, describing them, and telling someone where they are and how they feel right now.",
    learnerRole: "Learner managing everyday introductions and check-ins.",
    outcome: "You choose ser for identity and estar for location/temporary condition in practical situations.",
  },
  inputMaterials: [
    {
      id: "ser-estar-dialogue",
      title: "Quick check-in conversation",
      kind: "dialogue",
      content: `
        <p><strong>Ana:</strong> Soy profesora y hoy estoy cansada.</p>
        <p><strong>Leo:</strong> ¿Dónde estás ahora?</p>
        <p><strong>Ana:</strong> Estoy en casa, pero mi oficina es en el centro.</p>
      `,
    },
    {
      id: "ser-estar-profile-card",
      title: "Profile + status card",
      kind: "profile-card",
      content: `
        <ul>
          <li>Marcos - es ingeniero - es de Lima</li>
          <li>Ahora mismo - está en el aeropuerto - está nervioso</li>
        </ul>
      `,
    },
  ],
  taskStages: [
    {
      id: "sve-stage-identity",
      title: "Say who someone is",
      goal: "Use ser for identity, profession, and origin.",
      prompt: "Choose the verb that helps you identify or describe someone in a stable way.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "sve-stage-location-condition",
      title: "Say where someone is and how they feel",
      goal: "Use estar for location and temporary condition.",
      prompt: "Respond to a moment-specific situation using the better be-verb.",
      expectedOutput: "select",
      completionMode: "mastery",
    },
    {
      id: "sve-stage-contrast",
      title: "Repair the meaning when the wrong verb changes the message",
      goal: "Notice how ser and estar shift meaning in context.",
      prompt: "Fix sentences so they communicate the intended meaning.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "sve-trigger-identity",
      stageId: "sve-stage-identity",
      triggerType: "word-choice",
      failureReasonTag: "identity-vs-condition",
      detectedIssue: "The learner is using estar for identity or profession.",
      microExplanation: "If the message is about who someone is, what they do, or where they are from, ser is usually the better choice.",
      contrastExamples: ["Soy profesora.", "Es de México."],
      repairPrompt: "Rewrite the sentence as an identity statement, not a temporary condition.",
    },
    {
      id: "sve-trigger-location",
      stageId: "sve-stage-location-condition",
      triggerType: "word-choice",
      failureReasonTag: "location-vs-identity",
      detectedIssue: "The learner is using ser where the message is about location or temporary state.",
      microExplanation: "Use estar for where someone is and how they are right now.",
      contrastExamples: ["Estoy en casa.", "Estamos cansados."],
      repairPrompt: "Switch to the form that fits location or current condition.",
    },
    {
      id: "sve-trigger-repair",
      stageId: "sve-stage-contrast",
      triggerType: "repair",
      failureReasonTag: "ser-estar-meaning-shift",
      detectedIssue: "The sentence is grammatically close, but the meaning is wrong.",
      microExplanation: "With ser vs estar, a small verb change often creates a big meaning change.",
      contrastExamples: ["Es aburrido. = He/it is boring.", "Está aburrido. = He is bored."],
      repairPrompt: "Repair the sentence so the meaning matches the situation.",
    },
  ],
  sections: [
    {
      id: "sve-task-1",
      title: "Stage 1: Identity, profession, origin",
      icon: "👤",
      taskStageId: "sve-stage-identity",
      inputMaterialIds: ["ser-estar-dialogue"],
      focusOnFormTriggerIds: ["sve-trigger-identity"],
      explanation: `
        <h3>Start with who the person is</h3>
        <p>When the situation is an introduction, profession, or origin, ser usually carries the meaning you need.</p>
      `,
      decisionMap: {
        title: "Which be-verb fits the scene?",
        prompt: "Ask what kind of information the listener needs first.",
        options: [
          {
            label: "Identity",
            cue: "name, profession, origin, basic description",
            outcome: "Use ser to define who the person is.",
            example: "Soy profesora. Es de México.",
            color: "sky",
          },
          {
            label: "Location",
            cue: "where someone is right now",
            outcome: "Use estar to place the person in a space.",
            example: "Estoy en casa. Estamos en clase.",
            color: "emerald",
          },
          {
            label: "Condition",
            cue: "feeling, mood, temporary state",
            outcome: "Use estar to describe the current condition.",
            example: "Está cansado. Estoy lista.",
            color: "amber",
          },
        ],
      },
      sceneCards: [
        {
          title: "Introductions at a language exchange",
          setting: "Stable facts",
          goal: "Say who the person is in a way that will still be true after the conversation.",
          details: [
            "You are meeting Lucia for the first time.",
            "You need her job, origin, and one core description.",
          ],
          usefulPhrases: ["Soy estudiante.", "Es de Chile.", "Somos vecinos."],
        },
      ],
      phraseBank: {
        title: "High-frequency identity chunks",
        groups: [
          {
            label: "Introduce yourself",
            phrases: ["Soy estudiante.", "Soy de Boston.", "Soy profesora."],
          },
          {
            label: "Ask back",
            phrases: ["¿Y tú?", "¿De dónde eres?", "¿Qué haces?"],
          },
        ],
      },
      exercises: [
        {
          id: "sve-stage-1",
          title: "Identity check",
          instructions: "Choose the form that fits identity or profession.",
          items: [
            {
              type: "radio",
              label: "I am a teacher.",
              options: [
                { value: "ser", label: "Soy profesor/a." },
                { value: "estar", label: "Estoy profesor/a." },
              ],
              expectedAnswer: "ser",
            },
            {
              type: "radio",
              label: "She is from Colombia.",
              options: [
                { value: "ser", label: "Es de Colombia." },
                { value: "estar", label: "Está de Colombia." },
              ],
              expectedAnswer: "ser",
            },
          ],
        },
      ],
    },
    {
      id: "sve-task-2",
      stepNumber: 1,
      title: "Stage 2: Location and temporary condition",
      icon: "📍",
      taskStageId: "sve-stage-location-condition",
      focusOnFormTriggerIds: ["sve-trigger-location"],
      explanation: `
        <h3>Now shift to the current moment</h3>
        <p>If the message is about where someone is or how they feel right now, estar does the job better.</p>
      `,
      sceneCards: [
        {
          title: "Live location update",
          setting: "Right now",
          goal: "Tell a friend where everyone is before class starts.",
          details: [
            "Ana está en la biblioteca.",
            "Luis está en el autobús.",
            "Tú estás cansado pero listo.",
          ],
          usefulPhrases: ["¿Dónde estás?", "Estoy aquí.", "Estamos atrasados."],
        },
      ],
      repairStacks: [
        {
          title: "Do not turn location into identity",
          incorrect: "Soy en casa.",
          corrected: "Estoy en casa.",
          whyItWorks: "The sentence is about current location, so estar carries the meaning the listener expects.",
        },
      ],
      exercises: [
        {
          id: "sve-stage-2",
          title: "Right-now meaning",
          instructions: "Choose the form that fits location or current condition.",
          items: [
            {
              type: "radio",
              label: "Where are you?",
              options: [
                { value: "ser", label: "¿Dónde eres?" },
                { value: "estar", label: "¿Dónde estás?" },
              ],
              expectedAnswer: "estar",
            },
            {
              type: "radio",
              label: "I am tired right now.",
              options: [
                { value: "ser", label: "Soy cansado/a." },
                { value: "estar", label: "Estoy cansado/a." },
              ],
              expectedAnswer: "estar",
            },
          ],
        },
      ],
    },
    {
      id: "sve-task-3",
      stepNumber: 2,
      title: "Stage 3: Repair the meaning",
      icon: "🔀",
      taskStageId: "sve-stage-contrast",
      focusOnFormTriggerIds: ["sve-trigger-repair"],
      explanation: `
        <h3>The wrong verb can change the message</h3>
        <p>In real conversation, this is not just a grammar issue. It changes what the listener understands.</p>
      `,
      comparison: {
        title: "Meaning shift",
        leftLabel: "ser",
        rightLabel: "estar",
        rows: [
          { label: "boring / bored", left: "Es aburrido.", right: "Está aburrido." },
          { label: "smart / ready", left: "Es listo.", right: "Está listo." },
        ],
      },
      microStories: [
        {
          title: "One verb, two different messages",
          lines: [
            { text: "Mateo es aburrido.", callout: "He causes boredom. This sounds like part of his character." },
            { text: "Mateo está aburrido.", callout: "He feels bored now. This is temporary." },
            { text: "La profesora es lista.", callout: "She is clever." },
            { text: "La profesora está lista.", callout: "She is ready right now." },
          ],
        },
      ],
      repairStacks: [
        {
          title: "Repair the meaning, not just the grammar",
          incorrect: "La clase está aburrida. (when you mean the class is boring)",
          corrected: "La clase es aburrida.",
          whyItWorks: "Ser describes the class as boring in general. Estar would sound like the class is temporarily bored.",
        },
      ],
      exercises: [
        {
          id: "sve-stage-3",
          title: "Meaning repair",
          instructions: "Choose the sentence that matches the intended meaning.",
          items: [
            {
              type: "radio",
              label: "You mean: He is bored.",
              options: [
                { value: "estar", label: "Está aburrido." },
                { value: "ser", label: "Es aburrido." },
              ],
              expectedAnswer: "estar",
            },
            {
              type: "radio",
              label: "You mean: The class is boring.",
              options: [
                { value: "ser", label: "La clase es aburrida." },
                { value: "estar", label: "La clase está aburrida." },
              ],
              expectedAnswer: "ser",
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether the verb you chose changes identity, location, or condition in the intended way.",
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: choose the be-verb that matches the message",
    questions: [
      {
        id: "sve-cq1",
        question: "Best sentence for profession:",
        options: [
          { value: "a", label: "Soy enfermera." },
          { value: "b", label: "Estoy enfermera." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "ser-identity",
        failureReasonTag: "identity-vs-condition",
      },
      {
        id: "sve-cq2",
        question: "Best sentence for current location:",
        options: [
          { value: "a", label: "Estoy en casa." },
          { value: "b", label: "Soy en casa." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "estar-location",
        failureReasonTag: "location-vs-identity",
      },
      {
        id: "sve-cq3",
        question: "Best sentence for temporary feeling:",
        options: [
          { value: "a", label: "Estoy cansado/a." },
          { value: "b", label: "Soy cansado/a." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "estar-condition",
        failureReasonTag: "location-vs-identity",
      },
      {
        id: "sve-cq4",
        question: "Best sentence for origin:",
        options: [
          { value: "a", label: "Es de Perú." },
          { value: "b", label: "Está de Perú." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "ser-origin",
        failureReasonTag: "identity-vs-condition",
      },
      {
        id: "sve-cq5",
        question: "You mean: he is bored.",
        options: [
          { value: "a", label: "Está aburrido." },
          { value: "b", label: "Es aburrido." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "ser-estar-repair",
        failureReasonTag: "ser-estar-meaning-shift",
      },
      {
        id: "sve-cq6",
        question: "You mean: the movie is boring.",
        options: [
          { value: "a", label: "La película es aburrida." },
          { value: "b", label: "La película está aburrida." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "ser-estar-repair",
        failureReasonTag: "ser-estar-meaning-shift",
      },
    ],
  },
};
