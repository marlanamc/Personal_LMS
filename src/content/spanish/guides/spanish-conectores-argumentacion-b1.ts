import type { InteractiveGuideContent } from "@/types/activity";

export const spanishConectoresArgumentacionB1Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "b1conn-intro",
      title: "Conectores discursivos y argumentación breve (B1)",
      icon: "🧩",
      explanation: `
        <h3>Objetivo B1</h3>
        <p>En B1, necesitas organizar opiniones con claridad y justificarlas con razones.</p>
        <p>Conectores clave:</p>
        <ul>
          <li><strong>Adición:</strong> además, también</li>
          <li><strong>Contraste:</strong> pero, sin embargo</li>
          <li><strong>Causa y consecuencia:</strong> porque, por eso, por lo tanto</li>
          <li><strong>Orden:</strong> primero, después, finalmente</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b1conn-1",
          title: "Función del conector",
          instructions: "Selecciona la función principal.",
          items: [
            {
              type: "radio",
              label: "'Sin embargo, la propuesta tiene ventajas.'",
              options: [
                { value: "a", label: "contraste" },
                { value: "b", label: "causa" },
                { value: "c", label: "orden" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "'Por eso, decidimos cambiar el horario.'",
              options: [
                { value: "a", label: "ejemplo" },
                { value: "b", label: "consecuencia" },
                { value: "c", label: "concesión" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "b1conn-estructura",
      stepNumber: 1,
      title: "Estructura básica de una opinión argumentada",
      icon: "🏗️",
      explanation: `
        <h3>Plantilla útil</h3>
        <p><strong>Opinión + razón + ejemplo + cierre</strong></p>
        <p>Ejemplo:</p>
        <p><em>Creo que las tutorías en línea son útiles porque permiten flexibilidad. Por ejemplo, muchos estudiantes trabajan y estudian al mismo tiempo. Por eso, deberían mantenerse.</em></p>
      `,
      exercises: [
        {
          id: "sp-b1conn-2",
          title: "Completa el argumento",
          instructions: "Elige el conector más adecuado.",
          items: [
            {
              type: "select",
              label: "Las clases híbridas son útiles ___ permiten participar desde casa.",
              options: ["porque", "sin embargo", "además de"],
              expectedAnswer: "porque",
            },
            {
              type: "select",
              label: "Hay ventajas, ___ también existen retos técnicos.",
              options: ["por eso", "sin embargo", "primero"],
              expectedAnswer: "sin embargo",
            },
            {
              type: "text",
              label: "Completa: Primero analizamos los datos; ___ tomamos la decisión.",
              correctAnswer: "después",
              expectedAnswers: ["después", "despues"],
            },
          ],
        },
      ],
    },
    {
      id: "b1conn-contraste",
      stepNumber: 2,
      title: "Contraste y matiz en nivel intermedio",
      icon: "⚖️",
      explanation: `
        <h3>Evitar textos planos</h3>
        <p>Un buen texto B1 reconoce una dificultad y mantiene una postura clara.</p>
        <p>Patrón: <em>Aunque X, Y.</em> / <em>Es cierto que X, pero Y.</em></p>
      `,
      exercises: [
        {
          id: "sp-b1conn-3",
          title: "Reescribe con contraste",
          instructions: "Transforma enunciados simples en argumentos con matiz.",
          items: [
            {
              type: "text",
              label: "Base: 'El curso es exigente. Es útil.'",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Base: 'La modalidad virtual tiene límites. Ayuda a muchas personas.'",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Escribe una oración con 'es cierto que... pero...'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "b1conn-produccion",
      stepNumber: 3,
      title: "Producción B1: párrafo argumentativo",
      icon: "📝",
      explanation: `
        <h3>Tarea final</h3>
        <p>Redacta un párrafo de 120-150 palabras con una postura clara sobre un tema educativo o laboral.</p>
        <p>Incluye al menos:</p>
        <ul>
          <li>2 conectores de causa/consecuencia,</li>
          <li>1 conector de contraste,</li>
          <li>1 ejemplo concreto.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b1conn-4",
          title: "Redacción guiada",
          instructions: "Construye por partes y luego integra.",
          items: [
            {
              type: "text",
              label: "Tesis (1 oración):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Razón principal con conector causal:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Contraargumento breve con contraste:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Párrafo final (120-150 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "b1conn-q1",
      question: "¿Qué conector expresa causa?",
      options: [
        { value: "a", label: "porque" },
        { value: "b", label: "sin embargo" },
        { value: "c", label: "finalmente" },
      ],
      correctAnswer: "a",
      explanation: "Porque introduce razón o causa.",
    },
    {
      id: "b1conn-q2",
      question: "¿Qué conector introduce contraste?",
      options: [
        { value: "a", label: "por lo tanto" },
        { value: "b", label: "además" },
        { value: "c", label: "sin embargo" },
      ],
      correctAnswer: "c",
      explanation: "Sin embargo marca oposición parcial.",
    },
    {
      id: "b1conn-q3",
      question: "Completa: 'No tenía experiencia; ___, aprendió rápido'.",
      options: [
        { value: "a", label: "por eso" },
        { value: "b", label: "aunque" },
        { value: "c", label: "primero" },
      ],
      correctAnswer: "a",
      explanation: "Introduce una consecuencia del proceso.",
    },
    {
      id: "b1conn-q4",
      question: "¿Qué estructura muestra mejor argumentación básica B1?",
      options: [
        { value: "a", label: "Opinión + razón + ejemplo" },
        { value: "b", label: "Opinión sin justificación" },
        { value: "c", label: "Lista de ideas sueltas" },
      ],
      correctAnswer: "a",
      explanation: "Ese formato da claridad y coherencia mínima.",
    },
    {
      id: "b1conn-q5",
      question: "Elige la mejor continuación: 'Es útil, ___ requiere disciplina'.",
      options: [
        { value: "a", label: "sin embargo" },
        { value: "b", label: "porque" },
        { value: "c", label: "por lo tanto" },
      ],
      correctAnswer: "a",
      explanation: "Se introduce una idea en tensión con la primera.",
    },
    {
      id: "b1conn-q6",
      question: "¿Qué conector ayuda a cerrar una secuencia?",
      options: [
        { value: "a", label: "después" },
        { value: "b", label: "finalmente" },
        { value: "c", label: "aunque" },
      ],
      correctAnswer: "b",
      explanation: "Finalmente marca el último punto.",
    },
    {
      id: "b1conn-q7",
      question: "¿Cuál opción contiene concesión?",
      options: [
        { value: "a", label: "Aunque hay problemas, el plan funciona." },
        { value: "b", label: "El plan funciona porque sí." },
        { value: "c", label: "Primero, segundo, tercero." },
      ],
      correctAnswer: "a",
      explanation: "Reconoce dificultad y mantiene tesis.",
    },
    {
      id: "b1conn-q8",
      question: "¿Qué debilita más un texto argumentativo B1?",
      options: [
        { value: "a", label: "ausencia de conectores" },
        { value: "b", label: "uso de un ejemplo concreto" },
        { value: "c", label: "incluir contraste" },
      ],
      correctAnswer: "a",
      explanation: "Sin conectores, la lógica del texto se pierde.",
    },
    {
      id: "b1conn-q9",
      question: "¿Qué enunciado expresa mejor consecuencia?",
      options: [
        { value: "a", label: "No obstante, seguimos." },
        { value: "b", label: "Por lo tanto, ampliaremos el programa." },
        { value: "c", label: "Además, quizá." },
      ],
      correctAnswer: "b",
      explanation: "Por lo tanto introduce conclusión/resultado.",
    },
    {
      id: "b1conn-q10",
      question: "¿Qué demuestra logro B1 en esta guía?",
      options: [
        { value: "a", label: "usar conectores funcionales para sostener una postura" },
        { value: "b", label: "enumerar vocabulario sin relación" },
        { value: "c", label: "evitar toda justificación" },
      ],
      correctAnswer: "a",
      explanation: "Ese es el núcleo de la argumentación breve en B1.",
    },
  ],
};
