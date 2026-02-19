import type { SpeakingActivityContent } from "@/types/activity";

export const summerNextStepsGoals_2026_06_11: SpeakingActivityContent = {
  type: "speaking",
  title: "6/11/26: Summer + Next Steps Goals",
  description: "Practice goal-setting language. Focus: future perfect and planning vocabulary.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "This summer, I plan to...", example: "This summer, I plan to practice English every day." },
    { phrase: "My next step is to...", example: "My next step is to update my resume." },
    { phrase: "By (month), I will have...", example: "By September, I will have applied for three jobs." },
    { phrase: "One obstacle might be...", example: "One obstacle might be my schedule." },
    { phrase: "To solve that, I can...", example: "To solve that, I can practice on weekends." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Share one summer goal for English and one goal for life (work/health/family).",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Make it specific."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Make a 3-step plan for your goal (Step 1/2/3).",
      context: "Use sequencing words and time words."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Future perfect practice: Say one goal using “By ___, I will have ___.”",
      context: "Example: By September, I will have finished my resume."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Obstacles and solutions: Share one obstacle and one solution.",
      context: "Use: might, could, can."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Partner coaching: Give your partner 2 suggestions to help them succeed.",
      context: "Use: You could..., It's a good idea to..."
    },
  ],// 

  reflectionPrompt: "What is one small action you can do this week to start your goal?",// 
  reflectionMinLength: 30,//  released: false
};
