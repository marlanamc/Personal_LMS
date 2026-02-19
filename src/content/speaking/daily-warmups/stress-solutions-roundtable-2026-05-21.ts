import type { SpeakingActivityContent } from "@/types/activity";

export const stressSolutionsRoundtable_2026_05_21: SpeakingActivityContent = {
  type: "speaking",
  title: "5/21/26: Stress Solutions (Future Conditional)",
  description: "Practice using Type 1 conditionals (If + present, will + verb) to talk about stress management strategies and coping plans",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "If I feel stressed, I will...", example: "If I feel stressed, I will take a break and breathe deeply." },
    { phrase: "If I can't..., I will...", example: "If I can't sleep, I will try meditation or tea." },
    { phrase: "If (problem) happens, I will...", example: "If work gets too busy, I will ask for help." },
    { phrase: "I will... if...", example: "I will go for a walk if I feel overwhelmed." },
    { phrase: "What will you do if...?", example: "What will you do if you feel anxious?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Use Type 1 conditional: If you feel stressed, what will you do? What strategies will you try?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "If I feel stressed, I will take deep breaths. I will go for a walk. I will call a friend."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Use Type 1 conditional: If you can't sleep, what will you try? What will you do if it doesn't help?",
      context: "If I can't sleep, I will drink tea. If that doesn't help, I will try meditation."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use conditionals for work stress: If work gets too busy, what will you do? If your boss asks you to work overtime?",
      context: "If work gets too busy, I will prioritize my tasks. If my boss asks me to work overtime, I will explain my schedule."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Use conditionals for self-care: If you feel overwhelmed, what will you do to take care of yourself?",
      context: "If I feel overwhelmed, I will take a break. I will set boundaries. I will ask for help if I need it."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Ask your partner questions using conditionals: 'What will you do if...?'",
      context: "What will you do if you feel anxious? What will you do if you have too much to do? What will you do if you need a mental health day?"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full conditional plan: Use Type 1 conditionals to explain your complete stress management plan.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'If I start to feel stressed, I will notice my body's signals. If I'm breathing fast, I will do breathing exercises. If I still feel overwhelmed, I will take a 10-minute break. If it continues, I will talk to someone I trust.'"
    },
  ],// 

  reflectionPrompt: "How does using Type 1 conditional (If + present, will) help you plan for stressful situations? Give one example.",// 
  reflectionMinLength: 35,//  released: false
};
