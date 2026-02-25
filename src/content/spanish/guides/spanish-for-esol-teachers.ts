import type { InteractiveGuideContent } from "@/types/activity";

export const spanishForEsolTeachersContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "esol-intro",
      title: "Español para docentes ESOL: mirada contrastiva",
      icon: "👩‍🏫",
      explanation: `
        <h3>Objetivo</h3>
        <p>Esta guía está diseñada para docentes ESOL que desean usar su experiencia didáctica para acelerar su propio desarrollo en español.</p>
        <p>Trabajaremos desde una perspectiva contrastiva: cómo se organizan significado, forma y uso en inglés y en español, y cómo evitar transferencias problemáticas.</p>
      `,
      exercises: [
        {
          id: "sp-esol-1",
          title: "Autoperfil docente",
          instructions: "Identifica tus fortalezas de transferencia positiva.",
          items: [
            {
              type: "text",
              label: "Escribe dos áreas de tu práctica docente que pueden ayudarte en español.",
              acceptAnyAttempt: true,
            },
            {
              type: "radio",
              label: "En tu caso, ¿qué representa mayor reto inicial?",
              options: [
                { value: "a", label: "concordancia y género" },
                { value: "b", label: "organización del discurso" },
                { value: "c", label: "registro pragmático" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "esol-transferencia",
      stepNumber: 1,
      title: "Transferencia útil vs interferencia",
      icon: "🔁",
      explanation: `
        <h3>Punto clave para docentes</h3>
        <p>No toda comparación entre lenguas ayuda igual: algunas analogías aceleran aprendizaje y otras generan errores persistentes.</p>
        <ul>
          <li><strong>Transferencia útil:</strong> organizar enunciados por función comunicativa.</li>
          <li><strong>Interferencia:</strong> trasladar patrones morfosintácticos de forma directa.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-esol-2",
          title: "Clasifica casos",
          instructions: "Selecciona si el caso representa transferencia útil o interferencia.",
          items: [
            {
              type: "radio",
              label: "Usar marco de 'función + forma + uso' para planificar práctica oral.",
              options: [
                { value: "a", label: "transferencia útil" },
                { value: "b", label: "interferencia" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Omitir concordancia nominal porque en inglés no se marca igual.",
              options: [
                { value: "a", label: "transferencia útil" },
                { value: "b", label: "interferencia" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Describe una interferencia frecuente que observas en tu propio proceso.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "esol-diferencias",
      stepNumber: 2,
      title: "Diferencias estructurales de alto impacto",
      icon: "🧩",
      explanation: `
        <h3>Zonas críticas para docentes angloparlantes</h3>
        <ul>
          <li><strong>Concordancia:</strong> artículo + sustantivo + adjetivo.</li>
          <li><strong>Sistema verbal:</strong> contraste aspecto/tiempo más sensible al contexto.</li>
          <li><strong>Pronombres átonos:</strong> posición y función discursiva.</li>
          <li><strong>Registro:</strong> elección de usted/tú y estrategias de mitigación.</li>
        </ul>
      `,
      comparison: {
        title: "Áreas de contraste funcional",
        leftLabel: "Riesgo típico",
        rightLabel: "Estrategia docente aplicada al aprendizaje propio",
        rows: [
          {
            label: "Concordancia",
            left: "Subestimar género y número por transferencia del inglés.",
            right: "Diseñar rutinas de revisión morfológica por sintagma nominal.",
          },
          {
            label: "Tiempos/modos",
            left: "Elegir tiempo por traducción literal.",
            right: "Seleccionar forma según intención comunicativa y marco temporal.",
          },
          {
            label: "Pragmática",
            left: "Usar tono uniforme en toda audiencia.",
            right: "Mapear audiencia, distancia y propósito antes de redactar.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-esol-3",
          title: "Decisión pedagógica aplicada",
          instructions: "Escoge la estrategia más eficaz para cada dificultad.",
          items: [
            {
              type: "select",
              label: "Dificultad: errores recurrentes de concordancia en producción escrita.",
              options: [
                "Incrementar longitud de textos sin retroalimentación focalizada",
                "Aplicar rúbrica de control de sintagma nominal en cada borrador",
                "Evitar adjetivos para reducir error",
              ],
              expectedAnswer: "Aplicar rúbrica de control de sintagma nominal en cada borrador",
            },
            {
              type: "select",
              label: "Dificultad: selección inestable entre indicativo y subjuntivo.",
              options: [
                "Memorizar listas sin contexto",
                "Clasificar detonantes por intención y practicar con escenarios auténticos",
                "Evitar subordinación",
              ],
              expectedAnswer: "Clasificar detonantes por intención y practicar con escenarios auténticos",
            },
            {
              type: "text",
              label: "Propón una microsecuencia de 3 pasos para corregir una interferencia propia.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
    {
      id: "esol-produccion",
      stepNumber: 3,
      title: "Producción metalingüística aplicada",
      icon: "📝",
      explanation: `
        <h3>Tarea final</h3>
        <p>Redacta una reflexión profesional (160-220 palabras) donde expliques cómo tu experiencia ESOL puede mejorar tu aprendizaje de español y qué ajustes concretos implementarás.</p>
      `,
      exercises: [
        {
          id: "sp-esol-4",
          title: "Plan docente-aprendiz",
          instructions: "Construye un texto con diagnóstico, estrategia y métrica de progreso.",
          items: [
            {
              type: "text",
              label: "Diagnóstico de dos interferencias prioritarias:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Estrategia didáctica que transferirás a tu aprendizaje:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Indicador de avance para las próximas cuatro semanas:",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Versión final (160-220 palabras):",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "esol-q1",
      question: "¿Qué describe mejor el enfoque contrastivo para docentes ESOL?",
      options: [
        { value: "a", label: "Traducción palabra por palabra" },
        { value: "b", label: "Comparación funcional para tomar decisiones de forma y uso" },
        { value: "c", label: "Evitar toda referencia al inglés" },
      ],
      correctAnswer: "b",
      explanation: "La comparación útil guía decisiones comunicativas y reduce interferencia.",
    },
    {
      id: "esol-q2",
      question: "¿Qué caso es interferencia?",
      options: [
        { value: "a", label: "Aplicar marcos de función comunicativa" },
        { value: "b", label: "Ignorar concordancia nominal por transferencia del inglés" },
        { value: "c", label: "Planificar práctica contextual" },
      ],
      correctAnswer: "b",
      explanation: "Esa transferencia estructural genera error sistemático.",
    },
    {
      id: "esol-q3",
      question: "¿Qué estrategia mejora más la precisión verbal?",
      options: [
        { value: "a", label: "Elegir tiempo por traducción literal" },
        { value: "b", label: "Relacionar tiempo/modo con intención y marco temporal" },
        { value: "c", label: "Evitar subordinación" },
      ],
      correctAnswer: "b",
      explanation: "Alinea forma con función discursiva real.",
    },
    {
      id: "esol-q4",
      question: "¿Qué aporta una rúbrica focalizada en sintagma nominal?",
      options: [
        { value: "a", label: "Reduce control formal" },
        { value: "b", label: "Aumenta revisión de concordancia de forma sistemática" },
        { value: "c", label: "Elimina necesidad de retroalimentación" },
      ],
      correctAnswer: "b",
      explanation: "Permite monitoreo consistente de artículo-sustantivo-adjetivo.",
    },
    {
      id: "esol-q5",
      question: "En desarrollo C1-C2, ¿qué área pragmática es clave?",
      options: [
        { value: "a", label: "Mantener tono único" },
        { value: "b", label: "Ajustar registro según audiencia y propósito" },
        { value: "c", label: "Evitar mitigación" },
      ],
      correctAnswer: "b",
      explanation: "La adecuación pragmática es central en niveles avanzados.",
    },
    {
      id: "esol-q6",
      question: "¿Qué representa transferencia útil para una docente ESOL?",
      options: [
        { value: "a", label: "Aplicar secuenciación didáctica al autoaprendizaje" },
        { value: "b", label: "Copiar estructuras del inglés en español" },
        { value: "c", label: "Omitir contraste lingüístico" },
      ],
      correctAnswer: "a",
      explanation: "La experticia didáctica sí puede transferirse positivamente.",
    },
    {
      id: "esol-q7",
      question: "¿Qué decisión favorece corrección sostenida?",
      options: [
        { value: "a", label: "Corregir todo sin priorizar" },
        { value: "b", label: "Priorizar interferencias de alto impacto y medir progreso" },
        { value: "c", label: "Ignorar errores recurrentes" },
      ],
      correctAnswer: "b",
      explanation: "La priorización mejora eficiencia y seguimiento.",
    },
    {
      id: "esol-q8",
      question: "¿Qué práctica fortalece autonomía docente-aprendiz?",
      options: [
        { value: "a", label: "Registrar indicadores semanales de desempeño" },
        { value: "b", label: "Estudiar sin criterios de avance" },
        { value: "c", label: "Evitar autoevaluación" },
      ],
      correctAnswer: "a",
      explanation: "Permite ajustar estrategia con evidencia.",
    },
    {
      id: "esol-q9",
      question: "¿Cuál es una meta realista de cuatro semanas?",
      options: [
        { value: "a", label: "Perfección total en todos los niveles" },
        { value: "b", label: "Reducir un patrón de interferencia con criterio medible" },
        { value: "c", label: "No revisar producción" },
      ],
      correctAnswer: "b",
      explanation: "Metas acotadas y medibles facilitan progreso real.",
    },
    {
      id: "esol-q10",
      question: "¿Qué demuestra mejor integración de esta guía?",
      options: [
        { value: "a", label: "Descripción general sin plan" },
        { value: "b", label: "Diagnóstico + estrategia transferida + indicador de seguimiento" },
        { value: "c", label: "Solo lista de errores" },
      ],
      correctAnswer: "b",
      explanation: "Integra reflexión metalingüística y acción didáctica concreta.",
    },
  ],
};
