import type { SpeakingActivityContent } from "@/types/activity";

export const yearInReviewCarousel_2026_06_09: SpeakingActivityContent = {
  type: "speaking",
  title: "6/9/26: Year-in-Review Carousel",
  description: "Reflect on the year: most useful unit, best phrase, biggest improvement, and next steps",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "The most useful unit for me was...", example: "The most useful unit for me was Housing." },
    { phrase: "My favorite phrase is...", example: "My favorite phrase is 'Could you please repeat that?'" },
    { phrase: "I've improved in...", example: "I've improved in speaking more confidently." },
    { phrase: "One challenge was...", example: "One challenge was pronunciation." },
    { phrase: "Next, I want to...", example: "Next, I want to practice job interviews." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Station 1: Most useful unit — choose one and explain why.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: because + one example."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Station 2: Best phrase — share one phrase you used in real life.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Say where you used it (doctor, work, school, store)."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Station 3: Biggest improvement — speaking, listening, reading, writing, vocabulary, confidence.",
      context: "Use: I've improved in..., I'm better at..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Station 4: One challenge + one strategy that helped you.",
      context: "Use: At first..., then..., now..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Station 5: Advice for new Level 3 students — give 3 tips.",
      context: "Use: You should..., Don't be afraid to..., It's helpful to..."
    },
  ],// 

  reflectionPrompt: "What is one thing you want to continue practicing after this class ends?",// 
  reflectionMinLength: 30,//  released: false
};
