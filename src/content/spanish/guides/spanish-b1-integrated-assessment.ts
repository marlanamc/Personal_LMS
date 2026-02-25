import type { InteractiveGuideContent } from "@/types/activity";

export const spanishB1IntegratedAssessmentContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "eval-intro",
      title: "Evaluación integrada B1",
      icon: "📊",
      explanation: `
        <h3>Objetivo</h3>
        <p>Esta evaluación integra comprensión de lectura, producción escrita y mini proyecto oral/escrito.</p>
        <p>Se recomienda completar en orden: lectura → escritura → proyecto.</p>
      `,
      exercises: [
        {
          id: "sp-b1eval-1",
          title: "Autoorganización",
          instructions: "Marca tu plan de trabajo antes de empezar.",
          items: [
            {
              type: "radio",
              label: "¿Qué bloque harás primero?",
              options: [
                { value: "a", label: "Lectura" },
                { value: "b", label: "Escritura" },
                { value: "c", label: "Mini proyecto" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "eval-lectura",
      stepNumber: 1,
      title: "Bloque 1: Lectura",
      icon: "📖",
      explanation: `
        <h3>Texto breve</h3>
        <p><strong>Texto:</strong> Esta semana, Mariana ha cambiado su rutina para mejorar su salud. Ha empezado a caminar treinta minutos cada mañana, ha preparado comida en casa y ha dormido más horas. También dice que es importante que sus amigos la acompañen, porque así mantiene la motivación.</p>
        <p>Responde con precisión. Justifica tus respuestas cuando sea posible.</p>
      `,
      exercises: [
        {
          id: "sp-b1eval-2",
          title: "Comprensión de ideas principales",
          instructions: "Selecciona la respuesta más completa.",
          items: [
            {
              type: "radio",
              label: "¿Cuál es el tema central del texto?",
              options: [
                { value: "a", label: "Un viaje de vacaciones" },
                { value: "b", label: "Cambios de hábitos para mejorar la salud" },
                { value: "c", label: "Una discusión entre amigos" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "¿Qué ayuda a Mariana a mantener la motivación?",
              options: [
                { value: "a", label: "Dormir menos" },
                { value: "b", label: "Comer fuera de casa" },
                { value: "c", label: "La compañía de sus amigos" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Escribe una consecuencia positiva de los cambios de Mariana.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "eval-escritura",
      stepNumber: 2,
      title: "Bloque 2: Escritura guiada",
      icon: "✍️",
      explanation: `
        <h3>Tarea escrita</h3>
        <p>Redacta un texto de 120-160 palabras sobre un cambio que has hecho para mejorar tu estudio o trabajo.</p>
        <p>Incluye:</p>
        <ul>
          <li>al menos 2 ejemplos en presente perfecto,</li>
          <li>1 recomendación con subjuntivo,</li>
          <li>1 comparación (más/menos/tan... como).</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b1eval-3",
          title: "Producción escrita",
          instructions: "Escribe por partes y luego une todo en un párrafo final.",
          items: [
            {
              type: "text",
              label: "Oración 1 con presente perfecto:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Oración 2 con recomendación en subjuntivo:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Oración 3 con comparación:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final (120-160 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "eval-proyecto",
      stepNumber: 3,
      title: "Bloque 3: Mini proyecto",
      icon: "🧠",
      explanation: `
        <h3>Proyecto breve</h3>
        <p>Diseña una propuesta de mejora para tu clase, trabajo o comunidad.</p>
        <p>Presenta:</p>
        <ul>
          <li>problema actual,</li>
          <li>dos acciones concretas,</li>
          <li>resultado esperado.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b1eval-4",
          title: "Guion del mini proyecto",
          instructions: "Escribe una propuesta clara y viable.",
          items: [
            {
              type: "text",
              label: "Problema actual (2-3 líneas):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Acción 1 (con recomendación en subjuntivo):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Acción 2 (con comparación):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Resultado esperado (2-3 líneas):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "b1e-q1",
      question: "En la lectura, ¿qué cambio NO aparece?",
      options: [
        { value: "a", label: "Caminar por la mañana" },
        { value: "b", label: "Dormir más horas" },
        { value: "c", label: "Cambiar de ciudad" },
      ],
      correctAnswer: "c",
      explanation: "El texto no menciona ningún cambio de ciudad.",
    },
    {
      id: "b1e-q2",
      question: "¿Cuál cumple la consigna de presente perfecto?",
      options: [
        { value: "a", label: "Ayer estudié tres horas." },
        { value: "b", label: "He organizado mejor mi horario." },
        { value: "c", label: "Estudio tres horas cada día." },
      ],
      correctAnswer: "b",
      explanation: "He organizado... está en presente perfecto.",
    },
    {
      id: "b1e-q3",
      question: "Selecciona una recomendación con subjuntivo.",
      options: [
        { value: "a", label: "Te recomiendo que descansas más." },
        { value: "b", label: "Te recomiendo que descanses más." },
        { value: "c", label: "Te recomiendo descansarás más." },
      ],
      correctAnswer: "b",
      explanation: "Después de recomendar que, se usa subjuntivo.",
    },
    {
      id: "b1e-q4",
      question: "¿Qué opción muestra una comparación correcta?",
      options: [
        { value: "a", label: "Este método es más eficaz que el anterior." },
        { value: "b", label: "Este método es más eficaz de el anterior." },
        { value: "c", label: "Este método es tan eficaz que el anterior." },
      ],
      correctAnswer: "a",
      explanation: "Comparación entre dos elementos: más ... que.",
    },
    {
      id: "b1e-q5",
      question: "¿Cuál es un componente obligatorio del mini proyecto?",
      options: [
        { value: "a", label: "Biografía completa del autor" },
        { value: "b", label: "Problema, acciones y resultado esperado" },
        { value: "c", label: "Lista de verbos irregulares" },
      ],
      correctAnswer: "b",
      explanation: "La estructura mínima del proyecto incluye esos tres elementos.",
    },
    {
      id: "b1e-q6",
      question: "¿Qué extensión se pide para el texto escrito?",
      options: [
        { value: "a", label: "60-80 palabras" },
        { value: "b", label: "120-160 palabras" },
        { value: "c", label: "200-250 palabras" },
      ],
      correctAnswer: "b",
      explanation: "La consigna establece 120-160 palabras.",
    },
    {
      id: "b1e-q7",
      question: "Elige una frase adecuada para resultado esperado.",
      options: [
        { value: "a", label: "Esperamos que aumente la participación." },
        { value: "b", label: "Ayer aumentó la participación quizá." },
        { value: "c", label: "Participación era aumentar." },
      ],
      correctAnswer: "a",
      explanation: "La frase presenta una expectativa clara y bien formulada.",
    },
    {
      id: "b1e-q8",
      question: "¿Qué estrategia mejora la coherencia del texto?",
      options: [
        { value: "a", label: "Usar conectores y justificar ideas" },
        { value: "b", label: "Evitar toda referencia temporal" },
        { value: "c", label: "Escribir frases sin relación" },
      ],
      correctAnswer: "a",
      explanation: "Los conectores y la justificación hacen el texto más claro.",
    },
    {
      id: "b1e-q9",
      question: "¿Cuál es la mejor revisión final antes de entregar?",
      options: [
        { value: "a", label: "Comprobar gramática, claridad y requisitos de la consigna" },
        { value: "b", label: "Eliminar todas las comparaciones" },
        { value: "c", label: "Quitar los verbos en presente perfecto" },
      ],
      correctAnswer: "a",
      explanation: "La revisión final debe verificar forma y cumplimiento de objetivos.",
    },
    {
      id: "b1e-q10",
      question: "¿Qué describe mejor esta evaluación?",
      options: [
        { value: "a", label: "Solo mide memoria de vocabulario" },
        { value: "b", label: "Integra comprensión, producción y propuesta aplicada" },
        { value: "c", label: "Se limita a conjugación aislada" },
      ],
      correctAnswer: "b",
      explanation: "La evaluación combina varias competencias de nivel B1.",
    },
  ],
};
