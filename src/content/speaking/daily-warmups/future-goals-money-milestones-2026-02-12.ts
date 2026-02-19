import type { SpeakingActivityContent } from "@/types/activity";

export const futureGoalsMoneyMilestones_2026_02_12: SpeakingActivityContent = {
  type: "speaking",
  title: "2/12/26: Future Goals & Money Milestones (Future Perfect)",
  description: "Practice using future perfect tense (will have + past participle) to talk about goals, achievements, and predictions by a specific deadline",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "By [time], I will have...", example: "By June, I will have saved $500." },
    { phrase: "By next year, I will have...", example: "By next year, I will have paid off my credit card." },
    { phrase: "By the time..., I will have...", example: "By the time I graduate, I will have finished all my classes." },
    { phrase: "In [time period], I will have...", example: "In six months, I will have moved to a new apartment." },
    { phrase: "Will you have... by...?", example: "Will you have saved enough money by December?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "By the end of this year (December 2026), what will you have achieved with money or housing?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use future perfect: 'By December, I will have saved $1000. I will have paid off my phone bill.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "By next month, what bills will you have paid? What expenses will you have finished?",
      context: "Future perfect: 'By the end of March, I will have paid my rent, my electricity bill, and my internet bill.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Set a 6-month goal. By August 2026, what will you have accomplished with housing or work?",
      context: "Example: 'By August, I will have found a new apartment in Jamaica Plain. I will have saved money for the security deposit and first month's rent.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Think about debt or bills. By the end of the year, what will you have paid off? What won't you have finished yet?",
      context: "Use positive and negative: 'By December, I will have paid off my medical bills. But I won't have finished paying my student loans yet.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "By the time you move to your next apartment, what will you have learned about housing in Boston?",
      context: "Future perfect: 'By the time I move, I will have learned about tenant rights. I will have checked three different neighborhoods.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare past perfect and future perfect: What had you never done before coming to Boston? What will you have accomplished by next year?",
      context: "Past perfect (before): 'I had never rented an apartment before I came here.' Future perfect (by deadline): 'By next year, I will have lived in Boston for 5 years. I will have improved my credit score.'"
    },
  ],// 

  reflectionPrompt: "How comfortable are you using future perfect (will have + past participle) to talk about goals by a specific deadline? Is it easier or harder than past perfect?",// 
  reflectionMinLength: 35,//  released: false
};
