import type { SpeakingActivityContent } from "@/types/activity";

export const moneyHousingPlans_2026_02_05: SpeakingActivityContent = {
  type: "speaking",
  title: "2/5/26: Money Goals & Housing Plans (All Tenses + Conditionals)",
  description: "Practice all tenses and conditionals. Focus: mixing tenses for complete housing and money stories.",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I live... (present simple)", example: "I live in Allston with two roommates." },
    { phrase: "I am saving... (present continuous)", example: "I am saving for a security deposit right now." },
    { phrase: "I have lived... (present perfect)", example: "I have lived in Boston for three years." },
    { phrase: "I lived... (past simple)", example: "I lived in Dorchester when I first arrived." },
    { phrase: "If I save..., I will... (Type 1)", example: "If I save $2000, I will move to Jamaica Plain." },
    { phrase: "If..., I will... (Type 1)", example: "If rent increases, I will find a roommate." },
    { phrase: "If you..., you will... (Type 1)", example: "If you pay on time every month, you will build good credit." },
    { phrase: "I won't... if... (Type 1)", example: "I won't renew my lease if they don't fix the heat." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Tell your housing story using past, present, and future tenses. Where did you live before? Where do you live now? Where will you live next?",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Past simple: 'I lived in...' Present simple: 'I live in...' Future simple: 'I will move to...'"
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What are you doing right now to improve your housing or money situation? Use present continuous.",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Present continuous: 'I am looking for a cheaper apartment. I am saving $100 each month. I am learning about credit scores.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "What is one housing fact (Type 0) and one personal goal (Type 1) you have?",
      context: "Type 0 fact: 'If you have bad credit, landlords reject your application.' Type 1 goal: 'If I improve my credit score, I will rent a better apartment.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "How long have you lived in your current apartment? How long have you been looking for a new place (if applicable)? Use present perfect.",
      context: "Present perfect: 'I have lived here for six months. I have been looking for a new apartment since December.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Tell a complete housing journey story using at least 4 different tenses + 1 conditional.",
      context: "Example: 'I lived in Revere when I arrived (past simple). I have been in Allston for two years (present perfect). I am currently saving money (present continuous). If I save $3000, I will buy a car (Type 1). Then I will move to a suburb (future simple).'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "What advice would you give to a new immigrant about housing and money in Boston? Use all tenses and both conditional types.",
      context: "Mix everything: 'If you don't speak English well, you struggle to find housing (Type 0). I lived in three different apartments before I found this one (past simple). I have learned a lot about tenant rights (present perfect). If you save money every month, you will have options (Type 1).'"
    },
  ],// 

  reflectionPrompt: "Which tense is hardest for you to use when talking about housing: past, present, or future? Which conditional type (Type 0 or Type 1) feels more natural? Why?",// 
  reflectionMinLength: 40,//  released: false
};
