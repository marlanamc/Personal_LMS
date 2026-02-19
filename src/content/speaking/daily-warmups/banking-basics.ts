import type { SpeakingActivityContent } from "@/types/activity";

export const bankingBasicsDailyWarmup: SpeakingActivityContent = {
  type: "speaking",
  title: "1/27/26: Banking & Shopping (Type 0 Conditionals)",
  description: "Use Type 0 conditionals to explain banking facts and rules. Focus: If + present, present for facts and rules.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "If you..., you...", example: "If you pay late, you get a fee." },
    { phrase: "If I don't..., I...", example: "If I don't have cash, I use my debit card." },
    { phrase: "When you..., you...", example: "When you overdraw your account, you pay a $35 fee." },
    { phrase: "If they..., they...", example: "If they charge too much, they lose customers." },
    { phrase: "What happens if...?", example: "What happens if I forget my PIN?" },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What happens if you pay a bill late? What happens if you pay on time?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use Type 0 conditionals to explain the facts. Example: 'If you pay late, you get a fee. If you pay on time, you save money.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What do you do if you don't have cash? What payment methods do you use?",
      context: "Use Type 0 conditionals. Example: 'If I don't have cash, I use my debit card. If the store doesn't take cards, I go to an ATM.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What are the rules at your bank? What happens if you overdraw your account? What happens if you keep a minimum balance?",
      context: "Explain banking rules using Type 0 conditionals. 'If you overdraw, you pay a $35 fee. If you keep $500 in your account, you don't pay monthly fees.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What are your spending habits? What do you do if you spend too much in one week?",
      context: "Use Type 0 conditionals to explain your habits. 'If I spend too much on groceries, I skip going out to eat. If I run out of money, I use my credit card.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What happens if you lose your debit card? What steps do you take?",
      context: "Explain the process using Type 0 conditionals. 'If I lose my card, I call the bank immediately. If they cancel it, they send me a new one in 7-10 days.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "What general truths do you know about money and banking in the U.S.? What surprises people from other countries?",
      context: "Share facts using Type 0 conditionals. 'If you write a check without money in your account, it bounces. If you pay credit cards in full, you don't pay interest.'"
    },
  ],// 

  reflectionPrompt: "How comfortable are you using Type 0 conditionals (If + present, present) to explain banking facts and habits? What was challenging?",// 
  reflectionMinLength: 30,//  released: false
};
