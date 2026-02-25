import type { InteractiveGuideContent } from "@/types/activity";

export const spanishB2IntegratedAssessmentContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "b2eval-intro",
      title: "Evaluación integrada B2",
      icon: "📚",
      explanation: `
        <h3>Meta de desempeño</h3>
        <p>Esta evaluación integra tres tareas: lectura analítica, síntesis de audio y respuesta argumentada.</p>
        <p>Se espera control gramatical, organización discursiva y justificación clara de ideas.</p>
      `,
      exercises: [
        {
          id: "sp-b2eval-1",
          title: "Plan de ejecución",
          instructions: "Selecciona el orden de trabajo y criterio principal de revisión.",
          items: [
            {
              type: "radio",
              label: "¿Qué bloque realizarás primero?",
              options: [
                { value: "a", label: "Lectura analítica" },
                { value: "b", label: "Síntesis de audio" },
                { value: "c", label: "Respuesta argumentada" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "¿Qué revisarás al final?",
              options: [
                { value: "a", label: "Solo ortografía" },
                { value: "b", label: "Coherencia, precisión y evidencia" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "b2eval-lectura",
      stepNumber: 1,
      title: "Bloque 1: Lectura analítica",
      icon: "🔍",
      explanation: `
        <h3>Texto base</h3>
        <p><strong>Texto:</strong> En el último año, varias instituciones educativas han adoptado modelos híbridos para ampliar el acceso. Aunque los resultados iniciales muestran mejoras en participación, los equipos directivos señalan que la implementación exige capacitación continua y criterios comunes de evaluación. Algunos docentes sostienen que la flexibilidad beneficia al alumnado adulto; otros advierten que sin acompañamiento técnico se amplían las brechas.</p>
        <p>Responde con foco en tesis, evidencias y matices.</p>
      `,
      exercises: [
        {
          id: "sp-b2eval-2",
          title: "Comprensión crítica",
          instructions: "Selecciona y redacta respuestas precisas.",
          items: [
            {
              type: "radio",
              label: "¿Cuál es la idea central del texto?",
              options: [
                { value: "a", label: "El modelo híbrido siempre fracasa" },
                { value: "b", label: "El modelo híbrido ofrece oportunidades pero requiere condiciones de implementación" },
                { value: "c", label: "La capacitación docente ya no es necesaria" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Identifica una tensión principal del texto en 1-2 oraciones.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Escribe una inferencia razonable a partir de la información dada.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "b2eval-audio",
      stepNumber: 2,
      title: "Bloque 2: Síntesis de audio (simulado)",
      icon: "🎧",
      explanation: `
        <h3>Guion de audio</h3>
        <p><strong>Transcripción breve:</strong> "Durante el piloto, el 72% del grupo completó actividades semanales. Sin embargo, los estudiantes con menor conectividad participaron menos en foros y tutorías. El comité recomienda sesiones de apoyo técnico y una rúbrica unificada para evitar criterios dispares entre docentes."</p>
        <p>Tu tarea es sintetizar información y compararla con el texto de lectura.</p>
      `,
      exercises: [
        {
          id: "sp-b2eval-3",
          title: "Síntesis y contraste",
          instructions: "Redacta respuestas breves y precisas.",
          items: [
            {
              type: "text",
              label: "Resume la idea principal del audio en una oración.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Menciona una coincidencia entre lectura y audio.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Menciona una diferencia relevante entre lectura y audio.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "b2eval-argumentacion",
      stepNumber: 3,
      title: "Bloque 3: Respuesta argumentada",
      icon: "🧾",
      explanation: `
        <h3>Producción final</h3>
        <p>Escribe una respuesta argumentada (170-220 palabras) sobre la pregunta:</p>
        <p><em>¿Qué condiciones mínimas debería cumplir una institución para implementar con éxito un modelo híbrido sin aumentar desigualdades?</em></p>
        <p>Incluye:</p>
        <ul>
          <li>tesis clara,</li>
          <li>dos argumentos con evidencia de lectura/audio,</li>
          <li>cierre con recomendación viable.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b2eval-4",
          title: "Escritura estructurada",
          instructions: "Construye tu texto por partes y luego integra una versión final.",
          items: [
            {
              type: "text",
              label: "Tesis (1 oración):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Argumento 1 con evidencia:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Argumento 2 con evidencia:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Conclusión con recomendación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final (170-220 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "b2eval-q1",
      question: "¿Qué describe mejor la tarea B2 integrada?",
      options: [
        { value: "a", label: "Solo memoria de datos aislados" },
        { value: "b", label: "Comprensión, síntesis y argumentación con evidencia" },
        { value: "c", label: "Únicamente conjugación verbal" },
      ],
      correctAnswer: "b",
      explanation: "La evaluación integra varias competencias discursivas.",
    },
    {
      id: "b2eval-q2",
      question: "En lectura analítica B2, ¿qué es esencial?",
      options: [
        { value: "a", label: "Identificar tesis y matices" },
        { value: "b", label: "Copiar frases textuales sin análisis" },
        { value: "c", label: "Ignorar el contexto" },
      ],
      correctAnswer: "a",
      explanation: "El nivel B2 exige análisis y no solo localización literal.",
    },
    {
      id: "b2eval-q3",
      question: "¿Qué función cumple la síntesis de audio?",
      options: [
        { value: "a", label: "Decorar el texto final" },
        { value: "b", label: "Aportar evidencia y contraste" },
        { value: "c", label: "Sustituir la lectura" },
      ],
      correctAnswer: "b",
      explanation: "La síntesis permite integrar fuentes y construir postura.",
    },
    {
      id: "b2eval-q4",
      question: "Selecciona la mejor tesis para la tarea final.",
      options: [
        { value: "a", label: "El tema es complicado." },
        { value: "b", label: "Un modelo híbrido solo funciona si hay acompañamiento técnico y criterios evaluativos comunes." },
        { value: "c", label: "Cada docente decide como quiera." },
      ],
      correctAnswer: "b",
      explanation: "Es específica, defendible y orientada a condiciones concretas.",
    },
    {
      id: "b2eval-q5",
      question: "¿Cuál es una práctica adecuada de evidencia?",
      options: [
        { value: "a", label: "Afirmar sin referencia a lectura/audio" },
        { value: "b", label: "Relacionar un dato del audio con una idea del texto" },
        { value: "c", label: "Evitar toda comparación" },
      ],
      correctAnswer: "b",
      explanation: "La integración de fuentes fortalece la argumentación.",
    },
    {
      id: "b2eval-q6",
      question: "¿Qué rango de palabras se pide en la producción final?",
      options: [
        { value: "a", label: "90-120" },
        { value: "b", label: "170-220" },
        { value: "c", label: "260-320" },
      ],
      correctAnswer: "b",
      explanation: "Ese rango obliga a desarrollar ideas con profundidad controlada.",
    },
    {
      id: "b2eval-q7",
      question: "¿Cuál mejora la coherencia global?",
      options: [
        { value: "a", label: "Conectores lógicos y progresión temática" },
        { value: "b", label: "Repetición sin propósito" },
        { value: "c", label: "Saltos de tema sin transición" },
      ],
      correctAnswer: "a",
      explanation: "La cohesión textual es criterio central en B2.",
    },
    {
      id: "b2eval-q8",
      question: "¿Qué cierre es más adecuado para la respuesta argumentada?",
      options: [
        { value: "a", label: "No sé, es difícil." },
        { value: "b", label: "En conclusión, se requiere apoyo técnico continuo y evaluación unificada para sostener la equidad." },
        { value: "c", label: "Fin." },
      ],
      correctAnswer: "b",
      explanation: "Recapitula postura y propone una salida viable.",
    },
    {
      id: "b2eval-q9",
      question: "En revisión final, ¿qué combinación es prioritaria?",
      options: [
        { value: "a", label: "Solo ortografía" },
        { value: "b", label: "Coherencia, precisión gramatical y suficiencia de evidencia" },
        { value: "c", label: "Longitud sin contenido" },
      ],
      correctAnswer: "b",
      explanation: "Son los tres ejes clave para calidad B2.",
    },
    {
      id: "b2eval-q10",
      question: "¿Qué error debilita más la tarea integrada?",
      options: [
        { value: "a", label: "No conectar lectura y audio" },
        { value: "b", label: "Usar dos conectores" },
        { value: "c", label: "Redactar una tesis clara" },
      ],
      correctAnswer: "a",
      explanation: "La integración de fuentes es requisito central del formato.",
    },
  ],
};
