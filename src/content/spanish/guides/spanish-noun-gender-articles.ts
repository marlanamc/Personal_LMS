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
    {
      id: "quick-reference",
      stepNumber: 4,
      title: "Quick Reference: Articles",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Definite:</strong> el, la, los, las (the). <strong>Indefinite:</strong> un, una, unos, unas (a/some).</p>
        <p>Article and adjective agree with the noun in gender and number. Learn nouns with their article (el libro, la casa) to avoid mistakes.</p>
      `,
      exercises: [
        {
          id: "sp-gender-quick-ref",
          title: "Choose the Article",
          instructions: "Pick the correct form.",
          items: [
            {
              type: "radio",
              label: "___ casas (the houses)",
              options: [
                { value: "las", label: "las" },
                { value: "los", label: "los" },
              ],
              expectedAnswer: "las",
            },
            {
              type: "radio",
              label: "___ problema (the problem)",
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
    {
      id: "common-mistakes",
      stepNumber: 5,
      title: "Common Mistakes with Gender",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <ul>
          <li><strong>Assuming -o = masculine, -a = feminine</strong> — el día, el mapa, la mano, la foto are exceptions.</li>
          <li><strong>Using el/la with adjectives only</strong> — The article agrees with the noun (la casa blanca, not la casa blanco).</li>
          <li><strong>Forgetting plural agreement</strong> — unos libros, unas mesas; adjective must match (libros interesantes, mesas grandes).</li>
        </ul>
      `,
      tipBox: {
        title: "Tip",
        content: "When in doubt, learn the noun with its article: el agua, la mano. It sticks better.",
      },
      exercises: [
        {
          id: "sp-gender-mistakes",
          title: "Spot the Error",
          instructions: "Which sentence is wrong?",
          items: [
            {
              type: "radio",
              label: "Which is correct?",
              options: [
                { value: "a", label: "la mano" },
                { value: "b", label: "el mano" },
              ],
              expectedAnswer: "a",
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
    {
      id: "gender-q7",
      question: "Choose the correct plural phrase:",
      options: [
        { value: "a", label: "unos libros interesantes" },
        { value: "b", label: "unas libros interesantes" },
        { value: "c", label: "unos libro interesantes" },
      ],
      correctAnswer: "a",
      explanation: "Masculine plural noun needs unos + libros.",
    },
    {
      id: "gender-q8",
      question: "Which article is correct for 'agua' in singular?",
      options: [
        { value: "a", label: "la agua" },
        { value: "b", label: "el agua" },
        { value: "c", label: "una agua" },
      ],
      correctAnswer: "b",
      explanation: "Agua is feminine, but commonly takes el in singular for sound reasons.",
    },
    {
      id: "gender-q9",
      question: "Which statement is best practice for learning nouns?",
      options: [
        { value: "a", label: "Memorize only the noun ending" },
        { value: "b", label: "Memorize each noun with its article" },
        { value: "c", label: "Ignore article agreement at beginner level" },
      ],
      correctAnswer: "b",
      explanation: "Learning nouns with articles improves gender accuracy.",
    },
    {
      id: "gender-q10",
      question: "Pick the sentence with full agreement:",
      options: [
        { value: "a", label: "La problema es difícil." },
        { value: "b", label: "El problema es difícil." },
        { value: "c", label: "El problema es difíciles." },
      ],
      correctAnswer: "b",
      explanation: "Problema is masculine singular and adjective is singular.",
    },
  ],
};
