import type { InteractiveGuideContent } from "@/types/activity";

export const spanishAlphabetPronunciationContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "alphabet-overview",
      title: "Spanish Alphabet and Core Sounds",
      icon: "🔤",
      explanation: `
        <h3>Start Here: Sound Before Speed</h3>
        <p>Spanish pronunciation is consistent. Once you learn core letter sounds, you can read new words with confidence.</p>
        <p>The alphabet has 27 letters (including <strong>ñ</strong>). Most letters sound close to English, but a few are very different.</p>
      `,
      exercises: [
        {
          id: "sp-alpha-quick-check",
          title: "Quick Check",
          instructions: "Choose the best pronunciation clue.",
          items: [
            {
              type: "radio",
              label: "The letter <strong>j</strong> in Spanish sounds most like...",
              options: [
                { value: "h", label: "English h (breathy): jamón ≈ ha-MON" },
                { value: "j", label: "English j (hard): jamón ≈ ja-MON" },
              ],
              expectedAnswer: "h",
            },
            {
              type: "radio",
              label: "The letter <strong>h</strong> in most Spanish words is...",
              options: [
                { value: "silent", label: "Silent (no sound): hola ≈ O-la" },
                { value: "heard", label: "Strongly pronounced: hola ≈ HO-la" },
              ],
              expectedAnswer: "silent",
            },
          ],
        },
      ],
    },
    {
      id: "vowels-and-strong-consonants",
      stepNumber: 1,
      title: "Vowels, R, RR, LL, and Ñ",
      icon: "🧠",
      explanation: `
        <h3>The 5 Vowels Never Change</h3>
        <p><strong>a, e, i, o, u</strong> are stable in Spanish:</p>
        <ul>
          <li><strong>a</strong> as in "father"</li>
          <li><strong>e</strong> as in "meh"</li>
          <li><strong>i</strong> as in "machine"</li>
          <li><strong>o</strong> as in "go" (pure sound)</li>
          <li><strong>u</strong> as in "flute"</li>
        </ul>
        <p><strong>r</strong> is a light tap, while <strong>rr</strong> is a strong trill. <strong>ñ</strong> sounds like "ny" in "canyon".</p>
      `,
      usageMeanings: [
        {
          title: "🎯 Key Examples",
          description: "Practice saying these slowly first.",
          examples: [
            {
              sentence: "pero / perro",
              explanation: "Single r = tap (pero: but). Double rr = trill (perro: dog).",
            },
            {
              sentence: "año",
              explanation: "ñ gives a 'ny' sound: año = year.",
            },
            {
              sentence: "llave",
              explanation: "In many regions, ll sounds like y: llave ≈ YA-ve.",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-alpha-rules-1",
          title: "Identify the Sound Rule",
          instructions: "Choose the correct rule for each word.",
          items: [
            {
              type: "select",
              label: "In the word <strong>perro</strong>, the <strong>rr</strong> is...",
              options: ["a tapped sound", "a trilled/rolled sound", "silent"],
              expectedAnswer: "a trilled/rolled sound",
            },
            {
              type: "select",
              label: "In the word <strong>hola</strong>, the <strong>h</strong> is...",
              options: ["silent", "pronounced like English h", "pronounced like j"],
              expectedAnswer: "silent",
            },
            {
              type: "select",
              label: "In the word <strong>año</strong>, <strong>ñ</strong> sounds most like...",
              options: ["n in note", "ny in canyon", "gn in sign"],
              expectedAnswer: "ny in canyon",
            },
          ],
        },
      ],
    },
    {
      id: "stress-and-accents",
      stepNumber: 2,
      title: "Word Stress and Accent Marks",
      icon: "📍",
      explanation: `
        <h3>Where You Stress the Word Matters</h3>
        <p>In Spanish, accent marks help you pronounce and understand meaning.</p>
        <ul>
          <li>If a word ends in <strong>vowel, n, or s</strong>, stress is usually on the next-to-last syllable.</li>
          <li>Otherwise, stress is usually on the last syllable.</li>
          <li>An accent mark (´) shows an exception: <strong>teléfono, inglés, también</strong>.</li>
        </ul>
      `,
      comparison: {
        title: "Meaning Changes with Accent Marks",
        leftLabel: "Without accent",
        rightLabel: "With accent",
        rows: [
          { label: "tu / tú", left: "tu = your", right: "tú = you" },
          { label: "si / sí", left: "si = if", right: "sí = yes" },
          { label: "el / él", left: "el = the", right: "él = he" },
        ],
      },
      exercises: [
        {
          id: "sp-alpha-accents-1",
          title: "Accent and Stress Practice",
          instructions: "Pick the option with correct meaning or stress.",
          items: [
            {
              type: "radio",
              label: "Which means <strong>yes</strong>?",
              options: [
                { value: "si", label: "si" },
                { value: "sí", label: "sí" },
              ],
              expectedAnswer: "sí",
            },
            {
              type: "radio",
              label: "Which means <strong>you</strong>?",
              options: [
                { value: "tu", label: "tu" },
                { value: "tú", label: "tú" },
              ],
              expectedAnswer: "tú",
            },
            {
              type: "text",
              label: "Add the accent mark: 'ingles' (language adjective)",
              correctAnswer: "inglés",
              expectedAnswers: ["inglés"],
            },
          ],
        },
      ],
    },
    {
      id: "a1-speaking-routine",
      stepNumber: 3,
      title: "A1 Pronunciation Routine",
      icon: "🗣️",
      explanation: `
        <h3>Daily 5-Minute Routine</h3>
        <p>Use this short routine to build pronunciation confidence:</p>
        <ol>
          <li>Say all 5 vowels out loud 3 times.</li>
          <li>Contrast <strong>pero/perro</strong> and <strong>caro/carro</strong>.</li>
          <li>Read one short sentence slowly, then naturally.</li>
        </ol>
      `,
      exercises: [
        {
          id: "sp-alpha-routine-check",
          title: "Self-Check",
          instructions: "Choose the best reflection after practice.",
          items: [
            {
              type: "radio",
              label: "After practice, I can clearly hear the difference between r and rr.",
              options: [
                { value: "yes", label: "Yes, mostly" },
                { value: "not-yet", label: "Not yet" },
              ],
              expectedAnswer: "yes",
            },
            {
              type: "text",
              label: "Type one Spanish word with ñ:",
              placeholder: "Example: año",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "alpha-q1",
      question: "How many letters are in the modern Spanish alphabet?",
      options: [
        { value: "a", label: "26" },
        { value: "b", label: "27" },
        { value: "c", label: "29" },
      ],
      correctAnswer: "b",
      explanation: "Spanish has 27 letters, including ñ.",
    },
    {
      id: "alpha-q2",
      question: "In most words, the letter h is...",
      options: [
        { value: "a", label: "silent" },
        { value: "b", label: "always pronounced" },
        { value: "c", label: "like English j" },
      ],
      correctAnswer: "a",
      explanation: "In words like hola and hablar, h is silent.",
    },
    {
      id: "alpha-q3",
      question: "Which pair shows the tap vs trill contrast?",
      options: [
        { value: "a", label: "pero / perro" },
        { value: "b", label: "si / sí" },
        { value: "c", label: "el / él" },
      ],
      correctAnswer: "a",
      explanation: "Single r is a tap; rr is a trill.",
    },
    {
      id: "alpha-q4",
      question: "The letter ñ sounds closest to...",
      options: [
        { value: "a", label: "n in note" },
        { value: "b", label: "ny in canyon" },
        { value: "c", label: "ng in ring" },
      ],
      correctAnswer: "b",
      explanation: "ñ is similar to the ny sound in canyon.",
    },
    {
      id: "alpha-q5",
      question: "Which word means 'yes'?",
      options: [
        { value: "a", label: "si" },
        { value: "b", label: "sí" },
        { value: "c", label: "sé" },
      ],
      correctAnswer: "b",
      explanation: "sí (with accent) means yes.",
    },
    {
      id: "alpha-q6",
      question: "What is the best vowel rule for Spanish?",
      options: [
        { value: "a", label: "Vowels change a lot by word" },
        { value: "b", label: "Each vowel has a mostly stable sound" },
        { value: "c", label: "Only stressed vowels are pronounced" },
      ],
      correctAnswer: "b",
      explanation: "Spanish vowels are stable, which makes pronunciation predictable.",
    },
    {
      id: "alpha-q7",
      question: "Which statement about stress is usually true?",
      options: [
        { value: "a", label: "Words ending in vowel, n, or s usually stress the final syllable" },
        { value: "b", label: "Words ending in vowel, n, or s usually stress the next-to-last syllable" },
        { value: "c", label: "Spanish words have random stress" },
      ],
      correctAnswer: "b",
      explanation: "Default stress often falls on the next-to-last syllable in words ending in vowel, n, or s.",
    },
    {
      id: "alpha-q8",
      question: "Choose the correct meaning pair.",
      options: [
        { value: "a", label: "tu = you, tú = your" },
        { value: "b", label: "si = yes, sí = if" },
        { value: "c", label: "el = the, él = he" },
      ],
      correctAnswer: "c",
      explanation: "Accent marks can change meaning: el = the, él = he.",
    },
    {
      id: "alpha-q9",
      question: "In many regions, ll in 'llave' sounds like...",
      options: [
        { value: "a", label: "a y sound" },
        { value: "b", label: "an English l sound" },
        { value: "c", label: "silent" },
      ],
      correctAnswer: "a",
      explanation: "A common pronunciation is similar to y in 'yes'.",
    },
    {
      id: "alpha-q10",
      question: "Which pair best shows why pronunciation matters?",
      options: [
        { value: "a", label: "pero / perro" },
        { value: "b", label: "mañana / ayer" },
        { value: "c", label: "grande / pequeño" },
      ],
      correctAnswer: "a",
      explanation: "Single r and rr can change meaning, so sound control is important.",
    },
  ],
};
