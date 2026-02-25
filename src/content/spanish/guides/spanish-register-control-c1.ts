import type { InteractiveGuideContent } from "@/types/activity";

export const spanishRegisterControlC1Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "reg-intro",
      title: "Control de registro: formal, semiformal y cercano (C1)",
      icon: "🎚️",
      explanation: `
        <h3>Objetivo C1</h3>
        <p>En C1, no solo comunicas ideas: ajustas tono, distancia y cortesía según el contexto.</p>
        <p>Trabajarás tres registros:</p>
        <ul>
          <li><strong>Formal:</strong> institucional, profesional, académico.</li>
          <li><strong>Semiformal:</strong> colaboración entre colegas, coordinación habitual.</li>
          <li><strong>Cercano:</strong> confianza personal o equipo íntimo.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1reg-1",
          title: "Diagnóstico de registro",
          instructions: "Selecciona el registro más adecuado para cada enunciado.",
          items: [
            {
              type: "radio",
              label: "Agradeceríamos que remitieran la documentación antes del viernes.",
              options: [
                { value: "a", label: "formal" },
                { value: "b", label: "semiformal" },
                { value: "c", label: "cercano" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "¿Te parece si revisamos esto juntos mañana?",
              options: [
                { value: "a", label: "formal" },
                { value: "b", label: "semiformal" },
                { value: "c", label: "cercano" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "reg-marcadores",
      stepNumber: 1,
      title: "Marcadores lingüísticos por registro",
      icon: "🧩",
      explanation: `
        <h3>Señales de tono</h3>
        <ul>
          <li><strong>Formal:</strong> estructuras impersonales, mitigación, léxico técnico.</li>
          <li><strong>Semiformal:</strong> claridad operativa, cortesía directa, colaboración.</li>
          <li><strong>Cercano:</strong> espontaneidad, economía expresiva, mayor proximidad.</li>
        </ul>
      `,
      comparison: {
        title: "Mismo propósito, distinto registro",
        leftLabel: "Formal",
        rightLabel: "Semiformal/Cercano",
        rows: [
          {
            label: "Solicitar revisión",
            left: "Le agradecería que revisara el informe cuando le sea posible.",
            right: "¿Puedes revisar el informe hoy, por favor?",
          },
          {
            label: "Proponer ajuste",
            left: "Sería conveniente replantear el cronograma previsto.",
            right: "Creo que deberíamos ajustar el cronograma.",
          },
          {
            label: "Dar seguimiento",
            left: "Quedamos atentos a sus comentarios para continuar.",
            right: "Quedo pendiente de tus comentarios para seguir.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-c1reg-2",
          title: "Selecciona el marcador adecuado",
          instructions: "Elige la opción más coherente con el registro indicado.",
          items: [
            {
              type: "select",
              label: "(Formal) ___ confirmar la recepción del documento.",
              options: ["Te escribo para", "Me permito", "Oye, quería"],
              expectedAnswer: "Me permito",
            },
            {
              type: "select",
              label: "(Semiformal) ___ coordinar una reunión breve mañana.",
              options: ["Propongo", "Se ruega", "A ver si"],
              expectedAnswer: "Propongo",
            },
            {
              type: "text",
              label: "Completa en formal: " +
                "___ agradeceríamos su respuesta antes del jueves.",
              correctAnswer: "Asimismo",
              expectedAnswers: ["Asimismo", "asimismo"],
            },
          ],
        },
      ],
    },
    {
      id: "reg-reescritura",
      stepNumber: 2,
      title: "Reescritura entre registros",
      icon: "🔁",
      explanation: `
        <h3>Transformación estratégica</h3>
        <p>La reescritura C1 exige mantener intención y contenido, cambiando únicamente el nivel de formalidad.</p>
      `,
      exercises: [
        {
          id: "sp-c1reg-3",
          title: "Convierte el registro",
          instructions: "Reescribe según el registro objetivo.",
          items: [
            {
              type: "text",
              label: "Pásalo a formal: 'Oye, pásame el informe hoy'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Pásalo a semiformal: 'Le agradeceríamos su pronta respuesta'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Pásalo a cercano: 'Resulta imprescindible optimizar este procedimiento'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "reg-produccion",
      stepNumber: 3,
      title: "Producción C1 con criterio de audiencia",
      icon: "📝",
      explanation: `
        <h3>Microtareas de alto control</h3>
        <p>Redacta mensajes equivalentes para tres destinatarios distintos: dirección, colega y amigo.</p>
      `,
      exercises: [
        {
          id: "sp-c1reg-4",
          title: "Tríada de mensajes",
          instructions: "Mantén el mismo objetivo comunicativo y adapta el registro.",
          items: [
            {
              type: "text",
              label: "Versión formal (dirección):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión semiformal (colega):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión cercana (amistad/equipo íntimo):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c1reg-q1",
      question: "¿Qué rasgo caracteriza más el registro formal?",
      options: [
        { value: "a", label: "Alta espontaneidad y coloquialismos" },
        { value: "b", label: "Mitigación, distancia y precisión léxica" },
        { value: "c", label: "Frases incompletas y elipsis frecuentes" },
      ],
      correctAnswer: "b",
      explanation: "El registro formal prioriza distancia, cortesía estratégica y precisión.",
    },
    {
      id: "c1reg-q2",
      question: "Elige la opción más adecuada para un correo institucional.",
      options: [
        { value: "a", label: "¿Qué onda? Te escribo por esto." },
        { value: "b", label: "Me permito solicitar información adicional sobre el proceso." },
        { value: "c", label: "A ver si me mandas eso." },
      ],
      correctAnswer: "b",
      explanation: "La fórmula mantiene tono profesional y cortesía formal.",
    },
    {
      id: "c1reg-q3",
      question: "¿Qué enunciado es más semiformal?",
      options: [
        { value: "a", label: "Le agradecería que procediera a la brevedad." },
        { value: "b", label: "¿Podemos revisar esto mañana por la mañana?" },
        { value: "c", label: "Hazlo ya, porfa." },
      ],
      correctAnswer: "b",
      explanation: "Combina colaboración y cortesía sin distancia institucional extrema.",
    },
    {
      id: "c1reg-q4",
      question: "Completa en registro formal: '___ su confirmación para continuar con el trámite.'",
      options: [
        { value: "a", label: "Quedamos atentos a" },
        { value: "b", label: "Quedo viendo" },
        { value: "c", label: "A ver si mandas" },
      ],
      correctAnswer: "a",
      explanation: "Es una fórmula convencional y apropiada para formalidad alta.",
    },
    {
      id: "c1reg-q5",
      question: "¿Qué objetivo principal tiene la reescritura de registro?",
      options: [
        { value: "a", label: "Cambiar el contenido factual" },
        { value: "b", label: "Mantener intención y adaptar tono/audiencia" },
        { value: "c", label: "Eliminar toda marca de cortesía" },
      ],
      correctAnswer: "b",
      explanation: "En C1, la operación clave es pragmática, no solo gramatical.",
    },
    {
      id: "c1reg-q6",
      question: "Selecciona la reformulación formal correcta de 'Pásame el informe hoy'.",
      options: [
        { value: "a", label: "Te agradecería que me remitieras el informe hoy." },
        { value: "b", label: "Mándamelo de una vez." },
        { value: "c", label: "Pásamelo ya." },
      ],
      correctAnswer: "a",
      explanation: "Introduce cortesía mitigada y verbo acorde a contexto formal.",
    },
    {
      id: "c1reg-q7",
      question: "¿Cuál opción es la más cercana/coloquial?",
      options: [
        { value: "a", label: "Resultaría conveniente coordinar una reunión." },
        { value: "b", label: "¿Nos juntamos y lo vemos rápido?" },
        { value: "c", label: "Solicitamos su disponibilidad para concertar una sesión." },
      ],
      correctAnswer: "b",
      explanation: "Expresa proximidad y espontaneidad conversacional.",
    },
    {
      id: "c1reg-q8",
      question: "¿Qué error rompe más la coherencia de registro?",
      options: [
        { value: "a", label: "Mezclar tratamiento formal con coloquialismos abruptos" },
        { value: "b", label: "Usar conectores lógicos" },
        { value: "c", label: "Ajustar léxico al destinatario" },
      ],
      correctAnswer: "a",
      explanation: "La mezcla no controlada de marcas pragmáticas debilita credibilidad textual.",
    },
    {
      id: "c1reg-q9",
      question: "En contexto académico, ¿qué opción es más adecuada?",
      options: [
        { value: "a", label: "Yo creo que estuvo medio raro, ¿no?" },
        { value: "b", label: "El análisis evidencia inconsistencias metodológicas relevantes." },
        { value: "c", label: "Esto está mal y punto." },
      ],
      correctAnswer: "b",
      explanation: "Presenta tono analítico y precisión léxica apropiada.",
    },
    {
      id: "c1reg-q10",
      question: "¿Qué demuestra control C1 de registro?",
      options: [
        { value: "a", label: "Usar siempre el mismo tono para cualquier audiencia" },
        { value: "b", label: "Ajustar forma, cortesía y densidad léxica según destinatario y propósito" },
        { value: "c", label: "Evitar toda reformulación" },
      ],
      correctAnswer: "b",
      explanation: "Ese ajuste consciente y consistente es núcleo del desempeño C1.",
    },
  ],
};
