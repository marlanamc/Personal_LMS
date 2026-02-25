import type { InteractiveGuideContent } from "@/types/activity";

export const spanishContrasteTiemposB2Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "ct-overview",
      title: "Contraste fino de tiempos y modos (B2)",
      icon: "⏱️",
      explanation: `
        <h3>Precisión discursiva en contextos académicos y laborales</h3>
        <p>En B2, el reto no es solo conjugar: es elegir el tiempo y el modo que mejor representa certeza, duda, anterioridad y relevancia discursiva.</p>
        <p>Trabajaremos contrastes frecuentes:</p>
        <ul>
          <li>presente perfecto vs pretérito en informes y seguimiento,</li>
          <li>indicativo vs subjuntivo en valoración, hipótesis y toma de postura,</li>
          <li>imperfecto de subjuntivo en contextos más formales y distanciados.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-ctb2-1",
          title: "Diagnóstico inicial",
          instructions: "Elige la opción más adecuada al contexto.",
          items: [
            {
              type: "radio",
              label: "En el informe semanal: 'Esta semana ___ tres incidencias críticas.'",
              options: [
                { value: "a", label: "hemos resuelto" },
                { value: "b", label: "resolvimos" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "En una conclusión cerrada con fecha exacta: 'El 3 de marzo ___ la auditoría.'",
              options: [
                { value: "a", label: "hemos completado" },
                { value: "b", label: "completamos" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "ct-perfecto-preterito",
      stepNumber: 1,
      title: "Presente perfecto vs pretérito en comunicación profesional",
      icon: "📊",
      explanation: `
        <h3>Criterio pragmático</h3>
        <p>En informes de progreso, el presente perfecto suele conectar acciones con el estado actual.</p>
        <p>El pretérito suele presentar eventos cerrados en una cronología finalizada.</p>
        <ul>
          <li><em>Hoy hemos avanzado en tres frentes.</em></li>
          <li><em>La semana pasada cerramos dos contratos.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-ctb2-2",
          title: "Selecciona el tiempo",
          instructions: "Completa según el marco temporal.",
          items: [
            {
              type: "select",
              label: "Este trimestre ___ (reducir) costos operativos.",
              options: ["hemos reducido", "redujimos"],
              expectedAnswer: "hemos reducido",
            },
            {
              type: "select",
              label: "En 2023 ___ (implementar) el nuevo protocolo.",
              options: ["hemos implementado", "implementamos"],
              expectedAnswer: "implementamos",
            },
            {
              type: "text",
              label: "Completa: Hoy no ___ (recibir) respuesta del proveedor.",
              correctAnswer: "hemos recibido",
              expectedAnswers: ["hemos recibido"],
            },
          ],
        },
      ],
    },
    {
      id: "ct-indicativo-subjuntivo",
      stepNumber: 2,
      title: "Indicativo vs subjuntivo en postura y evaluación",
      icon: "🎯",
      explanation: `
        <h3>Qué comunica cada modo</h3>
        <ul>
          <li><strong>Indicativo</strong>: hechos asumidos, certeza, verificación.</li>
          <li><strong>Subjuntivo</strong>: valoración, duda, hipótesis, objetivo no constatado.</li>
        </ul>
        <p>Ejemplos:</p>
        <ul>
          <li><em>Está claro que el plan funciona.</em> (indicativo)</li>
          <li><em>Es posible que el plan funcione.</em> (subjuntivo)</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-ctb2-3",
          title: "Modo adecuado",
          instructions: "Selecciona indicativo o subjuntivo según el detonante.",
          items: [
            {
              type: "select",
              label: "Es probable que el equipo ___ el objetivo hoy.",
              options: ["alcanza", "alcance"],
              expectedAnswer: "alcance",
            },
            {
              type: "select",
              label: "Confirmamos que el equipo ___ el objetivo hoy.",
              options: ["alcanza", "alcance"],
              expectedAnswer: "alcanza",
            },
            {
              type: "text",
              label: "Completa: No parece que el informe ___ (estar) listo.",
              correctAnswer: "esté",
              expectedAnswers: ["esté", "este"],
            },
          ],
        },
      ],
    },
    {
      id: "ct-subj-imperfecto",
      stepNumber: 3,
      title: "Imperfecto de subjuntivo para distancia y formalidad",
      icon: "🧭",
      explanation: `
        <h3>Cuándo aparece</h3>
        <p>El imperfecto de subjuntivo suele aparecer con verbos en pasado o en contextos formales de hipótesis/recomendación.</p>
        <ul>
          <li><em>Recomendamos que revisaran la propuesta antes de firmar.</em></li>
          <li><em>Si fuera posible, ampliaríamos el plazo.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-ctb2-4",
          title: "Ajuste de registro",
          instructions: "Reformula con más distancia formal cuando corresponda.",
          items: [
            {
              type: "text",
              label: "Reformula en registro formal: 'Sugiero que revisen el documento'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Completa: Si ___ (ser) necesario, cambiaríamos la fecha.",
              correctAnswer: "fuera",
              expectedAnswers: ["fuera", "fuese"],
            },
            {
              type: "text",
              label: "Escribe una recomendación institucional en pasado + subjuntivo.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "resumen-contraste-tiempos",
      stepNumber: 4,
      title: "Resumen: contraste de tiempos",
      icon: "📋",
      explanation: `
        <h3>Visión general</h3>
        <p><strong>Presente perfecto:</strong> periodo abierto (hoy, esta semana). <strong>Pretérito:</strong> evento cerrado en fecha. <strong>Condicional:</strong> cortesía, hipótesis. <strong>Subjuntivo imperfecto:</strong> en condicionales irreales (si fuera...).</p>
      `,
      exercises: [
        {
          id: "sp-ctb2-quickref",
          title: "Identifica",
          instructions: "Elige el tiempo adecuado.",
          items: [
            { type: "radio", label: "Para un periodo aún abierto: ___", options: [{ value: "pp", label: "presente perfecto" }, { value: "pret", label: "pretérito" }], expectedAnswer: "pp" },
          ],
        },
      ],
    },
    {
      id: "errores-contraste-tiempos",
      stepNumber: 5,
      title: "Errores frecuentes",
      icon: "⚠️",
      explanation: `
        <h3>Evitar</h3>
        <p>Usar pretérito con hoy/esta semana para resultados actuales (usar presente perfecto). Usar indicativo en condicionales irreales (usar imperfecto de subjuntivo). Mezclar tiempos sin coherencia temporal.</p>
      `,
      exercises: [
        {
          id: "sp-ctb2-mistakes",
          title: "¿Correcto?",
          instructions: "Elige la opción correcta.",
          items: [
            { type: "radio", label: "Hoy hemos cerrado tres casos: ___", options: [{ value: "a", label: "correcto (periodo abierto)" }, { value: "b", label: "incorrecto" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "ctb2-q1",
      question: "¿Qué opción encaja mejor en un periodo aún abierto?",
      options: [
        { value: "a", label: "Hoy cerramos tres casos." },
        { value: "b", label: "Hoy hemos cerrado tres casos." },
        { value: "c", label: "Hoy cerraríamos tres casos." },
      ],
      correctAnswer: "b",
      explanation: "Con 'hoy' y enfoque en resultado actual, presente perfecto es muy natural.",
    },
    {
      id: "ctb2-q2",
      question: "Elige la oración con evento cerrado en fecha específica.",
      options: [
        { value: "a", label: "En abril implementamos el sistema." },
        { value: "b", label: "En abril hemos implementado el sistema." },
        { value: "c", label: "En abril implementáramos el sistema." },
      ],
      correctAnswer: "a",
      explanation: "Fecha cerrada suele favorecer pretérito en este contexto.",
    },
    {
      id: "ctb2-q3",
      question: "Completa: 'Es posible que la medida ___ resultados positivos.'",
      options: [
        { value: "a", label: "genera" },
        { value: "b", label: "genere" },
        { value: "c", label: "generó" },
      ],
      correctAnswer: "b",
      explanation: "Posibilidad activa subjuntivo.",
    },
    {
      id: "ctb2-q4",
      question: "¿Qué detonante favorece indicativo?",
      options: [
        { value: "a", label: "Es dudoso que" },
        { value: "b", label: "No parece que" },
        { value: "c", label: "Está comprobado que" },
      ],
      correctAnswer: "c",
      explanation: "Certeza/verificación favorece indicativo.",
    },
    {
      id: "ctb2-q5",
      question: "Selecciona la opción más precisa:",
      options: [
        { value: "a", label: "Confirmamos que el equipo alcance la meta." },
        { value: "b", label: "Confirmamos que el equipo alcanza la meta." },
        { value: "c", label: "Confirmamos que el equipo alcanzar la meta." },
      ],
      correctAnswer: "b",
      explanation: "Confirmación factual + indicativo.",
    },
    {
      id: "ctb2-q6",
      question: "Completa: 'No creemos que el proveedor ___ hoy.'",
      options: [
        { value: "a", label: "responde" },
        { value: "b", label: "responda" },
        { value: "c", label: "respondió" },
      ],
      correctAnswer: "b",
      explanation: "Negación de creencia suele activar subjuntivo.",
    },
    {
      id: "ctb2-q7",
      question: "¿Cuál muestra imperfecto de subjuntivo correcto?",
      options: [
        { value: "a", label: "Si sería posible, ajustaríamos el plan." },
        { value: "b", label: "Si fuera posible, ajustaríamos el plan." },
        { value: "c", label: "Si es posible, ajustaríamos el plan ayer." },
      ],
      correctAnswer: "b",
      explanation: "Condición hipotética formal: si + imperfecto de subjuntivo.",
    },
    {
      id: "ctb2-q8",
      question: "Elige la mejor reformulación formal:",
      options: [
        { value: "a", label: "Recomendamos que revisaran el borrador." },
        { value: "b", label: "Recomendamos que revisan el borrador." },
        { value: "c", label: "Recomendamos revisarían el borrador." },
      ],
      correctAnswer: "a",
      explanation: "La opción introduce distancia formal y coherencia modal.",
    },
    {
      id: "ctb2-q9",
      question: "¿Qué oración expresa mejor hipótesis no verificada?",
      options: [
        { value: "a", label: "Sabemos que la estrategia funciona." },
        { value: "b", label: "Puede que la estrategia funcione." },
        { value: "c", label: "La estrategia funciona siempre." },
      ],
      correctAnswer: "b",
      explanation: "Puede que + subjuntivo marca hipótesis.",
    },
    {
      id: "ctb2-q10",
      question: "En un informe de seguimiento de hoy, ¿qué opción es más adecuada?",
      options: [
        { value: "a", label: "Hoy resolvimos dos incidencias y cerramos el día." },
        { value: "b", label: "Hoy hemos resuelto dos incidencias y seguimos monitorizando." },
        { value: "c", label: "Hoy resolveríamos dos incidencias." },
      ],
      correctAnswer: "b",
      explanation: "Conexión explícita con situación abierta del presente.",
    },
  ],
};
