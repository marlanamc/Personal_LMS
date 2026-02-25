import type { InteractiveGuideContent } from "@/types/activity";

export const spanishNounGenderArticlesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "gender-basics",
      title: "Noun Gender in Spanish (A1 Core)",
      icon: "⚖️",
      explanation: `
        <h3>Every Noun Is Masculine or Feminine</h3>
        <p>In Spanish, nouns usually belong to a grammatical gender. This affects articles and adjectives.</p>
        <p>General pattern:</p>
        <ul>
          <li><strong>-o</strong> endings are often masculine: <em>el libro</em></li>
          <li><strong>-a</strong> endings are often feminine: <em>la casa</em></li>
        </ul>
        <p>There are exceptions, so learn common nouns with their article.</p>
      `,
      exercises: [
        {
          id: "sp-gender-1",
          title: "Masculine or Feminine?",
          instructions: "Choose the correct gender category.",
          items: [
            {
              type: "radio",
              label: "<strong>la mesa</strong>",
              options: [
                { value: "m", label: "Masculine" },
                { value: "f", label: "Feminine" },
              ],
              expectedAnswer: "f",
            },
            {
              type: "radio",
              label: "<strong>el problema</strong>",
              options: [
                { value: "m", label: "Masculine" },
                { value: "f", label: "Feminine" },
              ],
              expectedAnswer: "m",
            },
          ],
        },
      ],
    },
    {
      id: "definite-indefinite-articles",
      stepNumber: 1,
      title: "Definite and Indefinite Articles",
      icon: "🧩",
      explanation: `
        <h3>The Basic Article System</h3>
        <p>Definite = "the" and indefinite = "a/an/some".</p>
      `,
      comparison: {
        title: "Article Chart",
        leftLabel: "Singular",
        rightLabel: "Plural",
        rows: [
          { label: "Masculine (the)", left: "el", right: "los" },
          { label: "Feminine (the)", left: "la", right: "las" },
          { label: "Masculine (a/some)", left: "un", right: "unos" },
          { label: "Feminine (a/some)", left: "una", right: "unas" },
        ],
      },
      usageMeanings: [
        {
          title: "✅ Correct Pairing",
          description: "Match noun gender/number with the right article.",
          examples: [
            {
              sentence: "<strong>el</strong> libro / <strong>los</strong> libros",
              explanation: "Masculine singular and plural.",
            },
            {
              sentence: "<strong>la</strong> profesora / <strong>las</strong> profesoras",
              explanation: "Feminine singular and plural.",
            },
            {
              sentence: "<strong>un</strong> café / <strong>una</strong> pizza",
              explanation: "Indefinite forms agree too.",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-gender-articles-2",
          title: "Choose the Correct Article",
          instructions: "Select the best article.",
          items: [
            {
              type: "select",
              label: "___ escuela",
              options: ["el", "la", "los", "un"],
              expectedAnswer: "la",
            },
            {
              type: "select",
              label: "___ estudiantes (mixed group)",
              options: ["las", "la", "los", "unas"],
              expectedAnswer: "los",
            },
            {
              type: "select",
              label: "___ mesas",
              options: ["el", "unas", "un", "los"],
              expectedAnswer: "unas",
            },
          ],
        },
      ],
    },
    {
      id: "agreement-with-adjectives",
      stepNumber: 2,
      title: "Agreement with Adjectives",
      icon: "🎨",
      explanation: `
        <h3>Adjectives Must Agree Too</h3>
        <p>Adjectives usually match noun gender and number:</p>
        <ul>
          <li>masculine singular: <strong>alto</strong></li>
          <li>feminine singular: <strong>alta</strong></li>
          <li>masculine plural: <strong>altos</strong></li>
          <li>feminine plural: <strong>altas</strong></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-gender-adj-3",
          title: "Fix the Agreement",
          instructions: "Write the correct adjective form.",
          items: [
            {
              type: "text",
              label: "La casa es bonit__.",
              correctAnswer: "bonita",
              expectedAnswers: ["bonita"],
            },
            {
              type: "text",
              label: "Los carros son rápid__.",
              correctAnswer: "rápidos",
              expectedAnswers: ["rápidos", "rapidos"],
            },
            {
              type: "text",
              label: "Las clases son interesant__.",
              correctAnswer: "interesantes",
              expectedAnswers: ["interesantes"],
            },
          ],
        },
      ],
    },
    {
      id: "common-exceptions",
      stepNumber: 3,
      title: "Useful Exceptions You Must Know",
      icon: "📌",
      explanation: `
        <h3>High-Frequency Exceptions</h3>
        <p>Some nouns break the common endings pattern. Learn these as chunks:</p>
        <ul>
          <li><strong>el día</strong> (masculine, ends in -a)</li>
          <li><strong>el mapa</strong> (masculine, ends in -a)</li>
          <li><strong>la mano</strong> (feminine, ends in -o)</li>
          <li><strong>la foto</strong> (short for fotografía, feminine)</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-gender-exceptions-4",
          title: "Exception Drill",
          instructions: "Pick the correct article.",
          items: [
            {
              type: "radio",
              label: "___ mano",
              options: [
                { value: "el", label: "el" },
                { value: "la", label: "la" },
              ],
              expectedAnswer: "la",
            },
            {
              type: "radio",
              label: "___ mapa",
              options: [
                { value: "el", label: "el" },
                { value: "la", label: "la" },
              ],
              expectedAnswer: "el",
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "gender-q1",
      question: "Which pair is correct for feminine plural definite article?",
      options: [
        { value: "a", label: "las" },
        { value: "b", label: "los" },
        { value: "c", label: "unas" },
      ],
      correctAnswer: "a",
      explanation: "Las is the feminine plural form of 'the'.",
    },
    {
      id: "gender-q2",
      question: "Which is correct?",
      options: [
        { value: "a", label: "el mano" },
        { value: "b", label: "la mano" },
        { value: "c", label: "una manoes" },
      ],
      correctAnswer: "b",
      explanation: "Mano is a common feminine exception.",
    },
    {
      id: "gender-q3",
      question: "Choose the correct phrase:",
      options: [
        { value: "a", label: "los casas blancas" },
        { value: "b", label: "las casas blancas" },
        { value: "c", label: "la casas blancas" },
      ],
      correctAnswer: "b",
      explanation: "Article + noun + adjective must all agree in gender/number.",
    },
    {
      id: "gender-q4",
      question: "What is the indefinite masculine singular article?",
      options: [
        { value: "a", label: "una" },
        { value: "b", label: "el" },
        { value: "c", label: "un" },
      ],
      correctAnswer: "c",
      explanation: "Un is masculine singular indefinite article.",
    },
    {
      id: "gender-q5",
      question: "Which noun is usually feminine?",
      options: [
        { value: "a", label: "la escuela" },
        { value: "b", label: "el libro" },
        { value: "c", label: "el problema" },
      ],
      correctAnswer: "a",
      explanation: "Escuela is feminine and uses la.",
    },
    {
      id: "gender-q6",
      question: "Which is an exception ending in -a but masculine?",
      options: [
        { value: "a", label: "la mano" },
        { value: "b", label: "el mapa" },
        { value: "c", label: "la foto" },
      ],
      correctAnswer: "b",
      explanation: "Mapa is masculine despite ending in -a.",
    },
  ],
};
