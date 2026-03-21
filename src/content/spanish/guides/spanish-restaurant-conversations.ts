import type { InteractiveGuideContent } from "@/types/activity";

export const spanishRestaurantConversationsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "ask for a table and menu",
    "order food politely",
    "handle a basic restaurant problem and pay the bill",
  ],
  taskScenario: {
    title: "Handle a full restaurant interaction",
    summary:
      "You arrive, ask for a table, check the menu, order, solve one small problem, and ask for the bill.",
    learnerRole: "Traveler or diner managing a meal without switching to English.",
    outcome: "You can move through the whole restaurant interaction with clear, polite Spanish.",
  },
  inputMaterials: [
    {
      id: "rest-host-dialogue",
      title: "At the entrance",
      kind: "dialogue",
      content: `
        <p><strong>Cliente:</strong> Buenas tardes. ¿Tienen mesa para dos?</p>
        <p><strong>Mesero:</strong> Sí, pasen por aquí.</p>
      `,
    },
    {
      id: "rest-menu-audio",
      title: "Server recommendation transcript",
      kind: "audio-transcript",
      prompt: "This is the speaking/listening pilot for a service interaction.",
      content: `
        <p>Hoy recomiendo la sopa del día y el pollo con arroz. Si quiere algo sin carne, tenemos una ensalada grande y tacos de verduras.</p>
      `,
    },
    {
      id: "rest-bill-note",
      title: "End of meal exchange",
      kind: "dialogue",
      content: `
        <p><strong>Cliente:</strong> La cuenta, por favor.</p>
        <p><strong>Mesero:</strong> Claro. ¿Todo estuvo bien?</p>
      `,
    },
  ],
  taskStages: [
    {
      id: "rest-stage-arrive",
      title: "Get a table",
      goal: "Open the interaction politely and ask for a table.",
      prompt: "Respond as if you have just arrived and need a table.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
    {
      id: "rest-stage-order",
      title: "Ask about the menu and order",
      goal: "Understand the recommendation and choose a polite ordering phrase.",
      prompt: "Use the input to ask about a dish or place an order naturally.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
    },
    {
      id: "rest-stage-problem",
      title: "Handle one small problem",
      goal: "Make a request or clarify a need without sounding abrupt.",
      prompt: "Ask for a change, recommendation, or help with the meal.",
      expectedOutput: "short-response",
      completionMode: "mastery",
    },
    {
      id: "rest-stage-bill",
      title: "Close the meal",
      goal: "Ask for the bill and respond to a closing question.",
      prompt: "Finish the interaction politely.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "rest-trigger-politeness",
      stageId: "rest-stage-order",
      triggerType: "politeness",
      failureReasonTag: "request-softening",
      detectedIssue: "The order is understandable but too blunt for a restaurant context.",
      microExplanation: "Restaurant Spanish usually sounds better with quisiera, me puede traer, or por favor.",
      contrastExamples: ["Blunt: Dame tacos.", "Better: Quisiera los tacos, por favor."],
      repairPrompt: "Revise the order so it sounds like a polite customer request.",
    },
    {
      id: "rest-trigger-listening",
      stageId: "rest-stage-order",
      triggerType: "comprehension",
      failureReasonTag: "menu-recommendation-comprehension",
      detectedIssue: "The learner did not extract the useful information from the recommendation.",
      microExplanation: "Focus on the offered dishes and any special constraint like sin carne.",
      contrastExamples: [
        "Hoy recomiendo la sopa del día.",
        "Si quiere algo sin carne, tenemos tacos de verduras.",
      ],
      repairPrompt: "Use the recommendation to choose or ask about the most relevant dish.",
    },
    {
      id: "rest-trigger-problem",
      stageId: "rest-stage-problem",
      triggerType: "repair",
      failureReasonTag: "restaurant-help-request",
      detectedIssue: "The request does not clearly state the problem or need.",
      microExplanation: "A useful restaurant repair request names the need directly: otra mesa, sin carne, agua, recomendación, la cuenta.",
      contrastExamples: ["¿Me puede traer agua, por favor?", "¿Qué me recomienda?"],
      repairPrompt: "Rewrite the request so the server knows what action to take.",
    },
  ],
  sections: [
    {
      id: "rest-task-1",
      title: "Stage 1: Get a table",
      icon: "🍽️",
      taskStageId: "rest-stage-arrive",
      inputMaterialIds: ["rest-host-dialogue"],
      explanation: `
        <h3>Start with a greeting and the table request</h3>
        <p>The opening sets the tone for the whole interaction.</p>
      `,
      exercises: [
        {
          id: "rest-stage-1",
          title: "Open the interaction",
          instructions: "Choose the phrase that gets the table politely.",
          items: [
            {
              type: "radio",
              label: "You need a table for two:",
              options: [
                { value: "a", label: "Buenas tardes. ¿Tienen mesa para dos?" },
                { value: "b", label: "Mesa dos." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Complete: Una ___ para uno, por favor.",
              correctAnswer: "mesa",
              expectedAnswers: ["mesa"],
            },
          ],
        },
      ],
    },
    {
      id: "rest-task-2",
      stepNumber: 1,
      title: "Stage 2: Listen, ask, and order",
      icon: "📖",
      taskStageId: "rest-stage-order",
      inputMaterialIds: ["rest-menu-audio"],
      focusOnFormTriggerIds: ["rest-trigger-listening", "rest-trigger-politeness"],
      explanation: `
        <h3>Use the recommendation before you answer</h3>
        <p>This stage combines listening/reading and polite ordering so the response is tied to real input.</p>
      `,
      exercises: [
        {
          id: "rest-stage-2",
          title: "Order from the recommendation",
          instructions: "Choose the option that uses the input and sounds natural.",
          items: [
            {
              type: "radio",
              label: "You want the soup of the day:",
              options: [
                { value: "a", label: "Quisiera la sopa del día, por favor." },
                { value: "b", label: "Dame sopa." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "You need something without meat:",
              options: [
                { value: "a", label: "¿Tienen algo sin carne?" },
                { value: "b", label: "¿Qué hora es?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "rest-task-3",
      stepNumber: 2,
      title: "Stage 3: Solve a small problem",
      icon: "🛠️",
      taskStageId: "rest-stage-problem",
      focusOnFormTriggerIds: ["rest-trigger-problem"],
      explanation: `
        <h3>Real restaurant Spanish is not just ordering</h3>
        <p>You often need to ask for help, a change, or a recommendation mid-meal.</p>
      `,
      exercises: [
        {
          id: "rest-stage-3",
          title: "Make the request clear",
          instructions: "Pick the phrase that solves the problem.",
          items: [
            {
              type: "radio",
              label: "You want a recommendation:",
              options: [
                { value: "a", label: "¿Qué me recomienda?" },
                { value: "b", label: "La cuenta, por favor." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "You need water:",
              options: [
                { value: "a", label: "¿Me puede traer agua, por favor?" },
                { value: "b", label: "Agua." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "rest-task-4",
      stepNumber: 3,
      title: "Stage 4: Ask for the bill and close",
      icon: "🧾",
      taskStageId: "rest-stage-bill",
      inputMaterialIds: ["rest-bill-note"],
      explanation: `
        <h3>End the meal cleanly</h3>
        <p>The closing interaction is short, but it still needs a clear request and a natural response.</p>
      `,
      exercises: [
        {
          id: "rest-stage-4",
          title: "Close the interaction",
          instructions: "Choose the line that fits the end of the meal.",
          items: [
            {
              type: "radio",
              label: "You want the bill:",
              options: [
                { value: "a", label: "La cuenta, por favor." },
                { value: "b", label: "¿Dónde está el hospital?" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The server asks: ¿Todo estuvo bien?",
              options: [
                { value: "a", label: "Sí, gracias." },
                { value: "b", label: "Mesa para dos." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Check whether your restaurant interaction moves from arrival to bill without abrupt jumps or unclear requests.",
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: complete a restaurant interaction",
    questions: [
      {
        id: "rest-cq1",
        question: "Best opening for a table request:",
        options: [
          { value: "a", label: "Buenas tardes. ¿Tienen mesa para dos?" },
          { value: "b", label: "Mesa, dos." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-arrival",
        failureReasonTag: "restaurant-help-request",
      },
      {
        id: "rest-cq2",
        question: "Best polite order:",
        options: [
          { value: "a", label: "Quisiera la sopa del día, por favor." },
          { value: "b", label: "Dame la sopa." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-ordering",
        failureReasonTag: "request-softening",
      },
      {
        id: "rest-cq3",
        question: "Best question for a meat-free option:",
        options: [
          { value: "a", label: "¿Tienen algo sin carne?" },
          { value: "b", label: "¿Qué hora es?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-menu-comprehension",
        failureReasonTag: "menu-recommendation-comprehension",
      },
      {
        id: "rest-cq4",
        question: "Best mid-meal help request:",
        options: [
          { value: "a", label: "¿Me puede traer agua, por favor?" },
          { value: "b", label: "Agua." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-help-request",
        failureReasonTag: "restaurant-help-request",
      },
      {
        id: "rest-cq5",
        question: "Best phrase for the bill:",
        options: [
          { value: "a", label: "La cuenta, por favor." },
          { value: "b", label: "¿Qué me recomienda?" },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-closing",
        failureReasonTag: "restaurant-help-request",
      },
      {
        id: "rest-cq6",
        question: "Which answer matches a server recommendation for a vegetarian diner?",
        options: [
          { value: "a", label: "Quisiera los tacos de verduras." },
          { value: "b", label: "Quisiera el pollo con arroz." },
        ],
        correctAnswer: "a",
        communicativeGoalTag: "restaurant-menu-comprehension",
        failureReasonTag: "menu-recommendation-comprehension",
      },
    ],
  },
};
