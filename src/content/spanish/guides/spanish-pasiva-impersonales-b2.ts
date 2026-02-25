import type { InteractiveGuideContent } from "@/types/activity";

export const spanishPasivaImpersonalesB2Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "pasiva-intro",
      title: "Voz pasiva e impersonales con se (B2)",
      icon: "📰",
      explanation: `
        <h3>Objetivo comunicativo</h3>
        <p>En textos formales y académicos, estas estructuras permiten enfatizar procesos, normas y resultados sin centrar el agente.</p>
        <ul>
          <li><strong>Pasiva perifrástica:</strong> ser + participio (+ por + agente)</li>
          <li><strong>Pasiva con se:</strong> se + verbo en 3.ª persona + sujeto paciente</li>
          <li><strong>Impersonal con se:</strong> se + verbo en 3.ª persona singular</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-pasb2-1",
          title: "Reconocimiento estructural",
          instructions: "Identifica el tipo de estructura.",
          items: [
            {
              type: "radio",
              label: "Se publicaron los resultados finales.",
              options: [
                { value: "a", label: "pasiva con se" },
                { value: "b", label: "impersonal con se" },
                { value: "c", label: "pasiva perifrástica" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Se recomienda revisar el protocolo.",
              options: [
                { value: "a", label: "pasiva con se" },
                { value: "b", label: "impersonal con se" },
                { value: "c", label: "pasiva perifrástica" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "pasiva-perifrastica",
      stepNumber: 1,
      title: "Pasiva perifrástica: ser + participio",
      icon: "🏗️",
      explanation: `
        <h3>Cuándo usarla</h3>
        <p>Se usa para destacar el proceso o el resultado, especialmente en informes y lenguaje técnico.</p>
        <p>Ejemplos:</p>
        <ul>
          <li><em>El informe fue revisado por el comité.</em></li>
          <li><em>La propuesta será evaluada mañana.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-pasb2-2",
          title: "Transformación a pasiva perifrástica",
          instructions: "Reescribe con ser + participio.",
          items: [
            {
              type: "text",
              label: "El equipo aprobó el plan.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "La dirección implementará la medida.",
              acceptAnyAttempt: true,
            },
            {
              type: "select",
              label: "El documento ___ por auditoría interna. (pasado)",
              options: ["fue validado", "se validaron", "se valida"],
              expectedAnswer: "fue validado",
            },
          ],
        },
      ],
    },
    {
      id: "pasiva-se",
      stepNumber: 2,
      title: "Pasiva con se",
      icon: "⚙️",
      explanation: `
        <h3>Foco en el resultado</h3>
        <p>Enfatiza el evento y el objeto afectado, no el agente.</p>
        <p>Patrón: <strong>se + verbo (3.ª persona) + sujeto paciente</strong>.</p>
        <ul>
          <li><em>Se aprobaron nuevas directrices.</em></li>
          <li><em>Se revisa el material cada trimestre.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-pasb2-3",
          title: "Concordancia en pasiva con se",
          instructions: "Elige la forma verbal correcta.",
          items: [
            {
              type: "select",
              label: "Se ___ los informes ayer.",
              options: ["revisó", "revisaron"],
              expectedAnswer: "revisaron",
            },
            {
              type: "select",
              label: "Se ___ la propuesta en la reunión.",
              options: ["discutió", "discutieron"],
              expectedAnswer: "discutió",
            },
            {
              type: "text",
              label: "Completa: Se ___ (publicar) los resultados hoy.",
              correctAnswer: "publican",
              expectedAnswers: ["publican"],
            },
          ],
        },
      ],
    },
    {
      id: "impersonal-se",
      stepNumber: 3,
      title: "Impersonal con se",
      icon: "📌",
      explanation: `
        <h3>Normas, recomendaciones y generalizaciones</h3>
        <p>Se usa en 3.ª persona singular sin sujeto explícito.</p>
        <ul>
          <li><em>Se recomienda enviar la solicitud con antelación.</em></li>
          <li><em>En esta oficina se trabaja por objetivos.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-pasb2-4",
          title: "Impersonal vs pasiva con se",
          instructions: "Selecciona la opción más adecuada al significado.",
          items: [
            {
              type: "radio",
              label: "Texto de instrucciones generales:",
              options: [
                { value: "a", label: "Se entregan su solicitud antes del viernes." },
                { value: "b", label: "Se recomienda entregar su solicitud antes del viernes." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Noticia sobre documentos ya procesados:",
              options: [
                { value: "a", label: "Se procesaron 400 solicitudes." },
                { value: "b", label: "Se recomienda 400 solicitudes." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Escribe una norma institucional con impersonal con se.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "pasb2-q1",
      question: "¿Qué estructura corresponde a 'Se aprobaron nuevas reglas'?",
      options: [
        { value: "a", label: "Impersonal con se" },
        { value: "b", label: "Pasiva con se" },
        { value: "c", label: "Pasiva perifrástica" },
      ],
      correctAnswer: "b",
      explanation: "Hay sujeto paciente plural (nuevas reglas) y concordancia verbal.",
    },
    {
      id: "pasb2-q2",
      question: "Selecciona una impersonal con se correcta.",
      options: [
        { value: "a", label: "Se recomiendan revisar el reglamento." },
        { value: "b", label: "Se recomienda revisar el reglamento." },
        { value: "c", label: "Se recomendaron revisar el reglamento." },
      ],
      correctAnswer: "b",
      explanation: "En impersonal con se, el verbo va en 3.ª persona singular.",
    },
    {
      id: "pasb2-q3",
      question: "Completa: 'Los datos ___ por el comité.' (pasiva perifrástica, pasado)",
      options: [
        { value: "a", label: "fueron validados" },
        { value: "b", label: "se validó" },
        { value: "c", label: "se recomienda" },
      ],
      correctAnswer: "a",
      explanation: "Pasiva perifrástica en pasado: fueron + participio plural.",
    },
    {
      id: "pasb2-q4",
      question: "Elige la opción con concordancia correcta en pasiva con se.",
      options: [
        { value: "a", label: "Se aprobó las medidas." },
        { value: "b", label: "Se aprobaron las medidas." },
        { value: "c", label: "Se aprobar la medida." },
      ],
      correctAnswer: "b",
      explanation: "El verbo concuerda con 'las medidas' (plural).",
    },
    {
      id: "pasb2-q5",
      question: "¿Qué estructura enfatiza una norma general sin agente explícito?",
      options: [
        { value: "a", label: "Impersonal con se" },
        { value: "b", label: "Pasiva perifrástica" },
        { value: "c", label: "Voz activa personal" },
      ],
      correctAnswer: "a",
      explanation: "La impersonal con se formula recomendaciones generales.",
    },
    {
      id: "pasb2-q6",
      question: "Completa: 'En esta empresa se ___ por competencias.'",
      options: [
        { value: "a", label: "evalúan" },
        { value: "b", label: "evalúa" },
        { value: "c", label: "evaluado" },
      ],
      correctAnswer: "b",
      explanation: "Impersonal con se: tercera persona singular.",
    },
    {
      id: "pasb2-q7",
      question: "Selecciona la reescritura más natural de 'Publicaron los resultados ayer'.",
      options: [
        { value: "a", label: "Se publicaron los resultados ayer." },
        { value: "b", label: "Se publicó los resultados ayer." },
        { value: "c", label: "Se recomienda publicar los resultados ayer." },
      ],
      correctAnswer: "a",
      explanation: "Pasiva con se y concordancia plural.",
    },
    {
      id: "pasb2-q8",
      question: "¿Cuál mantiene un registro más técnico-formal?",
      options: [
        { value: "a", label: "El equipo arregló todo." },
        { value: "b", label: "Se implementaron medidas correctivas." },
        { value: "c", label: "Nosotros lo cambiamos todo." },
      ],
      correctAnswer: "b",
      explanation: "La pasiva con se es frecuente en textos institucionales.",
    },
    {
      id: "pasb2-q9",
      question: "Completa: 'La norma ___ por consenso.' (pasiva perifrástica, presente)",
      options: [
        { value: "a", label: "es aprobada" },
        { value: "b", label: "se aprueban" },
        { value: "c", label: "se recomienda" },
      ],
      correctAnswer: "a",
      explanation: "Pasiva perifrástica en presente: es + participio.",
    },
    {
      id: "pasb2-q10",
      question: "¿Qué opción refleja mejor una recomendación institucional?",
      options: [
        { value: "a", label: "Se recomienda adjuntar la documentación completa." },
        { value: "b", label: "Se adjuntaron la documentación completa." },
        { value: "c", label: "Se adjuntan completar la documentación." },
      ],
      correctAnswer: "a",
      explanation: "Estructura impersonal formal y semánticamente correcta.",
    },
  ],
};
