import type { SpeakingActivityContent } from "@/types/activity";

export const wellnessReflectionWhatsChanged_2026_06_04: SpeakingActivityContent = {
  type: "speaking",
  title: "6/4/26: Wellness Reflection (What’s Changed?)",
  description: "Reflect on wellness changes using present perfect and present perfect continuous",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I've started...", example: "I've started drinking more water." },
    { phrase: "I've stopped...", example: "I've stopped eating fast food so often." },
    { phrase: "I've been trying to...", example: "I've been trying to sleep earlier." },
    { phrase: "I've gotten better at...", example: "I've gotten better at managing stress." },
    { phrase: "One thing I still want to improve is...", example: "One thing I still want to improve is exercise." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Talk about 2 changes you have made for your health recently.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: I've started..., I've stopped..."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Ongoing effort: Share one thing you’ve been trying to improve. How long have you been trying?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Use: I've been trying to..., for/since..."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Partner follow-ups: Ask 3 follow-up questions to get details.",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "How often? Why? What helped you? What was hard?"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Advice: Tell your partner one small habit that can help this week.",
      context: "Use: You could try..., It's a good idea to..."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Mini-share: Say one success and one challenge to the class.",
      context: "Use: I'm proud that..., I'm still working on..."
    },
  ],// 

  reflectionPrompt: "What change are you most proud of? What helped you succeed?",// 
  reflectionMinLength: 30,//  released: false
};
