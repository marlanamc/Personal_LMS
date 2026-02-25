import type { InteractiveGuideContent } from "@/types/activity";

export const spanishC2CapstoneContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "c2cap-intro",
      title: "Capstone C2: simulación profesional/académica integrada",
      icon: "🏁",
      explanation: `
        <h3>Desempeño final</h3>
        <p>Esta simulación integra lectura crítica, síntesis de información, toma de postura y producción escrita de alto nivel.</p>
        <p>Contexto: comité interinstitucional evalúa una política de implementación educativa con recursos limitados.</p>
      `,
      exercises: [
        {
          id: "sp-c2cap-1",
          title: "Preparación estratégica",
          instructions: "Define objetivo, audiencia y criterio de éxito antes de empezar.",
          items: [
            {
              type: "text",
              label: "Objetivo comunicativo prioritario:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Audiencia específica:",
              acceptAnyAttempt: true,
            },
            {
              type: "radio",
              label: "Criterio central de éxito:",
              options: [
                { value: "a", label: "densidad léxica" },
                { value: "b", label: "pertinencia, viabilidad y persuasión fundamentada" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "c2cap-lectura",
      stepNumber: 1,
      title: "Bloque 1: lectura y análisis de documento",
      icon: "📄",
      explanation: `
        <h3>Documento base</h3>
        <p><strong>Extracto:</strong> "El plan piloto incrementó la cobertura, pero la heterogeneidad de criterios de evaluación impidió comparar resultados entre sedes. Además, el costo de soporte técnico superó la proyección inicial en un 18%. El comité reconoce mejoras en permanencia estudiantil, aunque advierte que sin un marco común de seguimiento el escalamiento podría generar ineficiencias y desigualdades territoriales."</p>
        <p>Analiza hallazgos, riesgos y vacíos de implementación.</p>
      `,
      exercises: [
        {
          id: "sp-c2cap-2",
          title: "Lectura crítica",
          instructions: "Responde con precisión y jerarquiza la información.",
          items: [
            {
              type: "text",
              label: "Resume la tensión principal del extracto en 2 oraciones.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Identifica dos riesgos estratégicos y su posible impacto.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Propón un criterio de seguimiento que reduzca desigualdades.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c2cap-sintesis",
      stepNumber: 2,
      title: "Bloque 2: síntesis de evidencia complementaria",
      icon: "🧾",
      explanation: `
        <h3>Insumo adicional (simulado)</h3>
        <p><strong>Nota técnica:</strong> "Dos regiones con menor conectividad reportaron menor participación sin tutorías de apoyo. En contraste, las sedes con acompañamiento técnico semanal mostraron mejoras sostenidas en cumplimiento de actividades."</p>
        <p>Integra lectura y nota técnica en una misma línea argumental.</p>
      `,
      exercises: [
        {
          id: "sp-c2cap-3",
          title: "Síntesis comparada",
          instructions: "Conecta fuentes y evita repetición superficial.",
          items: [
            {
              type: "text",
              label: "Escribe una síntesis integrada de 90-120 palabras.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Formula una hipótesis explicativa basada en ambas fuentes.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c2cap-produccion",
      stepNumber: 3,
      title: "Bloque 3: propuesta final para comité",
      icon: "🗳️",
      explanation: `
        <h3>Entrega final</h3>
        <p>Redacta un documento de recomendación (260-340 palabras) con:</p>
        <ul>
          <li>diagnóstico breve y priorización de problemas,</li>
          <li>tres medidas viables con justificación,</li>
          <li>plan de seguimiento con indicadores observables,</li>
          <li>cierre persuasivo orientado a decisión.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c2cap-4",
          title: "Redacción por capas",
          instructions: "Construye versión final tras una microrevisión de precisión y tono.",
          items: [
            {
              type: "text",
              label: "Tesis ejecutiva (1-2 oraciones):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Medida 1 + justificación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Medida 2 + justificación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Medida 3 + justificación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final (260-340 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c2cap-q1",
      question: "¿Qué define mejor una tarea capstone C2?",
      options: [
        { value: "a", label: "ejercicios aislados sin integración" },
        { value: "b", label: "integración de análisis, síntesis y propuesta aplicada" },
        { value: "c", label: "memorización de reglas" },
      ],
      correctAnswer: "b",
      explanation: "El nivel C2 exige transferencia integrada de competencias.",
    },
    {
      id: "c2cap-q2",
      question: "¿Cuál es un componente obligatorio de la entrega final?",
      options: [
        { value: "a", label: "anécdota personal extensa" },
        { value: "b", label: "plan de seguimiento con indicadores" },
        { value: "c", label: "lista de verbos irregulares" },
      ],
      correctAnswer: "b",
      explanation: "La propuesta debe ser evaluable y operativa.",
    },
    {
      id: "c2cap-q3",
      question: "En síntesis C2, ¿qué práctica es más adecuada?",
      options: [
        { value: "a", label: "copiar fragmentos sin integración" },
        { value: "b", label: "combinar hallazgos y construir interpretación propia" },
        { value: "c", label: "separar fuentes sin relación" },
      ],
      correctAnswer: "b",
      explanation: "La síntesis avanzada requiere articulación interpretativa.",
    },
    {
      id: "c2cap-q4",
      question: "¿Qué fortalece más una recomendación para comité?",
      options: [
        { value: "a", label: "enunciados generales sin viabilidad" },
        { value: "b", label: "medidas priorizadas con justificación y métricas" },
        { value: "c", label: "tono coloquial cercano" },
      ],
      correctAnswer: "b",
      explanation: "Decisión institucional requiere sustento y verificabilidad.",
    },
    {
      id: "c2cap-q5",
      question: "¿Qué error compromete más el desempeño C2?",
      options: [
        { value: "a", label: "no jerarquizar problemas" },
        { value: "b", label: "usar conectores de contraste" },
        { value: "c", label: "proponer indicadores" },
      ],
      correctAnswer: "a",
      explanation: "Sin priorización, la propuesta pierde dirección estratégica.",
    },
    {
      id: "c2cap-q6",
      question: "¿Qué rango de palabras se pide para la propuesta final?",
      options: [
        { value: "a", label: "150-210" },
        { value: "b", label: "260-340" },
        { value: "c", label: "380-450" },
      ],
      correctAnswer: "b",
      explanation: "Ese rango permite profundidad con control discursivo.",
    },
    {
      id: "c2cap-q7",
      question: "¿Qué opción muestra mejor cierre persuasivo?",
      options: [
        { value: "a", label: "Sería bueno pensarlo." },
        { value: "b", label: "Recomendamos adoptar el plan escalonado con seguimiento trimestral para asegurar equidad y sostenibilidad." },
        { value: "c", label: "Tal vez funcione." },
      ],
      correctAnswer: "b",
      explanation: "Cierra con acción, condición y propósito explícitos.",
    },
    {
      id: "c2cap-q8",
      question: "En evaluación C2, ¿qué pesa más?",
      options: [
        { value: "a", label: "ornamentación léxica" },
        { value: "b", label: "eficacia argumentativa con precisión y viabilidad" },
        { value: "c", label: "longitud máxima" },
      ],
      correctAnswer: "b",
      explanation: "La calidad se mide por pertinencia y capacidad de decisión.",
    },
    {
      id: "c2cap-q9",
      question: "¿Qué práctica mejora más la calidad final?",
      options: [
        { value: "a", label: "revisión por capas: lógica, evidencia, tono" },
        { value: "b", label: "entrega sin revisión" },
        { value: "c", label: "editar solo ortografía" },
      ],
      correctAnswer: "a",
      explanation: "La revisión escalonada optimiza desempeño integral.",
    },
    {
      id: "c2cap-q10",
      question: "¿Qué demuestra cierre de ciclo C2?",
      options: [
        { value: "a", label: "respuesta correcta aislada" },
        { value: "b", label: "capacidad de diagnosticar, priorizar y proponer con precisión contextual" },
        { value: "c", label: "uso de frases hechas" },
      ],
      correctAnswer: "b",
      explanation: "Ese desempeño integra competencias de nivel avanzado superior.",
    },
  ],
};
