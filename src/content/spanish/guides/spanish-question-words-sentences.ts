import type { InteractiveGuideContent } from "@/types/activity";

export const spanishQuestionWordsSentencesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "question-words-core",
      title: "Question Words and Basic Sentence Building",
      icon: "❓",
      explanation: `
        <h3>A1 to A2 Communication Builder</h3>
        <p>Question words help you start real conversations. Mastering these forms gives you immediate speaking power.</p>
      `,
      verbTable: {
        title: "Essential Question Words",
        headers: ["Spanish", "Meaning", "Common Use"],
        rows: [
          ["¿qué?", "what?", "¿Qué haces?"],
          ["¿quién?", "who?", "¿Quién es ella?"],
          ["¿dónde?", "where?", "¿Dónde vives?"],
          ["¿cuándo?", "when?", "¿Cuándo estudias?"],
          ["¿por qué?", "why?", "¿Por qué llegaste tarde?"],
          ["¿cómo?", "how?", "¿Cómo estás?"],
          ["¿cuánto/a/os/as?", "how much/many?", "¿Cuántos años tienes?"],
        ],
      },
      exercises: [
        {
          id: "sp-qw-1",
          title: "Pick the Right Question Word",
          instructions: "Choose the best option for each meaning.",
          items: [
            {
              type: "select",
              label: "___ vives? (where)",
              options: ["Qué", "Dónde", "Quién"],
              expectedAnswer: "Dónde",
            },
            {
              type: "select",
              label: "___ estudias español? (why)",
              options: ["Por qué", "Cómo", "Cuándo"],
              expectedAnswer: "Por qué",
            },
            {
              type: "select",
              label: "___ años tienes? (how many)",
              options: ["Qué", "Cuántos", "Quién"],
              expectedAnswer: "Cuántos",
            },
          ],
        },
      ],
    },
    {
      id: "question-structure",
      stepNumber: 1,
      title: "Question Structure and Intonation",
      icon: "🧱",
      explanation: `
        <h3>How to Build Questions</h3>
        <p>Spanish usually keeps the same core order as statements, but uses:</p>
        <ul>
          <li>question marks: <strong>¿ ... ?</strong></li>
          <li>rising intonation when speaking</li>
          <li>question words at the beginning for information questions</li>
        </ul>
        <p>Examples:</p>
        <ul>
          <li>Statement: <em>Tú trabajas hoy.</em></li>
          <li>Yes/No question: <em>¿Tú trabajas hoy?</em></li>
          <li>Info question: <em>¿Dónde trabajas hoy?</em></li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-qw-2",
          title: "Turn into a Question",
          instructions: "Rewrite each prompt as a Spanish question.",
          items: [
            {
              type: "text",
              label: "You live in Boston. Ask: where do you live?",
              correctAnswer: "¿Dónde vives?",
              expectedAnswers: ["¿Dónde vives?", "Dónde vives"],
            },
            {
              type: "text",
              label: "She studies at night. Ask: when does she study?",
              correctAnswer: "¿Cuándo estudia?",
              expectedAnswers: ["¿Cuándo estudia?", "Cuándo estudia"],
            },
          ],
        },
      ],
    },
    {
      id: "negation-and-basic-links",
      stepNumber: 2,
      title: "Negation and Connecting Ideas",
      icon: "🔗",
      explanation: `
        <h3>Speak More Naturally</h3>
        <p>In A2 conversations, you often combine questions with short follow-ups.</p>
        <ul>
          <li><strong>No</strong> goes before the verb: <em>No entiendo.</em></li>
          <li>Use connectors: <strong>y</strong> (and), <strong>pero</strong> (but), <strong>porque</strong> (because).</li>
        </ul>
      `,
      usageMeanings: [
        {
          title: "Conversation Frames",
          description: "Use these to ask and react in class or daily life.",
          examples: [
            {
              sentence: "¿Cómo te llamas? <strong>Y</strong> ¿de dónde eres?",
              explanation: "Ask two related questions naturally.",
            },
            {
              sentence: "No puedo ir hoy <strong>porque</strong> trabajo.",
              explanation: "Negation + reason.",
            },
            {
              sentence: "¿Quieres café <strong>o</strong> té?",
              explanation: "Offer simple choices.",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-qw-3",
          title: "Complete the Dialogue",
          instructions: "Choose the best word or phrase.",
          items: [
            {
              type: "select",
              label: "—¿___ estás? —Estoy bien.",
              options: ["Cómo", "Dónde", "Cuándo"],
              expectedAnswer: "Cómo",
            },
            {
              type: "select",
              label: "No voy a la fiesta ___ tengo examen.",
              options: ["pero", "porque", "y"],
              expectedAnswer: "porque",
            },
            {
              type: "radio",
              label: "Best yes/no question punctuation:",
              options: [
                { value: "a", label: "Tu estudias hoy?" },
                { value: "b", label: "¿Tú estudias hoy?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
    {
      id: "a2-conversation-check",
      stepNumber: 3,
      title: "A2 Mini Conversation Pattern",
      icon: "💬",
      explanation: `
        <h3>Use a 3-Step Exchange</h3>
        <ol>
          <li>Ask an information question.</li>
          <li>React with a short opinion.</li>
          <li>Ask one follow-up question.</li>
        </ol>
        <p>Example:</p>
        <p><em>¿Dónde trabajas? Trabajo en una escuela, pero quiero otro horario. ¿Y tú?</em></p>
      `,
      exercises: [
        {
          id: "sp-qw-4",
          title: "Build Your Own",
          instructions: "Write one short 2-line exchange.",
          items: [
            {
              type: "text",
              label: "Line 1: Ask a question with ¿dónde?",
              acceptAnyAttempt: true,
            },
            {
              type: "text",
              label: "Line 2: Answer using 'porque'.",
              acceptAnyAttempt: true,
            },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    {
      id: "qw-q1",
      question: "Which question word means 'where'?",
      options: [
        { value: "a", label: "¿Quién?" },
        { value: "b", label: "¿Dónde?" },
        { value: "c", label: "¿Cómo?" },
      ],
      correctAnswer: "b",
      explanation: "¿Dónde? asks for location.",
    },
    {
      id: "qw-q2",
      question: "How do you ask 'Why do you study Spanish?'",
      options: [
        { value: "a", label: "¿Por qué estudias español?" },
        { value: "b", label: "¿Qué estudias español?" },
        { value: "c", label: "¿Dónde estudias español?" },
      ],
      correctAnswer: "a",
      explanation: "Use ¿por qué? for 'why'.",
    },
    {
      id: "qw-q3",
      question: "Choose the correct punctuation:",
      options: [
        { value: "a", label: "Dónde vives?" },
        { value: "b", label: "¿Dónde vives?" },
        { value: "c", label: "¿Dónde vives" },
      ],
      correctAnswer: "b",
      explanation: "Spanish requires opening and closing question marks.",
    },
    {
      id: "qw-q4",
      question: "Which connector means 'because'?",
      options: [
        { value: "a", label: "pero" },
        { value: "b", label: "porque" },
        { value: "c", label: "y" },
      ],
      correctAnswer: "b",
      explanation: "Porque introduces reasons.",
    },
    {
      id: "qw-q5",
      question: "Which asks 'How many years do you have?'",
      options: [
        { value: "a", label: "¿Cuántos años tienes?" },
        { value: "b", label: "¿Cómo años tienes?" },
        { value: "c", label: "¿Quién años tienes?" },
      ],
      correctAnswer: "a",
      explanation: "Use cuánto/a/os/as for quantity.",
    },
    {
      id: "qw-q6",
      question: "Where does 'no' usually go in basic negation?",
      options: [
        { value: "a", label: "After the verb" },
        { value: "b", label: "Before the verb" },
        { value: "c", label: "At the end of sentence" },
      ],
      correctAnswer: "b",
      explanation: "No goes before the conjugated verb: No entiendo.",
    },
    {
      id: "qw-q7",
      question: "Which question word asks about a person?",
      options: [
        { value: "a", label: "¿Quién?" },
        { value: "b", label: "¿Cuándo?" },
        { value: "c", label: "¿Dónde?" },
      ],
      correctAnswer: "a",
      explanation: "¿Quién? asks who.",
    },
    {
      id: "qw-q8",
      question: "Choose the best response using 'porque'.",
      options: [
        { value: "a", label: "¿Dónde vives?" },
        { value: "b", label: "Porque me gusta estudiar." },
        { value: "c", label: "¿Cómo te llamas?" },
      ],
      correctAnswer: "b",
      explanation: "Porque introduces a reason in the answer.",
    },
    {
      id: "qw-q9",
      question: "Which sentence asks about time?",
      options: [
        { value: "a", label: "¿Cuándo empieza la clase?" },
        { value: "b", label: "¿Qué estudias?" },
        { value: "c", label: "¿Quién llega hoy?" },
      ],
      correctAnswer: "a",
      explanation: "¿Cuándo? asks when.",
    },
    {
      id: "qw-q10",
      question: "Pick the correct question format:",
      options: [
        { value: "a", label: "¿Qué tú haces?" },
        { value: "b", label: "¿Qué haces tú?" },
        { value: "c", label: "Qué haces tú?" },
      ],
      correctAnswer: "b",
      explanation: "This option uses proper question punctuation and natural word order.",
    },
  ],
};
