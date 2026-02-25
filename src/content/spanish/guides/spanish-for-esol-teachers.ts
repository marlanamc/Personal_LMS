import type { InteractiveGuideContent } from "@/types/activity";

export const spanishForEsolTeachersContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "esol-big-picture",
      title: "Big Picture: Your ESOL Lens on Spanish",
      icon: "🗺️",
      explanation: `
        <h3>What This Guide Does</h3>
        <p>You teach English—simple present, present continuous, future perfect continuous, etc. This guide maps what you already know to Spanish so you can see the <strong>big picture</strong> and know what to pay attention to.</p>
        <h3>Core Idea</h3>
        <p>Spanish has a different verb architecture than English. Aspect and mood matter more; time is often marked differently. Use your ESOL background to <strong>anticipate</strong> what will look familiar and what won't—instead of writing reflections, you'll recognize patterns and avoid interference.</p>
      `,
      exercises: [
        {
          id: "sp-esol-1",
          title: "Quick Orientation",
          instructions: "Choose the best description of this guide.",
          items: [
            {
              type: "radio",
              label: "This guide is primarily for:",
              options: [
                { value: "a", label: "ESOL teachers who want a structural map of Spanish (tense/verb system) using what they teach in English" },
                { value: "b", label: "General learners who need a Spanish grammar textbook" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The most useful approach here is:",
              options: [
                { value: "a", label: "Matching English tenses to Spanish equivalents and knowing what to watch for" },
                { value: "b", label: "Writing long reflections about your learning process" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },
    {
      id: "esol-tense-map",
      stepNumber: 1,
      title: "English Tenses → Spanish Equivalents",
      icon: "📐",
      explanation: `
        <h3>Mapping What You Teach</h3>
        <p>Here's how the tenses you teach in English line up with Spanish.</p>
        <p><strong>Key difference:</strong> Spanish often uses a single form where English needs auxiliaries. Spanish marks aspect (perfective vs imperfective) and mood (indicative vs subjunctive) more explicitly than English.</p>
      `,
      comparison: {
        title: "English (ESOL) → Spanish",
        leftLabel: "English (what you teach)",
        rightLabel: "Spanish (what you'll see)",
        rows: [
          { label: "Simple present", left: "I eat, she walks", right: "como, camina (one form, no -s distinction)" },
          { label: "Present continuous", left: "I am eating", right: "estoy comiendo (estar + gerund)" },
          { label: "Simple past", left: "I ate, she walked", right: "comí, caminó (preterite) or comía, caminaba (imperfect)" },
          { label: "Past continuous", left: "I was eating", right: "estaba comiendo (imperfect of estar + gerund)" },
          { label: "Future (will)", left: "I will eat", right: "comeré (simple future) or voy a comer (ir + a + infinitive)" },
          { label: "Going to future", left: "I am going to eat", right: "voy a comer (ir + a + infinitive—very common)" },
          { label: "Present perfect", left: "I have eaten", right: "he comido (haber + participle)" },
          { label: "Past perfect", left: "I had eaten", right: "había comido (imperfect of haber + participle)" },
          { label: "Future perfect", left: "I will have eaten", right: "habré comido (simple future of haber + participle)" },
          { label: "Conditional", left: "I would eat", right: "comería (conditional; also used for polite requests)" },
        ],
      },
      tipBox: {
        title: "Where Spanish splits",
        content: "Spanish past has two main forms: preterite (completed actions) and imperfect (ongoing, habitual, background). You don't have this split in English—it's the biggest conceptual shift.",
      },
      exercises: [
        {
          id: "sp-esol-2",
          title: "Tense Mapping",
          instructions: "Match the English form to its Spanish equivalent.",
          items: [
            { type: "radio", label: "English 'I am eating' maps to Spanish:", options: [{ value: "a", label: "estoy comiendo" }, { value: "b", label: "como" }], expectedAnswer: "a" },
            { type: "radio", label: "English 'I am going to eat' maps to Spanish:", options: [{ value: "a", label: "voy a comer" }, { value: "b", label: "comeré" }], expectedAnswer: "a" },
            { type: "radio", label: "English 'I have eaten' maps to Spanish:", options: [{ value: "a", label: "he comido" }, { value: "b", label: "comí" }], expectedAnswer: "a" },
            { type: "radio", label: "Spanish preterite vs imperfect—English has:", options: [{ value: "a", label: "No direct equivalent; one 'simple past' covers both" }, { value: "b", label: "Exactly the same split" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "esol-structural-differences",
      stepNumber: 2,
      title: "Structural Differences You Need to Think About",
      icon: "🧩",
      explanation: `
        <h3>What Doesn't Map 1:1</h3>
        <p>These are the areas where your English-teaching brain will try to transfer directly—and fail. Pay attention to:</p>
        <ul>
          <li><strong>Agreement:</strong> article + noun + adjective (gender and number). Spanish marks it on all three; English barely marks it.</li>
          <li><strong>Ser vs estar:</strong> Two verbs for "to be." Ser = identity, origin, profession, permanent traits. Estar = location, temporary states, emotions.</li>
          <li><strong>Subjunctive:</strong> Mood, not tense. Used after doubt, volition, emotion (quiero que vengas, dudo que llegue). English uses modals or infinitives; Spanish uses a different conjugation.</li>
          <li><strong>Object pronouns:</strong> Position differs. Often before the verb. Clitics (me, te, lo, la) behave differently from English "me," "him," etc.</li>
          <li><strong>Register:</strong> tú vs usted. Spanish marks formality in the verb; English mostly doesn't.</li>
        </ul>
      `,
      comparison: {
        title: "English vs Spanish: Where to watch",
        leftLabel: "English (what you teach)",
        rightLabel: "Spanish (what to think about)",
        rows: [
          { label: "To be", left: "One verb: am/is/are/was/were", right: "Two verbs: ser (identity) vs estar (state/location)" },
          { label: "Agreement", left: "Plural -s, few gender marks", right: "Gender + number on articles, nouns, adjectives" },
          { label: "Modals / subordination", left: "I want him to come; I doubt he will come", right: "Quiero que venga; dudo que llegue (subjunctive)" },
          { label: "Formality", left: "You (same form)", right: "tú vs usted (different verb forms)" },
        ],
      },
      exercises: [
        {
          id: "sp-esol-3",
          title: "Structural Recognition",
          instructions: "Choose the correct statement.",
          items: [
            { type: "radio", label: "Ser vs estar:", options: [{ value: "a", label: "Spanish has two verbs for 'to be'; English has one" }, { value: "b", label: "Spanish and English both have two verbs for 'to be'" }], expectedAnswer: "a" },
            { type: "radio", label: "Subjunctive in Spanish:", options: [{ value: "a", label: "Is used after doubt, volition, emotion (different from English)" }, { value: "b", label: "Is the same as English subjunctive" }], expectedAnswer: "a" },
            { type: "radio", label: "Agreement in Spanish:", options: [{ value: "a", label: "Article, noun, and adjective agree in gender and number" }, { value: "b", label: "Only the noun changes" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "esol-detail-wise",
      stepNumber: 3,
      title: "Detail-Wise: False Friends and Common Interference",
      icon: "⚠️",
      explanation: `
        <h3>What Will Trip You Up</h3>
        <p>False friends and interference—things that look like English but aren't:</p>
        <ul>
          <li><strong>actualmente</strong> ≠ actually → means "currently"</li>
          <li><strong>éxito</strong> ≠ exit → means "success"</li>
          <li><strong>embarazada</strong> ≠ embarrassed → means "pregnant"</li>
          <li><strong>sensible</strong> ≠ sensible → means "sensitive"</li>
          <li><strong>asistir</strong> ≠ assist → often means "attend"</li>
          <li><strong>pretender</strong> ≠ pretend → means "intend, attempt"</li>
        </ul>
        <p><strong>Other interference:</strong> Dropping agreement because English doesn't mark it. Using "I have 20 years" literal translation instead of "Tengo 20 años." Overusing present progressive for habits (use simple present in Spanish).</p>
      `,
      tipBox: {
        title: "Your ESOL advantage",
        content: "You already teach form–meaning–use. Apply it: when you learn a Spanish form, ask 'What communicative intent does this encode?' and 'When would a native choose this over the alternative?' That's the same question you ask about English tenses.",
      },
      exercises: [
        {
          id: "sp-esol-4",
          title: "False Friends",
          instructions: "Choose the correct meaning.",
          items: [
            { type: "radio", label: "actualmente in Spanish means:", options: [{ value: "a", label: "currently" }, { value: "b", label: "actually" }], expectedAnswer: "a" },
            { type: "radio", label: "éxito in Spanish means:", options: [{ value: "a", label: "success" }, { value: "b", label: "exit" }], expectedAnswer: "a" },
            { type: "radio", label: "embarazada in Spanish means:", options: [{ value: "a", label: "pregnant" }, { value: "b", label: "embarrassed" }], expectedAnswer: "a" },
            { type: "radio", label: "To say 'I am 20 years old' in Spanish you use:", options: [{ value: "a", label: "Tengo 20 años (have)" }, { value: "b", label: "Soy 20 años (am)" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
    {
      id: "esol-quick-reference",
      stepNumber: 4,
      title: "Quick Reference: Big Picture Checklist",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>Tense map:</strong> Simple present → present; present continuous → estar + gerund; going to → ir + a + infinitive; have/has + past participle → haber + participle. Past = preterite vs imperfect (no English equivalent).</p>
        <p><strong>Structural watch list:</strong> Ser vs estar. Agreement (gender + number). Subjunctive after doubt/volition/emotion. tú vs usted.</p>
        <p><strong>Interference:</strong> False friends (actualmente, éxito, embarazada). Don't drop agreement. Don't overuse progressive for habits.</p>
      `,
      exercises: [
        {
          id: "sp-esol-5",
          title: "Recall",
          instructions: "Choose the best answer.",
          items: [
            { type: "radio", label: "The biggest conceptual shift from English to Spanish past is:", options: [{ value: "a", label: "Preterite vs imperfect (Spanish splits what English merges)" }, { value: "b", label: "Spanish has no past tense" }], expectedAnswer: "a" },
            { type: "radio", label: "For habits in Spanish, use:", options: [{ value: "a", label: "Simple present (not progressive)" }, { value: "b", label: "Present progressive" }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    { id: "esol-q1", question: "This guide is for ESOL teachers who want:", options: [{ value: "a", label: "A structural map of Spanish verb system using English tense knowledge" }, { value: "b", label: "A long reflective essay assignment" }], correctAnswer: "a", explanation: "Big picture mapping, not open-ended writing." },
    { id: "esol-q2", question: "English 'I am eating' maps to Spanish:", options: [{ value: "a", label: "estoy comiendo" }, { value: "b", label: "como" }], correctAnswer: "a", explanation: "estar + gerund = present continuous." },
    { id: "esol-q3", question: "English 'I am going to eat' maps to Spanish:", options: [{ value: "a", label: "voy a comer" }, { value: "b", label: "comeré" }], correctAnswer: "a", explanation: "ir + a + infinitive is the common 'going to' equivalent." },
    { id: "esol-q4", question: "Spanish preterite vs imperfect:", options: [{ value: "a", label: "Has no direct English equivalent" }, { value: "b", label: "Maps exactly to English past continuous vs simple past" }], correctAnswer: "a", explanation: "Spanish splits aspect; English doesn't in the same way." },
    { id: "esol-q5", question: "Ser vs estar:", options: [{ value: "a", label: "Spanish has two 'to be' verbs; English has one" }, { value: "b", label: "Both languages have two 'to be' verbs" }], correctAnswer: "a", explanation: "Ser = identity; estar = state/location." },
    { id: "esol-q6", question: "actualmente in Spanish means:", options: [{ value: "a", label: "currently" }, { value: "b", label: "actually" }], correctAnswer: "a", explanation: "False friend." },
    { id: "esol-q7", question: "For habits in Spanish, prefer:", options: [{ value: "a", label: "Simple present (como cada día)" }, { value: "b", label: "Present progressive (estoy comiendo cada día)" }], correctAnswer: "a", explanation: "Progressive = right now; habits = simple present." },
    { id: "esol-q8", question: "Subjunctive in Spanish is used after:", options: [{ value: "a", label: "Doubt, volition, emotion (quiero que vengas)" }, { value: "b", label: "Only past tense" }], correctAnswer: "a", explanation: "Mood, not tense." },
    { id: "esol-q9", question: "'Tengo 20 años' uses tener because:", options: [{ value: "a", label: "Spanish uses 'have' for age, not 'be'" }, { value: "b", label: "It's a mistake" }], correctAnswer: "a", explanation: "Tener años = be X years old." },
    { id: "esol-q10", question: "Your ESOL advantage: apply", options: [{ value: "a", label: "Form–meaning–use: what intent does this encode?" }, { value: "b", label: "Word-for-word translation only" }], correctAnswer: "a", explanation: "Same question you ask about English tenses." },
  ],
};
