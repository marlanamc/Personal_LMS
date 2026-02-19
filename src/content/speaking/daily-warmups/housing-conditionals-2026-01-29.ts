import type { SpeakingActivityContent } from "@/types/activity";

export const housingConditionals_2026_01_29: SpeakingActivityContent = {
  type: "speaking",
  title: "1/29/26: Housing Conditionals (Type 1)",
  description: "Practice Type 1 conditionals. Focus: If + present, will + verb for future plans.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "If I..., I will...", example: "If I save $500, I will move to a bigger apartment." },
    { phrase: "If..., I will...", example: "If rent increases, I will find a roommate." },
    { phrase: "What will you do if...?", example: "What will you do if your landlord raises the rent?" },
    { phrase: "If you..., you will...", example: "If you pay on time every month, you will build good credit." },
    { phrase: "I won't... if...", example: "I won't renew my lease if they don't fix the heat." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "What will you do if your rent increases next year? What are your options?",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Use Type 1 conditionals to talk about future plans. Example: 'If my rent increases, I will look for a cheaper apartment. If I can't find one, I will get a roommate.'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "If you get a raise at work, what will you change about your housing situation?",
      context: "Talk about future possibilities. 'If I get a raise, I will move to a nicer neighborhood. I will look for a place with parking.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What will happen if your landlord doesn't fix a problem in your apartment? What steps will you take?",
      context: "Explain your future plan using Type 1 conditionals. 'If my landlord doesn't fix the heat, I will call the city. If they don't respond, I will withhold rent legally.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "If you save $1000 in the next 6 months, what will you do with that money for housing?",
      context: "Share your housing goals. 'If I save $1000, I will use it for a security deposit. I will move to a better apartment in Jamaica Plain.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What will you do if you lose your job? How will you handle rent and bills?",
      context: "Discuss future plans for emergencies. 'If I lose my job, I will apply for unemployment. I will talk to my landlord about a payment plan.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "If you could change one thing about housing in Boston, what would it be? What will happen if nothing changes?",
      context: "Use Type 1 conditionals to predict consequences. 'If rents keep increasing, people will leave Boston. If the city doesn't build more affordable housing, families will struggle.'"
    },
  ],// 

  reflectionPrompt: "How comfortable are you using Type 1 conditionals (If + present, will + verb) to talk about future housing plans? What's the difference between Type 0 (facts) and Type 1 (future predictions)?",// 
  reflectionMinLength: 35,//  released: false
};
