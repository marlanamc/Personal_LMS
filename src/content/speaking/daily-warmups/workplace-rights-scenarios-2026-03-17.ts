import type { SpeakingActivityContent } from "@/types/activity";

export const workplaceRightsScenarios_2026_03_17: SpeakingActivityContent = {
  type: "speaking",
  title: "3/17/26: Workplace Rights Scenarios (Present Perfect Continuous)",
  description: "Practice discussing workplace rights using present perfect continuous to explain ongoing problems and how long they've been happening",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I have been experiencing...", example: "I have been experiencing problems with my schedule." },
    { phrase: "This has been happening...", example: "This has been happening for three weeks." },
    { phrase: "How long have you been...?", example: "How long have you been working without breaks?" },
    { phrase: "I have been trying to...", example: "I have been trying to talk to my manager about this." },
    { phrase: "We have been waiting for...", example: "We have been waiting for a response since last month." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "intermediate",
      text: "Describe a workplace problem using present perfect continuous. How long has this been happening?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Use: I have been experiencing... This has been happening for... I have been working without breaks for two months."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Workplace rights scenario: You haven't been getting breaks. Explain the problem using present perfect continuous and ask for a solution.",
      context: "I have been working 8-hour shifts without breaks for three weeks. This has been very difficult. I have been feeling exhausted."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Ask your manager: How long has this policy been in place? How long have other workers been dealing with this?",
    soloInstructions: "Write down 3-4 questions you want to ask about this topic",
    partnerInstructions: "Take turns asking and answering questions on this topic",
      context: "Use questions: How long have you been aware of this? How long has the company been doing this?"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Explain your efforts: What have you been doing to try to fix this problem? Who have you been talking to?",
      context: "I have been documenting every incident. I have been talking to my coworkers. I have been trying to speak with my supervisor."
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Compare past simple and present perfect continuous: What happened vs. What has been happening?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Past simple: My boss yelled at me yesterday. Present perfect continuous: My boss has been yelling at me for months."
    },
  ],// 

  reflectionPrompt: "When discussing workplace problems, how does present perfect continuous help you explain ongoing issues? How is it different from past simple?",// 
  reflectionMinLength: 35,//  released: false
};
