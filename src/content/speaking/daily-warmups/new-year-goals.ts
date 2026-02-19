import type { SpeakingActivityContent } from "@/types/activity";

export const newYearGoalsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/8/26: Year Reflection & New Goals (Warm-Up)",
  description:
    "Reflect on last year and set new goals. Focus: clear sentences, then notice the small structure words (I, a/an/the, in/at/on, because/so/but).",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    // Core sentence starters (from your original)
    { phrase: "Last year, I...", example: "Last year, I learned a lot of new things." },
    { phrase: "I'm proud of...", example: "I'm proud of how much my English improved." },
    { phrase: "This year, I want to...", example: "This year, I want to get a better job." },
    { phrase: "My goal is to...", example: "My goal is to become more confident speaking English." },
    { phrase: "This year, I'm going to...", example: "This year, I'm going to exercise more and eat healthier." },

    // Lifelines (keep these posted every warm-up)
    { phrase: "Can you repeat that?", example: "Can you repeat that, please?" },
    { phrase: "What does ___ mean?", example: "What does 'accomplish' mean?" },
    { phrase: "Do you mean ___?", example: "Do you mean you changed jobs?" },
    { phrase: "Can you give an example?", example: "Can you give an example?" },
    { phrase: "Why?", example: "Why is that important to you?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    // Keep it to 3 main prompts so the class feels unified
    {
      id: "prompt-1",
      level: "beginner",
      text: "Looking back on LAST year: What are you proud of? What did you accomplish?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context:
        "Plan 3 sentences. Try: 1) Last year, I… 2) I'm proud of… 3) One challenge was…, but…"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "For THIS year: What is one thing you want to do differently?",
      context:
        "Plan 3 sentences. Try: This year, I want to… because… / So I'm going to… / One small step is…"
    },
    {
      id: "prompt-3",
      level: "beginner",
      text: "What is ONE goal for this year that matters to you? Why?",
      context:
        "Make it specific. Add details with small words: in/at/on, with, for. Example pattern: My goal is to… in… because…"
    },

    // Optional extension for higher students, still aligned with today's grammar theme
    {
      id: "extension",
      level: "advanced",
      text: "Challenge: Say your goal again and include: (1) a preposition (in/at/on/for/with), and (2) a connector (because/so/but).",
      soloInstructions: "Practice saying this prompt aloud and think about your answer",
      partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context:
        "After you speak, quickly notice your structure words (I, a/an/the, in/at/on, because/so/but)."
    },
  ],
};
