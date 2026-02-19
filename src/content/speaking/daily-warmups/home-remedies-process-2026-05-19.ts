import type { SpeakingActivityContent } from "@/types/activity";

export const homeRemediesProcess_2026_05_19: SpeakingActivityContent = {
  type: "speaking",
  title: "5/19/26: Home Remedies (Future Conditional)",
  description: "Practice using Type 1 conditionals (If + present, will + verb) to talk about home remedies and health choices",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "If I have (a cold/fever/headache), I will...", example: "If I have a cold, I will drink tea with honey." },
    { phrase: "If (remedy) doesn't work, I will...", example: "If the tea doesn't work, I will try ginger." },
    { phrase: "If it gets worse, I will...", example: "If it gets worse, I will call the doctor." },
    { phrase: "I will... if...", example: "I will rest if I feel tired." },
    { phrase: "What will you do if...?", example: "What will you do if you get sick?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Use Type 1 conditional: If you have a cold, what will you do? What home remedy will you try?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "If I have a cold, I will drink tea with honey. I will rest. I will take vitamin C."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Use Type 1 conditional: If you have a headache, what will you try first? What will you do if it doesn't help?",
      context: "If I have a headache, I will drink water. If it doesn't help, I will take medicine."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Use 'If it gets worse, I will...': When will you call a doctor? When will you go to urgent care?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "If my fever gets worse, I will call the doctor. If I can't breathe well, I will go to urgent care."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Chain conditionals: If remedy A doesn't work, what will you try? If remedy B doesn't work, then what?",
      context: "If tea doesn't work, I will try ginger. If ginger doesn't work, I will take medicine. If nothing works, I will see a doctor."
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Ask your partner questions using conditionals: 'What will you do if...?'",
      context: "What will you do if you feel sick at work? What will you do if your child has a fever? What will you do if you can't sleep?"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Full conditional conversation: Use Type 1 conditionals to explain your complete plan for different health situations.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'If I get a cold, I will rest at home and drink tea with lemon. If I have a fever over 101°F, I will take medicine. If it doesn't go down, I will call my doctor. If the doctor says to come in, I will make an appointment.'"
    },
  ],// 

  reflectionPrompt: "When talking about health choices, why is Type 1 conditional (If + present, will) useful? Give one example.",// 
  reflectionMinLength: 35,//  released: false
};
