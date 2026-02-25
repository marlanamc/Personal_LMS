import type { InteractiveGuideContent } from "@/types/activity";

export const spanishC1ProductionLabContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "c1lab-intro",
      title: "Laboratorio de producción C1: ensayo breve con revisión por criterios",
      icon: "🧪",
      explanation: `
        <h3>Propósito</h3>
        <p>Este laboratorio consolida producción avanzada con un ciclo completo: planificar, redactar, revisar y mejorar.</p>
        <p>Tarea final: ensayo breve de 220-280 palabras con postura argumentada.</p>
      `,
      exercises: [
        {
          id: "sp-c1lab-1",
          title: "Delimitación de tema",
          instructions: "Selecciona enfoque y audiencia antes de redactar.",
          items: [
            {
              type: "text",
              label: "Tema elegido (1 oración):",
              acceptAnyAttempt: true,
            },
            {
              type: "radio",
              label: "Audiencia principal:",
              options: [
                { value: "a", label: "académica/profesional" },
                { value: "b", label: "general cercana" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "c1lab-estructura",
      stepNumber: 1,
      title: "Estructura argumentativa de alto rendimiento",
      icon: "🏛️",
      explanation: `
        <h3>Arquitectura recomendada</h3>
        <ul>
          <li>Introducción: tesis y marco.</li>
          <li>Desarrollo 1: argumento + evidencia.</li>
          <li>Desarrollo 2: contraargumento + refutación.</li>
          <li>Cierre: síntesis y propuesta.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1lab-2",
          title: "Guion del ensayo",
          instructions: "Escribe una oración por bloque.",
          items: [
            {
              type: "text",
              label: "Tesis central:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Argumento 1 + evidencia:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Contraargumento + refutación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Cierre propositivo:",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c1lab-redaccion",
      stepNumber: 2,
      title: "Redacción del borrador",
      icon: "✍️",
      explanation: `
        <h3>Borrador 1</h3>
        <p>Redacta un texto entre 220 y 280 palabras con conectores de contraste, consecuencia y reformulación.</p>
      `,
      exercises: [
        {
          id: "sp-c1lab-3",
          title: "Borrador completo",
          instructions: "Escribe tu versión inicial sin interrumpir el flujo.",
          items: [
            {
              type: "text",
              label: "Borrador 1 (220-280 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c1lab-rubrica",
      stepNumber: 3,
      title: "Revisión por criterios",
      icon: "📋",
      explanation: `
        <h3>Rúbrica de autoevaluación</h3>
        <ul>
          <li><strong>Coherencia:</strong> progresión lógica y unidad temática.</li>
          <li><strong>Precisión gramatical:</strong> control de tiempos/modos y concordancia.</li>
          <li><strong>Alcance léxico:</strong> variedad y adecuación al registro.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1lab-4",
          title: "Chequeo y versión final",
          instructions: "Evalúa tu texto y produce una versión mejorada.",
          items: [
            {
              type: "text",
              label: "Coherencia (fortaleza + ajuste):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Precisión gramatical (fortaleza + ajuste):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Alcance léxico (fortaleza + ajuste):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final revisada:",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c1lab-q1",
      question: "¿Cuál es el rango de palabras solicitado en este laboratorio?",
      options: [
        { value: "a", label: "120-160" },
        { value: "b", label: "220-280" },
        { value: "c", label: "320-380" },
      ],
      correctAnswer: "b",
      explanation: "El rango objetivo del ensayo es 220-280 palabras.",
    },
    {
      id: "c1lab-q2",
      question: "¿Qué elemento fortalece más una tesis C1?",
      options: [
        { value: "a", label: "Generalidad vaga" },
        { value: "b", label: "Posición precisa y defendible" },
        { value: "c", label: "Opinión sin justificación" },
      ],
      correctAnswer: "b",
      explanation: "La tesis debe ser clara, acotada y argumentable.",
    },
    {
      id: "c1lab-q3",
      question: "¿Qué función cumple el contraargumento?",
      options: [
        { value: "a", label: "Debilitar el texto" },
        { value: "b", label: "Mostrar complejidad y reforzar la posición mediante refutación" },
        { value: "c", label: "Eliminar la tesis" },
      ],
      correctAnswer: "b",
      explanation: "Bien integrado, aumenta credibilidad argumentativa.",
    },
    {
      id: "c1lab-q4",
      question: "¿Cuál criterio evalúa la progresión lógica del texto?",
      options: [
        { value: "a", label: "Coherencia" },
        { value: "b", label: "Ortografía aislada" },
        { value: "c", label: "Longitud" },
      ],
      correctAnswer: "a",
      explanation: "La coherencia mide estructura y continuidad argumental.",
    },
    {
      id: "c1lab-q5",
      question: "En revisión C1, ¿qué implica precisión gramatical?",
      options: [
        { value: "a", label: "Evitar toda subordinación" },
        { value: "b", label: "Control consistente de tiempos, modos y concordancia" },
        { value: "c", label: "Usar solo presente" },
      ],
      correctAnswer: "b",
      explanation: "La precisión incluye control sistemático, no simplificación extrema.",
    },
    {
      id: "c1lab-q6",
      question: "¿Qué mejora el alcance léxico?",
      options: [
        { value: "a", label: "Repetir las mismas palabras clave" },
        { value: "b", label: "Variar léxico con adecuación semántica y de registro" },
        { value: "c", label: "Usar términos técnicos fuera de contexto" },
      ],
      correctAnswer: "b",
      explanation: "La variedad debe ser pertinente, no ornamental.",
    },
    {
      id: "c1lab-q7",
      question: "¿Qué cierre es más sólido en un ensayo C1?",
      options: [
        { value: "a", label: "Repetición literal de la introducción" },
        { value: "b", label: "Síntesis crítica + propuesta viable" },
        { value: "c", label: "Cierre abrupto sin conclusión" },
      ],
      correctAnswer: "b",
      explanation: "Integra evaluación de argumentos y dirección final.",
    },
    {
      id: "c1lab-q8",
      question: "¿Qué error es típico de borrador no revisado?",
      options: [
        { value: "a", label: "Conectores redundantes y saltos de foco" },
        { value: "b", label: "Relación clara entre evidencia y tesis" },
        { value: "c", label: "Registro consistente" },
      ],
      correctAnswer: "a",
      explanation: "La revisión corrige redundancia y ruptura de progresión.",
    },
    {
      id: "c1lab-q9",
      question: "¿Qué práctica mejora más la versión final?",
      options: [
        { value: "a", label: "Editar sin criterios" },
        { value: "b", label: "Revisar con rúbrica y objetivos explícitos" },
        { value: "c", label: "Solo contar palabras" },
      ],
      correctAnswer: "b",
      explanation: "La rúbrica orienta mejoras concretas y medibles.",
    },
    {
      id: "c1lab-q10",
      question: "¿Qué demuestra dominio C1 en este laboratorio?",
      options: [
        { value: "a", label: "Texto largo sin estructura" },
        { value: "b", label: "Argumentación organizada, lenguaje preciso y revisión estratégica" },
        { value: "c", label: "Opiniones sueltas sin evidencia" },
      ],
      correctAnswer: "b",
      explanation: "Ese conjunto de rasgos define desempeño avanzado sostenible.",
    },
  ],
};
