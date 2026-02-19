import type { SpeakingActivityContent } from "@/types/activity";

export const communityResourcesPitch_2026_06_02: SpeakingActivityContent = {
  type: "speaking",
  title: "6/2/26: Community Resources + Directions (MBTA)",
  description: "Recommend a community resource and practice giving directions / transit steps to get there",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "A good resource is...", example: "A good resource is the community health center." },
    { phrase: "It can help you with...", example: "It can help you with affordable care." },
    { phrase: "You can go to...", example: "You can go to the library for free classes." },
    { phrase: "You should bring...", example: "You should bring an ID and proof of address." },
    { phrase: "I recommend it because...", example: "I recommend it because it's close and helpful." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Think of one helpful place in the community. What is it? Where is it?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Examples: library, school, clinic, food pantry, YMCA, career center."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Give a 45-second pitch: What is it, who is it for, what do you do there, why do you recommend it?",
      context: "Include 1 example and 1 tip."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Directions practice: Explain how to get there from your home (walk/bus/subway).",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: First..., then..., transfer at..., get off at..., it's next to..."
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "MBTA problem-solving: Your partner is confused about the route. Clarify and confirm the steps.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Use: Do you mean...? Let me repeat..., Did you say ___ or ___?"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Partner Q&A: Ask 2 questions about the resource (hours, cost, documents).",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Use: Do you need to...? Is it open on...?"
    },
  ],// 

  reflectionPrompt: "What makes a recommendation convincing (details, examples, clear steps)?",// 
  reflectionMinLength: 30,//  released: false
};
