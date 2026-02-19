import type { SpeakingActivityContent } from "@/types/activity";

export const gerundsInfinitivesDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "Gerunds & Infinitives Review (use after 3/5)",
  description: "Practice gerunds vs infinitives. Focus: when to use gerunds vs infinitives.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I enjoy...", example: "I enjoy reading books and listening to music." },
    { phrase: "I want to...", example: "I want to improve my English speaking skills." },
    { phrase: "I'm thinking about...", example: "I'm thinking about changing jobs." },
    { phrase: "I hope to...", example: "I hope to visit my family next year." },
    { phrase: "I've decided to...", example: "I've decided to take more English classes." },
    { phrase: "I can't help...", example: "I can't help worrying about my test." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "What do you enjoy doing in your free time? What activities do you love doing?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use gerunds after 'enjoy', 'love', 'like': 'I enjoy cooking' or 'I love spending time with family.'"
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "What do you want to achieve this year? What are you planning to do?",
      context: "Use infinitives after 'want', 'plan', 'hope', 'need': 'I want to get a better job' or 'I'm planning to move.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What have you stopped doing recently? What have you started doing? What should you quit doing?",
      context: "Practice: 'I stopped smoking' (quit the habit) vs 'I stopped to smoke' (paused to smoke). 'I started exercising.'"
    },
    {
      id: "prompt-4",
      level: "advanced",
      text: "Complete these sentences: 'I can't stand...', 'I'm considering...', 'I've given up trying to...', 'I refuse to...'",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Gerunds: can't stand, consider, give up. Infinitives: refuse, decide, fail. Mix them in your answers!"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "What's something you remember doing as a child? What's something you'll never forget to do?",
      context: "Tricky! 'Remember doing' = recall the past. 'Remember to do' = don't forget future action. Same with 'forget'!"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Using perfect tenses: What have you been trying to do? What had you wanted to achieve before coming here?",
      context: "Combine perfect tenses with gerunds/infinitives: 'I have been trying to learn English' or 'I had wanted to study abroad.'"
    },
  ],// 

  reflectionPrompt: "Which is harder for you - gerunds or infinitives? Give an example of each.",// 
  reflectionMinLength: 40,//  released: false
};
