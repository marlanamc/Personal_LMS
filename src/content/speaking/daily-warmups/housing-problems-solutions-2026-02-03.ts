import type { SpeakingActivityContent } from "@/types/activity";

export const housingProblemsSolutions_2026_02_03: SpeakingActivityContent = {
  type: "speaking",
  title: "2/3/26: Housing Problems & Solutions (Type 0 vs Type 1 Conditionals)",
  description: "Use Type 0 conditionals to state housing problems/facts, and Type 1 conditionals to offer solutions and future plans",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "If you don't..., you... (Type 0 - facts)", example: "If you don't pay rent, you get evicted." },
    { phrase: "If I..., I will... (Type 1 - future plans)", example: "If the heat doesn't work, I will call the landlord." },
    { phrase: "When..., ... (Type 0 - general truths)", example: "When landlords ignore problems, tenants call the city." },
    { phrase: "What will happen if...? (Type 1)", example: "What will happen if they don't fix it by Friday?" },
    { phrase: "If this continues, I will... (Type 1)", example: "If this continues, I will report it to inspectional services." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "State a housing problem using Type 0 conditional (general facts). Then say what you will do using Type 1 conditional.",
    soloInstructions: "List your thoughts and examples before speaking",
    partnerInstructions: "Discuss together: Share opinions and examples, ask why you think that",
      context: "Type 0 (fact): 'If the heat doesn't work in winter, it's dangerous.' Type 1 (your plan): 'If my landlord doesn't fix it, I will call the city.' Problems: no heat, leak, bugs, broken window, loud neighbors."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "What are the rules about housing repairs in Massachusetts? Use Type 0 conditionals.",
      context: "Type 0 facts: 'If you have no heat, the landlord must fix it within 24 hours. If the apartment is unsafe, you can withhold rent legally.'"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "You have a broken heater. Explain the problem (Type 0) and your plan (Type 1) if it's not fixed.",
    soloInstructions: "Think through what you'd say and practice key vocabulary from this topic",
    partnerInstructions: "Take turns sharing: One person describes/explains, the other asks follow-up questions",
      context: "Type 0: 'If the temperature drops below 68°F during the day, the landlord violates state law.' Type 1: 'If they don't fix it by tomorrow, I will file a complaint.'"
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "What happens if tenants don't report problems? What will you do if you have a problem?",
      context: "Type 0 (general): 'If you don't report problems in writing, you have no record.' Type 1 (you): 'If I have a leak, I will send an email and take photos.'"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "What will happen if your landlord increases rent too much? What are your options?",
      context: "Type 1 (future plans): 'If my rent increases by more than $200, I will look for a new apartment. If I can't find one, I will get a roommate.'"
    },
    {
      id: "prompt-6",
      level: "advanced",
      text: "Compare Type 0 (housing facts/laws) with Type 1 (your future plan) for the same problem.",
      context: "Example: Type 0: 'If landlords don't fix code violations, the city fines them.' Type 1: 'If my landlord ignores my request, I will call inspectional services and document everything.'"
    },
  ],// 

  reflectionPrompt: "What's the difference between Type 0 (general facts/rules) and Type 1 (your future plans)? Which one is harder to use when talking about housing problems?",// 
  reflectionMinLength: 35,//  released: false
};
