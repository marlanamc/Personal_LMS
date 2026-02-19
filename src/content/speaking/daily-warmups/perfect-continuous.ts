import type { SpeakingActivityContent } from "@/types/activity";

export const perfectContinuousDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Perfect Continuous Tenses Review (use after 3/19)",
  description: "Practice perfect continuous tenses. Focus: duration and ongoing nature of actions.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I have been...", example: "I have been studying English for three years." },
    { phrase: "How long have you been...?", example: "How long have you been living here?" },
    { phrase: "I had been...", example: "I had been working there for five years before I quit." },
    { phrase: "By next year, I will have been...", example: "By next June, I will have been teaching for ten years." },
    { phrase: "I've been trying to...", example: "I've been trying to find a new job for months." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "advanced",
      text: "PRESENT PERFECT CONTINUOUS: What have you been doing to improve your English? How long have you been studying?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Emphasize duration and ongoing action: 'I have been taking classes for six months' or 'I have been practicing every day.'"
    },
    {
      id: "prompt-2",
      level: "advanced",
      text: "PRESENT PERFECT CONTINUOUS: What have you been working on lately? What have you been thinking about?",
      context: "Use for recent continuous activities: 'I have been looking for a new apartment' or 'I have been feeling stressed.'"
    },
    {
      id: "prompt-3",
      level: "advanced",
      text: "PAST PERFECT CONTINUOUS: Tell me about a time you were exhausted. What had you been doing? How long had you been doing it?",
      context: "Show an action that continued before a past event: 'When I got sick, I had been working 60 hours a week for three months.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "PAST PERFECT CONTINUOUS: Describe a moment of realization. What had you been doing wrong? What had you been missing?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Example: 'I realized I had been pronouncing that word incorrectly for years' or 'I had been misunderstanding the instructions.'"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "FUTURE PERFECT CONTINUOUS: By the end of this year, how long will you have been living in the U.S.? Learning English?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Calculate duration into the future: 'By December, I will have been living here for two years and six months.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "FUTURE PERFECT CONTINUOUS: Imagine five years from now. What will you have been doing? What activities will you have been pursuing?",
      context: "Example: 'By 2030, I will have been working in healthcare for fifteen years, and I will have been raising my children.'"
    },
  ],// 

  reflectionPrompt: "Which perfect continuous tense is most challenging? Why? Give an example of when you would use it.",// 
  reflectionMinLength: 50,//  released: false
};
