import type { InteractiveGuideContent } from "@/types/activity";

export const spanishTravelConversationsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  canDo: [
    "check in and explain a basic travel need",
    "ask for directions and follow a short route",
    "ask for help in a travel problem without switching to English immediately",
  ],
  taskScenario: {
    title: "Llegas a una ciudad nueva y todo depende de ti",
    summary:
      "Tu maleta tarda, tienes que hacer el check-in del hotel y luego pedir direcciones para llegar a una farmacia. El objetivo no es memorizar listas: es resolver el viaje.",
    learnerRole: "Viajera/o independiente que necesita manejar interacciones reales.",
    outcome: "Completas interacciones clave con frases claras, corteses y comprensibles.",
    successCriteria: [
      "Pides ayuda con una necesidad concreta.",
      "Usas una forma cortés cuando corresponde.",
      "Entiendes y respondes a información básica de ubicación o servicio.",
    ],
  },
  inputMaterials: [
    {
      id: "travel-arrival-board",
      title: "Panel de llegada",
      kind: "transit-board",
      prompt: "Lee la información que aparece justo después de aterrizar.",
      content: `
        <ul>
          <li><strong>Equipaje:</strong> cinta 7</li>
          <li><strong>Información:</strong> puerta 3</li>
          <li><strong>Taxi oficial:</strong> salida principal</li>
        </ul>
      `,
    },
    {
      id: "travel-hotel-dialogue",
      title: "Recepción del hotel",
      kind: "dialogue",
      prompt: "Fíjate en cómo la viajera explica su necesidad y hace una petición cortés.",
      content: `
        <p><strong>Recepcionista:</strong> Buenas tardes. ¿En qué puedo ayudarle?</p>
        <p><strong>Viajera:</strong> Hola, tengo una reserva a nombre de Reed. También quisiera una habitación tranquila, si es posible.</p>
        <p><strong>Recepcionista:</strong> Claro. Pase por aquí y firme, por favor.</p>
      `,
    },
    {
      id: "travel-directions-dialogue",
      title: "Pedir direcciones",
      kind: "dialogue",
      prompt: "Observa cómo se pregunta y cómo se confirma la información.",
      content: `
        <p><strong>Viajera:</strong> Disculpe, ¿cómo llego a la farmacia más cercana?</p>
        <p><strong>Local:</strong> Siga recto dos cuadras y gire a la derecha. Está al lado del banco.</p>
        <p><strong>Viajera:</strong> Entonces, recto dos cuadras y después a la derecha. Gracias.</p>
      `,
    },
    {
      id: "travel-check-in-slip",
      title: "Tarjeta de check-in",
      kind: "check-in-slip",
      content: `
        <ul>
          <li>Nombre: Reed</li>
          <li>Noches: 3</li>
          <li>Habitación: doble</li>
          <li>Petición especial: tranquila</li>
        </ul>
      `,
    },
  ],
  taskStages: [
    {
      id: "travel-stage-airport",
      title: "Pide ayuda en el aeropuerto",
      goal: "Encontrar un lugar o resolver una necesidad inmediata al llegar.",
      prompt:
        "Responde como si estuvieras en el aeropuerto. Debes preguntar por un lugar o por tu equipaje usando una frase clara y útil.",
      expectedOutput: "short-response",
      completionMode: "mastery",
      successCriteria: [
        "Incluyes la necesidad principal.",
        "Usas vocabulario útil del aeropuerto.",
      ],
    },
    {
      id: "travel-stage-hotel",
      title: "Haz el check-in y formula una petición cortés",
      goal: "Explicar tu reserva y pedir algo adicional con cortesía.",
      prompt:
        "Habla con recepción: confirma tu reserva y añade una petición concreta sin sonar brusca.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
      successCriteria: [
        "Mencionas la reserva.",
        "La petición suena cortés.",
      ],
    },
    {
      id: "travel-stage-directions",
      title: "Pide y confirma direcciones",
      goal: "Entender una ruta breve y demostrar que la entendiste.",
      prompt:
        "Pregunta cómo llegar a un lugar y luego confirma la ruta con tus propias palabras.",
      expectedOutput: "multi-step",
      completionMode: "mastery",
      successCriteria: [
        "Preguntas por el destino correcto.",
        "Repites la ruta de forma comprensible.",
      ],
    },
    {
      id: "travel-stage-help",
      title: "Pide ayuda en un problema de viaje",
      goal: "Expresar una urgencia básica y pedir apoyo apropiado.",
      prompt:
        "Responde como si necesitaras ayuda en una farmacia o en una situación urgente durante el viaje.",
      expectedOutput: "short-response",
      completionMode: "mastery",
      successCriteria: [
        "La necesidad queda clara.",
        "Seleccionas la frase más útil para el contexto.",
      ],
    },
  ],
  focusOnFormTriggers: [
    {
      id: "travel-trigger-polite-request",
      stageId: "travel-stage-hotel",
      triggerType: "politeness",
      detectedIssue: "La petición suena demasiado directa para recepción.",
      microExplanation:
        "En servicios y viajes, conviene suavizar la petición con quisiera, podría o por favor.",
      contrastExamples: [
        "Directo: Necesito una toalla extra.",
        "Más natural: ¿Podría traer una toalla extra, por favor?",
      ],
      repairPrompt: "Reformula la petición para que suene cortés y profesional.",
      referenceLabel: "Cortesía en servicios",
    },
    {
      id: "travel-trigger-location-question",
      stageId: "travel-stage-airport",
      triggerType: "comprehension",
      detectedIssue: "Falta la estructura para preguntar por ubicación.",
      microExplanation:
        "Para encontrar lugares, la base más útil es ¿Dónde está...? o ¿Dónde reclamo...?.",
      contrastExamples: [
        "¿Dónde está la puerta de embarque?",
        "¿Dónde reclamo mi equipaje?",
      ],
      repairPrompt: "Vuelve a intentarlo usando una pregunta clara de ubicación.",
    },
    {
      id: "travel-trigger-directions-repair",
      stageId: "travel-stage-directions",
      triggerType: "repair",
      detectedIssue: "La ruta no quedó confirmada con claridad.",
      microExplanation:
        "Después de escuchar direcciones, confirmar con entonces + ruta breve ayuda a evitar errores.",
      contrastExamples: [
        "Modelo: Entonces, recto dos cuadras y después a la derecha.",
      ],
      repairPrompt: "Repite la ruta en una frase corta para mostrar que la entendiste.",
    },
    {
      id: "travel-trigger-help-choice",
      stageId: "travel-stage-help",
      triggerType: "word-choice",
      detectedIssue: "La frase elegida no resuelve la urgencia específica.",
      microExplanation:
        "En un problema real, prioriza frases con la necesidad exacta: ayuda, hospital, farmacia, dolor.",
      contrastExamples: [
        "Útil: Necesito ayuda.",
        "Útil: Necesito algo para el dolor de cabeza.",
      ],
      repairPrompt: "Elige o escribe la frase que mejor resuelve el problema concreto.",
    },
  ],
  sections: [
    {
      id: "travel-airport-task",
      title: "Stage 1: Llegada y aeropuerto",
      icon: "🛬",
      taskStageId: "travel-stage-airport",
      inputMaterialIds: ["travel-arrival-board"],
      explanation: `
        <h3>Empieza por la necesidad, no por la regla</h3>
        <p>Acabas de llegar. Tu objetivo es pedir ubicación o ayuda inmediata. En esta etapa, importa que la pregunta sea clara y funcional.</p>
      `,
      sceneCards: [
        {
          title: "Aterrizas y necesitas actuar rápido",
          setting: "Aeropuerto",
          goal: "Formar una pregunta de ubicación que un empleado pueda contestar de inmediato.",
          details: [
            "Tu maleta no aparece.",
            "Ves información, equipaje y taxi oficial en el panel.",
          ],
          usefulPhrases: ["¿Dónde está...?", "¿Dónde reclamo mi equipaje?", "Necesito ayuda."],
        },
      ],
      usageMeanings: [
        {
          title: "Frases de supervivencia inmediata",
          description: "Sirven para encontrar lugares o servicios al momento.",
          examples: [
            { sentence: "<strong>¿Dónde está la puerta de embarque?</strong>", explanation: "Pregunta directa para encontrar un lugar." },
            { sentence: "<strong>¿Dónde reclamo mi equipaje?</strong>", explanation: "Muy útil si tu problema es la maleta." },
          ],
        },
      ],
      focusOnFormTriggerIds: ["travel-trigger-location-question"],
      exercises: [
        {
          id: "travel-stage-airport-ex1",
          title: "Primera respuesta en el aeropuerto",
          instructions: "Responde según la necesidad real del viaje.",
          items: [
            {
              type: "radio",
              label: "Quieres encontrar tu puerta:",
              options: [
                { value: "gate", label: "¿Dónde está la puerta de embarque?" },
                { value: "bathroom", label: "¿Dónde está el baño?" },
              ],
              expectedAnswer: "gate",
            },
            {
              type: "text",
              label: "Tu maleta no aparece. Completa la pregunta: ¿Dónde ___ mi equipaje?",
              correctAnswer: "reclamo",
              expectedAnswers: ["reclamo"],
            },
          ],
        },
      ],
      postTaskReflection: {
        title: "Después del primer intento",
        prompt: "Comprueba si tu pregunta nombra la necesidad exacta y si un empleado podría ayudarte sin pedir más aclaraciones.",
        checklist: ["¿La pregunta empieza con dónde?", "¿El lugar o problema queda claro?"],
      },
    },
    {
      id: "travel-hotel-task",
      stepNumber: 1,
      title: "Stage 2: Check-in y petición cortés",
      icon: "🏨",
      taskStageId: "travel-stage-hotel",
      explanation: `
        <h3>En recepción, la cortesía cambia el resultado</h3>
        <p>La interacción funciona mejor si primero confirmas la reserva y luego formulas la petición con un tono amable.</p>
      `,
      inputMaterialIds: ["travel-hotel-dialogue", "travel-check-in-slip"],
      decisionMap: {
        title: "Check-in: ¿qué necesitas decir primero?",
        prompt: "Ordena la interacción para que recepción pueda ayudarte sin fricción.",
        options: [
          {
            label: "Paso 1",
            cue: "Confirma la reserva",
            outcome: "Abre con la información básica del hotel.",
            example: "Tengo una reserva a nombre de Reed.",
            color: "sky",
          },
          {
            label: "Paso 2",
            cue: "Añade la petición",
            outcome: "Usa una forma cortés para pedir algo extra.",
            example: "Quisiera una habitación tranquila, por favor.",
            color: "emerald",
          },
        ],
      },
      repairStacks: [
        {
          title: "Petición brusca vs petición útil",
          incorrect: "Necesito una habitación tranquila. Tráigame toallas.",
          corrected: "Tengo una reserva. Quisiera una habitación tranquila y una toalla extra, por favor.",
          whyItWorks: "La reparación mantiene el orden de la tarea y suaviza la petición para un contexto de servicio.",
        },
      ],
      focusOnFormTriggerIds: ["travel-trigger-polite-request"],
      tipBox: {
        title: "Patrón útil",
        content: "Tengo una reserva... + Quisiera / ¿Podría...?, por favor.",
      },
      exercises: [
        {
          id: "travel-stage-hotel-ex1",
          title: "Check-in útil y natural",
          instructions: "Elige o completa la respuesta que sí sirve en recepción.",
          items: [
            {
              type: "radio",
              label: "Para empezar el check-in:",
              options: [
                { value: "reservation", label: "Tengo una reserva." },
                { value: "price", label: "¿Cuánto cuesta?" },
              ],
              expectedAnswer: "reservation",
            },
            {
              type: "radio",
              label: "Necesitas una toalla extra:",
              options: [
                { value: "polite", label: "¿Podría traer una toalla extra, por favor?" },
                { value: "direct", label: "Tráigame una toalla." },
              ],
              expectedAnswer: "polite",
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Revisa si tu petición suena apropiada para una persona de servicio y si mantienes la interacción clara en dos pasos: reserva + petición.",
      },
    },
    {
      id: "travel-directions-task",
      stepNumber: 2,
      title: "Stage 3: Pedir y confirmar direcciones",
      icon: "🧭",
      taskStageId: "travel-stage-directions",
      inputMaterialIds: ["travel-directions-dialogue"],
      explanation: `
        <h3>No basta con preguntar: confirma la ruta</h3>
        <p>En una tarea real, pedir direcciones y luego repetir la ruta reduce errores y demuestra comprensión.</p>
      `,
      timeline: {
        title: "Ruta escuchada",
        description: "La confirmación funciona mejor cuando repites la ruta en el mismo orden.",
        events: [
          { label: "siga recto", order: 1, tenseLabel: "paso 1" },
          { label: "dos cuadras", order: 2, tenseLabel: "paso 2" },
          { label: "gire a la derecha", order: 3, tenseLabel: "paso 3" },
          { label: "al lado del banco", order: 4, tenseLabel: "referencia" },
        ],
      },
      microStories: [
        {
          title: "Escuchar y confirmar",
          lines: [
            { text: "Disculpe, ¿cómo llego a la farmacia?", callout: "Pregunta clara." },
            { text: "Siga recto dos cuadras y gire a la derecha.", callout: "Ruta base." },
            { text: "Entonces, recto dos cuadras y después a la derecha.", callout: "La confirmación reduce el riesgo de perderte." },
          ],
        },
      ],
      focusOnFormTriggerIds: ["travel-trigger-directions-repair"],
      exercises: [
        {
          id: "travel-stage-directions-ex1",
          title: "Direcciones que sí te llevan al lugar",
          instructions: "Primero interpreta, luego confirma.",
          items: [
            {
              type: "radio",
              label: "“Siga recto” significa:",
              options: [
                { value: "straight", label: "Go straight" },
                { value: "left", label: "Turn left" },
              ],
              expectedAnswer: "straight",
            },
            {
              type: "text",
              label: "Completa la confirmación: Entonces, recto dos cuadras y después a la ___.",
              correctAnswer: "derecha",
              expectedAnswers: ["derecha"],
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Piensa si tu confirmación muestra que entendiste la ruta completa y no solo una palabra aislada.",
      },
    },
    {
      id: "travel-help-task",
      stepNumber: 3,
      title: "Stage 4: Problemas y ayuda básica",
      icon: "🆘",
      taskStageId: "travel-stage-help",
      explanation: `
        <h3>Cuando hay un problema, la prioridad es ser clara/o</h3>
        <p>En urgencias leves o en la farmacia, conviene nombrar el problema con precisión para conseguir ayuda rápida.</p>
      `,
      phraseBank: {
        title: "Frases de ayuda urgente",
        groups: [
          {
            label: "Buscar ayuda",
            phrases: ["Necesito ayuda.", "Necesito una farmacia.", "Necesito algo para el dolor."],
          },
          {
            label: "Explicar el problema",
            phrases: ["Me duele la cabeza.", "Perdí mi equipaje.", "No entiendo la dirección."],
          },
        ],
      },
      focusOnFormTriggerIds: ["travel-trigger-help-choice"],
      exercises: [
        {
          id: "travel-stage-help-ex1",
          title: "Resuelve el problema correcto",
          instructions: "Elige la frase que realmente sirve para la situación.",
          items: [
            {
              type: "radio",
              label: "Necesitas ayuda urgente:",
              options: [
                { value: "help", label: "¡Necesito ayuda!" },
                { value: "price", label: "¿Cuánto cuesta?" },
              ],
              expectedAnswer: "help",
            },
            {
              type: "radio",
              label: "En la farmacia tienes dolor de cabeza:",
              options: [
                { value: "headache", label: "Necesito algo para el dolor de cabeza." },
                { value: "hotel", label: "¿Dónde está el hotel?" },
              ],
              expectedAnswer: "headache",
            },
          ],
        },
      ],
      postTaskReflection: {
        prompt: "Comprueba si la frase elegida resuelve la necesidad concreta sin añadir información irrelevante.",
      },
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint: Resolver un viaje corto en español",
    description:
      "Demuestra que puedes interpretar el contexto y elegir o producir la frase útil, no solo reconocer vocabulario aislado.",
    questions: [
      {
        id: "travel-cq1",
        question: "Llegas tarde al hotel. ¿Cuál es la mejor apertura para empezar el check-in?",
        options: [
          { value: "a", label: "Tengo una reserva a nombre de Reed." },
          { value: "b", label: "¿Dónde está la farmacia?" },
        ],
        correctAnswer: "a",
        explanation: "Empiezas con la tarea principal del momento: confirmar la reserva.",
        topic: "hotel-check-in",
        skill: "usage",
        skillTag: "travel-hotel-open",
      },
      {
        id: "travel-cq2",
        question: "Quieres sonar más cortés en recepción. ¿Qué opción funciona mejor?",
        options: [
          { value: "a", label: "Quisiera una habitación tranquila, por favor." },
          { value: "b", label: "Dame una habitación tranquila." },
        ],
        correctAnswer: "a",
        explanation: "Quisiera suaviza la petición y encaja mejor en el contexto.",
        topic: "politeness",
        skill: "repair",
        skillTag: "travel-polite-request",
      },
      {
        id: "travel-cq3",
        question: "Te dicen: “Siga recto dos cuadras y gire a la derecha”. ¿Qué confirmación muestra comprensión?",
        options: [
          { value: "a", label: "Entonces, recto dos cuadras y después a la derecha." },
          { value: "b", label: "Gracias, tengo una reserva." },
        ],
        correctAnswer: "a",
        explanation: "La mejor respuesta reutiliza la ruta para comprobarla.",
        topic: "directions",
        skill: "production",
        skillTag: "travel-confirm-route",
      },
      {
        id: "travel-cq4",
        question: "No encuentras tu maleta. ¿Qué pregunta sirve de verdad?",
        options: [
          { value: "a", label: "¿Dónde reclamo mi equipaje?" },
          { value: "b", label: "¿A qué hora es el desayuno?" },
        ],
        correctAnswer: "a",
        explanation: "La pregunta nombra el problema exacto del viaje.",
        topic: "airport",
        skill: "usage",
        skillTag: "travel-baggage-help",
      },
      {
        id: "travel-cq5",
        question: "En la farmacia necesitas algo para un dolor de cabeza. ¿Cuál eliges?",
        options: [
          { value: "a", label: "Necesito algo para el dolor de cabeza." },
          { value: "b", label: "Llame a la policía." },
        ],
        correctAnswer: "a",
        explanation: "La frase precisa acelera la ayuda.",
        topic: "pharmacy",
        skill: "usage",
        skillTag: "travel-pharmacy-need",
      },
      {
        id: "travel-cq6",
        question: "¿Qué habilidad central practica esta guía?",
        options: [
          { value: "a", label: "Resolver interacciones de viaje con apoyo lingüístico puntual" },
          { value: "b", label: "Memorizar listas sin contexto" },
        ],
        correctAnswer: "a",
        explanation: "La guía está organizada alrededor de tareas reales de viaje.",
        topic: "course-design",
        skill: "recognition",
        skillTag: "travel-task-first-purpose",
      },
    ],
  },
};
