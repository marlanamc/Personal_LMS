import type { SpeakingActivityContent } from "@/types/activity";

export const tenantLandlordPhoneCall_2026_01_22: SpeakingActivityContent = {
  type: "speaking",
  title: "1/22/26: Tenant ↔ Landlord Phone Call",
  description: "Practice calling a landlord about a problem, requesting repairs, and confirming details",

  // NEW: Enable simple warmup mode
  warmupMode: true,
  participationPoints: 3,

  // NEW: Enable simple warmup mode

  keyPhrases: [
    { phrase: "I'm calling about...", example: "I'm calling about a leak in my bathroom." },
    { phrase: "The problem started...", example: "The problem started yesterday." },
    { phrase: "Could you please send someone to...?", example: "Could you please send someone to fix it?" },
    { phrase: "When can you come?", example: "When can you come to check it?" },
    { phrase: "Let me confirm...", example: "Let me confirm: Friday at 10am, right?" },
    { phrase: "My address is...", example: "My address is 12 Main Street, Apartment 3B." },
  ],

  // LEGACY: Kept for backward compatibility
  //

  // LEGACY: Kept for backward compatibility
  //

  prompts: [
    {
      id: "prompt-1",
      level: "beginner",
      text: "Role-play: You are the tenant. Call your landlord about a problem (heat, water, noise, bugs, broken stove).",
    soloInstructions: "Read the scenario and think about what you would say in this situation",
    partnerInstructions: "Role-play the scenario: Take turns being different characters",
      context: "Include: problem, when it started, how urgent it is."
    },
    {
      id: "prompt-2",
      level: "beginner",
      text: "Role-play: You are the landlord. Ask questions and propose a time to visit.",
      context: "Ask: What happened? When did it start? Is it dangerous? What is your address?"
    },
    {
      id: "prompt-3",
      level: "intermediate",
      text: "Add a follow-up: The landlord didn’t fix the problem. Call again and be polite but firm.",
    soloInstructions: "Practice saying this prompt aloud and think about your answer",
    partnerInstructions: "Partner A: Ask the question. Partner B: Answer completely, then switch roles",
      context: "Use: I'm following up..., It still isn't working..., I need this fixed as soon as possible."
    },
    {
      id: "prompt-4",
      level: "intermediate",
      text: "Confirm details: Practice spelling your name, giving your address, and repeating the appointment time.",
      context: "Use clarification: Could you repeat that? How do you spell that? Did you say Tuesday or Thursday?"
    },
    {
      id: "prompt-5",
      level: "intermediate",
      text: "Formal vs informal: Say the same message in a casual way and a formal way.",
      context: "Compare: 'Hey, my heater is broken' vs 'Hello, I'm calling to report that my heater is not working.'"
    },
  ],// 

  reflectionPrompt: "Which part of the phone call is hardest for you (explaining, asking questions, confirming)? Why?",// 
  reflectionMinLength: 30,//  released: false
};
