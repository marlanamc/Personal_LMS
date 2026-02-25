import type { InteractiveGuideContent } from "@/types/activity";

export const spanishConectoresPersuasionC1Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "conn-intro",
      title: "Conectores avanzados y discurso persuasivo (C1)",
      icon: "🧵",
      explanation: `
        <h3>Objetivo C1</h3>
        <p>En C1, los conectores no solo unen frases: organizan jerarquías de ideas, matizan postura y guían la persuasión.</p>
        <p>Trabajarás tres funciones clave:</p>
        <ul>
          <li>organizar argumento (estructura macro),</li>
          <li>modular fuerza argumentativa (matiz),</li>
          <li>integrar objeciones y contraargumentos con control.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1con-1",
          title: "Diagnóstico funcional",
          instructions: "Identifica la función principal del conector.",
          items: [
            {
              type: "radio",
              label: "'No obstante, los resultados siguen siendo insuficientes.'",
              options: [
                { value: "a", label: "adición" },
                { value: "b", label: "contraste" },
                { value: "c", label: "causa" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "'Por consiguiente, conviene revisar el plan.'",
              options: [
                { value: "a", label: "consecuencia" },
                { value: "b", label: "ejemplificación" },
                { value: "c", label: "concesión" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "conn-bloques",
      stepNumber: 1,
      title: "Bloques de conectores y jerarquía argumentativa",
      icon: "🧱",
      explanation: `
        <h3>Seleccionar conector según intención</h3>
        <ul>
          <li><strong>Ordenar:</strong> en primer lugar, por otra parte, finalmente</li>
          <li><strong>Causar/concluir:</strong> dado que, por ende, de ahí que</li>
          <li><strong>Conceder/contrastar:</strong> aun así, sin embargo, con todo</li>
          <li><strong>Reformular:</strong> es decir, en otras palabras, dicho de otro modo</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1con-2",
          title: "Elige el conector de mayor precisión",
          instructions: "Selecciona la opción más coherente con el razonamiento.",
          items: [
            {
              type: "select",
              label: "La propuesta reduce costos; ___, aumenta la carga inicial del equipo.",
              options: ["sin embargo", "por consiguiente", "en síntesis"],
              expectedAnswer: "sin embargo",
            },
            {
              type: "select",
              label: "Los datos son consistentes; ___, la hipótesis se refuerza.",
              options: ["por ende", "no obstante", "en cambio"],
              expectedAnswer: "por ende",
            },
            {
              type: "text",
              label: "Completa con reformulación: " +
                "El modelo requiere ajustes; ___, no puede aplicarse sin adaptación local.",
              correctAnswer: "es decir",
              expectedAnswers: ["es decir", "dicho de otro modo", "en otras palabras"],
            },
          ],
        },
      ],
    },
    {
      id: "conn-objeciones",
      stepNumber: 2,
      title: "Integrar objeciones sin perder tesis",
      icon: "⚖️",
      explanation: `
        <h3>Concesión estratégica</h3>
        <p>En discurso persuasivo C1, conceder parcialmente puede fortalecer tu postura si mantienes la línea argumental.</p>
        <p>Patrones útiles:</p>
        <ul>
          <li><em>Aunque X, Y.</em></li>
          <li><em>Si bien X, conviene Y.</em></li>
          <li><em>Aun cuando X, se sostiene que Y.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1con-3",
          title: "Concesión y reencuadre",
          instructions: "Reescribe cada idea incorporando concesión y tesis.",
          items: [
            {
              type: "text",
              label: "Base: 'La implementación es costosa. Debe hacerse'. Reescribe con 'si bien'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Base: 'Hay resistencia inicial. El cambio sigue siendo necesario'. Reescribe con 'aun así'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Redacta una objeción y respóndela en dos oraciones enlazadas.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "conn-produccion",
      stepNumber: 3,
      title: "Producción persuasiva C1",
      icon: "📝",
      explanation: `
        <h3>Microtexto argumentativo</h3>
        <p>Redacta un texto breve (140-180 palabras) defendiendo una propuesta concreta con estructura clara.</p>
        <p>Debe incluir:</p>
        <ul>
          <li>tesis explícita,</li>
          <li>2 conectores de contraste,</li>
          <li>2 conectores de consecuencia,</li>
          <li>1 bloque de concesión controlada.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-c1con-4",
          title: "Plan y redacción",
          instructions: "Construye y luego integra una versión final.",
          items: [
            {
              type: "text",
              label: "Tesis en una oración:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Argumento 1 con conector de consecuencia:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Concesión + recuperación de tesis:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final (140-180 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "resumen-conectores-persuasion",
      stepNumber: 4,
      title: "Resumen: conectores persuasivos",
      icon: "📋",
      explanation: `
        <h3>Visión general</h3>
        <p><strong>Contraste:</strong> sin embargo, no obstante, en cambio. <strong>Consecuencia:</strong> por lo tanto, de ahí que. <strong>Concesión:</strong> aunque, si bien. <strong>Reformulación:</strong> es decir, en otras palabras. Ordenar el discurso con claridad para persuadir.</p>
      `,
      exercises: [
        {
          id: "sp-c1con-quickref",
          title: "Identifica",
          instructions: "Elige el conector adecuado.",
          items: [
            { type: "radio", label: "Para expresar contraste: ___", options: [{ value: "a", label: "sin embargo" }, { value: "b", label: "por ejemplo" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "errores-conectores-persuasion",
      stepNumber: 5,
      title: "Errores frecuentes",
      icon: "⚠️",
      explanation: `
        <h3>Evitar</h3>
        <p>Acumular conectores de contraste sin desarrollo. Usar conectores de consecuencia sin relación causal clara. No recuperar la tesis tras una concesión.</p>
      `,
      exercises: [
        {
          id: "sp-c1con-mistakes",
          title: "¿Correcto?",
          instructions: "Elige la opción correcta.",
          items: [
            { type: "radio", label: "De ahí que introduce ___", options: [{ value: "a", label: "consecuencia" }, { value: "b", label: "contraste" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "c1con-q1",
      question: "¿Qué conector expresa contraste fuerte?",
      options: [
        { value: "a", label: "por ende" },
        { value: "b", label: "sin embargo" },
        { value: "c", label: "por ejemplo" },
      ],
      correctAnswer: "b",
      explanation: "Sin embargo marca oposición/contraste.",
    },
    {
      id: "c1con-q2",
      question: "Selecciona el conector de consecuencia.",
      options: [
        { value: "a", label: "de ahí que" },
        { value: "b", label: "no obstante" },
        { value: "c", label: "en cambio" },
      ],
      correctAnswer: "a",
      explanation: "De ahí que proyecta relación causal-conclusiva.",
    },
    {
      id: "c1con-q3",
      question: "¿Qué opción reformula una idea previa?",
      options: [
        { value: "a", label: "en otras palabras" },
        { value: "b", label: "por el contrario" },
        { value: "c", label: "además" },
      ],
      correctAnswer: "a",
      explanation: "Es un marcador clásico de reformulación.",
    },
    {
      id: "c1con-q4",
      question: "Completa: 'Los indicadores mejoraron; ___, la hipótesis inicial se confirma'.",
      options: [
        { value: "a", label: "por consiguiente" },
        { value: "b", label: "a pesar de" },
        { value: "c", label: "en cambio" },
      ],
      correctAnswer: "a",
      explanation: "La frase necesita consecuencia lógica.",
    },
    {
      id: "c1con-q5",
      question: "¿Cuál integra concesión de forma adecuada?",
      options: [
        { value: "a", label: "Aunque existe resistencia, la medida sigue siendo pertinente." },
        { value: "b", label: "Aunque existe resistencia, por ejemplo." },
        { value: "c", label: "Aunque existe resistencia, además también." },
      ],
      correctAnswer: "a",
      explanation: "Concede una dificultad y mantiene la tesis.",
    },
    {
      id: "c1con-q6",
      question: "Elige la opción con mejor coherencia discursiva.",
      options: [
        { value: "a", label: "Primero, no obstante, finalmente, por ejemplo." },
        { value: "b", label: "En primer lugar..., por otra parte..., por ende..., en síntesis..." },
        { value: "c", label: "Además, aunque, por lo tanto, y." },
      ],
      correctAnswer: "b",
      explanation: "Hay secuencia funcional y progresión argumentativa.",
    },
    {
      id: "c1con-q7",
      question: "¿Qué error debilita más un texto persuasivo C1?",
      options: [
        { value: "a", label: "Repetir el mismo conector en cada oración" },
        { value: "b", label: "Combinar contraste y consecuencia" },
        { value: "c", label: "Incluir una concesión" },
      ],
      correctAnswer: "a",
      explanation: "La baja variedad reduce precisión y control retórico.",
    },
    {
      id: "c1con-q8",
      question: "¿Qué función cumple 'si bien' en argumentación?",
      options: [
        { value: "a", label: "introducir ejemplo" },
        { value: "b", label: "introducir concesión" },
        { value: "c", label: "cerrar conclusión" },
      ],
      correctAnswer: "b",
      explanation: "Si bien permite reconocer un punto sin abandonar la tesis.",
    },
    {
      id: "c1con-q9",
      question: "Elige el cierre más persuasivo.",
      options: [
        { value: "a", label: "En síntesis, conviene implementar el plan con fases y seguimiento continuo." },
        { value: "b", label: "Bueno, eso sería todo." },
        { value: "c", label: "Y ya está." },
      ],
      correctAnswer: "a",
      explanation: "Cierra con conclusión accionable y tono formal.",
    },
    {
      id: "c1con-q10",
      question: "¿Qué demuestra mayor control C1?",
      options: [
        { value: "a", label: "Elegir conectores por costumbre" },
        { value: "b", label: "Elegir conectores según función, audiencia y efecto argumentativo" },
        { value: "c", label: "Evitar conectores para sonar natural" },
      ],
      correctAnswer: "b",
      explanation: "El control C1 es funcional, estratégico y pragmático.",
    },
  ],
};
