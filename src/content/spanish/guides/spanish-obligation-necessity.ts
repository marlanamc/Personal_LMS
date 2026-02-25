import type { InteractiveGuideContent } from "@/types/activity";

export const spanishObligationNecessityContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "obligation-overview",
      title: "Expressing Obligation and Necessity",
      icon: "📌",
      explanation: `
        <h3>Have to, must, need to</h3>
        <p>Spanish uses several patterns to express obligation and necessity. The most common is <strong>tener + que + infinitive</strong> (have to). Others include <strong>deber + infinitive</strong> (should/must) and <strong>necesitar + infinitive</strong> (need to).</p>
      `,
      formula: [
        { text: "subject", type: "subject" },
        { text: "+", type: "other" },
        { text: "tener", type: "verb" },
        { text: "+", type: "other" },
        { text: "que", type: "other" },
        { text: "+", type: "other" },
        { text: "infinitive", type: "object" },
      ],
      tipBox: {
        title: "Tener que",
        content: "Tener que + infinitive = have to / must. Tengo que estudiar = I have to study. The 'que' is required.",
      },
      verbTable: {
        title: "tener + que + infinitive",
        headers: ["Subject", "Form", "Example"],
        rows: [
          ["yo", "tengo que", "Tengo que trabajar."],
          ["tú", "tienes que", "Tienes que llamar."],
          ["él/ella/usted", "tiene que", "Tiene que firmar aquí."],
          ["nosotros/as", "tenemos que", "Tenemos que salir."],
          ["ellos/ellas/ustedes", "tienen que", "Tienen que llegar temprano."],
        ],
      },
      exercises: [
        {
          id: "sp-obl-1",
          title: "Build the Phrase",
          instructions: "Choose the correct form of tener.",
          items: [
            { type: "select", label: "Yo ___ que estudiar.", options: ["tengo que", "tiene que", "tenemos que"], expectedAnswer: "tengo que" },
            { type: "select", label: "Ella ___ que firmar aquí.", options: ["tengo que", "tiene que", "tienen que"], expectedAnswer: "tiene que" },
            { type: "select", label: "Nosotros ___ que salir.", options: ["tenemos que", "tienen que", "tienes que"], expectedAnswer: "tenemos que" },
          ],
        },
      ],
    },
    {
      id: "obligation-deber-necesitar",
      stepNumber: 1,
      title: "deber and necesitar",
      icon: "🔑",
      explanation: `
        <h3>Alternatives for Obligation</h3>
        <p><strong>deber + infinitive</strong> = should / must (moral obligation or advice)</p>
        <p><strong>necesitar + infinitive</strong> = need to (necessity)</p>
        <p>All three (tener que, deber, necesitar) are followed directly by the infinitive. No "que" with deber or necesitar.</p>
      `,
      comparison: {
        title: "Obligation patterns",
        leftLabel: "Pattern",
        rightLabel: "Example",
        rows: [
          { label: "Have to (common)", left: "tener que + infinitive", right: "Tengo que ir." },
          { label: "Should / must", left: "deber + infinitive", right: "Debes estudiar." },
          { label: "Need to", left: "necesitar + infinitive", right: "Necesito descansar." },
        ],
      },
      exercises: [
        {
          id: "sp-obl-2",
          title: "Choose the Right Pattern",
          instructions: "Pick tener que, deber, or necesitar.",
          items: [
            { type: "radio", label: "'I have to work.' →", options: [{ value: "tener", label: "Tengo que trabajar." }, { value: "deber", label: "Debo trabajar." }], expectedAnswer: "tener" },
            { type: "radio", label: "'You need to rest.' →", options: [{ value: "necesitar", label: "Necesitas descansar." }, { value: "tener", label: "Tienes que descansar." }], expectedAnswer: "necesitar" },
          ],
        },
      ],
    },
    {
      id: "obligation-negative",
      stepNumber: 2,
      title: "Negatives: No tener que, No deber",
      icon: "🚫",
      explanation: `
        <h3>No tener que vs no deber</h3>
        <p><strong>No tener que</strong> = don't have to (absence of obligation)</p>
        <p><strong>No deber</strong> = shouldn't (advice against)</p>
        <p>No goes before the conjugated verb: No tengo que ir. No debes correr.</p>
      `,
      usageMeanings: [
        {
          title: "No tener que",
          description: "Don't have to (optional)",
          examples: [
            { sentence: "No tengo que trabajar hoy.", explanation: "I don't have to work today." },
            { sentence: "No tienes que venir.", explanation: "You don't have to come." },
          ],
        },
        {
          title: "No deber",
          description: "Shouldn't (advice against)",
          examples: [
            { sentence: "No debes mentir.", explanation: "You shouldn't lie." },
            { sentence: "No deberíamos llegar tarde.", explanation: "We shouldn't arrive late." },
          ],
        },
      ],
      exercises: [
        {
          id: "sp-obl-3",
          title: "Negative Obligation",
          instructions: "Choose the correct meaning.",
          items: [
            { type: "radio", label: "'No tengo que ir' means:", options: [{ value: "dont", label: "I don't have to go" }, { value: "mustnt", label: "I must not go" }], expectedAnswer: "dont" },
            { type: "radio", label: "'No debes fumar' means:", options: [{ value: "dont", label: "You don't have to smoke" }, { value: "shouldnt", label: "You shouldn't smoke" }], expectedAnswer: "shouldnt" },
          ],
        },
      ],
    },
    {
      id: "obligation-quickref",
      stepNumber: 3,
      title: "Quick Reference",
      icon: "📋",
      explanation: `
        <h3>At a Glance</h3>
        <p><strong>tener que + infinitive:</strong> have to, must (most common). <strong>deber + infinitive:</strong> should, must (advice). <strong>necesitar + infinitive:</strong> need to.</p>
        <p>Negation: No tengo que = don't have to. No debes = shouldn't.</p>
      `,
      exercises: [
        {
          id: "sp-obl-quickref",
          title: "Recall",
          instructions: "Choose the correct form.",
          items: [
            { type: "radio", label: "tener + ___ + infinitive", options: [{ value: "que", label: "que" }, { value: "de", label: "de" }], expectedAnswer: "que" },
            { type: "radio", label: "Yo form of tener que:", options: [{ value: "tengo que", label: "tengo que" }, { value: "tiene que", label: "tiene que" }], expectedAnswer: "tengo que" },
          ],
        },
      ],
    },
    {
      id: "common-mistakes-obl",
      stepNumber: 4,
      title: "Common Mistakes",
      icon: "⚠️",
      explanation: `
        <h3>What to Avoid</h3>
        <ul>
          <li><strong>Dropping que</strong> — Tener que is fixed. Tengo estudiar is wrong; tengo que estudiar is correct.</li>
          <li><strong>Confusing tener que with deber</strong> — tener que = have to (external); deber = should (advice/moral).</li>
          <li><strong>Using tener + que with deber/necesitar</strong> — Debo ir, Necesito descansar (no que).</li>
        </ul>
      `,
      exercises: [
        {
          id: "sp-obl-mistakes",
          title: "Spot the Error",
          instructions: "Which is correct?",
          items: [
            { type: "radio", label: "I have to go.", options: [{ value: "a", label: "Tengo que ir." }, { value: "b", label: "Tengo ir." }], expectedAnswer: "a" },
          ],
        },
      ],
    },
  ],
  miniQuiz: [
    { id: "obl-q1", question: "tener + ___ + infinitive = have to", options: [{ value: "a", label: "que" }, { value: "b", label: "de" }], correctAnswer: "a", explanation: "tener que + infinitive." },
    { id: "obl-q2", question: "Yo tengo que estudiar =", options: [{ value: "a", label: "I have to study" }, { value: "b", label: "I want to study" }], correctAnswer: "a", explanation: "tener que = have to." },
    { id: "obl-q3", question: "Which form goes with él?", options: [{ value: "a", label: "tiene que" }, { value: "b", label: "tengo que" }], correctAnswer: "a", explanation: "él tiene que." },
    { id: "obl-q4", question: "deber + infinitive =", options: [{ value: "a", label: "should / must" }, { value: "b", label: "have to" }], correctAnswer: "a", explanation: "deber = should/must." },
    { id: "obl-q5", question: "No tengo que ir =", options: [{ value: "a", label: "I don't have to go" }, { value: "b", label: "I must not go" }], correctAnswer: "a", explanation: "No tener que = don't have to." },
    { id: "obl-q6", question: "No debes fumar =", options: [{ value: "a", label: "You shouldn't smoke" }, { value: "b", label: "You don't have to smoke" }], correctAnswer: "a", explanation: "No deber = shouldn't." },
    { id: "obl-q7", question: "necesitar + infinitive =", options: [{ value: "a", label: "need to" }, { value: "b", label: "have to" }], correctAnswer: "a", explanation: "necesitar = need to." },
    { id: "obl-q8", question: "Nosotros ___ que llegar temprano.", options: [{ value: "a", label: "tenemos que" }, { value: "b", label: "tiene que" }], correctAnswer: "a", explanation: "nosotros tenemos que." },
    { id: "obl-q9", question: "Which sentence is correct?", options: [{ value: "a", label: "Tengo que estudiar." }, { value: "b", label: "Tengo estudiar." }], correctAnswer: "a", explanation: "que is required." },
    { id: "obl-q10", question: "Debo ir. (No 'que') porque:", options: [{ value: "a", label: "deber + infinitive directly" }, { value: "b", label: "deber siempre usa que" }], correctAnswer: "a", explanation: "deber + infinitive, no que." },
  ],
};
