import type { SpeakingActivityContent } from "@/types/activity";

export const pastPresentHabitsHousing_2026_02_10: SpeakingActivityContent = {
  type: "speaking",
  title: "2/10/26: Budgeting, Bills, Credit & Debt (Past Perfect)",
  description: "Practice using past perfect tense to talk about money timelines: what had happened before a problem or payment",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I had already paid...", example: "I had already paid my rent before I got the late fee notice." },
    { phrase: "Before I checked, I had...", example: "Before I checked my account, I had forgotten about the automatic payment." },
    { phrase: "By the time..., I had...", example: "By the time I got my paycheck, I had already spent too much on my MBTA pass." },
    { phrase: "I had never... before", example: "I had never used a credit card before I came to the U.S." },
    { phrase: "After I had...", example: "After I had paid all my bills, I didn't have enough money for groceries." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Last month timeline: What bills had you paid by the middle of the month? What hadn't you paid yet?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use past perfect: I had paid my rent and my Eversource bill. I hadn't paid my phone bill yet."
    },
    {
      id: "prompt-2",
      level: "intermediate",
      text: "Money mistake story: By the time you realized there was a problem, what had already happened?",
      context: "Example: By the time I checked my Bank of America account, I had already bounced a check. The fee had already been charged."
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Credit history: Before you came to the U.S., what had you known about credit cards or credit scores? What hadn't you learned yet?",
      context: "Use: I had heard about..., but I had never... I hadn't learned about... I hadn't understood..."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Late fee explanation: Explain a time you got a late fee. What had happened? What hadn't you done on time?",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Timeline: Before the due date → What you had/hadn't done → The fee → How you fixed it"
    },
    {
      id: "prompt-5",
      level: "advanced",
      text: "Budget planning timeline: Before last month started, what expenses had you planned for? What unexpected costs came up that you hadn't expected?",
      context: "Example: I had planned to spend $200 on groceries at Market Basket, but I hadn't expected my Xfinity internet bill to increase."
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Payment plan story: Tell about a time you needed a payment plan. What expenses had piled up? What had you tried before calling?",
      context: "Before I called, I had... I had tried to... but it hadn't worked. I had never asked for... before."
    },
  ],// 

  reflectionPrompt: "What's harder: talking about money in English, or using past perfect tense to explain what had happened? Why?",// 
  reflectionMinLength: 35,//  released: false
};
