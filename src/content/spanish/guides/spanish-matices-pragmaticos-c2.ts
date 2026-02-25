import type { InteractiveGuideContent } from "@/types/activity";

export const spanishMaticesPragmaticosC2Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "c2prag-intro",
      title: "Matices pragmáticos: intención, tono e implicatura (C2)",
      icon: "🧭",
      explanation: `
        <h3>Objetivo C2</h3>
        <p>En C2, el dominio no se limita a la corrección gramatical: exige interpretar y producir significado implícito según contexto, relación interpersonal y propósito comunicativo.</p>
        <p>En esta guía trabajarás:</p>
        <ul>
          <li>distinción entre contenido literal e intención pragmática,</li>
          <li>ajuste fino de tono (diplomático, crítico, colaborativo),</li>
          <li>lectura de implicaturas en intercambios profesionales.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c2prag-1",
          title: "Lectura de intención",
          instructions: "Selecciona la intención más probable según el contexto.",
          items: [
            {
              type: "radio",
              label: "'Interesante propuesta; quizá convendría revisar la viabilidad presupuestaria.'",
              options: [
                { value: "a", label: "aceptación plena e inmediata" },
                { value: "b", label: "rechazo frontal" },
                { value: "c", label: "desacuerdo mitigado con apertura a ajustes" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "'Tomamos nota y volvemos sobre esto en la próxima sesión.'",
              options: [
                { value: "a", label: "cierre temporal con posible postergación" },
                { value: "b", label: "implementación inmediata" },
                { value: "c", label: "acuerdo definitivo" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "c2prag-tono",
      stepNumber: 1,
      title: "Tono y distancia interpersonal",
      icon: "🎚️",
      explanation: `
        <h3>Microdecisiones de alto impacto</h3>
        <p>La elección entre formas directas o mitigadas cambia percepción de cooperación, autoridad y cuidado relacional.</p>
        <ul>
          <li><strong>Directo:</strong> útil para urgencia clara, pero puede sonar brusco.</li>
          <li><strong>Mitigado:</strong> mejora recepción en contextos sensibles.</li>
          <li><strong>Diplomático:</strong> protege vínculo sin ocultar el mensaje central.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c2prag-2",
          title: "Selecciona el tono óptimo",
          instructions: "Elige la alternativa más eficaz para el escenario indicado.",
          items: [
            {
              type: "select",
              label: "Escenario: feedback delicado a colega con alta experiencia.",
              options: [
                "Esto está mal, corrígelo.",
                "Me preocupa que este enfoque limite el alcance; quizá podríamos explorar una variante.",
                "No sirve.",
              ],
              expectedAnswer:
                "Me preocupa que este enfoque limite el alcance; quizá podríamos explorar una variante.",
            },
            {
              type: "select",
              label: "Escenario: instrucción urgente de seguridad.",
              options: [
                "Cuando te venga bien, quizá puedas revisar la salida de emergencia.",
                "Detengan la operación ahora y evacúen por la salida señalada.",
                "Tal vez después revisemos seguridad.",
              ],
              expectedAnswer: "Detengan la operación ahora y evacúen por la salida señalada.",
            },
            {
              type: "text",
              label: "Reformula en tono diplomático: 'Tu informe está confuso'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c2prag-implicatura",
      stepNumber: 2,
      title: "Implicaturas y lectura entre líneas",
      icon: "🔎",
      explanation: `
        <h3>Del dicho al querido decir</h3>
        <p>En interacciones reales, parte del significado se inferirá por contexto, antecedentes y expectativas compartidas.</p>
        <p>Ejemplo: <em>'Podríamos retomarlo más adelante'</em> puede funcionar como aplazamiento estratégico, no como compromiso firme.</p>
      `,
      exercises: [
        {
          id: "sp-c2prag-3",
          title: "Inferencia pragmática",
          instructions: "Elige la inferencia más plausible.",
          items: [
            {
              type: "radio",
              label: "'Agradecemos tu entusiasmo; quizá no sea el mejor momento para ampliar el alcance.'",
              options: [
                { value: "a", label: "aprobación total de la ampliación" },
                { value: "b", label: "freno estratégico sin cerrar totalmente la puerta" },
                { value: "c", label: "confirmación de recursos disponibles" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "'Podemos considerarlo en una segunda fase'.",
              options: [
                { value: "a", label: "implementación en la fase actual" },
                { value: "b", label: "aplazamiento condicionado" },
                { value: "c", label: "rechazo explícito e irreversible" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Escribe una respuesta que mantenga relación colaborativa ante una objeción implícita.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "c2prag-produccion",
      stepNumber: 3,
      title: "Producción C2 con control pragmático",
      icon: "📝",
      explanation: `
        <h3>Mensaje multicapas</h3>
        <p>Redacta tres versiones del mismo mensaje: una para dirección, otra para pares y otra para cliente externo, manteniendo intención y ajustando tono.</p>
      `,
      exercises: [
        {
          id: "sp-c2prag-4",
          title: "Triple adaptación",
          instructions: "Mantén el contenido base y varía estrategia pragmática.",
          items: [
            {
              type: "text",
              label: "Versión para dirección (breve, estratégica):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión para pares (colaborativa):",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión para cliente externo (diplomática y clara):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c2prag-q1",
      question: "¿Qué distingue mejor el control pragmático C2?",
      options: [
        { value: "a", label: "Solo precisión gramatical" },
        { value: "b", label: "Ajuste de intención, tono e inferencia según contexto" },
        { value: "c", label: "Uso constante de lenguaje neutro" },
      ],
      correctAnswer: "b",
      explanation: "C2 integra forma lingüística y estrategia interpersonal.",
    },
    {
      id: "c2prag-q2",
      question: "¿Qué lectura es más plausible de 'lo retomamos más adelante'?",
      options: [
        { value: "a", label: "compromiso de ejecución inmediata" },
        { value: "b", label: "aplazamiento no necesariamente definitivo" },
        { value: "c", label: "aceptación sin condiciones" },
      ],
      correctAnswer: "b",
      explanation: "Suele funcionar como posposición estratégica.",
    },
    {
      id: "c2prag-q3",
      question: "En feedback sensible, ¿qué estrategia suele ser más eficaz?",
      options: [
        { value: "a", label: "crítica frontal sin mitigación" },
        { value: "b", label: "mitigación con foco en mejora concreta" },
        { value: "c", label: "silencio total" },
      ],
      correctAnswer: "b",
      explanation: "Protege relación sin perder claridad.",
    },
    {
      id: "c2prag-q4",
      question: "¿Qué opción muestra tono diplomático?",
      options: [
        { value: "a", label: "Eso no funciona, cámbialo." },
        { value: "b", label: "Podría ser útil revisar este punto para fortalecer la propuesta." },
        { value: "c", label: "Está mal y listo." },
      ],
      correctAnswer: "b",
      explanation: "Mantiene orientación a mejora y reduce fricción.",
    },
    {
      id: "c2prag-q5",
      question: "¿Cuál es una implicatura frecuente en contextos institucionales?",
      options: [
        { value: "a", label: "todo se expresa siempre de forma literal" },
        { value: "b", label: "ciertas reservas se comunican de forma indirecta" },
        { value: "c", label: "no existe ambigüedad funcional" },
      ],
      correctAnswer: "b",
      explanation: "La indirectividad puede cumplir funciones de cortesía y gestión.",
    },
    {
      id: "c2prag-q6",
      question: "¿Qué factor pesa más al ajustar registro pragmático?",
      options: [
        { value: "a", label: "solo longitud del mensaje" },
        { value: "b", label: "relación entre interlocutores y objetivo comunicativo" },
        { value: "c", label: "preferencias personales aisladas" },
      ],
      correctAnswer: "b",
      explanation: "La adecuación depende de vínculo, propósito y contexto.",
    },
    {
      id: "c2prag-q7",
      question: "¿Qué error indica bajo control pragmático?",
      options: [
        { value: "a", label: "mantener consistencia de tono" },
        { value: "b", label: "usar el mismo tono para todas las audiencias" },
        { value: "c", label: "modular fuerza argumentativa" },
      ],
      correctAnswer: "b",
      explanation: "Ignora diferencias contextuales clave.",
    },
    {
      id: "c2prag-q8",
      question: "¿Qué opción conserva desacuerdo sin ruptura relacional?",
      options: [
        { value: "a", label: "Tu enfoque no tiene sentido." },
        { value: "b", label: "Entiendo el punto; no obstante, veo riesgos que convendría revisar." },
        { value: "c", label: "No." },
      ],
      correctAnswer: "b",
      explanation: "Combina reconocimiento y contraste razonado.",
    },
    {
      id: "c2prag-q9",
      question: "¿Qué demuestra desempeño C2 en esta área?",
      options: [
        { value: "a", label: "evitar toda inferencia" },
        { value: "b", label: "manejar literalidad e implicatura con intención estratégica" },
        { value: "c", label: "usar siempre formulaciones rígidas" },
      ],
      correctAnswer: "b",
      explanation: "Integra lectura contextual y producción calibrada.",
    },
    {
      id: "c2prag-q10",
      question: "¿Qué elección es más adecuada para cliente externo ante retraso?",
      options: [
        { value: "a", label: "No llegamos, esperen." },
        { value: "b", label: "Lamentamos la demora; proponemos este ajuste de plazos con seguimiento semanal." },
        { value: "c", label: "Fue culpa de otros." },
      ],
      correctAnswer: "b",
      explanation: "Asume responsabilidad comunicativa y ofrece solución concreta.",
    },
  ],
};
