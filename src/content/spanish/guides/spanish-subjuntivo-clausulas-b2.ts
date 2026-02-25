import type { InteractiveGuideContent } from "@/types/activity";

export const spanishSubjuntivoClausulasB2Content: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "b2-subj-overview",
      title: "Subjuntivo en cláusulas sustantivas y adjetivas (B2)",
      icon: "🧠",
      explanation: `
        <h3>Objetivo B2</h3>
        <p>En B2, no basta con reconocer el subjuntivo: necesitas justificar por qué aparece y cómo cambia el sentido.</p>
        <p>En esta guía trabajarás:</p>
        <ul>
          <li>cláusulas sustantivas con verbos de influencia, valoración y duda,</li>
          <li>cláusulas adjetivas con antecedente indefinido/no existente,</li>
          <li>contrastes finos entre indicativo y subjuntivo.</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b2subj-1",
          title: "Diagnóstico inicial",
          instructions: "Identifica la opción más precisa.",
          items: [
            {
              type: "radio",
              label: "Busco una persona que ___ experiencia en mediación.",
              options: [
                { value: "a", label: "tiene" },
                { value: "b", label: "tenga" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Sé que Ana ___ bien el tema.",
              options: [
                { value: "a", label: "comprende" },
                { value: "b", label: "comprenda" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "b2-subj-sustantivas",
      stepNumber: 1,
      title: "Cláusulas sustantivas: voluntad, valoración y duda",
      icon: "🧩",
      explanation: `
        <h3>Estructura base</h3>
        <p><strong>Verbo principal + que + subjuntivo</strong> cuando hay influencia, recomendación, emoción o duda.</p>
        <ul>
          <li><em>Insisto en que revisen el informe.</em></li>
          <li><em>Es esencial que el equipo mantenga la calma.</em></li>
          <li><em>Dudo que la propuesta sea viable sin ajustes.</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-b2subj-2",
          title: "Selecciona y justifica",
          instructions: "Elige la forma correcta y piensa en el detonante.",
          items: [
            {
              type: "select",
              label: "Es recomendable que ustedes ___ la agenda antes de la reunión.",
              options: ["revisan", "revisen"],
              expectedAnswer: "revisen",
            },
            {
              type: "select",
              label: "No creemos que esa medida ___ suficiente.",
              options: ["es", "sea"],
              expectedAnswer: "sea",
            },
            {
              type: "text",
              label: "Completa: Me alegra que tú ___ (poder) participar.",
              correctAnswer: "puedas",
              expectedAnswers: ["puedas"],
            },
          ],
        },
      ],
    },
    {
      id: "b2-subj-adjetivas",
      stepNumber: 2,
      title: "Cláusulas adjetivas: antecedente específico vs no específico",
      icon: "🔎",
      explanation: `
        <h3>Decisión clave</h3>
        <p>En relativas, el modo depende del antecedente:</p>
        <ul>
          <li><strong>Indicativo</strong>: antecedente conocido/específico. <em>Tengo un colega que trabaja en ese área.</em></li>
          <li><strong>Subjuntivo</strong>: antecedente inexistente, hipotético o no identificado. <em>Busco un colega que trabaje en ese área.</em></li>
        </ul>
      `,
      comparison: {
        title: "Contraste de sentido",
        leftLabel: "Indicativo (referencia concreta)",
        rightLabel: "Subjuntivo (referencia no concreta)",
        rows: [
          {
            label: "Disponibilidad",
            left: "Necesito a alguien que puede empezar hoy. (sé quién es)",
            right: "Necesito a alguien que pueda empezar hoy. (aún no identificado)",
          },
          {
            label: "Existencia",
            left: "Conozco una empresa que ofrece ese servicio.",
            right: "Busco una empresa que ofrezca ese servicio.",
          },
        ],
      },
      exercises: [
        {
          id: "sp-b2subj-3",
          title: "Define el referente",
          instructions: "Escoge indicativo o subjuntivo según el contexto.",
          items: [
            {
              type: "select",
              label: "Buscamos un proveedor que ___ entregas rápidas.",
              options: ["garantiza", "garantice"],
              expectedAnswer: "garantice",
            },
            {
              type: "select",
              label: "Tenemos un proveedor que ___ entregas rápidas.",
              options: ["garantiza", "garantice"],
              expectedAnswer: "garantiza",
            },
            {
              type: "text",
              label: "Completa: ¿Hay alguien que ___ (saber) resolver esto hoy?",
              correctAnswer: "sepa",
              expectedAnswers: ["sepa"],
            },
          ],
        },
      ],
    },
    {
      id: "b2-subj-produccion",
      stepNumber: 3,
      title: "Producción argumentativa B2",
      icon: "🗣️",
      explanation: `
        <h3>Integración en discurso</h3>
        <p>Escribe argumentos breves combinando cláusulas sustantivas y adjetivas.</p>
        <p>Objetivo: precisión gramatical + coherencia lógica + matiz discursivo.</p>
      `,
      exercises: [
        {
          id: "sp-b2subj-4",
          title: "Microargumentos",
          instructions: "Responde con 2-3 oraciones por punto.",
          items: [
            {
              type: "text",
              label: "Plantea una recomendación institucional con 'Es fundamental que...'.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Describe el perfil de una persona que tu equipo todavía no ha encontrado.",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Redacta una duda razonada sobre una propuesta y su viabilidad.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "b2subj-q1",
      question: "¿Qué oración exige subjuntivo en la subordinada?",
      options: [
        { value: "a", label: "Sé que el informe está listo." },
        { value: "b", label: "Dudo que el informe esté listo." },
        { value: "c", label: "El informe está listo." },
      ],
      correctAnswer: "b",
      explanation: "La duda activa subjuntivo.",
    },
    {
      id: "b2subj-q2",
      question: "Completa: 'Es imprescindible que nosotros ___ (actuar) hoy.'",
      options: [
        { value: "a", label: "actuamos" },
        { value: "b", label: "actuemos" },
        { value: "c", label: "actuar" },
      ],
      correctAnswer: "b",
      explanation: "Valoración impersonal + que requiere subjuntivo.",
    },
    {
      id: "b2subj-q3",
      question: "Elige la mejor opción: 'Busco una candidata que ___ experiencia internacional.'",
      options: [
        { value: "a", label: "tiene" },
        { value: "b", label: "tenga" },
        { value: "c", label: "tener" },
      ],
      correctAnswer: "b",
      explanation: "Antecedente no identificado: subjuntivo.",
    },
    {
      id: "b2subj-q4",
      question: "¿Cuál indica referente específico?",
      options: [
        { value: "a", label: "Quiero un técnico que entienda este sistema." },
        { value: "b", label: "Tengo un técnico que entiende este sistema." },
        { value: "c", label: "Buscamos un técnico que entienda este sistema." },
      ],
      correctAnswer: "b",
      explanation: "Tengo + referente concreto suele ir con indicativo.",
    },
    {
      id: "b2subj-q5",
      question: "Completa: 'No pensamos que la estrategia ___ suficiente.'",
      options: [
        { value: "a", label: "es" },
        { value: "b", label: "sea" },
        { value: "c", label: "ser" },
      ],
      correctAnswer: "b",
      explanation: "Negación de pensamiento favorece subjuntivo.",
    },
    {
      id: "b2subj-q6",
      question: "Selecciona la forma correcta: 'Conozco una empresa que ___ ese software.'",
      options: [
        { value: "a", label: "desarrolla" },
        { value: "b", label: "desarrolle" },
        { value: "c", label: "desarrollar" },
      ],
      correctAnswer: "a",
      explanation: "Empresa conocida/específica: indicativo.",
    },
    {
      id: "b2subj-q7",
      question: "¿Qué detonante se asocia más con subjuntivo?",
      options: [
        { value: "a", label: "Es evidente que" },
        { value: "b", label: "Es posible que" },
        { value: "c", label: "Está claro que" },
      ],
      correctAnswer: "b",
      explanation: "Posibilidad/incertidumbre suele requerir subjuntivo.",
    },
    {
      id: "b2subj-q8",
      question: "Completa: 'Necesitamos a alguien que ___ (poder) mediar entre áreas.'",
      options: [
        { value: "a", label: "puede" },
        { value: "b", label: "pueda" },
        { value: "c", label: "poder" },
      ],
      correctAnswer: "b",
      explanation: "Perfil no identificado: subjuntivo.",
    },
    {
      id: "b2subj-q9",
      question: "¿Cuál expresa mejor recomendación formal?",
      options: [
        { value: "a", label: "Sugiero que revisamos el protocolo." },
        { value: "b", label: "Sugiero que revisemos el protocolo." },
        { value: "c", label: "Sugiero revisaríamos el protocolo." },
      ],
      correctAnswer: "b",
      explanation: "Verbo de recomendación + que + subjuntivo.",
    },
    {
      id: "b2subj-q10",
      question: "Elige la opción más precisa para una búsqueda abierta.",
      options: [
        { value: "a", label: "Buscamos una solución que reduce costos sin afectar calidad." },
        { value: "b", label: "Buscamos una solución que reduzca costos sin afectar calidad." },
        { value: "c", label: "Buscamos una solución que reducir costos sin afectar calidad." },
      ],
      correctAnswer: "b",
      explanation: "Antecedente no definido en objetivo de búsqueda: subjuntivo.",
    },
  ],
};
