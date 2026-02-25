import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPrecisionLabC2Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "c2prec-intro",
      title: "Precision Lab C2: errores sutiles y reformulación avanzada",
      icon: "🔬",
      explanation: `
        <h3>Meta del laboratorio</h3>
        <p>En C2, el foco está en microajustes de alta precisión: ambigüedad no deseada, colocaciones inestables, matiz modal y economía expresiva.</p>
      `,
      exercises: [
        {
          id: "sp-c2prec-1",
          title: "Detección fina",
          instructions: "Identifica la opción de mayor precisión semántica y pragmática.",
          items: [
            {
              type: "radio",
              label: "¿Qué opción es más precisa en contexto formal?",
              options: [
                { value: "a", label: "El problema fue grande." },
                { value: "b", label: "La incidencia tuvo un impacto operativo significativo." },
                { value: "c", label: "Pasó algo fuerte." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "¿Qué opción reduce ambigüedad?",
              options: [
                { value: "a", label: "Lo revisaron cuando llegó." },
                { value: "b", label: "El comité revisó el informe al recibir la versión final." },
                { value: "c", label: "Se vio eso ahí." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "c2prec-colocaciones",
      stepNumber: 1,
      title: "Colocaciones y combinaciones léxicas de alta frecuencia",
      icon: "🧠",
      explanation: `
        <h3>Naturalidad experta</h3>
        <p>La precisión C2 exige elegir combinaciones idiomáticamente estables en registros profesionales.</p>
        <ul>
          <li><em>adoptar medidas</em> (no *tomar medidas* en todo contexto formal)</li>
          <li><em>plantear una objeción</em></li>
          <li><em>mitigar riesgos</em></li>
          <li><em>acotar el alcance</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c2prec-2",
          title: "Selecciona la colocación más natural",
          instructions: "Elige la opción más idiomática para el registro indicado.",
          items: [
            {
              type: "select",
              label: "Para reducir exposición, conviene ___ riesgos operativos.",
              options: ["mitigar", "bajar", "quitar"],
              expectedAnswer: "mitigar",
            },
            {
              type: "select",
              label: "En la reunión se ___ una objeción metodológica.",
              options: ["planteó", "tiró", "soltó"],
              expectedAnswer: "planteó",
            },
            {
              type: "text",
              label: "Completa: Es necesario ___ el alcance del piloto antes de escalar.",
              correctAnswer: "acotar",
              expectedAnswers: ["acotar"],
            },
          ],
        },
      ],
    },
    {
      id: "c2prec-reformulacion",
      stepNumber: 2,
      title: "Reformulación de alta precisión",
      icon: "🛠️",
      explanation: `
        <h3>Del borrador correcto al texto excelente</h3>
        <p>Reformular no es solo cambiar palabras: implica ajustar foco, fuerza argumentativa y carga pragmática.</p>
      `,
      exercises: [
        {
          id: "sp-c2prec-3",
          title: "Refina el enunciado",
          instructions: "Reescribe con mayor precisión y menor ambigüedad.",
          items: [
            {
              type: "text",
              label: "Reformula: 'El plan salió mal por varias cosas'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Reformula: 'Habría que ver eso luego'. (contexto directivo)",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Reformula para tono técnico: 'No funcionó bien'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c2prec-produccion",
      stepNumber: 3,
      title: "Producción final con control microestilístico",
      icon: "📝",
      explanation: `
        <h3>Microinforme C2</h3>
        <p>Redacta un texto de 180-230 palabras con foco en precisión terminológica, cohesión fina y cierre estratégico.</p>
      `,
      exercises: [
        {
          id: "sp-c2prec-4",
          title: "Versión final",
          instructions: "Incluye diagnóstico, recomendación y criterio de implementación.",
          items: [
            {
              type: "text",
              label: "Microinforme (180-230 palabras):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Lista 3 mejoras de precisión realizadas en tu propia revisión:",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c2prec-q1",
      question: "¿Qué caracteriza la precisión C2?",
      options: [
        { value: "a", label: "frases largas sin control" },
        { value: "b", label: "ajuste fino de significado, tono y colocación" },
        { value: "c", label: "uso constante de sinónimos complejos" },
      ],
      correctAnswer: "b",
      explanation: "La precisión C2 integra semántica, pragmática y naturalidad.",
    },
    {
      id: "c2prec-q2",
      question: "Elige la opción más precisa en registro profesional.",
      options: [
        { value: "a", label: "Hay problemas varios." },
        { value: "b", label: "Se detectaron inconsistencias metodológicas en dos fases del proceso." },
        { value: "c", label: "La cosa salió rara." },
      ],
      correctAnswer: "b",
      explanation: "Especifica fenómeno, alcance y marco.",
    },
    {
      id: "c2prec-q3",
      question: "¿Qué colocación es más sólida?",
      options: [
        { value: "a", label: "levantar riesgos" },
        { value: "b", label: "mitigar riesgos" },
        { value: "c", label: "romper riesgos" },
      ],
      correctAnswer: "b",
      explanation: "Es la combinación idiomática esperable en contextos técnicos.",
    },
    {
      id: "c2prec-q4",
      question: "¿Qué mejora más una reformulación?",
      options: [
        { value: "a", label: "aumentar palabras sin cambiar contenido" },
        { value: "b", label: "reducir ambigüedad y ajustar foco informativo" },
        { value: "c", label: "eliminar conectores" },
      ],
      correctAnswer: "b",
      explanation: "La calidad aumenta cuando se clarifica y orienta el mensaje.",
    },
    {
      id: "c2prec-q5",
      question: "¿Qué error es típico de baja precisión?",
      options: [
        { value: "a", label: "referentes pronominales ambiguos" },
        { value: "b", label: "especificación terminológica" },
        { value: "c", label: "cohesión temática" },
      ],
      correctAnswer: "a",
      explanation: "La referencia difusa dificulta interpretación exacta.",
    },
    {
      id: "c2prec-q6",
      question: "Elige la mejor reformulación de 'hay que arreglar eso'.",
      options: [
        { value: "a", label: "Conviene corregir esa desviación operativa en esta fase." },
        { value: "b", label: "Hay que hacer algo." },
        { value: "c", label: "Arreglen eso." },
      ],
      correctAnswer: "a",
      explanation: "Aporta especificidad y registro apropiado.",
    },
    {
      id: "c2prec-q7",
      question: "¿Qué demuestra mejor control microestilístico?",
      options: [
        { value: "a", label: "variar términos sin criterio" },
        { value: "b", label: "usar léxico exacto y consistente con propósito" },
        { value: "c", label: "evitar tecnicismos siempre" },
      ],
      correctAnswer: "b",
      explanation: "La selección léxica debe responder a función y audiencia.",
    },
    {
      id: "c2prec-q8",
      question: "¿Qué opción ofrece mayor economía expresiva sin pérdida de precisión?",
      options: [
        { value: "a", label: "Debido a una serie de circunstancias, pasó algo que no estuvo del todo bien." },
        { value: "b", label: "La implementación presentó fallas de coordinación interáreas." },
        { value: "c", label: "Hubo un tema ahí." },
      ],
      correctAnswer: "b",
      explanation: "Condensa con claridad y especificidad suficiente.",
    },
    {
      id: "c2prec-q9",
      question: "¿Qué criterio debe guiar una versión final C2?",
      options: [
        { value: "a", label: "complejidad por sí misma" },
        { value: "b", label: "claridad estratégica + precisión terminológica" },
        { value: "c", label: "densidad sin estructura" },
      ],
      correctAnswer: "b",
      explanation: "El objetivo es máxima eficacia comunicativa con control fino.",
    },
    {
      id: "c2prec-q10",
      question: "¿Qué práctica mejora más la calidad final?",
      options: [
        { value: "a", label: "revisión en capas: sentido, forma, tono" },
        { value: "b", label: "una sola lectura rápida" },
        { value: "c", label: "cambiar palabras al azar" },
      ],
      correctAnswer: "a",
      explanation: "La revisión por capas permite ajustes de alto nivel con detalle.",
    },
  ],
};
